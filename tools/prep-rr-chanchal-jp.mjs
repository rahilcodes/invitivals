#!/usr/bin/env node
/* Assets for Chanchal Sharma & JP Sharma on the Rose Red detailed template (rr-wedding-26nov).

     node tools/prep-rr-chanchal-jp.mjs        -> public/chanchal-jp-sharma-wedding/assets/
     then: node tools/build-rr-wedding.mjs chanchal-jp-sharma-wedding

   The designer's pages, fonts, damask tile, music and envelope link-preview are the very
   files the Rupam & Taniya invitation uses. The couple's photos (invites/src/chanchal-jp-wedding,
   unedited client files) are cropped to the template's 3:4 frames at their full resolution —
   no upscaling, no retouching of faces — plus a full, uncropped copy for the lightbox. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const SRC = path.join(ROOT, 'invites/src/chanchal-jp-wedding');
const TPL = path.join(ROOT, 'public/rr-wedding-26nov/assets');
const OUT = path.join(ROOT, 'public/chanchal-jp-sharma-wedding/assets');
fs.mkdirSync(path.join(OUT, 'fonts'), { recursive: true });

for (const f of ['envelope', 'couple-page', 'date-page', 'date-cover', 'venue-page', 'thanks-page', 'corner-floral', 'spark', 'damask'])
  fs.copyFileSync(path.join(TPL, f + '.webp'), path.join(OUT, f + '.webp'));
for (const f of fs.readdirSync(path.join(TPL, 'fonts'))) fs.copyFileSync(path.join(TPL, 'fonts', f), path.join(OUT, 'fonts', f));
fs.copyFileSync(path.join(TPL, 'music.mp3'), path.join(OUT, 'music.mp3'));
fs.copyFileSync(path.join(TPL, 'og.jpg'), path.join(OUT, 'og.jpg'));     // the sealed envelope: no names, no dates

/* [file, 3:4 crop in source pixels (both faces kept), name] */
const PHOTOS = [
  // Our Story arch (client 2026-10-21: centre the couple — the window moves left so both sit in the middle)
  ['photo-10.jpg', { left: 172, top: 0, width: 768, height: 1024 }, 'story'],         // Jal Mahal, red saree
  // gallery, in the client's order of 2026-10-21
  ['photo-10.jpg', { left: 172, top: 0, width: 768, height: 1024 }, 'g1'],            // 1 lakeside sunset with the palace
  ['photo-9.jpg', { left: 380, top: 0, width: 768, height: 1024 }, 'g2'],             // 2 Hawa Mahal, Jaipur
  ['photo-8.jpg', { left: 0, top: 120, width: 1024, height: 1365 }, 'g3'],            // 3 wooden bridge, brown and white
  ['photo-gate-new.jpg', { left: 0, top: 171, width: 1024, height: 1365 }, 'g4'],     // 4 holding hands at the wooden gate (client's new edit)
  ['photo-6.jpg', { left: 190, top: 500, width: 630, height: 840 }, 'g5'],            // 5 walking under the trees, pigeons in front
];
for (const [file, crop, name] of PHOTOS) {
  const src = path.join(SRC, file);
  await sharp(src).extract(crop).webp({ quality: 88, smartSubsample: true, effort: 6 }).toFile(path.join(OUT, `photo-${name}.webp`));
  await sharp(src).webp({ quality: 86, smartSubsample: true, effort: 6 }).toFile(path.join(OUT, `photo-${name}-full.webp`));
}
/* Opening page (client change 2026-10-21): the designer's lakeside page, unchanged, with the client's
   Rajasthani couple standing where the illustrated couple stood. The cutout arrived as a JPEG on pure
   black (its transparency was lost in upload); only black connected to the image border is removed —
   hair and dark embroidery are never touched — and the anti-aliased rim is un-premultiplied so no
   dark fringe remains. Placed large enough to cover the old couple, cut by the page edge as before. */
async function keyCutout(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, mx = (i) => Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
  const bg = new Uint8Array(W * H), stack = [];
  const push = (x, y) => { const i = y * W + x; if (!bg[i] && mx(i) <= 10) { bg[i] = 1; stack.push(i); } };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) { const i = stack.pop(), x = i % W, y = (i / W) | 0;
    if (x > 0) push(x - 1, y); if (x < W - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < H - 1) push(x, y + 1); }
  const out = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    let a = 255;
    if (bg[i]) a = 0;
    else {                                                   // rim: pixels touching the removed black
      let near = false;
      for (let dy = -2; dy <= 2 && !near; dy++) for (let dx = -2; dx <= 2; dx++) {
        const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < W && Y < H && bg[Y * W + X]) { near = true; break; } }
      if (near) a = Math.max(0, Math.min(255, Math.round((mx(i) - 6) / 34 * 255)));
    }
    const k = a ? 255 / a : 0;
    for (let c = 0; c < 3; c++) out[i * 4 + c] = a ? Math.min(255, Math.round(data[i * 3 + c] * (a < 255 ? k : 1))) : 0;
    out[i * 4 + 3] = a;
  }
  return sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
}
const cut = await keyCutout(path.join(SRC, 'couple-rajasthani-cutout.jpg'));
fs.writeFileSync(path.join(SRC, 'couple-rajasthani-cutout.png'), cut);
const HERO = { scale: .9, left: 220, top: 1513 };          // in the page's 1350×2400 pixels
const cw = Math.round(1100 * HERO.scale), ch = Math.round(1430 * HERO.scale);
const placed = await sharp(cut).resize(cw, ch).png().toBuffer();
const visible = Math.min(ch, 2400 - HERO.top);
// the old bride's head and the old groom's hair sit in the gap between the new heads: cover it with the same sky-and-hills band
// copied from further left in the same picture (same height, so horizon and light line up), soft-edged
// two soft patches, each from a clean stretch of the same band (no falling petal copied)
const PATCHES = [
  { x: 590, y: 1690, w: 260, h: 126, dx: -290, feather: 26 },   // old bride's head: hills and sky beside the palace
  { x: 722, y: 1572, w: 150, h: 222, dx: -320, feather: 24 },   // old groom's hair and beard: open sky
  { x: 688, y: 1766, w: 96, h: 124, dx: -270, feather: 22 },    // old bride's hair flowers: the hills behind
];
const page = path.join(TPL, 'couple-page.webp');
const layers = [];
for (const P of PATCHES) {
  const band = await sharp(page).extract({ left: P.x + P.dx, top: P.y, width: P.w, height: P.h }).removeAlpha().raw().toBuffer();
  const soft = Buffer.alloc(P.w * P.h * 4);
  for (let y = 0; y < P.h; y++) for (let x = 0; x < P.w; x++) {
    const e = Math.min(x, y, P.w - 1 - x, P.h - 1 - y) / P.feather, a = Math.min(1, e), i = y * P.w + x;
    soft[i * 4] = band[i * 3]; soft[i * 4 + 1] = band[i * 3 + 1]; soft[i * 4 + 2] = band[i * 3 + 2]; soft[i * 4 + 3] = Math.round(255 * a * a * (3 - 2 * a));
  }
  layers.push({ input: await sharp(soft, { raw: { width: P.w, height: P.h, channels: 4 } }).png().toBuffer(), left: P.x, top: P.y });
}
const patched = await sharp(page).composite(layers).png().toBuffer();
await sharp(patched)
  .composite([{ input: await sharp(placed).extract({ left: 0, top: 0, width: cw, height: visible }).png().toBuffer(), left: HERO.left, top: HERO.top }])
  .webp({ quality: 88, effort: 6 }).toFile(path.join(OUT, 'couple-page.webp'));

console.log('assets ->', path.relative(ROOT, OUT));
