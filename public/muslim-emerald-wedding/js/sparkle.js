/* SparkleOverlay — very sparse, slow golden dust over the whole invitation.
   A fixed canvas, few particles, low opacity, no flashing; off for reduced motion. */
import { h, reducedMotion } from './util.js';

export function SparkleOverlay() {
  if (reducedMotion()) return { show() {}, hide() {} };
  const c = h('canvas', { class: 'sparkle', 'aria-hidden': 'true' });
  document.body.append(c);
  const ctx = c.getContext('2d');
  let W = 0, H = 0, dpr = 1, raf = 0, running = false;
  const N = Math.min(48, Math.max(26, Math.round(innerWidth * innerHeight / 18000)));
  const P = [];
  const spawn = (p = {}) => Object.assign(p, {
    x: Math.random() * W, y: Math.random() * H, r: 0.8 + Math.random() * 1.6,
    vx: (Math.random() - 0.5) * 0.08, vy: 0.04 + Math.random() * 0.12, // drifting gently downward
    a: 0, max: 0.3 + Math.random() * 0.4, life: 0, span: 420 + Math.random() * 520, tw: 0.4 + Math.random() * 1.2, ph: Math.random() * 6.28,
  });
  function resize() {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      p.life++;
      const t = p.life / p.span;
      p.a = p.max * Math.sin(Math.PI * Math.min(1, t)) * (0.75 + 0.25 * Math.sin(p.life * 0.05 * p.tw + p.ph)); // ease in/out with a soft twinkle, never a flash
      p.x += p.vx; p.y += p.vy;
      if (t >= 1 || p.y > H + 10) spawn(p);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      const warm = p.tw > 1.2 ? '255,248,230' : '255,222,150';
      g.addColorStop(0, `rgba(${warm},${p.a})`);
      g.addColorStop(1, `rgba(${warm},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { running = false; cancelAnimationFrame(raf); } else if (c.classList.contains('shown')) { running = true; tick(); } });
  return {
    show() {
      resize();
      if (!P.length) for (let i = 0; i < N; i++) { const p = spawn({}); p.life = Math.random() * p.span; P.push(p); }
      c.classList.add('shown'); running = true; cancelAnimationFrame(raf); tick();
    },
    hide() { c.classList.remove('shown'); running = false; cancelAnimationFrame(raf); },
  };
}
