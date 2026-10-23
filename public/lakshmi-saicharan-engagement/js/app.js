/* ─────────────────────────────────────────────────────────────────────────────
   Lakshmi & Sai Charan — Engagement (bride side). Runs the page: the one tap that opens the
   envelope (music + film, then the hero), the scroll-in of every piece, the
   scratch-to-reveal Save the Date card,
   Save the Date (.ics / Google Calendar), the music toggle and the falling petals.
   Event facts come from ../config.js.
   ───────────────────────────────────────────────────────────────────────────── */
import { invite as C } from '../config.js?v=6';

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

/* ── container units: phones without them (iOS before 16) get the same sizes from the stage's width ── */
if (!(window.CSS && CSS.supports && CSS.supports('width', '1cqw'))) {
  const cq = () => stage.style.setProperty('--cq', (stage.getBoundingClientRect().width || Math.min(innerWidth, 520)) / 100 + 'px');
  cq(); addEventListener('resize', cq); addEventListener('orientationchange', () => setTimeout(cq, 300));
}

/* ── music: starts on the very first tap anywhere on the opening (the earliest gesture browsers accept),
   audible at once; if a phone refuses, the music button stays up and pulses so one more tap plays it ── */
let opened = false;
let wantMusic = true, musicTried = false;
const isTouchMac = /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;   // iPadOS reports itself as a Mac
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || isTouchMac;
function startMusic() {
  if (musicTried) return; musicTried = true;
  mute.hidden = false; mute.classList.add('is-early');
  try { music.volume = .6; } catch {}
  const p = music.play();
  const ok = () => { mute.classList.remove('is-blocked'); fade(music, 1, 700); syncMute(); };
  const no = () => { wantMusic = false; mute.classList.add('is-blocked'); mute.setAttribute('aria-label', 'Tap to play music'); syncMute(); };
  if (p && p.then) p.then(ok, no); else ok();
}
for (const t of ['touchend', 'pointerup', 'click', 'keydown']) opening.addEventListener(t, startMusic, { passive: true });

/* ── opening: one tap (the button or anywhere on the envelope) → music, film; the film's end → hero ── */
/* the hero's pieces stagger in underneath the envelope while the film plays, so the invitation is already
   complete when the envelope lifts (revealed late, the bare floral paper read as an empty slide); later pages wait for the scroll */
function heroIn() { for (const el of $('#p1').querySelectorAll('.rise, .drop, .pop, .tilt, .slide-l, .swing')) el.classList.add('in'); }

function open() {
  if (opened) return;
  opened = true;
  tap.disabled = true;
  startMusic();
  heroIn();
  /* fullscreen is a courtesy where the browser allows it (Android); never on iPhone or iPad */
  const fs = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
  if (fs && !isIOS) { try { const p = fs.call(document.documentElement, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch {} }
  /* the film, muted and inline; if it cannot start quickly, or stalls, we go straight in */
  let done = false, started = false, stall = 0;
  const enter = () => { if (done) return; done = true; clearTimeout(bail); clearTimeout(slow); clearTimeout(stall); openStage(); };
  const bail = setTimeout(enter, C.videoTimeoutMs || 20000);
  const slow = setTimeout(() => { if (!started) enter(); }, 4500);          // a slow network or Low Power Mode: no waiting on the envelope
  film.addEventListener('ended', enter, { once: true });
  film.addEventListener('error', enter, { once: true });
  film.addEventListener('waiting', () => { clearTimeout(stall); stall = setTimeout(enter, 3000); });
  film.addEventListener('playing', () => { started = true; clearTimeout(stall); opening.classList.add('is-playing'); });
  film.muted = true; film.setAttribute('muted', '');
  const p = film.play();
  if (p && p.then) p.then(() => { started = true; opening.classList.add('is-playing'); }).catch(enter);
  else opening.classList.add('is-playing');
}
tap.addEventListener('click', open);
opening.addEventListener('click', (e) => { if (e.target !== tap && !tap.contains(e.target)) open(); });

function openStage() {
  /* always land on the hero, never a scroll position the browser remembered */
  try { history.scrollRestoration = 'manual'; } catch {}
  window.scrollTo(0, 0);
  document.body.classList.remove('is-closed');
  document.body.classList.add('is-open');
  opening.classList.add('is-leaving');
  mute.hidden = false; mute.classList.remove('is-early');
  syncMute();
  setTimeout(() => { opening.remove(); try { film.pause(); film.removeAttribute('src'); film.load(); } catch {} repaint(); }, 1100);
  setTimeout(repaint, 2400);
  heroIn();
  startPetals();
  watch();
}

/* some phones (iOS Safari, Android Chrome) leave the page unpainted after the full-screen envelope goes until the
   guest scrolls — so do what that scroll does: a one-pixel nudge, and reveal whatever is already on screen */
function repaint() {
  requestAnimationFrame(() => {
    const y = window.scrollY;
    window.scrollTo(0, y + 1); window.scrollTo(0, y);
    for (const el of stage.querySelectorAll('.rise, .drop, .pop, .tilt, .slide-l, .glide, .flutter, .swing')) {
      if (el.classList.contains('in')) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) el.classList.add('in');
    }
  });
}

function fade(a, to, ms) {
  const from = a.volume, t0 = performance.now();
  const step = (t) => { const k = Math.min(1, (t - t0) / ms); a.volume = from + (to - from) * k; if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ── music toggle ── */
mute.addEventListener('click', (e) => {
  e.stopPropagation();
  wantMusic = !wantMusic;
  if (wantMusic) music.play().then(() => mute.classList.remove('is-blocked')).catch(() => { wantMusic = false; syncMute(); });
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

/* ── scratch to reveal: a champagne-gold foil with the couple's L & C monogram; rub it away with a finger or the
   mouse (smooth, soft-edged strokes) and the day, the date and the hour show. Past half the foil dissolves by itself. ── */
const save = $('#save'), card = $('#scard'), foil = $('#foil'), face = $('#scardFace'), hint = $('#scardHint');
(function scratchCard() {
  const ctx = foil.getContext('2d');
  const logo = new Image(); logo.src = 'assets/el/lc-logo.webp';
  const GX = 24, GY = 30, cells = new Uint8Array(GX * GY); let hit = 0, done = false, drawing = false, last = null, dirty = false;
  let W = 0, H = 0, dpr = 1;
  function paint() {
    const r = foil.getBoundingClientRect(); if (!r.width || done || hit) return;
    dpr = Math.min(2, devicePixelRatio || 1); W = foil.width = Math.round(r.width * dpr); H = foil.height = Math.round(r.height * dpr);
    const rad = Math.min(W, H) * .045;
    ctx.save(); ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(0, 0, W, H, rad) : ctx.rect(0, 0, W, H); ctx.clip();
    // champagne foil: warm gradient, two soft diagonal sheens, fine metallic grain
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#e9cf9a'); g.addColorStop(.35, '#f8e7c2'); g.addColorStop(.55, '#d9b36e'); g.addColorStop(.8, '#f3dcab'); g.addColorStop(1, '#c99a52');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (const [x0, a] of [[.18, .32], [.62, .22]]) { const s = ctx.createLinearGradient(W * x0, 0, W * (x0 + .28), H);
      s.addColorStop(0, 'rgba(255,250,235,0)'); s.addColorStop(.5, `rgba(255,250,235,${a})`); s.addColorStop(1, 'rgba(255,250,235,0)'); ctx.fillStyle = s; ctx.fillRect(0, 0, W, H); }
    const img = ctx.getImageData(0, 0, W, H), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - .5) * 16; d[i] += n; d[i + 1] += n; d[i + 2] += n * .8; }
    ctx.putImageData(img, 0, 0);
    // a faint lotus damask pressed into the foil
    ctx.strokeStyle = 'rgba(140,96,36,.14)'; ctx.lineWidth = dpr;
    const step = W / 5;
    for (let y = -step / 2; y < H + step; y += step * .86) for (let x = (Math.round(y / step) % 2) * step / 2; x < W + step; x += step) {
      ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(a + .5) * step * .28, y + Math.sin(a + .5) * step * .28, x + Math.cos(a) * step * .34, y + Math.sin(a) * step * .34); }
      ctx.stroke(); }
    // borders
    ctx.strokeStyle = 'rgba(122,84,28,.75)'; ctx.lineWidth = 2 * dpr; ctx.strokeRect(rad * .7, rad * .7, W - rad * 1.4, H - rad * 1.4);
    ctx.strokeStyle = 'rgba(255,246,222,.7)'; ctx.lineWidth = dpr; ctx.strokeRect(rad * 1.05, rad * 1.05, W - rad * 2.1, H - rad * 2.1);
    // the couple's monogram, embossed in the middle
    const L = W * .46, lx = (W - L) / 2, ly = H * .2;
    if (logo.complete && logo.naturalWidth) {
      ctx.globalAlpha = .9; ctx.shadowColor = 'rgba(90,55,15,.45)'; ctx.shadowBlur = 6 * dpr; ctx.shadowOffsetY = 2 * dpr;
      ctx.drawImage(logo, lx, ly, L, L); ctx.globalAlpha = 1; ctx.shadowColor = 'transparent';
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#6b4a18'; ctx.font = `${Math.round(H * .062)}px "Great Vibes", cursive`; ctx.fillText('Our special day awaits', W / 2, H * .74);
    ctx.fillStyle = 'rgba(80,55,20,.9)'; ctx.font = `600 ${Math.round(H * .03)}px "Cormorant Garamond", Georgia, serif`;
    const label = 'SCRATCH TO REVEAL'; ctx.fillText(label.split('').join(String.fromCharCode(8202)), W / 2, H * .82);
    ctx.restore();
  }
  const pos = (e) => { const r = foil.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; };
  function mark(p) { const cx = p.x * GX, cy = p.y * GY;
    for (let gx = Math.max(0, Math.floor(cx - 1.6)); gx <= Math.min(GX - 1, Math.floor(cx + 1.6)); gx++)
      for (let gy = Math.max(0, Math.floor(cy - 1.3)); gy <= Math.min(GY - 1, Math.floor(cy + 1.3)); gy++) { const i = gy * GX + gx; if (!cells[i]) { cells[i] = 1; hit++; } } }
  function dab(x, y, r) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.95)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); }
  function rub(a, b) {
    ctx.globalCompositeOperation = 'destination-out';
    const r = W * .085, ax = a.x * W, ay = a.y * H, bx = b.x * W, by = b.y * H, n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / (r * .35)));
    for (let k = 0; k <= n; k++) dab(ax + (bx - ax) * k / n, ay + (by - ay) * k / n, r);
    const m = Math.max(1, Math.ceil(Math.hypot((b.x - a.x) * GX, (b.y - a.y) * GY)));
    for (let k = 0; k <= m; k++) mark({ x: a.x + (b.x - a.x) * k / m, y: a.y + (b.y - a.y) * k / m });
    if (!dirty) { dirty = true; hint.classList.add('is-gone'); card.classList.add('is-scratching'); }
    if (hit / cells.length > .45) reveal();
  }
  function reveal() {
    if (done) return; done = true; drawing = false;
    foil.classList.add('is-gone'); card.classList.add('is-revealed'); hint.classList.add('is-gone'); save.classList.add('is-ready');
    foil.setAttribute('aria-hidden', 'true'); foil.tabIndex = -1;
    $('#scardNote').textContent = 'Revealed: Sunday, 1 November 2026, at 11:00 AM. Use Save the Date to add it to your calendar.';
    navigator.vibrate?.(12);
    setTimeout(() => foil.remove(), 1000);
  }
  let pending = null;                                              // one stroke per animation frame keeps it smooth on phones
  const flush = () => { if (pending && last) { rub(last, pending); last = pending; } pending = null; };
  foil.addEventListener('pointerdown', (e) => { if (done || (e.pointerType === 'mouse' && e.button !== 0)) return; e.preventDefault(); drawing = true; last = pos(e); try { foil.setPointerCapture(e.pointerId); } catch {} rub(last, last); });
  foil.addEventListener('pointermove', (e) => { if (!drawing) return; e.preventDefault();
    const co = e.getCoalescedEvents ? e.getCoalescedEvents() : null, evs = co && co.length ? co : [e]; for (const ev of evs) { pending = pos(ev); flush(); } });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) foil.addEventListener(t, () => { drawing = false; });
  foil.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });
  const ready = () => paint();
  logo.onload = () => { if (!hit) paint(); };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(ready);
  new ResizeObserver(() => { if (!done && !hit) paint(); }).observe(foil);
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
  const dpr = Math.min(1.5, devicePixelRatio || 1);
  let W = 0, H = 0, petals = [], raf = 0, last = 0;
  const N = Math.min(12, Math.round(innerWidth / 40));
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
