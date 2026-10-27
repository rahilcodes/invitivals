#!/usr/bin/env node
/* Assets for Dr. Mamatha Reddy & Dr. Sai Rama Reddy on the Rose Red detailed template (rr-wedding-26nov).

     node tools/prep-rr-mamatha-sairama.mjs   -> public/mamatha-sairama-wedding/assets/
     then: node tools/build-rr-wedding.mjs mamatha-sairama-wedding

   The designer's pages, fonts, damask tile, music and envelope link-preview are the very files the
   template uses (copied, the template is only read). The couple's own photographs go in when they
   arrive — none of the template's demo photos are copied. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const TPL = path.join(ROOT, 'public/rr-wedding-26nov/assets');
const OUT = path.join(ROOT, 'public/mamatha-sairama-wedding/assets');
fs.mkdirSync(path.join(OUT, 'fonts'), { recursive: true });

for (const f of ['envelope', 'couple-page', 'date-page', 'date-cover', 'venue-page', 'thanks-page', 'corner-floral', 'spark', 'damask'])
  fs.copyFileSync(path.join(TPL, f + '.webp'), path.join(OUT, f + '.webp'));
for (const f of fs.readdirSync(path.join(TPL, 'fonts'))) fs.copyFileSync(path.join(TPL, 'fonts', f), path.join(OUT, 'fonts', f));
fs.copyFileSync(path.join(TPL, 'music.mp3'), path.join(OUT, 'music.mp3'));
fs.copyFileSync(path.join(TPL, 'og.jpg'), path.join(OUT, 'og.jpg'));     // the sealed envelope: no names, no dates

console.log('assets ->', path.relative(ROOT, OUT));

/* The couple's photographs (invites/src/mamatha-sairama-wedding, unedited client files): cropped only, never
   retouched — a 3:4 crop where the couple fits it, and a wide group photo shown whole on a soft, darkened blur
   of itself so nobody is cut out. Plus a full, uncropped copy for the lightbox. */
const SRC = path.join(ROOT, 'invites/src/mamatha-sairama-wedding');
const TW = 1000, TH = 1333;
const PHOTOS = [
  ['photo-41.jpg', 'whole34', 'story'],                                      // Our Story: the two of them, roses in hand (already 3:4)
  ['photo-43.jpg', { left: 0, top: 60, width: 1024, height: 1365 }, 'g1'],   // 1 featured: in garlands, both facing the camera
  ['photo-41.jpg', 'whole34', 'g2'],                                         // 2 the beginning: roses in hand
  ['photo-40.jpg', 'blur', 'g3'],                                            // 3 the ring exchange, both mothers beside them
  ['photo-42.jpg', { left: 360, top: 0, width: 768, height: 1024 }, 'g4'],   // 4 smiling at each other under the floral arch
  ['photo-44.jpg', 'blur', 'g5'],                                            // 5 with both families
];
for (const [file, how, name] of PHOTOS) {
  const src = path.join(SRC, file), m = await sharp(src).metadata();
  let img;
  if (how === 'whole34') img = sharp(src).resize(TW, TH, { fit: 'cover' });
  else if (how === 'blur') {
    const back = await sharp(src).resize(TW, TH, { fit: 'cover' }).blur(28).modulate({ brightness: .55, saturation: .8 }).toBuffer();
    const front = await sharp(src).resize({ width: TW }).toBuffer(), fh = Math.round(m.height * TW / m.width);
    img = sharp(back).composite([{ input: front, left: 0, top: Math.round((TH - fh) / 2) }]);
  } else img = sharp(src).extract(how).resize(TW, TH);
  await img.webp({ quality: 86, smartSubsample: true, effort: 6 }).toFile(path.join(OUT, `photo-${name}.webp`));
  await sharp(src).resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 86, smartSubsample: true, effort: 6 }).toFile(path.join(OUT, `photo-${name}-full.webp`));
}
console.log('photos ->', PHOTOS.length);
