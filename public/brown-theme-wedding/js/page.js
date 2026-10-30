/* InvitationPage — one canvas with the artwork's aspect ratio.
   Overlays are placed by their CENTRE in percent of the canvas (x, y) with a
   width in percent; heights follow each picture's own proportions, so the whole
   composition scales as one. Text sizes are in cqw (percent of canvas width). */
import { h } from './util.js';
import { artSizes } from './art-sizes.js';

export function InvitationPage(n, overlays, { lazy = true } = {}) {
  const [w, hgt] = artSizes[`bg${n}`];
  const page = h('section', { class: 'page', id: `page-${n}`, style: { aspectRatio: `${w} / ${hgt}` }, 'data-page': n });
  page.append(h('img', { class: 'bg', src: `assets/bg${n}.webp`, alt: '', loading: lazy ? 'lazy' : 'eager', decoding: 'async', fetchpriority: lazy ? 'low' : 'high', width: w, height: hgt }));
  for (const o of overlays) page.append(o);
  return page;
}

/* a picture from the pack: art('p1-ganesha', { x, y, w, delay, motion }) */
export function art(id, { x, y, w, delay = 0, motion = '', z = 2, reveal = true, alt = '', cls = '' } = {}) {
  const [iw, ih] = artSizes[id];
  const el = h('div', { class: `el ${reveal ? 'reveal' : ''} ${cls}`, style: { left: `${x}%`, top: `${y}%`, width: `${w}%`, zIndex: z, '--d': `${delay}s` } });
  const inner = h('div', { class: motion, style: { '--sd': `${-(x * 0.13 + y * 0.07) % 7}s` } });
  inner.append(h('img', { src: `assets/${id}.webp`, alt, width: iw, height: ih, loading: 'lazy', decoding: 'async', style: { aspectRatio: `${iw} / ${ih}` } }));
  el.append(inner);
  return el;
}

/* text: txt(['line', 'line'], { x, y, w, size, cls }) — size in cqw, lh = line-height */
export function txt(lines, { x = 50, y, w = 90, size = 3.4, cls = 'serif', lh = 1.3, delay = 0, z = 3, html = false } = {}) {
  const el = h('div', { class: 'el reveal', style: { left: `${x}%`, top: `${y}%`, width: `${w}%`, zIndex: z, '--d': `${delay}s` } });
  const t = h('div', { class: `txt ${cls}`, style: { fontSize: `${size}cqw`, lineHeight: lh } });
  for (const l of [].concat(lines)) t.append(html ? h('span', { class: 'l', html: l }) : h('span', { class: 'l' }, l));
  el.append(t);
  return el;
}

/* the thin gold rule with an ornament in the middle */
export function divider({ x = 50, y, w = 30, glyph = '❖', delay = 0, plain = false } = {}) {
  const el = h('div', { class: 'el reveal', style: { left: `${x}%`, top: `${y}%`, width: `${w}%`, '--d': `${delay}s`, zIndex: 3 } });
  el.append(h('div', { class: `divider ${plain ? 'plain' : ''}` }, h('i', {}, glyph)));
  return el;
}

/* any custom node at a position */
export function at(node, { x = 50, y, w, z = 4, reveal = true, delay = 0, hit = false, cls = '' } = {}) {
  const el = h('div', { class: `el ${reveal ? 'reveal' : ''} ${hit ? 'hit' : ''} ${cls}`, style: { left: `${x}%`, top: `${y}%`, width: `${w}%`, zIndex: z, '--d': `${delay}s` } });
  el.append(node);
  return el;
}
