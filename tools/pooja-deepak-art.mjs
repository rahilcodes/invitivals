#!/usr/bin/env node
/* Pooja & Deepak — the client's pictures for public/pooja-deepak-wedding (gallery "Moments").

     node tools/pooja-deepak-art.mjs

   Sources in invites/src/pooja-deepak-wedding (gitignored), exactly as the client sent them:
     couple-illustration.jpg  1024×1536, the couple under a floral arch on cream paper — shown whole (its own
                              frame is part of the art, and the gown's highlights are the paper's colour, so it is
                              not cut out)
     venue-rs-farm-mandap.jpg 1536×1024, the client's RS Farm image — The Venue arch (client, 2026-10-30)
   Nothing is cropped, redrawn or retouched: only resized and saved as WebP. */
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const SRC = path.join(ROOT, 'invites/src/pooja-deepak-wedding');
const OUT = path.join(ROOT, 'public/pooja-deepak-wedding/assets');

for (const [file, name, width] of [
  ['couple-illustration.jpg', 'gallery-pd-couple', 1024],
  ['venue-rs-farm-mandap.jpg', 'venue-rs-farm-mandap', 1536],
]) {
  const info = await sharp(path.join(SRC, file)).resize({ width, withoutEnlargement: true })
    .webp({ quality: 86, smartSubsample: true, effort: 6 }).toFile(path.join(OUT, `${name}.webp`));
  console.log(name, info.width + '×' + info.height, Math.round(info.size / 1024) + ' KB');
}
