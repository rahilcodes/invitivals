#!/usr/bin/env node
/* Akansha & Lokesh — the client's couple illustration for the hero (public/akansha-lokesh-wedding).

     node tools/akansha-lokesh-couple.mjs

   Source: invites/src/akansha-lokesh-wedding/couple-back.jpg — the couple from behind on plain white (WhatsApp,
   2026-11-02). The white is removed the way tools/varun-diksha-couple.mjs removes black: near-neutral white
   that reaches the border, and any large enclosed white pocket, becomes transparent. The ivory sherwani, the
   safa and the jasmine in her hair are never white and neutral enough in a large patch to be touched. The edge
   is softened by a pixel and a half. The colours, the drawing and the proportions are left exactly as they are.
   Writes public/akansha-lokesh-wedding/assets/couple.webp (the hero's couple slot, js/decor.js). */
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const SRC = path.join(ROOT, process.env.SRC || 'invites/src/akansha-lokesh-wedding/couple-back.jpg');
const OUT = path.join(ROOT, process.env.OUT || 'public/akansha-lokesh-wedding/assets/couple.webp');

const { data: d, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, N = W * H;
const white = new Uint8Array(N);
for (let i = 0; i < N; i++) {
  const r = d[i * 3], g = d[i * 3 + 1], b = d[i * 3 + 2], lo = Math.min(r, g, b), hi = Math.max(r, g, b);
  white[i] = lo >= 236 && hi - lo <= 14 ? 1 : 0;
}
const bg = new Uint8Array(N), seen = new Uint8Array(N);
for (let s = 0; s < N; s++) {
  if (!white[s] || seen[s]) continue;
  const comp = [s]; seen[s] = 1; let border = false;
  for (let q = 0; q < comp.length; q++) {
    const i = comp[q], x = i % W, y = (i / W) | 0;
    if (x === 0 || y === 0 || x === W - 1 || y === H - 1) border = true;
    for (const j of [i - 1, i + 1, i - W, i + W]) if (j >= 0 && j < N && white[j] && !seen[j] && Math.abs((j % W) - x) <= 1) { seen[j] = 1; comp.push(j); }
  }
  if (border || comp.length > 3000) for (const i of comp) bg[i] = 1;
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
  const a = Math.max(0, Math.min(1, (dist[i] - 0.4) / 1.5));   // the pale JPEG halo goes, 1.5px soft edge
  px[i * 4] = d[i * 3]; px[i * 4 + 1] = d[i * 3 + 1]; px[i * 4 + 2] = d[i * 3 + 2]; px[i * 4 + 3] = Math.round(a * 255);
}
const info2 = await sharp(px, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 0 })
  .resize({ height: 1200, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 95, effort: 6 }).toFile(OUT);
console.log('couple ->', path.relative(ROOT, OUT), info2.width + '×' + info2.height);
