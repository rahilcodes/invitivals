/* EventSelection — page 3: the Shaadi and Reception plaques, each a button
   that opens its detail view. */
import { h } from './util.js';
import { at, art } from './page.js';
import { artSizes } from './art-sizes.js';

export function plaque(label, { x, y, w, delay = 0, onOpen }) {
  const [pw, ph] = artSizes['p3-plaque'];
  const b = h('button', { class: 'plaque', type: 'button', 'aria-label': `${label} — view details`, onclick: onOpen },
    h('img', { src: 'assets/p3-plaque.webp', alt: '', width: pw, height: ph, loading: 'lazy', decoding: 'async', style: { aspectRatio: `${pw} / ${ph}` } }),
    h('span', {}, label));
  return at(b, { x, y, w, delay, hit: true, z: 5, cls: 'sway-slow' });
}

export function pin({ x, y, w, delay = 0 }) {
  const el = art('p3-pin', { x, y, w, delay, z: 4 });
  el.firstChild.classList.add('pin-wrap');
  return el;
}
