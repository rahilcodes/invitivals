/* DateReveal — page 2. The brass slot is painted into the background; a hit
   area over its knob unrolls the parchment downwards out of the slot's mouth.
   The paper is one picture inside a clip that grows from the slot down, so it
   never jumps or duplicates. */
import { h } from './util.js';
import { at, art } from './page.js';
import { artSizes } from './art-sizes.js';

export function DateReveal(cfg, { slot, paper }) {
  /* slot: { x, y, w, h } hit area in %; paper: { x, top, w } top edge of the parchment in % */
  const [pw, ph] = artSizes['p2-parchment'];
  const paperH = paper.w * (ph / pw) * (artSizes.bg2[0] / artSizes.bg2[1]); // % of page height
  const clip = h('div', { class: 'parchment-clip', 'aria-hidden': 'true' },
    h('img', { src: 'assets/p2-parchment.webp', alt: '', width: pw, height: ph, loading: 'lazy', decoding: 'async', style: { aspectRatio: `${pw} / ${ph}` } }));
  const text = h('div', { class: 'parchment-text', id: 'date-text', role: 'status', 'aria-live': 'polite' },
    h('div', { class: 'txt serif', style: { fontSize: '6.2cqw', lineHeight: 1.15, color: '#5a3418' } },
      h('span', { class: 'l', html: `${cfg.day}<sup style="font-size:.5em;vertical-align:.6em">${cfg.suffix}</sup>` }),
      h('span', { class: 'l' }, cfg.month),
      h('span', { class: 'l' }, cfg.year)),
    h('div', { class: 'divider', style: { width: '58%', margin: '2cqw auto 1.6cqw' } }, h('i', {}, '❖')),
    h('div', { class: 'txt serif', style: { fontSize: '4cqw' } }, cfg.time));
  const wrap = h('div', { class: 'parchment-wrap', style: { position: 'relative', width: '100%' } }, clip,
    h('div', { style: { position: 'absolute', left: '12%', right: '12%', top: '30%', pointerEvents: 'none' } }, text));
  const paperEl = h('div', { class: 'el', style: { left: `${paper.x}%`, top: `${paper.top}%`, width: `${paper.w}%`, transform: 'translate(-50%, 0)', zIndex: 2, height: `${paperH}%` } }, wrap);
  // the clip must know its full height to animate to it
  wrap.style.height = '100%';

  const knob = h('button', { class: 'knob-hit', type: 'button', 'aria-label': 'Reveal our wedding date', 'aria-expanded': 'false', 'aria-controls': 'date-text' });
  let open = false;
  knob.addEventListener('click', () => {
    open = !open;
    knob.setAttribute('aria-expanded', String(open));
    clip.classList.toggle('open', open);
    text.classList.toggle('open', open);
    hint.style.opacity = open ? '0' : '';
  });
  const hint = h('div', { class: 'tap-hint', style: { top: `${slot.y + slot.h / 2 + 1.2}%`, transition: 'opacity .6s' } }, 'Click the button');
  const hit = at(knob, { x: slot.x, y: slot.y, w: slot.w, z: 5, reveal: false, hit: true });
  hit.style.height = `${slot.h}%`;
  return [paperEl, hit, hint];
}
