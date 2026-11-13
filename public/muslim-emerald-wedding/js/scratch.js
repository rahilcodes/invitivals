/* ScratchDate — page 3. The reference plate already shows the revealed date on
   its gold-brush plaque. A canvas painted with the plain gold plate (cut from
   the pack's blank 3.png) covers exactly that plaque; the seal that overlaps
   the plaque's corner is left uncovered so it never doubles. Scratching with a
   finger or mouse rubs the cover away; the painted "Scratch to Reveal" pill is
   a tap fallback that wipes it. The date is announced for screen readers. */
import { h, reducedMotion } from './util.js';
import { at, hotspot } from './page.js';

export function ScratchDate(cfg, { plate, pill, seal }) {
  /* plate / pill: { x, y, w, h } in percent of the page; seal: { cx, cy, r } relative to the plate box */
  const label = `${cfg.day} ${cfg.month} ${cfg.year}`;
  const canvas = h('canvas', { class: 'scratch', 'aria-hidden': 'true' });
  const box = h('div', { class: 'scratch-box', id: 'date-plate', role: 'img', 'aria-label': `Scratch to reveal the date: ${label}` }, canvas);
  const wrap = at(box, { x: plate.x, y: plate.y, w: plate.w, h: plate.h, z: 4, hit: true });
  box.style.height = '100%';

  const ctx = canvas.getContext('2d');
  const cover = new Image(); cover.src = 'assets/plate-cover.webp';
  let W = 0, H = 0, revealed = false, scratched = 0, painted = false;

  function paint() {
    const r = box.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    if (cover.complete && cover.naturalWidth) ctx.drawImage(cover, 0, 0, W, H); else { ctx.fillStyle = '#d9b45a'; ctx.fillRect(0, 0, W, H); }
    ctx.globalCompositeOperation = 'destination-out';
    // the seal painted over the plaque's corner stays visible from the start
    ctx.beginPath(); ctx.arc(seal.cx * W, seal.cy * H, seal.r * W, 0, Math.PI * 2); ctx.fill();
    painted = true;
  }
  cover.onload = () => { if (!revealed) paint(); };
  new ResizeObserver(() => { if (!revealed && (!painted || Math.abs(W - box.clientWidth) > 1)) paint(); }).observe(box);

  function rub(x, y) {
    const r = Math.max(14, W * 0.07);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    scratched += r * r * 3.14 * 0.6; // rough coverage estimate
    if (scratched > W * H * 0.85) reveal();
  }
  let down = false, last = null;
  const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  canvas.addEventListener('pointerdown', (e) => { if (revealed) return; down = true; canvas.setPointerCapture(e.pointerId); last = pos(e); rub(...last); e.preventDefault(); });
  canvas.addEventListener('pointermove', (e) => {
    if (!down || revealed) return;
    const p = pos(e);
    const d = Math.hypot(p[0] - last[0], p[1] - last[1]), n = Math.ceil(d / 6);
    for (let i = 1; i <= n; i++) rub(last[0] + (p[0] - last[0]) * i / n, last[1] + (p[1] - last[1]) * i / n);
    last = p; e.preventDefault();
  });
  const up = () => { down = false; };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);

  function reveal() {
    if (revealed) return; revealed = true;
    canvas.classList.add('gone');
    pillBtn.setAttribute('aria-expanded', 'true');
    live.textContent = `Our date: ${label}`;
    setTimeout(() => canvas.remove(), reducedMotion() ? 50 : 1400);
  }
  const pillBtn = h('button', { type: 'button', 'aria-label': 'Scratch to reveal the date', 'aria-controls': 'date-plate', 'aria-expanded': 'false', onclick: reveal });
  const live = h('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
  const pillHit = hotspot(pillBtn, pill);
  pillHit.append(live);
  return [wrap, pillHit];
}
