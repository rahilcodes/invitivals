/* Builds the art of public/saicharan-lakshmi-engagement/ from the designer's pack in
 * invites/src/saicharan-lakshmi-engagement/ (the "engagement AG" zip — not committed).
 *
 *   node tools/build-saicharan-lakshmi-art.mjs
 *
 * Page backgrounds are saved at their native size as high-quality WebP (assets/bg/).
 * Overlay pieces are trimmed of transparent padding and saved as WebP with alpha (assets/el/).
 * A few pieces came on a baked white / checkerboard background (couple, calligraphy, calendar,
 * collage, bird) — those are keyed by flood-filling the neutral background in from the borders,
 * so nothing inside the artwork is touched. assets/el/manifest.json records each piece's size.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'invites/src/saicharan-lakshmi-engagement');
const OUT = path.join(ROOT, 'public/saicharan-lakshmi-engagement/assets');
if (!fs.existsSync(SRC)) { console.error(`no source pack at ${SRC}`); process.exit(1); }
fs.mkdirSync(path.join(OUT, 'bg'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'el'), { recursive: true });

const BG = { opening: 'opening page.png', p1: '1 hero page.png', p2: '2.png', p3: '3.png', p4: '4.png', p5: '5.png', p6: '6.png' };
/* id: [file, key] — key removes a baked background reachable from the edges: 'checker' (white + grey squares) or 'white' */
const EL = {
  couple:     ['elements/1/Embroidered Indian Wedding Couple Cutout.png', 'checker'],
  engagement: ['elements/1/Golden Engagement Calligraphy with Heart Flourish-1.png', 'checkerAll'],
  lakshmi:    ['elements/1/Gouravelly Lakshmi in Gold Calligraphy-3.png'],
  saicharan:  ['elements/1/Luxurious Gold Calligraphic Wordmark-2.png'],
  ganesha:    ['elements/1/Ornate Golden Ganesha Pendant Emblem.png'],
  bell:       ['elements/1/Ornate Golden Jhumka Bell Pendant.png'],
  garland:    ['elements/1/Pink Floral Garland with Gold Pendant.png'],
  butterfly:  ['elements/2/Champagne Gold Embroidered Butterfly Ornament.png'],
  tasselA:    ['elements/2/Floral Pearl Jhumka Tassel (1).png'],
  tasselB:    ['elements/2/Pearl Blossom Golden Jhumka Tassel.png'],
  pendant:    ['elements/3/Floral Gold Jhumka Pendant.png'],
  calendar:   ['elements/3/Gemini_Generated_Image_dticyvdticyvdtic.png', 'white'],
  heart:      ['elements/3/Glossy Pink Heart Floral Frame.png'],
  bell2:      ['elements/3/Ornate Golden Floral Jhumka Bell (1).png'],
  reveal:     ['elements/3/reveal_the_date_transparent.png'],
  garland2:   ['elements/4/Cascading Pink and Gold Floral Garland-2.png'],
  ringbox:    ['elements/4/Ornate Floral Wedding Ring Box.png'],
  sprig:      ['elements/4/Ornate Pearl and Gold Floral Sprig-1.png'],
  collage:    ['elements/5/Gemini_Generated_Image_svuwn0svuwn0svuw.png', 'white'],
  bird:       ['elements/6/7a12cca1-ff28-4d91-aaf2-415a79e67d20.jpg', 'white'],
};
const CAP = 1500;

/* flood-fill the background from the borders: a pixel is background when it is neutral grey/white */
async function keyBackground(file, mode) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const checker = mode.startsWith('checker');
  const tol = checker ? 10 : 7;
  const minV = checker ? 176 : 232;
  const isBg = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return mn >= minV && mx - mn <= tol;
  };
  const mask = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => { const p = y * W + x; if (!mask[p] && isBg(p * 4)) { mask[p] = 1; stack.push(p); } };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) {
    const p = stack.pop();
    const x = p % W, y = (p - x) / W;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < H - 1) push(x, y + 1);
  }
  /* 'checkerAll': the checkerboard also sits inside closed letter loops, so drop every neutral
     region of any size that is bigger than a highlight (the lettering itself is never neutral) */
  if (mode === 'checkerAll') {
    const seen = new Uint8Array(W * H);
    for (let s = 0; s < W * H; s++) {
      if (mask[s] || seen[s] || !isBg(s * 4)) continue;
      const comp = [s]; seen[s] = 1;
      for (let k = 0; k < comp.length; k++) {
        const p = comp[k]; const x = p % W, y = (p - x) / W;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          const q = ny * W + nx; if (!seen[q] && !mask[q] && isBg(q * 4)) { seen[q] = 1; comp.push(q); }
        }
      }
      if (comp.length >= 60) for (const p of comp) mask[p] = 1;
    }
  }
  /* soften the cut by one pixel so the edge is not jagged */
  const out = Buffer.from(data);
  const N = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = y * W + x;
    if (mask[p]) { out[p * 4 + 3] = 0; continue; }
    let edge = 0;
    for (const [dx, dy] of N) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < H && mask[ny * W + nx]) edge++; }
    if (edge) out[p * 4 + 3] = edge >= 2 ? 110 : 170;
  }
  return sharp(out, { raw: { width: W, height: H, channels: 4 } });
}

let total = 0;
for (const [id, file] of Object.entries(BG)) {
  const info = await sharp(path.join(SRC, file)).webp({ quality: 90, effort: 6 }).toFile(path.join(OUT, 'bg', id + '.webp'));
  total += info.size;
  console.log(`bg/${id}`.padEnd(16), `${info.width}×${info.height}`.padEnd(10), `${(info.size / 1024).toFixed(0).padStart(5)} KB`);
}
const manifest = {};
for (const [id, [file, key]] of Object.entries(EL)) {
  const src = path.join(SRC, file);
  const base = key ? await keyBackground(src, key) : sharp(src).ensureAlpha();
  const trimmed = await base.trim({ threshold: 8 }).png().toBuffer({ resolveWithObject: true });
  let img = sharp(trimmed.data);
  const { width, height } = trimmed.info;
  if (Math.max(width, height) > CAP) img = img.resize({ [width >= height ? 'width' : 'height']: CAP, kernel: 'lanczos3' });
  const info = await img.webp({ quality: 88, alphaQuality: 96, effort: 6 }).toFile(path.join(OUT, 'el', id + '.webp'));
  manifest[id] = [info.width, info.height];
  total += info.size;
  console.log(`el/${id}`.padEnd(16), `${info.width}×${info.height}`.padEnd(10), `${(info.size / 1024).toFixed(0).padStart(5)} KB`);
}
fs.writeFileSync(path.join(OUT, 'el', 'manifest.json'), JSON.stringify(manifest));
fs.mkdirSync(path.join(OUT, 'media'), { recursive: true });
fs.copyFileSync(path.join(SRC, 'AI VIDEO OPENING.mp4'), path.join(OUT, 'media', 'opening.mp4'));
fs.copyFileSync(path.join(SRC, 'Annul Maelae Violin Cover Varanam ayiram Binesh Babu & Friends.mp3'), path.join(OUT, 'media', 'music.mp3'));
console.log(`\n${(total / 1048576).toFixed(1)} MB of pictures; video and music copied`);
