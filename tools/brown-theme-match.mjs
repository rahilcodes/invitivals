/* Finds where each element of the brown-theme pack sits in its with-text reference.
 *   node tools/brown-theme-match.mjs [outfile.json]
 * Masked multi-scale template search (with mirror), coarse at 1/4 size, refined at full size.
 * cost = minus the normalised cross-correlation on luminance; below about -0.6 is a true match.
 * Positions are centre x, y and width in % of the reference canvas. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { keyOut, OPAQUE } from './lib/brown-theme-key.mjs';

const SRC = 'invites/src/brown-theme-wedding-zip/brown theme wedding';
const out = process.argv[2] || 'brown-theme-matches.json';

async function refAt(page, w) {
  const f = path.join(SRC, 'with text temp', `${page}.png`);
  const { data, info } = await sharp(f).removeAlpha().resize({ width: w }).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}
async function samples(buf, tw, flip, maxPts) {
  let img = sharp(buf).ensureAlpha().resize({ width: tw });
  if (flip) img = img.flop();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const pts = [];
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    if (data[i + 3] > 200) pts.push([x, y, data[i], data[i + 1], data[i + 2]]);
  }
  const step = Math.max(1, Math.floor(pts.length / maxPts));
  return { pts: pts.filter((_, k) => k % step === 0), w: info.width, h: info.height };
}
function scan(ref, t, x0, x1, y0, y1, step, keep) {
  // zero-mean normalised cross-correlation on luminance: 1 = same picture
  const best = [];
  const lum = t.lum || (t.lum = t.pts.map((p) => 0.3 * p[2] + 0.59 * p[3] + 0.11 * p[4]));
  for (let y = y0; y <= y1; y += step) for (let x = x0; x <= x1; x += step) {
    let n = 0, sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
    for (let k = 0; k < t.pts.length; k++) {
      const p = t.pts[k], px = x + p[0], py = y + p[1];
      if (px < 0 || py < 0 || px >= ref.w || py >= ref.h) continue;
      const i = (py * ref.w + px) * 3, v = 0.3 * ref.data[i] + 0.59 * ref.data[i + 1] + 0.11 * ref.data[i + 2], u = lum[k];
      n++; sa += u; sb += v; saa += u * u; sbb += v * v; sab += u * v;
    }
    if (n < t.pts.length * 0.6) continue;
    const den = Math.sqrt(Math.max(1, (saa - sa * sa / n)) * Math.max(1, (sbb - sb * sb / n)));
    const c = -(sab - sa * sb / n) / den; // negative so that lower is better
    if (best.length < keep || c < best[best.length - 1].c) { best.push({ c, x, y }); best.sort((p, q) => p.c - q.c); if (best.length > keep) best.pop(); }
  }
  return best;
}

const result = {};
const small = {}, big = {};
for (let page = 1; page <= 7; page++) {
  small[page] = await refAt(page, 235); big[page] = await refAt(page, 941);
  const dir = path.join(SRC, 'elements', String(page));
  for (const f of fs.readdirSync(dir)) {
    const file = path.join(dir, f), name = f.replace(/\.png$/, '');
    const raw = OPAQUE.has(`${page}/${name}`) ? await keyOut(file) : await sharp(file).png().toBuffer();
    const buf = await sharp(raw).ensureAlpha().trim({ threshold: 8 }).png().toBuffer();
    let top = [];
    for (const flip of [false, true]) for (let pct = 8; pct <= 92; pct += 3) {
      const tw = Math.round(235 * pct / 100);
      const t = await samples(buf, tw, flip, 220);
      if (t.pts.length < 20) continue;
      const r = scan(small[page], t, -t.w >> 1, 235 - (t.w >> 1), -t.h >> 1, small[page].h - (t.h >> 1), 2, 2);
      for (const b of r) top.push({ ...b, pct, flip, tw, th: t.h });
    }
    top.sort((a, b) => a.c - b.c); top = top.slice(0, 5);
    let fine = { c: 1e9 };
    for (const c of top) for (const d of [-2, -1, 0, 1, 2]) {
      const tw = Math.round(941 * (c.pct + d) / 100);
      const t = await samples(buf, tw, c.flip, 900);
      const r = scan(big[page], t, c.x * 4 - 14, c.x * 4 + 14, c.y * 4 - 14, c.y * 4 + 14, 2, 1);
      if (r[0] && r[0].c < fine.c) fine = { ...r[0], tw, th: t.h, flip: c.flip };
    }
    const H = big[page].h;
    result[`${page}/${name}`] = { cost: +fine.c.toFixed(2), x: +((fine.x + fine.tw / 2) / 9.41).toFixed(2), y: +((fine.y + fine.th / 2) / H * 100).toFixed(2), w: +(fine.tw / 9.41).toFixed(2), flip: fine.flip };
    console.log(`${page}/${name}`.padEnd(62), JSON.stringify(result[`${page}/${name}`]));
    fs.writeFileSync(out, JSON.stringify(result, null, 1));
  }
}
