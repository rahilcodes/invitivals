#!/usr/bin/env node
/* The client's couple photograph (on black) → a clean cut-out with soft edges, no dark fringe.
     node tools/manbir-arshleen-bride-cutout.mjs
   in : invites/src/manbir-arshleen-bride/couple-original.jpg (the photo as supplied, untouched)
   out: invites/src/manbir-arshleen-bride/couple-cutout.png
   The black around the couple is found by flooding in from the picture's edges, so dark hair,
   beard and shadows inside the figures are never mistaken for background. */
import sharp from 'sharp';
const SRC = 'invites/src/manbir-arshleen-bride/couple-original.jpg';
const OUT = 'invites/src/manbir-arshleen-bride/couple-cutout.png';
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, T = 20;
const dark = (i) => Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]) < T;
const bg = new Uint8Array(W * H), stack = [];
const push = (x, y) => { const i = y * W + x; if (!bg[i] && dark(i)) { bg[i] = 1; stack.push(i); } };
for (let x = 0; x < W; x++) { push(x, 0); }                  // top edge only: the couple meets the sides and the foot
for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
while (stack.length) {
  const i = stack.pop(), x = i % W, y = (i / W) | 0;
  if (x > 0) push(x - 1, y); if (x < W - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < H - 1) push(x, y + 1);
}
/* alpha: 1 inside, eased off over ~2 px at the edge (blurred mask, then pulled in by a hair) */
const m = Buffer.alloc(W * H); for (let i = 0; i < W * H; i++) m[i] = bg[i] ? 0 : 255;
const soft = await sharp(m, { raw: { width: W, height: H, channels: 1 } }).blur(1.4).extractChannel(0).raw().toBuffer();
if (soft.length !== W * H) throw new Error('mask size ' + soft.length);
const out = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  let a = Math.max(0, Math.min(1, (soft[i] / 255 - .18) / .82));
  const k = a > 0 ? 1 / Math.max(a, .45) : 1;               // the edge pixels were mixed with black: lift them back
  for (let c = 0; c < 3; c++) out[i * 4 + c] = Math.min(255, Math.round(data[i * 3 + c] * (a < 1 ? k : 1)));
  out[i * 4 + 3] = Math.round(a * 255);
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(OUT);
console.log('wrote', OUT, W + 'x' + H);
