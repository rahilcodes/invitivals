#!/usr/bin/env node
/* Shifa & Mohammad Umair — the client's couple picture → a clean transparent cut-out.
     node tools/shifa-umair-cutout.mjs
   in : invites/src/shifa-umair-wedding/couple-original.jpg  (as supplied: a transparent PNG that reached us
        through WhatsApp flattened onto black, 1199×1312)
   out: invites/src/shifa-umair-wedding/couple-cutout.png      (same size, same proportions, nothing cropped)

   1. The black around the couple is found by flooding in from the top and side edges, so the groom's dark hair
      and beard and the shadows inside the clothes are never mistaken for background.
   2. The edge pixels were mixed with that black when the picture was flattened (a thin dark line, and the
      feather tips of the turban plume turned grey). Within a few pixels of the background each pixel is
      "unmixed": compared with the colour just inside the figure, its brightness gives back its own
      transparency and its colour is lifted to that of the cloth — so no dark fringe remains. */
import sharp from 'sharp';
const SRC = 'invites/src/shifa-umair-wedding/couple-original.jpg';
const OUT = 'invites/src/shifa-umair-wedding/couple-cutout.png';
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, N = W * H, T = 22;
const lum = (i) => .299 * data[i * 3] + .587 * data[i * 3 + 1] + .114 * data[i * 3 + 2];
const dark = (i) => Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]) < T;

/* 1 · background flood from the top and both sides (the couple meets the bottom edge) */
const bg = new Uint8Array(N), stack = [];
const push = (x, y) => { const i = y * W + x; if (!bg[i] && dark(i)) { bg[i] = 1; stack.push(i); } };
for (let x = 0; x < W; x++) push(x, 0);
for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
while (stack.length) {
  const i = stack.pop(), x = i % W, y = (i / W) | 0;
  if (x > 0) push(x - 1, y); if (x < W - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < H - 1) push(x, y + 1);
}

/* distance (chamfer, px) of every figure pixel from the background */
const D = new Float32Array(N).fill(1e9);
for (let i = 0; i < N; i++) if (bg[i]) D[i] = 0;
const pass = (fwd) => {
  const ys = fwd ? [0, H, 1] : [H - 1, -1, -1], xs = fwd ? [0, W, 1] : [W - 1, -1, -1];
  for (let y = ys[0]; y !== ys[1]; y += ys[2]) for (let x = xs[0]; x !== xs[1]; x += xs[2]) {
    const i = y * W + x; let d = D[i];
    const s = fwd ? -1 : 1, yy = y + s;
    if (x - s >= 0 && x - s < W) d = Math.min(d, D[i - s] + 1);
    if (yy >= 0 && yy < H) {
      d = Math.min(d, D[yy * W + x] + 1);
      if (x - 1 >= 0) d = Math.min(d, D[yy * W + x - 1] + 1.414);
      if (x + 1 < W) d = Math.min(d, D[yy * W + x + 1] + 1.414);
    }
    D[i] = d;
  }
};
pass(true); pass(false);

/* 2 · the cloth's own colour near the edge: interior pixels (5–9 px in) averaged over a small neighbourhood */
const ZONE = 4.5, R = 7;
const wgt = new Float32Array(N), acc = new Float32Array(N * 3);
for (let i = 0; i < N; i++) if (D[i] >= 3 && D[i] <= 8) { wgt[i] = 1; for (let c = 0; c < 3; c++) acc[i * 3 + c] = data[i * 3 + c]; }
async function boxBlur(arr, ch) {          // normalised convolution through sharp (a gaussian of the weighted values)
  const f = Buffer.alloc(N * ch);
  let max = 0; for (const v of arr) max = Math.max(max, v); max = max || 1;
  for (let i = 0; i < arr.length; i++) f[i] = Math.round(arr[i] / max * 255);
  const b = await sharp(f, { raw: { width: W, height: H, channels: ch } }).blur(R * .75).raw().toBuffer();
  return Float32Array.from(b, (v) => v / 255 * max);
}
const wB = await boxBlur(wgt, 1);
const cB = [];
for (let c = 0; c < 3; c++) { const one = new Float32Array(N); for (let i = 0; i < N; i++) one[i] = acc[i * 3 + c]; cB.push(await boxBlur(one, 1)); }

const out = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const o = i * 4;
  if (bg[i]) { out[o + 3] = 0; continue; }
  /* the turban's feather plume: its fine tips were semi-transparent, so all of it is unmixed against white feather */
  const px = i % W, py = (i / W) | 0;
  if (px >= 430 && px <= 530 && py <= 86 && lum(i) < 200) {
    const a = Math.pow(Math.max(0, Math.min(1, (lum(i) - 6) / 200)), 1.1);
    for (let c = 0; c < 3; c++) out[o + c] = Math.min(255, Math.round((a > .05 ? data[i * 3 + c] / a : 236) * .5 + [238, 230, 216][c] * .5));
    out[o + 3] = Math.round(a * 255);
    continue;
  }
  if (D[i] > ZONE) { for (let c = 0; c < 3; c++) out[o + c] = data[i * 3 + c]; out[o + 3] = 255; continue; }
  const ref = wB[i] > .01 ? [cB[0][i] / wB[i], cB[1][i] / wB[i], cB[2][i] / wB[i]] : [225, 212, 196];   // far from any interior: the ivory of the clothes
  const lr = Math.max(30, .299 * ref[0] + .587 * ref[1] + .114 * ref[2]);
  let a = Math.max(0, Math.min(1, lum(i) / lr));
  if (D[i] <= 1.01) a *= .55;                // the very last ring: always softened
  for (let c = 0; c < 3; c++) {
    const lifted = a > .04 ? data[i * 3 + c] / a : ref[c];
    out[o + c] = Math.max(0, Math.min(255, Math.round(lifted * .55 + ref[c] * .45)));
  }
  out[o + 3] = Math.round(a * 255);
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(OUT);
console.log('wrote', OUT, W + 'x' + H);
