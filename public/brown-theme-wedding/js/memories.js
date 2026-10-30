/* MemoriesCarousel — page 6. Photos sit inside the gold frame's window and turn
   on the Y axis: a horizontal drag rotates the current photo out and the next
   one in, looping both ways. The frame and background never move. Vertical
   scrolling stays with the page (touch-action: pan-y). */
import { h, reducedMotion } from './util.js';

export function MemoriesCarousel(photos, box /* { x, y, w, h } inner window in % */) {
  const root = h('div', { class: 'carousel', role: 'region', 'aria-roledescription': 'carousel', 'aria-label': 'Our memories', tabindex: '0',
    style: { left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%`, zIndex: 3 } });
  const cards = photos.map((p, i) => h('div', { class: 'card hidden', role: 'group', 'aria-label': `Photo ${i + 1} of ${photos.length}` },
    h('img', { src: p.src, alt: p.alt || '', loading: 'lazy', decoding: 'async', draggable: 'false' }),
    p.demo ? h('span', { class: 'demo-tag' }, 'Demo photo') : null));
  cards.forEach((c) => root.append(c));
  const dots = h('div', { class: 'dots', 'aria-hidden': 'true', style: { top: `${box.y + box.h + 2.2}%` } }, ...photos.map(() => h('i')));

  const n = photos.length;
  let idx = 0, drag = null, animating = false;
  const wrap = (i) => ((i % n) + n) % n;
  const place = (card, deg, depth = 0) => {
    card.style.transform = `translateZ(${depth}cqw) rotateY(${deg}deg)`;
    card.style.opacity = String(Math.max(0, Math.cos((deg * Math.PI) / 180)));
  };
  function render(angle = 0) {
    // angle: current drag rotation in degrees (−90…90); negative = swiping left (next comes in from the right)
    cards.forEach((c) => c.classList.add('hidden'));
    const cur = cards[idx]; cur.classList.remove('hidden'); place(cur, angle);
    if (angle < 0) { const nx = cards[wrap(idx + 1)]; nx.classList.remove('hidden'); place(nx, 90 + angle); }
    if (angle > 0) { const pv = cards[wrap(idx - 1)]; pv.classList.remove('hidden'); place(pv, -90 + angle); }
    dots.querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i === idx));
  }
  function settle(dir, fromAngle) {
    // dir: +1 next, −1 previous, 0 snap back
    if (reducedMotion()) { idx = wrap(idx + dir); render(0); return; }
    animating = true;
    const target = dir === 0 ? 0 : -dir * 90;
    const t0 = performance.now(), dur = 420 + Math.abs(target - fromAngle) * 3;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      render(fromAngle + (target - fromAngle) * ease(t));
      if (t < 1) requestAnimationFrame(step);
      else { idx = wrap(idx + dir); animating = false; render(0); }
    };
    requestAnimationFrame(step);
  }
  const go = (dir) => { if (!animating) settle(dir, 0); };

  root.addEventListener('pointerdown', (e) => {
    if (animating) return;
    drag = { x: e.clientX, y: e.clientY, id: e.pointerId, angle: 0, moved: false };
    root.classList.add('dragging');
  });
  root.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) { drag = null; root.classList.remove('dragging'); return; } // a vertical scroll, not ours
      drag.moved = true; root.setPointerCapture(e.pointerId);
    }
    drag.angle = Math.max(-90, Math.min(90, (dx / root.clientWidth) * 110));
    render(drag.angle);
  });
  const end = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const a = drag.angle; drag = null; root.classList.remove('dragging');
    if (Math.abs(a) > 22) settle(a < 0 ? 1 : -1, a); else settle(0, a);
  };
  root.addEventListener('pointerup', end);
  root.addEventListener('pointercancel', end);
  root.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
  render(0);
  return [root, dots];
}
