/* Nandana Vanam — the page's script. The door, the scroll-ins, the song, the bell and the petals behave as in the
   approved design; added for this invitation: the countdown in the event's own timezone, the RSVP and the Save the
   Date link. Everything about the client comes from ../config.js. */
import { invite as C } from '../config.js?v=7';

const $ = (id) => document.getElementById(id);
const app = $('app'), scroller = $('scroller'), doorScene = $('doorScene'), musicBtn = $('musicBtn');
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
let opened = false;

/* ---------------- door sequence ---------------- */
function openDoor() {
  if (opened) return;
  opened = true;
  startMusic();                    // first thing in the tap: the song and the doors begin together
  app.classList.add('open');
  setTimeout(() => app.classList.add('fading'), 2300);
  setTimeout(() => { app.classList.add('gone'); checkReveals(); }, 3400);
}
doorScene.addEventListener('click', openDoor);
doorScene.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDoor(); } });

/* ---------------- scroll reveals ---------------- */
const revealed = {};
function checkReveals() {
  const vh = window.innerHeight;
  for (const el of document.querySelectorAll('[data-reveal]')) {
    const id = el.getAttribute('data-reveal');
    if (revealed[id]) continue;
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.88 && r.bottom > 0) { revealed[id] = true; el.style.animation = 'riseUp 1s ease forwards'; }
  }
}
scroller.addEventListener('scroll', checkReveals, { passive: true });
/* "SCROLL TO EXPLORE" shows once the doors have opened (CSS, on #app.gone) and leaves for good at the first scroll */
const scrollCue = $('scrollCue');
let cueGone = !scrollCue;
function hideCue() { if (!cueGone && scroller.scrollTop > 24) { cueGone = true; scrollCue.classList.add('is-hidden'); } }
scroller.addEventListener('scroll', hideCue, { passive: true });
window.addEventListener('resize', checkReveals);
/* a safety net: should a browser ever swallow a scroll event, nothing on screen stays invisible for long */
setInterval(() => { if (opened) { checkReveals(); hideCue(); } }, 600);

/* ---------------- background song (Web Audio) ----------------
   The song starts WITH the door tap, not after the doors have opened (client, 2026-11-12). To make that possible the
   file is fetched while the guest is still looking at the closed door, so the tap only has to switch the sound on
   (browsers allow sound from a tap, never before), decode the file already in hand and play: a short half-second
   swell instead of the old slow fade. One source only: a second tap can never start a second copy. If the file or
   the sound system fails, the door still opens and the music button shows "off"; tapping it tries once more. */
let ctx = null, master = null, muted = false, musicState = 'idle';      // idle → starting → playing | failed
const songFile = fetch('assets/music.mp3').then((r) => { if (!r.ok) throw new Error('music ' + r.status); return r.arrayBuffer(); });
songFile.catch(() => {});                                               // a failed download is dealt with at the tap
function ensureCtx() {
  if (ctx) return true;
  try { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false; ctx = new AC(); } catch (e) { return false; }
  master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
  return true;
}
function showMusic() {
  const off = muted || musicState === 'failed';
  musicBtn.classList.toggle('muted', off);
  musicBtn.setAttribute('aria-pressed', String(!off));
  musicBtn.setAttribute('aria-label', off ? 'Music is off: tap to play' : 'Music is on: tap to mute');
}
function startMusic() {
  if (musicState === 'starting' || musicState === 'playing') return;    // never two at once
  if (!ensureCtx()) { musicState = 'failed'; showMusic(); return; }
  musicState = 'starting';
  try { const p = ctx.resume(); if (p && p.catch) p.catch(() => {}); } catch (e) {}   // inside the tap itself
  songFile.then((data) => new Promise((res, rej) => { try { const p = ctx.decodeAudioData(data.slice(0), res, rej); if (p && p.catch) p.catch(rej); } catch (e) { rej(e); } }))
    .then((buffer) => {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.85, ctx.currentTime + 0.5);
      g.connect(master);
      const src = ctx.createBufferSource();
      src.buffer = buffer; src.loop = true;
      if (buffer.duration > 1) { src.loopStart = 0.04; src.loopEnd = buffer.duration - 0.06; }
      src.connect(g); src.start();
      musicState = 'playing'; showMusic();
    }).catch(() => { musicState = 'failed'; showMusic(); });
}
document.addEventListener('pointerdown', () => { if (ctx && !muted && ctx.state === 'suspended') ctx.resume(); }, true);
musicBtn.addEventListener('click', () => {
  if (musicState === 'failed' || musicState === 'idle') { muted = false; startMusic(); return; }
  muted = !muted;
  if (muted) ctx.suspend(); else ctx.resume();
  showMusic();
});

/* ---------------- the event's moment, in the event's own timezone ----------------
   The wall-clock time in config (date + first event's time, in config.timeZone) is turned into one absolute instant:
   Intl gives that zone's offset at that moment, daylight saving included, whatever the visitor's own timezone is.
   A browser without timezone data falls back to config.utcOffsetFallback. */
function zonedInstant(date, time, tz, fallback) {
  const [y, mo, d] = date.split('-').map(Number), [h, mi] = time.split(':').map(Number);
  const wall = Date.UTC(y, mo - 1, d, h, mi, 0);
  try {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const asWall = (t) => { const p = {}; for (const x of f.formatToParts(new Date(t))) p[x.type] = Number(x.value); return Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second); };
    let t = wall;
    for (let i = 0; i < 3; i++) t = wall - (asWall(t) - t);
    if (isFinite(t) && asWall(t) === wall) return t;
  } catch (e) {}
  const m = /^([+-])(\d\d):(\d\d)$/.exec(fallback);
  return wall - (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) * 60000;
}
const START = zonedInstant(C.date, C.events[0].time, C.timeZone, C.utcOffsetFallback);

/* ---------------- countdown ---------------- */
const pad2 = (n) => (n < 10 ? '0' : '') + n;
let cdTimer = 0;
function tickCountdown() {
  const left = START - Date.now(), box = $('countdown');
  if (!box) return;
  if (left <= 0) {
    box.classList.remove('cd-boxes');
    box.innerHTML = '<div class="cd-done">✦ &nbsp;The auspicious day is here&nbsp; ✦</div>';
    clearInterval(cdTimer);
    return;
  }
  const s = Math.floor(left / 1000);
  $('cdD').textContent = pad2(Math.floor(s / 86400));
  $('cdH').textContent = pad2(Math.floor((s % 86400) / 3600));
  $('cdM').textContent = pad2(Math.floor((s % 3600) / 60));
  $('cdS').textContent = pad2(s % 60);
}
tickCountdown();
cdTimer = setInterval(tickCountdown, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) tickCountdown(); });

/* ---------------- tap the small bell to ring it ---------------- */
const ringBell = $('ringBell');
function chime() {
  if (!ensureCtx() || muted) return;
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime + 0.02;
  [0, 0.45].forEach((dt, k) => {
    [1, 2.74, 5.43, 8.1].forEach((part, i) => {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.value = 1056 * part * (1 + (Math.random() * 2 - 1) * 0.002);
      const g = ctx.createGain();
      g.gain.setValueAtTime((k === 0 ? 0.05 : 0.03) / (i + 1), t + dt);
      g.gain.setTargetAtTime(0.0001, t + dt + 0.012, 1.3 - i * 0.25);
      o.connect(g); g.connect(master); o.start(t + dt); o.stop(t + dt + 6);
    });
  });
}
function ring() {
  if (ringBell.classList.contains('ringing')) return;
  ringBell.classList.add('ringing');
  setTimeout(() => ringBell.classList.remove('ringing'), 1900);
  chime();
}
ringBell.addEventListener('click', ring);
ringBell.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ring(); } });

/* ---------------- drifting lotus petals over the content ---------------- */
const contentCol = $('contentCol');
let petalCount = 0;
setInterval(() => {
  if (reduceMotion || document.hidden || !opened || petalCount >= 4) return;
  const colTop = contentCol.offsetTop, vh = window.innerHeight, viewTop = scroller.scrollTop;
  if (viewTop + vh < colTop + 100) return;
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.top = (Math.max(viewTop - colTop, -20) - 24) + 'px';
  p.style.left = (8 + Math.random() * 64) + '%';
  p.style.setProperty('--fall', (vh * (0.45 + Math.random() * 0.3)) + 'px');
  p.style.setProperty('--dx', ((Math.random() * 2 - 1) * 40) + 'px');
  p.style.setProperty('--dur', (8 + Math.random() * 5) + 's');
  const leaf = document.createElement('i');
  leaf.style.setProperty('--spin', (4 + Math.random() * 4) + 's');
  leaf.style.setProperty('--r0', Math.floor(Math.random() * 360) + 'deg');
  p.appendChild(leaf); contentCol.appendChild(p); petalCount++;
  setTimeout(() => { p.remove(); petalCount--; }, 14000);
}, 3200);

/* ---------------- Save the Date (only on the page once the end time is confirmed in config) ---------------- */
(function calendar() {
  /* The button is an ordinary link to Google Calendar's event-creation screen (its address is written into the page
     by the tool), opened by the guest's own tap in a new tab — nothing is downloaded. After the tap a quiet line
     offers the calendar file, for a guest whose phone could not open Google Calendar. */
  const btn = $('saveDate'), status = $('saveStatus');
  if (!btn || !status) return;
  /* the link goes through Google's sign-in address so a signed-out guest still reaches the event; on Android the
     direct address is used instead, which the Google Calendar app can open itself */
  if (/Android/i.test(navigator.userAgent) && btn.dataset.direct) btn.href = btn.dataset.direct;
  btn.addEventListener('click', () => {
    setTimeout(() => {
      status.className = 'save-status ok';
      status.innerHTML = 'Google Calendar is opening with the details filled in. Not opening? <a href="event.ics">Use the calendar file instead</a>.';
    }, 600);
  });
})();

/* ---------------- RSVP ----------------
   A name and a contact number (both required), a guest counter and two buttons. Tapping "I'LL BE THERE" or "UNABLE TO ATTEND" does two things:
   · the reply is recorded by rsvp.php (the hosts' list), and
   · it goes to the hosts' email address (config.rsvp.email). The host's server cannot send mail (config.rsvp.serverEmail
     is false), so the guest's own email app is opened with the reply written out, inside the tap itself, and the guest
     presses Send. The page says exactly that — never that an email "was sent".
   If rsvp.php ever does send the email itself (serverEmail true and the server confirms it), the email app is not opened.
   Nothing is kept in the browser: every fresh opening or reload shows the empty form (client, 2026-11-12). */
(function rsvp() {
  const form = $('rsvp');
  if (!form) return;
  const status = $('rsvpStatus'), name = $('rName'), err = $('eName'), phone = $('rPhone'), perr = $('ePhone');
  const count = $('gCount'), minus = $('gMinus'), plus = $('gPlus'), btns = [$('rYes'), $('rNo')];
  const MIN = 1, MAX = C.rsvp.maxGuests;
  let guests = Math.min(MAX, Math.max(MIN, C.rsvp.defaultGuests || 2)), busy = false, sent = false;
  form.reset();                                            // a browser must not bring back what was typed before a reload
  const escH = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const say = (cls, html) => { status.className = 'rsvp-status ' + cls; status.innerHTML = html; };
  const nameErr = (msg) => { err.textContent = msg || ''; err.hidden = !msg; name.setAttribute('aria-invalid', msg ? 'true' : 'false'); };
  const phoneErr = (msg) => { perr.textContent = msg || ''; perr.hidden = !msg; phone.setAttribute('aria-invalid', msg ? 'true' : 'false'); };
  /* a contact number from any country: digits with an optional leading +, spaces, hyphens, dots and brackets allowed,
     7 to 15 digits in all (the international limit) — nothing stricter, so no real number is turned away */
  const phoneProblem = (p) => !p ? 'Please enter your contact number.'
    : !/^\+?[0-9\s().-]+$/.test(p) ? 'Please use digits only (a leading + for the country code is fine).'
    : (p.replace(/\D/g, '').length < 7 || p.replace(/\D/g, '').length > 15) ? 'Please enter a complete contact number.' : '';

  function showCount() {
    count.textContent = String(guests);
    minus.disabled = busy || guests <= MIN; plus.disabled = busy || guests >= MAX;
  }
  minus.addEventListener('click', () => { if (!busy && guests > MIN) { guests--; showCount(); } });
  plus.addEventListener('click', () => { if (!busy && guests < MAX) { guests++; showCount(); } });
  showCount();
  name.addEventListener('input', () => nameErr(''));
  phone.addEventListener('input', () => phoneErr(''));
  form.addEventListener('submit', (e) => e.preventDefault());           // Enter in the name box does not send by itself

  /* the reply as an email to the hosts: recipient, subject and body all filled in (CRLF line ends, as mail apps expect) */
  function mailto(v) {
    const body = ['Guest Name: ' + v.name, '', 'Contact Number: ' + v.phone, '', 'Attendance: ' + (v.attending === 'yes' ? 'Attending' : 'Unable to Attend')]
      .concat(v.attending === 'yes' ? ['', 'Number of Guests: ' + v.guests] : []).join('\r\n');
    return 'mailto:' + C.rsvp.email + '?subject=' + encodeURIComponent(C.rsvp.subject) + '&body=' + encodeURIComponent(body);
  }
  function lock(on, chosen) {
    busy = on;
    for (const b of btns) { b.disabled = on; b.classList.toggle('is-selected', on && b === chosen); b.setAttribute('aria-pressed', String(on && b === chosen)); }
    name.readOnly = on; phone.readOnly = on; showCount();
  }

  async function send(btn) {
    if (busy || sent) return;
    const v = { name: name.value.trim().replace(/\s+/g, ' '), phone: phone.value.trim().replace(/\s+/g, ' '), attending: btn.dataset.attending, guests: 0 };
    const badName = v.name.length < 2 ? 'Please enter your full name.' : '', badPhone = phoneProblem(v.phone);
    nameErr(badName); phoneErr(badPhone);
    if (badName || badPhone) {                             // both are required: nothing is sent, nothing opens
      say('bad', badName && badPhone ? 'Please enter your full name and contact number.' : badName || badPhone);
      (badName ? name : phone).focus();
      return;
    }
    if (v.attending === 'yes') v.guests = guests;
    const label = btn.textContent, mail = mailto(v);
    /* the server cannot email: open the guest's email app now, while this is still the tap itself */
    if (!C.rsvp.serverEmail) window.location.href = mail;
    lock(true, btn); btn.textContent = 'SENDING…';
    say('', '');
    let ok = false, why = '', mailed = false;
    try {
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 15000);
      const res = await fetch(C.rsvp.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal,
        body: JSON.stringify({ ...v, email: '', message: '', website: form.elements.website.value }) });
      clearTimeout(timer);
      const body = await res.json().catch(() => null);
      ok = res.ok && body && body.ok === true;
      mailed = !!(ok && body.mailed === true);
      if (!ok && body && body.error) why = body.error;
    } catch (e) { ok = false; }
    btn.textContent = label;
    const again = `<br><a class="again" href="${escH(mail)}">EMAIL NOT OPEN? TAP HERE</a>`;
    const what = v.attending === 'yes' ? `attending, ${v.guests} ${v.guests === 1 ? 'guest' : 'guests'}` : 'unable to attend';
    if (ok && mailed) {                                    // the server itself emailed the hosts
      sent = true; busy = false; form.classList.add('is-sent');
      say('ok', `<b>THANK YOU</b>${escH(v.name)}, your reply (${what}) has been sent to the hosts.`);
    } else if (ok) {                                       // recorded; the email is in the guest's own email app
      sent = true; busy = false; form.classList.add('is-sent');
      say('ok', `<b>THANK YOU</b>${escH(v.name)}, your reply (${what}) has been recorded.<br>An email to the hosts should now be open in your email app: please press <u>Send</u> there.` + again);
    } else if (!C.rsvp.serverEmail) {                      // not recorded, but the email is still ready to send
      lock(false);
      say('bad', `Your reply could not be recorded here${why ? ' (' + escH(why) + ')' : ''}. An email to the hosts should now be open in your email app: please press <u>Send</u> there, or tap a button to try again.` + again);
    } else {
      lock(false);
      say('bad', `Sorry, your reply could not be sent${why ? ' (' + escH(why) + ')' : ''}. Please tap again, or send it by email:` + again);
    }
  }
  for (const b of btns) b.addEventListener('click', () => send(b));
})();

/* ---------------- every opening is a fresh one ----------------
   A page restored whole from the back/forward cache would still show the thank-you: reload it.
   The two keys an earlier version of this page kept are removed. */
window.addEventListener('pageshow', (e) => { if (e.persisted) window.location.reload(); });
try { localStorage.removeItem('nv-date-revealed'); localStorage.removeItem('nv-rsvp-sent'); } catch (e) {}

/* ---------------- discourage casual copying of the artwork (as in the approved design) ---------------- */
document.addEventListener('contextmenu', (e) => { if (!e.target.closest('input, textarea')) e.preventDefault(); });
document.addEventListener('dragstart', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) e.preventDefault(); });
