/* Dr. Snehal & Dr. Rushikesh (public/dr-snehal-dr-rushikesh-wedding), a copy of the IKON Celebration page
   (public/ikon-celebration-wedding, never edited for this). Builds the two plates this page changes:

   - plate5.webp (Save the Date): the IKON plate with its painted date card (frame, corner sprigs, calendar and
     clock icons) painted out of the wall, so the page's own date card can sit higher with a clear gap above the
     two buttons. Each row of the card's area is filled from the wall on both sides of it.
   - plate7.webp (the Bride / Groom pages): the design's empty gold frame, copied from the Vaishali & Arpan page
     (read only). The Groom page shows it mirrored with CSS.

   Run:  node tools/dr-snehal-dr-rushikesh-wedding.mjs */
import fs from 'node:fs';
import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)('sharp');

const OUT = 'public/dr-snehal-dr-rushikesh-wedding/assets';
const SRC5 = 'public/ikon-celebration-wedding/assets/plate5.webp';
const SRC7 = 'public/vaishali-arpan-wedding/assets/plate7.webp';

/* the painted card, measured on the 941 × 1672 plate: frame 272–688 × 682–892, sprigs to 232 / 718, the
   painted buttons start at y 905. Fill x 255–690 (in these rows the painted frame starts at ~265; wall at 247–253 on the left; on the right the wall at
   691–695, the plate's leaves begin at 697), the rows between the bottom of the page's card (853) and the buttons' top edge (the card hides the rest). */
const FILL = { x0: 255, x1: 690, y0: 846, y1: 902, l: [247, 253], r: [691, 695] };

const { data, info } = await sharp(SRC5).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, channels: C } = info;
const px = (x, y, c) => data[(y * W + x) * C + c];
const avg = (y, [a, b]) => [0, 1, 2].map((c) => { let s = 0; for (let x = a; x <= b; x++) s += px(x, y, c); return s / (b - a + 1); });
/* a little of the wall's own grain, so the filled band is not glassy: a fixed pseudo-random value per pixel */
const grain = (x, y) => { const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return (n - Math.floor(n) - 0.5) * 3; };
for (let y = FILL.y0; y <= FILL.y1; y++) {
  const L = avg(y, FILL.l), R = avg(y, FILL.r);
  for (let x = FILL.x0; x <= FILL.x1; x++) {
    const t = (x - (FILL.l[1] + 1)) / ((FILL.r[0] - 1) - (FILL.l[1] + 1));
    const g = grain(x, y);
    for (let c = 0; c < 3; c++) data[(y * W + x) * C + c] = Math.max(0, Math.min(255, Math.round(L[c] + (R[c] - L[c]) * t + g)));
  }
}
await sharp(data, { raw: info }).webp({ quality: 90 }).toFile(`${OUT}/plate5.webp`);
fs.copyFileSync(SRC7, `${OUT}/plate7.webp`);
console.log('✓ plate5.webp (painted card removed), plate7.webp (copied)');
