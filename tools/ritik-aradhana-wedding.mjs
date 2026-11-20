/* Ritik & Aradhana — wedding invitation (client brief 2026-11-20), on the design the client chose:
   public/chanchal-jp-sharma-wedding (READ ONLY here: its stylesheet, script and painted pages are copied, never edited).
   The opening is the Lord Shiva film of public/aashna-sanket-wedding (READ ONLY; the client sent the same 10 s file).

     node tools/ritik-aradhana-wedding.mjs

   writes public/ritik-aradhana-wedding/ whole: index.html, the design's pages and fonts, the film and its poster,
   the client's three photographs (invites/src/ritik-aradhana-wedding/photo-1…3.jpg, only re-encoded, never cropped
   or retouched) and the link preview.

   Every word below is the client's. Not supplied, so not on the page: the family residence's address (those
   functions carry no map and no calendar entry), an RSVP telephone number, the monogram, the DJ music
   (MUSIC = null: no audio element and no music button until the file arrives). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'ritik-aradhana-wedding';
const TPL = path.join(ROOT, 'public', 'chanchal-jp-sharma-wedding');
const FILM = path.join(ROOT, 'public', 'aashna-sanket-wedding', 'assets');
const SRC = path.join(ROOT, 'invites', 'src', SLUG);
const OUT = path.join(ROOT, 'public', SLUG);
const URL_ = `https://invitivals.com/${SLUG}/`;
const V = 2;                                   // raise when a picture or the film changes

/* ── the client's details ─────────────────────────────────────────────────────────────── */
const GROOM = { short: 'Ritik', full: 'Ayushman Rebatiraman' };
const BRIDE = { short: 'Aradhana', full: 'Ipsita' };
const PAIR = `${GROOM.short} & ${BRIDE.short}`;
const VENUE = 'Kalyan Mandap, Ghodaghatpada';
const MAP = 'https://share.google/yMOyoN7oD9wsi5qre';   // the client's own link: marriage and reception are at the same place
const HOME = 'Family residence';                          // no address was supplied: no map, no calendar entry
const MUSIC = 'assets/music.mp3';                         // the design's own song (client, 20 Nov: the same track as the reference)
const COUNT_TO = '2027-01-29T22:25:00+05:30';             // Bibaha Panigrahana

const EVENTS = [
  { date: '2026-12-20', name: 'Deba Pitru Nimantrana', time: '07:12 AM to 02:00 PM', icon: 'diya', home: true },
  { date: '2027-01-27', name: 'Matipaka', time: '06:23 PM to 08:47 PM', icon: 'tilak', home: true },
  { date: '2027-01-28', name: 'Ganasana & Haladi', time: '11:03 AM to 01:37 PM', icon: 'haldi', home: true },
  { date: '2027-01-29', name: 'Baranugamana', time: '06:32 PM to 07:13 PM', icon: 'doli', start: '1832', end: '1913' },
  { date: '2027-01-29', name: 'Alankara Dharana', time: '07:13 PM to 08:49 PM', icon: 'rings', start: '1913', end: '2049' },
  { date: '2027-01-29', name: 'Bibaha Panigrahana', time: '10:25 PM to 11:13 PM', icon: 'agni', start: '2225', end: '2313' },
  { date: '2027-01-30', name: 'Reception', time: '07:30 PM onwards', icon: 'reception', start: '1930' },   // no end supplied: start = end
];
const PHOTOS = [
  { id: 'photo-3', alt: 'Ritik and Aradhana together in front of a temple at night, he in an ivory sherwani and she in a blush pink saree' },
  { id: 'photo-1', alt: 'Ritik and Aradhana holding hands on the beach, he in an ivory kurta and she in a sky blue saree' },
  { id: 'photo-2', alt: 'Ritik and Aradhana walking hand in hand through the waves, both in brown' },
];

/* ── helpers ──────────────────────────────────────────────────────────────────────────── */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ICON = {
  diya: '<path d="M12 4c1.6 2 2.2 3.4 1.6 4.6-.5 1-2.7 1-3.2 0C9.8 7.4 10.4 6 12 4z"/><path d="M4 13h16c-.6 3.4-3.8 5.6-8 5.6S4.6 16.4 4 13z"/><path d="M9 20.5h6"/>',
  haldi: '<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M7 11c.8-2 2.6-3 5-3s4.2 1 5 3"/><circle cx="18.5" cy="5.5" r="1.6"/><path d="M17.3 6.7 14 10"/>',
  rings: '<circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="M13.5 5.5 15 3.5l1.5 2-1.5 2z"/>',
  agni: '<path d="M12 3c2.6 3 4 5.4 3.4 8-.4 1.8-1.8 2.8-3.4 2.8S9 12.8 8.6 11C8 8.4 9.4 6 12 3z"/><path d="M5 16h14l-1.4 4H6.4z"/><path d="M3.5 16h17"/>',
  reception: '<path d="M7 3h4l-.4 4.5a1.6 1.6 0 0 1-3.2 0z"/><path d="M9 9.5V17M6.5 17h5"/><path d="M14 3h4l-.4 4.5a1.6 1.6 0 0 1-3.2 0z"/><path d="M16 9.5V17M13.5 17h5"/><path d="M10 21h4"/>',
  tilak: '<path d="M3 14h18c-.8 3.6-4.4 6-9 6s-8.2-2.4-9-6z"/><path d="M12 4.5c1.3 1.6 1.8 2.8 1.3 3.8-.4.8-2.2.8-2.6 0-.5-1 0-2.2 1.3-3.8z"/><path d="M9 14v-1.6c0-1 1.3-1.9 3-1.9s3 .9 3 1.9V14"/><path d="M5.5 14v-1M18.5 14v-1"/>',
  doli: '<path d="M2 7h20"/><path d="M6 7v-.5A6 3 0 0 1 18 6.5V7"/><path d="M7 7v10h10V7"/><path d="M10 17v-5a2 2 0 0 1 4 0v5"/><path d="M5 20h14"/>',
};
const PIN = '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
const CAL = '<svg viewBox="0 0 24 24"><path d="M7 2h2v2h6V2h2v2h3v18H4V4h3zm11 8H6v10h12z"/></svg>';
const SHARE = '<svg viewBox="0 0 24 24"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1z"/></svg>';
const ORN = '<div class="orn reveal"><i></i><svg viewBox="0 0 16 16"><path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg><i></i></div>';
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDay = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${WEEKDAYS[new Date(Date.UTC(y, m - 1, dd)).getUTCDay()]}, ${dd} ${MONTHS[m - 1]} ${y}`; };
/* Google Calendar, India time; an event with a start only is entered with start = end (no invented end) */
const gcal = (e) => {
  const d = e.date.replace(/-/g, ''), s = `${d}T${e.start}00`, en = `${d}T${e.end || e.start}00`;
  const q = new URLSearchParams({ action: 'TEMPLATE', text: `${e.name} — ${PAIR}`, dates: `${s}/${en}`, ctz: 'Asia/Kolkata',
    details: `${PAIR} — Wedding Invitation\n${URL_}\nMap: ${MAP}`, location: VENUE });
  return 'https://calendar.google.com/calendar/render?' + q.toString();
};
const WEDDING = EVENTS.find((e) => e.name === 'Bibaha Panigrahana');

const days = [...new Set(EVENTS.map((e) => e.date))];
const programme = days.map((d) => `
      <div class="day reveal">
        <div class="day-h"><span class="rule"></span><span>${fmtDay(d)}</span><span class="rule"></span></div>
        <ol class="events">${EVENTS.filter((e) => e.date === d).map((e) => `
          <li class="ev reveal">
            <div class="ev-ic"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[e.icon]}</svg></div>
            <div class="ev-b">
              <h3>${esc(e.name)}</h3>
              <p class="ev-t">${esc(e.time)}</p>
              <p class="ev-n">${esc(e.home ? HOME : VENUE)}</p>
              ${e.home ? '' : `<a class="ev-cal" href="${esc(gcal(e))}" target="_blank" rel="noopener">Add to calendar</a><a class="ev-cal ev-map" href="${MAP}" target="_blank" rel="noopener">View location</a>`}
            </div>
          </li>`).join('')}
        </ol>
      </div>`).join('');

const gallery = PHOTOS.map((p, i) => `
        <figure class="g-item"><button type="button" class="g-btn" data-i="${i}" aria-label="View photo ${i + 1} larger"><img src="assets/${p.id}.webp?v=${V}" alt="${esc(p.alt)}" style="object-position:50% 50%" loading="lazy" decoding="async" width="960" height="1280"></button></figure>`).join('');

/* ── the design's own stylesheet and script, taken from the template as they are ───────── */
const tpl = fs.readFileSync(path.join(TPL, 'index.html'), 'utf8');
const css = tpl.slice(tpl.indexOf('<style>') + 7, tpl.indexOf('</style>'));
let js = tpl.slice(tpl.indexOf('<script>\n(function(){') + 9, tpl.indexOf('</script>', tpl.indexOf('<script>\n(function(){')));
const swap = (from, to) => { if (!js.includes(from)) throw new Error('template script changed: ' + from.slice(0, 50)); js = js.replace(from, to); };
const cut = (a, b) => { const i = js.indexOf(a), j = js.indexOf(b, i); if (i < 0 || j < 0) throw new Error('template script changed: ' + a.slice(0, 40)); js = js.slice(0, i) + js.slice(j); };
/* the photographs */
js = js.replace(/var PHOTOS=\[.*?\}\], COUNT_TO=/s, () => `var PHOTOS=${JSON.stringify(PHOTOS.map((p) => ({ src: `assets/${p.id}.webp?v=${V}`, alt: p.alt })))}, COUNT_TO=`);
if (js.includes('photo-g1')) throw new Error('the template photo list was not replaced');
js = js.replace(/COUNT_TO="[^"]*"/, `COUNT_TO="${COUNT_TO}"`);
if (!js.includes(COUNT_TO)) throw new Error('countdown date not set');
/* the opening: the envelope is replaced by the film (below); music only when a file is supplied */
cut('  var env=document.getElementById("env")', '  // shrink a line that would overflow its place');
cut('  // blessings: opens WhatsApp', '  // share');
swap('document.addEventListener("visibilitychange",function(){if(document.hidden)audio.pause();else if(opened)play()});', '');
const OPENING_JS = `  var env=document.getElementById("env"), intro=document.getElementById("intro"), film=document.getElementById("film"), audio=document.getElementById("music"), mute=document.getElementById("mute");
  var q=new URLSearchParams(location.search), to=(q.get("to")||"").trim().slice(0,40);
  if(to){var d=env.querySelector(".dear");d.hidden=false;d.querySelector(".nm").textContent=to;document.title=to+" — "+document.title}
  var muted=false;try{muted=localStorage.getItem("inv-muted")==="1"}catch(e){}
  function fadeIn(){audio.volume=0;var v=0,t=setInterval(function(){v=Math.min(.7,v+.05);audio.volume=v;if(v>=.7)clearInterval(t)},120)}
  function play(){if(!audio||muted)return;var p=audio.play();if(p&&p.then)p.then(fadeIn).catch(function(){})}
  function setMute(m){muted=m;mute.classList.toggle("off",m);mute.setAttribute("aria-label",m?"Play music":"Pause music");try{localStorage.setItem("inv-muted",m?"1":"0")}catch(e){}m?audio.pause():play()}
  if(mute&&audio)mute.addEventListener("click",function(e){e.stopPropagation();setMute(!muted)});

  // 1. the sealed envelope: a tap on it starts the music and opens the flaps over the film
  // 2. the film (Lord Shiva and Goddess Parvati) plays once and gives way to the invitation; a tap on it, a film
  //    that cannot start, or one that stalls, goes straight in
  var sealed=true, opened=false, timer;
  function finish(){
    if(opened)return;opened=true;clearTimeout(timer);
    intro.classList.add("leaving");document.body.classList.remove("locked");
    document.getElementById("couple").classList.add("in");
    setTimeout(function(){try{film.pause()}catch(e){}intro.remove();petals();fit()},1300);
  }
  function startFilm(){
    film.addEventListener("playing",function(){intro.classList.add("playing");clearTimeout(timer);timer=setTimeout(finish,((film.duration||10)*1000)+900)},{once:true});
    film.addEventListener("ended",function(){setTimeout(finish,200)});
    film.addEventListener("error",finish);
    try{film.currentTime=0;var p=film.play();if(p&&p.catch)p.catch(finish)}catch(e){finish();return}
    timer=setTimeout(function(){if(!intro.classList.contains("playing"))finish()},4500);
  }
  function unseal(){
    if(!sealed)return;sealed=false;
    play();env.classList.add("open");
    if(mute&&audio){mute.classList.add("on");mute.classList.toggle("off",muted)}
    setTimeout(startFilm,650);
    setTimeout(function(){env.classList.add("gone")},1500);
  }
  env.addEventListener("click",unseal);
  intro.addEventListener("click",function(){if(!sealed)finish()});
  intro.addEventListener("keydown",function(e){if(!sealed&&(e.key==="Enter"||e.key===" ")){e.preventDefault();finish()}});
  if(q.has("nodoor")){sealed=false;env.classList.add("gone");if(mute&&audio){mute.classList.add("on");mute.classList.add("off")}finish()}
  document.addEventListener("visibilitychange",function(){if(!audio)return;if(document.hidden)audio.pause();else if(!sealed)play()});

`;
swap('  // shrink a line that would overflow its place', OPENING_JS + '  // shrink a line that would overflow its place');

const EXTRA_CSS = `
/* ── Ritik & Aradhana (client, 2026-11-20): what this invitation adds to the design ── */
/* the sealed envelope opens first (the design's own, above everything); behind it waits the film of Lord Shiva
   and Goddess Parvati, without its opening words; the music button stays reachable over the film */
#env{z-index:60}
.mute{z-index:55}
#intro{position:fixed;inset:0;z-index:50;background:#1c0b0c;cursor:pointer;overflow:hidden;-webkit-tap-highlight-color:transparent;transition:opacity 1.2s ease,visibility 1.2s}
#intro .stage{position:absolute;top:0;bottom:0;left:50%;width:min(100vw,max(480px,calc(100vh*9/16)));transform:translateX(-50%);overflow:hidden}
#intro video,#intro .poster{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;object-position:50% 60%}
#intro .poster{transition:opacity .5s ease}
#intro.playing .poster{opacity:0}
#intro.leaving{opacity:0;visibility:hidden;pointer-events:none}
#intro:focus-visible{outline:2px solid var(--gold);outline-offset:-6px}
/* the two invocations over the invitation */
.shloka.invo span{display:block}
.shloka.invo .en{font-family:var(--serif);font-style:italic;font-weight:600;font-size:1.02em;letter-spacing:.03em}
/* the invitation letter: full names in the script, the names they are called by beneath */
.letter{max-width:32ch}
.names.full{font-size:clamp(31px,8.9vw,43px);margin:14px 0 12px}
.names.full small{display:block;font-family:var(--serif);font-style:italic;font-weight:600;font-size:.5em;line-height:1.3;color:var(--gold)}
.names.full .amp{font-size:.62em;margin:.35em 0}
.letter.of{font-size:17px;max-width:34ch}
.fam-r b{display:block;font-style:normal;font-weight:700;color:#fff1d6}
.fam-r span{display:block}
.rsvp-list{margin-top:14px}
.rsvp-list .rsvp-name{margin-top:8px;font-size:22px}
`;

const invoc = '॥ श्री गणेशाय नमः ॥';
const DESC = `Friday, 29th January 2027 · ${VENUE}. Tap to open your invitation`;
const TITLE = `${PAIR} — Wedding Invitation`;

const html = `<!doctype html>
<!-- written by tools/ritik-aradhana-wedding.mjs — edit the tool and run it, not this file -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(TITLE)}</title>
<meta name="description" content="${esc(DESC)}">
<meta name="theme-color" content="#3a0b18">
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:url" content="${URL_}">
<meta property="og:title" content="${esc(TITLE)}">
<meta property="og:description" content="${esc(DESC)}">
<meta property="og:image" content="${URL_}assets/og.jpg">
<meta property="og:image:secure_url" content="${URL_}assets/og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" as="image" href="assets/envelope.webp">
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/pinyon-script-latin-400-normal.woff2" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@600;700&amp;display=swap">
<style>${css}${EXTRA_CSS}</style>
</head>
<body class="locked">
<div id="env" role="dialog" aria-label="Invitation envelope">
  <div class="stage">
    <div class="flap f-top"></div><div class="flap f-right"></div><div class="flap f-bottom"></div><div class="flap f-left"></div>
    <button class="seal" type="button" aria-label="Open the invitation"></button>
  </div>
  <div class="dear" hidden><div class="to">Dear</div><div class="nm"></div></div>
  <div class="hint"><span>Tap the seal to open</span></div>
</div>
<div id="intro" role="button" tabindex="0" aria-label="Lord Shiva and Goddess Parvati. Tap to go to the invitation">
  <div class="stage">
    <video id="film" muted playsinline preload="auto" aria-hidden="true"><source src="assets/intro.mp4?v=${V}" type="video/mp4"></video>
    <img class="poster" src="assets/intro-poster.webp?v=${V}" alt="Lord Shiva and Goddess Parvati seated in a flower-hung temple by the mountains" width="720" height="1280">
  </div>
</div>

<main id="invite">
  <section class="plate" id="couple" aria-label="Invitation">
    <img src="assets/couple-page.webp" alt="Together with their families. Your presence will make our celebration more special. Lord Shiva and Goddess Parvati exchange garlands by a lake at sunset." width="1350" height="2400">
    <img class="ganesh-wm" src="assets/ganesh-wm.webp" alt="" aria-hidden="true" width="900" height="750">
    <div class="slot serif rise" style="left:16.667%;top:20.625%;width:66.667%;height:9.375%;--fs:4.111cqw;"><span class="ln">request the pleasure of your company</span><span class="ln">at the wedding celebration of</span></div>
    <div class="slot script rise" style="left:12.222%;top:31.125%;width:75.556%;height:11.125%;--fs:16.667cqw;"><span class="ln">${esc(GROOM.short)}</span></div>
    <div class="slot script rise" style="left:12.222%;top:44.750%;width:75.556%;height:11.125%;--fs:16.667cqw;"><span class="ln">${esc(BRIDE.short)}</span></div>
    <img class="twinkle" src="assets/spark.webp" alt="" style="left:10.6%;top:14.7%;width:3.8%">
    <img class="twinkle" src="assets/spark.webp" alt="" style="left:85.5%;top:35%;width:3.4%;animation-delay:-1.6s">
  </section>

  <section class="band" id="story" aria-labelledby="story-h">
    <img class="corner tl" src="assets/corner-floral.webp" alt="">
    <p class="shloka invo reveal"><span lang="sa">${invoc}</span><span class="en">॥ Om Shree Shree Prajapataye Namah ॥</span></p>
    <p class="kicker reveal">Wedding Invitation</p>
    <h2 class="h2 reveal" id="story-h">${esc(GROOM.short)} &amp; ${esc(BRIDE.short)}</h2>
    ${ORN}
    <div class="arch reveal"><img src="assets/${PHOTOS[0].id}.webp?v=${V}" alt="${esc(PHOTOS[0].alt)}" style="object-position:50% 50%" loading="lazy" width="960" height="1280"></div>
    <p class="lead letter reveal">Dear Sir/Madam,</p>
    <p class="lead letter reveal" style="margin-top:10px">We cordially invite your august presence with great pleasure on the auspicious occasion of the wedding ceremony of our elder son,</p>
    <p class="names full reveal">${esc(GROOM.full)}<small>(${esc(GROOM.short)})</small><span class="amp">with</span>${esc(BRIDE.full)}<small>(${esc(BRIDE.short)})</small></p>
    <p class="lead letter of reveal">(Elder daughter of Smt. Kalpana Maharana &amp; Sri. Sunyabasi Maharana of Mathalput, Damanjodi, Koraput.)</p>
    <dl class="facts reveal"><div><dt>Date</dt><dd>Friday, 29th January 2027</dd></div><div><dt>Venue</dt><dd>${esc(VENUE)}.</dd></div></dl>
    <p class="lead letter reveal" style="margin-top:22px">We eagerly look forward to your gracious presence with family to share in our moments of immense joy and bless the newlyweds.</p>
    <div class="count reveal" id="count" aria-label="Countdown to the wedding day">
      <div><b data-k="d">00</b><span>Days</span></div><div><b data-k="h">00</b><span>Hours</span></div><div><b data-k="m">00</b><span>Mins</span></div><div><b data-k="s">00</b><span>Secs</span></div>
    </div>
  </section>

  <section class="plate" id="date" aria-label="Save our date">
    <img src="assets/date-page.webp" alt="Save our date" width="1350" height="2400" loading="lazy">
    <div class="slot serif" style="left:38.444%;top:40.000%;width:23.333%;height:4.125%;--fs:6.444cqw;">Friday</div>
    <div class="slot serif gold" style="left:23.778%;top:44.125%;width:56.444%;height:4.125%;--fs:7.333cqw;font-weight:700">29th January 2027</div>
    <div class="slot serif" style="left:27.778%;top:49.375%;width:44.444%;height:3.375%;--fs:4.444cqw;">10:25 PM – 11:13 PM</div>
    <div class="scratch" id="scratch" style="left:12.000%;top:37.875%;width:76.000%;height:22.625%"><canvas></canvas></div>
    <button class="sr" id="reveal-btn" type="button">Reveal the date: Friday, 29th January 2027, 10:25 PM – 11:13 PM</button>
    <a class="hit" href="${esc(gcal(WEDDING))}" target="_blank" rel="noopener" style="left:24.444%;top:53.750%;width:51.667%;height:5.313%" aria-label="Add the wedding to Google Calendar"></a>
  </section>

  <section class="band" id="programme" aria-labelledby="prog-h">
    <img class="corner tl" src="assets/corner-floral.webp" alt="">
    <p class="kicker reveal">Join us for</p>
    <h2 class="h2 reveal" id="prog-h">The Celebrations</h2>
    ${ORN}
    ${programme}
    <div class="btns reveal"><a class="btn" href="${esc(gcal(WEDDING))}" target="_blank" rel="noopener">${CAL}Add to Google Calendar</a></div>
  </section>

  <section class="band" id="families" aria-labelledby="fam-h">
    <img class="corner tl" src="assets/corner-floral.webp" alt="">
    <p class="kicker reveal">Blessed by our elders</p>
    <h2 class="h2 reveal" id="fam-h">Our Families</h2>
    ${ORN}
    <div class="fam reveal">
      <div class="fam-p"><p class="fam-l">Groom</p><p class="fam-n">${esc(GROOM.short)}</p><p class="fam-r"><b>${esc(GROOM.full)}</b></p></div><div class="fam-amp">&amp;</div>
      <div class="fam-p"><p class="fam-l">Bride</p><p class="fam-n">${esc(BRIDE.short)}</p><p class="fam-r"><b>${esc(BRIDE.full)}</b><span>Elder daughter of</span><span>Smt. Kalpana Maharana &amp;</span><span>Sri. Sunyabasi Maharana</span><span>Mathalput, Damanjodi, Koraput</span></p></div>
    </div>
    <dl class="facts reveal"><div><dt>Wedding</dt><dd>Friday, 29 January 2027</dd></div><div><dt>Reception</dt><dd>Saturday, 30 January 2027 · 07:30 PM onwards</dd></div><div><dt>Venue</dt><dd>${esc(VENUE)}</dd></div></dl>
    <div class="btns reveal"><a class="btn" href="${MAP}" target="_blank" rel="noopener">${PIN}View Location on Google Maps</a></div>
    <img class="corner br" src="assets/corner-floral.webp" alt="">
  </section>

  <section class="band" id="gallery" aria-labelledby="gal-h">
    <p class="kicker reveal">Moments together</p>
    <h2 class="h2 reveal" id="gal-h">Gallery</h2>
    ${ORN}
    <div class="gal reveal" id="gal">${gallery}
    </div>
    <div class="dots" id="dots">${PHOTOS.map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('')}</div>
    <img class="corner br" src="assets/corner-floral.webp" alt="">
  </section>

  <section class="plate" id="venue" aria-label="Venue">
    <img src="assets/venue-page.webp" alt="Venue" width="1062" height="2400" loading="lazy">
    <div class="slot serif rise" style="left:12.994%;top:22.875%;width:74.011%;height:14.5%;--fs:6.638cqw;" aria-label="${esc(VENUE)}"><span class="ln">Kalyan Mandap,</span><span class="ln">Ghodaghatpada</span></div>
    <a class="hit" href="${MAP}" target="_blank" rel="noopener" style="left:14.548%;top:40.313%;width:70.904%;height:13.438%" aria-label="Open the wedding and reception venue in Google Maps"></a>
    <a class="hit" href="${MAP}" target="_blank" rel="noopener" style="left:19.492%;top:55.000%;width:61.017%;height:4.688%" aria-label="Take me there: open in Google Maps"></a>
  </section>

  <section class="band" id="contact" aria-labelledby="contact-h">
    <h2 class="h2 reveal" id="contact-h">RSVP</h2>
    ${ORN}
    <div class="rsvp-list reveal">
      <p class="rsvp-name">Smt. Kanak Manjari Maharana</p>
      <p class="rsvp-name">Sri. Jaya Narayan Maharana</p>
      <p class="rsvp-name">Smt. Lilima Maharana</p>
      <p class="rsvp-name">Sri. Rabinarayan Maharana</p>
    </div>
    <div class="btns reveal">
      <button class="btn ghost" type="button" id="share">${SHARE}Share the invitation</button>
    </div>
  </section>

  <section class="plate" id="thanks" aria-label="Thank you">
    <img src="assets/thanks-page.webp" alt="With all our love. Thank you for being a part of our special journey." width="1031" height="2401" loading="lazy">
    <div class="slot caps rise" style="left:14.556%;top:60.125%;width:70.888%;height:3.000%;--fs:3.639cqw;">With love, both families</div>
  </section>
</main>
${MUSIC ? `
<button class="mute" id="mute" type="button" aria-label="Pause music"><span class="bars"><i></i><i></i><i></i><i></i></span></button>` : ''}
<div class="box" id="box" role="dialog" aria-label="Photo"><img alt=""><button type="button" class="x" aria-label="Close">&times;</button><button type="button" class="nav prev" aria-label="Previous photo">&#8249;</button><button type="button" class="nav next" aria-label="Next photo">&#8250;</button></div>
<div class="petals" id="petals" aria-hidden="true"></div>${MUSIC ? `
<audio id="music" src="${MUSIC}" loop preload="none"></audio>` : ''}

<script>
${js}</script>
<script src="/_credit/v1/credit.js" defer data-into="#invite" data-bg="#3a0b18" data-color="#f3d596"></script>
</body>
</html>
`;

/* ── files ────────────────────────────────────────────────────────────────────────────── */
fs.mkdirSync(path.join(OUT, 'assets', 'fonts'), { recursive: true });
for (const f of ['envelope.webp', 'music.mp3', 'corner-floral.webp', 'couple-page.webp', 'damask.webp', 'date-cover.webp', 'date-page.webp', 'ganesh-wm.webp', 'spark.webp', 'thanks-page.webp', 'venue-page.webp'])
  fs.copyFileSync(path.join(TPL, 'assets', f), path.join(OUT, 'assets', f));
for (const f of fs.readdirSync(path.join(TPL, 'assets', 'fonts'))) fs.copyFileSync(path.join(TPL, 'assets', 'fonts', f), path.join(OUT, 'assets', 'fonts', f));
/* the film without its opening words, and its first frame: made by tools/ritik-aradhana-film.mjs */
fs.copyFileSync(path.join(SRC, 'shiva-clean.mp4'), path.join(OUT, 'assets', 'intro.mp4'));
fs.copyFileSync(path.join(SRC, 'shiva-clean-poster.webp'), path.join(OUT, 'assets', 'intro-poster.webp'));
for (const p of PHOTOS)   // the client's photographs: re-encoded only, whole, at their own size
  await sharp(path.join(SRC, p.id + '.jpg')).rotate().webp({ quality: 90 }).toFile(path.join(OUT, 'assets', p.id + '.webp'));
fs.writeFileSync(path.join(OUT, 'index.html'), html);

/* link preview: the film's opening picture beside the names and the day */
const poster = await sharp(path.join(SRC, 'shiva-clean-poster.webp')).resize({ width: 430 }).extract({ left: 0, top: 30, width: 430, height: 630 }).toBuffer();
const text = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a1022"/><stop offset="1" stop-color="#2a0611"/></linearGradient>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9e2a8"/><stop offset="1" stop-color="#d9aa5a"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="452" y="22" width="726" height="586" rx="14" fill="none" stroke="#c99a4b" stroke-opacity=".55" stroke-width="1.5"/>
  <g font-family="Georgia,'Times New Roman',serif" text-anchor="middle">
    <text x="815" y="150" font-size="24" letter-spacing="9" fill="#f3d596">WEDDING INVITATION</text>
    <text x="815" y="296" font-size="86" font-style="italic" fill="url(#g)">${esc(GROOM.short)} &amp; ${esc(BRIDE.short)}</text>
    <path d="M655 350h320" stroke="#c99a4b" stroke-opacity=".7"/>
    <text x="815" y="418" font-size="34" fill="#fbecd0">Friday, 29th January 2027</text>
    <text x="815" y="474" font-size="27" font-style="italic" fill="#f6dfc0">${esc(VENUE)}</text>
  </g></svg>`);
const og = await sharp(text).composite([{ input: poster, left: 0, top: 0 }]).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(OUT, 'assets', 'og.jpg'));
console.log(`✓ ${SLUG}: index.html ${html.length} bytes, ${PHOTOS.length} photographs, film, og.jpg ${og.size} bytes`);
