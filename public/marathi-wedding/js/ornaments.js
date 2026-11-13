/* The thin gold line ornaments of the reference screens, drawn as SVG so they
   stay crisp at any size: the crown-lotus over a heading, the rule with a
   quatrefoil knot, the maroon eight-petal flower of the date page, and the
   flourish of the blessings page. */
import { h } from './util.js';
import { at } from './page.js';

const GOLD = '#b8782a', GOLD_DEEP = '#a46f26', MAROON = '#8f1127';

const paths = {
  /* a tall pointed centre petal with an inner petal, two side petals, two leaves, a drop below */
  lotus: `<svg viewBox="0 0 140 110" fill="none" stroke="${GOLD}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M70 6 C58 24 54 42 70 66 C86 42 82 24 70 6 Z"/><path d="M70 24 C64 36 64 48 70 58 C76 48 76 36 70 24 Z"/>
    <path d="M70 66 C56 44 34 40 18 48 C30 70 54 78 70 66 Z"/><path d="M70 66 C84 44 106 40 122 48 C110 70 86 78 70 66 Z"/>
    <path d="M18 48 C10 54 6 60 4 62 C14 66 28 64 36 60"/><path d="M122 48 C130 54 134 60 136 62 C126 66 112 64 104 60"/>
    <path d="M70 70 L62 84 L70 98 L78 84 Z" fill="${GOLD}" stroke="none"/></svg>`,
  /* the blessings page: a petal, two curls either side, scrolls beneath, a drop */
  flourish: `<svg viewBox="0 0 140 100" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M70 4 C60 20 56 36 70 56 C84 36 80 20 70 4 Z"/><path d="M70 20 L70 48"/>
    <path d="M52 30 C44 26 40 30 44 36 C48 40 54 36 52 30"/><path d="M88 30 C96 26 100 30 96 36 C92 40 86 36 88 30"/>
    <path d="M70 56 C56 44 32 44 10 56 C24 62 40 58 52 66 C44 74 32 74 26 68 C32 80 50 80 60 70"/>
    <path d="M70 56 C84 44 108 44 130 56 C116 62 100 58 88 66 C96 74 108 74 114 68 C108 80 90 80 80 70"/>
    <path d="M70 70 L63 82 L70 96 L77 82 Z" fill="${GOLD}" stroke="none"/></svg>`,
  knot: `<svg viewBox="0 0 40 40" fill="none" stroke="${GOLD_DEEP}" stroke-width="3.2"><circle cx="20" cy="9" r="6.5"/><circle cx="20" cy="31" r="6.5"/><circle cx="9" cy="20" r="6.5"/><circle cx="31" cy="20" r="6.5"/><circle cx="20" cy="20" r="1.6" fill="${GOLD_DEEP}"/></svg>`,
  flower: `<svg viewBox="0 0 60 60" fill="none" stroke="${MAROON}" stroke-width="3" stroke-linejoin="round"><g transform="translate(30 30)">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path transform="rotate(${a})" d="M0 -4 C-6 -12 -5 -24 0 -27 C5 -24 6 -12 0 -4 Z"/>`).join('')}<circle r="3.2" fill="${GOLD}" stroke="none"/></g></svg>`,
  /* the small crown-lotus knot in the middle of the thank-you rules */
  crown: `<svg viewBox="0 0 60 44" fill="none" stroke="${GOLD}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M30 2 C25 10 24 18 30 26 C36 18 35 10 30 2 Z"/><path d="M30 26 C22 14 10 14 4 20 C12 28 24 30 30 26 Z"/><path d="M30 26 C38 14 50 14 56 20 C48 28 36 30 30 26 Z"/><path d="M30 28 C26 34 26 38 30 42 C34 38 34 34 30 28 Z"/></svg>`,
  /* the small spray over the hero names */
  spray: `<svg viewBox="0 0 90 70" fill="none" stroke="${GOLD}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M45 4 C40 16 40 28 45 40 C50 28 50 16 45 4 Z"/><path d="M45 20 L45 36"/><path d="M45 44 C36 30 22 26 10 30 C18 42 34 48 45 44 Z"/><path d="M45 44 C54 30 68 26 80 30 C72 42 56 48 45 44 Z"/><path d="M10 30 C6 34 4 40 2 46 C10 46 18 44 24 40"/><path d="M80 30 C84 34 86 40 88 46 C80 46 72 44 66 40"/><path d="M45 46 L41 56 L45 66 L49 56 Z" fill="${GOLD}" stroke="none"/></svg>`,
  hand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11.5V4.5a1.5 1.5 0 0 1 3 0V11m0-3.5a1.5 1.5 0 0 1 3 0V12m0-2a1.5 1.5 0 0 1 3 0v5.5a5 5 0 0 1-5 5h-1.6a5 5 0 0 1-4-2L4.2 14.6a1.5 1.5 0 0 1 2.3-1.9L9 14.5V8"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10A4 4 0 0 1 12 8a4 4 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z" fill="${MAROON}"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 11.5 21 3l-6.5 18-3.2-7.3z"/><path d="M21 3 11.3 13.7"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`,
};
export const icon = (name) => paths[name];

/* an ornament picture at a position */
export function ornament(name, { x = 50, y, w, delay = 0, z = 3 } = {}) {
  return at(h('i', { class: `orn orn-${name}`, html: paths[name], 'aria-hidden': 'true' }), { x, y, w, z, delay });
}

/* the thin gold rule with an ornament in the middle: glyph 'knot' | 'flower' | 'crown' */
export function rule({ x = 50, y, w = 30, glyph = 'knot', size = 11, delay = 0 } = {}) {
  const el = h('div', { class: `rule rule-${glyph}` }, h('i', { html: paths[glyph], style: { width: `${size}%` }, 'aria-hidden': 'true' }));
  return at(el, { x, y, w, z: 3, delay });
}
