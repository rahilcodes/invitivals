#!/usr/bin/env node
/* Lokesh & Akansha — writes the two groom-side WEDDING pages (client brief 2026-11-04):

     node tools/lokesh-akansha-wedding.mjs [slug …]      (default: lokesh-akansha-wedding only; name lokesh-akansha-wedding-day to rebuild it)

   public/lokesh-akansha-wedding       all functions: the loving families + seven names, Haldi, Mehndi & Sangeet, the wedding day
   public/lokesh-akansha-wedding-day   the wedding day only: no "loving families" sentence, Pooja & Ashish and Pinki & Rohit,
                                       the closing from Anvay and Aryav to their Mama and Maami

   Writes index.html and config.js for both. css/invite.css, js/app.js, favicon.svg and .htaccess are kept in
   public/lokesh-akansha-wedding and copied to the wedding-day page, with its assets (run tools/lokesh-akansha-wedding-art.mjs
   and the seal tools first, see that file). Everything the family wrote is set here exactly as written: the groom first
   everywhere, mother before father and grandmother before grandfather, "Ramprayag", "Shodapur", Feras at 03:00 PM.
   The design follows public/lakshmi-saicharan-engagement, which is never written to. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const MAIN = 'lokesh-akansha-wedding', DAY = 'lokesh-akansha-wedding-day';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const VENUES = {
  /* both links as the family supplied them in their brief (PDF, 2026-11-02) */
  palm: { name: 'Palm Luxuria Banquets', address: 'Bal Vikas Progressive School Road, Shodapur, Panipat', mapsUrl: 'https://share.google/MfaBFtqryZA8yG071' },
  cosmos: { name: 'COSMOS Cafe & Lounge', address: 'Sector 25, Panipat, Haryana', mapsUrl: 'https://share.google/pOU3fFbjNnsn068Wq' },
};
const SHLOKA = ['शिवशक्त्यात्मरूपाय', 'दम्पत्योः प्रीतये सदा।', 'दाम्पत्यं सफलं भूयात्', 'मङ्गलम् च दिने दिने॥'];
const PRE = [
  { icon: 'haldi', name: 'Haldi Ceremony', time: '10:00 AM' },
  { icon: 'mehndi', name: 'Mehndi & Sangeet', time: '4:00 PM' },
];
const WEDDING = [
  { icon: 'horse', name: 'Ghudchadhi', time: '9:00 AM' },
  { icon: 'dhol', name: 'Baraat', time: '11:00 AM' },
  { icon: 'agni', name: 'Feras', time: '03:00 PM' },   // was "Wedding Ceremony 12:00 PM (Day)" — corrected by the client
];

const VARIANTS = {
  [MAIN]: {
    title: 'Lokesh & Akansha · Wedding Invitation',
    description: 'The loving families of the groom and bride cordially invite you to the wedding of Lokesh & Akansha — Haldi, Mehndi & Sangeet on Wednesday 25 November, and the wedding on Thursday 26 November 2026, Panipat.',
    ogDescription: '25 – 26 November 2026 · Panipat. Tap to open the invitation.',
    lovingFamilies: true,
    welcomeNames: ['Krishnamurari', 'Yatendra Kumar', 'Narender Kumar', 'Virender Kumar', 'Gajender Kumar', 'Umesh', 'Baldev'],
    pairs: false,
    pre: true,
    closing: { message: 'Your gracious presence and blessings will make these joyous occasions truly memorable.', from: ['With love and warm regards,', 'the loving families of the groom and bride'] },
  },
  [DAY]: {
    title: 'Lokesh & Akansha · Wedding Invitation',
    description: 'You and your family are cordially invited to the wedding of Lokesh & Akansha — Thursday, 26 November 2026, Palm Luxuria Banquets, Panipat.',
    ogDescription: 'Thursday, 26 November 2026 · Panipat. Tap to open the invitation.',
    og: 'cover-wedding-day.jpg',              // a new file name, so WhatsApp fetches the cover afresh (client, 2026-11-04)
    state: true,                               // "…, Shodapur, Panipat, Haryana" (client, 2026-11-04, this page)
    lovingFamilies: false,                     // the sentence "The loving families of the bride and groom" is not on this page (client)
    welcomeNames: ['Pooja and Ashish', 'Pinki and Rohit'],
    pairs: true,
    pre: false,
    closing: { message: 'We’re eagerly waiting for your kind presence to bless our Mama and Maami.', kids: 'Anvay and Aryav' },
  },
};

/* line icons for the functions (48 × 48, drawn in maroon on a cream medallion) */
const ICON = {
  haldi: '<path d="M8 26h32c0 8-7 14-16 14S8 34 8 26z"/><path d="M13 26c1-5 5-8 11-8s10 3 11 8"/><path d="M30 18l9-10"/><circle cx="18" cy="23" r=".8"/><circle cx="25" cy="21" r=".8"/><circle cx="29" cy="24" r=".8"/><path d="M18 40l-2 4h16l-2-4"/>',
  mehndi: '<path d="M17 42V24c0-2 3-2 3 0v-11c0-2 3-2 3 0v10-13c0-2 3-2 3 0v13-10c0-2 3-2 3 0v13-5c0-2 3-2 3 0v13c0 6-4 10-9 10s-9-3-9-6z"/><circle cx="25" cy="31" r="3"/><path d="M25 25v3M25 34v3M19 31h3M28 31h3"/>',
  horse: '<path d="M36 43c0-8-1-14-4-19-1-4-1-8-3-11l-2-6-2 5c-3-1-7 0-10 3l-6 7c-2 2-2 5 0 6l3 1c2 0 3-1 4-2l4-2c2 4 2 10-1 16l-1 2"/><circle cx="20" cy="15" r="1"/><path d="M30 13c4 3 7 9 8 16M31 19c3 4 5 9 5 15M16 22l5-7M10 23.5h1.5"/><path d="M27 7l3-3 1 4"/>',
  dhol: '<path d="M10 18c-2 0-3 3-3 6s1 6 3 6M38 18c2 0 3 3 3 6s-1 6-3 6"/><path d="M10 18c6-3 22-3 28 0M10 30c6 3 22 3 28 0"/><path d="M10 18v12M38 18v12M17 17v14M24 16.5v15M31 17v14"/><path d="M16 12l3-4M30 12l-3-4"/>',
  agni: '<path d="M8 40h32M11 40v-6h26v6"/><path d="M14 34v-4h20v4"/><path d="M24 29c-6-3-6-9-1-14 0 4 2 5 3 6 1-3 0-6-1-9 5 3 9 9 4 17"/><path d="M18 29c-2-2-2-5 0-7M30 29c2-2 2-5 0-7"/>',
};
const PIN = '<svg class="pin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
const MAPBTN = (k) => `<a class="maps rise" data-maps="${k}" target="_blank" rel="noopener" style="--d:.5s"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg><span>View on Map</span></a>`;
const TASSELS = `<img class="el swing" style="left:5.5%;top:${at(36, 169.29)};width:8%;--d:.6s" src="assets/el/tasselB.webp" alt="" loading="lazy">
      <img class="el swing" style="right:5.5%;top:${at(38, 169.29)};width:7%;--d:.8s" src="assets/el/tasselA.webp" alt="" loading="lazy">`;
const timeline = (list) => `<ol class="tl">${list.map((e, i) => `
          <li class="rise" style="--d:${(.15 + i * .15).toFixed(2)}s"><span class="medal" aria-hidden="true"><svg viewBox="0 0 48 48">${ICON[e.icon]}</svg></span>
            <div><h3 class="ev__name">${esc(e.name)}</h3><p class="ev__time">${esc(e.time)}</p></div></li>`).join('')}
        </ol>`;
const bells = (y1, y2, H = 177.68) => `
      <img class="el swing" style="left:12%;top:${at(y1, H)};width:5%;--d:.9s" src="assets/el/bell.webp" alt="">
      <img class="el swing" style="left:6%;top:${at(y2, H)};width:5.6%;--d:1.1s" src="assets/el/bell.webp" alt="">
      <img class="el swing" style="right:12%;top:${at(y1, H)};width:5%;--d:1s" src="assets/el/bell.webp" alt="">
      <img class="el swing" style="right:6%;top:${at(y2, H)};width:5.6%;--d:1.2s" src="assets/el/bell.webp" alt="">`;
/* a height on the painting (percent of the painting) as a length that does not change with the page's height */
function at(pct, H) { return `calc(var(--cq) * ${(pct * H / 100).toFixed(1)})`; }

function page(slug) {
  const V = VARIANTS[slug], url = `https://invitivals.com/${slug}/`;
  const invite = V.lovingFamilies
    ? `<h2 class="caps caps--lg rise">The Loving Families</h2>
        <p class="para gap-s rise" style="--d:.15s">of the groom and bride cordially invite you and your family to celebrate the wedding of</p>`
    : `<p class="para rise">You and your family are cordially invited to celebrate the wedding of</p>`;
  const html = `<!DOCTYPE html>
<!-- written by tools/lokesh-akansha-wedding.mjs — edit the tool, not this file -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${esc(V.title)} · Invitivals</title>
<meta name="description" content="${esc(V.description)}">
<meta name="author" content="Invitivals">
<meta name="theme-color" content="#eacfb3">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Invitivals">
<meta property="og:locale" content="en_IN">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(V.title)}">
<meta property="og:description" content="${esc(V.ogDescription)}">
<meta property="og:image" content="${url}assets/${V.og || 'og.jpg?v=2'}">
<meta property="og:image:secure_url" content="${url}assets/${V.og || 'og.jpg?v=2'}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Lokesh &amp; Akansha · The Wedding · ${V.pre ? '25 – 26 November 2026' : '26 November 2026'} · Panipat, Haryana">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(V.title)}">
<meta name="twitter:description" content="${esc(V.ogDescription)}">
<meta name="twitter:image" content="${url}assets/${V.og || 'og.jpg?v=2'}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" as="image" href="assets/bg/opening-la.webp" fetchpriority="high">
<link rel="modulepreload" href="js/app.js?v=2">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Noto+Serif+Devanagari:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/invite.css?v=2">
</head>
<body class="is-closed">

<!-- opening: the sealed envelope (gold L & A seal); one tap plays the film, which fades into the cover -->
<div class="opening" id="opening">
  <img class="opening__art" src="assets/bg/opening-la.webp" alt="A sealed cream envelope with the couple's L &amp; A monogram on its gold wax seal" width="941" height="1672" decoding="async" fetchpriority="high">
  <video class="opening__film" id="film" playsinline webkit-playsinline muted preload="auto" src="assets/media/opening-la-v2.mp4" aria-hidden="true"></video>
  <button class="tap" id="tap" type="button"><span class="tap__ring" aria-hidden="true"></span><span>Tap to Open</span></button>
</div>

<audio id="music" loop preload="none"></audio>
<button class="mute" id="mute" type="button" aria-pressed="false" aria-label="Pause music" hidden>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path class="mute__note" d="M9 18.5a2.5 2.5 0 1 1-2-2.45V6l10-2v11.5a2.5 2.5 0 1 1-2-2.45V7.4l-6 1.2z"/><path class="mute__bar" d="M4 4l16 16"/></svg>
</button>
<canvas class="petals" id="petals" aria-hidden="true"></canvas>

<main class="stage" id="stage" aria-label="Wedding invitation of Lokesh and Akansha">

  <!-- 1 · the cover: Ganesha, the shloka, the couple -->
  <section class="page page--1" id="p1">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" decoding="async">${bells(5.5, 11.5)}
      <div class="flow" style="--top:13.5;--side:13;--bottom:6">
        <img class="orn drop" style="width:calc(var(--cq) * 11);margin-top:0;--d:.2s" src="assets/el/ganesha.webp" alt="Ganesha">
        <img class="orn rise" style="width:calc(var(--cq) * 22);margin:calc(var(--cq) * 1.6) auto calc(var(--cq) * 2.4);--d:.4s" src="assets/el/garland.webp" alt="">
        <p class="shloka rise" lang="sa" style="--d:.55s">${SHLOKA.map((l) => `<span>${l}</span>`).join('')}</p>
        <p class="caps caps--sm gap-l rise" style="--d:.8s">The Wedding of</p>
        <h1 class="couple-names">
          <span class="script script--xl rise" style="--d:1s">Lokesh</span>
          <span class="amp rise" style="--d:1.15s" aria-label="and"><span class="amp__line" aria-hidden="true"></span><span class="amp__and" aria-hidden="true">&amp;</span><span class="amp__line" aria-hidden="true"></span></span>
          <span class="script script--xl rise" style="--d:1.3s">Akansha</span>
        </h1>
        <img class="orn rise" style="width:calc(var(--cq) * 18);--d:1.45s" src="assets/el/garland.webp" alt="">
        <p class="datebar rise" style="--d:1.6s">${V.pre ? '25 – 26 November 2026' : 'Thursday · 26 November 2026'}<small>Panipat, Haryana</small></p>
        <button class="cue rise" id="cue" type="button" style="--d:1.9s" aria-label="Scroll down to the rest of the invitation">Scroll to explore<svg viewBox="0 0 22 20" aria-hidden="true"><path d="M4 3l7 6 7-6"/><path d="M4 10l7 6 7-6"/></svg></button>
      </div>
    </div>
  </section>

  <!-- Save the Date: a gold-foil scratch card; underneath, the dates (scratch with a finger or the mouse) -->
  <section class="page" id="p-save">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      ${TASSELS}
      <div class="flow" style="--top:33;--side:14">
        <h2 class="script script--lg rise">Save the Date</h2>
        <div class="scard rise" id="scard" style="--d:.3s">
          <div class="scard__face" id="scardFace">
            <p class="scard__kicker">Our Wedding</p>
            <p class="scard__day">${V.pre ? 'Wednesday &amp; Thursday' : 'Thursday'}</p>
            <p class="scard__num">${V.pre ? '25<span>–</span>26' : '26'}</p>
            <p class="scard__month">November <span>2026</span></p>
            <img class="scard__orn" src="assets/el/garland.webp" alt="" loading="lazy">
            <p class="scard__place">Panipat, Haryana</p>
          </div>
          <canvas class="scard__foil" id="foil" role="button" tabindex="0" aria-label="Scratch card: rub it with your finger or the mouse to reveal our wedding dates. Press Enter to reveal." aria-describedby="scardNote"></canvas>
          <span class="scard__hint" id="scardHint" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 11.2V5.5a1.5 1.5 0 0 1 3 0v4.7l.1-1.2a1.5 1.5 0 0 1 3 .1v1.3a1.5 1.5 0 0 1 3 .2V12a1.5 1.5 0 0 1 2.9.3v3.4c0 3.5-2.6 6.3-6.2 6.3h-1.3c-2 0-3.4-.8-4.7-2.4L5.7 15.6a1.6 1.6 0 0 1 2.3-2.2z"/></svg></span>
          <p class="sr-only" id="scardNote" aria-live="polite">Scratch the card to reveal the dates.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 2 · the invitation -->
  <section class="page" id="p-invite">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p4.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      <img class="el swing" style="left:12%;top:${at(15, 177.68)};width:5.5%;--d:.5s" src="assets/el/bell.webp" alt="" loading="lazy">
      <img class="el swing" style="right:11%;top:${at(20, 177.68)};width:5.5%;--d:.6s" src="assets/el/bell.webp" alt="" loading="lazy">
      <div class="flow" style="--top:${V.pairs ? 52 : 30};--side:16">
        ${invite}
        <p class="script script--md gap-m rise" style="--d:.3s">Lokesh &amp; Akansha</p>
        <img class="orn rise" style="width:calc(var(--cq) * 20);--d:.4s" src="assets/el/garland.webp" alt="" loading="lazy">
        <div class="welcome-names${V.pairs ? ' welcome-names--pairs' : ''} rise" style="--d:.5s">${V.welcomeNames.map((n) => `<p>${esc(n)}</p>`).join('')}</div>
      </div>
    </div>
  </section>

  <!-- 3 · the families: the groom's first, then the bride's (mother before father, grandmother before grandfather) -->
  <section class="page" id="p-fam">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p1.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">${bells(5.5, 11.5).replace(/alt="">/g, 'alt="" loading="lazy">')}
      <div class="flow" style="--top:24;--side:13">
        <h2 class="script script--lg rise">Our Families</h2>
        <img class="orn rise" style="width:calc(var(--cq) * 18);--d:.15s" src="assets/el/garland.webp" alt="" loading="lazy">
        <div class="fam rise" style="--d:.25s">
          <p class="fam__l">The Groom</p>
          <h3 class="fam__n">Lokesh</h3>
          <p class="fam__k">Beloved son of</p>
          <p class="fam__p">Manju and Ramdass</p>
          <p class="fam__k">Grandson of</p>
          <p class="fam__g">Late Smt. Shakuntala Devi and<br>Late Shree Girraj Prasad</p>
        </div>
        <p class="fam-sep rise" aria-hidden="true">&amp;</p>
        <div class="fam rise" style="--d:.1s">
          <p class="fam__l">The Bride</p>
          <h3 class="fam__n">Akansha</h3>
          <p class="fam__k">Daughter of</p>
          <p class="fam__p">Usha and Chandrashekhar</p>
          <p class="fam__k">Granddaughter of</p>
          <p class="fam__g">Late Smt. Kevla Devi and<br>Shree Ramprayag</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 4 · the couple's own photograph, whole -->
  <section class="page" id="p-hands">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p5.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      <img class="el swing" style="left:15%;top:${at(8.5, 177.68)};width:5%;--d:.5s" src="assets/el/bell.webp" alt="" loading="lazy">
      <img class="el swing" style="right:14%;top:${at(8, 177.68)};width:5%;--d:.6s" src="assets/el/bell.webp" alt="" loading="lazy">
      <div class="flow" style="--top:26;--side:12">
        <h2 class="script script--lg rise">Hand in Hand</h2>
        <img class="orn rise" style="width:calc(var(--cq) * 16);--d:.25s" src="assets/el/garland.webp" alt="" loading="lazy">
        <figure class="frame pop" style="--d:.35s"><img src="assets/el/hands.webp" alt="Lokesh holding Akansha's hand, her diamond ring catching the light, before a glowing Marry Me Love sign" width="1000" height="1344" loading="lazy" decoding="async"></figure>
      </div>
    </div>
  </section>
${V.pre ? `
  <!-- 5 · the pre-wedding celebrations, at COSMOS -->
  <section class="page" id="p-pre">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      ${TASSELS}
      <div class="flow" style="--top:31;--side:14">
        <h2 class="script script--lg rise">Pre-Wedding<br>Celebrations</h2>
        <p class="datebar gap-m rise" style="--d:.15s">Wednesday<small>25 November 2026</small></p>
        ${timeline(PRE)}
        <img class="orn rise" style="width:calc(var(--cq) * 16);--d:.2s" src="assets/el/garland.webp" alt="" loading="lazy">
        ${PIN}
        <p class="venue rise">${esc(VENUES.cosmos.name)}</p>
        <p class="addr rise" style="--d:.15s">${esc(VENUES.cosmos.address)}</p>
        <p class="venue-for rise" style="--d:.25s">for the Haldi, Mehndi &amp; Sangeet</p>
        ${MAPBTN('cosmos')}
      </div>
    </div>
  </section>
` : ''}
  <!-- ${V.pre ? '6' : '5'} · the wedding day -->
  <section class="page" id="p-wedding">
    <div class="art art--fit" style="--h:177.68">
      <img class="bg" src="assets/bg/p4.webp" alt="" width="941" height="1672" loading="lazy" decoding="async">
      <img class="el swing" style="left:12%;top:${at(15, 177.68)};width:5.5%;--d:.5s" src="assets/el/bell.webp" alt="" loading="lazy">
      <img class="el swing" style="right:11%;top:${at(20, 177.68)};width:5.5%;--d:.6s" src="assets/el/bell.webp" alt="" loading="lazy">
      <img class="el swing" style="left:2.5%;top:${at(57, 177.68)};width:5%;--d:.9s" src="assets/el/bell2.webp" alt="" loading="lazy">
      <img class="el swing" style="right:3%;top:${at(59, 177.68)};width:5%;--d:1s" src="assets/el/bell2.webp" alt="" loading="lazy">
      <div class="flow" style="--top:40;--side:14">
        <h2 class="script script--md rise">The Wedding Day</h2>
        <p class="datebar gap-m rise" style="--d:.15s">Thursday<small>26 November 2026</small></p>
        ${timeline(WEDDING)}
        <p class="venue-for gap-m rise">at ${esc(VENUES.palm.name)}</p>
      </div>
    </div>
  </section>

  <!-- ${V.pre ? '7' : '6'} · the wedding venue: its picture (assets/el/venue.webp — replace that file to change it), name, address, map -->
  <section class="page" id="p-venue">
    <div class="art art--fit" style="--h:169.29">
      <img class="bg" src="assets/bg/p2.webp" alt="" width="964" height="1632" loading="lazy" decoding="async">
      <div class="flow" style="--top:31;--side:14">
        <h2 class="script script--md rise">Wedding Venue</h2>
        <div class="venue-frame pop" style="--d:.15s"><img src="assets/el/venue.webp" alt="${esc(VENUES.palm.name)}, lit up at night, with a red carpet to its doors" width="1200" height="675" loading="lazy" decoding="async"></div>
        ${PIN}
        <p class="venue rise">${esc(VENUES.palm.name)}</p>
        <p class="addr rise" style="--d:.15s">${esc(VENUES.palm.address + (V.state ? ', Haryana' : ''))}</p>
        ${MAPBTN('palm')}
      </div>
    </div>
  </section>

  <!-- the last page -->
  <section class="page page--end" id="p-end">
    <div class="art" style="--h:150">
      <img class="bg" src="assets/bg/p6.webp" alt="" width="1024" height="1536" loading="lazy" decoding="async">
      <img class="el glide" style="left:6%;top:12%;width:15%;--d:.4s" src="assets/el/bird.webp" alt="" loading="lazy">
      <div class="flow" style="--top:6;--side:20;--bottom:0">
        <h2 class="script script--xl rise">With Love</h2>
        <img class="orn rise" style="width:calc(var(--cq) * 18);margin:calc(var(--cq) * 1.2) auto calc(var(--cq) * 2);--d:.2s" src="assets/el/garland.webp" alt="" loading="lazy">
        <p class="message rise" style="--d:.3s">${esc(V.closing.message)}</p>
      </div>
      <!-- written inside the painted arch -->
      <div class="arch-words rise" style="--d:.45s">
        ${V.closing.kids
          ? `<p class="heart" aria-hidden="true">♡</p>
        <p class="from">${esc(V.closing.kids)}</p>`
          : `<p class="caps caps--xs">${esc(V.closing.from[0])}</p>
        <p class="para gap-s"><em>${esc(V.closing.from[1])}</em></p>`}
      </div>
      <p class="credit">Created by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=${slug}" target="_blank" rel="noopener">Invitivals</a></p>
    </div>
  </section>
</main>

<noscript><p style="padding:40px 24px;text-align:center;font-family:Georgia,serif;color:#5a3a30">Please enable JavaScript to open this invitation.</p></noscript>
<script type="module" src="js/app.js?v=2"></script>
</body>
</html>
`;
  const config = `/* written by tools/lokesh-akansha-wedding.mjs — edit the tool, not this file.
   Lokesh & Akansha, the wedding (groom side). The words are in index.html; this holds what the page script needs. */
export const invite = {
  slug: '${slug}',
  /* the family's song, once they send it (e.g. 'assets/media/music.mp3'); null = no music and no music button */
  music: 'assets/media/music.mp3',   // Jashn-e-Bahaaraa, the family's song (client, 2026-11-04), on both pages
  /* the venue links exactly as the family supplied them; a venue without a link shows its button greyed out */
  venues: ${JSON.stringify(VENUES, null, 2).replace(/\n/g, '\n  ')},
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
`;
  return { html, config };
}

const M = path.join(ROOT, 'public', MAIN);
const ASKED = process.argv.slice(2).filter((a) => a === MAIN || a === DAY);
for (const slug of ASKED.length ? ASKED : [MAIN]) {
  const D = path.join(ROOT, 'public', slug);
  const { html, config } = page(slug);
  fs.writeFileSync(path.join(D, 'index.html'), html);
  fs.writeFileSync(path.join(D, 'config.js'), config);
  if (slug === DAY) {
    for (const f of ['css/invite.css', 'js/app.js', 'favicon.svg', '.htaccess', 'assets/bg/opening-la.webp', 'assets/el/la-logo.webp', 'assets/media/opening-la-v2.mp4', 'assets/media/music.mp3']) {
      fs.mkdirSync(path.dirname(path.join(D, f)), { recursive: true });
      fs.copyFileSync(path.join(M, f), path.join(D, f));
    }
  }
  console.log('✓', slug);
}
