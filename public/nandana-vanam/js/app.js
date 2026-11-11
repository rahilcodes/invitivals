/* Nandana Vanam — the page's script. The door, the scroll-ins, the song, the bell and the petals behave as in the
   approved design; added for this invitation: the scratch card, the countdown in the event's own timezone, the RSVP
   form and the Save the Date links. Everything about the client comes from ../config.js. */
import { invite as C } from '../config.js?v=2';

const $ = (id) => document.getElementById(id);
const app = $('app'), scroller = $('scroller'), doorScene = $('doorScene'), musicBtn = $('musicBtn');
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
let opened = false;

/* ---------------- door sequence ---------------- */
function openDoor() {
  if (opened) return;
  opened = true;
  app.classList.add('open');
  startMusic();
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
window.addEventListener('resize', checkReveals);
/* a safety net: should a browser ever swallow a scroll event, nothing on screen stays invisible for long */
setInterval(() => { if (opened) checkReveals(); }, 600);

/* ---------------- background song (Web Audio), started by the door tap ---------------- */
let ctx = null, master = null, muted = false, musicStarted = false;
function ensureCtx() {
  if (ctx) return true;
  try { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false; ctx = new AC(); } catch (e) { return false; }
  master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
  return true;
}
function startMusic() {
  if (musicStarted || !ensureCtx()) return;
  musicStarted = true;
  if (ctx.state === 'suspended') ctx.resume();
  fetch('assets/music.mp3').then((r) => { if (!r.ok) throw new Error('music'); return r.arrayBuffer(); })
    .then((data) => new Promise((res, rej) => ctx.decodeAudioData(data, res, rej)))
    .then((buffer) => {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.85, ctx.currentTime + 3.5);
      g.connect(master);
      const src = ctx.createBufferSource();
      src.buffer = buffer; src.loop = true;
      if (buffer.duration > 1) { src.loopStart = 0.04; src.loopEnd = buffer.duration - 0.06; }
      src.connect(g); src.start(ctx.currentTime + 0.1);
    }).catch(() => {});
}
document.addEventListener('pointerdown', () => { if (ctx && !muted && ctx.state === 'suspended') ctx.resume(); }, true);
musicBtn.addEventListener('click', () => {
  if (!ctx) return;
  muted = !muted;
  musicBtn.classList.toggle('muted', muted);
  musicBtn.setAttribute('aria-pressed', String(muted));
  if (muted) ctx.suspend(); else ctx.resume();
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

/* ---------------- scratch card ----------------
   A gold foil on a canvas over the date. Rubbing (finger, pen or mouse) clears it; past 45% it lifts by itself.
   Only the foil takes the finger (touch-action: none on the canvas), so the page scrolls normally everywhere else.
   "Tap to Reveal" and the keyboard do the same without scratching. Once revealed it stays revealed. */
(function scratch() {
  const card = $('scard'), foil = $('foil'), hint = $('scardHint'), btn = $('scardBtn'), live = $('scardLive'), face = $('scardFace');
  if (!card || !foil) return;
  const KEY = 'nv-date-revealed';
  let done = false, g = null, W = 0, H = 0;
  const said = `${C.scratch.weekday}, ${C.scratch.day} ${C.scratch.month} ${C.scratch.year}`;
  function reveal(save) {
    if (done) return;
    done = true;
    card.classList.add('is-revealed');
    face.removeAttribute('aria-hidden');
    hint.hidden = true;
    btn.hidden = true;
    live.textContent = 'The date is ' + said + '.';
    if (save) try { localStorage.setItem(KEY, '1'); } catch (e) {}
  }
  btn.addEventListener('click', () => reveal(true));
  let was = false;
  try { was = localStorage.getItem(KEY) === '1'; } catch (e) {}
  g = foil.getContext && foil.getContext('2d', { willReadFrequently: true });
  if (was || !g) { reveal(false); return; }

  function paint() {
    const r = foil.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!r.width) return false;
    W = foil.width = Math.round(r.width * dpr); H = foil.height = Math.round(r.height * dpr);
    const grad = g.createLinearGradient(0, 0, W, H);
    [[0, '#b8842e'], [.22, '#e9c46a'], [.42, '#fff3c4'], [.58, '#f3d98b'], [.8, '#c9973f'], [1, '#e9c46a']].forEach(([p, c]) => grad.addColorStop(p, c));
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = grad; g.fillRect(0, 0, W, H);
    g.globalAlpha = .1;                                   // a fine grain, so the foil reads as metal
    for (let i = 0; i < 900; i++) { g.fillStyle = i % 2 ? '#fff' : '#6b4a12'; g.fillRect(Math.random() * W, Math.random() * H, 1.2 * dpr, 1.2 * dpr); }
    g.globalAlpha = 1;
    g.strokeStyle = 'rgba(122,74,18,.55)'; g.lineWidth = 1.2 * dpr;
    const m = W * .055; g.strokeRect(m, m, W - 2 * m, H - 2 * m);
    g.fillStyle = '#6b3f10'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `700 ${Math.round(W * .082)}px "Cormorant Garamond", Georgia, serif`;
    g.fillText('S C R A T C H', W / 2, H * .43);
    g.font = `600 ${Math.round(W * .06)}px "Cormorant Garamond", Georgia, serif`;
    g.fillText('T O   R E V E A L', W / 2, H * .56);
    g.font = `${Math.round(W * .07)}px serif`; g.fillText('✦', W / 2, H * .28); g.fillText('✦', W / 2, H * .71);
    return true;
  }
  let painted = false;
  const tryPaint = () => { if (!painted && !done) painted = paint(); };
  tryPaint();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!done && !scratched) painted = paint(); });
  window.addEventListener('resize', () => { if (!done && !scratched) painted = paint(); });
  scroller.addEventListener('scroll', tryPaint, { passive: true });

  let down = false, last = null, scratched = false, moves = 0;
  const at = (e) => { const r = foil.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; };
  function rub(p) {
    g.globalCompositeOperation = 'destination-out';
    g.globalAlpha = 1; g.strokeStyle = '#000';            // fully opaque, so each stroke clears the foil completely
    g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = W * .15;
    g.beginPath(); g.moveTo((last || p).x, (last || p).y); g.lineTo(p.x + .01, p.y + .01); g.stroke();
    last = p; scratched = true;
    if (++moves % 6 === 0) measure();
  }
  function measure() {
    try {
      const step = 8, d = g.getImageData(0, 0, W, H).data; let clear = 0, n = 0;
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) { n++; if (d[(y * W + x) * 4 + 3] < 40) clear++; }
      if (clear / n > .45) reveal(true);
    } catch (e) { if (moves > 60) reveal(true); }
  }
  foil.addEventListener('pointerdown', (e) => { if (done) return; tryPaint(); down = true; last = null; try { foil.setPointerCapture(e.pointerId); } catch (x) {} rub(at(e)); e.preventDefault(); });
  foil.addEventListener('pointermove', (e) => { if (down && !done) { rub(at(e)); e.preventDefault(); } });
  const up = () => { if (down) { down = false; last = null; if (!done) measure(); } };
  foil.addEventListener('pointerup', up); foil.addEventListener('pointercancel', up); foil.addEventListener('lostpointercapture', up);
})();

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
  const btn = $('saveDate'), status = $('saveStatus');
  if (!btn) return;
  const stamp = (t) => new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  /* no end time is confirmed: the Google link (used only if the file cannot be had) then carries the start alone */
  const end = C.calendar.endTime ? zonedInstant(C.date, C.calendar.endTime, C.timeZone, C.utcOffsetFallback) : START;
  const details = `Hosts: ${C.calendar.hosts}\n\n${C.events.map((e) => `${e.name} — ${e.label}`).join('\n')}\n\nMap: ${C.venue.mapsUrl}`;
  const gcal = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: C.calendar.title, dates: stamp(START) + '/' + stamp(end), ctz: C.timeZone, location: C.calendar.location, details }).toString();
  /* The tap: make sure the calendar file is really there, then hand it over. iPhones and iPads open a .ics link
     straight in Calendar ("Add to Calendar"); everywhere else it is saved as a file that the calendar app opens.
     If the file cannot be fetched, say so and offer Google Calendar instead — never a silent nothing. */
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  let busy = false;
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (busy) return;
    busy = true; status.className = 'save-status'; status.textContent = '';
    try {
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 12000);
      const res = await fetch(btn.getAttribute('href'), { cache: 'no-store', signal: ctl.signal });
      clearTimeout(timer);
      const text = res.ok ? await res.text() : '';
      if (!/^BEGIN:VCALENDAR/.test(text) || !/BEGIN:VEVENT/.test(text)) throw new Error('not a calendar file');
      if (isIOS) { window.location.href = btn.href; }
      else {
        const url = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }));
        const a = document.createElement('a');
        a.href = url; a.download = btn.getAttribute('download'); a.style.display = 'none';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
      }
      status.className = 'save-status ok';
      status.textContent = isIOS ? 'Opening your calendar…' : 'Calendar file downloaded. Open it to add the event.';
    } catch (err) {
      status.className = 'save-status';
      status.innerHTML = 'Sorry, the calendar file could not be downloaded. Please try again, or <a href="' + gcal.replace(/&/g, '&amp;') + '" target="_blank" rel="noopener">add it to Google Calendar</a>.';
    }
    busy = false;
  });
})();

/* ---------------- RSVP ----------------
   Sent to rsvp.php, which stores the reply and notifies the hosts. "Thank you" is shown only when the server answers
   that it stored the reply; any failure says so and offers the same reply by WhatsApp or email, already written. */
(function rsvp() {
  const form = $('rsvp');
  if (!form) return;
  const send = $('rsvpSend'), status = $('rsvpStatus'), guestsFld = $('guestsFld');
  const f = { name: $('rName'), email: $('rEmail'), guests: $('rGuests'), message: $('rMsg') };
  const KEY = 'nv-rsvp-sent';
  let busy = false, sent = false;
  const attending = () => { const r = form.querySelector('input[name=attending]:checked'); return r ? r.value : ''; };
  const setErr = (id, input, msg) => {
    const el = $(id); el.textContent = msg || ''; el.hidden = !msg;
    if (input) { input.setAttribute('aria-invalid', msg ? 'true' : 'false'); const box = input.closest('.inp'); if (box) box.classList.toggle('bad', !!msg); }
    return !msg;
  };
  const say = (cls, html) => { status.className = 'rsvp-status ' + cls; status.innerHTML = html; };
  const escH = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  for (const r of form.querySelectorAll('input[name=attending]')) r.addEventListener('change', () => {
    const no = attending() === 'no';
    guestsFld.hidden = no; f.guests.disabled = no;
    setErr('eAttend', null, '');
  });
  f.name.addEventListener('input', () => setErr('eName', f.name, ''));
  f.email.addEventListener('input', () => setErr('eEmail', f.email, ''));
  f.guests.addEventListener('input', () => setErr('eGuests', f.guests, ''));

  function read() {
    const v = { name: f.name.value.trim().replace(/\s+/g, ' '), email: f.email.value.trim(), attending: attending(), guests: 0, message: f.message.value.trim() };
    let ok = true, firstBad = null;
    const bad = (pass, el) => { if (!pass) { ok = false; firstBad = firstBad || el; } };
    bad(setErr('eName', f.name, v.name.length < 2 ? 'Please enter your full name.' : ''), f.name);
    bad(setErr('eEmail', f.email, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) ? 'Please enter a valid email address.' : ''), f.email);
    bad(setErr('eAttend', null, !v.attending ? 'Please choose one.' : ''), form.querySelector('input[name=attending]'));
    if (v.attending === 'yes') {
      const n = Number(f.guests.value);
      const good = f.guests.value.trim() !== '' && Number.isInteger(n) && n >= 1 && n <= C.rsvp.maxGuests;
      bad(setErr('eGuests', f.guests, good ? '' : `Please enter a number from 1 to ${C.rsvp.maxGuests}.`), f.guests);
      v.guests = good ? n : 0;
    } else setErr('eGuests', f.guests, '');
    if (firstBad) firstBad.focus();
    return ok ? v : null;
  }
  function direct(v) {
    const text = `RSVP — ${C.calendar.title}\nName: ${v.name}\nEmail: ${v.email}\nAttending: ${v.attending === 'yes' ? 'Joyfully accept' : 'Regretfully decline'}` +
      (v.attending === 'yes' ? `\nGuests: ${v.guests}` : '') + (v.message ? `\nMessage: ${v.message}` : '');
    return `<div class="alt"><a href="https://wa.me/${C.rsvp.whatsapp}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">SEND BY WHATSAPP</a>` +
      `<a href="mailto:${C.rsvp.email}?subject=${encodeURIComponent('RSVP — ' + C.calendar.title)}&body=${encodeURIComponent(text)}">SEND BY EMAIL</a></div>`;
  }
  function thank(v) {
    sent = true;
    form.classList.add('is-sent');
    say('ok', v.attending === 'no'
      ? `Thank you, ${escH(v.name)}. Your reply has been received. You will be missed.`
      : `Thank you, ${escH(v.name)}. Your reply has been received. We look forward to welcoming you.`);
  }
  try { const p = JSON.parse(localStorage.getItem(KEY) || 'null'); if (p && p.name) thank(p); } catch (e) {}

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy || sent) return;
    const v = read();
    if (!v) { say('bad', 'Please check the highlighted fields.'); return; }
    busy = true; send.disabled = true; send.querySelector('span').textContent = 'SENDING…';
    say('', 'Sending your reply…');
    let ok = false, why = '';
    try {
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 15000);
      const res = await fetch(C.rsvp.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal,
        body: JSON.stringify({ ...v, website: form.elements.website.value }) });
      clearTimeout(timer);
      const body = await res.json().catch(() => null);
      ok = res.ok && body && body.ok === true;
      if (!ok && body && body.error) why = body.error;
    } catch (err) { ok = false; }
    busy = false;
    if (ok) {
      try { localStorage.setItem(KEY, JSON.stringify({ name: v.name, attending: v.attending })); } catch (x) {}
      thank(v);
    } else {
      send.disabled = false; send.querySelector('span').textContent = 'SEND RSVP';
      say('bad', `Sorry, your reply could not be sent${why ? ' (' + escH(why) + ')' : ''}. Please try again, or send it directly:` + direct(v));
    }
  });
})();

/* ---------------- discourage casual copying of the artwork (as in the approved design) ---------------- */
document.addEventListener('contextmenu', (e) => { if (!e.target.closest('input, textarea')) e.preventDefault(); });
document.addEventListener('dragstart', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) e.preventDefault(); });
