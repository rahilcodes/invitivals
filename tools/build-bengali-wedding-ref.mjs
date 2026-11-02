/* Builds the pages of public/bengali-wedding/ from the designer's finished references,
 * invites/src/bengali-wedding/with text temp/1.png … 9.png (the specification for this demo).
 *
 *   node tools/build-bengali-wedding-ref.mjs
 *
 * Each page is its reference as drawn, so headings, lettering, couples, ornaments and buttons are
 * exactly the designer's. Six slips in the references' Bengali are corrected with the references'
 * own letters (no new font is set into the artwork):
 *   1  পরিরারের → পরিবারের, পারিরারিক → পারিবারিক   (the dot that makes ব into র is lifted)
 *   1  উশস্থিতি → উপস্থিতি                            (প taken from আপনাদের on the same line)
 *   2  ঘরে দেখুন → ঘষে দেখুন                          (ঘষে from the scratch-off reference)
 *   5  সন্ধাল ১০টা → সকাল ১০টা                       (কা taken from ঢাকা below)
 *   6  আমাদের আগুন → আমাদের আসর                    (স and র from সুরে above)
 * Page 2's revealed date is the scratch-off reference's own, carried onto page 2's gold in a soft oval:
 * assets/el/date-ink.webp (that patch, with alpha) under assets/el/date-cover.webp (page 2's bare gold at the same box,
 * which the guest rubs away); assets/el/date-box.json records the box.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { paintOut } from './lib/paint-out.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REF = path.join(ROOT, 'invites/src/bengali-wedding/with text temp');
const OUT = path.join(ROOT, 'public/bengali-wedding/assets');
const W = 941, H = 1672, C = 3;
fs.mkdirSync(path.join(OUT, 'bg'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'el'), { recursive: true });

const load = async (f) => ({ px: Buffer.from(await sharp(path.join(REF, f)).resize(W, H, { fit: 'fill' }).removeAlpha().raw().toBuffer()) });
const lum = (px, i) => 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
const pct = (arr, p) => { const s = Float32Array.from(arr).sort(); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };

/* the lettering inside a box as coverage (0…1) + its ink colour: dark ink on light paper */
function ink({ px }, [x0, y0, x1, y1]) {
  const w = x1 - x0, h = y1 - y0, L = [];
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) L.push(lum(px, (y * W + x) * C));
  const bg = pct(L, .9), dk = pct(L, .04);
  const a = new Float32Array(w * h); let r = 0, g = 0, b = 0, n = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = ((y + y0) * W + x + x0) * C, v = Math.max(0, Math.min(1, ((bg - lum(px, i)) / (bg - dk)) * 1.12 - .06));
    a[y * w + x] = v; if (v > .9) { r += px[i]; g += px[i + 1]; b += px[i + 2]; n++; }
  }
  return { w, h, a, rgb: [r / n, g / n, b / n] };
}
/* paint a box's lettering out of the plate (the paper grows back in from the box's edge) */
function clear({ px }, rect, margin = 32) {
  const [x0, y0, x1, y1] = rect, L = [];
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) L.push(lum(px, (y * W + x) * C));
  const cut = pct(L, .9) - margin;
  paintOut(px, W, H, C, { rects: [rect], test: (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b < cut, grow: 2 });
}
/* lay lettering onto the plate */
function stamp({ px }, L, x0, y0, rgb = L.rgb) {
  for (let y = 0; y < L.h; y++) for (let x = 0; x < L.w; x++) {
    const a = L.a[y * L.w + x]; if (!a) continue;
    const i = ((y + y0) * W + x + x0) * C;
    for (let c = 0; c < 3; c++) px[i + c] = Math.round(px[i + c] * (1 - a) + rgb[c] * a);
  }
}
/* lettering off the paper by spreading the paper over it: each pixel of the zone takes the paper tone within r (the colour at the 62nd luminance percentile, above the ink, below the letters' bright halo),
   softened, and is feathered in over f px (dark ink on light paper; neighbouring letters outside the zone are untouched) */
function paper({ px }, [x0, y0, x1, y1], r = 6, f = 2) {
  const w = x1 - x0, h = y1 - y0, best = new Float32Array(w * h * 3);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const list = [];
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const i = ((y + y0 + dy) * W + x + x0 + dx) * C; list.push([lum(px, i), i]); }
    list.sort((a, b) => a[0] - b[0]); const bi = list[Math.floor(list.length * .62)][1];
    for (let c = 0; c < 3; c++) best[(y * w + x) * 3 + c] = px[bi + c];
  }
  const soft = new Float32Array(best.length);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < 3; c++) {
    let s = 0, n = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue; s += best[(yy * w + xx) * 3 + c]; n++; }
    soft[(y * w + x) * 3 + c] = s / n;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = Math.min(1, Math.min(x + 1, y + 1, w - x, h - y) / f), i = ((y + y0) * W + x + x0) * C;
    for (let c = 0; c < 3; c++) px[i + c] = Math.max(0, Math.min(255, Math.round(px[i + c] * (1 - k) + (soft[(y * w + x) * 3 + c] + (Math.random() - .5) * 2) * k)));
  }
}
/* lift one small dark mark (a dot) whose box is given: only components that sit wholly inside the box */
function liftDot({ px }, [x0, y0, x1, y1]) {
  const w = x1 - x0, h = y1 - y0, L = [];
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) L.push(lum(px, (y * W + x) * C));
  const cut = pct(L, .85) - 45, dark = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) dark[y * w + x] = lum(px, ((y + y0) * W + x + x0) * C) < cut ? 1 : 0;
  const keep = new Uint8Array(w * h), seen = new Uint8Array(w * h);
  for (let s = 0; s < w * h; s++) {
    if (!dark[s] || seen[s]) continue;
    const comp = [s]; seen[s] = 1; let edge = false;
    for (let k = 0; k < comp.length; k++) {
      const p = comp[k], x = p % w, y = (p / w) | 0;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) edge = true;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const q = ny * w + nx; if (dark[q] && !seen[q]) { seen[q] = 1; comp.push(q); } }
    }
    if (!edge) for (const p of comp) keep[p] = 1;
  }
  paintOut(px, W, H, C, { rects: [[x0 - 1, y0 - 1, x1 + 1, y1 + 1]], test: (r, g, b, x, y) => { const lx = x - x0, ly = y - y0; return lx >= 0 && ly >= 0 && lx < w && ly < h && keep[ly * w + lx] === 1; }, grow: 2 });
}
const save = async ({ px }, name, q = 88) => {
  const info = await sharp(px, { raw: { width: W, height: H, channels: C } }).webp({ quality: q, effort: 6 }).toFile(path.join(OUT, 'bg', name));
  console.log(name.padEnd(10), `${(info.size / 1024).toFixed(0)} KB`);
};

const p = {};
for (let n = 1; n <= 9; n++) p[n] = await load(`${n}.png`);
const scratch = await load('Bengali Wedding Scratch-Off Invitation.png');

/* 1 · hero */
liftDot(p[1], [445, 335, 462, 350]);                    // পরিরারের → পরিবারের
liftDot(p[1], [597, 1213, 615, 1230]);                  // পারিরারিক → পারিবারিক
{ const PA = ink(p[1], [371, 1272, 393, 1306]); paper(p[1], [508, 1281, 549, 1310]); paper(p[1], [508, 1266, 542, 1282]); stamp(p[1], PA, 514, 1272); }   // উশস্থিতি → উপস্থিতি (শ is 507–543; প has no headstroke)

/* 2 · the date: ঘষে from the scratch-off reference; its date lettering lifted for the reveal */
{ const G = ink(scratch, [266, 624, 342, 670]); clear(p[2], [263, 621, 345, 673]); stamp(p[2], G, 266, 624); }
{
  const [x0, y0, x1, y1] = [262, 832, 728, 1064], w = x1 - x0, h = y1 - y0, a = new Float32Array(w * h);
  // the scratch-off reference's own date, carried across inside a soft oval that follows the lettering's slant (−8°)
  // and stays within the gold brush; outside it the patch fades into page 2's gold
  const cx = 495 - x0, cy = 948 - y0, rx = 232, ry = 112, fe = 34, th = -8 * Math.PI / 180, co = Math.cos(th), si = Math.sin(th);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = x - cx, dy = y - cy, u = (dx * co + dy * si) / rx, v = (-dx * si + dy * co) / ry, d = Math.sqrt(u * u + v * v);
    a[y * w + x] = Math.max(0, Math.min(1, (1 - d) * Math.min(rx, ry) / fe + .5));
  }
  const rgba = Buffer.alloc(w * h * 4);
  for (let k = 0; k < w * h; k++) { const i = (((k / w) | 0) + y0) * W * C + ((k % w) + x0) * C; rgba[k * 4] = scratch.px[i]; rgba[k * 4 + 1] = scratch.px[i + 1]; rgba[k * 4 + 2] = scratch.px[i + 2]; rgba[k * 4 + 3] = Math.round(a[k] * 255); }
  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(OUT, 'el', 'date-ink.webp'));
  await sharp(p[2].px, { raw: { width: W, height: H, channels: C } }).extract({ left: x0, top: y0, width: w, height: h }).webp({ quality: 90 }).toFile(path.join(OUT, 'el', 'date-cover.webp'));
  fs.writeFileSync(path.join(OUT, 'el', 'date-box.json'), JSON.stringify({ x: x0 / W, y: y0 / H, w: w / W, h: h / H }));
  console.log('date box', x0, y0, w, h);
}

/* 5 · সন্ধাল ১০টা → সকাল ১০টা */
{
  const S = ink(p[5], [460, 1209, 487, 1247]), KA = ink(p[5], [487, 1303, 521, 1335]), L = ink(p[5], [512, 1209, 533, 1247]), D = ink(p[5], [538, 1209, 604, 1247]);
  clear(p[5], [456, 1205, 609, 1251]);
  stamp(p[5], S, 460, 1209); stamp(p[5], KA, 486, 1213, S.rgb); stamp(p[5], L, 519, 1209); stamp(p[5], D, 548, 1209);
}

/* 6 · আমাদের আগুন → আমাদের আসর */
{
  // the second line's আ ends at x 564; গুন runs 565–622 with its ু down to y 458; line 2's headstroke is 51 px below line 1's
  const S = ink(p[6], [355, 379, 381, 404]), R = ink(p[6], [399, 379, 422, 411]);
  clear(p[6], [565, 418, 628, 472]);
  stamp(p[6], S, 565, 430); stamp(p[6], R, 591, 430);
}

for (let n = 1; n <= 9; n++) await save(p[n], `r${n}.webp`);
