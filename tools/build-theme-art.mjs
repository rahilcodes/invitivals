/* Builds the shared "floral-palace" engagement theme art from the designer's source PNGs.
 *
 *   node tools/build-theme-art.mjs [sourceDir]
 *
 * sourceDir defaults to public/engagement/nandini/assets/v2 (the supplied reference PNGs).
 *
 * For every section it writes to public/engagement/_themes/floral-palace/art/:
 *   <id>-clean.webp   the plate with every text / ornament block cleared (what is on screen before the reveal)
 *   <id>-full.webp    the plate with its ornaments and generic wording, but with the PERSONAL wording
 *                     (names, date, venue) painted out, so any couple's details can be set over it as live text
 * and the door, overlay and share-preview images. The originals are never modified.
 *
 * A client's own plates and share preview are not made here: see tools/nandini-madhu-art.mjs and tools/make-og.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { paintOut, burgundy, navy } from './lib/paint-out.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.resolve(ROOT, process.argv[2] || 'public/engagement/nandini/assets/v2');
const THEME = path.join(ROOT, 'public/engagement/_themes/floral-palace');
const ART = path.join(THEME, 'art');
const AUDIO_SRC = path.resolve(SRC, '..', 'audio', 'background.mp3');

const PLATE = { quality: 88, effort: 6, smartSubsample: true };
const CUTOUT = { quality: 90, alphaQuality: 95, effort: 6 };

/* anything that is not the pale sky of the plate: lettering, gold, the envelope */
const ink = (r, g, b) => (r * .3 + g * .59 + b * .11) < 212 || Math.max(r, g, b) - Math.min(r, g, b) > 70;
const all = () => true;
/* the date section's resting plate is made here: the supplied one leaves a hard-edged patch behind the opened envelope */
const DATE_CLEAN = [
  { test: all, rects: [[116, 584, 626, 978]], grow: 0, omega: 1.97, passes: 1800 },
  { test: ink, rects: [[164, 282, 568, 442], [164, 436, 596, 590], [168, 884, 572, 1020]], grow: 7 },
];

/* personal wording per source image: [x0, y0, x1, y1] in image pixels */
const PERSONAL = {
  '03_Parents_Welcome.png': { test: burgundy, grow: 10, rects: [[200, 412, 700, 478], [130, 494, 772, 566], [130, 674, 772, 860]] },
  '04_Nandini_Madhu.png': { test: burgundy, grow: 11, rects: [[100, 322, 606, 472], [100, 558, 606, 708]] },
  '06_Save_Our_Date_Open.png': { test: burgundy, rects: [[300, 534, 440, 570], [210, 570, 530, 610], [250, 660, 358, 720], [474, 654, 576, 734]] },
  '07_Venue_Maps.png': { test: burgundy, grow: 9, rects: [[190, 314, 990, 460]] },
  '09_Family_Friends.png': { test: burgundy, grow: 6, rects: [[150, 734, 540, 792]] },
};
/* the painted map carries an area label (with garbled local script): cleared everywhere, set as live text instead */
const MAP_LABEL = { test: navy, rects: [[410, 918, 780, 1032]], grow: 4 };

const SECTIONS = [
  { id: 'ceremony', src: '02_Engagement_Ceremony.png' },
  { id: 'welcome', src: '03_Parents_Welcome.png' },
  { id: 'couple', src: '04_Nandini_Madhu.png' },
  { id: 'date', src: '05_Save_Our_Date_Closed.png', ownClean: DATE_CLEAN },
  { id: 'date-open', src: '06_Save_Our_Date_Open.png', noClean: true },
  { id: 'venue', src: '07_Venue_Maps.png', map: true },
  { id: 'thanks', src: '08_Thank_You.png' },
  { id: 'family', src: '09_Family_Friends.png' },
];
const CUTOUTS = {
  'door-leaf-l': 'door_leaf_l.png', 'door-leaf-r': 'door_leaf_r.png', 'door-pendant': 'door_pendant_cut.png',
  'lantern-gold': '01_hanging_lantern_gold.png', 'lantern-round': '02_hanging_lantern_round.png',
  'floral-pink-white': '04_floral_hanging_pink_white.png', 'floral-daisy': '06_floral_hanging_daisy.png',
};

/* the envelope as a cut-out: whatever differs from the emptied plate, closed into a solid shape, soft-edged */
const ENV_RECT = [116, 584, 626, 978];
/* the envelope's solid shape: whatever differs from a roughly emptied plate, closed row- and column-wise.
   The tap hint below it (hand + line of text) is not part of the envelope. */
function envelopeHull(orig, rough) {
  const [x0, y0, x1, y1] = ENV_RECT, w = x1 - x0, h = y1 - y0, W = orig.W, C = orig.C;
  const m = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (y + y0 >= 912 && x + x0 > 250 && x + x0 < 500) continue;
    const i = ((y + y0) * W + x + x0) * C;
    if (Math.abs(orig.px[i] - rough.px[i]) + Math.abs(orig.px[i + 1] - rough.px[i + 1]) + Math.abs(orig.px[i + 2] - rough.px[i + 2]) > 48) m[y * w + x] = 1;
  }
  const rows = new Uint8Array(w * h), hull = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) { let a = -1, b = -1; for (let x = 0; x < w; x++) if (m[y * w + x]) { if (a < 0) a = x; b = x; } for (let x = a; a >= 0 && x <= b; x++) rows[y * w + x] = 1; }
  for (let x = 0; x < w; x++) { let a = -1, b = -1; for (let y = 0; y < h; y++) if (m[y * w + x]) { if (a < 0) a = y; b = y; } for (let y = a; a >= 0 && y <= b; y++) if (rows[y * w + x]) hull[y * w + x] = 1; }
  return { hull, w, h, x0, y0, has: (x, y) => x >= x0 && x < x1 && y >= y0 && y < y1 && hull[(y - y0) * w + x - x0] === 1 };
}
async function cutEnvelope(orig, H, out) {
  const { hull, w, h, x0, y0 } = H, W = orig.W, C = orig.C, rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = ((y + y0) * W + x + x0) * C, o = (y * w + x) * 4;
    rgba[o] = orig.px[i]; rgba[o + 1] = orig.px[i + 1]; rgba[o + 2] = orig.px[i + 2]; rgba[o + 3] = hull[y * w + x] ? 255 : 0;
  }
  const alpha = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).extractChannel(3).blur(1.1).raw().toBuffer();
  for (let i = 0; i < w * h; i++) rgba[i * 4 + 3] = alpha[i];
  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).webp(CUTOUT).toFile(out);
}

async function load(file) {
  const { data, info } = await sharp(path.join(SRC, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { px: data, W: info.width, H: info.height, C: info.channels };
}
const save = (im, out, opts = PLATE) => sharp(im.px, { raw: { width: im.W, height: im.H, channels: im.C } }).flatten({ background: '#f7e2cf' }).webp(opts).toFile(out);

fs.mkdirSync(ART, { recursive: true });
let before = 0, after = 0;
const size = (f) => fs.statSync(f).size;

for (const S of SECTIONS) {
  const full = await load(S.src); before += size(path.join(SRC, S.src));
  if (PERSONAL[S.src]) paintOut(full.px, full.W, full.H, full.C, PERSONAL[S.src]);
  if (S.map) paintOut(full.px, full.W, full.H, full.C, MAP_LABEL);
  await save(full, path.join(ART, S.id + '-full.webp')); after += size(path.join(ART, S.id + '-full.webp'));
  if (S.ownClean) {
    const orig = await load(S.src), rough = await load(S.src), clean = await load(S.src);
    paintOut(rough.px, rough.W, rough.H, rough.C, S.ownClean[0]);
    const hull = envelopeHull(orig, rough);
    paintOut(clean.px, clean.W, clean.H, clean.C, { ...S.ownClean[0], test: (r, g, b, x, y) => hull.has(x, y), rects: [[ENV_RECT[0] - 10, ENV_RECT[1] - 10, ENV_RECT[2] + 10, ENV_RECT[3] + 10]], grow: 6 });
    for (const job of S.ownClean.slice(1)) paintOut(clean.px, clean.W, clean.H, clean.C, job);
    await cutEnvelope(orig, hull, path.join(ART, 'date-envelope.webp'));
    await save(clean, path.join(ART, S.id + '-clean.webp')); after += size(path.join(ART, S.id + '-clean.webp'));
  } else if (!S.noClean) {
    const cleanSrc = S.src.replace(/\.png$/, '_clean.png');
    const clean = await load(cleanSrc); before += size(path.join(SRC, cleanSrc));
    if (S.map) paintOut(clean.px, clean.W, clean.H, clean.C, MAP_LABEL);
    await save(clean, path.join(ART, S.id + '-clean.webp')); after += size(path.join(ART, S.id + '-clean.webp'));
  }
  console.log('✓ section', S.id);
}

await sharp(path.join(SRC, '01_Door_Opening.png')).webp(PLATE).toFile(path.join(ART, 'door.webp'));
before += size(path.join(SRC, '01_Door_Opening.png')); after += size(path.join(ART, 'door.webp'));
for (const [name, file] of Object.entries(CUTOUTS)) {
  await sharp(path.join(SRC, file)).webp(CUTOUT).toFile(path.join(ART, name + '.webp'));
  before += size(path.join(SRC, file)); after += size(path.join(ART, name + '.webp'));
}
console.log('✓ door + overlays');

/* link previews (WhatsApp / iMessage): 1200x630 */
await sharp(path.join(SRC, '01_Door_Opening.png')).extract({ left: 0, top: 392, width: 864, height: 454 }).resize(1200, 630).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(ART, 'og.jpg'));
console.log('✓ share preview');

if (fs.existsSync(AUDIO_SRC)) { fs.mkdirSync(path.join(THEME, 'audio'), { recursive: true }); fs.copyFileSync(AUDIO_SRC, path.join(THEME, 'audio', 'background.mp3')); console.log('✓ audio'); }

/* fonts are served from our own folder (no third-party request before the invitation can draw) */
const FONTS = path.join(ROOT, 'public/engagement/_engine/v1/fonts'); fs.mkdirSync(FONTS, { recursive: true });
const FS = path.join(ROOT, 'node_modules/@fontsource');
for (const f of ['cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2', 'cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2',
  'cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff2', 'cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2',
  'pinyon-script/files/pinyon-script-latin-400-normal.woff2', 'marcellus/files/marcellus-latin-400-normal.woff2']) {
  fs.copyFileSync(path.join(FS, f), path.join(FONTS, path.basename(f)));
}
console.log('✓ fonts');
console.log(`\nArtwork: ${(before / 1048576).toFixed(1)} MB of PNG → ${(after / 1048576).toFixed(1)} MB of WebP`);
