/* InvitationPage — one canvas with the artwork's aspect ratio (941 × 1671).
   Overlays are placed by their CENTRE in percent of the canvas (x, y) with a
   width in percent; heights follow each picture's own proportions, so the whole
   composition scales as one. Text sizes are in cqw (percent of canvas width). */
import { h } from './util.js';
import { artSizes } from './art-sizes.js';

export function InvitationPage(n, overlays, { lazy = true, cls = '' } = {}) {
  const [w, hgt] = artSizes[`bg${n}`];
  const page = h('section', { class: `page page-${n} ${cls}`, id: `page-${n}`, style: { aspectRatio: `${w} / ${hgt}` }, 'data-page': n });
  page.append(h('img', { class: 'bg', src: `assets/bg${n}.webp`, alt: '', loading: lazy ? 'lazy' : 'eager', decoding: 'async', fetchpriority: lazy ? 'low' : 'high', width: w, height: hgt }));
  for (const o of overlays) if (o) page.append(o);
  return page;
}

/* a picture from the pack: art('mandap', { x, y, w, delay, motion, anchor })
   anchor 'top' hangs the picture from y instead of centring it there;
   `height` (percent of the page) stretches it to the reference's own proportions */
export function art(id, { x, y, w, height, delay = 0, motion = '', z = 2, reveal = true, alt = '', cls = '', anchor = 'centre', lazy = true } = {}) {
  const [iw, ih] = artSizes[id];
  const el = h('div', { class: `el ${reveal ? 'reveal' : ''} ${anchor === 'top' ? 'from-top' : ''} ${cls}`, style: { left: `${x}%`, top: `${y}%`, width: `${w}%`, zIndex: z, '--d': `${delay}s` } });
  const inner = h('div', { class: motion, style: { '--sd': `${-(x * 0.13 + y * 0.07) % 7}s` } });
  const img = h('img', { src: `assets/${id}.webp`, alt, width: iw, height: ih, loading: lazy ? 'lazy' : 'eager', decoding: 'async', style: { aspectRatio: `${iw} / ${ih}` } });
  if (height) { el.style.height = `${height}%`; inner.style.height = '100%'; img.style.height = '100%'; img.style.aspectRatio = 'auto'; }
  inner.append(img);
  el.append(inner);
  return el;
}

/* text: txt(['line', 'line'], { x, y, w, size, cls }) — size in cqw, lh = line-height */
export function txt(lines, { x = 50, y, w = 90, size = 3.4, cls = 'body', lh = 1.3, delay = 0, z = 3, html = false, align = 'center', id } = {}) {
  const el = h('div', { class: 'el reveal', style: { left: `${x}%`, top: `${y}%`, width: `${w}%`, zIndex: z, '--d': `${delay}s` }, id });
  const t = h('div', { class: `txt ${cls}`, style: { fontSize: `${size}cqw`, lineHeight: lh, textAlign: align }, lang: 'mr' });
  for (const l of [].concat(lines)) t.append(html ? h('span', { class: 'l', html: l }) : h('span', { class: 'l' }, l));
  el.append(t);
  return el;
}

/* any custom node at a position */
export function at(node, { x = 50, y, w, height, z = 4, reveal = true, delay = 0, hit = false, cls = '', anchor = 'centre' } = {}) {
  const el = h('div', { class: `el ${reveal ? 'reveal' : ''} ${hit ? 'hit' : ''} ${anchor === 'top' ? 'from-top' : ''} ${cls}`, style: { left: `${x}%`, top: `${y}%`, width: `${w}%`, zIndex: z, '--d': `${delay}s` } });
  if (height) el.style.height = `${height}%`;
  el.append(node);
  return el;
}
