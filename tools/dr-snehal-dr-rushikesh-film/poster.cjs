/* Dr. Snehal & Dr. Rushikesh: the SR monogram embossed on the seal of the opening still (the "Tap to Open" picture),
   with the same shape and shading as in the film (film.cjs).  node tools/dr-snehal-dr-rushikesh-film/poster.cjs
   Reads the design's still (public/vaishali-arpan-wedding is not touched; this page's own plain-seal copy is the
   source, kept in git history) → public/dr-snehal-dr-rushikesh-wedding/assets/opening-sr.webp */
const sharp = require('sharp');
const path = require('path');
const A = path.resolve(__dirname, '../../public/dr-snehal-dr-rushikesh-wedding/assets');
const SRC = process.argv[2] || path.resolve(__dirname, '../../public/ikon-celebration-wedding/assets/opening.webp');   // the plain-seal still
const C = { x: 491, y: 830 }, RF = 92, MONO = .7;          // the seal's face on the 947 × 1660 still
const blur1 = async (arr, w, h, sigma) => { const u = Buffer.alloc(w * h); for (let k = 0; k < w * h; k++) u[k] = Math.max(0, Math.min(255, Math.round(arr[k]))); return sharp(u, { raw: { width: w, height: h, channels: 1 } }).blur(sigma).toColourspace('b-w').raw().toBuffer(); };
(async () => {
  const { data: F, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true }), W = info.width;
  const src = await sharp(path.join(__dirname, 'sr-monogram.png')).greyscale().toColourspace('b-w').raw().toBuffer({ resolveWithObject: true });
  let x0 = 1e9, x1 = 0, y0 = 1e9, y1 = 0; const sw = src.info.width, sh = src.info.height;
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) if (src.data[y * sw + x] > 128) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const MH = Math.round(RF * 2 * MONO), sc = MH / (y1 - y0 + 1), MW = Math.round((x1 - x0 + 1) * sc), P = 2 * RF + 20;
  const m = await sharp(src.data, { raw: { width: sw, height: sh, channels: 1 } }).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }).resize(MW, MH, { kernel: 'lanczos3' }).toColourspace('b-w').raw().toBuffer();
  const M = new Float32Array(P * P), ox = Math.round(P / 2 - MW / 2), oy = Math.round(P / 2 - MH / 2);
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) M[(oy + y) * P + ox + x] = m[y * MW + x];
  const hgt = await blur1(M, P, P, 1.3), soft = await blur1(M, P, P, .7);
  const at = (x, y) => hgt[Math.max(0, Math.min(P - 1, y)) * P + Math.max(0, Math.min(P - 1, x))] / 255;
  const px = Math.round(C.x - P / 2), py = Math.round(C.y - P / 2);
  for (let y = 3; y < P - 3; y++) for (let x = 3; x < P - 3; x++) {
    const s = (at(x + 1, y + 1) + at(x + 2, y + 2) + at(x + 3, y + 3)) / 3 - (at(x - 1, y - 1) + at(x - 2, y - 2) + at(x - 3, y - 3)) / 3, body = soft[y * P + x] / 255;
    const dark = Math.max(0, s), lit = Math.max(0, -s), d = [-78 * dark + 46 * lit + 7 * body, -74 * dark + 40 * lit + 4 * body, -62 * dark + 26 * lit - 1 * body];
    const i = ((py + y) * W + px + x) * 3; for (let c = 0; c < 3; c++) F[i + c] = Math.max(0, Math.min(255, Math.round(F[i + c] + d[c])));
  }
  await sharp(F, { raw: { width: W, height: info.height, channels: 3 } }).webp({ quality: 90 }).toFile(path.join(A, 'opening-sr.webp'));
  console.log('✓ opening-sr.webp', W, info.height);
})();
