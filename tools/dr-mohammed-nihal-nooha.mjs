/* Dr. Mohammed Nihal & Nooha — the artwork of public/dr-mohammed-nihal-nooha (client brief 2026-11-17), on the
   Modern Wedding design. public/modern-wedding is only READ (its countdown plate, satin band, film, poster and song).

     node tools/dr-mohammed-nihal-nooha.mjs

   Plates: pages 1 and 5 are the design pack's own clean templates (invites/src/modern-wedding/1.png and 6.png, no
   lettering in them); pages 2, 3 and 4 are the reference's plates (Save Our Date, Our Functions, the countdown plaque)
   with the reference's own figures painted out where this invitation writes its own. Everything is warmed a little
   towards champagne and ivory. All wording on the page is live text.
   The client's two pieces of artwork (invites/src/dr-mohammed-nihal-nooha/):
     bismillah.jpg — purple calligraphy on black: the lettering is kept exactly (its brightness becomes transparency)
                     and recoloured deep plum;
     nn.jpg        — black monogram on a white ground with a painted checkerboard: the ink becomes the shape (the
                     ground and its checkerboard are dropped), recoloured plum for the ivory card and champagne gold
                     for the burgundy closing arch. Neither piece is redrawn, stretched or cropped into its strokes. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACK = path.join(ROOT, 'invites/src/modern-wedding'), REF = path.join(ROOT, 'public/modern-wedding/assets');
const SRC = path.join(ROOT, 'invites/src/dr-mohammed-nihal-nooha'), OUT = path.join(ROOT, 'public/dr-mohammed-nihal-nooha/assets');
fs.mkdirSync(OUT, { recursive: true });

/* champagne and ivory: a little more red and green than blue, nothing else moved */
const WARM = [[1.02, 0.015, 0], [0.005, 1.0, 0.0], [0, 0.045, 0.9]];
const warm = (input) => sharp(input).removeAlpha().recomb(WARM);
const sizes = {};
const save = async (img, name, q = 86) => { const info = await img.webp({ quality: q, effort: 6 }).toFile(path.join(OUT, name + '.webp')); sizes[name] = [info.width, info.height]; };

/* Paints a flat area of a plate clean: every row of the box is refilled with the plate's own colour for that row,
   read from clean pixels just outside the box (`from`: 'sides' = blended from its left and right edges across the
   row; a number = one clean column band at that x), a little grain is put back, and the edge is feathered, so no
   patch can be seen. Used where the reference's plate still carries lettering that this invitation replaces. */
async function clean(file, boxes) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, px = (x, y) => (y * W + x) * 3;
  const band = (x, y, n = 5) => { const c = [0, 0, 0]; let k = 0; for (let dx = -n; dx <= n; dx++) for (let dy = -2; dy <= 2; dy++) { const xx = Math.min(W - 1, Math.max(0, x + dx)), yy = Math.min(H - 1, Math.max(0, y + dy)); const i = px(xx, yy); c[0] += data[i]; c[1] += data[i + 1]; c[2] += data[i + 2]; k++; } return c.map((v) => v / k); };
  let seed = 7; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296 - 0.5);
  for (const { x0, y0, x1, y1, from = 'sides', feather = 10, grain = 3 } of boxes) {
    const [X0, Y0, X1, Y1] = [x0 * W, y0 * H, x1 * W, y1 * H].map(Math.round);
    for (let y = Y0; y <= Y1; y++) {
      const L = band(from === 'sides' ? X0 - 8 : Math.round(from * W), y), R = from === 'sides' ? band(X1 + 8, y) : L;
      for (let x = X0; x <= X1; x++) {
        const k = (x - X0) / (X1 - X0), edge = Math.min(x - X0, X1 - x, y - Y0, Y1 - y), m = Math.min(1, edge / feather), g = rnd() * grain, i = px(x, y);
        for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round(data[i + c] * (1 - m) + (L[c] * (1 - k) + R[c] * k + g) * m)));
      }
    }
  }
  return sharp(data, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
}

/* page 1 and page 5: the pack's own clean templates (no lettering in them) */
await save(warm(path.join(PACK, '1.png')), 'plate1');
await save(warm(path.join(PACK, '6.png')), 'plate5');
/* page 2, Save Our Date: the reference's own plate (its frame, calendar panel and the two pills are painted in it);
   the November figures in the panel are painted out (its SUN … SAT heading and corner ornaments stay), and the
   January 2027 figures are live text in the same columns */
await save(warm(await clean(path.join(REF, 'plate2.webp'), [{ x0: 0.228, y0: 0.452, x1: 0.762, y1: 0.588, from: 0.295, feather: 4, grain: 1.5 }, { x0: 0.232, y0: 0.584, x1: 0.4, y1: 0.608, from: 0.45, feather: 4, grain: 1.5 }])), 'plate2');
/* page 3, Our Functions: the reference's plate as it is (two cards with their painted buttons) */
await save(warm(path.join(REF, 'plate3.webp')), 'plate3');
/* page 4, the countdown: the reference's plaque still showed traces of its erased "Until We Say Nikkah" (a gold
   fleck, a hook, soft smears); the field above the four boxes is painted clean */
await save(warm(await clean(path.join(REF, 'plate4.webp'), [{ x0: 0.39, y0: 0.232, x1: 0.7, y1: 0.35, feather: 12 }, { x0: 0.372, y0: 0.33, x1: 0.7, y1: 0.503, feather: 12 }, { x0: 0.372, y0: 0.216, x1: 0.414, y1: 0.24, from: 0.44, feather: 5 }, { x0: 0.512, y0: 0.494, x1: 0.552, y1: 0.528, feather: 3 }])), 'plate4', 88);
{ const f = path.join(REF, 'satin.webp');
  await save(sharp(await warm(f).png().toBuffer()).joinChannel(await sharp(f).extractChannel('alpha').toBuffer()), 'satin', 88); }
/* the reference's small cut-outs used on pages 2 to 4, warmed with their plates (transparency kept) */
for (const name of ['p2-title', 'p2-divider', 'p2-heart', 'p2-reveal', 'p3-title', 'p3-divider', 'p3-n-divider', 'p3-r-divider', 'p3-n-icon-date', 'p3-n-icon-time', 'p3-n-icon-venue', 'p3-r-icon-date', 'p3-r-icon-time', 'p3-r-icon-venue', 'p4-divider', 'p5-ornament']) {
  const f = path.join(REF, name + '.webp'), m = await sharp(f).metadata();
  const rgb = await warm(f).png().toBuffer();
  await save(m.hasAlpha ? sharp(rgb).joinChannel(await sharp(f).extractChannel('alpha').toBuffer()) : sharp(rgb), name, 92);
}
/* the film and its poster are NOT copied from the reference any more: the page uses opening-nn.mp4 / opening-nn.webp,
   rebuilt with the NN seal by tools/dr-mohammed-nihal-nooha-film (the reference's film is lettered for another couple) */
for (const f of ['music.mp3']) fs.copyFileSync(path.join(REF, f), path.join(OUT, f));

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
const { art: refArt } = await import(pathToFileURL(path.join(ROOT, 'public/modern-wedding/js/art.js')).href);
const boxes = Object.fromEntries(Object.entries(refArt).filter(([k, v]) => /^p[23]-/.test(k) && v.w).map(([k, v]) => [k, [v.x, v.y, v.w, v.h]]));
fs.writeFileSync(path.join(OUT, '..', 'js', 'art.js'), `/* written by tools/dr-mohammed-nihal-nooha.mjs: the pixel sizes of the artwork, and the boxes (x, y, w, h in % of the
   page) the reference's layout gives the pieces of pages 2 and 3 */\nexport const art = ${JSON.stringify(sizes)};\nexport const box = ${JSON.stringify(boxes)};\n`);
console.log(sizes);
