/* Maham Azeem & Nasir Hussain — the artwork of public/maham-azeem-nasir-hussain-nikah (client brief 2026-11-17).

     node tools/maham-azeem-nasir-hussain-nikah.mjs

   The client's two pictures (invites/src/maham-azeem-nasir-hussain-nikah/):
     invitation.jpg — the invitation card the client chose. It is shown whole and untouched on its own page
                      (assets/invitation.jpg is a byte-for-byte copy). The other pages stand on the SAME card with
                      its lettering lifted off, so flowers, lanterns, rings and paper are the client's own:
                        plate-a  keeps the rings, the Bismillah and its translation (page 1)
                        plate-b  keeps only the flowers, lanterns and the small ornament at the foot
     monogram.jpg   — the M N monogram, black on a painted checkerboard: its ink becomes the shape (ground and
                      checkerboard dropped) and is coloured champagne gold. Not redrawn, stretched or cropped.
   The song is the design pack's (public/modern-wedding, read only). The opening film is built separately by
   tools/maham-azeem-nasir-hussain-nikah-film. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'invites/src/maham-azeem-nasir-hussain-nikah'), OUT = path.join(ROOT, 'public/maham-azeem-nasir-hussain-nikah/assets');
fs.mkdirSync(OUT, { recursive: true });
const sizes = {};

/* ── the card with its lettering lifted off. Inside the given boxes (pixels of the 941 x 1670 card; they keep clear
      of the flowers and lanterns) every pixel that is not paper is refilled from the paper around it. ── */
const { data: card, info } = await sharp(path.join(SRC, 'invitation.jpg')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
async function lift(boxes, name) {
  const d = Buffer.from(card), inBox = new Uint8Array(W * H);
  for (const [x0, y0, x1, y1] of boxes) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) inBox[y * W + x] = 1;
  /* paper: bright ivory. Everything else (ink, gold, its soft shadow) is "not paper" */
  const paper = new Uint8Array(W * H);
  for (let k = 0; k < W * H; k++) { const r = card[k * 3], g = card[k * 3 + 1], b = card[k * 3 + 2]; paper[k] = (r > 236 && g > 219 && b > 184 && r - b < 58 && r - g < 24) ? 1 : 0; }
  /* ink to refill = not paper, grown by 4 px (the letters' soft edges), inside the boxes only */
  const ink = new Uint8Array(W * H), R = 5;
  for (let y = R; y < H - R; y++) for (let x = R; x < W - R; x++) { if (!inBox[y * W + x]) continue; let m = 0; for (let j = -R; j <= R && !m; j++) for (let i = -R; i <= R; i++) if (!paper[(y + j) * W + x + i]) { m = 1; break; } ink[y * W + x] = m; }
  const keep = Buffer.alloc(W * H); for (let k = 0; k < W * H; k++) keep[k] = (paper[k] && !ink[k]) ? 255 : 0;
  const blur = (buf, s) => sharp(buf, { raw: { width: W, height: H, channels: 1 } }).blur(s).toColourspace('b-w').raw().toBuffer();
  const n1 = await blur(keep, 7), n2 = await blur(keep, 70);
  let seed = 11; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296 - 0.5);
  const fill = [];
  for (let c = 0; c < 3; c++) { const ch = Buffer.alloc(W * H); for (let k = 0; k < W * H; k++) ch[k] = keep[k] ? card[k * 3 + c] : 0; fill.push([await blur(ch, 7), await blur(ch, 70)]); }
  const soft = await blur(Buffer.from(ink.map((v) => v * 255)), 1.2);
  for (let k = 0; k < W * H; k++) {
    const a = soft[k] / 255; if (a <= 0) continue;
    const g = rnd() * 2.2;
    for (let c = 0; c < 3; c++) {
      const far = n2[k] > 6 ? fill[c][1][k] * 255 / n2[k] : 244, near = n1[k] > 40 ? fill[c][0][k] * 255 / n1[k] : far;
      const w = Math.min(1, Math.max(0, (n1[k] - 40) / 80)), v = far + (near - far) * w + g;
      d[k * 3 + c] = Math.max(0, Math.min(255, Math.round(card[k * 3 + c] * (1 - a) + v * a)));
    }
  }
  const out = await sharp(d, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 90, effort: 6 }).toFile(path.join(OUT, name + '.webp'));
  sizes[name] = [out.width, out.height];
}
const LOWER = [
  [150, 425, 800, 1075],     // Nikah Invitation, the names, the request
  [185, 1075, 858, 1160],    // the date row, as far as "5:00 PM"
  [185, 1160, 610, 1232],
  [262, 1232, 690, 1420],    // the venue
  [240, 1420, 705, 1515],    // the closing line
];
await lift(LOWER, 'plate-a');
await lift([[228, 205, 720, 425], [392, 40, 552, 205], ...LOWER], 'plate-b');

/* the chosen card itself, exactly as supplied */
fs.copyFileSync(path.join(SRC, 'invitation.jpg'), path.join(OUT, 'invitation.jpg'));
sizes.invitation = [W, H];

/* ── the monogram: ink = darkness (anything lighter than mid-grey is the ground and its checkerboard) ── */
async function inked(alpha, w, h, fill, file, width) {
  const colour = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1">${fill.map((c, i) => `<stop offset="${i / (fill.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`)).removeAlpha().raw().toBuffer();
  const rgba = await sharp(colour, { raw: { width: w, height: h, channels: 3 } }).joinChannel(alpha, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
  const o = await sharp(rgba).trim({ threshold: 4 }).resize({ width, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(path.join(OUT, file));
  sizes[file.replace('.webp', '')] = [o.width, o.height];
}
{ const { data, info: m } = await sharp(path.join(SRC, 'monogram.jpg')).greyscale().raw().toBuffer({ resolveWithObject: true });
  const a = Buffer.alloc(m.width * m.height);
  for (let i = 0; i < a.length; i++) a[i] = Math.max(0, Math.min(255, Math.round(((255 - data[i]) - 70) / 130 * 255)));
  await inked(a, m.width, m.height, ['#c7a153', '#9a7230', '#b98f42', '#8c6628'], 'mn-gold.webp', 760);
  /* the seal of the opening film: the two letters in their own arrangement (the frame and its sprays are too fine for a
     seal 70 px across on a phone), pale gold. Used by the film tool only, so it is written beside the sources. */
  const cx = 542, cy = 722, rx = 268, ry = 300, s = Buffer.alloc(a.length);
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) { const r = (Math.abs((x - cx) / rx) ** 6 + Math.abs((y - cy) / ry) ** 6) ** (1 / 6); s[y * m.width + x] = (r < 1 && !(y > cy + 240 && Math.abs(x - cx) > 225)) ? a[y * m.width + x] : 0; }
  const colour = await sharp({ create: { width: m.width, height: m.height, channels: 3, background: '#f6e3b4' } }).raw().toBuffer();
  await sharp(colour, { raw: { width: m.width, height: m.height, channels: 3 } }).joinChannel(s, { raw: { width: m.width, height: m.height, channels: 1 } }).png().toBuffer().then((b) => sharp(b)).then((i) => i.extract({ left: cx - rx, top: cy - ry, width: rx * 2, height: ry * 2 }).png().toFile(path.join(SRC, 'seal-mn.png')));
}
fs.copyFileSync(path.join(ROOT, 'public/modern-wedding/assets/music.mp3'), path.join(OUT, 'music.mp3'));
fs.mkdirSync(path.join(OUT, '..', 'js'), { recursive: true });
fs.writeFileSync(path.join(OUT, '..', 'js', 'art.js'), `/* written by tools/maham-azeem-nasir-hussain-nikah.mjs: the pixel sizes of the artwork */\nexport const art = ${JSON.stringify(sizes)};\n`);
console.log(sizes);
