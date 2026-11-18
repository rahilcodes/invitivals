/* Calendar files and the link-preview picture of public/balram-anushka-wedding.

     node tools/sikh-finish.mjs public/balram-anushka-wedding    (first: meta tags and cache stamps)
     node tools/balram-anushka.mjs                               (then this)

   tools/sikh-finish.mjs writes calendar files that end three hours after they start. This family supplied start times
   only and asked that no end time be invented, so this tool writes every calendar file again WITHOUT an end:
     assets/cal/<event>.ics                 one event each (iPhone opens it straight into Calendar)
     assets/cal/balram-anushka-wedding.ics  all six events ("Add All to Calendar"); all.ics and all-with-mehndi.ics,
                                            which the finishing tool leaves behind, are made the same file
   Every time is given in the wedding's own zone (TZID=Asia/Kolkata with its VTIMEZONE); lines are folded at 75 octets.
   It also draws assets/og.jpg (1200 x 630) on the invitation's own Gurudwara scene, and sets the page's sharing title. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'balram-anushka-wedding';
const DIR = path.join(ROOT, 'public', SLUG);
const { weddingConfig: cfg } = await import(pathToFileURL(path.join(DIR, 'config.js')).href + '?t=' + Date.now());
const URL_ = `https://invitivals.com/${SLUG}/`;
const TZ = 'Asia/Kolkata';
const PAIR = `${cfg.shortGroom} & ${cfg.shortBride}`;

/* ── calendar files ─────────────────────────────────────────── */
const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const wall = (iso) => { if (!/\+05:30$/.test(iso)) throw new Error('expected an India-time date: ' + iso); return iso.slice(0, 19).replace(/[-:]/g, ''); };
const vevent = (ev) => {
  const title = `${ev.name} — ${PAIR}`;
  const desc = [ev.dressCode ? `${ev.dressCode.label}: ${ev.dressCode.text}` : '', `Map: ${ev.maps}`, URL_].filter(Boolean).join('\n');
  return [
    'BEGIN:VEVENT', `UID:${wall(ev.date)}-${ev.id}@balram-anushka.invitivals.com`, 'DTSTAMP:20261118T000000Z',
    `DTSTART;TZID=${TZ}:${wall(ev.date)}`,                       /* no DTEND: only the start time was supplied */
    `SUMMARY:${esc(title)}`, `LOCATION:${esc(`${ev.venue}, ${ev.address}`)}`, `DESCRIPTION:${esc(desc)}`, `URL:${URL_}`,
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
for (const f of [`${SLUG}.ics`, 'all.ics', 'all-with-mehndi.ics']) fs.writeFileSync(path.join(CAL, f), wrap(cfg.events));
console.log(`✓ assets/cal — ${cfg.events.map((e) => e.id).join(', ')} + ${SLUG}.ics (start times only)`);

/* ── link preview ───────────────────────────────────────────── */
const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const bg = await sharp(path.join(DIR, 'assets', 'anand-karaj.webp')).resize({ width: 1200, height: 630, fit: 'cover', position: 'top' }).toBuffer();
const svg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
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
    <text x="600" y="520" font-size="62" font-style="italic" fill="#f8f0df">${x(cfg.groomName)} &amp; ${x(cfg.brideName)}</text>
    <text x="600" y="578" font-size="24" letter-spacing="6" fill="#f1e6cf">2 &amp; 3 FEBRUARY 2027 · ${x(cfg.venueCity).toUpperCase()}</text>
  </g></svg>`);
const info = await sharp(bg).composite([{ input: svg }]).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(DIR, 'assets', 'og.jpg'));
console.log('✓ assets/og.jpg', info.width + 'x' + info.height, info.size, 'bytes');

/* ── sharing tags: Invitivals, not the engine's older "Creativals" wording ─────────── */
const ix = path.join(DIR, 'index.html');
let html = fs.readFileSync(ix, 'utf8');
const set = (re, val) => { if (!re.test(html)) throw new Error('tag not found: ' + re); html = html.replace(re, val); };
const NAMES = `${cfg.groomName} &amp; ${cfg.brideName}`;
set(/<title>[^<]*<\/title>/, `<title>${NAMES} | Wedding Invitation</title>`);
set(/(<meta property="og:title" content=")[^"]*(")/, `$1${NAMES} | Wedding Invitation$2`);
set(/(<meta name="description" content=")[^"]*(")/, `$1With the blessings of Sri Guru Granth Sahib Ji, the Passi Family, Dadke &amp; Nanke, invite you to the wedding of ${cfg.groomName} and ${cfg.brideName} on 2 &amp; 3 February 2027. Anand Karaj: Wednesday, 3 February 2027, 10:30 AM at Gurdwara Baba Chart Singh.$2`);
set(/(<meta property="og:description" content=")[^"]*(")/, `$12 &amp; 3 February 2027 · Anand Karaj at Gurdwara Baba Chart Singh. Tap to open the invitation.$2`);
set(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${NAMES} — Wedding Invitation, 2 &amp; 3 February 2027$2`);
set(/(<meta name="author" content=")[^"]*(")/, `$1Invitivals$2`);
set(/(<meta property="og:site_name" content=")[^"]*(")/, `$1Invitivals$2`);
if (!/rel="canonical"/.test(html)) set(/(<meta property="og:url"[^>]*>)/, `<link rel="canonical" href="${URL_}">\n$1`);
fs.writeFileSync(ix, html);
console.log('✓ index.html sharing tags');
