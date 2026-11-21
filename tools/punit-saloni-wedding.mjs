/* CA Punit (Shubham) & Dr. Saloni — wedding invitation (client brief 2026-11-21), public/punit-saloni-wedding,
   a separate page on the Nandini & Satyam design (public/nandini-satyam-wedding is never edited for it).

     node tools/punit-saloni-wedding.mjs

   From config.js it writes:
   - cal/<event>.ics for every event and cal/all-events.ics (Apple Calendar, Outlook). India time with a
     VTIMEZONE; the invitation gives start times only, so each DTEND is the config's estimate (event.hours)
     and the description says it is an estimate. The page's Google Calendar links use the same numbers.
   - index.html's title, description and link-preview tags;
   - assets/og.jpg, the link preview: the design's arch, its illustrated couple and the names. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'punit-saloni-wedding');
const { weddingConfig: C } = await import(pathToFileURL(path.join(DIR, 'config.js')).href + '?t=' + Date.now());
/* the page's own helpers, so the .ics files and the Google links can never disagree */
globalThis.window ??= { matchMedia: () => ({ matches: false }) };
const U = await import(pathToFileURL(path.join(DIR, 'js', 'util.js')).href + '?t=' + Date.now());
C.pair = [C.groomName, C.brideName];
const URL_ = `https://invitivals.com/${C.slug}/`;

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const vevent = (e) => [
  'BEGIN:VEVENT', `UID:${C.slug}-${U.icsSlug(e)}@invitivals.com`, 'DTSTAMP:20261121T000000Z',
  `DTSTART;TZID=Asia/Kolkata:${U.calStart(e)}`, `DTEND;TZID=Asia/Kolkata:${U.calEnd(e)}`,
  `SUMMARY:${esc(U.calTitle(C, e))}`, `LOCATION:${esc(e.place.name)}`, `DESCRIPTION:${esc(U.calDetails(C, e))}`, `URL:${URL_}`,
  'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(U.calTitle(C, e))}`, 'END:VALARM', 'END:VEVENT'];
const wrap = (events) => [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
  ...events.flatMap(vevent), 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
const CAL = path.join(DIR, 'cal');
fs.rmSync(CAL, { recursive: true, force: true }); fs.mkdirSync(CAL);
for (const e of C.events) fs.writeFileSync(path.join(CAL, U.icsSlug(e) + '.ics'), wrap([e]));
fs.writeFileSync(path.join(CAL, 'all-events.ics'), wrap(C.events));
console.log('✓ cal/', C.events.map((e) => U.icsSlug(e)).join(', '), '+ all-events');

/* sharing tags */
const TITLE = `${C.fullPair} · Wedding Invitation`;
const DESC = `With the blessings of our families, ${C.fullPair} invite you to their wedding on Monday, 14 December 2026 at Tulsi Resort, Baran Road, Kota.`;
const OGD = '14 December 2026 · Tulsi Resort, Baran Road, Kota. Tap to open the invitation.';
const h = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const ix = path.join(DIR, 'index.html');
let html = fs.readFileSync(ix, 'utf8')
  .replace(/<title>[^<]*<\/title>/, `<title>${h(TITLE)} · Designed by Invitivals</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${h(DESC)}">`)
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${URL_}">`)
  .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${h(TITLE)}">`)
  .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${h(OGD)}">`)
  .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${URL_}assets/og.jpg">`);
if (!html.includes(URL_ + 'assets/og.jpg') || html.includes('nandini')) throw new Error('index.html tags not replaced');
fs.writeFileSync(ix, html);
console.log('✓ index.html tags');

/* link preview */
const A = path.join(DIR, 'assets'), W = 1200, H = 630;
const arch = await sharp(path.join(A, 'hero-arch.webp')).resize({ width: W, height: H, fit: 'cover', position: 'top' }).toBuffer();
const couple = await sharp(path.join(A, 'couple.webp')).resize({ height: 560 }).toBuffer();
const cm = await sharp(couple).metadata();
const text = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d5518"/><stop offset=".3" stop-color="#b88932"/><stop offset=".5" stop-color="#8c621d"/><stop offset=".75" stop-color="#b88932"/><stop offset="1" stop-color="#7d5518"/></linearGradient>
  <radialGradient id="v" cx=".62" cy=".45" r=".55"><stop offset="0" stop-color="#f7ebd2" stop-opacity=".92"/><stop offset="1" stop-color="#f7ebd2" stop-opacity="0"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#v)"/>
  <g text-anchor="middle" font-family="Georgia,'Times New Roman',serif">
    <text x="760" y="150" font-size="22" letter-spacing="8" fill="#8c621d">THE WEDDING OF</text>
    <text x="760" y="250" font-size="70" font-weight="bold" fill="url(#g)">CA Punit</text>
    <text x="760" y="292" font-size="28" font-style="italic" fill="#651522">(Shubham)</text>
    <text x="760" y="346" font-size="34" font-style="italic" fill="#651522">&amp;</text>
    <text x="760" y="426" font-size="70" font-weight="bold" fill="url(#g)">Dr. Saloni</text>
    <text x="760" y="500" font-size="24" letter-spacing="5" fill="#651522">MONDAY · 14 DECEMBER 2026</text>
    <text x="760" y="540" font-size="22" font-style="italic" fill="#6a4b35">Tulsi Resort, Baran Road, Kota</text>
  </g></svg>`);
const og = await sharp(arch).composite([{ input: text, left: 0, top: 0 }, { input: couple, left: 40, top: H - cm.height }]).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(A, 'og.jpg'));
console.log('✓ assets/og.jpg', og.width + 'x' + og.height, og.size, 'bytes');
