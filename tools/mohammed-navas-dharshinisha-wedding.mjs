/* Mohammed Navas & Dharshinisha — Nikah and Walima (client brief 2026-11-22), public/mohammed-navas-dharshinisha-wedding,
   a separate page on the design of public/dr-mohammed-nihal-nooha (read only: its plates, cut-outs and Bismillah were
   copied once; that page is never edited for this one).

     node tools/mohammed-navas-dharshinisha-wedding.mjs

   It writes:
   - assets/nd-plum.webp and assets/nd-gold.webp: the couple's own ND monogram (invites/src/mohammed-navas-dharshinisha-wedding/
     nd-monogram.png, black ink on transparency). The shape is the client's exactly (no redraw, no stretch, no crop
     into it); only its ink colour is changed, plum for the ivory card and champagne gold for the burgundy closing;
   - js/art.js with the monogram's sizes;
   - nikah.ics, walima.ics and nikah-and-walima.ics from config.js (India time with a VTIMEZONE). No end time was
     supplied: an event carries a DTEND only if the config gives it `minutes`. Every description lists the day's
     programme, the venue and the map link;
   - index.html's title, description and sharing tags;
   - assets/cover-navas-dharshinisha.jpg, the link preview, shot from tools/mohammed-navas-dharshinisha-wedding-og.html.
   The opening film with the ND seal is made separately: tools/mohammed-navas-dharshinisha-film/README.md. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'mohammed-navas-dharshinisha-wedding'), OUT = path.join(DIR, 'assets');
const SRC = path.join(ROOT, 'invites', 'src', 'mohammed-navas-dharshinisha-wedding');
const { config: C } = await import(pathToFileURL(path.join(DIR, 'config.js')).href + '?t=' + Date.now());
const URL_ = `https://invitivals.com/${C.slug}/`;

/* ── the monogram: the PNG's own transparency is the ink ── */
const sizes = {};
{
  const src = path.join(SRC, 'nd-monogram.png');
  const { data: a, info } = await sharp(src).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const ink = async (stops, name) => {
    const grad = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">${stops.map((c, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`)).removeAlpha().raw().toBuffer();
    const png = await sharp(grad, { raw: { width: W, height: H, channels: 3 } }).joinChannel(a, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
    const r = await sharp(png).trim({ threshold: 1 }).resize({ width: 560, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(path.join(OUT, name + '.webp'));
    sizes[name] = [r.width, r.height];
  };
  await ink(['#7a4a68', '#5a2a47'], 'nd-plum');
  await ink(['#fbeecb', '#e3c383', '#f3dfae'], 'nd-gold');
}
{
  const f = path.join(DIR, 'js', 'art.js');
  const t = fs.readFileSync(f, 'utf8');
  const art = JSON.parse(/export const art = (\{.*?\});/.exec(t)[1]);
  for (const k of Object.keys(art)) if (/^n[nd]-/.test(k)) delete art[k];
  Object.assign(art, sizes);
  fs.writeFileSync(f, t.replace(/^\/\*[\s\S]*?\*\//, `/* written by tools/dr-mohammed-nihal-nooha.mjs for the reference page, the monogram sizes by
   tools/mohammed-navas-dharshinisha-wedding.mjs: the pixel sizes of the artwork, and the boxes (x, y, w, h in % of the
   page) the reference's layout gives the pieces of pages 2 and 3 */`).replace(/export const art = \{.*?\};/, `export const art = ${JSON.stringify(art)};`));
  console.log('✓ monogram', sizes);
}

/* ── calendar files ── */
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const plus = (local, m) => { const x = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/.exec(local), d = new Date(Date.UTC(+x[1], x[2] - 1, +x[3], +x[4], +x[5] + m, +x[6])), p = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`; };
const details = (e) => `${e.date}\n${C.programme.join('\n')}\nVenue: ${e.venue}\nLocation: ${e.mapsUrl}\n\n${URL_}`;
const vevent = (e) => [
  'BEGIN:VEVENT', `UID:${C.slug}-${e.key}@invitivals.com`, 'DTSTAMP:20261122T000000Z',
  `DTSTART;TZID=${C.timeZone}:${e.local}`, ...(e.minutes ? [`DTEND;TZID=${C.timeZone}:${plus(e.local, e.minutes)}`] : []),
  `SUMMARY:${esc(`${e.title} — ${C.couple}`)}`, `LOCATION:${esc(e.venue)}`, `DESCRIPTION:${esc(details(e))}`, `URL:${e.mapsUrl}`,
  'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.title)}`, 'END:VALARM', 'END:VEVENT'];
const wrap = (events) => [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'BEGIN:VTIMEZONE', `TZID:${C.timeZone}`, 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
  ...events.flatMap(vevent), 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
for (const e of C.events) fs.writeFileSync(path.join(DIR, e.ics), wrap([e]));
fs.writeFileSync(path.join(DIR, C.dayIcs), wrap(C.events));
console.log('✓ ics', C.events.map((e) => e.ics).join(', '), '+', C.dayIcs);

/* ── sharing tags ── */
const COVER = 'cover-navas-dharshinisha.jpg';
const TITLE = `${C.couple} · Nikah & Walima`;
const OGT = C.couple;
const OGD = 'Nikah & Walima | Sunday, 13 December 2026 | Nahar Gardens, Near Muttukadu Lake';
const DESC = `You are cordially invited to the Nikah and Walima ceremonies of ${C.couple} on Sunday, 13th December 2026 at Nahar Gardens, Near Muttukadu Lake. Nikah 11:00 AM, Walima 1:00 PM.`;
const IMG = `${URL_}assets/${COVER}`;
const ALT = `${C.couple} · Nikah and Walima · Sunday, 13 December 2026`;
const hx = (x) => x.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const block = [
  ['property', 'og:type', 'website'], ['property', 'og:site_name', 'Invitivals'], ['property', 'og:locale', 'en_IN'],
  ['property', 'og:url', URL_], ['property', 'og:title', OGT], ['property', 'og:description', OGD],
  ['property', 'og:image', IMG], ['property', 'og:image:secure_url', IMG], ['property', 'og:image:type', 'image/jpeg'],
  ['property', 'og:image:width', '1200'], ['property', 'og:image:height', '630'], ['property', 'og:image:alt', ALT],
  ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', OGT], ['name', 'twitter:description', OGD],
  ['name', 'twitter:image', IMG],
].map(([k, n, v]) => `<meta ${k}="${n}" content="${hx(v)}">`).join('\n');
const ix = path.join(DIR, 'index.html');
const html = fs.readFileSync(ix, 'utf8')
  .replace(/<title>[^<]*<\/title>/, `<title>${hx(TITLE)}</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${hx(DESC)}">`)
  .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${URL_}">`)
  .replace(/<meta property="og:type"[\s\S]*?<meta name="twitter:image"[^>]*>/, block)
  .replace(/assets\/opening-n[nd]\.webp/, 'assets/opening-nd.webp');
if (!html.includes(IMG) || /nihal|nooha|Majeed|Masood/i.test(html)) throw new Error('index.html tags not replaced');
fs.writeFileSync(ix, html);
console.log('✓ index.html');

/* ── link preview ── */
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const png = path.join(os.tmpdir(), 'navas-dharshinisha-og.png');
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630',
  '--virtual-time-budget=8000', '--allow-file-access-from-files', `--screenshot=${png}`, pathToFileURL(path.join(ROOT, 'tools', 'mohammed-navas-dharshinisha-wedding-og.html')).href], { stdio: 'ignore' });
const og = await sharp(png).flatten({ background: '#ead9cf' }).jpeg({ quality: 86, mozjpeg: true, progressive: true }).toFile(path.join(OUT, COVER));
if (og.width !== 1200 || og.height !== 630) throw new Error('cover is ' + og.width + 'x' + og.height);
console.log('✓ cover', og.width + 'x' + og.height, og.size, 'bytes');
