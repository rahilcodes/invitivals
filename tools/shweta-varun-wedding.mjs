#!/usr/bin/env node
/* Shweta & Varun — the wedding, Sunday 13 December 2026, Peninsula Grand Hotel, Mumbai (client brief 2026-11-15).
   A separate invitation at public/shweta-varun-wedding. The client chose the Lokesh & Akansha page as the reference
   for the design and the way it works; that page (public/lokesh-akansha-wedding) is only ever READ here, never written.

     node tools/shweta-varun-logo.mjs              once: the S&V monogram cut off its painted checkerboard
     node tools/shweta-varun-wedding.mjs init      once: papers, ornaments, stylesheet, page script, song, venue photo, monogram
     SLUG=shweta-varun-wedding MARK=sv node tools/saicharan-lakshmi-cl.mjs                 the envelope's seal
     SLUG=shweta-varun-wedding MARK=sv FFMPEG=… node tools/saicharan-lakshmi-film.mjs      the film, then cut -t 4.0 → opening-sv-v2.mp4
     node tools/shweta-varun-wedding.mjs init      again: puts the clean transparent monogram back over the seal tool's
     node tools/shweta-varun-wedding.mjs           index.html, config.js, event.ics (after every change of words)
   The link-preview cover: tools/shweta-varun-wedding-og.html (see that file).

   Different from the reference, as the client asked: no "Hand in Hand" photograph page; the venue page shows the
   client's own picture of Peninsula Grand; the S&V monogram stands by itself (no disc, no box) on the scratch card
   and the invitation page; the closing arch says "Thank You" (client, 2026-11-15). Every name and detail is exactly as the family wrote it. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const SLUG = 'shweta-varun-wedding', D = path.join(ROOT, 'public', SLUG), REF = path.join(ROOT, 'public/lokesh-akansha-wedding');
const SRC = path.join(ROOT, 'invites/src', SLUG);
const URL_ = `https://invitivals.com/${SLUG}/`, V = 2, COVER = 'cover-shweta-varun.jpg';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* both links exactly as the family supplied them */
const MEHNDI = { name: 'Gulmohar Hall, Ground Floor', sub: 'Ola Vakkola Banquets',
  lines: ['Police Station, B-25/198', 'Near Vakola, Anand Nagar, Vakola', 'Santacruz East, Mumbai', 'Maharashtra – 400055'], mapsUrl: 'https://maps.app.goo.gl/kPECwfKd4jfSxxuc6?g_st=iw' };
const HOTEL = { name: 'Peninsula Grand Hotel', sub: 'Concorde Ball Room, 6th Floor',
  lines: ['90 Feet Road, Sakinaka', 'Opposite Sakinaka Metro Station', 'Mumbai, Maharashtra'], mapsUrl: 'https://share.google/7ZrttUvmxz9kOpCak' };
const full = (v) => [v.name, v.sub, ...v.lines].join(', ');
/* the two calendar entries: every time here is the family's own (the Mehndi 7:00–11:00 PM; the wedding from the
   Muhurtham at 5:18 PM to the end of the reception and dinner at 11:00 PM) */
const CAL = [
  { id: 'mehndi', title: 'Mehndi Ceremony · Shweta & Varun', start: '20261211T190000', end: '20261211T230000', venue: MEHNDI, notes: 'Friday, 11 December 2026\n7:00 PM – 11:00 PM' },
  { id: 'wedding', title: 'Wedding of Shweta & Varun', start: '20261213T171800', end: '20261213T230000', venue: HOTEL, notes: 'Sunday, 13 December 2026\nMuhurtham: 5:18 PM (Vrashabha Lagna)\nReception & Dinner: up to 11:00 PM' },
];
const COUNTDOWN = '2026-12-13T17:18:00+05:30';

const CSS = `

/* ═════════ Shweta & Varun: this invitation's own pieces ═════════ */
:root { --paper: #efdcc0; --gold: #9c6f24; --gold-light: #d8b45f; }
/* the two invocations over the names */
.invoke { font-family: var(--caps); font-weight: 600; color: var(--maroon); font-size: calc(var(--cq) * 3.25); letter-spacing: .12em; padding-left: .12em; line-height: 1.75; white-space: nowrap; }
.invoke span { display: block; }
/* "weds" between the two names */
.amp__and.weds { font-size: calc(var(--cq) * 6.4); padding: 0 .1em; }
/* the couple's S&V monogram, by itself: no disc, no box, only its own shadow on the paper */
.mono { display: block; flex: none; width: calc(var(--cq) * var(--w, 30)); height: auto; filter: drop-shadow(0 calc(var(--cq) * .9) calc(var(--cq) * 1.4) rgba(96, 58, 12, .34)) drop-shadow(0 0 calc(var(--cq) * .3) rgba(110, 70, 20, .3)); }
/* the closing arch says "Thank You" (client, 2026-11-15: no monogram there) */
.thanks { font-family: var(--script); color: var(--maroon); font-size: calc(var(--cq) * 10.4); line-height: 1.1; white-space: nowrap; }
/* the hosts, and the words of the invitation */
.hosts { font-family: var(--serif); font-weight: 700; color: var(--maroon); font-size: calc(var(--cq) * 5.4); line-height: 1.25; text-wrap: balance; }
.hosts i { display: block; font-family: var(--script); font-style: normal; font-weight: 400; color: var(--gold); font-size: calc(var(--cq) * 5.6); line-height: 1; margin: calc(var(--cq) * .4) 0; }
/* the couple and their elders */
.fam__n.fam__n--sm { font-size: calc(var(--cq) * 9.6); font-weight: 400; white-space: nowrap; }
.fam__g + .fam__g { margin-top: calc(var(--cq) * .6); }
.with { display: flex; align-items: center; gap: calc(var(--cq) * 2.4); width: calc(var(--cq) * 44); margin: calc(var(--cq) * 4.4) 0; font-family: var(--caps); font-weight: 600; color: var(--gold); font-size: calc(var(--cq) * 3.4); letter-spacing: .3em; padding-left: .3em; }
.with::before, .with::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, transparent, var(--gold-light), transparent); }
/* an event: its hours, a second line under a name, the address line by line */
.hours { font-family: var(--caps); font-weight: 600; color: var(--gold); font-size: calc(var(--cq) * 4.3); letter-spacing: .1em; margin-top: calc(var(--cq) * 3); }
.ev__sub { margin-top: calc(var(--cq) * .5); font-family: var(--serif); font-style: italic; font-weight: 600; color: var(--soft); font-size: calc(var(--cq) * 3.7); }
.venue-sub { font-family: var(--serif); font-weight: 700; color: var(--ink); font-size: calc(var(--cq) * 4.5); line-height: 1.25; margin-top: calc(var(--cq) * .6); }
.addr span { display: block; }
.medal--lg { width: calc(var(--cq) * 19); height: calc(var(--cq) * 19); margin-top: calc(var(--cq) * 3.4); }
/* the venue's picture is upright (a tall building): a taller arch than the reference's, so the hotel is seen whole */
.venue-frame.venue-frame--tall { width: calc(var(--cq) * 58); aspect-ratio: 4 / 4.9; }
.venue-frame--tall img { object-position: 50% 42%; }
.maps--wide { padding: 0 calc(var(--cq) * 4.6); font-size: calc(var(--cq) * 3.05); letter-spacing: .12em; }
.sign { font-family: var(--script); color: var(--maroon); font-size: calc(var(--cq) * 6.4); line-height: 1.15; margin-top: calc(var(--cq) * 1); }
.sheet__note { margin: 14px 0 2px; font-family: var(--caps); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); }
`;

if (process.argv[2] === 'init') {
  const { default: sharp } = await import('sharp');
  for (const d of ['assets/bg', 'assets/el', 'assets/media', 'css', 'js']) fs.mkdirSync(path.join(D, d), { recursive: true });
  for (const f of ['bg/p1', 'bg/p2', 'bg/p4', 'bg/p6', 'el/bell', 'el/bell2', 'el/ganesha', 'el/garland', 'el/bird', 'el/tasselA', 'el/tasselB'])
    fs.copyFileSync(path.join(REF, `assets/${f}.webp`), path.join(D, `assets/${f}.webp`));
  for (const f of ['favicon.svg', '.htaccess', 'assets/media/music.mp3']) fs.copyFileSync(path.join(REF, f), path.join(D, f));
  fs.writeFileSync(path.join(D, 'css/invite.css'), fs.readFileSync(path.join(REF, 'css/invite.css'), 'utf8').replace(/\r\n/g, '\n')
    .replace('Lokesh & Akansha — the wedding, groom side (shared by lokesh-akansha-wedding and lokesh-akansha-wedding-day;\n   written by tools/lokesh-akansha-wedding.mjs from this file).', 'Shweta & Varun — the wedding (set up once by tools/shweta-varun-wedding.mjs init; this copy is this page\'s own).') + CSS);
  /* the page script: the same behaviour; the scratch card's foil carries the S&V monogram by itself */
  let js = fs.readFileSync(path.join(REF, 'js/app.js'), 'utf8').replace(/\r\n/g, '\n');
  const sw = (a, b) => { if (js.split(a).length !== 2) throw new Error('app.js: ' + a.slice(0, 50)); js = js.replace(a, () => b); };
  sw('Lokesh & Akansha — the wedding, groom side.', 'Shweta & Varun — the wedding.');
  sw("'../config.js?v=3'", "'../config.js?v=1'");
  sw("'assets/el/la-logo.webp'", "'assets/el/sv-logo.webp'");
  sw("the couple's L & A monogram", "the couple's S&V monogram (on real transparency: nothing behind it but the foil)");
  sw("ctx.drawImage(logo, (W - L) / 2, H * .15, L, L); ctx.shadowColor = 'transparent';",
    "const S = L * 1.18; ctx.drawImage(logo, (W - S) / 2, H * .13 + L / 2 - S / 2, S, S); ctx.shadowColor = 'transparent';   // the monogram by itself on the foil: no disc, no box");
  sw("ctx.fillText('Our special days await', W / 2, H * .74)", "ctx.fillText('Our special day awaits', W / 2, H * .75)");
  sw("W / 2, H * .83);", "W / 2, H * .84);");
  sw('countdown to the Pheras', 'countdown to the Muhurtham');
  fs.writeFileSync(path.join(D, 'js/app.js'), js);
  /* the client's own pictures: the monogram (only resized) and Peninsula Grand (only resized) */
  await sharp(path.join(SRC, 'sv-logo.png')).resize({ width: 900 }).webp({ quality: 92, alphaQuality: 96, effort: 6 }).toFile(path.join(D, 'assets/el/sv-logo.webp'));
  await sharp(path.join(SRC, 'venue-peninsula-grand.jpg')).resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 86, effort: 6 }).toFile(path.join(D, 'assets/el/venue.webp'));
  console.log('✓ init', SLUG);
  process.exit(0);
}

const ICON = {
  mehndi: '<path d="M17 42V24c0-2 3-2 3 0v-11c0-2 3-2 3 0v10-13c0-2 3-2 3 0v13-10c0-2 3-2 3 0v13-5c0-2 3-2 3 0v13c0 6-4 10-9 10s-9-3-9-6z"/><circle cx="25" cy="31" r="3"/><path d="M25 25v3M25 34v3M19 31h3M28 31h3"/>',
  agni: '<path d="M8 40h32M11 40v-6h26v6"/><path d="M14 34v-4h20v4"/><path d="M24 29c-6-3-6-9-1-14 0 4 2 5 3 6 1-3 0-6-1-9 5 3 9 9 4 17"/><path d="M18 29c-2-2-2-5 0-7M30 29c2-2 2-5 0-7"/>',
  dinner: '<path d="M6 36h36"/><path d="M9 36c0-9 6.500-15 15-15s15 6 15 15"/><path d="M24 21v-3"/><circle cx="24" cy="16" r="2"/><path d="M12 40h24"/><path d="M16 31c1-3 3-5 6-6"/>',
};
const PINPATH = '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>';
const CALPATH = '<path d="M7 2h2v2h6V2h2v2h3v18H4V4h3zm-1 7v11h12V9zm2 2h3v3H8z"/>';
const at = (pct, H) => `calc(var(--cq) * ${(pct * H / 100).toFixed(1)})`;
const MONO = (w, cls = 'pop', d = '.1s') => `<img class="mono ${cls}" style="--w:${w};--d:${d}" src="assets/el/sv-logo.webp" alt="The couple's S&amp;V monogram in gold, ringed by a laurel wreath" width="900" height="900" loading="lazy" decoding="async">`;
const TASSELS = `<img class="el swing" style="left:5.5%;top:${at(36, 169.29)};width:8%;--d:.6s" src="assets/el/tasselB.webp" alt="" loading="lazy">
      <img class="el swing" style="right:5.5%;top:${at(38, 169.29)};width:7%;--d:.8s" src="assets/el/tasselA.webp" alt="" loading="lazy">`;
const bells = (y1, y2, lazy, H = 177.68) => [['left:12%', y1, 5, .9], ['left:6%', y2, 5.6, 1.1], ['right:12%', y1, 5, 1], ['right:6%', y2, 5.6, 1.2]].map(([side, y, w, d]) => `
      <img class="el swing" style="${side};top:${at(y, H)};width:${w}%;--d:${d}s" src="assets/el/bell.webp" alt=""${lazy ? ' loading="lazy"' : ''}>`).join('');
const P4BELLS = `<img class="el swing" style="left:12%;top:${at(15, 177.68)};width:5.5%;--d:.5s" src="assets/el/bell.webp" alt="" loading="lazy">
      <img class="el swing" style="right:11%;top:${at(20, 177.68)};width:5.5%;--d:.6s" src="assets/el/bell.webp" alt="" loading="lazy">`;
const mapBtn = (k, label, cls = '') => `<a class="maps ${cls} rise" data-maps="${k}" target="_blank" rel="noopener" style="--d:.35s"><svg viewBox="0 0 24 24" aria-hidden="true">${PINPATH}</svg><span>${label}</span></a>`;
const place = (v) => `<svg class="pin" viewBox="0 0 24 24" aria-hidden="true">${PINPATH}</svg>
        <p class="venue rise">${esc(v.name)}</p>
        <p class="venue-sub rise" style="--d:.1s">${esc(v.sub)}</p>
        <p class="addr rise" style="--d:.15s">${v.lines.map((l) => `<span>${esc(l)}</span>`).join('')}</p>`;

const icsText = (t) => String(t).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
const fold = (l) => { const out = []; let s = l; while (Buffer.byteLength(s) > 73) { let n = 73; while (Buffer.byteLength(s.slice(0, n)) > 73) n--; out.push(s.slice(0, n)); s = ' ' + s.slice(n); } out.push(s); return out.join('\r\n'); };
const details = (e) => `${e.notes}\n\nVenue: ${full(e.venue)}\nMap: ${e.venue.mapsUrl}\n\n${URL_}`;
const ICS = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Shweta & Varun Wedding//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
  ...CAL.flatMap((e) => ['BEGIN:VEVENT', `UID:${SLUG}-${e.id}@invitivals.com`, 'DTSTAMP:20261115T000000Z', `DTSTART;TZID=Asia/Kolkata:${e.start}`, `DTEND;TZID=Asia/Kolkata:${e.end}`,
    `SUMMARY:${icsText(e.title)}`, `LOCATION:${icsText(full(e.venue))}`, `DESCRIPTION:${icsText(details(e))}`, `URL:${URL_}`,
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(e.title + ' tomorrow')}`, 'END:VALARM', 'END:VEVENT']),
  'END:VCALENDAR', ''].map(fold).join('\r\n');
const gcal = (e) => esc('https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: e.title, dates: `${e.start}/${e.end}`, ctz: 'Asia/Kolkata', location: full(e.venue), details: details(e) }).toString());

const TITLE = 'Shweta & Varun · Wedding Invitation', OGD = '13 December 2026 · Peninsula Grand Hotel, Mumbai. Tap to open the invitation.';
const html = `<!DOCTYPE html>
<!-- written by tools/shweta-varun-wedding.mjs — edit the tool, not this file -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${esc(TITLE)} · Invitivals</title>
<meta name="description" content="Smt. Premlata &amp; Shri Manohar R. Amin solicit the pleasure of your company at the wedding of Shweta &amp; Varun — Sunday, 13 December 2026, Peninsula Grand Hotel, Sakinaka, Mumbai.">
<meta name="author" content="Invitivals">
<meta name="theme-color" content="#eacfb3">
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
<meta property="og:image:alt" content="Shweta &amp; Varun · Wedding Invitation · 13 December 2026">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(TITLE)}">
<meta name="twitter:description" content="${esc(OGD)}">
<meta name="twitter:image" content="${URL_}assets/${COVER}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" as="image" href="assets/bg/opening-sv.webp" fetchpriority="high">
<link rel="modulepreload" href="js/app.js?v=${V}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/invite.css?v=${V}">
</head>
<body class="is-closed">

<!-- opening: the sealed envelope (the couple's gold S&V monogram on its wax seal); one tap plays the film, which fades into the cover -->
<div class="opening" id="opening">
  <img class="opening__art" src="assets/bg/opening-sv.webp" alt="A sealed cream envelope with the couple's gold S&amp;V monogram on its wax seal" width="941" height="1672" decoding="async" fetchpriority="high">
  <video class="opening__film" id="film" playsinline webkit-playsinline muted preload="auto" src="assets/media/opening-sv-v2.mp4" aria-hidden="true"></video>
  <button class="tap" id="tap" type="button"><span class="tap__ring" aria-hidden="true"></span><span>Tap to Open</span></button>
</div>

<audio id="music" loop preload="none"></audio>
<button class="mute" id="mute" type="button" aria-pressed="false" aria-label="Pause music" hidden>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path class="mute__note" d="M9 18.5a2.5 2.5 0 1 1-2-2.45V6l10-2v11.5a2.5 2.5 0 1 1-2-2.45V7.4l-6 1.2z"/><path class="mute__bar" d="M4 4l16 16"/></svg>
</button>
<canvas class="petals" id="petals" aria-hidden="true"></canvas>

<main class="stage" id="stage" aria-label="Wedding invitation of Shweta and Varun">

  <!-- 1 · the cover: Ganesha, the two invocations, the couple, the date -->
  <section class="page page--1" id="p1">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" decoding="async">${bells(5.5, 11.5, false)}
      <div class="flow" style="--top:13;--side:11;--bottom:2">
        <img class="orn drop" style="width:calc(var(--cq) * 11);margin-top:0;--d:.2s" src="assets/el/ganesha.webp" alt="Ganesha">
        <p class="invoke rise" style="margin-top:calc(var(--cq) * 2);--d:.4s"><span>|| Shree Ganeshaya Namah ||</span><span>|| Shree Kuladevatha Prasanna ||</span></p>
        <img class="orn rise" style="width:calc(var(--cq) * 22);margin:calc(var(--cq) * 2.6) auto 0;--d:.6s" src="assets/el/garland.webp" alt="">
        <p class="caps caps--sm gap-m rise" style="--d:.8s">Wedding Invitation</p>
        <h1 class="couple-names">
          <span class="script script--xl rise" style="--d:1s">Shweta</span>
          <span class="amp rise" style="--d:1.15s"><span class="amp__line" aria-hidden="true"></span><span class="amp__and weds">weds</span><span class="amp__line" aria-hidden="true"></span></span>
          <span class="script script--xl rise" style="--d:1.3s">Varun</span>
        </h1>
        <img class="orn rise" style="width:calc(var(--cq) * 18);--d:1.45s" src="assets/el/garland.webp" alt="">
        <p class="datebar rise" style="--d:1.6s">Sunday · 13 December 2026<small>Mumbai</small></p>
        <button class="cue rise" id="cue" type="button" style="--d:1.9s" aria-label="Scroll down to the rest of the invitation">Scroll to explore<svg viewBox="0 0 22 20" aria-hidden="true"><path d="M4 3l7 6 7-6"/><path d="M4 10l7 6 7-6"/></svg></button>
      </div>
    </div>
  </section>

  <!-- 2 · the invitation, in the hosts' words, under the couple's monogram -->
  <section class="page" id="p-invite">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p4.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      ${P4BELLS}
      <div class="flow" style="--top:24;--side:15">
        ${MONO(31)}
        <p class="hosts gap-l rise" style="--d:.15s">Smt. Premlata<i>&amp;</i>Shri Manohar R. Amin</p>
        <img class="orn rise" style="width:calc(var(--cq) * 18);--d:.2s" src="assets/el/garland.webp" alt="" loading="lazy">
        <p class="para rise" style="--d:.25s">Solicit the pleasure of your company with family on the auspicious occasion of the wedding ceremony of their daughter.</p>
      </div>
    </div>
  </section>

  <!-- 3 · the couple and their elders, exactly as the family wrote them -->
  <section class="page" id="p-fam">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">${bells(5.5, 11.5, true)}
      <div class="flow" style="--top:25;--side:10">
        <div class="fam rise">
          <h2 class="fam__n fam__n--sm">Chi. Sow. Shweta</h2>
          <p class="fam__k">Granddaughter of</p>
          <p class="fam__g">Late Smt. Yamuna &amp; Shri Rukka M. Amin</p>
          <p class="fam__g">Late Smt. Vimala &amp; Shri Muddu B Karkera</p>
        </div>
        <p class="with rise" style="--d:.1s">WITH</p>
        <div class="fam rise" style="--d:.15s">
          <h2 class="fam__n fam__n--sm">Chi. Varun</h2>
          <p class="fam__k">Son of</p>
          <p class="fam__p">Smt. Purnima &amp; Shri Vishwanath B. Salian</p>
          <p class="fam__k">Grandson of</p>
          <p class="fam__g">Late Kamala &amp; Baburao Amin</p>
          <p class="fam__g">Smt. Gulabi &amp; Late Thimappa Poojari</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4 · Save the Date: a gold-foil scratch card with the S&V monogram; underneath, the wedding date. Then Add to Calendar -->
  <section class="page" id="p-save">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      ${TASSELS}
      <div class="flow" style="--top:33;--side:14">
        <h2 class="script script--lg rise">Save the Date</h2>
        <div class="scard rise" id="scard" style="--d:.3s">
          <div class="scard__face" id="scardFace">
            <p class="scard__kicker">Our Wedding</p>
            <p class="scard__day">Sunday</p>
            <p class="scard__num">13</p>
            <p class="scard__month">December <span>2026</span></p>
            <img class="scard__orn" src="assets/el/garland.webp" alt="" loading="lazy">
            <p class="scard__place">Mumbai</p>
          </div>
          <canvas class="scard__foil" id="foil" role="button" tabindex="0" aria-label="Scratch card: rub it with your finger or the mouse to reveal our wedding date. Press Enter to reveal." aria-describedby="scardNote"></canvas>
          <span class="scard__hint" id="scardHint" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 11.2V5.5a1.5 1.5 0 0 1 3 0v4.7l.1-1.2a1.5 1.5 0 0 1 3 .1v1.3a1.5 1.5 0 0 1 3 .2V12a1.5 1.5 0 0 1 2.9.3v3.4c0 3.5-2.6 6.3-6.2 6.3h-1.3c-2 0-3.4-.8-4.7-2.4L5.7 15.6a1.6 1.6 0 0 1 2.3-2.2z"/></svg></span>
          <p class="sr-only" id="scardNote" aria-live="polite">Scratch the card to reveal the date.</p>
        </div>
        <button class="maps cal-btn rise" id="calBtn" type="button" style="--d:.4s" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true">${CALPATH}</svg><span>Add to Calendar</span></button>
      </div>
    </div>
  </section>

  <!-- 5 · the Mehndi -->
  <section class="page" id="p-mehndi">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">${bells(5.5, 11.5, true)}
      <div class="flow" style="--top:24;--side:13">
        <h2 class="script script--lg rise">Mehndi Ceremony</h2>
        <span class="medal medal--lg pop" style="--d:.1s" aria-hidden="true"><svg viewBox="0 0 48 48">${ICON.mehndi}</svg></span>
        <p class="datebar gap-m rise" style="--d:.15s">Friday<small>11 December 2026</small></p>
        <p class="hours rise" style="--d:.2s">7:00 PM – 11:00 PM</p>
        <img class="orn rise" style="width:calc(var(--cq) * 16);--d:.25s" src="assets/el/garland.webp" alt="" loading="lazy">
        ${place(MEHNDI)}
        ${mapBtn('mehndi', 'Open in Google Maps')}
      </div>
    </div>
  </section>

  <!-- 6 · the wedding ceremony and reception -->
  <section class="page" id="p-wedding">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p4.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      ${P4BELLS}
      <img class="el swing" style="left:2.5%;top:${at(57, 177.68)};width:5%;--d:.9s" src="assets/el/bell2.webp" alt="" loading="lazy">
      <img class="el swing" style="right:3%;top:${at(59, 177.68)};width:5%;--d:1s" src="assets/el/bell2.webp" alt="" loading="lazy">
      <div class="flow" style="--top:33;--side:14">
        <h2 class="script script--md rise">Wedding Ceremony<br>&amp; Reception</h2>
        <p class="datebar gap-m rise" style="--d:.15s">Sunday<small>13 December 2026</small></p>
        <ol class="tl">
          <li class="rise" style="--d:.15s"><span class="medal" aria-hidden="true"><svg viewBox="0 0 48 48">${ICON.agni}</svg></span>
            <div><h3 class="ev__name">Muhurtham</h3><p class="ev__time">5:18 PM</p><p class="ev__sub">Vrashabha Lagna</p></div></li>
          <li class="rise" style="--d:.3s"><span class="medal" aria-hidden="true"><svg viewBox="0 0 48 48">${ICON.dinner}</svg></span>
            <div><h3 class="ev__name">Reception &amp; Dinner</h3><p class="ev__time">Up to 11:00 PM</p></div></li>
        </ol>
        <img class="orn rise" style="width:calc(var(--cq) * 16);--d:.2s" src="assets/el/garland.webp" alt="" loading="lazy">
        <p class="venue-for rise">Venue – ${esc(HOTEL.name)}, Mumbai</p>
      </div>
    </div>
  </section>

  <!-- 7 · the wedding venue: the family's own picture of the hotel, its address, the family's own map link -->
  <section class="page" id="p-venue">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      <div class="flow" style="--top:31;--side:13">
        <h2 class="script script--md rise">Wedding Venue</h2>
        <div class="venue-frame venue-frame--tall pop" style="--d:.15s"><img src="assets/el/venue.webp" alt="Peninsula Grand Hotel, its curved glass front lit up at dusk" width="1000" height="1333" loading="lazy" decoding="async"></div>
        ${place(HOTEL)}
        ${mapBtn('hotel', 'View Wedding Venue on Map', 'maps--wide')}
      </div>
    </div>
  </section>

  <!-- 8 · the countdown to the Muhurtham (13 December 2026, 5:18 PM IST), worked out live -->
  <section class="page" id="p-countdown">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p4.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      ${P4BELLS}
      <div class="flow" style="--top:30;--side:14">
        <p class="caps caps--sm rise">Counting down to</p>
        <h2 class="script script--lg gap-s rise" style="--d:.1s">Our Big Day</h2>
        <img class="orn rise" style="width:calc(var(--cq) * 18);--d:.2s" src="assets/el/garland.webp" alt="" loading="lazy">
        <div class="cd rise" id="countdown" data-target="${COUNTDOWN}" style="--d:.3s" role="timer" aria-live="off">
          <div class="cd__u"><b data-cd="d">--</b><span>Days</span></div>
          <div class="cd__u"><b data-cd="h">--</b><span>Hours</span></div>
          <div class="cd__u"><b data-cd="m">--</b><span>Minutes</span></div>
          <div class="cd__u"><b data-cd="s">--</b><span>Seconds</span></div>
        </div>
        <p class="script script--md cd__done" id="cdDone" hidden>The Big Day Is Here!</p>
        <p class="datebar gap-m rise" style="--d:.4s">The Muhurtham · 5:18 PM<small>Sunday, 13 December 2026</small></p>
      </div>
    </div>
  </section>

  <!-- the last page: the closing words, and "Thank You" inside the painted arch -->
  <section class="page page--end" id="p-end">
    <div class="art" style="--h:150">
      <img class="bg" src="assets/bg/p6.webp" alt="" width="1024" height="1536" loading="lazy" decoding="async">
      <img class="el glide" style="left:6%;top:12%;width:15%;--d:.4s" src="assets/el/bird.webp" alt="" loading="lazy">
      <div class="flow" style="--top:6;--side:19;--bottom:0">
        <h2 class="script script--xl rise">With Love</h2>
        <img class="orn rise" style="width:calc(var(--cq) * 18);margin:calc(var(--cq) * 1.2) auto calc(var(--cq) * 2);--d:.2s" src="assets/el/garland.webp" alt="" loading="lazy">
        <p class="message rise" style="--d:.3s">Your gracious presence and blessings will make our celebration truly memorable.</p>
        <p class="sign rise" style="--d:.4s">Shweta &amp; Varun</p>
      </div>
      <!-- inside the painted arch (client, 2026-11-15: "Thank You" here, not the monogram) -->
      <div class="arch-words"><p class="thanks rise" style="--d:.3s">Thank You</p><img class="orn rise" style="width:calc(var(--cq) * 13);margin:calc(var(--cq) * .6) auto 0;--d:.45s" src="assets/el/garland.webp" alt="" loading="lazy"></div>
      <p class="credit">Created by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=${SLUG}" target="_blank" rel="noopener">Invitivals</a></p>
    </div>
  </section>
</main>

<div class="sheet" id="sheet" hidden>
  <div class="sheet__veil" data-close></div>
  <div class="sheet__card" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
    <p class="sheet__kicker">11 &amp; 13 December 2026 · Mumbai</p>
    <h2 class="sheet__title" id="sheetTitle">Save the Date</h2>
    <a class="sheet__btn sheet__btn--primary" href="event.ics" download="shweta-varun-wedding.ics"><svg viewBox="0 0 24 24" aria-hidden="true">${CALPATH}</svg>Apple / Android calendar (.ics)</a>
    <p class="sheet__note">Google Calendar</p>
    <a class="sheet__btn" href="${gcal(CAL[0])}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5v5.4l3.6 2.1-.8 1.3L11 13V7z"/></svg>Mehndi · 11 December</a>
    <a class="sheet__btn" id="gcal" href="${gcal(CAL[1])}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5v5.4l3.6 2.1-.8 1.3L11 13V7z"/></svg>Wedding · 13 December</a>
    <button class="sheet__close" type="button" data-close>Close</button>
  </div>
</div>
<noscript><p style="padding:40px 24px;text-align:center;font-family:Georgia,serif;color:#5a3a30">Please enable JavaScript to open this invitation.</p></noscript>
<script type="module" src="js/app.js?v=${V}"></script>
</body>
</html>
`;
const config = `/* written by tools/shweta-varun-wedding.mjs — edit the tool, not this file.
   Shweta & Varun, the wedding. The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: '${SLUG}',
  /* the song; null = no music and no music button */
  music: 'assets/media/music.mp3',
  /* the venue links exactly as the family supplied them */
  venues: ${JSON.stringify({ mehndi: { name: MEHNDI.sub, address: full(MEHNDI), mapsUrl: MEHNDI.mapsUrl }, hotel: { name: HOTEL.name, address: full(HOTEL), mapsUrl: HOTEL.mapsUrl } }, null, 2).replace(/\n/g, '\n  ')},
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
`;
fs.writeFileSync(path.join(D, 'index.html'), html);
fs.writeFileSync(path.join(D, 'config.js'), config);
fs.writeFileSync(path.join(D, 'event.ics'), ICS);
console.log('✓', SLUG);
