#!/usr/bin/env node
/* Chanchal & JP — Rajasthani Hindu wedding on the Rose Red premium template
   (the client chose https://wedding-invtion.vercel.app = public/muslim-premium-red).

   The template's screens are paintings with their wording baked in, and the page
   animates lettering cut from those paintings. So the Hindu wording, the couple's
   real photos and the new screens are painted INTO the artwork here; every
   animation then plays the new lettering by itself.

     node tools/chanchal-jp-art.mjs [screen …]     (default: all)

   Sources: invites/src/chanchal-jp-wedding/original-screens/*.jpg (untouched template art)
            invites/src/chanchal-jp-wedding/photo-*.jpg            (client photos, unedited)
   Output : public/chanchal-jp-wedding/assets/screens/*.jpg + assets/og.jpg */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { paintScreen, patch, clone, text, url } from './lib/paint-screen.mjs';

const SRC = 'invites/src/chanchal-jp-wedding';
const OUT = 'public/chanchal-jp-wedding/assets/screens';
const TMP = path.join(SRC, 'build');
fs.mkdirSync(TMP, { recursive: true });
const orig = (n) => path.join(SRC, 'original-screens', n + '.jpg');
const out = (n) => path.join(OUT, n + '.jpg');

/* palette lifted from the artwork */
const MAROON = '#5a1219';
const INK = '#4a0d12';
const GOLD = 'linear-gradient(180deg,#f4dc9c 0%,#d9ae5c 45%,#b98a3a 70%,#e8c77e 100%)';
const caps = (px, color = MAROON, ls = .14) => `font:500 ${px}px/1.35 Cinzel,serif;letter-spacing:${ls}em;color:${color};`;
const script = (px, color = INK) => `font:400 ${px}px/1 'Great Vibes',cursive;color:${color};`;
const deva = (px, color = MAROON) => `font:400 ${px}px/1.2 'Tiro Devanagari Hindi',serif;color:${color};`;
const goldText = `background:${GOLD};-webkit-background-clip:text;background-clip:text;color:transparent;`;
/* parchment of the light screens, as one canvas-wide gradient so neighbouring patches agree */
const parchment = (W, H, cx, cy, x, y) =>
  `radial-gradient(ellipse ${W * .62}px ${H * .5}px at ${cx - x}px ${cy - y}px,#fbeedb 0%,#f7e4cb 38%,#f0d6b8 68%,#e6c39d 100%)`;

/* a client photo, cropped and gently graded to sit in the warm artwork (faces untouched) */
async function photo(n, crop, w, h, grade = {}) {
  const file = path.join(TMP, `photo-${n}-${w}x${h}.jpg`);
  await sharp(path.join(SRC, `photo-${n}.jpg`)).extract(crop).resize(w, h, { fit: 'cover' })
    .modulate({ saturation: grade.sat ?? 0.96, brightness: grade.bri ?? 1.02 })
    .linear(grade.contrast ?? 1.0, grade.lift ?? 0)
    .jpeg({ quality: 92 }).toFile(file);
  return file;
}

/* SVG alpha for a photo placed at (ox,oy), w×h: white = photo shows; polygon in artwork pixels */
function svgMask(w, h, ox, oy, points, { blur = 9, fadeTop = 0, holes = [] } = {}) {
  const pts = points.map(([x, y]) => `${x - ox},${y - oy}`).join(' ');
  const hole = holes.map(([cx, cy, rx, ry]) => `<ellipse cx="${cx - ox}" cy="${cy - oy}" rx="${rx}" ry="${ry}" fill="black"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>` +
    `<linearGradient id="f" x1="0" y1="0" x2="0" y2="${h}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="black"/><stop offset="${(fadeTop / h).toFixed(3)}" stop-color="white"/></linearGradient>` +
    `<filter id="b" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>` +
    `<rect width="${w}" height="${h}" fill="black"/><g filter="url(#b)"><polygon points="${pts}" fill="url(#f)"/>${hole}</g></svg>`;
}

/* soft oval alpha, for lifting a painted prop from one place to another */
const oval = (w, h, blur = 8, inset = .1) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="b"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>` +
  `<rect width="${w}" height="${h}" fill="black"/><ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * (.5 - inset)}" ry="${h * (.5 - inset)}" fill="white" filter="url(#b)"/></svg>`;
const plaqueName = (y, name) => text(318, y, 230, 80, name, script(66, '#f4e0bf') + 'text-shadow:0 1px 2px rgba(40,0,6,.45)');

const SCREENS = {
  /* ── MAIN: invocation, names, the couple at Jal Mahal inside the arch ── */
  async main() {
    const W = 793, H = 1600;
    const ph = { x: 66, y: 862, w: 668, h: 600 };
    const img = await photo(10, { left: 110, top: 205, width: 900, height: 808 }, ph.w, ph.h, { sat: .97, bri: 1.03 });
    const mask = svgMask(ph.w, ph.h, ph.x, ph.y, [
      [70, 862], [730, 862], [730, 968], [684, 978], [676, 1150], [640, 1236], [604, 1300], [590, 1326],
      [396, 1410], [204, 1330], [214, 1182], [150, 1112], [70, 1092]
    ], { blur: 8, fadeTop: 70 });
    return {
      W, H,
      erase: [
        { x: 205, y: 160, w: 400, h: 112, r: 16 },          // Bismillah
        { x: 140, y: 280, w: 520, h: 66, r: 10 },           // "In the name of Allah …"
        { x: 175, y: 450, w: 450, h: 318, r: 18, f: 26 },   // Ahmad & Layla
        { x: 240, y: 794, w: 330, h: 36, r: 9 },            // "Together in faith"
        { x: 78, y: 680, w: 166, h: 212, r: 30, f: 20 },    // minarets left of the names
        { x: 566, y: 680, w: 160, h: 212, r: 30, f: 20 },   // minarets right of the names
        { x: 72, y: 846, w: 656, h: 110, r: 34, f: 24 },    // domes behind the top of the photo
      ],
      photos: [{ file: img, ...ph, mask }],
      html: [
        text(205, 168, 400, 100, '॥ श्री गणेशाय नमः ॥', deva(46)),
        text(130, 282, 540, 64, 'WITH THE DIVINE BLESSINGS OF<br>SHRI GANESH JI &amp; OUR ELDERS', caps(19.5)),
        text(150, 452, 500, 160, 'Chanchal', script(128) + 'padding-top:10px'),
        text(350, 596, 100, 60, '&amp;', "font:italic 500 50px/1 'Cormorant Garamond',serif;color:#a87a2c;"),
        text(150, 640, 500, 112, 'JP', script(112)),
        text(220, 794, 370, 36, 'TWO HEARTS, ONE JOURNEY', caps(19.5)),
      ].join('\n'),
    };
  },

  /* ── SCRATCH: the couple's names top right; the mosque skyline becomes velvet + शुभ विवाह ── */
  async scratch() {
    return {
      W: 900, H: 1600,
      erase: [
        { x: 680, y: 28, w: 190, h: 72, r: 12, mode: 'min' },          // AHMAD & LAYLA
        { x: 680, y: 128, w: 190, h: 72, r: 10, mode: 'min' },         // TOGETHER IN FAITH FOREVER IN LOVE
        { x: 196, y: 1188, w: 488, h: 220, r: 40, p: .35, f: 26, blur: 8, grain: 7 },   // mosque skyline
        { x: 226, y: 1380, w: 280, h: 74, r: 30, p: .35, f: 20, blur: 6, grain: 7 },
        { x: 500, y: 1372, w: 110, h: 46, r: 20, p: .35, f: 12, blur: 4, grain: 7 },
      ],
      html: [
        text(672, 30, 206, 66, 'CHANCHAL<br>&amp; JP', caps(21, '#ead1a8', .2) + 'line-height:1.45'),
        text(672, 128, 206, 72, 'TWO HEARTS<br>ONE JOURNEY<br>FOREVER IN LOVE', caps(12.5, '#e3c9a0', .14) + 'line-height:1.55'),
        text(240, 1238, 420, 110, 'शुभ विवाह', deva(64) + goldText + 'opacity:.85'),
        text(240, 1334, 420, 40, '॥ ROOTED IN TRADITION, BLESSED BY LOVE ॥', caps(13, '#d9b98a', .16) + 'opacity:.9'),
      ].join('\n'),
    };
  },

  /* ── FUNCTIONS: Baan · Tilak · Janeev · Fera; brass diyas for Janeev, the rings move to Fera ── */
  async functions() {
    const src = orig('functions');
    const dk = { p: .4, f: 14, blur: 5, grain: 6 };
    return {
      W: 689, H: 1600,
      erase: [
        { x: 312, y: 572, w: 222, h: 104, r: 26, ...dk },    // Manje
        { x: 312, y: 738, w: 226, h: 86, r: 26, ...dk },     // Sanchak
        { x: 318, y: 902, w: 216, h: 90, r: 26, ...dk },     // Shadi
        { x: 322, y: 1074, w: 208, h: 88, r: 26, ...dk },    // Valima
        { x: 160, y: 892, w: 152, h: 118, r: 40, ...dk, f: 16 },  // rings (moved below)
        { x: 152, y: 1062, w: 166, h: 112, r: 40, ...dk, f: 16 }, // cloche
      ],
      photos: [
        { file: path.join(SRC, 'deepam.webp'), x: 156, y: 890, w: 160, h: 122, fit: 'contain' },
        { file: src, crop: { left: 166, top: 892, width: 142, height: 116 }, x: 166, y: 1064, w: 142, h: 116, mask: oval(142, 116, 6, .04) },
      ],
      html: [
        plaqueName(578, 'Baan'),
        plaqueName(742, 'Tilak'),
        plaqueName(906, 'Janeev'),
        plaqueName(1076, 'Fera'),
      ].join('\n'),
    };
  },

  /* ── BLESSINGS (was the dua page): the same form, Hindu wording, the couple's names ── */
  async dua() {
    const lt = { r: 22, p: .62, f: 16, blur: 5, grain: 4 };
    return {
      W: 733, H: 1600,
      erase: [
        { x: 190, y: 258, w: 360, h: 106, ...lt },                // Arabic
        { x: 100, y: 382, w: 540, h: 120, ...lt },                // Dua for the Couple
        { x: 128, y: 506, w: 466, h: 104, ...lt },                // body copy
        { x: 140, y: 684, w: 260, h: 36, ...lt, r: 12, f: 8 },    // baked placeholder in the box
        { x: 60, y: 492, w: 64, h: 336, ...lt, r: 30, f: 14 },    // minarets, left
        { x: 610, y: 470, w: 76, h: 358, ...lt, r: 30, f: 14 },   // minarets, right
        { x: 112, y: 520, w: 62, h: 140, ...lt, r: 26, f: 12 },   // minaret tips beside the copy
        { x: 554, y: 500, w: 62, h: 160, ...lt, r: 26, f: 12 },
        { x: 334, y: 876, w: 150, h: 44, r: 16, p: .45, f: 10, blur: 4 },   // "Send Dua"
        { x: 176, y: 1260, w: 382, h: 100, ...lt },               // thank-you copy
        { x: 186, y: 1384, w: 362, h: 100, ...lt },               // Ahmad & Layla
      ],
      html: [
        text(160, 262, 420, 92, '॥ शुभ आशीर्वाद ॥', deva(48)),
        text(70, 384, 600, 112, 'Blessings for the Couple', script(62, '#5c0f18') + 'white-space:nowrap;padding-top:8px'),
        text(110, 504, 514, 112, 'Your presence and blessings will make our<br>celebration even more special. Send your love<br>and blessings to Chanchal &amp; JP as they begin<br>this beautiful new chapter.',
          "font:500 21px/1.3 'Cormorant Garamond',serif;color:#3e1912;"),
        `<div class="t" style="left:332px;top:874px;width:182px;height:48px;justify-content:center;align-items:flex-start;font:600 25px/1 'Cormorant Garamond',serif;color:#f6e6cc;">Send Blessings</div>`,
        text(150, 1262, 434, 96, 'For being a part of our journey<br>and for your love, support and blessings.<br>Your presence means the world to us.',
          "font:500 21px/1.42 'Cormorant Garamond',serif;color:#3e1912;"),
        text(170, 1386, 394, 96, 'Chanchal <span style="font:italic 500 44px Cormorant Garamond,serif;color:#9a6a2a">&amp;</span> JP', script(56, '#5c0f18') + 'flex-direction:row;gap:12px;white-space:nowrap;padding-top:6px'),
      ].join('\n'),
    };
  },

  /* ── FUNCTION PAGES: only the painted titles change; dates, times and venues are live text ── */
  async manje() {                                            // → Baan
    return {
      W: 659, H: 1600,
      erase: [{ x: 96, y: 250, w: 440, h: 222, r: 40, p: .35, f: 22, blur: 7, grain: 6 }, { x: 350, y: 440, w: 90, h: 54, r: 20, p: .35, f: 10, blur: 4, grain: 6 }],
      html: text(90, 246, 470, 220, 'Baan', script(170) + goldText + 'filter:drop-shadow(0 2px 2px rgba(30,0,4,.5));padding-top:20px'),
    };
  },

  async sanchak() {                                          // → Tilak
    return {
      W: 709, H: 1600,
      erase: [{ x: 116, y: 330, w: 470, h: 132, r: 22, p: .62, f: 18, blur: 5, grain: 4 }],
      html: text(150, 326, 430, 140, 'Tilak', script(150, '#6a0f1c') + 'padding-top:16px'),
    };
  },

  async shadi() {                                            // → Fera, with the client's tithi wording
    const dk = { p: .35, blur: 6, grain: 6 };
    const pillow = { p: .45, r: 18, f: 10, blur: 4, grain: 6 };
    return {
      W: 761, H: 1600,
      erase: [
        { x: 296, y: 288, w: 174, h: 104, r: 30, f: 16, ...dk },   // Arabic
        { x: 196, y: 388, w: 360, h: 156, r: 40, f: 20, ...dk },   // Shadi
        { x: 206, y: 548, w: 350, h: 70, r: 24, f: 14, ...dk },    // A sacred bond …
        { x: 196, y: 1002, w: 112, h: 80, ...pillow },             // Qubool Hai (left pillow)
        { x: 466, y: 1002, w: 112, h: 80, ...pillow },             // Qubool Hai (right pillow)
      ],
      html: [
        text(240, 290, 280, 100, 'शुभ विवाह', deva(52) + goldText),
        text(170, 384, 420, 162, 'Fera', script(150) + goldText + 'filter:drop-shadow(0 2px 3px rgba(30,0,4,.6));padding-top:18px'),
        text(196, 550, 370, 66, 'MARGASHIRSHA KRISHNA PAKSHA<br>BUDHWAR', caps(17, '#ecd3a8', .1) + 'line-height:1.5'),
        text(190, 1008, 128, 64, 'Shubh', script(40, '#ecd2a6')),
        text(458, 1008, 128, 64, 'Vivah', script(40, '#ecd2a6')),
      ].join('\n'),
    };
  },

  async valima() {                                           // → Janeev (the sacred-thread ceremony)
    const dk = { p: .35, blur: 6, grain: 6 };
    return {
      W: 761, H: 1600,
      erase: [
        { x: 300, y: 270, w: 190, h: 92, r: 30, f: 16, ...dk },    // Arabic
        { x: 186, y: 360, w: 414, h: 150, r: 40, f: 20, ...dk },   // Valima
        { x: 186, y: 532, w: 400, h: 76, r: 24, f: 14, ...dk },    // An evening of blessings …
        { x: 206, y: 1246, w: 354, h: 100, r: 20, p: .62, f: 14, blur: 5, grain: 4 },   // Dine, celebrate …
      ],
      html: [
        text(220, 266, 320, 100, 'जनेऊ संस्कार', deva(50) + goldText),
        text(160, 356, 440, 156, 'Janeev', script(140) + goldText + 'filter:drop-shadow(0 2px 3px rgba(10,0,4,.6));padding-top:18px'),
        text(176, 534, 420, 72, 'A SACRED THREAD,<br>BLESSINGS &amp; TOGETHERNESS', caps(18.5, '#ead2a8', .1) + 'line-height:1.55'),
        text(200, 1248, 366, 96, 'Blessed by Our Elders,<br>Bound by Tradition', script(40, '#7a1a22') + 'line-height:1.2'),
      ].join('\n'),
    };
  },

  /* ── NEW: OUR MOMENTS — the couple's photos in gold arches, on the countdown's velvet ── */
  async gallery() {
    const W = 628, H = 1600;
    const pics = [
      [6, { left: 0, top: 160, width: 1066, height: 1421 }],    // walking among the pigeons
      [8, { left: 0, top: 200, width: 1024, height: 1336 }],    // on the wooden steps
      [9, { left: 380, top: 0, width: 768, height: 1024 }],     // Hawa Mahal
      [7, { left: 0, top: 120, width: 1066, height: 1421 }],    // hand in hand on the stairs
    ];
    const fw = 250, fh = 340, xs = [46, 332], ys = [492, 866];
    const frames = [];
    for (let i = 0; i < 4; i++) {
      const [n, crop] = pics[i];
      const file = await photo(n, crop, fw * 2, fh * 2, { sat: 1, bri: 1.02 });
      const x = xs[i % 2], y = ys[Math.floor(i / 2)];
      frames.push(`<div class="fr" style="left:${x}px;top:${y}px;width:${fw}px;height:${fh}px"><img src="${url(file)}"></div>`);
    }
    return {
      W, H, src: orig('countdown'),
      erase: [{ x: 30, y: 300, w: 568, h: 1010, r: 70, p: .35, f: 40, blur: 12, grain: 6 }, { x: 10, y: 470, w: 60, h: 240, r: 40, p: .35, f: 16, blur: 8, grain: 6 }, { x: 558, y: 470, w: 62, h: 240, r: 40, p: .35, f: 16, blur: 8, grain: 6 }],
      css: `.fr{position:absolute;border-radius:${fw / 2}px ${fw / 2}px 10px 10px;padding:5px;background:linear-gradient(160deg,#f6dfa4,#b98a3a 40%,#f1d48f 60%,#9c7029);box-shadow:0 14px 26px rgba(10,0,2,.55)}
            .fr img{display:block;width:100%;height:100%;object-fit:cover;border-radius:${fw / 2 - 5}px ${fw / 2 - 5}px 6px 6px;box-shadow:inset 0 0 0 2px rgba(255,236,190,.5)}`,
      html: [
        text(40, 318, 548, 110, 'Our Moments', script(92) + goldText + 'padding-top:10px'),
        text(60, 426, 508, 40, 'CAPTURED WITH LOVE · CHANCHAL &amp; JP', caps(16.5, '#e3c697', .16)),
        ...frames,
        text(40, 1222, 548, 70, 'Some moments are worth a lifetime', "font:italic 500 30px/1.2 'Cormorant Garamond',serif;color:#edd4a8;"),
      ].join('\n'),
    };
  },

  /* ── NEW: FAMILIES, VENUE, ROUTE & RSVP — on the functions page's parchment arch ── */
  async family() {
    const W = 689, H = 1600;
    const lbl = (y, t) => text(80, y, 529, 30, t, caps(17, '#8c5a22', .2));
    const val = (y, t, px = 29) => text(70, y, 549, px * 1.4, t, `font:600 ${px}px/1.25 'Cormorant Garamond',serif;color:#4c0e15;`);
    const it = (y, t, px = 23) => text(70, y, 549, px * 1.4, t, `font:italic 500 ${px}px/1.25 'Cormorant Garamond',serif;color:#6a2a1c;`);
    const rule = (y) => `<div class="rule" style="top:${y}px"><i></i><b>❦</b><i></i></div>`;
    const btn = (x, y, w, label) => `<div class="btn" style="left:${x}px;top:${y}px;width:${w}px">${label}</div>`;
    return {
      W, H, src: orig('functions'),
      erase: [
        { x: 58, y: 206, w: 574, h: 1006, r: 78, mode: 'max', k: .45, f: 40, blur: 14, grain: 4 },
        { x: 30, y: 520, w: 140, h: 360, r: 60, mode: 'max', k: .45, f: 26, blur: 10, grain: 4 },   // flowers left of the plaques
        { x: 490, y: 780, w: 140, h: 110, r: 50, mode: 'max', k: .45, f: 20, blur: 8, grain: 4 },   // roses right of plaque 2
      ],
      css: `.rule{position:absolute;left:180px;width:329px;display:flex;align-items:center;gap:12px;color:#a8783a;font-size:18px}
            .rule i{flex:1;height:1px;background:linear-gradient(90deg,transparent,#b98a3a,transparent)}
            .btn{position:absolute;height:58px;border-radius:29px;display:flex;align-items:center;justify-content:center;
                 background:linear-gradient(180deg,#86202f,#5a0f19);box-shadow:0 0 0 2px #d8b46a,0 0 0 4px rgba(255,236,190,.6),0 8px 16px rgba(60,0,10,.35);
                 font:600 24px/1 'Cormorant Garamond',serif;color:#f6e4c4;letter-spacing:.02em}`,
      html: [
        patch(58, 200, 574, 1018, 'radial-gradient(ellipse 60% 55% at 50% 48%,rgb(246,226,200),rgb(232,200,164))', 46, 'mix-blend-mode:multiply;opacity:.8'),
        text(60, 214, 569, 112, 'Our Families', script(92, '#5c0f18') + 'padding-top:10px'),
        lbl(338, 'BRIDE’S PARENTS'), val(368, 'Savitha Sharma &amp; Ashok Sharma'),
        rule(418),
        lbl(440, 'GROOM’S PARENTS'), val(470, 'Krishna Sharma &amp; Manju Devi'),
        rule(522),
        lbl(546, 'THE WEDDING'), val(576, 'Wednesday, 2 December 2026'), it(616, 'Margashirsha Krishna Paksha Budhwar'),
        rule(660),
        lbl(684, 'VENUE'), val(714, 'VRW6+GVP, Bhagtawar Nagar, Rajasthan', 26), it(752, 'Near Bhagtawar Nagar, Rajasthan'),
        btn(194, 796, 300, 'View Venue on Map'),
        rule(876),
        lbl(900, 'ROUTE'), val(930, 'Teencholi, Rajasthan to Sanjay Nagar, Paparna', 25),
        rule(980),
        lbl(1000, 'RSVP'), val(1028, 'Krishna Kumar Sharma'), val(1072, '92465 85317', 30),
        btn(140, 1120, 190, 'Call'), btn(359, 1120, 190, 'WhatsApp'),
      ].join('\n'),
    };
  },

  /* ── LINK PREVIEW (WhatsApp card), 1200×630 ── */
  async og() {
    const W = 1200, H = 630, bg = path.join(TMP, 'og-bg.jpg');
    await sharp(orig('scratch')).extract({ left: 0, top: 560, width: 900, height: 472 }).resize(W, H).modulate({ brightness: .9 }).jpeg().toFile(bg);
    const pic = await photo(10, { left: 110, top: 120, width: 720, height: 904 }, 400, 502, { sat: 1, bri: 1.03 });
    return {
      W, H, src: bg, outPath: 'public/chanchal-jp-wedding/assets/og.jpg',
      css: `.shade{position:absolute;inset:0;background:radial-gradient(ellipse 70% 90% at 35% 50%,#651019,#3a050c 60%,#22020a)}
            .edge{position:absolute;inset:18px;border:1.5px solid rgba(214,176,108,.55);border-radius:6px}
            .fr{position:absolute;left:740px;top:64px;width:400px;height:502px;padding:6px;border-radius:200px 200px 12px 12px;background:linear-gradient(160deg,#f6dfa4,#b98a3a 40%,#f1d48f 60%,#9c7029);box-shadow:0 18px 30px rgba(0,0,0,.55)}
            .fr img{width:100%;height:100%;object-fit:cover;border-radius:194px 194px 8px 8px;display:block}`,
      html: [
        '<div class="shade"></div><div class="noise"></div><div class="edge"></div>',
        text(60, 64, 620, 60, '॥ श्री गणेशाय नमः ॥', deva(36, '#e9cf9f')),
        text(60, 140, 620, 40, 'THE WEDDING OF', caps(22, '#e3c697', .3)),
        text(30, 190, 680, 170, 'Chanchal <span style="font:italic 500 66px Cormorant Garamond,serif;padding:0 .1em">&amp;</span> JP', script(112) + goldText + 'flex-direction:row;white-space:nowrap;padding:24px 0 18px'),
        text(160, 372, 420, 20, '', 'border-top:1px solid rgba(225,190,130,.6)'),
        text(60, 400, 620, 44, 'WEDNESDAY · 2 DECEMBER 2026', caps(28, '#f0d9ae', .14)),
        text(60, 450, 620, 40, 'Bhagtawar Nagar, Rajasthan', "font:italic 500 30px 'Cormorant Garamond',serif;color:#e7cfa6;"),
        text(60, 520, 620, 40, 'invitivals.com', caps(15, '#bf9a66', .3)),
        `<div class="fr"><img src="${url(pic)}"></div>`,
      ].join('\n'),
    };
  },

  /* ── ENDING (was the Qur'an verse): saat phere, saat vachan ── */
  async quran() {
    const dk = { p: .35, blur: 7, grain: 6 };
    return {
      W: 995, H: 1581,
      erase: [
        { x: 270, y: 402, w: 514, h: 238, r: 40, f: 22, ...dk },   // Arabic verse
        { x: 300, y: 676, w: 444, h: 192, r: 30, f: 20, ...dk },   // translation
        { x: 352, y: 868, w: 344, h: 44, r: 20, f: 12, ...dk },    // citation
      ],
      html: [
        text(250, 430, 560, 180, 'सात फेरे<br>सात वचन', deva(70) + goldText + 'line-height:1.3'),
        text(270, 680, 510, 180, 'SEVEN SACRED ROUNDS,<br>SEVEN PROMISES,<br>ONE LIFETIME<br>TOGETHER.', caps(29, '#ecd3a8', .12) + 'line-height:1.52'),
        text(320, 870, 410, 40, 'CHANCHAL &amp; JP · 02 · 12 · 2026', caps(17, '#d6b588', .16)),
      ].join('\n'),
    };
  },
};

const only = process.argv.slice(2);
for (const [name, build] of Object.entries(SCREENS)) {
  if (only.length && !only.includes(name)) continue;
  const s = await build();
  await paintScreen({ src: s.src || orig(name), out: s.outPath || out(name), W: s.W, H: s.H, html: s.html, css: s.css, erase: s.erase, photos: s.photos });
  console.log('painted', name);
}
