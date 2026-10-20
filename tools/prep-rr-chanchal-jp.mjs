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
  ['photo-10.jpg', { left: 250, top: 0, width: 768, height: 1024 }, 'story'],        // Jal Mahal, red saree
  ['photo-6.jpg', { left: 190, top: 500, width: 630, height: 840 }, 'g1'],          // walking among the pigeons (closer: the couple, not the square)
  ['photo-8.jpg', { left: 0, top: 120, width: 1024, height: 1365 }, 'g2'],           // on the wooden steps
  ['photo-9.jpg', { left: 380, top: 0, width: 768, height: 1024 }, 'g3'],            // Hawa Mahal
  ['photo-7.jpg', { left: 30, top: 230, width: 1000, height: 1333 }, 'g4'],         // hand in hand on the stairs
];
for (const [file, crop, name] of PHOTOS) {
  const src = path.join(SRC, file);
  await sharp(src).extract(crop).webp({ quality: 88, smartSubsample: true, effort: 6 }).toFile(path.join(OUT, `photo-${name}.webp`));
  await sharp(src).webp({ quality: 86, smartSubsample: true, effort: 6 }).toFile(path.join(OUT, `photo-${name}-full.webp`));
}
console.log('assets ->', path.relative(ROOT, OUT));
