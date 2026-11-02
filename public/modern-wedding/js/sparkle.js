/* SparkleOverlay — a few champagne, dusty-mauve and rose-gold motes drifting gently down, the odd
   satin petal among them, and a micro-glitter trail under the guest's finger. One fixed canvas with
   pointer-events none, so it never blocks scrolling, links or inputs; the trail listens passively.
   Off entirely for reduced motion. */
import { h, reducedMotion } from './util.js';

const TINTS = [[243, 220, 180], [243, 220, 180], [236, 206, 170], [201, 162, 184], [227, 180, 160], [214, 182, 150]];
const PETAL = [233, 207, 217];

export function SparkleOverlay() {
  if (reducedMotion()) return { show() {}, hide() {} };
  const c = h('canvas', { class: 'sparkle', 'aria-hidden': 'true' });
  document.body.append(c);
  const ctx = c.getContext('2d');
  let W = 0, H = 0, dpr = 1, raf = 0, running = false, last = 0;
  const N = 26;
  const P = [], T = []; // drifting motes, touch glitter

  const spawn = (p = {}) => {
    const petal = Math.random() < 0.07;
    return Object.assign(p, {
      kind: petal ? 'petal' : Math.random() < 0.35 ? 'star' : 'dust',
      tint: petal ? PETAL : TINTS[(Math.random() * TINTS.length) | 0],
      x: Math.random() * W, y: -10 - Math.random() * H * 0.2,
      r: petal ? 2.6 + Math.random() * 2.2 : 0.6 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.12, vy: petal ? 0.22 + Math.random() * 0.2 : 0.12 + Math.random() * 0.22,
      sway: Math.random() * Math.PI * 2, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.01,
      a: 0, max: petal ? 0.32 + Math.random() * 0.18 : 0.22 + Math.random() * 0.3, life: 0, span: 700 + Math.random() * 700,
    });
  };
  function resize() {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const rgba = (t, a) => `rgba(${t[0]},${t[1]},${t[2]},${a})`;
  function star(x, y, r, tint, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
    g.addColorStop(0, rgba(tint, a)); g.addColorStop(1, rgba(tint, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = rgba([255, 248, 236], a * 0.9); ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(x - r * 2.4, y); ctx.lineTo(x + r * 2.4, y); ctx.moveTo(x, y - r * 2.4); ctx.lineTo(x, y + r * 2.4); ctx.stroke();
  }
  function tick(now) {
    if (!running) return;
    const dt = Math.min(2, (now - last) / 16.7 || 1); last = now;
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      p.life += dt;
      const t = p.life / p.span;
      p.a = p.max * Math.sin(Math.PI * Math.min(1, t)); // ease in, ease out: never a flash
      p.sway += 0.01 * dt; p.rot += p.vr * dt;
      p.x += (p.vx + Math.sin(p.sway) * 0.08) * dt; p.y += p.vy * dt;
      if (t >= 1 || p.y > H + 12) spawn(p);
      if (p.kind === 'petal') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = rgba(p.tint, p.a); ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      } else if (p.kind === 'star') star(p.x, p.y, p.r, p.tint, p.a);
      else {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        g.addColorStop(0, rgba(p.tint, p.a)); g.addColorStop(1, rgba(p.tint, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2); ctx.fill();
      }
    }
    for (let i = T.length - 1; i >= 0; i--) {
      const q = T[i]; q.life += dt;
      const t = q.life / q.span; if (t >= 1) { T.splice(i, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= 0.94; q.vy = q.vy * 0.94 + 0.02 * dt;
      const a = q.max * (1 - t) * Math.min(1, t * 6);
      if (q.star) star(q.x, q.y, q.r, q.tint, a);
      else { ctx.fillStyle = rgba(q.tint, a); ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); ctx.fill(); }
    }
    raf = requestAnimationFrame(tick);
  }
  /* the finger trail: a small cluster near the touch that follows its motion and fades */
  let px = null, py = null, lastSpawn = 0;
  function trail(x, y, dx, dy) {
    if (!running || T.length > 90) return;
    const n = 2 + (Math.random() * 2 | 0);
    for (let i = 0; i < n; i++) T.push({
      x: x + (Math.random() - 0.5) * 14, y: y + (Math.random() - 0.5) * 14,
      vx: dx * 0.12 + (Math.random() - 0.5) * 0.6, vy: dy * 0.12 + (Math.random() - 0.5) * 0.6,
      r: 0.7 + Math.random() * 1.3, tint: TINTS[(Math.random() * TINTS.length) | 0], star: Math.random() < 0.3,
      max: 0.45 + Math.random() * 0.35, life: 0, span: 28 + Math.random() * 26,
    });
  }
  function onMove(e) {
    const now = performance.now(); if (now - lastSpawn < 14) return; lastSpawn = now;
    const t = e.touches ? e.touches[0] : e; if (!t) return;
    const dx = px == null ? 0 : t.clientX - px, dy = py == null ? 0 : t.clientY - py;
    px = t.clientX; py = t.clientY;
    trail(t.clientX, t.clientY, dx, dy);
  }
  const onEnd = () => { px = py = null; };
  addEventListener('resize', resize, { passive: true });
  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('touchmove', onMove, { passive: true });
  addEventListener('touchstart', onMove, { passive: true });
  addEventListener('pointerup', onEnd, { passive: true });
  addEventListener('touchend', onEnd, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { running = false; cancelAnimationFrame(raf); } else if (c.classList.contains('shown')) { running = true; last = performance.now(); tick(last); } });
  return {
    show() {
      resize();
      if (!P.length) for (let i = 0; i < N; i++) { const p = spawn({}); p.y = Math.random() * H; p.life = Math.random() * p.span; P.push(p); }
      c.classList.add('shown'); running = true; cancelAnimationFrame(raf); last = performance.now(); tick(last);
    },
    hide() { c.classList.remove('shown'); running = false; cancelAnimationFrame(raf); },
  };
}
