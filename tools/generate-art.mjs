/**
 * Wedding template artwork generator.
 * Produces the illustrated scenes used by the five cultural templates —
 * the flat "illustrated couple" style used by real Indian wedding e-invites.
 * Every scene is a self-contained SVG; hero scenes carry their own embedded
 * CSS animations (flames, stars, lanterns, petals) that even work in <img>,
 * and respect prefers-reduced-motion.
 *
 * Re-run with:  node tools/generate-art.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'art');

let seedState = 12026;
const rnd = () => {
  seedState = (seedState * 16807) % 2147483647;
  return (seedState - 1) / 2147483646;
};

const SKIN = '#c98a5e';
const SKIN_D = '#a96f4a';
const HAIR = '#2b1e16';

/* ─────────────────────────── small helpers ─────────────────────────── */

const g = (attrs, inner) => `<g ${attrs}>${inner}</g>`;
const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
const circle = (cx, cy, r, fill, extra = '') =>
  `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="${fill}" ${extra}/>`;
const ellipse = (cx, cy, rx, ry, fill, extra = '') =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const rect = (x, y, w, h, fill, rx = 0, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;

function doc(w, h, inner, css = '') {
  const style = css
    ? `<style>${css}@media (prefers-reduced-motion: reduce){*{animation:none!important}}</style>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">${style}${inner}</svg>`;
}

/* A marigold flower — layered petals */
function marigold(cx, cy, r, c1 = '#e8862e', c2 = '#f2b134') {
  let petals = '';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    petals += circle(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55, r * 0.45, c1);
  }
  return g('', petals + circle(cx, cy, r * 0.55, c2) + circle(cx, cy, r * 0.22, c1));
}

/* Vertical marigold string (toran strand) */
function flowerString(x, y0, len, step = 26, c1 = '#e8862e', c2 = '#f2b134', leaf = '#4a6b3a') {
  let s = `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + len}" stroke="${leaf}" stroke-width="2"/>`;
  for (let y = y0 + 10; y < y0 + len; y += step) {
    s += ellipse(x - 8, y - 6, 7, 3.5, leaf, 'transform="rotate(-30 ' + (x - 8) + ' ' + (y - 6) + ')"');
    s += ellipse(x + 8, y - 6, 7, 3.5, leaf, 'transform="rotate(30 ' + (x + 8) + ' ' + (y - 6) + ')"');
    s += marigold(x, y, 9, c1, c2);
  }
  s += marigold(x, y0 + len, 12, c1, c2);
  return g('', s);
}

/* Hanging garland arc between two points */
function garlandArc(x1, y1, x2, y2, sag, c1, c2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + sag;
  let s = `<path d="M ${x1} ${y1} Q ${mx} ${my + sag * 0.6} ${x2} ${y2}" fill="none" stroke="#4a6b3a" stroke-width="2.5"/>`;
  const n = Math.max(6, Math.round(Math.abs(x2 - x1) / 34));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
    const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * (my + sag * 0.6) + t * t * y2;
    s += marigold(px, py, 8 + (i % 2) * 2, c1, c2);
  }
  return g('', s);
}

/* Diya oil lamp with animated flame (class .fl) */
function diya(cx, cy, s = 1) {
  return g(
    `transform="translate(${cx} ${cy}) scale(${s})"`,
    path('M -22 0 Q 0 16 22 0 Q 12 8 0 8 Q -12 8 -22 0 Z', '#8a4b2c') +
      path('M -22 0 Q 0 10 22 0 L 18 0 Q 0 7 -18 0 Z', '#b06a3b') +
      `<g class="fl"><path d="M 0 -18 C 6 -10 5 -4 0 -1 C -5 -4 -6 -10 0 -18 Z" fill="#f7a92e"/><path d="M 0 -12 C 3 -8 3 -4 0 -2 C -3 -4 -3 -8 0 -12 Z" fill="#fde28a"/></g>`
  );
}

/* Fanoos lantern with glow (class .sway on group, .glow inside) */
function lantern(cx, topY, s = 1, gold = '#c9a227', glass = '#f7e6b1') {
  return `<g class="sway" style="transform-origin:${cx}px ${topY}px" transform="translate(${cx} ${topY}) scale(${s})">
    <line x1="0" y1="-40" x2="0" y2="0" stroke="${gold}" stroke-width="2"/>
    <circle cx="0" cy="4" r="4" fill="${gold}"/>
    <path d="M -16 10 Q 0 -2 16 10 L 13 52 Q 0 62 -13 52 Z" fill="${glass}" class="glow" opacity=".92"/>
    <path d="M -16 10 Q 0 -2 16 10 L 13 52 Q 0 62 -13 52 Z" fill="none" stroke="${gold}" stroke-width="2.5"/>
    <line x1="-8" y1="6" x2="-6.5" y2="55" stroke="${gold}" stroke-width="1.2"/>
    <line x1="8" y1="6" x2="6.5" y2="55" stroke="${gold}" stroke-width="1.2"/>
    <line x1="0" y1="4" x2="0" y2="58" stroke="${gold}" stroke-width="1.2"/>
    <path d="M -13 52 Q 0 62 13 52 L 10 60 Q 0 66 -10 60 Z" fill="${gold}"/>
    <circle cx="0" cy="66" r="3" fill="${gold}"/>
  </g>`;
}

/* Cusped (multifoil) Mughal arch opening — returns path d for the opening */
function cuspArchD(cx, top, w, h) {
  const r = w / 10;
  const left = cx - w / 2;
  const right = cx + w / 2;
  const base = top + h;
  let d = `M ${left} ${base} L ${left} ${top + h * 0.42}`;
  const cusps = 4;
  for (let i = 0; i < cusps; i++) {
    const t0 = i / cusps;
    const t1 = (i + 1) / cusps;
    const a0 = Math.PI + t0 * Math.PI;
    const a1 = Math.PI + t1 * Math.PI;
    const px0 = cx + Math.cos(a0) * (w / 2);
    const py0 = top + h * 0.42 + Math.sin(a0) * h * 0.4;
    const px1 = cx + Math.cos(a1) * (w / 2);
    const py1 = top + h * 0.42 + Math.sin(a1) * h * 0.4;
    d += ` A ${r} ${r} 0 0 1 ${px1.toFixed(1)} ${py1.toFixed(1)}`;
  }
  d += ` L ${right} ${base} Z`;
  return d;
}

function star4(cx, cy, r, fill) {
  return path(
    `M ${cx} ${cy - r} Q ${cx + r * 0.18} ${cy - r * 0.18} ${cx + r} ${cy} Q ${cx + r * 0.18} ${cy + r * 0.18} ${cx} ${cy + r} Q ${cx - r * 0.18} ${cy + r * 0.18} ${cx - r} ${cy} Q ${cx - r * 0.18} ${cy - r * 0.18} ${cx} ${cy - r} Z`,
    fill
  );
}

/* ─────────────────────────────── figures ───────────────────────────────
   Local coordinates: feet at (0,0), figure builds upward in -y.
   Groom ≈ 370 tall, bride ≈ 340 tall. */

function groom(opts) {
  const {
    coat = '#efe3cc',
    trim = '#d4a643',
    legs = '#f4ecd9',
    headwear = 'safa',
    headColor = '#b03a48',
    face = 'left',
  } = opts;
  const flip = face === 'left' ? -1 : 1;
  let s = '';
  // legs (churidar) + shoes
  s += rect(-20, -118, 15, 118, legs, 7);
  s += rect(5, -118, 15, 118, legs, 7);
  s += ellipse(-11, 2, 15, 6, '#5a4632');
  s += ellipse(14, 2, 15, 6, '#5a4632');
  // sherwani body
  s += path('M -44 -258 Q 0 -274 44 -258 L 54 -70 Q 30 -52 0 -52 Q -30 -52 -54 -70 Z', coat);
  // hem + collar trim
  s += path('M -54 -70 Q 0 -50 54 -70 L 53 -60 Q 0 -42 -53 -60 Z', trim);
  s += path('M -12 -262 Q 0 -268 12 -262 L 12 -252 Q 0 -258 -12 -252 Z', trim);
  // placket + buttons
  s += `<line x1="0" y1="-258" x2="0" y2="-80" stroke="${trim}" stroke-width="2.5"/>`;
  for (let y = -240; y < -100; y += 28) s += circle(0, y, 3.4, trim);
  // outer arm
  s += path(`M ${-44 * flip} -252 Q ${-62 * flip} -200 ${-56 * flip} -132 L ${-40 * flip} -136 Q ${-46 * flip} -196 ${-32 * flip} -246 Z`, coat);
  s += circle(-49 * flip, -124, 11, SKIN);
  // inner arm reaching to partner
  s += path(`M ${40 * flip} -246 Q ${58 * flip} -210 ${66 * flip} -172 L ${52 * flip} -162 Q ${44 * flip} -204 ${30 * flip} -240 Z`, coat);
  s += circle(62 * flip, -164, 11, SKIN);
  // stole / dupatta over shoulder
  s += path(`M ${-30 * flip} -262 Q ${-38 * flip} -160 ${-30 * flip} -78 L ${-14 * flip} -78 Q ${-22 * flip} -160 ${-12 * flip} -258 Z`, headColor, 'opacity=".92"');
  s += path(`M ${-30 * flip} -262 Q ${-38 * flip} -160 ${-30 * flip} -78 L ${-26 * flip} -78 Q ${-34 * flip} -160 ${-26 * flip} -260 Z`, trim);
  // neck + head
  s += rect(-7, -276, 14, 16, SKIN_D, 5);
  s += circle(0, -292, 27, SKIN);
  s += path(`M ${-4 * flip} -284 q ${6 * flip} 4 ${10 * flip} 1`, 'none', `stroke="${SKIN_D}" stroke-width="2" stroke-linecap="round"`);
  // ear
  s += circle(-24 * flip, -292, 4.5, SKIN_D);
  // headwear
  if (headwear === 'safa') {
    s += path('M -30 -304 Q -34 -336 0 -342 Q 34 -336 30 -304 Q 16 -314 0 -314 Q -16 -314 -30 -304 Z', headColor);
    s += path('M -30 -304 Q 0 -320 30 -304 L 30 -296 Q 0 -310 -30 -296 Z', '#8a1f2e');
    s += path(`M ${26 * flip} -336 q ${10 * flip} -18 ${4 * flip} -34 q ${14 * flip} 10 ${6 * flip} 36 Z`, headColor); // turra fan
    s += `<line x1="${8 * flip}" y1="-340" x2="${8 * flip}" y2="-352" stroke="${trim}" stroke-width="2"/>`;
    s += path(`M ${8 * flip} -366 C ${14 * flip} -358 ${13 * flip} -352 ${8 * flip} -350 C ${3 * flip} -352 ${2 * flip} -358 ${8 * flip} -366 Z`, trim); // kalgi
    s += circle(0, -318, 3, trim);
  } else if (headwear === 'turban') {
    s += path('M -31 -300 Q -38 -352 0 -360 Q 38 -352 31 -300 Q 16 -312 0 -312 Q -16 -312 -31 -300 Z', headColor);
    s += path('M -31 -300 Q 0 -318 31 -300 L 31 -292 Q 0 -308 -31 -292 Z', headColor);
    s += `<path d="M -26 -318 Q 0 -334 26 -318" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="3"/>`;
    s += `<path d="M -22 -334 Q 0 -348 22 -334" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="3"/>`;
    s += `<line x1="${10 * flip}" y1="-354" x2="${10 * flip}" y2="-368" stroke="${'#d9b45b'}" stroke-width="2"/>`;
    s += path(`M ${10 * flip} -382 C ${16 * flip} -374 ${15 * flip} -368 ${10 * flip} -366 C ${5 * flip} -368 ${4 * flip} -374 ${10 * flip} -382 Z`, '#d9b45b');
    s += circle(10 * flip, -352, 3.4, '#d9b45b');
  } else if (headwear === 'topi') {
    s += path('M -26 -306 Q 0 -318 26 -306 L 24 -328 Q 0 -338 -24 -328 Z', headColor);
    s += `<path d="M -24 -328 Q 0 -338 24 -328" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/>`;
  } else {
    s += path('M -27 -296 Q -30 -324 0 -326 Q 30 -324 27 -296 Q 14 -310 0 -310 Q -14 -310 -27 -296 Z', HAIR);
  }
  return s;
}

function bride(opts) {
  const {
    skirt = '#a62639',
    skirtD = '#7a1f2b',
    blouse = '#a62639',
    trim = '#d4a643',
    dupatta = 'rgba(217,107,127,.85)',
    dupattaHead = true,
    veil = false,
    gown = false,
    bouquet = false,
    choora = false,
    face = 'right',
  } = opts;
  const flip = face === 'right' ? 1 : -1;
  let s = '';
  if (veil) {
    s += path('M 0 -300 C -70 -260 -86 -120 -80 0 L 80 0 C 86 -120 70 -260 0 -300 Z', 'rgba(255,255,255,.5)');
  }
  // skirt
  if (gown) {
    s += path('M -20 -160 C -60 -100 -78 -40 -80 0 L 80 0 C 78 -40 60 -100 20 -160 Z', skirt);
    s += path('M -80 0 L 80 0 C 79 -8 77 -16 74 -26 Q 0 -6 -74 -26 C -77 -16 -79 -8 -80 0 Z', 'rgba(0,0,0,.06)');
  } else {
    s += path('M -19 -158 C -62 -104 -82 -42 -84 0 L 84 0 C 82 -42 62 -104 19 -158 Z', skirt);
    // hem borders
    s += path('M -84 0 L 84 0 L 83 -10 Q 0 -26 -83 -10 Z', trim);
    s += `<path d="M -80 -26 Q 0 -44 80 -26" fill="none" stroke="${trim}" stroke-width="3" opacity=".8"/>`;
    // skirt motifs
    for (let i = -2; i <= 2; i++) {
      s += circle(i * 26, -66, 4, trim, 'opacity=".85"');
      s += circle(i * 22 + 11, -100, 3.2, trim, 'opacity=".7"');
    }
    s += path('M -19 -158 L 19 -158 L 15 -148 Q 0 -142 -15 -148 Z', trim, 'opacity=".9"');
  }
  // torso / blouse
  s += path('M -24 -238 Q 0 -248 24 -238 L 20 -156 Q 0 -148 -20 -156 Z', gown ? skirt : blouse);
  if (!gown) s += path('M -24 -238 Q 0 -248 24 -238 L 23 -230 Q 0 -240 -23 -230 Z', trim);
  // arms
  const armC = gown ? SKIN : blouse;
  s += path(`M ${-22 * flip} -234 Q ${-40 * flip} -196 ${-38 * flip} -150 L ${-26 * flip} -152 Q ${-28 * flip} -194 ${-14 * flip} -230 Z`, armC);
  s += circle(-33 * flip, -142, 10, SKIN);
  s += path(`M ${20 * flip} -232 Q ${40 * flip} -206 ${52 * flip} -172 L ${40 * flip} -162 Q ${30 * flip} -196 ${12 * flip} -226 Z`, armC);
  s += circle(47 * flip, -164, 10, SKIN);
  if (choora) {
    for (let i = 0; i < 5; i++) {
      s += `<path d="M ${(-38 + i * 1.2) * flip} ${-186 + i * 8} q ${8 * flip} 3 ${13 * flip} 1" fill="none" stroke="${i % 2 ? '#fff' : '#b03a48'}" stroke-width="3.4"/>`;
    }
  } else if (!gown) {
    s += `<path d="M ${-36 * flip} -168 q ${8 * flip} 3 ${12 * flip} 1" fill="none" stroke="${trim}" stroke-width="3"/>`;
    s += `<path d="M ${-37 * flip} -160 q ${8 * flip} 3 ${12 * flip} 1" fill="none" stroke="${trim}" stroke-width="3"/>`;
  }
  // neck + head
  s += rect(-6, -252, 12, 14, SKIN_D, 5);
  s += circle(0, -268, 24, SKIN);
  s += circle(21 * flip, -268, 4, SKIN_D); // ear
  // hair + bun
  s += path(`M ${-22 * flip} -276 Q ${-26 * flip} -292 ${-6 * flip} -292 Q ${-24 * flip} -288 ${-20 * flip} -268 Z`, HAIR);
  s += path('M -22 -280 Q 0 -296 22 -280 Q 12 -290 0 -290 Q -12 -290 -22 -280 Z', HAIR);
  s += circle(-14 * flip, -286, 9, HAIR);
  // jewelry
  s += `<path d="M -12 -246 Q 0 -238 12 -246" fill="none" stroke="${trim}" stroke-width="3"/>`;
  s += circle(0, -240, 3, trim);
  s += `<line x1="0" y1="-290" x2="0" y2="-280" stroke="${trim}" stroke-width="1.6"/>`;
  s += circle(0, -278, 3, trim); // maang tikka
  s += circle(21 * flip, -260, 2.6, trim); // jhumka
  if (gown && bouquet) {
    s += g(
      `transform="translate(${40 * flip} -160)"`,
      circle(0, 0, 9, '#e8c9c0') +
        circle(-10, 4, 8, '#fff') +
        circle(10, 4, 8, '#d9a5a0') +
        circle(0, 10, 8, '#fff') +
        ellipse(-14, -6, 7, 3.5, '#8ba07e', 'transform="rotate(-40 -14 -6)"') +
        ellipse(14, -6, 7, 3.5, '#8ba07e', 'transform="rotate(40 14 -6)"')
    );
  }
  // dupatta over head, flowing down the back
  if (dupattaHead && !gown) {
    s += path(
      `M ${26 * flip} -284 Q 0 -302 ${-24 * flip} -286 Q ${-44 * flip} -240 ${-46 * flip} -170 Q ${-52 * flip} -80 ${-44 * flip} -6 L ${-66 * flip} -6 Q ${-70 * flip} -120 ${-52 * flip} -230 Q ${-44 * flip} -280 0 -308 Q ${30 * flip} -300 ${30 * flip} -286 Z`,
      dupatta
    );
    s += `<path d="M ${26 * flip} -284 Q 0 -302 ${-24 * flip} -286" fill="none" stroke="${trim}" stroke-width="2.5"/>`;
  }
  return s;
}

/* Varmala garland worn around a figure's neck (local coords of figure) */
function varmala(yTop, len = 96, c1 = '#e8862e', c2 = '#fff4d6') {
  let s = `<path d="M -18 ${yTop} Q 0 ${yTop + len} 18 ${yTop}" fill="none" stroke="#4a6b3a" stroke-width="2"/>`;
  const n = 8;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const px = (1 - t) * (1 - t) * -18 + 2 * (1 - t) * t * 0 + t * t * 18;
    const py = (1 - t) * (1 - t) * yTop + 2 * (1 - t) * t * (yTop + len) + t * t * yTop;
    s += circle(px, py, 6, i % 2 ? c1 : c2);
  }
  return s;
}

/* The couple, holding the space between them; s = overall scale */
function couple(cx, baseY, s, brideOpts, groomOpts, withVarmala = false, gap = 96) {
  const vm = withVarmala
    ? g(`transform="translate(${-gap / 2} 0)"`, varmala(-238)) + g(`transform="translate(${gap / 2} 0)"`, varmala(-252, 108))
    : '';
  return g(
    `transform="translate(${cx} ${baseY}) scale(${s})"`,
    g(`transform="translate(${-gap / 2} 0)"`, bride({ ...brideOpts, face: 'right' })) +
      g(`transform="translate(${gap / 2} 0)"`, groom({ ...groomOpts, face: 'left' })) +
      vm
  );
}

/* Mandala ring */
function mandala(cx, cy, r, color, opacity = 0.5) {
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="1.6" opacity="${opacity}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.82}" fill="none" stroke="${color}" stroke-width="1" opacity="${opacity * 0.8}"/>`;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * r * 0.86;
    const y1 = cy + Math.sin(a) * r * 0.86;
    s += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} m -6 0 q 6 ${i % 2 ? -12 : 12} 12 0 q -6 ${i % 2 ? 6 : -6} -12 0 Z" fill="${color}" opacity="${opacity * 0.55}" transform="rotate(${(a * 180) / Math.PI + 90} ${x1.toFixed(1)} ${y1.toFixed(1)})"/>`;
  }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    s += circle(cx + Math.cos(a) * r * 0.68, cy + Math.sin(a) * r * 0.68, 3, color, `opacity="${opacity * 0.7}"`);
  }
  return g('', s);
}

/* Henna hand (palm with mehndi) */
function mehndiHand(cx, cy, s, skin = SKIN, henna = '#7a4a2b') {
  const fingers = [-34, -17, 0, 17]
    .map((fx, i) => rect(fx - 7, -118 - (i === 1 || i === 2 ? 14 : 0), 14, 60, skin, 7))
    .join('');
  return g(
    `transform="translate(${cx} ${cy}) scale(${s})"`,
    fingers +
      rect(28, -96, 14, 44, skin, 7, 'transform="rotate(-24 35 -74)"') +
      path('M -42 -70 Q -44 -10 0 -4 Q 44 -10 42 -70 Q 20 -84 0 -84 Q -20 -84 -42 -70 Z', skin) +
      circle(0, -46, 17, 'none', `stroke="${henna}" stroke-width="2.4"`) +
      circle(0, -46, 9, 'none', `stroke="${henna}" stroke-width="1.6"`) +
      circle(0, -46, 3, henna) +
      [0, 1, 2, 3, 4, 5, 6, 7]
        .map((i) => {
          const a = (i / 8) * Math.PI * 2;
          return circle(Math.cos(a) * 23, -46 + Math.sin(a) * 23, 2.2, henna);
        })
        .join('') +
      `<path d="M -30 -22 q 12 10 60 0" fill="none" stroke="${henna}" stroke-width="2"/>` +
      `<path d="M -26 -14 q 10 8 52 0" fill="none" stroke="${henna}" stroke-width="1.4"/>` +
      [-34, -17, 0, 17].map((fx) => circle(fx, -86, 2.4, henna)).join('') +
      [-34, -17, 0, 17].map((fx, i) => `<path d="M ${fx - 4} ${-98 - (i === 1 || i === 2 ? 12 : 0)} q 4 4 8 0" fill="none" stroke="${henna}" stroke-width="1.6"/>`).join('')
  );
}

/* Dhol drum */
function dhol(cx, cy, s, body = '#b03a48', trim = '#d9b45b') {
  return g(
    `transform="translate(${cx} ${cy}) scale(${s}) rotate(-14)"`,
    `<rect x="-70" y="-46" width="140" height="92" rx="40" fill="${body}"/>` +
      ellipse(-70, 0, 14, 46, '#f4e9d0') +
      ellipse(-70, 0, 14, 46, 'none', `stroke="${trim}" stroke-width="4"`) +
      ellipse(70, 0, 14, 46, '#f4e9d0') +
      ellipse(70, 0, 14, 46, 'none', `stroke="${trim}" stroke-width="4"`) +
      [-1, 0, 1].map((i) => `<path d="M -62 ${i * 26 - 8} Q 0 ${i * 26 + (i ? -20 * i : 24) - 8} 62 ${i * 26 - 8}" fill="none" stroke="${trim}" stroke-width="3"/>`).join('') +
      `<line x1="34" y1="-72" x2="66" y2="-30" stroke="#8a6d3b" stroke-width="5" stroke-linecap="round"/>` +
      circle(34, -72, 6, '#8a6d3b')
  );
}

/* Kalash pot */
function kalash(cx, cy, s, body = '#d4a643', deep = '#b08a2e') {
  return g(
    `transform="translate(${cx} ${cy}) scale(${s})"`,
    path('M -34 -40 Q -44 -6 0 0 Q 44 -6 34 -40 Q 40 -58 24 -64 L -24 -64 Q -40 -58 -34 -40 Z', body) +
      path('M -24 -64 L 24 -64 L 20 -74 L -20 -74 Z', deep) +
      ellipse(0, -78, 22, 7, '#4a6b3a') +
      [-14, -7, 0, 7, 14].map((x) => ellipse(x, -88, 5, 12, '#4a6b3a', `transform="rotate(${x * 2.4} ${x} -88)"`)).join('') +
      circle(0, -96, 9, '#f2b134') +
      `<path d="M -30 -34 q 30 12 60 0" fill="none" stroke="${deep}" stroke-width="3"/>` +
      circle(0, -22, 4, deep) + circle(-14, -26, 3, deep) + circle(14, -26, 3, deep)
  );
}

/* ══════════════════════════ HINDU ══════════════════════════ */

function hinduHero() {
  const W = 1600, H = 1000;
  let s = '';
  s += rect(0, 0, W, H, 'url(#sky)');
  s += `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fdf1dd"/><stop offset=".62" stop-color="#f9e3c4"/><stop offset="1" stop-color="#f4d3a8"/>
    </linearGradient>
    <radialGradient id="sun" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#f6c26b" stop-opacity=".85"/><stop offset="1" stop-color="#f6c26b" stop-opacity="0"/>
    </radialGradient>
  </defs>`;
  s += circle(800, 470, 340, 'url(#sun)');
  s += mandala(800, 470, 300, '#c98f3d', 0.4);
  // mandap pillars
  for (const px of [330, 1270]) {
    s += rect(px - 16, 300, 32, 460, '#b06a3b', 6);
    s += rect(px - 26, 280, 52, 26, '#d4a643', 6);
    s += rect(px - 26, 754, 52, 22, '#d4a643', 6);
    s += flowerString(px - 44, 306, 300);
    s += flowerString(px + 44, 306, 250);
  }
  // canopy drape
  s += path('M 250 300 Q 800 176 1350 300 L 1350 258 Q 800 130 250 258 Z', '#a62639');
  s += path('M 250 300 Q 800 176 1350 300 L 1350 286 Q 800 162 250 286 Z', '#d4a643');
  s += garlandArc(340, 300, 800, 268, 90, '#e8862e', '#f2b134');
  s += garlandArc(800, 268, 1260, 300, 90, '#e8862e', '#f2b134');
  // falling petals (animated)
  let petals = '';
  for (let i = 0; i < 14; i++) {
    const x = 160 + rnd() * 1280;
    const d = 9 + rnd() * 8;
    petals += `<ellipse class="pt" style="animation-delay:${(-rnd() * 16).toFixed(1)}s;animation-duration:${(11 + rnd() * 9).toFixed(1)}s" cx="${x.toFixed(0)}" cy="-40" rx="${d * 0.62}" ry="${d * 0.34}" fill="${i % 3 ? '#e8862e' : '#d96b7f'}" opacity=".8"/>`;
  }
  s += petals;
  // ground
  s += rect(0, 900, W, 100, '#efd9b4');
  s += `<path d="M 0 906 Q 800 872 1600 906 L 1600 1000 L 0 1000 Z" fill="#e7c893"/>`;
  // rangoli hint
  s += mandala(800, 952, 120, '#b03a48', 0.5);
  // couple with varmala
  s += couple(800, 906, 1.05, { skirt: '#a62639', blouse: '#a62639', trim: '#e9c15c', dupatta: 'rgba(217,88,110,.88)' }, { coat: '#f3e6cc', trim: '#c98f3d', headwear: 'safa', headColor: '#a62639' }, true);
  // diya rows
  for (const dx of [180, 300, 420, 1180, 1300, 1420]) s += diya(dx, 936, 1.15);
  const css = `.fl{transform-origin:center 80%;animation:fk 2.2s ease-in-out infinite}@keyframes fk{0%,100%{transform:scale(1) rotate(-2deg)}50%{transform:scale(.86) rotate(2deg)}}.pt{animation:fall linear infinite}@keyframes fall{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(1120px) rotate(240deg)}}`;
  return doc(W, H, s, css);
}

function hinduCouple() {
  const W = 900, H = 1150;
  let s = rect(0, 0, W, H, '#fdf3e0');
  s += mandala(450, 500, 380, '#d4a643', 0.35);
  s += circle(450, 500, 320, '#fbe9cd');
  s += circle(450, 500, 320, 'none', 'stroke="#d4a643" stroke-width="3"');
  s += circle(450, 500, 306, 'none', 'stroke="#d4a643" stroke-width="1.2"');
  s += couple(450, 810, 1.28, { skirt: '#a62639', blouse: '#a62639', trim: '#e9c15c' }, { coat: '#f3e6cc', trim: '#c98f3d', headwear: 'safa', headColor: '#a62639' }, true);
  s += garlandArc(140, 130, 450, 96, 70, '#e8862e', '#f2b134');
  s += garlandArc(450, 96, 760, 130, 70, '#e8862e', '#f2b134');
  for (const dx of [180, 450, 720]) s += diya(dx, 1060, 1.3);
  s += `<text x="450" y="1112" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#7a1f2b" font-style="italic">Aarav &amp; Diya</text>`;
  const css = `.fl{transform-origin:center 80%;animation:fk 2.2s ease-in-out infinite}@keyframes fk{0%,100%{transform:scale(1)}50%{transform:scale(.85)}}`;
  return doc(W, H, s, css);
}

function haldiArt() {
  let s = rect(0, 0, 600, 600, '#fdf0cf');
  s += circle(300, 300, 218, '#f9e2a6');
  s += circle(300, 300, 218, 'none', 'stroke="#d4a643" stroke-width="2.5"');
  // haldi bowl
  s += path('M 170 320 Q 300 360 430 320 L 414 402 Q 300 446 186 402 Z', '#b06a3b');
  s += path('M 170 320 Q 300 360 430 320 Q 300 384 170 320 Z', '#8a4b2c');
  s += ellipse(300, 318, 118, 26, '#f2b134');
  s += ellipse(300, 314, 96, 18, '#f7c94f');
  // turmeric root + smear
  s += path('M 360 254 q 40 -16 56 6 q -18 20 -50 12 q -10 -8 -6 -18 Z', '#e8a03a');
  s += `<path d="M 150 210 q 60 34 120 10" fill="none" stroke="#f2b134" stroke-width="10" stroke-linecap="round"/>`;
  for (const [mx, my] of [[210, 168], [400, 176], [178, 420], [430, 430]]) s += marigold(mx, my, 16);
  s += ellipse(300, 470, 60, 10, '#e8c893');
  return doc(600, 600, s);
}

function hinduSangeet() {
  let s = rect(0, 0, 600, 600, '#f6e3ef');
  s += circle(300, 300, 218, '#f1d3e4');
  s += circle(300, 300, 218, 'none', 'stroke="#a64d79" stroke-width="2.5"');
  s += dhol(300, 320, 1.15, '#a62639', '#e9c15c');
  const notes = [[176, 190, 0], [420, 168, 14], [452, 250, -10], [150, 280, 8]];
  for (const [nx, ny, ro] of notes) {
    s += g(`transform="translate(${nx} ${ny}) rotate(${ro})"`, `<ellipse cx="0" cy="12" rx="9" ry="6.5" fill="#7a1f2b"/><line x1="8" y1="10" x2="8" y2="-22" stroke="#7a1f2b" stroke-width="3.4"/><path d="M 8 -22 q 14 2 16 12" fill="none" stroke="#7a1f2b" stroke-width="3.4"/>`);
  }
  for (const [mx, my] of [[170, 430], [430, 436]]) s += marigold(mx, my, 15, '#d96b7f', '#f2b134');
  return doc(600, 600, s);
}

function hinduPheras() {
  let s = rect(0, 0, 600, 600, '#fbe9d3');
  s += circle(300, 300, 218, '#f8ddb7');
  s += circle(300, 300, 218, 'none', 'stroke="#b03a48" stroke-width="2.5"');
  // havan kund fire
  s += path('M 210 400 L 390 400 L 360 448 L 240 448 Z', '#b06a3b');
  s += path('M 224 400 L 376 400 L 366 416 L 234 416 Z', '#8a4b2c');
  s += `<g class="fl"><path d="M 300 268 C 348 316 342 372 300 396 C 258 372 252 316 300 268 Z" fill="#e8862e"/><path d="M 300 300 C 330 330 326 366 300 384 C 274 366 270 330 300 300 Z" fill="#f2b134"/><path d="M 300 330 C 316 346 314 366 300 376 C 286 366 284 346 300 330 Z" fill="#fde28a"/></g>`;
  s += kalash(160, 452, 0.9);
  s += kalash(440, 452, 0.9);
  s += garlandArc(120, 140, 300, 108, 60, '#e8862e', '#f2b134');
  s += garlandArc(300, 108, 480, 140, 60, '#e8862e', '#f2b134');
  const css = `.fl{transform-origin:300px 380px;animation:fk 1.9s ease-in-out infinite}@keyframes fk{0%,100%{transform:scale(1)}50%{transform:scale(.92) rotate(1.6deg)}}`;
  return doc(600, 600, s, css);
}

function hinduPeacock() {
  const W = 800, H = 1000;
  let s = rect(0, 0, W, H, '#123a33');
  s += mandala(400, 470, 350, '#d4a643', 0.28);
  // feathers fan
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 + (i - 4) * 0.3;
    const fx = 400 + Math.cos(a) * 300;
    const fy = 520 + Math.sin(a) * 300;
    s += `<line x1="400" y1="560" x2="${fx.toFixed(0)}" y2="${fy.toFixed(0)}" stroke="#1e5c4a" stroke-width="10" stroke-linecap="round"/>`;
    s += ellipse(fx, fy, 34, 46, '#1e6b52', `transform="rotate(${(a * 180) / Math.PI + 90} ${fx.toFixed(0)} ${fy.toFixed(0)})"`);
    s += ellipse(fx, fy, 20, 28, '#2a8a66', `transform="rotate(${(a * 180) / Math.PI + 90} ${fx.toFixed(0)} ${fy.toFixed(0)})"`);
    s += ellipse(fx, fy, 10, 14, '#d4a643', `transform="rotate(${(a * 180) / Math.PI + 90} ${fx.toFixed(0)} ${fy.toFixed(0)})"`);
    s += circle(fx, fy, 5, '#123a63');
  }
  // body
  s += path('M 400 560 C 348 620 352 720 400 780 C 448 720 452 620 400 560 Z', '#1d6fa5');
  s += path('M 400 566 C 380 600 368 660 380 700', 'none', 'stroke="#2a8ac2" stroke-width="6" stroke-linecap="round"');
  s += circle(400, 540, 40, '#1d6fa5');
  s += path('M 400 500 q 34 -8 44 16 q -24 12 -44 2 Z', '#1d6fa5');
  s += path('M 436 514 l 26 -4 l -22 14 Z', '#e8862e');
  s += circle(416, 508, 5, '#0e2233');
  for (let i = 0; i < 3; i++) s += `<line x1="${392 + i * 8}" y1="${498 - i * 2}" x2="${386 + i * 8}" y2="${470 - i * 4}" stroke="#d4a643" stroke-width="3" stroke-linecap="round"/><circle cx="${386 + i * 8}" cy="${468 - i * 4}" r="4" fill="#d4a643"/>`;
  s += `<text x="400" y="920" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#d4a643" font-style="italic" letter-spacing="6">MORE THAN WORDS</text>`;
  return doc(W, H, s);
}

function hinduElephant() {
  const W = 800, H = 800;
  let s = rect(0, 0, W, H, '#f9e3c4');
  s += mandala(400, 400, 330, '#b03a48', 0.3);
  s += g(
    'transform="translate(400 430)"',
    // body
    path('M -190 60 Q -200 -80 -60 -110 Q 90 -130 150 -40 Q 190 20 160 90 L 120 90 L 116 40 Q 60 70 -20 60 L -24 90 L -70 90 L -74 50 Q -140 60 -150 90 L -190 90 Z', '#b8677a') +
      // head
      circle(150, -60, 82, '#c47487') +
      // ear with decor
      path('M 96 -110 Q 30 -140 30 -70 Q 30 -10 96 -30 Z', '#a85a6e') +
      path('M 90 -104 Q 46 -124 46 -72 Q 46 -28 90 -40 Z', '#e9c15c') +
      // trunk
      path('M 210 -40 Q 250 30 210 96 Q 190 130 150 122 L 150 104 Q 180 106 196 84 Q 224 30 192 -28 Z', '#c47487') +
      // tusk
      path('M 196 20 q 26 12 20 34 q -20 -4 -26 -22 Z', '#f6efe0') +
      circle(176, -70, 8, '#3a2230') +
      // caparison (decorated cloth)
      path('M -150 -84 Q -20 -130 100 -96 L 96 -20 Q -10 -50 -140 -10 Z', '#a62639') +
      path('M -150 -84 Q -20 -130 100 -96 L 98 -78 Q -16 -110 -146 -66 Z', '#e9c15c') +
      [-120, -80, -40, 0, 40, 80].map((x) => circle(x, -52, 6, '#e9c15c')).join('') +
      // headdress
      path('M 100 -140 Q 150 -170 200 -140 L 194 -108 Q 150 -130 106 -108 Z', '#e9c15c') +
      circle(150, -148, 10, '#a62639')
  );
  s += `<text x="400" y="740" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#7a1f2b" letter-spacing="8">SHUBH VIVAH</text>`;
  return doc(W, H, s);
}

function hinduLotus() {
  const W = 800, H = 800;
  let s = rect(0, 0, W, H, '#7a1f2b');
  s += mandala(400, 400, 330, '#e9c15c', 0.4);
  s += g(
    'transform="translate(400 430)"',
    [-3, -2, -1, 0, 1, 2, 3]
      .map((i) => {
        const a = i * 22;
        return `<path d="M 0 40 C ${i * 60 - 40} -60 ${i * 60 - 20} -140 ${i * 24} -170 C ${i * 60 + 20} -140 ${i * 60 + 40} -60 0 40 Z" fill="${Math.abs(i) === 3 ? '#c85a72' : Math.abs(i) === 2 ? '#d96b7f' : Math.abs(i) === 1 ? '#e78a9a' : '#f2a8b4'}" transform="rotate(${a * 0.14})"/>`;
      })
      .join('') + ellipse(0, 44, 150, 26, '#5c1620')
  );
  s += `<text x="400" y="700" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#e9c15c" letter-spacing="10">SACRED BEGINNINGS</text>`;
  return doc(W, H, s);
}

/* ══════════════════════════ NIKAH ══════════════════════════ */

function nikahHero() {
  const W = 1600, H = 1000;
  let s = '';
  s += `<defs>
    <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#07211b"/><stop offset=".6" stop-color="#0d3b30"/><stop offset="1" stop-color="#12574a"/>
    </linearGradient>
    <radialGradient id="nglow" cx=".5" cy=".42" r=".55">
      <stop offset="0" stop-color="#e6c96a" stop-opacity=".32"/><stop offset="1" stop-color="#e6c96a" stop-opacity="0"/>
    </radialGradient>
  </defs>`;
  s += rect(0, 0, W, H, 'url(#nsky)');
  // stars
  let stars = '';
  for (let i = 0; i < 34; i++) {
    const x = rnd() * W, y = rnd() * 480, r = 1.4 + rnd() * 2.2;
    stars += `<circle class="tw" style="animation-delay:${(-rnd() * 4).toFixed(1)}s" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#f2e2ac"/>`;
  }
  s += stars;
  s += star4(1330, 150, 16, '#e6c96a');
  s += star4(260, 210, 11, '#e6c96a');
  // crescent
  s += `<path d="M 1180 120 a 64 64 0 1 0 44 110 a 52 52 0 1 1 -44 -110 Z" fill="#e6c96a"/>`;
  s += rect(0, 0, W, H, 'url(#nglow)');
  // grand cusped arch
  s += path(cuspArchD(800, 210, 700, 590), '#0a2e26', 'stroke="#c9a227" stroke-width="6"');
  s += path(cuspArchD(800, 232, 640, 560), 'none', 'stroke="#c9a227" stroke-width="2" opacity=".7"');
  // jaali side panels
  for (const jx of [210, 1390]) {
    s += rect(jx - 90, 300, 180, 500, 'rgba(201,162,39,.10)', 8, 'stroke="#c9a227" stroke-opacity=".5"');
    for (let yy = 330; yy < 780; yy += 56) for (let xx = jx - 62; xx <= jx + 62; xx += 62) s += star4(xx, yy, 13, 'rgba(230,201,106,.4)');
  }
  // lanterns
  s += lantern(480, 226, 1.15);
  s += `<g style="animation-delay:-1.4s">${lantern(1120, 226, 1.15)}</g>`;
  s += lantern(800, 180, 0.9);
  // floor
  s += rect(0, 800, W, 200, '#07211b');
  s += `<path d="M 0 806 Q 800 776 1600 806 L 1600 1000 L 0 1000 Z" fill="#0d2b24"/>`;
  for (let x = 90; x < W; x += 130) s += star4(x, 900, 10, 'rgba(230,201,106,.25)');
  // couple
  s += couple(800, 812, 1.02, { skirt: '#0f5c49', blouse: '#0f5c49', trim: '#e6c96a', dupatta: 'rgba(230,201,106,.45)' }, { coat: '#1b1f1e', trim: '#c9a227', legs: '#efe8d2', headwear: 'topi', headColor: '#26302d' }, false);
  const css = `.tw{animation:tw 3.4s ease-in-out infinite}@keyframes tw{0%,100%{opacity:.25}50%{opacity:1}}.sway{animation:sw 5.2s ease-in-out infinite}@keyframes sw{0%,100%{transform:rotate(-3.4deg)}50%{transform:rotate(3.4deg)}}.glow{animation:gl 3s ease-in-out infinite}@keyframes gl{0%,100%{opacity:.85}50%{opacity:1}}`;
  return doc(W, H, s, css);
}

function nikahCouple() {
  const W = 900, H = 1150;
  let s = rect(0, 0, W, H, '#0a2e26');
  s += path(cuspArchD(450, 120, 640, 760), '#0d3b30', 'stroke="#c9a227" stroke-width="5"');
  s += path(cuspArchD(450, 148, 580, 720), 'none', 'stroke="#c9a227" stroke-width="1.6" opacity=".6"');
  for (let i = 0; i < 16; i++) s += star4(90 + rnd() * 720, 80 + rnd() * 260, 6 + rnd() * 8, 'rgba(230,201,106,.5)');
  s += lantern(190, 150, 0.95);
  s += lantern(710, 150, 0.95);
  s += couple(450, 850, 1.24, { skirt: '#0f5c49', blouse: '#0f5c49', trim: '#e6c96a', dupatta: 'rgba(230,201,106,.45)' }, { coat: '#1b1f1e', trim: '#c9a227', legs: '#efe8d2', headwear: 'topi', headColor: '#26302d' });
  s += `<text x="450" y="1080" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#e6c96a" font-style="italic">Ayaan &amp; Zara</text>`;
  const css = `.sway{animation:sw 5s ease-in-out infinite}@keyframes sw{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}.glow{animation:gl 3s ease-in-out infinite}@keyframes gl{0%,100%{opacity:.8}50%{opacity:1}}`;
  return doc(W, H, s, css);
}

function nikahScroll() {
  let s = rect(0, 0, 600, 600, '#0d3b30');
  s += circle(300, 300, 218, '#0f4437');
  s += circle(300, 300, 218, 'none', 'stroke="#c9a227" stroke-width="2.5"');
  // nikahnama scroll
  s += rect(170, 190, 260, 250, '#f4ead0', 6);
  s += path('M 170 190 L 430 190 L 430 176 Q 300 158 170 176 Z', '#e6d5a8');
  s += path('M 170 440 L 430 440 L 430 454 Q 300 472 170 454 Z', '#e6d5a8');
  for (let y = 230; y <= 390; y += 32) s += `<line x1="200" y1="${y}" x2="${y === 230 ? 340 : 400}" y2="${y}" stroke="#8a744a" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;
  s += `<path d="M 200 420 q 24 -18 48 0 q 18 12 36 0" fill="none" stroke="#0e4a3a" stroke-width="3"/>`;
  // pen
  s += g('transform="translate(408 300) rotate(38)"', path('M 0 -70 L 10 -60 L 6 40 L 0 52 L -6 40 L -10 -60 Z', '#c9a227') + path('M 0 52 L 6 40 L 0 30 L -6 40 Z', '#7a5c1c'));
  s += star4(300, 120, 12, '#e6c96a');
  return doc(600, 600, s);
}

function nikahWalima() {
  let s = rect(0, 0, 600, 600, '#0a2e26');
  s += circle(300, 300, 218, '#0d3b30');
  s += circle(300, 300, 218, 'none', 'stroke="#c9a227" stroke-width="2.5"');
  // dinner cloche
  s += path('M 160 360 Q 300 200 440 360 Z', '#c9a227');
  s += path('M 176 352 Q 300 220 424 352 Z', '#e6c96a');
  s += circle(300, 218, 10, '#c9a227');
  s += rect(140, 360, 320, 14, '#8a6d1c', 7);
  s += ellipse(300, 420, 150, 16, '#07211b');
  // steam
  for (const sx of [240, 300, 360]) s += `<path class="st" d="M ${sx} 190 q 10 -22 0 -44 q -10 -20 0 -40" fill="none" stroke="rgba(230,201,106,.6)" stroke-width="4" stroke-linecap="round"/>`;
  const css = `.st{animation:st 3s ease-in-out infinite}@keyframes st{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:.9;transform:translateY(-8px)}}`;
  return doc(600, 600, s, css);
}

function nikahDholki() {
  let s = rect(0, 0, 600, 600, '#0f4437');
  s += circle(300, 300, 218, '#0d3b30');
  s += circle(300, 300, 218, 'none', 'stroke="#c9a227" stroke-width="2.5"');
  s += dhol(300, 316, 1.05, '#7a5c1c', '#e6c96a');
  for (const [mx, my] of [[176, 180], [420, 172], [452, 260]]) s += star4(mx, my, 12, '#e6c96a');
  return doc(600, 600, s);
}

function nikahPattern() {
  const W = 800, H = 1000;
  let s = rect(0, 0, W, H, '#0a2e26');
  for (let y = 60; y < H; y += 120) {
    for (let x = 60 + ((y / 120) % 2) * 60; x < W; x += 120) {
      s += star4(x, y, 34, 'none') ;
      s += `<g transform="translate(${x} ${y})"><path d="M 0 -34 L 8 -8 L 34 0 L 8 8 L 0 34 L -8 8 L -34 0 L -8 -8 Z" fill="none" stroke="#c9a227" stroke-width="2"/><circle r="6" fill="#e6c96a"/></g>`;
    }
  }
  s += rect(0, 0, W, H, 'none', 0, 'stroke="#c9a227" stroke-width="10"');
  return doc(W, H, s);
}

function nikahSkyline() {
  const W = 800, H = 800;
  let s = `<defs><linearGradient id="msky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07211b"/><stop offset="1" stop-color="#12574a"/></linearGradient></defs>`;
  s += rect(0, 0, W, H, 'url(#msky)');
  for (let i = 0; i < 22; i++) s += `<circle class="tw" style="animation-delay:${(-rnd() * 4).toFixed(1)}s" cx="${(rnd() * W).toFixed(0)}" cy="${(rnd() * 320).toFixed(0)}" r="${(1.2 + rnd() * 2).toFixed(1)}" fill="#f2e2ac"/>`;
  s += `<path d="M 560 130 a 58 58 0 1 0 40 100 a 47 47 0 1 1 -40 -100 Z" fill="#e6c96a"/>`;
  // mosque silhouette
  s += g(
    'transform="translate(0 40)"',
    path('M 250 560 Q 250 420 400 380 Q 550 420 550 560 Z', '#0a3a2e') +
      path('M 400 380 Q 396 340 380 328 Q 400 312 420 328 Q 404 340 400 380 Z', '#c9a227') +
      rect(120, 360, 34, 200, '#0a3a2e') + path('M 118 360 Q 137 322 156 360 Z', '#c9a227') +
      rect(646, 360, 34, 200, '#0a3a2e') + path('M 644 360 Q 663 322 682 360 Z', '#c9a227') +
      rect(80, 540, 640, 130, '#0a3a2e') +
      [200, 300, 400, 500, 600].map((ax) => path(`M ${ax - 26} 668 L ${ax - 26} 600 Q ${ax} 566 ${ax + 26} 600 L ${ax + 26} 668 Z`, '#e6c96a', 'opacity=".85"')).join('')
  );
  s += rect(0, 706, W, 94, '#07211b');
  const css = `.tw{animation:tw 3.4s ease-in-out infinite}@keyframes tw{0%,100%{opacity:.25}50%{opacity:1}}`;
  return doc(W, H, s, css);
}

function nikahLanterns() {
  const W = 800, H = 1000;
  let s = rect(0, 0, W, H, '#0d3b30');
  for (let i = 0; i < 18; i++) s += star4(40 + rnd() * 720, 40 + rnd() * 900, 5 + rnd() * 8, 'rgba(230,201,106,.35)');
  s += lantern(200, 60, 1.5);
  s += `<g style="animation-delay:-1.2s">${lantern(430, 130, 2.1)}</g>`;
  s += `<g style="animation-delay:-2.6s">${lantern(640, 60, 1.3)}</g>`;
  s += lantern(300, 480, 1.7);
  s += `<g style="animation-delay:-2s">${lantern(560, 520, 1.4)}</g>`;
  const css = `.sway{animation:sw 5s ease-in-out infinite}@keyframes sw{0%,100%{transform:rotate(-3.6deg)}50%{transform:rotate(3.6deg)}}.glow{animation:gl 2.8s ease-in-out infinite}@keyframes gl{0%,100%{opacity:.75}50%{opacity:1}}`;
  return doc(W, H, s, css);
}

/* ══════════════════════════ CHRISTIAN ══════════════════════════ */

function floralStem(x, y, len, angle, color = '#8ba07e', flower = '#e8c9c0') {
  let s = '';
  const steps = 6;
  let px = x, py = y, a = angle;
  let d = `M ${x} ${y}`;
  const pts = [];
  for (let i = 0; i < steps; i++) {
    a += (rnd() - 0.5) * 0.4;
    const nx = px + Math.cos(a) * (len / steps);
    const ny = py - Math.sin(a) * (len / steps);
    d += ` Q ${(px + nx) / 2 + 6} ${(py + ny) / 2} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
    pts.push([nx, ny]);
    px = nx; py = ny;
  }
  s += `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.4"/>`;
  pts.forEach(([lx, ly], i) => {
    const side = i % 2 ? 1 : -1;
    s += ellipse(lx + side * 9, ly, 10, 4.4, color, `transform="rotate(${side * 42} ${lx + side * 9} ${ly})" opacity=".85"`);
  });
  s += circle(px, py, 8, flower) + circle(px, py, 4, '#d9a5a0');
  return s;
}

function churchWindow(cx, top, w, h, paneColors) {
  const left = cx - w / 2;
  const base = top + h;
  const d = `M ${left} ${base} L ${left} ${top + h * 0.36} Q ${left} ${top + h * 0.06} ${cx} ${top} Q ${cx + w / 2} ${top + h * 0.06} ${cx + w / 2} ${top + h * 0.36} L ${cx + w / 2} ${base} Z`;
  let s = path(d, '#e9e2d2');
  // panes
  const cols = 3, rows = 5;
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = left + (w / cols) * c + 5;
      const pw = w / cols - 10;
      const py = top + h * 0.3 + ((h * 0.7 - 14) / rows) * r + 5;
      const ph = (h * 0.7 - 14) / rows - 8;
      s += rect(px, py, pw, ph, paneColors[i % paneColors.length], 4, 'class="pane" opacity=".9"');
      i++;
    }
  }
  // rose window
  s += circle(cx, top + h * 0.17, w * 0.16, paneColors[1], 'class="pane"');
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    s += ellipse(cx + Math.cos(a) * w * 0.1, top + h * 0.17 + Math.sin(a) * w * 0.1, w * 0.05, w * 0.03, '#fff', `transform="rotate(${(a * 180) / Math.PI} ${cx + Math.cos(a) * w * 0.1} ${top + h * 0.17 + Math.sin(a) * w * 0.1})" opacity=".8"`);
  }
  s += path(d, 'none', 'stroke="#c9b37e" stroke-width="5"');
  s += `<line x1="${left + w / 3}" y1="${top + h * 0.3}" x2="${left + w / 3}" y2="${base}" stroke="#c9b37e" stroke-width="3"/>`;
  s += `<line x1="${left + (2 * w) / 3}" y1="${top + h * 0.3}" x2="${left + (2 * w) / 3}" y2="${base}" stroke="#c9b37e" stroke-width="3"/>`;
  return s;
}

function christianHero() {
  const W = 1600, H = 1000;
  let s = rect(0, 0, W, H, '#fbf9f4');
  s += `<defs><radialGradient id="chg" cx=".5" cy=".35" r=".6"><stop offset="0" stop-color="#fdf3e3" /><stop offset="1" stop-color="#fbf9f4"/></radialGradient></defs>`;
  s += rect(0, 0, W, H, 'url(#chg)');
  s += churchWindow(800, 90, 480, 640, ['#aec6d4', '#e8c9c0', '#d4dfd0', '#f2e2c4']);
  // light rays
  s += `<g class="ray"><path d="M 800 240 L 520 900 L 660 900 Z" fill="#f2e2c4" opacity=".28"/><path d="M 800 240 L 940 900 L 1080 900 Z" fill="#f2e2c4" opacity=".22"/></g>`;
  // side florals
  s += floralStem(120, 950, 380, 1.3);
  s += floralStem(230, 970, 300, 1.6, '#a8b8a0', '#fff');
  s += floralStem(1480, 950, 380, 1.85);
  s += floralStem(1380, 970, 300, 1.5, '#a8b8a0', '#fff');
  // doves
  for (const [dx, dy, fl] of [[430, 200, 1], [1190, 240, -1]]) {
    s += g(`transform="translate(${dx} ${dy}) scale(${fl},1)"`, path('M 0 0 Q 20 -16 44 -8 Q 30 2 16 4 Q 30 12 22 26 Q 8 20 2 8 Q -18 14 -34 4 Q -18 -2 -8 -2 Q -16 -12 -6 -18 Q 0 -10 0 0 Z', '#fff', 'stroke="#c9c2b4" stroke-width="1.4"'));
  }
  // couple
  s += couple(800, 900, 1.05, { gown: true, skirt: '#ffffff', veil: true, bouquet: true, dupattaHead: false }, { coat: '#2e3238', trim: '#54595f', legs: '#2e3238', headwear: 'hair' }, false, 104);
  // petals
  let petals = '';
  for (let i = 0; i < 10; i++) {
    petals += `<ellipse class="pt" style="animation-delay:${(-rnd() * 14).toFixed(1)}s;animation-duration:${(12 + rnd() * 8).toFixed(1)}s" cx="${(120 + rnd() * 1360).toFixed(0)}" cy="-30" rx="7" ry="4" fill="${i % 2 ? '#e8c9c0' : '#fff'}" opacity=".9"/>`;
  }
  s += petals;
  const css = `.pt{animation:fall linear infinite}@keyframes fall{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(1100px) rotate(200deg)}}.ray{animation:ray 6s ease-in-out infinite}@keyframes ray{0%,100%{opacity:.5}50%{opacity:1}}.pane{animation:sh 7s ease-in-out infinite}@keyframes sh{0%,100%{opacity:.82}50%{opacity:1}}`;
  return doc(W, H, s, css);
}

function christianCouple() {
  const W = 900, H = 1150;
  let s = rect(0, 0, W, H, '#fbf9f4');
  s += circle(450, 470, 330, '#f4efe4');
  s += circle(450, 470, 330, 'none', 'stroke="#c9b37e" stroke-width="2.5"');
  s += floralStem(140, 1080, 330, 1.4);
  s += floralStem(760, 1080, 330, 1.75);
  s += couple(450, 830, 1.26, { gown: true, skirt: '#ffffff', veil: true, bouquet: true, dupattaHead: false }, { coat: '#2e3238', trim: '#54595f', legs: '#2e3238', headwear: 'hair' }, false, 104);
  s += `<text x="450" y="1090" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#3a3f45" font-style="italic">Joel &amp; Merin</text>`;
  return doc(W, H, s);
}

function christianRings() {
  let s = rect(0, 0, 600, 600, '#f4efe4');
  s += circle(300, 300, 218, '#fbf9f4');
  s += circle(300, 300, 218, 'none', 'stroke="#c9b37e" stroke-width="2.5"');
  s += circle(262, 310, 62, 'none', 'stroke="#c9b37e" stroke-width="12"');
  s += circle(348, 310, 62, 'none', 'stroke="#d8c692" stroke-width="12"');
  s += path('M 348 236 l 12 14 l -12 14 l -12 -14 Z', '#aec6d4');
  s += floralStem(160, 470, 180, 1.2);
  s += floralStem(440, 470, 180, 1.9);
  return doc(600, 600, s);
}

function christianChurch() {
  let s = rect(0, 0, 600, 600, '#fbf9f4');
  s += circle(300, 300, 218, '#eef0e8');
  s += circle(300, 300, 218, 'none', 'stroke="#7d92a1" stroke-width="2.5"');
  s += g(
    'transform="translate(300 316)"',
    path('M -110 140 L -110 -20 L 0 -90 L 110 -20 L 110 140 Z', '#f7f3e8', 'stroke="#c9c2b4" stroke-width="3"') +
      path('M -122 -14 L 0 -96 L 122 -14 L 122 -28 L 0 -110 L -122 -28 Z', '#7d92a1') +
      rect(-16, -170, 32, 70, '#f7f3e8', 0, 'stroke="#c9c2b4" stroke-width="3"') +
      path('M -22 -170 L 0 -196 L 22 -170 Z', '#7d92a1') +
      `<line x1="0" y1="-224" x2="0" y2="-196" stroke="#c9b37e" stroke-width="5"/><line x1="-12" y1="-214" x2="12" y2="-214" stroke="#c9b37e" stroke-width="5"/>` +
      path('M -26 140 L -26 60 Q 0 36 26 60 L 26 140 Z', '#8a6d54') +
      circle(-58, 20, 18, '#aec6d4') + circle(58, 20, 18, '#aec6d4')
  );
  return doc(600, 600, s);
}

function christianTea() {
  let s = rect(0, 0, 600, 600, '#f4ede2');
  s += circle(300, 300, 218, '#fbf7ee');
  s += circle(300, 300, 218, 'none', 'stroke="#c9b37e" stroke-width="2.5"');
  s += ellipse(300, 420, 140, 18, '#e2d8c2');
  s += path('M 190 300 Q 195 396 300 400 Q 405 396 410 300 Z', '#fff', 'stroke="#c9c2b4" stroke-width="3"');
  s += path('M 408 312 q 54 -6 44 40 q -8 34 -52 28', 'none', 'stroke="#c9c2b4" stroke-width="8"');
  s += `<path d="M 214 300 Q 300 322 386 300" fill="none" stroke="#d9a5a0" stroke-width="6"/>`;
  for (const sx of [258, 300, 342]) s += `<path class="st" d="M ${sx} 250 q 10 -20 0 -40 q -10 -18 0 -36" fill="none" stroke="#c9c2b4" stroke-width="4" stroke-linecap="round"/>`;
  s += floralStem(170, 470, 150, 1.1);
  const css = `.st{animation:st 3s ease-in-out infinite}@keyframes st{0%,100%{opacity:.3}50%{opacity:.9}}`;
  return doc(600, 600, s, css);
}

function christianCake() {
  let s = rect(0, 0, 600, 600, '#fbf9f4');
  s += circle(300, 300, 218, '#f4efe4');
  s += circle(300, 300, 218, 'none', 'stroke="#d9a5a0" stroke-width="2.5"');
  s += rect(180, 380, 240, 22, '#c9b37e', 10);
  s += rect(205, 300, 190, 80, '#fff', 8, 'stroke="#e2d8c2" stroke-width="2"');
  s += rect(228, 226, 144, 74, '#fff', 8, 'stroke="#e2d8c2" stroke-width="2"');
  s += rect(252, 162, 96, 64, '#fff', 8, 'stroke="#e2d8c2" stroke-width="2"');
  s += `<path d="M 205 322 q 24 18 48 0 q 24 18 48 0 q 24 18 48 0 q 24 18 46 0" fill="none" stroke="#e8c9c0" stroke-width="6"/>`;
  s += `<path d="M 228 246 q 20 16 40 0 q 20 16 40 0 q 20 16 40 0 q 12 10 24 2" fill="none" stroke="#aec6d4" stroke-width="5"/>`;
  s += marigold(300, 156, 13, '#e8c9c0', '#fff');
  s += marigold(276, 168, 9, '#d9a5a0', '#fff');
  s += marigold(324, 168, 9, '#fff', '#e8c9c0');
  return doc(600, 600, s);
}

function christianBouquet() {
  const W = 800, H = 1000;
  let s = rect(0, 0, W, H, '#f4efe4');
  for (let i = 0; i < 7; i++) s += floralStem(300 + rnd() * 200, 860, 300 + rnd() * 220, 1.2 + rnd() * 0.7, i % 2 ? '#8ba07e' : '#a8b8a0', ['#e8c9c0', '#fff', '#d9a5a0'][i % 3]);
  s += path('M 350 860 L 450 860 L 430 980 L 370 980 Z', '#e2d8c2');
  s += `<path d="M 350 880 L 450 880" stroke="#c9b37e" stroke-width="6"/>`;
  s += `<text x="400" y="70" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#3a3f45" font-style="italic" letter-spacing="4">something borrowed</text>`;
  return doc(W, H, s);
}

function christianDoves() {
  const W = 800, H = 800;
  let s = rect(0, 0, W, H, '#7d92a1');
  s += circle(400, 400, 330, '#8fa2b0');
  s += circle(400, 400, 330, 'none', 'stroke="#fbf9f4" stroke-width="2" opacity=".6"');
  for (const [dx, dy, fl, sc] of [[320, 360, 1, 2.2], [500, 440, -1, 1.8]]) {
    s += g(`transform="translate(${dx} ${dy}) scale(${fl * sc},${sc})"`, path('M 0 0 Q 20 -16 44 -8 Q 30 2 16 4 Q 30 12 22 26 Q 8 20 2 8 Q -18 14 -34 4 Q -18 -2 -8 -2 Q -16 -12 -6 -18 Q 0 -10 0 0 Z', '#fbf9f4'));
  }
  s += `<path d="M 340 560 q 60 40 120 0" fill="none" stroke="#e8c9c0" stroke-width="6" stroke-linecap="round"/>`;
  s += circle(340, 560, 6, '#e8c9c0') + circle(460, 560, 6, '#e8c9c0');
  s += `<text x="400" y="680" text-anchor="middle" font-family="Georgia,serif" font-size="24" fill="#fbf9f4" letter-spacing="8">TWO BECOME ONE</text>`;
  return doc(W, H, s);
}

/* ══════════════════════════ MODERN ══════════════════════════ */

function modernHero() {
  const W = 1600, H = 1000;
  let s = rect(0, 0, W, H, '#1a1a1e');
  s += `<defs>
    <linearGradient id="msun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2a488"/><stop offset="1" stop-color="#e2725b"/></linearGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".05"/></feComponentTransfer><feComposite operator="over" in2="SourceGraphic"/></filter>
  </defs>`;
  // giant arch-sun
  s += path('M 420 900 L 420 560 Q 420 220 800 220 Q 1180 220 1180 560 L 1180 900 Z', 'url(#msun)');
  s += `<circle class="orb" cx="800" cy="330" r="70" fill="#1a1a1e"/>`;
  // rings
  s += circle(310, 260, 100, 'none', 'stroke="#e8dcc8" stroke-width="2" opacity=".5"');
  s += circle(1330, 720, 150, 'none', 'stroke="#e8dcc8" stroke-width="2" opacity=".35"');
  s += `<line x1="80" y1="900" x2="1520" y2="900" stroke="#e8dcc8" stroke-width="2" opacity=".6"/>`;
  // stars/dots
  for (let i = 0; i < 16; i++) s += circle(60 + rnd() * 1480, 60 + rnd() * 500, 2.4, '#e8dcc8', `opacity="${0.3 + rnd() * 0.5}"`);
  // couple, contemporary
  s += couple(800, 898, 1.04, { gown: true, skirt: '#e8dcc8', veil: false, bouquet: false, dupattaHead: false }, { coat: '#26262c', trim: '#e2725b', legs: '#26262c', headwear: 'hair' }, false, 100);
  // type marks
  s += `<text x="130" y="180" font-family="Georgia,serif" font-size="120" fill="#e8dcc8" font-style="italic">K</text>`;
  s += `<text x="1400" y="200" font-family="Georgia,serif" font-size="120" fill="#e8dcc8" font-style="italic">N</text>`;
  s += `<text x="800" y="975" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#e8dcc8" letter-spacing="16">12 · 12 · 26</text>`;
  const css = `.orb{animation:orb 7s ease-in-out infinite}@keyframes orb{0%,100%{transform:translateY(0)}50%{transform:translateY(-34px)}}`;
  return doc(W, H, s, css);
}

function modernCouple() {
  const W = 900, H = 1150;
  let s = rect(0, 0, W, H, '#1a1a1e');
  s += path('M 170 1000 L 170 560 Q 170 240 450 240 Q 730 240 730 560 L 730 1000 Z', '#e2725b');
  s += circle(450, 350, 54, '#1a1a1e');
  s += couple(450, 990, 1.24, { gown: true, skirt: '#e8dcc8', veil: false, dupattaHead: false }, { coat: '#26262c', trim: '#e2725b', legs: '#26262c', headwear: 'hair' }, false, 100);
  s += `<text x="450" y="120" text-anchor="middle" font-family="Georgia,serif" font-size="56" fill="#e8dcc8" font-style="italic">Kabir &amp; Naina</text>`;
  return doc(W, H, s);
}

const modernIcon = (inner, bg = '#1a1a1e', ring = '#e2725b') =>
  doc(600, 600, rect(0, 0, 600, 600, bg) + circle(300, 300, 218, 'none', `stroke="${ring}" stroke-width="3"`) + inner);

function modernRings() {
  return modernIcon(
    circle(262, 300, 66, 'none', 'stroke="#e8dcc8" stroke-width="10"') +
      circle(350, 300, 66, 'none', 'stroke="#e2725b" stroke-width="10"')
  );
}
function modernCocktail() {
  return modernIcon(
    path('M 190 180 L 410 180 L 310 320 L 310 420 L 370 440 L 230 440 L 290 420 L 290 320 Z', 'none', 'stroke="#e8dcc8" stroke-width="9" stroke-linejoin="round"') +
      circle(340, 150, 22, '#e2725b') +
      `<line x1="340" y1="150" x2="300" y2="240" stroke="#f2a488" stroke-width="6"/>`
  );
}
function modernDisco() {
  let inner = circle(300, 280, 110, '#e8dcc8');
  for (let y = 190; y <= 370; y += 30) inner += `<line x1="${300 - Math.sqrt(Math.max(0, 110 * 110 - (y - 280) * (y - 280)))}" y1="${y}" x2="${300 + Math.sqrt(Math.max(0, 110 * 110 - (y - 280) * (y - 280)))}" y2="${y}" stroke="#1a1a1e" stroke-width="4"/>`;
  for (let i = 0; i < 5; i++) inner += `<line x1="${240 + i * 30}" y1="176" x2="${240 + i * 30}" y2="384" stroke="#1a1a1e" stroke-width="4" opacity="${1 - Math.abs(i - 2) * 0.28}"/>`;
  inner += `<line x1="300" y1="100" x2="300" y2="170" stroke="#e8dcc8" stroke-width="6"/>`;
  inner += `<g class="sp"><path d="M 300 430 l 14 24 l -28 0 Z" fill="#e2725b"/><path d="M 220 410 l 10 18 l -20 0 Z" fill="#f2a488"/><path d="M 380 410 l 10 18 l -20 0 Z" fill="#f2a488"/></g>`;
  return doc(600, 600, rect(0, 0, 600, 600, '#1a1a1e') + circle(300, 300, 218, 'none', 'stroke="#e2725b" stroke-width="3"') + inner, `.sp{animation:sp 2s ease-in-out infinite}@keyframes sp{0%,100%{opacity:.4}50%{opacity:1}}`);
}
function modernBrunch() {
  return modernIcon(
    circle(300, 310, 120, 'none', 'stroke="#e8dcc8" stroke-width="8"') +
      circle(300, 310, 88, 'none', 'stroke="#e8dcc8" stroke-width="3" opacity=".5"') +
      path('M 262 274 q 38 -30 76 0 q 30 26 8 62 q -46 28 -92 0 q -22 -36 8 -62 Z', '#e2a45b') +
      path('M 268 282 q 32 -24 64 0', 'none', 'stroke="#b0713a" stroke-width="4"') +
      `<line x1="150" y1="250" x2="150" y2="380" stroke="#e2725b" stroke-width="7"/><line x1="136" y1="250" x2="136" y2="300" stroke="#e2725b" stroke-width="5"/><line x1="164" y1="250" x2="164" y2="300" stroke="#e2725b" stroke-width="5"/>` +
      `<line x1="452" y1="250" x2="452" y2="380" stroke="#e2725b" stroke-width="7"/><path d="M 452 250 q -22 30 0 58" fill="none" stroke="#e2725b" stroke-width="5"/>`
  );
}
function modernAbstract1() {
  const W = 800, H = 1000;
  let s = rect(0, 0, W, H, '#e2725b');
  s += path('M 0 620 Q 400 420 800 620 L 800 1000 L 0 1000 Z', '#1a1a1e');
  s += circle(400, 330, 180, '#f2a488');
  s += circle(400, 330, 180, 'none', 'stroke="#1a1a1e" stroke-width="4"');
  s += circle(400, 330, 60, '#1a1a1e');
  s += `<text x="400" y="880" text-anchor="middle" font-family="Georgia,serif" font-size="40" fill="#e8dcc8" font-style="italic">golden hour, forever</text>`;
  return doc(W, H, s);
}
function modernType() {
  const W = 800, H = 800;
  let s = rect(0, 0, W, H, '#e8dcc8');
  s += `<text x="120" y="330" font-family="Georgia,serif" font-size="300" fill="#1a1a1e">K</text>`;
  s += `<text x="380" y="600" font-family="Georgia,serif" font-size="300" fill="#e2725b" font-style="italic">N</text>`;
  s += `<text x="330" y="440" font-family="Georgia,serif" font-size="170" fill="#1a1a1e" font-style="italic">&amp;</text>`;
  s += rect(0, 0, W, H, 'none', 0, 'stroke="#1a1a1e" stroke-width="14"');
  return doc(W, H, s);
}
function modernChecker() {
  const W = 800, H = 1000;
  let s = rect(0, 0, W, H, '#1a1a1e');
  for (let y = 0; y < 10; y++) for (let x = 0; x < 8; x++) if ((x + y) % 2) s += rect(x * 100, y * 100, 100, 100, '#232329');
  s += path('M 150 850 Q 400 250 650 850 Z', '#e2725b');
  s += circle(400, 340, 90, '#f2a488');
  return doc(W, H, s);
}
function modernSunMoon() {
  const W = 800, H = 800;
  let s = rect(0, 0, W, H, '#f5f1e8');
  s += circle(280, 400, 190, '#e2725b');
  s += `<path d="M 520 210 a 190 190 0 1 0 130 330 a 152 152 0 1 1 -130 -330 Z" fill="#1a1a1e"/>`;
  s += `<text x="400" y="720" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#1a1a1e" letter-spacing="10">DAY ONE TO FOREVER</text>`;
  return doc(W, H, s);
}

/* ══════════════════════════ SIKH ══════════════════════════ */

function phulkariBand(y, W, size = 44, c1 = '#e8862e', c2 = '#f2a541', c3 = '#b03a48') {
  let s = '';
  for (let x = 0; x < W; x += size) {
    s += path(`M ${x} ${y} L ${x + size / 2} ${y - size / 2} L ${x + size} ${y} Z`, (x / size) % 2 ? c1 : c2);
    s += path(`M ${x} ${y} L ${x + size / 2} ${y + size / 2} L ${x + size} ${y} Z`, (x / size) % 2 ? c3 : c1);
  }
  return s;
}

function sikhHero() {
  const W = 1600, H = 1000;
  let s = `<defs><linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3e0"/><stop offset=".55" stop-color="#fbe3bd"/><stop offset="1" stop-color="#f6d09a"/></linearGradient><radialGradient id="sgl" cx=".5" cy=".4" r=".55"><stop offset="0" stop-color="#f2a541" stop-opacity=".5"/><stop offset="1" stop-color="#f2a541" stop-opacity="0"/></radialGradient></defs>`;
  s += rect(0, 0, W, H, 'url(#ssky)');
  s += circle(800, 430, 360, 'url(#sgl)');
  // gurdwara dome silhouette
  s += g(
    'transform="translate(800 0)"',
    path('M -260 330 L 260 330 L 260 300 L -260 300 Z', '#e8b25c') +
      path('M -180 300 Q -180 190 0 160 Q 180 190 180 300 Z', '#f4c778') +
      path('M 0 160 Q -8 116 -30 100 Q 0 76 30 100 Q 8 116 0 160 Z', '#d9922e') +
      `<line x1="0" y1="76" x2="0" y2="44" stroke="#b06a1e" stroke-width="5"/>` +
      path('M 0 30 q 10 8 0 18 q -10 -10 0 -18 Z', '#b06a1e') +
      rect(-250, 200, 40, 130, '#f4c778') + path('M -252 200 Q -230 168 -208 200 Z', '#d9922e') +
      rect(210, 200, 40, 130, '#f4c778') + path('M 208 200 Q 230 168 252 200 Z', '#d9922e')
  );
  // phulkari canopy bunting
  s += `<g class="bunt" style="transform-origin:800px 0px">${garlandBunting(120, 90, 1480, 90, 130)}</g>`;
  // couple
  s += couple(800, 880, 1.08, { skirt: '#b03a48', blouse: '#b03a48', trim: '#e9c15c', dupatta: 'rgba(217,107,127,.85)', choora: true }, { coat: '#e8862e', trim: '#d9b45b', legs: '#fff3e0', headwear: 'turban', headColor: '#1e2a5a' }, true);
  // ground + jaggo lamps
  s += rect(0, 880, W, 120, '#e8c893');
  s += `<path d="M 0 886 Q 800 856 1600 886 L 1600 1000 L 0 1000 Z" fill="#dfb87e"/>`;
  for (const dx of [200, 330, 1270, 1400]) s += diya(dx, 920, 1.2);
  s += phulkariBand(986, W, 40);
  // petals
  let petals = '';
  for (let i = 0; i < 12; i++) petals += `<ellipse class="pt" style="animation-delay:${(-rnd() * 15).toFixed(1)}s;animation-duration:${(11 + rnd() * 8).toFixed(1)}s" cx="${(140 + rnd() * 1320).toFixed(0)}" cy="-30" rx="6.4" ry="3.6" fill="${i % 2 ? '#e8862e' : '#b03a48'}" opacity=".8"/>`;
  s += petals;
  const css = `.fl{transform-origin:center 80%;animation:fk 2.1s ease-in-out infinite}@keyframes fk{0%,100%{transform:scale(1)}50%{transform:scale(.86)}}.pt{animation:fall linear infinite}@keyframes fall{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(1120px) rotate(220deg)}}.bunt{animation:bw 6s ease-in-out infinite}@keyframes bw{0%,100%{transform:rotate(-.5deg)}50%{transform:rotate(.5deg)}}`;
  return doc(W, H, s, css);
}

function garlandBunting(x1, y1, x2, y2, sag) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag;
  let s = `<path d="M ${x1} ${y1} Q ${mx} ${my + sag * 0.5} ${x2} ${y2}" fill="none" stroke="#b03a48" stroke-width="4"/>`;
  const n = 16;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
    const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * (my + sag * 0.5) + t * t * y2;
    const cols = ['#e8862e', '#f2a541', '#1e2a5a', '#b03a48'];
    s += path(`M ${px - 22} ${py} L ${px + 22} ${py} L ${px} ${py + 40} Z`, cols[i % 4]);
  }
  return s;
}

function sikhCouple() {
  const W = 900, H = 1150;
  let s = rect(0, 0, W, H, '#fff3e0');
  s += phulkariBand(60, W, 44);
  s += phulkariBand(1120, W, 44);
  s += circle(450, 520, 340, '#fbe3bd');
  s += circle(450, 520, 340, 'none', 'stroke="#d9922e" stroke-width="3"');
  s += couple(450, 850, 1.26, { skirt: '#b03a48', blouse: '#b03a48', trim: '#e9c15c', dupatta: 'rgba(217,107,127,.85)', choora: true }, { coat: '#e8862e', trim: '#d9b45b', legs: '#fff3e0', headwear: 'turban', headColor: '#1e2a5a' }, true);
  s += `<text x="450" y="1070" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#1e2a5a" font-style="italic">Arjun &amp; Simran</text>`;
  return doc(W, H, s);
}

function sikhIkOnkar() {
  // Stylised Ik Onkar in gold on deep blue roundel
  let s = rect(0, 0, 600, 600, 'none');
  s += circle(300, 300, 270, '#1e2a5a');
  s += circle(300, 300, 270, 'none', 'stroke="#d9b45b" stroke-width="5"');
  s += circle(300, 300, 250, 'none', 'stroke="#d9b45b" stroke-width="1.6" opacity=".7"');
  s += g(
    'transform="translate(300 310)"',
    // the numeral 1 (Ik)
    `<path d="M -96 -110 Q -66 -128 -58 -96 L -58 96 Q -58 120 -80 122" fill="none" stroke="#d9b45b" stroke-width="22" stroke-linecap="round"/>` +
      // Oankar open circle with flourish
      `<path d="M 36 -6 a 74 74 0 1 1 -34 -66" fill="none" stroke="#d9b45b" stroke-width="22" stroke-linecap="round"/>` +
      `<path d="M 30 -72 Q 92 -96 132 -58 Q 150 -12 118 6" fill="none" stroke="#d9b45b" stroke-width="16" stroke-linecap="round"/>` +
      `<path d="M 118 6 q 26 40 -6 84" fill="none" stroke="#d9b45b" stroke-width="16" stroke-linecap="round"/>`
  );
  return doc(600, 600, s);
}

function sikhJaggo() {
  let s = rect(0, 0, 600, 600, '#2a1e3f');
  s += circle(300, 300, 218, '#352852');
  s += circle(300, 300, 218, 'none', 'stroke="#f2a541" stroke-width="2.5"');
  // decorated gagar pot with candles
  s += path('M 210 330 Q 200 260 300 250 Q 400 260 390 330 Q 396 396 300 408 Q 204 396 210 330 Z', '#c9762a');
  s += `<path d="M 216 300 q 84 24 168 0" fill="none" stroke="#f2d38a" stroke-width="5"/>`;
  s += `<path d="M 220 340 q 80 22 160 0" fill="none" stroke="#f2d38a" stroke-width="5"/>`;
  for (let i = 0; i < 5; i++) s += circle(240 + i * 30, 372, 4, '#f2d38a');
  s += ellipse(300, 246, 64, 12, '#a85a1e');
  // candles on top
  for (const [cx2, ch] of [[260, 30], [300, 40], [340, 30]]) {
    s += rect(cx2 - 8, 210 - ch, 16, ch, '#f4e9d0', 3);
    s += `<g class="fl"><path d="M ${cx2} ${188 - ch} C ${cx2 + 6} ${196 - ch} ${cx2 + 5} ${202 - ch} ${cx2} ${205 - ch} C ${cx2 - 5} ${202 - ch} ${cx2 - 6} ${196 - ch} ${cx2} ${188 - ch} Z" fill="#f7a92e"/></g>`;
  }
  s += ellipse(300, 470, 120, 14, '#241a38');
  const css = `.fl{animation:fk 1.8s ease-in-out infinite}@keyframes fk{0%,100%{opacity:1}50%{opacity:.65}}`;
  return doc(600, 600, s, css);
}

function sikhChoora() {
  let s = rect(0, 0, 600, 600, '#fbe3bd');
  s += circle(300, 300, 218, '#fff3e0');
  s += circle(300, 300, 218, 'none', 'stroke="#b03a48" stroke-width="2.5"');
  // forearm with choora
  s += g(
    'transform="translate(300 300) rotate(-34)"',
    rect(-42, -160, 84, 260, SKIN, 40) +
      [0, 1, 2, 3, 4, 5, 6, 7].map((i) => rect(-46, -140 + i * 28, 92, 16, i % 2 ? '#fff' : '#b03a48', 8, 'stroke="#8a2334" stroke-width="1.4"')).join('') +
      // kalire dangling
      `<g transform="translate(-40 110)"><line x1="0" y1="0" x2="-30" y2="60" stroke="#d9b45b" stroke-width="4"/><path d="M -30 60 l -22 34 q 22 16 44 0 Z" fill="#d9b45b"/><circle cx="-30" cy="60" r="8" fill="#e9c15c"/></g>` +
      // hand + henna dot
      circle(0, -172, 34, SKIN) + circle(0, -172, 9, 'none', 'stroke="#7a4a2b" stroke-width="2.4"')
  );
  return doc(600, 600, s);
}

function sikhPattern() {
  const W = 800, H = 1000;
  let s = rect(0, 0, W, H, '#b03a48');
  for (let y = 80; y < H; y += 160) s += phulkariBand(y, W, 80, '#e8862e', '#f2a541', '#1e2a5a');
  s += rect(0, 0, W, H, 'none', 0, 'stroke="#d9b45b" stroke-width="12"');
  return doc(W, H, s);
}

function sikhDome() {
  const W = 800, H = 800;
  let s = `<defs><linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e2a5a"/><stop offset="1" stop-color="#3a4a8a"/></linearGradient></defs>`;
  s += rect(0, 0, W, H, 'url(#gsky)');
  for (let i = 0; i < 20; i++) s += circle(rnd() * W, rnd() * 300, 1.6 + rnd() * 2, '#f2e2ac', `opacity="${0.4 + rnd() * 0.5}"`);
  s += g(
    'transform="translate(400 120)"',
    path('M -240 560 L 240 560 L 240 300 L -240 300 Z', '#2e3a6e') +
      path('M -180 300 Q -180 190 0 160 Q 180 190 180 300 Z', '#f4c778') +
      path('M 0 160 Q -8 116 -30 100 Q 0 76 30 100 Q 8 116 0 160 Z', '#d9922e') +
      `<line x1="0" y1="76" x2="0" y2="40" stroke="#f4c778" stroke-width="5"/>` +
      [-150, -75, 0, 75, 150].map((ax) => path(`M ${ax - 26} 560 L ${ax - 26} 420 Q ${ax} 386 ${ax + 26} 420 L ${ax + 26} 560 Z`, '#f4c778', 'opacity=".9"')).join('') +
      rect(-250, 250, 44, 310, '#2e3a6e') + path('M -252 250 Q -228 212 -204 250 Z', '#f4c778') +
      rect(206, 250, 44, 310, '#2e3a6e') + path('M 204 250 Q 228 212 252 250 Z', '#f4c778')
  );
  // sarovar reflection
  s += rect(0, 680, W, 120, '#16204a');
  s += `<path d="M 100 700 q 60 10 120 0 M 300 720 q 60 10 120 0 M 520 700 q 60 10 120 0" stroke="#f2e2ac" stroke-width="3" fill="none" opacity=".4"/>`;
  return doc(W, H, s);
}

function sikhDhol() {
  let s = rect(0, 0, 600, 600, '#f6d09a');
  s += circle(300, 300, 218, '#fff3e0');
  s += circle(300, 300, 218, 'none', 'stroke="#e8862e" stroke-width="2.5"');
  s += dhol(300, 316, 1.15, '#1e2a5a', '#d9b45b');
  for (const [mx, my] of [[168, 190], [430, 178]]) s += marigold(mx, my, 15);
  return doc(600, 600, s);
}

/* ─────────────────────────── write everything ─────────────────────────── */

const files = {
  hindu: {
    'hero.svg': hinduHero(),
    'couple.svg': hinduCouple(),
    'event-1.svg': haldiArt(),
    'event-2.svg': doc(600, 600, rect(0, 0, 600, 600, '#eaf0dd') + circle(300, 300, 218, '#f3f6e8') + circle(300, 300, 218, 'none', 'stroke="#4a6b3a" stroke-width="2.5"') + mehndiHand(300, 420, 1.5)),
    'event-3.svg': hinduSangeet(),
    'event-4.svg': hinduPheras(),
    'gallery-1.svg': hinduPeacock(),
    'gallery-2.svg': hinduLotus(),
    'gallery-3.svg': hinduElephant(),
    'gallery-4.svg': doc(800, 1000, rect(0, 0, 800, 1000, '#fdf3e0') + mandala(400, 500, 360, '#b03a48', 0.5) + kalash(400, 640, 2.2) + garlandArc(80, 120, 400, 80, 70, '#e8862e', '#f2b134') + garlandArc(400, 80, 720, 120, 70, '#e8862e', '#f2b134') + `<text x="400" y="920" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#7a1f2b" letter-spacing="8">MANGAL KALASH</text>`),
  },
  nikah: {
    'hero.svg': nikahHero(),
    'couple.svg': nikahCouple(),
    'event-1.svg': nikahDholki(),
    'event-2.svg': doc(600, 600, rect(0, 0, 600, 600, '#0f4437') + circle(300, 300, 218, '#0d3b30') + circle(300, 300, 218, 'none', 'stroke="#c9a227" stroke-width="2.5"') + mehndiHand(300, 420, 1.5, SKIN, '#3a2b18')),
    'event-3.svg': nikahScroll(),
    'event-4.svg': nikahWalima(),
    'gallery-1.svg': nikahPattern(),
    'gallery-2.svg': nikahLanterns(),
    'gallery-3.svg': nikahSkyline(),
    'gallery-4.svg': doc(800, 800, rect(0, 0, 800, 800, '#0a2e26') + path(cuspArchD(400, 120, 520, 560), 'none', 'stroke="#c9a227" stroke-width="4"') + star4(400, 400, 60, '#e6c96a') + star4(260, 300, 22, 'rgba(230,201,106,.6)') + star4(540, 300, 22, 'rgba(230,201,106,.6)') + `<text x="400" y="740" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#e6c96a" letter-spacing="8">BARAKAH</text>`),
  },
  christian: {
    'hero.svg': christianHero(),
    'couple.svg': christianCouple(),
    'event-1.svg': christianRings(),
    'event-2.svg': christianChurch(),
    'event-3.svg': christianTea(),
    'event-4.svg': christianCake(),
    'gallery-1.svg': christianBouquet(),
    'gallery-2.svg': doc(800, 800, rect(0, 0, 800, 800, '#fbf9f4') + churchWindow(400, 80, 360, 560, ['#aec6d4', '#e8c9c0', '#d4dfd0', '#f2e2c4']) + floralStem(110, 760, 240, 1.3) + floralStem(690, 760, 240, 1.8)),
    'gallery-3.svg': christianDoves(),
    'gallery-4.svg': doc(800, 1000, rect(0, 0, 800, 1000, '#f4efe4') + circle(400, 460, 300, 'none', 'stroke="#c9b37e" stroke-width="3"') + floralStem(230, 700, 260, 1.15) + floralStem(560, 700, 260, 1.95) + `<text x="400" y="480" text-anchor="middle" font-family="Georgia,serif" font-size="120" fill="#3a3f45" font-style="italic">J&amp;M</text>` + `<text x="400" y="900" text-anchor="middle" font-family="Georgia,serif" font-size="24" fill="#7d92a1" letter-spacing="8">EST · 2026</text>`),
  },
  modern: {
    'hero.svg': modernHero(),
    'couple.svg': modernCouple(),
    'event-1.svg': modernRings(),
    'event-2.svg': modernCocktail(),
    'event-3.svg': modernDisco(),
    'event-4.svg': modernBrunch(),
    'gallery-1.svg': modernAbstract1(),
    'gallery-2.svg': modernType(),
    'gallery-3.svg': modernChecker(),
    'gallery-4.svg': modernSunMoon(),
  },
  sikh: {
    'hero.svg': sikhHero(),
    'couple.svg': sikhCouple(),
    'ikonkar.svg': sikhIkOnkar(),
    'event-1.svg': doc(600, 600, rect(0, 0, 600, 600, '#fbe3bd') + circle(300, 300, 218, '#fff3e0') + circle(300, 300, 218, 'none', 'stroke="#4a6b3a" stroke-width="2.5"') + mehndiHand(300, 420, 1.5)),
    'event-2.svg': sikhJaggo(),
    'event-3.svg': sikhChoora(),
    'event-4.svg': sikhDhol(),
    'gallery-1.svg': sikhPattern(),
    'gallery-2.svg': sikhDome(),
    'gallery-3.svg': sikhChoora(),
    'gallery-4.svg': doc(800, 800, rect(0, 0, 800, 800, '#fff3e0') + phulkariBand(100, 800, 50) + phulkariBand(700, 800, 50) + dhol(400, 400, 1.7, '#b03a48', '#d9b45b') + `<text x="400" y="620" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#1e2a5a" letter-spacing="8">BALLE BALLE</text>`),
  },
};

let count = 0;
for (const [dir, set] of Object.entries(files)) {
  mkdirSync(join(OUT, dir), { recursive: true });
  for (const [name, svg] of Object.entries(set)) {
    writeFileSync(join(OUT, dir, name), svg);
    count++;
  }
}
console.log(`wrote ${count} artworks into public/art/`);
