/* Builds the art of public/bengali-wedding/ from the designer's pack in
 * invites/src/bengali-wedding/ (the "bengali wedding" zip — not committed).
 *
 *   node tools/build-bengali-wedding-art.mjs
 *
 * The nine text-free 941×1672 backgrounds go to assets/bg/ as WebP. The overlay pieces are
 * trimmed of transparent padding and saved with alpha to assets/el/; three of them came on a
 * baked white or checkerboard background and are keyed by flood-filling that background in from
 * the borders. assets/el/manifest.json records each piece's size. The intro film and the music
 * are copied to assets/media/ (the film re-encoded by tools/build-bengali-wedding-media.sh if ffmpeg is available).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'invites/src/bengali-wedding');
const OUT = path.join(ROOT, 'public/bengali-wedding/assets');
if (!fs.existsSync(SRC)) { console.error(`no source pack at ${SRC}`); process.exit(1); }
for (const d of ['bg', 'el', 'media']) fs.mkdirSync(path.join(OUT, d), { recursive: true });

const E = (f) => path.join('elements', f);
/* id: [file, key] — key removes a baked background reachable from the edges: 'checker' or 'white' */
const EL = {
  couple:      [E('hero page/Tender Indian Wedding Couple.png')],
  lampStand:   [E('hero page/Ornate Brass Diya with Floral Garlands.png')],
  diyaFlame:   [E('hero page/Ornate Golden Diya with Flame.png')],
  diyaFlowers: [E('hero page/Ornate Golden Diya with Flowers.png')],
  tasselJas:   [E('hero page/Hanging Jasmine and Rose Tassel.png')],
  tasselRed:   [E('hero page/Red and White Floral Garland Tassel.png')],
  coin:        [E('scratch date/bengali_gold_lotus_coin_transparent.png')],
  lanternL:    [E('function title/Ornate Golden Lantern with Floral Garland-2.png')],
  lanternR:    [E('function title/Ornate Golden Lantern with Floral Garland-3.png')],
  dancers:     [E('sangeet/Joyful Indian Wedding Dance Couple-1.png')],
  lanternSang: [E('sangeet/Ornate Golden Islamic Hanging Lantern-2.png')],
  bhojon:      [E('reception/Ornate Golden Bengali Celebration Logo.png')],
  lanternRec:  [E('reception/Ornate Golden Arabic Lantern.png'), 'checker'],
  photo1:      [E('collage and ending/collage_photo_01.png')],
  photo2:      [E('collage and ending/collage_photo_02.png')],
  photo3:      [E('collage and ending/collage_photo_03.png')],
  photo4:      [E('collage and ending/collage_photo_04.png')],
};
const CAP = 1400;

async function keyBackground(file, mode) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const checker = mode === 'checker';
  const tol = checker ? 12 : 8, minV = checker ? 170 : 228;
  const isBg = (i) => { const r = data[i], g = data[i + 1], b = data[i + 2]; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mn >= minV && mx - mn <= tol; };
  const mask = new Uint8Array(W * H), stack = [];
  const push = (x, y) => { const p = y * W + x; if (!mask[p] && isBg(p * 4)) { mask[p] = 1; stack.push(p); } };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) { const p = stack.pop(); const x = p % W, y = (p - x) / W; if (x > 0) push(x - 1, y); if (x < W - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < H - 1) push(x, y + 1); }
  const out = Buffer.from(data);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = y * W + x;
    if (mask[p]) { out[p * 4 + 3] = 0; continue; }
    let edge = 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < H && mask[ny * W + nx]) edge++; }
    if (edge) out[p * 4 + 3] = edge >= 2 ? 100 : 165;
  }
  return sharp(out, { raw: { width: W, height: H, channels: 4 } });
}

let total = 0;
for (let n = 1; n <= 9; n++) {
  const info = await sharp(path.join(SRC, `${n}.png`)).resize({ width: 941, height: 1672, fit: 'cover' }).webp({ quality: 88, effort: 6 }).toFile(path.join(OUT, 'bg', `p${n}.webp`));
  total += info.size; console.log(`bg/p${n}`.padEnd(18), `${info.width}×${info.height}`.padEnd(10), `${(info.size / 1024).toFixed(0).padStart(5)} KB`);
}
const manifest = {};
for (const [id, [file, key]] of Object.entries(EL)) {
  const src = path.join(SRC, file);
  const base = key ? await keyBackground(src, key) : sharp(src).ensureAlpha();
  const trimmed = await base.trim({ threshold: 8 }).png().toBuffer({ resolveWithObject: true });
  let img = sharp(trimmed.data);
  const { width, height } = trimmed.info;
  if (Math.max(width, height) > CAP) img = img.resize({ [width >= height ? 'width' : 'height']: CAP, kernel: 'lanczos3' });
  const info = await img.webp({ quality: 86, alphaQuality: 95, effort: 6 }).toFile(path.join(OUT, 'el', id + '.webp'));
  manifest[id] = [info.width, info.height]; total += info.size;
  console.log(`el/${id}`.padEnd(18), `${info.width}×${info.height}`.padEnd(10), `${(info.size / 1024).toFixed(0).padStart(5)} KB`);
}
fs.writeFileSync(path.join(OUT, 'el', 'manifest.json'), JSON.stringify(manifest));
if (!fs.existsSync(path.join(OUT, 'media', 'intro-clean.mp4'))) fs.copyFileSync(path.join(SRC, 'ai video clean.mp4'), path.join(OUT, 'media', 'intro-clean.mp4'));
if (fs.existsSync(path.join(SRC, 'music.mp3'))) fs.copyFileSync(path.join(SRC, 'music.mp3'), path.join(OUT, 'media', 'music.mp3'));
console.log(`\n${(total / 1048576).toFixed(1)} MB of pictures`);
