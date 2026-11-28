#!/usr/bin/env node
/* Shifa & Mohammad Umair — the paintings of the three invitations on the Rose Red premium design
   (https://invitivals.com/muslim-premium-red/, only READ here, never written):

     public/shifa-umair-family-wedding/          the family invitation (three functions)
     public/shifa-umair-friends-wedding/         for friends: no calligraphy, no Arabic, no mosques or minarets
     public/shifa-personal-wedding-invitation/   Shifa's own invitation

     node tools/shifa-umair-cutout.mjs          (once: the client's couple picture → a clean cut-out)
     node tools/shifa-umair-art.mjs [plate …]   (default: every plate)

   The design's screens are paintings with their wording baked in. Each plate here starts from the design's
   own painting, lifts the old wording (and the old couple) off it, and paints the new couple and wording in.
   Dates, times, venues and buttons are NOT painted: they are live text on the pages (js/config.js).

   Sources: public/muslim-premium-red/assets/screens/*.jpg      (the design's untouched paintings)
            invites/src/shifa-umair-wedding/couple-cutout.png    (the client's couple, transparent)
   Output : invites/src/shifa-umair-wedding/plates/*.jpg, then copied into each page's assets/screens/ */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { paintScreen, patch, text } from './lib/paint-screen.mjs';

const REF = 'public/muslim-premium-red/assets/screens';
const SRC = 'invites/src/shifa-umair-wedding';
const PLATES = path.join(SRC, 'plates');
const TMP = path.join(SRC, 'build');
fs.mkdirSync(PLATES, { recursive: true }); fs.mkdirSync(TMP, { recursive: true });
const orig = (n) => path.join(REF, n + '.jpg');
const COUPLE = path.join(SRC, 'couple-cutout.png');
const CW = 1199, CH = 1312;                                    // the couple picture's own size (never distorted)

/* the design's palette and lettering */
const MAROON = '#5a1219', INK = '#4a0d12', DEEP = '#5c0f18';
const GOLD = 'linear-gradient(180deg,#f4dc9c 0%,#d9ae5c 45%,#b98a3a 70%,#e8c77e 100%)';
const caps = (px, color = MAROON, ls = .14) => `font:500 ${px}px/1.35 Cinzel,serif;letter-spacing:${ls}em;color:${color};`;
const script = (px, color = INK) => `font:400 ${px}px/1 'Great Vibes',cursive;color:${color};white-space:nowrap;`;
const serif = (px, color = INK, w = 500) => `font:${w} ${px}px/1.42 'Cormorant Garamond',serif;color:${color};`;
const italic = (px, color = '#6a2a1c') => `font:italic 500 ${px}px/1.3 'Cormorant Garamond',serif;color:${color};`;
const goldText = `background:${GOLD};-webkit-background-clip:text;background-clip:text;color:transparent;`;
const shadow = 'filter:drop-shadow(0 2px 2px rgba(30,0,4,.5));';
/* every lettering block shrinks until it fits its box */
const FIT = `<script>window.addEventListener('load',function(){setTimeout(function(){document.querySelectorAll('.t').forEach(function(el){if(!el.textContent.trim())return;var box=document.createElement('span');box.style.cssText='display:inline-flex;align-items:center;text-align:center;white-space:inherit;flex-direction:'+getComputedStyle(el).flexDirection;var wrap=getComputedStyle(el).whiteSpace==='normal';if(wrap){box.style.width='100%';box.style.display='flex';}while(el.firstChild)box.appendChild(el.firstChild);el.appendChild(box);var fs=parseFloat(getComputedStyle(el).fontSize),n=0;while(((!wrap&&box.getBoundingClientRect().width>el.clientWidth*(/Great Vibes/.test(getComputedStyle(el).fontFamily)?.86:.98))||box.getBoundingClientRect().height>el.clientHeight*1.02)&&fs>8&&n++<200){fs-=1;el.style.fontSize=fs+'px';}});},400);});</script>`;
const rule = (x, y, w, color = '#a8783a') => `<div class="rule" style="left:${x}px;top:${y}px;width:${w}px;color:${color}"><i></i><b>❦</b><i></i></div>`;
const RULE_CSS = `.rule{position:absolute;height:26px;display:flex;align-items:center;gap:12px;font-size:18px}
  .rule i{flex:1;height:1px;background:linear-gradient(90deg,transparent,currentColor,transparent)}
  .t p{margin:0}`;

/* SVG alpha (white = shows) for a layer placed at (ox,oy) w×h, from a polygon in artwork pixels */
function svgMask(w, h, ox, oy, points, { blur = 9, fadeTop = 0, fadeBottom = 0 } = {}) {
  const pts = points.map(([x, y]) => `${x - ox},${y - oy}`).join(' ');
  const t = (fadeTop / h).toFixed(3), b = (1 - fadeBottom / h).toFixed(3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>` +
    `<linearGradient id="f" x1="0" y1="0" x2="0" y2="${h}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${fadeTop ? 'black' : 'white'}"/><stop offset="${t}" stop-color="white"/><stop offset="${b}" stop-color="white"/><stop offset="1" stop-color="${fadeBottom ? 'black' : 'white'}"/></linearGradient>` +
    `<filter id="b" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>` +
    `<rect width="${w}" height="${h}" fill="black"/><g filter="url(#b)"><polygon points="${pts}" fill="url(#f)"/></g></svg>`;
}
const fill = (w, h, defs, paint) => sharp(Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>${defs}</defs><rect width="${w}" height="${h}" fill="${paint}"/></svg>`)).png().toBuffer();
/* the couple at width w (height follows the picture's own proportions), warmed a touch into the painted light */
async function couple(w, { bri = 1, sat = .97 } = {}) {
  const h = Math.round(CH * w / CW);
  return { buf: await sharp(COUPLE).resize(w, h).modulate({ brightness: bri, saturation: sat }).png().toBuffer(), w, h };
}
/* a soft contact shadow under the couple, so they stand in the scene rather than float on it */
const groundShadow = (w, h) => fill(w, h, '<radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#3a1408" stop-opacity=".30"/><stop offset="1" stop-color="#3a1408" stop-opacity="0"/></radialGradient>', 'url(#g)');

/* ── the main painting (793×1600) ──
   INTERIOR: the arch's open sky, inside its gold line, behind the roses, lanterns and the gold V at its foot.
   Everything outside it is laid back over the new couple from the design's own painting, so the roses and the
   arch frame stay in front of the couple exactly as they stood in front of the old one. */
const INTERIOR = [[50, 680], [750, 680], [750, 988], [734, 990], [728, 958], [718, 958], [714, 992], [700, 1004], [690, 1030], [688, 1170],
  [660, 1188], [640, 1204], [615, 1258], [570, 1300], [520, 1334], [400, 1414], [280, 1334], [232, 1300], [204, 1252], [178, 1190],
  [178, 1150], [160, 1125], [130, 1100], [118, 1060], [108, 1030], [84, 1000], [72, 960], [60, 930], [56, 880]];
/* the old couple's silhouette, generously */
const OLD_SIL = [[262, 888], [362, 888], [372, 950], [410, 968], [440, 944], [505, 944], [540, 1000], [604, 1090], [652, 1230],
  [656, 1340], [400, 1424], [150, 1344], [150, 1010], [240, 978]];
/* white = shows: a polygon (or, inverted, everything but it) for a layer at (ox,oy) w×h */
/* drawn over the whole artwork (so the blur never meets an edge), then cut to the layer: a PNG alpha */
async function polyMask(w, h, ox, oy, points, { blur = 6, invert = false, fadeTop = 0, W = 793, H = 1600 } = {}) {
  const pts = points.map(([x, y]) => `${x},${y}`).join(' ');
  const top = fadeTop ? `<linearGradient id="t" gradientUnits="userSpaceOnUse" x1="0" y1="${oy}" x2="0" y2="${oy + fadeTop}"><stop offset="0" stop-color="black"/><stop offset="1" stop-color="white"/></linearGradient>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${top}<filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>` +
    `<rect width="${W}" height="${H}" fill="${invert ? 'white' : 'black'}"/><g filter="url(#b)"><polygon points="${pts}" fill="${invert ? 'black' : (fadeTop ? 'url(#t)' : 'white')}"/></g></svg>`;
  return sharp(Buffer.from(svg)).extract({ left: ox, top: oy, width: w, height: h }).png().toBuffer();
}
/* the design's own foreground (roses, lanterns, curtains, the gold V), laid back over the couple */
const FG_TOP = 900;                                  // only the lower half: the lettering above is the new one
const foreground = async () => ({ file: orig('main'), crop: { left: 0, top: FG_TOP, width: 793, height: 1600 - FG_TOP }, x: 0, y: FG_TOP, w: 793, h: 1600 - FG_TOP,
  mask: await polyMask(793, 1600 - FG_TOP, 0, FG_TOP, INTERIOR, { blur: 2.5, invert: true }) });
/* a warm mist where the old couple stood (the palace fades into it behind the new couple) */
const haze = async () => ({
  file: await fill(560, 560, '<linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6cdab"/><stop offset=".5" stop-color="#dcbd97"/><stop offset="1" stop-color="#c9a27a"/></linearGradient>', 'url(#h)'),
  x: 120, y: 870, w: 560, h: 560, mask: await polyMask(560, 560, 120, 870, OLD_SIL, { blur: 16 }),
});
/* plain parchment sky for the friends' arch (no domes, minarets or palms) */
const sky = async () => ({
  file: await fill(700, 740, '<radialGradient id="p" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#f4e2c6"/><stop offset=".6" stop-color="#ecd3b0"/><stop offset="1" stop-color="#dfbd94"/></radialGradient>', 'url(#p)'),
  x: 48, y: 680, w: 700, h: 740, mask: await polyMask(700, 740, 48, 680, INTERIOR, { blur: 5, fadeTop: 60 }),
});
async function mainCouple() {
  const c = await couple(536);
  const x = Math.round(400 - c.w / 2 + 6), y = 1452 - c.h;      // plume clear of the lettering; the hem goes behind the gold V
  return [{ file: c.buf, x, y, w: c.w, h: c.h }];
}

/* lettering blocks that rise on screen (js/scenes.js) per plate: [x,y,w,h, kind?] */
export const SCENE_TEXT = {};

const NAMES = (top) => [
  text(100, top, 600, 150, 'Shifa', script(118, INK) + 'padding-top:18px'),
  text(350, top + 140, 100, 56, '&amp;', "font:italic 500 50px/1 'Cormorant Garamond',serif;color:#a87a2c;"),
  text(70, top + 184, 660, 150, 'Mohammad Umair', script(104, INK) + 'padding-top:16px'),
];

export const PLATES_DEF = {
  /* ── MAIN with the design's Bismillah (family + Shifa's own): only the names and the couple change ── */
  async main() {
    SCENE_TEXT.main = [[100, 440, 600, 150, 'name'], [350, 580, 100, 56], [70, 624, 660, 150, 'name']];
    return {
      W: 793, H: 1600, src: orig('main'),
      erase: [{ x: 180, y: 430, w: 440, h: 362, r: 22, f: 14 }, { x: 226, y: 766, w: 348, h: 34, r: 12, f: 8 }],   // names + their divider
      photos: [await haze(), ...await mainCouple(), await foreground()],
      css: RULE_CSS,
      html: [...NAMES(440), rule(286, 770, 220)].join('\n'),
    };
  },

  /* ── MAIN for friends: no Bismillah, no "In the name of Allah", no mosques or minarets; the client's own words ── */
  async mainFriends() {
    SCENE_TEXT.mainFriends = [[140, 170, 520, 60], [120, 262, 560, 100], [100, 440, 600, 150, 'name'], [350, 580, 100, 56], [70, 624, 660, 150, 'name'], [180, 792, 440, 70]];
    return {
      W: 793, H: 1600, src: orig('main'),
      erase: [
        { x: 205, y: 160, w: 400, h: 112, r: 16 },          // Bismillah
        { x: 140, y: 280, w: 520, h: 66, r: 10 },           // "In the name of Allah …"
        { x: 180, y: 430, w: 440, h: 362, r: 22, f: 14 },   // the old names
        { x: 220, y: 786, w: 360, h: 92, r: 14 },           // "Together in faith, forever in love"
      ],
      photos: [await sky(), ...await mainCouple(), await foreground()],
      css: RULE_CSS,
      html: [                                                // "Together with our families" stays, as painted
        text(140, 196, 520, 64, 'WITH IMMENSE JOY', caps(27, MAROON, .2)),
        rule(276, 296, 240),
        ...NAMES(440),
        text(180, 792, 440, 70, 'SATURDAY<br>26 DECEMBER 2026', caps(20, MAROON, .16) + 'line-height:1.55'),
      ].join('\n'),
    };
  },

  /* ── THE INVITATION (the design's Dua page, top): the client's words, exactly ── */
  messageFamily: () => message({
    name: 'messageFamily', heading: 'You’re Invited',
    paras: ['With immense gratitude to Allah (SWT), we are delighted to invite you and your family to the wedding of our daughter <b>Shifa</b> with <b>Mohammad Umair</b> on Saturday, 26th December 2026.',
      'Your presence and sincere duas are the greatest blessings we could ask for as they begin this new chapter together.'],
    sign: 'Parvez &amp; Nazima', fs: 29,
    families: true,
  }),
  messageFriends: () => message({
    name: 'messageFriends', heading: 'You’re Invited',
    paras: ['With immense joy, we invite you and your family to celebrate the wedding of our daughter <b>Shifa</b> with <b>Mohammad Umair</b>.',
      'Your friendship has always meant so much to us, and we would truly love to have you there to bless the couple as they begin this new chapter together.',
      '<i>Please consider this as a personal invitation—we can’t wait to celebrate with you!</i>'],
    pre: 'Warmly,', sign: 'Parvez &amp; Nazima Kazi', fs: 28,
  }),
  messagePersonal: () => message({
    name: 'messagePersonal', heading: 'I’m so happy to share<br>that I’m getting married!', headingFs: 58,
    paras: ['As I step into this new chapter of my life, having you there to celebrate and share your best wishes would mean the world to me.',
      '<i>Please consider this a personal invitation—I can’t wait to celebrate with you!</i>'],
    pre: 'With love,', sign: 'Shifa', fs: 32,
  }),

  /* ── THANK YOU (the design's Dua page, foot): the client's note and sign-off ── */
  thanksFamily: () => thanks('thanksFamily', 'We sincerely thank you for being a part of our happiness. Your presence, love and blessings will make these celebrations even more memorable.', 'Parvez &amp; Nazima'),
  thanksFriends: () => thanks('thanksFriends', 'Thank you for celebrating this special moment with us. Your presence and warm wishes mean so much to our family.', 'Parvez &amp; Nazima Kazi'),
  thanksPersonal: () => thanks('thanksPersonal', 'Thank you for being a part of my special journey. Your love, blessings and presence will make my celebration even more meaningful.', 'Shifa'),

  /* ── SCRATCH THE DATE: only the names top right change (the date itself is live text under the foil) ── */
  async scratch() {
    SCENE_TEXT.scratch = [[672, 30, 206, 66]];
    return {
      W: 900, H: 1600, src: orig('scratch'),
      erase: [
        { x: 680, y: 28, w: 190, h: 72, r: 12, mode: 'min' },                       // AHMAD & LAYLA
      ],
      html: text(668, 30, 214, 66, 'SHIFA &amp;<br>MOHAMMAD UMAIR', caps(19, '#ead1a8', .16) + 'line-height:1.5'),
    };
  },

  /* ── OUR FUNCTIONS: three plaques (the design's own), evenly spaced; names and dates painted on them ── */
  async functions() {
    const W = 689, H = 1600, src = orig('functions');
    const { erase } = await import('./lib/erase.mjs');
    const nameOff = { r: 26, p: .4, f: 12, blur: 5, grain: 5 };
    const blank = path.join(TMP, 'functions-blank.png');
    fs.writeFileSync(blank, await erase(src, [                    // the painted names lifted off every plaque
      { x: 318, y: 568, w: 250, h: 100, ...nameOff }, { x: 318, y: 902, w: 230, h: 92, ...nameOff }, { x: 318, y: 1068, w: 230, h: 96, ...nameOff },
    ]));
    /* [plaque in the design (x,y,w,h), its new top] — Manje's flowers and bowl · Shadi's rings · Valima's cloche */
    const PL = [[56, 536, 560, 164], [56, 870, 560, 164], [56, 1036, 560, 164]];
    const TOPS = [600, 790, 980];
    /* one clean sheet of the page's parchment where the four plaques stood (its own colours, sampled) */
    const sheet = await fill(590, 730, '<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3c6a7"/><stop offset=".5" stop-color="#dcbe9e"/><stop offset="1" stop-color="#d7b794"/></linearGradient>', 'url(#g)');
    const sheetMask = `<svg xmlns="http://www.w3.org/2000/svg" width="590" height="730"><defs><filter id="b"><feGaussianBlur stdDeviation="22"/></filter></defs><rect width="590" height="730" fill="black"/><rect x="44" y="40" width="502" height="650" rx="60" fill="white" filter="url(#b)"/></svg>`;
    const photos = [{ file: sheet, x: 50, y: 506, w: 590, h: 730, mask: sheetMask }], html = [], ITEMS = [
      ['Rang-e-Noor', 'TUESDAY · 22 DECEMBER'], ['Qubool Hai', 'THURSDAY · 24 DECEMBER'], ['Dawat-e-Ishq', 'SATURDAY · 26 DECEMBER']];
    const plMask = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="b"><feGaussianBlur stdDeviation="5"/></filter></defs><rect width="${w}" height="${h}" fill="black"/><rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="26" fill="white" filter="url(#b)"/></svg>`;
    PL.forEach(([x, y, w, h], i) => {
      photos.push({ file: blank, crop: { left: x, top: y, width: w, height: h }, x, y: TOPS[i], w, h, mask: plMask(w, h) });
      const ty = TOPS[i] + (y === 536 ? 34 : 22);                  // the Manje plaque sits a little lower in its box
      html.push(text(300, ty, 270, 62, ITEMS[i][0], script(i === 0 ? 54 : 58, '#f6e6cf') + 'text-shadow:0 2px 5px rgba(0,0,0,.55);padding-top:10px'));
      html.push(text(296, ty + 66, 278, 26, ITEMS[i][1], caps(14.5, '#e9cc98', .14)));
    });
    SCENE_TEXT.functions = [[150, 432, 390, 70]];
    return {
      W, H, src,
      erase: [
        { x: 150, y: 434, w: 390, h: 62, r: 10, f: 10 },                                 // "Four beautiful occasions"
        { x: 60, y: 520, w: 566, h: 700, r: 90, p: .72, f: 26, blur: 10, grain: 4 },     // the four plaques
        { x: 300, y: 1206, w: 90, h: 36, r: 10, f: 8 },                                  // the heart below them
      ],
      photos,
      html: [text(130, 434, 430, 62, 'THREE BEAUTIFUL OCCASIONS<br>ONE BLESSED JOURNEY', caps(19)), ...html].join('\n'),
    };
  },

  /* ── RANG-E-NOOR (the design's colourful tassel scene; dress code green & pink) ── */
  async rangeNoor() {
    const lt = { r: 22, p: .62, f: 18, blur: 5, grain: 4 };
    SCENE_TEXT.rangeNoor = [[110, 322, 490, 130, 'title']];
    return {
      W: 709, H: 1600, src: orig('sanchak'),
      erase: [
        { x: 116, y: 330, w: 470, h: 132, ...lt }, { x: 110, y: 470, w: 495, h: 110, ...lt },  // title + its line
        { x: 136, y: 540, w: 438, h: 470, ...lt, r: 30, f: 30 },                               // painted dividers, date, venue, tagline
      ],
      html: text(110, 322, 490, 130, 'Rang-e-Noor', script(104, '#6a0f1c') + 'padding-top:16px'),
    };
  },

  /* ── QUBOOL HAI (the design's Nikah stage: نكاح, "a sacred bond in the sight of Allah", the Qubool Hai pillows) ── */
  async quboolHai() {
    const dk = { p: .35, blur: 6, grain: 6 };
    SCENE_TEXT.quboolHai = [[130, 372, 500, 170, 'title']];
    return {
      W: 761, H: 1600, src: orig('shadi'),
      erase: [
        { x: 196, y: 388, w: 360, h: 156, r: 40, f: 20, ...dk },   // Shadi
        { x: 176, y: 640, w: 408, h: 110, r: 24, f: 14, ...dk },   // painted date
        { x: 196, y: 766, w: 370, h: 136, r: 24, f: 14, ...dk },   // painted venue
      ],
      html: text(130, 372, 500, 170, 'Qubool Hai', script(104) + goldText + 'filter:drop-shadow(0 2px 3px rgba(30,0,4,.6));padding-top:20px'),
    };
  },

  /* ── DAWAT-E-ISHQ (the design's candle-lit banquet; the Arabic "Walima" lifted, as this name is the client's) ── */
  dawat: () => banquet('dawat', 'Dawat-e-Ishq', 100),
  /* ── the friends' one evening, on the same banquet ── */
  celebration: () => banquet('celebration', 'Wedding<br>Celebration', 84),
};

/* the Dua page's arch with the client's message (one clean sheet of its parchment, the old wording lifted) */
async function message({ name, heading, headingFs = 84, paras, pre = '', sign, fs: px = 28, families = false }) {
  const base = path.join(TMP, 'message-src.jpg');
  await sharp(orig('dua')).extract({ left: 0, top: 0, width: 733, height: 1100 }).jpeg({ quality: 95 }).toFile(base);
  const lt = { r: 22, p: .62, f: 16, blur: 5, grain: 4 };
  const cx = 116, w = 501;
  const headH = heading.includes('<br>') ? 150 : 100;
  const y0 = 262, bodyY = y0 + headH + 34;
  const signH = 92 + (pre ? 32 : 0), famH = families ? 206 : 0;
  const end = families ? 994 : 1000;
  const bodyH = end - bodyY - signH - famH - 8;
  const signY = bodyY + bodyH + 4;
  SCENE_TEXT[name] = [[90, y0, 553, headH, 'name'], [cx, bodyY, w, bodyH], [cx, signY, w, signH, 'name']];
  const erase = [
    { x: 190, y: 258, w: 360, h: 106, ...lt },                // Arabic
    { x: 200, y: 360, w: 330, h: 34, ...lt, r: 12, f: 10 },   // its divider
    { x: 100, y: 382, w: 540, h: 120, ...lt },                // Dua for the Couple
    { x: 128, y: 506, w: 466, h: 104, ...lt },                // body copy
    { x: 236, y: 612, w: 266, h: 40, ...lt, r: 12, f: 10 },   // divider with the heart
    { x: 104, y: 644, w: 526, h: 206, r: 90, p: .5, f: 34, blur: 10, grain: 4 },  // the dua box
    { x: 530, y: 822, w: 100, h: 36, ...lt, r: 12, f: 10 },   // 0/500
    { x: 186, y: 840, w: 370, h: 116, r: 90, p: .9, f: 30, blur: 10, grain: 4 },   // Send Dua button
    { x: 60, y: 492, w: 64, h: 336, ...lt, r: 30, f: 14 }, { x: 552, y: 440, w: 126, h: 340, r: 40, p: .7, f: 18, blur: 6, grain: 4 },   // faint minarets
    { x: 112, y: 520, w: 62, h: 140, ...lt, r: 26, f: 12 }, { x: 554, y: 500, w: 62, h: 160, ...lt, r: 26, f: 12 },
  ];
  const body = paras.map((p) => `<p>${p}</p>`).join('');
  const html = [
    patch(98, 246, 538, 748, 'linear-gradient(180deg,#f0dcc4 0%,#ecd3b8 40%,#e6c9aa 75%,#dfbd9b 100%)', 60),
    text(90, y0, 553, headH, heading, script(headingFs, DEEP) + 'padding-top:10px;line-height:1.12'),
    rule(246, y0 + headH + 4, 240),
    text(cx, bodyY, w, bodyH, body, serif(px, '#3e1014') + 'white-space:normal;gap:16px;'),
    text(cx, signY, w, signH, (pre ? `<span style="${italic(27)}">${pre}</span>` : '') + `<span>${sign}</span>`, script(60, DEEP) + 'gap:4px;padding-top:6px'),
  ];
  if (families) {
    const fy = signY + signH + 6, rowH = 94, fx = 176, fw = 410;          // clear of the swan (left) and the lantern (right)
    SCENE_TEXT[name].push([fx, fy + 18, fw, rowH, 'name'], [fx, fy + 18 + rowH, fw, rowH, 'name']);
    html.push(rule(256, fy - 4, 220));
    const row = (y, nm, rel, par) => [
      text(fx, y, fw, 52, nm, script(46, DEEP) + 'padding-top:8px'),
      text(fx, y + 52, fw, 36, `<span style="${italic(23)}">${rel}&nbsp;</span><span>${par}</span>`, serif(24, '#3e1014', 600) + 'flex-direction:row;white-space:nowrap;align-items:baseline'),
    ];
    html.push(...row(fy + 18, 'Shifa', 'Daughter of', 'Parvez &amp; Nazima'), ...row(fy + 18 + rowH, 'Mohammad Umair', 'Son of', 'Shahnawaz &amp; Roomana'));
  }
  return { W: 733, H: 1100, src: base, erase, css: RULE_CSS + '.t b{font-weight:700;color:#5c0f18}.t i{font-style:italic}', html: html.join('\n') };
}

/* the Dua page's foot: "Thank You" (as painted), the client's note, and the sign-off */
async function thanks(name, note, sign) {
  const base = path.join(TMP, 'thanks-src.jpg');
  await sharp(orig('dua')).extract({ left: 0, top: 1040, width: 733, height: 560 }).jpeg({ quality: 95 }).toFile(base);
  const lt = { r: 22, p: .62, f: 14, blur: 5, grain: 4 };
  SCENE_TEXT[name] = [[146, 222, 441, 124], [150, 352, 433, 110, 'name']];
  return {
    W: 733, H: 560, src: base,
    erase: [
      { x: 160, y: 224, w: 413, h: 98, ...lt },                 // the note
      { x: 190, y: 318, w: 353, h: 34, ...lt, r: 12, f: 10 },   // its divider
      { x: 176, y: 348, w: 381, h: 86, ...lt },                 // Ahmad & Layla
      { x: 220, y: 418, w: 293, h: 28, ...lt, r: 10, f: 8 },    // the divider under the names
    ],
    css: RULE_CSS,
    html: [
      text(166, 222, 401, 124, note, serif(26, '#3e1014') + 'white-space:normal;line-height:1.36'),
      text(150, 352, 433, 110, `<span style="${italic(23)}">With love,</span><span>${sign}</span>`, script(52, DEEP) + 'gap:2px'),
    ].join('\n'),
  };
}

/* the design's banquet (761×1600): new title, a clean parchment card for the live date, time and venue */
async function banquet(name, title, px) {
  const dk = { p: .35, blur: 6, grain: 6 };
  const card = { r: 20, p: .62, f: 16, blur: 5, grain: 4 };
  SCENE_TEXT[name] = [[120, 300, 520, 230, 'title']];
  return {
    W: 761, H: 1600, src: orig('valima'),
    erase: [
      { x: 300, y: 270, w: 190, h: 92, r: 30, f: 16, ...dk },    // Arabic
      { x: 186, y: 360, w: 414, h: 150, r: 40, f: 20, ...dk },   // Valima
      { x: 176, y: 958, w: 424, h: 114, ...card },               // painted date (with its icon)
      { x: 176, y: 1074, w: 424, h: 146, ...card },              // painted venue (with its pin)
      { x: 200, y: 1222, w: 380, h: 164, ...card },              // tagline and heart
      { x: 196, y: 1372, w: 372, h: 110, ...card, r: 64, p: .8, f: 22 },   // the painted map pill: the live buttons sit here
    ],
    html: text(120, 300, 520, 230, title, script(px) + goldText + 'filter:drop-shadow(0 2px 3px rgba(10,0,4,.6));padding-top:16px;line-height:1.05'),
  };
}

const only = process.argv.slice(2);
if (import.meta.url === `file:///${path.resolve(process.argv[1]).replace(/\\/g, '/')}`) {
  for (const [name, build] of Object.entries(PLATES_DEF)) {
    if (only.length && !only.includes(name)) continue;
    const s = await build();
    const out = path.join(PLATES, name + '.jpg');
    await paintScreen({ src: s.src, out, W: s.W, H: s.H, html: (s.html || '') + FIT, css: s.css, erase: s.erase, photos: s.photos, wait: 6000 });
    console.log('painted', name);
  }
}
