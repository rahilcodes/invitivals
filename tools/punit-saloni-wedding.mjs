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
/* the folder: punit-saloni-wedding (all events, the default) or punit-saloni-wedding-without-sangeet (the second link,
   client 2026-11-22), e.g.  node tools/punit-saloni-wedding.mjs punit-saloni-wedding-without-sangeet */
const FOLDER = process.argv[2] || 'punit-saloni-wedding';
if (!/^punit-saloni-wedding(-without-sangeet)?$/.test(FOLDER)) throw new Error('unknown folder: ' + FOLDER);
const DIR = path.join(ROOT, 'public', FOLDER);
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

/* sharing tags: the whole block, written fresh (WhatsApp, iMessage, Facebook and X read it from the HTML itself) */
const OG_V = 2;   // raise when the cover changes: WhatsApp keeps a picture per address, a new address is fetched anew
const TITLE = `${C.fullPair} · Wedding Invitation`;
const DESC = `With the blessings of our families, ${C.fullPair} invite you to their wedding on Monday, 14 December 2026 at Tulsi Resort, Baran Road, Kota.`;
const OGD = 'Monday, 14 December 2026 · Tulsi Resort, Baran Road, Kota. Tap to open the invitation.';
const IMG = `${URL_}assets/og.jpg?v=${OG_V}`;
const ALT = `Wedding invitation of ${C.fullPair}, Monday 14 December 2026, Tulsi Resort, Kota`;
const h = (x) => x.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const block = [
  ['property', 'og:type', 'website'], ['property', 'og:site_name', 'Invitivals'], ['property', 'og:locale', 'en_IN'],
  ['property', 'og:url', URL_], ['property', 'og:title', TITLE], ['property', 'og:description', OGD],
  ['property', 'og:image', IMG], ['property', 'og:image:secure_url', IMG], ['property', 'og:image:type', 'image/jpeg'],
  ['property', 'og:image:width', '1200'], ['property', 'og:image:height', '630'], ['property', 'og:image:alt', ALT],
  ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', TITLE], ['name', 'twitter:description', OGD],
  ['name', 'twitter:image', IMG], ['name', 'twitter:image:alt', ALT],
].map(([k, n, v]) => `<meta ${k}="${n}" content="${h(v)}">`).join('\n');
const ix = path.join(DIR, 'index.html');
let html = fs.readFileSync(ix, 'utf8')
  .replace(/<title>[^<]*<\/title>/, `<title>${h(TITLE)} · Designed by Invitivals</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${h(DESC)}">`)
  .replace(/<meta property="og:type"[\s\S]*?<meta name="twitter:card"[^>]*>(\r?\n<meta name="twitter:[^>]*>)*/, block);
if (!html.includes(IMG) || !html.includes('twitter:image') || html.includes('nandini')) throw new Error('index.html tags not replaced');
fs.writeFileSync(ix, html);
console.log('✓ index.html tags');

/* link preview: tools/punit-saloni-wedding-og.html shot with headless Chrome (real fonts), saved as assets/og.jpg */
const { execFileSync } = await import('node:child_process');
const os = await import('node:os');
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const png = path.join(os.tmpdir(), 'punit-saloni-og.png');
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630',
  '--virtual-time-budget=8000', '--allow-file-access-from-files', `--screenshot=${png}`, pathToFileURL(path.join(ROOT, 'tools', 'punit-saloni-wedding-og.html')).href], { stdio: 'ignore' });
const og = await sharp(png).flatten({ background: '#f4e4ca' }).jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(path.join(DIR, 'assets', 'og.jpg'));
if (og.width !== 1200 || og.height !== 630) throw new Error('cover is ' + og.width + 'x' + og.height);
console.log('✓ assets/og.jpg', og.width + 'x' + og.height, og.size, 'bytes');
