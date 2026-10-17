/* Decorative components for the Royal Ivory & Sapphire invitation.
   Each returns an HTML string; art that can move is its own layer so
   motion.js can animate it independently. */

const A = 'assets/';

/* one shared gold-foil gradient for every line icon (stroke="url(#foil)") */
export const GoldDefs = () => `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8a6413"/><stop offset=".35" stop-color="#c99a3e"/>
      <stop offset=".55" stop-color="#eccb7f"/><stop offset=".75" stop-color="#bd8a2b"/><stop offset="1" stop-color="#8a6413"/>
    </linearGradient>
  </defs>
</svg>`;

const svg = (body, vb = '0 0 48 48', cls = 'ico', sw = 1.4) =>
  `<svg class="${cls}" viewBox="${vb}" fill="none" stroke="url(#foil)" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

/* ── the Khanda, drawn as gold line-art ─────────────────────
   central double-edged sword, the chakkar ring, two flanking kirpans. */
const KHANDA_PATH = `
  <circle cx="50" cy="58" r="19"/>
  <path d="M50 6 L55 30 L53 72 L47 72 L45 30 Z"/>
  <path d="M50 10 V70" stroke-width="1"/>
  <ellipse cx="50" cy="78" rx="9" ry="3.4"/>
  <path d="M50 81 V92"/><circle cx="50" cy="95" r="3"/>
  <path d="M50 92 C30 90 15 70 21 44 C24 32 32 25 41 22"/>
  <path d="M50 92 C70 90 85 70 79 44 C76 32 68 25 59 22"/>`;
export const Khanda = (cls = '') =>
  `<span class="khanda ${cls}" aria-hidden="true">${svg(KHANDA_PATH, '0 0 100 104', 'ico ico-khanda', 1.6)}</span>`;

/* small Khanda between two fading gold rules — the mockup's section mark */
export const KhandaMark = (cls = '') =>
  `<div class="kmark ${cls}" aria-hidden="true"><i></i>${svg(KHANDA_PATH, '0 0 100 104', 'ico ico-kmark', 2.2)}<i></i></div>`;

/* ── line icons (events + utility) ─────────────────────────── */
const ICONS = {
  pin: `<path d="M24 43s-12-13-12-22a12 12 0 0124 0c0 9-12 22-12 22z"/><circle cx="24" cy="21" r="4.5"/>`,
  lunch: `<path d="M24 14c-9 0-16 4-16 9h32c0-5-7-9-16-9z"/><path d="M8 23c0 5 7 9 16 9s16-4 16-9"/><path d="M24 14V9"/><path d="M20 9h8"/><path d="M6 37h36" stroke-width="1"/><path d="M14 23c2-3 6-4 10-4"/>`,
  /* a domed banquet hall: the medallion on the lunch / reception card */
  hall: `<path d="M24 3.5v3m-1 1.4a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/><path d="M16.5 15c0-4 3.2-6.4 7.5-7 4.3.6 7.5 3 7.5 7"/><path d="M9.5 15v-2.2c0-1.4.9-2.4 2-2.8 1.1.4 2 1.4 2 2.8V15M34.5 15v-2.2c0-1.4.9-2.4 2-2.8 1.1.4 2 1.4 2 2.8V15"/><path d="M8 15h32M8 18.5h32"/><path d="M9.5 18.5V39M38.5 18.5V39"/><path d="M20 39v-8.5a4 4 0 0 1 8 0V39"/><path d="M13.5 34v-5a2.6 2.6 0 0 1 5.2 0v5M29.3 34v-5a2.6 2.6 0 0 1 5.2 0v5M13.5 23.5h21"/><path d="M6 39h36M4 42.5h40"/>`,
  anandkaraj: `<path d="M24 8c4 6 4 14 0 20-4-6-4-14 0-20z"/><circle cx="24" cy="30" r="9"/><path d="M24 39v4M15 30h-4M37 30h-4"/>`,
  calendar: `<rect x="7" y="10" width="34" height="31" rx="2"/><path d="M7 18h34M15 6v8M33 6v8"/><path d="M14 25h6M21 25h6M28 25h6M14 32h6M21 32h6"/>`,
  clock: `<circle cx="24" cy="24" r="17"/><path d="M24 13v11l8 5"/>`,
  map: `<path d="M6 12l11-4 14 4 11-4v28l-11 4-14-4-11 4z"/><path d="M17 8v28M31 12v28"/>`,
  car: `<path d="M8 30l3-9c1-2 2-3 4-3h18c2 0 3 1 4 3l3 9v8H8z"/><path d="M8 30h32"/><circle cx="15" cy="34" r="2"/><circle cx="33" cy="34" r="2"/><path d="M11 38v3M37 38v3"/>`,
  hotel: `<path d="M6 38V12M6 30h36v8M42 30v-5c0-3-2-5-5-5H22v10"/><circle cx="14" cy="24" r="4"/>`,
  send: `<path d="M42 6L6 21l14 6 6 14z"/><path d="M42 6L20 27"/>`,
  music: `<path d="M18 36V12l20-5v24"/><circle cx="13" cy="36" r="5"/><circle cx="33" cy="31" r="5"/>`,
  check: `<path d="M10 25l9 9 19-21"/>`,
  regret: `<circle cx="24" cy="24" r="17"/><path d="M17 17l14 14M31 17L17 31"/>`,
  photos: `<rect x="6" y="12" width="36" height="28" rx="2"/><path d="M6 33l10-9 8 7 6-5 12 10"/><circle cx="33" cy="20" r="3"/>`,
  arrow: `<path d="M18 12l12 12-12 12"/>`,
  heart: `<path d="M24 40S7 29 7 17a9 9 0 0117-4 9 9 0 0117 4c0 12-17 23-17 23z"/>`,
  faith: `<circle cx="24" cy="27" r="9"/><path d="M24 6 L26.5 16 L25.5 36 L22.5 36 L21.5 16 Z"/><path d="M24 40 C14 39 8 29 11 18M24 40 C34 39 40 29 37 18" stroke-width="1"/>`,
  family: `<circle cx="17" cy="18" r="5"/><circle cx="31" cy="18" r="5"/><path d="M6 40c0-8 5-13 11-13s11 5 11 13M20 40c0-8 5-13 11-13s11 5 11 13"/>`,
  copy: `<rect x="15" y="15" width="24" height="26" rx="2"/><path d="M33 15V9a2 2 0 00-2-2H11a2 2 0 00-2 2v22a2 2 0 002 2h4"/>`,
  whatsapp: `<path d="M8 41l2.5-8A17 17 0 1117 39z"/><path d="M18 16c-1 1-2 3-1 6 2 5 6 9 11 10 3 1 4 0 5-1l1-3-4-2-2 2c-3-1-6-4-7-7l2-2-2-4z"/>`,
  up: `<path d="M12 28l12-12 12 12"/>`,
  plus: `<path d="M24 14v20M14 24h20"/>`,
  minus: `<path d="M14 24h20"/>`,
  share: `<circle cx="36" cy="10" r="4"/><circle cx="12" cy="24" r="4"/><circle cx="36" cy="38" r="4"/><path d="M16 22l16-10M16 26l16 10"/>`,
};
export const Icon = (name, cls = 'ico') => svg(ICONS[name] || ICONS.pin, '0 0 48 48', cls);

/* ── gold rules ────────────────────────────────────────────── */
export const GoldDivider = (cls = '') =>
  `<div class="gold-divider ${cls}" aria-hidden="true"><i></i>${svg('<path d="M12 3l4 5-4 5-4-5z"/><circle cx="3" cy="8" r="1"/><circle cx="21" cy="8" r="1"/>', '0 0 24 16', 'ico ico-mini')}<i></i></div>`;

/* the gold thread that stitches one section to the next: a vertical hairline */
export const GoldThread = () =>
  `<div class="gold-thread" aria-hidden="true"><i></i>${svg('<path d="M12 2l3.5 6L12 14 8.5 8z"/><circle cx="12" cy="8" r="1.2"/>', '0 0 24 16', 'ico ico-thread')}<i></i></div>`;

/* ── continuous floral borders down both page edges (purpose-made strips only) ── */
export const PageBorders = ({ left, right }) =>
  `<div class="pborder pborder-l" style="background-image:url(${left})" aria-hidden="true"></div>
   <div class="pborder pborder-r" style="background-image:url(${right || left})" ${right ? '' : 'data-mirror'} aria-hidden="true"></div>`;

/* ── image-based ornaments (the designer art) ──────────────── */
export const Garland = (cls = '', depth = 0) =>
  `<div class="garland ${cls}" ${depth ? `data-parallax="${depth}"` : ''} aria-hidden="true"><img src="${A}garland.webp" alt="" loading="lazy" decoding="async"></div>`;

export const Lantern = (corner = 'br', cls = '') =>
  `<div class="lantern lantern-${corner} ${cls}" aria-hidden="true"><img src="${A}lantern.webp" alt="" loading="lazy" decoding="async"></div>`;

export const ArchCrown = (cls = '') =>
  `<div class="arch-crown ${cls}" aria-hidden="true"><img src="${A}arch-crown.webp" alt="" loading="lazy" decoding="async"></div>`;

/* the designer's gold Khanda pendant, used whole: hanging in the hero, standing as an emblem elsewhere */
export const GoldKhanda = (cls = '') =>
  `<div class="gkhanda ${cls}" aria-hidden="true"><img src="${A}khanda.webp" alt="" decoding="async"></div>`;

export const HangingBell = ({ side = 'l', cls = '' } = {}) =>
  `<div class="hbell hbell-${side} ${cls}" aria-hidden="true"><img src="${A}bell.webp" alt="" loading="lazy" decoding="async"></div>`;

export const Horse = (cls = '') =>
  `<div class="horse ${cls}" aria-hidden="true"><img src="${A}horse.webp" alt="" loading="lazy" decoding="async"></div>`;

export const Dhol = (cls = '') =>
  `<div class="dhol ${cls}" aria-hidden="true"><img src="${A}dhol.webp" alt="" loading="lazy" decoding="async"></div>`;

export const WeddingCouple = ({ cls = '', eager = false } = {}) =>
  `<div class="couple ${cls}"><img src="${A}couple.webp" alt="Ishpreet and Amandeep in navy and gold wedding attire, walking together" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>`;

/* petals drifting down; few, slow, randomised once */
export const PetalShower = (n = 8) => {
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = (i * 37 + 11) % 100, d = 12 + (i * 7) % 9, delay = -(i * 2.3) % 14, s = 0.7 + ((i * 13) % 6) / 10;
    out += `<i class="petal" style="left:${x}%;--d:${d}s;--delay:${delay}s;--s:${s}"></i>`;
  }
  return `<div class="petals" aria-hidden="true">${out}</div>`;
};

/* a few petals resting on the paper beside a block, like in the mockup */
export const RestingPetals = (seed = 0) => {
  let out = '';
  for (let i = 0; i < 5; i++) {
    const k = seed * 7 + i;
    const x = (k * 53 + 9) % 100, y = (k * 29 + 13) % 100, r = (k * 71) % 360, s = 0.6 + ((k * 11) % 5) / 10;
    out += `<i class="rpetal ${i % 2 ? 'is-pink' : ''}" style="left:${x}%;top:${y}%;transform:rotate(${r}deg) scale(${s})"></i>`;
  }
  return `<div class="rpetals" aria-hidden="true">${out}</div>`;
};

/* ── an ornate scalloped gold frame around a picture (the story cartouche) ── */
const scallop = (n = 14, R = 92, cx = 100, cy = 100) => {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0), x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const chord = Math.hypot(x1 - x0, y1 - y0), r = chord * 0.58;
    d += (i === 0 ? `M${x0.toFixed(2)} ${y0.toFixed(2)}` : '') + ` A${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }
  return d + ' Z';
};
export const OrnateFrame = (src, alt = '', id = 'cartouche') => {
  const d = scallop();
  return `
  <div class="cartouche" data-reveal>
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <defs><clipPath id="${id}-clip"><path d="${d}"/></clipPath></defs>
      <image href="${src}" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id}-clip)"/>
      <path d="${d}" fill="none" stroke="url(#foil)" stroke-width="2.4"/>
      <path d="${scallop(14, 84)}" fill="none" stroke="url(#foil)" stroke-width=".8" opacity=".9"/>
    </svg>
    <span class="sr-only">${alt}</span>
  </div>`;
};

/* the couple's initials inside a ring of gold petals — the signature at the end */
export const Monogram = (a, b) => `
  <div class="monogram" aria-label="${a} and ${b}">
    ${svg('<circle cx="60" cy="60" r="55"/><circle cx="60" cy="60" r="49.5" stroke-dasharray=".6 3.4" stroke-width="1.6"/>' +
      Array.from({ length: 16 }, (_, i) => `<path transform="rotate(${i * 22.5} 60 60)" d="M60 1.5c2.2 2.4 2.2 5 0 7-2.2-2-2.2-4.6 0-7z"/>`).join(''),
      '0 0 120 120', 'monogram-ring')}
    <span class="mono-a">${a.charAt(0)}</span><i aria-hidden="true">&amp;</i><span class="mono-b">${b.charAt(0)}</span>
  </div>`;

export const ScrollCue = (href = '#invite') =>
  `<a class="scroll-cue" href="${href}" aria-label="Scroll to the invitation"><span>Scroll</span><i></i></a>`;

/* ── section furniture ─────────────────────────────────────── */
export const Heading = (title, sub = '', { id = '', mark = true } = {}) => `
  <header class="sec-head" data-reveal>
    ${mark ? KhandaMark('head-mark') : ''}
    <h2 ${id ? `id="${id}"` : ''}>${title}</h2>
    ${sub ? `<p class="sec-sub">${sub}</p>` : ''}
  </header>`;

/* an icon + text row, as the mockup lays out event details */
export const DetailRow = (icon, main, sub = '') =>
  `<div class="drow">${Icon(icon, 'ico ico-row')}<div><span class="d-main">${main}</span>${sub ? `<span class="d-sub">${sub}</span>` : ''}</div></div>`;

export const Button = ({ label, icon, href, id, cls = '', attrs = '' }) => {
  const inner = `${icon ? Icon(icon, 'ico ico-btn') : ''}<span>${label}</span>`;
  return href
    ? `<a class="btn ${cls}" href="${href}" ${id ? `id="${id}"` : ''} target="_blank" rel="noopener" ${attrs}>${inner}</a>`
    : `<button class="btn ${cls}" type="button" ${id ? `id="${id}"` : ''} ${attrs}>${inner}</button>`;
};
