/* PetalOverlay — small dark-pink petals falling gently over the whole
   invitation. One fixed canvas, pointer-events none, a few dozen petals that
   drift, rotate and re-spawn above the top; the fall is tied to real time, so
   scrolling never restarts it. On wide screens the petals stay within the
   invitation column. Off under reduced motion; paused while the tab is hidden. */
import { h, reducedMotion } from './util.js?v=2';

const SHADES = ['#a83f65', '#b34870', '#9f4b68', '#b0456c'];

export function PetalOverlay({ column } = {}) {
  if (reducedMotion()) return { show() {}, hide() {} };
  const c = h('canvas', { class: 'petals', 'aria-hidden': 'true' });
  document.body.append(c);
  const ctx = c.getContext('2d');
  let W = 0, H = 0, left = 0, right = 0, dpr = 1, raf = 0, running = false, last = 0;
  const slow = (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 4) <= 2;
  const P = [];
  let N = 0;

  function bounds() {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = column && column.getBoundingClientRect();
    left = r && r.width ? r.left : 0; right = r && r.width ? r.right : W;
    const span = right - left;
    N = Math.round(Math.min(34, Math.max(14, span * H / 24000)) * (slow ? 0.6 : 1));
    while (P.length < N) P.push(spawn({}, true));
    P.length = N;
  }
  function spawn(p, anywhere = false) {
    const s = 5 + Math.random() * 5; // petal length in px
    return Object.assign(p, {
      x: left + Math.random() * (right - left), y: anywhere ? Math.random() * H : -s * 3 - Math.random() * H * 0.3,
      s, w: 0.55 + Math.random() * 0.25,
      vy: 18 + Math.random() * 22, // px per second
      sway: 10 + Math.random() * 22, ph: Math.random() * 6.28, sw: 0.5 + Math.random() * 0.7,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 1.6, tilt: Math.random() * 6.28, vt: 0.6 + Math.random() * 1.2,
      a: 0.55 + Math.random() * 0.3, color: SHADES[(Math.random() * SHADES.length) | 0], shape: Math.random(),
    });
  }
  function petal(p) {
    const s = p.s, k = Math.abs(Math.cos(p.tilt)) * 0.7 + 0.3; // the petal turns in the air: its width shrinks as it faces edge-on
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, k);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    // a teardrop petal with a slightly notched tip; two control shapes for variety
    const w = s * p.w;
    if (p.shape < 0.5) { ctx.moveTo(0, -s); ctx.bezierCurveTo(w, -s * 0.6, w, s * 0.5, 0, s); ctx.bezierCurveTo(-w, s * 0.5, -w, -s * 0.6, 0, -s); }
    else { ctx.moveTo(0, -s); ctx.bezierCurveTo(w * 1.1, -s * 0.3, w * 0.8, s * 0.8, 0.15 * w, s); ctx.quadraticCurveTo(0, s * 0.8, -0.15 * w, s); ctx.bezierCurveTo(-w * 0.8, s * 0.8, -w * 1.1, -s * 0.3, 0, -s); }
    ctx.fill();
    // a soft lighter vein so it reads as a petal, not a dot
    ctx.globalAlpha = p.a * 0.35; ctx.strokeStyle = '#e8a8bf'; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.7); ctx.quadraticCurveTo(w * 0.15, 0, 0, s * 0.75); ctx.stroke();
    ctx.restore();
  }
  function tick(t) {
    if (!running) return;
    const dt = Math.min(0.05, (t - last) / 1000 || 0); last = t;
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      p.ph += p.sw * dt; p.rot += p.vr * dt; p.tilt += p.vt * dt;
      p.y += p.vy * dt;
      p.x += Math.cos(p.ph) * p.sway * dt;
      if (p.y > H + p.s * 3) spawn(p);
      if (p.x < left - 20) p.x = right + 10; else if (p.x > right + 20) p.x = left - 10;
      petal(p);
    }
    raf = requestAnimationFrame(tick);
  }
  addEventListener('resize', () => { if (running) bounds(); }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { running = false; cancelAnimationFrame(raf); }
    else if (c.classList.contains('shown')) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); }
  });
  return {
    show() { bounds(); c.classList.add('shown'); running = true; last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); },
    hide() { c.classList.remove('shown'); running = false; cancelAnimationFrame(raf); },
  };
}
