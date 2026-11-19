/* Sujatha K & Jeevan L — engagement (public/sujatha-jeevan-engagement, on the lakshmi-saicharan-engagement design).

     node tools/sujatha-jeevan-engagement.mjs

   Writes event.ics from config.js: the static calendar file behind "Add to my calendar" (the page also builds the same
   file in the browser). Only the start time was supplied ("10:30 AM onwards"), so there is NO DTEND.
   The seal, film and link preview come from the design's own tools once the monogram is in
   invites/src/saicharan-lakshmi-engagement/sj-logo.jpg:
     SLUG=sujatha-jeevan-engagement MARK=sj node tools/saicharan-lakshmi-cl.mjs
     SLUG=sujatha-jeevan-engagement MARK=sj FFMPEG=… node tools/saicharan-lakshmi-film.mjs   (then cut at 4.0 s) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'sujatha-jeevan-engagement');
const { invite: C } = await import(pathToFileURL(path.join(DIR, 'config.js')).href + '?t=' + Date.now());

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const off = C.event.utcOffset.replace(':', '');
const start = `${C.event.date.replace(/-/g, '')}T${C.event.time.replace(':', '')}00`;
const location = `${C.venue.name}, ${C.venue.address.join(' ')}`;
const ics = [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Engagement Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'BEGIN:VTIMEZONE', `TZID:${C.event.timeZone}`, 'BEGIN:STANDARD', 'DTSTART:19700101T000000', `TZOFFSETFROM:${off}`, `TZOFFSETTO:${off}`, 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
  'BEGIN:VEVENT', `UID:${C.slug}-${C.event.date}@invitivals.com`, 'DTSTAMP:20261119T000000Z',
  `DTSTART;TZID=${C.event.timeZone}:${start}`,                    /* no DTEND: only the start was supplied */
  `SUMMARY:${esc(C.title)}`, `LOCATION:${esc(location)}`, `DESCRIPTION:${esc(C.details + '\nMap: ' + C.venue.mapsUrl)}`,
  `URL:https://invitivals.com/${C.slug}/`,
  'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc('Engagement of ' + C.couple.short + ' is tomorrow')}`, 'END:VALARM',
  'END:VEVENT', 'END:VCALENDAR',
].map(fold).join('\r\n') + '\r\n';
fs.writeFileSync(path.join(DIR, 'event.ics'), ics);
console.log('✓ event.ics', ics.length, 'bytes');

/* ── link preview: assets/og.jpg (1200×630) from the page's own art — the couple, the Engagement lettering,
   the couple's monogram, their names and the day ── */
const { default: sharp } = await import('sharp');
const A = path.join(DIR, 'assets'), W = 1200, H = 630;
if (fs.existsSync(path.join(A, 'el/sj-logo.webp'))) {
  const bg = await sharp(path.join(A, 'bg/p1.webp')).resize({ width: W, height: H, fit: 'cover', position: 'top' }).modulate({ brightness: 1.02 }).toBuffer();
  const couple = await sharp(path.join(A, 'el/couple.webp')).resize({ height: 600 }).toBuffer();
  const engagement = await sharp(path.join(A, 'el/engagement.webp')).resize({ width: 320 }).toBuffer();
  const mono = await sharp(path.join(A, 'el/sj-logo.webp')).resize({ width: 156 }).toBuffer();
  const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const text = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9953a"/><stop offset=".55" stop-color="#8a5a12"/><stop offset="1" stop-color="#b9862c"/></linearGradient></defs>
    <style>.c{font-family:Georgia,'Times New Roman',serif;fill:#4f5a3a;letter-spacing:5px;text-anchor:middle}</style>
    <text x="700" y="58" class="c" font-size="18">YOU ARE INVITED TO</text>
    <text x="700" y="240" class="c" font-size="20">CEREMONY OF</text>
    <text x="700" y="488" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="58" fill="url(#g)">${x(C.couple.first)} &amp; ${x(C.couple.second)}</text>
    <text x="700" y="548" class="c" font-size="20">${x(C.event.day.toUpperCase())} · ${x(C.event.display.date.toUpperCase())} · ${x(C.event.display.time)}</text>
  </svg>`);
  const info = await sharp(bg).composite([
    { input: couple, left: 30, top: H - 600 },
    { input: engagement, left: 540, top: 78 },
    { input: mono, left: 622, top: 262 },
    { input: text, left: 0, top: 0 },
  ]).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(A, 'og.jpg'));
  console.log('✓ assets/og.jpg', info.width + 'x' + info.height, info.size, 'bytes');
} else console.log('· no el/sj-logo.webp yet: og.jpg not drawn');
