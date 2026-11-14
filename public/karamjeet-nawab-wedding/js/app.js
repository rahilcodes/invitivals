/* Karamjeet Kaur & Nawab Singh Sekhon: the invitation assembled from the design's components.
   Scroll order: 1 the invitation (with the couple), the two families, the date, the programme (two days),
   the countdown, Save the Date, the closing. The two days open as detail views from the programme.
   There is no gallery, and no butterfly cut-outs: the butterflies are part of the painted plates. */
import { config as C } from '../config.js';
import './layout.js';
import { h, observePages } from './util.js';
import { spr, control, box } from './page.js';
import { live, sprAt, Page } from './parts.js';
import { OpeningScreen } from './opening.js';
import { AudioControl } from './audio.js';
import { SparkleOverlay } from './sparkle.js';
import { DateReveal } from './date-reveal.js';
import { openDetail, saveTheDate, openMaps } from './event-detail.js';
import { CalendarSheet } from './calendar.js';

const app = document.getElementById('app');
const audio = AudioControl(C.opening);
const sparkle = SparkleOverlay();
const sheet = CalendarSheet(C);
const H = C.hero, B = C.couple;

/* a picture of this invitation's own in a measured box */
const image = (id, src, alt, { delay = 0, z = 3, cls = '', slow = false } = {}) =>
  h('div', { class: `s reveal ${slow ? 'slow' : ''} ${cls}`, style: { ...box(id), zIndex: z, '--d': `${delay}s` } }, h('img', { src, alt, decoding: 'async', draggable: 'false' }));

/* a butterfly that flaps where it sits: the design's own painted butterfly, cut out by the build tool, over a
   wall made whole beneath it. The picture is pressed towards its body line and let out again (the wings
   closing and opening), and the whole of it rises and settles a hair, so it looks alive without leaving its place.
   angle = the direction across the body, ox/oy = the body's place in the picture (%). */
const flap = (id, { angle, ox, oy, t, del, z = 2 }) => h('div', { class: 's bf', style: { ...box(id), zIndex: z, '--bt': `${(t * 1.9).toFixed(2)}s`, '--bd': `${del}s` }, 'aria-hidden': 'true' },
  h('img', { src: `assets/${id}.webp`, alt: '', decoding: 'async', draggable: 'false', style: { transformOrigin: `${ox}% ${oy}%`, '--a': `${angle}deg`, '--t': `${t}s`, '--d': `${del}s` } }));

/* ── the invitation ── */
const page1 = Page(1, [
  spr('p1-flowers-a', { still: true, motion: 'sway soft', origin: '0% 45%', z: 1 }),
  spr('p1-flowers-b', { still: true, motion: 'sway soft alt', origin: '0% 50%', z: 1 }),
  flap('bf-hero', { angle: -16, ox: 41, oy: 52, t: 2.9, del: -0.4, z: 2 }),
  H.ikOnkar ? image('h-ik', H.ikOnkar, 'Ik Onkar', { delay: 0.1 }) : null,
  live('h-blessings', H.blessings, { size: 2.6, cls: 'serif italic', delay: 0.25 }),
  sprAt('h-rule1', 'p1-rule1', { delay: 0.35 }),
  live('h-parents', H.parents, { size: 3.2, cls: 'serif bold deep', delay: 0.45 }),
  live('h-request', H.request, { size: 2.5, cls: 'serif italic', delay: 0.6 }),
  live('h-bride', B.bride, { size: 5.7, cls: 'name burgundy', delay: 0.6, slow: true, wrap: false }),
  live('h-with', H.weds, { size: 2.4, cls: 'serif caps soft', delay: 0.9, wrap: false }),
  live('h-groom', B.groom, { size: 5.7, cls: 'name burgundy', delay: 0.9, slow: true, wrap: false }),
  sprAt('h-rule2', 'p1-rule1', { delay: 1.1 }),
  live('h-date', H.date, { size: 2.4, cls: 'serif caps deep', delay: 1.2, wrap: false }),
  live('h-venue', H.venue, { size: 2.7, cls: 'serif italic', delay: 1.3, wrap: false }),
  image('h-couple', H.coupleImage, H.coupleAlt, { delay: 0.5, z: 2, cls: 'couple', slow: true }),
  h('div', { class: 'hint', 'aria-hidden': 'true' }, h('span', {}, 'Scroll'), h('i')),
], { id: 'page-1' });

/* ── the two families, in the frame of plate 7 ── */
const F = C.families;
const family = (k, name, f, d) => [
  live(`m-${k}-label`, f.label, { size: 2.2, cls: 'serif caps soft', delay: d, wrap: false }),
  live(`m-${k}-name`, name, { size: 5, cls: 'name burgundy', delay: d + 0.1, slow: true, wrap: false }),
  live(`m-${k}-rel`, f.relation, { size: 2.6, cls: 'serif italic', delay: d + 0.25, wrap: false }),
  live(`m-${k}-parents`, f.parents, { size: 2.95, cls: 'serif bold deep', delay: d + 0.35 }),
  live(`m-${k}-village`, f.village, { size: 2.15, cls: 'serif caps tight soft', delay: d + 0.45, wrap: false }),
];
const pageFamilies = Page(7, [
  ...family('b', B.bride, F.bride, 0.15),
  sprAt('m-rule', 'p7-rule2', { delay: 0.6 }),
  ...family('g', B.groom, F.groom, 0.7),
], { id: 'page-families' });

/* ── reveal our date ── */
const page2 = Page(2, [
  spr('p2-flowers-a', { still: true, motion: 'sway soft', origin: '0% 45%', z: 1 }),
  spr('p2-flowers-b', { still: true, motion: 'sway soft alt', origin: '100% 20%', z: 1 }),
  spr('p2-flowers-c', { still: true, motion: 'sway soft alt', origin: '0% 60%', z: 1 }),
  spr('p2-flowers-d', { still: true, motion: 'sway soft', origin: '100% 60%', z: 1 }),
  flap('bf-a', { angle: -49, ox: 43, oy: 72, t: 2.6, del: -1.1, z: 2 }),
  flap('bf-b', { angle: 52, ox: 48, oy: 75, t: 3.1, del: -0.2, z: 2 }),
  spr('p2-title', { delay: 0.2, alt: 'Reveal Our Date' }),
  spr('p2-rule', { delay: 0.45 }),
  spr('p2-click', { delay: 0.6, alt: 'Click the button' }),
  ...DateReveal(C.date),
], { id: 'page-2' });

/* ── buttons of the page's own: one shape everywhere (never a picture of a button) ── */
const glyph = (d) => { const i = h('i', { class: 'ico', 'aria-hidden': 'true' }); i.innerHTML = `<svg viewBox="0 0 24 24"><path d="${d}" fill="currentColor"/></svg>`; return i; };
const CAL = 'M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm-1 8v10h12V10H6zm2 2h3v3H8v-3z';
const PIN = 'M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.500a2.5 2.5 0 0 1 0 5z';
const SD = C.saveTheDate;
const saveBtn = (day, label) => { const b = saveTheDate(day, [glyph(CAL), h('span', {}, label)], sheet); b.className = 'sd-btn'; return b; };
const mapsBtn = (day, label) => { const a = openMaps(day, [glyph(PIN), h('span', {}, label)]); a.className = 'sd-btn'; return a; };

/* ── the days: detail views on plate 4 (title over the arch, the date in its gold frame, the programme in one
      solid card below, then the day's buttons: equal, centred, a single one when the day has no map) ── */
const schedule = (day) => h('ol', { class: 'timeline' }, ...day.schedule.map(([t, what, note]) => h('li', { class: t ? '' : 'no-time' },
  t ? h('time', {}, t) : null, h('span', {}, what, note ? h('em', {}, note) : null))));
const venue = (day) => h('div', { class: 'venue' }, h('p', { class: 'venue-name' }, day.venue), h('p', { class: 'venue-addr' }, ...day.address.flatMap((l, i) => (i ? [h('br'), l] : [l]))));
const actions = (day) => h('div', { class: `actions ${day.mapsUrl ? '' : 'one'}` }, saveBtn(day, SD.button), day.mapsUrl ? mapsBtn(day, SD.maps) : null);

const dayPage = (day) => () => Page(4, [
  live('d4-title', day.titleLines || day.title, { size: 4.1, cls: 'serif caps burgundy', delay: 0.15 }),
  sprAt('d4-rule', 'p4-rule', { delay: 0.3 }),
  live('d4-date', day.date, { size: 2.4, cls: 'serif caps deep', delay: 0.45, wrap: false }),
  live('d4-weekday', day.weekday, { size: 2.2, cls: 'serif caps soft', delay: 0.5, wrap: false }),
], { id: `detail-${day.key}`, tall: true, flow: h('div', { class: 'flow reveal', style: { '--d': '0.6s', '--top': '91.8cqw' } },
  h('div', { class: 'panel' }, schedule(day), venue(day)), actions(day)) });

/* ── the programme: two cards, each a button that opens its day ── */
const [day1, day2] = C.days;
const monthShort = (date) => date.split(' ')[1].slice(0, 3);
const card = (id, day, n, delay) => control(id,
  h('button', { class: 'fn', type: 'button', 'aria-label': `${day.title}, ${day.weekday} ${day.date}: view the programme`, onclick: () => openDetail(day.title, 4, dayPage(day)) },
    h('span', { class: 'fn-day', 'aria-hidden': 'true' }, h('b', {}, day.date.split(' ')[0]), h('small', {}, monthShort(day.date))),
    h('span', { class: 'fn-body' },
      h('small', { class: 'fn-when' }, `${day.weekday} · ${day.date.replace(' 2026', '')}`),
      h('b', { class: 'fn-title' }, day.title),
      h('span', { class: 'fn-meta' }, day.card),
      h('span', { class: 'fn-tap' }, 'Tap to view', h('i', { 'aria-hidden': 'true' }))),
    h('span', { class: 'fn-n', 'aria-hidden': 'true' }, n)),
  { delay, cls: 'fn-wrap', z: 5 });

const page3 = Page(3, [
  spr('p3-flowers-a', { motion: 'sway', origin: '0% 30%', delay: 0.1, z: 2 }),
  spr('p3-flowers-b', { motion: 'sway alt', origin: '0% 50%', delay: 0.2, z: 2 }),
  spr('p3-flowers-c', { motion: 'sway', origin: '0% 50%', delay: 0.3, z: 2 }),
  spr('p3-flowers-d', { motion: 'sway alt', origin: '100% 50%', delay: 0.2, z: 2 }),
  spr('p3-flowers-e', { motion: 'sway', origin: '100% 50%', delay: 0.3, z: 2 }),
  card('f-card-a', day1, 'I', 0.4),
  card('f-card-b', day2, 'II', 0.6),
], { id: 'page-3' });

/* ── the countdown: the plain upper half of plate 8, four light tiles ── */
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

/* ── Save the Date (plate 5): the title in the arch, the names and the venue; then one block — the card with
      the day and the hour, and under it the two buttons, all with the same outer edges ── */
const sdCard = h('div', { class: 's sd-card reveal', style: { ...box('sd-card'), zIndex: 5, '--d': '0.6s' } },
  h('div', {}, h('small', {}, SD.labels[0]), h('b', {}, `${W.weekday}, ${W.dateLine}`)),
  h('i', { class: 'sd-rule', 'aria-hidden': 'true' }),
  h('div', {}, h('small', {}, SD.labels[1]), h('b', {}, SD.time)));
const pageSave = Page(5, [
  spr('p5-lantern-a', { still: true, motion: 'sway hang', origin: '50% 0%', z: 2 }),
  spr('p5-lantern-b', { still: true, motion: 'sway hang alt', origin: '50% 0%', z: 2 }),
  spr('p5-lantern-c', { still: true, motion: 'sway hang', origin: '50% 0%', z: 2 }),
  live('sd-title', SD.title, { size: 8.6, cls: 'script burgundy', delay: 0.15, wrap: false }),
  sprAt('sd-rule', 'p4-rule', { delay: 0.3 }),
  live('sd-names', [`${B.bride} &`, B.groom], { size: 2.8, cls: 'serif caps tight deep', delay: 0.4 }),
  live('sd-venue', day2.venue, { size: 2.9, cls: 'serif bold', delay: 0.5, wrap: false }),
  live('sd-addr', day2.address[0].replace(/\.$/, ''), { size: 2.5, cls: 'serif soft', delay: 0.55, wrap: false }),
  sdCard,
  control('sd-save', saveBtn(day2, SD.button), { delay: 0.85, z: 6 }),
  control('sd-maps', mapsBtn(day2, SD.maps), { delay: 0.95, z: 6 }),
], { id: 'page-save' });

/* ── the closing (the plate's empty top is cut) ── */
const Z = C.closing;
const special = h('div', { class: 's reveal special', style: { ...box('z-special'), zIndex: 3, '--d': '0.65s' } },
  h('small', {}, Z.specialLabel), h('b', {}, Z.specialName), h('em', {}, Z.specialRelation));
const pageClosing = Page(8, [
  live('z-love', Z.love, { size: 6.2, cls: 'script burgundy', delay: 0.2, wrap: false }),
  live('z-family', Z.family, { size: 3.9, cls: 'serif caps burgundy', delay: 0.35, wrap: false }),
  sprAt('z-rule', 'p4-rule', { delay: 0.5 }),
  special,
  live('z-lines', Z.lines, { size: 3.1, cls: 'serif italic', delay: 0.8 }),
  sprAt('z-heart', 'p8-heart', { delay: 0.95 }),
  h('a', { class: 'created', href: 'https://invitivals.com/', target: '_blank', rel: 'noopener' }, 'Created by ', h('b', {}, 'INVITIVALS')),
], { id: 'page-closing', crop: { top: 0.26 } });

const invitation = h('main', { class: 'invitation column', id: 'invitation' }, page1, pageFamilies, page2, page3, pageCountdown, pageSave, pageClosing);
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
