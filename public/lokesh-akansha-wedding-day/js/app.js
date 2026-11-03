/* ─────────────────────────────────────────────────────────────────────────────
   Lokesh & Akansha — the wedding, groom side. Runs the page: the one tap that opens the envelope (the film,
   then the cover), the scroll-in of every piece, the venue map links, the falling petals, and the music
   once the family's song is set in ../config.js (no song: no music button). Shared by both pages.
   ───────────────────────────────────────────────────────────────────────────── */
import { invite as C } from '../config.js?v=1';

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

/* ── music: only when config names a song; starts on the first tap on the envelope ── */
const hasMusic = !!(C.music && music);
let opened = false, wantMusic = hasMusic, musicTried = false;
if (hasMusic) music.src = C.music;
const isTouchMac = /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || isTouchMac;
function startMusic() {
  if (!hasMusic || musicTried) return; musicTried = true;
  mute.hidden = false;
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
    if (wantMusic) music.play().then(() => mute.classList.remove('is-blocked')).catch(() => { wantMusic = false; syncMute(); });
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
