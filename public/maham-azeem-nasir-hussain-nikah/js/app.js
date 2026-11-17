/* Maham Azeem & Nasir Hussain: the Nikah invitation, one continuous column.
   Scroll order: 1 welcome (the card's Bismillah, the M N monogram) · 2 the couple and their request · 3 Save Our
   Date (December 2026, the 21st) · 4 the invitation card the client chose, whole and untouched · 5 the Nikah
   Ceremony with its calendar buttons · 6 the countdown · 7 the venue and its map · 8 the closing.
   ONE continuous sheet (2026-11-17): page 1 is the client's card with its lower lettering lifted off; every page
   after it is the card's paper between two garlands (the card's own foot flowers). A page closes with the garland
   and the next opens with the same garland turned upside down, so the flowers meet their mirror image across every
   joining line and nothing is cut. A page is as tall as its content needs (`tall`, in % of its width).
   ONE event only. No RSVP. */
import { config as C } from '../config.js?v=2';
import { art } from './art.js?v=2';
import { h, observePages, calendarHref } from './util.js?v=2';
import { OpeningScreen } from './opening.js?v=2';
import { AudioControl } from './audio.js?v=2';
import { SparkleOverlay } from './sparkle.js?v=2';
import { Countdown } from './countdown.js?v=2';

const app = document.getElementById('app');
const audio = AudioControl(C.opening);
const sparkle = SparkleOverlay();

let pageNo = 0;
/* page 1: the card itself as the plate */
function Page(cls, plateName, alt, content) {
  const n = ++pageNo, [w, ph] = art[plateName];
  const page = h('section', { class: `page ${cls}`, id: `page-${n}`, style: { aspectRatio: `${w} / ${ph}` } });
  const plate = h('img', { class: 'plate', src: `assets/${plateName}.webp`, alt, decoding: 'sync', loading: 'eager', width: w, height: ph });
  const ready = () => page.classList.add('ready');   // content waits for its plate, so it never floats on an empty page
  plate.addEventListener('load', ready); plate.addEventListener('error', ready);
  if (plate.complete) ready();
  page.append(plate, ...content.flat().filter(Boolean));
  return page;
}
/* every later page: paper, the garland upside down at its head, the garland at its foot */
function Sheet(cls, tall, content) {
  const n = ++pageNo, [gw, gh] = art.garland;
  const page = h('section', { class: `page sheet ${cls}`, id: `page-${n}`, style: { aspectRatio: `100 / ${tall}` } });
  const g = (c) => h('img', { class: `garland ${c}`, src: 'assets/garland.webp', alt: '', 'aria-hidden': 'true', decoding: 'async', loading: n <= 3 ? 'eager' : 'lazy', width: gw, height: gh, draggable: 'false' });
  const foot = g('garland--foot');
  const ready = () => page.classList.add('ready');
  foot.addEventListener('load', ready); foot.addEventListener('error', ready);
  if (foot.complete) ready();
  page.append(h('div', { class: 'paper', 'aria-hidden': 'true' }), g('garland--head'), foot, ...content.flat().filter(Boolean));
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
const page1 = Page('p-welcome', 'plate-a', 'Bismillah ir-Rahman ir-Rahim. In the name of Allah, the Most Gracious, the Most Merciful.', [
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
const page2 = Sheet('p-couple', 168, [h('div', { class: 'card' },
  r(0.1, 'p', { class: 'kicker' }, C.welcome.title),
  rule(0.25),
  r(0.4, 'h2', { class: 'name' }, name(C.bride)),
  r(0.6, 'p', { class: 'amp', 'aria-label': 'and' }, '&'),
  r(0.75, 'p', { class: 'name' }, name(C.groom)),
  rule(0.95),
  r(1.1, 'p', { class: 'message' }, lines(C.message)),
)]);

/* ── Save Our Date: the month of the Nikah. The 21st takes its golden heart when the guest taps Reveal Date (never
      remembered); Save the Date opens a small sheet with Google Calendar and the .ics file; the map button is the
      client's own link. ── */
const sheet = h('div', { class: 'chooser', hidden: true });
function openSheet(title, rows) {
  const close = () => { sheet.hidden = true; sheet.replaceChildren(); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  sheet.replaceChildren(
    h('div', { class: 'chooser__veil', onclick: close }),
    h('div', { class: 'chooser__card', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      h('h2', { class: 'chooser__title' }, title),
      h('p', { class: 'chooser__sub' }, E.title, h('br'), `${E.date} · ${E.time}`, h('br'), `${E.venue}, ${E.place}`),
      ...rows.map((row) => h('a', { class: `btn ${row.quiet ? 'btn--quiet' : ''}`, href: row.href, target: row.download ? null : '_blank', rel: 'noopener', download: row.download || null, 'data-sheet': row.key }, row.label)),
      h('button', { class: 'chooser__close', type: 'button', onclick: close }, 'Close')));
  sheet.hidden = false;
  document.addEventListener('keydown', onKey);
  sheet.querySelector('a')?.focus();
}
document.body.append(sheet);
const S = C.saveOurDate;
const first = new Date(Date.UTC(S.year, S.month - 1, 1)).getUTCDay(), days = new Date(Date.UTC(S.year, S.month, 0)).getUTCDate();
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][S.month - 1];
const HEART = '<svg viewBox="0 0 64 58" aria-hidden="true"><defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2c27a"/><stop offset=".55" stop-color="#b98f42"/><stop offset="1" stop-color="#94702b"/></linearGradient></defs><path d="M32 55C12 40 3 29 3 18 3 9 10 3 18 3c6 0 11 3 14 8 3-5 8-8 14-8 8 0 15 6 15 15 0 11-9 22-29 37Z" fill="url(#hg)" stroke="#f6e3b4" stroke-width="2"/></svg>';
const cells = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => h('span', { class: 'dow', 'aria-hidden': 'true' }, d));
for (let i = 0; i < first; i++) cells.push(h('span', { 'aria-hidden': 'true' }));
for (let d = 1; d <= days; d++) cells.push(d === S.day ? h('span', { class: 'day day--mark', 'aria-label': `${d} ${MONTH} ${S.year}: ${E.title}` }, h('i', { class: 'day__heart', html: HEART }), h('b', {}, String(d))) : h('span', { class: 'day' }, String(d)));
const revealBtn = h('button', { class: 'btn btn--reveal', type: 'button', 'aria-pressed': 'false' }, S.reveal);
const legend = h('div', { class: 'legend', 'aria-hidden': 'true' }, h('b', {}, E.date), h('span', {}, `${E.title} · ${E.time}`));
const pageDate = Sheet('p-date', 226, [h('div', { class: 'card' },
  r(0.1, 'h2', { class: 'script' }, S.title),
  rule(0.25),
  r(0.4, 'p', { class: 'kicker month' }, `${MONTH} ${S.year}`),
  r(0.55, 'div', { class: 'cal', role: 'group', 'aria-label': `${MONTH} ${S.year}` }, ...cells),
  r(0.7, 'div', { class: 'revealbox' }, revealBtn, legend),
  r(0.85, 'button', { class: 'btn', type: 'button', 'data-open': 'save', onclick: () => openSheet(S.save, [
    { key: 'google', label: 'Add to Google Calendar', href: calendarHref(cal) },
    { key: 'ics', label: 'Apple / Outlook Calendar', href: E.ics, download: 'nikah-ceremony.ics', quiet: true },
  ]) }, S.save),
  r(0.95, 'a', { class: 'btn btn--quiet', href: E.mapsUrl, target: '_blank', rel: 'noopener', 'data-maps': 'save-our-date' }, S.maps),
)]);
revealBtn.addEventListener('click', () => {
  if (pageDate.classList.contains('revealed')) return;
  pageDate.classList.add('revealed');
  revealBtn.setAttribute('aria-pressed', 'true');
  revealBtn.disabled = true;
  legend.removeAttribute('aria-hidden');
  legend.setAttribute('role', 'status');
});

/* ── the invitation card the client chose, whole: laid on the sheet like the card itself ── */
const pageCard = Sheet('p-card', 178, [
  r(0.15, 'figure', { class: 'chosen' }, h('img', { src: 'assets/invitation.jpg', alt: `Nikah Invitation. ${C.bride} and ${C.groom}. ${E.date}, ${E.time}. ${E.venue}, ${E.place}.`, width: art.invitation[0], height: art.invitation[1], decoding: 'async', loading: 'lazy', draggable: 'false' })),
]);

/* ── page 4: the Nikah Ceremony ── */
const page4 = Sheet('p-event', 196, [h('div', { class: 'card' },
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
const page5 = Sheet('p-count', 172, [h('div', { class: 'card' },
  r(0.1, 'h2', { class: 'script script--two' }, ...C.countdown.heading.map((l) => h('b', {}, l))),
  rule(0.3),
  Countdown(C.countdown.target, C.countdown.word),
  r(0.9, 'p', { class: 'note' }, lines(C.countdown.note)),
)]);

/* ── page 6: the venue ── */
const page6 = Sheet('p-venue', 166, [h('div', { class: 'card' },
  r(0.1, 'h2', { class: 'script' }, 'The Venue'),
  rule(0.25),
  r(0.4, 'div', { class: 'pin', 'aria-hidden': 'true', html: '<svg viewBox="0 0 48 60" fill="none" stroke="#b8924a" stroke-width="1.8"><path d="M24 57C24 57 5 36 5 22a19 19 0 0 1 38 0c0 14-19 35-19 35Z"/><circle cx="24" cy="22" r="7.5"/></svg>' }),
  r(0.55, 'p', { class: 'venue' }, E.venue),
  r(0.65, 'p', { class: 'place' }, E.place),
  r(0.8, 'a', { class: 'btn', href: E.mapsUrl, target: '_blank', rel: 'noopener', 'data-maps': 'nikah' }, 'View Venue on Google Maps'),
)]);

/* ── page 7: the closing ── */
const page7 = Sheet('p-end', 190, [h('div', { class: 'card' },
  mono(0.1),
  r(0.4, 'h2', { class: 'script script--big' }, C.closing.title),
  rule(0.55),
  r(0.7, 'p', { class: 'message' }, lines(C.closing.lines)),
  r(0.9, 'p', { class: 'sign' }, name(C.bride), h('i', {}, ' & '), name(C.groom)),
),
h('a', { class: 'created', href: 'https://invitivals.com/?utm_source=invitation&utm_medium=footer&utm_campaign=maham-azeem-nasir-hussain-nikah', target: '_blank', rel: 'noopener' }, 'Created by ', h('b', {}, 'INVITIVALS')),
]);

const invitation = h('main', { class: 'invitation column', id: 'invitation' }, page1, page2, pageDate, pageCard, page4, page5, page6, page7);
app.append(invitation);
cue.addEventListener('click', () => page2.scrollIntoView({ behavior: 'smooth', block: 'start' }));

/* the next plates are fetched once the first page is ready, without layout cost */
addEventListener('load', () => { new Image().src = 'assets/garland.webp'; new Image().src = 'assets/paper.webp'; }, { once: true });

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
