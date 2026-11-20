/* Ritik & Aradhana — the Lord Shiva film without its opening words (client, 2026-11-20).

     FFMPEG="C:/Program Files/DownloadHelper CoApp/ffmpeg.exe" node tools/ritik-aradhana-film.mjs

   The film of public/aashna-sanket-wedding (READ ONLY) carries "॥ ॐ ॥ / WEDDING INVITATION / Tap to Enter" and its
   gold dividers over the water for its first second and a half, while the camera stands still. Nothing is cropped
   or replaced: in those frames only, the thin gold strokes are found (sharp detail against the soft water, inside
   the box the words occupy) and filled from the water around them. Every other pixel and every later frame is the
   original, re-encoded once at high quality.

   Writes invites/src/ritik-aradhana-wedding/shiva-clean.mp4 and shiva-clean-poster.webp (its first frame). */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FF = process.env.FFMPEG || 'ffmpeg';
const IN = path.join(ROOT, 'public', 'aashna-sanket-wedding', 'assets', 'intro.mp4');
const SRC = path.join(ROOT, 'invites', 'src', 'ritik-aradhana-wedding');
const TMP = path.join(process.env.TEMP || '/tmp', 'ritik-film');
fs.rmSync(TMP, { recursive: true, force: true }); fs.mkdirSync(TMP, { recursive: true });

const W = 720, H = 1280, FPS = 24;
const BOX = { x0: 176, y0: 968, x1: 544, y1: 1196 };   // where the words and their dividers stand
/* the five rows of the composition (y0, y1, x0, x1), so the petals and lotuses beside them are never touched */
const ROWS = [[972, 1042, 204, 488], [1046, 1086, 184, 538], [1087, 1118, 232, 488], [1124, 1157, 296, 424], [1159, 1188, 262, 452]];
const LAST = Math.round(1.75 * FPS);                    // the words have faded out by 1.5 s; a margin after it
const ff = (...a) => execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: 'inherit' });

ff('-i', IN, '-vsync', '0', path.join(TMP, 'f-%04d.png'));
const frames = fs.readdirSync(TMP).filter((f) => f.endsWith('.png')).sort();
console.log(frames.length, 'frames');

const raw = async (f) => (await sharp(path.join(TMP, f)).removeAlpha().raw().toBuffer());
const lum = (b, i) => 0.299 * b[i] + 0.587 * b[i + 1] + 0.114 * b[i + 2];
/* separable box blur of a float plane, radius r, run three times (close to a gaussian) */
function blur(src, r) {
  let a = src;
  for (let pass = 0; pass < 3; pass++) {
    const t = new Float32Array(W * H), o = new Float32Array(W * H);
    for (let y = 0; y < H; y++) { let s = 0; const row = y * W;
      for (let x = -r; x <= r; x++) s += a[row + Math.min(W - 1, Math.max(0, x))];
      for (let x = 0; x < W; x++) { t[row + x] = s / (2 * r + 1); s += a[row + Math.min(W - 1, x + r + 1)] - a[row + Math.max(0, x - r)]; } }
    for (let x = 0; x < W; x++) { let s = 0;
      for (let y = -r; y <= r; y++) s += t[Math.min(H - 1, Math.max(0, y)) * W + x];
      for (let y = 0; y < H; y++) { o[y * W + x] = s / (2 * r + 1); s += t[Math.min(H - 1, y + r + 1) * W + x] - t[Math.max(0, y - r) * W + x]; } }
    a = o;
  }
  return a;
}

/* the mask: strokes brighter than their soft surroundings, in any of the first frames, grown by a few pixels */
const mask = new Uint8Array(W * H);
for (const f of frames.slice(0, 3)) {   // the very first frames: the words at full strength, the water still
  const b = await raw(f), L = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) L[i] = lum(b, i * 3);
  const soft = blur(L, 5);
  for (const [y0, y1, x0, x1] of ROWS) for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = y * W + x; if (L[i] - soft[i] > 8 && L[i] > 95) mask[i] = 1; }   // bright and sharp against the soft water: the gold lettering
}
/* the jewel at the middle of the upper divider is as bright as its surroundings are soft: masked by hand */
for (let y = 1088; y < 1114; y++) for (let x = 346; x < 374; x++) mask[y * W + x] = 1;
const grow = (m, r) => { const o = new Uint8Array(W * H);
  for (let y = BOX.y0 - r; y < BOX.y1 + r; y++) for (let x = BOX.x0 - r; x < BOX.x1 + r; x++) {
    let on = 0; for (let dy = -r; dy <= r && !on; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r && m[(y + dy) * W + x + dx]) { on = 1; break; }
    o[y * W + x] = on; }
  return o; };
const M = grow(mask, 3);
let n = 0; for (let i = 0; i < W * H; i++) n += M[i];
console.log('mask', n, 'px');
await sharp(Buffer.from(M.map((v) => v * 255)), { raw: { width: W, height: H, channels: 1 } }).png().toFile(path.join(TMP, 'mask.png'));
const feather = blur(Float32Array.from(M), 1);          // a soft edge to the fill

for (let k = 0; k < Math.min(LAST, frames.length); k++) {
  const b = await raw(frames[k]);
  const keep = new Float32Array(W * H); for (let i = 0; i < W * H; i++) keep[i] = M[i] ? 0 : 1;
  const out = Buffer.from(b);
  /* fill from the unmasked water around each stroke: blur(colour × keep) / blur(keep), wide then narrow */
  for (let c = 0; c < 3; c++) {
    const p = new Float32Array(W * H); for (let i = 0; i < W * H; i++) p[i] = b[i * 3 + c] * keep[i];
    const num = blur(p, 5), den = blur(keep, 5), numW = blur(p, 12), denW = blur(keep, 12);   // the wide pair reaches the middle of the broadest strokes
    for (let y = BOX.y0 - 6; y < BOX.y1 + 6; y++) for (let x = BOX.x0 - 6; x < BOX.x1 + 6; x++) {
      const i = y * W + x, a = Math.min(1, feather[i] * 1.6);
      if (a <= 0) continue;
      const fill = den[i] >= 0.12 ? num[i] / den[i] : denW[i] > 0.001 ? numW[i] / denW[i] : b[i * 3 + c];
      out[i * 3 + c] = Math.round(b[i * 3 + c] * (1 - a) + fill * a);
    }
  }
  await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png({ compressionLevel: 1 }).toFile(path.join(TMP, frames[k]));
  if (k === 0) await sharp(out, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 88 }).toFile(path.join(SRC, 'shiva-clean-poster.webp'));
}
console.log('cleaned frames 1 –', LAST);

ff('-framerate', String(FPS), '-i', path.join(TMP, 'f-%04d.png'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p',
  '-profile:v', 'high', '-movflags', '+faststart', '-an', path.join(SRC, 'shiva-clean.mp4'));
console.log('✓ shiva-clean.mp4', fs.statSync(path.join(SRC, 'shiva-clean.mp4')).size, 'bytes');
