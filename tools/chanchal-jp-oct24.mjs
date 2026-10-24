#!/usr/bin/env node
/* chanchal-jp-sharma-wedding — client changes of 2026-10-24 (art only; the hero is tools/rr-chanchal-hero.mjs).

     node tools/chanchal-jp-oct24.mjs

   Sources (invites/src/chanchal-jp-wedding, gitignored):
     ganesh-wm.jpg           the client's Ganesh, on pure black (its transparency was lost in upload)
     gallery-4 … gallery-10  the client's seven photographs, in the order they go into the gallery
   Writes into public/chanchal-jp-sharma-wedding/assets/:
     ganesh-wm.webp          Ganesh keyed off black (alpha from brightness, colour un-premultiplied, so the
                             gold line-work and the soft smoke stay) — shown faintly behind the names
     photo-n4 … n10(-full)   gallery thumbnails at 1000×1333 (3:4, like photos 1–3) and lightbox versions.
                             A portrait photo is cropped to 3:4; a wide group photo is never cropped — it sits
                             whole on a soft, darkened blur of itself, so nobody is cut out of the frame. */
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const SRC = path.join(ROOT, 'invites/src/chanchal-jp-wedding');
const OUT = path.join(ROOT, 'public/chanchal-jp-sharma-wedding/assets');

/* 1. Ganesh */
{
  const { data, info } = await sharp(path.join(SRC, 'ganesh-wm.jpg')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2], m = Math.max(r, g, b);
    const a = Math.max(0, Math.min(1, (m - 12) / 90)), k = a > 0 ? 1 / Math.max(a, .3) : 0;
    px[i * 4] = Math.min(255, r * k); px[i * 4 + 1] = Math.min(255, g * k); px[i * 4 + 2] = Math.min(255, b * k); px[i * 4 + 3] = Math.round(a * 255);
  }
  await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } }).trim({ threshold: 1 }).resize({ width: 900 })
    .webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(OUT, 'ganesh-wm.webp'));
}

/* 2. gallery 4–10; `x` = where the 3:4 crop is centred (0–1) for a photo wider than 3:4 */
const G = [
  [4, { x: .5 }],     // the four of them at the ceremony
  [5, { x: .5 }],     // two ladies, red and turquoise
  [6, { x: .5 }],     // mother and daughter at home
  [7, { x: .52 }],    // mother and daughter at the ceremony (wide: both faces sit in the middle)
  [8, { x: .5 }],     // father feeding his daughter a sweet
  [9, { x: .5 }],     // daughter feeding her father a sweet
  [10, { whole: true }], // the four of them in the hall (wide: shown whole)
];
const TW = 1000, TH = 1333;
for (const [n, o] of G) {
  const src = path.join(SRC, `gallery-${n}.jpg`), m = await sharp(src).metadata(), W = m.width, H = m.height;
  let thumb;
  if (o.whole) {
    const back = await sharp(src).resize(TW, TH, { fit: 'cover' }).blur(28).modulate({ brightness: .55, saturation: .8 }).toBuffer();
    const front = await sharp(src).resize({ width: TW }).toBuffer(), fh = Math.round(H * TW / W);
    thumb = sharp(back).composite([{ input: front, left: 0, top: Math.round((TH - fh) / 2) }]);
  } else if (W / H > TW / TH) {
    const cw = Math.round(H * TW / TH), left = Math.max(0, Math.min(W - cw, Math.round(W * o.x - cw / 2)));
    thumb = sharp(src).extract({ left, top: 0, width: cw, height: H }).resize(TW, TH);
  } else {
    const chh = Math.round(W * TH / TW), top = Math.max(0, Math.round((H - chh) * .3));   // a little above centre keeps faces in
    thumb = sharp(src).extract({ left: 0, top, width: W, height: Math.min(chh, H - top) }).resize(TW, TH, { fit: 'cover' });
  }
  await thumb.webp({ quality: 84, effort: 6 }).toFile(path.join(OUT, `photo-n${n}.webp`));
  await sharp(src).resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 86, effort: 6 }).toFile(path.join(OUT, `photo-n${n}-full.webp`));
}
console.log('ganesh-wm, photo-n4…n10 ->', path.relative(ROOT, OUT));
