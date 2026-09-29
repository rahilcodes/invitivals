/* Builds the Rose Red theme art from the designer's finished pages.
 *
 *   node tools/build-rose-red-art.mjs [folder of pages]      default: invites/src/rose-red/pages
 *
 * Each page is used whole, exactly as it was painted — nothing is cut up or re-arranged. Only the wording
 * that belongs to one couple (names, hosts, date, venue, the map's place name) is cleared from it, so the
 * theme can set it again as live text for anyone. Wording that suits every couple stays as painted.
 * Rects are in the page's own pixels; the same numbers are used by _themes/rose-red/theme.js.
 * Source pages are never modified.
 *
 *   pages/1.jpg thank you · 2.jpg venue · 3.jpg the date · 4.jpg the date, still covered · 5.jpg the couple · 6.jpg the envelope
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { paintOut } from './lib/paint-out.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.resolve(process.argv[2] || path.join(ROOT, 'invites/src/rose-red/pages'));
const OUT = path.join(ROOT, 'public/engagement/_themes/rose-red/art');
const UP = 1.5;                                          // the pages are phone screenshots: drawn larger so they stay clean on a sharp screen

if (!fs.existsSync(SRC)) { console.error(`no pages at ${SRC}`); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

const cream = (r, g, b) => r > 138 && g > 112 && r - b < 150;          // the painted wording
const glow = (r, g, b) => r > 122 && g > 60 && g > b;                   // wording with a warm glow round it
const ink = (r, g, b) => r < 150 && g < 150 && b < 150 && Math.abs(r - b) < 30;   // the map's black lettering
const report = (f, w, h) => console.log(`${path.basename(f).padEnd(22)} ${String(w).padStart(4)}×${String(h).padEnd(5)} ${(fs.statSync(f).size / 1024).toFixed(0).padStart(4)} KB`);

async function load(n) {
  const { data, info } = await sharp(path.join(SRC, n + '.jpg')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}
const larger = (p) => sharp(p.data, { raw: { width: p.w, height: p.h, channels: 3 } })
  .resize({ width: Math.round(p.w * UP), kernel: 'lanczos3' }).sharpen({ sigma: .6, m1: .4, m2: 1.2 });

/* a page with its personal wording cleared: clear = [[test, rects, grow]] */
async function plate(id, n, clear = []) {
  const p = await load(n);
  for (const [test, rects, grow = 5] of clear) paintOut(p.data, p.w, p.h, 3, { test, rects, grow, passes: 1400 });
  const out = path.join(OUT, `${id}.webp`);
  await larger(p).webp({ quality: 84, effort: 6 }).toFile(out);
  report(out, Math.round(p.w * UP), Math.round(p.h * UP));
  return p;
}

/* ---- the couple ---- */
await plate('couple-page', 5, [[cream, [
  // rects overlap, because a rect's outermost ring is what its fill grows in from and is never cleared
  [160, 304, 750, 366],                                                  // the hosts
  [200, 360, 720, 494],                                                  // the invitation lines
  [150, 494, 770, 664], [150, 656, 398, 686], [492, 656, 770, 686],      // first name (the "&" between the names stays)
  [170, 734, 730, 890], [170, 708, 404, 742], [486, 708, 730, 742],      // second name
]]]);

/* ---- the date ---- */
await plate('date-page', 3, [[glow, [[344, 634, 560, 712], [208, 700, 728, 774], [270, 786, 640, 846]], 7]]);

/* what covers the date until the guest swipes it away: the same card, from the designer's covered page */
{
  const R = [108, 606, 792, 968], f = 26;                                // soft-edged, so it lies on the plate without a border
  const p = await load(4), w = R[2] - R[0], h = R[3] - R[1], rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const s = ((y + R[1]) * p.w + x + R[0]) * 3, d = (y * w + x) * 4, e = Math.min(x, y, w - 1 - x, h - 1 - y);
    rgba[d] = p.data[s]; rgba[d + 1] = p.data[s + 1]; rgba[d + 2] = p.data[s + 2]; rgba[d + 3] = Math.round(255 * Math.min(1, e / f));
  }
  const out = path.join(OUT, 'date-cover.webp');
  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).resize({ width: Math.round(w * UP), kernel: 'lanczos3' }).webp({ quality: 86, alphaQuality: 90, effort: 6 }).toFile(out);
  report(out, Math.round(w * UP), Math.round(h * UP));
}

/* ---- the venue ---- */
await plate('venue-page', 2, [
  [cream, [[88, 362, 628, 470], [104, 476, 606, 598]]],
  [ink, [[212, 758, 498, 840]], 4],
]);

/* ---- thank you, and the envelope: as painted ---- */
await plate('thanks-page', 1);
await plate('envelope', 6);
{
  // a small soft copy of the envelope: it fills whatever a tall or wide screen leaves around the artwork
  const out = path.join(OUT, 'envelope-soft.webp');
  await sharp(path.join(SRC, '6.jpg')).resize({ width: 229 }).blur(9).modulate({ brightness: .82 }).webp({ quality: 70 }).toFile(out);
  report(out, 229, 400);
}
