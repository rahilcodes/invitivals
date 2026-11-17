/* SparkleOverlay: delicate champagne-gold shimmer drifting down over the whole invitation.
   One viewport-fixed canvas, pointer-events none, about 15–25 particles on a phone: soft dust of
   different sizes, speeds and brightness, some twinkling, a few star-shaped metallic glints.
   Time-based, paused when the tab is hidden, absent under prefers-reduced-motion. */
import { h, reducedMotion } from './util.js';

export function SparkleOverlay() {
  if (reducedMotion()) return { show() {}, hide() {} };
  const c = h('canvas', { class: 'sparkle', 'aria-hidden': 'true' });
  document.body.append(c);
  const ctx = c.getContext('2d');
  let W = 0, H = 0, raf = 0, running = false, last = 0;
  const TONES = [[255, 228, 170], [255, 214, 128], [243, 196, 98], [255, 236, 196]];
  const P = [];
  const spawn = (p = {}, fresh = false) => Object.assign(p, {
    x: Math.random() * W,
    y: fresh ? -8 : Math.random() * H,
    star: Math.random() < 0.16,
    r: 0.6 + Math.random() * 1.3,
    vy: 14 + Math.random() * 30,          // px per second, gentle fall
    drift: (Math.random() - 0.5) * 10,    // px per second sideways
    sway: 6 + Math.random() * 14,         // px of side-to-side wander
    phase: Math.random() * Math.PI * 2,
    tw: 0.6 + Math.random() * 2.2,        // twinkle speed
    twinkle: Math.random() < 0.55,
    max: 0.28 + Math.random() * 0.5,
    tone: TONES[(Math.random() * TONES.length) | 0],
    spin: Math.random() * Math.PI,
    age: 0,
  });
  function resize() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
    c.style.width = W + 'px'; c.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.max(15, Math.min(40, Math.round((W * H) / 15000)));
    while (P.length < n) P.push(spawn({}));
    P.length = n;
  }
  function star(x, y, s, a, rot, [r, g, b]) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const rad = i % 2 ? s * 0.22 : s, t = (i * Math.PI) / 4;
      ctx[i ? 'lineTo' : 'moveTo'](Math.cos(t) * rad, Math.sin(t) * rad);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    ctx.clearRect(0, 0, W, H);
    const t = now / 1000;
    for (const p of P) {
      p.age += dt;
      p.y += p.vy * dt;
      p.x += (p.drift + Math.cos(t * 0.5 + p.phase) * p.sway * 0.35) * dt;
      if (p.y > H + 10 || p.x < -10 || p.x > W + 10) spawn(p, true);
      const fadeIn = Math.min(1, p.age / 1.6), fadeOut = Math.min(1, (H + 10 - p.y) / 60);
      const shimmer = p.twinkle ? 0.55 + 0.45 * Math.sin(t * p.tw * 3 + p.phase) : 1;
      const a = p.max * fadeIn * fadeOut * shimmer;
      if (a <= 0.01) continue;
      const [r, g, b] = p.tone;
      if (p.star) {
        star(p.x, p.y, p.r * 3.2, a, p.spin + t * 0.3, p.tone);
        continue;
      }
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      glow.addColorStop(0, `rgba(${r},${g},${b},${a})`);
      glow.addColorStop(0.45, `rgba(${r},${g},${b},${a * 0.35})`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }
  const start = () => { if (running) return; running = true; last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (c.classList.contains('shown')) start(); });
  return {
    show() { resize(); c.classList.add('shown'); start(); },
    hide() { c.classList.remove('shown'); stop(); },
  };
}
