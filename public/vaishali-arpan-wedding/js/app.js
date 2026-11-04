/* Vaishali & Arpan: the invitation assembled from the demo's components.
   Scroll order: 1 the invitation, 2 the date, 3 the three days, the countdown, Save the Date,
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

/* ── 1 · the invitation, bride first ── */
const page1 = Page(1, [
  spr('p1-flowers-a', { still: true, motion: 'sway soft', origin: '0% 45%', z: 1 }),
  spr('p1-flowers-b', { still: true, motion: 'sway soft alt', origin: '0% 50%', z: 1 }),
  butterfly('p1-butterfly', { z: 2 }),
  live('h-invocation', H.invocation, { size: 2.45, cls: 'serif caps tight soft', delay: 0.1, wrap: false }),
  live('h-hindi', H.hindi, { size: 2.8, cls: 'deva burgundy', delay: 0.25, lang: 'hi' }),
  sprAt('h-rule1', 'p1-rule1', { delay: 0.4 }),
  live('h-blessings', H.blessings, { size: 2.6, cls: 'serif caps soft', delay: 0.5, wrap: false }),
  live('h-parents', H.parents, { size: 3.3, cls: 'serif bold deep', delay: 0.6 }),
  live('h-request', H.request, { size: 2.7, cls: 'serif italic', delay: 0.7 }),
  live('h-bride', C.couple.bride, { size: 11.5, cls: 'script burgundy', delay: 0.6, slow: true, wrap: false }),
  live('h-bride-of', H.brideOf, { size: 2.6, cls: 'serif semibold', delay: 0.9 }),
  live('h-with', H.with, { size: 2.7, cls: 'serif caps soft', delay: 1, wrap: false }),
  live('h-groom', C.couple.groom, { size: 11.5, cls: 'script burgundy', delay: 0.9, slow: true, wrap: false }),
  live('h-groom-of', H.groomOf, { size: 2.6, cls: 'serif semibold', delay: 1.2 }),
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
      programme in one solid card below, the demo's two buttons under it) ── */
const schedule = (day) => h('ol', { class: 'timeline' }, ...day.schedule.map(([t, what, note]) => h('li', { class: t ? '' : 'no-time' },
  t ? h('time', {}, t) : null, h('span', {}, what, note ? h('em', {}, note) : null))));
const venue = (day) => h('div', { class: 'venue' }, h('p', { class: 'venue-name' }, day.venue), h('p', { class: 'venue-addr' }, ...day.address.flatMap((l, i) => (i ? [h('br'), l] : [l]))));
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
  day.dressCode ? dressCode(day) : null, h('div', { class: 'panel' }, schedule(day), venue(day)), actions(day)) });

/* ── 3 · our functions: a plaque per day, its pin on the plaque ── */
const plaque = (id, day, delay) => control(id,
  h('button', { class: 'plaque', type: 'button', 'aria-label': `${day.title}, ${day.weekday} ${day.date}: view details`, onclick: () => openDetail(day.title, 4, dayPage(day)) },
    pic('p3-plaque', ''), h('span', { class: 'plaque-label' }, h('small', {}, `${day.weekday} · ${day.date.replace(' 2026', '')}`), h('b', {}, day.title))), { delay, cls: 'plaque-wrap' });

const [day1, day2, day3] = C.days;
const page3 = Page(3, [
  spr('p3-flowers-a', { motion: 'sway', origin: '0% 30%', delay: 0.1, z: 2 }),
  spr('p3-flowers-b', { motion: 'sway alt', origin: '0% 50%', delay: 0.2, z: 2 }),
  spr('p3-flowers-c', { motion: 'sway', origin: '0% 50%', delay: 0.3, z: 2 }),
  spr('p3-flowers-d', { motion: 'sway alt', origin: '100% 50%', delay: 0.2, z: 2 }),
  spr('p3-flowers-e', { motion: 'sway', origin: '100% 50%', delay: 0.3, z: 2 }),
  plaque('p3-plaque-a', day1, 0.45),
  sprAt('p3-pin-a', 'p3-pin1', { delay: 0.55, z: 4, cls: 'bob' }),
  plaque('p3-plaque-b', day2, 0.7),
  sprAt('p3-pin-b', 'p3-pin1', { delay: 0.8, z: 4, cls: 'bob' }),
  plaque('p3-plaque-c', day3, 0.9),
  sprAt('p3-pin-c', 'p3-pin1', { delay: 1, z: 4, cls: 'bob' }),
  h('div', { class: 'tap-hint page-3-hint', 'aria-hidden': 'true' }, 'Tap to view'),
], { id: 'page-3' });
page3.querySelectorAll('.plaque-wrap .plaque img').forEach((i) => i.classList.add('plaque-art'));

/* ── the countdown (plate 5: the plate's card carries the date and time, the tiles sit in a tray below) ── */
const CD = C.countdown, W = C.wedding;
const tiles = h('div', { class: 'cd', id: 'countdown', role: 'timer', 'aria-live': 'off' },
  ...CD.units.map((u) => h('div', {}, h('b', { 'data-u': u[0].toLowerCase() }, '--'), h('span', {}, u))));
const done = h('p', { class: 'cd-done script', hidden: true }, CD.done);
const tray = h('div', { class: 's cd-tray reveal', style: { ...box('c-tray'), zIndex: 5, '--d': '0.8s' } }, tiles, done);
const pageCountdown = Page(5, [
  spr('p5-lantern-a', { still: true, motion: 'sway hang', origin: '50% 0%', z: 2 }),
  spr('p5-lantern-b', { still: true, motion: 'sway hang alt', origin: '50% 0%', z: 2 }),
  spr('p5-lantern-c', { still: true, motion: 'sway hang', origin: '50% 0%', z: 2 }),
  butterfly('p5-butterfly-a', { z: 3 }),
  butterfly('p5-butterfly-b', { z: 3 }),
  butterfly('p5-butterfly-c', { z: 3 }),
  live('c-title', CD.title, { size: 7.6, cls: 'script burgundy', delay: 0.15 }),
  spr('p5-heart', { delay: 0.35 }),
  live('c-lines', CD.lines, { size: 3.2, cls: 'serif italic', delay: 0.45 }),
  live('c-date', W.dateLine, { size: 2.35, cls: 'serif caps deep', delay: 0.65, wrap: false }),
  live('c-weekday', W.weekday, { size: 2.2, cls: 'serif caps soft', delay: 0.7, wrap: false }),
  live('c-time', W.time, { size: 3, cls: 'serif bold deep', delay: 0.75, wrap: false }),
  tray,
], { id: 'page-countdown' });

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

/* ── Save the Date (plate 4, the demo's own events composition: the day in the gold frame, the time, the
      venue, and its two buttons: Add to Calendar and the wedding venue on Google Maps) ── */
const SD = C.saveTheDate;
const pageSave = Page(4, [
  live('sd-title', SD.title, { size: 8.6, cls: 'script burgundy', delay: 0.15, wrap: false }),
  sprAt('sd-rule', 'p4-rule', { delay: 0.3 }),
  live('sd-names', `${C.couple.bride} & ${C.couple.groom}`, { size: 3, cls: 'serif caps soft', delay: 0.4, wrap: false }),
  live('sd-date', W.dateLine, { size: 2.4, cls: 'serif caps deep', delay: 0.5, wrap: false }),
  live('sd-weekday', W.weekday, { size: 2.2, cls: 'serif caps soft', delay: 0.55, wrap: false }),
  live('sd-time', W.time, { size: 3, cls: 'serif bold deep', delay: 0.6, wrap: false }),
  live('sd-venue', day3.venueLines || day3.venue, { size: 2.2, cls: 'serif caps tight deep', delay: 0.65 }),
  control('p4-save', saveTheDate(day3, pic('p4-save', SD.button), sheet), { delay: 0.85 }),
  control('p4-maps', openMaps(day3, pic('p4-maps', 'Open in Google Maps')), { delay: 0.95 }),
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
  live('s-names', S.names, { size: 3.4, cls: 'serif bold deep', delay: 0.95, wrap: false }),
], { id: 'page-stars' });

/* ── the closing (the plate's empty top is cut: the words follow the stars' page) ── */
const Z = C.closing;
const pageClosing = Page(8, [
  live('z-title', Z.title, { size: 4.4, cls: 'serif caps burgundy', delay: 0.2 }),
  sprAt('z-rule', 'p8-rule', { delay: 0.5 }),
  live('z-lines', Z.lines, { size: 3.2, cls: 'serif italic', delay: 0.65 }),
  live('z-hashtag', Z.hashtag, { size: 3.8, cls: 'serif bold soft', delay: 0.8, wrap: false }),
  sprAt('z-heart', 'p8-heart', { delay: 0.95 }),
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
