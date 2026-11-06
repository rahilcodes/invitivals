/* Vaishali & Arpan: the invitation assembled from the demo's components.
   Scroll order: 1 the invitation, 2 the date, 3 the programme (two days), the countdown, Save the Date,
   our memories, the little stars' message, the closing. The three days open as detail views from page 3. */
import { config as C } from '../config.js';
import './layout.js';
import { h, observePages } from './util.js';
import { spr, control, pic, butterfly, box } from './page.js';
import { live, sprAt, Page } from './parts.js';
import { OpeningScreen } from './opening.js';
import { AudioControl } from './audio.js';
import { SparkleOverlay } from './sparkle.js';
import { DateReveal } from './date-reveal.js';
import { openDetail, saveTheDate, openMaps } from './event-detail.js';
import { MemoriesCarousel } from './memories.js';
import { CalendarSheet } from './calendar.js';

const app = document.getElementById('app');
const audio = AudioControl(C.opening);
const sparkle = SparkleOverlay();
const sheet = CalendarSheet(C);
const H = C.hero;

/* ── 1 · the invitation, groom first (the groom side) ── */
const page1 = Page(1, [
  spr('p1-flowers-a', { still: true, motion: 'sway soft', origin: '0% 45%', z: 1 }),
  spr('p1-flowers-b', { still: true, motion: 'sway soft alt', origin: '0% 50%', z: 1 }),
  butterfly('p1-butterfly', { z: 2 }),
  H.ganesha ? h('div', { class: 's reveal', style: { ...box('h-ganesha'), zIndex: 3, '--d': '0.1s' } }, h('img', { src: H.ganesha, alt: 'Lord Ganesha', decoding: 'async', draggable: 'false' })) : null,
  H.invocation ? live('h-invocation', H.invocation, { size: 2.3, cls: 'serif caps tight soft', delay: 0.1, wrap: false }) : null,
  live('h-hindi', H.hindi, { size: 2.6, cls: 'deva burgundy', delay: 0.25, lang: 'hi', wrap: false }),
  sprAt('h-rule1', 'p1-rule1', { delay: 0.4 }),
  live('h-blessings', H.blessings, { size: 2.3, cls: 'serif caps soft', delay: 0.5, wrap: false }),
  live('h-parents', H.parents, { size: 3.15, cls: 'serif bold deep', delay: 0.6 }),
  live('h-request', H.request, { size: 2.5, cls: 'serif italic', delay: 0.7 }),
  live('h-bride', C.couple.groom, { size: 8, cls: 'name burgundy', delay: 0.6, slow: true, wrap: false }),
  live('h-bride-of', H.groomOf, { size: 2.5, cls: 'serif semibold', delay: 0.9 }),
  live('h-with', H.with, { size: 2.4, cls: 'serif caps soft', delay: 1, wrap: false }),
  live('h-groom', C.couple.bride, { size: 8, cls: 'name burgundy', delay: 0.9, slow: true, wrap: false }),
  live('h-groom-of', H.brideOf, { size: 2.5, cls: 'serif semibold', delay: 1.2 }),
  h('div', { class: 'hint', 'aria-hidden': 'true' }, h('span', {}, 'Scroll'), h('i')),
], { id: 'page-1' });

/* ── 2 · reveal our date ── */
const page2 = Page(2, [
  spr('p2-flowers-a', { still: true, motion: 'sway soft', origin: '0% 45%', z: 1 }),
  spr('p2-flowers-b', { still: true, motion: 'sway soft alt', origin: '100% 20%', z: 1 }),
  spr('p2-flowers-c', { still: true, motion: 'sway soft alt', origin: '0% 60%', z: 1 }),
  spr('p2-flowers-d', { still: true, motion: 'sway soft', origin: '100% 60%', z: 1 }),
  butterfly('p2-butterfly-a', { z: 2 }),
  butterfly('p2-butterfly-b', { z: 2 }),
  spr('p2-title', { delay: 0.2, alt: 'Reveal Our Date' }),
  spr('p2-rule', { delay: 0.45 }),
  spr('p2-click', { delay: 0.6, alt: 'Click the button' }),
  ...DateReveal(C.date),
], { id: 'page-2' });

/* ── the three days: detail views, all on plate 4 (title over the arch, the date in its gold frame, the
      programme in one solid card below, the demo's two buttons under it; the page ends with its card) ── */
const schedule = (part) => h('ol', { class: 'timeline' }, ...part.schedule.map(([t, what, note]) => h('li', { class: t ? '' : 'no-time' },
  t ? h('time', {}, t) : null, h('span', {}, what, note ? h('em', {}, note) : null))));
const venue = (part) => h('div', { class: 'venue' }, h('p', { class: 'venue-name' }, part.venue), h('p', { class: 'venue-addr' }, ...part.address.flatMap((l, i) => (i ? [h('br'), l] : [l]))));
/* a day in several places: each section with its heading, hours, venue and its own map link */
const mapLink = (part) => h('a', { class: 'fn-tap venue-map', href: part.mapsUrl, target: '_blank', rel: 'noopener', 'aria-label': `Open ${part.venue} in Google Maps` }, 'Open in Google Maps', h('i', { 'aria-hidden': 'true' }));
const programme = (day) => day.sections
  ? day.sections.map((part) => h('div', { class: 'section' }, h('p', { class: 'seg' }, part.label), schedule(part), venue(part), mapLink(part)))
  : [schedule(day), venue(day)];
const firstTime = (day) => (day.sections ? day.sections[0] : day).schedule[0][0];
const actions = (day) => h('div', { class: 'actions' },
  h('div', { class: 'img-wrap' }, saveTheDate(day, pic('p4-save', 'Save the Date'), sheet)),
  h('div', { class: 'img-wrap' }, openMaps(day, pic('p4-maps', 'Open in Google Maps'))));
const dressCode = (day) => h('div', { class: 'dress' }, h('p', { class: 'dress-title' }, day.dressCode),
  h('ul', { class: 'swatches', 'aria-label': 'Pastel colours: blue, pink, peach and green' },
    ...['blue', 'pink', 'peach', 'green'].map((c) => h('li', {}, h('img', { src: `assets/pastel-${c}.webp`, alt: `Pastel ${c}`, width: 200, height: 200, loading: 'lazy' })))));

const dayPage = (day) => () => Page(4, [
  live('d4-title', day.title, { size: 4.1, cls: 'serif caps burgundy', delay: 0.15 }),
  sprAt('d4-rule', 'p4-rule', { delay: 0.3 }),
  live('d4-date', day.date, { size: 2.4, cls: 'serif caps deep', delay: 0.45, wrap: false }),
  live('d4-weekday', day.weekday, { size: 2.2, cls: 'serif caps soft', delay: 0.5, wrap: false }),
], { id: `detail-${day.key}`, tall: true, flow: h('div', { class: 'flow reveal', style: { '--d': '0.6s', '--top': '91.8cqw' } },
  day.dressCode ? dressCode(day) : null, h('div', { class: 'panel' }, ...programme(day)), actions(day)) });

/* ── 3 · our functions: the programme as three cards, each a button that opens its day. The day's number sits
      in a burgundy medallion, the title and the first hour beside it, and a "Tap to view" pill says what a
      tap does, so nobody wonders whether the cards are live. ── */
const day3 = C.days.find((d) => d.key === 'day3');
const monthShort = (date) => date.split(' ')[1].slice(0, 3);
const card = (id, day, n, delay) => control(id,
  h('button', { class: 'fn', type: 'button', 'aria-label': `${day.title}, ${day.weekday} ${day.date}: view the programme`, onclick: () => openDetail(day.title, 4, dayPage(day)) },
    h('span', { class: 'fn-day', 'aria-hidden': 'true' }, h('b', {}, day.date.split(' ')[0]), h('small', {}, monthShort(day.date))),
    h('span', { class: 'fn-body' },
      h('small', { class: 'fn-when' }, `${day.weekday} · ${day.date.replace(' 2026', '')}`),
      h('b', { class: 'fn-title' }, day.title),
      h('span', { class: 'fn-meta' }, `${firstTime(day)} · ${day.where || day.venue}`),
      h('span', { class: 'fn-tap' }, 'Tap to view', h('i', { 'aria-hidden': 'true' }))),
    h('span', { class: 'fn-n', 'aria-hidden': 'true' }, n)),
  { delay, cls: 'fn-wrap', z: 5 });

const page3 = Page(3, [
  spr('p3-flowers-a', { motion: 'sway', origin: '0% 30%', delay: 0.1, z: 2 }),
  spr('p3-flowers-b', { motion: 'sway alt', origin: '0% 50%', delay: 0.2, z: 2 }),
  spr('p3-flowers-c', { motion: 'sway', origin: '0% 50%', delay: 0.3, z: 2 }),
  spr('p3-flowers-d', { motion: 'sway alt', origin: '100% 50%', delay: 0.2, z: 2 }),
  spr('p3-flowers-e', { motion: 'sway', origin: '100% 50%', delay: 0.3, z: 2 }),
  ...C.days.map((d, i) => card(`f-card-${C.days.length}${'abc'[i]}`, d, ['I', 'II', 'III'][i], 0.4 + 0.2 * i)),
], { id: 'page-3' });

/* ── the countdown: the plain upper half of plate 8, soft florals in its corners, four light tiles ── */
const CD = C.countdown, W = C.wedding;
const tiles = h('div', { class: 'cd', id: 'countdown', role: 'timer', 'aria-live': 'off' },
  ...CD.units.map((u) => h('div', {}, h('b', { 'data-u': u[0].toLowerCase() }, '--'), h('span', {}, u))));
const done = h('p', { class: 'cd-done script', hidden: true }, CD.done);
const tray = h('div', { class: 's cd-tray reveal', style: { ...box('c-tray'), zIndex: 5, '--d': '0.6s' } }, tiles, done);
const pageCountdown = Page(8, [
  live('c-title', CD.title, { size: 7, cls: 'script burgundy', delay: 0.15 }),
  sprAt('c-rule', 'p4-rule', { delay: 0.3 }),
  live('c-lines', CD.lines, { size: 2.7, cls: 'serif italic', delay: 0.45 }),
  tray,
  live('c-date', W.dateLine, { size: 2.6, cls: 'serif caps deep', delay: 0.8, wrap: false }),
  live('c-weekday', `${W.weekday} · ${W.time}`, { size: 2.1, cls: 'serif caps tight soft', delay: 0.85, wrap: false }),
], { id: 'page-countdown', crop: { bottom: 0.5 } });

/* the countdown: worked out every second from the real moment, never below zero */
(() => {
  const target = new Date(W.start).getTime();
  const cell = (u) => tiles.querySelector(`[data-u="${u}"]`);
  const D = cell('d'), Hh = cell('h'), M = cell('m'), S = cell('s');
  const pad = (n) => String(n).padStart(2, '0');
  let timer = 0;
  const tick = () => {
    const left = Math.max(0, Math.floor((target - Date.now()) / 1000));
    if (left === 0) { clearInterval(timer); tiles.hidden = true; done.hidden = false; return; }
    D.textContent = Math.floor(left / 86400); Hh.textContent = pad(Math.floor(left / 3600) % 24);
    M.textContent = pad(Math.floor(left / 60) % 60); S.textContent = pad(left % 60);
  };
  tick(); timer = setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
})();

/* ── Save the Date (plate 5: the title in the arch, the names and the venue; one solid card with the date and
      the time where the plate paints its small frame, and two buttons of the page's own over the painted ones:
      the calendar sheet and the wedding venue on Google Maps) ── */
const SD = C.saveTheDate;
const glyph = (d) => { const i = h('i', { class: 'ico', 'aria-hidden': 'true' }); i.innerHTML = `<svg viewBox="0 0 24 24"><path d="${d}" fill="currentColor"/></svg>`; return i; };
const CAL = 'M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm-1 8v10h12V10H6zm2 2h3v3H8v-3z';
const PIN = 'M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z';
const sdCard = h('div', { class: 's sd-card reveal', style: { ...box('sd-card'), zIndex: 5, '--d': '0.6s' } },
  h('small', {}, SD.labels[0]), h('b', {}, `${W.weekday}, ${W.dateLine}`),
  h('i', { class: 'sd-rule', 'aria-hidden': 'true' }),
  h('small', {}, SD.labels[1]), h('b', {}, W.time));
const sdButton = (id, node, delay) => { node.classList.add('sd-btn'); return control(id, node, { delay, z: 6 }); };
const pageSave = Page(5, [
  spr('p5-lantern-a', { still: true, motion: 'sway hang', origin: '50% 0%', z: 2 }),
  spr('p5-lantern-b', { still: true, motion: 'sway hang alt', origin: '50% 0%', z: 2 }),
  spr('p5-lantern-c', { still: true, motion: 'sway hang', origin: '50% 0%', z: 2 }),
  butterfly('p5-butterfly-a', { z: 3 }),
  butterfly('p5-butterfly-b', { z: 3 }),
  butterfly('p5-butterfly-c', { z: 3 }),
  live('sd-title', SD.title, { size: 8.6, cls: 'script burgundy', delay: 0.15, wrap: false }),
  sprAt('sd-rule', 'p4-rule', { delay: 0.3 }),
  live('sd-names', `${C.couple.groom} & ${C.couple.bride}`, { size: 3.2, cls: 'serif caps deep', delay: 0.4, wrap: false }),
  live('sd-venue', day3.venue, { size: 2.7, cls: 'serif bold', delay: 0.5, wrap: false }),
  live('sd-addr', day3.address[0].replace(/ – .*$/, ''), { size: 2.4, cls: 'serif soft', delay: 0.55, wrap: false }),
  sdCard,
  sdButton('sd-save', saveTheDate(day3, [glyph(CAL), h('span', {}, SD.button)], sheet), 0.85),
  sdButton('sd-maps', openMaps(day3, [glyph(PIN), h('span', {}, SD.maps)]), 0.95),
], { id: 'page-save' });

/* ── our memories (the plate's empty floor below the stage is cut: the next page follows the hint) ── */
const memories = MemoriesCarousel(C.memories.photos);
memories[1].style.top = `${70 / 0.78}%`;
const page6 = Page(6, [
  spr('p6-our', { delay: 0.15, alt: 'Our' }),
  spr('p6-title', { delay: 0.3, alt: 'Memories' }),
  spr('p6-rule', { delay: 0.5 }),
  ...memories,
  spr('p6-frame', { still: true, z: 3 }),
], { id: 'page-6', crop: { bottom: 0.22 } });

/* ── the little stars ── */
const S = C.stars;
const pageStars = Page(7, [
  sprAt('s-rule1', 'p7-rule1', { delay: 0.15 }),
  live('s-title', S.title, { size: 2.7, cls: 'serif caps soft', delay: 0.3 }),
  live('s-big', S.big, { size: 7.2, cls: 'script burgundy', delay: 0.45 }),
  sprAt('s-rule2', 'p7-rule2', { delay: 0.6 }),
  live('s-line', S.line, { size: 3.1, cls: 'serif italic', delay: 0.7 }),
  live('s-love', S.love, { size: 3.1, cls: 'serif', delay: 0.85, wrap: false }),
  live('s-names', S.names, { size: 3.1, cls: 'serif bold deep', delay: 0.95, wrap: false }), /* two lines of names, a little smaller than the bride side's one */
], { id: 'page-stars' });

/* ── the closing (the plate's empty top is cut: the words follow the stars' page) ── */
const Z = C.closing;
const pageClosing = Page(8, [
  live('z-title', Z.title, { size: 4.4, cls: 'serif caps burgundy', delay: 0.2 }),
  sprAt('z-rule', 'p8-rule', { delay: 0.5 }),
  live('z-lines', Z.lines, { size: 3.2, cls: 'serif italic', delay: 0.65 }),
  live('z-hashtag', Z.hashtag, { size: 3.8, cls: 'serif bold soft', delay: 0.8, wrap: false }),
  Z.logo ? h('div', { class: 's reveal z-logo', style: { ...box('z-logo'), zIndex: 3, '--d': '0.95s' } }, h('img', { src: Z.logo, alt: `${C.couple.bride} & ${C.couple.groom} monogram`, decoding: 'async', draggable: 'false' })) : sprAt('z-heart', 'p8-heart', { delay: 0.95 }),
  h('a', { class: 'created', href: 'https://invitivals.com/', target: '_blank', rel: 'noopener' }, 'Created by ', h('b', {}, 'INVITIVALS')),
], { id: 'page-closing', crop: { top: 0.26 } });

const invitation = h('main', { class: 'invitation column', id: 'invitation' }, page1, page2, page3, pageCountdown, pageSave, page6, pageStars, pageClosing);
app.append(invitation);

OpeningScreen(C.opening, {
  audio,
  onStart() { invitation.classList.add('shown'); },
  onOpened() {
    sparkle.show();
    observePages(invitation);
    window.scrollTo(0, 0);
  },
});
