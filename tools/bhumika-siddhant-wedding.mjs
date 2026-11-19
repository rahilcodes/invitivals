#!/usr/bin/env node
/* Bhumika & Siddhant — a Jain wedding, Wednesday 2nd December 2026, Vedanta Farm (Jashn – The Roman Palace),
   Ghaziabad (client brief 2026-11-18). A separate invitation at public/bhumika-siddhant-wedding. The client chose
   the Lokesh & Akansha page as the reference for the design and the way it works; that page
   (public/lokesh-akansha-wedding) is only ever READ here, never written.

     (render tools/bhumika-siddhant-monogram.html → invites/src/saicharan-lakshmi-engagement/bs-logo.jpg, see that file)
     node tools/bhumika-siddhant-wedding.mjs init                                         papers, ornaments, stylesheet, page script, song, the client's pictures
     SLUG=bhumika-siddhant-wedding MARK=bs node tools/saicharan-lakshmi-cl.mjs            the envelope's seal (also writes el/bs-logo.webp)
     SLUG=bhumika-siddhant-wedding MARK=bs FFMPEG=… node tools/saicharan-lakshmi-film.mjs the film, then cut -t 4.0 → opening-bs-v2.mp4
     node tools/bhumika-siddhant-wedding.mjs                                              index.html, config.js, event.ics (after every change of words)
   The link-preview cover: tools/bhumika-siddhant-wedding-og.html.

   The client's pictures (invites/src/bhumika-siddhant-wedding/):
     mahavir.jpg      Lord Mahavir under the tree. Never redrawn: the picture is cropped above the wallpaper site's
                      mark at its foot and its parchment fades out in an oval towards the edges, so it sits in the invitation's paper.
     jain-symbol.jpg  the Jain emblem on white: only the white AROUND it is made transparent (its own white band,
                      hand and crescent stay), nothing is recoloured or stretched.
     couple.jpg       the couple's photograph, whole, only resized.
   The B–S monogram named in the brief did not arrive (2026-11-18): the seal and the pages carry a lettered stand-in.

   Slides: the sealed envelope and its film · Lord Mahavir and the two lines · the invitation (Bhumika weds Siddhant) ·
   Save the Date (scratch card, slide 3 since 19 Nov) · Our Families · the couple's photograph · The Wedding Day (three events) · Wedding Venue · the countdown ·
   R.S.V.P. (second-last) · With Best Compliments From (last). No Ganesha anywhere: this is a Jain wedding.
   Every name and detail is exactly as the family wrote it; no end times, phone numbers or other names are added. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const SLUG = 'bhumika-siddhant-wedding', D = path.join(ROOT, 'public', SLUG), REF = path.join(ROOT, 'public/lokesh-akansha-wedding');
const SRC = path.join(ROOT, 'invites/src', SLUG);
const URL_ = `https://invitivals.com/${SLUG}/`, V = 2, COVER = 'cover-bhumika-siddhant.jpg';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* the venue exactly as on the family's card. No map link was supplied, so the button searches Google Maps for
   this name and address (replace mapsUrl with the family's own pin when it arrives). */
const VENUE = { name: 'Vedanta Farm', sub: '(Jashn – The Roman Palace)',
  lines: ['27 Km Stone, Delhi-Hapur Bypass Road, NH-24,', 'Near AKG College, Adhyatmik Nagar,', 'Ghaziabad, U.P. – 201009.'] };
VENUE.full = `${VENUE.name} ${VENUE.sub}, ${VENUE.lines.join(' ')}`;
VENUE.mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Vedanta Farm, Jashn The Roman Palace, Delhi-Hapur Bypass Road, NH-24, Near AKG College, Adhyatmik Nagar, Ghaziabad, Uttar Pradesh 201009');
/* the three events, exactly as supplied. Only start times were given, so the calendar entries carry the start only. */
const DAY = [
  { id: 'reception-of-barat', icon: 'horse', name: 'Reception of Barat', time: '12:00 PM', start: '20261202T120000' },
  { id: 'lunch', icon: 'dinner', name: 'Lunch', time: '1:00 PM', start: '20261202T130000' },
  { id: 'vidai', icon: 'doli', name: 'Vidai', time: '5:00 PM', start: '20261202T170000' },
];
const COUNTDOWN = '2026-12-02T12:00:00+05:30';
const RSVP = ['Sanjay Jain & Sons', 'Kavita Fab', 'Palak Fabric', 'Naman Fab'];
const COMPLIMENTS = ['Samyak', 'Naman', 'Akshat', 'Rajat', 'Shweta', 'Nancy', 'Manya', 'Palak', 'Anant', 'Riya'];
const MANGAL = ['मंगलम भगवान वीरो, मंगलम गौतमो गणि।', 'मंगलम कुन्दकुन्दाद्यो, जैन धर्मोस्तु मंगलम् ॥'];

const CSS = `

/* ═════════ Bhumika & Siddhant: this invitation's own pieces ═════════ */
:root { --paper: #efdcc0; --gold: #9c6f24; --gold-light: #d8b45f; }
/* Lord Mahavir: the client's own picture. Its parchment fades out at the edges (in the file) and is multiplied into
   the page's paper, so the tree's leaves seem painted on the invitation itself */
.mahavir { display: block; flex: none; width: calc(var(--cq) * 66); height: auto; margin: 0 0 calc(var(--cq) * -2); mix-blend-mode: multiply; }
.namah { font-family: var(--deva); font-weight: 600; color: var(--maroon); font-size: calc(var(--cq) * 5.3); line-height: 1.5; white-space: nowrap; }
.shloka.mangal { font-size: calc(var(--cq) * 3.5); line-height: 1.85; letter-spacing: 0; margin-top: calc(var(--cq) * 1.4); }
/* the Jain emblem, small, over the invitation: its own colours and proportions */
.jain { display: block; flex: none; width: calc(var(--cq) * var(--w, 13)); height: auto; filter: drop-shadow(0 calc(var(--cq) * .6) calc(var(--cq) * 1) rgba(60, 30, 80, .22)); }
/* the couple's monogram, by itself: no disc, no box, only its own shadow on the paper */
.mono { display: block; flex: none; width: calc(var(--cq) * var(--w, 30)); height: auto; filter: drop-shadow(0 calc(var(--cq) * .9) calc(var(--cq) * 1.4) rgba(96, 58, 12, .34)) drop-shadow(0 0 calc(var(--cq) * .3) rgba(110, 70, 20, .3)); }
/* the invitation: the destiny line, the two names with "weds" between them */
.destiny { font-family: var(--serif); font-style: italic; font-weight: 600; color: var(--maroon); font-size: calc(var(--cq) * 4.5); line-height: 1.4; text-wrap: balance; }
.couple-names .script--xl { font-size: calc(var(--cq) * 15); }
.amp__and.weds { font-size: calc(var(--cq) * 6.4); padding: 0 .1em; }
/* the families, in the card's own order */
.fam__n.fam__n--sm { font-size: calc(var(--cq) * 10.4); font-weight: 400; white-space: nowrap; }
.fam__p span, .addr span { display: block; }
.para--invite { font-size: calc(var(--cq) * 3.9); line-height: 1.5; margin: calc(var(--cq) * 3) 0; }
.with { display: flex; align-items: center; gap: calc(var(--cq) * 2.4); width: calc(var(--cq) * 44); margin: calc(var(--cq) * 4.4) 0; font-family: var(--caps); font-weight: 600; color: var(--gold); font-size: calc(var(--cq) * 3.4); letter-spacing: .3em; padding-left: .3em; }
.with::before, .with::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, transparent, var(--gold-light), transparent); }
/* the couple's photograph, whole; their names over it, narrow enough to stand between the page's flowers */
.script--pair { font-size: calc(var(--cq) * 7); white-space: nowrap; }
.script--pair span { color: var(--gold); }
.frame.frame--couple { width: calc(var(--cq) * 66); margin-top: calc(var(--cq) * 3.4); }
/* the venue */
.venue--caps { text-transform: uppercase; letter-spacing: .06em; }
.venue-sub { font-family: var(--serif); font-weight: 700; color: var(--ink); font-size: calc(var(--cq) * 4.6); line-height: 1.25; margin-top: calc(var(--cq) * .6); }
.medal--lg { width: calc(var(--cq) * 19); height: calc(var(--cq) * 19); margin-top: calc(var(--cq) * 3.4); }
.medal--lg svg { fill: var(--maroon); stroke: none; width: 50%; height: 50%; }
.maps--wide { padding: 0 calc(var(--cq) * 5); font-size: calc(var(--cq) * 3.2); letter-spacing: .14em; }
.sheet__note { margin: 14px 0 2px; font-family: var(--caps); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); }
/* R.S.V.P.: the four names of the card, one under the other */
.rsvp { list-style: none; margin: calc(var(--cq) * 3) 0 0; padding: 0; display: grid; gap: calc(var(--cq) * 2.6); }
.rsvp li { font-family: var(--serif); font-weight: 700; color: var(--maroon); font-size: calc(var(--cq) * 5.6); line-height: 1.2; letter-spacing: .01em; }
.rsvp li + li::before { content: ''; display: block; width: calc(var(--cq) * 12); height: 1px; margin: 0 auto calc(var(--cq) * 2.6); background: linear-gradient(to right, transparent, var(--gold-light), transparent); }
/* With Best Compliments From: ten names in two columns; the children's own line in the painted arch */
.page--end .script--end { font-size: calc(var(--cq) * 8.6); line-height: 1.1; }
.comp { list-style: none; margin: calc(var(--cq) * 2.2) 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; column-gap: calc(var(--cq) * 9); row-gap: calc(var(--cq) * .9); }
.comp li { font-family: var(--serif); font-weight: 700; color: var(--maroon); font-size: calc(var(--cq) * 4.7); line-height: 1.25; }
.mausi { font-family: var(--deva); font-weight: 600; color: var(--maroon); font-size: calc(var(--cq) * 3.5); line-height: 1.6; }
.mausi span { display: block; white-space: nowrap; }
.kids { font-family: var(--script); color: var(--gold); font-size: calc(var(--cq) * 6.6); line-height: 1.1; margin-top: calc(var(--cq) * .8); white-space: nowrap; }
/* client, 19 Nov: the couple's names in a clear serif (Playfair Display italic) instead of the script; same maroon */
.nm { font-family: 'Playfair Display', var(--serif); font-style: italic; font-weight: 500; letter-spacing: .005em; }
.couple-names .script--xl.nm { font-size: calc(var(--cq) * 12.4); line-height: 1.22; }
.fam__n.fam__n--sm.nm { font-size: calc(var(--cq) * 8.6); line-height: 1.3; }
.script--pair.nm { font-size: calc(var(--cq) * 6.1); line-height: 1.3; }
/* Save the Date (slide 3): one day, so one numeral on the scratch card */
.scard__num.scard__num--one { font-size: calc(var(--cq) * 19); }
`;

if (process.argv[2] === 'init') {
  const { default: sharp } = await import('sharp');
  for (const d of ['assets/bg', 'assets/el', 'assets/media', 'css', 'js']) fs.mkdirSync(path.join(D, d), { recursive: true });
  for (const f of ['bg/p1', 'bg/p2', 'bg/p4', 'bg/p6', 'el/bell', 'el/bell2', 'el/garland', 'el/bird', 'el/tasselA', 'el/tasselB'])
    fs.copyFileSync(path.join(REF, `assets/${f}.webp`), path.join(D, `assets/${f}.webp`));
  for (const f of ['favicon.svg', 'assets/media/music.mp3']) fs.copyFileSync(path.join(REF, f), path.join(D, f));
  fs.writeFileSync(path.join(D, '.htaccess'), fs.readFileSync(path.join(REF, '.htaccess'), 'utf8').replace(/\r\n/g, '\n').replace('|svg)$"', '|svg|ics)$"') + '<IfModule mod_mime.c>\n  AddType text/calendar .ics\n</IfModule>\n');
  fs.writeFileSync(path.join(D, 'css/invite.css'), fs.readFileSync(path.join(REF, 'css/invite.css'), 'utf8').replace(/\r\n/g, '\n')
    .replace('Lokesh & Akansha — the wedding, groom side (shared by lokesh-akansha-wedding and lokesh-akansha-wedding-day;\n   written by tools/lokesh-akansha-wedding.mjs from this file).', 'Bhumika & Siddhant — the wedding (set up once by tools/bhumika-siddhant-wedding.mjs init; this copy is this page\'s own).') + CSS);
  /* the page script: the same opening, music, scroll-in, petals, calendar sheet and countdown; there is no scratch
     card on this page, and the script's part for it simply finds nothing to run on */
  let js = fs.readFileSync(path.join(REF, 'js/app.js'), 'utf8').replace(/\r\n/g, '\n');
  const sw = (a, b) => { if (js.split(a).length !== 2) throw new Error('app.js: ' + a.slice(0, 50)); js = js.replace(a, () => b); };
  sw('Lokesh & Akansha — the wedding, groom side.', 'Bhumika & Siddhant — the wedding.');
  sw("'Our special days await'", "'Our special day awaits'");
  sw("const sheet = $('#sheet'), calBtn = $('#calBtn');", "const sheet = $('#sheet'), calBtns = document.querySelectorAll('.cal-btn'); let calBtn = calBtns[0];   // two buttons open the one sheet");
  sw("calBtn.addEventListener('click', () => { sheet.hidden = false; sheet.querySelector('a').focus(); });", "for (const b of calBtns) b.addEventListener('click', () => { calBtn = b; sheet.hidden = false; sheet.querySelector('a').focus(); });");
  sw("'../config.js?v=3'", "'../config.js?v=1'");
  sw("'assets/el/la-logo.webp'", "'assets/el/bs-logo.webp'");
  sw('countdown to the Pheras', 'countdown to the Reception of Barat');
  fs.writeFileSync(path.join(D, 'js/app.js'), js);

  /* Lord Mahavir: cropped above the wallpaper site's mark (y > 1500), nothing redrawn; the parchment fades to
     transparent towards the four edges so no edge of the picture can be seen on the page */
  { const X0 = 0, Y0 = 200, W = 900, H = 1290;
    const { data } = await sharp(path.join(SRC, 'mahavir.jpg')).extract({ left: X0, top: Y0, width: W, height: H }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const out = Buffer.alloc(W * H * 4), ss = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      /* an oval window: full in the middle, gone before any edge or corner of the picture is reached */
      const i = y * W + x, r = Math.hypot((x - W / 2) / (W * .5), (y - H * .5) / (H * .5)), a = (1 - ss(.74, .99, r)) * ss(0, 60, Math.min(x, W - 1 - x)) * ss(0, 60, Math.min(y, H - 1 - y));
      out[i * 4] = data[i * 3]; out[i * 4 + 1] = data[i * 3 + 1]; out[i * 4 + 2] = data[i * 3 + 2]; out[i * 4 + 3] = Math.round(a * 255);
    }
    console.log('mahavir', (await sharp(out, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 90, alphaQuality: 90, effort: 6 }).toFile(path.join(D, 'assets/el/mahavir.webp'))).size); }
  /* the Jain emblem: the white AROUND it becomes transparent (flood from the picture's border through near-white),
     its own white parts stay; a one-pixel soft edge */
  { const { data, info } = await sharp(path.join(SRC, 'jain-symbol.jpg')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const W = info.width, H = info.height, white = (i) => data[i * 3] > 236 && data[i * 3 + 1] > 236 && data[i * 3 + 2] > 236;
    const out = new Uint8Array(W * H), stack = [];
    for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x); for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
    while (stack.length) { const i = stack.pop(); if (out[i] || !white(i)) continue; out[i] = 1; const x = i % W; if (x > 0) stack.push(i - 1); if (x < W - 1) stack.push(i + 1); if (i >= W) stack.push(i - W); if (i < W * (H - 1)) stack.push(i + W); }
    const alpha = Buffer.alloc(W * H); for (let i = 0; i < W * H; i++) alpha[i] = out[i] ? 0 : 255;
    const soft = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } }).blur(0.8).toColourspace('b-w').raw().toBuffer();
    const rgba = await sharp(data, { raw: { width: W, height: H, channels: 3 } }).joinChannel(soft, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
    console.log('jain', (await sharp(rgba).trim({ threshold: 2 }).resize({ width: 520 }).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(path.join(D, 'assets/el/jain-symbol.webp')))); }
  await sharp(path.join(SRC, 'couple.jpg')).resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 88, effort: 6 }).toFile(path.join(D, 'assets/el/couple.webp'));
  console.log('✓ init', SLUG);
  process.exit(0);
}

const ICON = {
  horse: '<path d="M36 43c0-8-1-14-4-19-1-4-1-8-3-11l-2-6-2 5c-3-1-7 0-10 3l-6 7c-2 2-2 5 0 6l3 1c2 0 3-1 4-2l4-2c2 4 2 10-1 16l-1 2"/><circle cx="20" cy="15" r="1"/><path d="M30 13c4 3 7 9 8 16M31 19c3 4 5 9 5 15M16 22l5-7M10 23.500h1.500"/><path d="M27 7l3-3 1 4"/>',
  dinner: '<path d="M6 36h36"/><path d="M9 36c0-9 6.500-15 15-15s15 6 15 15"/><path d="M24 21v-3"/><circle cx="24" cy="16" r="2"/><path d="M12 40h24"/><path d="M16 31c1-3 3-5 6-6"/>',
  /* a doli: the bride's palanquin on its pole */
  doli: '<path d="M3 17h42"/><path d="M12 17v17h24V17"/><path d="M11 17c3-9 23-9 26 0"/><path d="M24 8.500v-3"/><path d="M19 34V24c0-2.500 2.200-4 5-4s5 1.500 5 4v10"/><path d="M9 38h30"/><path d="M14 38v3M34 38v3"/>',
};
const PINPATH = '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>';
const CALPATH = '<path d="M7 2h2v2h6V2h2v2h3v18H4V4h3zm-1 7v11h12V9zm2 2h3v3H8z"/>';
const at = (pct, H) => `calc(var(--cq) * ${(pct * H / 100).toFixed(1)})`;
const MONO = (w, cls = 'pop', d = '.1s') => `<img class="mono ${cls}" style="--w:${w};--d:${d}" src="assets/el/bs-logo.webp" alt="The couple's monogram: the letters B and S in gold" width="900" height="900" loading="lazy" decoding="async">`;
const JAIN = (w, d = '.1s', lazy = true) => `<img class="jain pop" style="--w:${w};--d:${d}" src="assets/el/jain-symbol.webp" alt="The Jain emblem: the swastika, the three dots and crescent, and the raised hand with Ahimsa written in it" width="520" height="873"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
const GARLAND = (w = 18, d = '.1s', m = '') => `<img class="orn rise" style="width:calc(var(--cq) * ${w});${m}--d:${d}" src="assets/el/garland.webp" alt="" loading="lazy">`;
const TASSELS = `<img class="el swing" style="left:5.5%;top:${at(36, 169.29)};width:8%;--d:.6s" src="assets/el/tasselB.webp" alt="" loading="lazy">
      <img class="el swing" style="right:5.5%;top:${at(38, 169.29)};width:7%;--d:.8s" src="assets/el/tasselA.webp" alt="" loading="lazy">`;
const bells = (y1, y2, lazy, H = 177.68) => [['left:12%', y1, 5, .9], ['left:6%', y2, 5.6, 1.1], ['right:12%', y1, 5, 1], ['right:6%', y2, 5.6, 1.2]].map(([side, y, w, d]) => `
      <img class="el swing" style="${side};top:${at(y, H)};width:${w}%;--d:${d}s" src="assets/el/bell.webp" alt=""${lazy ? ' loading="lazy"' : ''}>`).join('');
const P4BELLS = `<img class="el swing" style="left:12%;top:${at(15, 177.68)};width:5.5%;--d:.5s" src="assets/el/bell.webp" alt="" loading="lazy">
      <img class="el swing" style="right:11%;top:${at(20, 177.68)};width:5.5%;--d:.6s" src="assets/el/bell.webp" alt="" loading="lazy">`;

/* the calendar: one file with the three events (start only — no end time was supplied, none is invented), and one
   Google Calendar link per event (it needs an end, so the entry starts and ends at the same minute) */
const icsText = (t) => String(t).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
const fold = (l) => { const out = []; let s = l; while (Buffer.byteLength(s) > 73) { let n = 73; while (Buffer.byteLength(s.slice(0, n)) > 73) n--; out.push(s.slice(0, n)); s = ' ' + s.slice(n); } out.push(s); return out.join('\r\n'); };
const calTitle = (e) => `${e.name} — Bhumika & Siddhant`;
const calDetails = (e) => `Wednesday, 2nd December 2026 · ${e.time}\nVenue: ${VENUE.full}\nMap: ${VENUE.mapsUrl}\n\n${URL_}`;
const ICS = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Bhumika & Siddhant Wedding//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
  ...DAY.flatMap((e) => ['BEGIN:VEVENT', `UID:${SLUG}-${e.id}@invitivals.com`, 'DTSTAMP:20261118T000000Z', `DTSTART;TZID=Asia/Kolkata:${e.start}`,
    `SUMMARY:${icsText(calTitle(e))}`, `LOCATION:${icsText(VENUE.full)}`, `DESCRIPTION:${icsText(calDetails(e))}`, `URL:${URL_}`, 'END:VEVENT']),
  'END:VCALENDAR', ''].map(fold).join('\r\n');
const gcal = (e) => esc('https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: calTitle(e), dates: `${e.start}/${e.start}`, ctz: 'Asia/Kolkata', location: VENUE.full, details: calDetails(e) }).toString());

const TITLE = 'Bhumika & Siddhant | Wedding Invitation', OGD = 'With the blessings of Lord Mahavir, we invite you to celebrate the wedding of Bhumika & Siddhant on 2nd December 2026.';
const html = `<!DOCTYPE html>
<!-- written by tools/bhumika-siddhant-wedding.mjs — edit the tool, not this file -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${esc(TITLE)}</title>
<meta name="description" content="${esc(OGD)} Vedanta Farm (Jashn – The Roman Palace), Ghaziabad.">
<meta name="author" content="Invitivals">
<meta name="theme-color" content="#eacfb3">
<link rel="canonical" href="${URL_}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Invitivals">
<meta property="og:locale" content="en_IN">
<meta property="og:url" content="${URL_}">
<meta property="og:title" content="${esc(TITLE)}">
<meta property="og:description" content="${esc(OGD)}">
<meta property="og:image" content="${URL_}assets/${COVER}">
<meta property="og:image:secure_url" content="${URL_}assets/${COVER}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Bhumika &amp; Siddhant · Wedding Invitation · 2nd December 2026">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(TITLE)}">
<meta name="twitter:description" content="${esc(OGD)}">
<meta name="twitter:image" content="${URL_}assets/${COVER}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" as="image" href="assets/bg/opening-bs.webp" fetchpriority="high">
<link rel="modulepreload" href="js/app.js?v=${V}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Playfair+Display:ital,wght@1,500&family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Noto+Serif+Devanagari:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/invite.css?v=${V}">
</head>
<body class="is-closed">

<!-- opening: the sealed envelope (the couple's B S on its wax seal); one tap plays the film, which fades into the first page -->
<div class="opening" id="opening">
  <img class="opening__art" src="assets/bg/opening-bs.webp" alt="A sealed cream envelope with the couple's gold B and S on its wax seal" width="941" height="1672" decoding="async" fetchpriority="high">
  <video class="opening__film" id="film" playsinline webkit-playsinline muted preload="auto" src="assets/media/opening-bs-v2.mp4" aria-hidden="true"></video>
  <button class="tap" id="tap" type="button"><span class="tap__ring" aria-hidden="true"></span><span>Tap to Open</span></button>
</div>

<audio id="music" loop preload="none"></audio>
<button class="mute" id="mute" type="button" aria-pressed="false" aria-label="Pause music" hidden>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path class="mute__note" d="M9 18.5a2.5 2.5 0 1 1-2-2.45V6l10-2v11.5a2.5 2.5 0 1 1-2-2.45V7.4l-6 1.2z"/><path class="mute__bar" d="M4 4l16 16"/></svg>
</button>
<canvas class="petals" id="petals" aria-hidden="true"></canvas>

<main class="stage" id="stage" aria-label="Wedding invitation of Bhumika and Siddhant">

  <!-- 1 · the Jain opening: Lord Mahavir (the client's own picture), the salutation and the two lines, exactly as supplied -->
  <section class="page page--1" id="p1">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" decoding="async">${bells(5.5, 11.5, false)}
      <div class="flow" style="--top:15;--side:8;--bottom:2">
        <img class="mahavir pop" style="--d:.2s" src="assets/el/mahavir.webp" alt="Lord Mahavir seated in meditation beneath a tree, a jewelled canopy and a halo of light above him" width="900" height="1290" decoding="async">
        <p class="namah rise" lang="hi" style="--d:.5s">!! श्री महावीराय नमः !!</p>
        ${GARLAND(20, '.6s', 'margin:calc(var(--cq) * 1) auto 0;')}
        <p class="shloka mangal rise" lang="hi" style="--d:.7s">${MANGAL.map((l) => `<span>${l}</span>`).join('')}</p>
        <button class="cue rise" id="cue" type="button" style="--d:1.2s" aria-label="Scroll down to the rest of the invitation">Scroll to explore<svg viewBox="0 0 22 20" aria-hidden="true"><path d="M4 3l7 6 7-6"/><path d="M4 10l7 6 7-6"/></svg></button>
      </div>
    </div>
  </section>

  <!-- 2 · the invitation: the Jain emblem, the card's opening line, Bhumika weds Siddhant, the day -->
  <section class="page" id="p-invite">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      ${TASSELS}
      <div class="flow" style="--top:27;--side:15">
        ${JAIN(12, '.1s')}
        <p class="destiny gap-m rise" style="--d:.2s">Destiny brought them together &amp; now Love will seal their bond forever.</p>
        ${GARLAND(18, '.3s', 'margin:calc(var(--cq) * 2.4) auto calc(var(--cq) * 2);')}
        <h1 class="couple-names">
          <span class="script script--xl nm rise" style="--d:.4s">Bhumika</span>
          <span class="amp rise" style="--d:.55s"><span class="amp__line" aria-hidden="true"></span><span class="amp__and weds">weds</span><span class="amp__line" aria-hidden="true"></span></span>
          <span class="script script--xl nm rise" style="--d:.7s">Siddhant</span>
        </h1>
        ${GARLAND(18, '.8s', 'margin:calc(var(--cq) * 2.4) auto calc(var(--cq) * 2.4);')}
        <p class="datebar rise" style="--d:.9s">Wednesday<small>2nd December 2026</small></p>
        ${MONO(22, 'pop', '1s')}
      </div>
    </div>
  </section>

  <!-- 3 · Save the Date (client, 19 Nov): the design's gold-foil scratch card; underneath, the day. Scratch with a finger or the mouse -->
  <section class="page" id="p-save">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      ${TASSELS}
      <div class="flow" style="--top:33;--side:14">
        <h2 class="script script--lg rise">Save the Date</h2>
        <div class="scard rise" id="scard" style="--d:.3s">
          <div class="scard__face" id="scardFace">
            <p class="scard__kicker">Our Wedding</p>
            <p class="scard__day">Wednesday</p>
            <p class="scard__num scard__num--one">2</p>
            <p class="scard__month">December <span>2026</span></p>
            <img class="scard__orn" src="assets/el/garland.webp" alt="" loading="lazy">
            <p class="scard__place">Ghaziabad</p>
          </div>
          <canvas class="scard__foil" id="foil" role="button" tabindex="0" aria-label="Scratch card: rub it with your finger or the mouse to reveal our wedding date. Press Enter to reveal." aria-describedby="scardNote"></canvas>
          <span class="scard__hint" id="scardHint" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 11.2V5.5a1.5 1.5 0 0 1 3 0v4.7l.1-1.2a1.5 1.5 0 0 1 3 .1v1.3a1.5 1.5 0 0 1 3 .2V12a1.5 1.5 0 0 1 2.9.3v3.4c0 3.5-2.6 6.3-6.2 6.3h-1.3c-2 0-3.4-.8-4.7-2.4L5.7 15.6a1.6 1.6 0 0 1 2.3-2.2z"/></svg></span>
          <p class="sr-only" id="scardNote" aria-live="polite">Scratch the card to reveal the date.</p>
        </div>
        <button class="maps cal-btn rise" type="button" style="--d:.4s" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true">${CALPATH}</svg><span>Add to Calendar</span></button>
      </div>
    </div>
  </section>

  <!-- 4 · Our Families: the card's own words in the card's own order -->
  <section class="page" id="p-fam">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">${bells(5.5, 11.5, true)}
      <div class="flow" style="--top:24;--side:10">
        <h2 class="script script--lg rise">Our Families</h2>
        ${GARLAND(18, '.1s')}
        <div class="fam gap-m rise" style="--d:.15s">
          <p class="fam__l">The Bride</p>
          <h3 class="fam__n fam__n--sm nm">Bhumika</h3>
          <p class="fam__k">Granddaughter of</p>
          <p class="fam__g">Late Smt. Sneh Lata Jain &amp;<br>Late Shri Mam Chand Jain</p>
          <p class="fam__k">Daughter of</p>
          <p class="fam__p"><span>Smt. Poonam Jain and</span><span>Shri Sanjay Jain</span></p>
        </div>
        <p class="para para--invite rise" style="--d:.1s">We solicit your gracious presence and blessings on the auspicious occasion of the wedding ceremony of their loving daughter.</p>
        <p class="with rise" style="--d:.1s">WEDS</p>
        <div class="fam rise" style="--d:.15s">
          <p class="fam__l">The Groom</p>
          <h3 class="fam__n fam__n--sm nm">Siddhant</h3>
          <p class="fam__k">Son of</p>
          <p class="fam__p"><span>Mrs. Ruby Jain and</span><span>Mr. Pawan Kumar Jain</span></p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4 · the couple's own photograph, whole -->
  <section class="page" id="p-photo">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p4.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      ${P4BELLS}
      <div class="flow" style="--top:27;--side:14">
        <h2 class="script script--md script--pair nm rise">Bhumika <span>&amp;</span> Siddhant</h2>
        ${GARLAND(18, '.15s')}
        <figure class="frame frame--couple pop" style="--d:.3s"><img src="assets/el/couple.webp" alt="Bhumika and Siddhant smiling at each other before a round wall of roses, she in an ivory embroidered lehenga, he in a navy suit" width="1000" height="1333" loading="lazy" decoding="async"></figure>
      </div>
    </div>
  </section>

  <!-- 5 · The Wedding Day: the three events with their times, and Add to Calendar -->
  <section class="page" id="p-day">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      ${TASSELS}
      <div class="flow" style="--top:31;--side:14">
        <h2 class="script script--md rise">The Wedding Day</h2>
        <p class="datebar gap-m rise" style="--d:.15s">Wednesday<small>2nd December 2026</small></p>
        <ol class="tl">${DAY.map((e, i) => `
          <li class="rise" style="--d:${(.15 + i * .15).toFixed(2)}s"><span class="medal" aria-hidden="true"><svg viewBox="0 0 48 48">${ICON[e.icon]}</svg></span>
            <div><h3 class="ev__name">${esc(e.name)}</h3><p class="ev__time">${esc(e.time)}</p></div></li>`).join('')}
        </ol>
        <button class="maps cal-btn rise" id="calBtn" type="button" style="--d:.4s" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true">${CALPATH}</svg><span>Add to Calendar</span></button>
      </div>
    </div>
  </section>

  <!-- 6 · the venue: the name and address exactly as on the card, and the map -->
  <section class="page" id="p-venue">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p4.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      ${P4BELLS}
      <div class="flow" style="--top:30;--side:13">
        <h2 class="script script--lg rise">Wedding Venue</h2>
        ${GARLAND(18, '.1s')}
        <span class="medal medal--lg pop" style="--d:.15s" aria-hidden="true"><svg viewBox="0 0 24 24">${PINPATH}</svg></span>
        <p class="venue venue--caps gap-m rise" style="--d:.2s">${esc(VENUE.name)}</p>
        <p class="venue-sub rise" style="--d:.25s">${esc(VENUE.sub)}</p>
        <p class="addr rise" style="--d:.3s">${VENUE.lines.map((l) => `<span>${esc(l)}</span>`).join('')}</p>
        <a class="maps maps--wide rise" data-maps="venue" target="_blank" rel="noopener" style="--d:.35s"><svg viewBox="0 0 24 24" aria-hidden="true">${PINPATH}</svg><span>View on Google Maps</span></a>
      </div>
    </div>
  </section>

  <!-- 7 · the countdown to the Reception of Barat (2 December 2026, 12:00 PM IST), worked out live -->
  <section class="page" id="p-countdown">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">${bells(5.5, 11.5, true)}
      <div class="flow" style="--top:26;--side:14">
        <p class="caps caps--sm rise">Counting down to</p>
        <h2 class="script script--lg gap-s rise" style="--d:.1s">Our Big Day</h2>
        ${GARLAND(18, '.2s')}
        <div class="cd rise" id="countdown" data-target="${COUNTDOWN}" style="--d:.3s" role="timer" aria-live="off">
          <div class="cd__u"><b data-cd="d">--</b><span>Days</span></div>
          <div class="cd__u"><b data-cd="h">--</b><span>Hours</span></div>
          <div class="cd__u"><b data-cd="m">--</b><span>Minutes</span></div>
          <div class="cd__u"><b data-cd="s">--</b><span>Seconds</span></div>
        </div>
        <p class="script script--md cd__done" id="cdDone" hidden>The Big Day Is Here!</p>
        <p class="datebar gap-m rise" style="--d:.4s">Wednesday · 2nd December 2026<small>12:00 PM</small></p>
      </div>
    </div>
  </section>

  <!-- 8 · R.S.V.P. (second-last): the four names of the card; no telephone numbers were supplied -->
  <section class="page" id="p-rsvp">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      ${TASSELS}
      <div class="flow" style="--top:33;--side:14">
        <h2 class="script script--lg rise">R.S.V.P.</h2>
        ${GARLAND(18, '.1s')}
        <ul class="rsvp">${RSVP.map((n, i) => `
          <li class="rise" style="--d:${(.15 + i * .1).toFixed(2)}s">${esc(n)}</li>`).join('')}
        </ul>
      </div>
    </div>
  </section>

  <!-- 9 · the last page: With Best Compliments From, the ten names, and the children's own line in the painted arch -->
  <section class="page page--end" id="p-end">
    <div class="art" style="--h:150">
      <img class="bg" src="assets/bg/p6.webp" alt="" width="1024" height="1536" loading="lazy" decoding="async">
      <img class="el glide" style="left:5%;top:13%;width:12%;--d:.4s" src="assets/el/bird.webp" alt="" loading="lazy">
      <div class="flow" style="--top:4;--side:17;--bottom:0">
        <h2 class="script script--end rise">With Best<br>Compliments From:</h2>
        ${GARLAND(16, '.2s', 'margin:calc(var(--cq) * .8) auto 0;')}
        <ul class="comp rise" style="--d:.3s">${COMPLIMENTS.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
      </div>
      <div class="arch-words"><p class="mausi rise" lang="hi" style="--d:.3s"><span>हमारी मौसी की शादी में</span><span>जरूर जरूर आना।।</span></p><p class="kids rise" style="--d:.45s">Gunika, Nishtha</p></div>
      <p class="credit">Created by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=${SLUG}" target="_blank" rel="noopener">Invitivals</a></p>
    </div>
  </section>
</main>

<div class="sheet" id="sheet" hidden>
  <div class="sheet__veil" data-close></div>
  <div class="sheet__card" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
    <p class="sheet__kicker">Wednesday · 2nd December 2026</p>
    <h2 class="sheet__title" id="sheetTitle">Save the Date</h2>
    <a class="sheet__btn sheet__btn--primary" href="event.ics" download="bhumika-siddhant-wedding.ics"><svg viewBox="0 0 24 24" aria-hidden="true">${CALPATH}</svg>Apple / Outlook calendar (.ics)</a>
    <p class="sheet__note">Google Calendar</p>${DAY.map((e) => `
    <a class="sheet__btn" data-gcal="${e.id}" href="${gcal(e)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5v5.4l3.6 2.1-.8 1.3L11 13V7z"/></svg>${esc(e.name)} · ${esc(e.time)}</a>`).join('')}
    <button class="sheet__close" type="button" data-close>Close</button>
  </div>
</div>
<noscript><p style="padding:40px 24px;text-align:center;font-family:Georgia,serif;color:#5a3a30">Please enable JavaScript to open this invitation.</p></noscript>
<script type="module" src="js/app.js?v=${V}"></script>
</body>
</html>
`;
const config = `/* written by tools/bhumika-siddhant-wedding.mjs — edit the tool, not this file.
   Bhumika & Siddhant, the wedding. The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: '${SLUG}',
  /* the song of the design the client chose; null = no music and no music button */
  music: 'assets/media/music.mp3',
  /* no map link was supplied: a Google Maps search for the venue's name and address, exactly as on the card */
  venues: ${JSON.stringify({ venue: { name: VENUE.name, address: VENUE.full, mapsUrl: VENUE.mapsUrl } }, null, 2).replace(/\n/g, '\n  ')},
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
`;
fs.writeFileSync(path.join(D, 'index.html'), html);
fs.writeFileSync(path.join(D, 'config.js'), config);
fs.writeFileSync(path.join(D, 'event.ics'), ICS);
console.log('✓', SLUG);
