/* The link-preview picture (1200 x 630) of public/tanveer-prabhjit-wedding.

     node tools/tanveer-prabhjit-og.mjs

   tools/sikh-finish.mjs draws this from the design's source pack (invites/src/sikh-premium), which is not on this
   machine, so it skips og.jpg. This draws the same card — the Khanda, "THE ANAND KARAJ OF", the names, the date and
   city over a navy fade — on the invitation's own Gurudwara scene (assets/anand-karaj.webp) instead. */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'tanveer-prabhjit-wedding');
const { weddingConfig: cfg } = await import(pathToFileURL(path.join(DIR, 'config.js')).href);
const main = cfg.events.find((e) => e.main);
const fmt = (o) => new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', ...o }).format(new Date(main.date));
const dateLine = `${fmt({ day: 'numeric' })} ${fmt({ month: 'long' })} ${fmt({ year: 'numeric' })}`.toUpperCase();
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const bg = await sharp(path.join(DIR, 'assets', 'anand-karaj.webp')).resize({ width: 1200, height: 630, fit: 'cover', position: 'top' }).toBuffer();
const svg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1b2a52" stop-opacity="0.18"/><stop offset="0.45" stop-color="#1b2a52" stop-opacity="0.05"/>
    <stop offset="1" stop-color="#0f1a38" stop-opacity="0.9"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#v)"/>
  <g transform="translate(550 44)" fill="none" stroke="#e7c87a" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="58" r="17"/><path d="M50 12 L54 32 L52 70 L48 70 L46 32 Z"/><ellipse cx="50" cy="76" rx="7" ry="2.6"/>
    <path d="M50 79 V88"/><circle cx="50" cy="90" r="2.4"/>
    <path d="M50 88 C33 86 20 68 25 46 C28 36 35 30 42 27"/><path d="M50 88 C67 86 80 68 75 46 C72 36 65 30 58 27"/>
  </g>
  <g text-anchor="middle" font-family="Georgia, 'Times New Roman', serif">
    <text x="600" y="456" font-size="26" letter-spacing="9" fill="#e7c87a">THE ${esc(main.name).toUpperCase()} OF</text>
    <text x="600" y="530" font-size="68" font-style="italic" fill="#f8f0df">${esc(cfg.shortBride)} &amp; ${esc(cfg.shortGroom)}</text>
    <text x="600" y="582" font-size="24" letter-spacing="6" fill="#f1e6cf">${dateLine} · ${esc(cfg.venueCity).toUpperCase()}</text>
  </g></svg>`);
const info = await sharp(bg).composite([{ input: svg }]).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(DIR, 'assets', 'og.jpg'));
console.log('✓ assets/og.jpg', info.width + 'x' + info.height, info.size, 'bytes');
