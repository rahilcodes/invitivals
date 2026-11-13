/* Christian wedding "Golden Aisle" demo (public/christian-wedding): builds the page art from the
 * designer's pack in invites/src/christian-wedding/cristian wedding/ (the zip, not committed).
 *
 *   node tools/build-christian-wedding-art.mjs            everything
 *   node tools/build-christian-wedding-art.mjs og         the link-preview banner only
 *
 * The clean plates (2.png hero, SCREENING 8–15, ENDING) are used whole as backgrounds; the elements are
 * trimmed to their alpha and saved as WebP with alpha; nothing is redrawn or recoloured. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'invites/src/christian-wedding/cristian wedding';
const EL = path.join(SRC, 'ELEMENTS');
const SITE = 'public/christian-wedding';
const OUT = path.join(SITE, 'assets');
const MUSIC = 'C:/Users/Win/Downloads/Jessie\'s Land.mp3';
fs.mkdirSync(OUT, { recursive: true });

const only = process.argv[2];
const FL = fs.readdirSync(path.join(EL, 'FLOWERS AND CANDLE')).sort((a, b) => Number(a.match(/-(\d+)\.png$/)[1]) - Number(b.match(/-(\d+)\.png$/)[1]));
const flower = (n) => path.join(EL, 'FLOWERS AND CANDLE', FL[n - 1]);

/* a full-page plate: opaque, quality tuned for a 941-px column */
async function plate(src, name, { width = 941, quality = 78 } = {}) {
  await sharp(src).resize({ width }).webp({ quality }).toFile(path.join(OUT, `${name}.webp`));
  log(name);
}
/* a transparent element: trimmed to its alpha, resized, alpha kept */
async function piece(src, name, { width, quality = 82 } = {}) {
  let s = sharp(src).ensureAlpha().trim({ threshold: 12 });
  if (width) s = s.resize({ width, withoutEnlargement: true });
  await s.webp({ quality, alphaQuality: 90 }).toFile(path.join(OUT, `${name}.webp`));
  log(name);
}
/* a photograph: the pack's photos come on a transparent canvas inside their own rounded gold-and-cream
   frame; the picture itself starts `inset` px inside the opaque edge (measured from the files: border
   + enough to clear the rounded inner corner), so the page can frame it once, its own way */
async function photo(src, name, { inset, width = 900, quality = 80 } = {}) {
  const trimmed = await sharp(src).ensureAlpha().trim({ threshold: 12 }).png().toBuffer();
  const m = await sharp(trimmed).metadata();
  await sharp(trimmed).extract({ left: inset, top: inset, width: m.width - 2 * inset, height: m.height - 2 * inset })
    .flatten({ background: '#f7ecd9' }).resize({ width }).webp({ quality }).toFile(path.join(OUT, `${name}.webp`));
  log(name);
}
const log = (name) => process.stdout.write(`${name} `);

async function og() {
  // the link preview: the with-text reference's names block over the aisle, 1200×630
  const ref = path.join(SRC, 'WITH TEXT TEMPLATE', 'Golden Aisle Wedding Invitation.png');
  const bg = await sharp(path.join(SRC, '2.png')).resize(1200, 630, { fit: 'cover', position: 'centre' }).blur(18).modulate({ brightness: 1.04 }).toBuffer();
  // the names sit at about y 880–1230 of the 1672-px reference; the card shows that band with the couple above it
  const card = await sharp(ref).extract({ left: 90, top: 300, width: 761, height: 1000 }).resize({ height: 630 }).toBuffer();
  const cw = Math.round((761 / 1000) * 630);
  await sharp(bg).composite([{ input: card, left: Math.round((1200 - cw) / 2), top: 0 }]).jpeg({ quality: 86 }).toFile(path.join(OUT, 'og.jpg'));
  log('og');
}

if (only === 'og') { await og(); console.log(); process.exit(0); }

await plate(path.join(SRC, '1.png'), 'opening', { quality: 80 });
await plate(path.join(SRC, '2.png'), 'hero', { quality: 82 });
for (const n of [8, 9, 10, 11, 12, 13, 14, 15]) await plate(path.join(SRC, `SCREENING (${n}).png`), `plate${n}`);
await plate(path.join(SRC, 'ENDING.png'), 'ending', { quality: 82 });
// the wide-screen backdrop: a plate, small and already blurred, so the page never blurs at runtime
await sharp(path.join(SRC, 'SCREENING (10).png')).resize({ width: 320 }).blur(10).webp({ quality: 70 }).toFile(path.join(OUT, 'backdrop.webp'));
log('backdrop');

await piece(path.join(EL, '04_Couple_and_Gallery_Photos', 'bride_and_groom_back_facing_transparent_cutout.png'), 'couple', { width: 760, quality: 86 });

// flowers and candles (ELEMENTS/FLOWERS AND CANDLE, numbered 1–10 in the designer's order)
await piece(flower(1), 'fl-sparkles', { width: 520, quality: 55 });
await piece(flower(2), 'fl-cascade', { width: 420 });
await piece(flower(3), 'fl-cluster-a', { width: 640 });
await piece(flower(4), 'fl-cluster-b', { width: 560 });
await piece(flower(5), 'candle-one', { width: 300 });
await piece(flower(6), 'candle-three', { width: 520 });
await piece(flower(7), 'fl-bouquet', { width: 720 });
await piece(flower(8), 'fl-candle-flowers', { width: 640 });
await piece(flower(9), 'fl-rose', { width: 520 });
await piece(flower(10), 'fl-lily', { width: 520 });

// the scratch card
await piece(path.join(EL, '01_Scratch_Reveal_and_Cards', 'date_reveal_card_blank.png'), 'card', { width: 900, quality: 84 });
await piece(path.join(EL, '01_Scratch_Reveal_and_Cards', 'gold_scratch_foil_overlay.png'), 'foil', { width: 900, quality: 80 });
await piece(path.join(EL, '01_Scratch_Reveal_and_Cards', 'ivory_scratch_brush_reveal.png'), 'brush', { width: 600 });

// gold line icons
for (const n of ['calendar', 'camera', 'champagne', 'church', 'map_pin', 'rings']) await piece(path.join(EL, '02_Gold_Icons', `icon_${n}.png`), `icon-${n.replace('_', '-')}`, { width: 240 });

// venues and photographs
await photo(path.join(EL, '03_Venue_Assets', 'st_marys_church_photo.png'), 'venue-church', { inset: 30 });
await photo(path.join(EL, '03_Venue_Assets', 'reception_hotel_photo.png'), 'venue-reception', { inset: 28 });
const G = path.join(EL, '04_Couple_and_Gallery_Photos');
await photo(path.join(G, 'gallery_closeup.png'), 'photo-closeup', { inset: 44 });
await photo(path.join(G, 'gallery_bouquet_and_rings.png'), 'photo-rings', { inset: 48 });
await photo(path.join(G, 'gallery_beach.png'), 'photo-beach', { inset: 48 });
await photo(path.join(G, 'gallery_walking.png'), 'photo-walking', { inset: 44 });
await photo(path.join(G, 'polaroid_bride_groom.png'), 'photo-polaroid', { inset: 60, width: 800 });
await sharp(path.join(G, 'gallery_gold_photo_frame.png')).webp({ quality: 84, alphaQuality: 92 }).toFile(path.join(OUT, 'frame.webp'));
log('frame');

// the venue card: the pack's blank information panel
await piece(path.join(EL, '03_Venue_Assets', 'venue_information_panel_blank.png'), 'panel', { width: 1000, quality: 86 });

// countdown ring and the gold divider
await piece(path.join(EL, '06_Extra_UI_Elements', 'countdown_round_counter_blank.png'), 'counter', { width: 400, quality: 84 });
await piece(path.join(EL, '06_Extra_UI_Elements', 'gold_ornamental_divider.png'), 'divider', { width: 800 });

// the film and the music, as supplied
fs.copyFileSync(path.join(SRC, 'VIDEO.mp4'), path.join(OUT, 'opening.mp4'));
if (fs.existsSync(MUSIC)) fs.copyFileSync(MUSIC, path.join(OUT, 'music.mp3')); else console.warn('\nmusic not found at', MUSIC);
log('film+music');
await og();
console.log('\ndone →', OUT);
