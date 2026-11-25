/* Shazli Haider & Syed Mohammed Ashir Kamal — artwork for BOTH invitation links
 *   public/shazli-ashir-wedding/  (all four functions)   public/shazli-ashir-nikah/  (Nikah + Rukhsati only)
 *
 *   node tools/shazli-ashir-wedding.mjs
 *
 * Reads the Muslim Emerald design's clean (text-free) plates from public/muslim-emerald-wedding/assets (read only,
 * that page is never written to) and the client's files from invites/src/shazli-ashir-wedding/:
 *   monogram-sa-new.jpg  the client's emerald and gold S/A monogram (24 Nov; only its black background is removed)
 *   monogram.jpeg  the first SA crest (no longer used)
 *   music.mp3      the client's song (copied byte for byte)
 * Writes into each folder's assets/: doors + door-l/door-r/door-in (the opening), hero + ornament (from ref2), save, paper (RSVP), thanks (the pack's thank-you plate with its
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
await plate('save.webp', 'bg3.webp');

/* diffusion in-paint: every masked pixel is filled from its known neighbours, outside in */
function inpaint(data, W, mask, iters) {
  const idx = []; for (let k = 0; k < mask.length; k++) if (mask[k]) idx.push(k);
  const f = new Float32Array(mask.length * 3);
  for (let k = 0; k < mask.length; k++) for (let c = 0; c < 3; c++) f[k * 3 + c] = data[k * 3 + c];
  const known = Uint8Array.from(mask, (v) => 1 - v);
  for (let it = 0; it < iters; it++) for (const k of idx) {
    let s0 = 0, s1 = 0, s2 = 0, n = 0;
    for (const d of [-1, 1, -W, W]) { const j = k + d; if (known[j]) { s0 += f[j * 3]; s1 += f[j * 3 + 1]; s2 += f[j * 3 + 2]; n++; } }
    if (n) { f[k * 3] = s0 / n; f[k * 3 + 1] = s1 / n; f[k * 3 + 2] = s2 / n; known[k] = 1; }
  }
  const out = Buffer.from(data);
  for (const k of idx) { const g = (Math.random() - 0.5) * 3; for (let c = 0; c < 3; c++) out[k * 3 + c] = Math.max(0, Math.min(255, Math.round(f[k * 3 + c] + g))); }
  return out;
}
const lum = (b, k) => 0.3 * b[k * 3] + 0.59 * b[k * 3 + 1] + 0.11 * b[k * 3 + 2];

/* main page (24 Nov refinement): the reference's own finished plate (ref2), so its painted Bismillah, "Wedding
   Invitation" and the ornaments around it are exactly the reference's. Only its sample wording below the first
   divider (Together with our families … our loved ones, x 296–648, y 428–935) is painted out from the sky around it;
   the client's wording is live text. The middle divider is lifted out (unmixed against the cleaned plate) as
   ornament.webp so the live text can use the same ornament. */
{
  const { data, info } = await sharp(path.join(REF, 'ref2.webp')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const blur = await sharp(path.join(REF, 'ref2.webp')).removeAlpha().blur(14).raw().toBuffer();
  const mask = new Uint8Array(W * info.height);
  const X0 = 296, X1 = 648, Y0 = 428, Y1 = 935;
  for (let y = Y0; y < Y1; y++) for (let x = X0; x < X1; x++) { const k = y * W + x; if (lum(data, k) < lum(blur, k) - 10) mask[k] = 1; }
  const DIVIDERS = [[372, 538, 572, 586], [366, 786, 576, 834]];
  for (const [a, b, c, d] of DIVIDERS) for (let y = b; y < d; y++) for (let x = a; x < c; x++) mask[y * W + x] = 1;
  for (let pass = 0; pass < 4; pass++) {
    const m2 = mask.slice();
    for (let y = Y0 - 4; y < Y1 + 4; y++) for (let x = X0 - 4; x < X1 + 4; x++) { const k = y * W + x; if (!mask[k] && (mask[k - 1] || mask[k + 1] || mask[k - W] || mask[k + W])) m2[k] = 1; }
    mask.set(m2);
  }
  const clean = inpaint(data, W, mask, 900);
  files['hero.webp'] = await sharp(clean, { raw: info }).webp({ quality: 88 }).toBuffer();
  const [a, b, c, d] = DIVIDERS[0], w = c - a, hh = d - b, orn = Buffer.alloc(w * hh * 4);
  for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) {
    const k = (b + y) * W + a + x, o = (y * w + x) * 4;
    const al = Math.max(0, Math.min(1, (lum(clean, k) - lum(data, k) - 8) / 100));
    for (let ch = 0; ch < 3; ch++) orn[o + ch] = al > 0.02 ? Math.max(0, Math.min(255, Math.round((data[k * 3 + ch] - (1 - al) * clean[k * 3 + ch]) / al))) : 0;
    orn[o + 3] = Math.round(al * 255);
  }
  files['ornament.webp'] = await sharp(orn, { raw: { width: w, height: hh, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toBuffer();
}

/* opening (24 Nov): the two door leaves are lifted out of the door plate (outline measured on bg1: outer frame
   x 167–777, bottom 1258, pointed arch rising from y 485 at the sides to 342 at the centre seam x 472), so they can
   swing open in the page. Behind them, the view through the doorway is the hero plate's palace walk. */
{
  const L = 167, R = 777, T = 342, B = 1258, MID = 472;
  const leaf = (side) => {
    const x0 = side === 'l' ? L : MID, w = side === 'l' ? MID - L : R - MID, hgt = B - T;
    const p = side === 'l'
      ? `M0,${hgt} L0,${485 - T} C8,${440 - T} 33,${410 - T} 73,${395 - T} L${w},0 L${w},${hgt} Z`
      : `M${w},${hgt} L${w},${485 - T} C${w - 8},${440 - T} ${w - 33},${410 - T} ${w - 73},${395 - T} L0,0 L0,${hgt} Z`;
    return { x0, w, hgt, svg: Buffer.from(`<svg width="${w}" height="${hgt}"><path d="${p}" fill="#fff"/></svg>`) };
  };
  for (const side of ['l', 'r']) {
    const { x0, w, hgt, svg } = leaf(side);
    const cut = await sharp(path.join(REF, 'bg1.webp')).extract({ left: x0, top: T, width: w, height: hgt }).ensureAlpha().composite([{ input: svg, blend: 'dest-in' }]).png().toBuffer();
    files[`door-${side}.webp`] = await sharp(cut).webp({ quality: 88, alphaQuality: 100 }).toBuffer();
  }
  const w = R - L, hgt = B - T;
  const shape = Buffer.from(`<svg width="${w}" height="${hgt}"><path d="M0,${hgt} L0,${485 - T} C8,${440 - T} 33,${410 - T} 73,${395 - T} L${MID - L},0 L${w - 73},${395 - T} C${w - 33},${410 - T} ${w - 8},${440 - T} ${w},${485 - T} L${w},${hgt} Z" fill="#fff"/></svg>`);
  const view = await sharp(path.join(REF, 'bg2.webp')).extract({ left: 150, top: 560, width: 640, height: 962 }).resize(w, hgt).png().toBuffer();
  files['door-in.webp'] = await sharp(view).ensureAlpha().composite([{ input: shape, blend: 'dest-in' }]).webp({ quality: 84, alphaQuality: 100 }).toBuffer();
}

/* RSVP: the reference's paper arch as it is (25 Nov: the compact form sits on it, as in the reference) */
await plate('paper.webp', 'bg10.webp');
/* the four function detail pages (the reference's pages 6–9, clean) */
await plate('d-mayun.webp', 'bg6.webp');
/* 25 Nov (client): the Mehendi and Nikah plates paint a thin gold rule with small end ornaments across the date block
   (x 280–662, y 1322–1342 of 941 × 1672); it cut through "Dinner at 8:00 PM onwards" and held the Mehendi lines up.
   It is taken out of these two plates: each column of that strip is refilled by a blend of the paper just above and
   just below it, then the patch is softened at its edge. */
async function withoutRule(from) {
  const { data, info } = await sharp(path.join(REF, from)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, X0 = 280, X1 = 662, Y0 = 1322, Y1 = 1342;
  const px = (x, y, c) => data[(y * W + x) * 3 + c];
  const avg = (x, y, c) => { let t = 0, n = 0; for (let dx = -2; dx <= 2; dx++) for (let dy = -1; dy <= 1; dy++) { t += px(x + dx, y + dy, c); n++; } return t / n; };
  for (let x = X0; x <= X1; x++) {
    const T = [0, 1, 2].map((c) => avg(x, Y0 - 3, c)), B = [0, 1, 2].map((c) => avg(x, Y1 + 3, c));
    for (let y = Y0; y <= Y1; y++) { const t = (y - Y0) / (Y1 - Y0); for (let c = 0; c < 3; c++) data[(y * W + x) * 3 + c] = Math.round(T[c] * (1 - t) + B[c] * t); }
  }
  const patched = sharp(data, { raw: info });
  const soft = await sharp(await patched.clone().png().toBuffer()).extract({ left: X0 - 8, top: Y0 - 8, width: X1 - X0 + 16, height: Y1 - Y0 + 16 }).blur(2.5).toBuffer();
  const mask = Buffer.from(`<svg width="${X1 - X0 + 16}" height="${Y1 - Y0 + 16}"><defs><filter id="f"><feGaussianBlur stdDeviation="3"/></filter></defs><rect x="6" y="6" width="${X1 - X0 + 4}" height="${Y1 - Y0 + 4}" fill="#fff" filter="url(#f)"/></svg>`);
  const softMasked = await sharp(soft).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  const base = await patched.png().toBuffer();
  return sharp(base).composite([{ input: softMasked, left: X0 - 8, top: Y0 - 8 }]).webp({ quality: 86 }).toBuffer();
}
files['d-mehendi.webp'] = await withoutRule('bg7.webp');
files['d-nikah.webp'] = await withoutRule('bg8.webp');
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

/* the SA monogram (24 Nov: the client's new emerald, gold and pearl S/A, monogram-sa-new.jpg, 1226 x 1283 on black).
   Only the black background is taken away: every large near-black region (outside and inside the letters' loops) is
   made transparent, with a 2-pixel soft edge un-mixed from the black; the letters themselves are untouched and not
   resized out of proportion. */
{
  const { data, info } = await sharp(path.join(SRC, 'monogram-sa-new.jpg')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const mx = new Uint8Array(N); for (let k = 0; k < N; k++) mx[k] = Math.max(data[k * 3], data[k * 3 + 1], data[k * 3 + 2]);
  const bg = new Uint8Array(N), seen = new Uint8Array(N);
  for (let s = 0; s < N; s++) {
    if (seen[s] || mx[s] >= 22) continue;
    const comp = [s]; seen[s] = 1;
    for (let i = 0; i < comp.length; i++) {
      const k = comp[i], x = k % W;
      for (const j of [x > 0 ? k - 1 : -1, x < W - 1 ? k + 1 : -1, k - W, k + W]) if (j >= 0 && j < N && !seen[j] && mx[j] < 22) { seen[j] = 1; comp.push(j); }
    }
    if (comp.length > 300) for (const k of comp) bg[k] = 1;
  }
  const near = new Uint8Array(N);
  for (let k = 0; k < N; k++) if (bg[k]) { const x = k % W, y = (k / W) | 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H) near[yy * W + xx] = 1; } }
  const out = Buffer.alloc(N * 4);
  for (let k = 0; k < N; k++) {
    const a = bg[k] ? 0 : near[k] ? Math.max(0, Math.min(1, (mx[k] - 8) / 40)) : 1;
    for (let c = 0; c < 3; c++) out[k * 4 + c] = a > 0 ? Math.min(255, Math.round(data[k * 3 + c] / Math.max(a, 0.3))) : 0;
    out[k * 4 + 3] = Math.round(a * 255);
  }
  const png = await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  const trimmed = await sharp(png).trim({ threshold: 1 }).png().toBuffer();
  files['monogram.webp'] = await sharp(trimmed).resize({ width: 600 }).webp({ quality: 92, alphaQuality: 100 }).toBuffer();
  const m = await sharp(files['monogram.webp']).metadata(); console.log('monogram', m.width, m.height);
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
    <text x="810" y="494" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#5b4a2a">Nirvana Grand Hotel and Resort, Bodhgaya</text>
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
  fs.mkdirSync(out, { recursive: true });  const skip = SKIP[path.basename(path.dirname(out))];
  for (const [name, buf] of Object.entries(files)) if (!skip.includes(name)) fs.writeFileSync(path.join(out, name), buf);
  console.log('wrote', path.relative(ROOT, out), Object.keys(files).join(' '));
}
