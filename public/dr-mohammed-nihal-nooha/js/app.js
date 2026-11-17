/* Dr. Mohammed Nihal & Nooha: the invitation, one continuous column.
   Scroll order: 1 the invitation (Bismillah, NN monogram, the hosts and the couple) · 2 Nikah Ceremony ·
   3 Walima Ceremony · 4 the countdown to the Nikah (landscape) · 5 the closing (NN monogram).
   The NN monogram is on pages 1 and 5 only. There is no RSVP. */
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

/* one page: its plate, a satin band across the joining line above it, and its content */
function Page(n, cls, content, { satin = true } = {}) {
  const [w, ph] = art[`plate${n}`];
  const page = h('section', { class: `page ${cls}`, id: `page-${n}`, style: { aspectRatio: `${w} / ${ph}` } });
  const plate = h('img', { class: 'plate', src: `assets/plate${n}.webp`, alt: '', decoding: n === 1 ? 'sync' : 'async', loading: n <= 2 ? 'eager' : 'lazy', width: w, height: ph });
  const ready = () => page.classList.add('ready');   // content waits for its plate, so it never floats on an empty page
  plate.addEventListener('load', ready); plate.addEventListener('error', ready);
  if (plate.complete) ready();
  page.append(plate, ...content);
  if (satin) page.append(h('div', { class: 'satin', 'aria-hidden': 'true' }, h('img', { src: 'assets/satin.webp', alt: '', decoding: 'async', loading: 'lazy', width: art.satin[0], height: art.satin[1] })));
  return page;
}
const r = (d, tag, attrs, ...kids) => h(tag, { ...attrs, class: `reveal ${attrs.class || ''}`, style: { '--d': `${d}s`, ...(attrs.style || {}) } }, ...kids);
const pic = (name, alt, cls) => h('img', { class: cls, src: `assets/${name}.webp`, alt, width: art[name]?.[0], height: art[name]?.[1], decoding: 'async', draggable: 'false' });
const ICON = {
  date: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  time: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
};
const icon = (k) => h('span', { class: 'ico', html: ICON[k] });

/* ── page 1: the invitation ── */
const H = C.hero;
const page1 = Page(1, 'p-hero', [h('div', { class: 'card' },
  r(0.1, 'div', { class: 'bismillah' }, pic('bismillah', 'Bismillah ir-Rahman ir-Rahim', '')),
  r(0.3, 'div', { class: 'mono' }, pic('nn-plum', 'N N', '')),
  r(0.5, 'p', { class: 'hosts' }, H.hosts),
  r(0.65, 'p', { class: 'request' }, ...H.request.flatMap((l, i) => (i ? [h('br'), l] : [l]))),
  r(0.85, 'h1', { class: 'name' }, ...H.groom.map((l) => h('span', {}, l))),
  r(1.05, 'p', { class: 'and' }, h('i'), H.and, h('i')),
  r(1.2, 'p', { class: 'name name--bride' }, H.bride),
  r(1.4, 'p', { class: 'of' }, h('em', {}, H.brideOf[0]), H.brideOf[1]),
)], { satin: false });

/* ── pages 2 and 3: a ceremony each, with its own map and calendar buttons ── */
const ceremony = (n, ev) => {
  const cal = { title: `${ev.title} — ${C.couple}`, local: ev.local, timeZone: C.timeZone, location: ev.venue, details: `${ev.date}, ${ev.time}\nVenue: ${ev.venue}\nLocation: ${ev.mapsUrl}` };
  return Page(n, `p-event p-${ev.key}`, [h('div', { class: 'card' },
    r(0.1, 'div', { class: 'orn' }, pic('p5-ornament', '', '')),
    r(0.25, 'h2', { class: 'title' }, ev.title),
    r(0.4, 'div', { class: 'rule' }, pic('p2-divider', '', '')),
    r(0.55, 'p', { class: 'line line--date' }, icon('date'), ev.date),
    r(0.65, 'p', { class: 'line' }, icon('time'), ev.time),
    r(0.8, 'p', { class: 'label' }, 'Venue'),
    r(0.88, 'p', { class: 'venue' }, ev.venue),
    r(1.05, 'a', { class: 'btn btn--plum', href: ev.mapsUrl, target: '_blank', rel: 'noopener', 'data-maps': ev.key }, icon('pin'), h('span', {}, ev.mapsLabel)),
    r(1.15, 'a', { class: 'btn btn--ivory', href: calendarHref(cal), target: '_blank', rel: 'noopener', 'data-cal': ev.key }, icon('date'), h('span', {}, 'Save to Google Calendar')),
    r(1.25, 'a', { class: 'ics', href: ev.ics, download: `${ev.key}-ceremony.ics`, 'data-ics': ev.key }, 'Apple / Outlook calendar (.ics)'),
  )]);
};
const page2 = ceremony(2, C.events[0]);
const page3 = ceremony(3, C.events[1]);

/* ── page 4: until we say Nikah (landscape) ── */
const page4 = Page(4, 'p-count', [
  r(0.1, 'h2', { class: 'until' }, h('span', {}, C.countdown.lead), h('b', {}, C.countdown.word)),
  r(0.3, 'div', { class: 'until-rule' }, pic('p4-divider', '', '')),
  ...Countdown(C.countdown.target, C.countdown.word),
]);

/* ── page 5: the closing ── */
const page5 = Page(5, 'p-end', [
  r(0.1, 'div', { class: 'mono' }, pic('nn-gold', 'N N', '')),
  r(0.4, 'p', { class: 'pair' }, C.couple),
  r(0.65, 'p', { class: 'closing' }, ...C.closing.lines.flatMap((l, i) => (i ? [h('br'), l] : [l]))),
  h('a', { class: 'created', href: 'https://invitivals.com/?utm_source=invitation&utm_medium=footer&utm_campaign=dr-mohammed-nihal-nooha', target: '_blank', rel: 'noopener' }, 'Created by ', h('b', {}, 'INVITIVALS')),
]);

const invitation = h('main', { class: 'invitation column', id: 'invitation' }, page1, page2, page3, page4, page5);
app.append(invitation);

/* the next page's plate is fetched once the hero is ready, without layout cost */
addEventListener('load', () => { new Image().src = 'assets/plate2.webp'; }, { once: true });

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
