#!/usr/bin/env node
/* Arshleen Kaur & Manbir Singh — the bride's side (Bhullar family), a Sikh wedding on the
   Rose Red premium design the client chose (https://invitivals.com/muslim-premium-red/).

   The design's screens are paintings with their wording baked in. Here every Muslim-specific
   element (Bismillah, Arabic, the Qur'an verse, mosques and minarets, "Qubool Hai", the Dua
   page) is painted OUT of that artwork and the Sikh wording, the couple's own photograph and
   Sikh event art are painted IN. The reference folder is only read, never written.

     node tools/manbir-arshleen-bride-cutout.mjs     (once: the couple photo → a clean cut-out)
     node tools/manbir-arshleen-bride-art.mjs [screen …]   (default: all)

   Sources: public/muslim-premium-red/assets/screens/*.jpg   (the design's untouched paintings)
            invites/src/manbir-arshleen-bride/couple-cutout.png (the client's photo, cut out)
            public/manbir-arshleen-wedding/assets/{khanda,dhol,anand-karaj}.webp (the groom page's Sikh art)
            public/marathi-wedding/assets/mehndi.webp            (mehndi cones)
   Output : public/manbir-arshleen-bride/assets/screens/*.jpg, assets/og.jpg, js/scenes.js */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { paintScreen, patch, text, url } from './lib/paint-screen.mjs';

const REF = 'public/muslim-premium-red/assets/screens';
const SRC = 'invites/src/manbir-arshleen-bride';
const PAGE = 'public/manbir-arshleen-bride';
const OUT = path.join(PAGE, 'assets/screens');
const TMP = path.join(SRC, 'build');
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const orig = (n) => path.join(REF, n + '.jpg');
const COUPLE = path.join(SRC, 'couple-cutout.png');
const KHANDA = 'public/manbir-arshleen-wedding/assets/khanda.webp';
const DHOL = 'public/manbir-arshleen-wedding/assets/dhol.webp';
const TEMPLE = 'public/manbir-arshleen-wedding/assets/anand-karaj.webp';
const MEHNDI = 'public/marathi-wedding/assets/mehndi.webp';

/* palette and lettering of the design */
const MAROON = '#5a1219';
const INK = '#4a0d12';
const CREAM = '#f4e0bf';
const GOLD = 'linear-gradient(180deg,#f4dc9c 0%,#d9ae5c 45%,#b98a3a 70%,#e8c77e 100%)';
const GURMUKHI = '<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Gurmukhi:wght@500;600;700&display=block" rel="stylesheet">';
const caps = (px, color = MAROON, ls = .14) => `font:500 ${px}px/1.35 Cinzel,serif;letter-spacing:${ls}em;color:${color};`;
const script = (px, color = INK) => `font:400 ${px}px/1 'Great Vibes',cursive;color:${color};white-space:nowrap;`;
const serif = (px, color = INK, w = 600) => `font:${w} ${px}px/1.25 'Cormorant Garamond',serif;color:${color};white-space:nowrap;`;
const italic = (px, color = '#6a2a1c') => `font:italic 500 ${px}px/1.2 'Cormorant Garamond',serif;color:${color};`;
const pa = (px, color = MAROON, w = 600) => `font:${w} ${px}px/1.3 'Noto Serif Gurmukhi',serif;color:${color};`;
const goldText = `background:${GOLD};-webkit-background-clip:text;background-clip:text;color:transparent;`;
/* every lettering block shrinks until it fits its box (gold lettering is painted only inside its box) */
const FIT = `<script>window.addEventListener('load',function(){setTimeout(function(){document.querySelectorAll('.t').forEach(function(el){if(!el.textContent.trim())return;var box=document.createElement('span');box.style.cssText='display:inline-flex;align-items:center;text-align:center;white-space:inherit;flex-direction:'+getComputedStyle(el).flexDirection;while(el.firstChild)box.appendChild(el.firstChild);el.appendChild(box);var fs=parseFloat(getComputedStyle(el).fontSize),n=0;while(box.getBoundingClientRect().width>el.clientWidth*(/Great Vibes/.test(getComputedStyle(el).fontFamily)?.84:.97)&&fs>8&&n++<200){fs-=1;el.style.fontSize=fs+'px';}});},400);});</script>`;
const shadow = 'filter:drop-shadow(0 2px 2px rgba(30,0,4,.5));';
const rule = (x, y, w, color = '#a8783a') =>
  `<div class="rule" style="left:${x}px;top:${y}px;width:${w}px;color:${color}"><i></i><b>❦</b><i></i></div>`;
const RULE_CSS = `.rule{position:absolute;height:26px;display:flex;align-items:center;gap:12px;font-size:18px}
  .rule i{flex:1;height:1px;background:linear-gradient(90deg,transparent,currentColor,transparent)}`;

/* SVG alpha in artwork pixels for a layer placed at (ox,oy) w×h: white = shows */
function svgMask(w, h, ox, oy, points, { blur = 9, fadeTop = 0, fadeBottom = 0, fadeX = null } = {}) {
  const pts = points.map(([x, y]) => `${x - ox},${y - oy}`).join(' ');
  if (fadeX) {                                  // [x0, x1, x2, x3] in artwork px: 0 at x0, full from x1 to x2, 0 at x3
    const inner = svgMask(w, h, ox, oy, points, { blur, fadeTop, fadeBottom }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    const st = fadeX.map((x) => Math.max(0, Math.min(1, (x - ox) / w)).toFixed(3));
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="hx" x1="0" x2="1" y1="0" y2="0"><stop offset="${st[0]}" stop-color="black"/><stop offset="${st[1]}" stop-color="white"/><stop offset="${st[2]}" stop-color="white"/><stop offset="${st[3]}" stop-color="black"/></linearGradient><mask id="mx"><rect width="${w}" height="${h}" fill="url(#hx)"/></mask></defs><rect width="${w}" height="${h}" fill="black"/><g mask="url(#mx)">${inner}</g></svg>`;
  }
  const t = (fadeTop / h).toFixed(3), b = (1 - fadeBottom / h).toFixed(3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>` +
    `<linearGradient id="f" x1="0" y1="0" x2="0" y2="${h}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${fadeTop ? 'black' : 'white'}"/><stop offset="${t}" stop-color="white"/><stop offset="${b}" stop-color="white"/><stop offset="1" stop-color="${fadeBottom ? 'black' : 'white'}"/></linearGradient>` +
    `<filter id="b" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>` +
    `<rect width="${w}" height="${h}" fill="black"/><g filter="url(#b)"><polygon points="${pts}" fill="url(#f)"/></g></svg>`;
}
const oval = (w, h, blur = 6, inset = .06) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="b"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>` +
  `<rect width="${w}" height="${h}" fill="black"/><ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * (.5 - inset)}" ry="${h * (.5 - inset)}" fill="white" filter="url(#b)"/></svg>`;
/* a flat fill (any SVG paint) as a PNG, to lay under a photo */
const fill = (w, h, defs, paint) => sharp(Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>${defs}</defs><rect width="${w}" height="${h}" fill="${paint}"/></svg>`)).png().toBuffer();
/* the couple, cut out, scaled to width w, gently warmed to sit in the painted light */
const couple = async (w, grade = {}) => {
  const h = Math.round(1287 * w / 1222);
  const buf = await sharp(COUPLE).resize(w, h).modulate({ saturation: grade.sat ?? .97, brightness: grade.bri ?? 1.0 }).png().toBuffer();
  return { buf, w, h };
};
/* the groom page's dhol with its navy tassels and band turned to the design's maroon (other colours untouched) */
async function maroonDhol() {
  const { data, info } = await sharp(DHOL).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (d < .12 || mx !== b) continue;                       // only the blue family
    let hue = 60 * (((r - g) / d) + 4); if (hue < 0) hue += 360;
    if (hue < 195 || hue > 265) continue;
    const s = d / mx, v = mx * .92, H = 350 / 60, C = v * Math.min(1, s * 1.05), X = C * (1 - Math.abs((H % 2) - 1)), m = v - C;
    const [R, G, B] = [C, 0, X];                              // hue 350° lies in sector 5: (C, 0, X)
    data[i] = Math.round((R + m) * 255); data[i + 1] = Math.round((G + m) * 255); data[i + 2] = Math.round((B + m) * 255);
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}
const khandaEmblem = () => sharp(KHANDA).extract({ left: 0, top: 430, width: 520, height: 575 }).png().toBuffer();

/* The arch of the main painting, inside its gold line and clear of the lanterns and flower sprays */
const ARCH = [[64, 860], [716, 860], [716, 952], [674, 962], [674, 1172], [642, 1184], [604, 1300], [400, 1414], [232, 1330], [232, 1150], [64, 1104]];
/* the couple: a little wider on the left than the arch line, so the groom's shoulder melts into the roses */
const COUPLE_ON_MAIN = [[64, 820], [716, 820], [716, 952], [674, 962], [674, 1172], [642, 1184], [604, 1300], [400, 1418], [250, 1336], [176, 1262], [150, 1140], [140, 1040], [64, 1000]];
const ARCH_BOX = { x: 60, y: 850, w: 660, h: 570 };
/* the domes, minarets and palms behind the couple, lifted into the painting's own sky */
const SKYLINE = [
  { x: 66, y: 858, w: 612, h: 330, r: 70, p: .88, f: 34, blur: 12, grain: 5 },
  { x: 590, y: 858, w: 152, h: 94, r: 30, p: .88, f: 16, blur: 8, grain: 5 },
  { x: 590, y: 930, w: 88, h: 120, r: 30, p: .88, f: 16, blur: 8, grain: 5 },
  { x: 236, y: 930, w: 420, h: 400, r: 110, p: .97, f: 40, blur: 14, grain: 5 },
];
const parchment = () => fill(ARCH_BOX.w, ARCH_BOX.h,
  '<radialGradient id="p" cx="50%" cy="20%" r="85%"><stop offset="0" stop-color="#f6e3c8"/><stop offset=".55" stop-color="#efd6b4"/><stop offset="1" stop-color="#e4c098"/></radialGradient>', 'url(#p)');

/* lettering blocks that rise on screen (js/scenes.js): [x,y,w,h, kind?] per screen */
const SCENE_TEXT = {};

const SCREENS = {
  /* ── MAIN: ੴ, the blessing, Arshleen Kaur & Manbir Singh, the couple's own photograph in the arch ── */
  async main() {
    const W = 793, H = 1600, c = await couple(560);
    const cx = 400 - c.w / 2 + 4, cy = 1468 - c.h;     // the plume clears "Forever in Love"; the foot is hidden by the arch
    SCENE_TEXT.main = [[290, 150, 220, 122], [120, 282, 560, 66], [100, 452, 600, 150, 'name'], [350, 596, 100, 56], [100, 640, 600, 150, 'name']];
    return {
      W, H,
      erase: [
        { x: 205, y: 160, w: 400, h: 112, r: 16 },          // Bismillah
        { x: 140, y: 280, w: 520, h: 66, r: 10 },           // "In the name of Allah …"
        { x: 170, y: 434, w: 460, h: 340, r: 22, f: 28 },   // Ahmad & Layla
        { x: 78, y: 680, w: 166, h: 212, r: 30, f: 20 },    // minarets left of the names
        { x: 566, y: 680, w: 160, h: 212, r: 30, f: 20 },   // minarets right of the names
        ...SKYLINE,
      ],
      photos: [
        { file: c.buf, x: Math.round(cx), y: cy, w: c.w, h: c.h, mask: svgMask(c.w, c.h, Math.round(cx), cy, COUPLE_ON_MAIN, { blur: 14, fadeBottom: 50, fadeX: [138, 236, 640, 700] }) },
      ],
      html: [
        GURMUKHI,
        text(290, 150, 220, 122, 'ੴ', pa(98, MAROON, 600) + 'line-height:1;padding-top:6px'),
        text(120, 282, 560, 66, 'WITH THE BLESSINGS OF<br>WAHEGURU JI', caps(19.5)),
        text(100, 452, 600, 150, 'Arshleen Kaur', script(104) + 'padding-top:16px'),
        text(350, 596, 100, 56, '&amp;', "font:italic 500 50px/1 'Cormorant Garamond',serif;color:#a87a2c;"),
        text(100, 640, 600, 150, 'Manbir Singh', script(104) + 'padding-top:16px'),
      ].join('\n'),
    };
  },

  /* ── OUR FAMILIES (the design's Dua page, top part): the bride's family first, then the groom's ── */
  async families() {
    const base = path.join(TMP, 'families-src.jpg');
    await sharp(orig('dua')).extract({ left: 0, top: 0, width: 733, height: 1100 }).jpeg({ quality: 95 }).toFile(base);
    const lt = { r: 22, p: .62, f: 16, blur: 5, grain: 4 };
    const cx = 120, w = 493;
    SCENE_TEXT.families = [[150, 262, 433, 96], [80, 384, 573, 112, 'name'], [cx, 512, w, 26], [cx, 540, w, 70, 'name'], [cx, 612, w, 104], [cx, 760, w, 26], [cx, 788, w, 70, 'name'], [cx, 860, w, 104]];
    return {
      W: 733, H: 1100, src: base,
      erase: [
        { x: 190, y: 258, w: 360, h: 106, ...lt },                // Arabic
        { x: 100, y: 382, w: 540, h: 120, ...lt },                // Dua for the Couple
        { x: 128, y: 506, w: 466, h: 104, ...lt },                // body copy
        { x: 236, y: 612, w: 266, h: 40, ...lt, r: 12, f: 10 },   // divider with the heart
        { x: 104, y: 644, w: 526, h: 206, r: 90, p: .5, f: 34, blur: 10, grain: 4 },  // the dua box
        { x: 530, y: 822, w: 100, h: 36, ...lt, r: 12, f: 10 },   // 0/500
        { x: 186, y: 840, w: 370, h: 116, r: 90, p: .9, f: 30, blur: 10, grain: 4 },   // Send Dua button
        { x: 60, y: 492, w: 64, h: 336, ...lt, r: 30, f: 14 },    // minarets, left
        { x: 552, y: 440, w: 126, h: 340, r: 40, p: .7, f: 18, blur: 6, grain: 4 },   // minarets, right (the lantern beside stays)
        { x: 112, y: 520, w: 62, h: 140, ...lt, r: 26, f: 12 },
        { x: 554, y: 500, w: 62, h: 160, ...lt, r: 26, f: 12 },
      ],
      css: RULE_CSS,
      html: [
        /* one even sheet of the arch's parchment where the dua box and button were */
        patch(96, 596, 542, 384, 'linear-gradient(180deg,#edd1b8 0%,#e8ccb0 45%,#e2c3a4 75%,#dcb898 100%)', 56),
        text(150, 262, 433, 96, 'WITH THE BLESSINGS<br>OF OUR ELDERS', caps(21)),
        text(80, 384, 573, 112, 'Our Families', script(84, '#5c0f18') + 'padding-top:10px'),
        text(cx, 512, w, 26, 'THE BRIDE', caps(16, '#8c5a22', .26)),
        text(cx, 540, w, 70, 'Arshleen Kaur', script(58, '#5c0f18') + 'padding-top:8px'),
        text(cx, 612, w, 104, `<span style="${italic(23)}">Daughter of</span><span>Sardarni Rajinder Kaur</span><span>&amp; Sardar Paramjit Singh Bhullar</span>`, serif(26) + 'line-height:1.3'),
        rule(216, 724, 300),
        text(cx, 760, w, 26, 'THE GROOM', caps(16, '#8c5a22', .26)),
        text(cx, 788, w, 70, 'Manbir Singh', script(58, '#5c0f18') + 'padding-top:8px'),
        text(cx, 860, w, 104, `<span style="${italic(23)}">Son of</span><span>Sardarni Amandeep Kaur</span><span>&amp; Sardar Jyoti Saroop Singh Bamrah</span>`, serif(26) + 'line-height:1.3'),
      ].join('\n'),
    };
  },

  /* ── SCRATCH: the couple's names top right; the mosque skyline becomes velvet + ਅਨੰਦ ਕਾਰਜ ── */
  async scratch() {
    SCENE_TEXT.scratch = [[335, 192, 240, 82], [185, 320, 560, 275, 'name'], [290, 618, 330, 100], [255, 1115, 395, 60], [230, 1232, 440, 150]];
    return {
      W: 900, H: 1600,
      erase: [
        { x: 680, y: 28, w: 190, h: 72, r: 12, mode: 'min' },          // AHMAD & LAYLA
        { x: 22, y: 16, w: 150, h: 70, r: 40, p: .35, f: 14, blur: 6, grain: 6 },    // a painted "Back" pill that did nothing
        { x: 196, y: 1188, w: 488, h: 220, r: 40, p: .35, f: 26, blur: 8, grain: 7 },   // mosque skyline
        { x: 226, y: 1380, w: 280, h: 74, r: 30, p: .35, f: 20, blur: 6, grain: 7 },
        { x: 500, y: 1372, w: 110, h: 46, r: 20, p: .35, f: 12, blur: 4, grain: 7 },
      ],
      html: [
        GURMUKHI,
        text(672, 30, 206, 66, 'ARSHLEEN<br>&amp; MANBIR', caps(20, '#ead1a8', .2) + 'line-height:1.45'),
        text(230, 1232, 440, 100, 'ਅਨੰਦ ਕਾਰਜ', pa(60, '#000', 600) + goldText + 'opacity:.9'),
        text(230, 1334, 440, 40, 'BLESSED BY WAHEGURU JI', caps(14, '#d9b98a', .16) + 'opacity:.92'),
      ].join('\n'),
    };
  },

  /* ── OUR FUNCTIONS: seven plaques (the design's plaque, re-proportioned), each with its own emblem ── */
  async functions() {
    const W = 689, H = 1600, src = orig('functions');
    /* one blank plaque from the design: the "Shadi" plaque without its rings and name */
    const blankSrc = path.join(TMP, 'plaque-src.png');
    const { erase } = await import('./lib/erase.mjs');
    fs.writeFileSync(blankSrc, await erase(src, [
      { x: 318, y: 902, w: 216, h: 92, r: 26, p: .4, f: 12, blur: 5, grain: 5 },
      { x: 160, y: 892, w: 150, h: 116, r: 40, p: .4, f: 14, blur: 5, grain: 5 },
    ]));
    const PH = 92, PW = 490, k = PH / 144;
    const capL = await sharp(blankSrc).extract({ left: 95, top: 878, width: 90, height: 144 }).resize(Math.round(90 * k), PH).png().toBuffer();
    const capR = await sharp(blankSrc).extract({ left: 505, top: 878, width: 88, height: 144 }).resize(Math.round(88 * k), PH).png().toBuffer();
    const lw = Math.round(90 * k), rw = Math.round(88 * k);
    const body = await sharp(blankSrc).extract({ left: 185, top: 878, width: 320, height: 144 }).resize(PW - lw - rw, PH, { fit: 'fill' }).png().toBuffer();
    const plaque = await sharp({ create: { width: PW, height: PH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: capL, left: 0, top: 0 }, { input: body, left: lw, top: 0 }, { input: capR, left: PW - rw, top: 0 }]).png().toBuffer();
    const plaqueMask = `<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}"><defs><filter id="b"><feGaussianBlur stdDeviation="1.6"/></filter></defs><rect width="${PW}" height="${PH}" fill="black"/><rect x="3" y="3" width="${PW - 6}" height="${PH - 6}" rx="16" fill="white" filter="url(#b)"/></svg>`;

    /* emblems lifted from the design's own plaques, plus the Sikh art */
    const lift = (l, t, w, h) => sharp(src).extract({ left: l, top: t, width: w, height: h }).png().toBuffer();
    const X0 = 100, Y0 = 524, PITCH = 102;
    const items = [
      { t: 'Akhand Path and Bangle Ceremony', fs: 30, sub: 'FRIDAY · 1 JANUARY', icon: { file: await khandaEmblem(), w: 66, h: 74, fit: 'contain' } },
      { t: 'Din Shagna Da', sub: 'FRIDAY · 15 JANUARY', icon: { file: await lift(165, 890, 140, 116), w: 88, h: 72, mask: oval(88, 72, 4, .03) } },
      { t: 'The Golden Glow (Haldi)', fs: 35, sub: 'SATURDAY · 16 JANUARY', icon: { file: await lift(162, 566, 140, 124), w: 88, h: 78, mask: oval(88, 78, 4, .02) } },
      { t: 'Jashn-e-Heena (Mehndi)', fs: 35, sub: 'SUNDAY · 17 JANUARY', icon: { file: MEHNDI, w: 84, h: 74, fit: 'contain' } },
      { t: 'Ashi’s Jaggo Night', sub: 'MONDAY · 18 JANUARY', icon: { file: await lift(150, 748, 146, 116), w: 88, h: 70, mask: oval(88, 70, 4, .02) } },
      { t: 'Anand Karaj', sub: 'TUESDAY · 19 JANUARY', glyph: true },
      { t: 'Wedding Celebration', fs: 38, sub: 'TUESDAY · 19 JANUARY', icon: { file: await lift(162, 1062, 150, 110), w: 90, h: 66, mask: oval(90, 66, 4, .02) } },
    ];
    const photos = [], html = [GURMUKHI];
    items.forEach((it, i) => {
      const y = Y0 + i * PITCH;
      photos.push({ file: plaque, x: X0, y, w: PW, h: PH, mask: plaqueMask });
      if (it.icon) photos.push({ ...it.icon, x: Math.round(X0 + 62 - it.icon.w / 2 + 6), y: Math.round(y + PH / 2 - it.icon.h / 2) });
      if (it.glyph) html.push(text(X0 + 24, y + 6, 88, PH - 12, 'ੴ', pa(52, '#000', 700) + goldText + 'line-height:1'));
      html.push(text(X0 + 118, y + 4, PW - 140, 50, it.t, script(it.fs || 42, CREAM) + 'text-shadow:0 1px 2px rgba(40,0,6,.45)'));
      html.push(text(X0 + 118, y + 60, PW - 140, 20, it.sub, caps(12.5, '#e3c697', .16)));
    });
    SCENE_TEXT.functions = [[105, 222, 480, 210, 'name'], [150, 432, 390, 70], [160, 1252, 390, 60]];
    return {
      W, H, src,
      erase: [
        { x: 150, y: 434, w: 390, h: 62, r: 10, f: 10 },                                        // "Four beautiful occasions"
        { x: 80, y: 520, w: 522, h: 722, r: 90, p: .72, f: 22, blur: 10, grain: 4 },           // the four plaques
        { x: 300, y: 1206, w: 90, h: 36, r: 10, f: 8 },                                          // the heart below them
      ],
      photos,
      html: [text(130, 434, 430, 62, 'SEVEN BEAUTIFUL OCCASIONS<br>ONE BLESSED JOURNEY', caps(19)), ...html].join('\n'),
    };
  },

  /* ── CLOSING (the design's last page, without the Qur'an verse): the couple, Thank You, both families ── */
  async closing() {
    const W = 995, H = 1581, c = await couple(420, { bri: 1.04 });
    const cx = 548 - c.w / 2, cy = 336;
    const dk = { p: .35, blur: 7, grain: 6, r: 40, f: 22 };
    const glowW = 640, glowH = 600;
    SCENE_TEXT.closing = [[300, 772, 500, 100, 'name'], [290, 872, 520, 38], [300, 914, 500, 74, 'name'], [320, 990, 460, 34]];
    return {
      W, H, src: orig('quran'),
      erase: [
        { x: 270, y: 402, w: 514, h: 238, ...dk },   // Arabic verse
        { x: 300, y: 620, w: 444, h: 60, ...dk, r: 20, f: 14 },   // its divider
        { x: 300, y: 676, w: 444, h: 192, ...dk, r: 30, f: 20 },  // translation
        { x: 340, y: 866, w: 370, h: 100, ...dk, r: 20, f: 14 },  // citation and heart
      ],
      photos: [
        { file: await fill(glowW, glowH, '<radialGradient id="g" cx="50%" cy="58%" r="50%"><stop offset="0" stop-color="#e9a86a" stop-opacity=".34"/><stop offset=".55" stop-color="#b8563c" stop-opacity=".12"/><stop offset="1" stop-color="#2a0406" stop-opacity="0"/></radialGradient>', 'url(#g)'), x: Math.round(548 - glowW / 2), y: 250, w: glowW, h: glowH },
        { file: c.buf, x: Math.round(cx), y: cy, w: c.w, h: c.h, mask: svgMask(c.w, c.h, Math.round(cx), cy, [[cx - 20, cy - 20], [cx + c.w + 20, cy - 20], [cx + c.w + 20, cy + c.h + 20], [cx - 20, cy + c.h + 20]], { blur: 6, fadeBottom: 110 }) },
      ],
      html: [
        text(300, 772, 500, 100, 'Thank You', script(96, '#000') + goldText + shadow + 'padding-top:10px'),
        text(290, 872, 520, 38, 'FOR YOUR LOVE AND BLESSINGS', caps(21, '#ecd3a8', .14)),
        text(300, 914, 500, 74, 'Arshleen &amp; Manbir', script(62, '#000') + goldText + shadow + 'padding-top:8px'),
        text(320, 990, 460, 34, 'THE BHULLAR &amp; BAMRAH FAMILIES', caps(17, '#d6b588', .16)),
      ].join('\n'),
    };
  },

  /* ── FUNCTION PAGES: each painted for its own event; dates, times, venues and maps are live text ── */

  /* Akhand Path and Bangle Ceremony — the cream arch of the functions page, a gold Khanda, quiet and respectful */
  async akhand() {
    const kh = await khandaEmblem();
    SCENE_TEXT.akhand = [[140, 368, 410, 102, 'title'], [100, 470, 490, 80, 'title'], [130, 556, 430, 60]];
    return {
      W: 689, H: 1600, src: orig('functions'),
      erase: [
        { x: 100, y: 220, w: 490, h: 216, r: 30, f: 22 },                                       // Our Functions
        { x: 150, y: 434, w: 390, h: 62, r: 10, f: 10 },
        { x: 150, y: 1206, w: 390, h: 140, r: 14, f: 12 },                                      // bottom words and hearts
      ],
      photos: [{ file: kh, x: 282, y: 214, w: 126, h: 140, fit: 'contain' }],
      css: RULE_CSS,
      html: [
        patch(70, 500, 548, 760, 'radial-gradient(ellipse 70% 60% at 50% 45%,#f6e6d0,#f1dcc1 60%,#ead0b0)', 46),
        text(140, 368, 410, 102, 'Akhand Path', script(92, '#5c0f18') + 'padding-top:12px'),
        text(100, 470, 490, 80, 'and Bangle Ceremony', script(58, '#5c0f18') + 'padding-top:8px'),
        text(130, 556, 430, 60, 'THE BLESSINGS OF GURBANI,<br>THE JOY OF BANGLES', caps(17, '#7a3a22')),
        rule(214, 626, 260),
        rule(214, 852, 260),
        rule(214, 1036, 260),
      ].join('\n'),
    };
  },

  /* Din Shagna Da — the design's stage with the two chairs (the shagun is given to the seated couple) */
  async shagna() {
    const dk = { p: .35, blur: 6, grain: 6 };
    const pillow = { p: .45, r: 18, f: 10, blur: 4, grain: 6 };
    SCENE_TEXT.shagna = [[150, 320, 460, 160, 'title'], [196, 548, 370, 70]];
    return {
      W: 761, H: 1600, src: orig('shadi'),
      erase: [
        { x: 296, y: 288, w: 174, h: 104, r: 30, f: 16, ...dk },   // Arabic
        { x: 196, y: 388, w: 360, h: 156, r: 40, f: 20, ...dk },   // Shadi
        { x: 206, y: 548, w: 350, h: 70, r: 24, f: 14, ...dk },    // "… in the sight of Allah"
        { x: 176, y: 648, w: 408, h: 100, r: 24, f: 14, ...dk },   // painted date
        { x: 206, y: 772, w: 350, h: 124, r: 24, f: 14, ...dk },   // painted venue
        { x: 196, y: 1002, w: 112, h: 80, ...pillow },             // Qubool Hai (left pillow)
        { x: 466, y: 1002, w: 112, h: 80, ...pillow },             // Qubool Hai (right pillow)
      ],
      html: [
        text(150, 320, 460, 160, 'Din Shagna Da', script(94) + goldText + 'filter:drop-shadow(0 2px 3px rgba(30,0,4,.6));padding-top:18px'),
        text(196, 548, 370, 70, 'BLESSINGS, SHAGUN<br>AND TOGETHERNESS', caps(17, '#ecd3a8', .1) + 'line-height:1.5'),
      ].join('\n'),
    };
  },

  /* The Golden Glow (Haldi) — the design's turmeric scene */
  async haldi() {
    const dk = { p: .35, blur: 7, grain: 6 };
    SCENE_TEXT.haldi = [[80, 250, 500, 110, 'title'], [150, 360, 360, 86, 'title']];
    return {
      W: 659, H: 1600, src: orig('manje'),
      erase: [
        { x: 96, y: 250, w: 440, h: 222, r: 40, f: 22, ...dk }, { x: 350, y: 440, w: 90, h: 54, r: 20, f: 10, blur: 4, p: .35, grain: 6 },
        { x: 128, y: 668, w: 414, h: 104, r: 24, f: 14, ...dk },   // painted date
        { x: 96, y: 822, w: 468, h: 172, r: 26, f: 16, ...dk },    // painted venue
      ],
      html: [
        text(80, 250, 500, 110, 'The Golden Glow', script(84) + goldText + shadow + 'padding-top:14px'),
        text(150, 360, 360, 86, '(Haldi)', script(66) + goldText + shadow + 'padding-top:10px'),
      ].join('\n'),
    };
  },

  /* Jashn-e-Heena (Mehndi) — the design's colourful phulkari-and-tassels scene */
  async mehndi() {
    const lt = { r: 22, p: .62, f: 18, blur: 5, grain: 4 };
    SCENE_TEXT.mehndi = [[110, 322, 490, 118, 'title'], [230, 440, 250, 60, 'title'], [110, 500, 490, 72]];
    return {
      W: 709, H: 1600, src: orig('sanchak'),
      erase: [
        { x: 116, y: 330, w: 470, h: 132, ...lt },
        { x: 110, y: 488, w: 495, h: 84, ...lt },
        { x: 160, y: 626, w: 398, h: 104, ...lt },                  // painted date
        { x: 124, y: 764, w: 462, h: 150, ...lt },                  // painted venue
      ],
      html: [
        text(110, 322, 490, 118, 'Jashn-e-Heena', script(100, '#6a0f1c') + 'padding-top:14px'),
        text(230, 440, 250, 60, '(Mehndi)', script(50, '#6a0f1c') + 'padding-top:6px'),
        text(110, 500, 490, 72, 'A CELEBRATION OF HENNA,<br>MUSIC &amp; TOGETHERNESS', caps(19)),
      ].join('\n'),
    };
  },

  /* Ashi's Jaggo Night — the countdown's velvet and lanterns at night, with a dhol */
  async jaggo() {
    const dhol = await maroonDhol();
    SCENE_TEXT.jaggo = [[60, 586, 508, 96, 'title'], [60, 676, 508, 110, 'title'], [80, 792, 468, 64]];
    return {
      W: 628, H: 1600, src: orig('countdown'),
      erase: [
        { x: 14, y: 470, w: 600, h: 250, r: 150, p: .08, f: 30, blur: 14, grain: 6 },   // the four paper countdown cards
        { x: 30, y: 320, w: 568, h: 990, r: 70, p: .3, f: 40, blur: 12, grain: 6 },
        { x: 10, y: 470, w: 60, h: 240, r: 40, p: .3, f: 16, blur: 8, grain: 6 },
        { x: 558, y: 470, w: 62, h: 240, r: 40, p: .3, f: 16, blur: 8, grain: 6 },
      ],
      photos: [
        { file: await fill(420, 300, '<radialGradient id="g" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="#f0b070" stop-opacity=".28"/><stop offset="1" stop-color="#2a0406" stop-opacity="0"/></radialGradient>', 'url(#g)'), x: 104, y: 300, w: 420, h: 300 },
        { file: dhol, x: 184, y: 352, w: 260, h: 216, fit: 'contain' },
      ],
      css: RULE_CSS,
      html: [
        text(60, 586, 508, 96, 'Ashi’s', script(80) + goldText + shadow + 'padding-top:12px'),
        text(60, 676, 508, 110, 'Jaggo Night', script(92) + goldText + shadow + 'padding-top:14px'),
        text(80, 792, 468, 64, 'LIGHTS, DHOL AND A NIGHT<br>OF PUNJABI CELEBRATION', caps(16.5, '#ecd3a8', .1) + 'line-height:1.55'),
        rule(184, 872, 260, '#c9a060'),
        rule(184, 1062, 260, '#c9a060'),
      ].join('\n'),
    };
  },

  /* Anand Karaj — the main painting's arch with the Harmandir Sahib at golden hour */
  async anand() {
    const W = 793, H = 1600;
    const tw = 656, th = 600, temple = path.join(TMP, 'temple.jpg');
    await sharp(TEMPLE).extract({ left: 200, top: 0, width: 600, height: 593 }).resize(tw, th, { fit: 'cover' })
      .modulate({ saturation: .9, brightness: 1.02 }).jpeg({ quality: 92 }).toFile(temple);
    const ty = 1414 - th;
    SCENE_TEXT.anand = [[300, 150, 200, 112], [100, 262, 600, 150, 'title'], [140, 418, 520, 66]];
    return {
      W, H, src: orig('main'),
      erase: [
        { x: 205, y: 160, w: 400, h: 112, r: 16 },
        { x: 140, y: 280, w: 520, h: 66, r: 10 },
        { x: 250, y: 364, w: 300, h: 82, r: 12 },             // Together with our families
        { x: 170, y: 434, w: 460, h: 372, r: 22, f: 28 },
        { x: 78, y: 680, w: 166, h: 212, r: 30, f: 20 },
        { x: 566, y: 680, w: 160, h: 212, r: 30, f: 20 },
        { x: 220, y: 786, w: 360, h: 92, r: 14 },             // Together in faith
      ],
      photos: [
        { file: await parchment(), ...ARCH_BOX, mask: svgMask(ARCH_BOX.w, ARCH_BOX.h, ARCH_BOX.x, ARCH_BOX.y, ARCH, { blur: 7, fadeTop: 34 }) },
        { file: temple, x: 68, y: ty, w: tw, h: th, mask: svgMask(tw, th, 68, ty, ARCH.map(([x, y]) => [x, Math.max(y, ty)]), { blur: 6, fadeTop: 170 }) },
      ],
      html: [
        GURMUKHI,
        text(300, 150, 200, 112, 'ੴ', pa(88, MAROON, 600) + 'line-height:1;padding-top:6px'),
        text(100, 262, 600, 150, 'Anand Karaj', script(126) + 'padding-top:18px'),
        text(140, 418, 520, 66, 'THE SACRED UNION, IN THE PRESENCE<br>OF SRI GURU GRANTH SAHIB JI', caps(17.5)),
      ].join('\n'),
    };
  },

  /* Wedding Celebration — the design's candle-lit banquet */
  async celebration() {
    const dk = { p: .35, blur: 6, grain: 6 };
    const card = { r: 20, p: .62, f: 14, blur: 5, grain: 4 };
    SCENE_TEXT.celebration = [[150, 282, 460, 120, 'title'], [130, 396, 500, 130, 'title']];
    return {
      W: 761, H: 1600, src: orig('valima'),
      erase: [
        { x: 300, y: 270, w: 190, h: 92, r: 30, f: 16, ...dk },    // Arabic
        { x: 186, y: 360, w: 414, h: 150, r: 40, f: 20, ...dk },   // Valima
        { x: 262, y: 962, w: 340, h: 96, ...card },                // painted date
        { x: 262, y: 1082, w: 340, h: 132, ...card },              // painted venue
        { x: 196, y: 1372, w: 372, h: 110, ...card, r: 64, p: .8, f: 22 },              // painted map pill: the page's own map + calendar buttons sit here side by side
      ],
      html: [
        text(150, 282, 460, 120, 'Wedding', script(104) + goldText + 'filter:drop-shadow(0 2px 3px rgba(10,0,4,.6));padding-top:16px'),
        text(130, 396, 500, 130, 'Celebration', script(104) + goldText + 'filter:drop-shadow(0 2px 3px rgba(10,0,4,.6));padding-top:16px'),
      ].join('\n'),
    };
  },

  /* ── LINK PREVIEW (WhatsApp card), 1200×630 ── */
  async og() {
    const W = 1200, H = 630, bg = path.join(TMP, 'og-bg.jpg');
    /* plain velvet (no wording of the design behind the names) */
    await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="v" cx="62%" cy="45%" r="80%"><stop offset="0" stop-color="#6a0f1a"/><stop offset=".55" stop-color="#430812"/><stop offset="1" stop-color="#22030a"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#v)"/></svg>`)).jpeg({ quality: 95 }).toFile(bg);
    const LAY = 'public/muslim-premium-red/assets/layers/';
    const c = await couple(560, { bri: 1.05 });
    const ox = 640, oy = H - c.h + 120;
    return {
      W, H, src: bg, outPath: path.join(PAGE, 'assets/og.jpg'),
      photos: [
        { file: await sharp(LAY + 'rose-b.png').extract({ left: 12, top: 44, width: 298, height: 266 }).png().toBuffer(), x: -40, y: 470, w: 230, h: 205, fit: 'contain' },
        { file: await sharp(LAY + 'rose-a.png').flop().png().toBuffer(), x: 1010, y: -40, w: 230, h: 223, fit: 'contain' },
        { file: await fill(700, 640, '<radialGradient id="g" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="#e9a86a" stop-opacity=".32"/><stop offset="1" stop-color="#2a0406" stop-opacity="0"/></radialGradient>', 'url(#g)'), x: 570, y: 20, w: 630, h: 610 },
        { file: c.buf, x: ox, y: oy, w: c.w, h: c.h, mask: svgMask(c.w, c.h, ox, oy, [[ox - 30, oy - 30], [ox + c.w + 30, oy - 30], [ox + c.w + 30, oy + c.h], [ox - 30, oy + c.h]], { blur: 5, fadeBottom: 150 }) },
      ],
      css: `.shade{position:absolute;left:0;top:0;width:760px;height:630px;background:linear-gradient(90deg,rgba(40,3,8,.35) 0,rgba(52,5,10,.25) 70%,rgba(52,5,10,0) 100%)}
            .edge{position:absolute;inset:18px;border:1.5px solid rgba(214,176,108,.6);border-radius:6px}
            .edge2{position:absolute;inset:26px;border:1px solid rgba(214,176,108,.3);border-radius:4px}`,
      html: [
        GURMUKHI,
        '<div class="shade"></div><div class="edge"></div><div class="edge2"></div>',
        text(60, 54, 640, 76, 'ੴ', pa(58, '#000', 600) + goldText + 'line-height:1'),
        text(60, 134, 640, 36, 'SIKH WEDDING INVITATION', caps(22, '#e3c697', .3)),
        text(40, 178, 680, 120, 'Arshleen Kaur', script(100) + goldText + 'padding:18px 0 10px'),
        text(40, 286, 680, 50, '&amp;', "font:italic 500 46px/1 'Cormorant Garamond',serif;color:#e0bf86;"),
        text(40, 330, 680, 120, 'Manbir Singh', script(100) + goldText + 'padding:18px 0 10px'),
        text(200, 462, 360, 12, '', 'border-top:1px solid rgba(225,190,130,.6)'),
        text(40, 480, 680, 44, 'ANAND KARAJ · 19 JANUARY 2027', caps(27, '#f0d9ae', .12)),
        text(40, 528, 680, 40, 'Amritsar', "font:italic 500 32px 'Cormorant Garamond',serif;color:#e7cfa6;"),
      ].join('\n'),
    };
  },
};

/* the patch colours each rising line hides behind are read from the finished painting */
async function sceneColours(file, boxes) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const avg = (y, x0, x1) => {
    y = Math.max(0, Math.min(H - 1, y)); let r = 0, g = 0, b = 0, n = 0;
    for (let x = Math.max(0, x0); x < Math.min(W, x1); x += 2) { const i = (y * W + x) * 3; r += data[i]; g += data[i + 1]; b += data[i + 2]; n++; }
    const h = (v) => Math.round(v / n).toString(16).padStart(2, '0'); return '#' + h(r) + h(g) + h(b);
  };
  return boxes.map(([x, y, w, h, kind]) => {
    const p = [x, y, w, h, avg(y - 2, x, x + w), avg(y + h + 1, x, x + w)];
    return kind ? { p, cuts: [[x, y, w, h, 0, kind]] } : { p };
  });
}

/* the design's living layers (swaying lanterns, curtains, parallax) for each painting, minus any that would
   move a piece of the new artwork */
const MOTION = {
  main: { sway: [[0, 515, 115, 290, .35, 1.4, 5.2], [675, 395, 118, 270, .63, 1.2, 6.1], [674, 960, 116, 230, .51, 1.0, 5.6]], drift: [[590, 70, 185, 170, 'butterfly']], settle: [[150, 880, 500, 500, 1.04, .5, 1, 2.8, .2]], curtain: [[595, 0, 198, 340, 'r', 1.2, 2.6]], para: [[0, 0, 235, 270, -1.5]] },
  families: { sway: [[300, 75, 140, 172, .49, 1.2, 5.6], [635, 755, 98, 260, .77, 1.0, 6.3]], drift: [[0, 870, 200, 230, 'bob']], curtain: [[590, 70, 143, 260, 'r', 1.18, 2.4]], para: [[0, 90, 198, 290, -1.3]] },
  scratch: { sway: [[0, 95, 165, 450, .37, 1.1, 6.4], [85, 478, 105, 245, .45, 1.6, 4.8]], para: [[0, 120, 330, 195, -1.3], [690, 1080, 210, 380, 1.7]], keep: [[685, 20, 180, 215]] },
  functions: { sway: [[0, 210, 104, 290, .48, 1.3, 5.5]], curtain: [[0, 90, 100, 190, 'l', 1.2, 2.2], [440, 90, 249, 210, 'r', 1.15, 2.4]], para: [[0, 1360, 340, 110, 1.6], [604, 990, 85, 480, 1.4]] },
  closing: { drift: [[480, 120, 260, 230, 'butterfly'], [190, 140, 180, 210, 'twinkle']], curtain: [[0, 110, 230, 310, 'l', 1.15, 2.4]], para: [[0, 1040, 500, 360, 1.7], [685, 120, 310, 210, -1.3]] },
  akhand: { sway: [[0, 210, 104, 290, .48, 1.3, 5.5]], curtain: [[0, 90, 100, 190, 'l', 1.2, 2.2], [440, 90, 249, 200, 'r', 1.15, 2.4]] },
  shagna: { sway: [[265, 0, 230, 262, .5, .8, 7], [70, 212, 105, 190, .5, 1.5, 5], [635, 288, 105, 180, .5, 1.4, 5.6], [35, 588, 100, 135, .5, 1.2, 6]], curtain: [[0, 0, 198, 790, 'l', 1.32, 3.2], [563, 0, 198, 790, 'r', 1.32, 3.2]], settle: [[100, 890, 560, 420, 1.035, .5, 1, 3, .4], [0, 1080, 200, 520, 1.1, 0, 1, 2.8, .5], [560, 1060, 201, 540, 1.1, 1, 1, 2.8, .6]], textDelay: 900 },
  haldi: { sway: [[512, 0, 147, 315, .36, 1.2, 5.4], [540, 278, 119, 330, .6, 1.5, 6.2]], curtain: [[0, 0, 250, 340, 'l', 1.2, 2.4]], settle: [[0, 1030, 320, 360, 1.08, .2, 1, 2.4, .3]] },
  mehndi: { sway: [[210, 0, 270, 170, .5, 1.6, 4.2], [125, 140, 75, 195, .5, 2.2, 3.6], [605, 135, 75, 340, .5, 1.8, 4.4], [55, 500, 54, 410, .5, 1.4, 5]], drift: [[250, 175, 225, 150, 'dhol'], [0, 250, 105, 430, 'breathe']], settle: [[0, 1140, 275, 310, 1.06, 0, 1, 2.2, .3]] },
  jaggo: { sway: [[245, 70, 150, 185, .49, 1.2, 5.8], [8, 210, 90, 118, .47, 1.8, 4.4]], drift: [[184, 352, 260, 216, 'dhol']], curtain: [[0, 80, 245, 240, 'l', 1.15, 2.4], [400, 80, 228, 240, 'r', 1.15, 2.4]], para: [[0, 1370, 270, 150, 1.5], [395, 1370, 233, 150, 1.5]], textDelay: 600 },
  anand: { sway: [[0, 515, 115, 290, .35, 1.4, 5.2], [675, 395, 118, 270, .63, 1.2, 6.1]], curtain: [[595, 0, 198, 340, 'r', 1.2, 2.6]], para: [[0, 0, 235, 270, -1.5]] },
  celebration: { sway: [[245, 0, 300, 262, .51, .8, 7], [688, 135, 73, 270, .64, 1.3, 5.2], [585, 325, 80, 160, .5, 1.6, 4.6], [92, 1025, 75, 150, .5, 1.4, 5.4], [598, 1012, 75, 160, .5, 1.4, 6]], curtain: [[0, 150, 150, 470, 'l', 1.25, 2.8], [602, 0, 159, 620, 'r', 1.25, 2.8]], settle: [[80, 640, 600, 280, 1.035, .5, 1, 2.8, .3], [560, 1180, 201, 420, 1.09, 1, 1, 2.6, .5], [0, 1230, 200, 370, 1.09, 0, 1, 2.6, .5]], textDelay: 500 },
};
/* the countdown page keeps the design's own wording, so its lettering map is the design's */
const COUNTDOWN = { text: [{ p: [50, 330, 535, 100, '#280101', '#270001'] }, { p: [90, 742, 450, 122, '#230001', '#280102'] }], sway: [[245, 70, 150, 185, .49, 1.2, 5.8], [8, 210, 90, 118, .47, 1.8, 4.4]], curtain: [[0, 80, 245, 248, 'l', 1.15, 2.4], [400, 80, 228, 248, 'r', 1.15, 2.4]], para: [[0, 1370, 270, 150, 1.5], [395, 1370, 233, 150, 1.5]] };

const only = process.argv.slice(2);
for (const [name, build] of Object.entries(SCREENS)) {
  if (only.length && !only.includes(name)) continue;
  const s = await build();
  const out = s.outPath || path.join(OUT, name + '.jpg');
  await paintScreen({ src: s.src || orig(name), out, W: s.W, H: s.H, html: s.html + FIT, css: s.css, erase: s.erase, photos: s.photos, wait: 6000 });
  console.log('painted', name);
}
/* the countdown page is the design's own painting, unchanged */
fs.copyFileSync(orig('countdown'), path.join(OUT, 'countdown.jpg'));

/* js/scenes.js: always rebuilt from every painting on disk */
const scenes = { countdown: COUNTDOWN };
for (const name of Object.keys(MOTION)) {
  if (!SCENE_TEXT[name]) await SCREENS[name]();                 // fills SCENE_TEXT without painting
  const file = path.join(OUT, name + '.jpg');
  scenes[name] = { text: fs.existsSync(file) ? await sceneColours(file, SCENE_TEXT[name]) : [], ...MOTION[name] };
}
const js = `/* Layer map for every painting of this invitation, in SOURCE pixels of that painting.
   Written by tools/manbir-arshleen-bride-art.mjs — edit the tool, not this file.
   text: { p:[x,y,w,h,top,bottom], cuts?:[[x,y,w,h,delayMs,kind]] } · sway: [x,y,w,h,pivotX,deg,s]
   drift: [x,y,w,h,kind] · settle: [x,y,w,h,fromScale,ox,oy,s,delay] · curtain: [x,y,w,h,'l'|'r',fromScaleX,s]
   para: [x,y,w,h,depth] · keep: [x,y,w,h] */
window.SCENES = ${JSON.stringify(scenes, null, 0).replace(/\},"/g, '},\n  "')};
`;
fs.writeFileSync(path.join(PAGE, 'js/scenes.js'), js);
console.log('wrote js/scenes.js');
