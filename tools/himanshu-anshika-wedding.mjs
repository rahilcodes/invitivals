#!/usr/bin/env node
/* Himanshu & Anshika — the wedding, Wednesday 25 November 2026, Utsav Green Farm, Karala, Delhi (client brief 2026-11-14).
   A separate invitation at public/himanshu-anshika-wedding. The client chose the Lokesh & Akansha page as the reference
   for the design and the way it works; that page (public/lokesh-akansha-wedding) is only ever READ here, never written.

     node tools/himanshu-anshika-wedding.mjs init     once: the papers, ornaments, stylesheet, page script, dhol, song
     node tools/himanshu-anshika-wedding.mjs          index.html, config.js, event.ics (run after every change of words)

   The HA seal (the client's own gold monogram, invites/src/himanshu-anshika-wedding/ha-logo.jpg, also copied to
   invites/src/saicharan-lakshmi-engagement/ha-logo.jpg where the seal tools read it):
     SLUG=himanshu-anshika-wedding MARK=ha node tools/saicharan-lakshmi-cl.mjs
     SLUG=himanshu-anshika-wedding MARK=ha FFMPEG=… node tools/saicharan-lakshmi-film.mjs
     ffmpeg -i opening-ha.mp4 -t 4.0 -an -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high -movflags +faststart opening-ha-v2.mp4
   The link-preview cover: tools/himanshu-anshika-wedding-og.html (see that file).

   Different from the reference, as the client asked: no "Hand in Hand" photograph page; the venue page shows a dhol
   (the studio's own painting, its navy trims turned maroon for this palette) instead of a venue photograph; the HA
   monogram on the seal, the scratch card (by itself, no disc) and the countdown; the closing arch says "Thank You".
   Every name and detail is set exactly as the family wrote it ("Ghudchadi", "Sh." and "Shri" as written). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const SLUG = 'himanshu-anshika-wedding', D = path.join(ROOT, 'public', SLUG), REF = path.join(ROOT, 'public/lokesh-akansha-wedding');
const URL_ = `https://invitivals.com/${SLUG}/`, V = 2, COVER = 'cover-himanshu-anshika-v2.jpg';   // a new file name whenever the cover changes: WhatsApp keeps a preview per image address
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const VENUE = { name: 'Utsav Green Farm', lines: ['Baldev Vihar Colony,', 'Shaheed Bhagat Singh Nagar,', 'Karala, Delhi – 110081.'], mapsUrl: 'https://maps.app.goo.gl/kNHvEiNqpcpL9mu49' };
VENUE.address = VENUE.lines.join(' ');
const OM = 'ॐ श्री गणेशाय नमः';
const SHLOKA = ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'];
const DAY = [
  { icon: 'horse', name: 'Ghudchadi', time: '05:00 PM' },
  { icon: 'dhol', name: 'Baraat', time: '07:00 PM' },
];
/* the calendar entry: the family gave start times only; it runs from the Ghudchadi (5:00 PM) to 11:00 PM */
const CAL = { start: '20261125T170000', end: '20261125T230000', title: 'Wedding of Himanshu & Anshika' };
const COUNTDOWN = '2026-11-25T17:00:00+05:30';

const CSS = `

/* ═════════ Himanshu & Anshika: this invitation's own pieces ═════════ */
:root { --paper: #efdcc0; --gold: #9c6f24; --gold-light: #d8b45f; --brown: #3d2116; }
/* ॐ श्री गणेशाय नमः over the shloka */
.om { font-family: var(--deva); font-weight: 600; color: var(--maroon); font-size: calc(var(--cq) * 5); line-height: 1.5; white-space: nowrap; }
.shloka--2 { font-size: calc(var(--cq) * 3.15); margin-top: calc(var(--cq) * .8); }
/* the family's HA monogram, as they sent it, on a deep brown medallion with a gold rim (it was drawn for a dark ground) */
.mono { position: relative; flex: none; width: calc(var(--cq) * var(--w, 26)); aspect-ratio: 1; border-radius: 50%; display: grid; place-items: center;
  background: radial-gradient(circle at 36% 28%, #5a2d1c, #2a130b 62%, #1b0c07);
  box-shadow: 0 0 0 calc(var(--cq) * .7) #f8e7c2, 0 0 0 calc(calc(var(--cq) * .7) + 1.5px) #b98a2e, 0 0 0 calc(var(--cq) * 1.5) rgba(248, 231, 194, .5), 0 calc(var(--cq) * 1.8) calc(var(--cq) * 3.6) rgba(80, 40, 20, .35); }
.mono img { display: block; width: 90%; height: 90%; object-fit: contain; }
.mono::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: linear-gradient(115deg, transparent 38%, rgba(255, 244, 214, .22) 50%, transparent 62%); background-size: 260% 100%; animation: mono-shine 5.5s ease-in-out infinite; pointer-events: none; }
@keyframes mono-shine { 0%, 55% { background-position: 130% 0; } 100% { background-position: -130% 0; } }
/* the venue page: a dhol on a soft halo of gold light, standing on its own shadow, swaying a little as if played */
.dhol { position: relative; width: calc(var(--cq) * 54); margin: calc(var(--cq) * 3) 0 calc(var(--cq) * 2); }
.dhol::before { content: ''; position: absolute; left: -12%; right: -12%; top: -14%; bottom: -6%; border-radius: 50%;
  background: radial-gradient(closest-side, rgba(255, 240, 200, .9), rgba(247, 222, 170, .55) 52%, rgba(240, 214, 170, 0)); }
.dhol::after { content: ''; position: absolute; left: 12%; right: 12%; bottom: -3%; height: 9%; border-radius: 50%; background: radial-gradient(closest-side, rgba(90, 45, 20, .34), rgba(90, 45, 20, 0)); }
.dhol img { position: relative; z-index: 1; display: block; width: 100%; height: auto; transform-origin: 50% 88%; animation: dhol-sway 3.6s ease-in-out infinite; filter: drop-shadow(0 calc(var(--cq) * .8) calc(var(--cq) * 1.2) rgba(80, 40, 20, .22)); }
@keyframes dhol-sway { 0%, 100% { transform: rotate(-1.6deg); } 50% { transform: rotate(1.6deg) translateY(calc(var(--cq) * -.5)); } }
.addr span { display: block; }
/* the closing: "Thank You" inside the painted arch */
.thanks { font-family: var(--script); color: var(--maroon); font-size: calc(var(--cq) * 10.4); line-height: 1.1; white-space: nowrap; }
.sign { font-family: var(--script); color: var(--maroon); font-size: calc(var(--cq) * 6.2); line-height: 1.15; margin-top: calc(var(--cq) * 1); }
@media (prefers-reduced-motion: reduce) { .dhol img, .mono::after { animation: none; } }
`;

if (process.argv[2] === 'init') {
  const { default: sharp } = await import('sharp');
  for (const d of ['assets/bg', 'assets/el', 'assets/media', 'css', 'js']) fs.mkdirSync(path.join(D, d), { recursive: true });
  for (const f of ['bg/p1', 'bg/p2', 'bg/p4', 'bg/p6', 'el/bell', 'el/bell2', 'el/ganesha', 'el/garland', 'el/bird', 'el/tasselA', 'el/tasselB'])
    fs.copyFileSync(path.join(REF, `assets/${f}.webp`), path.join(D, `assets/${f}.webp`));
  for (const f of ['favicon.svg', '.htaccess', 'assets/media/music.mp3']) fs.copyFileSync(path.join(REF, f), path.join(D, f));
  fs.writeFileSync(path.join(D, 'css/invite.css'), fs.readFileSync(path.join(REF, 'css/invite.css'), 'utf8').replace(/\r\n/g, '\n')
    .replace('Lokesh & Akansha — the wedding, groom side (shared by lokesh-akansha-wedding and lokesh-akansha-wedding-day;\n   written by tools/lokesh-akansha-wedding.mjs from this file).', 'Himanshu & Anshika — the wedding (set up once by tools/himanshu-anshika-wedding.mjs init; this copy is this page\'s own).') + CSS);
  /* the page script: the same behaviour; the scratch card's foil carries the HA monogram on its dark medallion */
  let js = fs.readFileSync(path.join(REF, 'js/app.js'), 'utf8').replace(/\r\n/g, '\n');
  const sw = (a, b) => { if (js.split(a).length !== 2) throw new Error('app.js: ' + a.slice(0, 50)); js = js.replace(a, () => b); };
  sw('Lokesh & Akansha — the wedding, groom side.', 'Himanshu & Anshika — the wedding.');
  sw("'../config.js?v=3'", "'../config.js?v=1'");
  sw("'assets/el/la-logo.webp'", "'assets/el/ha-logo.webp'");
  sw("the couple's L & A monogram", "the couple's HA monogram");
  sw("ctx.drawImage(logo, (W - L) / 2, H * .15, L, L); ctx.shadowColor = 'transparent';",
    "const S = L * 1.14; ctx.drawImage(logo, (W - S) / 2, H * .15 + L / 2 - S / 2, S, S); ctx.shadowColor = 'transparent';   // the monogram by itself, on the foil (client, 2026-11-14: no dark disc behind it)");
  sw("ctx.fillText('Our special days await', W / 2, H * .74)", "ctx.fillText('Our special day awaits', W / 2, H * .75)");
  sw("W / 2, H * .83);", "W / 2, H * .84);");
  sw('countdown to the Pheras', 'countdown to the wedding day');
  fs.writeFileSync(path.join(D, 'js/app.js'), js);
  /* the dhol: the studio's painting (public/amandeep-ishpreet-wedding/assets/dhol.webp, read only); its navy cloth and
     tassels are turned to this invitation's maroon, pixel by pixel, keeping every shade; nothing else is touched */
  const { data, info } = await sharp(path.join(ROOT, 'public/amandeep-ishpreet-wedding/assets/dhol.webp')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], k = Math.max(0, Math.min(1, (b - Math.max(r, g) - 10) / 26));
    if (!k) continue;
    const l = (.3 * r + .59 * g + .11 * b) / 255, t = Math.min(1, l * 2.6 + .12);          // navy is dark: lift it a little so the maroon reads
    const R = 150 * t + 60 * Math.max(0, l - .35), G = 28 * t + 60 * Math.max(0, l - .35), B = 52 * t + 60 * Math.max(0, l - .35);
    data[i] = Math.round(r + (Math.min(255, R) - r) * k); data[i + 1] = Math.round(g + (Math.min(255, G) - g) * k); data[i + 2] = Math.round(b + (Math.min(255, B) - b) * k);
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ quality: 90, alphaQuality: 95, effort: 6 }).toFile(path.join(D, 'assets/el/dhol.webp'));
  console.log('✓ init', SLUG);
  process.exit(0);
}

const ICON = {
  horse: '<path d="M36 43c0-8-1-14-4-19-1-4-1-8-3-11l-2-6-2 5c-3-1-7 0-10 3l-6 7c-2 2-2 5 0 6l3 1c2 0 3-1 4-2l4-2c2 4 2 10-1 16l-1 2"/><circle cx="20" cy="15" r="1"/><path d="M30 13c4 3 7 9 8 16M31 19c3 4 5 9 5 15M16 22l5-7M10 23.5h1.5"/><path d="M27 7l3-3 1 4"/>',
  dhol: '<path d="M10 18c-2 0-3 3-3 6s1 6 3 6M38 18c2 0 3 3 3 6s-1 6-3 6"/><path d="M10 18c6-3 22-3 28 0M10 30c6 3 22 3 28 0"/><path d="M10 18v12M38 18v12M17 17v14M24 16.5v15M31 17v14"/><path d="M16 12l3-4M30 12l-3-4"/>',
};
const PINPATH = '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>';
const at = (pct, H) => `calc(var(--cq) * ${(pct * H / 100).toFixed(1)})`;
const MONO = (w, cls = 'pop', d = '.1s') => `<div class="mono ${cls}" style="--w:${w};--d:${d}"><img src="assets/el/ha-logo.webp" alt="The couple's HA monogram: the letters H and A in gold, ringed by a laurel wreath" width="900" height="900" loading="lazy" decoding="async"></div>`;
const TASSELS = `<img class="el swing" style="left:5.5%;top:${at(36, 169.29)};width:8%;--d:.6s" src="assets/el/tasselB.webp" alt="" loading="lazy">
      <img class="el swing" style="right:5.5%;top:${at(38, 169.29)};width:7%;--d:.8s" src="assets/el/tasselA.webp" alt="" loading="lazy">`;
const bells = (y1, y2, lazy, H = 177.68) => [['left:12%', y1, 5, .9], ['left:6%', y2, 5.6, 1.1], ['right:12%', y1, 5, 1], ['right:6%', y2, 5.6, 1.2]].map(([side, y, w, d]) => `
      <img class="el swing" style="${side};top:${at(y, H)};width:${w}%;--d:${d}s" src="assets/el/bell.webp" alt=""${lazy ? ' loading="lazy"' : ''}>`).join('');
const P4BELLS = `<img class="el swing" style="left:12%;top:${at(15, 177.68)};width:5.5%;--d:.5s" src="assets/el/bell.webp" alt="" loading="lazy">
      <img class="el swing" style="right:11%;top:${at(20, 177.68)};width:5.5%;--d:.6s" src="assets/el/bell.webp" alt="" loading="lazy">`;

const icsText = (t) => String(t).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
const NOTES = `Wednesday, 25 November 2026\nGhudchadi: 05:00 PM\nBaraat: 07:00 PM\n\nVenue: ${VENUE.name}, ${VENUE.address}\nMap: ${VENUE.mapsUrl}`;
const fold = (l) => { const out = []; let s = l; while (Buffer.byteLength(s) > 73) { let n = 73; while (Buffer.byteLength(s.slice(0, n)) > 73) n--; out.push(s.slice(0, n)); s = ' ' + s.slice(n); } out.push(s); return out.join('\r\n'); };
const ICS = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Himanshu & Anshika Wedding//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
  'BEGIN:VEVENT', `UID:${SLUG}@invitivals.com`, 'DTSTAMP:20261114T000000Z', `DTSTART;TZID=Asia/Kolkata:${CAL.start}`, `DTEND;TZID=Asia/Kolkata:${CAL.end}`,
  `SUMMARY:${icsText(CAL.title)}`, `LOCATION:${icsText(VENUE.name + ', ' + VENUE.address)}`, `DESCRIPTION:${icsText(NOTES + '\n\n' + URL_)}`, `URL:${URL_}`,
  'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${icsText('Wedding of Himanshu & Anshika tomorrow')}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR', ''].map(fold).join('\r\n');
const GCAL = esc('https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: CAL.title, dates: `${CAL.start}/${CAL.end}`, ctz: 'Asia/Kolkata',
  location: VENUE.name + ', ' + VENUE.address, details: NOTES + '\n\n' + URL_ }).toString());

const TITLE = 'Himanshu & Anshika · Wedding Invitation', OGD = '25 November 2026 · Rohini, Delhi. Tap to open the invitation.';
const html = `<!DOCTYPE html>
<!-- written by tools/himanshu-anshika-wedding.mjs — edit the tool, not this file -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${esc(TITLE)} · Invitivals</title>
<meta name="description" content="You and your family are cordially invited to the wedding of Himanshu &amp; Anshika — Wednesday, 25 November 2026, Utsav Green Farm, Karala, Delhi.">
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
<meta property="og:image:alt" content="Himanshu &amp; Anshika · Wedding Invitation · 25 November 2026 · Rohini, Delhi">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(TITLE)}">
<meta name="twitter:description" content="${esc(OGD)}">
<meta name="twitter:image" content="${URL_}assets/${COVER}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" as="image" href="assets/bg/opening-ha.webp" fetchpriority="high">
<link rel="modulepreload" href="js/app.js?v=${V}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Noto+Serif+Devanagari:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/invite.css?v=${V}">
</head>
<body class="is-closed">

<!-- opening: the sealed envelope (the family's gold HA monogram on its wax seal); one tap plays the film, which fades into the cover -->
<div class="opening" id="opening">
  <img class="opening__art" src="assets/bg/opening-ha.webp" alt="A sealed cream envelope with the couple's gold HA monogram on its wax seal" width="941" height="1672" decoding="async" fetchpriority="high">
  <video class="opening__film" id="film" playsinline webkit-playsinline muted preload="auto" src="assets/media/opening-ha-v2.mp4" aria-hidden="true"></video>
  <button class="tap" id="tap" type="button"><span class="tap__ring" aria-hidden="true"></span><span>Tap to Open</span></button>
</div>

<audio id="music" loop preload="none"></audio>
<button class="mute" id="mute" type="button" aria-pressed="false" aria-label="Pause music" hidden>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path class="mute__note" d="M9 18.5a2.5 2.5 0 1 1-2-2.45V6l10-2v11.5a2.5 2.5 0 1 1-2-2.45V7.4l-6 1.2z"/><path class="mute__bar" d="M4 4l16 16"/></svg>
</button>
<canvas class="petals" id="petals" aria-hidden="true"></canvas>

<main class="stage" id="stage" aria-label="Wedding invitation of Himanshu and Anshika">

  <!-- 1 · the cover: Ganesha, the invocation, the couple, the date -->
  <section class="page page--1" id="p1">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" decoding="async">${bells(5.5, 11.5, false)}
      <div class="flow" style="--top:12.5;--side:11;--bottom:2">
        <img class="orn drop" style="width:calc(var(--cq) * 11);margin-top:0;--d:.2s" src="assets/el/ganesha.webp" alt="Ganesha">
        <p class="om rise" lang="sa" style="margin-top:calc(var(--cq) * 1.6);--d:.4s">${OM}</p>
        <p class="shloka shloka--2 rise" lang="sa" style="--d:.55s">${SHLOKA.map((l) => `<span>${l}</span>`).join('')}</p>
        <img class="orn rise" style="width:calc(var(--cq) * 22);margin:calc(var(--cq) * 2.6) auto 0;--d:.65s" src="assets/el/garland.webp" alt="">
        <p class="caps caps--sm gap-m rise" style="--d:.8s">The Wedding of</p>
        <h1 class="couple-names">
          <span class="script script--xl rise" style="--d:1s">Himanshu</span>
          <span class="amp rise" style="--d:1.15s" aria-label="and"><span class="amp__line" aria-hidden="true"></span><span class="amp__and" aria-hidden="true">&amp;</span><span class="amp__line" aria-hidden="true"></span></span>
          <span class="script script--xl rise" style="--d:1.3s">Anshika</span>
        </h1>
        <img class="orn rise" style="width:calc(var(--cq) * 18);--d:1.45s" src="assets/el/garland.webp" alt="">
        <p class="datebar rise" style="--d:1.6s">25 November 2026<small>Rohini, Delhi</small></p>
        <button class="cue rise" id="cue" type="button" style="--d:1.9s" aria-label="Scroll down to the rest of the invitation">Scroll to explore<svg viewBox="0 0 22 20" aria-hidden="true"><path d="M4 3l7 6 7-6"/><path d="M4 10l7 6 7-6"/></svg></button>
      </div>
    </div>
  </section>

  <!-- 2 · the families: the groom's, then the bride's, exactly as the family wrote them -->
  <section class="page" id="p-fam">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">${bells(5.5, 11.5, true)}
      <div class="flow" style="--top:24;--side:11">
        <h2 class="script script--lg rise">Our Families</h2>
        <img class="orn rise" style="width:calc(var(--cq) * 18);--d:.15s" src="assets/el/garland.webp" alt="" loading="lazy">
        <div class="fam rise" style="--d:.25s">
          <p class="fam__l">The Groom</p>
          <h3 class="fam__n">Himanshu</h3>
          <p class="fam__k">Son of</p>
          <p class="fam__p">Smt. Kanchan Shukla and<br>Sh. Ravi Shankar Shukla</p>
          <p class="fam__k">Grandson of</p>
          <p class="fam__g">Smt. Sunderpati Shukla and<br>Late Shri Shyam Nath Shukla</p>
        </div>
        <p class="fam-sep rise" aria-hidden="true">&amp;</p>
        <div class="fam rise" style="--d:.1s">
          <p class="fam__l">The Bride</p>
          <h3 class="fam__n">Anshika</h3>
          <p class="fam__k">Daughter of</p>
          <p class="fam__p">Smt. Kamlesh Tiwari and<br>Shri Shiv Bahadur Tiwari</p>
          <p class="fam__k">Granddaughter of</p>
          <p class="fam__g">Late Shri Ram Sunder Tiwari</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 3 · the wedding day -->
  <section class="page" id="p-wedding">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p4.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      ${P4BELLS}
      <img class="el swing" style="left:2.5%;top:${at(57, 177.68)};width:5%;--d:.9s" src="assets/el/bell2.webp" alt="" loading="lazy">
      <img class="el swing" style="right:3%;top:${at(59, 177.68)};width:5%;--d:1s" src="assets/el/bell2.webp" alt="" loading="lazy">
      <div class="flow" style="--top:36;--side:14">
        <h2 class="script script--md rise">The Wedding Day</h2>
        <p class="datebar gap-m rise" style="--d:.15s">Wednesday<small>25 November 2026</small></p>
        <ol class="tl">${DAY.map((e, i) => `
          <li class="rise" style="--d:${(.15 + i * .15).toFixed(2)}s"><span class="medal" aria-hidden="true"><svg viewBox="0 0 48 48">${ICON[e.icon]}</svg></span>
            <div><h3 class="ev__name">${esc(e.name)}</h3><p class="ev__time">${esc(e.time)}</p></div></li>`).join('')}
        </ol>
        <img class="orn rise" style="width:calc(var(--cq) * 16);--d:.2s" src="assets/el/garland.webp" alt="" loading="lazy">
        <p class="venue-for rise">Venue – ${esc(VENUE.name)}, Karala, Delhi</p>
      </div>
    </div>
  </section>

  <!-- 4 · the venue: a dhol for the celebration, the name, the address, the family's own map link -->
  <section class="page" id="p-venue">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      ${TASSELS}
      <div class="flow" style="--top:31;--side:14">
        <h2 class="script script--md rise">Wedding Venue</h2>
        <div class="dhol pop" style="--d:.15s"><img src="assets/el/dhol.webp" alt="A wedding dhol with its two sticks, trimmed in maroon and gold" width="780" height="650" loading="lazy" decoding="async"></div>
        <svg class="pin" viewBox="0 0 24 24" aria-hidden="true">${PINPATH}</svg>
        <p class="venue rise">${esc(VENUE.name)}</p>
        <p class="addr rise" style="--d:.15s">${VENUE.lines.map((l) => `<span>${esc(l)}</span>`).join('')}</p>
        <p class="venue-for rise" style="--d:.25s">for the Ghudchadi &amp; the Baraat</p>
        <a class="maps rise" data-maps="utsav" target="_blank" rel="noopener" style="--d:.35s"><svg viewBox="0 0 24 24" aria-hidden="true">${PINPATH}</svg><span>View on Map</span></a>
      </div>
    </div>
  </section>

  <!-- 5 · Save the Date: a gold-foil scratch card with the HA monogram; underneath, the date. Then Add to Calendar -->
  <section class="page" id="p-save">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">${bells(5.5, 11.5, true)}
      <div class="flow" style="--top:24;--side:14">
        <h2 class="script script--lg rise">Save the Date</h2>
        <div class="scard rise" id="scard" style="--d:.3s">
          <div class="scard__face" id="scardFace">
            <p class="scard__kicker">Our Wedding</p>
            <p class="scard__day">Wednesday</p>
            <p class="scard__num">25</p>
            <p class="scard__month">November <span>2026</span></p>
            <img class="scard__orn" src="assets/el/garland.webp" alt="" loading="lazy">
            <p class="scard__place">Rohini, Delhi</p>
          </div>
          <canvas class="scard__foil" id="foil" role="button" tabindex="0" aria-label="Scratch card: rub it with your finger or the mouse to reveal our wedding date. Press Enter to reveal." aria-describedby="scardNote"></canvas>
          <span class="scard__hint" id="scardHint" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 11.2V5.5a1.5 1.5 0 0 1 3 0v4.7l.1-1.2a1.5 1.5 0 0 1 3 .1v1.3a1.5 1.5 0 0 1 3 .2V12a1.5 1.5 0 0 1 2.9.3v3.4c0 3.5-2.6 6.3-6.2 6.3h-1.3c-2 0-3.4-.8-4.7-2.4L5.7 15.6a1.6 1.6 0 0 1 2.3-2.2z"/></svg></span>
          <p class="sr-only" id="scardNote" aria-live="polite">Scratch the card to reveal the date.</p>
        </div>
        <button class="maps cal-btn rise" id="calBtn" type="button" style="--d:.4s" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h2v2h6V2h2v2h3v18H4V4h3zm-1 7v11h12V9zm2 2h3v3H8z"/></svg><span>Add to Calendar</span></button>
      </div>
    </div>
  </section>

  <!-- 6 · the countdown to the wedding day (25 November 2026, 5:00 PM IST, the Ghudchadi), worked out live -->
  <section class="page" id="p-countdown">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p4.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      ${P4BELLS}
      <div class="flow" style="--top:25;--side:14">
        ${MONO(25)}
        <p class="caps caps--sm gap-l rise" style="--d:.15s">Counting down to</p>
        <h2 class="script script--lg gap-s rise" style="--d:.2s">Our Big Day</h2>
        <div class="cd rise" id="countdown" data-target="${COUNTDOWN}" style="--d:.3s" role="timer" aria-live="off">
          <div class="cd__u"><b data-cd="d">--</b><span>Days</span></div>
          <div class="cd__u"><b data-cd="h">--</b><span>Hours</span></div>
          <div class="cd__u"><b data-cd="m">--</b><span>Minutes</span></div>
          <div class="cd__u"><b data-cd="s">--</b><span>Seconds</span></div>
        </div>
        <p class="script script--md cd__done" id="cdDone" hidden>The Big Day Is Here!</p>
        <p class="datebar gap-m rise" style="--d:.4s">25 November 2026<small>Wednesday · Rohini, Delhi</small></p>
      </div>
    </div>
  </section>

  <!-- the last page: the closing words, and the monogram inside the painted arch -->
  <section class="page page--end" id="p-end">
    <div class="art" style="--h:150">
      <img class="bg" src="assets/bg/p6.webp" alt="" width="1024" height="1536" loading="lazy" decoding="async">
      <img class="el glide" style="left:6%;top:12%;width:15%;--d:.4s" src="assets/el/bird.webp" alt="" loading="lazy">
      <div class="flow" style="--top:6;--side:19;--bottom:0">
        <h2 class="script script--xl rise">With Love</h2>
        <img class="orn rise" style="width:calc(var(--cq) * 18);margin:calc(var(--cq) * 1.2) auto calc(var(--cq) * 2);--d:.2s" src="assets/el/garland.webp" alt="" loading="lazy">
        <p class="message rise" style="--d:.3s">Your gracious presence and blessings will make our wedding day truly memorable.</p>
        <p class="sign rise" style="--d:.4s">Himanshu &amp; Anshika</p>
      </div>
      <!-- inside the painted arch (client, 2026-11-14: "Thank You" here, not the monogram) -->
      <div class="arch-words"><p class="thanks rise" style="--d:.3s">Thank You</p><img class="orn rise" style="width:calc(var(--cq) * 13);margin:calc(var(--cq) * .6) auto 0;--d:.45s" src="assets/el/garland.webp" alt="" loading="lazy"></div>
      <p class="credit">Created by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=${SLUG}" target="_blank" rel="noopener">Invitivals</a></p>
    </div>
  </section>
</main>

<div class="sheet" id="sheet" hidden>
  <div class="sheet__veil" data-close></div>
  <div class="sheet__card" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
    <p class="sheet__kicker">Wednesday · 25 November 2026 · Delhi</p>
    <h2 class="sheet__title" id="sheetTitle">Save the Date</h2>
    <a class="sheet__btn sheet__btn--primary" href="event.ics" download="himanshu-anshika-wedding.ics"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h2v2h6V2h2v2h3v18H4V4h3zm-1 7v11h12V9zm2 2h3v3H8z"/></svg>Apple / Android calendar (.ics)</a>
    <a class="sheet__btn" id="gcal" href="${GCAL}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5v5.4l3.6 2.1-.8 1.3L11 13V7z"/></svg>Google Calendar</a>
    <button class="sheet__close" type="button" data-close>Close</button>
  </div>
</div>
<noscript><p style="padding:40px 24px;text-align:center;font-family:Georgia,serif;color:#5a3a30">Please enable JavaScript to open this invitation.</p></noscript>
<script type="module" src="js/app.js?v=${V}"></script>
</body>
</html>
`;
const config = `/* written by tools/himanshu-anshika-wedding.mjs — edit the tool, not this file.
   Himanshu & Anshika, the wedding. The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: '${SLUG}',
  /* the song; null = no music and no music button */
  music: 'assets/media/music.mp3',
  /* the venue link exactly as the family supplied it */
  venues: ${JSON.stringify({ utsav: { name: VENUE.name, address: VENUE.address, mapsUrl: VENUE.mapsUrl } }, null, 2).replace(/\n/g, '\n  ')},
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
`;
fs.writeFileSync(path.join(D, 'index.html'), html);
fs.writeFileSync(path.join(D, 'config.js'), config);
fs.writeFileSync(path.join(D, 'event.ics'), ICS);
console.log('✓', SLUG);
