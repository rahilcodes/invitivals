/* Dr. Mohammed Nihal & Nooha — the artwork of public/dr-mohammed-nihal-nooha (client brief 2026-11-17), on the
   Modern Wedding design. public/modern-wedding is only READ (its countdown plate, satin band, film, poster and song).

     node tools/dr-mohammed-nihal-nooha.mjs

   Plates: the design pack's own clean templates (invites/src/modern-wedding/1, 2, 5, 6.png — no lettering in them),
   warmed a little towards champagne and ivory as the client's reference shows. All wording on the page is live text.
   The client's two pieces of artwork (invites/src/dr-mohammed-nihal-nooha/):
     bismillah.jpg — purple calligraphy on black: the lettering is kept exactly (its brightness becomes transparency)
                     and recoloured deep plum;
     nn.jpg        — black monogram on a white ground with a painted checkerboard: the ink becomes the shape (the
                     ground and its checkerboard are dropped), recoloured plum for the ivory card and champagne gold
                     for the burgundy closing arch. Neither piece is redrawn, stretched or cropped into its strokes. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACK = path.join(ROOT, 'invites/src/modern-wedding'), REF = path.join(ROOT, 'public/modern-wedding/assets');
const SRC = path.join(ROOT, 'invites/src/dr-mohammed-nihal-nooha'), OUT = path.join(ROOT, 'public/dr-mohammed-nihal-nooha/assets');
fs.mkdirSync(OUT, { recursive: true });

/* champagne and ivory: a little more red and green than blue, nothing else moved */
const WARM = [[1.02, 0.015, 0], [0.005, 1.0, 0.0], [0, 0.045, 0.9]];
const warm = (input) => sharp(input).removeAlpha().recomb(WARM);
const sizes = {};
for (const [name, file] of [['plate1', '1.png'], ['plate2', '2.png'], ['plate3', '5.png'], ['plate5', '6.png']]) {
  const info = await warm(path.join(PACK, file)).webp({ quality: 86, effort: 6 }).toFile(path.join(OUT, name + '.webp'));
  sizes[name] = [info.width, info.height];
}
for (const name of ['plate4', 'satin']) {
  const m = await sharp(path.join(REF, name + '.webp')).metadata();
  const img = m.hasAlpha
    ? sharp(await warm(path.join(REF, name + '.webp')).toBuffer()).joinChannel(await sharp(path.join(REF, name + '.webp')).extractChannel('alpha').toBuffer())
    : warm(path.join(REF, name + '.webp'));
  const info = await img.webp({ quality: 88, effort: 6 }).toFile(path.join(OUT, name + '.webp'));
  sizes[name] = [info.width, info.height];
}
for (const f of ['opening.mp4', 'opening.webp', 'music.mp3']) fs.copyFileSync(path.join(REF, f), path.join(OUT, f));

/* a shape (one grey channel = how much ink) → a trimmed picture of one colour, or of a top-to-bottom gradient */
async function inked(alpha, w, h, fill, file, width) {
  const colour = Array.isArray(fill)
    ? await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">${fill.map((c, i) => `<stop offset="${i / (fill.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`)).removeAlpha().raw().toBuffer()
    : await sharp({ create: { width: w, height: h, channels: 3, background: fill } }).raw().toBuffer();
  const rgba = await sharp(colour, { raw: { width: w, height: h, channels: 3 } }).joinChannel(alpha, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
  const info = await sharp(rgba).trim({ threshold: 4 }).resize({ width, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(path.join(OUT, file));
  sizes[file.replace('.webp', '')] = [info.width, info.height];
}
const curve = (v, lo, hi) => Math.max(0, Math.min(255, Math.round(((v - lo) / (hi - lo)) * 255)));

{ /* Bismillah: purple on black → ink = brightness (the JPEG's near-black noise is cut off, the strokes made solid) */
  const { data, info } = await sharp(path.join(SRC, 'bismillah.jpg')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const a = Buffer.alloc(info.width * info.height);
  for (let i = 0; i < a.length; i++) a[i] = curve(Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]), 22, 78);
  await inked(a, info.width, info.height, '#5a2a47', 'bismillah.webp', 1100);
}
{ /* NN: black on white with a faint painted checkerboard → ink = darkness (anything lighter than mid-grey is ground) */
  const { data, info } = await sharp(path.join(SRC, 'nn.jpg')).greyscale().raw().toBuffer({ resolveWithObject: true });
  const a = Buffer.alloc(info.width * info.height);
  for (let i = 0; i < a.length; i++) a[i] = curve(255 - data[i], 70, 200);
  await inked(a, info.width, info.height, ['#7a4a68', '#5a2a47'], 'nn-plum.webp', 520);
  await inked(a, info.width, info.height, ['#fbeecb', '#e3c383', '#f3dfae'], 'nn-gold.webp', 520);
}
{ /* the wax face that lies over the film's seal (lettered for another couple): the seal's own mauve, a fine champagne
     ring as on the film's seal, and the family's NN in the seal's pale gold */
  /* the film looks at its seal a little from above, so the field is a shallow ellipse (measured on the film: 150 x 136 px
     of its 720 px width); the colours are sampled from the film's wax */
  const W = 480, Hh = 436, nn = await sharp(path.join(OUT, 'nn-gold.webp')).resize({ height: Math.round(Hh * 0.8) }).toBuffer();
  const m = await sharp(nn).metadata();
  const wax = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Hh}"><defs><radialGradient id="w" cx="40%" cy="34%" r="80%"><stop offset="0" stop-color="#977477"/><stop offset=".6" stop-color="#88656b"/><stop offset="1" stop-color="#75545b"/></radialGradient></defs><ellipse cx="${W / 2}" cy="${Hh / 2}" rx="${W / 2 - 2}" ry="${Hh / 2 - 2}" fill="url(#w)"/><ellipse cx="${W / 2}" cy="${Hh / 2}" rx="${W / 2 - 13}" ry="${Hh / 2 - 12}" fill="none" stroke="#dcc7a4" stroke-opacity=".85" stroke-width="3.5"/></svg>`);
  const face = await sharp(wax).composite([{ input: nn, left: Math.round((W - m.width) / 2), top: Math.round((Hh - m.height) / 2) }]).png().toBuffer();   // composited first: sharp resizes before it composites
  await sharp(face).resize(360).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(OUT, 'seal-nn.webp'));
}
fs.writeFileSync(path.join(OUT, '..', 'js', 'art.js'), `/* written by tools/dr-mohammed-nihal-nooha.mjs: the pixel sizes of the artwork */\nexport const art = ${JSON.stringify(sizes)};\n`);
console.log(sizes);
