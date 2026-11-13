/* Brown-theme wedding (public/brown-theme-wedding): builds the page art from the designer's
 * with-text references, which are the visual specification.
 *
 *   node tools/build-brown-theme-art.mjs
 *
 * The pack's clean backgrounds 1, 2, 4 and 8 are different compositions from their references and
 * its elements are separate renders, so the references are the only source that can match. For each page:
 *   plate    = the reference with the text erased (strokes only) and moving parts removed,
 *              using the registered clean background where one exists (pages 2, 3, 5, 7)
 *   overlays = text, ornaments, plaques, lanterns: the exact reference pixels with alpha, so that
 *              plate + overlays = the reference, and each can fade or sway on its own
 * All coordinates are reference pixels. Writes assets/ and js/art.js (positions in % of the page). */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { placeButterfly } from './lib/brown-theme-butterflies.mjs';

const SRC = 'invites/src/brown-theme-wedding-zip/brown theme wedding';
const SITE = 'public/brown-theme-wedding';
const OUT = path.join(SITE, 'assets');

/* ── tiny raster helpers ── */
const loadRgb = async (file, w, h) => {
  let s = sharp(file).removeAlpha();
  if (w) s = s.resize(w, h, { fit: 'fill' });
  const { data, info } = await s.raw().toBuffer({ resolveWithObject: true });
  return { w: info.width, h: info.height, d: new Uint8ClampedArray(data) };
};
const clone = (m) => ({ w: m.w, h: m.h, d: m.d.slice() });
const blurOf = async (m, sigma) => {
  const b = await sharp(Buffer.from(m.d), { raw: { width: m.w, height: m.h, channels: 3 } }).blur(sigma).raw().toBuffer();
  return { w: m.w, h: m.h, d: new Uint8ClampedArray(b) };
};
const lum = (m, i) => 0.3 * m.d[i * 3] + 0.59 * m.d[i * 3 + 1] + 0.11 * m.d[i * 3 + 2];
const rectPoly = ([x, y, w, h]) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const bbox = (pts, pad = 0) => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x = Math.min(...xs) - pad, y = Math.min(...ys) - pad;
  return [x, y, Math.max(...xs) - x + pad, Math.max(...ys) - y + pad];
};
async function polyMask(w, h, polys, feather = 0) {
  const shapes = polys.map((pts) => `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="#fff"/>`).join('');
  let s = sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#000"/>${shapes}</svg>`));
  if (feather) s = s.blur(feather);
  return new Uint8Array(await s.removeAlpha().extractChannel(0).raw().toBuffer());
}
function dilate(mask, w, h, r) {
  let cur = mask;
  for (let k = 0; k < r; k++) {
    const next = cur.slice();
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (!cur[i] && (cur[i - 1] || cur[i + 1] || cur[i - w] || cur[i + w])) next[i] = 1;
    }
    cur = next;
  }
  return cur;
}
/* fill masked pixels from their surroundings: push-pull pyramid, then Jacobi smoothing */
function fillMasked(m, mask, iterations = 80) {
  const { w, h, d } = m;
  for (let c = 0; c < 3; c++) {
    const levels = [{ w, h, v: new Float32Array(w * h), k: new Float32Array(w * h) }];
    for (let i = 0; i < w * h; i++) { levels[0].v[i] = d[i * 3 + c]; levels[0].k[i] = mask[i] ? 0 : 1; }
    while (levels[levels.length - 1].w > 4 && levels[levels.length - 1].h > 4) {
      const a = levels[levels.length - 1], nw = (a.w + 1) >> 1, nh = (a.h + 1) >> 1;
      const b = { w: nw, h: nh, v: new Float32Array(nw * nh), k: new Float32Array(nw * nh) };
      for (let y = 0; y < a.h; y++) for (let x = 0; x < a.w; x++) {
        const i = y * a.w + x, j = (y >> 1) * nw + (x >> 1);
        b.v[j] += a.v[i] * a.k[i]; b.k[j] += a.k[i];
      }
      for (let j = 0; j < nw * nh; j++) if (b.k[j] > 0) { b.v[j] /= b.k[j]; b.k[j] = Math.min(1, b.k[j]); }
      levels.push(b);
    }
    for (let l = levels.length - 2; l >= 0; l--) {
      const a = levels[l], b = levels[l + 1];
      for (let y = 0; y < a.h; y++) for (let x = 0; x < a.w; x++) {
        const i = y * a.w + x;
        if (a.k[i] > 0.99) continue;
        const fx = Math.min(b.w - 1.001, x / 2), fy = Math.min(b.h - 1.001, y / 2), x0 = fx | 0, y0 = fy | 0, tx = fx - x0, ty = fy - y0;
        const at = (xx, yy) => b.v[yy * b.w + xx];
        const up = at(x0, y0) * (1 - tx) * (1 - ty) + at(x0 + 1, y0) * tx * (1 - ty) + at(x0, y0 + 1) * (1 - tx) * ty + at(x0 + 1, y0 + 1) * tx * ty;
        a.v[i] = a.k[i] > 0 ? a.v[i] * a.k[i] + up * (1 - a.k[i]) : up;
      }
    }
    const v = levels[0].v;
    for (let it = 0; it < iterations; it++) for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (mask[i]) v[i] = (v[i - 1] + v[i + 1] + v[i - w] + v[i + w]) / 4;
    }
    for (let i = 0; i < w * h; i++) if (mask[i]) d[i * 3 + c] = v[i];
  }
}
/* best integer shift of a clean background onto its reference, measured on sampled pixels */
function bestShift(ref, bg, range = 12) {
  let best = { c: 1e9, dx: 0, dy: 0 };
  for (let dy = -range; dy <= range; dy++) for (let dx = -range; dx <= range; dx++) {
    let c = 0, n = 0;
    for (let y = 40; y < ref.h - 40; y += 11) for (let x = 40; x < ref.w - 40; x += 11) {
      const i = (y * ref.w + x) * 3, j = ((y + dy) * ref.w + x + dx) * 3;
      c += Math.abs(ref.d[i + 1] - bg.d[j + 1]); n++;
    }
    if ((c /= n) < best.c) best = { c, dx, dy };
  }
  return best;
}
const shifted = (bg, dx, dy) => {
  const o = clone(bg);
  for (let y = 0; y < bg.h; y++) for (let x = 0; x < bg.w; x++) {
    const sx = Math.min(bg.w - 1, Math.max(0, x + dx)), sy = Math.min(bg.h - 1, Math.max(0, y + dy));
    for (let c = 0; c < 3; c++) o.d[(y * bg.w + x) * 3 + c] = bg.d[(sy * bg.w + sx) * 3 + c];
  }
  return o;
};
const blendIn = (m, src, alpha) => {
  for (let i = 0; i < m.w * m.h; i++) {
    const a = alpha[i] / 255;
    if (a > 0) for (let c = 0; c < 3; c++) m.d[i * 3 + c] = m.d[i * 3 + c] * (1 - a) + src.d[i * 3 + c] * a;
  }
};

/* ── overlays: over(plate) reproduces source exactly ── */
async function writeSprite(id, w, h, rect, rgba, manifest, quality = 90) {
  const [x, y, rw, rh] = rect;
  await sharp(rgba, { raw: { width: rw, height: rh, channels: 4 } }).webp({ quality, alphaQuality: 95, effort: 5 }).toFile(path.join(OUT, `${id}.webp`));
  manifest[id] = { x: +(x / w * 100).toFixed(3), y: +(y / h * 100).toFixed(3), w: +(rw / w * 100).toFixed(3), h: +(rh / h * 100).toFixed(3) };
}
const clampRect = ([x, y, w, h], W, H) => { const a = Math.max(0, Math.round(x)), b = Math.max(0, Math.round(y)); return [a, b, Math.min(W - a, Math.round(w + x - a)), Math.min(H - b, Math.round(h + y - b))]; };
async function diffSprite(id, source, plate, rect, manifest, { t0 = 5, t1 = 20, solidInside = null } = {}) {
  const { w: W, h: H } = source; const r = clampRect(rect, W, H); const [x, y, rw, rh] = r;
  const out = Buffer.alloc(rw * rh * 4);
  for (let py = 0; py < rh; py++) for (let px = 0; px < rw; px++) {
    const i = ((y + py) * W + x + px) * 3, o = (py * rw + px) * 4;
    const dr = source.d[i] - plate.d[i], dg = source.d[i + 1] - plate.d[i + 1], db = source.d[i + 2] - plate.d[i + 2];
    const e = Math.max(Math.abs(dr), Math.abs(dg), Math.abs(db));
    let a = Math.max(0, Math.min(1, (e - t0) / (t1 - t0)));
    if (solidInside && solidInside[(y + py) * W + x + px]) a = 1;
    if (a <= 0) { out[o] = source.d[i]; out[o + 1] = source.d[i + 1]; out[o + 2] = source.d[i + 2]; out[o + 3] = 0; continue; }
    out[o] = Math.max(0, Math.min(255, plate.d[i] + dr / a));
    out[o + 1] = Math.max(0, Math.min(255, plate.d[i + 1] + dg / a));
    out[o + 2] = Math.max(0, Math.min(255, plate.d[i + 2] + db / a));
    out[o + 3] = Math.round(a * 255);
  }
  await writeSprite(id, W, H, r, out, manifest);
}
async function maskSprite(id, source, polys, feather, manifest) {
  const { w: W, h: H } = source;
  const mask = await polyMask(W, H, polys, feather);
  const r = clampRect(bbox(polys.flat(), feather * 3), W, H); const [x, y, rw, rh] = r;
  const out = Buffer.alloc(rw * rh * 4);
  for (let py = 0; py < rh; py++) for (let px = 0; px < rw; px++) {
    const i = (y + py) * W + x + px, o = (py * rw + px) * 4;
    out[o] = source.d[i * 3]; out[o + 1] = source.d[i * 3 + 1]; out[o + 2] = source.d[i * 3 + 2]; out[o + 3] = mask[i];
  }
  await writeSprite(id, W, H, r, out, manifest, 86);
}
function textMask(ref, low, rects) {
  /* stroke pixels: darker than their surroundings (or any difference, for glowing gold lettering) */
  const { w, h } = ref; let all = new Uint8Array(w * h);
  for (const { rect, th = 11, abs = false, grow = 3, all: whole = false } of rects) {
    let m = new Uint8Array(w * h); const [x, y, rw, rh] = clampRect(rect, w, h);
    for (let py = y; py < y + rh; py++) for (let px = x; px < x + rw; px++) {
      const i = py * w + px;
      if (whole) { m[i] = 1; continue; }
      const dl = lum(low, i) - lum(ref, i);
      if (dl > th || (abs && -dl > th)) m[i] = 1;
    }
    m = dilate(m, w, h, grow);
    for (let i = 0; i < w * h; i++) if (m[i]) all[i] = 1;
  }
  return all;
}

/* ── the eight pages, in reference pixels ── */
const PAGES = {
  1: {
    text: [
      { id: 'ganesha', rect: [425, 255, 140, 190], grow: 4 },
      { id: 'blessing1', rect: [355, 440, 285, 38] },
      { id: 'blessing2', rect: [380, 478, 240, 42] },
      { id: 'rule1', rect: [378, 522, 240, 34] },
      { id: 'request', rect: [338, 566, 325, 118] },
      { id: 'groom', rect: [325, 692, 320, 132], abs: true, th: 9, grow: 7 },
      { id: 'and', rect: [338, 812, 322, 80], grow: 4 },
      { id: 'bride', rect: [315, 892, 372, 112], abs: true, th: 9, grow: 7 },
      { id: 'rule2', rect: [378, 1010, 240, 46] },
    ],
    sway: {
      'flowers-a': { polys: [[[0, 30], [120, 0], [300, 60], [450, 130], [440, 170], [365, 215], [362, 350], [300, 420], [302, 560], [215, 680], [130, 640], [0, 640]]], feather: 12 },
      'flowers-b': { polys: [[[0, 790], [150, 735], [285, 755], [322, 945], [265, 1060], [425, 1200], [352, 1285], [265, 1320], [330, 1515], [240, 1585], [90, 1565], [0, 1480]]], feather: 12 },
    },
    butterflies: { butterfly: { rect: [0, 440, 158, 165], inpaint: true } },
  },
  2: {
    bg: 2, // only for its marble grain and the slot's lower lip, which the scroll hides in the reference
    text: [
      { id: 'title', rect: [330, 488, 290, 130] },
      { id: 'rule', rect: [335, 620, 275, 32] },
      { id: 'click', rect: [355, 652, 240, 42] },
      { id: 'date', rect: [350, 982, 250, 178], grow: 3 },
      { id: 'daterule', rect: [388, 1180, 170, 36], grow: 3 },
      { id: 'time', rect: [398, 1230, 150, 42], grow: 3 },
    ],
    wall: {
      poly: [[292, 830], [650, 830], [712, 900], [742, 1000], [742, 1436], [214, 1436], [226, 1040], [270, 900]],
      from: [150, 800, 585, 580], to: [205, 830, 545, 610], samples: [[208, 1060, 45, 240], [700, 905, 40, 170]],
      keepOut: [[296, 826], [646, 826], [650, 900], [668, 1306], [688, 1320], [690, 1388], [250, 1388], [250, 1320], [286, 1306], [302, 900]],
    },
    slotLip: { rect: [226, 806, 484, 96], search: { sMin: 0.74, sMax: 0.84, cx: 467 } },
    paper: {
      body: [[308, 836], [632, 836], [632, 888], [650, 1312], [298, 1312], [312, 888]],
      roller: [[290, 1312], [650, 1312], [658, 1322], [675, 1326], [675, 1368], [658, 1373], [290, 1375], [263, 1369], [263, 1330], [290, 1320]],
    },
    sway: {
      'flowers-a': { polys: [[[0, 120], [110, 118], [240, 150], [452, 170], [442, 212], [352, 262], [342, 360], [352, 480], [292, 540], [282, 660], [205, 700], [212, 870], [140, 1030], [60, 1000], [0, 800]]], feather: 12 },
      'flowers-b': { polys: [[[692, 225], [800, 225], [932, 300], [937, 540], [902, 765], [868, 765], [792, 572], [742, 420], [692, 282]]], feather: 12 },
      'flowers-c': { polys: [[[0, 1020], [60, 1028], [165, 1130], [255, 1322], [228, 1485], [150, 1462], [0, 1402]]], feather: 12 },
      'flowers-d': { polys: [[[941, 1000], [850, 1005], [808, 1010], [800, 1098], [668, 1098], [662, 1160], [700, 1320], [702, 1400], [540, 1490], [800, 1575], [941, 1505]]], feather: 12 },
    },
    butterflies: { 'butterfly-a': { rect: [648, 592, 142, 162], inpaint: true }, 'butterfly-b': { rect: [142, 874, 150, 160], inpaint: true } },
  },
  3: {
    bg: 3,
    paste: [[0, 150, 345, 480], [0, 560, 300, 540], [0, 1100, 175, 340], [795, 370, 147, 450], [790, 870, 152, 560], [270, 775, 385, 125], [265, 1280, 395, 125], [635, 705, 80, 95], [395, 1195, 85, 105]],
    over: {
      'flowers-a': [0, 155, 335, 470], 'flowers-b': [0, 565, 290, 530], 'flowers-c': [0, 1105, 165, 330],
      'flowers-d': [800, 375, 142, 440], 'flowers-e': [795, 875, 147, 550],
      plaque1: [280, 785, 365, 105], plaque2: [275, 1290, 375, 105], pin1: [642, 712, 66, 86], pin2: [402, 1200, 72, 94],
    },
  },
  4: {
    text: [
      { id: 'title', rect: [340, 525, 250, 98] },
      { id: 'rule', rect: [385, 620, 175, 30] },
      { id: 'tagline', rect: [390, 650, 165, 58], grow: 2 },
      { id: 'day', rect: [375, 762, 52, 58], grow: 2 },
      { id: 'month', rect: [455, 764, 135, 54], grow: 2 },
      { id: 'time', rect: [408, 845, 136, 32], grow: 2 },
      { id: 'rule2', rect: [372, 882, 200, 18], grow: 2 },
      { id: 'venue', rect: [345, 905, 262, 36], grow: 2 },
      { id: 'address', rect: [375, 943, 212, 46], grow: 2 },
    ],
    sway: {
      save: { polys: [rectPoly([165, 1322, 296, 86])], feather: 3 },
      maps: { polys: [rectPoly([483, 1322, 305, 86])], feather: 3 },
    },
  },
  5: {
    bg: 5,
    text: [
      { id: 'title', rect: [240, 305, 465, 195], grow: 3 },
      { id: 'heart', rect: [285, 492, 380, 34] },
      { id: 'lines', rect: [315, 548, 325, 60], grow: 2 },
      { id: 'flourish', rect: [320, 622, 320, 44] },
      { id: 'date', rect: [405, 720, 235, 50], grow: 2 },
      { id: 'year', rect: [470, 768, 80, 32], grow: 2 },
      { id: 'time', rect: [450, 820, 130, 36], grow: 2 },
    ],
    paste: [[28, 0, 112, 435], [805, 75, 95, 300], [805, 375, 95, 270], [100, 80, 90, 90], [728, 432, 92, 100], [702, 690, 82, 90]],
    over: {
      'lantern-a': [34, 0, 100, 430], 'lantern-b': [810, 80, 85, 290], 'lantern-c': [810, 380, 85, 260],
    },
    // the clean background already lies under these (paste), so no hole to fill
    butterflies: { 'butterfly-a': { rect: [105, 85, 80, 80] }, 'butterfly-b': { rect: [733, 437, 82, 90] }, 'butterfly-c': { rect: [707, 695, 72, 80] } },
    sway: {
      save: { polys: [rectPoly([118, 902, 354, 90])], feather: 3 },
      maps: { polys: [rectPoly([476, 902, 345, 90])], feather: 3 },
    },
  },
  6: {
    text: [
      { id: 'our', rect: [420, 150, 112, 58] },
      { id: 'title', rect: [245, 205, 482, 150], grow: 3 },
      { id: 'rule', rect: [312, 338, 350, 38] },
    ],
    frame: {
      outer: [285, 440, 375, 650], window: [293, 448, 359, 632],
      flowers: [
        [[325, 393], [362, 398], [450, 408], [472, 440], [538, 460], [522, 482], [472, 522], [422, 562], [372, 602], [362, 642], [332, 744], [298, 744], [283, 642], [273, 562], [260, 530], [283, 470], [318, 440]],
        [[505, 1118], [530, 1066], [518, 1040], [590, 958], [632, 898], [668, 930], [670, 1092], [642, 1128], [570, 1152], [543, 1152]],
        [[575, 448], [655, 448], [655, 568], [634, 562], [624, 482]],
        [[293, 972], [306, 972], [322, 1040], [372, 1064], [376, 1084], [293, 1084]],
      ],
    },
    // the painted side panels come off the plate so the photos can turn as real cards; the blurred venue fills in
    clear: [[[88, 508], [251, 464], [251, 1046], [88, 1014]], [[0, 584], [50, 554], [50, 1006], [0, 986]], [[694, 466], [856, 510], [856, 1016], [694, 1048]], [[888, 554], [941, 584], [941, 986], [888, 1006]]],
    photos: {
      'photo-2': [[92, 512], [247, 470], [247, 1040], [92, 1008]],
      'photo-3': [[698, 472], [852, 516], [852, 1010], [698, 1042]],
    },
  },
  7: {
    bg: 7,
    paste: [[190, 430, 575, 760]],
    over: {
      rule1: [305, 468, 335, 86], kindly: [368, 572, 210, 78], rsvp: [332, 656, 282, 100], rule2: [305, 762, 335, 62],
      lines: [342, 828, 262, 88], button: [198, 942, 552, 208],
    },
  },
  8: {
    text: [
      { id: 'love', rect: [315, 650, 320, 66] },
      { id: 'title', rect: [222, 722, 515, 186], grow: 3 },
      { id: 'rule', rect: [295, 905, 355, 44] },
      { id: 'lines', rect: [230, 970, 492, 72], grow: 2 },
      { id: 'heart', rect: [338, 1074, 272, 66] },
    ],
  },
};

/* ── build ── */
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (/.(webp|jpg)$/.test(f)) fs.rmSync(path.join(OUT, f)); // the film and music may be open in a preview
const manifest = {}, report = [];

for (const [n, spec] of Object.entries(PAGES)) {
  const ref = await loadRgb(path.join(SRC, 'with text temp', `${n}.png`));
  const { w: W, h: H } = ref;
  const low = await blurOf(ref, 16);
  const art = {};

  /* stage 1: text out of the reference */
  const noText = clone(ref);
  if (spec.text) {
    const mask = textMask(ref, low, spec.text);
    fillMasked(noText, mask);
    for (const t of spec.text) await diffSprite(`p${n}-${t.id}`, ref, noText, t.rect, art, { t0: 4, t1: 18 });
  }

  /* stage 2: the plate */
  const plate = clone(noText);
  let bg = null;
  if (spec.bg) {
    bg = await loadRgb(path.join(SRC, `${spec.bg}.png`), W, H);
    if (spec.paste) {
      const s = bestShift(ref, bg); report.push(`page ${n}: clean background shift ${s.dx},${s.dy}, mean difference ${s.c.toFixed(1)}`);
      bg = shifted(bg, s.dx, s.dy);
      /* only the objects are taken out: outside them the plate stays the reference itself, so there is no seam.
         Under them the clean background shows, corrected by the offset interpolated from around each object */
      const inRects = await polyMask(W, H, spec.paste.map(rectPoly));
      const diffMap = { w: W, h: H, d: new Uint8ClampedArray(W * H * 3) };
      for (let i = 0; i < W * H; i++) {
        const e = Math.max(Math.abs(noText.d[i * 3] - bg.d[i * 3]), Math.abs(noText.d[i * 3 + 1] - bg.d[i * 3 + 1]), Math.abs(noText.d[i * 3 + 2] - bg.d[i * 3 + 2]));
        diffMap.d[i * 3] = diffMap.d[i * 3 + 1] = diffMap.d[i * 3 + 2] = e;
      }
      const soft = await blurOf(diffMap, 5);
      let objects = new Uint8Array(W * H);
      for (let i = 0; i < W * H; i++) if (inRects[i] > 127 && (soft.d[i * 3] > 15 || diffMap.d[i * 3] > 36)) objects[i] = 1;
      objects = dilate(objects, W, H, 5);
      for (let i = 0; i < W * H; i++) if (inRects[i] <= 127) objects[i] = 0;
      /* offset = reference minus background, stored around mid-grey and filled across the objects */
      const offset = { w: W, h: H, d: new Uint8ClampedArray(W * H * 3) };
      for (let i = 0; i < W * H * 3; i++) offset.d[i] = (noText.d[i] - bg.d[i]) / 2 + 128;
      fillMasked(offset, objects, 60);
      for (let i = 0; i < W * H; i++) if (objects[i]) for (let c = 0; c < 3; c++) plate.d[i * 3 + c] = bg.d[i * 3 + c] + (offset.d[i * 3 + c] - 128) * 2;
    }
  }
  if (spec.wall) {
    /* the scroll comes off the wall: real marble from the clean background, tone-matched, with flowers and butterfly kept */
    const raw = await sharp(path.join(SRC, `${spec.bg}.png`)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const { poly, from: [fx, fy, fw, fh], to: [tx, ty, tw, th], samples, keepOut } = spec.wall;
    const piece = await sharp(raw.data, { raw: raw.info }).extract({ left: fx, top: fy, width: fw, height: fh }).resize(tw, th, { fit: 'fill' }).raw().toBuffer();
    const gain = [0, 0, 0]; let cnt = 0;
    const pieceAt = (x, y, c) => piece[((y - ty) * tw + (x - tx)) * 3 + c];
    for (const [sx, sy, sw, sh] of samples) for (let y = sy; y < sy + sh; y += 2) for (let x = sx; x < sx + sw; x += 2) {
      for (let c = 0; c < 3; c++) gain[c] += noText.d[(y * W + x) * 3 + c] / Math.max(1, pieceAt(x, y, c)); cnt++;
    }
    for (let c = 0; c < 3; c++) gain[c] /= cnt;
    report.push(`page ${n}: wall tone gain ${gain.map((g) => g.toFixed(3)).join(' ')}`);
    const wall = clone(plate);
    for (let y = ty; y < ty + th; y++) for (let x = tx; x < tx + tw; x++) for (let c = 0; c < 3; c++) wall.d[(y * W + x) * 3 + c] = pieceAt(x, y, c) * gain[c];
    const alpha = await polyMask(W, H, [poly], 16);
    const scrollCore = (await polyMask(W, H, [keepOut])).map((v) => (v > 127 ? 1 : 0));
    const scroll = dilate(scrollCore, W, H, 16).map((v) => (v ? 255 : 0)); // the scroll and the shadow it throws
    let foreign = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) {
      if (scroll[i] > 127 || alpha[i] === 0) continue;
      const r = noText.d[i * 3], b = noText.d[i * 3 + 2];
      if (r - b > 118 || lum(noText, i) < 128) foreign[i] = 1;
    }
    foreign = dilate(foreign, W, H, 3);
    for (let i = 0; i < W * H; i++) if (foreign[i]) alpha[i] = 0;
    blendIn(plate, wall, alpha);
  }
  if (spec.slotLip) {
    /* the slot's lower lip, hidden by the scroll in the reference: the clean background's slot scaled to fit, slot pixels only */
    const raw = await sharp(path.join(SRC, `${spec.bg}.png`)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const [rx, ry, rw, rh] = spec.slotLip.rect, { sMin, sMax } = spec.slotLip.search;
    let best = { c: 1e9 };
    for (let s = sMin; s <= sMax; s += 0.005) {
      const sw = Math.round(raw.info.width * s), sh = Math.round(raw.info.height * s);
      const b = await sharp(raw.data, { raw: raw.info }).resize(sw, sh).raw().toBuffer();
      for (let ty = -40; ty <= 40; ty++) for (let tx = -40; tx <= 40; tx++) {
        const ox = Math.round(467 - sw / 2) + tx, oy = Math.round(778 - sh * 0.3827) + ty; // the knob is at 38.27 % of the clean background's height
        let c = 0, k = 0;
        for (let y = 708; y < 820; y += 3) for (let x = rx; x < rx + rw; x += 3) {
          const px = x - ox, py = y - oy; if (px < 0 || py < 0 || px >= sw || py >= sh) continue;
          c += Math.abs(ref.d[(y * W + x) * 3 + 1] - b[(py * sw + px) * 3 + 1]); k++;
        }
        if (k > 500 && (c /= k) < best.c) best = { c, s, ox, oy, sw, sh, b };
      }
    }
    report.push(`page ${n}: slot from clean background at scale ${best.s.toFixed(3)}, offset ${best.ox},${best.oy}, difference ${best.c.toFixed(1)}`);
    const lip = clone(ref), alpha = new Uint8Array(W * H);
    for (let y = ry; y < ry + rh; y++) for (let x = rx; x < rx + rw; x++) {
      const px = x - best.ox, py = y - best.oy; if (px < 0 || py < 0 || px >= best.sw || py >= best.sh) continue;
      const j = (py * best.sw + px) * 3, i = y * W + x;
      for (let c = 0; c < 3; c++) lip.d[i * 3 + c] = best.b[j + c];
      const l = 0.3 * best.b[j] + 0.59 * best.b[j + 1] + 0.11 * best.b[j + 2];
      const wallLum = lum(plate, i); // slot metal is darker and more saturated than the marble
      const k = Math.max((wallLum - l - 14) / 22, (best.b[j] - best.b[j + 2] - 100) / 30);
      const top = Math.min(1, (y - ry) / 6), bottom = Math.min(1, (ry + rh - y) / 4);
      alpha[i] = Math.round(255 * Math.max(0, Math.min(1, k)) * top * bottom);
    }
    blendIn(plate, lip, alpha);
  }

  /* the scroll: paper with its own edge, split so the roller can travel */
  if (spec.paper) {
    const inner = await polyMask(W, H, [spec.paper.body, spec.paper.roller]);
    /* outside = reachable from the polygon's border through pixels that look like the wall */
    const outside = new Uint8Array(W * H), stack = [];
    for (let i = 0; i < W * H; i++) {
      if (inner[i] < 128) { outside[i] = 1; continue; }
    }
    const looksWall = (i) => Math.max(Math.abs(noText.d[i * 3] - plate.d[i * 3]), Math.abs(noText.d[i * 3 + 1] - plate.d[i * 3 + 1]), Math.abs(noText.d[i * 3 + 2] - plate.d[i * 3 + 2])) < 13;
    for (let i = W; i < W * H - W; i++) if (!outside[i] && (outside[i - 1] || outside[i + 1] || outside[i - W] || outside[i + W]) && looksWall(i)) stack.push(i);
    while (stack.length) {
      const i = stack.pop(); if (outside[i]) continue; outside[i] = 1;
      for (const j of [i - 1, i + 1, i - W, i + W]) if (j >= 0 && j < W * H && !outside[j] && looksWall(j)) stack.push(j);
    }
    const solid = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) solid[i] = outside[i] ? 0 : 1;
    const cleared = clone(plate); // nothing outside the polygons may enter the sprite
    for (let i = 0; i < W * H; i++) if (inner[i] < 128) for (let c = 0; c < 3; c++) cleared.d[i * 3 + c] = plate.d[i * 3 + c];
    const src = clone(noText); for (let i = 0; i < W * H; i++) if (inner[i] < 128) for (let c = 0; c < 3; c++) src.d[i * 3 + c] = plate.d[i * 3 + c];
    await diffSprite(`p${n}-paper`, src, cleared, bbox(spec.paper.body), art, { t0: 6, t1: 12, solidInside: solid });
    await diffSprite(`p${n}-roller`, src, cleared, bbox(spec.paper.roller), art, { t0: 6, t1: 12, solidInside: solid });
    art[`p${n}-slot`] = { x: 228 / W * 100, y: 705 / H * 100, w: 479 / W * 100, h: 190 / H * 100 };
    art[`p${n}-knob`] = { x: 432 / W * 100, y: 738 / H * 100, w: 76 / W * 100, h: 80 / H * 100 };
  }

  /* overlays cut against the clean background */
  if (spec.over) for (const [id, rect] of Object.entries(spec.over)) await diffSprite(`p${n}-${id}`, noText, plate, rect, art, { t0: 9, t1: 26 });
  /* overlays that lie on identical pixels and only move a little */
  if (spec.sway) for (const [id, s] of Object.entries(spec.sway)) await maskSprite(`p${n}-${id}`, noText, s.polys, s.feather, art);
  /* butterflies: the pack's own PNGs in the reference's pose, with real alpha, and the plate filled under them */
  if (spec.butterflies) for (const [id, b] of Object.entries(spec.butterflies)) await placeButterfly({ ref: noText, plate, rect: b.rect, id: `p${n}-${id}`, out: OUT, manifest: art, inpaint: !!b.inpaint, fillMasked, dilate, report });

  /* page 6: frame on top, photos between it and the plate */
  if (spec.frame) {
    const { outer: [ox, oy, ow, oh], window: [wx, wy, ww, wh], flowers } = spec.frame;
    const band = [[[ox, oy], [ox + ow, oy], [ox + ow, oy + oh], [ox, oy + oh], [ox, oy], [wx, wy], [wx, wy + wh], [wx + ww, wy + wh], [wx + ww, wy], [wx, wy]]];
    await maskSprite('p6-frame', noText, [...flowers, band[0]], 1.2, art);
    art['p6-window'] = { x: wx / W * 100, y: wy / H * 100, w: ww / W * 100, h: wh / H * 100 };
    art['p6-swipe'] = { x: 0, y: oy / H * 100, w: 100, h: oh / H * 100 };
    const clean = clone(noText);
    const fm = (await polyMask(W, H, flowers)).map((v) => (v > 127 ? 1 : 0));
    fillMasked(clean, dilate(fm, W, H, 4), 120);
    await sharp(Buffer.from(clean.d), { raw: { width: W, height: H, channels: 3 } }).extract({ left: wx, top: wy, width: ww, height: wh }).webp({ quality: 92 }).toFile(path.join(OUT, 'photo-1.webp'));
    for (const [id, q] of Object.entries(spec.photos)) {
      const out = Buffer.alloc(ww * wh * 3);
      for (let v = 0; v < wh; v++) for (let u = 0; u < ww; u++) {
        const a = u / (ww - 1), b = v / (wh - 1);
        const sx = (1 - a) * (1 - b) * q[0][0] + a * (1 - b) * q[1][0] + a * b * q[2][0] + (1 - a) * b * q[3][0];
        const sy = (1 - a) * (1 - b) * q[0][1] + a * (1 - b) * q[1][1] + a * b * q[2][1] + (1 - a) * b * q[3][1];
        const x0 = Math.floor(sx), y0 = Math.floor(sy), tx = sx - x0, ty = sy - y0;
        for (let c = 0; c < 3; c++) {
          const g = (xx, yy) => ref.d[(yy * W + xx) * 3 + c];
          out[(v * ww + u) * 3 + c] = g(x0, y0) * (1 - tx) * (1 - ty) + g(x0 + 1, y0) * tx * (1 - ty) + g(x0, y0 + 1) * (1 - tx) * ty + g(x0 + 1, y0 + 1) * tx * ty;
        }
      }
      await sharp(out, { raw: { width: ww, height: wh, channels: 3 } }).webp({ quality: 90 }).toFile(path.join(OUT, `${id}.webp`));
    }
  }

  if (spec.clear) {
    const m = (await polyMask(W, H, spec.clear)).map((v) => (v > 127 ? 1 : 0));
    fillMasked(plate, dilate(m, W, H, 3), 160);
  }

  /* the proof: plate plus every overlay against the reference */
  await sharp(Buffer.from(plate.d), { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 92, effort: 5 }).toFile(path.join(OUT, `plate${n}.webp`));
  const comps = [];
  for (const [id, a] of Object.entries(art)) {
    const file = path.join(OUT, `${id}.webp`);
    if (fs.existsSync(file)) comps.push({ input: file, left: Math.round(a.x / 100 * W), top: Math.round(a.y / 100 * H) });
  }
  const composed = await sharp(path.join(OUT, `plate${n}.webp`)).composite(comps).removeAlpha().raw().toBuffer();
  let sum = 0, big = 0;
  for (let i = 0; i < W * H; i++) {
    const e = (Math.abs(composed[i * 3] - ref.d[i * 3]) + Math.abs(composed[i * 3 + 1] - ref.d[i * 3 + 1]) + Math.abs(composed[i * 3 + 2] - ref.d[i * 3 + 2])) / 3;
    sum += e; if (e > 16) big++;
  }
  report.push(`page ${n}: composed vs reference: mean difference ${(sum / (W * H)).toFixed(2)} of 255, ${(big / (W * H) * 100).toFixed(2)} % of pixels differ visibly`);
  if (process.env.BROWN_DEBUG) await sharp(composed, { raw: { width: W, height: H, channels: 3 } }).jpeg({ quality: 85 }).toFile(path.join(process.env.BROWN_DEBUG, `composed${n}.jpg`));
  Object.assign(manifest, art);
  manifest[`plate${n}`] = { px: [W, H] };
}

/* the opening, film and music, untouched */
await sharp(path.join(SRC, 'opening page.png')).webp({ quality: 92 }).toFile(path.join(OUT, 'opening.webp'));
await sharp(path.join(SRC, 'with text temp/1.png')).resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 85 }).toFile(path.join(OUT, 'og.jpg'));
for (const [from, to] of [['AI video.mp4', 'opening.mp4'], ['Ranjha – Flute Cover Instrumental Divyansh Shrivatava Shershaah Sidharth–Kiara B Praak.mp3', 'music.mp3']]) {
  const a = path.join(SRC, from), b = path.join(OUT, to);
  if (!fs.existsSync(b) || fs.statSync(a).size !== fs.statSync(b).size) fs.copyFileSync(a, b);
}
fs.writeFileSync(path.join(SITE, 'js/art.js'), `/* generated by tools/build-brown-theme-art.mjs: every overlay's box in % of its page */\nexport const art = ${JSON.stringify(manifest)};\n`);
console.log(report.join('\n'));
