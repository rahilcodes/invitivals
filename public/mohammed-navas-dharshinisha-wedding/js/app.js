/* Mohammed Navas & Dharshinisha: the invitation, one continuous column (the design of dr-mohammed-nihal-nooha).
   Scroll order: 1 the invitation (Bismillah, ND monogram, the couple, the date) · 2 Save Our Date (December 2026,
   the 13th revealed) · 3 Our Functions (Nikah and Walima cards) · 4 the countdown to the Nikah (landscape) ·
   5 the closing (ND monogram, Thank You).
   Pages 2 and 3 follow the reference's layout: their pieces take the boxes the reference measured (js/art.js).
   There is no RSVP. */
import { config as C } from '../config.js?v=3';
import { art, box } from './art.js?v=1';
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
  page.append(plate, ...content.flat().filter(Boolean));
  if (satin) page.append(h('div', { class: 'satin', 'aria-hidden': 'true' }, h('img', { src: 'assets/satin.webp', alt: '', decoding: 'async', loading: 'lazy', width: art.satin[0], height: art.satin[1] })));
  return page;
}
const r = (d, tag, attrs, ...kids) => h(tag, { ...attrs, class: `reveal ${attrs.class || ''}`, style: { '--d': `${d}s`, ...(attrs.style || {}) } }, ...kids);
const pic = (name, alt, cls) => h('img', { class: cls, src: `assets/${name}.webp`, alt, width: art[name]?.[0], height: art[name]?.[1], decoding: 'async', draggable: 'false' });
/* the box the reference's layout gives a piece: at('p3-n-date') → left/top/width/height in % of the page */
const at = (id, grow = {}) => { const [x, y, w, hh] = box[id]; return { left: `${x + (grow.dx || 0)}%`, top: `${y + (grow.dy || 0)}%`, width: `${grow.w ?? w}%`, height: `${grow.h ?? hh}%` }; };
/* a cut-out of the reference in its own place */
const spr = (id, d, alt = '') => r(d, 'div', { class: 's', style: at(id) }, pic(id, alt, ''));
/* every entry carries the whole day's programme, the venue and its map link */
const calOf = (ev) => ({ title: `${ev.title} — ${C.couple}`, local: ev.local, minutes: ev.minutes, timeZone: C.timeZone, location: ev.venue,
  details: `${ev.date}\n${C.programme.join('\n')}\nVenue: ${ev.venue}\nLocation: ${ev.mapsUrl}\n\nhttps://invitivals.com/${C.slug}/` });
const [NIKAH, WALIMA] = C.events;

/* ── the chooser sheet of page 2: both ceremonies behind one painted button ── */
const sheet = h('div', { class: 'sheet', hidden: true });
function openSheet(title, rows) {
  const close = () => { sheet.hidden = true; sheet.replaceChildren(); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  sheet.replaceChildren(
    h('div', { class: 'sheet__veil', onclick: close }),
    h('div', { class: 'sheet__card', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      h('h2', { class: 'sheet__title' }, title),
      ...rows.map((row) => (typeof row === 'string' ? h('p', { class: 'sheet__note' }, row) : h('a', { class: `sheet__btn ${row.quiet ? 'sheet__btn--quiet' : ''}`, href: row.href, target: row.download ? null : '_blank', rel: 'noopener', download: row.download || null }, h('b', {}, row.label), row.sub ? h('span', {}, row.sub) : null))),
      h('button', { class: 'sheet__close', type: 'button', onclick: close }, 'Close')));
  sheet.hidden = false;
  document.addEventListener('keydown', onKey);
  sheet.querySelector('a')?.focus();
}
document.body.append(sheet);

/* ── page 1: the invitation ── */
const H = C.hero;
const page1 = Page(1, 'p-hero', [h('div', { class: 'card' },
  r(0.1, 'div', { class: 'bismillah' }, pic('bismillah', 'Bismillah ir-Rahman ir-Rahim', '')),
  r(0.3, 'div', { class: 'mono' }, pic('nd-plum', 'N D monogram of Mohammed Navas and Dharshinisha', '')),
  r(0.65, 'p', { class: 'request' }, ...H.request.flatMap((l, i) => (i ? [h('br'), l] : [l]))),
  r(0.85, 'h1', { class: 'name' }, ...H.groom.map((l) => h('span', {}, l))),
  r(1.05, 'p', { class: 'and' }, h('i'), H.and, h('i')),
  r(1.2, 'p', { class: 'name name--bride' }, H.bride),
  r(1.4, 'p', { class: 'when' }, H.when),
),
  /* the scroll cue (client, 2026-11-26): below the card, above the satin wave; it bobs gently and fades once the guest scrolls */
  r(2.0, 'div', { class: 'scroll-cue', 'aria-hidden': 'true' }, h('span', { class: 'scroll-cue__word' }, 'Scroll'),
    h('span', { class: 'scroll-cue__ring' }, h('i'), h('i'))),
], { satin: false });
addEventListener('scroll', function onScroll() {
  if (scrollY > 60) { page1.classList.add('scrolled'); removeEventListener('scroll', onScroll); }
}, { passive: true });

/* ── page 2: Save Our Date. The reference's frame, panel (its SUN … SAT heading is painted in the plate) and painted
      buttons; the month and its figures are live. The 9th and the 11th wear the golden heart once the guest taps
      Reveal Date, exactly as the reference reveals its day; the reveal is never remembered. ── */
const S = C.saveOurDate;
const first = new Date(Date.UTC(S.year, S.month - 1, 1)).getUTCDay(), days = new Date(Date.UTC(S.year, S.month, 0)).getUTCDate();
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][S.month - 1];
const cells = [];
for (let i = 0; i < first; i++) cells.push(h('span', { 'aria-hidden': 'true' }));
for (let d = 1; d <= days; d++) {
  const mark = S.marks.find((m) => m.day === d);
  cells.push(mark ? h('span', { class: 'day day--mark', 'aria-label': `${d} ${MONTH} ${S.year}: ${mark.label}` }, pic('p2-heart', '', 'day__heart'), h('b', {}, String(d))) : h('span', { class: 'day' }, String(d)));
}
const revealBtn = h('button', { class: 'reveal-hit', type: 'button', 'aria-pressed': 'false', style: at('p2-reveal-hit') }, h('span', { class: 'sr-only' }, 'Reveal the wedding date'));
const page2 = Page(2, 'p-date', [
  r(0.1, 'div', { class: 's orn2', style: { left: '43.5%', top: '11.6%', width: '13%' } }, pic('p5-ornament', '', '')),
  spr('p2-divider', 0.25),
  spr('p2-title', 0.4, 'Save Our Date'),
  r(0.6, 'p', { class: 'month', style: at('p2-month', { dx: -8, w: 51.6 }) }, `${MONTH} ${S.year}`),
  r(0.75, 'div', { class: 'cal', role: 'group', 'aria-label': `${MONTH} ${S.year}` }, ...cells),
  h('div', { class: 's reveal-pill', style: at('p2-reveal'), 'aria-hidden': 'true' }, pic('p2-reveal', '', '')),
  h('div', { class: 'legend', style: at('p2-reveal', { dy: 0.4 }) }, ...S.legend.map((parts, i) => h('p', { class: i ? 'legend__sub' : '' }, ...parts.map((t, k) => (k % 2 ? t : h('b', {}, t)))))),
  revealBtn,
  h('button', { class: 'hit', type: 'button', style: at('p2-save-hit'), 'aria-label': 'Save the date to your calendar', 'data-open': 'save',
    onclick: () => openSheet('Save the Date', [
      'Google Calendar',
      { label: NIKAH.title, sub: `${NIKAH.date} · ${NIKAH.time}`, href: calendarHref(calOf(NIKAH)) },
      { label: WALIMA.title, sub: `${WALIMA.date} · ${WALIMA.time}`, href: calendarHref(calOf(WALIMA)) },
      'Apple / Outlook calendar (.ics)',
      { label: 'Nikah & Walima', sub: 'Both ceremonies in one file', href: C.dayIcs, download: C.dayIcs, quiet: true },
      { label: NIKAH.title, href: NIKAH.ics, download: 'nikah-ceremony.ics', quiet: true },
      { label: WALIMA.title, href: WALIMA.ics, download: 'walima-ceremony.ics', quiet: true },
    ]) }),
  /* one venue for both ceremonies: the painted Google Maps pill opens the family's own link directly */
  h('a', { class: 'hit', style: at('p2-maps-hit'), href: C.mapsUrl, target: '_blank', rel: 'noopener', 'data-maps': 'venue', 'aria-label': `View venue location on Google Maps: ${C.venue}` }),
]);
revealBtn.addEventListener('click', () => {
  if (page2.classList.contains('revealed')) return;
  page2.classList.add('revealed');
  revealBtn.setAttribute('aria-pressed', 'true');
  revealBtn.firstChild.textContent = `Date revealed: ${S.legend.map((p) => p.join('')).join('. ')}`;
  revealBtn.disabled = true;
});

/* ── page 3: Our Functions. The reference's two cards: title, divider, then date, time and venue beside their
      icons, and the two painted buttons (Save the Date → Google Calendar with the ceremony filled in, View on
      Google Maps → the family's own link). No monogram on this page. ── */
const card = (k, ev, d0) => [
  r(d0, 'h3', { class: 'ev-title', style: at(`p3-${k}-title`, { dx: k === 'n' ? -8.2 : -6, w: 32 }) }, ev.title),
  r(d0 + 0.12, 'div', { class: 's', style: at(`p3-${k}-divider`, { dx: k === 'n' ? -1.9 : -1.9 }) }, pic(`p3-${k}-divider`, '', '')),
  spr(`p3-${k}-icon-date`, d0 + 0.24),
  r(d0 + 0.24, 'p', { class: 'ev-line', style: at(`p3-${k}-date`, { w: 37 }) }, ev.date),
  spr(`p3-${k}-icon-time`, d0 + 0.36),
  r(d0 + 0.36, 'p', { class: 'ev-line', style: at(`p3-${k}-time`, { w: 37 }) }, ev.time),
  spr(`p3-${k}-icon-venue`, d0 + 0.48),
  r(d0 + 0.48, 'p', { class: `ev-line ev-venue${ev.venueLines.length > 2 ? ' ev-venue--3' : ''}`, style: at(`p3-${k}-venue`, { w: 37 }) }, ...ev.venueLines.flatMap((l, i) => (i ? [h('br'), l] : [h('b', { class: 'ev-venue__name' }, l)]))),   // the venue's name stands out
  h('a', { class: 'hit', style: at(`p3-${k}-save-hit`), href: calendarHref(calOf(ev)), target: '_blank', rel: 'noopener', 'data-cal': ev.key, 'aria-label': `Save the date: ${ev.title}, ${ev.date}, ${ev.time} (Google Calendar)` }),
  h('a', { class: 'hit', style: at(`p3-${k}-maps-hit`), href: ev.mapsUrl, target: '_blank', rel: 'noopener', 'data-maps': ev.key, 'aria-label': `View the ${ev.title} venue on Google Maps: ${ev.venue}` }),
];
const page3 = Page(3, 'p-func', [
  spr('p3-title', 0.25, 'Our Functions'),
  spr('p3-divider', 0.4),
  card('n', NIKAH, 0.55),
  card('r', WALIMA, 0.9),
]);

/* ── page 4: counting down to forever (landscape) ── */
const page4 = Page(4, 'p-count', [
  r(0.1, 'h2', { class: 'until' }, ...C.countdown.heading.map((l) => h('b', {}, l))),
  r(0.3, 'div', { class: 'until-rule' }, pic('p4-divider', '', '')),
  ...Countdown(C.countdown),
]);

/* ── page 5: the closing ── */
const page5 = Page(5, 'p-end', [
  r(0.1, 'div', { class: 'mono' }, pic('nd-gold', 'N D monogram', '')),
  r(0.4, 'h2', { class: 'thanks' }, C.closing.title),
  r(0.65, 'p', { class: 'closing' }, ...C.closing.lines.flatMap((l, i) => (i ? [h('br'), l] : [l]))),
  h('a', { class: 'created', href: 'https://invitivals.com/?utm_source=invitation&utm_medium=footer&utm_campaign=mohammed-navas-dharshinisha-wedding', target: '_blank', rel: 'noopener' }, 'Created by ', h('b', {}, 'INVITIVALS')),
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
