/* Modern Wedding: the invitation assembled from its components, one continuous column.
   Scroll order: 1 hero, 2 save our date, 3 our functions, 4 countdown (landscape), 5 RSVP & dua, 6 thank you. */
import { config as C } from '../config.js';
import { h, observePages, toast, downloadIcs, mapsHref, placeOf } from './util.js';
import { InvitationPage, spr, textOr, control, box } from './page.js';
import { OpeningScreen } from './opening.js';
import { AudioControl } from './audio.js';
import { SparkleOverlay } from './sparkle.js';
import { Countdown } from './countdown.js';
import { Rsvp } from './rsvp.js';

const app = document.getElementById('app');
const audio = AudioControl(C.opening);
const sparkle = SparkleOverlay();

/* ── the two actions every event offers ── */
function saveTheDate(ev, label) {
  const b = h('button', { class: 'plain-hit', type: 'button', 'aria-label': `Save the date: ${ev.title}, ${ev.date} ${ev.time}` });
  b.addEventListener('click', () => {
    downloadIcs({ title: `${ev.title}: ${C.couple.first} & ${C.couple.second}`, start: ev.start, end: ev.end, location: placeOf(ev), details: `${ev.date}, ${ev.time}` });
    toast(`Calendar file downloaded: ${ev.title}, ${ev.date}. Open it to add the date.`);
  });
  return b;
}
const openMaps = (ev) => h('a', { class: 'plain-hit', href: mapsHref(ev), target: '_blank', rel: 'noopener', 'aria-label': `View the ${ev.title} venue on Google Maps` });

/* ── page 1: hero ── */
const page1 = InvitationPage(1, [
  spr('p1-monogram', { delay: 0.1, alt: 'A R' }),
  spr('p1-lines', { delay: 0.35, alt: C.hero.lines.join(' ') }),
  textOr(C.couple.first, 'Ayesha', 'p1-name1', { size: 13.5, cls: 'script', delay: 0.6 }),
  spr('p1-and', { delay: 0.85, alt: 'and' }),
  textOr(C.couple.second, 'Rehan', 'p1-name2', { size: 13.5, cls: 'script', delay: 1 }),
  spr('p1-rule', { delay: 1.25 }),
  textOr(C.hero.tagline, 'Two hearts ~ One journey', 'p1-tagline', { size: 2.9, cls: 'script-sm', delay: 1.4 }),
], { satin: false });

/* ── page 2: save our date, with the reveal ── */
const N = C.events[C.date.event] || C.events.nikkah;
/* the reveal happens only on a guest's tap and is never remembered: every fresh load starts unrevealed */
const revealBtn = h('button', { class: 'plain-hit', type: 'button', 'aria-pressed': 'false' }, h('span', { class: 'sr-only' }, 'Reveal the date'));
const page2 = InvitationPage(2, [
  spr('p2-monogram', { delay: 0.1, alt: 'A R' }),
  spr('p2-divider', { delay: 0.25 }),
  spr('p2-title', { delay: 0.4, alt: 'Save Our Date' }),
  textOr(C.date.month, 'November 2026', 'p2-month', { size: 3.6, cls: 'caps', delay: 0.6 }),
  spr('p2-reveal', { still: true, cls: 'reveal-pill', z: 4 }),
  spr('p2-revealed', { still: true, cls: 'revealed-pill', z: 4 }),
  spr('p2-heart', { still: true, cls: 'heart', z: 3 }),
  control('p2-reveal-hit', revealBtn, { z: 6, cls: 'reveal-hit' }),
  control('p2-save-hit', saveTheDate(N)),
  control('p2-maps-hit', openMaps(N)),
]);
revealBtn.addEventListener('click', () => {
  if (page2.classList.contains('revealed')) return;
  page2.classList.add('revealed');
  revealBtn.setAttribute('aria-pressed', 'true');
  revealBtn.firstChild.textContent = `Date revealed: ${C.date.revealDay} ${C.date.month}`;
  revealBtn.disabled = true;
});

/* ── page 3: our functions ── */
const card = (k, ev, refs, d0) => [
  textOr(ev.title, refs.title, `p3-${k}-title`, { size: 5.2, delay: d0 }),
  spr(`p3-${k}-divider`, { delay: d0 + 0.12 }),
  spr(`p3-${k}-icon-date`, { delay: d0 + 0.24 }),
  textOr(ev.date, refs.date, `p3-${k}-date`, { size: 2.9, delay: d0 + 0.24, align: 'left' }),
  spr(`p3-${k}-icon-time`, { delay: d0 + 0.36 }),
  textOr(ev.time, refs.time, `p3-${k}-time`, { size: 2.9, delay: d0 + 0.36, align: 'left' }),
  spr(`p3-${k}-icon-venue`, { delay: d0 + 0.48 }),
  textOr([ev.venue, ...ev.address].join('\n'), refs.venue, `p3-${k}-venue`, { size: 2.9, delay: d0 + 0.48, align: 'left', cls: 'serif lines' }),
  control(`p3-${k}-save-hit`, saveTheDate(ev)),
  control(`p3-${k}-maps-hit`, openMaps(ev)),
];
const VENUE = 'Virupakshi Gardens,\nKarimnagar road, Govindpalli,\nJagtial, Telangana 505327';
const page3 = InvitationPage(3, [
  spr('p3-monogram', { delay: 0.1, alt: 'A R' }),
  spr('p3-title', { delay: 0.25, alt: 'Our Functions' }),
  spr('p3-divider', { delay: 0.4 }),
  ...card('n', C.events.nikkah, { title: 'Nikkah', date: '1 November 2026', time: '11:00 AM', venue: VENUE }, 0.55),
  ...card('r', C.events.reception, { title: 'Reception', date: '2 November 2026', time: '7:00 PM', venue: VENUE }, 0.9),
]);

/* ── page 4: until we say Nikkah (landscape) ── */
const countdown = Countdown(C.countdown.target);
const page4 = InvitationPage(4, [
  spr('p4-title', { delay: 0.1, alt: 'Until We Say Nikkah' }),
  spr('p4-divider', { delay: 0.3 }),
  ...countdown,
  ...[0, 1, 2, 3].map((k) => spr(`p4-label${k}`, { delay: 0.45 + k * 0.1, alt: ['Days', 'Hours', 'Minutes', 'Seconds'][k] })),
]);

/* ── page 5: RSVP & dua for us ── */
const page5 = InvitationPage(5, [
  spr('p5-ornament', { delay: 0.1 }),
  spr('p5-title', { delay: 0.25, alt: 'RSVP' }),
  spr('p5-divider1', { delay: 0.4 }),
  ...Rsvp(C.rsvp),
  spr('p5-divider2', { delay: 0.75 }),
  spr('p5-dua-title', { delay: 0.9, alt: 'Dua for Us' }),
]);

/* ── page 6: thank you ── */
const page6 = InvitationPage(6, [
  spr('p6-title', { delay: 0.1, alt: 'Thank You' }),
  spr('p6-lines', { delay: 0.35, alt: 'For your love & blessings' }),
  spr('p6-cartouche', { delay: 0.6, alt: 'We are eagerly waiting to celebrate with you!' }),
  h('a', { class: 'created', href: 'https://invitivals.com/', target: '_blank', rel: 'noopener' }, 'Created by ', h('b', {}, 'INVITIVALS')),
]);

const invitation = h('main', { class: 'invitation column', id: 'invitation' }, page1, page2, page3, page4, page5, page6);
app.append(invitation);

/* the next pages' plates are fetched once the hero is ready, without layout cost */
addEventListener('load', () => { for (const n of [2, 3]) { new Image().src = `assets/plate${n}.webp`; } }, { once: true });

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
