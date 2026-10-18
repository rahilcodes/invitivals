// Client revision art for the Nandini & Satyam wedding (public/nandini-satyam-wedding/assets)
// from the files the client supplied in invites/src/nandini-satyam-wedding.
//   node tools/nandini-satyam-art.mjs
// couple-reference.jpg → couple.webp: the North Indian couple (red lehenga, ivory sherwani and safa),
//   cropped to the pair and feathered at the edges so the mandap behind them melts into the hero sky.
// argan-hall.jpg → venue-argan-hall.webp: the hall front for The Venue arch, sign kept in frame.
import sharp from 'sharp';
import { join } from 'node:path';

const SRC = 'invites/src/nandini-satyam-wedding';
const OUT = 'public/nandini-satyam-wedding/assets';

const smooth = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };

async function couple() {
  const crop = { left: 210, top: 360, width: 700, height: 1080 };
  const { data, info } = await sharp(join(SRC, 'couple-reference.jpg'))
    .extract(crop).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1), v = y / (H - 1);
      // soft arch: sides fade over the outer 24%, the top over 30%, the floor over the last 10%
      const side = smooth(Math.min(u, 1 - u) / 0.24);
      const top = smooth(v / 0.30);
      const floor = smooth((1 - v) / 0.10);
      data[(y * W + x) * 4 + 3] = Math.round(255 * side * top * floor);
    }
  }
  await sharp(data, { raw: info }).resize({ width: 560 })
    .webp({ quality: 80, alphaQuality: 80, effort: 6 }).toFile(join(OUT, 'couple.webp'));
}

async function venue() {
  // kept whole: the arch frame is taller than wide on phones, so the CSS centres it on the sign
  await sharp(join(SRC, 'argan-hall.jpg'))
    .resize({ width: 1000 })
    .webp({ quality: 78, effort: 6 }).toFile(join(OUT, 'venue-argan-hall.webp'));
}

await couple();
await venue();
console.log('done');
