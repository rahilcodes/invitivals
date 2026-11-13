/* ScratchCard — the pack's gold foil over the pack's date card. The guest rubs the foil away with a finger
   or the mouse (the pack's ivory brush is the eraser, turned along the stroke); past half the card the rest
   melts away and the date stays revealed. "Tap to reveal" does the same for keyboards and screen readers. */
import { h, icons, lines, reducedMotion } from './util.js?v=5';

export function ScratchCard(cfg, wedding) {
  const canvas = h('canvas', { class: 'foil', 'aria-hidden': 'true' });
  const label = h('div', { class: 'foil-label', 'aria-hidden': 'true' },
    h('span', { class: 'heart', html: icons.heart }), h('span', { class: 'word' }, cfg.foil), h('span', { class: 'hand', html: icons.hand }));
  const date = h('div', { class: 'date', 'aria-live': 'polite' },
    h('span', { class: 'weekday' }, wedding.weekday),
    h('span', { class: 'day' }, wedding.dateLine),
    h('span', { class: 'rule', 'aria-hidden': 'true' }, h('i'), h('b', { html: icons.heart }), h('i')));
  const card = h('div', { class: 'card' }, h('img', { class: 'card-art', src: 'assets/card.webp', alt: '', decoding: 'async', draggable: 'false' }), date, canvas, label);
  const fallback = h('button', { class: 'reveal-btn', type: 'button', 'aria-controls': 'date-card', 'aria-expanded': 'false' }, cfg.fallback);
  card.id = 'date-card';
  const root = h('div', { class: 'scratch' }, card, fallback);

  const ctx = canvas.getContext('2d');
  const foil = new Image(); foil.src = 'assets/foil.webp'; foil.decoding = 'async';
  const brush = new Image(); brush.src = 'assets/brush.webp'; brush.decoding = 'async';
  let W = 0, H = 0, dpr = 1, revealed = false, drawing = false, lastX = 0, lastY = 0, moved = 0;

  function paint() {
    const r = card.getBoundingClientRect();
    if (!r.width) return;
    dpr = Math.min(2, devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    if (foil.complete && foil.naturalWidth) ctx.drawImage(foil, 0, 0, W, H);
    else { ctx.fillStyle = '#d4b26a'; ctx.fillRect(0, 0, W, H); }
    if (brush.complete && brush.naturalWidth) {
      const bw = W * 0.86, bh = bw * (brush.naturalHeight / brush.naturalWidth) * 1.7;
      ctx.save(); ctx.globalAlpha = 0.78; ctx.translate(W / 2, H / 2); ctx.rotate(-0.12);
      ctx.drawImage(brush, -bw / 2, -bh / 2, bw, bh); ctx.restore();
    }
  }
  foil.addEventListener('load', () => { if (!revealed && !moved) paint(); });
  brush.addEventListener('load', () => { if (!revealed && !moved) paint(); });
  new ResizeObserver(() => { if (!revealed && !moved) paint(); }).observe(card);

  function stamp(x, y, angle) {
    ctx.globalCompositeOperation = 'destination-out';
    const w = W * 0.34, hh = w * (500 / 1860) * 1.6;
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    if (brush.complete && brush.naturalWidth) ctx.drawImage(brush, -w / 2, -hh / 2, w, hh);
    else { ctx.beginPath(); ctx.arc(0, 0, w * 0.18, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function cleared() {
    const step = 6 * dpr, data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let n = 0, clear = 0;
    for (let y = 0; y < canvas.height; y += step) for (let x = 0; x < canvas.width; x += step) { n++; if (data[(y * canvas.width + x) * 4 + 3] < 40) clear++; }
    return n ? clear / n : 0;
  }
  function reveal() {
    if (revealed) return; revealed = true;
    root.classList.add('revealed');
    fallback.setAttribute('aria-expanded', 'true');
    fallback.textContent = cfg.revealed;
    fallback.disabled = true;
    canvas.style.pointerEvents = 'none';
  }
  const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  canvas.addEventListener('pointerdown', (e) => {
    if (revealed) return;
    drawing = true; canvas.setPointerCapture(e.pointerId);
    [lastX, lastY] = pos(e); moved++;
    label.classList.add('fade');
    stamp(lastX, lastY, Math.random() * 0.6 - 0.3);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drawing || revealed) return;
    const [x, y] = pos(e);
    const dx = x - lastX, dy = y - lastY, dist = Math.hypot(dx, dy);
    if (dist < 3) return;
    const angle = Math.atan2(dy, dx);
    const steps = Math.ceil(dist / (W * 0.03));
    for (let i = 1; i <= steps; i++) stamp(lastX + (dx * i) / steps, lastY + (dy * i) / steps, angle);
    lastX = x; lastY = y;
  });
  const end = () => { if (!drawing) return; drawing = false; if (cleared() > 0.5) reveal(); };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('lostpointercapture', end);
  fallback.addEventListener('click', reveal);
  if (reducedMotion()) root.classList.add('no-motion');
  void lines;
  return root;
}
