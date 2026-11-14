/* DateReveal: page 2. The scroll is rolled up under the brass slot. A tap on the slot or its knob unrolls
   it downwards: the paper is uncovered from its anchored top by a clip while the bottom roller travels
   with the edge, on the same timing, so nothing jumps or doubles. The date appears on the open parchment,
   on three lines as the reference letters it (day, month, year). */
import { h } from './util.js';
import { spr, box } from './page.js';
import { art } from './art.js';

export function DateReveal(d) {
  // closed: only the top roller (52 of the paper's 476 reference pixels) shows, the bottom roller sits right under it
  const closedInset = (1 - 52 / 476) * 100;
  const travel = ((1312 - 888) / 68) * 100; // in % of the roller's own height

  const paperEl = h('div', { class: 's scroll-paper', style: { ...box('p2-paper'), zIndex: 3, '--closed': `${closedInset}%` } }, h('img', { src: 'assets/p2-paper.webp', alt: '', decoding: 'async' }));
  const rollerEl = h('div', { class: 's scroll-roller', style: { ...box('p2-roller'), zIndex: 4, '--travel': `-${travel}%` } }, h('img', { src: 'assets/p2-roller.webp', alt: '', decoding: 'async' }));
  const date = h('div', { class: 's live wrap serif hold date3', style: { ...box('p2-date3'), zIndex: 5, fontSize: '4.6cqw' } },
    h('span', { class: 'd-day' }, d.day, h('sup', {}, d.suffix)), h('span', {}, d.month), h('span', {}, d.year));
  const words = [
    date,
    spr('p2-daterule', { cls: 'hold', z: 5, still: true }),
    h('div', { class: 's live serif hold', style: { ...box('p2-time'), zIndex: 5, fontSize: '3.6cqw' } }, d.time),
  ];
  const ring = h('div', { class: 's knob-ring', style: { ...box('p2-knob'), zIndex: 6 } });
  const button = h('button', { class: 'plain-hit', type: 'button', 'aria-label': 'Reveal our wedding date', 'aria-expanded': 'false' });
  const hit = h('div', { class: 's hit', style: { ...box('p2-slot'), zIndex: 7 } }, button);

  const page = () => button.closest('.page');
  button.addEventListener('click', () => {
    const open = !page().classList.contains('unrolled');
    page().classList.toggle('unrolled', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Roll the date back up' : 'Reveal our wedding date');
  });
  void art;
  return [paperEl, rollerEl, ...words, ring, hit];
}
