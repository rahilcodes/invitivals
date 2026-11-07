/* Vaishali & Arpan: the four shorter links and the groom side's own files.
   Two source folders are edited by hand and only read here:
     public/vaishali-arpan-wedding   the bride side (all three days)
     public/arpan-vaishali-wedding   the groom side (Arpan and his family first, his own programme and his
                                     nieces' and nephews' message; since 6 Nov its content differs)
   Made from them, from scratch on every run:
     vaishali-arpan-wedding-engagement  bride side, the Engagement and the Wedding (19–20 Nov)
     vaishali-arpan-wedding-only        bride side, the Wedding alone (20 Nov)
     arpan-vaishali-wedding-engagement  groom side, 19–20 Nov
     arpan-vaishali-wedding-only        groom side, 20 Nov
   plus, for the groom source itself, its three .ics files (from GROOM_DAYS below) and its og.jpg.
   Each copy has its days trimmed in config.js, the programme cards centred for their number, its own
   address and dates in the link preview, and its own og.jpg (the main tool renders it with the dates and
   the names' order passed in). Rerun after any change to either source folder.
     node --experimental-websocket tools/vaishali-arpan-wedding-variants.mjs          (everything)
     node --experimental-websocket tools/vaishali-arpan-wedding-variants.mjs source   (only the groom master's .ics) */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BRIDE = 'vaishali-arpan-wedding', GROOM = 'arpan-vaishali-wedding';
const ALL = ['day1', 'day2', 'day3'];
const VARIANTS = [
  { slug: 'vaishali-arpan-wedding-engagement', from: BRIDE, keep: ['day2', 'day3'], dates: '19 – 20 November 2026' },
  { slug: 'vaishali-arpan-wedding-only', from: BRIDE, keep: ['day3'], dates: '20 November 2026' },
  { slug: 'arpan-vaishali-wedding-engagement', from: GROOM, keep: ['day2', 'day3'], dates: '19 – 20 November 2026', groom: true },
  { slug: 'arpan-vaishali-wedding-only', from: GROOM, keep: ['day3'], dates: '20 November 2026', groom: true },
];
const ICS = { day1: 'event-18nov.ics', day2: 'event-19nov.ics', day3: 'event.ics' };
/* the programme cards (a source page's three sit at 33.6 / 53.4 / 73.2 %, 16.8 % tall): fewer cards keep the
   same size and pitch, centred on the same band */
const CARDS = {
  2: `  'f-card-2a': { x: 12, y: 43.5, w: 76, h: 16.8 },\n  'f-card-2b': { x: 12, y: 63.3, w: 76, h: 16.8 },`,
  1: `  'f-card-1a': { x: 12, y: 53.4, w: 76, h: 16.8 },`,
};

/* ── the groom side's calendar files (the bride side's come from tools/vaishali-arpan-wedding.mjs) ── */
const ORNATE = 'Hotel Ornate Inn, Sec 03, Rohini, Delhi – 110085';
const GROOM_DAYS = [
  { file: 'event-18nov.ics', start: '20261118T110000', title: 'Arpan & Vaishali · A Day of Love, Colours & Celebrations',
    venue: 'Vyom Luxury Gym and Wellness, Near True Value, Sector 16, Rohini, Delhi', map: 'https://share.google/XcZWmq2nKNx3zUg58',
    lines: ['Dress Code: Pastel Colour Theme', '11:00 AM – Guest Welcome Lunch', '1:00 PM – Radha Krishna Phoolon Ki Haldi', '2:00 PM onwards – Pool Party (Note- Come dressed in your pastel best and enjoy the water fun! If joining, do carry an extra outfit for the evening Mehendi. Please note, only shower rooms are available; no changing rooms.)', '4:00 PM onwards – Mehendi', '7:00 PM onwards – DJ Night', '8:00 PM – Dinner'] },
  { file: 'event-19nov.ics', start: '20261119T120000', title: 'Arpan & Vaishali · The Engagement Celebration',
    venue: 'Golden Apple Mansion, Hall No. 2, Darbaar Hall, Pitampura, Delhi', map: 'https://share.google/zOVsh0H6mxrvN1ajR',
    lines: ['Afternoon', '12:00 PM – Mehandi with Bhaat', '2:00 PM – Lunch', ORNATE, 'Map: https://share.google/oaI7jLmCTHcueqsIm', '',
      'Evening', '7:00 PM – Engagement Ceremony', '8:00 PM onwards – Dinner', 'Golden Apple Mansion, Hall No. 2, Darbaar Hall, Pitampura, Delhi'] },
  { file: 'event.ics', start: '20261120T200000', title: 'Wedding of Arpan & Vaishali',
    venue: 'The Sherioan By Kawatra Tent, Colosseum Hall, Pitampura, Delhi – 110034 (Near DCP Office, Outer District)', map: 'https://share.google/6FekKRjN2AlnVlOxE',
    lines: ['Morning', '11:00 AM – Haldi', '12:00 PM onwards – Lunch', ORNATE, 'Map: https://share.google/MRgZkBZfuOQ4PYgRV', '',
      'Evening · Pre-Wedding Rituals (same venue)', '5:00 PM – Sehrabandi', '6:00 PM – Ghudchadi', '',
      'Wedding Celebration', '7:00 PM – Departure of Baraat', '8:00 PM onwards – Dinner', 'The Sherioan By Kawatra Tent, Colosseum Hall, Pitampura, Delhi – 110034 (Near DCP Office, Outer District)'] },
];
const esc = (s) => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
const fold = (l) => { const b = Buffer.from(l); if (b.length <= 75) return l; const out = []; let i = 0, first = true;
  while (i < b.length) { let n = first ? 75 : 74; while (i + n < b.length && (b[i + n] & 0xc0) === 0x80) n--; out.push((first ? '' : ' ') + b.subarray(i, i + n).toString()); i += n; first = false; } return out.join('\r\n'); };
for (const d of GROOM_DAYS) {
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Arpan & Vaishali Wedding//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
    'BEGIN:VEVENT', `UID:${GROOM}-${d.start.slice(0, 8)}@invitivals.com`, 'DTSTAMP:20261106T000000Z', `DTSTART;TZID=Asia/Kolkata:${d.start}`,
    `SUMMARY:${esc(d.title)}`, `LOCATION:${esc(d.venue)}`, `DESCRIPTION:${esc([...d.lines, '', `Map: ${d.map}`].join('\n'))}`,
    `URL:https://invitivals.com/${GROOM}/`, 'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(d.title)} tomorrow`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR', '',
  ];
  fs.writeFileSync(path.join(ROOT, 'public', GROOM, d.file), ics.map(fold).join('\r\n'));
}
console.log(`✓ ${GROOM}: 3 × .ics`);
if (process.argv[2] === 'source') process.exit(0); // "source": only the groom master's files; the copies stay as they are
const og = (slug, dates, groom) => {
  const r = spawnSync(process.execPath, ['--experimental-websocket', path.join(ROOT, 'tools/vaishali-arpan-wedding.mjs'), 'og', slug, dates.toUpperCase(), ...(groom ? ['groom'] : [])], { stdio: 'inherit' });
  if (r.status) throw new Error('og.jpg failed');
};
og(GROOM, '18 – 20 November 2026', true);

const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) throw new Error(`${file}: missing "${String(a).slice(0, 60)}"`);
    s = s.split(a).join(b);
  }
  fs.writeFileSync(file, s);
};

for (const v of VARIANTS) {
  const out = path.join(ROOT, 'public', v.slug);
  const which = v.keep.length === 1 ? 'the wedding day only' : 'the Engagement and the Wedding';
  fs.rmSync(out, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 }); // the dev server may still hold a film open
  fs.cpSync(path.join(ROOT, 'public', v.from), out, { recursive: true });
  for (const k of ALL) if (!v.keep.includes(k)) fs.rmSync(path.join(out, ICS[k]));
  if (!v.keep.includes('day1')) for (const c of ['blue', 'pink', 'peach', 'green']) fs.rmSync(path.join(out, 'assets', `pastel-${c}.webp`));

  /* config.js: only the kept days */
  const cfg = path.join(out, 'config.js');
  let s = fs.readFileSync(cfg, 'utf8');
  const m = s.match(/(  days: \[\n)([\s\S]*?)(\n  \],\n)/);
  if (!m) throw new Error('days block not found');
  const days = m[2].split(/\n    \},\n    \{\n/).map((d, i, a) => (i ? '    {\n' : '') + d + (i < a.length - 1 ? '\n    },' : ''));
  const kept = days.filter((d) => v.keep.some((k) => d.includes(`key: '${k}'`)));
  if (kept.length !== v.keep.length) throw new Error('a day is missing');
  s = s.replace(m[0], m[1] + kept.join('\n') + m[3]);
  s = s.replace('/* page 3 → the three days (detail pages).', `/* page 3 → ${which} (this link's days; the main link has all three).`);
  s = s.replace(/\/\* ─+\n[\s\S]*?\n   Every word/, `/* ─────────────────────────────────────────────────────────────
   Vaishali & Arpan (${v.slug}): the ${v.groom ? 'groom' : 'bride'}-side invitation with ${which};
   a copy of ${v.from} made by tools/vaishali-arpan-wedding-variants.mjs — edit the main folder and rerun it.
   Every word`);
  fs.writeFileSync(cfg, s);

  /* app.js and layout.js: as many cards as days, the wedding found by its key */
  edit(path.join(out, 'js/app.js'), [
    ['const [day1, day2, day3] = C.days;', "const day3 = C.days.find((d) => d.key === 'day3');"],
    [`  card('f-card-a', day1, 'I', 0.4),\n  card('f-card-b', day2, 'II', 0.6),\n  card('f-card-c', day3, 'III', 0.8),`,
      "  ...C.days.map((d, i) => card(`f-card-${C.days.length}${'abc'[i]}`, d, ['I', 'II', 'III'][i], 0.4 + 0.2 * i)),"],
    ['Scroll order: 1 the invitation, 2 the date, 3 the programme (three days),', `Scroll order: 1 the invitation, 2 the date, 3 the programme (${v.keep.length === 1 ? 'the wedding' : 'two days'}),`],
  ]);
  edit(path.join(out, 'js/layout.js'), [
    [`  'f-card-a': { x: 12, y: 33.6, w: 76, h: 16.8 },\n  'f-card-b': { x: 12, y: 53.4, w: 76, h: 16.8 },\n  'f-card-c': { x: 12, y: 73.2, w: 76, h: 16.8 },`, CARDS[v.keep.length]],
    ['/* page 3: the programme, three cards under', `/* page 3: the programme, ${v.keep.length === 1 ? 'one card' : 'two cards'} under`],
  ]);

  /* index.html and the calendar files: this link's address and dates */
  edit(path.join(out, 'index.html'), [
    [`https://invitivals.com/${v.from}/`, `https://invitivals.com/${v.slug}/`],
    ['18 – 20 November 2026', v.dates],
  ]);
  for (const f of fs.readdirSync(out).filter((n) => n.endsWith('.ics'))) edit(path.join(out, f), [[`URL:https://invitivals.com/${v.from}/`, `URL:https://invitivals.com/${v.slug}/`]]);

  og(v.slug, v.dates, v.groom);
  console.log(`✓ ${v.slug}: from ${v.from}, ${v.keep.join(' + ')}`);
}
