/* Marathi wedding (public/marathi-wedding): turns the designer pack "marathi wedding"
 * in invites/src/marathi-wedding/ into web assets.
 *   node tools/build-marathi-wedding-art.mjs
 * Backgrounds: the eight clean screens (and the opening door) as WebP at 941×1671.
 * Elements: trimmed, WebP with alpha, long side at most 1000px. Three elements come
 * with a baked-in checkerboard instead of transparency (the magenta tassel pendant,
 * the hands polaroid, the "सदैव सोबत" memory card): the checkerboard is keyed out.
 * The calendar's printed "नवंबर 2024" grid is painted over with its own parchment so
 * the month is rendered live for the configured date; the wishes bar's printed
 * placeholder is removed so a real input can sit on it.
 * Prints js/art-sizes.js.
 */
import fs from 'node:fs';
import sharp from 'sharp';

const SRC = 'invites/src/marathi-wedding/marathi wedding';
const EL = `${SRC}/elements`;
const OUT = 'public/marathi-wedding/assets';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync('public/marathi-wedding/js', { recursive: true });
const W = 941, H = 1671, MAX = 1000;
const sizes = {};
const log = (k, w, h) => { sizes[k] = [w, h]; console.log(k.padEnd(12), w, h); };

/* ── backgrounds ── */
const screens = { 1: '1 (2).png', 2: '2.png', 3: '3.png', 4: '4.png', 5: '5.png', 6: '6.png', 7: '7.png', 8: '8.png' };
for (const [n, f] of Object.entries(screens)) {
  await sharp(`${SRC}/${f}`).resize(W, H, { fit: 'fill' }).webp({ quality: 88 }).toFile(`${OUT}/bg${n}.webp`);
  log(`bg${n}`, W, H);
}
await sharp(`${SRC}/opening page.png`).resize(W, H, { fit: 'fill' }).webp({ quality: 88 }).toFile(`${OUT}/open.webp`);
log('open', W, H);

/* ── key out a baked checkerboard: every light neutral pixel connected to the border,
      plus enclosed light-neutral patches that mix white and grey cells ── */
async function keyCheckerboard(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, n = w * h;
  const neutral = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx - mn <= 18 && mn >= 165) neutral[i] = 1;
  }
  const label = new Int32Array(n); let nl = 0; const comps = [];
  for (let s = 0; s < n; s++) {
    if (!neutral[s] || label[s]) continue;
    nl++; const c = { id: nl, area: 0, border: false, white: false, grey: false }; comps.push(c);
    const st = [s]; label[s] = nl;
    while (st.length) {
      const i = st.pop(); c.area++;
      const x = i % w, y = (i / w) | 0;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) c.border = true;
      const v = data[i * 4]; if (v >= 240) c.white = true; if (v <= 220) c.grey = true;
      if (x > 0 && neutral[i - 1] && !label[i - 1]) { label[i - 1] = nl; st.push(i - 1); }
      if (x < w - 1 && neutral[i + 1] && !label[i + 1]) { label[i + 1] = nl; st.push(i + 1); }
      if (y > 0 && neutral[i - w] && !label[i - w]) { label[i - w] = nl; st.push(i - w); }
      if (y < h - 1 && neutral[i + w] && !label[i + w]) { label[i + w] = nl; st.push(i + w); }
    }
  }
  const kill = new Uint8Array(nl + 1);
  for (const c of comps) if (c.border || (c.white && c.grey && c.area > 150)) kill[c.id] = 1;
  const gone = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (label[i] && kill[label[i]]) { gone[i] = 1; data[i * 4 + 3] = 0; }
  // soften the cut: a pixel beside the keyed area fades by its own lightness
  for (let i = 0; i < n; i++) {
    if (gone[i]) continue;
    const x = i % w, y = (i / w) | 0;
    const edge = (x > 0 && gone[i - 1]) || (x < w - 1 && gone[i + 1]) || (y > 0 && gone[i - w]) || (y < h - 1 && gone[i + w]);
    if (!edge) continue;
    const mn = Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
    data[i * 4 + 3] = Math.round(255 * Math.max(0.15, Math.min(1, (255 - mn) / 110)));
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

/* ── paint printed text out of a flat area: text pixels (by colour) inside the zones are
      replaced by a wide normalised blur of the surrounding surface ── */
async function inpaintText(file, zones, isText, radius = 16) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, n = w * h;
  const mask = new Uint8Array(n);
  for (const z of zones) for (let y = z.y0; y < z.y1; y++) for (let x = z.x0; x < z.x1; x++) {
    const i = y * w + x; if (data[i * 4 + 3] > 0 && isText(data[i * 4], data[i * 4 + 1], data[i * 4 + 2])) mask[i] = 1;
  }
  const dil = new Uint8Array(n);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (mask[y * w + x]) for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const yy = y + dy, xx = x + dx; if (yy >= 0 && yy < h && xx >= 0 && xx < w) dil[yy * w + xx] = 1; }
  const wgt = new Float32Array(n), ch = [new Float32Array(n), new Float32Array(n), new Float32Array(n)];
  for (let i = 0; i < n; i++) if (!dil[i] && data[i * 4 + 3] > 200) { wgt[i] = 1; ch[0][i] = data[i * 4]; ch[1][i] = data[i * 4 + 1]; ch[2][i] = data[i * 4 + 2]; }
  // separable box blur with prefix sums
  const blur = (src) => {
    const t = new Float32Array(n), out = new Float32Array(n);
    for (let y = 0; y < h; y++) { const p = new Float32Array(w + 1); for (let x = 0; x < w; x++) p[x + 1] = p[x] + src[y * w + x]; for (let x = 0; x < w; x++) t[y * w + x] = p[Math.min(w, x + radius + 1)] - p[Math.max(0, x - radius)]; }
    for (let x = 0; x < w; x++) { const p = new Float32Array(h + 1); for (let y = 0; y < h; y++) p[y + 1] = p[y] + t[y * w + x]; for (let y = 0; y < h; y++) out[y * w + x] = p[Math.min(h, y + radius + 1)] - p[Math.max(0, y - radius)]; }
    return out;
  };
  const wb = blur(wgt), cb = ch.map(blur);
  for (let i = 0; i < n; i++) if (dil[i] && wb[i] > 0) { data[i * 4] = cb[0][i] / wb[i]; data[i * 4 + 1] = cb[1][i] / wb[i]; data[i * 4 + 2] = cb[2][i] / wb[i]; }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}
const darkOrMaroon = (r, g, b) => (r < 150 && g < 150 && b < 150) || (r > 100 && g < 95 && b < 115 && r - g > 50);

/* ── elements ── */
const elements = {
  couple: '1/Intimate Indian Wedding Couple Cutout.png',
  bell: '1/Ornate Golden Hanging Bell Ornament.png',
  jhumka: '1/Ornate Golden Jhumka Bell Pendant.png',
  butterfly: '1/Champagne Gold Embroidered Butterfly Ornament.png',
  'tassel-m': { file: '1/Ornate Magenta Silk Tassel Pendant.png', key: true },
  'tassel-p': '2/Luxurious Pink and Gold Tassel.png',
  'pol-1': '2/Embroidered Sunset Couple Polaroid-1.png',
  'pol-2': { file: '2/Embroidered Wedding Hands Polaroid (1).png', key: true },
  'pol-3': { file: '2/Embroidered Sunset Palace Memory Card-3.png', key: true },
  calendar: {
    file: '3/Luxurious November 2024 Floral Calendar.png',
    inpaint: [{ x0: 380, y0: 330, x1: 750, y1: 392 }, { x0: 330, y0: 205, x1: 410, y1: 270 }, { x0: 240, y0: 452, x1: 880, y1: 508 }, { x0: 240, y0: 535, x1: 880, y1: 925 }],
  },
  // the pill of the reveal button alone: the pack's flower wings either side would sit on the garlands of 3.png
  'btn-reveal': { file: '3/Ornate Marathi Wedding Invitation Button.png', crop: { left: 400, top: 160, width: 1345, height: 440 } },
  // the tassel alone (bead, cap, skirt) — the hero hangs these from the pearl strings painted in 1.png
  'tassel-s': { file: '1/Ornate Magenta Silk Tassel Pendant.png', key: true, cropAfterTrim: { y0: 0.38, y1: 1 } },
  heart: '3/Ornate Pearl and Pink Beaded Heart Frame.png',
  haldi: '4/Ornate Golden Turmeric Bowl Arrangement.png',
  mehndi: '4/Ornate Golden Bowl of Festive Powders.png',
  mandap: '4/Luxurious Magenta Wedding Mandap Stage.png',
  throne: '4/Ornate Gold Wedding Throne Vignette.png',
  'btn-map': '4/Luxury Beige Map Button with Marathi Text.png',
  lotus: '5/Ornate Golden Lotus Emblem.png',
  'btn-rsvp': '6/Luxurious Peach Marathi RSVP Button-1.png',
  'bar-wish': { file: '6/तुमच्या शुभेच्छांसाठी सुवर्ण संदेशपट्टी-2.png', inpaint: [{ x0: 150, y0: 230, x1: 1700, y1: 520 }] },
  divider: '7/Luxurious Gold Floral Ornamental Divider.png',
  'gift-icon': '7/Ornate Magenta and Gold Gift Bow.png',
  bird: '7/Ornate Pink and Gold Embroidered Bird.png',
  'btn-gift': '7/आशीर्वाद स्वरूप भेट बटन.png',
};
for (const [id, spec] of Object.entries(elements)) {
  const o = typeof spec === 'string' ? { file: spec } : spec;
  const file = `${EL}/${o.file}`;
  let input = o.key ? await keyCheckerboard(file) : o.inpaint ? await inpaintText(file, o.inpaint, darkOrMaroon) : file;
  if (o.crop) input = await sharp(input).extract(o.crop).png().toBuffer();
  let trimmed = await sharp(input).trim({ threshold: 6 }).png().toBuffer({ resolveWithObject: true });
  if (o.cropAfterTrim) {
    const { width: tw, height: th } = trimmed.info, c = o.cropAfterTrim;
    const cut = await sharp(trimmed.data).extract({ left: 0, top: Math.round(th * c.y0), width: tw, height: Math.round(th * (c.y1 - c.y0)) }).png().toBuffer();
    trimmed = await sharp(cut).trim({ threshold: 6 }).png().toBuffer({ resolveWithObject: true });
  }
  let { width: iw, height: ih } = trimmed.info;
  let img = sharp(trimmed.data);
  if (Math.max(iw, ih) > MAX) { const k = MAX / Math.max(iw, ih); iw = Math.round(iw * k); ih = Math.round(ih * k); img = img.resize(iw, ih); }
  await img.webp({ quality: 84, alphaQuality: 90 }).toFile(`${OUT}/${id}.webp`);
  log(id, iw, ih);
}

/* ── the flower sprigs the designer drew around the names (only in the text reference): cut
      from the reference against the clean screen, the maroon lettering masked out, so the
      page can show them around names of its own ── */
{
  const ref = await sharp(`${SRC}/with text temp for reference/1 (1).png`).resize(W, H, { fit: 'fill' }).removeAlpha().raw().toBuffer();
  const clean = await sharp(`${SRC}/1 (2).png`).resize(W, H, { fit: 'fill' }).removeAlpha().raw().toBuffer();
  // [x, y, w, h] on the 941×1671 page; textBelow: the lettering only touches rows above this page y
  const sprigs = { 'sprig-a': [780, 360, 100, 120], 'sprig-b': [430, 445, 85, 95], 'sprig-c': [445, 625, 72, 118, 645], 'sprig-d': [790, 638, 110, 118] };
  for (const [id, [x0, y0, w, h, textBelow]] of Object.entries(sprigs)) {
    const isText = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = ((y0 + y) * W + x0 + x) * 3;
      const r = ref[i], g = ref[i + 1], b = ref[i + 2];
      if (r > 80 && g < 80 && b < 100 && r - g > 45 && (!textBelow || y0 + y < textBelow)) isText[y * w + x] = 1; // the maroon lettering
    }
    const near = (x, y) => { for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && xx < w && yy >= 0 && yy < h && isText[yy * w + xx]) return true; } return false; };
    const out = Buffer.alloc(w * h * 4);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = ((y0 + y) * W + x0 + x) * 3, o = (y * w + x) * 4;
      const r = ref[i], g = ref[i + 1], b = ref[i + 2];
      const d = Math.abs(r - clean[i]) + Math.abs(g - clean[i + 1]) + Math.abs(b - clean[i + 2]);
      out[o] = r; out[o + 1] = g; out[o + 2] = b;
      // the sky differs a little between the two renders, so only a clear difference counts, and the
      // cut fades out towards its own edges so no rectangle can show
      const edge = Math.min(1, Math.min(x, w - 1 - x, y, h - 1 - y) / 8);
      const a = Math.max(0, Math.min(1, (d - 48) / 60));
      out[o + 3] = near(x, y) ? 0 : Math.round(255 * a * a * edge);
    }
    const png = await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
    const t = await sharp(png).trim({ threshold: 4 }).png().toBuffer({ resolveWithObject: true });
    await sharp(t.data).webp({ quality: 84, alphaQuality: 90 }).toFile(`${OUT}/${id}.webp`);
    log(id, t.info.width, t.info.height, `at ${x0 + t.info.trimOffsetLeft * -1}`);
    sizes[id].push(x0 - t.info.trimOffsetLeft, y0 - t.info.trimOffsetTop); // page position of the cut, for app.js
  }
}

/* ── link preview: the names band of the designer's own text reference ── */
await sharp(await sharp(`${SRC}/with text temp for reference/1 (1).png`).resize(W, H, { fit: 'fill' }).png().toBuffer()).extract({ left: 0, top: 300, width: 941, height: 494 }).resize(1200, 630).jpeg({ quality: 85 }).toFile(`${OUT}/og.jpg`);

/* ── film and song ── */
fs.copyFileSync(`${SRC}/ai video.mp4`, `${OUT}/opening.mp4`);
const mp3 = fs.readdirSync(SRC).find((f) => f.endsWith('.mp3'));
fs.copyFileSync(`${SRC}/${mp3}`, `${OUT}/music.mp3`);

fs.writeFileSync('public/marathi-wedding/js/art-sizes.js', `/* generated by tools/build-marathi-wedding-art.mjs — [width, height] of every asset */\nexport const artSizes = {\n${Object.entries(sizes).map(([k, v]) => `  ${JSON.stringify(k)}:[${v}],`).join('\n')}\n};\n`);
console.log('\nwritten', OUT);
