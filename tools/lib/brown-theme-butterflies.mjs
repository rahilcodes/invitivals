/* The butterflies of the brown-theme references are the pack's own butterfly PNGs, placed, scaled, mirrored
 * and turned. placeButterfly finds which one sits in a reference rectangle and how, writes that PNG as a
 * sprite with real alpha in exactly that pose, and takes the butterfly out of the plate so it can move. */
import path from 'node:path';
import sharp from 'sharp';
import { keyOut, OPAQUE } from './brown-theme-key.mjs';

const SRC = 'invites/src/brown-theme-wedding-zip/brown theme wedding/elements';
export const BUTTERFLIES = [
  '1/Ornate Golden Jewel Butterfly', '1/Ornate Golden Monarch Butterfly Cutout',
  '2/Glittering Golden Monarch Butterfly', '2/Glittering Monarch Butterfly Cutout', '2/Ornate Golden Monarch Butterfly',
  '5/Ornate Golden Jewel Butterfly',
];
const cache = {};
async function source(name) {
  if (cache[name]) return cache[name];
  const file = path.join(SRC, `${name}.png`);
  const raw = OPAQUE.has(name) ? await keyOut(file) : await sharp(file).png().toBuffer();
  return (cache[name] = await sharp(raw).ensureAlpha().trim({ threshold: 8 }).png().toBuffer());
}
/* the PNG in one pose: width w, mirrored or not, turned by deg */
async function posed(buf, w, flip, deg) {
  let s = sharp(buf).resize({ width: w });
  if (flip) s = s.flop();
  const { data, info } = await sharp(await s.png().toBuffer()).rotate(deg, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}
function samplesOf(t, maxPts) {
  const pts = [];
  for (let y = 0; y < t.h; y++) for (let x = 0; x < t.w; x++) {
    const i = (y * t.w + x) * 4;
    if (t.data[i + 3] > 200) pts.push([x, y, 0.3 * t.data[i] + 0.59 * t.data[i + 1] + 0.11 * t.data[i + 2]]);
  }
  const step = Math.max(1, Math.floor(pts.length / maxPts));
  return pts.filter((_, k) => k % step === 0);
}
function ncc(ref, pts, x0, y0) {
  let n = 0, sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
  for (const [px, py, u] of pts) {
    const x = x0 + px, y = y0 + py;
    if (x < 0 || y < 0 || x >= ref.w || y >= ref.h) continue;
    const i = (y * ref.w + x) * 3, v = 0.3 * ref.d[i] + 0.59 * ref.d[i + 1] + 0.11 * ref.d[i + 2];
    n++; sa += u; sb += v; saa += u * u; sbb += v * v; sab += u * v;
  }
  if (n < pts.length * 0.8) return -1;
  return (sab - sa * sb / n) / Math.sqrt(Math.max(1, saa - sa * sa / n) * Math.max(1, sbb - sb * sb / n));
}

export async function placeButterfly({ ref, plate, rect, id, out, manifest, inpaint, fillMasked, dilate, report }) {
  const [rx, ry, rw, rh] = rect;
  const cx = rx + rw / 2, cy = ry + rh / 2;
  let best = { c: -2 };
  for (const name of BUTTERFLIES) {
    const buf = await source(name);
    const meta = await sharp(buf).metadata();
    for (let scale = 0.8; scale <= 1.3; scale += 0.1) {
      const w = Math.round(Math.max(rw, rh * meta.width / meta.height) * scale * 0.92);
      for (const flip of [false, true]) for (let deg = -60; deg <= 60; deg += 5) {
        const t = await posed(buf, w, flip, deg);
        const pts = samplesOf(t, 260);
        for (let dy = -10; dy <= 10; dy += 2) for (let dx = -10; dx <= 10; dx += 2) {
          const c = ncc(ref, pts, Math.round(cx - t.w / 2 + dx), Math.round(cy - t.h / 2 + dy));
          if (c > best.c) best = { c, name, w, flip, deg, dx, dy };
        }
      }
    }
  }
  /* refine around the best pose */
  const buf = await source(best.name);
  let fine = { c: -2 };
  for (let w = best.w - 4; w <= best.w + 4; w += 2) for (let deg = best.deg - 4; deg <= best.deg + 4; deg += 1) {
    const t = await posed(buf, w, best.flip, deg);
    const pts = samplesOf(t, 700);
    for (let dy = best.dy - 3; dy <= best.dy + 3; dy++) for (let dx = best.dx - 3; dx <= best.dx + 3; dx++) {
      const x0 = Math.round(cx - t.w / 2 + dx), y0 = Math.round(cy - t.h / 2 + dy);
      const c = ncc(ref, pts, x0, y0);
      if (c > fine.c) fine = { c, w, deg, x0, y0, t };
    }
  }
  const { t, x0, y0 } = fine;
  report.push(`${id}: ${best.name} ${best.flip ? 'mirrored ' : ''}turned ${fine.deg}°, ${fine.w} px wide at ${x0},${y0}, correlation ${fine.c.toFixed(2)}`);
  /* the sprite: the posed PNG trimmed to its pixels */
  const trimmed = await sharp(t.data, { raw: { width: t.w, height: t.h, channels: 4 } }).trim({ threshold: 8 }).png().toBuffer({ resolveWithObject: true });
  const tl = trimmed.info.trimOffsetLeft || 0, tt = trimmed.info.trimOffsetTop || 0;
  await sharp(trimmed.data).webp({ quality: 90, alphaQuality: 95 }).toFile(path.join(out, `${id}.webp`));
  manifest[id] = { x: +((x0 - tl) / ref.w * 100).toFixed(3), y: +((y0 - tt) / ref.h * 100).toFixed(3), w: +(trimmed.info.width / ref.w * 100).toFixed(3), h: +(trimmed.info.height / ref.h * 100).toFixed(3), rot: fine.deg, src: best.name };
  /* the hole it leaves in the plate */
  if (inpaint) {
    let mask = new Uint8Array(ref.w * ref.h);
    for (let y = 0; y < t.h; y++) for (let x = 0; x < t.w; x++) {
      const X = x0 + x, Y = y0 + y;
      if (X < 0 || Y < 0 || X >= ref.w || Y >= ref.h) continue;
      if (t.data[(y * t.w + x) * 4 + 3] > 6) mask[Y * ref.w + X] = 1;
    }
    mask = dilate(mask, ref.w, ref.h, 9); // antialiased edges and the soft shadow around the painted butterfly go too
    fillMasked(plate, mask, 150);
  }
}
