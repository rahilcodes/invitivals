/* Draws public/saicharan-lakshmi-engagement/assets/og.jpg (1200×630), the banner WhatsApp shows under the link,
 * from the built art: the couple on the left, the gold lettering and the date on the right.
 *
 *   node tools/saicharan-lakshmi-og.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const A = path.join(ROOT, 'public/saicharan-lakshmi-engagement/assets');
const W = 1200, H = 630;

const bg = await sharp(path.join(A, 'bg/p1.webp')).resize({ width: W, height: H, fit: 'cover', position: 'top' }).modulate({ brightness: 1.02 }).toBuffer();
const couple = await sharp(path.join(A, 'el/couple.webp')).resize({ height: 600 }).toBuffer();
const engagement = await sharp(path.join(A, 'el/engagement.webp')).resize({ width: 460 }).toBuffer();
const first = await sharp(path.join(A, 'el/saicharan.webp')).resize({ width: 470 }).toBuffer();
const second = await sharp(path.join(A, 'el/lakshmi.webp')).resize({ width: 420 }).toBuffer();
const garland = await sharp(path.join(A, 'el/garland.webp')).resize({ width: 150 }).toBuffer();
const text = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>.c{font-family:Georgia,'Times New Roman',serif;fill:#4f5a3a;letter-spacing:5px;text-anchor:middle}</style>
  <text x="760" y="72" class="c" font-size="21">YOU ARE INVITED TO THE</text>
  <text x="760" y="292" class="c" font-size="22">CEREMONY OF</text>
  <text x="760" y="596" class="c" font-size="24">SUNDAY · 1 NOVEMBER 2026 · 11:00 AM</text>
</svg>`);
await sharp(bg)
  .composite([
    { input: couple, left: 30, top: H - 600 },
    { input: engagement, left: 530, top: 95 },
    { input: text, left: 0, top: 0 },
    { input: first, left: 525, top: 308 },
    { input: garland, left: 685, top: 404 },
    { input: second, left: 550, top: 440 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(A, 'og.jpg'));
console.log('wrote assets/og.jpg');
