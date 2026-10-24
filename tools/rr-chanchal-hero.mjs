#!/usr/bin/env node
/* Opening page of chanchal-jp-sharma-wedding: the designer's lakeside page with the client's
   figures standing in it instead of the illustrated couple — since 2026-10-24 Shiv–Parvati
   (shiv-parvati.jpg); before that the client's Rajasthani couple (couple-rajasthani-cutout.jpg).
   Always built from the designer's untouched page, so no earlier figure is ever underneath.

     node tools/rr-chanchal-hero.mjs        (also run by tools/prep-rr-chanchal-jp.mjs)
     FIGURE=… PLACE=scale,cx,top OUT=…       try another figure or placement

   1. The illustrated couple's outline is traced and removed from the page; the hole is filled
      from the surrounding sky, hills, lake and terrace — nothing else on the page changes.
   2. The client's couple arrives as a JPEG on pure black: every black area large enough to be
      background (also the pocket between the bride's arm and the groom) becomes transparent;
      hair and dark embroidery are never black enough to be touched. The edge is pulled in a
      pixel to drop the dark fringe and softened.
   3. The couple is lit for the scene: a little warmer and softer to match the painting, a warm
      sunset rim along the outline and the sky's own colour wrapped onto the edge. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const PAGE = path.join(ROOT, 'public/rr-wedding-26nov/assets/couple-page.webp');          // designer's page, untouched
const NEW = path.resolve(ROOT, process.env.FIGURE || 'invites/src/chanchal-jp-wedding/shiv-parvati.jpg');
const OUT = path.resolve(ROOT, process.env.OUT || 'public/chanchal-jp-sharma-wedding/assets/couple-page.webp');
const [ps, pcx, ptop] = (process.env.PLACE || '.66,760,1621').split(',').map(Number);
const PLACE = { scale: ps, cx: pcx, top: ptop };                   // the figures, in page pixels (Rajasthani couple was .84,800,1532)
const log = (...a) => process.argv.includes('-v') && console.log(...a);

const raw = async (img, ch) => { const { data, info } = await sharp(img).raw().toBuffer({ resolveWithObject: true }); return { d: data, w: info.width, h: info.height, c: info.channels }; };

/* ---------- 1. the illustrated couple's outline, traced on the page (page pixels) ----------
   The theme's separate couple.webp is a different render, so the outline is traced here; it is
   generous by a few pixels and is then grown, so none of the old figures' edge survives. */
const page = await raw(await sharp(PAGE).removeAlpha().toBuffer());
const W = page.w, H = page.h;
const OUTLINE = [[262, 833], [290, 760], [320, 700], [355, 650], [360, 600], [372, 520], [385, 500], [390, 430], [398, 385], [425, 362],
  [465, 360], [500, 378], [492, 335], [495, 292], [545, 270], [600, 274], [634, 308], [636, 360], [612, 385], [690, 392], [742, 430],
  [762, 470], [778, 530], [783, 620], [782, 720], [785, 833], [785, 840], [262, 840]].map(([x, y]) => [x * 1.5, y * 1.5 + 1150]);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="black"/><polygon points="${OUTLINE.map(p => p.join(',')).join(' ')}" fill="white"/></svg>`;
const outl = await raw(await sharp(Buffer.from(svg)).greyscale().raw().toBuffer({ resolveWithObject: true }).then(r => sharp(r.data, { raw: r.info }).png().toBuffer()));
const hole = new Uint8Array(W * H); for (let k = 0; k < W * H; k++) hole[k] = outl.d[k * outl.c] > 127 ? 1 : 0;
function grow(m, r) { const out = new Uint8Array(m); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (m[y * W + x])
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < W && Y < H && dx * dx + dy * dy <= r * r) out[Y * W + X] = 1; } return out; }
const holeG = grow(hole, 14);
const at = { note: 'traced outline' };

/* The scene behind them is built in horizontal bands (sky, hill line, far shore, lake, terrace),
   so each row of the hole is carried straight across from the painting on its left to the painting
   on its right; a light vertical smoothing then removes any streaks, and the painting's grain returns. */
const plate = Float32Array.from(page.d);
for (let y = 0; y < H; y++) {
  let x = 0;
  while (x < W) {
    if (!holeG[y * W + x]) { x++; continue; }
    const a = x; while (x < W && holeG[y * W + x]) x++; const b = x;          // hole run [a, b)
    const side = (from, dir) => { const acc = [0, 0, 0]; let n = 0;
      for (let k = 1; k <= 6; k++) { const X = from + dir * k; if (X < 0 || X >= W || holeG[y * W + X]) break; for (let c = 0; c < 3; c++) acc[c] += page.d[(y * W + X) * 3 + c]; n++; }
      return n ? acc.map(v => v / n) : null; };
    let Lc = side(a, -1), Rc = side(b - 1, 1); Lc = Lc || Rc; Rc = Rc || Lc; if (!Lc) continue;
    for (let X = a; X < b; X++) { const t = (X - a + .5) / (b - a); for (let c = 0; c < 3; c++) plate[(y * W + X) * 3 + c] = Lc[c] * (1 - t) + Rc[c] * t; }
  }
}
{ // vertical smoothing inside the hole (7 rows), then grain
  const tmp = Float32Array.from(plate);
  for (let y = 3; y < H - 3; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (!holeG[i]) continue;
    for (let c = 0; c < 3; c++) { let s = 0; for (let k = -3; k <= 3; k++) s += tmp[(i + k * W) * 3 + c]; plate[i * 3 + c] = s / 7; } }
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - .5;
  for (let i = 0; i < W * H; i++) if (holeG[i]) { const g = rnd() * 5; for (let c = 0; c < 3; c++) plate[i * 3 + c] += g; }
}

/* ---------- 2. the client's couple: key, de-fringe, soften ---------- */
const nc = await raw(NEW);
const NW = nc.w, NH = nc.h, mx = (i) => Math.max(nc.d[i * 3], nc.d[i * 3 + 1], nc.d[i * 3 + 2]);
const dark = new Uint8Array(NW * NH); for (let i = 0; i < NW * NH; i++) dark[i] = mx(i) <= 10 ? 1 : 0;
const bg = new Uint8Array(NW * NH), seen = new Uint8Array(NW * NH);
for (let s = 0; s < NW * NH; s++) {                               // every black region: background if it touches the border or is big
  if (!dark[s] || seen[s]) continue;
  const comp = [s]; seen[s] = 1; let border = false;
  for (let q = 0; q < comp.length; q++) { const i = comp[q], x = i % NW, y = (i / NW) | 0; if (x === 0 || y === 0 || x === NW - 1 || y === NH - 1) border = true;
    for (const j of [i - 1, i + 1, i - NW, i + NW]) if (j >= 0 && j < NW * NH && dark[j] && !seen[j] && Math.abs((j % NW) - x) <= 1) { seen[j] = 1; comp.push(j); } }
  if (border || comp.length > 250) for (const i of comp) bg[i] = 1;
}
// distance (in px) from the background, capped — drives the soft edge, the rim light and the light wrap
const dist = new Float32Array(NW * NH).fill(99);
for (let i = 0; i < NW * NH; i++) if (bg[i]) dist[i] = 0;
for (let pass = 0; pass < 2; pass++) for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) {
  const i = y * NW + x; if (!dist[i]) continue;
  const nb = pass === 0 ? [[-1, 0], [0, -1], [-1, -1], [1, -1]] : [[1, 0], [0, 1], [1, 1], [-1, 1]];
  for (const [dx, dy] of nb) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= NW || Y >= NH) continue; const v = dist[Y * NW + X] + (dx && dy ? 1.414 : 1); if (v < dist[i]) dist[i] = v; }
}
for (let pass = 0; pass < 2; pass++) for (let y = NH - 1; y >= 0; y--) for (let x = NW - 1; x >= 0; x--) {
  const i = y * NW + x; if (!dist[i]) continue;
  for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [-1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1]]) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= NW || Y >= NH) continue; const v = dist[Y * NW + X] + (dx && dy ? 1.414 : 1); if (v < dist[i]) dist[i] = v; }
}

/* ---------- 3. place on the page with scene lighting ---------- */
const cw = Math.round(NW * PLACE.scale), ch = Math.round(NH * PLACE.scale), left = Math.round(PLACE.cx - cw / 2), top = PLACE.top;
// build the couple layer at its own size: RGB graded, alpha from the softened edge
const layer = Buffer.alloc(NW * NH * 4);
for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) {
  const i = y * NW + x, d = dist[i];
  const a = Math.max(0, Math.min(1, (d - 1.2) / 1.6));            // drop the 1px dark fringe, 1.6px soft edge
  let r = nc.d[i * 3], g = nc.d[i * 3 + 1], b = nc.d[i * 3 + 2];
  // sunset grade: warmer, a touch softer and darker below (the light is behind and above them)
  const vy = y / NH, shade = 1 - .16 * Math.max(0, vy - .35);
  const lum = .3 * r + .59 * g + .11 * b;
  r = (lum + (r - lum) * .9) * 1.0 * shade; g = (lum + (g - lum) * .9) * .93 * shade; b = (lum + (b - lum) * .9) * .9 * shade;
  r = r * .94 + 10; g = g * .94 + 4; b = b * .94 + 8;            // lift the blacks a little toward the painting's maroon
  // warm rim where the sky is behind them (strongest on the upper body)
  const rim = Math.max(0, 1 - (d - 1.2) / 7) * (1 - .7 * vy) * .42;
  r += (255 - r) * rim; g += (178 - g) * rim * .85; b += (150 - b) * rim * .7;
  layer[i * 4] = Math.max(0, Math.min(255, r)); layer[i * 4 + 1] = Math.max(0, Math.min(255, g)); layer[i * 4 + 2] = Math.max(0, Math.min(255, b));
  layer[i * 4 + 3] = Math.round(a * 255);
}
const placed = await raw(await sharp(layer, { raw: { width: NW, height: NH, channels: 4 } }).resize(cw, ch, { kernel: 'lanczos3' }).blur(.45).raw().toBuffer({ resolveWithObject: true }).then(r => sharp(r.data, { raw: r.info }).png().toBuffer()));

// light wrap: the blurred scene behind them bleeds a little onto their outline
const plateBuf = Buffer.alloc(W * H * 3); for (let i = 0; i < plate.length; i++) plateBuf[i] = Math.max(0, Math.min(255, Math.round(plate[i])));
const behind = await raw(await sharp(plateBuf, { raw: { width: W, height: H, channels: 3 } }).blur(9).png().toBuffer());
const final = Buffer.from(plateBuf);
for (let y = 0; y < ch; y++) { const Y = top + y; if (Y < 0 || Y >= H) continue;
  for (let x = 0; x < cw; x++) { const X = left + x; if (X < 0 || X >= W) continue;
    const pi = (y * cw + x) * 4, a = placed.d[pi + 3] / 255; if (!a) continue;
    // edge-ness from the alpha of neighbours (cheap: how far below 1 the 5px neighbourhood is)
    let lo = 1; for (const [dx, dy] of [[-4, 0], [4, 0], [0, -4], [0, 4], [-3, -3], [3, -3]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= cw || yy >= ch) { lo = 0; continue; } lo = Math.min(lo, placed.d[(yy * cw + xx) * 4 + 3] / 255); }
    const wrap = (1 - lo) * .32, gi = (Y * W + X) * 3;
    for (let c = 0; c < 3; c++) { const fg = placed.d[pi + c] * (1 - wrap) + behind.d[gi + c] * wrap; final[gi + c] = Math.round(fg * a + final[gi + c] * (1 - a)); }
  } }
await sharp(final, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 90, effort: 6 }).toFile(OUT);
console.log('hero ->', path.relative(ROOT, OUT));
