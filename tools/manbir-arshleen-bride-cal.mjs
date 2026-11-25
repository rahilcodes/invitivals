/* Calendar files of public/manbir-arshleen-bride (the bride side: Arshleen Kaur & Manbir Singh).

     node tools/manbir-arshleen-bride-cal.mjs

   Writes assets/cal/<event>.ics, one per event page, which each page's "Add to Calendar" sheet offers for
   Apple Calendar, Outlook and every other calendar app (the sheet's Google Calendar button is built in js/app.js
   from the same CONFIG).
     · Only start times were supplied, so no timed entry has an end (no DTEND, no invented duration).
     · Akhand Path and Bangle Ceremony are two activities with two times: akhand.ics holds TWO events.
     · The Wedding Celebration has no time: it is an all-day entry on 19 January 2027 ("Time to be announced").
   Times are Asia/Kolkata (TZID with its VTIMEZONE); lines folded at 75 octets.
   The events below must match CONFIG in js/app.js; the tool stops if app.js no longer carries them. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'manbir-arshleen-bride');
const URL_ = 'https://invitivals.com/manbir-arshleen-bride/';
const TZ = 'Asia/Kolkata';
const COUPLE = 'Arshleen Kaur & Manbir Singh';                 // the bride first, as everywhere on this page
const MAP = {
  shagun: 'https://maps.app.goo.gl/NGEKpNvX8zY6oawU7?g_st=ic',
  wedding: 'https://maps.app.goo.gl/JwHjUbnXJEcEe7XJ6?g_st=ic',
};

/* id: the page (and file) name; entries: one per activity */
const EVENTS = [
  { id: 'akhand', title: 'Akhand Path and Bangle Ceremony', date: '2027-01-01', where: 'At Residence',
    entries: [['Akhand Path', '12:00'], ['Bangle Ceremony', '15:00']] },
  { id: 'shagna', title: 'Din Shagna Da', date: '2027-01-15', where: 'Riviera, Airport Road, Amritsar', maps: MAP.shagun,
    entries: [['Din Shagna Da', '11:00']] },
  { id: 'haldi', title: 'The Golden Glow (Haldi)', date: '2027-01-16', where: 'Farmhouse',
    entries: [['The Golden Glow (Haldi)', '12:00']] },
  { id: 'mehndi', title: 'Jashn-e-Heena (Mehndi)', date: '2027-01-17', where: 'At Residence',
    entries: [['Jashn-e-Heena (Mehndi)', '11:00']] },
  { id: 'jaggo', title: 'Ashi’s Jaggo Night', date: '2027-01-18', where: 'Bhullar Farms',
    entries: [['Ashi’s Jaggo Night', '19:00']] },
  { id: 'anand', title: 'Anand Karaj', date: '2027-01-19', where: 'Gurudwara Chhevin Patshahi (ਗੁਰਦੁਆਰਾ ਛੇਵੀਂ ਪਾਤਸ਼ਾਹੀ)', maps: MAP.wedding,
    entries: [['Anand Karaj', '10:00']] },
  { id: 'celebration', title: 'Wedding Celebration', date: '2027-01-19', where: 'Lily Resort, Vallah, Amritsar', maps: MAP.wedding,
    entries: [['Wedding Celebration', null]] },             // no time supplied: all day
];

/* the page must still say the same */
const app = fs.readFileSync(path.join(DIR, 'js', 'app.js'), 'utf8');
for (const ev of EVENTS) for (const [, t] of ev.entries) {
  const pat = new RegExp(`${ev.id}:[^}]*date: '${ev.date}'`);
  if (!pat.test(app)) throw new Error(`js/app.js CONFIG no longer has ${ev.id} on ${ev.date}`);
  if (t && !app.includes(`'${t}'`)) throw new Error(`js/app.js CONFIG no longer has ${ev.id} at ${t}`);
}

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const ymd = (d) => d.replace(/-/g, '');
const nextDay = (d) => new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10) + 1)).toISOString().slice(0, 10).replace(/-/g, '');
const ampm = (t) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };

const vevent = (ev, [name, time], i) => {
  const title = `${name} – ${COUPLE}`;
  const desc = [
    `With the blessings of Waheguru Ji, you are warmly invited to the ${name} of ${COUPLE}.`,
    ev.entries.length > 1 ? `${ev.title}: ${ev.entries.map(([n, t]) => `${n} ${ampm(t)}`).join(', ')}.` : '',
    time ? '' : 'Time to be announced.',
    `Venue: ${ev.where}`,
    ev.maps ? `Map: ${ev.maps}` : '',
    `Invitation: ${URL_}`,
  ].filter(Boolean).join('\n');
  return [
    'BEGIN:VEVENT', `UID:${ymd(ev.date)}-${ev.id}-${i + 1}@manbir-arshleen-bride.invitivals.com`, 'DTSTAMP:20261125T000000Z',
    ...(time ? [`DTSTART;TZID=${TZ}:${ymd(ev.date)}T${time.replace(':', '')}00`]          // no DTEND: only the start was supplied
             : [`DTSTART;VALUE=DATE:${ymd(ev.date)}`, `DTEND;VALUE=DATE:${nextDay(ev.date)}`]),   // the day itself
    `SUMMARY:${esc(title)}`, `LOCATION:${esc(ev.where)}`, `DESCRIPTION:${esc(desc)}`, `URL:${URL_}`, 'STATUS:CONFIRMED',
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(title)}`, 'END:VALARM',
    'END:VEVENT'];
};
const wrap = (ev) => [
  'BEGIN:VCALENDAR', 'VERSION:2.0', '-//Invitivals//Arshleen and Manbir//EN'.replace(/^/, 'PRODID:'), 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  `X-WR-CALNAME:${esc('Arshleen & Manbir · Wedding')}`, `X-WR-TIMEZONE:${TZ}`,
  'BEGIN:VTIMEZONE', `TZID:${TZ}`, 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
  ...ev.entries.flatMap((e, i) => vevent(ev, e, i)), 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';

const CAL = path.join(DIR, 'assets', 'cal');
fs.mkdirSync(CAL, { recursive: true });
for (const ev of EVENTS) fs.writeFileSync(path.join(CAL, `${ev.id}.ics`), wrap(ev));
console.log(`✓ assets/cal — ${EVENTS.map((e) => `${e.id}(${e.entries.length})`).join(', ')}; no end times, the celebration all day`);
