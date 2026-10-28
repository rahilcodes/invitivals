#!/usr/bin/env node
/* Pooja & Deepak — the client's pictures for public/pooja-deepak-wedding (gallery "Moments").

     node tools/pooja-deepak-art.mjs

   Sources in invites/src/pooja-deepak-wedding (gitignored), exactly as the client sent them:
     couple-illustration.jpg  1024×1536, the couple under a floral arch on cream paper — shown whole (its own
                              frame is part of the art, and the gown's highlights are the paper's colour, so it is
                              not cut out)
     haldi.jpg, mountain.jpg  1086×1448 (3:4) paintings — shown whole
     venue-rs-farm.jpg        720×480, the banquet's flower-lined aisle — The Venue arch (client, 2026-10-29)
   Nothing is cropped, redrawn or retouched: only resized and saved as WebP. */
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const SRC = path.join(ROOT, 'invites/src/pooja-deepak-wedding');
const OUT = path.join(ROOT, 'public/pooja-deepak-wedding/assets');

for (const [file, name, width] of [
  ['couple-illustration.jpg', 'gallery-pd-couple', 1024],
  ['haldi.jpg', 'gallery-pd-haldi', 900],
  ['mountain.jpg', 'gallery-pd-hills', 900],
  ['venue-rs-farm.jpg', 'venue-rs-farm', 720],
]) {
  const info = await sharp(path.join(SRC, file)).resize({ width, withoutEnlargement: true })
    .webp({ quality: 86, smartSubsample: true, effort: 6 }).toFile(path.join(OUT, `${name}.webp`));
  console.log(name, info.width + '×' + info.height, Math.round(info.size / 1024) + ' KB');
}
