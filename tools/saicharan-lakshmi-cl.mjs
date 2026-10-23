#!/usr/bin/env node
/* Sai Charan & Lakshmi engagement — client changes of 2026-10-23 (groom-side page):
   the couple's CL monogram on the envelope's wax seal, and their own illustration.

     node tools/saicharan-lakshmi-cl.mjs

   Sources (invites/src/saicharan-lakshmi-engagement, gitignored):
     cl-logo.jpg            the client's CL monogram — arrived on pure black (its transparency was lost
                            in upload), so the black is keyed out; the design itself is untouched
     couple-illustration.jpg the couple's illustration, used whole
   Writes into public/saicharan-lakshmi-engagement/assets/:
     bg/opening-cl.webp     the envelope still with the CL monogram stamped on the seal (was "A G")
     el/seal-cl.webp        just the stamped seal disc, laid over the opening film while the seal shows
     el/cl-logo.webp        the keyed monogram on its own
     el/couple-art.webp     the illustration for the single framed picture */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const SRC = path.join(ROOT, 'invites/src/saicharan-lakshmi-engagement');
const OUT = path.join(ROOT, 'public/saicharan-lakshmi-engagement/assets');
const STILL = path.join(OUT, 'bg/opening.webp');                  // the designer's envelope, kept as it is
const SEAL = { cx: 472, cy: 870, r: 90, logo: 164 };               // inner disc of the wax seal, in the still's pixels

/* 1. key the monogram off its black: alpha from brightness, colour un-premultiplied so the gold edge stays gold */
async function keyLogo() {
  const { data, info } = await sharp(path.join(SRC, 'cl-logo.jpg')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2], m = Math.max(r, g, b);
    const a = Math.max(0, Math.min(1, (m - 14) / 70));
    const k = a > 0 ? 1 / Math.max(a, .35) : 0;                      // gentle un-premultiply (no blown-out fringe)
    out[i * 4] = Math.min(255, r * k); out[i * 4 + 1] = Math.min(255, g * k); out[i * 4 + 2] = Math.min(255, b * k);
    out[i * 4 + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

/* 2. the seal's inner disc without "A G": filled from the wax ring around it (smooth membrane) plus the wax's grain */
async function cleanSeal() {
  const { data, info } = await sharp(STILL).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, px = Float32Array.from(data);
  const inDisc = (x, y) => (x - SEAL.cx) ** 2 + (y - SEAL.cy) ** 2 <= SEAL.r ** 2;
  const x0 = SEAL.cx - SEAL.r - 2, x1 = SEAL.cx + SEAL.r + 2, y0 = SEAL.cy - SEAL.r - 2, y1 = SEAL.cy + SEAL.r + 2;
  // seed with the ring's average, then relax
  let acc = [0, 0, 0], n = 0;
  for (let a = 0; a < 360; a += 2) { const x = Math.round(SEAL.cx + Math.cos(a * Math.PI / 180) * (SEAL.r + 1)), y = Math.round(SEAL.cy + Math.sin(a * Math.PI / 180) * (SEAL.r + 1)); for (let c = 0; c < 3; c++) acc[c] += px[(y * W + x) * 3 + c]; n++; }
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inDisc(x, y)) for (let c = 0; c < 3; c++) px[(y * W + x) * 3 + c] = acc[c] / n;
  for (let it = 0; it < 900; it++) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inDisc(x, y)) {
    const i = (y * W + x) * 3; for (let c = 0; c < 3; c++) px[i + c] = (px[i - 3 + c] + px[i + 3 + c] + px[i - W * 3 + c] + px[i + W * 3 + c]) / 4;
  }
  // a soft light from the upper left, like the rest of the seal, and the wax's fine grain
  let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - .5;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inDisc(x, y)) {
    const u = (x - SEAL.cx) / SEAL.r, v = (y - SEAL.cy) / SEAL.r, light = 1 + .05 * (-u - v) / 1.4, g = rnd() * 4;
    for (let c = 0; c < 3; c++) px[(y * W + x) * 3 + c] = px[(y * W + x) * 3 + c] * light + g;
  }
  const buf = Buffer.alloc(px.length); for (let i = 0; i < px.length; i++) buf[i] = Math.max(0, Math.min(255, Math.round(px[i])));
  return { buf, W, H };
}

const logo = await keyLogo();
await sharp(logo).resize({ width: 900 }).webp({ quality: 92, alphaQuality: 95 }).toFile(path.join(OUT, 'el/cl-logo.webp'));

const { buf, W, H } = await cleanSeal();
const L = SEAL.logo;
const logoSmall = await sharp(logo).resize(L, L, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
// pressed into the wax: a soft shadow just below and to the right, a faint highlight above
const alpha = await sharp(logoSmall).extractChannel(3).toBuffer();
const shadow = await sharp({ create: { width: L, height: L, channels: 3, background: { r: 92, g: 58, b: 22 } } }).joinChannel(alpha).png().toBuffer()
  .then((b) => sharp(b).blur(1.6).ensureAlpha(.55).png().toBuffer());
const left = SEAL.cx - L / 2, top = SEAL.cy - L / 2 + 2;
const stamped = await sharp(buf, { raw: { width: W, height: H, channels: 3 } })
  .composite([{ input: shadow, left: Math.round(left + 1.5), top: Math.round(top + 2), blend: 'multiply' }, { input: logoSmall, left: Math.round(left), top: Math.round(top) }])
  .png().toBuffer();
await sharp(stamped).webp({ quality: 90, effort: 6 }).toFile(path.join(OUT, 'bg/opening-cl.webp'));

// the disc alone, soft-edged, for the film: 2× the still's resolution so it stays crisp while the film zooms in
const D = SEAL.r * 2 + 16, ox = SEAL.cx - D / 2, oy = SEAL.cy - D / 2;
const disc = await sharp(stamped).extract({ left: ox, top: oy, width: D, height: D }).removeAlpha().raw().toBuffer();
const rgba = Buffer.alloc(D * D * 4);
for (let y = 0; y < D; y++) for (let x = 0; x < D; x++) {
  const d = Math.hypot(x - D / 2 + .5, y - D / 2 + .5), a = Math.max(0, Math.min(1, (SEAL.r + 3 - d) / 6)), i = y * D + x;
  rgba[i * 4] = disc[i * 3]; rgba[i * 4 + 1] = disc[i * 3 + 1]; rgba[i * 4 + 2] = disc[i * 3 + 2]; rgba[i * 4 + 3] = Math.round(a * 255);
}
await sharp(rgba, { raw: { width: D, height: D, channels: 4 } }).resize(D * 2, D * 2, { kernel: 'lanczos3' }).webp({ quality: 92, alphaQuality: 95 }).toFile(path.join(OUT, 'el/seal-cl.webp'));

await sharp(path.join(SRC, 'couple-illustration.jpg')).resize({ width: 900 }).webp({ quality: 88, effort: 6 }).toFile(path.join(OUT, 'el/couple-art.webp'));
console.log('seal disc', D, 'px at', ox, oy, '(still', W, '×', H, ') → opening-cl, seal-cl, cl-logo, couple-art');
