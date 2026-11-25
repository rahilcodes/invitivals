/* Calendar files, link-preview picture and sharing tags of public/arshleen-manbir-wedding (bride side of the
   Manbir & Arshleen wedding; the groom page is public/manbir-arshleen-wedding, never edited for this).

     node tools/arshleen-manbir-wedding-theme.mjs                       (colours, once: pictures, film, styles)
     node tools/sikh-finish.mjs public/arshleen-manbir-wedding          (meta tags and cache stamps)
     node tools/arshleen-manbir-wedding.mjs                             (then this)

   tools/sikh-finish.mjs writes calendar files that end three hours after they start. Only start times were supplied,
   so this tool writes every calendar file again WITHOUT an end:
     assets/cal/<event>.ics                     one event each; an event with `parts` (the Akhand Path at 12:00 PM
                                                and the Bangle Ceremony at 3:00 PM) gets one file per activity
     assets/cal/arshleen-manbir-wedding.ics     every entry ("Add All to Calendar"); all.ics the same file
   The Wedding Celebration has no time: an all-day entry on 19 January 2027. Times in Asia/Kolkata (TZID with its
   VTIMEZONE); lines folded at 75 octets. Titles name the bride first: "Anand Karaj — Arshleen & Manbir".
   It also draws assets/og.jpg (1200 x 630) exactly as the groom page's (its Gurudwara scene, the Khanda, the names),
   in the bride page's plum, and sets the sharing tags. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { plumText } from './lib/plum-grade.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'arshleen-manbir-wedding';
const DIR = path.join(ROOT, 'public', SLUG);
const { weddingConfig: cfg } = await import(pathToFileURL(path.join(DIR, 'config.js')).href + '?t=' + Date.now());
if (cfg.hostSide !== 'bride') throw new Error('expected the bride side');
const URL_ = `https://invitivals.com/${SLUG}/`;
const TZ = 'Asia/Kolkata';
const PAIR = `${cfg.shortBride} & ${cfg.shortGroom}`;            // the bride first, everywhere
const NAMES_TXT = `${cfg.brideName} & ${cfg.groomName}`;

/* every calendar entry: an event with parts becomes one entry per activity */
const ENTRIES = cfg.events.flatMap((ev) => ev.parts ? ev.parts.map((p) => ({ ...ev, ...p, parts: null })) : [ev]);

/* ── calendar files ─────────────────────────────────────────── */
const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const wall = (iso) => { if (!/\+05:30$/.test(iso)) throw new Error('expected an India-time date: ' + iso); return iso.slice(0, 19).replace(/[-:]/g, ''); };
const nextDay = (iso) => new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10) + 1)).toISOString().slice(0, 10).replace(/-/g, '');
const vevent = (ev) => {
  const title = `${ev.name} — ${PAIR}`;
  const where = [ev.venue, ev.venueLocal, ev.address].filter(Boolean);
  const desc = [`${NAMES_TXT} · Wedding`, ev.allDay ? 'Time to be announced.' : '', ev.maps ? `Map: ${ev.maps}` : '', URL_].filter(Boolean).join('\n');
  return [
    'BEGIN:VEVENT', `UID:${wall(ev.date)}-${ev.id}@arshleen-manbir.invitivals.com`, 'DTSTAMP:20261126T000000Z',
    ...(ev.allDay
      ? [`DTSTART;VALUE=DATE:${wall(ev.date).slice(0, 8)}`, `DTEND;VALUE=DATE:${nextDay(ev.date)}`]   // the day itself
      : [`DTSTART;TZID=${TZ}:${wall(ev.date)}`]),                                                       // no DTEND: only the start was supplied
    `SUMMARY:${esc(title)}`, ...(where.length ? [`LOCATION:${esc(where.join(', '))}`] : []), `DESCRIPTION:${esc(desc)}`, `URL:${URL_}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(title)}`, 'END:VALARM',
    'END:VEVENT'];
};
const wrap = (events) => [
  'BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//Invitivals//${PAIR} Wedding//EN`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  `X-WR-CALNAME:${esc(`${PAIR} · Wedding`)}`, `X-WR-TIMEZONE:${TZ}`,
  'BEGIN:VTIMEZONE', `TZID:${TZ}`, 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
  ...events.flatMap(vevent), 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
const CAL = path.join(DIR, 'assets', 'cal');
fs.mkdirSync(CAL, { recursive: true });
for (const ev of ENTRIES) fs.writeFileSync(path.join(CAL, `${ev.id}.ics`), wrap([ev]));
for (const f of [`${SLUG}.ics`, 'all.ics']) fs.writeFileSync(path.join(CAL, f), wrap(ENTRIES));
/* what the finishing tool leaves behind and nothing links to: the two-part event as one entry, and its mehndi variant */
for (const ev of cfg.events.filter((e) => e.parts)) fs.rmSync(path.join(CAL, `${ev.id}.ics`), { force: true });
fs.rmSync(path.join(CAL, 'all-with-mehndi.ics'), { force: true });
console.log(`✓ assets/cal — ${ENTRIES.map((e) => e.id).join(', ')} + ${SLUG}.ics (start times only)`);

/* ── link preview: the groom page's composition, in plum ─────── */
const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const bg = await sharp(path.join(DIR, 'assets', 'anand-karaj.webp')).resize({ width: 1200, height: 630, fit: 'cover', position: 'top' }).toBuffer();
const svg = Buffer.from(plumText(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1b2a52" stop-opacity="0.18"/><stop offset="0.42" stop-color="#1b2a52" stop-opacity="0.05"/>
    <stop offset="1" stop-color="#0f1a38" stop-opacity="0.92"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#v)"/>
  <g transform="translate(550 40)" fill="none" stroke="#e7c87a" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="58" r="17"/><path d="M50 12 L54 32 L52 70 L48 70 L46 32 Z"/><ellipse cx="50" cy="76" rx="7" ry="2.6"/>
    <path d="M50 79 V88"/><circle cx="50" cy="90" r="2.4"/>
    <path d="M50 88 C33 86 20 68 25 46 C28 36 35 30 42 27"/><path d="M50 88 C67 86 80 68 75 46 C72 36 65 30 58 27"/>
  </g>
  <g text-anchor="middle" font-family="Georgia, 'Times New Roman', serif">
    <text x="600" y="444" font-size="25" letter-spacing="9" fill="#e7c87a">THE WEDDING OF</text>
    <text x="600" y="520" font-size="62" font-style="italic" fill="#f8f0df">${x(cfg.brideName)} &amp; ${x(cfg.groomName)}</text>
    <text x="600" y="578" font-size="24" letter-spacing="6" fill="#f1e6cf">ANAND KARAJ · 19 JANUARY 2027 · ${x(cfg.venueCity).toUpperCase()}</text>
  </g></svg>`));
const info = await sharp(bg).composite([{ input: svg }]).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(DIR, 'assets', 'og.jpg'));
console.log('✓ assets/og.jpg', info.width + 'x' + info.height, info.size, 'bytes');

/* ── sharing tags ─────────── */
const ix = path.join(DIR, 'index.html');
let html = fs.readFileSync(ix, 'utf8');
const set = (re, val) => { if (!re.test(html)) throw new Error('tag not found: ' + re); html = html.replace(re, val); };
const NAMES = `${cfg.brideName} &amp; ${cfg.groomName}`;
const DESC = 'Anand Karaj · Tuesday, 19 January 2027 · Amritsar. Tap to open the invitation.';
set(/<title>[^<]*<\/title>/, `<title>${NAMES} | Wedding Invitation</title>`);
set(/(<meta property="og:title" content=")[^"]*(")/, `$1${NAMES} | Wedding Invitation$2`);
set(/(<meta name="description" content=")[^"]*(")/, `$1With the blessings of Sri Guru Granth Sahib Ji, Sardarni Rajinder Kaur &amp; Sardar Paramjit Singh Bhullar invite you to the wedding of their daughter ${cfg.brideName} with ${cfg.groomName}. Anand Karaj: Tuesday, 19 January 2027, 10:00 AM at Gurudwara Chhevin Patshahi, Amritsar.$2`);
set(/(<meta property="og:description" content=")[^"]*(")/, `$1${DESC}$2`);
set(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${NAMES} — Wedding Invitation, Anand Karaj 19 January 2027$2`);
set(/(<meta name="author" content=")[^"]*(")/, `$1Invitivals$2`);
set(/(<meta property="og:site_name" content=")[^"]*(")/, `$1Invitivals$2`);
set(/(<meta name="theme-color" content=")[^"]*(")/, `$1${plumText('#1b2a52')}$2`);
set(/(<meta name="apple-mobile-web-app-title" content=")[^"]*(")/, `$1${cfg.shortBride} &amp; ${cfg.shortGroom}$2`);
if (!/rel="canonical"/.test(html)) set(/(<meta property="og:url"[^>]*>)/, `<link rel="canonical" href="${URL_}">\n$1`);
html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${URL_}$2`);
html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${URL_}$2`);
html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${URL_}assets/og.jpg?v=1$2`);
if (!/twitter:title/.test(html)) html = html.replace(/(<meta name="twitter:card"[^>]*>)/, `$1
<meta name="twitter:title" content="${NAMES} | Wedding Invitation">
<meta name="twitter:description" content="${DESC}">
<meta name="twitter:image" content="${URL_}assets/og.jpg?v=1">`);
if (/manbir-arshleen-wedding|Manbir Singh &amp; Arshleen|Bamrah invite|their son/i.test(html)) throw new Error('index.html still carries the groom page');
fs.writeFileSync(ix, html);
console.log('✓ index.html sharing tags');
