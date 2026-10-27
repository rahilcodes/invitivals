#!/usr/bin/env node
/* Varun & Diksha — the client's couple illustration for the hero (public/varun-diksha-wedding).

     node tools/varun-diksha-couple.mjs

   Source: invites/src/varun-diksha-couple.jpg (gitignored) — the illustration on pure black, its
   transparency lost in upload. The black is removed the way tools/rr-chanchal-hero.mjs does it:
   black that reaches the border, and any large enclosed black pocket (between the dupatta and the
   legs), becomes transparent; hair and dark embroidery are never black enough in a large patch to be
   touched. The edge is pulled in a pixel to drop the dark JPEG fringe and softened. The colours, the
   drawing and the proportions are left exactly as they are.
   Writes public/varun-diksha-wedding/assets/couple.webp (the hero's couple slot, js/decor.js). */
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const SRC = path.join(ROOT, 'invites/src/varun-diksha-couple.jpg');
const OUT = path.join(ROOT, 'public/varun-diksha-wedding/assets/couple.webp');

const { data: d, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, N = W * H;
const mx = (i) => Math.max(d[i * 3], d[i * 3 + 1], d[i * 3 + 2]);
const dark = new Uint8Array(N); for (let i = 0; i < N; i++) dark[i] = mx(i) <= 14 ? 1 : 0;
const bg = new Uint8Array(N), seen = new Uint8Array(N);
for (let s = 0; s < N; s++) {
  if (!dark[s] || seen[s]) continue;
  const comp = [s]; seen[s] = 1; let border = false;
  for (let q = 0; q < comp.length; q++) {
    const i = comp[q], x = i % W, y = (i / W) | 0;
    if (x === 0 || y === 0 || x === W - 1 || y === H - 1) border = true;
    for (const j of [i - 1, i + 1, i - W, i + W]) if (j >= 0 && j < N && dark[j] && !seen[j] && Math.abs((j % W) - x) <= 1) { seen[j] = 1; comp.push(j); }
  }
  if (border || comp.length > 400) for (const i of comp) bg[i] = 1;
}
// distance from the background (two-pass chamfer), capped — drives the soft edge
const dist = new Float32Array(N).fill(99);
for (let i = 0; i < N; i++) if (bg[i]) dist[i] = 0;
const relax = (order) => { for (const [y0, y1, dy, x0, x1, dx] of order) for (let y = y0; y !== y1; y += dy) for (let x = x0; x !== x1; x += dx) {
  const i = y * W + x; if (!dist[i]) continue;
  for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const X = x + ox, Y = y + oy; if (X < 0 || Y < 0 || X >= W || Y >= H) continue;
    const v = dist[Y * W + X] + (ox && oy ? 1.414 : 1); if (v < dist[i]) dist[i] = v; } } };
relax([[0, H, 1, 0, W, 1], [H - 1, -1, -1, W - 1, -1, -1]]);
relax([[0, H, 1, 0, W, 1], [H - 1, -1, -1, W - 1, -1, -1]]);
const px = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const a = Math.max(0, Math.min(1, (dist[i] - 1.2) / 1.6));   // drop the 1px dark fringe, 1.6px soft edge
  px[i * 4] = d[i * 3]; px[i * 4 + 1] = d[i * 3 + 1]; px[i * 4 + 2] = d[i * 3 + 2]; px[i * 4 + 3] = Math.round(a * 255);
}
const info2 = await sharp(px, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 0 })
  .resize({ height: 1200, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 95, effort: 6 }).toFile(OUT);
console.log('couple ->', path.relative(ROOT, OUT), info2.width + '×' + info2.height);
