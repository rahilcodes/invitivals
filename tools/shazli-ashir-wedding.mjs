/* Shazli Haider & Syed Mohammed Ashir Kamal — artwork for BOTH invitation links
 *   public/shazli-ashir-wedding/  (all four functions)   public/shazli-ashir-nikah/  (Nikah + Rukhsati only)
 *
 *   node tools/shazli-ashir-wedding.mjs
 *
 * Reads the Muslim Emerald design's clean (text-free) plates from public/muslim-emerald-wedding/assets (read only,
 * that page is never written to) and the client's files from invites/src/shazli-ashir-wedding/:
 *   monogram.jpeg  the client's SA monogram card (used as supplied; only the crest is cut out with a soft edge)
 *   music.mp3      the client's song (copied byte for byte)
 * Writes into each folder's assets/: doors, hero, save, stage, paper, thanks (the pack's thank-you plate with its
 * painted Call / WhatsApp / Email bars filled with the plate's own paper), monogram.webp, music.mp3, og.jpg. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REF = path.join(ROOT, 'public/muslim-emerald-wedding/assets');
const SRC = path.join(ROOT, 'invites/src/shazli-ashir-wedding');
const OUTS = ['shazli-ashir-wedding', 'shazli-ashir-nikah'].map((f) => path.join(ROOT, 'public', f, 'assets'));

const files = {};
const plate = async (name, from) => { files[name] = await sharp(path.join(REF, from)).webp({ quality: 86 }).toBuffer(); };
await plate('doors.webp', 'bg1.webp');
await plate('hero.webp', 'bg2.webp');
await plate('save.webp', 'bg3.webp');
await plate('paper.webp', 'bg10.webp');
/* the four function detail pages (the reference's pages 6–9, clean) */
await plate('d-mayun.webp', 'bg6.webp');
await plate('d-mehendi.webp', 'bg7.webp');
await plate('d-nikah.webp', 'bg8.webp');
await plate('d-rukhsati.webp', 'bg9.webp');
/* Our Functions: the reference's clean four-card plate as it is; for the Nikah + Rukhsati link the first two cards
   are taken out (rows 228–907 of 1672, two card pitches) and the two halves are cross-faded over 48 rows */
await plate('functions.webp', 'bg5.webp');
{
  const src = path.join(REF, 'bg5.webp'), CUT0 = 228, CUT1 = 907, F = 48;
  const top = await sharp(src).extract({ left: 0, top: 0, width: 941, height: CUT0 + F }).png().toBuffer();
  const bottom = await sharp(src).extract({ left: 0, top: CUT1, width: 941, height: 1672 - CUT1 }).png().toBuffer();
  const fade = Buffer.from(`<svg width="941" height="${CUT0 + F}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="${CUT0 / (CUT0 + F)}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="941" height="${CUT0 + F}" fill="url(#g)"/></svg>`);
  const topFaded = await sharp(top).ensureAlpha().composite([{ input: fade, blend: 'dest-in' }]).png().toBuffer();
  const H = CUT0 + 1672 - CUT1;
  files['functions-2.webp'] = await sharp({ create: { width: 941, height: H, channels: 3, background: '#f6ecd6' } })
    .composite([{ input: bottom, left: 0, top: CUT0 }, { input: topFaded, left: 0, top: 0 }]).webp({ quality: 86 }).toBuffer();
}
/* scratch card: the cover is the reference's plain gold plate; beneath it the reference's revealed plaque with its
   sample date ("13 December 2025") painted out by diffusion from the surrounding cream, so our date is live text */
files['plate-cover.webp'] = fs.readFileSync(path.join(REF, 'plate-cover.webp'));
{
  const { data, info } = await sharp(path.join(REF, 'plate-after.webp')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  const mask = new Uint8Array(W * H);
  /* the sample date's box (measured on the 880 x 581 plate); inside it the ink and its soft edges are darker and
     less red than the cream paper and the gold flakes */
  for (let y = 150; y < 462; y++) for (let x = 135; x < 752; x++) {
    const i = (y * W + x) * C, r = data[i], g = data[i + 1];
    if (r < 205 && r - g < 25) mask[y * W + x] = 1;   // gold, even in shadow, is much redder than green
  }
  for (let pass = 0; pass < 4; pass++) {             // grow the ink mask so the letters' soft edges go too
    const m2 = mask.slice();
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (!mask[y * W + x] && (mask[y * W + x - 1] || mask[y * W + x + 1] || mask[(y - 1) * W + x] || mask[(y + 1) * W + x])) m2[y * W + x] = 1;
    mask.set(m2);
  }
  const idx = []; for (let k = 0; k < W * H; k++) if (mask[k]) idx.push(k);
  const f = new Float32Array(W * H * 3);
  for (let k = 0; k < W * H; k++) for (let c = 0; c < 3; c++) f[k * 3 + c] = mask[k] ? 0 : data[k * C + c];
  const known = Uint8Array.from(mask, (v) => 1 - v);
  for (let it = 0; it < 600; it++) {
    for (const k of idx) {
      let s0 = 0, s1 = 0, s2 = 0, n = 0;
      for (const d of [-1, 1, -W, W, -W - 1, -W + 1, W - 1, W + 1]) { const j = k + d; if (known[j]) { s0 += f[j * 3]; s1 += f[j * 3 + 1]; s2 += f[j * 3 + 2]; n++; } }
      if (n) { f[k * 3] = s0 / n; f[k * 3 + 1] = s1 / n; f[k * 3 + 2] = s2 / n; known[k] = 1; }
    }
  }
  for (const k of idx) for (let c = 0; c < 3; c++) data[k * C + c] = Math.round(f[k * 3 + c]);
  files['plate-reveal.webp'] = await sharp(data, { raw: info }).webp({ quality: 90 }).toBuffer();
}

/* thank-you plate: the three painted contact bars (x 240–703, y 780–1045 of 941 × 1672) are replaced row by row with
   a blend between the paper just left and just right of them, then softened so no seam shows */
{
  const { data, info } = await sharp(path.join(REF, 'bg11.webp')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, C = info.channels, X0 = 236, X1 = 707, Y0 = 776, Y1 = 1049;
  const px = (x, y, c) => data[(y * W + x) * C + c];
  const avg = (x, y, c) => { let s = 0, n = 0; for (let dx = -3; dx <= 3; dx++) for (let dy = -2; dy <= 2; dy++) { s += px(x + dx, y + dy, c); n++; } return s / n; };
  for (let y = Y0; y <= Y1; y++) {
    const L = [0, 1, 2].map((c) => avg(X0 - 4, y, c)), R = [0, 1, 2].map((c) => avg(X1 + 4, y, c));
    for (let x = X0; x <= X1; x++) { const t = (x - X0) / (X1 - X0); for (let c = 0; c < 3; c++) data[(y * W + x) * C + c] = Math.round(L[c] * (1 - t) + R[c] * t); }
  }
  const patched = sharp(data, { raw: info });
  const soft = await sharp(await patched.clone().png().toBuffer()).extract({ left: X0 - 10, top: Y0 - 10, width: X1 - X0 + 20, height: Y1 - Y0 + 20 }).blur(6).toBuffer();
  const mask = Buffer.from(`<svg width="${X1 - X0 + 20}" height="${Y1 - Y0 + 20}"><defs><filter id="f"><feGaussianBlur stdDeviation="5"/></filter></defs><rect x="8" y="8" width="${X1 - X0 + 4}" height="${Y1 - Y0 + 4}" fill="#fff" filter="url(#f)"/></svg>`);
  const softMasked = await sharp(soft).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  files['thanks.webp'] = await patched.composite([{ input: softMasked, left: X0 - 10, top: Y0 - 10 }]).webp({ quality: 86 }).toBuffer();
}

/* the SA crest, cut from the client's card with a feathered oval so it sits on any of the plates' paper */
{
  const src = path.join(SRC, 'monogram.jpeg');
  const L = 140, T = 222, Wd = 744, Ht = 1060;
  const mask = Buffer.from(`<svg width="${Wd}" height="${Ht}"><defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="78%" stop-color="#fff"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><ellipse cx="${Wd / 2}" cy="${Ht / 2}" rx="${Wd / 2}" ry="${Ht / 2}" fill="url(#g)"/></svg>`);
  const cut = await sharp(await sharp(src).extract({ left: L, top: T, width: Wd, height: Ht }).toBuffer()).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  files['monogram.webp'] = await sharp(cut).resize({ width: 560 }).webp({ quality: 90, alphaQuality: 90 }).toBuffer();
}

files['music.mp3'] = fs.readFileSync(path.join(SRC, 'music.mp3'));

/* WhatsApp cover 1200 × 630: the hero plate's sunlit arch on the left, the crest and names on paper to the right */
{
  const hero = await sharp(path.join(REF, 'bg2.webp')).resize({ width: 420, height: 630, fit: 'cover', position: 'centre' }).toBuffer();
  const crest = await sharp(files['monogram.webp']).resize({ height: 300 }).toBuffer();
  const cm = await sharp(crest).metadata();
  const text = Buffer.from(`<svg width="1200" height="630">
    <text x="810" y="408" text-anchor="middle" font-family="Georgia, serif" font-size="50" font-style="italic" fill="#0f3b2c">Shazli &amp; Ashir</text>
    <text x="810" y="458" text-anchor="middle" font-family="Georgia, serif" font-size="22" letter-spacing="6" fill="#8a6a2a">NIKAH · 20 JANUARY 2027</text>
    <text x="810" y="494" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#5b4a2a">Majestic Heaven, Nirvana Grand Hotel and Resort, Bodhgaya</text>
    <rect x="440" y="18" width="742" height="594" fill="none" stroke="#c9a253" stroke-width="2"/>
  </svg>`);
  const og = await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#f6ecd6' } })
    .composite([{ input: hero, left: 0, top: 0 }, { input: crest, left: Math.round(810 - cm.width / 2), top: 50 }, { input: text, left: 0, top: 0 }])
    .jpeg({ quality: 86 }).toBuffer();
  files['og.jpg'] = og;
}

/* each link gets only the plates it shows */
const SKIP = { 'shazli-ashir-wedding': ['functions-2.webp'], 'shazli-ashir-nikah': ['functions.webp', 'd-mayun.webp', 'd-mehendi.webp'] };
for (const out of OUTS) {
  fs.mkdirSync(out, { recursive: true });
  const skip = SKIP[path.basename(path.dirname(out))];
  for (const [name, buf] of Object.entries(files)) if (!skip.includes(name)) fs.writeFileSync(path.join(out, name), buf);
  console.log('wrote', path.relative(ROOT, out), Object.keys(files).join(' '));
}
