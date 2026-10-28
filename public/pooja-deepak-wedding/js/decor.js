/* Decorative components. Each returns an HTML string; art that can move is
   its own layer so motion.js can animate it independently. */

const A = 'assets/';

/* one shared gold-foil gradient for every line icon (stroke="url(#foil)") */
export const GoldDefs = () => `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7d5518"/><stop offset=".35" stop-color="#c79a45"/>
      <stop offset=".55" stop-color="#e6c98a"/><stop offset=".75" stop-color="#b88932"/><stop offset="1" stop-color="#7d5518"/>
    </linearGradient>
  </defs>
</svg>`;

const svg = (body, vb = '0 0 48 48', cls = 'ico') =>
  `<svg class="${cls}" viewBox="${vb}" fill="none" stroke="url(#foil)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

/* ── line icons ─────────────────────────────────────────── */
const ICONS = {
  kalasha: `<path d="M14 30c0 8 4.5 13 10 13s10-5 10-13c0-4-3-7-6-8h-8c-3 1-6 4-6 8z"/><path d="M18 19h12M19 22h10"/><ellipse cx="24" cy="12" rx="4.5" ry="6"/><path d="M19.5 18c-4-1-8-4-9.5-8 4 0 8 2 9.5 6M28.5 18c4-1 8-4 9.5-8-4 0-8 2-9.5 6M17 30c4 2 10 2 14 0M20 35h8"/>`,
  lotus: `<path d="M24 8c4 6 4 14 0 20-4-6-4-14 0-20z"/><path d="M24 28c-6-2-12-8-13-15 6 2 11 7 13 15zM24 28c6-2 12-8 13-15-6 2-11 7-13 15z"/><path d="M24 28c-8 1-16-2-20-8 7-1 15 2 20 8zM24 28c8 1 16-2 20-8-7-1-15 2-20 8z"/><path d="M12 33q12 4 24 0"/>`,
  vratham: null, // falls back to kalasha
  nichayam: `<ellipse cx="24" cy="34" rx="17" ry="5"/><path d="M8 33c0 4 7 7 16 7s16-3 16-7"/><path d="M14 31c-2-6 1-12 7-14-1 6-3 10-7 14zM34 31c2-6-1-12-7-14 1 6 3 10 7 14z"/><circle cx="24" cy="24" r="6"/><path d="M24 18v-4m-2 1 2-3 2 3"/>`,
  ring: `<circle cx="24" cy="31" r="10.5"/><circle cx="24" cy="31" r="7.8"/><path d="M17 13l3.4-4.4h7.2L31 13l-7 7.2z"/><path d="M17 13h14M20.4 8.6l3.6 4.4 3.6-4.4M24 13v7.2"/><path d="M38 9l1.2-2.6M40.5 13.5l2.8-.8M10 9l-1.2-2.6M7.5 13.5l-2.8-.8"/>`,
  haldi: `<path d="M8 26h32c0 8-7 14-16 14S8 34 8 26z"/><path d="M13 26c1-5 5-8 11-8s10 3 11 8"/><path d="M30 18l9-10"/><circle cx="18" cy="23" r=".8"/><circle cx="25" cy="21" r=".8"/><circle cx="29" cy="24" r=".8"/><path d="M18 40l-2 4h16l-2-4"/>`,
  mehendi: `<path d="M17 42V24c0-2 3-2 3 0v-11c0-2 3-2 3 0v10-13c0-2 3-2 3 0v13-10c0-2 3-2 3 0v13-5c0-2 3-2 3 0v13c0 6-4 10-9 10s-9-3-9-6z"/><circle cx="25" cy="31" r="3"/><path d="M25 25v3M25 34v3M19 31h3M28 31h3"/>`,
  sangeet: `<path d="M10 18c-2 0-3 3-3 6s1 6 3 6M38 18c2 0 3 3 3 6s-1 6-3 6"/><path d="M10 18c6-3 22-3 28 0M10 30c6 3 22 3 28 0"/><path d="M10 18v12M38 18v12M17 17v14M24 16.5v15M31 17v14"/><path d="M16 12l3-4M30 12l-3-4"/>`,
  muhurtham: `<circle cx="19" cy="27" r="9"/><circle cx="29" cy="27" r="9"/><path d="M24 10l3 4-3 4-3-4z"/><path d="M24 18v1"/>`,
  reception: `<path d="M14 8h8l-1 10c0 3-2 5-3 5s-3-2-3-5zM26 8h8l-1 10c0 3-2 5-3 5s-3-2-3-5z"/><path d="M18 23v14M30 23v14M14 37h8M26 37h8"/><path d="M22 5l2-2M26 5l-2-2M24 2v-1"/>`,
  meet: `<path d="M6 22c0-9 8-15 18-15s18 6 18 15c-3-2-6-2-9 0-3-2-6-2-9 0-3-2-6-2-9 0-3-2-6-2-9 0z"/><path d="M24 7v31c0 3 4 3 4 0"/><path d="M14 30l-1 3M34 30l1 3M19 34l-1 3M30 34l1 3"/>`,
  love: `<path d="M13 22h20l-2 18c0 2-2 3-4 3h-8c-2 0-4-1-4-3z"/><path d="M9 40h28"/><path d="M33 26c4 0 5 3 5 5s-2 5-6 5"/><path d="M23 17c-3-3-6-1-5 1 1 3 5 4 5 4s4-1 5-4c1-2-2-4-5-1z"/>`,
  forever: `<path d="M8 40h32M11 40v-6h26v6"/><path d="M14 34v-4h20v4"/><path d="M24 29c-6-3-6-9-1-14 0 4 2 5 3 6 1-3 0-6-1-9 5 3 9 9 4 17"/><path d="M18 29c-2-2-2-5 0-7M30 29c2-2 2-5 0-7"/>`,
  pin: `<path d="M24 43s-12-13-12-22a12 12 0 0124 0c0 9-12 22-12 22z"/><circle cx="24" cy="21" r="4.5"/>`,
  car: `<path d="M8 30l3-9c1-2 2-3 4-3h18c2 0 3 1 4 3l3 9v8H8z"/><path d="M8 30h32"/><circle cx="15" cy="34" r="2"/><circle cx="33" cy="34" r="2"/><path d="M11 38v3M37 38v3"/>`,
  hotel: `<path d="M6 38V12M6 30h36v8M42 30v-5c0-3-2-5-5-5H22v10"/><circle cx="14" cy="24" r="4"/>`,
  phone: `<path d="M15 7l5 9-3 3c2 5 6 9 11 11l3-3 9 5-2 6c-1 2-3 2-5 2C21 39 9 27 8 15c0-2 0-4 2-5z"/>`,
  whatsapp: `<path d="M8 41l2.5-8A17 17 0 1117 39z"/><path d="M18 16c-1 1-2 3-1 6 2 5 6 9 11 10 3 1 4 0 5-1l1-3-4-2-2 2c-3-1-6-4-7-7l2-2-2-4z"/>`,
  mail: `<rect x="6" y="12" width="36" height="25" rx="2"/><path d="M6 14l18 13 18-13"/>`,
  gift: `<rect x="9" y="20" width="30" height="21" rx="1"/><path d="M6 14h36v6H6zM24 14v27"/><path d="M24 14c-3-6-10-8-10-3 0 3 6 3 10 3zM24 14c3-6 10-8 10-3 0 3-6 3-10 3z"/>`,
  calendar: `<rect x="7" y="10" width="34" height="31" rx="2"/><path d="M7 18h34M15 6v8M33 6v8"/><path d="M24 24l1.8 3.6 4 .6-2.9 2.8.7 4L24 33l-3.6 2 .7-4-2.9-2.8 4-.6z"/>`,
  map: `<path d="M6 12l11-4 14 4 11-4v28l-11 4-14-4-11 4z"/><path d="M17 8v28M31 12v28"/>`,
  send: `<path d="M42 6L6 21l14 6 6 14z"/><path d="M42 6L20 27"/>`,
  music: `<path d="M18 36V12l20-5v24"/><circle cx="13" cy="36" r="5"/><circle cx="33" cy="31" r="5"/>`,
  heart: `<path d="M24 40S7 29 7 17a9 9 0 0117-4 9 9 0 0117 4c0 12-17 23-17 23z"/>`,
  copy: `<rect x="15" y="15" width="24" height="26" rx="2"/><path d="M33 15V9a2 2 0 00-2-2H11a2 2 0 00-2 2v22a2 2 0 002 2h4"/>`,
  arrow: `<path d="M18 12l12 12-12 12"/>`,
};
ICONS.vratham = ICONS.kalasha;

export const Icon = (name, cls = 'ico') => svg(ICONS[name] || ICONS.lotus, '0 0 48 48', cls);

/* ── ornaments ─────────────────────────────────────────── */
export const LotusDecoration = (cls = '') =>
  `<span class="lotus-orn ${cls}" aria-hidden="true">${Icon('lotus', 'ico ico-lotus')}</span>`;

/* purna kumbham: pot, mango leaves, coconut — drawn finer than the line icons */
export const Kalasha = () => `<span class="kalasha" aria-hidden="true">${svg(`
  <path d="M18 41c0 11 6.5 17 14 17s14-6 14-17c0-6-4.5-10-10-11.5h-8C22.5 31 18 35 18 41z"/>
  <path d="M19.5 44.5q12.5 4.5 25 0M20.5 49q11.5 4 23 0" stroke-width=".8"/>
  <circle cx="24" cy="46.6" r=".7"/><circle cx="28" cy="47.6" r=".7"/><circle cx="32" cy="47.9" r=".7"/><circle cx="36" cy="47.6" r=".7"/><circle cx="40" cy="46.6" r=".7"/>
  <path d="M32 35.5v5"/><circle cx="32" cy="34" r="1"/>
  <path d="M27.5 29.5v-3.5h9v3.5M24 26h16"/>
  <ellipse cx="32" cy="16.5" rx="5.6" ry="7.6"/><path d="M32 9V5.5M30 6.5l2-2 2 2" stroke-width=".9"/>
  <path d="M26 25.5c-6-3.5-12-3.5-18-.5 6 3 12 3 18 .5zM38 25.5c6-3.5 12-3.5 18-.5-6 3-12 3-18 .5z"/>
  <path d="M27.5 24c-3.5-6-8.5-9.5-15-10.5 3 6 8 9.5 15 10.5zM36.5 24c3.5-6 8.5-9.5 15-10.5-3 6-8 9.5-15 10.5z"/>
  <path d="M8.5 25.2h17M38.5 25.2h17" stroke-width=".5"/>
  <path d="M25 58.5h14M22 61.5h20"/>`, '0 0 64 64', 'ico ico-kalasha')}</span>`;

/* the couple's initials inside a ring of lotus petals */
export const Monogram = (a, b, cls = '') => `
  <div class="monogram ${cls}" aria-label="${a} and ${b}">
    ${svg(
      '<circle cx="60" cy="60" r="55"/><circle cx="60" cy="60" r="49.5" stroke-dasharray=".6 3.4" stroke-width="1.6"/>' +
      Array.from({ length: 16 }, (_, i) => `<path transform="rotate(${i * 22.5} 60 60)" d="M60 1.5c2.2 2.4 2.2 5 0 7-2.2-2-2.2-4.6 0-7z"/>`).join(''),
      '0 0 120 120', 'monogram-ring')}
    <span class="mono-a">${a.charAt(0)}</span><i aria-hidden="true"></i><span class="mono-b">${b.charAt(0)}</span>
  </div>`;

/* pulli kolam: dots with the continuous loops drawn around them, as at a South Indian threshold */
export const Kolam = (cls = '') => svg(
  [0, 90, 180, 270].map((r) => `<path transform="rotate(${r})" d="M0-5C8-11 8-23 0-26-8-23-8-11 0-5z"/><circle transform="rotate(${r})" cx="0" cy="-15.5" r="1.3" fill="#b88932" stroke="none"/>`).join('') +
  [45, 135, 225, 315].map((r) => `<path transform="rotate(${r})" d="M0-7C5-10 5-17 0-19-5-17-5-10 0-7z"/><circle transform="rotate(${r})" cx="0" cy="-13" r="1" fill="#b88932" stroke="none"/>`).join('') +
  '<circle r="4.5"/><circle r="1.3" fill="#b88932" stroke="none"/>',
  '-30 -30 60 60', `kolam ${cls}`);

/* arch cameo holding one initial, for the family leaves */
export const Cameo = (letter) => `<span class="cameo" aria-hidden="true"><span>${letter.charAt(0)}</span></span>`;

/* short gold rule that fades at both ends, a small motif at its heart */
export const GoldDivider = (motif = 'diamond', cls = '') => {
  const heart = motif === 'lotus'
    ? Icon('lotus', 'ico ico-mini')
    : svg('<path d="M12 3l4 5-4 5-4-5z"/><circle cx="3" cy="8" r="1"/><circle cx="21" cy="8" r="1"/>', '0 0 24 16', 'ico ico-mini');
  return `<div class="gold-divider ${cls}" aria-hidden="true"><i></i>${heart}<i></i></div>`;
};

/* the gold thread that stitches one section to the next: a vertical hairline, no horizontal break */
export const GoldThread = (kolam = false) =>
  `<div class="gold-thread ${kolam ? 'is-kolam' : ''}" aria-hidden="true"><i></i>${kolam
    ? Kolam('thread-kolam')
    : svg('<path d="M12 2l3.5 6L12 14 8.5 8z"/><circle cx="12" cy="8" r="1.2"/>', '0 0 24 16', 'ico ico-thread')}<i></i></div>`;

/* multi-cusped temple arch drawn as double gold foil line; frames the muhurtham */
export const TempleOrnament = () => svg(`
  <path class="arch-outer" d="M8 398V150c0-22 14-34 26-40 4-22 20-36 38-40 8-26 32-44 58-50 8-10 14-14 20-18 6 4 12 8 20 18 26 6 50 24 58 50 18 4 34 18 38 40 12 6 26 18 26 40v248"/>
  <path class="arch-inner" d="M18 398V154c0-17 10-27 21-32 4-20 17-32 34-36 9-22 30-38 54-44 7-8 14-12 23-16 9 4 16 8 23 16 24 6 45 22 54 44 17 4 30 16 34 36 11 5 21 15 21 32v244"/>
  <path d="M150 4v-2M144 12q6-6 12 0M150 26l4 6-4 6-4-6z"/>
  <path d="M8 398h12M282 398h-12"/>`, '0 0 300 400', 'temple-arch');

/* side garland: a slice of the carved pillar + jasmine vine, keyed on transparent paper.
   pos: CSS top offset inside its section; crop: which part of the tall strip shows (0–100). */
export const FloralVine = ({ side = 'l', top = '0px', height = '640px', crop = 0, depth = 0.05, cls = '' } = {}) =>
  `<div class="vine vine-${side} ${cls}" style="top:${top};height:${height}" data-parallax="${depth}" aria-hidden="true">
     <img src="${A}side-${side}.webp" alt="" loading="lazy" decoding="async" style="object-position:center ${crop}%">
   </div>`;

/* temple bell strand; sways from its top */
export const GoldBell = ({ side = 'l', cls = '' } = {}) =>
  `<div class="bell bell-${side} ${cls}" aria-hidden="true"><img src="${A}bell-${side}.webp" alt="" decoding="async"></div>`;

/* brass deepams; each flame gets its own flickering glow layer */
/* flame centres measured on deepam.webp (brightest pixels), size = relative flame size */
const FLAMES = [[36.9, 27.1, 1], [43.1, 31, .7], [61.6, 30.6, .7], [68.2, 27.6, 1], [53.9, 17.1, .5], [31.9, 47.1, .8], [18.6, 46.5, .7], [83.9, 63, 1.25]];
export const BrassLamp = (cls = '') =>
  `<div class="deepam ${cls}" aria-hidden="true">
     <img src="${A}deepam.webp" alt="" loading="lazy" decoding="async">
     ${FLAMES.map(([x, y, s], i) => `<span class="flame" style="left:${x}%;top:${y}%;--i:${i};--s:${s}"></span>`).join('')}
   </div>`;

export const WeddingCouple = ({ cls = '', eager = false } = {}) =>
  `<div class="couple ${cls}"><img src="${A}couple.webp" alt="The couple walking together" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>`;

/* rose petals drifting down the hero; few, slow, randomised once */
export const PetalShower = (n = 9) => {
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = (i * 37 + 11) % 100, d = 11 + (i * 7) % 9, delay = -(i * 2.3) % 14, s = 0.7 + ((i * 13) % 6) / 10;
    out += `<i class="petal" style="left:${x}%;--d:${d}s;--delay:${delay}s;--s:${s}"></i>`;
  }
  return `<div class="petals" aria-hidden="true">${out}</div>`;
};

/* faint lotus-mandala watermark printed into the paper behind a heading */
export const Mandala = (cls = '') => svg(
  Array.from({ length: 12 }, (_, i) => `<path transform="rotate(${i * 30} 100 100)" d="M100 100c10-18 10-44 0-64-10 20-10 46 0 64z"/>`).join('') +
  Array.from({ length: 24 }, (_, i) => `<path transform="rotate(${i * 15 + 7.5} 100 100)" d="M100 30c4-6 4-14 0-20-4 6-4 14 0 20z"/>`).join('') +
  '<circle cx="100" cy="100" r="70"/><circle cx="100" cy="100" r="92" stroke-dasharray="1 5"/><circle cx="100" cy="100" r="12"/>',
  '0 0 200 200', `mandala ${cls}`);

/* section heading: lotus, small caps title, italic line */
export const Heading = (title, sub = '', { motif = 'lotus', id = '' } = {}) => `
  <header class="sec-head" data-reveal>
    ${motif === 'lotus' ? LotusDecoration() : ''}
    <h2 ${id ? `id="${id}"` : ''}>${title}</h2>
    ${sub ? `<p class="sec-sub">${sub}</p>` : ''}
  </header>`;

export const Button = ({ label, icon, href, id, cls = '', attrs = '' }) => {
  const inner = `${icon ? Icon(icon, 'ico ico-btn') : ''}<span>${label}</span>`;
  return href
    ? `<a class="btn ${cls}" href="${href}" ${id ? `id="${id}"` : ''} target="_blank" rel="noopener" ${attrs}>${inner}</a>`
    : `<button class="btn ${cls}" type="button" ${id ? `id="${id}"` : ''} ${attrs}>${inner}</button>`;
};
