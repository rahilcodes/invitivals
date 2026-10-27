/* Draws public/bengali-wedding/assets/og.jpg (1200×630), the banner WhatsApp shows under the link:
 * the hero painting and the couple on the left, the wording on cream on the right.
 *
 *   node tools/bengali-wedding-og.mjs
 *
 * Bengali text is set by the system's Bengali font (Nirmala UI / Vrinda on Windows).
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const A = path.join(ROOT, 'public/bengali-wedding/assets');
const W = 1200, H = 630;
const bg = await sharp(path.join(A, 'bg/p1.webp')).resize({ width: 560, height: H, fit: 'cover', position: 'top' }).toBuffer();
const couple = await sharp(path.join(A, 'el/couple.webp')).resize({ width: 520 }).toBuffer();
const coin = await sharp(path.join(A, 'el/coin.webp')).resize({ width: 110 }).toBuffer();
const F = 'Nirmala UI, Vrinda, Noto Serif Bengali, sans-serif';
const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#fbe7bd" stop-opacity="0"/><stop offset="1" stop-color="#fbe7bd"/></linearGradient></defs>
  <rect x="470" y="0" width="120" height="${H}" fill="url(#g)"/>
  <g font-family="${F}" text-anchor="middle">
    <text x="860" y="150" font-size="34" fill="#9a6b16" letter-spacing="2">॥ শুভ বিবাহের আমন্ত্রণ ॥</text>
    <text x="860" y="285" font-size="124" font-weight="700" fill="#b4142a">শুভ বিবাহ</text>
    <text x="860" y="355" font-size="38" fill="#3b2608">দুই পরিবারের মিলনে এক পবিত্র বন্ধন</text>
    <text x="860" y="440" font-size="40" font-weight="700" fill="#8c0f22">১০ · ১১ · ১২ ডিসেম্বর ২০২৬</text>
    <text x="860" y="490" font-size="32" fill="#5a3a12">ঢাকা</text>
    <text x="860" y="585" font-size="20" font-family="Georgia, serif" fill="#9a6b16" letter-spacing="6">INVITIVALS</text>
  </g>
  <g stroke="#c8962d" stroke-width="2" fill="none"><path d="M640 395h180M900 395h180"/></g>
</svg>`);
await sharp({ create: { width: W, height: H, channels: 3, background: '#fbe7bd' } })
  .composite([{ input: bg, left: 0, top: 0 }, { input: couple, left: 20, top: 150 }, { input: svg, left: 0, top: 0 }, { input: coin, left: 1060, top: 30 }])
  .jpeg({ quality: 86, progressive: true }).toFile(path.join(A, 'og.jpg'));
console.log('wrote assets/og.jpg');
