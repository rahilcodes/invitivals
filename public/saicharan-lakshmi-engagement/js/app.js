/* ─────────────────────────────────────────────────────────────────────────────
   Sai Charan & Lakshmi — Engagement. Runs the page: the one tap that opens the
   envelope (music + film, then the hero; the couple's CL seal rides on the film),
   the scroll-in of every piece, the scratch-to-reveal date on the calendar,
   Save the Date (.ics / Google Calendar), the music toggle and the falling petals.
   Event facts come from ../config.js.
   ───────────────────────────────────────────────────────────────────────────── */
import { invite as C } from '../config.js?v=2';

const $ = (s, r = document) => r.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const opening = $('#opening'), film = $('#film'), tap = $('#tap');
const music = $('#music'), mute = $('#mute');
const stage = $('#stage');

/* ── words from config ── */
for (const el of document.querySelectorAll('[data-cfg]')) {
  const k = el.dataset.cfg;
  if (k === 'time') el.textContent = C.event.display.time;
  else if (k === 'date') el.textContent = C.event.display.date;
  else if (k === 'venueName') el.textContent = C.venue.name;
  else if (k === 'address') el.innerHTML = C.venue.address.map(esc).join('<br>');
}
$('#maps').href = C.venue.mapsUrl;
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

/* ── opening: one tap → music, film, fullscreen where allowed; film's end → hero ── */
let opened = false;
let wantMusic = true;
tap.addEventListener('click', () => {
  if (opened) return;
  opened = true;
  tap.disabled = true;
  /* music first — this is the user gesture, so autoplay rules allow it */
  music.preload = 'auto';
  music.volume = 0;
  music.play().then(() => fade(music, 1, 1800)).catch(() => { wantMusic = false; });
  /* fullscreen is a courtesy where the browser allows it (Android Chrome); iPhone Safari ignores it */
  const fs = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
  if (fs && !/iPhone|iPad/i.test(navigator.userAgent)) { try { const p = fs.call(document.documentElement, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch {} }
  /* the film, muted and inline; if it cannot play we go straight in */
  let done = false;
  const enter = () => { if (done) return; done = true; clearTimeout(bail); openStage(); };
  const bail = setTimeout(enter, C.videoTimeoutMs || 20000);
  film.addEventListener('ended', enter, { once: true });
  film.addEventListener('error', enter, { once: true });
  film.muted = true;
  film.addEventListener('playing', () => { opening.classList.add('is-playing'); followSeal(); }, { once: true });
  const p = film.play();
  if (p && p.then) p.then(() => opening.classList.add('is-playing')).catch(enter);
  else opening.classList.add('is-playing');
});

/* ── the CL seal on the film: placed in a box that covers the screen exactly like the film does ── */
const seal = $('#seal'), cover = $('.opening__cover');
function followSeal() {
  const S = C.seal; if (!S || !seal) return;
  seal.classList.add('is-on');
  const at = (t) => {
    const k = S.track; if (t <= k[0][0]) return k[0];
    for (let i = 1; i < k.length; i++) if (t <= k[i][0]) { const a = k[i - 1], b = k[i], u = (t - a[0]) / (b[0] - a[0]); return a.map((v, j) => v + (b[j] - v) * u); }
    return k[k.length - 1];
  };
  const step = () => {
    if (!seal.isConnected) return;
    const t = film.currentTime, [, x, y, sc, glare] = at(t);
    const out = t <= S.fadeOut[0] ? 1 : Math.max(0, 1 - (t - S.fadeOut[0]) / (S.fadeOut[1] - S.fadeOut[0]));
    seal.style.left = (x * 100) + '%'; seal.style.top = (y * 100) + '%'; seal.style.width = (S.size * sc * 100) + '%';
    seal.style.opacity = String(out * (1 - glare));
    seal.style.filter = glare > .02 ? `brightness(${1 + glare * 1.4})` : '';
    if (out > 0) requestAnimationFrame(step); else seal.classList.remove('is-on');
  };
  requestAnimationFrame(step);
}
const fitCover = () => { if (!cover) return; const r = 941 / 1672, w = innerWidth, h = innerHeight;
  const cw = Math.max(w, h * r), ch = cw / r; cover.style.width = cw + 'px'; cover.style.height = ch + 'px'; };
fitCover(); addEventListener('resize', fitCover);

function openStage() {
  document.body.classList.remove('is-closed');
  document.body.classList.add('is-open');
  opening.classList.add('is-leaving');
  mute.hidden = false;
  syncMute();
  setTimeout(() => { opening.remove(); try { film.pause(); film.removeAttribute('src'); film.load(); } catch {} }, 1100);
  /* the hero's pieces stagger in on their own; later pages wait for the scroll */
  for (const el of $('#p1').querySelectorAll('.rise, .drop, .pop, .tilt, .slide-l, .swing')) el.classList.add('in');
  startPetals();
  watch();
}

function fade(a, to, ms) {
  const from = a.volume, t0 = performance.now();
  const step = (t) => { const k = Math.min(1, (t - t0) / ms); a.volume = from + (to - from) * k; if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ── music toggle ── */
mute.addEventListener('click', () => {
  wantMusic = !wantMusic;
  if (wantMusic) music.play().catch(() => { wantMusic = false; syncMute(); });
  else music.pause();
  syncMute();
});
function syncMute() {
  const on = wantMusic && !music.paused;
  mute.setAttribute('aria-pressed', on ? 'false' : 'true');
  mute.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
}
music.addEventListener('play', syncMute);
music.addEventListener('pause', syncMute);
document.addEventListener('visibilitychange', () => {
  if (!opened) return;
  if (document.hidden) music.pause();
  else if (wantMusic) music.play().catch(() => {});
});

/* ── scroll-in, once per piece ── */
function watch() {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  for (const el of stage.querySelectorAll('.rise, .drop, .pop, .tilt, .slide-l, .glide, .flutter, .swing')) if (!el.classList.contains('in')) io.observe(el);
}
/* ?open in the address skips the envelope while working on the page */
if (new URLSearchParams(location.search).has('open')) { opened = true; wantMusic = false; openStage(); }

/* ── scratch to reveal the date: a blush-and-gold foil over the calendar's paper; rub it away (finger or
   mouse) and the date shows with the heart on the 1st. Vertical swipes still scroll the page. ── */
const cal = $('#cal'), save = $('#save'), sc = $('#scratch'), calDate = $('#calDate');
(function scratchCard() {
  const ctx = sc.getContext('2d');
  const GX = 22, GY = 26, cells = new Uint8Array(GX * GY); let hit = 0, done = false, drawing = false, last = null, painted = false;
  function paint() {
    const r = sc.getBoundingClientRect(); if (!r.width || done) return;
    const dpr = Math.min(2, devicePixelRatio || 1), W = sc.width = Math.round(r.width * dpr), H = sc.height = Math.round(r.height * dpr);
    ctx.globalCompositeOperation = 'source-over';
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#f4d9c6'); g.addColorStop(.28, '#e9c7a0'); g.addColorStop(.5, '#f7e3c2'); g.addColorStop(.72, '#ddb57e'); g.addColorStop(1, '#f1d2bd');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < W * H / 260; i++) { ctx.fillStyle = `rgba(255,250,235,${Math.random() * .35})`; ctx.fillRect(Math.random() * W, Math.random() * H, dpr, dpr); }   // foil shimmer
    ctx.strokeStyle = 'rgba(169,122,43,.75)'; ctx.lineWidth = 2 * dpr; ctx.strokeRect(9 * dpr, 9 * dpr, W - 18 * dpr, H - 18 * dpr);
    ctx.strokeStyle = 'rgba(169,122,43,.35)'; ctx.lineWidth = dpr; ctx.strokeRect(15 * dpr, 15 * dpr, W - 30 * dpr, H - 30 * dpr);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#a97a2b'; ctx.font = `${Math.round(H * .085)}px "Great Vibes", cursive`; ctx.fillText('Save the Date', W / 2, H * .36);
    ctx.fillStyle = '#c56f7d'; ctx.font = `${Math.round(H * .07)}px Georgia, serif`; ctx.fillText('♡', W / 2, H * .5);
    ctx.fillStyle = '#4f5a3a'; ctx.font = `600 ${Math.round(H * .036)}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillText('S C R A T C H   T O   R E V E A L', W / 2, H * .63);
    painted = true;
  }
  const pos = (e) => { const r = sc.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; };
  function mark(p) { const cx = p.x * GX, cy = p.y * GY;
    for (let gx = Math.max(0, Math.floor(cx - 1.4)); gx <= Math.min(GX - 1, Math.floor(cx + 1.4)); gx++)
      for (let gy = Math.max(0, Math.floor(cy - 1.4)); gy <= Math.min(GY - 1, Math.floor(cy + 1.4)); gy++) { const i = gy * GX + gx; if (!cells[i]) { cells[i] = 1; hit++; } } }
  function rub(a, b) {
    const W = sc.width, H = sc.height;
    ctx.globalCompositeOperation = 'destination-out'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = W * .16;
    ctx.beginPath(); ctx.moveTo(a.x * W, a.y * H); ctx.lineTo(b.x * W + .01, b.y * H + .01); ctx.stroke();
    const n = Math.max(1, Math.ceil(Math.hypot((b.x - a.x) * GX, (b.y - a.y) * GY)));
    for (let k = 0; k <= n; k++) mark({ x: a.x + (b.x - a.x) * k / n, y: a.y + (b.y - a.y) * k / n });
    if (hit / cells.length > .5) reveal();
  }
  function reveal() {
    if (done) return; done = true; drawing = false;
    sc.classList.add('is-gone'); cal.classList.add('is-revealed'); calDate.classList.add('is-revealed'); save.classList.add('is-ready');
    sc.setAttribute('aria-hidden', 'true'); sc.tabIndex = -1;
    $('#calNote').textContent = 'Revealed: the engagement is on Sunday, 1 November 2026 at 11:00 AM. Use Save the Date to add it to your calendar.';
    setTimeout(() => sc.remove(), 900);
  }
  sc.addEventListener('pointerdown', (e) => { if (done || (e.pointerType === 'mouse' && e.button !== 0)) return; drawing = true; last = pos(e); try { sc.setPointerCapture(e.pointerId); } catch {} rub(last, last); });
  sc.addEventListener('pointermove', (e) => { if (!drawing) return; const p = pos(e); rub(last, p); last = p; });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) sc.addEventListener(t, () => { drawing = false; });
  sc.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });
  /* paint once the card is laid out and the fonts are in */
  const ready = () => { if (!painted) paint(); };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(ready);
  new ResizeObserver(() => { if (!done && !hit) paint(); }).observe(sc);
})();

/* ── save the date: .ics built from config (duration is configurable there) + Google Calendar ── */
const sheet = $('#sheet');
const start = local(C.event.date, C.event.time);
const end = new Date(start.getTime() + (C.event.durationMinutes || 180) * 60000);
const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const wall = (d) => `${C.event.date.replace(/-/g, '')}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00`;
function pad(n) { return String(n).padStart(2, '0'); }
/* a Date whose UTC fields equal the Kolkata wall-clock time, so the maths does not depend on the phone's zone */
function local(date, time) { return new Date(`${date}T${time}:00Z`); }
const location_ = `${C.venue.name}, ${C.venue.address.join(' ').replace(/,\s*$/, '')}`;
const ics = [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Engagement Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'BEGIN:VTIMEZONE', `TZID:${C.event.timeZone}`, 'BEGIN:STANDARD', 'DTSTART:19700101T000000',
  `TZOFFSETFROM:${C.event.utcOffset.replace(':', '')}`, `TZOFFSETTO:${C.event.utcOffset.replace(':', '')}`, 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
  'BEGIN:VEVENT', `UID:${C.slug}-${C.event.date}@invitivals.com`, `DTSTAMP:${stamp(new Date())}`,
  `DTSTART;TZID=${C.event.timeZone}:${wall(start)}`, `DTEND;TZID=${C.event.timeZone}:${wall(end)}`,
  `SUMMARY:${icsText(C.title)}`, `LOCATION:${icsText(location_)}`, `DESCRIPTION:${icsText(C.description + '\nMap: ' + C.venue.mapsUrl)}`,
  `URL:https://invitivals.com/${C.slug}/`,
  'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${icsText('Engagement of ' + C.couple.short + ' is tomorrow')}`, 'END:VALARM',
  'END:VEVENT', 'END:VCALENDAR', '',
].join('\r\n');
function icsText(s) { return String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c); }
try { $('#ics').href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' })); } catch { /* keeps the static event.ics */ }
/* Google Calendar wants the wall-clock time in the named zone */
const g = new URL('https://calendar.google.com/calendar/render');
g.searchParams.set('action', 'TEMPLATE');
g.searchParams.set('text', C.title);
g.searchParams.set('dates', `${wall(start)}/${wall(end)}`);
g.searchParams.set('ctz', C.event.timeZone);
g.searchParams.set('details', C.description + '\nMap: ' + C.venue.mapsUrl);
g.searchParams.set('location', location_);
$('#gcal').href = g.toString();

save.addEventListener('click', () => { sheet.hidden = false; $('#ics').focus(); });
for (const el of sheet.querySelectorAll('[data-close]')) el.addEventListener('click', () => { sheet.hidden = true; save.focus(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) { sheet.hidden = true; save.focus(); } });

/* ── petals: a few pink rose petals drifting down over every page ── */
function startPetals() {
  if (reduced) return;
  const cv = $('#petals'), ctx = cv.getContext('2d');
  const dpr = Math.min(2, devicePixelRatio || 1);
  let W = 0, H = 0, petals = [], raf = 0, last = 0;
  const N = Math.min(14, Math.round(innerWidth / 36));
  const size = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const make = (fresh) => ({
    x: Math.random() * W, y: fresh ? -30 : Math.random() * H, s: 7 + Math.random() * 7,
    vy: 18 + Math.random() * 22, vx: (Math.random() - .5) * 10, rot: Math.random() * 6.28, vr: (Math.random() - .5) * 1.2,
    sway: Math.random() * 6.28, hue: 340 + Math.random() * 12, light: 72 + Math.random() * 12, a: .55 + Math.random() * .3,
  });
  size();
  for (let i = 0; i < N; i++) petals.push(make(false));
  addEventListener('resize', size);
  const draw = (p) => {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.a;
    const grd = ctx.createRadialGradient(-p.s * .2, -p.s * .2, p.s * .1, 0, 0, p.s);
    grd.addColorStop(0, `hsl(${p.hue} 75% ${p.light + 10}%)`); grd.addColorStop(1, `hsl(${p.hue} 65% ${p.light - 8}%)`);
    ctx.fillStyle = grd; ctx.beginPath();
    ctx.moveTo(0, -p.s); ctx.bezierCurveTo(p.s * .9, -p.s * .8, p.s * .8, p.s * .6, 0, p.s); ctx.bezierCurveTo(-p.s * .8, p.s * .6, -p.s * .9, -p.s * .8, 0, -p.s);
    ctx.fill(); ctx.restore();
  };
  const tick = (t) => {
    const dt = Math.min(.05, (t - last) / 1000 || .016); last = t;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.sway += dt * 1.4; p.x += (p.vx + Math.sin(p.sway) * 14) * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      if (p.y > H + 30 || p.x < -40 || p.x > W + 40) petals[i] = make(true);
      draw(p);
    }
    raf = requestAnimationFrame(tick);
  };
  const run = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : run()));
  run();
}
