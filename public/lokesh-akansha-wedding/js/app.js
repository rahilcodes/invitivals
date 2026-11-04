/* ─────────────────────────────────────────────────────────────────────────────
   Lokesh & Akansha — the wedding, groom side. Runs the page: the one tap that opens the envelope (the film,
   then the cover), the scroll-in of every piece, the Save the Date scratch card, the venue map links, the falling
   petals, and the family's song when ../config.js names one (no song: no music button).
   ───────────────────────────────────────────────────────────────────────────── */
import { invite as C } from '../config.js?v=3';

const $ = (s, r = document) => r.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const opening = $('#opening'), film = $('#film'), tap = $('#tap');
const music = $('#music'), mute = $('#mute');
const stage = $('#stage');
const MOTION = '.rise, .drop, .pop, .swing, .flutter, .glide';

/* ── the venue links, from config; a venue without a verified link keeps its button, greyed and inert ── */
for (const a of document.querySelectorAll('[data-maps]')) {
  const url = (C.venues[a.dataset.maps] || {}).mapsUrl;
  if (url) a.href = url; else { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); }
}

/* ── container units: phones without them (iOS before 16) get the same sizes from the stage's width ── */
if (!(window.CSS && CSS.supports && CSS.supports('width', '1cqw'))) {
  const cq = () => stage.style.setProperty('--cq', (stage.getBoundingClientRect().width || Math.min(innerWidth, 520)) / 100 + 'px');
  cq(); addEventListener('resize', cq); addEventListener('orientationchange', () => setTimeout(cq, 300));
}

/* ── music: only when config names a song. Browsers allow sound only after a deliberate tap, so the song is loaded and
   started by the tap that opens the envelope (one try, never retried on its own); if a phone still refuses, the music
   button stays up with "Tap for music" and one tap plays it. If the file cannot load, the button goes away quietly. ── */
let hasMusic = !!(C.music && music);
let opened = false, wantMusic = hasMusic, musicTried = false;
if (hasMusic) music.addEventListener('error', () => { hasMusic = false; wantMusic = false; mute.hidden = true; }, { once: true });
const load = () => { if (!music.getAttribute('src')) { music.src = C.music; music.preload = 'auto'; } };
const isTouchMac = /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || isTouchMac;
function startMusic() {
  if (!hasMusic || musicTried) return; musicTried = true;
  mute.hidden = false;
  load();
  try { music.volume = .6; } catch {}
  const p = music.play();
  const ok = () => { mute.classList.remove('is-blocked'); syncMute(); };
  const no = () => { wantMusic = false; mute.classList.add('is-blocked'); mute.setAttribute('aria-label', 'Tap to play music'); syncMute(); };
  if (p && p.then) p.then(ok, no); else ok();
}
for (const t of ['touchend', 'pointerup', 'click', 'keydown']) opening.addEventListener(t, startMusic, { passive: true });
if (hasMusic) {
  mute.addEventListener('click', (e) => {
    e.stopPropagation();
    wantMusic = !wantMusic;
    if (wantMusic) load(), music.play().then(() => mute.classList.remove('is-blocked')).catch(() => { wantMusic = false; syncMute(); });
    else music.pause();
    syncMute();
  });
  music.addEventListener('play', syncMute);
  music.addEventListener('pause', syncMute);
  document.addEventListener('visibilitychange', () => {
    if (!opened) return;
    if (document.hidden) music.pause(); else if (wantMusic) music.play().catch(() => {});
  });
}
function syncMute() {
  const on = wantMusic && !music.paused;
  mute.setAttribute('aria-pressed', on ? 'false' : 'true');
  mute.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
}

/* ── opening: one tap (the button or anywhere on the envelope) → the film; its end → the cover ── */
/* the cover's pieces come in under the envelope while the film plays, so the invitation is complete when it lifts */
function coverIn() { for (const el of $('#p1').querySelectorAll(MOTION)) el.classList.add('in'); }
function open() {
  if (opened) return;
  opened = true; tap.disabled = true;
  startMusic(); coverIn();
  const fs = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
  if (fs && !isIOS) { try { const p = fs.call(document.documentElement, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch {} }
  let done = false, started = false, stall = 0;
  const enter = () => { if (done) return; done = true; clearTimeout(bail); clearTimeout(slow); clearTimeout(stall); openStage(); };
  const bail = setTimeout(enter, C.videoTimeoutMs || 20000);
  const slow = setTimeout(() => { if (!started) enter(); }, 4500);          // slow network or Low Power Mode: no waiting on the envelope
  film.addEventListener('ended', enter, { once: true });
  film.addEventListener('error', enter, { once: true });
  film.addEventListener('waiting', () => { clearTimeout(stall); stall = setTimeout(enter, 3000); });
  film.addEventListener('playing', () => { started = true; clearTimeout(stall); opening.classList.add('is-playing'); });
  if (reduced) { enter(); return; }
  film.muted = true; film.setAttribute('muted', '');
  const p = film.play();
  if (p && p.then) p.then(() => { started = true; opening.classList.add('is-playing'); }).catch(enter);
  else opening.classList.add('is-playing');
}
tap.addEventListener('click', open);
opening.addEventListener('click', (e) => { if (e.target !== tap && !tap.contains(e.target)) open(); });

function openStage() {
  try { history.scrollRestoration = 'manual'; } catch {}
  window.scrollTo(0, 0);
  document.body.classList.remove('is-closed');
  document.body.classList.add('is-open');
  opening.classList.add('is-leaving');
  if (hasMusic) { mute.hidden = false; syncMute(); }
  setTimeout(() => { opening.remove(); try { film.pause(); film.removeAttribute('src'); film.load(); } catch {} repaint(); }, 1100);
  setTimeout(repaint, 2400);
  coverIn(); startPetals(); watch();
}
/* some phones leave the page unpainted after the full-screen envelope goes until the guest scrolls: nudge once,
   and reveal whatever is already on screen */
function repaint() {
  requestAnimationFrame(() => {
    const y = window.scrollY; window.scrollTo(0, y + 1); window.scrollTo(0, y);
    for (const el of stage.querySelectorAll(MOTION)) {
      if (el.classList.contains('in')) continue;
      const r = el.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) el.classList.add('in');
    }
  });
}

/* ── scroll-in, once per piece ── */
function watch() {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  for (const el of stage.querySelectorAll(MOTION)) if (!el.classList.contains('in')) io.observe(el);
}

/* ── the cue on the cover: a tap glides to the next page; it fades once the guest scrolls ── */
const cue = $('#cue');
if (cue) {
  cue.addEventListener('click', () => { const n = $('#p1').nextElementSibling; if (n) window.scrollTo({ top: n.getBoundingClientRect().top + scrollY, behavior: reduced ? 'auto' : 'smooth' }); });
  addEventListener('scroll', () => { cue.style.opacity = scrollY > 60 ? '0' : ''; }, { passive: true });
}

/* ── Save the Date: a champagne-gold foil with the couple's L & A monogram; rub it away with a finger or the mouse and
   the dates show; past ~45% the foil dissolves by itself. Enter or Space reveals it at once. The foil takes the finger
   only over the card, so the page scrolls beside it; without canvas or pointer events the dates simply show. ── */
(function scratchCard() {
  const card = $('#scard'), foil = $('#foil'), hint = $('#scardHint');
  if (!card || !foil) return;
  const ctx = foil.getContext && foil.getContext('2d');
  if (!ctx || !window.PointerEvent) { card.classList.add('no-foil', 'is-revealed'); return; }
  const logo = new Image(); logo.src = 'assets/el/la-logo.webp';
  const GX = 24, GY = 30, cells = new Uint8Array(GX * GY); let hit = 0, done = false, drawing = false, last = null, dirty = false;
  let W = 0, H = 0, dpr = 1;
  function paint() {
    const r = foil.getBoundingClientRect(); if (!r.width || done || hit) return;
    dpr = Math.min(2, devicePixelRatio || 1); W = foil.width = Math.round(r.width * dpr); H = foil.height = Math.round(r.height * dpr);
    const rad = Math.min(W, H) * .045;
    ctx.save(); ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(0, 0, W, H, rad) : ctx.rect(0, 0, W, H); ctx.clip();
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#e9cf9a'); g.addColorStop(.35, '#f8e7c2'); g.addColorStop(.55, '#d9b36e'); g.addColorStop(.8, '#f3dcab'); g.addColorStop(1, '#c99a52');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (const [x0, a] of [[.18, .32], [.62, .22]]) {
      const sh = ctx.createLinearGradient(W * x0, 0, W * (x0 + .28), H);
      sh.addColorStop(0, 'rgba(255,250,235,0)'); sh.addColorStop(.5, `rgba(255,250,235,${a})`); sh.addColorStop(1, 'rgba(255,250,235,0)');
      ctx.fillStyle = sh; ctx.fillRect(0, 0, W, H);
    }
    const img = ctx.getImageData(0, 0, W, H), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - .5) * 16; d[i] += n; d[i + 1] += n; d[i + 2] += n * .8; }
    ctx.putImageData(img, 0, 0);
    ctx.strokeStyle = 'rgba(122,84,28,.75)'; ctx.lineWidth = 2 * dpr; ctx.strokeRect(rad * .7, rad * .7, W - rad * 1.4, H - rad * 1.4);
    ctx.strokeStyle = 'rgba(255,246,222,.7)'; ctx.lineWidth = dpr; ctx.strokeRect(rad * 1.05, rad * 1.05, W - rad * 2.1, H - rad * 2.1);
    const L = W * .5;
    if (logo.complete && logo.naturalWidth) {
      ctx.shadowColor = 'rgba(90,55,15,.45)'; ctx.shadowBlur = 6 * dpr; ctx.shadowOffsetY = 2 * dpr;
      ctx.drawImage(logo, (W - L) / 2, H * .15, L, L); ctx.shadowColor = 'transparent';
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#6e1630'; ctx.font = `${Math.round(H * .066)}px "Pinyon Script", cursive`; ctx.fillText('Our special days await', W / 2, H * .74);
    ctx.fillStyle = 'rgba(80,40,20,.9)'; ctx.font = `600 ${Math.round(H * .028)}px Cinzel, Georgia, serif`;
    ctx.fillText('SCRATCH TO REVEAL'.split('').join(String.fromCharCode(8202)), W / 2, H * .83);
    ctx.restore();
  }
  const pos = (e) => { const r = foil.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; };
  function mark(p) {
    const cx = p.x * GX, cy = p.y * GY;
    for (let gx = Math.max(0, Math.floor(cx - 1.6)); gx <= Math.min(GX - 1, Math.floor(cx + 1.6)); gx++)
      for (let gy = Math.max(0, Math.floor(cy - 1.3)); gy <= Math.min(GY - 1, Math.floor(cy + 1.3)); gy++) { const i = gy * GX + gx; if (!cells[i]) { cells[i] = 1; hit++; } }
  }
  function dab(x, y, r) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.95)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
  }
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
    foil.classList.add('is-gone'); card.classList.add('is-revealed'); hint.classList.add('is-gone');
    foil.setAttribute('aria-hidden', 'true'); foil.tabIndex = -1;
    $('#scardNote').textContent = 'Revealed: ' + $('#scardFace').innerText.replace(/\s+/g, ' ').trim();
    navigator.vibrate?.(12);
    setTimeout(() => foil.remove(), 1000);
  }
  let pending = null;                                              // one stroke per animation frame keeps it smooth on phones
  const flush = () => { if (pending && last) { rub(last, pending); last = pending; } pending = null; };
  foil.addEventListener('pointerdown', (e) => { if (done || (e.pointerType === 'mouse' && e.button !== 0)) return; e.preventDefault(); drawing = true; last = pos(e); try { foil.setPointerCapture(e.pointerId); } catch {} rub(last, last); });
  foil.addEventListener('pointermove', (e) => {
    if (!drawing) return; e.preventDefault();
    const co = e.getCoalescedEvents ? e.getCoalescedEvents() : null, evs = co && co.length ? co : [e];
    for (const ev of evs) { pending = pos(ev); flush(); }
  });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) foil.addEventListener(t, () => { drawing = false; });
  foil.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });
  logo.onload = () => { if (!hit) paint(); };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(paint);
  if (window.ResizeObserver) new ResizeObserver(() => { if (!done && !hit) paint(); }).observe(foil); else paint();
})();

/* ── Add to Calendar: a sheet with the .ics (Apple, Android, Outlook) and Google Calendar ── */
const sheet = $('#sheet'), calBtn = $('#calBtn');
if (sheet && calBtn) {
  calBtn.addEventListener('click', () => { sheet.hidden = false; sheet.querySelector('a').focus(); });
  for (const el of sheet.querySelectorAll('[data-close]')) el.addEventListener('click', () => { sheet.hidden = true; calBtn.focus(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) { sheet.hidden = true; calBtn.focus(); } });
}

/* ── countdown to the Feras: worked out every second from the real moment (an absolute time with its +05:30 offset,
   so it is right on any phone in any time zone); at zero it gives way to "The Big Day Is Here!" ── */
const cd = $('#countdown');
if (cd) {
  const target = Date.parse(cd.dataset.target), cells = {};
  for (const k of ['d', 'h', 'm', 's']) cells[k] = cd.querySelector(`[data-cd="${k}"]`);
  const two = (n) => String(n).padStart(2, '0');
  let timer = 0;
  const tick = () => {
    const left = target - Date.now();
    if (!(left > 0)) { cd.classList.add('is-done'); $('#cdDone').hidden = false; clearInterval(timer); return; }
    const t = Math.floor(left / 1000);
    cells.d.textContent = Math.floor(t / 86400); cells.h.textContent = two(Math.floor(t / 3600) % 24);
    cells.m.textContent = two(Math.floor(t / 60) % 60); cells.s.textContent = two(t % 60);
  };
  tick(); timer = setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
}

/* ?open in the address skips the envelope while working on the page */
if (new URLSearchParams(location.search).has('open')) { opened = true; wantMusic = false; openStage(); }

/* ── petals: a few pink petals drifting down over every page ── */
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
