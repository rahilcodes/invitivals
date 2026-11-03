#!/usr/bin/env node
/* Lokesh & Akansha — the art for the two groom-side WEDDING pages (client, 2026-11-04):
     public/lokesh-akansha-wedding       all functions (Haldi, Mehndi & Sangeet, Ghudchadhi, Baraat, Feras)
     public/lokesh-akansha-wedding-day   the wedding day only

     node tools/lokesh-akansha-wedding-art.mjs

   The design follows public/lakshmi-saicharan-engagement (never written to): its plain floral papers and small
   ornaments are copied; none of its engagement pieces (the "Engagement" lettering, the ring box, that couple's art,
   photo and L C logo) are used. Then, per page:
     bg/p1 p4 p5 p6.webp      the papers as they are
     bg/p2.webp               the curtained paper with its painted "Save the Date" pill cleared
     el/…                     bells, Ganesha, garlands, sprig, bird, butterfly, tassels as they are
     el/hands.webp            the client's photograph of the couple's hands — only resized, never retouched or cropped
     el/venue.webp            the client's picture of Palm Luxuria Banquets — only resized (replace the file to change it)
   The L & A seal is made by tools/saicharan-lakshmi-cl.mjs + saicharan-lakshmi-film.mjs with MARK=la
   (sources: invites/src/saicharan-lakshmi-engagement/la-logo.jpg, typeset gold L & A on black), see the page notes.

   Sources in invites/src/lokesh-akansha-wedding (not committed): hands.jpg, venue-palm-luxuria.jpg, brief.pdf. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const REF = path.join(ROOT, 'public/lakshmi-saicharan-engagement/assets');
const SRC = path.join(ROOT, 'invites/src/lokesh-akansha-wedding');
const SLUGS = ['lokesh-akansha-wedding', 'lokesh-akansha-wedding-day'];
const EL = ['bell', 'bell2', 'ganesha', 'garland', 'garland2', 'sprig', 'bird', 'butterfly', 'tasselA', 'tasselB'];

/* p2 without the painted pill: the pill's box is covered with the same paper (its damask) from just above it,
   blended in over a soft edge so no seam shows */
async function cleanP2() {
  const { data, info } = await sharp(path.join(REF, 'bg/p2.webp')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, px = Buffer.from(data);
  const R = [288, 1398, 678, 1528], DY = -(R[3] - R[1]) - 6, F = 18;   // box, where the clean paper is taken from, feather
  for (let y = R[1]; y < R[3]; y++) for (let x = R[0]; x < R[2]; x++) {
    const e = Math.min(x - R[0], R[2] - 1 - x, y - R[1], R[3] - 1 - y), a = Math.min(1, e / F);
    const i = (y * W + x) * 3, j = ((y + DY) * W + x) * 3;
    for (let c = 0; c < 3; c++) px[i + c] = Math.round(px[i + c] * (1 - a) + data[j + c] * a);
  }
  return sharp(px, { raw: { width: W, height: info.height, channels: 3 } }).webp({ quality: 88, effort: 6 }).toBuffer();
}

const p2 = await cleanP2();
const hands = await sharp(path.join(SRC, 'hands.jpg')).resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 88, effort: 6 }).toBuffer();
const venue = await sharp(path.join(SRC, 'venue-palm-luxuria.jpg')).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 86, effort: 6 }).toBuffer();
for (const slug of SLUGS) {
  const A = path.join(ROOT, 'public', slug, 'assets');
  for (const d of ['bg', 'el', 'media']) fs.mkdirSync(path.join(A, d), { recursive: true });
  for (const p of ['p1', 'p4', 'p5', 'p6']) fs.copyFileSync(path.join(REF, `bg/${p}.webp`), path.join(A, `bg/${p}.webp`));
  fs.writeFileSync(path.join(A, 'bg/p2.webp'), p2);
  for (const e of EL) fs.copyFileSync(path.join(REF, `el/${e}.webp`), path.join(A, `el/${e}.webp`));
  fs.writeFileSync(path.join(A, 'el/hands.webp'), hands);
  fs.writeFileSync(path.join(A, 'el/venue.webp'), venue);
  console.log(slug, '→ papers, ornaments, hands.webp, venue.webp');
}
