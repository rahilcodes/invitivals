/* Muslim emerald & gold wedding (public/muslim-emerald-wedding): turns the designer
 * pack "MUSLIM TEMP 2" in invites/src/muslim-temp-2-zip/ into web assets.
 *   node tools/build-muslim-emerald-art.mjs
 * Backgrounds: WebP q90 at 941×1672. Elements: transparent padding trimmed, WebP with
 * alpha. The scratch-card plate is cut from scratch_date_after.png and from the plate
 * painted into 3.png. 10.png carries blank form boxes at positions that do not match
 * the designer's own text reference (WITH TEXT TEMP/9.png), so that band is patched
 * with the page's own parchment and the form is rebuilt in HTML over it.
 * Prints a JSON of every asset's size for js/art-sizes.js.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'invites/src/muslim-temp-2-zip/MUSLIM TEMP 2';
const EL = `${SRC}/ELEMENTS/wedding_template_png_assets`;
const FN = `${SRC}/ELEMENTS/functions`;
const OUT = 'public/muslim-emerald-wedding/assets';
fs.mkdirSync(OUT, { recursive: true });

const W = 941, H = 1672;
const sizes = {};
const log = (k, w, h) => { sizes[k] = [w, h]; console.log(k.padEnd(18), w, h); };

/* ── backgrounds ── */
for (let n = 1; n <= 11; n++) {
  let img = sharp(`${SRC}/${n}.png`).resize(W, H, { fit: 'fill' });
  if (n === 10) {
    // the blank boxes + button sit in x 200–750, y 455–1000; clone the clean parchment band above them
    const band = await sharp(`${SRC}/10.png`).extract({ left: 200, top: 300, width: 550, height: 155 }).toBuffer();
    const flipped = await sharp(band).flip().toBuffer();
    const pieces = [];
    for (let y = 0, i = 0; y < 560; y += 155, i++) pieces.push({ input: i % 2 ? flipped : band, left: 0, top: y });
    const patch = await sharp({ create: { width: 550, height: 620, channels: 3, background: '#f3e6c8' } }).composite(pieces).png().toBuffer();
    // feather the patch edges so the join is invisible
    const mask = Buffer.from(`<svg width="550" height="620"><defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset=".06" stop-color="#fff"/><stop offset=".94" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><linearGradient id="h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset=".05" stop-color="#fff"/><stop offset=".95" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs><rect width="550" height="620" fill="url(#v)"/><rect width="550" height="620" fill="url(#h)" style="mix-blend-mode:multiply"/></svg>`);
    const alpha = await sharp(mask).greyscale().toBuffer();
    const soft = await sharp(patch).joinChannel(alpha).png().toBuffer();
    img = sharp(await sharp(`${SRC}/10.png`).composite([{ input: soft, left: 200, top: 440 }]).png().toBuffer()).resize(W, H, { fit: 'fill' });
  }
  await img.webp({ quality: 90 }).toFile(`${OUT}/bg${n}.webp`);
  log(`bg${n}`, W, H);
}

/* ── transparent elements: trim, keep alpha ── */
const elements = {
  // wedding_template_png_assets — hero decorations (1024×1536 canvases, trimmed here)
  'lantern-1': `${EL}/lantern_hanging_01.png`,
  'lantern-2': `${EL}/lantern_hanging_02.png`,
  'lantern-3': `${EL}/lantern_hanging_03.png`,
  'vine-1': `${EL}/flower_hanging_01.png`,
  'vine-2': `${EL}/flower_hanging_02.png`,
  couple: `${EL}/bride_groom_couple.png`,
  // Our_Functions set
  'f-lantern-1': `${FN}/lantern_hanging_01.png`,
  'f-lantern-2': `${FN}/lantern_hanging_02.png`,
  'f-lantern-3': `${FN}/lantern_hanging_03.png`,
  'f-divider': `${FN}/gold_floral_divider_01.png`,
  'f-line-2': `${FN}/gold_line_divider_02.png`,
  'f-line-3': `${FN}/gold_line_divider_03.png`,
  'f-line-4': `${FN}/gold_line_divider_04.png`,
  'f-corner': `${FN}/gold_ornate_corner.png`,
  'f-arch': `${FN}/gold_arch_frame.png`,
  'f-card-1': `${FN}/event_card_gold_border_01.png`,
  'f-card-2': `${FN}/event_card_gold_border_02.png`,
  'f-card-3': `${FN}/event_card_gold_border_03.png`,
  'f-bowl': `${FN}/marigold_brass_bowl.png`,
  'f-urn': `${FN}/mayun_flower_urn.png`,
  'f-marigold': `${FN}/mayun_marigold_pair.png`,
  'f-mehendi': `${FN}/mehendi_emerald_lounge_vignette.png`,
  'f-nikah': `${FN}/nikah_stage_vignette.png`,
  'f-valima': `${FN}/valima_banquet_vignette.png`,
  'f-sprig-4': `${FN}/white_floral_hanging_sprig_04.png`,
  'f-cluster-1': `${FN}/white_flower_leaf_cluster_01.png`,
  'f-sprig-3': `${FN}/white_flower_leaf_sprig_03.png`,
  'f-flower-2': `${FN}/white_flower_single_02.png`,
};
for (const [id, file] of Object.entries(elements)) {
  const { data, info } = await sharp(file).ensureAlpha().trim({ threshold: 8 }).webp({ quality: 90, alphaQuality: 90 }).toBuffer({ resolveWithObject: true });
  fs.writeFileSync(`${OUT}/${id}.webp`, data);
  log(id, info.width, info.height);
}

/* ── scratch card: the plate painted into 3.png is x 199–727 / y 675–1023 of 941×1672 ──
   The "after" plate (gold brush + 13 December 2025) is squarer than that plate, so the
   centre band of its interior is taken at the same aspect ratio and sits exactly over it. */
const PLATE = { left: 199, top: 675, width: 529, height: 349 };
await sharp(`${SRC}/3.png`).extract(PLATE).webp({ quality: 92 }).toFile(`${OUT}/plate-before.webp`);
log('plate-before', PLATE.width, PLATE.height);
const aw = 880, ah = Math.round(aw * PLATE.height / PLATE.width);
await sharp(`${EL}/scratch_date_after.png`).flatten({ background: '#d9b45a' }).extract({ left: 121, top: Math.round(696 - ah / 2), width: aw, height: ah }).webp({ quality: 92 }).toFile(`${OUT}/plate-after.webp`);
log('plate-after', aw, ah);

/* ── reference (kept for comparison only, not shown) and OG image ── */
await sharp(`${SRC}/MOCKUP.png`).resize({ width: 900 }).jpeg({ quality: 80 }).toFile(`${OUT}/mockup-reference.jpg`);
const ogText = Buffer.from(`<svg width="1200" height="630"><defs><filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#000" flood-opacity=".55"/></filter></defs>
<rect width="1200" height="630" fill="rgba(10,40,25,.28)"/>
<text x="600" y="250" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="44" fill="#f6ead0" filter="url(#s)">Wedding Invitation</text>
<text x="600" y="340" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="60" fill="#fff4dc" filter="url(#s)">Dr. Ayesha Fatima &amp; U. Syed Rehan Ali</text>
<text x="600" y="410" text-anchor="middle" font-family="Georgia, serif" font-size="30" letter-spacing="6" fill="#f6ead0" filter="url(#s)">13 DECEMBER 2025 · FALAKNUMA PALACE, HYDERABAD</text></svg>`);
await sharp(`${SRC}/2.png`).resize(1200, 630, { fit: 'cover', position: 'centre' }).composite([{ input: ogText }]).jpeg({ quality: 85 }).toFile(`${OUT}/og.jpg`);

fs.writeFileSync('public/muslim-emerald-wedding/js/art-sizes.js',
  `/* generated by tools/build-muslim-emerald-art.mjs — [width, height] of every asset */\nexport const artSizes = ${JSON.stringify(sizes, null, 0).replace(/\],"/g, '],\n  "').replace('{', '{\n  ').replace('}', ',\n}')};\n`);
console.log('\nwritten', path.resolve(OUT));
