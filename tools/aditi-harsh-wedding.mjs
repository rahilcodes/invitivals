/* Aditi & Harsh — the client's files of public/aditi-harsh-wedding (client brief 2026-11-18).

     node tools/aditi-harsh-wedding.mjs

   Sources in invites/src/aditi-harsh-wedding/: music.mp3 (the client's song, copied as it is) and venue.jpg (their
   picture of Krushnakunj Mandapam, re-encoded whole, never cropped). Also writes the calendar files Apple Calendar
   and Outlook open, one per function, from the page's own config.js: India time, the start only — no end time was
   supplied and none is invented. The page itself (config.js, js/, css/) is edited by hand. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'invites/src/aditi-harsh-wedding'), OUT = path.join(ROOT, 'public/aditi-harsh-wedding');
const URL_ = 'https://invitivals.com/aditi-harsh-wedding/';

fs.copyFileSync(path.join(SRC, 'music.mp3'), path.join(OUT, 'assets/audio/aditi-harsh.mp3'));
console.log(await sharp(path.join(SRC, 'venue.jpg')).webp({ quality: 88, effort: 6 }).toFile(path.join(OUT, 'assets/venue-krushnakunj-mandapam.webp')));

const { weddingConfig: C } = await import(pathToFileURL(path.join(OUT, 'config.js')).href + `?t=${Date.now()}`);
const esc = (s) => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
const fold = (l) => { const out = []; let s = l; while (Buffer.byteLength(s) > 73) { let n = 73; while (Buffer.byteLength(s.slice(0, n)) > 73) n--; out.push(s.slice(0, n)); s = ' ' + s.slice(n); } out.push(s); return out.join('\r\n'); };
for (const e of C.events) {
  const local = e.date.slice(0, 19).replace(/[-:]/g, '');           // the wall-clock time in India, as written in config.js
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
    'BEGIN:VEVENT', `UID:aditi-harsh-${e.ics.replace('.ics', '')}@invitivals.com`, 'DTSTAMP:20261118T000000Z',
    `DTSTART;TZID=Asia/Kolkata:${local}`,
    `SUMMARY:${esc(`${e.name} — ${C.brideName} & ${C.groomName}`)}`,
    `LOCATION:${esc(`${C.venue}, ${C.venueAddress}`)}`,
    `DESCRIPTION:${esc(`${C.mapsUrl}\n\n${URL_}`)}`,
    `URL:${C.mapsUrl}`,
    'END:VEVENT', 'END:VCALENDAR',
  ];
  fs.writeFileSync(path.join(OUT, e.ics), lines.map(fold).join('\r\n') + '\r\n');
  console.log(e.ics, local);
}
