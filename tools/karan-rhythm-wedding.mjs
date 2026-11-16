#!/usr/bin/env node
/* Karan & Rhythm — the wedding, Saturday 12 December 2026, Ghaziabad (client brief 2026-11-16).

     node tools/karan-rhythm-wedding.mjs

   A separate invitation at public/karan-rhythm-wedding, on the design the client chose:
   public/aashna-sanket-celebrations (a hand-built single page). That page is only READ here — its styles, script,
   intro film, hero, Ganesha and closing art — and never written. Everything a guest reads comes from this file,
   exactly as the family wrote it. Their five photographs (invites/src/karan-rhythm-wedding/photo-1…5.jpg, only
   resized, never retouched or recropped in the file) make the "Our Moments" gallery and the link-preview cover
   (tools/karan-rhythm-wedding-og.html).

   Differences from the reference, as asked: the Ganesha slide second with "The celebrations begin in" and the
   countdown to 12 December; families as supplied; two event days, each with its own venue and map button; the
   date plaques are the design's scratch-to-reveal panels (since 2026-11-16, at the client's request); an Our Moments gallery with a lightbox; RSVP with the two
   numbers supplied; the closing "With Best Compliments — Dadke & Nanke — Invitation from Mrs. Meena & Mr. Mukesh Chopra". */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'karan-rhythm-wedding', URL_ = `https://invitivals.com/${SLUG}/`, COVER = 'cover-karan-rhythm.jpg';
const REF = path.join(ROOT, 'public/aashna-sanket-celebrations'), D = path.join(ROOT, 'public', SLUG), SRC = path.join(ROOT, 'invites/src', SLUG);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ── the family's words ── */
const HOSTS = 'Mrs. Meena & Mr. Mukesh Chopra';
const GROOM = { role: 'The Groom', name: 'KARAN', rel: 'Grandson of', of: 'Late Smt. Raj Rani & Late Sh. Gian Chand Chopra' };
const BRIDE = { role: 'The Bride', name: 'RHYTHM', rel: 'Daughter of', of: 'Mrs. Monica & Mr. Jitendra Batra' };
const DAYS = [
  { key: '2026-12-11', day: 'Friday', date: '11 December 2026', icon: 'i-tilak', sub: 'the Sagan date',
    events: [{ name: 'Sagan Ceremony', time: '7:00 PM onwards' }],
    venue: { name: 'Talab by Miraya', addr: ['Vasundhara, Ghaziabad, U.P.'], map: 'https://maps.app.goo.gl/jVfVtfjFooYwwdNH9?g_st=iw', label: 'View Sagan Venue on Google Maps' },
    cal: { title: 'Sagan Ceremony · Karan & Rhythm', start: '20261211T190000', end: '20261211T220000', notes: 'Sagan Ceremony – 7:00 PM onwards' } },
  { key: '2026-12-12', day: 'Saturday', date: '12 December 2026', icon: 'i-baraat', night: true, sub: 'the wedding date',
    title: 'Wedding Ceremony',
    events: [{ name: 'Sehra Bandi', time: '7:00 PM' }, { name: 'Departure of Barat', time: '8:00 PM' }],
    venue: { name: 'Emerald Greens', addr: ['Govindpuram, Ghaziabad, U.P.'], map: 'https://maps.app.goo.gl/eXXiEZqZ6iPuwx1VA?g_st=iw', label: 'View Wedding Venue on Google Maps' },
    cal: { title: 'Wedding of Karan & Rhythm', start: '20261212T190000', end: '20261212T230000', notes: 'Sehra Bandi – 7:00 PM\nDeparture of Barat – 8:00 PM' } },
];
const COUNT_TO = '2026-12-12T19:00:00+05:30';   // the wedding day: Sehra Bandi, 7:00 PM IST
const PHONES = ['9818084085', '9811062670'];
/* the photographs, in the order the gallery shows them: the wide black-and-white one leads, then two pairs */
const PHOTOS = [
  { f: 'photo-5', wide: true, alt: 'Karan and Rhythm, foreheads together, smiling, in black and white', pos: '50% 40%' },
  { f: 'photo-1', alt: 'Karan and Rhythm in black and gold, her hand on his chest', pos: '50% 22%' },
  { f: 'photo-2', alt: 'Rhythm’s engagement ring, the couple close behind', pos: '50% 62%' },
  { f: 'photo-3', alt: 'Karan and Rhythm under a canopy of lanterns and candles', pos: '50% 62%' },
  { f: 'photo-4', alt: 'Karan on one knee, slipping the ring onto Rhythm’s finger', pos: '50% 60%' },
];
const WA_MSG = 'Namaste! I have received the wedding invitation of Karan & Rhythm.';

/* ── files ── */
for (const d of ['assets/cal', 'assets/moments']) fs.mkdirSync(path.join(D, d), { recursive: true });
for (const f of ['.htaccess', 'assets/hero.webp', 'assets/ganesha.webp', 'assets/footer.webp', 'assets/intro-poster.webp', 'assets/intro.mp4', 'assets/music.mp3'])
  fs.copyFileSync(path.join(REF, f), path.join(D, f));
for (const p of PHOTOS) {
  const src = path.join(SRC, p.f + '.jpg');
  await sharp(src).rotate().resize({ width: p.wide ? 1200 : 900, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(path.join(D, `assets/moments/${p.f}.webp`));
  await sharp(src).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 84, effort: 6 }).toFile(path.join(D, `assets/moments/${p.f}-full.webp`));
  const m = await sharp(path.join(D, `assets/moments/${p.f}-full.webp`)).metadata(); p.w = m.width; p.h = m.height;
}
const icsText = (t) => String(t).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
for (const d of DAYS) {
  const v = d.venue, loc = [v.name, ...v.addr].join(', ');
  fs.writeFileSync(path.join(D, `assets/cal/${d.key}.ics`), ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Karan & Rhythm//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
    'BEGIN:VEVENT', `UID:${SLUG}-${d.key}@invitivals.com`, 'DTSTAMP:20261116T000000Z', `DTSTART;TZID=Asia/Kolkata:${d.cal.start}`, `DTEND;TZID=Asia/Kolkata:${d.cal.end}`,
    `SUMMARY:${icsText(d.cal.title)}`, `LOCATION:${icsText(loc)}`, `DESCRIPTION:${icsText(d.cal.notes + '\nMap: ' + v.map + '\n' + URL_)}`, `URL:${URL_}`,
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(d.cal.title)}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n'));
  d.gcal = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: d.cal.title, dates: `${d.cal.start}/${d.cal.end}`, ctz: 'Asia/Kolkata', location: loc, details: d.cal.notes + '\nMap: ' + v.map + '\n' + URL_ }).toString();
}

/* ── the page: the reference's head, styles, symbols, intro and script, with this couple's words ── */
let h = fs.readFileSync(path.join(REF, 'index.html'), 'utf8').replace(/\r\n/g, '\n');
const rep = (a, b) => { if (typeof a === 'string' ? h.split(a).length !== 2 : !a.test(h)) throw new Error('reference changed? ' + String(a).slice(0, 80)); h = h.replace(a, () => b); };
const between = (a, b, inner) => { const i = h.indexOf(a), j = h.indexOf(b, i); if (i < 0 || j < 0) throw new Error('marker ' + a); h = h.slice(0, i) + inner + h.slice(j); };

const TITLE = 'Karan & Rhythm · Wedding Invitation', DESC = 'Karan weds Rhythm · Saturday, 12 December 2026 · Emerald Greens, Ghaziabad. Tap to open your invitation.';
rep('<title>Wedding Invitation</title>', `<title>${esc(TITLE)}</title>`);
rep(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(DESC)}">`);
rep(/<meta property="og:url" content="[^"]*">/, `<link rel="canonical" href="${URL_}">\n<meta property="og:url" content="${URL_}">`);
rep(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(TITLE)}">`);
rep(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(DESC)}">`);
rep(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${URL_}assets/${COVER}">`);
rep(/<meta property="og:image:secure_url" content="[^"]*">/, `<meta property="og:image:secure_url" content="${URL_}assets/${COVER}">`);
rep(/<meta property="og:image:alt" content="[^"]*">/, '<meta property="og:image:alt" content="Karan &amp; Rhythm · Wedding Invitation · 12 December 2026">');
rep('<meta name="twitter:card" content="summary_large_image">', `<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${esc(TITLE)}">\n<meta name="twitter:description" content="${esc(DESC)}">\n<meta name="twitter:image" content="${URL_}assets/${COVER}">`);

/* the envelope */
rep('<p class="ec-n">Aashna <i>&amp;</i> Sanket</p>', '<p class="ec-n">Karan <i>&amp;</i> Rhythm</p>');
rep('<div class="env-seal"><span>A<i>&amp;</i>S</span></div>', '<div class="env-seal"><span>K<i>&amp;</i>R</span></div>');

/* this page's own styles, after the reference's */
const CSS = `
/* ══ Karan & Rhythm (2026-11-16) ══════════════════════════════════════ */
.weds{margin:26px 0 0;font:400 clamp(40px,12.4vw,54px)/1.05 var(--script);color:var(--maroon)}
.weds i{display:inline-block;margin:0 .14em;font:italic 500 .42em/1 var(--serif);color:var(--gold);vertical-align:.32em}
.role{margin:0 0 10px;font:600 11px/1 var(--caps);letter-spacing:.34em;text-indent:.34em;color:var(--gold)}
.from{margin:40px 0 0}
.from .rel{margin-top:0}
.from .hosts{margin-top:4px}
.dateplate{position:relative;display:block;width:min(100%,330px);margin:0 auto 26px;border-radius:12px;overflow:hidden;
  border:1px solid #D5AF62;outline:1px solid rgba(213,175,98,.45);outline-offset:4px;box-shadow:0 8px 24px rgba(112,42,50,.25)}
.day-title{margin:0 0 18px;font:700 clamp(20px,6.2vw,24px)/1.2 var(--caps);letter-spacing:.12em;text-indent:.12em;color:var(--maroon)}
.ev-venue{margin:26px auto 0;max-width:330px;padding:20px 18px 24px;border:1px solid rgba(169,120,45,.55);border-radius:14px;
  background:linear-gradient(180deg,rgba(255,245,229,.6),rgba(246,231,206,.8));box-shadow:inset 0 0 0 5px rgba(255,245,229,.7),inset 0 0 0 6px rgba(213,175,98,.35)}
.ev-venue .k{margin:0 0 6px;font:600 10.5px/1 var(--caps);letter-spacing:.3em;text-indent:.3em;color:var(--gold)}
.ev-venue .venue-name{font-size:clamp(20px,6.2vw,25px)}
.ev-venue .address{margin-top:8px}
.ev-venue .cta{margin-top:18px;padding:0 18px;font-size:11px;letter-spacing:.1em;white-space:normal;line-height:1.3;text-align:center;max-width:100%}
/* Our Moments */
.moments{padding-top:44px;padding-bottom:20px}
.gal{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px}
.ph{position:relative;display:block;margin:0;padding:0;border:0;border-radius:8px;overflow:hidden;cursor:zoom-in;background:#2b1013;
  box-shadow:0 0 0 1px rgba(213,175,98,.75),0 0 0 4px var(--ivory),0 0 0 5px rgba(213,175,98,.45),0 14px 26px -14px rgba(60,20,20,.55)}
.ph--wide{grid-column:1/-1;aspect-ratio:3/2}
.ph--tall{aspect-ratio:3/4}
.ph img{display:block;width:100%;height:100%;object-fit:cover;transition:transform 1.4s var(--ease),filter .6s ease}
.ph:hover img{transform:scale(1.04)}
.ph::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(43,16,19,0) 62%,rgba(43,16,19,.32))}
.ph:focus-visible{outline:2px solid var(--gold);outline-offset:6px}
.gal-hint{margin:16px 0 0;font:italic 500 15px/1.3 var(--serif);color:var(--gold)}
.lb{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;background:rgba(24,8,10,.95);opacity:0;transition:opacity .35s ease}
.lb[hidden]{display:none}
.lb.on{opacity:1}
.lb-img{max-width:min(94vw,1100px);max-height:82vh;max-height:82dvh;width:auto;height:auto;border-radius:6px;box-shadow:0 0 0 1px rgba(213,175,98,.55),0 20px 60px rgba(0,0,0,.6);
  opacity:0;transform:scale(.97);transition:opacity .35s ease,transform .45s var(--ease);touch-action:pan-y}
.lb-img.in{opacity:1;transform:none}
.lb button{position:absolute;display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;cursor:pointer;
  border:1px solid rgba(213,175,98,.7);background:rgba(43,16,19,.72);color:#F3D592}
.lb button svg{width:22px;height:22px;fill:currentColor}
.lb-x{top:max(14px,env(safe-area-inset-top));right:14px}
.lb-prev{left:max(10px,calc(50vw - 600px))}
.lb-next{right:max(10px,calc(50vw - 600px))}
.lb-n{position:absolute;bottom:max(16px,env(safe-area-inset-bottom));left:0;right:0;margin:0;text-align:center;font:600 11px/1 var(--caps);letter-spacing:.3em;color:#D5AF62}
html.lb-open,html.lb-open body{overflow:hidden}
@media (max-width:520px){.lb-prev,.lb-next{top:auto;bottom:max(8px,env(safe-area-inset-bottom))}.lb-prev{left:16px}.lb-next{right:16px}.lb-n{bottom:max(24px,calc(env(safe-area-inset-bottom) + 16px))}}
/* the closing */
.finale-copy .k2{margin-top:16px;font:600 clamp(10px,3vw,12px)/1 var(--caps);letter-spacing:.24em;text-indent:.24em;color:var(--gold);font-style:normal}
.finale-copy .hosts{margin-top:8px;font:600 clamp(17px,5vw,20px)/1.35 var(--serif);font-style:normal;color:var(--maroon)}
.finale-copy .sig{margin-top:10px}
`;
rep('</style>', CSS + '</style>');

/* the body: from the hero to the end of the main element */
const ICON = (id) => `<svg class="mk" aria-hidden="true"><use href="#${id}"/></svg>`;
const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
const CALI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14zM7 11h5v5H7z"/></svg>';
const CLOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.2 3.1.8-1.2-4.5-2.7z"/></svg>';
const head = (id, t) => `<header class="sec-head rv">\n  <svg class="lotus" aria-hidden="true"><use href="#i-lotus"/></svg>\n  <h2 id="${id}">${t}</h2>\n  <svg class="divider draw-me" aria-hidden="true"><use href="#i-divider"/></svg>\n</header>`;
const person = (p) => `<div class="person rv">\n  <p class="role">${p.role}</p>\n  <h3 class="name"><span class="given">${p.name}</span></h3>\n  <p class="rel">${p.rel}</p>\n  <p class="of">${esc(p.of)}</p>\n</div>`;
const WA = (n) => `https://wa.me/91${n}?text=`;
const phone = (n) => { const pretty = n.slice(0, 5) + ' ' + n.slice(5); return `<li class="phone rv">
    <a class="num" href="tel:+91${n}" aria-label="Call ${pretty}">${pretty}</a>
    <div class="acts">
      <a class="btn" href="tel:+91${n}" aria-label="Call ${pretty}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>Call</a>
      <a class="btn wa" href="${WA(n)}${encodeURIComponent(WA_MSG)}" data-wa="${WA(n)}" data-msg="${esc(WA_MSG)}" target="_blank" rel="noopener" aria-label="WhatsApp ${pretty}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.12-1.470-.72-1.7-.8s-.39-.12-.56.12-.64.8-.78.97-.29.18-.53.06a6.7 6.7 0 0 1-3.340-2.920c-.25-.43.25-.4.72-1.340a.45.45 0 0 0-.02-.43c-.06-.12-.56-1.340-.76-1.840s-.4-.42-.56-.42h-.47a.9.9 0 0 0-.66.3 2.76 2.76 0 0 0-.86 2.050 4.8 4.8 0 0 0 1 2.550 11 11 0 0 0 4.200 3.700c1.560.68 2.170.73 2.950.62a2.5 2.5 0 0 0 1.650-1.160 2 2 0 0 0 .14-1.160c-.06-.1-.22-.16-.47-.28z"/></svg>WhatsApp</a>
      <button class="btn copy" type="button" data-copy="${n}" aria-label="Copy number ${pretty}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11z"/></svg><span>Copy</span></button>
    </div>
  </li>`; };
const day = (d) => `<div class="day${d.night ? ' day--night' : ''}">
  <!-- scratch to reveal the date (client, 2026-11-16): the design's own foil panel; a button for screen readers reveals it too -->
  <div class="scratch rv" data-label="${d.day}, ${d.date}" data-sub="${d.sub}">
    <div class="plaque"><span class="pl-day">${d.day}</span><span class="pl-sep" aria-hidden="true">|</span><span class="pl-date">${d.date}</span></div>
    <canvas class="foil" aria-hidden="true"></canvas>
    <button class="sr reveal-btn" type="button">Reveal the date: ${d.day}, ${d.date}</button>
  </div>
  <p class="scratch-hint rv">Scratch the panel to reveal the date</p>
  ${d.title ? `<p class="day-title rv">${d.title}</p>` : ''}
  <ol class="events">
  ${d.events.map((e, i) => `<li class="ev ev--eve${d.events.length === 1 ? ' ev--crown' : ''} rv" style="--d:${i * 70}ms">
    ${ICON(i === 0 ? d.icon : 'i-agni')}
    <h4>${esc(e.name)}</h4><p class="time">${esc(e.time)}</p>
  </li>`).join('\n  ')}
  </ol>
  <div class="ev-venue rv">
    <p class="k">Venue</p>
    <h3 class="venue-name">${esc(d.venue.name)}</h3>
    <address class="address">${d.venue.addr.map(esc).join('<br>')}</address>
    <a class="cta" href="${d.venue.map}" target="_blank" rel="noopener">${PIN}${d.venue.label}</a>
  </div>
  <div class="cal rv">
    <a class="btn btn--sm" href="assets/cal/${d.key}.ics" download="Karan-Rhythm-${d.day}.ics">${CALI}Add to Calendar</a>
    <a class="btn btn--sm" href="${esc(d.gcal)}" target="_blank" rel="noopener">${CLOCK}Google Calendar</a>
  </div>
</div>`;

/* the seal and the mandala are the reference's own drawings, with this couple's letters in the seal */
const sealA = h.indexOf('<div class="seal" aria-hidden="true">'), sealB = h.indexOf('<div class="paper">');
let SEAL = h.slice(sealA, sealB).trim();
SEAL = SEAL.replace('font-weight="600" fill="#702A32">A</text>', 'font-weight="600" fill="#702A32">K</text>').replace('font-weight="600" fill="#702A32">S</text>', 'font-weight="600" fill="#702A32">R</text>');
if (!/>K<\/text>[\s\S]*>R<\/text>/.test(SEAL)) throw new Error('seal letters');
const mA = h.indexOf('<svg class="mandala"'), mB = h.indexOf('</svg>', mA) + 6;
const MANDALA = h.slice(mA, mB);
const MAIN = `<main id="invite">
  <section class="hero" aria-label="Karan and Rhythm">
    <img id="heroimg" src="assets/hero.webp" alt="The bride and groom beneath a flower-hung palace arch, looking out over a lake at sunset" width="941" height="1671" fetchpriority="high" decoding="async">
    <div class="petals" aria-hidden="true"><svg style="left:18%;--s:12px;--t:18s;--dl:-4s;--x:40px;--r:240deg"><use href="#i-petal"/></svg><svg style="left:72%;--s:10px;--t:22s;--dl:-12s;--x:-50px;--r:-260deg"><use href="#i-petal"/></svg><svg style="left:45%;--s:11px;--t:26s;--dl:-20s;--x:30px;--r:200deg"><use href="#i-petal"/></svg></div>
    <div class="hero-copy">
      <p class="shubh" lang="hi">॥ शुभ विवाह ॥</p>
      <h1 class="nm">Karan</h1>
      <p class="amp" aria-hidden="true">&amp;</p>
      <p class="nm">Rhythm</p>
      <p class="hd">Wedding Invitation</p>
    </div>
    <a class="cue" href="#invocation" aria-label="Scroll down to the invitation"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16.5 4.5 9l1.4-1.4L12 13.7l6.1-6.1L19.5 9z"/></svg><span>Scroll</span></a>
  </section>

  ${SEAL}

  <div class="paper">
    <svg class="sprig l" style="top:40px" aria-hidden="true"><use href="#i-sprig"/></svg>
    <svg class="sprig r" style="top:40px" aria-hidden="true"><use href="#i-sprig"/></svg>

    <!-- 2 · Lord Ganesha, the blessings and the countdown to the wedding day (as on the design the client chose) -->
    <section class="invocation" id="invocation">
      <p class="guest rv" id="guest" hidden>Dear <b></b></p>
      <img class="ganesha rv" src="assets/ganesha.webp" alt="Lord Ganesha" width="720" height="583" loading="lazy" decoding="async">
      <p class="mantra rv" lang="sa">॥ श्री गणेशाय नमः ॥</p>
      <p class="shloka rv" lang="sa">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभः ।<br>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥</p>
      <div class="count rv" id="count" data-when="${COUNT_TO}" hidden>
        <p class="count-lead">The celebrations begin in</p>
        <div class="count-grid">
          <div><b data-u="d">0</b><span>Days</span></div><div><b data-u="h">0</b><span>Hours</span></div><div><b data-u="m">0</b><span>Minutes</span></div>
        </div>
      </div>
    </section>

    <!-- 3 · Karan weds Rhythm: the groom, the bride, and who invites -->
    <section class="invitation" aria-labelledby="h-inv">
      ${MANDALA}
      ${head('h-inv', 'Wedding Invitation')}
      <p class="weds rv">Karan <i>weds</i> Rhythm</p>
      ${person(GROOM)}
      <p class="with rv" aria-label="with">with</p>
      ${person(BRIDE)}
      <div class="from rv">
        <p class="rel">Invitation from</p>
        <p class="hosts">${esc(HOSTS)}</p>
      </div>
    </section>

    <!-- 4 · the two days, each with its own venue and map -->
    <section class="celebrations" aria-labelledby="h-cel">
      <svg class="sprig r" style="top:16px" aria-hidden="true"><use href="#i-sprig"/></svg>
      ${head('h-cel', 'Wedding Celebrations')}
      ${DAYS.map(day).join('\n      ')}
    </section>

    <section class="interlude">
      <div class="petals" aria-hidden="true"><svg style="left:14%;--s:11px;--t:20s;--dl:-6s;--x:30px;--r:220deg"><use href="#i-petal"/></svg><svg style="left:82%;--s:9px;--t:24s;--dl:-15s;--x:-40px;--r:-240deg"><use href="#i-petal"/></svg></div>
      <div class="rv"><svg class="divider draw-me" aria-hidden="true"><use href="#i-divider"/></svg></div>
      <p class="rv">From a beautiful beginning to a forever promise, come celebrate the journey of <span class="pair">Karan &amp; Rhythm</span> with us.</p>
      <div class="rv"><svg class="divider draw-me" aria-hidden="true"><use href="#i-divider"/></svg></div>
    </section>

    <!-- 5 · Our Moments: the couple's own photographs; a tap opens them large -->
    <section class="moments" aria-labelledby="h-mom">
      <svg class="sprig l" style="top:12px" aria-hidden="true"><use href="#i-sprig"/></svg>
      ${head('h-mom', 'Our Moments')}
      <div class="gal">
        ${PHOTOS.map((p, i) => `<button class="ph ${p.wide ? 'ph--wide' : 'ph--tall'} rv" type="button" data-i="${i}" style="--d:${(i % 2) * 90}ms" aria-label="Open photograph ${i + 1} of ${PHOTOS.length}: ${esc(p.alt)}"><img src="assets/moments/${p.f}.webp" alt="${esc(p.alt)}" loading="lazy" decoding="async" style="object-position:${p.pos}"></button>`).join('\n        ')}
      </div>
      <p class="gal-hint rv">Tap a photograph to see it large</p>
    </section>

    <!-- 6 · RSVP: the two numbers the family gave -->
    <section class="rsvp" aria-labelledby="h-rsvp">
      <svg class="sprig r" style="top:10px" aria-hidden="true"><use href="#i-sprig"/></svg>
      ${head('h-rsvp', 'Kindly RSVP')}
      <p class="lead rv">“Your presence, blessings and love will make this occasion truly memorable.”</p>
      <ul class="phones">
      ${PHONES.map(phone).join('\n      ')}
      </ul>
      <p class="sr" aria-live="polite" id="live"></p>
      <div class="share rv">
        <svg class="divider draw-me" aria-hidden="true"><use href="#i-divider"/></svg>
        <p class="lead" style="margin-top:18px">Share this invitation with family &amp; friends</p>
        <div class="acts">
          <button class="btn" type="button" id="share"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16a3 3 0 0 0-2.1.84L8.9 12.7a3 3 0 0 0 0-1.4l6.9-4.1A3 3 0 1 0 15 5a3 3 0 0 0 .05.5L8.1 9.6a3 3 0 1 0 0 4.8l6.95 4.1A3 3 0 1 0 18 16z"/></svg>Share</button>
          <a class="btn" href="https://wa.me/?text=${encodeURIComponent('Karan & Rhythm — Wedding Invitation\n' + URL_)}" target="_blank" rel="noopener">WhatsApp</a>
          <button class="btn copy" type="button" data-copy="${URL_}"><span>Copy Link</span></button>
        </div>
      </div>
    </section>
  </div>

  <!-- the closing, in the family's words -->
  <section class="finale" aria-labelledby="h-fin">
    <img src="assets/footer.webp" alt="The couple's hands joined, with swans, lotus flowers and golden lamps" width="941" height="1672" loading="lazy">
    <div class="finale-copy rv">
      <h2 id="h-fin">With Best Compliments</h2>
      <svg class="divider draw-me" aria-hidden="true"><use href="#i-divider"/></svg>
      <p class="sig">Dadke &amp; Nanke</p>
      <p class="k2">Invitation from</p>
      <p class="hosts">${esc(HOSTS)}</p>
      <p class="sd">12 December 2026</p>
    </div>
  </section>
</main>

<!-- the photographs, large -->
<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Our Moments" hidden>
  <img class="lb-img" id="lb-img" alt="">
  <button class="lb-x" type="button" id="lb-x" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4 6.3 6.3 6.3-6.3z"/></svg></button>
  <button class="lb-prev" type="button" id="lb-prev" aria-label="Previous photograph"><svg viewBox="0 0 24 24"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12z"/></svg></button>
  <button class="lb-next" type="button" id="lb-next" aria-label="Next photograph"><svg viewBox="0 0 24 24"><path d="M8.6 16.6 10 18l6-6-6-6-1.4 1.4 4.6 4.6z"/></svg></button>
  <p class="lb-n" id="lb-n"></p>
</div>
`;
between('<main id="invite">', '<script>\n(function(){', MAIN);

/* the script: share text and address; the foil's small line names the date it hides; the gallery's lightbox */
rep("ctx.fillText('the wedding date',w/2,h/2+11);", "ctx.fillText(box.getAttribute('data-sub')||'the wedding date',w/2,h/2+11);");
rep("navigator.share({title:document.title,text:'Aashna & Sanket — Wedding Invitation',url:'https://invitivals.com/aashna-sanket-celebrations/'})", `navigator.share({title:document.title,text:'Karan & Rhythm — Wedding Invitation',url:'${URL_}'})`);
const LB = `
  // Our Moments: tap a photograph to see it large; arrows, swipe and the keyboard move between them
  var PH=${JSON.stringify(PHOTOS.map((p) => ({ s: `assets/moments/${p.f}-full.webp`, a: p.alt, w: p.w, h: p.h })))};
  var lb=document.getElementById('lb'),lbImg=document.getElementById('lb-img'),lbN=document.getElementById('lb-n'),cur=0,lastBtn=null,sx=null;
  function show(i){cur=(i+PH.length)%PH.length;var p=PH[cur];lbImg.classList.remove('in');
    var im=new Image();im.onload=function(){lbImg.src=p.s;lbImg.alt=p.a;lbImg.width=p.w;lbImg.height=p.h;requestAnimationFrame(function(){lbImg.classList.add('in');});};im.src=p.s;
    lbN.textContent=(cur+1)+' / '+PH.length;new Image().src=PH[(cur+1)%PH.length].s;}
  function openLb(i,btn){lastBtn=btn;lb.hidden=false;root.classList.add('lb-open');requestAnimationFrame(function(){lb.classList.add('on');});show(i);document.getElementById('lb-x').focus();}
  function closeLb(){lb.classList.remove('on');root.classList.remove('lb-open');setTimeout(function(){lb.hidden=true;lbImg.removeAttribute('src');},350);if(lastBtn)lastBtn.focus();}
  document.querySelectorAll('.ph').forEach(function(b){b.addEventListener('click',function(){openLb(+b.getAttribute('data-i'),b);});});
  document.getElementById('lb-x').addEventListener('click',closeLb);
  document.getElementById('lb-prev').addEventListener('click',function(e){e.stopPropagation();show(cur-1);});
  document.getElementById('lb-next').addEventListener('click',function(e){e.stopPropagation();show(cur+1);});
  lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
  document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')closeLb();else if(e.key==='ArrowLeft')show(cur-1);else if(e.key==='ArrowRight')show(cur+1);});
  lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  lb.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>45)show(cur+(dx<0?1:-1));},{passive:true});

  // copy a number / the address / the link`;
rep('\n\n  // copy a number / the address / the link', LB);

if (/aashna|sanket|mathur|shrivastava|rama celebration|9354525269|9999066723/i.test(h.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, ''))) throw new Error('the reference couple is still on the page');
fs.writeFileSync(path.join(D, 'index.html'), h.replace('<!doctype html>', '<!doctype html>\n<!-- written by tools/karan-rhythm-wedding.mjs from the design of public/aashna-sanket-celebrations — edit the tool, not this file -->'));
console.log('✓', SLUG, PHOTOS.map((p) => `${p.f} ${p.w}x${p.h}`).join(', '));
