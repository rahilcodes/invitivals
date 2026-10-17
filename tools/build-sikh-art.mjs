/* build-sikh-art.mjs — turn the designer source pack into the optimised runtime
   assets the Sikh "Royal Ivory & Sapphire" invitation ships.

   Sources (gitignored, large):   invites/src/sikh-premium/*.png + the two
   intro frames extracted from the film (intro-poster-src / intro-last-src).
   Output (committed, small webp): public/sikh-premium/assets/

   Run:  node tools/build-sikh-art.mjs
*/
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'invites/src/sikh-premium');
const OUT = join(root, 'public/sikh-premium/assets');
mkdirSync(join(OUT, 'gallery'), { recursive: true });

const s = (f) => join(SRC, f);
const o = (f) => join(OUT, f);
const names = {
  archway: 'Golden Archway Over a Serene Gurdwara.png',
  temple: 'Golden Temple Reflections at Sunrise.png',
  frame: 'Ornate Golden Temple Floral Frame.png',
  garland: 'Ivory, Blue, and Gold Floral Garland.png',
  lantern: 'Ornate Blue and Gold Lantern Floral Arrangement.png',
  bell: 'Ornate Golden Blue-Enamel Bell Pendant.png',
  arch: 'Ornate Golden Mughal Arch with Blue Drapery.png',
  dhol: 'Ornate Punjabi Dhol with Blue Tassels.png',
  horse: 'Ornate Royal Horse with Blue Plume.png',
  couple: 'Punjabi Wedding Couple in Navy and Gold.png',
  khanda: 'Ornate Golden Khanda Pendant.png',
};

if (!existsSync(s(names.couple))) {
  console.error('Source pack missing at', SRC, '\nPut the designer PNGs there first (see the memory note).');
  process.exit(1);
}

const log = (f, extra = '') => console.log('  ✓', f, extra);

/* an opaque scene → sized webp */
async function scene(src, out, width, q = 80) {
  await sharp(s(src)).resize({ width, withoutEnlargement: true })
    .webp({ quality: q }).toFile(o(out));
  log(out);
}
/* a transparent cut-out → trimmed & sized webp (keeps the alpha) */
async function cutout(src, out, width, q = 86, trimT = 14) {
  await sharp(s(src)).trim({ threshold: trimT }).resize({ width, withoutEnlargement: true })
    .webp({ quality: q, alphaQuality: 100 }).toFile(o(out));
  log(out);
}

async function run() {
  console.log('Building Sikh invitation art →', OUT);

  /* ── intro film stills (handoff) ───────────────────────── */
  await sharp(s('intro-poster-src.png')).resize({ width: 720 }).webp({ quality: 82 }).toFile(o('intro-poster.webp'));
  log('intro-poster.webp');
  await sharp(s('intro-last-src.png')).resize({ width: 900 }).webp({ quality: 84 }).toFile(o('intro-last.webp'));
  log('intro-last.webp');

  /* ── full scenes ───────────────────────────────────────── */
  await scene(names.archway, 'hero-bg.webp', 920, 82);   // hero: arch + gurudwara (matches last film frame)
  await scene(names.temple, 'finale-bg.webp', 920, 82);  // closing scene: temple, water, diyas
  await scene(names.frame, 'ceremony-bg.webp', 900, 82); // Anand Karaj backdrop: marble pillars + temple

  /* ── decorative cut-outs ───────────────────────────────── */
  await cutout(names.couple, 'couple.webp', 820, 90, 12);
  await cutout(names.horse, 'horse.webp', 940, 88, 18);
  await cutout(names.dhol, 'dhol.webp', 780, 88, 12);
  await cutout(names.bell, 'bell.webp', 300, 90, 18);
  await cutout(names.garland, 'garland.webp', 1100, 88, 12);
  await cutout(names.lantern, 'lantern.webp', 760, 88, 12);
  await cutout(names.arch, 'arch-crown.webp', 1200, 88, 18);
  if (existsSync(s(names.khanda))) await cutout(names.khanda, 'khanda.webp', 520, 90, 18);


  /* ── scene tiles for the event blocks ──────────────────── */
  // Anand Karaj: the Gurudwara centred across the sarovar (landscape)
  await sharp(s(names.temple)).extract({ left: 0, top: 980, width: 941, height: 620 })
    .resize({ width: 900 }).webp({ quality: 82 }).toFile(o('anand-karaj.webp'));
  log('anand-karaj.webp');
  // small landscape vignette for the invitation block & closing
  // full width, so the floral pillars at both edges stay whole (never cut through the art)
  await sharp(s(names.frame)).extract({ left: 0, top: 1040, width: 941, height: 632 })
    .resize({ width: 940 }).webp({ quality: 82 }).toFile(o('vignette.webp'));
  log('vignette.webp');

  /* ── gallery: six illustrative tiles cropped from the scenes (not photos) ── */
  const meta = {};
  for (const k of ['archway', 'temple', 'frame']) meta[k] = await sharp(s(names[k])).metadata();
  const tile = async (src, left, top, w, h, out) => {
    await sharp(s(src)).extract({ left, top, width: w, height: h })
      .resize({ width: 640 }).webp({ quality: 80 }).toFile(o('gallery/' + out));
    log('gallery/' + out);
  };
  // temple scene 941x1672: dome, and the diyas-on-water band
  await tile(names.temple, 250, 1040, 460, 460, 'g1.webp');          // golden dome
  await tile(names.temple, 40, 1360, 861, 300, 'g2.webp');           // floating diyas & lotus (wide)
  // archway scene 941x1671: gurudwara framed through the arch
  await tile(names.archway, 150, 820, 640, 640, 'g3.webp');          // temple across the water
  await tile(names.archway, 20, 1180, 300, 460, 'g4.webp');          // marble + flowers (tall)
  // floral-frame scene 941x1672
  await tile(names.frame, 120, 1180, 700, 460, 'g5.webp');           // temple at sunrise (wide)
  await tile(names.frame, 560, 120, 360, 520, 'g6.webp');            // blue & ivory florals (tall)

  /* og.jpg, the calendar files and the static meta tags are written per folder by tools/sikh-finish.mjs */
  console.log('Done.');
}
run().catch((e) => { console.error(e); process.exit(1); });
