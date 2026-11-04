/* MemoriesCarousel: page 6. The three photos are real cards on one 3D ring over the gold stage: the
   centre one front-facing in the ornate frame, the others angled left and right exactly where the
   reference paints them. A clearly horizontal swipe turns the ring: swipe LEFT and the RIGHT photo
   glides to the centre (the centre one goes left, the left one passes behind to the right); swipe RIGHT
   the other way. It loops both ways, follows the finger, never double-triggers, and leaves vertical
   scrolling to the page (touch-action: pan-y; only a horizontal gesture is captured). */
import { h, reducedMotion } from './util.js';
import { box } from './page.js';
import { art } from './art.js';

const SLOT = { C: { x: 0, z: 0, ry: 0 }, R: { x: 39.96, z: -19.98, ry: 41 }, L: { x: -39.96, z: -19.98, ry: -41 }, B: { x: 0, z: -62, ry: 0 } };
/* with four photos the fourth waits behind the centre one, hidden by it, and comes round the side when the ring turns */
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (p, q, t) => ({ x: lerp(p.x, q.x, t), z: lerp(p.z, q.z, t), ry: lerp(p.ry, q.ry, t) });
/* where a card is, moving from slot a to slot b, at fraction t; the card that wraps goes round the back */
function pose(a, b, t) {
  if (t <= 0 || a === b) return SLOT[a];
  if (t >= 1) return SLOT[b];
  if ((a === 'L' && b === 'R') || (a === 'R' && b === 'L')) return t < 0.5 ? mix(SLOT[a], SLOT.B, t * 2) : mix(SLOT.B, SLOT[b], t * 2 - 1);
  if (a === 'B' || b === 'B') { const p = mix(SLOT[a], SLOT[b], t); p.ry = lerp(SLOT[a].ry, SLOT[b].ry, t); return p; }
  return mix(SLOT[a], SLOT[b], t);
}

export function MemoriesCarousel(photos) {
  const win = art['p6-window'], stageBox = art['p6-swipe'];
  const stage = h('div', { class: 's stage', role: 'region', 'aria-roledescription': 'carousel', 'aria-label': 'Our memories: swipe sideways to turn the photos', tabindex: '0', style: { ...box('p6-swipe'), zIndex: 2 } });
  // every card has the centre window's size, placed at its position inside the stage, then posed in 3D
  const cardStyle = { left: `${((win.x - stageBox.x) / stageBox.w) * 100}%`, top: `${((win.y - stageBox.y) / stageBox.h) * 100}%`, width: `${(win.w / stageBox.w) * 100}%`, height: `${(win.h / stageBox.h) * 100}%` };
  const cards = photos.map((p, i) => h('div', { class: 'card', role: 'group', 'aria-label': `Photo ${i + 1} of ${photos.length}`, style: cardStyle },
    h('img', { src: p.src, alt: p.alt || '', decoding: 'async', draggable: 'false', style: { objectPosition: p.pos || '50% 50%' } })));
  cards.forEach((c) => stage.append(c));
  const hint = h('div', { class: 'tap-hint swipe-hint', 'aria-hidden': 'true' }, 'Swipe');

  const n = photos.length;
  // slot of photo (idx + k): centre, left, (behind, when there are four), right — the reference has photo 2 on the left, photo 3 on the right
  const order = photos.length > 3 ? ['C', 'L', 'B', 'R'] : ['C', 'L', 'R'];
  let idx = 0, drag = null, animating = false;
  const wrap = (i) => ((i % n) + n) % n;
  const slotOf = (i, base) => order[wrap(i - base)];
  const apply = (card, p, lit) => {
    card.style.transform = `translate3d(${p.x}cqw, 0, ${p.z}cqw) rotateY(${p.ry}deg)`;
    card.style.zIndex = String(100 + Math.round(p.z));
    card.classList.toggle('front', lit);
  };
  /* dir = -1: the ring turns so the RIGHT photo comes to the centre (a swipe to the left); +1 brings the LEFT one; t = how far along, 0..1 */
  function render(dir, t) {
    for (let i = 0; i < n; i++) {
      const from = slotOf(i, idx), to = slotOf(i, wrap(idx + dir));
      const p = dir === 0 ? SLOT[from] : pose(from, to, t);
      apply(cards[i], p, (t < 0.5 ? from : to) === 'C');
    }
  }
  function settle(dir, from) {
    const to = dir === 0 ? 0 : 1;
    if (reducedMotion()) { idx = wrap(idx + dir); render(0, 0); return; }
    animating = true;
    const t0 = performance.now(), dur = 420 + Math.abs(to - from) * 330;
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const step = (now) => {
      const u = Math.min(1, (now - t0) / dur);
      if (u < 1) { render(dir || 1, dir ? lerp(from, to, ease(u)) : lerp(from, 0, ease(u))); requestAnimationFrame(step); return; }
      idx = wrap(idx + dir); animating = false; render(0, 0);
    };
    requestAnimationFrame(step);
  }
  const turn = (dir) => { if (!animating) { hint.classList.add('gone'); settle(dir, 0); } };

  stage.addEventListener('pointerdown', (e) => {
    if (animating || (e.pointerType === 'mouse' && e.button !== 0)) return;
    drag = { x: e.clientX, y: e.clientY, id: e.pointerId, dir: 0, t: 0, moved: false, target: e.target };
  });
  stage.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx) * 0.9) { drag = null; return; } // a vertical scroll: the page's
      drag.moved = true; stage.setPointerCapture(e.pointerId); stage.classList.add('dragging'); hint.classList.add('gone');
    }
    drag.dir = dx < 0 ? -1 : 1;
    drag.t = Math.min(1, Math.abs(dx) / (stage.clientWidth * 0.55));
    render(drag.dir, drag.t);
  });
  const end = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null; stage.classList.remove('dragging');
    if (!d.moved) {
      // a tap on a side photo brings it to the centre
      const card = d.target.closest && d.target.closest('.card');
      if (card) { const i = cards.indexOf(card); const s = slotOf(i, idx); if (s === 'R') turn(-1); else if (s === 'L') turn(1); }
      return;
    }
    if (d.t > 0.28) settle(d.dir, d.t); else { animating = true; const t0 = performance.now(); const back = (now) => { const u = Math.min(1, (now - t0) / 260); render(d.dir, d.t * (1 - u)); if (u < 1) requestAnimationFrame(back); else { animating = false; render(0, 0); } }; requestAnimationFrame(back); }
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') turn(-1); if (e.key === 'ArrowLeft') turn(1); });
  render(0, 0);
  return [stage, hint];
}
