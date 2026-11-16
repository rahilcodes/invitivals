#!/usr/bin/env node
/* Shashidar Reddy & Vedhashree — the wedding, Thursday 19 November 2026, S.N.R. Convention, Attapur, Hyderabad
   (client brief 2026-11-15). A separate invitation at public/shashidar-vedhashree-wedding. The client chose the
   Lokesh & Akansha page as the reference for the design; that page (public/lokesh-akansha-wedding) is only ever READ.

     node tools/shweta-varun-logo.mjs shashidar-vedhashree-wedding shv     once: the monogram cut off its painted checkerboard
     node tools/shashidar-vedhashree-wedding.mjs init                      papers, ornaments, stylesheet, page script, song, the client's pictures
     SLUG=shashidar-vedhashree-wedding MARK=shv node tools/saicharan-lakshmi-cl.mjs               the envelope's seal
     SLUG=shashidar-vedhashree-wedding MARK=shv FFMPEG=… node tools/saicharan-lakshmi-film.mjs    the film, then cut -t 4.0 → opening-shv-v2.mp4
     node tools/shashidar-vedhashree-wedding.mjs init                      again: the clean transparent monogram back over the seal tool's
     node tools/shashidar-vedhashree-wedding.mjs                           index.html, config.js (after every change of words)
   The link-preview cover: tools/shashidar-vedhashree-wedding-og.html.

   The client's order of slides: opening and cover · Save the Date (shown outright, no scratch card) · Our Families ·
   Pellikoduku · Wedding Ceremony and venue · the final greeting. Not on this page, as asked: scratch card, RSVP,
   wishes, any form; nothing they did not ask for either (no calendar sheet, no countdown).
   Every name and detail is exactly as the family wrote it; no venue name or address is shown for the Pellikoduku
   because none was supplied (only its map link). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const SLUG = 'shashidar-vedhashree-wedding', D = path.join(ROOT, 'public', SLUG), REF = path.join(ROOT, 'public/lokesh-akansha-wedding');
const SRC = path.join(ROOT, 'invites/src', SLUG);
const URL_ = `https://invitivals.com/${SLUG}/`, V = 4, COVER = 'cover-shashidar-vedhashree.jpg';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* both links exactly as the family supplied them */
const MAPS = { pellikoduku: 'https://maps.app.goo.gl/YChWv6wywWbBsaX59?g_st=aw' /* the family's new link (2026-11-15) */, wedding: 'https://share.google/KiSOigmUouCuVlQQr' };

const CSS = `

/* ═════════ Shashidar Reddy & Vedhashree: this invitation's own pieces ═════════ */
:root { --paper: #efdcc0; --gold: #9c6f24; --gold-light: #d8b45f; }
/* the cover: both names on one rhythm ("Shashidar Reddy" is long), and the couple's own photograph under an arch */
.couple-names .script--xl { font-size: calc(var(--cq) * 11.4); white-space: nowrap; }
.portrait { position: relative; width: calc(var(--cq) * 60); aspect-ratio: 3 / 4; margin: calc(var(--cq) * 3.4) 0 calc(var(--cq) * 1.6);
  border-radius: calc(var(--cq) * 30) calc(var(--cq) * 30) calc(var(--cq) * 2) calc(var(--cq) * 2); overflow: hidden;
  box-shadow: 0 0 0 calc(var(--cq) * 1.1) #fbf1e1, 0 0 0 calc(calc(var(--cq) * 1.1) + 1.5px) var(--gold-light), 0 0 0 calc(var(--cq) * 2) rgba(251, 241, 225, .55), 0 calc(var(--cq) * 2.4) calc(var(--cq) * 4.6) rgba(90, 40, 25, .32); }
.portrait img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 50% 0; }
/* a warm light from above and a soft fall into the paper's own ivory at the foot, so the picture sits in the page */
.portrait::after { content: ''; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to bottom, rgba(255, 236, 200, .16), rgba(255, 236, 200, 0) 30%, rgba(239, 220, 192, 0) 80%, rgba(239, 220, 192, .5)); box-shadow: inset 0 0 calc(var(--cq) * 6) rgba(120, 70, 30, .22); }
/* the couple's S&V monogram, by itself: no disc, no box, only its own shadow on the paper */
.mono { display: block; flex: none; width: calc(var(--cq) * var(--w, 30)); height: auto; filter: drop-shadow(0 calc(var(--cq) * .9) calc(var(--cq) * 1.4) rgba(96, 58, 12, .34)) drop-shadow(0 0 calc(var(--cq) * .3) rgba(110, 70, 20, .3)); }
/* the closing arch says "Thank You" (client, 2026-11-15: no monogram there) */
.thanks { font-family: var(--script); color: var(--maroon); font-size: calc(var(--cq) * 10.4); line-height: 1.1; white-space: nowrap; }
/* Save the Date, shown outright: the card of the design, taller for the hour and the place; nothing to scratch */
.scard.scard--open { aspect-ratio: 4 / 5.5; margin-top: calc(var(--cq) * 3); }
.scard--open .scard__num { font-size: calc(var(--cq) * 15); }
.scard__time { font-family: var(--caps); font-weight: 600; color: var(--maroon); font-size: calc(var(--cq) * 3.9); letter-spacing: .14em; padding-left: .14em; }
.scard__lagna { font-family: var(--serif); font-style: italic; font-weight: 600; color: var(--soft); font-size: calc(var(--cq) * 3.6); margin-top: calc(var(--cq) * .4); }
.scard--open .scard__place { margin-top: calc(var(--cq) * 1.6); line-height: 1.6; letter-spacing: .14em; padding-left: .14em; font-size: calc(var(--cq) * 2.7); }
.scard--open .scard__orn { margin: calc(var(--cq) * 1.2) 0 calc(var(--cq) * 1); }
/* the families: the invocation, the three blessings, the invitation, the two names */
.invoke { font-family: var(--caps); font-weight: 600; color: var(--maroon); font-size: calc(var(--cq) * 3.3); letter-spacing: .12em; padding-left: .12em; line-height: 1.7; white-space: nowrap; }
.bless { font-family: var(--serif); font-style: italic; font-weight: 600; color: var(--gold); font-size: calc(var(--cq) * 4); line-height: 1.5; white-space: nowrap; margin-top: calc(var(--cq) * .6); }
.para--invite { font-size: calc(var(--cq) * 3.8); line-height: 1.5; margin-top: calc(var(--cq) * 2.4); }
.fam__n.fam__n--sm { font-size: calc(var(--cq) * 8.8); font-weight: 400; white-space: nowrap; }
.fam__n.fam__n--xs { font-size: calc(var(--cq) * 7.6); }
.with { display: flex; align-items: center; gap: calc(var(--cq) * 2.4); width: calc(var(--cq) * 44); margin: calc(var(--cq) * 4) 0; font-family: var(--caps); font-weight: 600; color: var(--gold); font-size: calc(var(--cq) * 3.4); letter-spacing: .3em; padding-left: .3em; }
.with::before, .with::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, transparent, var(--gold-light), transparent); }
/* an event: its medallion, its hour, a line under it, the address line by line */
.medal--lg { width: calc(var(--cq) * 19); height: calc(var(--cq) * 19); margin-top: calc(var(--cq) * 3.4); }
.hours { font-family: var(--caps); font-weight: 600; color: var(--gold); font-size: calc(var(--cq) * 4.3); letter-spacing: .1em; margin-top: calc(var(--cq) * 3); }
.lagna { font-family: var(--serif); font-style: italic; font-weight: 600; color: var(--soft); font-size: calc(var(--cq) * 4); margin-top: calc(var(--cq) * .6); }
.addr span { display: block; }
/* "Wedding Ceremony" between the curtains of its paper: a little smaller than the other headings so it clears them */
.script--fit { font-size: calc(var(--cq) * 7.4); }
.maps--wide { padding: 0 calc(var(--cq) * 5); font-size: calc(var(--cq) * 3.2); letter-spacing: .14em; }
/* the final greeting */
.page--end .script--end { font-size: calc(var(--cq) * 10.6); line-height: 1.08; }
.page--end .message { font-size: calc(var(--cq) * 4.1); }
.hosts { font-family: var(--serif); font-weight: 700; color: var(--maroon); font-size: calc(var(--cq) * 4.4); line-height: 1.3; margin-top: calc(var(--cq) * 1.6); text-wrap: balance; }
/* "Invited by -" over the hosts (client, 2026-11-15) */
.invited { font-family: var(--caps); font-weight: 600; color: var(--gold); font-size: calc(var(--cq) * 3.3); letter-spacing: .22em; padding-left: .22em; text-transform: uppercase; }
.page--end .hosts { font-size: calc(var(--cq) * 4.6); line-height: 1.4; margin-top: calc(var(--cq) * 1.4); }
`;

if (process.argv[2] === 'init') {
  const { default: sharp } = await import('sharp');
  for (const d of ['assets/bg', 'assets/el', 'assets/media', 'css', 'js']) fs.mkdirSync(path.join(D, d), { recursive: true });
  for (const f of ['bg/p1', 'bg/p2', 'bg/p4', 'bg/p6', 'el/bell', 'el/bell2', 'el/ganesha', 'el/garland', 'el/bird', 'el/tasselA', 'el/tasselB'])
    fs.copyFileSync(path.join(REF, `assets/${f}.webp`), path.join(D, `assets/${f}.webp`));
  for (const f of ['favicon.svg', '.htaccess']) fs.copyFileSync(path.join(REF, f), path.join(D, f));
  /* the family's song (client, 2026-11-15): "Kalyanam Vybhogam" (Srinivasa Kalyanam), re-encoded to 192 kbps for phones —
     ffmpeg -i <the client's file> -vn -c:a libmp3lame -b:a 192k -ar 44100 -map_metadata -1 invites/src/shashidar-vedhashree-wedding/kalyanam-vybhogam.mp3 */
  fs.copyFileSync(path.join(SRC, 'kalyanam-vybhogam.mp3'), path.join(D, 'assets/media/kalyanam-vybhogam.mp3'));
  fs.writeFileSync(path.join(D, 'css/invite.css'), fs.readFileSync(path.join(REF, 'css/invite.css'), 'utf8').replace(/\r\n/g, '\n')
    .replace('Lokesh & Akansha — the wedding, groom side (shared by lokesh-akansha-wedding and lokesh-akansha-wedding-day;\n   written by tools/lokesh-akansha-wedding.mjs from this file).', 'Shashidar Reddy & Vedhashree — the wedding (set up once by tools/shashidar-vedhashree-wedding.mjs init; this copy is this page\'s own).') + CSS);
  /* the page script: the same opening, music, scroll-in and petals; this page has no scratch card, calendar sheet or
     countdown, and the script's parts for those simply find nothing to run on */
  let js = fs.readFileSync(path.join(REF, 'js/app.js'), 'utf8').replace(/\r\n/g, '\n');
  const sw = (a, b) => { if (js.split(a).length !== 2) throw new Error('app.js: ' + a.slice(0, 50)); js = js.replace(a, () => b); };
  sw('Lokesh & Akansha — the wedding, groom side.', 'Shashidar Reddy & Vedhashree — the wedding (no scratch card, calendar sheet or countdown on this page: those parts below stay idle).');
  sw("'../config.js?v=3'", "'../config.js?v=3'");
  sw("'assets/el/la-logo.webp'", "'assets/el/shv-logo.webp'");
  fs.writeFileSync(path.join(D, 'js/app.js'), js);
  /* the client's own pictures, only resized: the monogram, the couple, S.N.R. Convention */
  await sharp(path.join(SRC, 'shv-logo.png')).resize({ width: 900 }).webp({ quality: 92, alphaQuality: 96, effort: 6 }).toFile(path.join(D, 'assets/el/shv-logo.webp'));
  await sharp(path.join(SRC, 'couple.jpg')).resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 88, effort: 6 }).toFile(path.join(D, 'assets/el/couple.webp'));
  await sharp(path.join(SRC, 'venue-snr-convention.jpg')).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 86, effort: 6 }).toFile(path.join(D, 'assets/el/venue.webp'));
  console.log('✓ init', SLUG);
  process.exit(0);
}

/* the Pellikoduku's medallion: a kalasha with mango leaves and a coconut */
const KALASHA = '<path d="M14 30c0-6 4.500-10 10-10s10 4 10 10-4.500 9-10 9-10-3-10-9z"/><path d="M15.500 26.500h17M15.500 33.500h17"/><circle cx="20" cy="30" r=".9"/><circle cx="24" cy="30" r=".9"/><circle cx="28" cy="30" r=".9"/><path d="M19 39l-1 3h12l-1-3"/><path d="M20.500 20v-2.500h7V20M18.500 17.500h11"/><path d="M24 6.500c2.300 0 3.600 2.100 3.600 4.600 0 2.400-1.300 4.300-3.600 4.300s-3.600-1.900-3.600-4.300c0-2.500 1.300-4.600 3.600-4.600z"/><path d="M20.500 16.500c-3.500-.500-6.500-2.500-8-5.500 3.200-.300 6.200 1.500 8 4.500M27.500 16.500c3.500-.500 6.500-2.500 8-5.500-3.200-.300-6.200 1.500-8 4.500M19.500 17.500c-3.500 1-7 .500-9.500-1.500 3-1.200 6.500-1 9.500 1M28.500 17.500c3.500 1 7 .500 9.500-1.500-3-1.200-6.500-1-9.500 1"/>';
const PINPATH = '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>';
const at = (pct, H) => `calc(var(--cq) * ${(pct * H / 100).toFixed(1)})`;
const MONO = (w, cls = 'pop', d = '.1s', lazy = true) => `<img class="mono ${cls}" style="--w:${w};--d:${d}" src="assets/el/shv-logo.webp" alt="The couple's S &amp; V monogram in gold, ringed by a laurel wreath over a lotus" width="900" height="900"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
const TASSELS = `<img class="el swing" style="left:5.5%;top:${at(36, 169.29)};width:8%;--d:.6s" src="assets/el/tasselB.webp" alt="" loading="lazy">
      <img class="el swing" style="right:5.5%;top:${at(38, 169.29)};width:7%;--d:.8s" src="assets/el/tasselA.webp" alt="" loading="lazy">`;
const bells = (y1, y2, lazy, H = 177.68) => [['left:12%', y1, 5, .9], ['left:6%', y2, 5.6, 1.1], ['right:12%', y1, 5, 1], ['right:6%', y2, 5.6, 1.2]].map(([side, y, w, d]) => `
      <img class="el swing" style="${side};top:${at(y, H)};width:${w}%;--d:${d}s" src="assets/el/bell.webp" alt=""${lazy ? ' loading="lazy"' : ''}>`).join('');
const P4BELLS = `<img class="el swing" style="left:12%;top:${at(15, 177.68)};width:5.5%;--d:.5s" src="assets/el/bell.webp" alt="" loading="lazy">
      <img class="el swing" style="right:11%;top:${at(20, 177.68)};width:5.5%;--d:.6s" src="assets/el/bell.webp" alt="" loading="lazy">`;
const mapBtn = (k, label, cls = '') => `<a class="maps ${cls} rise" data-maps="${k}" target="_blank" rel="noopener" style="--d:.35s"><svg viewBox="0 0 24 24" aria-hidden="true">${PINPATH}</svg><span>${label}</span></a>`;

const TITLE = 'Shashidar Reddy & Vedhashree · Wedding Invitation', OGD = '19 November 2026 · S.N.R. Convention, Hyderabad. Tap to open the invitation.';
const html = `<!DOCTYPE html>
<!-- written by tools/shashidar-vedhashree-wedding.mjs — edit the tool, not this file -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${esc(TITLE)} · Invitivals</title>
<meta name="description" content="You are invited to the wedding of Chi. Shashidar Reddy and Chi. La. Sow. Vedhashree — Thursday, 19 November 2026, 9:50 AM, S.N.R. Convention, Attapur, Hyderabad.">
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
<meta property="og:image:alt" content="Shashidar Reddy &amp; Vedhashree · Wedding Invitation · 19 November 2026 · S.N.R. Convention, Hyderabad">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(TITLE)}">
<meta name="twitter:description" content="${esc(OGD)}">
<meta name="twitter:image" content="${URL_}assets/${COVER}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" as="image" href="assets/bg/opening-shv.webp" fetchpriority="high">
<link rel="modulepreload" href="js/app.js?v=${V}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/invite.css?v=${V}">
</head>
<body class="is-closed">

<!-- opening: the sealed envelope (the couple's gold S&V monogram on its wax seal); one tap plays the film, which fades into the cover -->
<div class="opening" id="opening">
  <img class="opening__art" src="assets/bg/opening-shv.webp" alt="A sealed cream envelope with the couple's gold S &amp; V monogram on its wax seal" width="941" height="1672" decoding="async" fetchpriority="high">
  <video class="opening__film" id="film" playsinline webkit-playsinline muted preload="auto" src="assets/media/opening-shv-v2.mp4" aria-hidden="true"></video>
  <button class="tap" id="tap" type="button"><span class="tap__ring" aria-hidden="true"></span><span>Tap to Open</span></button>
</div>

<audio id="music" loop preload="none"></audio>
<button class="mute" id="mute" type="button" aria-pressed="false" aria-label="Pause music" hidden>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path class="mute__note" d="M9 18.5a2.5 2.5 0 1 1-2-2.45V6l10-2v11.5a2.5 2.5 0 1 1-2-2.45V7.4l-6 1.2z"/><path class="mute__bar" d="M4 4l16 16"/></svg>
</button>
<canvas class="petals" id="petals" aria-hidden="true"></canvas>

<main class="stage" id="stage" aria-label="Wedding invitation of Shashidar Reddy and Vedhashree">

  <!-- 1 · the cover: Ganesha, the couple's names, their own photograph under an arch, the date -->
  <section class="page page--1" id="p1">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" decoding="async">${bells(5.5, 11.5, false)}
      <div class="flow" style="--top:13;--side:10;--bottom:2">
        <img class="orn drop" style="width:calc(var(--cq) * 11);margin-top:0;--d:.2s" src="assets/el/ganesha.webp" alt="Ganesha">
        <img class="orn rise" style="width:calc(var(--cq) * 22);margin:calc(var(--cq) * 1.6) auto 0;--d:.4s" src="assets/el/garland.webp" alt="">
        <p class="caps caps--sm gap-m rise" style="--d:.6s">The Wedding of</p>
        <h1 class="couple-names">
          <span class="script script--xl rise" style="--d:.8s">Shashidar Reddy</span>
          <span class="amp rise" style="--d:.95s" aria-label="and"><span class="amp__line" aria-hidden="true"></span><span class="amp__and" aria-hidden="true">&amp;</span><span class="amp__line" aria-hidden="true"></span></span>
          <span class="script script--xl rise" style="--d:1.1s">Vedhashree</span>
        </h1>
        <figure class="portrait pop" style="--d:1.25s"><img src="assets/el/couple.webp" alt="Shashidar Reddy and Vedhashree in their wedding garlands, he in an ivory sherwani with a maroon stole, she in a maroon and gold saree" width="1000" height="1333" decoding="async"></figure>
        <img class="orn rise" style="width:calc(var(--cq) * 18);--d:1.4s" src="assets/el/garland.webp" alt="">
        <p class="datebar rise" style="--d:1.5s">Thursday · 19 November 2026<small>Hyderabad</small></p>
        <button class="cue rise" id="cue" type="button" style="--d:1.8s" aria-label="Scroll down to the rest of the invitation">Scroll to explore<svg viewBox="0 0 22 20" aria-hidden="true"><path d="M4 3l7 6 7-6"/><path d="M4 10l7 6 7-6"/></svg></button>
      </div>
    </div>
  </section>

  <!-- 2 · Save the Date: the date, hour and place shown outright (the client asked for no scratch card) -->
  <section class="page" id="p-save">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      ${TASSELS}
      <div class="flow" style="--top:31;--side:14">
        <h2 class="script script--lg rise">Save the Date</h2>
        ${MONO(24, 'pop', '.15s')}
        <div class="scard scard--open is-revealed rise" style="--d:.3s">
          <div class="scard__face">
            <p class="scard__kicker">Our Wedding</p>
            <p class="scard__day">Thursday</p>
            <p class="scard__num">19</p>
            <p class="scard__month">November <span>2026</span></p>
            <img class="scard__orn" src="assets/el/garland.webp" alt="" loading="lazy">
            <p class="scard__time">9:50 AM</p>
            <p class="scard__lagna">Dhanur Lagnam</p>
            <p class="scard__place">S.N.R. Convention,<br>Attapur, Hyderabad.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3 · Our Families: the invocation, the invitation, the groom and the bride — exactly as the family wrote them -->
  <section class="page" id="p-fam">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">${bells(5.5, 11.5, true)}
      <div class="flow" style="--top:24;--side:10">
        <h2 class="script script--lg rise">Our Families</h2>
        <img class="orn rise" style="width:calc(var(--cq) * 18);--d:.1s" src="assets/el/garland.webp" alt="" loading="lazy">
        <p class="invoke rise" style="--d:.15s">|| Sri Ganeshaya Namah ||</p>
        <p class="bless rise" style="--d:.2s">Srirasthu · Shubhamasthu · Avighnamasthu</p>
        <p class="para para--invite rise" style="--d:.25s">We solicit your gracious presence with family and friends on the auspicious occasion of the marriage of our youngest brother.</p>
        <img class="orn rise" style="width:calc(var(--cq) * 18);--d:.3s" src="assets/el/garland.webp" alt="" loading="lazy">
        <div class="fam rise" style="--d:.1s">
          <h3 class="fam__n fam__n--sm">Chi. Shashidar Reddy</h3>
          <p class="fam__k">Younger son of</p>
          <p class="fam__p">Smt. Challa Bhagyamma and<br>Late Sri. Challa Bugga Reddy</p>
        </div>
        <p class="with rise" style="--d:.1s">WITH</p>
        <div class="fam rise" style="--d:.15s">
          <h3 class="fam__n fam__n--sm fam__n--xs">Chi. La. Sow. Vedhashree</h3>
          <p class="fam__k">Youngest daughter of</p>
          <p class="fam__p">Smt. Dosala Chandrakala &amp;<br>Sri. Shekhar Reddy</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4 · the Pellikoduku: its day and hour, and the family's own map link (no venue name or address was supplied) -->
  <section class="page" id="p-pellikoduku">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p4.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      ${P4BELLS}
      <div class="flow" style="--top:31;--side:14">
        <h2 class="script script--lg rise">Pellikoduku</h2>
        <span class="medal medal--lg pop" style="--d:.1s" aria-hidden="true"><svg viewBox="0 0 48 48">${KALASHA}</svg></span>
        <p class="datebar gap-m rise" style="--d:.15s">Monday<small>16 November 2026</small></p>
        <p class="hours rise" style="--d:.2s">5:00 PM</p>
        <img class="orn rise" style="width:calc(var(--cq) * 16);--d:.25s" src="assets/el/garland.webp" alt="" loading="lazy">
        ${mapBtn('pellikoduku', 'View Event Location')}
      </div>
    </div>
  </section>

  <!-- 5 · the wedding ceremony and its venue: the family's own picture of S.N.R. Convention, the address, their map link -->
  <section class="page" id="p-wedding">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      <div class="flow" style="--top:31;--side:13">
        <h2 class="script script--md script--fit rise">Wedding Ceremony</h2>
        <p class="datebar gap-m rise" style="--d:.1s">Thursday<small>19 November 2026</small></p>
        <p class="hours rise" style="--d:.15s">Muhurtham: 9:50 AM</p>
        <p class="lagna rise" style="--d:.2s">Dhanur Lagnam</p>
        <img class="orn rise" style="width:calc(var(--cq) * 16);--d:.25s" src="assets/el/garland.webp" alt="" loading="lazy">
        <p class="caps caps--sm rise">Wedding Venue</p>
        <div class="venue-frame pop" style="--d:.15s"><img src="assets/el/venue.webp" alt="S.N.R. Convention, its ivory front and gold lettering lit up at dusk" width="1200" height="675" loading="lazy" decoding="async"></div>
        <svg class="pin" viewBox="0 0 24 24" aria-hidden="true">${PINPATH}</svg>
        <p class="venue rise">S.N.R. Convention</p>
        <p class="addr rise" style="--d:.15s"><span>Pillar No. 122, Attapur,</span><span>Ring Road, Hyderabad.</span></p>
        ${mapBtn('wedding', 'View on Google Maps', 'maps--wide')}
      </div>
    </div>
  </section>

  <!-- 6 · the final greeting: the closing words, the hosts, and "Thank You" inside the painted arch -->
  <section class="page page--end" id="p-end">
    <div class="art" style="--h:150">
      <img class="bg" src="assets/bg/p6.webp" alt="" width="1024" height="1536" loading="lazy" decoding="async">
      <img class="el glide" style="left:5%;top:15%;width:13%;--d:.4s" src="assets/el/bird.webp" alt="" loading="lazy">
      <div class="flow" style="--top:5;--side:17;--bottom:0">
        <h2 class="script script--end rise">With Love<br>&amp; Blessings</h2>
        <img class="orn rise" style="width:calc(var(--cq) * 18);margin:calc(var(--cq) * 1) auto calc(var(--cq) * 1.6);--d:.2s" src="assets/el/garland.webp" alt="" loading="lazy">
        <!-- invited by, exactly as the family wrote it (2026-11-15) -->
        <p class="invited rise" style="--d:.3s">Invited by -</p>
        <p class="hosts rise" style="--d:.4s">Smt. &amp; Sri Challa Pranitha &amp; Chandra Reddy (Sandeep)<br>and Sri. Suman Reddy</p>
      </div>
      <!-- inside the painted arch (client, 2026-11-15: "Thank You" here, not the monogram) -->
      <div class="arch-words"><p class="thanks rise" style="--d:.3s">Thank You</p><img class="orn rise" style="width:calc(var(--cq) * 13);margin:calc(var(--cq) * .6) auto 0;--d:.45s" src="assets/el/garland.webp" alt="" loading="lazy"></div>
      <p class="credit">Created by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=${SLUG}" target="_blank" rel="noopener">Invitivals</a></p>
    </div>
  </section>
</main>

<noscript><p style="padding:40px 24px;text-align:center;font-family:Georgia,serif;color:#5a3a30">Please enable JavaScript to open this invitation.</p></noscript>
<script type="module" src="js/app.js?v=${V}"></script>
</body>
</html>
`;
const config = `/* written by tools/shashidar-vedhashree-wedding.mjs — edit the tool, not this file.
   Shashidar Reddy & Vedhashree, the wedding. The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: '${SLUG}',
  /* the family's song, "Kalyanam Vybhogam" (client, 2026-11-15); null = no music and no music button */
  music: 'assets/media/kalyanam-vybhogam.mp3',
  /* the map links exactly as the family supplied them */
  venues: ${JSON.stringify({ pellikoduku: { name: 'Pellikoduku', mapsUrl: MAPS.pellikoduku }, wedding: { name: 'S.N.R. Convention', address: 'Pillar No. 122, Attapur, Ring Road, Hyderabad.', mapsUrl: MAPS.wedding } }, null, 2).replace(/\n/g, '\n  ')},
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
`;
fs.writeFileSync(path.join(D, 'index.html'), html);
fs.writeFileSync(path.join(D, 'config.js'), config);
console.log('✓', SLUG);
