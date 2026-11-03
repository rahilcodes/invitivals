/* Modern wedding (public/modern-wedding): builds the page art from the designer's pack.
 *
 *   node tools/build-modern-wedding-art.mjs            (MW_DEBUG=<dir> also writes composed pages)
 *
 * The with-text references are the visual specification. They are the same compositions as the pack's
 * clean templates (checked with tools/modern-wedding-measure.mjs: only lettering, cards and ornaments
 * differ), but the two are separate AI renders whose flowers and satin do not match pixel for pixel, so
 * compositing the clean template with cut-outs leaves seams. Therefore, for each page:
 *   plate    = the reference with the parts that move or may change ERASED (inpainted from the panel)
 *   overlays = those parts, as the exact reference pixels with alpha: over(plate) = reference
 * Page 4 is landscape and has no clean plaque at all: its plate is the reference with the four countdown
 * figures erased; the live figures are HTML. The pack's elements used as they are: the golden heart (over
 * the 15th), the Date Revealed pill, the satin joining band. The two RSVP tiles are the reference's own
 * pixels (the pack's tile PNGs are the same artwork; cutting them from the reference keeps them exactly
 * where the designer put them).
 * All coordinates are reference pixels (941 wide for the portrait pages, 1670 for page 4).
 * Writes assets/ and js/art.js (boxes in % of the page). */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'invites/src/modern-wedding';
const SITE = 'public/modern-wedding';
const OUT = path.join(SITE, 'assets');
const DEBUG = process.env.MW_DEBUG;
fs.mkdirSync(OUT, { recursive: true });
if (DEBUG) fs.mkdirSync(DEBUG, { recursive: true });

/* ── raster helpers ── */
const loadRgb = async (file, w, h) => {
  let s = sharp(file).removeAlpha();
  if (w) s = s.resize(w, h, { fit: 'fill' });
  const { data, info } = await s.raw().toBuffer({ resolveWithObject: true });
  return { w: info.width, h: info.height, d: new Uint8ClampedArray(data) };
};
const clone = (m) => ({ w: m.w, h: m.h, d: m.d.slice() });
const lumAt = (m, p) => 0.3 * m.d[p * 3] + 0.59 * m.d[p * 3 + 1] + 0.11 * m.d[p * 3 + 2];
async function polyMask(w, h, polys, feather = 0) {
  const shapes = polys.map((pts) => `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="#fff"/>`).join('');
  let s = sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#000"/>${shapes}</svg>`));
  if (feather) s = s.blur(feather);
  return new Uint8Array(await s.removeAlpha().extractChannel(0).raw().toBuffer());
}
const rectPoly = ([x, y, w, h]) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
function morph(mask, w, h, r, grow) {
  let cur = mask;
  for (let k = 0; k < r; k++) {
    const next = cur.slice();
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (grow) { if (!cur[i] && (cur[i - 1] || cur[i + 1] || cur[i - w] || cur[i + w])) next[i] = 1; }
      else if (cur[i] && !(cur[i - 1] && cur[i + 1] && cur[i - w] && cur[i + w])) next[i] = 0;
    }
    cur = next;
  }
  return cur;
}
const dilate = (m, w, h, r) => morph(m, w, h, r, true);
const erode = (m, w, h, r) => morph(m, w, h, r, false);
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
const clampRect = ([x, y, w, h], W, H) => { const a = Math.max(0, Math.round(x)), b = Math.max(0, Math.round(y)); return [a, b, Math.min(W - a, Math.round(w + x - a)), Math.min(H - b, Math.round(h + y - b))]; };
const bboxOf = (mask, W, H) => { let x0 = W, y0 = H, x1 = -1, y1 = -1; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (mask[y * W + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } return x1 < 0 ? null : [x0, y0, x1 - x0 + 1, y1 - y0 + 1]; };

const art = {};
const pct = (v, total) => +(v / total * 100).toFixed(3);
const setBox = (id, [x, y, w, h], W, H) => { art[id] = { x: pct(x, W), y: pct(y, H), w: pct(w, W), h: pct(h, H) }; };
const writeWebp = (rgba, w, h, file) => sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 92, alphaQuality: 96, effort: 5 }).toFile(file);

/* ── a page: the reference is the plate; pieces are cut out of it ── */
async function page(n, refName, build) {
  const file = path.join(SRC, 'with text temp', refName);
  const meta = await sharp(file).metadata();
  const W = meta.width, H = meta.height;
  const ref = await loadRgb(file);
  const bg = await loadRgb(path.join(SRC, `${n}.png`), W, H); // the clean template, registered with the reference
  const plate = clone(ref);
  const claimed = new Uint8Array(W * H);
  const pieces = []; // { id, mask } — masks are disjoint
  const inRegion = async (region) => polyMask(W, H, (Array.isArray(region[0]) ? region : [region]).map(rectPoly));

  const ctx = {
    W, H, ref, plate,
    /* dark lettering and ornaments on a light panel: the strokes are what is darker than lum
       (light: true for cream or gold lettering on the burgundy plaques, with its glow) */
    async text(id, region, { lum = 172, light = false, grow = 1, halo = 0 } = {}) {
      const r = await inRegion(region); const m = new Uint8Array(W * H);
      for (let p = 0; p < W * H; p++) if (r[p] > 127 && !claimed[p] && (light ? lumAt(ref, p) > lum : lumAt(ref, p) < lum)) m[p] = 1;
      const mm = dilate(m, W, H, grow);
      for (let p = 0; p < W * H; p++) if (mm[p] && !claimed[p] && r[p] > 127) { claimed[p] = 1; m[p] = 1; }
      if (!halo) { pieces.push({ id, mask: m }); return; }
      // glowing lettering: its halo (up to halo px, inside the region) travels with the overlay, so the plate is bare plaque
      const area = dilate(m, W, H, halo);
      for (let p = 0; p < W * H; p++) if (r[p] < 128) area[p] = 0;
      pieces.push({ id, mask: m, erase: area, area });
    },
    /* a solid thing on the panel (a tile, a pill): what differs from the clean template there, its enclosed
       interior filled; the soft glow around it (up to `glow` px) travels with the overlay, so the plate is bare panel */
    async solid(id, region, { thr = 28, glow = 14 } = {}) {
      const r = await inRegion(region); const bb = bboxOf(r, W, H);
      let m = new Uint8Array(W * H);
      for (let p = 0; p < W * H; p++) if (r[p] > 127) { const i = p * 3; if (Math.max(Math.abs(ref.d[i] - bg.d[i]), Math.abs(ref.d[i + 1] - bg.d[i + 1]), Math.abs(ref.d[i + 2] - bg.d[i + 2])) > thr) m[p] = 1; }
      m = dilate(m, W, H, 2);
      // fill holes: whatever the region's border cannot reach through empty pixels is inside the shape
      const seen = new Uint8Array(W * H), st = [];
      for (let x = bb[0]; x < bb[0] + bb[2]; x++) st.push(bb[1] * W + x, (bb[1] + bb[3] - 1) * W + x);
      for (let y = bb[1]; y < bb[1] + bb[3]; y++) st.push(y * W + bb[0], y * W + bb[0] + bb[2] - 1);
      while (st.length) { const p = st.pop(); if (seen[p] || m[p]) continue; const x = p % W, y = (p / W) | 0; if (x < bb[0] || x >= bb[0] + bb[2] || y < bb[1] || y >= bb[1] + bb[3]) continue; seen[p] = 1; st.push(p - 1, p + 1, p - W, p + W); }
      for (let y = bb[1]; y < bb[1] + bb[3]; y++) for (let x = bb[0]; x < bb[0] + bb[2]; x++) { const p = y * W + x; if (!seen[p]) m[p] = 1; }
      for (let p = 0; p < W * H; p++) if (claimed[p]) m[p] = 0;
      for (let p = 0; p < W * H; p++) if (m[p]) claimed[p] = 1;
      const area = dilate(m, W, H, glow);
      for (let p = 0; p < W * H; p++) if (r[p] < 128) area[p] = 0; // the glow stays inside the region, off the neighbours
      pieces.push({ id, mask: m, erase: area, area });
    },
    /* erase without an overlay (the countdown figures) */
    async erase(region) { const r = await inRegion(region); const m = new Uint8Array(W * H); for (let p = 0; p < W * H; p++) if (r[p] > 127) m[p] = 1; pieces.push({ mask: m }); },
  };
  await build(ctx);

  // erase everything at once, then cut each overlay against the erased plate
  const union = new Uint8Array(W * H);
  for (const pc of pieces) { const src = pc.erase || dilate(pc.mask, W, H, 2); for (let p = 0; p < W * H; p++) if (src[p] > 0) union[p] = 1; }
  if (pieces.length) fillMasked(plate, union, 60);
  for (const pc of pieces) {
    if (!pc.id) continue;
    const area = pc.area || dilate(pc.mask, W, H, 2);
    const rect = clampRect(bboxOf(area, W, H), W, H); const [x, y, rw, rh] = rect;
    const out = Buffer.alloc(rw * rh * 4);
    for (let py = 0; py < rh; py++) for (let px = 0; px < rw; px++) {
      const p = (y + py) * W + x + px, i = p * 3, o = (py * rw + px) * 4;
      const dr = ref.d[i] - plate.d[i], dg = ref.d[i + 1] - plate.d[i + 1], db = ref.d[i + 2] - plate.d[i + 2];
      const e = Math.max(Math.abs(dr), Math.abs(dg), Math.abs(db));
      let a = area[p] ? Math.max(0, Math.min(1, (e - 4) / 30)) : 0;
      if (pc.mask[p]) a = Math.max(a, 1); // inside the shape: the exact pixel
      if (a <= 0) { out[o] = ref.d[i]; out[o + 1] = ref.d[i + 1]; out[o + 2] = ref.d[i + 2]; out[o + 3] = 0; continue; }
      out[o] = Math.max(0, Math.min(255, plate.d[i] + dr / a));
      out[o + 1] = Math.max(0, Math.min(255, plate.d[i + 1] + dg / a));
      out[o + 2] = Math.max(0, Math.min(255, plate.d[i + 2] + db / a));
      out[o + 3] = Math.round(a * 255);
    }
    await writeWebp(out, rw, rh, path.join(OUT, `${pc.id}.webp`));
    setBox(pc.id, rect, W, H);
  }
  art[`plate${n}`] = { px: [W, H] };
  await sharp(Buffer.from(plate.d), { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 90, effort: 5 }).toFile(path.join(OUT, `plate${n}.webp`));
  if (DEBUG) {
    await sharp(Buffer.from(plate.d), { raw: { width: W, height: H, channels: 3 } }).jpeg({ quality: 88 }).toFile(path.join(DEBUG, `plate${n}.jpg`));
    const comps = pieces.filter((p) => p.id).map((p) => ({ input: path.join(OUT, `${p.id}.webp`), left: Math.round(art[p.id].x / 100 * W), top: Math.round(art[p.id].y / 100 * H) }));
    const composed = await sharp(path.join(OUT, `plate${n}.webp`)).composite(comps).removeAlpha().raw().toBuffer();
    let err = 0, big = 0;
    for (let i = 0; i < W * H * 3; i += 3) { const e = Math.max(Math.abs(composed[i] - ref.d[i]), Math.abs(composed[i + 1] - ref.d[i + 1]), Math.abs(composed[i + 2] - ref.d[i + 2])); err += e; if (e > 24) big++; }
    console.log(`page ${n}: ${pieces.filter((p) => p.id).length} overlays; plate+overlays vs reference: mean error ${(err / (W * H)).toFixed(2)}, pixels off by >24: ${(big / (W * H) * 100).toFixed(3)}%`);
    await sharp(composed, { raw: { width: W, height: H, channels: 3 } }).jpeg({ quality: 88 }).toFile(path.join(DEBUG, `composed${n}.jpg`));
  } else console.log(`page ${n}: plate and ${pieces.filter((p) => p.id).length} overlays written`);
  return ctx;
}
async function copyElement(id, file, maxWidth) {
  await sharp(path.join(SRC, file)).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 96, effort: 5 }).toFile(path.join(OUT, `${id}.webp`));
}

for (const f of fs.readdirSync(OUT)) if (/\.(webp|jpg)$/.test(f)) fs.rmSync(path.join(OUT, f)); // the film and music may be open in a preview

/* PAGE 1 — hero: every line on the panel enters with a fade; the names may change. */
await page(1, '1.png', async (c) => {
  await c.text('p1-monogram', [395, 375, 150, 202]);
  await c.text('p1-lines', [240, 590, 465, 102]);
  // the "and" with its rules is claimed first, so the names' descenders stay with the names
  await c.text('p1-and', [[436, 833, 90, 42], [295, 854, 134, 16], [518, 854, 130, 16]]);
  await c.text('p1-name1', [288, 708, 350, 136]);
  await c.text('p1-name2', [308, 880, 340, 130]);
  await c.text('p1-rule', [398, 1048, 146, 48]);
  await c.text('p1-tagline', [318, 1184, 310, 54]);
});

/* PAGE 2 — Save Our Date: the Reveal Date pill gives way to the Date Revealed element; the month may change. */
await page(2, '2.png', async (c) => {
  await c.text('p2-monogram', [395, 118, 150, 184]);
  await c.text('p2-divider', [358, 300, 222, 48]);
  await c.text('p2-title', [218, 338, 514, 258]);
  await c.text('p2-month', [292, 610, 352, 48]);
  await c.solid('p2-reveal', [204, 1066, 526, 146]);
  setBox('p2-reveal-hit', [220, 1080, 495, 112], c.W, c.H);
  setBox('p2-save-hit', [222, 1216, 474, 100], c.W, c.H);
  setBox('p2-maps-hit', [222, 1318, 474, 100], c.W, c.H);
  // the heart element: its gold ring (alpha > 200 bbox) onto the ring the reference draws around the 15th
  const heart = await sharp(path.join(SRC, 'elements/2/Glossy Golden Heart Frame.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0;
  for (let y = 0; y < heart.info.height; y++) for (let x = 0; x < heart.info.width; x++) if (heart.data[(y * heart.info.width + x) * 4 + 3] > 200) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const ring = [207, 857, 80, 69], s = ring[2] / (x1 - x0 + 1);
  setBox('p2-heart', [ring[0] - x0 * s, ring[1] - y0 * s, heart.info.width * s, heart.info.height * s], c.W, c.H);
  await copyElement('p2-heart', 'elements/2/Glossy Golden Heart Frame.png', 600);
  // the Date Revealed element: its pill (alpha > 128 bbox 76..1968 × 165..600) onto the reference's pill box, by width
  const pill = [220, 1080, 495, 112], ps = pill[2] / (1968 - 76 + 1), ph = (600 - 165 + 1) * ps;
  setBox('p2-revealed', [pill[0] - 76 * ps, pill[1] + pill[3] / 2 - ph / 2 - 165 * ps, 2052 * ps, 766 * ps], c.W, c.H);
  await copyElement('p2-revealed', 'elements/2/WHEN REVEALED.png', 1200);
});

/* PAGE 3 — Our Functions: each card's wording is an overlay over the erased card, so it can be edited. */
await page(3, '3.png', async (c) => {
  await c.text('p3-monogram', [432, 82, 164, 186]);
  await c.text('p3-title', [280, 276, 462, 168]);
  await c.text('p3-divider', [432, 424, 176, 54]);
  for (const [k, dy] of [['n', 0], ['r', 509]]) {
    await c.text(`p3-${k}-title`, [440, 556 + dy, 225, 62]);
    await c.text(`p3-${k}-divider`, [462, 612 + dy, 170, 38], { lum: 190 });
    await c.text(`p3-${k}-icon-date`, [396, 646 + dy, 50, 50]);
    await c.text(`p3-${k}-date`, [460, 652 + dy, 200, 38]);
    await c.text(`p3-${k}-icon-time`, [396, 694 + dy, 52, 50]);
    await c.text(`p3-${k}-time`, [460, 700 + dy, 160, 38]);
    await c.text(`p3-${k}-icon-venue`, [398, 744 + dy, 48, 56]);
    await c.text(`p3-${k}-venue`, [458, 744 + dy, 310, 96]);
  }
  setBox('p3-n-save-hit', [316, 850, 236, 72], c.W, c.H);
  setBox('p3-n-maps-hit', [568, 850, 234, 72], c.W, c.H);
  setBox('p3-r-save-hit', [316, 1365, 236, 72], c.W, c.H);
  setBox('p3-r-maps-hit', [568, 1365, 234, 72], c.W, c.H);
});

/* PAGE 5 — RSVP: the two tiles are overlays (they light up when chosen); the Dua box area is HTML. */
await page(5, '5.png', async (c) => {
  await c.text('p5-ornament', [390, 344, 162, 86]);
  await c.text('p5-title', [222, 436, 492, 232]);
  await c.text('p5-divider1', [300, 660, 344, 60]);
  await c.text('p5-divider2', [303, 996, 340, 60]);
  await c.text('p5-dua-title', [335, 1050, 280, 140]);   // praying hands, laurels, "Dua for Us"
  await c.solid('p5-will', [184, 712, 262, 304]);   // clear of the dividers' central ornaments (x 450-492)
  await c.solid('p5-unable', [496, 712, 262, 304]);
  setBox('p5-dua-area', [232, 1188, 512, 140], c.W, c.H); // the frame's empty area, clear of the bottom-left flower
});

/* PAGE 6 — Thank You: the reference as it is; the page fades in as one. */
await page(6, '6.png', async (c) => {
  await c.text('p6-title', [150, 400, 640, 235], { light: true, lum: 110, grow: 2, halo: 14 });   // Thank You, with its glow
  await c.text('p6-lines', [280, 690, 400, 135], { light: true, lum: 110, grow: 2, halo: 14 });   // For your love & blessings
  await c.text('p6-cartouche', [270, 975, 420, 185]);                                   // We are eagerly waiting…
});

/* PAGE 4 — the landscape countdown: the reference with the four figures erased; live figures are HTML. */
await page(4, '4.png', async (c) => {
  const centers = [585, 796, 1010, 1225];
  await c.text('p4-title', [620, 215, 510, 230], { light: true, lum: 105, grow: 2, halo: 14 });   // Until We Say Nikkah
  await c.text('p4-divider', [730, 448, 340, 36], { light: true, lum: 105, grow: 2, halo: 14 });
  for (const [k, x] of [[0, 530], [1, 741], [2, 955], [3, 1165]]) await c.text(`p4-label${k}`, [x, 634, k === 3 ? 130 : 120, 38], { light: true, lum: 105, halo: 8 });
  for (const cx of centers) await c.erase([cx - 58, 548, 116, 84]);
  centers.forEach((cx, k) => setBox(`p4-digit${k}`, [cx - 70, 540, 140, 100], c.W, c.H));
});

/* the satin joining band: trimmed to its alpha (rows 224..453 of 724), placed across every page boundary */
await sharp(path.join(SRC, 'elements/page_joining_top_satin.png.png')).extract({ left: 0, top: 224, width: 2172, height: 230 }).resize({ width: 1400 }).webp({ quality: 90, alphaQuality: 96, effort: 5 }).toFile(path.join(OUT, 'satin.webp'));
art.satin = { px: [2172, 230] };

/* opening poster = the film's first frame (frame0.png, extracted with ffmpeg) and the og banner */
const frame0 = path.join(SRC, 'frame0.png');
if (fs.existsSync(frame0)) await sharp(frame0).webp({ quality: 88 }).toFile(path.join(OUT, 'opening.webp'));
else console.warn('no frame0.png in the pack folder: extract the film\'s first frame there for the opening poster');
await sharp(path.join(SRC, 'with text temp/1.png')).extract({ left: 0, top: 420, width: 941, height: 494 }).resize(1200, 630).jpeg({ quality: 86, progressive: true }).toFile(path.join(OUT, 'og.jpg'));

fs.mkdirSync(path.join(SITE, 'js'), { recursive: true });
fs.writeFileSync(path.join(SITE, 'js/art.js'), `/* generated by tools/build-modern-wedding-art.mjs: every overlay's box in % of its page */\nexport const art = ${JSON.stringify(art)};\n`);
console.log('wrote js/art.js with', Object.keys(art).length, 'entries');
