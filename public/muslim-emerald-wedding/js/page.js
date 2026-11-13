/* InvitationPage — one canvas with the artwork's aspect ratio (941 × 1672).
   The visible artwork is the designer's finished WITH TEXT reference plate; the
   page carries no visible HTML text of its own. Overlays are placed by their
   CENTRE in percent of the canvas (x, y) with a width (and height) in percent,
   measured on the 941 × 1672 reference, so they scale with the picture. */
import { h } from './util.js';
import { artSizes } from './art-sizes.js';

export function InvitationPage(n, src, overlays, { lazy = true, cls = '' } = {}) {
  const [w, hgt] = artSizes[src] || [941, 1672];
  const page = h('section', { class: `page page-${n} ${cls}`, id: `page-${n}`, style: { aspectRatio: `${w} / ${hgt}` }, 'data-page': n });
  page.append(h('img', { class: 'bg', src: `assets/${src}.webp`, alt: '', loading: lazy ? 'lazy' : 'eager', decoding: 'async', fetchpriority: lazy ? 'low' : 'high', width: w, height: hgt }));
  for (const o of overlays) if (o) page.append(o);
  return page;
}

/* an invisible hit area over a button painted in the plate: hotspot(node, { x, y, w, h })
   The node (a button or a link) fills the rectangle; it has no visuals of its own. */
export function hotspot(node, { x = 50, y, w, h: hh, z = 5 }) {
  const el = h('div', { class: 'el hit', style: { left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${hh}%`, zIndex: z } });
  node.classList.add('hotspot');
  el.append(node);
  return el;
}

/* any custom node at a position (centre), optional height */
export function at(node, { x = 50, y, w, h: hh, z = 4, hit = false, cls = '' } = {}) {
  const el = h('div', { class: `el ${hit ? 'hit' : ''} ${cls}`, style: { left: `${x}%`, top: `${y}%`, width: `${w}%`, height: hh ? `${hh}%` : null, zIndex: z } });
  el.append(node);
  return el;
}
