// Builds the web assets of the South Indian wedding invitation (public/hindu-south-wedding/assets)
// from the designer pack in invites/src/hindu-south-wedding (gitignored).
//   node tools/build-hindu-south-art.mjs
// frame-first.png / frame-last.png are the first and last frames of "intro video.mp4"
// (extracted once with OpenCV; the page shows them as poster and as the hand-off frame).
import sharp from 'sharp';
import { mkdirSync, copyFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'invites/src/hindu-south-wedding';
const OUT = 'public/hindu-south-wedding/assets';
mkdirSync(OUT, { recursive: true });
const src = (f) => join(SRC, f);
const out = (f) => join(OUT, f);
const PAPER = [243, 227, 202]; // parchment of the body artwork, matches --paper in invite.css

/* key the parchment out of one side strip of body-screen.png so only pillar, vines and flowers remain */
async function sideStrip(side) {
  const W = 300;
  const meta = await sharp(src('body-screen.png')).metadata();
  const left = side === 'l' ? 0 : meta.width - W;
  const { data, info } = await sharp(src('body-screen.png'))
    .extract({ left, top: 0, width: W, height: meta.height })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      const d = Math.hypot(data[i] - PAPER[0], data[i + 1] - PAPER[1], data[i + 2] - PAPER[2]);
      let a = Math.min(1, Math.max(0, (d - 9) / 42));
      const inward = side === 'l' ? x : W - 1 - x;           // distance from the outer edge
      const fade = Math.min(1, Math.max(0, (W - inward) / 90)); // fade out towards the content column
      a *= fade;
      data[i + 3] = Math.round(a * 255);
    }
  }
  await sharp(data, { raw: info }).resize({ width: 216 }).webp({ quality: 72, alphaQuality: 70, effort: 6 }).toFile(out(`side-${side}.webp`));
}

async function main() {
  // intro video + its hand-off frames
  copyFileSync(src('intro video.mp4'), out('intro-wedding.mp4'));
  await sharp(src('frame-first.png')).resize({ width: 720 }).webp({ quality: 78 }).toFile(out('intro-poster.webp'));
  await sharp(src('frame-last.png')).resize({ width: 720 }).webp({ quality: 80 }).toFile(out('intro-last.webp'));

  // hero arch (temple + lake) and the closing sunset
  await sharp(src('hero-screen.png')).webp({ quality: 80 }).toFile(out('hero-arch.webp'));
  await sharp(src('footer-screen.png')).extract({ left: 0, top: 640, width: 941, height: 1032 })
    .webp({ quality: 80 }).toFile(out('finale.webp'));

  // independent decorative layers
  await sideStrip('l');
  await sideStrip('r');
  await sharp(src('couple-png.png')).trim().resize({ height: 900 }).webp({ quality: 82, alphaQuality: 90 }).toFile(out('couple.webp'));
  await sharp(src('pooja-png.png')).trim().resize({ width: 820 }).webp({ quality: 82, alphaQuality: 90 }).toFile(out('deepam.webp'));
  const bells = await sharp(src('hanging bells.png')).metadata();
  const half = Math.floor(bells.width / 2);
  for (const [name, left] of [['bell-l', 0], ['bell-r', half]]) {
    const b = await sharp(src('hanging bells.png')).extract({ left, top: 0, width: half, height: bells.height }).png().toBuffer();
    await sharp(b).trim().resize({ height: 760 }).webp({ quality: 82, alphaQuality: 90 }).toFile(out(`${name}.webp`));
  }

  // gallery placeholders (swap for the couple's photographs in config.js)
  const g = (f) => out(`gallery-${f}.webp`);
  const lastFrame = await sharp(src('frame-last.png')).metadata();
  const couple = await sharp(src('couple-png.png')).trim().resize({ height: Math.round(lastFrame.height * 0.5) }).png().toBuffer();
  const cm = await sharp(couple).metadata();
  await sharp(src('frame-last.png'))
    .composite([{ input: couple, left: Math.round((lastFrame.width - cm.width) / 2), top: lastFrame.height - cm.height - 40 }])
    .resize({ width: 640 }).webp({ quality: 80 }).toFile(g('arch'));
  await sharp(src('hero-screen.png')).extract({ left: 120, top: 960, width: 700, height: 560 }).resize({ width: 640 }).webp({ quality: 80 }).toFile(g('gopuram'));
  await sharp(src('footer-screen.png')).extract({ left: 0, top: 1300, width: 941, height: 372 }).resize({ width: 720 }).webp({ quality: 80 }).toFile(g('diyas'));
  const deep = await sharp(src('pooja-png.png')).resize({ width: 600 }).png().toBuffer();
  await sharp({ create: { width: 640, height: 640, channels: 3, background: '#efdcbc' } })
    .composite([{ input: deep, gravity: 'south' }]).webp({ quality: 80 }).toFile(g('deepam'));
  // the doors parting onto golden light, mid-film (frame-light.png = frame 104)
  await sharp(src('frame-light.png')).extract({ left: 40, top: 120, width: 640, height: 800 }).resize({ width: 560 }).webp({ quality: 80 }).toFile(g('light'));
  // the sealed doors from the first frame of the film, framed like a photograph
  await sharp(src('frame-first.png')).extract({ left: 60, top: 100, width: 600, height: 960 }).resize({ width: 520 }).webp({ quality: 80 }).toFile(g('doors'));
  await sharp(src('footer-screen.png')).extract({ left: 0, top: 960, width: 941, height: 520 }).resize({ width: 720 }).webp({ quality: 80 }).toFile(g('sunset'));

  // link preview (og.jpg) is rendered separately from tools/hindu-south-og.html with headless Chrome

  for (const f of readdirSync(OUT)) console.log(f.padEnd(24), (statSync(out(f)).size / 1024).toFixed(0) + ' KB');
}

main().catch((e) => { console.error(e); process.exit(1); });
