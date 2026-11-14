/* InvitationPage: one canvas with its reference's aspect ratio. The plate fills it, and every
   overlay takes its box, in % of the canvas, from js/art.js (measured by the build tool), so the whole
   composition scales as one and settles exactly as the reference. */
import { h } from './util.js';
import { art } from './art.js';

export function InvitationPage(n, overlays) {
  const [w, ph] = art[`plate${n}`].px;
  const page = h('section', { class: 'page', id: `page-${n}`, style: { aspectRatio: `${w} / ${ph}` }, 'data-page': n });
  const plate = h('img', { class: 'plate', src: `assets/plate${n}.webp`, alt: '', decoding: 'sync', width: w, height: ph });
  // overlays wait for their plate, so a slow connection never shows them floating on an empty page
  const ready = () => page.classList.add('ready');
  plate.addEventListener('load', ready); plate.addEventListener('error', ready);
  if (plate.complete) ready();
  page.append(plate);
  for (const o of overlays) if (o) page.append(o);
  return page;
}

export const box = (id) => {
  const a = art[id];
  return { left: `${a.x}%`, top: `${a.y}%`, width: `${a.w}%`, height: `${a.h}%` };
};

/* an overlay picture: spr('p1-groom', { delay, motion, z, alt }) */
export function spr(id, { delay = 0, motion = '', z = 2, alt = '', cls = '', still = false, origin = '', slow = false } = {}) {
  const el = h('div', { class: `s ${still ? '' : 'reveal'} ${slow ? 'slow' : ''} ${cls}`, style: { ...box(id), zIndex: z, '--d': `${delay}s` } });
  const img = h('img', { src: `assets/${id}.webp`, alt, decoding: 'async', draggable: 'false', class: motion });
  if (origin) img.style.transformOrigin = origin;
  el.append(img);
  return el;
}

/* text in the reference's lettering while the value is the reference's; live text in its box once it is edited */
export function textOr(value, refValue, id, { size = 3.4, cls = 'serif', delay = 0, z = 3, hold = false, slow = false } = {}) {
  if (value === refValue) return spr(id, { delay, z, alt: value, cls: hold ? 'hold' : '', still: hold, slow });
  return h('div', { class: `s live ${hold ? 'hold' : 'reveal'} ${slow ? 'slow' : ''} ${cls}`, style: { ...box(id), zIndex: z, fontSize: `${size}cqw`, '--d': `${delay}s` } }, value);
}

/* a butterfly: the pack's own PNG in the reference's pose, split along its body into two wings that
   fold on the Y axis, inside a wrapper that floats and now and then makes a short flight. Every one
   gets its own timings, so no two move together. */
let bflyCount = 0;
export function butterfly(id, { z = 2 } = {}) {
  const a = art[id];
  const k = bflyCount++;
  const rnd = (lo, hi) => lo + ((Math.sin(k * 12.9898 + 78.233) * 43758.5453) % 1 + 1) % 1 * (hi - lo);
  const el = h('div', { class: 's bfly', style: { ...box(id), zIndex: z } });
  // the body line in the sprite is the PNG's vertical axis turned by rot degrees; wings are the two halves of that line
  const d = ((a.rot || 0) * Math.PI) / 180;
  const aspect = (a.w * 941) / (a.h * 1672); // box width / height in pixels
  const ax = Math.sin(d), ay = -Math.cos(d), nx = Math.cos(d), ny = Math.sin(d);
  const pt = (sx, sy) => `${(50 + sx * 100).toFixed(1)}% ${(50 + sy * 100 * aspect).toFixed(1)}%`;
  const side = (sgn) => [pt(-ax * 3, -ay * 3), pt(ax * 3, ay * 3), pt(ax * 3 + sgn * nx * 3, ay * 3 + sgn * ny * 3), pt(-ax * 3 + sgn * nx * 3, -ay * 3 + sgn * ny * 3)].join(', ');
  const wing = (cls, sgn) => h('div', { class: `wing ${cls}`, style: { clipPath: `polygon(${side(sgn)})`, '--tilt': `${a.rot || 0}deg` } },
    h('img', { src: `assets/${id}.webp`, alt: '', decoding: 'async', draggable: 'false' }));
  const body = h('div', { class: 'bfly-body', style: { '--wd': `${rnd(2.2, 3.4).toFixed(2)}s`, '--wdel': `-${rnd(0, 3).toFixed(2)}s` } }, wing('l', -1), wing('r', 1));
  const hop = h('div', { class: 'bfly-hop', style: { '--hd': `${rnd(13, 22).toFixed(1)}s`, '--hdel': `-${rnd(0, 14).toFixed(1)}s`, '--hx': `${rnd(-1, 1) < 0 ? -1 : 1}` } }, body);
  const float = h('div', { class: 'bfly-float', style: { '--fd': `${rnd(5, 8).toFixed(2)}s`, '--fdel': `-${rnd(0, 6).toFixed(2)}s` } }, hop);
  el.append(float);
  return el;
}

/* a real control over its artwork */
export function control(id, node, { delay = 0, z = 6, cls = '' } = {}) {
  const el = h('div', { class: `s hit reveal ${cls}`, style: { ...box(id), zIndex: z, '--d': `${delay}s` } });
  el.append(node);
  return el;
}

export const pic = (id, alt = '') => h('img', { src: `assets/${id}.webp`, alt, decoding: 'async', draggable: 'false' });
