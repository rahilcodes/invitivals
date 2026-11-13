/* Splits each page of public/bengali-wedding/ into a plate and the layers that move on it, so the
 * wording and the hanging pieces can animate while the resting page stays exactly the reference.
 *
 *   node tools/build-bengali-wedding-ref.mjs     (first: the corrected reference pages, assets/bg/r1…r9.webp)
 *   node tools/build-bengali-wedding-fx.mjs
 *
 * For every box below, the layer is the reference's own pixels (assets/fx/p<page>-<id>.webp, with alpha) and the
 * plate (assets/bg/q1…q9.webp) has that area painted out from its surroundings. Plate + layers at rest = the
 * reference (checked by compositing). Modes: 'ink' lifts what differs from the local paper/sky (wording, ornaments, icons); 'rect' lifts the
 * whole box with soft edges (painted buttons and menu rows); 'gold' lifts warm metal (lanterns hanging over leaves).
 * The <img> tags are written into index.html between <!--fx:N--> and <!--/fx:N--> so the words show without script.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { paintOut } from './lib/paint-out.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public/bengali-wedding');
const W = 941, H = 1672, C = 3;
fs.mkdirSync(path.join(PUB, 'assets/fx'), { recursive: true });

/* [id, [x0, y0, x1, y1], mode, kind]  kind: 'text' rises in, 'name' opens from the centre, 'btn' rises in after the text, 'sway' hangs and sways */
const FX = {
  1: [['orn', [380, 62, 565, 165], 'ink', 'text'], ['title', [268, 183, 738, 314], 'ink', 'text'], ['sub', [325, 312, 630, 460], 'ink', 'text'],
      ['names', [182, 1068, 790, 1184], 'rect', 'name'], ['para', [250, 1190, 695, 1452], 'ink', 'text']],
  2: [['title', [200, 438, 770, 606], 'ink', 'text'], ['sub', [245, 606, 715, 708], 'ink', 'text'],
      ['strandL', [143, 296, 207, 598], 'ink', 'sway'], ['strandR', [766, 296, 834, 574], 'ink', 'sway']],
  3: [['title', [198, 248, 742, 476], 'ink', 'text'], ['sub', [248, 476, 698, 632], 'ink', 'text'],
      ['row1', [138, 631, 815, 769], 'rect', 'btn'], ['row2', [138, 771, 815, 910], 'rect', 'btn'], ['row3', [138, 912, 815, 1052], 'rect', 'btn'],
      ['row4', [138, 1054, 815, 1193], 'rect', 'btn'], ['row5', [138, 1195, 815, 1335], 'rect', 'btn'],
      ['lanternL', [74, 350, 152, 616], 'gold', 'sway'], ['lanternR', [792, 345, 866, 614], 'gold', 'sway']],
  4: [['title', [360, 148, 790, 412], 'ink', 'text'], ['tag', [375, 414, 735, 566], 'ink', 'text'], ['det', [240, 1158, 705, 1340], 'ink', 'text'],
      ['maps', [212, 1340, 748, 1424], 'rect', 'btn'], ['cal', [228, 1424, 720, 1500], 'rect', 'btn']],
  5: [['title', [258, 118, 735, 362], 'ink', 'text'], ['tag', [318, 362, 652, 508], 'ink', 'text'], ['det', [240, 1150, 705, 1346], 'ink', 'text'],
      ['maps', [188, 1350, 772, 1444], 'rect', 'btn'], ['cal', [188, 1446, 770, 1545], 'rect', 'btn']],
  6: [['lanternL', [10, 260, 98, 448], 'gold', 'sway'], ['lanternR', [724, 330, 800, 505], 'gold', 'sway'], ['title', [238, 128, 742, 372], 'ink', 'text'], ['tag', [325, 372, 645, 514], 'ink', 'text'], ['det', [240, 1190, 725, 1394], 'ink', 'text'],
      ['maps', [182, 1396, 765, 1488], 'rect', 'btn'], ['cal', [186, 1488, 762, 1575], 'rect', 'btn']],
  7: [['title', [305, 140, 660, 384], 'ink', 'text'], ['tag', [312, 384, 648, 524], 'ink', 'text'], ['det', [225, 1192, 725, 1396], 'ink', 'text'],
      ['maps', [172, 1398, 768, 1492], 'rect', 'btn'], ['cal', [180, 1492, 760, 1585], 'rect', 'btn']],
  8: [['lanternL', [150, 330, 215, 470], 'gold', 'sway'], ['title', [283, 112, 714, 352], 'ink', 'text'], ['tag', [318, 352, 668, 510], 'ink', 'text'], ['det', [250, 1162, 712, 1370], 'ink', 'text'],
      ['maps', [172, 1370, 795, 1462], 'rect', 'btn'], ['cal', [172, 1462, 795, 1590], 'rect', 'btn']],
  9: [['title', [158, 218, 802, 368], 'ink', 'text'], ['sub', [278, 368, 662, 446], 'ink', 'text'],
      ['thanks', [228, 1028, 708, 1206], 'ink', 'text'], ['para', [338, 1206, 612, 1378], 'ink', 'text']],
};

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

/* the local paper/sky under the wording: the 75th-luminance-percentile colour within ~24 px (worked at quarter size) */
function ground(px, x0, y0, w, h) {
  const s = 4, sw = Math.ceil(w / s), sh = Math.ceil(h / s), R = 6, small = new Float32Array(sw * sh * 3);
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
    const acc = [0, 0, 0]; let n = 0;
    for (let dy = 0; dy < s; dy++) for (let dx = 0; dx < s; dx++) { const X = Math.min(w - 1, x * s + dx), Y = Math.min(h - 1, y * s + dy), i = ((y0 + Y) * W + x0 + X) * C; acc[0] += px[i]; acc[1] += px[i + 1]; acc[2] += px[i + 2]; n++; }
    for (let c = 0; c < 3; c++) small[(y * sw + x) * 3 + c] = acc[c] / n;
  }
  const res = new Float32Array(sw * sh * 3);
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
    const list = [];
    for (let yy = Math.max(0, y - R); yy <= Math.min(sh - 1, y + R); yy++) for (let xx = Math.max(0, x - R); xx <= Math.min(sw - 1, x + R); xx++) { const i = (yy * sw + xx) * 3; list.push([lum(small[i], small[i + 1], small[i + 2]), i]); }
    list.sort((a, b) => a[0] - b[0]); const k = list[Math.floor(list.length * .75)][1];
    for (let c = 0; c < 3; c++) res[(y * sw + x) * 3 + c] = small[k + c];
  }
  const out = new Float32Array(w * h * 3);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const fx = Math.min(sw - 1, Math.max(0, (x + .5) / s - .5)), fy = Math.min(sh - 1, Math.max(0, (y + .5) / s - .5));
    const xa = Math.floor(fx), ya = Math.floor(fy), xb = Math.min(sw - 1, xa + 1), yb = Math.min(sh - 1, ya + 1), tx = fx - xa, ty = fy - ya;
    for (let c = 0; c < 3; c++) out[(y * w + x) * 3 + c] = (res[(ya * sw + xa) * 3 + c] * (1 - tx) + res[(ya * sw + xb) * 3 + c] * tx) * (1 - ty) + (res[(yb * sw + xa) * 3 + c] * (1 - tx) + res[(yb * sw + xb) * 3 + c] * tx) * ty;
  }
  return out;
}
const dilate = (m, w, h, r) => { let a = m; for (let k = 0; k < r; k++) { const b = new Uint8Array(a); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (a[y * w + x]) continue; if ((x > 0 && a[y * w + x - 1]) || (x < w - 1 && a[y * w + x + 1]) || (y > 0 && a[(y - 1) * w + x]) || (y < h - 1 && a[(y + 1) * w + x])) b[y * w + x] = 1; } a = b; } return a; };
/* close the holes inside a shape (a lantern's lit glass, the counters of letters) */
function fillHoles(m, w, h) {
  const out = new Uint8Array(w * h).fill(1), st = [];
  const push = (x, y) => { const p = y * w + x; if (!m[p] && out[p]) { out[p] = 0; st.push(p); } };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); } for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (st.length) { const p = st.pop(), x = p % w, y = (p / w) | 0; if (x > 0) push(x - 1, y); if (x < w - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < h - 1) push(x, y + 1); }
  return out;
}
/* drop specks smaller than n pixels */
function despeck(m, w, h, n) {
  const seen = new Uint8Array(w * h);
  for (let s = 0; s < w * h; s++) {
    if (!m[s] || seen[s]) continue; const comp = [s]; seen[s] = 1;
    for (let k = 0; k < comp.length; k++) { const p = comp[k], x = p % w, y = (p / w) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const q = ny * w + nx; if (m[q] && !seen[q]) { seen[q] = 1; comp.push(q); } } }
    if (comp.length < n) for (const p of comp) m[p] = 0;
  }
}

const manifest = [];
let html = fs.readFileSync(path.join(PUB, 'index.html'), 'utf8');
for (const [n, items] of Object.entries(FX)) {
  const ref = Buffer.from(await sharp(path.join(PUB, `assets/bg/r${n}.webp`)).removeAlpha().raw().toBuffer());
  const plate = Buffer.from(ref);
  const tags = []; let order = 0;
  for (const [id, [x0, y0, x1, y1], mode, kind] of items) {
    const w = x1 - x0, h = y1 - y0;
    let m = new Uint8Array(w * h), alpha = new Float32Array(w * h);
    if (mode === 'rect') {
      const f = 2;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { m[y * w + x] = 1; alpha[y * w + x] = Math.min(1, Math.min(x + 1, y + 1, w - x, h - y) / f); }
    } else {
      if (mode === 'ink') {
        const g = ground(ref, x0, y0, w, h);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = ((y + y0) * W + x + x0) * C, k = (y * w + x) * 3; const d = Math.max(Math.abs(ref[i] - g[k]), Math.abs(ref[i + 1] - g[k + 1]), Math.abs(ref[i + 2] - g[k + 2])); m[y * w + x] = d > 24 ? 1 : 0; }
      } else {   // gold: warm metal and its chain, not the leaves, red flowers or white jasmine around it
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = ((y + y0) * W + x + x0) * C, r = ref[i], g = ref[i + 1], b = ref[i + 2]; m[y * w + x] = r >= g && g > b && r - b > 55 && g - b > 22 && !(r - g > 75) && lum(r, g, b) > 45 ? 1 : 0; }
      }
      despeck(m, w, h, 14);
      m = fillHoles(dilate(m, w, h, 1), w, h);
      const md = dilate(m, w, h, 1);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {      // a 1-px soft edge
        let s = 0, c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= w || Y >= h) continue; s += md[Y * w + X]; c++; }
        alpha[y * w + x] = s / c;
      }
      m = dilate(md, w, h, mode === 'ink' ? 4 : 2);
    }
    // the layer: the reference's pixels, cropped to what it holds
    let bx0 = w, by0 = h, bx1 = -1, by1 = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (alpha[y * w + x] > 0) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
    const lw = bx1 - bx0 + 1, lh = by1 - by0 + 1, rgba = Buffer.alloc(lw * lh * 4);
    for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) {
      const i = ((y + by0 + y0) * W + x + bx0 + x0) * C, o = (y * lw + x) * 4;
      rgba[o] = ref[i]; rgba[o + 1] = ref[i + 1]; rgba[o + 2] = ref[i + 2]; rgba[o + 3] = Math.round(alpha[(y + by0) * w + x + bx0] * 255);
    }
    const file = `p${n}-${id}.webp`;
    await sharp(rgba, { raw: { width: lw, height: lh, channels: 4 } }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(path.join(PUB, 'assets/fx', file));
    // the plate: the same area painted out from its surroundings
    paintOut(plate, W, H, C, { rects: [[x0 - 1, y0 - 1, x1 + 1, y1 + 1]], test: (r, g, b, x, y) => { const lx = x - x0, ly = y - y0; return lx >= 0 && ly >= 0 && lx < w && ly < h && m[ly * w + lx] === 1; }, grow: 0, passes: mode === 'rect' ? 1400 : 900 });
    const X = (x0 + bx0) / W * 100, Y = (y0 + by0) / H * 100, WW = lw / W * 100;
    const d = kind === 'sway' ? 0 : (kind === 'btn' ? .35 : kind === 'name' ? .2 : 0) + order++ * .14;
    manifest.push({ page: +n, id, file, kind, x: +X.toFixed(3), y: +Y.toFixed(3), w: +WW.toFixed(3) });
    tags.push(`<img class="fx ${kind === 'sway' ? 'sway' : 'lift'}${kind === 'btn' ? ' lift--btn' : ''}${kind === 'name' ? ' lift--name' : ''}" src="assets/fx/${file}?v=7" alt="" aria-hidden="true" width="${lw}" height="${lh}" loading="${n === '1' ? 'eager' : 'lazy'}" decoding="async" style="left:${X.toFixed(3)}%;top:${Y.toFixed(3)}%;width:${WW.toFixed(3)}%;--d:${d.toFixed(2)}s">`);
    console.log(`p${n} ${id}`.padEnd(14), mode.padEnd(5), `${lw}×${lh}`);
  }
  await sharp(plate, { raw: { width: W, height: H, channels: C } }).webp({ quality: 88, effort: 6 }).toFile(path.join(PUB, `assets/bg/q${n}.webp`));
  const block = `<!--fx:${n}-->\n      ${tags.join('\n      ')}\n      <!--/fx:${n}-->`;
  const re = new RegExp(`<!--fx:${n}-->[\\s\\S]*?<!--/fx:${n}-->`);
  if (re.test(html)) html = html.replace(re, block);
  else console.warn(`index.html has no <!--fx:${n}--> marker`);
}
fs.writeFileSync(path.join(PUB, 'assets/fx/fx.json'), JSON.stringify(manifest, null, 1));
fs.writeFileSync(path.join(PUB, 'index.html'), html);
console.log(`${manifest.length} layers`);
