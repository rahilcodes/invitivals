/* Nandana Vanam — Gruhapravesam invitation (client, 2026-11-12), on the approved design of public/poornajnana.

     node tools/nandana-vanam.mjs

   public/poornajnana/index.html is only READ: its artwork, fonts, song and stylesheet are lifted out of that one
   self-contained file into separate, cacheable files under public/nandana-vanam/ (assets/, fonts/, css/base.css).
   The words come from public/nandana-vanam/config.js — the one file that holds the client's information — and are
   written into index.html; event.ics is written only once config.calendar.endTime is confirmed.
   Hand-written and never touched by this tool: config.js, css/invite.css, js/app.js, rsvp.php, .htaccess. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'public', 'poornajnana', 'index.html');
const D = path.join(ROOT, 'public', 'nandana-vanam');
const { invite: C } = await import(pathToFileURL(path.join(D, 'config.js')).href + '?t=' + Date.now());

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

let css = src.match(/<style>([\s\S]*?)<\/style>/)[1];
const seen = new Map(); let n = 0;
css = css.replace(/url\(data:font\/woff2;base64,([A-Za-z0-9+/=]+)\)/g, (_, b64) => {
  if (!seen.has(b64)) { seen.set(b64, `f${++n}.woff2`); put(`fonts/f${n}.woff2`, Buffer.from(b64, 'base64')); }
  return `url(../fonts/${seen.get(b64)})`;
});
put('css/base.css', `/* lifted unchanged from the approved design (public/poornajnana) by tools/nandana-vanam.mjs — do not edit;\n   this invitation's own styles are in invite.css */\n${css.trim()}\n`);

/* ── the day ───────────────────────────────────────────────────────────────── */
const img = (name, attrs = '') => `<img src="assets/${name}.webp" ${attrs}>`;
const first = C.events[0];
const hasEnd = /^\d\d:\d\d$/.test(C.calendar.endTime || '');
const calendarOn = !!C.calendar.enabled;   // the end time is optional: without one the event has a start and no DTEND
const url = `https://invitivals.com/${C.slug}/`;
const desc = `You are cordially invited to the ${C.hero.ceremony} Ceremony of our new home, ${C.hero.home} — ${C.dateText}.`;

/* ── event.ics (only with a confirmed end time) ────────────────────────────── */
const icsEsc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'); let lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const local = (t) => C.date.replace(/-/g, '') + 'T' + t.replace(':', '') + '00';
function ics() {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Nandana Vanam//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE', `TZID:${C.timeZone}`,
    'BEGIN:STANDARD', 'DTSTART:19701101T020000', 'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU', 'TZOFFSETFROM:-0400', 'TZOFFSETTO:-0500', 'TZNAME:EST', 'END:STANDARD',
    'BEGIN:DAYLIGHT', 'DTSTART:19700308T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0400', 'TZNAME:EDT', 'END:DAYLIGHT',
    'END:VTIMEZONE',
    'BEGIN:VEVENT', `UID:${C.slug}-${C.date}@invitivals.com`, 'DTSTAMP:20261112T000000Z',
    `DTSTART;TZID=${C.timeZone}:${local(first.time)}`, ...(hasEnd ? [`DTEND;TZID=${C.timeZone}:${local(C.calendar.endTime)}`] : []),
    `SUMMARY:${icsEsc(C.calendar.title)}`, `LOCATION:${icsEsc(C.calendar.location)}`,
    `DESCRIPTION:${icsEsc(`Hosts: ${C.calendar.hosts}\n\n${C.events.map((e) => `${e.name} — ${e.label}`).join('\n')}\n\nMap: ${C.venue.mapsUrl}\n${url}`)}`,
    `URL:${url}`, 'STATUS:CONFIRMED', 'TRANSP:OPAQUE',
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsEsc(C.calendar.title)}`, 'TRIGGER:-P1D', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
if (C.timeZone !== 'America/New_York') throw new Error('the VTIMEZONE block in this tool is written for America/New_York');
if (calendarOn) {
  if (hasEnd && C.calendar.endTime <= first.time) throw new Error(`calendar.endTime ${C.calendar.endTime} is not after the ${first.time} start`);
  put('event.ics', ics());
} else if (fs.existsSync(path.join(D, 'event.ics'))) fs.unlinkSync(path.join(D, 'event.ics'));

/* ── the page ──────────────────────────────────────────────────────────────── */
const U = (n) => `calc(${n} * var(--u))`;
const ICON = {
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.500 6.500L20.500 7"/></svg>',
  guests: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.500"/><path d="M2.500 20c0-3.600 2.900-6 6.500-6s6.500 2.400 6.500 6"/><path d="M16 4.800a3.500 3.500 0 0 1 0 6.400M18 14.300c2.100.800 3.500 2.700 3.500 5.700"/></svg>',
  note: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12.500h5"/></svg>',
  cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.500" y="5" width="17" height="15" rx="2"/><path d="M3.500 10h17M8 3v4M16 3v4"/><path d="M8 14h3v3H8z" fill="currentColor" stroke="none"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="9" r="2.500"/></svg>',
  send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/></svg>',
};
const TITLE = (t) => `<h2 class="sec-title">${esc(t)}</h2>`;
const DIVIDER = `<div class="divider">${img('lotus', 'alt=""')}</div>`;
const SEP = `<div class="tl-sep"><div class="tl-line"></div><div class="diya-wrap"><div class="diya-glow"></div>${img('diya', 'alt=""')}</div><div class="tl-line dn"></div></div>`;

const html = `<!DOCTYPE html>
<!-- written by tools/nandana-vanam.mjs from config.js — edit config.js and run the tool, not this file -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${esc(C.title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#f2e3c8">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Invitivals">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(C.title)}">
<meta property="og:description" content="${esc(C.dateText)} · Fuquay Varina, NC. Tap to open the invitation.">
<meta property="og:image" content="${url}og-cover.jpg">
<meta property="og:image:secure_url" content="${url}og-cover.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(C.title)} · ${esc(C.dateText)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(C.title)}">
<meta name="twitter:description" content="${esc(C.dateText)} · Fuquay Varina, NC. Tap to open the invitation.">
<meta name="twitter:image" content="${url}og-cover.jpg">
<link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20100%20100%27%3E%3Ctext%20y%3D%27.9em%27%20font-size%3D%2790%27%3E%F0%9F%AA%94%3C/text%3E%3C/svg%3E">
<link rel="preload" href="fonts/f2.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/door-frame.webp" as="image">
<link rel="stylesheet" href="css/base.css?v=1">
<link rel="stylesheet" href="css/invite.css?v=2">
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
      <div class="hero-words${(C.hero.invocations || []).length ? ' hero-words--inv' : ''}" style="position:absolute;left:8%;right:8%;text-align:center;display:flex;flex-direction:column;gap:${U(6)};color:#7a4a12">
${(C.hero.invocations || []).length ? `        <div class="t-in invocations" style="display:flex;flex-direction:column;gap:${U(3)};font-size:${U(11.5)};letter-spacing:${U(1)};font-style:italic;transition:opacity 1.1s ease .2s, transform 1.1s ease .2s">
${C.hero.invocations.map((l) => `          <div>${esc(l)}</div>`).join('\n')}
        </div>
` : ''}        <div class="t-in" style="font-size:${U(14)};letter-spacing:${U(2)};${(C.hero.invocations || []).length ? `margin-top:${U(8)};` : ''}transition:opacity 1.1s ease .4s, transform 1.1s ease .4s">${esc(C.hero.kicker)}</div>
        <h1 class="t-in" style="margin:0;font-size:${U(44)};font-weight:600;color:#8a4a1a;line-height:1.05;transition:opacity 1.2s ease .8s, transform 1.2s ease .8s">${esc(C.hero.ceremony)}</h1>
        <div class="t-in" style="font-size:${U(16)};font-style:italic;transition:opacity 1.2s ease 1.2s, transform 1.2s ease 1.2s">${esc(C.hero.sub)}</div>
        <div class="t-in" style="font-size:${U(30)};font-weight:700;letter-spacing:${U(1)};color:#9c3d2e;text-shadow:0 0 6px rgba(246,236,214,.95), 0 0 14px rgba(246,236,214,.8);transition:opacity 1.2s ease 1.6s, transform 1.2s ease 1.6s">${esc(C.hero.home)}</div>
        <div class="t-in" style="font-size:${U(17)};font-weight:600;letter-spacing:${U(1)};margin-top:${U(-4)};text-shadow:0 0 6px rgba(246,236,214,.95), 0 0 14px rgba(246,236,214,.8);transition:opacity 1.2s ease 2s, transform 1.2s ease 2s">${esc(C.dateText)}</div>
      </div>
    </div>
    <!-- ============ CONTENT ============ -->
    <div style="position:relative;width:100%;max-width:520px;margin:0 auto;background:linear-gradient(180deg,#f6ecd6 0%,#f3e5c8 50%,#f6ecd6 100%);padding:${U(52)} ${U(30)} ${U(70)};box-sizing:border-box;display:flex;flex-direction:column;gap:${U(52)};color:#6b3f10;text-align:center" id="contentCol">
      <div class="toran-wrap">${img('toran', 'alt=""')}</div>

      <!-- the families and the invitation -->
      <section data-reveal="1" style="opacity:0;display:flex;flex-direction:column;gap:${U(10)}">
        <div style="font-style:italic;font-size:${U(17)};letter-spacing:${U(1)}">With the blessings of</div>
        ${C.blessingsOf.map((n) => `<div class="elders">${esc(n).replace(' &amp; ', ' &amp;<br>')}</div>`).join('')}
        ${DIVIDER}
        <div style="font-size:${U(21)};font-weight:700;line-height:1.4">${esc(C.hosts[0])}<br><span class="amp">&amp;</span><br>${esc(C.hosts[1])}</div>
        <div style="font-style:italic;font-size:${U(16.5)};line-height:1.6;margin-top:${U(8)}">${esc(C.inviteLine)}</div>
        <div class="plaque">
          <div class="plaque-row">${img('lotus', 'alt=""')}<div class="plaque-name">${esc(C.hero.home)}</div>${img('lotus', 'alt="" style="transform:scaleX(-1)"')}</div>
          <div class="plaque-addr">${esc(C.venue.lines.join(' ').replace(/,? \d{5}$/, ''))}</div>
        </div>
        <div style="font-size:${U(17)};font-weight:600;margin-top:${U(4)}">On ${esc(C.dateText)}</div>
${calendarOn ? `        <a class="gold-btn save-date" id="saveDate" href="event.ics" download="nandana-vanam-gruhapravesam.ics">${ICON.cal}SAVE THE DATE</a>
        <p class="save-status" id="saveStatus" role="status" aria-live="polite"></p>
` : ''}      </section>

      <!-- OUR SPECIAL DAY: the scratch card -->
      <section data-reveal="2" class="sec" style="opacity:0" aria-labelledby="h-day">
        <h2 class="sec-title" id="h-day">OUR SPECIAL DAY</h2>
        ${DIVIDER}
        <div class="scard" id="scard">
          <div class="scard-face" id="scardFace" aria-hidden="true">
            <div class="scard-k">${esc(C.scratch.weekday)}</div>
            <div class="scard-n">${esc(C.scratch.day)}</div>
            <div class="scard-m">${esc(C.scratch.month)} <span>${esc(C.scratch.year)}</span></div>
            <div class="scard-t">${esc(first.name)} · ${esc(first.label)}</div>
          </div>
          <canvas class="scard-foil" id="foil" aria-hidden="true"></canvas>
        </div>
        <p class="scard-hint" id="scardHint">SCRATCH TO REVEAL</p>
        <button class="link-btn" id="scardBtn" type="button">Tap to Reveal</button>
        <p class="sr-only" id="scardLive" role="status" aria-live="polite"></p>
      </section>

      <!-- OUR COUNTDOWN -->
      <section data-reveal="3" class="sec" style="opacity:0" aria-labelledby="h-cd">
        <h2 class="sec-title" id="h-cd">OUR COUNTDOWN</h2>
        <p class="sec-sub">COUNTING DOWN TO OUR SPECIAL DAY</p>
        <div class="countdown cd-boxes" id="countdown" role="timer" aria-label="Time until the ceremony begins">
          <div class="cd-cell"><b id="cdD">&ndash;</b><span>DAYS</span></div>
          <div class="cd-cell"><b id="cdH">&ndash;</b><span>HOURS</span></div>
          <div class="cd-cell"><b id="cdM">&ndash;</b><span>MINUTES</span></div>
          <div class="cd-cell"><b id="cdS">&ndash;</b><span>SECONDS</span></div>
        </div>
        <p class="cd-note">${esc(first.name)} · ${esc(first.label)} Eastern Time<br>${esc(C.dateText)}<br>${esc(C.place)}</p>
      </section>

      <!-- EVENT DETAILS -->
      <section data-reveal="4" class="events" style="opacity:0;display:flex;flex-direction:column;gap:${U(18)};align-items:center" aria-labelledby="h-ev">
        ${img('rangoli', 'class="rangoli-bed" alt=""')}
        <img id="ringBell" src="assets/bell-gold.webp" style="width:${U(52)}" alt="Temple bell: tap to ring" title="Ring the bell" role="button" tabindex="0">
        <h2 class="sec-title" id="h-ev" style="position:relative;z-index:1">EVENT DETAILS</h2>
        <div style="display:flex;flex-direction:column;gap:${U(6)};width:100%">
${C.events.map((e, i) => `          <div class="card">
            ${img(e.art, `style="width:${U(e.art === 'meal' ? 200 : 180)};margin-bottom:${U(8)}" alt="${esc(e.alt)}"`)}
            <h3 style="margin:0;font-size:${U(21)};font-weight:700;color:#9c3d2e">${esc(e.name)}</h3>
            <div style="font-size:${U(16)}">${esc(C.dateText)}</div>
            <div style="font-size:${U(17)};font-weight:600">${esc(e.label)}</div>
          </div>`).join(`\n          ${SEP}\n`)}
        </div>
      </section>

      <!-- VENUE -->
      <section data-reveal="5" style="opacity:0;display:flex;flex-direction:column;gap:${U(12)};align-items:center" aria-labelledby="h-venue">
        <h2 class="sec-title" id="h-venue">VENUE</h2>
        <div style="font-size:${U(19)};font-weight:700;letter-spacing:${U(1.5)};color:#9c3d2e">${esc(C.venue.name)}</div>
        <address style="font-style:normal;font-size:${U(17)};line-height:1.7">${C.venue.lines.map(esc).join('<br>')}</address>
        <a class="line-btn" href="${esc(C.venue.mapsUrl)}" target="_blank" rel="noopener">${ICON.pin}VIEW ON MAP</a>
      </section>

      <div data-reveal="6" class="shloka" style="opacity:0">
        <div class="shloka-text">&#2405; &#2358;&#2369;&#2349;&#2306; &#2349;&#2357;&#2340;&#2369; &#2405;</div>
        <div class="shloka-sub">MAY ALL BE AUSPICIOUS</div>
      </div>

      <!-- KINDLY REPLY: the RSVP -->
      <section data-reveal="7" class="sec" style="opacity:0" aria-labelledby="h-rsvp">
        <h2 class="sec-title" id="h-rsvp">KINDLY REPLY</h2>
        ${DIVIDER}
        <form class="rsvp" id="rsvp" novalidate>
          <div class="fld">
            <label for="rName">Full Name <i aria-hidden="true">*</i></label>
            <div class="inp">${ICON.user}<input id="rName" name="name" type="text" autocomplete="name" maxlength="80" required aria-describedby="eName"></div>
            <p class="err" id="eName" hidden></p>
          </div>
          <div class="fld">
            <label for="rEmail">Email Address <i aria-hidden="true">*</i></label>
            <div class="inp">${ICON.mail}<input id="rEmail" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" maxlength="120" required aria-describedby="eEmail"></div>
            <p class="err" id="eEmail" hidden></p>
          </div>
          <fieldset class="fld attend" aria-describedby="eAttend">
            <legend>Will You Attend? <i aria-hidden="true">*</i></legend>
            <label class="choice"><input type="radio" name="attending" value="yes" required><span>Joyfully Accept</span></label>
            <label class="choice"><input type="radio" name="attending" value="no"><span>Regretfully Decline</span></label>
            <p class="err" id="eAttend" hidden></p>
          </fieldset>
          <div class="fld" id="guestsFld">
            <label for="rGuests">Number of Guests</label>
            <div class="inp">${ICON.guests}<input id="rGuests" name="guests" type="number" inputmode="numeric" min="1" max="${C.rsvp.maxGuests}" step="1" value="1" aria-describedby="eGuests"></div>
            <p class="err" id="eGuests" hidden></p>
          </div>
          <div class="fld">
            <label for="rMsg">Message <em>(optional)</em></label>
            <div class="inp inp--area">${ICON.note}<textarea id="rMsg" name="message" rows="3" maxlength="600"></textarea></div>
          </div>
          <div class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
          <button class="gold-btn" id="rsvpSend" type="submit">${ICON.send}<span>SEND RSVP</span></button>
          <div class="rsvp-status" id="rsvpStatus" role="status" aria-live="polite"></div>
        </form>
        <p class="rsvp-direct">Or reply directly:<br><a href="mailto:${esc(C.rsvp.email)}">${esc(C.rsvp.email)}</a><br><a href="https://wa.me/${esc(C.rsvp.whatsapp)}" target="_blank" rel="noopener">WhatsApp ${esc(C.rsvp.phoneText)}</a></p>
      </section>

      <div data-reveal="8" style="opacity:0;display:flex;flex-direction:column;gap:${U(10)};align-items:center">
        <div style="font-style:italic;font-size:${U(17.5)};line-height:1.7;color:#7a4a12">${esc(C.closing)}</div>
        ${DIVIDER}
        <div style="font-size:${U(19)};font-weight:600;line-height:1.6">${esc(C.hosts[0])}<br>&amp; ${esc(C.hosts[1])}</div>
        <div style="font-size:${U(14)};letter-spacing:${U(1.5)};margin-top:${U(10)};color:#a07840">&#10022; &nbsp;SHUBH GRUHAPRAVESHAM&nbsp; &#10022;</div>
      </div>
      <div data-reveal="9" style="opacity:0;position:relative;margin:0 ${U(-30)} ${U(-70)}">
        <div style="position:absolute;left:8%;bottom:14%;width:34%;z-index:1">
          <div style="animation:cowSway 4.5s ease-in-out infinite">
            ${img('cow-calf', 'style="display:block;width:100%;transform:scaleX(-1)" alt="Kamadhenu cow and calf"')}
          </div>
        </div>
        ${img('footer-scene', 'style="display:block;width:100%;position:relative" alt="Temple doorway garden"')}
      </div>
    </div>
  </main>
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
<script type="module" src="js/app.js?v=2"></script>
<script src="/_credit/v1/credit.js" defer data-into="#scroller" data-color="#6d4a2e"></script>
</body>
</html>
`;
put('index.html', html);
console.log(`✓ ${C.slug}: index.html, css/base.css, ${Object.keys(assets).length} images, ${seen.size} fonts, music` + (calendarOn ? ', event.ics' : ' — Save the Date OFF (calendar.enabled is not set)'));
