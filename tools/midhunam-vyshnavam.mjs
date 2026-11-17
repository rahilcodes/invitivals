/* Midhunam & Vyshnavam — Gruhapravesham invitation (client, 2026-11-17), on the design the client chose: the
   Nandana Vanam page, itself built on the approved design of public/poornajnana.

     node tools/midhunam-vyshnavam.mjs

   public/poornajnana/index.html is only READ: its artwork, fonts, song and stylesheet are lifted out of that one
   self-contained file into public/midhunam-vyshnavam/ (assets/, fonts/, css/base.css), exactly as the Nandana Vanam
   tool does for its page. public/nandana-vanam is never read or written by this tool.
   One picture comes from elsewhere in the studio's own art: Lord Ganesha for the "Ganesh & Vasthu Puja" card
   (public/aashna-sanket-celebrations/assets/ganesha.webp, copied as it is), because the design has no Ganesha.
   The words come from public/midhunam-vyshnavam/config.js and are written into index.html.
   Hand-written and never touched by this tool: config.js, css/invite.css, js/app.js, rsvp.php, rsvp.secret.php, .htaccess. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'public', 'poornajnana', 'index.html');
const D = path.join(ROOT, 'public', 'midhunam-vyshnavam');
const { invite: C } = await import(pathToFileURL(path.join(D, 'config.js')).href + '?t=' + Date.now());
const V = 1;   // raise when css/invite.css, js/app.js or config.js change, so phones fetch the new files

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const put = (rel, data) => {
  const f = path.join(D, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  if (fs.existsSync(f) && Buffer.compare(fs.readFileSync(f), Buffer.isBuffer(data) ? data : Buffer.from(data)) === 0) return;
  fs.writeFileSync(f, data);
};

/* ── the approved page's parts ─────────────────────────────────────────────── */
const src = fs.readFileSync(SRC, 'utf8');
const assets = JSON.parse(src.match(/var ASSETS=(\{.*?\});\s*\n/s)[1]);
for (const [name, uri] of Object.entries(assets)) {
  const m = uri.match(/^data:image\/(\w+);base64,(.+)$/);
  put(`assets/${name}.${m[1]}`, Buffer.from(m[2], 'base64'));
}
put('assets/music.mp3', Buffer.from(src.match(/window\.MUSIC_B64="([^"]+)"/)[1], 'base64'));
put('assets/ganesha.webp', fs.readFileSync(path.join(ROOT, 'public/aashna-sanket-celebrations/assets/ganesha.webp')));

let css = src.match(/<style>([\s\S]*?)<\/style>/)[1];
const seen = new Map(); let n = 0;
css = css.replace(/url\(data:font\/woff2;base64,([A-Za-z0-9+/=]+)\)/g, (_, b64) => {
  if (!seen.has(b64)) { seen.set(b64, `f${++n}.woff2`); put(`fonts/f${n}.woff2`, Buffer.from(b64, 'base64')); }
  return `url(../fonts/${seen.get(b64)})`;
});
put('css/base.css', `/* lifted unchanged from the approved design (public/poornajnana) by tools/midhunam-vyshnavam.mjs — do not edit;\n   this invitation's own styles are in invite.css */\n${css.trim()}\n`);

/* ── Google Calendar: one link per celebration ─────────────────────────────── */
const img = (name, attrs = '') => `<img src="assets/${name}.webp" ${attrs}>`;
const url = `https://invitivals.com/${C.slug}/`;
const local = (e) => e.date.replace(/-/g, '') + 'T' + e.time.replace(':', '') + '00';
/* The times are India wall-clock times with ctz naming the zone, so Google places each entry at the right moment for
   every guest. No end times were supplied: the end equals the start rather than an invented one. */
const gcal = (e) => 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
  action: 'TEMPLATE', text: `${e.name} – ${C.homes.name} Gruhapravesham`, dates: local(e) + '/' + local(e), ctz: C.timeZone,
  location: C.calendar.location, details: `${e.name} — ${e.dateText}, ${e.label}\nHosts: ${C.hosts.join(' & ')}\n\n${url}`,
}).toString();
/* a guest who is not signed in to Google is sent by that address to Google's product page and loses the event, so the
   link goes through Google's own sign-in address with the event as its destination (Android uses the direct one) */
const gcalSignin = (e) => 'https://accounts.google.com/ServiceLogin?' + new URLSearchParams({ service: 'cl', continue: gcal(e) }).toString();
const target = C.events[C.countdownTo];
const desc = `${C.hosts.join(' & ')} cordially invite you to the Gruhapravesham and celebrations of their new homes, ${C.homes.name} — ${target.dateText}, ${C.place}.`;
const ogd = `${target.dateText} · ${C.place}. Tap to open the invitation.`;

/* ── the page ──────────────────────────────────────────────────────────────── */
const U = (x) => `calc(${x} * var(--u))`;
const ICON = {
  cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h3v3H8z" fill="currentColor" stroke="none"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
};
const DIVIDER = `<div class="divider">${img('lotus', 'alt=""')}</div>`;
const SEP = `<div class="tl-sep"><div class="tl-line"></div><div class="diya-wrap"><div class="diya-glow"></div>${img('diya', 'alt=""')}</div><div class="tl-line dn"></div></div>`;
const artWidth = { meal: 200, ganesha: 150 };

const html = `<!DOCTYPE html>
<!-- written by tools/midhunam-vyshnavam.mjs from config.js — edit config.js and run the tool, not this file -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${esc(C.title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#f2e3c8">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Invitivals">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(C.title)}">
<meta property="og:description" content="${esc(ogd)}">
<meta property="og:image" content="${url}og-cover.jpg">
<meta property="og:image:secure_url" content="${url}og-cover.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(C.title)} · ${esc(target.dateText)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(C.title)}">
<meta name="twitter:description" content="${esc(ogd)}">
<meta name="twitter:image" content="${url}og-cover.jpg">
<link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20100%20100%27%3E%3Ctext%20y%3D%27.9em%27%20font-size%3D%2790%27%3E%F0%9F%AA%94%3C/text%3E%3C/svg%3E">
<link rel="preload" href="fonts/f2.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/door-frame.webp" as="image">
<link rel="stylesheet" href="css/base.css?v=1">
<link rel="stylesheet" href="css/invite.css?v=${V}">
</head>
<body>
<div id="app" style="position:fixed;inset:0;background:#f2e3c8">
  <main id="scroller" style="position:absolute;inset:0;overflow-y:auto;-webkit-overflow-scrolling:touch;background:#f6ecd6" aria-label="${esc(C.title)}">
    <!-- ============ HERO ============ -->
    <div style="position:relative;width:100%;max-width:520px;margin:0 auto;aspect-ratio:1079/1677;overflow:hidden">
      ${img('bg-scene', 'style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" alt=""')}
      <div style="position:absolute;top:-2%;left:7%;width:15%;transform-origin:50% 0;animation:bellSwing 2.8s ease-in-out infinite">
        ${img('bell-gold', 'style="display:block;width:100%" alt=""')}
      </div>
      <div style="position:absolute;top:-2%;right:7%;width:15%;transform-origin:50% 0;animation:bellSwing 2.8s ease-in-out infinite;animation-delay:-1.4s">
        ${img('bell-gold', 'style="display:block;width:100%" alt=""')}
      </div>
      <div style="position:absolute;left:50%;bottom:4.5%;width:66%;transform:translateX(-50%)">
        <div style="animation:cowSway 4.5s ease-in-out infinite">
          ${img('cow-calf', 'style="display:block;width:100%" alt="Kamadhenu cow and calf"')}
        </div>
      </div>
      <div class="hero-words hero-words--inv" style="position:absolute;left:8%;right:8%;text-align:center;display:flex;flex-direction:column;gap:${U(5)};color:#7a4a12">
        <div class="t-in hero-deva" lang="sa" style="transition:opacity 1.1s ease .1s, transform 1.1s ease .1s">${esc(C.hero.deva)}</div>
        <div class="t-in invocations" style="display:flex;flex-direction:column;gap:${U(2.5)};font-size:${U(11.5)};letter-spacing:${U(1)};font-style:italic;transition:opacity 1.1s ease .2s, transform 1.1s ease .2s">
${C.hero.invocations.map((l) => `          <div>${esc(l)}</div>`).join('\n')}
        </div>
        <h1 class="t-in" style="margin:${U(8)} 0 0;font-size:${U(40)};font-weight:600;color:#8a4a1a;line-height:1.05;transition:opacity 1.2s ease .8s, transform 1.2s ease .8s">${esc(C.hero.ceremony)}</h1>
        <div class="t-in" style="font-size:${U(16)};font-style:italic;transition:opacity 1.2s ease 1.2s, transform 1.2s ease 1.2s">${esc(C.hero.sub)}</div>
        <div class="t-in hero-home" style="transition:opacity 1.2s ease 1.6s, transform 1.2s ease 1.6s">${esc(C.hero.home)}</div>
      </div>
    </div>
    <!-- ============ CONTENT ============ -->
    <div style="position:relative;width:100%;max-width:520px;margin:0 auto;background:linear-gradient(180deg,#f6ecd6 0%,#f3e5c8 50%,#f6ecd6 100%);padding:${U(52)} ${U(30)} ${U(70)};box-sizing:border-box;display:flex;flex-direction:column;gap:${U(52)};color:#6b3f10;text-align:center" id="contentCol">
      <div class="toran-wrap">${img('toran', 'alt=""')}</div>

      <!-- the blessings, the hosts and the invitation -->
      <section data-reveal="1" style="opacity:0;display:flex;flex-direction:column;gap:${U(10)}">
        <div style="font-style:italic;font-size:${U(17)};letter-spacing:${U(1)}">With the blessings of</div>
        ${C.blessingsOf.map(([who, of]) => `<div class="elders">${esc(who)}<small>${esc(of)}</small></div>`).join('\n        ')}
        ${DIVIDER}
        <div style="font-size:${U(21)};font-weight:700;line-height:1.4">${esc(C.hosts[0])}<br><span class="amp">&amp;</span><br>${esc(C.hosts[1])}</div>
        <div style="font-style:italic;font-size:${U(16.5)};line-height:1.6;margin-top:${U(8)}">${esc(C.inviteLine)}</div>
        <div class="homes-k">${esc(C.homes.label)}</div>
        <div class="plaque">
          <div class="plaque-row">${img('lotus', 'alt=""')}<div class="plaque-name">${esc(C.homes.name)}</div>${img('lotus', 'alt="" style="transform:scaleX(-1)"')}</div>
          <div class="plaque-addr">${C.homes.lines.map(esc).join('<br>')}</div>
        </div>
      </section>

      <!-- CELEBRATION DETAILS: one card for each of the four -->
      <section data-reveal="4" class="events" style="opacity:0;display:flex;flex-direction:column;gap:${U(18)};align-items:center" aria-labelledby="h-ev">
        ${img('rangoli', 'class="rangoli-bed" alt=""')}
        <img id="ringBell" src="assets/bell-gold.webp" style="width:${U(52)}" alt="Temple bell: tap to ring" title="Ring the bell" role="button" tabindex="0">
        <h2 class="sec-title" id="h-ev" style="position:relative;z-index:1">CELEBRATION DETAILS</h2>
        <div style="display:flex;flex-direction:column;gap:${U(6)};width:100%">
${C.events.map((e) => `          <div class="card">
            ${img(e.art, `style="width:${U(artWidth[e.art] || 180)};margin-bottom:${U(8)}" alt="${esc(e.alt)}" loading="lazy"`)}
            <h3 style="margin:0;font-size:${U(21)};font-weight:700;color:#9c3d2e">${esc(e.name)}</h3>
            <div style="font-size:${U(16)}">${esc(e.dateText)}</div>
            <div style="font-size:${U(17)};font-weight:600">${esc(e.label)}</div>${e.calendar ? `
            <a class="cal-link" href="${esc(gcalSignin(e))}" data-direct="${esc(gcal(e))}" target="_blank" rel="noopener" aria-label="Add ${esc(e.name)} to Google Calendar">${ICON.cal}ADD TO GOOGLE CALENDAR</a>` : ''}
          </div>`).join(`\n          ${SEP}\n`)}
        </div>
      </section>

      <!-- VENUE -->
      <section data-reveal="5" style="opacity:0;display:flex;flex-direction:column;gap:${U(12)};align-items:center" aria-labelledby="h-venue">
        <h2 class="sec-title" id="h-venue">VENUE</h2>
        <div style="font-size:${U(19)};font-weight:700;letter-spacing:${U(1.5)};color:#9c3d2e">${esc(C.venue.name)}</div>
        <address style="font-style:normal;font-size:${U(17)};line-height:1.7">${C.venue.lines.map(esc).join('<br>')}</address>
        <div class="venue-note">${esc(C.venue.note)}</div>
        <a class="line-btn" href="${esc(C.venue.mapsUrl)}" target="_blank" rel="noopener">${ICON.pin}VIEW ON MAP</a>
      </section>

      <div data-reveal="6" class="shloka" style="opacity:0">
        <div class="shloka-text">&#2405; &#2358;&#2369;&#2349;&#2306; &#2349;&#2357;&#2340;&#2369; &#2405;</div>
        <div class="shloka-sub">MAY ALL BE AUSPICIOUS</div>
      </div>

      <!-- KINDLY RSVP: name (required), a guest counter, an optional message, and two buttons that send the reply -->
      <section data-reveal="7" class="sec" style="opacity:0" aria-labelledby="h-rsvp">
        <h2 class="sec-title" id="h-rsvp">KINDLY RSVP</h2>
        <p class="r2-sub">We would love to know if you can join us</p>
        <form class="rsvp2" id="rsvp" novalidate>
          <div class="r2-fld">
            <label class="r2-label" for="rName">YOUR NAME</label>
            <input class="r2-name" id="rName" name="name" type="text" placeholder="Full name" autocomplete="name" autocapitalize="words" maxlength="80" required aria-describedby="eName">
            <p class="err" id="eName" hidden></p>
          </div>
          <div class="r2-fld" id="guestsFld">
            <span class="r2-label" id="lGuests">NUMBER OF GUESTS</span>
            <div class="r2-count" role="group" aria-labelledby="lGuests">
              <button type="button" class="r2-step" id="gMinus" aria-label="One guest fewer">&minus;</button>
              <output class="r2-num" id="gCount" aria-live="polite">${C.rsvp.defaultGuests}</output>
              <button type="button" class="r2-step" id="gPlus" aria-label="One guest more">+</button>
            </div>
          </div>
          <div class="r2-fld">
            <label class="r2-label" for="rMsg">MESSAGE <span class="r2-opt">(optional)</span></label>
            <textarea class="r2-msg" id="rMsg" name="message" rows="3" maxlength="${C.rsvp.maxMessage}" placeholder="Your wishes for the family"></textarea>
          </div>
          <div class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
          <div class="r2-btns">
            <button type="button" class="r2-btn r2-yes" id="rYes" data-attending="yes">JOYFULLY ACCEPT</button>
            <button type="button" class="r2-btn r2-no" id="rNo" data-attending="no">REGRETFULLY DECLINE</button>
          </div>
          <div class="rsvp-status" id="rsvpStatus" role="status" aria-live="polite"></div>
        </form>
      </section>

      <div data-reveal="8" style="opacity:0;display:flex;flex-direction:column;gap:${U(10)};align-items:center">
        <div style="font-style:italic;font-size:${U(17.5)};line-height:1.7;color:#7a4a12">${esc(C.closing)}</div>
        ${DIVIDER}
        <div style="font-size:${U(19)};font-weight:600;line-height:1.6">${esc(C.hosts[0])}<br>&amp; ${esc(C.hosts[1])}</div>
        <div style="font-size:${U(14)};letter-spacing:${U(1.5)};margin-top:${U(10)};color:#a07840">&#10022; &nbsp;SHUBH GRUHAPRAVESHAM&nbsp; &#10022;</div>
      </div>
      <div data-reveal="9" style="opacity:0;position:relative;margin:0 ${U(-30)}">
        <div style="position:absolute;left:8%;bottom:14%;width:34%;z-index:1">
          <div style="animation:cowSway 4.5s ease-in-out infinite">
            ${img('cow-calf', 'style="display:block;width:100%;transform:scaleX(-1)" alt="Kamadhenu cow and calf" loading="lazy"')}
          </div>
        </div>
        ${img('footer-scene', 'style="display:block;width:100%;position:relative" alt="Temple doorway garden" loading="lazy"')}
      </div>

      <!-- OUR COUNTDOWN: to the first celebration of ${esc(target.dateText)} -->
      <section data-reveal="10" class="sec" style="opacity:0" aria-labelledby="h-cd">
        <h2 class="sec-title" id="h-cd">OUR COUNTDOWN</h2>
        <p class="sec-sub">COUNTING DOWN TO OUR CELEBRATIONS</p>
        <div class="countdown cd-boxes" id="countdown" role="timer" aria-label="Time until the celebrations begin">
          <div class="cd-cell"><b id="cdD">&ndash;</b><span>DAYS</span></div>
          <div class="cd-cell"><b id="cdH">&ndash;</b><span>HOURS</span></div>
          <div class="cd-cell"><b id="cdM">&ndash;</b><span>MINUTES</span></div>
          <div class="cd-cell"><b id="cdS">&ndash;</b><span>SECONDS</span></div>
        </div>
        <p class="cd-note">${esc(target.name)} · ${esc(target.label)} IST<br>${esc(target.dateText)}<br>${esc(C.place)}</p>
      </section>
    </div>
  </main>
  <!-- ============ SCROLL CUE: shown when the doors have opened, gone once the guest scrolls ============ -->
  <div class="scroll-cue" id="scrollCue" aria-hidden="true"><span>${esc(C.hero.scrollCue)}</span><svg viewBox="0 0 24 14"><path d="M3 2l9 9 9-9"/></svg></div>
  <!-- ============ DOOR OVERLAY ============ -->
  <div id="overlay" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(120% 90% at 50% 40%, #f8ecd2 0%, #eed7ab 55%, #dfc08a 100%)">
    <div id="doorScene" role="button" tabindex="0" aria-label="Open the door to enter the invitation" style="position:relative;width:min(94vw, 60vh);aspect-ratio:1024/1536;perspective:1700px;perspective-origin:50% 42%;cursor:pointer">
      <div style="position:absolute;left:23.73%;top:23.44%;width:54.4%;height:67.19%;background:radial-gradient(85% 60% at 50% 42%, #ffdf9e 0%, #b97b2e 45%, #4a2408 100%);overflow:hidden">
        ${img('bg-scene', 'style="position:absolute;left:50%;top:0;width:110%;transform:translateX(-50%);opacity:.9" alt=""')}
        <div style="position:absolute;inset:0;background:radial-gradient(80% 55% at 50% 40%, rgba(255,224,150,.85) 0%, rgba(150,85,25,.55) 55%, rgba(40,18,4,.9) 100%);animation:glowPulse 3s ease-in-out infinite"></div>
        <div style="position:absolute;inset:0;box-shadow:inset 0 0 60px 25px rgba(30,12,2,.85)"></div>
      </div>
      <img id="doorLeft" src="assets/door-left.webp" style="position:absolute;left:23.73%;top:23.44%;width:27.15%;height:67.19%" alt="">
      <img id="doorRight" src="assets/door-right.webp" style="position:absolute;left:50.88%;top:23.44%;width:27.25%;height:67.19%" alt="">
      ${img('door-frame', 'style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" alt="Decorated door"')}
    </div>
    <div id="hint" style="margin-top:18px;color:#7a4a12;font-size:${U(17)};letter-spacing:2px;animation:hintPulse 2.2s ease-in-out infinite">&#10022; &nbsp;Tap the door to enter&nbsp; &#10022;</div>
  </div>
  <!-- ============ MUSIC TOGGLE ============ -->
  <button id="musicBtn" aria-label="Toggle music" title="Music on/off">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
      <line class="slash" x1="2" y1="2" x2="22" y2="22"></line>
    </svg>
  </button>
</div>
<noscript><p style="position:fixed;inset:auto 0 0 0;z-index:99;margin:0;padding:14px;text-align:center;background:#f6ecd6;color:#6b3f10;font-family:Georgia,serif">Please enable JavaScript to open this invitation.</p></noscript>
<script type="module" src="js/app.js?v=${V}"></script>
<script src="/_credit/v1/credit.js" defer data-into="#scroller" data-color="#6d4a2e"></script>
</body>
</html>
`;
put('index.html', html);
console.log(`✓ ${C.slug}: index.html, css/base.css, ${Object.keys(assets).length + 1} images, ${seen.size} fonts, music`);
