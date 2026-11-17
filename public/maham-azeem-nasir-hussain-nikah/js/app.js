/* Maham Azeem & Nasir Hussain: the Nikah invitation, one continuous column.
   Scroll order: 1 welcome (the card's Bismillah, the M N monogram) · 2 the couple and their request · 3 the
   invitation card the client chose, whole and untouched · 4 the Nikah Ceremony with its calendar buttons ·
   5 the countdown · 6 the venue and its map · 7 the closing.
   Pages 1, 2 and 4 to 7 stand on the client's own card with its lettering lifted off (the tool makes those plates).
   ONE event only. No RSVP. */
import { config as C } from '../config.js?v=1';
import { art } from './art.js?v=1';
import { h, observePages, calendarHref } from './util.js?v=1';
import { OpeningScreen } from './opening.js?v=1';
import { AudioControl } from './audio.js?v=1';
import { SparkleOverlay } from './sparkle.js?v=1';
import { Countdown } from './countdown.js?v=1';

const app = document.getElementById('app');
const audio = AudioControl(C.opening);
const sparkle = SparkleOverlay();

function Page(n, cls, plateName, alt, content) {
  const [w, ph] = art[plateName];
  const src = plateName === 'invitation' ? 'assets/invitation.jpg' : `assets/${plateName}.webp`;
  const page = h('section', { class: `page ${cls}`, id: `page-${n}`, style: { aspectRatio: `${w} / ${ph}` } });
  const plate = h('img', { class: 'plate', src, alt, decoding: n === 1 ? 'sync' : 'async', loading: n <= 2 ? 'eager' : 'lazy', width: w, height: ph });
  const ready = () => page.classList.add('ready');   // content waits for its plate, so it never floats on an empty page
  plate.addEventListener('load', ready); plate.addEventListener('error', ready);
  if (plate.complete) ready();
  page.append(plate, ...content.flat().filter(Boolean));
  return page;
}
const r = (d, tag, attrs, ...kids) => h(tag, { ...attrs, class: `reveal ${attrs.class || ''}`, style: { '--d': `${d}s`, ...(attrs.style || {}) } }, ...kids);
const lines = (a) => a.flatMap((l, i) => (i ? [h('br'), l] : [l]));
/* the card's own divider, redrawn as a line, a small diamond, a line */
const rule = (d, cls = '') => r(d, 'div', { class: `rule ${cls}`, 'aria-hidden': 'true', html: '<svg viewBox="0 0 240 16" fill="none"><defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stop-color="#b8924a" stop-opacity="0"/><stop offset=".5" stop-color="#b8924a"/><stop offset="1" stop-color="#b8924a" stop-opacity="0"/></linearGradient></defs><path d="M0 8h98M142 8h98" stroke="url(#rg)" stroke-width="1.2"/><path d="M120 1.5 126.5 8 120 14.5 113.5 8Z" stroke="#b8924a" stroke-width="1.2"/><path d="M120 5 123 8 120 11 117 8Z" fill="#b8924a"/><circle cx="106" cy="8" r="1.4" fill="#b8924a"/><circle cx="134" cy="8" r="1.4" fill="#b8924a"/></svg>' });
const mono = (d, cls = '') => r(d, 'div', { class: `mono ${cls}` }, h('img', { src: 'assets/mn-gold.webp', alt: 'M N monogram', width: art['mn-gold'][0], height: art['mn-gold'][1], decoding: 'async', draggable: 'false' }));
/* a name in capitals with taller initials, as on the card */
const name = (text) => text.split(' ').flatMap((w, i) => [i ? ' ' : null, h('span', { class: 'cap' }, w[0]), w.slice(1)]);
const E = C.event;
const cal = { title: `${E.title} — ${C.couple}`, local: E.local, localEnd: E.localEnd, timeZone: E.timeZone, location: `${E.venue}, ${E.place}`, details: `${E.date}, ${E.time} (Pakistan time)\nVenue: ${E.venue}, ${E.place}\nLocation: ${E.mapsUrl}` };

/* ── page 1: welcome ── */
const cue = h('button', { class: 'cue', type: 'button', 'aria-label': 'Scroll to the invitation' }, h('span', {}, C.welcome.cue), h('i', { 'aria-hidden': 'true' }));
const page1 = Page(1, 'p-welcome', 'plate-a', 'Bismillah ir-Rahman ir-Rahim. In the name of Allah, the Most Gracious, the Most Merciful.', [
  h('div', { class: 'card' },
    rule(0.1),
    mono(0.3),
    r(0.55, 'h1', { class: 'kicker' }, C.welcome.title),
    rule(0.7),
    r(0.85, 'p', { class: 'when' }, C.welcome.date),
    r(0.95, 'p', { class: 'where' }, C.welcome.place)),
  cue,
]);

/* ── page 2: the couple ── */
const page2 = Page(2, 'p-couple', 'plate-b', '', [h('div', { class: 'card' },
  r(0.1, 'p', { class: 'kicker' }, C.welcome.title),
  rule(0.25),
  r(0.4, 'h2', { class: 'name' }, name(C.bride)),
  r(0.6, 'p', { class: 'amp', 'aria-label': 'and' }, '&'),
  r(0.75, 'p', { class: 'name' }, name(C.groom)),
  rule(0.95),
  r(1.1, 'p', { class: 'message' }, lines(C.message)),
)]);

/* ── page 3: the invitation card the client chose, whole ── */
const page3 = Page(3, 'p-card', 'invitation', `Nikah Invitation. ${C.bride} and ${C.groom}. ${E.date}, ${E.time}. ${E.venue}, ${E.place}.`, []);

/* ── page 4: the Nikah Ceremony ── */
const page4 = Page(4, 'p-event', 'plate-b', '', [h('div', { class: 'card' },
  r(0.1, 'h2', { class: 'script' }, E.title),
  rule(0.25),
  r(0.4, 'div', { class: 'datebox', role: 'group', 'aria-label': `${E.date}, ${E.time}` },
    h('span', { class: 'side' }, E.weekday),
    h('span', { class: 'mid' }, h('b', {}, E.day), h('em', {}, E.month), h('em', {}, E.year)),
    h('span', { class: 'side' }, E.time)),
  rule(0.55),
  r(0.7, 'p', { class: 'venue' }, E.venue),
  r(0.8, 'p', { class: 'place' }, E.place),
  r(0.95, 'a', { class: 'btn', href: calendarHref(cal), target: '_blank', rel: 'noopener', 'data-cal': 'google' }, 'Add to Google Calendar'),
  r(1.05, 'a', { class: 'btn btn--quiet', href: E.ics, download: 'nikah-ceremony.ics', 'data-cal': 'ics' }, 'Apple / Outlook Calendar'),
)]);

/* ── page 5: the countdown ── */
const page5 = Page(5, 'p-count', 'plate-b', '', [h('div', { class: 'card' },
  r(0.1, 'h2', { class: 'script script--two' }, ...C.countdown.heading.map((l) => h('b', {}, l))),
  rule(0.3),
  Countdown(C.countdown.target, C.countdown.word),
  r(0.9, 'p', { class: 'note' }, lines(C.countdown.note)),
)]);

/* ── page 6: the venue ── */
const page6 = Page(6, 'p-venue', 'plate-b', '', [h('div', { class: 'card' },
  r(0.1, 'h2', { class: 'script' }, 'The Venue'),
  rule(0.25),
  r(0.4, 'div', { class: 'pin', 'aria-hidden': 'true', html: '<svg viewBox="0 0 48 60" fill="none" stroke="#b8924a" stroke-width="1.8"><path d="M24 57C24 57 5 36 5 22a19 19 0 0 1 38 0c0 14-19 35-19 35Z"/><circle cx="24" cy="22" r="7.5"/></svg>' }),
  r(0.55, 'p', { class: 'venue' }, E.venue),
  r(0.65, 'p', { class: 'place' }, E.place),
  r(0.8, 'a', { class: 'btn', href: E.mapsUrl, target: '_blank', rel: 'noopener', 'data-maps': 'nikah' }, 'View Venue on Google Maps'),
)]);

/* ── page 7: the closing ── */
const page7 = Page(7, 'p-end', 'plate-b', '', [h('div', { class: 'card' },
  mono(0.1),
  r(0.4, 'h2', { class: 'script script--big' }, C.closing.title),
  rule(0.55),
  r(0.7, 'p', { class: 'message' }, lines(C.closing.lines)),
  r(0.9, 'p', { class: 'sign' }, name(C.bride), h('i', {}, ' & '), name(C.groom)),
),
h('a', { class: 'created', href: 'https://invitivals.com/?utm_source=invitation&utm_medium=footer&utm_campaign=maham-azeem-nasir-hussain-nikah', target: '_blank', rel: 'noopener' }, 'Created by ', h('b', {}, 'INVITIVALS')),
]);

const invitation = h('main', { class: 'invitation column', id: 'invitation' }, page1, page2, page3, page4, page5, page6, page7);
app.append(invitation);
cue.addEventListener('click', () => page2.scrollIntoView({ behavior: 'smooth', block: 'start' }));

/* the next plates are fetched once the first page is ready, without layout cost */
addEventListener('load', () => { new Image().src = 'assets/plate-b.webp'; new Image().src = 'assets/invitation.jpg'; }, { once: true });

OpeningScreen(C.opening, {
  audio,
  onStart() { invitation.classList.add('shown'); },
  onOpened() {
    page1.classList.add('on');
    sparkle.show();
    observePages(invitation);
    window.scrollTo(0, 0);
  },
});
