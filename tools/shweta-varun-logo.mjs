#!/usr/bin/env node
/* Shweta & Varun — the couple's gold S&V monogram, cut off the checkerboard it arrived on.

     node tools/shweta-varun-logo.mjs

   The client's file (invites/src/shweta-varun-wedding/sv-logo-source.jpg) is a JPEG: its "transparent" grey-and-white
   checkerboard is painted into the picture. The artwork is gold (strongly coloured), the checkerboard is neutral, so
   every pixel is kept by how much colour it has; the artwork itself is not redrawn, stretched or recoloured.
   The small white glints inside the gold (colourless too) are put back: any cut-out patch that is completely
   surrounded by gold and smaller than a checkerboard square belongs to the artwork.
   Writes (sources, not committed):
     invites/src/shweta-varun-wedding/sv-logo.png                      the monogram on real transparency
     invites/src/saicharan-lakshmi-engagement/sv-logo.jpg              the same on black, for the seal tools (MARK=sv) */
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
/* node tools/shweta-varun-logo.mjs [page folder] [mark]  — defaults: shweta-varun-wedding sv; also used for shashidar-vedhashree-wedding shv */
const SLUG = process.argv[2] || 'shweta-varun-wedding', MARK = process.argv[3] || 'sv';
const SRC = path.join(ROOT, 'invites/src', SLUG);
const { data, info } = await sharp(path.join(SRC, `${MARK}-logo-source.jpg`)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, n = W * H, A = new Float32Array(n);
for (let i = 0; i < n; i++) {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx ? (mx - mn) / mx : 0, warm = (r - b) / 255;                 // gold: red well above blue
  A[i] = Math.max(0, Math.min(1, (Math.min(sat, warm * 1.4) - 0.10) / 0.14));
}
/* glints: transparent patches enclosed by the artwork and far smaller than the open checkerboard areas */
const seen = new Uint8Array(n), stack = [];
for (let s = 0; s < n; s++) {
  if (seen[s] || A[s] > 0.5) continue;
  const comp = []; let border = false; seen[s] = 1; stack.push(s);
  while (stack.length) { const i = stack.pop(), x = i % W, y = (i / W) | 0; comp.push(i);
    if (!x || !y || x === W - 1 || y === H - 1) border = true;
    for (const j of [x ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y ? i - W : -1, y < H - 1 ? i + W : -1]) if (j >= 0 && !seen[j] && A[j] <= 0.5) { seen[j] = 1; stack.push(j); } }
  if (!border && comp.length < 6000) for (const i of comp) A[i] = 1;
}
/* stray specks on the checkerboard (JPEG noise): opaque islands of a few pixels are dropped */
seen.fill(0);
for (let s = 0; s < n; s++) {
  if (seen[s] || A[s] <= 0.5) continue;
  const comp = []; seen[s] = 1; stack.push(s);
  while (stack.length) { const i = stack.pop(), x = i % W, y = (i / W) | 0; comp.push(i);
    for (const j of [x ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y ? i - W : -1, y < H - 1 ? i + W : -1]) if (j >= 0 && !seen[j] && A[j] > 0.5) { seen[j] = 1; stack.push(j); } }
  if (comp.length < 400) for (const i of comp) A[i] = 0;
}
const out = Buffer.alloc(n * 4);
for (let i = 0; i < n; i++) {
  let r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2]; const a = A[i];
  /* on the soft edge the pixel is part checkerboard: take the grey out so no pale fringe is left */
  if (a > 0 && a < 1) { const k = 1 - a, bg = 230; r = Math.max(0, Math.min(255, (r - bg * k * .55) / (1 - k * .55))); g = Math.max(0, Math.min(255, (g - bg * k * .7) / (1 - k * .55))); b = Math.max(0, Math.min(255, (b - bg * k) / (1 - k * .55))); }
  out[i * 4] = r; out[i * 4 + 1] = g; out[i * 4 + 2] = b; out[i * 4 + 3] = Math.round(a * 255);
}
const png = await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
await sharp(png).toFile(path.join(SRC, `${MARK}-logo.png`));
await sharp(png).flatten({ background: '#000' }).jpeg({ quality: 96, chromaSubsampling: '4:4:4' }).toFile(path.join(ROOT, `invites/src/saicharan-lakshmi-engagement/${MARK}-logo.jpg`));
/* proof sheets for the eye: on cream, on gold foil, on dark */
const proof = await Promise.all(['#efdcc0', '#e3c589', '#2a130b'].map((bg) => sharp(png).resize(420).flatten({ background: bg }).toBuffer()));
await sharp({ create: { width: 1272, height: 420, channels: 3, background: '#fff' } }).composite(proof.map((input, i) => ({ input, left: i * 426, top: 0 }))).jpeg({ quality: 90 }).toFile(path.join(SRC, `${MARK}-logo-proof.jpg`));
console.log('✓', SLUG, MARK + '-logo.png', W + 'x' + H);
