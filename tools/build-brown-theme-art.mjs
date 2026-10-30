/* Brown-theme wedding (public/brown-theme-wedding): turns the designer pack in
 * invites/src/brown-theme-wedding-zip/brown theme wedding/ into web assets.
 *   node tools/build-brown-theme-art.mjs
 * Backgrounds: WebP q92 at full size (941×1671). Elements: transparent padding
 * trimmed, WebP q90 with alpha. Demo photos for the Memories carousel are the
 * three panels of 6.png (no separate photos were supplied). Prints a JSON of
 * every element's trimmed size for js/config-art.js.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'invites/src/brown-theme-wedding-zip/brown theme wedding';
const OUT = 'public/brown-theme-wedding/assets';
fs.mkdirSync(OUT, { recursive: true });

const EL = {
  1: { ganesha: 'Ornate Golden Ganesha Emblem', butterfly: 'Ornate Golden Jewel Butterfly', monarch: 'Ornate Golden Monarch Butterfly Cutout',
       arjun: 'Arjun Gold Calligraphy', aadhya: 'Aadhya Gold Calligraphy Logo', corner: 'Luxurious Golden Floral Corner Ornament-2',
       border: 'Ornate Golden Floral Corner Border-1', branch: 'Golden Botanical Branch Embellishment' },
  2: { flower: 'Elegant Gold and Bronze Floral Ornament', monarch: 'Glittering Golden Monarch Butterfly', monarch2: 'Glittering Monarch Butterfly Cutout',
       vine: 'Golden Floral Vine Ornament', garland: 'Golden Pearl Floral Garland Ornament', corner: 'Luxurious Bronze and Gold Floral Corner (1)',
       cornergarland: 'Luxurious Bronze Floral Corner Garland', cascade: 'Luxury Bronze and Gold Floral Cascade', slot: 'Ornate Golden Baroque UI Slot',
       parchment: 'Ornate Golden Floral Parchment Scroll', butterfly: 'Ornate Golden Monarch Butterfly' },
  3: { branch: 'Golden Botanical Branch Embellishment', cascade: 'Luxurious Bronze and Gold Floral Cascade', corner: 'Luxurious Bronze and Gold Floral Corner',
       border: 'Luxurious Gold and Chocolate Floral Border', flourish: 'Luxurious Golden Floral Corner Flourish', corner2: 'Luxurious Golden Floral Corner Ornament-2',
       pin: 'Ornate Golden Filigree Location Pin', border1: 'Ornate Golden Floral Corner Border-1', plaque: 'Ornate Golden Floral Plaque',
       butterfly: 'Ornate Golden Jewel Butterfly', monarch: 'Ornate Golden Monarch Butterfly Cutout' },
  4: { save: 'Luxurious Save the Date Plaque', date: 'Ornate Gold Wedding Date Plaque', lantern: 'Ornate Golden Moroccan Hanging Lantern', maps: 'Ornate Open in Google Maps Badge' },
  5: { lanternL: 'exact_lantern_left', lanternM: 'exact_lantern_middle', save: 'exact_save_the_date', maps: 'exact_view_on_google_maps',
       lantern3: 'Ornate Golden Hanging Lantern with Crystal Pendant', butterfly: 'Ornate Golden Jewel Butterfly' },
  6: { frame: 'Ornate Gold Floral Wedding Frame' },
  7: { button: 'Elegant Burgundy RSVP Invitation Button', rsvp: 'Luxury Gold-Trimmed RSVP Typography' },
};

/* Some "transparent" PNGs in the pack carry a baked-in grey checkerboard. Key it out:
 * flood-fill from the image border through neutral light pixels, soften the edge. */
const KEYED = new Set(['p1-ganesha', 'p3-pin', 'p4-save', 'p2-parchment', 'p1-branch', 'p3-branch']);
async function keyOut(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const val = (i) => data[i * 3];
  const neutral = (i) => { const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2]; return Math.max(r, g, b) - Math.min(r, g, b) < 18 && r > 105; };
  // label connected components of neutral pixels; a component is background when it touches the
  // border, or when it is a sizeable two-tone (checkerboard) patch rather than a smooth pearl/highlight
  const label = new Int32Array(w * h); let n = 0; const comps = [];
  for (let s0 = 0; s0 < w * h; s0++) {
    if (label[s0] || !neutral(s0)) continue;
    n++; const stack = [s0]; label[s0] = n; const hist = new Uint32Array(256); let size = 0, border = false;
    while (stack.length) {
      const i = stack.pop(); size++; hist[val(i)]++;
      const x = i % w, y = (i - x) / w;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) border = true;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) if (j >= 0 && !label[j] && neutral(j)) { label[j] = n; stack.push(j); }
    }
    // checkerboard patches are large and two-toned (grey + white); pearls and highlights are small, flat and bright
    let lo = 255, hi = 0; for (let v = 0; v < 256; v++) if (hist[v]) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
    const bg = border || (size > 3000 && hi - lo > 50);
    comps[n] = bg;
  }
  const isBg = (i) => label[i] && comps[label[i]];
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    out[i * 4] = data[i * 3]; out[i * 4 + 1] = data[i * 3 + 1]; out[i * 4 + 2] = data[i * 3 + 2];
    if (isBg(i)) { out[i * 4 + 3] = 0; continue; }
    const x = i % w, y = (i - x) / w;
    const edge = (x > 0 && isBg(i - 1)) || (x < w - 1 && isBg(i + 1)) || (y > 0 && isBg(i - w)) || (y < h - 1 && isBg(i + w));
    out[i * 4 + 3] = edge ? 120 : 255;
  }
  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

const sizes = {};
for (let p = 1; p <= 8; p++) {
  const bg = path.join(SRC, `${p}.png`);
  const m = await sharp(bg).metadata();
  await sharp(bg).webp({ quality: 92 }).toFile(path.join(OUT, `bg${p}.webp`));
  sizes[`bg${p}`] = [m.width, m.height];
  for (const [key, name] of Object.entries(EL[p] || {})) {
    const file = path.join(SRC, 'elements', String(p), `${name}.png`);
    const id = `p${p}-${key}`;
    const img = sharp(KEYED.has(id) ? await keyOut(file) : file).ensureAlpha().trim({ threshold: 8 });
    const buf = await img.toBuffer({ resolveWithObject: true });
    await sharp(buf.data).webp({ quality: 90, alphaQuality: 90 }).toFile(path.join(OUT, `p${p}-${key}.webp`));
    sizes[`p${p}-${key}`] = [buf.info.width, buf.info.height];
  }
}
await sharp(path.join(SRC, 'opening page.png')).webp({ quality: 90 }).toFile(path.join(OUT, 'opening.webp'));
await sharp(path.join(SRC, 'mockup.png')).resize({ width: 600 }).jpeg({ quality: 80 }).toFile(path.join(OUT, 'mockup-reference.jpg'));
// OG image 1200×630 from the opening page, centred on the seal
await sharp(path.join(SRC, 'opening page.png')).resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' }).jpeg({ quality: 85 }).toFile(path.join(OUT, 'og.jpg'));

// demo photos: the three centre panels of 6.png (941×1672)
const six = path.join(SRC, '6.png');
const panels = { 'demo-1': [300, 440, 330, 620], 'demo-2': [122, 470, 138, 560], 'demo-3': [682, 470, 138, 560] };
for (const [name, [left, top, width, height]] of Object.entries(panels)) {
  await sharp(six).extract({ left, top, width, height }).resize({ width: 800, height: 1100, fit: 'cover' }).webp({ quality: 88 }).toFile(path.join(OUT, `${name}.webp`));
}
fs.copyFileSync(path.join(SRC, 'AI video.mp4'), path.join(OUT, 'opening.mp4'));
fs.copyFileSync(path.join(SRC, 'Ranjha – Flute Cover Instrumental Divyansh Shrivatava Shershaah Sidharth–Kiara B Praak.mp3'), path.join(OUT, 'music.mp3'));
fs.writeFileSync(path.join('public/brown-theme-wedding', 'js/art-sizes.js'), `/* generated by tools/build-brown-theme-art.mjs — trimmed pixel sizes */\nexport const artSizes = ${JSON.stringify(sizes)};\n`);
console.log(JSON.stringify(sizes, null, 0));
