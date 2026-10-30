/* Brown Theme Wedding — the invitation assembled from its components.
   Scroll order: 1 hero → 2 date → 3 functions → 6 memories → 7 RSVP → 8 thank you.
   Pages 4 and 5 are detail views opened from page 3.
   Positions below are centre x / y and width in percent of each page canvas,
   read off the designer's with-text references. */
import { config as C } from '../config.js';
import { h, observePages, icons } from './util.js';
import { InvitationPage, art, txt, divider, at } from './page.js';
import { OpeningScreen } from './opening.js';
import { AudioControl } from './audio.js';
import { SparkleOverlay } from './sparkle.js';
import { DateReveal } from './date-reveal.js';
import { plaque, pin } from './event-selection.js';
import { openDetail, saveTheDate, openMaps } from './event-detail.js';
import { MemoriesCarousel } from './memories.js';
import { RSVPModal } from './rsvp.js';

const app = document.getElementById('app');
const audio = AudioControl(C.opening);
const sparkle = SparkleOverlay();
const rsvp = RSVPModal(C.rsvp);

/* ── 1 · hero ── */
function nameArt(name, id, opts) {
  const known = { Arjun: 'p1-arjun', Aadhya: 'p1-aadhya' };
  if (known[name] === id) return art(id, { ...opts, alt: name });
  return txt(name, { ...opts, w: 80, size: 15, cls: 'script burgundy', lh: 1 });
}
const page1 = InvitationPage(1, [
  art('p1-corner', { x: 17, y: 63, w: 36, motion: 'sway', delay: 0.2, z: 2 }),
  art('p1-butterfly', { x: 9, y: 31, w: 13, motion: 'flutter', delay: 0.9, z: 3 }),
  art('p1-ganesha', { x: 50, y: 20.3, w: 15, delay: 0.1 }),
  txt(C.hero.blessing[0], { y: 27.4, size: 3.5, delay: 0.3 }),
  txt(C.hero.blessing[1], { y: 30.3, size: 3.8, cls: 'serif italic', delay: 0.4 }),
  divider({ y: 32.7, w: 14, delay: 0.5, glyph: '✦' }),
  txt(C.hero.request, { y: 37.5, size: 3.45, lh: 1.32, delay: 0.6 }),
  nameArt(C.couple.groom, 'p1-arjun', { x: 50, y: 45.2, w: 32, delay: 0.8 }),
  at(h('div', { class: 'divider plain', style: { gap: '2.5cqw' } }, h('span', { class: 'txt script', style: { fontSize: '7cqw', lineHeight: 1 } }, 'and')), { y: 51.6, w: 34, delay: 1 }),
  nameArt(C.couple.bride, 'p1-aadhya', { x: 50, y: 56.8, w: 37, delay: 1.1 }),
  divider({ y: 61.8, w: 14, delay: 1.3, glyph: '✦' }),
  h('div', { class: 'hint' }, h('span', {}, 'Scroll'), h('i')),
], { lazy: false });

/* ── 2 · date reveal (the slot is part of the background: knob at 50 / 38) ── */
const page2 = InvitationPage(2, [
  art('p2-cornergarland', { x: 15, y: 24, w: 42, motion: 'sway', delay: 0.2 }),
  art('p2-vine', { x: 86, y: 22, w: 36, motion: 'sway', delay: 0.3 }),
  art('p2-corner', { x: 13, y: 80, w: 36, motion: 'sway', delay: 0.4 }),
  art('p2-flower', { x: 87, y: 77, w: 38, motion: 'sway', delay: 0.5 }),
  art('p2-monarch', { x: 76, y: 29, w: 13, motion: 'flutter', delay: 0.9, z: 4 }),
  art('p2-butterfly', { x: 22, y: 56, w: 13, motion: 'flutter', delay: 1.1, z: 4 }),
  txt(['Reveal', 'Our Date'], { y: 23.5, size: 7.2, lh: 1.02, delay: 0.3 }),
  divider({ y: 28.8, w: 12, glyph: '✦', delay: 0.5 }),
  ...DateReveal(C.date, { slot: { x: 50, y: 40.2, w: 56, h: 14 }, paper: { x: 50.4, top: 43.2, w: 42 } }),
]);

/* ── 4 · Shaadi detail ── */
const S = C.events.shaadi;
const shaadiPage = () => InvitationPage(4, [
  art('p4-lantern', { x: 50, y: 21.5, w: 9, motion: 'sway hang', delay: 0.2, z: 3 }),
  art('p4-lantern', { x: 8, y: 35.5, w: 6.2, motion: 'sway hang', delay: 0.4, z: 3 }),
  art('p4-lantern', { x: 91.5, y: 36.5, w: 6.2, motion: 'sway hang', delay: 0.6, z: 3 }),
  txt(S.title, { y: 34, size: 10, cls: 'script burgundy', delay: 0.2 }),
  divider({ y: 37.6, w: 12, glyph: '✦', delay: 0.3 }),
  txt(S.tagline, { y: 40.3, size: 3.2, cls: 'serif burgundy', lh: 1.3, delay: 0.4 }),
  at(h('div', { class: 'date-plaque' }, art('p4-date', { x: 50, y: 50, w: 100, reveal: false }).firstChild), { y: 46.2, w: 38, delay: 0.5 }),
  at(h('div', { class: 'time-row', html: `${icons.clock}<span>${S.time}</span>` }), { y: 50.3, w: 40, delay: 0.6 }),
  at(h('div', { class: 'venue-row', html: `${icons.pin}<span>${S.venue}</span>` }), { y: 53.6, w: 70, delay: 0.7 }),
  txt(S.address, { y: 56.7, size: 2.7, lh: 1.4, delay: 0.8 }),
  divider({ y: 77.2, w: 18, glyph: '✦', delay: 0.9 }),
  at(saveTheDate(S, art('p4-save', { x: 50, y: 50, w: 100, reveal: false }).firstChild), { x: 34, y: 81.6, w: 30, hit: true, delay: 1 }),
  at(openMaps(S, art('p4-maps', { x: 50, y: 50, w: 100, reveal: false }).firstChild), { x: 66, y: 81.6, w: 30, hit: true, delay: 1.1 }),
], { lazy: false });

/* ── 5 · Reception detail ── */
const R = C.events.reception;
const receptionPage = () => InvitationPage(5, [
  art('p5-lanternL', { x: 8, y: 13, w: 7, motion: 'sway hang', delay: 0.2, z: 3 }),
  art('p5-lanternM', { x: 91, y: 14, w: 6, motion: 'sway hang', delay: 0.4, z: 3 }),
  art('p5-lantern3', { x: 89.5, y: 27, w: 4.6, motion: 'sway hang', delay: 0.6, z: 3 }),
  art('p5-butterfly', { x: 16, y: 7.5, w: 9, motion: 'flutter', delay: 0.9, z: 4 }),
  art('p5-butterfly', { x: 83, y: 29, w: 8, motion: 'flutter', delay: 1.1, z: 4 }),
  art('p5-butterfly', { x: 79, y: 44, w: 6.5, motion: 'flutter', delay: 1.3, z: 4 }),
  txt(R.title, { y: 23, size: 11, cls: 'script', delay: 0.2 }),
  at(h('div', { class: 'divider', style: { color: '#6b1a24' } }, h('i', { html: icons.heart, style: { width: '3cqw', height: '3cqw', display: 'block' } })), { y: 30.2, w: 22, delay: 0.3 }),
  txt(R.tagline, { y: 34.4, size: 2.55, cls: 'serif caps', lh: 1.45, delay: 0.4 }),
  divider({ y: 38, w: 16, glyph: '❧', delay: 0.5 }),
  at(h('div', { class: 'date-box' },
    h('div', { class: 'row big', html: `${icons.calendar}<span>${R.day}<sup>${R.suffix}</sup> ${R.month}</span>` }),
    h('div', { class: 'row year' }, R.year),
    h('div', { class: 'row time', html: `${icons.clock}<span>${R.time}</span>` })), { x: 51.5, y: 46.3, w: 40, delay: 0.6 }),
  R.venue
    ? at(h('div', { class: 'venue-row', html: `${icons.pin}<span>${R.venue}</span>` }), { y: 53.4, w: 70, delay: 0.7 })
    : at(h('div', { class: 'demo-note txt' }, 'Demo: reception venue to be confirmed'), { y: 53.4, w: 60, delay: 0.7 }),
  at(saveTheDate(R, art('p5-save', { x: 50, y: 50, w: 100, reveal: false }).firstChild), { x: 32.5, y: 57.4, w: 34, hit: true, delay: 0.9 }),
  at(openMaps(R, art('p5-maps', { x: 50, y: 50, w: 100, reveal: false }).firstChild), { x: 69, y: 57.4, w: 34, hit: true, delay: 1 }),
], { lazy: false });

/* ── 3 · functions ── */
const page3 = InvitationPage(3, [
  art('p3-flourish', { x: 11, y: 18, w: 28, motion: 'sway', delay: 0.2 }),
  art('p3-corner2', { x: 11, y: 52, w: 28, motion: 'sway', delay: 0.3 }),
  art('p3-border', { x: 91, y: 37, w: 21, motion: 'sway', delay: 0.4 }),
  art('p3-corner', { x: 10, y: 84, w: 26, motion: 'sway', delay: 0.5 }),
  art('p3-border1', { x: 92, y: 77, w: 18, motion: 'sway', delay: 0.6 }),
  pin({ x: 72, y: 44, w: 7.5, delay: 0.6 }),
  plaque('Shaadi', { x: 50, y: 50.3, w: 38, delay: 0.5, onOpen: () => openDetail('Shaadi', shaadiPage) }),
  pin({ x: 46.5, y: 74.5, w: 7.5, delay: 0.8 }),
  plaque('Reception', { x: 50, y: 80.5, w: 38, delay: 0.7, onOpen: () => openDetail('Reception', receptionPage) }),
  h('div', { class: 'tap-hint', style: { top: '87.5%' } }, 'Tap a plaque to view details'),
]);

/* ── 6 · memories ── */
const FR = { x: 48.85, y: 43.2, w: 74 }; // frame centre and width; its window then covers the picture panel
const page6 = InvitationPage(6, [
  txt('Our', { y: 7.8, size: 5.6, delay: 0.2 }),
  txt('Memories', { y: 12.8, size: 10.5, cls: 'script', delay: 0.3 }),
  divider({ y: 18.2, w: 24, glyph: '✦', delay: 0.4 }),
  ...MemoriesCarousel(C.memories.photos, { x: 25.6, y: 26.1, w: 50.2, h: 38.7 }),
  art('p6-frame', { x: FR.x, y: FR.y, w: FR.w, z: 5, delay: 0.3 }),
]);

/* ── 7 · RSVP ── */
const page7 = InvitationPage(7, [
  divider({ y: 30.6, w: 40, glyph: '❖', delay: 0.2 }),
  txt(C.rsvp.title[0], { y: 36, size: 6, delay: 0.3 }),
  art('p7-rsvp', { x: 50, y: 41.7, w: 30, delay: 0.4, alt: C.rsvp.title[1] }),
  divider({ y: 46.8, w: 40, glyph: '❖', delay: 0.5 }),
  txt(C.rsvp.lines, { y: 52, size: 3.5, lh: 1.32, delay: 0.6 }),
  at(h('button', { class: 'img-btn', type: 'button', 'aria-haspopup': 'dialog', onclick: (e) => rsvp.open(e.currentTarget) },
    art('p7-button', { x: 50, y: 50, w: 100, reveal: false, alt: 'Confirm Your Presence' }).firstChild), { y: 62, w: 54, hit: true, delay: 0.8 }),
]);

/* ── 8 · thank you ── */
const page8 = InvitationPage(8, [
  txt(C.thankYou.title[0], { y: 41.5, size: 7, delay: 0.2 }),
  txt(C.thankYou.title[1], { y: 47.6, size: 11, cls: 'script', delay: 0.3 }),
  divider({ y: 55, w: 36, glyph: '❖', delay: 0.4 }),
  txt(C.thankYou.lines, { y: 59.7, size: 2.95, lh: 1.42, delay: 0.5 }),
  at(h('div', { class: 'divider', style: { color: '#6b1a24' } }, h('i', { html: icons.heart, style: { width: '3.4cqw', height: '3.4cqw', display: 'block', opacity: .8 } })), { y: 65.6, w: 26, delay: 0.6 }),
]);

const invitation = h('main', { class: 'invitation column', id: 'invitation' }, page1, page2, page3, page6, page7, page8);
app.append(invitation);

OpeningScreen(C.opening, {
  audio,
  onOpened() {
    invitation.classList.add('shown');
    sparkle.show();
    page1.classList.add('on');
    observePages(invitation);
    window.scrollTo(0, 0);
  },
});
