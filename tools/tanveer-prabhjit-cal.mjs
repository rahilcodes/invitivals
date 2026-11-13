/* The "all events" calendar file of public/tanveer-prabhjit-wedding.

     node tools/tanveer-prabhjit-cal.mjs        (run it after tools/sikh-finish.mjs, whenever an event changes)

   tools/sikh-finish.mjs writes assets/cal/all.ics for every Sikh-engine page. This page's "Add All to Calendar" uses a
   file of its own instead, assets/cal/tanveer-prabhjit-wedding.ics, written here from the same config.js with what the
   calendar apps are strict about:
     · every time is given in the wedding's own zone (TZID=Asia/Kolkata, with its VTIMEZONE), so each event lands at
       the right local hour whatever the guest's phone is set to;
     · long lines are folded at 75 octets, and there are no empty properties;
     · each event carries its venue and, where the family gave one, its Google Maps link.
   An event's end is three hours after its start, as on the rest of the page: the family supplied start times only. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'tanveer-prabhjit-wedding');
const { weddingConfig: cfg } = await import(pathToFileURL(path.join(DIR, 'config.js')).href + '?t=' + Date.now());
const URL_ = 'https://invitivals.com/tanveer-prabhjit-wedding/';
const TZ = 'Asia/Kolkata';
const HOURS = 3;

const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
/* config dates are '2027-02-14T09:00:00+05:30': the wall-clock part IS India time */
const wall = (iso) => { if (!/\+05:30$/.test(iso)) throw new Error('expected an India-time date: ' + iso); return iso.slice(0, 19).replace(/[-:]/g, ''); };
const plus = (iso, h) => { const [d, t] = [iso.slice(0, 10), iso.slice(11, 19)]; const ms = Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10), +t.slice(0, 2) + h, +t.slice(3, 5));
  return new Date(ms).toISOString().slice(0, 19).replace(/[-:]/g, ''); };

const lines = [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Tanveer & Prabhjit Wedding//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  `X-WR-CALNAME:${esc(`${cfg.shortBride} & ${cfg.shortGroom} · Wedding`)}`, `X-WR-TIMEZONE:${TZ}`,
  'BEGIN:VTIMEZONE', `TZID:${TZ}`, 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
];
for (const ev of cfg.events) {
  const title = `${ev.name} — ${cfg.shortBride} & ${cfg.shortGroom}`;
  const desc = [ev.subtitle, ev.maps ? `Map: ${ev.maps}` : '', URL_].filter(Boolean).join('\n');
  lines.push(
    'BEGIN:VEVENT', `UID:${wall(ev.date)}-${ev.id}@tanveer-prabhjit.invitivals.com`, 'DTSTAMP:20261114T000000Z',
    `DTSTART;TZID=${TZ}:${wall(ev.date)}`, `DTEND;TZID=${TZ}:${plus(ev.date, HOURS)}`,
    `SUMMARY:${esc(title)}`, `LOCATION:${esc(`${ev.venue}, ${ev.address}`)}`, `DESCRIPTION:${esc(desc)}`, `URL:${URL_}`,
    'STATUS:CONFIRMED', 'TRANSP:OPAQUE',
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(title)}`, 'END:VALARM',
    'END:VEVENT');
}
lines.push('END:VCALENDAR');
const out = lines.map(fold).join('\r\n') + '\r\n';
fs.writeFileSync(path.join(DIR, 'assets', 'cal', 'tanveer-prabhjit-wedding.ics'), out);
console.log(`✓ assets/cal/tanveer-prabhjit-wedding.ics — ${cfg.events.length} events, ${out.length} bytes`);
