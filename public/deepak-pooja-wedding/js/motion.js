/* Motion: scroll reveals, gentle parallax, gold dust. Never hijacks scrolling;
   with prefers-reduced-motion everything is simply shown. */
import { $$, reducedMotion } from './util.js';

export function initReveals() {
  const items = $$('[data-reveal]');
  // siblings revealed together get a small stagger
  const groups = new Map();
  items.forEach((el) => {
    const k = el.parentElement;
    const n = groups.get(k) || 0;
    el.style.setProperty('--d', `${Math.min(n, 6) * 90}ms`);
    groups.set(k, n + 1);
  });
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

export function initParallax() {
  if (reducedMotion()) return;
  const els = $$('[data-parallax]').map((el) => ({ el, depth: parseFloat(el.dataset.parallax) || 0, top: 0, h: 0 }));
  const measure = () => {
    const y = window.scrollY;
    els.forEach((p) => {
      const prev = p.el.style.transform; p.el.style.transform = 'none';
      const r = p.el.getBoundingClientRect();
      p.top = r.top + y; p.h = r.height;
      p.el.style.transform = prev;
    });
  };
  let ticking = false;
  const frame = () => {
    ticking = false;
    const y = window.scrollY, vh = window.innerHeight, mid = y + vh / 2;
    for (const p of els) {
      if (p.top > y + vh * 1.5 || p.top + p.h < y - vh * 0.5) continue;
      const off = (p.top + p.h / 2 - mid) * p.depth;
      p.el.style.transform = `translate3d(0, ${(-off).toFixed(1)}px, 0)`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  measure(); frame();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); frame(); });
  window.addEventListener('load', () => { measure(); frame(); });
  return () => { measure(); frame(); };
}

/* a handful of gold motes drifting upward; the canvas pauses when the tab is hidden */
export function initParticles() {
  if (reducedMotion()) return;
  const c = document.createElement('canvas');
  c.className = 'dust'; c.setAttribute('aria-hidden', 'true');
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  let w, h, dpr;
  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr;
  };
  resize(); addEventListener('resize', resize);
  const N = 18;
  const motes = Array.from({ length: N }, () => ({
    x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.6,
    v: 0.00006 + Math.random() * 0.00012, sway: Math.random() * Math.PI * 2, tw: Math.random() * Math.PI * 2,
  }));
  let last = performance.now(), run = true;
  document.addEventListener('visibilitychange', () => {
    run = !document.hidden; if (run) { last = performance.now(); requestAnimationFrame(draw); }
  });
  function draw(now) {
    if (!run) return;
    const dt = Math.min(64, now - last); last = now;
    ctx.clearRect(0, 0, w, h);
    for (const m of motes) {
      m.y -= m.v * dt; m.sway += dt * 0.0006; m.tw += dt * 0.002;
      if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
      const x = (m.x + Math.sin(m.sway) * 0.015) * w, y = m.y * h, a = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(m.tw));
      const g = ctx.createRadialGradient(x, y, 0, x, y, m.r * 3 * dpr);
      g.addColorStop(0, `rgba(236, 200, 120, ${a})`); g.addColorStop(1, 'rgba(236, 200, 120, 0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, m.r * 3 * dpr, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
