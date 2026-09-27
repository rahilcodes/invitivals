/* Builds Nandini & Madhu's own plates from the designer's source PNGs.
 *
 *   node tools/nandini-madhu-art.mjs [sourceDir]
 *
 * sourceDir defaults to public/engagement/nandini/assets/v2.
 *
 * The client approved this lettering, so their plates keep it. Wording they later asked to change
 * is painted out here and set as live text from invites/nandini-madhu.json instead (it must then be
 * left out of that section's "baked" list). The originals are never modified.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { paintOut, burgundy, navy, gold } from './lib/paint-out.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.resolve(ROOT, process.argv[2] || 'public/engagement/nandini/assets/v2');
const OUT = path.join(ROOT, 'public/engagement/nandini-madhu/art');
const GANESHA = path.join(ROOT, 'invites/src/nandini-madhu/ganesha.jpg');

const PLATE = { quality: 88, effort: 6, smartSubsample: true };
const CUTOUT = { quality: 90, alphaQuality: 95, effort: 6 };

/* what is painted out of each plate: [x0, y0, x1, y1] in image pixels */
const PLATES = [
  // the crest above the title makes room for the Ganesha
  { id: 'ceremony', src: '02_Engagement_Ceremony.png', out: [{ test: gold, grow: 6, rects: [[250, 450, 490, 608]] }] },
  // the hosts' names are live: "K. Shivanna & Taradevi"
  { id: 'welcome', src: '03_Parents_Welcome.png', out: [{ test: burgundy, grow: 10, rects: [[130, 494, 772, 566]] }] },
  { id: 'couple', src: '04_Nandini_Madhu.png' },
  // the date line is live: "15th November 2026"
  { id: 'date-open', src: '06_Save_Our_Date_Open.png', out: [{ test: burgundy, rects: [[210, 570, 530, 610]] }] },
  // the painted map label has garbled Kannada: it is live text
  { id: 'venue', src: '07_Venue_Maps.png', out: [{ test: navy, grow: 4, rects: [[410, 918, 780, 1032]] }] },
  { id: 'family', src: '09_Family_Friends.png' },
];

fs.mkdirSync(OUT, { recursive: true });
for (const P of PLATES) {
  const { data: px, info } = await sharp(path.join(SRC, P.src)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (const job of P.out || []) paintOut(px, info.width, info.height, info.channels, job);
  await sharp(px, { raw: { width: info.width, height: info.height, channels: info.channels } }).flatten({ background: '#f7e2cf' }).webp(PLATE).toFile(path.join(OUT, P.id + '-full.webp'));
  console.log('✓ plate', P.id);
}

/* the Ganesha: the idol in its golden niche, soft-edged so it sits on the plate like a small shrine */
{
  const box = { left: 170, top: 118, width: 640, height: 790 }, W = 400, H = Math.round(W * box.height / box.width);
  const arch = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000"/>
<path fill="#fff" d="M${W * .1} ${H * .9} L${W * .1} ${H * .4} C${W * .1} ${H * .2} ${W * .3} ${H * .06} ${W * .5} ${H * .045} C${W * .7} ${H * .06} ${W * .9} ${H * .2} ${W * .9} ${H * .4} L${W * .9} ${H * .9} Z"/></svg>`);
  const alpha = await sharp(arch).resize(W, H).blur(11).extractChannel(0).raw().toBuffer();
  const rgb = await sharp(GANESHA).extract(box).resize(W, H, { kernel: 'lanczos3' }).modulate({ brightness: 1.04 }).removeAlpha().raw().toBuffer();
  const px = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    px[i * 4] = rgb[i * 3]; px[i * 4 + 1] = rgb[i * 3 + 1]; px[i * 4 + 2] = rgb[i * 3 + 2];
    const y = (i / W | 0) / H, foot = y > .8 ? Math.max(0, 1 - (y - .8) / .12) : 1;   // the steps below the idol melt into the plate
    px[i * 4 + 3] = Math.round(alpha[i] * foot);
  }
  await sharp(px, { raw: { width: W, height: H, channels: 4 } }).webp(CUTOUT).toFile(path.join(OUT, 'ganesha.webp'));
  console.log('✓ ganesha', W + '×' + H);
}
