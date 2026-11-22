/* Calendar files, link-preview picture and sharing tags of public/kiranjit-sharnjit-wedding (client brief 2026-11-22).
   Adapted from tools/balram-anushka-groom.mjs.

     node tools/sikh-finish.mjs public/kiranjit-sharnjit-wedding    (first: meta tags and cache stamps)
     node tools/kiranjit-sharnjit.mjs                               (then this)

   tools/sikh-finish.mjs writes calendar files that end three hours after they start. Only start times were supplied
   (the Kirtan alone has an end, 12:00 Noon), so this tool writes every calendar file again with no invented end:
     assets/cal/<event>.ics                    one event each (iPhone opens it straight into Calendar)
     assets/cal/wedding.ics                    the Save the Date: "Wedding of Kiranjit Singh & Sharnjit Kaur", 6 Dec, 9:00 AM
     assets/cal/kiranjit-sharnjit-wedding.ics  all seven events ("Add All to Calendar"); all.ics and all-with-mehndi.ics,
                                               which the finishing tool leaves behind, are made the same file
   Every time is given in the wedding's own zone (TZID=Asia/Kolkata with its VTIMEZONE); lines are folded at 75 octets.
   It also draws assets/og.jpg (1200 x 630) on the invitation's own scene, and sets the page's sharing tags. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'kiranjit-sharnjit-wedding';
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
  const title = ev.calTitle || `${ev.name}${ev.subtitle ? ' – ' + ev.subtitle : ''} — ${PAIR}`;
  const desc = [ev.calDetails || `${ev.name}${ev.subtitle ? ' – ' + ev.subtitle : ''} · the wedding of ${cfg.groomName} & ${cfg.brideName}.`, `Time: ${ev.time}.`, ev.maps ? `Map: ${ev.maps}` : '', URL_].filter(Boolean).join('\n');
  return [
    'BEGIN:VEVENT', `UID:${wall(ev.date)}-${ev.id}@kiranjit-sharnjit.invitivals.com`, 'DTSTAMP:20261122T000000Z',
    `DTSTART;TZID=${TZ}:${wall(ev.date)}`, ...(ev.end ? [`DTEND;TZID=${TZ}:${wall(ev.end)}`] : []),   /* an end only where the card gives one */
    `SUMMARY:${esc(title)}`, `LOCATION:${esc([ev.venue, ev.address].filter(Boolean).join(', '))}`, `DESCRIPTION:${esc(desc)}`, `URL:${URL_}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(title)}`, 'END:VALARM',
    'END:VEVENT'];
};
const wrap = (events) => [
  'BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//Invitivals//${PAIR} Wedding//EN`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  `X-WR-CALNAME:${esc(`${PAIR} · Wedding`)}`, `X-WR-TIMEZONE:${TZ}`,
  'BEGIN:VTIMEZONE', `TZID:${TZ}`, 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
  ...events.flatMap(vevent), 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
/* an event at a shared venue writes the venue card's address into its entry */
const withAddress = (ev) => (ev.group && !ev.address ? { ...ev, address: cfg.venueGroups[ev.group].lines.join(' ') } : ev);
const CAL = path.join(DIR, 'assets', 'cal');
fs.rmSync(CAL, { recursive: true, force: true }); fs.mkdirSync(CAL, { recursive: true });
for (const ev of cfg.events) fs.writeFileSync(path.join(CAL, `${ev.id}.ics`), wrap([withAddress(ev)]));
fs.writeFileSync(path.join(CAL, `${cfg.saveTheDate.event.id}.ics`), wrap([cfg.saveTheDate.event]));
for (const f of [`${SLUG}.ics`, 'all.ics', 'all-with-mehndi.ics']) fs.writeFileSync(path.join(CAL, f), wrap(cfg.events.map(withAddress)));
console.log(`✓ assets/cal — ${cfg.events.map((e) => e.id).join(', ')}, ${cfg.saveTheDate.event.id} + ${SLUG}.ics`);

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
    <text x="600" y="578" font-size="24" letter-spacing="6" fill="#f1e6cf">SUNDAY · 6 DECEMBER 2026 · J.S. RESORTS</text>
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
set(/(<meta name="description" content=")[^"]*(")/, `$1Sardarni Lovepreet Kaur &amp; S. Amarjit Singh Ghotra request the pleasure of your company on the auspicious occasion of the wedding ceremony of their beloved son ${cfg.groomName} with ${cfg.brideName}. Sunday, 6 December 2026: Baraat departure 9:00 AM, Lavaan 10:30 AM at J.S. Resorts, Begowal to Nadala Road, Adda Sikri.$2`);
set(/(<meta property="og:description" content=")[^"]*(")/, `$1Sunday, 6 December 2026 · J.S. Resorts, Adda Sikri. Tap to open the invitation.$2`);
set(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${NAMES} — Wedding Invitation, Sunday 6 December 2026$2`);
set(/(<meta name="author" content=")[^"]*(")/, `$1Invitivals$2`);
set(/(<meta property="og:site_name" content=")[^"]*(")/, `$1Invitivals$2`);
if (!/rel="canonical"/.test(html)) set(/(<meta property="og:url"[^>]*>)/, `<link rel="canonical" href="${URL_}">\n$1`);
html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${URL_}$2`);
if (/nagra|balram|anushka|passi/i.test(html) || !html.includes(`og:url" content="${URL_}`)) throw new Error('index.html still carries the earlier couple');
fs.writeFileSync(ix, html);
console.log('✓ index.html sharing tags');
