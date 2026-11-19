/* Choudhari Family, Gruhapravesh — the page's script. The door, the scroll-ins, the bell and the petals behave as in
   the design; this invitation's own: the client's song (one copy only, started by the door tap, play/pause on the
   button), the countdown to 25 November 2026, 7:00 PM India time, and Save the Date. There is no RSVP.
   Everything about the client comes from ../config.js. */
import { invite as C } from '../config.js?v=2';

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
const songFile = !C.music ? Promise.reject(new Error('no song')) : fetch(C.music).then((r) => { if (!r.ok) throw new Error('music ' + r.status); return r.arrayBuffer(); });
songFile.catch(() => {});                                               // a failed download is dealt with at the tap
function ensureCtx() {
  if (ctx) return true;
  try { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false; ctx = new AC(); } catch (e) { return false; }
  master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
  return true;
}
function showMusic() {
  if (!musicBtn) return;
  const off = muted || musicState === 'failed';
  musicBtn.classList.toggle('muted', off);
  musicBtn.setAttribute('aria-pressed', String(!off));
  musicBtn.setAttribute('aria-label', off ? 'Music is off: tap to play' : 'Music is on: tap to mute');
}
function startMusic() {
  if (!C.music) return;
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
if (musicBtn) musicBtn.addEventListener('click', () => {
  if (musicState === 'failed' || musicState === 'idle') { muted = false; startMusic(); return; }
  muted = !muted;
  if (muted) ctx.suspend(); else ctx.resume();
  showMusic();
});

/* ---------------- the celebration's moment, in India time ----------------
   The wall-clock time in config (the date and time of events[countdownTo], in config.timeZone) is turned into one absolute instant:
   Intl gives that zone's offset at that moment, daylight saving included, whatever the visitor's own timezone is.
   A browser without timezone data falls back to config.utcOffset. */
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
const TARGET = C.event;
const START = zonedInstant(TARGET.date, TARGET.time, C.timeZone, C.utcOffset);

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

/* ---------------- Save the Date ----------------
   An ordinary link to Google Calendar's event-creation screen, written into the page by the tool and opened by the
   guest's own tap in a new tab. It goes through Google's sign-in address so a signed-out guest still reaches the
   event; on Android the direct address is used instead, which the Google Calendar app opens itself. */
if (/Android/i.test(navigator.userAgent)) for (const a of document.querySelectorAll('a[data-direct]')) a.href = a.dataset.direct;

/* ---------------- discourage casual copying of the artwork (as in the approved design) ---------------- */
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) e.preventDefault(); });
