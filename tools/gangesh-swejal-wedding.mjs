/* Gangesh Dhuri & Swejal Shirgavkar — wedding invitation (client brief 2026-11-28), public/gangesh-swejal-wedding,
   a separate page on the design of /swarnit-kaumudi-wedding/ (never edited for it).

     node tools/gangesh-swejal-wedding.mjs

   From config.js it writes:
   - assets/cal/<ceremony>.ics   one per ceremony (Apple / Outlook): the client's title and description, the ceremony's
                                 map link, Asia/Kolkata, NO end time (only start times were supplied);
   - assets/og.jpg               the WhatsApp / link-preview cover (1200 x 630) on the invitation's own fort-arch scene;
   - index.html's title, description and sharing tags. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'gangesh-swejal-wedding'), A = path.join(DIR, 'assets');
const { weddingConfig: C } = await import(pathToFileURL(path.join(DIR, 'config.js')).href + '?t=' + Date.now());
const URL_ = `https://invitivals.com/${C.slug}/`;
const PAIR = `${C.groomFull} & ${C.brideFull}`;

/* ── calendar files ── */
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const wall = (iso) => { if (!/\+05:30$/.test(iso)) throw new Error('expected India time: ' + iso); return iso.slice(0, 19).replace(/[-:]/g, ''); };
fs.mkdirSync(path.join(A, 'cal'), { recursive: true });
for (const e of C.events) {
  const title = `${e.name} – ${PAIR}`;
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//Invitivals//${C.groomName} & ${C.brideName} Wedding//EN`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
    'BEGIN:VEVENT', `UID:${wall(e.date)}-${e.id}@gangesh-swejal.invitivals.com`, 'DTSTAMP:20261128T000000Z',
    `DTSTART;TZID=Asia/Kolkata:${wall(e.date)}`,                       // no DTEND: only the start was supplied
    `SUMMARY:${esc(title)}`, `LOCATION:${esc(e.maps)}`, `DESCRIPTION:${esc(`${e.cal}\nMap: ${e.maps}\n${URL_}`)}`, `URL:${URL_}`, 'STATUS:CONFIRMED',
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(title)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'];
  fs.writeFileSync(path.join(A, 'cal', `${e.id}.ics`), lines.map(fold).join('\r\n') + '\r\n');
}
console.log('✓ assets/cal —', C.events.map((e) => e.id).join(', '));

/* ── link preview: the fort arch on the left, the names and dates on paper on the right ── */
const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const arch = await sharp(path.join(A, 'hero-arch.webp')).resize(430, 630, { fit: 'cover', position: 'bottom' }).toBuffer();
const couple = await sharp(path.join(A, 'couple.webp')).resize({ height: 300 }).toBuffer();
const cm = await sharp(couple).metadata();
const svg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf3e2"/><stop offset="1" stop-color="#f1dfbf"/></linearGradient>
    <linearGradient id="f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4e4ca" stop-opacity="0"/><stop offset="1" stop-color="#f4e4ca"/></linearGradient></defs>
  <rect x="430" width="770" height="630" fill="url(#p)"/>
  <rect x="370" width="70" height="630" fill="url(#f)"/>
  <rect x="456" y="22" width="722" height="586" rx="14" fill="none" stroke="#b88932" stroke-opacity=".7" stroke-width="2"/>
  <rect x="464" y="30" width="706" height="570" rx="10" fill="none" stroke="#b88932" stroke-opacity=".3" stroke-width="1"/>
  <g text-anchor="middle" font-family="Georgia, 'Times New Roman', serif">
    <text x="817" y="118" font-size="22" letter-spacing="9" fill="#8c621d">THE WEDDING OF</text>
    <text x="817" y="212" font-size="64" font-style="italic" fill="#4a0e18">${x(C.groomFull)}</text>
    <text x="817" y="268" font-size="38" font-style="italic" fill="#b88932">&amp;</text>
    <text x="817" y="348" font-size="64" font-style="italic" fill="#4a0e18">${x(C.brideFull)}</text>
    <line x1="647" y1="392" x2="987" y2="392" stroke="#b88932" stroke-width="1.5"/>
    <text x="817" y="444" font-size="27" letter-spacing="3" fill="#4a0e18">SUNDAY · 27 DECEMBER 2026</text>
    <text x="817" y="486" font-size="21" letter-spacing="2" fill="#8c621d">Wedding Ceremony · 1:00 PM onwards</text>
    <text x="817" y="540" font-size="18" letter-spacing="2" fill="#8c621d">Ring Ceremony 24 Dec · Haldi 25 Dec · Wedding 27 Dec</text>
  </g></svg>`);
const og = await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#f4e4ca' } })
  .composite([{ input: arch, left: 0, top: 0 }, { input: svg }, { input: couple, left: Math.round(215 - cm.width / 2), top: 630 - 300 }])
  .jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(A, 'og.jpg'));
console.log('✓ og.jpg', og.width + 'x' + og.height, og.size);

/* ── sharing tags: the whole head block, written fresh ── */
const TITLE = `${PAIR} · Wedding Invitation`;
const DESC = `With joy in our hearts, ${PAIR} cordially invite you and your family to their wedding celebrations: Ring Ceremony 24 December, Haldi 25 December, Wedding Rituals and Wedding Ceremony 27 December 2026.`;
const OGD = 'Wedding Ceremony · Sunday, 27 December 2026 · 1:00 PM onwards. Tap to open the invitation.';
const IMG = `${URL_}assets/og.jpg?v=1`;
const ALT = `Wedding invitation of ${PAIR}, 27 December 2026`;
const h = (v) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const block = [
  `<title>${h(TITLE)}</title>`,
  `<meta name="description" content="${h(DESC)}">`,
  '<meta name="author" content="Invitivals">',
  '<meta name="theme-color" content="#4a0e18">',
  `<link rel="canonical" href="${URL_}">`,
  ...[['og:type', 'website'], ['og:site_name', 'Invitivals'], ['og:locale', 'en_IN'], ['og:url', URL_], ['og:title', TITLE], ['og:description', OGD],
    ['og:image', IMG], ['og:image:secure_url', IMG], ['og:image:type', 'image/jpeg'], ['og:image:width', '1200'], ['og:image:height', '630'], ['og:image:alt', ALT]]
    .map(([n, v]) => `<meta property="${n}" content="${h(v)}">`),
  ...[['twitter:card', 'summary_large_image'], ['twitter:title', TITLE], ['twitter:description', OGD], ['twitter:image', IMG], ['twitter:image:alt', ALT]]
    .map(([n, v]) => `<meta name="${n}" content="${h(v)}">`),
].join('\n');
const ix = path.join(DIR, 'index.html');
const html = fs.readFileSync(ix, 'utf8').replace(/\r\n/g, '\n').replace(/<title>[\s\S]*?<meta name="twitter:[^>]*>(\n<meta name="twitter:[^>]*>)*/, block);
if (!html.includes(IMG) || /swarnit|kaumudi|washim|mahalaxmi/i.test(html)) throw new Error('index.html tags not replaced');
fs.writeFileSync(ix, html);
console.log('✓ index.html tags');
