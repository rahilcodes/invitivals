/* Marathi wedding design, English edition — the invitation assembled from its components.
   Scroll order, the pack's numbering: 1 hero → 2 memories → 3 date → 4 functions
   → 5 venue → 6 RSVP and wishes → 7 blessings → 8 thank you.
   Positions are centre x / y and width in percent of each page canvas, read off
   the designer's "with text" references (941 × 1671): every English line sits in
   the region its Marathi line occupies there. */
import { config as C } from '../config.js?v=2';
import { h, observePages, reducedMotion, marathiDate as dateOf, mapsHref } from './util.js?v=2';
import { InvitationPage, art, txt, at } from './page.js?v=2';
import { ornament, rule, icon } from './ornaments.js?v=2';
import { OpeningScreen } from './opening.js?v=2';
import { AudioControl } from './audio.js?v=2';
import { PetalOverlay } from './petals.js?v=2';
import { DateReveal } from './calendar.js?v=2';
import { RSVP } from './rsvp.js?v=2';
import { GiftButton } from './gift.js?v=2';
import { artSizes } from './art-sizes.js?v=2';

const app = document.getElementById('app');
const audio = AudioControl({ ...C.opening, mute: C.ui.mute, unmute: C.ui.unmute });
window.invitation = { music: audio.element }; // for checks in the console

/* the pack's map button (its printed label painted out) as a link to the venue, with the label written on it */
function mapButton(target, { label, size = 3.3 }) {
  const [bw, bh] = artSizes['btn-map'];
  const venue = target.venue || target.name;
  const href = mapsHref({ mapsUrl: target.mapsUrl, venue, address: target.address });
  return h('a', { class: 'img-btn has-pin', href, target: '_blank', rel: 'noopener', 'aria-label': `${label} — ${venue}` },
    h('img', { src: 'assets/btn-map.webp', alt: '', width: bw, height: bh, loading: 'lazy', decoding: 'async' }),
    h('span', { class: 'lbl', style: { fontSize: `${size}cqw` }, 'aria-hidden': 'true' }, label));
}

/* ── 1 · hero: the pack's tassels and bell hang from the pearl strings painted on the left,
      the designer's flower sprigs sit around the names, the couple sit at the foot ── */
const sprig = (id, delay) => { const [w, hgt, px, py] = artSizes[id]; return art(id, { x: (px + w / 2) / 9.41, y: (py + hgt / 2) / 16.71, w: w / 9.41, delay, z: 3, lazy: false, cls: 'a-soft' }); };
const page1 = InvitationPage(1, [
  art('tassel-s', { x: 28.7, y: 8.2, w: 6.8, height: 6.1, anchor: 'top', motion: 'sway hang', delay: 0.3, z: 2, lazy: false }),
  art('bell', { x: 35.6, y: 10.6, w: 3.6, anchor: 'top', motion: 'sway hang', delay: 0.5, z: 2, lazy: false }),
  art('tassel-s', { x: 28.7, y: 20.4, w: 6.8, height: 5.6, anchor: 'top', motion: 'sway hang', delay: 0.6, z: 2, lazy: false }),
  art('tassel-s', { x: 23.9, y: 26.6, w: 7.2, height: 5.7, anchor: 'top', motion: 'sway hang', delay: 0.45, z: 2, lazy: false }),
  art('tassel-s', { x: 11.2, y: 33.2, w: 7.4, height: 6.3, anchor: 'top', motion: 'sway hang', delay: 0.8, z: 2, lazy: false }),
  txt(C.hero.intro, { x: 66.3, y: 13.6, w: 44, size: 3.1, cls: 'maroon body italic', lh: 1.35, delay: 0.2 }),
  ornament('spray', { x: 66.3, y: 19.5, w: 12.5, delay: 0.35 }),
  sprig('sprig-a', 0.6), sprig('sprig-b', 0.7), sprig('sprig-c', 0.9), sprig('sprig-d', 1),
  txt(C.couple.bride, { x: 64, y: 27.6, w: 60, size: 13.5, cls: 'maroon names', lh: 1.1, delay: 0.5, anim: 'a-wipe' }),
  txt(C.couple.and, { x: 66.3, y: 34.4, w: 30, size: 3.3, cls: 'maroon body italic', lh: 1.2, delay: 0.7 }),
  txt(C.couple.groom, { x: 67.5, y: 40.4, w: 60, size: 13.5, cls: 'maroon names', lh: 1.1, delay: 0.85, anim: 'a-wipe' }),
  rule({ x: 67, y: 48.8, w: 28, glyph: 'knot', size: 8, delay: 1.05 }),
  txt(C.hero.invite, { x: 67, y: 52.9, w: 50, size: 2.9, cls: 'ink body', lh: 1.38, delay: 1.15, anim: 'a-rise' }),
  art('couple', { x: 49.6, y: 75.7, w: 59, delay: 0.3, z: 3, lazy: false, alt: '', cls: 'a-soft' }),
  h('div', { class: 'hint', 'aria-hidden': 'true' }, h('span', {}, C.ui.scroll), h('i')),
], { lazy: false });

/* ── 2 · memories: the three embroidered frames on the pearl garland; the pack's captions are
      painted out and written here, on each frame's tilted caption strip beside the heart ── */
const FRAMES = { // the picture window and the caption strip inside each frame picture (percent of the picture, tilt)
  'pol-1': { cx: 49.8, cy: 41.2, w: 68.4, h: 57, rot: -6.5, cap: { x: 43, y: 83.5, w: 44, size: 3.2 } },
  'pol-2': { cx: 47.3, cy: 40.8, w: 71, h: 62, rot: -3.9, cap: { x: 41, y: 83.6, w: 44, size: 3.2 } },
  'pol-3': { cx: 50.9, cy: 42.9, w: 70.5, h: 58.6, rot: -5, cap: { x: 42.5, y: 83.2, w: 46, size: 2.75 } },
};
function frame(id, photo, caption, pos) {
  const el = art(id, { ...pos, cls: 'a-soft' });
  const f = FRAMES[id];
  if (photo) el.firstChild.append(h('img', { class: 'photo', src: photo, alt: '', loading: 'lazy', decoding: 'async', style: { left: `${f.cx}%`, top: `${f.cy}%`, width: `${f.w}%`, height: `${f.h}%`, transform: `translate(-50%, -50%) rotate(${f.rot}deg)` } }));
  if (caption) el.firstChild.append(h('span', { class: 'frame-cap', style: { left: `${f.cap.x}%`, top: `${f.cap.y}%`, width: `${f.cap.w}%`, fontSize: `${f.cap.size}cqw`, transform: `translate(-50%, -50%) rotate(${f.rot}deg)` } }, caption));
  return el;
}
const page2 = InvitationPage(2, [
  frame('pol-1', C.memories.photos[0], C.memories.captions[0], { x: 54.7, y: 21.1, w: 40.4, delay: 0.2, z: 3 }),
  frame('pol-2', C.memories.photos[1], C.memories.captions[1], { x: 53.7, y: 49.4, w: 36.5, delay: 0.4, z: 3 }),
  frame('pol-3', C.memories.photos[2], C.memories.captions[2], { x: 56.3, y: 75.1, w: 41, delay: 0.6, z: 3 }),
  ...[[28.2, 18.5, 0.3], [74.4, 46.7, 0.5], [31.3, 56, 0.6], [76.5, 76, 0.8], [32.4, 85.6, 0.7]]
    .map(([x, y, d]) => art('tassel-p', { x, y, w: 13.5, motion: 'sway', delay: d, z: 4 })),
]);

/* ── 3 · the date ── */
const wedding = C.events.find((e) => e.key === C.date.event) || C.events[0];
const page3 = InvitationPage(3, [
  txt(C.date.title, { x: 50.8, y: 12.3, w: 60, size: 4.8, cls: 'maroon display', lh: 1.3, delay: 0.2, anim: 'a-wipe' }),
  rule({ x: 50.2, y: 17.7, w: 31, glyph: 'flower', size: 21, delay: 0.3 }),
  art('calendar', { x: 51, y: 27.2, w: 56.3, height: 58.4, anchor: 'top', delay: 0.4, z: 3, cls: 'a-soft' }),
  ...DateReveal(C.date, wedding, C.couple.short, { calendarDownloaded: C.ui.calendarDownloaded }, {
    month: { x: 51, y: 41.2, size: 4.6 },
    grid: { x: 51, y: 45.4, w: 44, head: 3.3, row: 3.25 },
    button: { x: 48.4, y: 23.8, w: 44.6, label: 3.4 },
    date: { x: 50.2, y: 90, size: 3.4 },
  }),
]);

/* ── 4 · functions: one row per event, the pack's picture on the left ── */
const ART = { haldi: { x: 38, w: 30, dy: 5.3 }, mehndi: { x: 37, w: 32, dy: 4.8 }, mandap: { x: 35.6, w: 35, dy: 4.9 }, throne: { x: 35.3, w: 35.6, dy: 6.3 } };
const ROWS = [14.7, 35.8, 57.1, 77.2];
function eventRow(ev, i, n) {
  const t = n === 4 ? ROWS[i] : 14.7 + i * Math.min(21.1, (77.2 - 14.7) / Math.max(1, n - 1));
  const d = 0.2 + i * 0.12;
  const a = ART[ev.art] || ART.mandap;
  return [
    art(ev.art, { x: a.x, y: t + a.dy, w: a.w, delay: d, z: 2, cls: 'a-soft' }),
    txt(ev.title, { x: 71.2, y: t, w: 44, size: 4.3, cls: 'maroon display', lh: 1.2, delay: d, anim: 'a-wipe' }),
    rule({ x: 71.2, y: t + 3.1, w: 30, glyph: 'knot', size: 7, delay: d + 0.05 }),
    txt(dateOf(ev.start, C.date), { x: 68, y: t + 5.4, w: 36, size: 3, cls: 'ink body', lh: 1.2, delay: d + 0.1, anim: 'a-rise' }),
    txt(ev.time, { x: 68, y: t + 7.4, w: 36, size: 3, cls: 'ink body', lh: 1.2, delay: d + 0.15, anim: 'a-rise' }),
    at(mapButton(ev, { label: C.ui.mapsLabel, size: 2.75 }), { x: 69.6, y: t + 11.4, w: 29.2, hit: true, delay: d + 0.25, cls: 'a-soft' }),
  ];
}
const page4 = InvitationPage(4, C.events.flatMap((ev, i) => eventRow(ev, i, C.events.length)));

/* ── 5 · the venue: the palace and the arch are in the artwork ── */
const page5 = InvitationPage(5, [
  ornament('lotus', { x: 50, y: 23.5, w: 12.3, delay: 0.2 }),
  txt(C.venue.title, { x: 50, y: 29.4, w: 50, size: 5.2, cls: 'maroon display', lh: 1.2, delay: 0.3, anim: 'a-wipe' }),
  rule({ x: 50, y: 33.3, w: 17, glyph: 'knot', size: 14, delay: 0.4 }),
  rule({ x: 50, y: 66.7, w: 17, glyph: 'knot', size: 14, delay: 0.4 }),
  txt(C.venue.name, { x: 50.5, y: 70.3, w: 70, size: 4.6, cls: 'maroon display', lh: 1.2, delay: 0.5, anim: 'a-wipe' }),
  txt(C.venue.address, { x: 50.2, y: 75.9, w: 76, size: 3.2, cls: 'ink body', lh: 1.4, delay: 0.6, anim: 'a-rise' }),
  at(mapButton(C.venue, { label: C.ui.mapsLabel, size: 3.6 }), { x: 51.4, y: 83.2, w: 38.8, hit: true, delay: 0.75, cls: 'a-soft' }),
]);

/* ── 6 · attendance and wishes ── */
const rsvp = RSVP(C.rsvp);
const page6 = InvitationPage(6, [
  ornament('lotus', { x: 50.2, y: 23.6, w: 14.2, delay: 0.2 }),
  txt(C.rsvp.title, { x: 50.5, y: 30.6, w: 70, size: 6.2, cls: 'maroon display', lh: 1.2, delay: 0.3, anim: 'a-wipe' }),
  txt(C.rsvp.sub, { x: 50.2, y: 35.3, w: 70, size: 3.6, cls: 'ink body italic', lh: 1.2, delay: 0.45 }),
  at(rsvp.button, { x: 50, y: 42.6, w: 50.8, hit: true, delay: 0.55, cls: 'rsvp-el a-soft' }),
  art('divider', { x: 50.1, y: 50, w: 38, delay: 0.5, z: 3 }),
  txt(C.rsvp.wishesTitle, { x: 50.2, y: 57, w: 60, size: 6.4, cls: 'maroon display', lh: 1.2, delay: 0.55, anim: 'a-wipe' }),
  txt(C.rsvp.wishesLines, { x: 50.2, y: 64.6, w: 76, size: 3.5, cls: 'ink body', lh: 1.36, delay: 0.7 }),
  at(rsvp.wishes, { x: 50.2, y: 74.2, w: 55.8, hit: true, delay: 0.8, cls: 'wish-el a-soft' }),
]);

/* ── 7 · blessings ── */
const page7 = InvitationPage(7, [
  ornament('flourish', { x: 50.1, y: 23.5, w: 12.1, delay: 0.2 }),
  art('gift-icon', { x: 50, y: 32.7, w: 11.6, delay: 0.3, z: 3, cls: 'a-soft' }),
  rule({ x: 50, y: 39, w: 24.2, glyph: 'knot', size: 10, delay: 0.4 }),
  txt(C.gift.lines, { x: 50.2, y: 44, w: 76, size: 3.9, cls: 'ink body', lh: 1.32, delay: 0.5, anim: 'a-rise' }),
  at(GiftButton(C.gift, C.rsvp.form), { x: 50.1, y: 52.1, w: 45.3, hit: true, delay: 0.65, cls: 'a-soft' }),
  art('bird', { x: 87, y: 32.8, w: 20.7, motion: 'flutter', delay: 0.4, z: 3 }),
]);

/* ── 8 · thank you ── */
const page8 = InvitationPage(8, [
  art('tassel-s', { x: 4.4, y: 29.6, w: 8.6, height: 8.6, anchor: 'top', motion: 'sway hang', delay: 0.3, z: 3 }),
  rule({ x: 50.3, y: 26.6, w: 25.5, glyph: 'crown', size: 20, delay: 0.2 }),
  txt(C.closing.title, { x: 50.3, y: 31.1, w: 60, size: 4.4, cls: 'maroon display', lh: 1.2, delay: 0.3, anim: 'a-wipe' }),
  txt(C.closing.big, { x: 50.5, y: 38.4, w: 80, size: 16.5, cls: 'maroon names', lh: 1.1, delay: 0.5, anim: 'a-wipe' }),
  at(h('i', { class: 'heart-ico', html: icon('heart'), 'aria-hidden': 'true' }), { x: 50.1, y: 45.1, w: 3.4, delay: 0.65, cls: 'a-soft' }),
  txt(C.closing.lines, { x: 50.3, y: 51.1, w: 76, size: 3.5, cls: 'ink body', lh: 1.42, delay: 0.75, anim: 'a-rise' }),
  rule({ x: 50.9, y: 57.4, w: 28.7, glyph: 'crown', size: 15, delay: 0.85 }),
]);

const invitation = h('main', { class: 'invitation column', id: 'invitation' }, page1, page2, page3, page4, page5, page6, page7, page8);
app.append(invitation);
const petals = PetalOverlay({ column: invitation });

/* a gentle drift of the hero's sky as it scrolls by (parallax, none under reduced motion) */
if (!reducedMotion()) {
  const bg = page1.querySelector('.bg');
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = page1.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    const p = Math.min(1, Math.max(0, -r.top / r.height));
    bg.style.transform = `translateY(${p * 4}%) scale(${1 + p * 0.04})`;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

document.addEventListener('fullscreenchange', () => requestAnimationFrame(() => dispatchEvent(new Event('resize'))));

OpeningScreen(C.opening, C.ui, {
  audio,
  onOpened() {
    invitation.classList.add('shown');
    petals.show();
    page1.classList.add('on');
    observePages(invitation);
    window.scrollTo(0, 0);
  },
});
