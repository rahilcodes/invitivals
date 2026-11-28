/* Calendar files, link-preview picture and sharing tags of public/harwinder-simran-wedding.

     node tools/sikh-finish.mjs public/harwinder-simran-wedding    (first: meta tags and cache stamps)
     node tools/harwinder-simran.mjs                               (then this)

   tools/sikh-finish.mjs writes calendar files that end three hours after they start. Only start times were supplied,
   so this tool writes every calendar file again WITHOUT an end:
     assets/cal/<event>.ics                       one event each
     assets/cal/harwinder-simran-wedding.ics      all five events ("Add All to Calendar"); all.ics, which the
                                                  finishing tool leaves behind, is made the same file
   Titles and places are the client's: "Jagoo – Harwinder Singh & Simran", "At Our Residence,
   Vill. Baghthala (Kurukshetra)" and so on; the two Path events have no place line, as none was supplied (config.js `cal`). Times are in Asia/Kolkata (TZID with its VTIMEZONE); lines folded at 75 octets.
   It also draws assets/og.jpg (1200 x 630) on the invitation's own Gurudwara scene, and sets the sharing tags. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'harwinder-simran-wedding';
const DIR = path.join(ROOT, 'public', SLUG);
const { weddingConfig: cfg } = await import(pathToFileURL(path.join(DIR, 'config.js')).href + '?t=' + Date.now());
const URL_ = `https://invitivals.com/${SLUG}/`;
const TZ = 'Asia/Kolkata';
const PAIR = `${cfg.shortGroom} & ${cfg.shortBride}`;
const NAMES_TXT = `${cfg.groomName} & ${cfg.brideName}`;   // the groom first: the groom's family invites

/* ── calendar files ─────────────────────────────────────────── */
const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const wall = (iso) => { if (!/\+05:30$/.test(iso)) throw new Error('expected an India-time date: ' + iso); return iso.slice(0, 19).replace(/[-:]/g, ''); };
const nextDay = (iso) => new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10) + 1)).toISOString().slice(0, 10).replace(/-/g, '');
const vevent = (ev) => {
  const title = `${ev.name} – ${NAMES_TXT}`;
  const where = ev.cal ? [ev.cal] : [ev.venue, ev.venueLocal, ev.address].filter(Boolean);
  const desc = [`${NAMES_TXT} · Wedding`, [ev.venue, ev.address].filter(Boolean).join(', '), ev.allDay ? 'Time to be announced.' : '', ev.maps ? `Map: ${ev.maps}` : '', URL_].filter(Boolean).join('\n');
  return [
    'BEGIN:VEVENT', `UID:${wall(ev.date)}-${ev.id}@harwinder-simran.invitivals.com`, 'DTSTAMP:20261128T000000Z',
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
for (const ev of cfg.events) fs.writeFileSync(path.join(CAL, `${ev.id}.ics`), wrap([ev]));
for (const f of [`${SLUG}.ics`, 'all.ics']) fs.writeFileSync(path.join(CAL, f), wrap(cfg.events));
console.log(`✓ assets/cal — ${cfg.events.map((e) => e.id).join(', ')} + ${SLUG}.ics (start times only)`);

/* ── link preview ───────────────────────────────────────────── */
const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const bg = await sharp(path.join(DIR, 'assets', 'anand-karaj.webp')).resize({ width: 1200, height: 630, fit: 'cover', position: 'top' }).toBuffer();
const svg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1b2a52" stop-opacity="0.2"/><stop offset="0.3" stop-color="#1b2a52" stop-opacity="0.08"/>
    <stop offset="0.52" stop-color="#0f1a38" stop-opacity="0.62"/><stop offset="1" stop-color="#0b1430" stop-opacity="0.95"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#v)"/>
  <radialGradient id="w" cx="600" cy="430" r="470" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 430) scale(1 .5) translate(-600 -430)"><stop offset="0" stop-color="#0b1430" stop-opacity="0.62"/><stop offset="1" stop-color="#0b1430" stop-opacity="0"/></radialGradient>
  <rect width="1200" height="630" fill="url(#w)"/>
  <g transform="translate(550 22)" fill="none" stroke="#e7c87a" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="58" r="17"/><path d="M50 12 L54 32 L52 70 L48 70 L46 32 Z"/><ellipse cx="50" cy="76" rx="7" ry="2.6"/>
    <path d="M50 79 V88"/><circle cx="50" cy="90" r="2.4"/>
    <path d="M50 88 C33 86 20 68 25 46 C28 36 35 30 42 27"/><path d="M50 88 C67 86 80 68 75 46 C72 36 65 30 58 27"/>
  </g>
  <g text-anchor="middle" font-family="Georgia, 'Times New Roman', serif">
    <text x="600" y="302" font-size="22" letter-spacing="9" fill="#e7c87a">THE WEDDING OF</text>
    <text x="600" y="378" font-size="60" font-style="italic" fill="#f8f0df">${x(cfg.groomName)}</text>
    <text x="600" y="430" font-size="40" font-style="italic" fill="#e7c87a">&amp;</text>
    <text x="600" y="498" font-size="60" font-style="italic" fill="#f8f0df">${x(cfg.brideName)}</text>
    <line x1="430" y1="530" x2="770" y2="530" stroke="#e7c87a" stroke-opacity="0.7" stroke-width="1.5"/>
    <text x="600" y="576" font-size="24" letter-spacing="5" fill="#f1e6cf">MONDAY · 4 JANUARY 2027</text>
  </g></svg>`);
const info = await sharp(bg).composite([{ input: svg }]).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(DIR, 'assets', 'og.jpg'));
console.log('✓ assets/og.jpg', info.width + 'x' + info.height, info.size, 'bytes');

/* ── sharing tags ─────────── */
const ix = path.join(DIR, 'index.html');
let html = fs.readFileSync(ix, 'utf8');
const set = (re, val) => { if (!re.test(html)) throw new Error('tag not found: ' + re); html = html.replace(re, val); };
const NAMES = `${cfg.groomName} &amp; ${cfg.brideName}`;
set(/<title>[^<]*<\/title>/, `<title>${NAMES} | Wedding Invitation</title>`);
set(/(<meta property="og:title" content=")[^"]*(")/, `$1${NAMES} | Wedding Invitation$2`);
set(/(<meta name="description" content=")[^"]*(")/, `$1Sardarni Amarjit Kaur &amp; Sardar Manjeet Singh cordially invite you to the wedding ceremony of their son ${cfg.groomName} with ${cfg.brideName}, Monday, 4th January 2027. Arambh Shri Akhand Path Sahib: Friday, 1 January, 10:00 AM. Bhog: Sunday, 3 January, 10:00 AM. Lunch 1:00 PM and Jagoo 7:00 PM at our residence, Vill. Baghthala (Kurukshetra). Departure of Baraat: Monday, 4 January, 8:00 AM, Punia Farm House, Patiala Cheeka Road, Panjola.$2`);
set(/(<meta property="og:description" content=")[^"]*(")/, `$1Wedding Invitation · Monday, 4th January 2027. Tap to open the invitation.$2`);
set(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${NAMES} — Wedding Invitation, Monday 4 January 2027$2`);
set(/(<meta name="author" content=")[^"]*(")/, `$1Invitivals$2`);
set(/(<meta property="og:site_name" content=")[^"]*(")/, `$1Invitivals$2`);
if (!/rel="canonical"/.test(html)) set(/(<meta property="og:url"[^>]*>)/, `<link rel="canonical" href="${URL_}">\n$1`);
html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${URL_}$2`);
html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${URL_}assets/og.jpg?v=2$2`);
html = html.replace(/\n<meta name="twitter:title"[^>]*>\n<meta name="twitter:description"[^>]*>\n<meta name="twitter:image"[^>]*>/, '');   // rewritten every time (names can change)
html = html.replace(/(<meta name="twitter:card"[^>]*>)/, `$1
<meta name="twitter:title" content="${NAMES} | Wedding Invitation">
<meta name="twitter:description" content="Wedding Invitation · Monday, 4th January 2027. Tap to open the invitation.">
<meta name="twitter:image" content="${URL_}assets/og.jpg?v=2">`);
if (/prabhdeep|manpreet|sabharwal|kolkata|bradree|kutia|navdeep|simerpreet/i.test(html)) throw new Error('index.html still carries the earlier couple');
fs.writeFileSync(ix, html);
console.log('✓ index.html sharing tags');
