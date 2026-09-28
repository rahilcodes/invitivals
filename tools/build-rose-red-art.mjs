/* Builds the Rose Red theme art from the designer's loose transparent elements.
 *
 *   node tools/build-rose-red-art.mjs [folder of element packs]      default: invites/src/rose-red/packs
 *
 * The designer delivers single elements (flowers, lanterns, a card, an envelope…), not finished pages.
 * Each section's still pieces are laid on paper here and saved as ONE plate (<id>-clean.webp), so a guest
 * downloads six pictures, not two hundred. Only what moves (lanterns, sparkles, the couple) stays separate.
 * Where things sit is decided here; where the WORDING sits is in the theme (_themes/rose-red/theme.js).
 * Source PNGs are never modified.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { paintOut } from './lib/paint-out.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.resolve(process.argv[2] || path.join(ROOT, 'invites/src/rose-red/packs'));
const OUT = path.join(ROOT, 'public/engagement/_themes/rose-red/art');
const PACK = { E: 'elements', N: 'nandini_madhu_template', C: 'save_date_calendar', W: 'save_our_date_swans', V: 'venue_malleswaram' };
const W = 1080;                                          // every plate is 1080 wide

if (!fs.existsSync(SRC)) { console.error(`no element packs at ${SRC}\nunzip the designer's packs there (one folder per zip) or pass the folder`); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

/* "N17" → nandini_madhu_template/element_17.png · "E:clean_rosebud" → elements/clean_rosebud.png */
const file = (ref) => {
  const m = /^([A-Z])(\d+)$/.exec(ref);
  return m ? path.join(SRC, PACK[m[1]], `element_${m[2].padStart(2, '0')}.png`) : path.join(SRC, PACK[ref[0]], ref.slice(2) + '.png');
};

/* one element, cut to what is painted and brought to size.
   crop [x0,y0,x1,y1] is in the source's own pixels · clear [[x0,y0,x1,y1]] is in the crop's · w is the final width
   feather softens a hard cut edge */
async function piece(ref, { w, crop, clear, flop, turn, feather, fade } = {}) {
  let img = sharp(file(ref)).ensureAlpha();
  if (crop) img = sharp(await img.extract({ left: crop[0], top: crop[1], width: crop[2] - crop[0], height: crop[3] - crop[1] }).png().toBuffer());
  if (clear) {                                           // rub out a neighbour that came along with the crop
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    for (const [x0, y0, x1, y1] of clear) for (let y = y0; y < Math.min(y1, info.height); y++) for (let x = x0; x < Math.min(x1, info.width); x++) data[(y * info.width + x) * 4 + 3] = 0;
    img = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
  }
  img = sharp(await img.trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 12 }).png().toBuffer());
  if (flop) img = img.flop();
  if (turn) img = sharp(await img.rotate(turn, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer());
  if (w) img = img.resize({ width: Math.round(w), kernel: 'lanczos3' });
  let { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  if (feather) {
    // the edge fades inward: the blurred silhouette, read between 50% and 100%, multiplies the alpha
    const a = Buffer.alloc(info.width * info.height);
    for (let i = 0; i < a.length; i++) a[i] = data[i * 4 + 3];
    const pad = feather * 2;
    // (two steps: sharp always extracts before it extends)
    const wide = await sharp(a, { raw: { width: info.width, height: info.height, channels: 1 } })
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: '#000' }).blur(feather).png().toBuffer();
    const soft = await sharp(wide).extract({ left: pad, top: pad, width: info.width, height: info.height }).extractChannel(0).raw().toBuffer();
    for (let i = 0; i < a.length; i++) data[i * 4 + 3] = Math.round(a[i] * Math.max(0, Math.min(1, (soft[i] / 255 - .5) * 2)));
  }
  if (fade != null) for (let i = 3; i < data.length; i += 4) data[i] = Math.round(data[i] * fade);
  return { data, w: info.width, h: info.height };
}

/* a soft shadow of the element, so it sits on the paper instead of floating over it */
async function shadowOf(p, blur = 9, strength = .3) {
  const pad = blur * 3, n = p.w * p.h, rgba = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) { rgba[i * 4] = 92; rgba[i * 4 + 1] = 30; rgba[i * 4 + 2] = 38; rgba[i * 4 + 3] = Math.round(p.data[i * 4 + 3] * strength); }
  const { data, info } = await sharp(rgba, { raw: { width: p.w, height: p.h, channels: 4 } })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 92, g: 30, b: 38, alpha: 0 } }).blur(blur).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, pad };
}

/* the part of a layer that falls on the canvas (sharp will not composite past an edge) */
async function clip(p, x, y, Wc, Hc) {
  x = Math.round(x); y = Math.round(y);
  const l = Math.max(0, -x), t = Math.max(0, -y), r = Math.min(p.w, Wc - x), b = Math.min(p.h, Hc - y);
  if (r <= l || b <= t) return null;
  const input = await sharp(p.data, { raw: { width: p.w, height: p.h, channels: 4 } }).extract({ left: l, top: t, width: r - l, height: b - t }).png().toBuffer();
  return { input, left: x + l, top: y + t };
}

/* blush paper; its top and bottom edges are the same colour, so plates join without a seam */
async function paper(H, W = 1080) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbeae3"/><stop offset=".5" stop-color="#fdf3ec"/><stop offset="1" stop-color="#fbeae3"/></linearGradient>
      <radialGradient id="c" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#fffaf5" stop-opacity=".95"/><stop offset=".55" stop-color="#fff6f0" stop-opacity=".5"/><stop offset="1" stop-color="#fff6f0" stop-opacity="0"/></radialGradient>
      <linearGradient id="s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9b9b4" stop-opacity=".34"/><stop offset=".16" stop-color="#e9b9b4" stop-opacity="0"/><stop offset=".84" stop-color="#e9b9b4" stop-opacity="0"/><stop offset="1" stop-color="#e9b9b4" stop-opacity=".34"/></linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#c)"/><rect width="100%" height="100%" fill="url(#s)"/></svg>`;
  const grain = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) { const v = Math.random() < .5 ? 255 : 120; grain[i * 4] = v; grain[i * 4 + 1] = v - 30; grain[i * 4 + 2] = v - 40; grain[i * 4 + 3] = Math.floor(Math.random() * 9); }
  return sharp(Buffer.from(svg)).composite([{ input: grain, raw: { width: W, height: H, channels: 4 } }]).png().toBuffer();
}

/* a plate: paper, then the layers in order. layer = [ref or a prepared piece, x, y, options] */
async function plate(id, H, layers, { W = 1080, as = `${id}-clean.webp` } = {}) {
  const comps = [];
  for (const [ref, x, y, o = {}] of layers) {
    const p = typeof ref === 'string' ? await piece(ref, o) : ref;
    if (o.shadow !== false) { const s = await shadowOf(p, o.blur || 9, o.shade || .26); const c = await clip(s, x - s.pad, y - s.pad + (o.drop ?? 8), W, H); if (c) comps.push(c); }
    const c = await clip(p, x, y, W, H); if (c) comps.push(c);
  }
  const out = path.join(OUT, as), img = sharp(await paper(H, W)).composite(comps).removeAlpha();
  await (as.endsWith('.jpg') ? img.jpeg({ quality: 86, mozjpeg: true }) : img.webp({ quality: 84, effort: 6 })).toFile(out);
  report(out, W, H);
}

/* something that stays a separate picture (it moves, or the page places it itself) */
async function cut(name, ref, o = {}) {
  const p = await piece(ref, o), out = path.join(OUT, name + '.webp');
  await sharp(p.data, { raw: { width: p.w, height: p.h, channels: 4 } }).webp({ quality: 86, alphaQuality: 90, effort: 6 }).toFile(out);
  report(out, p.w, p.h);
}
const report = (f, w, h) => console.log(`${path.basename(f).padEnd(24)} ${String(w).padStart(4)}×${String(h).padEnd(5)} ${(fs.statSync(f).size / 1024).toFixed(0).padStart(4)} KB`);

/* ---------------------------------------------------------------- plates ---- */

await plate('hero', 2200, [
  ['N04', 540, -14, { w: 560, shade: .2 }],                                   // burgundy lace corner
  ['N22', -24, 1330, { w: 1128, crop: [0, 0, 1400, 650], feather: 16, shadow: false }],   // the lake and the pavilion
  ['N01', -34, -34, { w: 520 }],                                              // floral corner
  ['N26', 480, 486, { w: 120, shade: .16 }],                                  // lotus
  ['N33', 488, 812, { w: 104, shade: .16 }],                                  // ampersand
  ['N29', 310, 1128, { w: 460, shadow: false }],                              // divider
  ['N19', 40, 1180, { w: 150, turn: -20, shade: .18 }],
  ['N36', 910, 1130, { w: 110, turn: 14, shade: .18 }],
  ['N22', -10, 1862, { w: 1100, crop: [0, 651, 1400, 1100], clear: [[380, 0, 960, 105]], shade: .3 }],   // the terrace rail
]);

await plate('hosts', 1560, [
  ['N02', 110, 6, { w: 860, fade: .92, shade: .12 }],                         // drape across the top
  ['E:clean_large_blush_flower', 306, 40, { w: 190, shade: .3 }],
  ['E:clean_small_blush_flower', 590, 52, { w: 190, shade: .3 }],
  ['E:clean_burgundy_flower', 420, 6, { w: 240, shade: .34 }],
  ['E08', 196, 86, { w: 130, turn: -62, shade: .2 }],
  ['E08', 760, 76, { w: 130, turn: 62, flop: true, shade: .2 }],
  ['N31', -24, 560, { w: 250 }],                                              // flowered columns
  ['N31', 854, 560, { w: 250, flop: true }],
  ['N34', 390, 640, { w: 300, shadow: false }],
  ['N44', 270, 1262, { w: 540 }],                                             // flower bed
  ['N19', 150, 1330, { w: 140, turn: -30, shade: .18 }],
  ['N19', 790, 1330, { w: 140, turn: 30, flop: true, shade: .18 }],
]);

await plate('date', 1900, [
  ['C05', 806, -30, { w: 310 }],
  ['E32', -60, -40, { w: 330, fade: .9, shade: .16 }],
  ['C02', 176, 84, { w: 470, shade: .2, blur: 5, drop: 4 }],                  // “Save Our”
  ['C03', 520, 350, { w: 400, shade: .2, blur: 5, drop: 4 }],                 // “Date”
  ['W01', 16, 650, { w: 1048, crop: [0, 0, 2314, 640], feather: 12, shadow: false }],   // swans on the lake
  ['W02', 90, 1000, { w: 900, shade: .34, blur: 14, drop: 14 }],              // the date card
  ['C35', 305, 1560, { w: 470, shadow: false }],                              // “Add to calendar”
  ['C23', -70, 1590, { w: 430 }],                                             // flowers over the card's corner
  ['W07', 830, 1640, { w: 250, turn: 160 }],
]);

/* the designer's map carries one neighbourhood's name: it is cleared so every venue gets its own, as live text */
const map = await piece('V26', { crop: [40, 205, 910, 585] });
paintOut(map.data, map.w, map.h, 4, { test: (r, g, b) => r < 185 && g < 185 && b < 185 && Math.abs(r - b) < 26, rects: [[190, 165, 680, 352]], grow: 5 });
{
  const { data, info } = await sharp(map.data, { raw: { width: map.w, height: map.h, channels: 4 } }).resize({ width: 860 }).raw().toBuffer({ resolveWithObject: true });
  Object.assign(map, { data, w: info.width, h: info.height });
}

await plate('venue', 1980, [
  ['V10', -30, -30, { w: 360 }],                                              // lanterns under a drape
  ['V35', 800, -60, { w: 330 }],
  ['N26', 480, 150, { w: 120, shade: .16 }],                                  // lotus
  ['N29', 310, 420, { w: 460, shadow: false }],
  [map, 110, 850, { shade: .3, blur: 12, drop: 10 }],
  ['V26', 220, 1276, { w: 640, crop: [100, 585, 850, 745], shade: .3, blur: 8 }],   // “Take me there”
  ['V29', -30, 1430, { w: 230 }],                                             // flowered columns
  ['V29', 880, 1430, { w: 230, flop: true }],
  ['N38', 110, 1760, { w: 330 }],
  ['N38', 640, 1760, { w: 330, flop: true }],
  ['V28', 170, 1620, { w: 740, shade: .34, blur: 12 }],                       // the terrace seat
]);

await plate('thanks', 1600, [
  ['E13', 250, 80, { w: 700, fade: .85, shade: .1 }],                         // each drape's cut end is under a bouquet
  ['E07', 130, 1390, { w: 700, fade: .85, shade: .1, flop: true }],
  ['E04', -70, -60, { w: 500 }],
  ['E04', 650, 1280, { w: 500, turn: 180 }],
  ['N26', 475, 400, { w: 130, shade: .16 }],
  ['N29', 310, 724, { w: 460, shadow: false }],
]);

/* ---------------------------------------------------------------- link preview ---- */
/* og-frame: what tools/make-og.mjs writes a couple's names into · og.jpg: the theme's own banner, used until then */
const banner = [
  ['N04', 800, -14, { w: 420, shade: .2 }],
  ['N01', -30, -30, { w: 330 }],
  ['E04', 890, 380, { w: 380, turn: 180 }],
  ['N19', 300, 500, { w: 100, turn: -30, shade: .18 }],
];
await plate('og-frame', 630, banner, { W: 1200, as: 'og-frame.webp' });
await plate('og', 630, banner.concat([
  ['C02', 330, 120, { w: 330, shade: .2, blur: 5, drop: 4 }],
  ['C03', 590, 300, { w: 290, shade: .2, blur: 5, drop: 4 }],
]), { W: 1200, as: 'og.jpg' });

/* ---------------------------------------------------------------- separate pieces ---- */
await cut('couple', 'N17', { w: 560 });
await cut('lanterns', 'N09', { w: 260 });
await cut('lantern', 'V16', { w: 170 });
await cut('lantern-b', 'W24', { w: 170 });
await cut('spark', 'W36', { w: 120 });
await cut('spark-b', 'C36', { w: 140 });
await cut('drape', 'N05', { w: 520 });
await cut('corner-floral', 'N01', { w: 560 });
await cut('corner-lace', 'N04', { w: 600 });
await cut('bouquet-br', 'E04', { w: 560, turn: 180 });
await cut('env-closed', 'E01', { w: 800 });
await cut('env-open', 'E02', { w: 800 });
