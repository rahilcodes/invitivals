#!/usr/bin/env node
/* Archika & Sandeep — FOUR separate invitations for one wedding (client brief 2026-11-26), all on the design the client
   chose: the Lokesh & Akansha page (public/lokesh-akansha-wedding), which is only ever READ here, never written.

     /archika-sandeep-save-the-date/            Save the Date: the couple, both families, 18 January 2027
     /archika-sandeep-wedding/                  the wedding only: Jai Mala 8:00 PM, Dinner 8:30 PM onwards
     /archika-sandeep-wedding-celebrations/     17 Jan: Bhaat, Drinks Dance & Dinner · 18 Jan: Baraat Swagat, Phere, Jai Mala, Dinner
     /archika-sandeep-complete-celebrations/    the same with Haldi and Mehndi first on 17 Jan (all eight)

   Build (in this order):
     node tools/archika-sandeep.mjs init          papers, ornaments, stylesheet, page script, song, Mukut Regency photo (all four)
     SLUG=archika-sandeep-complete-celebrations MARK=as node tools/saicharan-lakshmi-cl.mjs        the envelope's seal + el/as-logo.webp
     SLUG=archika-sandeep-complete-celebrations MARK=as FFMPEG=… node tools/saicharan-lakshmi-film.mjs   then cut -t 4.0 → opening-as-v2.mp4
     node tools/archika-sandeep.mjs media         copies the seal still, monogram and film to the other three
     node tools/archika-sandeep.mjs               index.html, config.js, assets/cal/*.ics of all four (after every change of words)
     node tools/archika-sandeep.mjs covers        the four link-preview pictures (headless Chrome)

   The client's pictures (invites/src/archika-sandeep/): as-monogram-original.jpg (the gold AS monogram on black — no
   transparency came with it, so the black is keyed out by the seal tool from invites/src/saicharan-lakshmi-engagement/
   as-logo.jpg, a copy; the monogram itself is never redrawn) and mukut-regency.jpg (the venue at night, shown whole).
   No RSVP anywhere. Only start times were supplied: no calendar entry carries an invented end. Every name and detail is
   exactly as the client typed it (the bride first). */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const REF = path.join(ROOT, 'public/lokesh-akansha-wedding'), SRC = path.join(ROOT, 'invites/src/archika-sandeep');
const V = 1;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ── the wedding ─────────────────────────────────────────────── */
const VENUE = { name: 'Hotel Mukut Regency', addr: 'Vasundhra Sector 13, Ghaziabad',
  /* the family's link, exactly as supplied. Checked 2026-11-26: it opens Google's page for "Hotel Mukut Regency –
     Banquet Hall & Wedding Venue", 1, Sector 13, Vasundhara, Ghaziabad (28.6547, 77.3633) — a Google Hotels page
     with the place on its map, not a bare Maps pin. Used as supplied; nothing substituted. */
  mapsUrl: 'https://www.google.com/travel/hotels/s/8nWmmRPHJeWCmbm36' };
VENUE.full = `${VENUE.name}, ${VENUE.addr}`;
const D17 = { key: 'd17', weekday: 'Sunday', date: '17 January 2027', ymd: '20270117' };
const D18 = { key: 'd18', weekday: 'Monday', date: '18 January 2027', ymd: '20270118' };
const EV = {
  haldi:   { id: 'haldi', name: 'Haldi', time: '10:00 AM', start: '20270117T100000', day: D17, icon: 'haldi' },
  mehndi:  { id: 'mehndi', name: 'Mehndi', time: '11:30 AM', start: '20270117T113000', day: D17, icon: 'mehndi' },
  bhaat:   { id: 'bhaat', name: 'Bhaat', time: '5:00 PM onwards', start: '20270117T170000', day: D17, icon: 'kalash' },
  ddd:     { id: 'drinks-dance-dinner', name: 'Drinks, Dance & Dinner', time: '7:00 PM onwards', start: '20270117T190000', day: D17, icon: 'cheers' },
  baraat:  { id: 'baraat-swagat', name: 'Baraat Swagat', time: '4:00 PM', start: '20270118T160000', day: D18, icon: 'dhol' },
  phere:   { id: 'phere', name: 'Phere', time: '5:00 PM', start: '20270118T170000', day: D18, icon: 'fire' },
  jaimala: { id: 'jai-mala', name: 'Jai Mala', time: '8:00 PM', start: '20270118T200000', day: D18, icon: 'varmala' },
  dinner:  { id: 'dinner', name: 'Dinner', time: '8:30 PM onwards', start: '20270118T203000', day: D18, icon: 'dinner' },
};
const FAM = {
  bride: { name: 'Archika', grand: 'Lt Smt Pushplata and Lt Shri Jai Bhagwan Goel', parents: 'Smt Parul and Shri Yogesh Goel' },
  groom: { name: 'Sandeep', parents: 'Smt Urmila and Shri Sunder Lal Bhatt' },
};

/* the four links */
const VARIANTS = {
  'archika-sandeep-save-the-date': {
    kind: 'save', cover: 'cover-archika-sandeep-save-the-date.jpg', events: [],
    title: 'Save the Date · Archika & Sandeep', label: 'Save the Date',
    ogd: 'Save the Date for the wedding of Archika & Sandeep · Monday, 18 January 2027.',
  },
  'archika-sandeep-wedding': {
    kind: 'wedding', cover: 'cover-archika-sandeep-wedding.jpg', events: ['jaimala', 'dinner'],
    title: 'Archika & Sandeep | Wedding Invitation', label: 'Wedding Invitation',
    ogd: 'The wedding of Archika & Sandeep · Monday, 18 January 2027 · Jai Mala 8:00 PM, Dinner 8:30 PM onwards · Hotel Mukut Regency, Ghaziabad.',
    countdown: { at: '2027-01-18T20:00:00+05:30', label: 'Jai Mala · 8:00 PM', small: 'Monday, 18 January 2027' },
  },
  'archika-sandeep-wedding-celebrations': {
    kind: 'days', cover: 'cover-archika-sandeep-wedding-celebrations.jpg', events: ['bhaat', 'ddd', 'baraat', 'phere', 'jaimala', 'dinner'],
    title: 'Archika & Sandeep | Wedding Celebrations', label: 'Wedding Celebrations',
    ogd: 'The wedding celebrations of Archika & Sandeep · 17 – 18 January 2027 · Bhaat, Drinks Dance & Dinner, Baraat Swagat, Phere, Jai Mala and Dinner · Hotel Mukut Regency, Ghaziabad.',
    countdown: { at: '2027-01-18T17:00:00+05:30', label: 'The Phere · 5:00 PM', small: 'Monday, 18 January 2027' },
  },
  'archika-sandeep-complete-celebrations': {
    kind: 'days', cover: 'cover-archika-sandeep-complete-celebrations.jpg', events: ['haldi', 'mehndi', 'bhaat', 'ddd', 'baraat', 'phere', 'jaimala', 'dinner'],
    title: 'Archika & Sandeep | Wedding Celebrations', label: 'Complete Wedding Celebrations',
    ogd: 'All the wedding celebrations of Archika & Sandeep · 17 – 18 January 2027 · from Haldi and Mehndi to the Phere, Jai Mala and Dinner · Hotel Mukut Regency, Ghaziabad.',
    countdown: { at: '2027-01-18T17:00:00+05:30', label: 'The Phere · 5:00 PM', small: 'Monday, 18 January 2027' },
  },
};
const SLUGS = Object.keys(VARIANTS);

const CSS = `

/* ═════════ Archika & Sandeep: the four links' own pieces (tools/archika-sandeep.mjs) ═════════ */
/* the couple's AS monogram, the client's own artwork keyed off its black: by itself, its own glow on the paper */
.mono { display: block; flex: none; width: calc(var(--cq) * var(--w, 28)); height: auto; margin: calc(var(--cq) * 2.4) auto calc(var(--cq) * 1);
  filter: drop-shadow(0 calc(var(--cq) * .8) calc(var(--cq) * 1.3) rgba(96, 58, 12, .32)); }
.kicker-script { font-family: var(--script); color: var(--gold); font-size: calc(var(--cq) * 9); line-height: 1.1; }
/* the families: the bride's first, then the groom's */
.fam__p span, .fam__g span { display: block; }
.fam-weds { margin: calc(var(--cq) * 3.4) 0; display: flex; align-items: center; gap: calc(var(--cq) * 2.4); width: calc(var(--cq) * 44); font-family: var(--caps); font-weight: 600; color: var(--gold); font-size: calc(var(--cq) * 3.3); letter-spacing: .3em; padding-left: .3em; }
.fam-weds::before, .fam-weds::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, transparent, var(--gold), transparent); }
/* one day: the events in the design's timeline, each with its time; "onwards" is the family's own word */
.ev__time small { font-style: italic; font-weight: 500; }
/* the venue: the client's photograph of Mukut Regency, whole (4 : 3), in the design's gold frame */
.venue-frame.venue-frame--photo { aspect-ratio: 1448 / 1086; width: calc(var(--cq) * 72); border-radius: calc(var(--cq) * 3); }   /* no arched top: nothing of the building or its rooftop sign is cut */
.venue-frame.venue-frame--photo img { object-fit: cover; object-position: 50% 50%; }
.venue--caps { text-transform: uppercase; letter-spacing: .07em; }
.maps--wide { padding: 0 calc(var(--cq) * 5); letter-spacing: .14em; }
.venue-chip { display: inline-flex; align-items: center; gap: calc(var(--cq) * 1.6); margin-top: calc(var(--cq) * 2.6); font-family: var(--serif); font-weight: 700; font-size: calc(var(--cq) * 3.8); color: var(--maroon); }
.venue-chip svg { width: calc(var(--cq) * 4.4); height: calc(var(--cq) * 4.4); fill: var(--gold); flex: none; }
.cal-btn { margin-top: calc(var(--cq) * 4); }
/* the calendar sheet: every event its own two choices */
.sheet__card { max-height: calc(100dvh - 24px); overflow: auto; }
.sheet__day { margin: 14px 0 4px; text-align: center; font: 600 12px/1.4 var(--caps); letter-spacing: .18em; text-transform: uppercase; color: var(--gold); }
.sheet__row { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 8px; padding: 10px 2px; border-top: 1px solid rgba(160, 110, 40, .22); }
.sheet__row:first-of-type { border-top: 0; }
.sheet__ev { font-family: var(--serif); font-weight: 700; font-size: 17px; line-height: 1.2; color: var(--maroon); text-align: left; }
.sheet__ev small { display: block; font-weight: 600; font-size: 14px; color: var(--ink); }
.sheet__pill { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; padding: 8px 12px; border-radius: 999px; text-decoration: none; font: 600 12px/1 var(--caps); letter-spacing: .08em; white-space: nowrap; }
.sheet__pill--g { background: linear-gradient(#80203b, var(--maroon-deep)); color: #f8e9c9; }
.sheet__pill--f { background: #f6e6c6; color: var(--maroon); box-shadow: inset 0 0 0 1px rgba(160, 110, 40, .55); }
.sheet__pill:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
.sheet__hint { margin: 10px 0 0; text-align: center; font-family: var(--serif); font-style: italic; font-size: 14px; color: var(--soft); }
@media (max-width: 360px) { .sheet__pill { padding: 8px 9px; font-size: 11px; } .sheet__ev { font-size: 16px; } }
/* the last page: "Thank You" in the painted arch */
.thanks { font-family: var(--script); color: var(--maroon); font-size: calc(var(--cq) * 10.4); line-height: 1.1; white-space: nowrap; }
`;

/* ── init: the four folders from the reference ─────────────── */
if (process.argv[2] === 'init') {
  const { default: sharp } = await import('sharp');
  for (const slug of SLUGS) {
    const D = path.join(ROOT, 'public', slug);
    for (const d of ['assets/bg', 'assets/el', 'assets/media', 'assets/cal', 'css', 'js']) fs.mkdirSync(path.join(D, d), { recursive: true });
    for (const f of ['bg/p1', 'bg/p2', 'bg/p4', 'bg/p6', 'el/bell', 'el/bell2', 'el/garland', 'el/bird', 'el/tasselA', 'el/tasselB', 'el/ganesha'])
      fs.copyFileSync(path.join(REF, `assets/${f}.webp`), path.join(D, `assets/${f}.webp`));
    for (const f of ['favicon.svg', 'assets/media/music.mp3']) fs.copyFileSync(path.join(REF, f), path.join(D, f));
    fs.writeFileSync(path.join(D, '.htaccess'), fs.readFileSync(path.join(REF, '.htaccess'), 'utf8').replace(/\r\n/g, '\n').replace('|svg)$"', '|svg|ics)$"') + '<IfModule mod_mime.c>\n  AddType text/calendar .ics\n</IfModule>\n');
    fs.writeFileSync(path.join(D, 'css/invite.css'), fs.readFileSync(path.join(REF, 'css/invite.css'), 'utf8').replace(/\r\n/g, '\n')
      .replace('Lokesh & Akansha — the wedding, groom side (shared by lokesh-akansha-wedding and lokesh-akansha-wedding-day;\n   written by tools/lokesh-akansha-wedding.mjs from this file).', `Archika & Sandeep — ${VARIANTS[slug].label} (set up by tools/archika-sandeep.mjs init; this copy is this page's own).`) + CSS);
    /* the page script: the same opening, music, scroll cue, petals, scratch card and countdown; every "Add to Calendar"
       button opens its own sheet (data-sheet) */
    let js = fs.readFileSync(path.join(REF, 'js/app.js'), 'utf8').replace(/\r\n/g, '\n');
    const sw = (a, b) => { if (js.split(a).length !== 2) throw new Error('app.js: ' + a.slice(0, 50)); js = js.replace(a, () => b); };
    sw('Lokesh & Akansha — the wedding, groom side.', `Archika & Sandeep — ${VARIANTS[slug].label}.`);
    if (VARIANTS[slug].kind !== 'days') sw("'Our special days await'", "'Our special day awaits'");
    sw("const sheet = $('#sheet'), calBtn = $('#calBtn');\nif (sheet && calBtn) {\n  calBtn.addEventListener('click', () => { sheet.hidden = false; sheet.querySelector('a').focus(); });\n  for (const el of sheet.querySelectorAll('[data-close]')) el.addEventListener('click', () => { sheet.hidden = true; calBtn.focus(); });\n  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) { sheet.hidden = true; calBtn.focus(); } });",
      "/* every button names its own sheet (data-sheet): one day's events, or all of them */\nlet calBtn = null;\nconst closeSheets = () => { for (const s of document.querySelectorAll('.sheet')) s.hidden = true; if (calBtn) calBtn.focus(); };\nfor (const b of document.querySelectorAll('.cal-btn[data-sheet]')) b.addEventListener('click', () => { const s = document.getElementById(b.dataset.sheet); if (!s) return; calBtn = b; s.hidden = false; s.querySelector('a').focus(); });\nfor (const el of document.querySelectorAll('.sheet [data-close]')) el.addEventListener('click', closeSheets);\ndocument.addEventListener('keydown', (e) => { if (e.key === 'Escape' && [...document.querySelectorAll('.sheet')].some((s) => !s.hidden)) closeSheets(); });\n{");
    sw("'../config.js?v=3'", `'../config.js?v=${V}'`);
    sw("'assets/el/la-logo.webp'", "'assets/el/as-logo.webp'");
    fs.writeFileSync(path.join(D, 'js/app.js'), js);
    /* the venue: the client's photograph, whole, only resized (4 : 3) */
    await sharp(path.join(SRC, 'mukut-regency.jpg')).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 86, effort: 6 }).toFile(path.join(D, 'assets/el/mukut-regency.webp'));
  }
  console.log('✓ init', SLUGS.join(', '));
  process.exit(0);
}

/* ── media: the seal still, the keyed monogram and the film, made once, copied to all four ── */
if (process.argv[2] === 'media') {
  const A = path.join(ROOT, 'public/archika-sandeep-complete-celebrations/assets');
  for (const slug of SLUGS.filter((s) => s !== 'archika-sandeep-complete-celebrations'))
    for (const f of ['bg/opening-as.webp', 'el/as-logo.webp', 'media/opening-as-v2.mp4']) fs.copyFileSync(path.join(A, f), path.join(ROOT, 'public', slug, 'assets', f));
  console.log('✓ media copied to', SLUGS.length - 1, 'links');
  process.exit(0);
}

/* ── covers: one 1200×630 picture per link, from tools/archika-sandeep-og.html (headless Chrome) ── */
if (process.argv[2] === 'covers') {
  const CH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  for (const [slug, v] of Object.entries(VARIANTS)) {
    const out = path.join(ROOT, 'public', slug, 'assets', v.cover.replace('.jpg', '.png'));
    const url = 'file:///' + path.join(ROOT, 'tools/archika-sandeep-og.html').replace(/\\/g, '/') + `?v=${slug}`;
    await new Promise((ok, no) => { const p = spawn(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', `--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(), 'og-'))}`, '--window-size=1200,630', '--virtual-time-budget=6000', `--screenshot=${out}`, url], { stdio: 'ignore' }); p.on('exit', (c) => (c === 0 ? ok() : no(new Error('chrome ' + c)))); });
    const { default: sharp } = await import('sharp');
    await sharp(out).jpeg({ quality: 86, progressive: true, mozjpeg: true }).toFile(path.join(ROOT, 'public', slug, 'assets', v.cover));
    fs.rmSync(out);
    console.log('✓ cover', slug);
  }
  process.exit(0);
}

/* ── the pages ───────────────────────────────────────────────── */
const ICON = {
  haldi: '<path d="M8 26h32c0 8-7 14-16 14S8 34 8 26z"/><path d="M13 26c1-5 5-8 11-8s10 3 11 8"/><path d="M30 18l9-10"/><circle cx="18" cy="23" r=".8"/><circle cx="25" cy="21" r=".8"/><circle cx="29" cy="24" r=".8"/><path d="M18 40l-2 4h16l-2-4"/>',
  mehndi: '<path d="M17 42V24c0-2 3-2 3 0v-11c0-2 3-2 3 0v10-13c0-2 3-2 3 0v13-10c0-2 3-2 3 0v13-5c0-2 3-2 3 0v13c0 6-4 10-9 10s-9-3-9-6z"/><circle cx="25" cy="31" r="3"/><path d="M25 25v3M25 34v3M19 31h3M28 31h3"/>',
  /* a kalash with mango leaves and a coconut: the gifts of the Bhaat */
  kalash: '<path d="M15 21h18"/><path d="M17 21c-6 4-8 10-6 15 2 5 7 7 13 7s11-2 13-7c2-5 0-11-6-15"/><path d="M14 31h20"/><path d="M19 21c-1-3-4-5-7-5 2 3 4 4 7 5M29 21c1-3 4-5 7-5-2 3-4 4-7 5M24 21v-4"/><circle cx="24" cy="12" r="5"/>',
  /* two raised glasses */
  cheers: '<path d="M10 9h11l-1.5 10a4 4 0 0 1-8 0z"/><path d="M27 9h11l-1.5 10a4 4 0 0 1-8 0z"/><path d="M15.500 23v13M32.500 23v13M10 36h11M27 36h11"/><path d="M22 6l2-3 2 3"/><path d="M12 13h7M29 13h7"/>',
  dhol: '<path d="M10 18c-2 0-3 3-3 6s1 6 3 6M38 18c2 0 3 3 3 6s-1 6-3 6"/><path d="M10 18c6-3 22-3 28 0M10 30c6 3 22 3 28 0"/><path d="M10 18v12M38 18v12M17 17v14M24 16.500v15M31 17v14"/><path d="M16 12l3-4M30 12l-3-4"/>',
  fire: '<path d="M8 40h32M11 40v-6h26v6"/><path d="M14 34v-4h20v4"/><path d="M24 29c-6-3-6-9-1-14 0 4 2 5 3 6 1-3 0-6-1-9 5 3 9 9 4 17"/><path d="M18 29c-2-2-2-5 0-7M30 29c2-2 2-5 0-7"/>',
  /* the varmala: a garland of flowers in a loop */
  varmala: '<path d="M12 8c0 18 5 30 12 30s12-12 12-30"/><circle cx="12.500" cy="16" r="2.400"/><circle cx="14.500" cy="25" r="2.400"/><circle cx="18.500" cy="32.500" r="2.400"/><circle cx="24" cy="38" r="2.800"/><circle cx="29.500" cy="32.500" r="2.400"/><circle cx="33.500" cy="25" r="2.400"/><circle cx="35.500" cy="16" r="2.400"/><path d="M24 41v4"/>',
  dinner: '<path d="M6 36h36"/><path d="M9 36c0-9 6.500-15 15-15s15 6 15 15"/><path d="M24 21v-3"/><circle cx="24" cy="16" r="2"/><path d="M12 40h24"/><path d="M16 31c1-3 3-5 6-6"/>',
};
const PIN = '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>';
const CAL = '<path d="M7 2h2v2h6V2h2v2h3v18H4V4h3zm-1 7v11h12V9zm2 2h3v3H8z"/>';
const at = (pct, H) => `calc(var(--cq) * ${(pct * H / 100).toFixed(1)})`;
const GARLAND = (w = 18, d = '.1s', m = '') => `<img class="orn rise" style="width:calc(var(--cq) * ${w});${m}--d:${d}" src="assets/el/garland.webp" alt="" loading="lazy">`;
const MONO = (w, d = '.1s', lazy = true) => `<img class="mono pop" style="--w:${w};--d:${d}" src="assets/el/as-logo.webp" alt="The couple's monogram: the letters A and S in gold, in a ring of laurel with a lotus" width="900" height="900"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
const TASSELS = `<img class="el swing" style="left:5.5%;top:${at(36, 169.29)};width:8%;--d:.6s" src="assets/el/tasselB.webp" alt="" loading="lazy">
      <img class="el swing" style="right:5.5%;top:${at(38, 169.29)};width:7%;--d:.8s" src="assets/el/tasselA.webp" alt="" loading="lazy">`;
const bells = (lazy) => [['left:12%', 5.5, 5, .9], ['left:6%', 11.5, 5.6, 1.1], ['right:12%', 5.5, 5, 1], ['right:6%', 11.5, 5.6, 1.2]].map(([side, y, w, d]) => `
      <img class="el swing" style="${side};top:${at(y, 177.68)};width:${w}%;--d:${d}s" src="assets/el/bell.webp" alt=""${lazy ? ' loading="lazy"' : ''}>`).join('');
const P4BELLS = `<img class="el swing" style="left:12%;top:${at(15, 177.68)};width:5.5%;--d:.5s" src="assets/el/bell.webp" alt="" loading="lazy">
      <img class="el swing" style="right:11%;top:${at(20, 177.68)};width:5.5%;--d:.6s" src="assets/el/bell.webp" alt="" loading="lazy">`;
const timeHtml = (t) => esc(t).replace(/ onwards$/, ' <small>onwards</small>');

/* calendar text */
const icsText = (t) => String(t).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
const fold = (l) => { const out = []; let s = l; while (Buffer.byteLength(s) > 73) { let n = 73; while (Buffer.byteLength(s.slice(0, n)) > 73) n--; out.push(s.slice(0, n)); s = ' ' + s.slice(n); } out.push(s); return out.join('\r\n'); };
const nextDay = (ymd) => new Date(Date.UTC(+ymd.slice(0, 4), +ymd.slice(4, 6) - 1, +ymd.slice(6, 8) + 1)).toISOString().slice(0, 10).replace(/-/g, '');

for (const [SLUG, VAR] of Object.entries(VARIANTS)) {
  const D = path.join(ROOT, 'public', SLUG), URL_ = `https://invitivals.com/${SLUG}/`;
  const events = VAR.events.map((k) => EV[k]);
  const days = [D17, D18].map((d) => ({ ...d, events: events.filter((e) => e.day === d) })).filter((d) => d.events.length);
  /* calendar entries: one per event (start only), or — on the Save the Date — the day itself */
  const entries = VAR.kind === 'save'
    ? [{ id: 'save-the-date', name: 'Wedding of Archika & Sandeep', allDay: D18.ymd, desc: 'Save the Date — the wedding of Archika & Sandeep, Monday 18 January 2027.' }]
    : events.map((e) => ({ id: e.id, name: `${e.name} — Archika & Sandeep`, start: e.start, loc: VENUE.full,
      desc: `${e.day.weekday}, ${e.day.date} · ${e.time}\nThe wedding celebrations of Archika & Sandeep\nVenue: ${VENUE.full}\nMap: ${VENUE.mapsUrl}` }));
  const vevent = (c) => ['BEGIN:VEVENT', `UID:${SLUG}-${c.id}@invitivals.com`, 'DTSTAMP:20261126T000000Z',
    ...(c.allDay ? [`DTSTART;VALUE=DATE:${c.allDay}`, `DTEND;VALUE=DATE:${nextDay(c.allDay)}`] : [`DTSTART;TZID=Asia/Kolkata:${c.start}`]),
    `SUMMARY:${icsText(c.name)}`, ...(c.loc ? [`LOCATION:${icsText(c.loc)}`] : []), `DESCRIPTION:${icsText(`${c.desc}\n\n${URL_}`)}`, `URL:${URL_}`,
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(c.name)}`, 'END:VALARM', 'END:VEVENT'];
  const ics = (list) => ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Archika & Sandeep Wedding//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'X-WR-CALNAME:Archika & Sandeep · Wedding', 'X-WR-TIMEZONE:Asia/Kolkata',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
    ...list.flatMap(vevent), 'END:VCALENDAR', ''].map(fold).join('\r\n');
  const gcal = (c) => esc('https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: c.name,
    dates: c.allDay ? `${c.allDay}/${nextDay(c.allDay)}` : `${c.start}/${c.start}`, ctz: 'Asia/Kolkata', ...(c.loc ? { location: c.loc } : {}), details: `${c.desc}\n\n${URL_}` }).toString());
  fs.mkdirSync(path.join(D, 'assets/cal'), { recursive: true });
  const entryOf = (e) => entries.find((c) => c.id === e.id);
  for (const c of entries) fs.writeFileSync(path.join(D, `assets/cal/${c.id}.ics`), ics([c]));
  fs.writeFileSync(path.join(D, 'assets/cal/all.ics'), ics(entries));
  /* each day's own file, for that day's sheet */
  if (days.length > 1) for (const d of days) fs.writeFileSync(path.join(D, `assets/cal/all-${d.key}.ics`), ics(d.events.map(entryOf)));
  
  /* the sheets: "all" (from Save the Date), and one per day */
  const row = (c, label, time) => `
      <div class="sheet__row"><p class="sheet__ev">${esc(label)}${time ? `<small>${esc(time)}</small>` : ''}</p>
        <a class="sheet__pill sheet__pill--g" href="${gcal(c)}" target="_blank" rel="noopener" data-gcal="${c.id}" aria-label="${esc(label)}: add to Google Calendar">Google</a>
        <a class="sheet__pill sheet__pill--f" href="assets/cal/${c.id}.ics" download="${c.id}.ics" data-ics="${c.id}" aria-label="${esc(label)}: calendar file for Apple Calendar or Outlook">Apple · Outlook</a></div>`;
  const sheet = (id, kicker, list, withAll, file = 'all') => `
<div class="sheet" id="${id}" hidden>
  <div class="sheet__veil" data-close></div>
  <div class="sheet__card" role="dialog" aria-modal="true" aria-labelledby="${id}-t">
    <p class="sheet__kicker">${esc(kicker)}</p>
    <h2 class="sheet__title" id="${id}-t">Add to Calendar</h2>${withAll && list.length > 1 ? `
    <a class="sheet__btn sheet__btn--primary" href="assets/cal/${file}.ics" download="archika-sandeep-${file}.ics"><svg viewBox="0 0 24 24" aria-hidden="true">${CAL}</svg>All ${list.length} events · Apple / Outlook (.ics)</a>` : ''}${list.map((x) => (x.dayHead ? `
    <p class="sheet__day">${esc(x.dayHead)}</p>` : '') + row(x.c, x.label, x.time)).join('')}
    <p class="sheet__hint">Each event is added on its own, at its start time.</p>
    <button class="sheet__close" type="button" data-close>Close</button>
  </div>
</div>`;
  const listOf = (dd) => dd.flatMap((d) => d.events.map((e, i) => ({ c: entryOf(e), label: e.name, time: e.time, dayHead: dd.length > 1 && i === 0 ? `${d.weekday}, ${d.date}` : '' })));
  const SHEETS = VAR.kind === 'save'
    ? sheet('sheet-all', 'Monday · 18 January 2027', [{ c: entries[0], label: 'The Wedding of Archika & Sandeep', time: 'Monday, 18 January 2027 · all day' }], false)
    : sheet('sheet-all', days.length > 1 ? '17 – 18 January 2027 · Ghaziabad' : 'Monday · 18 January 2027 · Ghaziabad', listOf(days), true)
      + (days.length > 1 ? days.map((d) => sheet(`sheet-${d.key}`, `${d.weekday} · ${d.date}`, listOf([d]), true, `all-${d.key}`)).join('') : '');
  const calBtn = (sid, d = '.4s') => `<button class="maps cal-btn rise" type="button" data-sheet="${sid}" style="--d:${d}" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true">${CAL}</svg><span>Add to Calendar</span></button>`;

  const multi = days.length > 1;
  const DATELINE = multi ? ['17 – 18 January 2027', 'Ghaziabad'] : VAR.kind === 'save' ? ['Monday', '18 January 2027'] : ['Monday, 18 January 2027', 'Hotel Mukut Regency, Ghaziabad'];

  const cover = `
  <!-- 1 · the cover: Ganesha, the shloka, the couple's AS monogram, the couple (the bride first) -->
  <section class="page page--1" id="p1">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" decoding="async">${bells(false)}
      <div class="flow" style="--top:13.5;--side:13;--bottom:2">
        <img class="orn drop" style="width:calc(var(--cq) * 11);margin-top:0;--d:.2s" src="assets/el/ganesha.webp" alt="Ganesha">
        <img class="orn rise" style="width:calc(var(--cq) * 22);margin:calc(var(--cq) * 1.6) auto calc(var(--cq) * 1.6);--d:.4s" src="assets/el/garland.webp" alt="">
        <p class="shloka shloka--2 rise" lang="sa" style="--d:.55s"><span>शिवशक्त्यात्मरूपाय दम्पत्योः प्रीतये सदा।</span><span>दाम्पत्यं सफलं भूयात् मङ्गलम् च दिने दिने॥</span></p>
        ${MONO(26, '.7s', false)}
        ${VAR.kind === 'save' ? `<p class="kicker-script rise" style="--d:.85s">Save the Date</p>
        <p class="caps caps--sm rise" style="--d:.9s">for the wedding of</p>` : `<p class="caps caps--sm gap-s rise" style="--d:.85s">The Wedding of</p>`}
        <h1 class="couple-names">
          <span class="script script--xl rise" style="--d:1s">Archika</span>
          <span class="amp rise" style="--d:1.15s" aria-label="and"><span class="amp__line" aria-hidden="true"></span><span class="amp__and" aria-hidden="true">&amp;</span><span class="amp__line" aria-hidden="true"></span></span>
          <span class="script script--xl rise" style="--d:1.3s">Sandeep</span>
        </h1>
        ${GARLAND(18, '1.45s', '')}
        <p class="datebar rise" style="--d:1.6s">${esc(DATELINE[0])}<small>${esc(DATELINE[1])}</small></p>
        <button class="cue rise" id="cue" type="button" style="--d:1.9s" aria-label="Scroll down to the rest of the invitation">Scroll to explore<svg viewBox="0 0 22 20" aria-hidden="true"><path d="M4 3l7 6 7-6"/><path d="M4 10l7 6 7-6"/></svg></button>
      </div>
    </div>
  </section>`;

  const save = `
  <!-- Save the Date: the design's gold-foil scratch card (the AS monogram on the foil); underneath, the date -->
  <section class="page" id="p-save">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      ${TASSELS}
      <div class="flow" style="--top:33;--side:14">
        <h2 class="script script--lg rise">Save the Date</h2>
        <div class="scard rise" id="scard" style="--d:.3s">
          <div class="scard__face" id="scardFace">
            <p class="scard__kicker">Our Wedding</p>
            <p class="scard__day">${multi ? 'Sunday &amp; Monday' : 'Monday'}</p>
            <p class="scard__num">${multi ? '17<span>–</span>18' : '18'}</p>
            <p class="scard__month">January <span>2027</span></p>
            <img class="scard__orn" src="assets/el/garland.webp" alt="" loading="lazy">
            <p class="scard__place">${VAR.kind === 'save' ? 'Archika &amp; Sandeep' : 'Ghaziabad'}</p>
          </div>
          <canvas class="scard__foil" id="foil" role="button" tabindex="0" aria-label="Scratch card: rub it with your finger or the mouse to reveal our wedding ${multi ? 'dates' : 'date'}. Press Enter to reveal." aria-describedby="scardNote"></canvas>
          <span class="scard__hint" id="scardHint" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 11.2V5.5a1.5 1.5 0 0 1 3 0v4.7l.1-1.2a1.5 1.5 0 0 1 3 .1v1.3a1.5 1.5 0 0 1 3 .2V12a1.5 1.5 0 0 1 2.9.3v3.4c0 3.5-2.6 6.3-6.2 6.3h-1.3c-2 0-3.4-.8-4.7-2.4L5.7 15.6a1.6 1.6 0 0 1 2.3-2.2z"/></svg></span>
          <p class="sr-only" id="scardNote" aria-live="polite">Scratch the card to reveal the ${multi ? 'dates' : 'date'}.</p>
        </div>
        ${calBtn('sheet-all')}
      </div>
    </div>
  </section>`;

  const families = `
  <!-- the families: the bride's first, then the groom's, exactly as the family wrote them -->
  <section class="page" id="p-fam">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">${bells(true)}
      <div class="flow" style="--top:24;--side:12">
        <h2 class="script script--lg rise">Our Families</h2>
        ${GARLAND(18, '.15s')}
        <div class="fam rise" style="--d:.25s">
          <p class="fam__l">The Bride</p>
          <h3 class="fam__n">${FAM.bride.name}</h3>
          <p class="fam__k">Granddaughter of</p>
          <p class="fam__g">${esc(FAM.bride.grand).replace(' and ', ' and<br>')}</p>
          <p class="fam__k">Daughter of</p>
          <p class="fam__p">${esc(FAM.bride.parents)}</p>
        </div>
        <p class="fam-weds rise" style="--d:.1s">WEDS</p>
        <div class="fam rise" style="--d:.1s">
          <p class="fam__l">The Groom</p>
          <h3 class="fam__n">${FAM.groom.name}</h3>
          <p class="fam__k">Son of</p>
          <p class="fam__p">${esc(FAM.groom.parents)}</p>
        </div>
      </div>
    </div>
  </section>`;

  const dayPage = (d, i) => {
    const wedding = d.key === D18.key;
    const bg = wedding ? `<img class="bg" src="assets/bg/p4.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      <img class="el swing" style="left:12%;top:${at(15, 177.68)};width:5.5%;--d:.5s" src="assets/el/bell.webp" alt="" loading="lazy">
      <img class="el swing" style="right:11%;top:${at(20, 177.68)};width:5.5%;--d:.6s" src="assets/el/bell.webp" alt="" loading="lazy">
      <img class="el swing" style="left:2.5%;top:${at(57, 177.68)};width:5%;--d:.9s" src="assets/el/bell2.webp" alt="" loading="lazy">
      <img class="el swing" style="right:3%;top:${at(59, 177.68)};width:5%;--d:1s" src="assets/el/bell2.webp" alt="" loading="lazy">`
      : `<img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      ${TASSELS}`;
    const title = VAR.kind === 'wedding' ? 'The Wedding' : wedding ? 'The Wedding Day' : 'Pre-Wedding<br>Celebrations';
    return `
  <!-- ${d.weekday}, ${d.date}: ${d.events.map((e) => e.name).join(', ')} — all at Hotel Mukut Regency -->
  <section class="page" id="p-${d.key}">
    <div class="art art--fit" style="--h:${wedding ? 177.68 : 169.29}">
      ${bg}
      <div class="flow" style="--top:${wedding ? 30 : 31};--side:14">
        <h2 class="script script--${wedding && VAR.kind !== 'wedding' ? 'md' : 'lg'} rise">${title}</h2>
        <p class="datebar gap-m rise" style="--d:.15s">${d.weekday}<small>${d.date}</small></p>
        <ol class="tl">${d.events.map((e, k) => `
          <li class="rise" style="--d:${(.15 + k * .12).toFixed(2)}s"><span class="medal" aria-hidden="true"><svg viewBox="0 0 48 48">${ICON[e.icon]}</svg></span>
            <div><h3 class="ev__name">${esc(e.name)}</h3><p class="ev__time">${timeHtml(e.time)}</p></div></li>`).join('')}
        </ol>
        <p class="venue-chip rise" style="--d:.3s"><svg viewBox="0 0 24 24" aria-hidden="true">${PIN}</svg>Hotel Mukut Regency</p>
        ${calBtn(multi ? `sheet-${d.key}` : 'sheet-all')}
      </div>
    </div>
  </section>`;
  };

  const venue = `
  <!-- the venue: the client's own photograph of Hotel Mukut Regency, whole; the name, the address and the family's link -->
  <section class="page" id="p-venue">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p4.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      ${P4BELLS}
      <div class="flow" style="--top:28;--side:12">
        <h2 class="script script--lg rise">Wedding Venue</h2>
        ${GARLAND(16, '.1s')}
        <div class="venue-frame venue-frame--photo pop" style="--d:.15s"><img src="assets/el/mukut-regency.webp" alt="Hotel Mukut Regency at night, its front lit in violet and strung with fairy lights, the Mukut Regency name on the building and on the lit sign in front" width="1200" height="900" loading="lazy" decoding="async"></div>
        <svg class="pin" viewBox="0 0 24 24" aria-hidden="true">${PIN}</svg>
        <p class="venue venue--caps rise">Hotel Mukut Regency</p>
        <p class="addr rise" style="--d:.15s">${esc(VENUE.addr)}</p>
        ${VAR.kind === 'days' ? `<p class="venue-for rise" style="--d:.2s">for all the celebrations</p>` : ''}
        <a class="maps maps--wide rise" data-maps="venue" target="_blank" rel="noopener" style="--d:.3s"><svg viewBox="0 0 24 24" aria-hidden="true">${PIN}</svg><span>View on Google Maps</span></a>
      </div>
    </div>
  </section>`;

  const cdTarget = VAR.countdown ? VAR.countdown.at : '2027-01-18T00:00:00+05:30';
  const countdown = `
  <!-- the countdown (${cdTarget}), worked out live -->
  <section class="page" id="p-countdown">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">${bells(true)}
      <div class="flow" style="--top:26;--side:14">
        <p class="caps caps--sm rise">Counting down to</p>
        <h2 class="script script--lg gap-s rise" style="--d:.1s">Our Big Day</h2>
        ${GARLAND(18, '.2s')}
        <div class="cd rise" id="countdown" data-target="${cdTarget}" style="--d:.3s" role="timer" aria-live="off">
          <div class="cd__u"><b data-cd="d">--</b><span>Days</span></div>
          <div class="cd__u"><b data-cd="h">--</b><span>Hours</span></div>
          <div class="cd__u"><b data-cd="m">--</b><span>Minutes</span></div>
          <div class="cd__u"><b data-cd="s">--</b><span>Seconds</span></div>
        </div>
        <p class="script script--md cd__done" id="cdDone" hidden>The Big Day Is Here!</p>
        <p class="datebar gap-m rise" style="--d:.4s">${esc(VAR.countdown ? VAR.countdown.label : 'Monday')}<small>${esc(VAR.countdown ? VAR.countdown.small : '18 January 2027')}</small></p>
      </div>
    </div>
  </section>`;

  const end = `
  <!-- the last page: With Love; "Thank You" in the painted arch -->
  <section class="page page--end" id="p-end">
    <div class="art" style="--h:150">
      <img class="bg" src="assets/bg/p6.webp" alt="" width="1024" height="1536" loading="lazy" decoding="async">
      <img class="el glide" style="left:6%;top:12%;width:15%;--d:.4s" src="assets/el/bird.webp" alt="" loading="lazy">
      <div class="flow" style="--top:6;--side:20;--bottom:0">
        <h2 class="script script--xl rise">With Love</h2>
        ${GARLAND(18, '.2s', 'margin:calc(var(--cq) * 1.2) auto calc(var(--cq) * 2);')}
        <p class="message rise" style="--d:.3s">${VAR.kind === 'save' ? 'Kindly save the date and bless Archika &amp; Sandeep as they begin their journey together.' : 'Your gracious presence and blessings will make this joyous occasion truly memorable.'}</p>
      </div>
      <div class="arch-words"><p class="thanks rise" style="--d:.3s">Thank You</p>${GARLAND(13, '.45s', 'margin:calc(var(--cq) * .6) auto 0;')}</div>
      <p class="credit">Created by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=${SLUG}" target="_blank" rel="noopener">Invitivals</a></p>
    </div>
  </section>`;

  const PAGES = VAR.kind === 'save' ? [cover, save, families, countdown, end]
    : [cover, save, families, ...days.map(dayPage), venue, countdown, end];

  const OGI = `${URL_}assets/${VAR.cover}?v=${V}`;
  const html = `<!DOCTYPE html>
<!-- written by tools/archika-sandeep.mjs — edit the tool, not this file -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${esc(VAR.title)}</title>
<meta name="description" content="${esc(VAR.ogd)}">
<meta name="author" content="Invitivals">
<meta name="theme-color" content="#eacfb3">
<link rel="canonical" href="${URL_}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Invitivals">
<meta property="og:locale" content="en_IN">
<meta property="og:url" content="${URL_}">
<meta property="og:title" content="${esc(VAR.title)}">
<meta property="og:description" content="${esc(VAR.ogd)}">
<meta property="og:image" content="${OGI}">
<meta property="og:image:secure_url" content="${OGI}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Archika &amp; Sandeep · ${esc(VAR.label)} · ${multi ? '17 – 18' : '18'} January 2027">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(VAR.title)}">
<meta name="twitter:description" content="${esc(VAR.ogd)}">
<meta name="twitter:image" content="${OGI}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" as="image" href="assets/bg/opening-as.webp" fetchpriority="high">
<link rel="modulepreload" href="js/app.js?v=${V}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Noto+Serif+Devanagari:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/invite.css?v=${V}">
</head>
<body class="is-closed">

<!-- opening: the sealed envelope with the couple's gold AS monogram on its wax seal; one tap plays the film, which fades into the cover -->
<div class="opening" id="opening">
  <img class="opening__art" src="assets/bg/opening-as.webp" alt="A sealed cream envelope with the couple's gold A S monogram on its wax seal" width="941" height="1672" decoding="async" fetchpriority="high">
  <video class="opening__film" id="film" playsinline webkit-playsinline muted preload="auto" src="assets/media/opening-as-v2.mp4" aria-hidden="true"></video>
  <button class="tap" id="tap" type="button"><span class="tap__ring" aria-hidden="true"></span><span>Tap to Open</span></button>
</div>

<audio id="music" loop preload="none"></audio>
<button class="mute" id="mute" type="button" aria-pressed="false" aria-label="Pause music" hidden>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path class="mute__note" d="M9 18.5a2.5 2.5 0 1 1-2-2.45V6l10-2v11.5a2.5 2.5 0 1 1-2-2.45V7.4l-6 1.2z"/><path class="mute__bar" d="M4 4l16 16"/></svg>
</button>
<canvas class="petals" id="petals" aria-hidden="true"></canvas>

<main class="stage" id="stage" aria-label="${esc(VAR.label)}: Archika and Sandeep">
${PAGES.join('\n')}
</main>
${SHEETS}
<noscript><p style="padding:40px 24px;text-align:center;font-family:Georgia,serif;color:#5a3a30">Please enable JavaScript to open this invitation.</p></noscript>
<script type="module" src="js/app.js?v=${V}"></script>
</body>
</html>
`;
  const config = `/* written by tools/archika-sandeep.mjs — edit the tool, not this file.
   Archika & Sandeep — ${VAR.label}. The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: '${SLUG}',
  /* the song of the design the client chose; null = no music and no music button */
  music: 'assets/media/music.mp3',
  /* the family's own link for the venue, exactly as supplied */
  venues: ${JSON.stringify({ venue: { name: VENUE.name, address: VENUE.addr, mapsUrl: VENUE.mapsUrl } }, null, 2).replace(/\n/g, '\n  ')},
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
`;
  fs.writeFileSync(path.join(D, 'index.html'), html);
  fs.writeFileSync(path.join(D, 'config.js'), config);
  console.log('✓', SLUG, '—', VAR.kind === 'save' ? 'save the date' : `${events.length} events`, '·', entries.length, 'calendar entries');
}
