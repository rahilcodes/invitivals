/* InvitationPage: one canvas with its reference's aspect ratio. The plate fills it and every overlay takes
   its box, in % of the canvas, from js/art.js (measured by the build tool), so background, text and
   controls scale together as one layout and settle exactly where the reference puts them. */
import { h } from './util.js';
import { art } from './art.js';

export function InvitationPage(n, overlays, { satin = true } = {}) {
  const [w, ph] = art[`plate${n}`].px;
  const page = h('section', { class: 'page', id: `page-${n}`, style: { aspectRatio: `${w} / ${ph}` }, 'data-page': n });
  const plate = h('img', { class: 'plate', src: `assets/plate${n}.webp`, alt: '', decoding: n === 1 ? 'sync' : 'async', loading: n <= 2 ? 'eager' : 'lazy', width: w, height: ph });
  // overlays wait for their plate, so a slow connection never shows them floating on an empty page
  const ready = () => page.classList.add('ready');
  plate.addEventListener('load', ready); plate.addEventListener('error', ready);
  if (plate.complete) ready();
  page.append(plate);
  for (const o of overlays) if (o) page.append(o);
  // the satin band lies across the joining line with the page above, centred on the boundary
  if (satin) page.append(h('div', { class: 'satin', 'aria-hidden': 'true' }, h('img', { src: 'assets/satin.webp', alt: '', decoding: 'async', width: 2172, height: 230 })));
  return page;
}

export const box = (id) => {
  const a = art[id];
  return { left: `${a.x}%`, top: `${a.y}%`, width: `${a.w}%`, height: `${a.h}%` };
};

/* an overlay picture: spr('p1-name1', { delay, z, alt }) */
export function spr(id, { delay = 0, z = 2, alt = '', cls = '', still = false } = {}) {
  const el = h('div', { class: `s ${still ? '' : 'reveal'} ${cls}`, style: { ...box(id), zIndex: z, '--d': `${delay}s` } });
  el.append(h('img', { src: `assets/${id}.webp`, alt, decoding: 'async', draggable: 'false' }));
  return el;
}

/* text in the reference's lettering while the value is the reference's; live text in its box once it is edited */
export function textOr(value, refValue, id, { size = 3.4, cls = 'serif', delay = 0, z = 3, still = false, align = 'center' } = {}) {
  if (value === refValue) return spr(id, { delay, z, alt: value, still });
  return h('div', { class: `s live ${still ? '' : 'reveal'} ${cls} ${align}`, style: { ...box(id), zIndex: z, fontSize: `${size}cqw`, '--d': `${delay}s` } }, value);
}

/* a real control over its artwork (which may be painted into the plate) */
export function control(id, node, { z = 6, cls = '' } = {}) {
  const el = h('div', { class: `s hit ${cls}`, style: { ...box(id), zIndex: z } });
  el.append(node);
  return el;
}
