/* ScratchDate — page 3. The gold plate painted into 3.png is covered by a canvas
   that shows the same plate; scratching (pointer or touch) rubs it away to the
   pack's gold-brush plate with the date beneath. A tap on "Scratch to Reveal"
   (keyboard too) wipes it with an animation; the date is also announced. */
import { h, reducedMotion } from './util.js';
import { at } from './page.js';
import { artSizes } from './art-sizes.js';

export function ScratchDate(cfg, { plate, onRevealed }) {
  /* plate: { x, y, w, h } of the gold plate in percent of the page */
  const [aw, ah] = artSizes['plate-after'];
  const under = h('img', { class: 'plate-after', src: 'assets/plate-after.webp', alt: `${cfg.day} ${cfg.month} ${cfg.year}`, width: aw, height: ah, loading: 'lazy', decoding: 'async' });
  const label = `${cfg.day} ${cfg.month} ${cfg.year}`;
  const ownText = label !== cfg.artworkLabel
    ? h('div', { class: 'plate-text', 'aria-hidden': 'true' }, h('b', {}, cfg.day), h('span', {}, `${cfg.month} ${cfg.year}`))
    : null;
  const canvas = h('canvas', { class: 'scratch', 'aria-hidden': 'true' });
  const box = h('div', { class: 'scratch-box', id: 'date-plate', role: 'img', 'aria-label': `Scratch to reveal the date: ${label}` }, under, ownText, canvas);
  const wrap = at(box, { x: plate.x, y: plate.y, w: plate.w, z: 4, reveal: false, hit: true });
  wrap.style.height = `${plate.h}%`;
  box.style.height = '100%';

  const ctx = canvas.getContext('2d');
  const cover = new Image(); cover.src = 'assets/plate-before.webp';
  let W = 0, H = 0, revealed = false, scratched = 0, painted = false;

  function paint() {
    const r = box.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    if (cover.complete && cover.naturalWidth) ctx.drawImage(cover, 0, 0, W, H); else ctx.fillStyle = '#d9b45a', ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'destination-out';
    painted = true;
  }
  cover.onload = () => { if (!revealed) paint(); };
  new ResizeObserver(() => { if (!revealed && (!painted || Math.abs(W - box.clientWidth) > 1)) paint(); }).observe(box);

  function rub(x, y) {
    const r = Math.max(14, W * 0.07);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    scratched += r * r * 3.14 * 0.6; // rough coverage estimate, overlaps counted twice on purpose
    if (scratched > W * H * 0.85) reveal();
  }
  let down = false, last = null;
  const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  canvas.addEventListener('pointerdown', (e) => { if (revealed) return; down = true; canvas.setPointerCapture(e.pointerId); last = pos(e); rub(...last); hint.classList.add('dim'); e.preventDefault(); });
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
    box.classList.add('revealed');
    hint.classList.add('dim');
    hintBtn.setAttribute('aria-expanded', 'true');
    live.textContent = `Our date: ${label}`;
    setTimeout(() => canvas.remove(), reducedMotion() ? 50 : 1400);
    if (onRevealed) onRevealed();
  }

  const hintBtn = h('button', { class: 'pill outline', type: 'button', 'aria-controls': 'date-plate', 'aria-expanded': 'false', onclick: reveal },
    h('span', {}, 'Scratch to Reveal'), h('i', { class: 'ico', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 11.5V5.5a1.5 1.5 0 0 1 3 0V11m0-3.5a1.5 1.5 0 0 1 3 0V12m0-2a1.5 1.5 0 0 1 3 0v5.5a5 5 0 0 1-5 5h-1.6a5 5 0 0 1-4-2L5.2 15a1.5 1.5 0 0 1 2.3-1.9L9 14.5V8"/></svg>' }));
  const hint = at(hintBtn, { x: 50, y: plate.hintY, w: 44, hit: true, delay: 0.6, cls: 'hint-wrap' });
  const live = h('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
  hint.append(live);
  return [wrap, hint];
}
