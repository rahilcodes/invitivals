/* Ashar & Rufeda — Nikah and Walima Ceremony (client brief 2026-11-24), public/ashar-rufeda-wedding, a
   separate page on the design of public/dr-mohammed-nihal-nooha (read only; this folder began as a copy of its Navas &
   Dharshinisha copy, which is not edited either).

     node tools/ashar-rufeda-wedding.mjs

   It writes:
   - assets/ar-plum.webp and assets/ar-gold.webp from the client's own A & R monogram, when it is in
     invites/src/ashar-rufeda-wedding/ (ar-monogram.png with transparency, or ar-monogram.jpg|jpeg|png on a plain light
     background). The artwork is the client's exactly (no redraw, no stretch, no crop into it): only a plain
     background is taken away and the ink coloured plum (ivory card) and champagne gold (burgundy closing), as the
     reference does with its own monogram. Without the file it stops and says so — nothing is drawn in its place;
   - js/art.js with the monogram's sizes;
   - nikah.ics (an ALL-DAY entry on 25 December: the family gave "After Jumma Namaz", not a clock time),
     walima.ics (26 December, 8:00 PM to 11:00 PM, as supplied) and nikah-and-walima.ics;
   - index.html's title, description and sharing tags;
   - assets/cover-ashar-rufeda.jpg, the link preview, shot from tools/ashar-rufeda-wedding-og.html.
   The opening film with the A R seal is made separately (tools/ashar-rufeda-film/README.md). */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'ashar-rufeda-wedding';
const DIR = path.join(ROOT, 'public', SLUG), OUT = path.join(DIR, 'assets');
const SRC = path.join(ROOT, 'invites', 'src', SLUG);
const { config: C } = await import(pathToFileURL(path.join(DIR, 'config.js')).href + '?t=' + Date.now());
const URL_ = `https://invitivals.com/${C.slug}/`;

/* ── the monogram ── */
const src = ['ar-monogram.png', 'ar-monogram.jpg', 'ar-monogram.jpeg', 'ar-monogram.webp'].map((n) => path.join(SRC, n)).find((p) => fs.existsSync(p));
const NO_MONO = process.env.SKIP_MONOGRAM === '1';   // calendar files and tags only, while the monogram is awaited
if (!src && !NO_MONO) { console.error(`✗ the client's A & R monogram is not in ${path.relative(ROOT, SRC)} (ar-monogram.png/jpg) — nothing is drawn in its place`); process.exit(1); }
const sizes = {};
if (src) {
  const meta = await sharp(src).metadata();
  let a, W, H;
  const alpha = meta.hasAlpha ? await sharp(src).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true }) : null;
  const opaque = alpha ? alpha.data.every((v) => v === 255) : true;
  if (alpha && !opaque) { a = alpha.data; W = alpha.info.width; H = alpha.info.height; }
  else {
    /* a plain light background: the ink is how much darker than the paper a pixel is */
    const g = await sharp(src).flatten({ background: '#ffffff' }).greyscale().raw().toBuffer({ resolveWithObject: true });
    W = g.info.width; H = g.info.height; a = Buffer.alloc(W * H);
    for (let k = 0; k < W * H; k++) a[k] = Math.round(Math.max(0, Math.min(1, (222 - g.data[k]) / 170)) * 255);
  }
  const ink = async (stops, name) => {
    const grad = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">${stops.map((c, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`)).removeAlpha().raw().toBuffer();
    const png = await sharp(grad, { raw: { width: W, height: H, channels: 3 } }).joinChannel(a, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
    const trimmed = await sharp(png).trim({ threshold: 1 }).png().toBuffer();
    const r = await sharp(trimmed).resize({ width: 560, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(path.join(OUT, name + '.webp'));
    sizes[name] = [r.width, r.height];
  };
  await ink(['#7a4a68', '#5a2a47'], 'ar-plum');
  await ink(['#fbeecb', '#e3c383', '#f3dfae'], 'ar-gold');
}
if (src) {
  const f = path.join(DIR, 'js', 'art.js');
  const t = fs.readFileSync(f, 'utf8');
  const art = JSON.parse(/export const art = (\{.*?\});/.exec(t)[1]);
  for (const k of Object.keys(art)) if (/^(n[nd]|ar)-/.test(k)) delete art[k];
  Object.assign(art, sizes);
  fs.writeFileSync(f, t.replace(/^\/\*[\s\S]*?\*\//, `/* written by tools/dr-mohammed-nihal-nooha.mjs for the reference page, the monogram sizes by
   tools/ashar-rufeda-wedding.mjs: the pixel sizes of the artwork, and the boxes (x, y, w, h in % of the page) the
   reference's layout gives the pieces of pages 2 and 3 */`).replace(/export const art = \{.*?\};/, `export const art = ${JSON.stringify(art)};`));
  console.log('✓ monogram', path.basename(src), sizes);
}

/* ── calendar files ── */
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const plus = (local, m) => { const x = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/.exec(local), d = new Date(Date.UTC(+x[1], x[2] - 1, +x[3], +x[4], +x[5] + m, +x[6])), p = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`; };
const nextDay = (d8) => { const d = new Date(Date.UTC(+d8.slice(0, 4), +d8.slice(4, 6) - 1, +d8.slice(6, 8) + 1)), p = (n) => String(n).padStart(2, '0'); return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}`; };
const details = (e) => `${e.date}\nTime: ${e.time}\nVenue: ${e.venue}\nLocation: ${e.mapsUrl}\n\n${URL_}`;
const vevent = (e) => [
  'BEGIN:VEVENT', `UID:${C.slug}-${e.key}@invitivals.com`, 'DTSTAMP:20261124T000000Z',
  ...(e.allDay ? [`DTSTART;VALUE=DATE:${e.allDay}`, `DTEND;VALUE=DATE:${nextDay(e.allDay)}`]
    : [`DTSTART;TZID=${C.timeZone}:${e.local}`, ...(e.minutes ? [`DTEND;TZID=${C.timeZone}:${plus(e.local, e.minutes)}`] : [])]),
  `SUMMARY:${esc(`${e.title} — ${C.couple}${e.allDay ? ` (${e.time})` : ''}`)}`, `LOCATION:${esc(e.venue)}`, `DESCRIPTION:${esc(details(e))}`, `URL:${e.mapsUrl}`,
  ...(e.allDay ? [] : ['BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.title)}`, 'END:VALARM']), 'END:VEVENT'];
const wrap = (events) => [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'BEGIN:VTIMEZONE', `TZID:${C.timeZone}`, 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
  ...events.flatMap(vevent), 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
for (const e of C.events) fs.writeFileSync(path.join(DIR, e.ics), wrap([e]));
fs.writeFileSync(path.join(DIR, C.dayIcs), wrap(C.events));
console.log('✓ ics', C.events.map((e) => e.ics).join(', '), '+', C.dayIcs);

/* ── sharing tags ── */
const COVER = 'cover-ashar-rufeda.jpg';
const TITLE = `${C.couple} · Nikah & Walima`;
const OGT = `${C.couple} · Wedding Invitation`;
const OGD = 'Nikah · Friday, 25 December 2026, After Jumma Namaz | Walima Ceremony · Saturday, 26 December 2026, 8:00 PM – 11:00 PM | Vasai';
const DESC = 'With the blessings of Almighty Allah and the love of our families, we request the honour of your presence at the Nikah of Ashar & Rufeda: Friday, 25 December 2026, After Jumma Namaz, Jama Masjid, Mussagalli, Vasai; Walima Ceremony, Saturday, 26 December 2026, 8:00 PM – 11:00 PM, GG Ground, Vasai West.';
const IMG = `${URL_}assets/${COVER}`;
const ALT = `${C.couple} · Nikah, 25 December 2026 · Walima, 26 December 2026`;
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
  .replace(/assets\/opening-(n[nd]|ar)\.webp/g, 'assets/opening-ar.webp');
const bad = /nihal|nooha|navas|dharshinisha|muttukadu/i.exec(html);
if (!html.includes(IMG) || bad) throw new Error('index.html still carries another invitation: ' + (bad || [])[0]);
fs.writeFileSync(ix, html);
console.log('✓ index.html');

/* ── link preview ── */
if (!src) { console.log('… cover skipped until the monogram is in'); process.exit(0); }
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const png = path.join(os.tmpdir(), 'ashar-rufeda-og.png');
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630',
  '--virtual-time-budget=8000', '--allow-file-access-from-files', `--screenshot=${png}`, pathToFileURL(path.join(ROOT, 'tools', `${SLUG}-og.html`)).href], { stdio: 'ignore' });
const og = await sharp(png).flatten({ background: '#ead9cf' }).jpeg({ quality: 86, mozjpeg: true, progressive: true }).toFile(path.join(OUT, COVER));
if (og.width !== 1200 || og.height !== 630) throw new Error('cover is ' + og.width + 'x' + og.height);
console.log('✓ cover', og.width + 'x' + og.height, og.size, 'bytes');
