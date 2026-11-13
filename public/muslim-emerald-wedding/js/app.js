/* Muslim emerald & gold wedding — the invitation assembled from its components.
   Scroll order (the pack's numbering): 1 doors (opening) → 2 hero → 3 save the date
   → 4 couple → 5 functions → 10 RSVP → 11 need help / thank you.
   Pages 6–9 are the function details opened from page 5.
   Positions are centre x / y and width in percent of each page canvas, read off
   the designer's WITH TEXT references. */
import { config as C } from '../config.js';
import { h, observePages, reducedMotion } from './util.js';
import { InvitationPage, art, txt, divider, at } from './page.js';
import { OpeningScreen } from './opening.js';
import { AudioControl } from './audio.js';
import { SparkleOverlay } from './sparkle.js';
import { ScratchDate } from './scratch.js';
import { openDetail, saveTheDate, openMaps, weekdayOf, dateOf } from './event-detail.js';
import { RSVPForm } from './rsvp.js';
import { contactBars } from './contact.js';

const app = document.getElementById('app');
const audio = AudioControl(C.opening);
const sparkle = SparkleOverlay();
const couple = C.couple.short;
const icon = {
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10A4 4 0 0 1 12 8a4 4 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z" fill="currentColor"/></svg>',
};

/* ── 2 · hero ── the lanterns and vines of the pack hang in from the top edge */
const page2 = InvitationPage(2, [
  art('vine-1', { x: 9, y: -4, w: 30, anchor: 'top', motion: 'sway', delay: 0.3, z: 2 }),
  art('vine-2', { x: 97.5, y: -3, w: 15, anchor: 'top', motion: 'sway', delay: 0.5, z: 2 }),
  art('lantern-1', { x: 7, y: -16, w: 7.5, anchor: 'top', motion: 'sway hang', delay: 0.4, z: 3 }),
  art('lantern-2', { x: 19, y: -11, w: 9, anchor: 'top', motion: 'sway hang', delay: 0.7, z: 3 }),
  art('lantern-3', { x: 80, y: -9, w: 9, anchor: 'top', motion: 'sway hang', delay: 0.6, z: 3 }),
  art('lantern-1', { x: 93, y: -17, w: 7.5, anchor: 'top', motion: 'sway hang', delay: 0.9, z: 3 }),
  txt(C.hero.bismillah, { y: 8.6, size: 4.9, cls: 'arabic', dir: 'rtl', lh: 1.5, delay: 0.2, w: 96 }),
  divider({ y: 13.2, w: 26, glyph: '✦', delay: 0.4 }),
  txt(C.hero.title, { y: 19.6, size: 9.2, cls: 'display italic shimmer', lh: 0.98, delay: 0.5 }),
  divider({ y: 24.3, w: 30, glyph: '❖', delay: 0.7 }),
  txt(C.hero.invite, { y: 29, size: 2.25, cls: 'serif caps', lh: 1.6, delay: 0.8 }),
  txt(C.couple.bride, { y: 36.4, size: 5.4, cls: 'display bold', delay: 1 }),
  txt(C.couple.brideTitle, { y: 38.7, size: 2.3, cls: 'serif caps tight', delay: 1.05 }),
  txt('&', { y: 40.7, size: 5.2, cls: 'display bold', delay: 1.1 }),
  txt(C.couple.groom, { y: 43.5, size: 5.4, cls: 'display bold', delay: 1.2 }),
  txt(C.couple.groomTitle, { y: 45.7, size: 2.3, cls: 'serif caps tight', delay: 1.25 }),
  txt(C.hero.blessing, { y: 52.7, size: 2.25, cls: 'serif caps', lh: 1.6, delay: 1.4 }),
  h('div', { class: 'hint', 'aria-hidden': 'true' }, h('span', {}, 'Scroll'), h('i')),
], { lazy: false });

/* ── 3 · save the date (the scratch card) ── */
const page3 = InvitationPage(3, [
  txt('Save the Date', { y: 34.5, size: 4.6, cls: 'cinzel cream wide', delay: 0.3 }),
  ...ScratchDate(C.date, { plate: { x: 49.2, y: 50.8, w: 56.2, h: 20.9, hintY: 79.4 } }),
  at(h('i', { class: 'heart', html: icon.heart }), { y: 65.2, w: 5, delay: 0.6 }),
  txt(C.date.tagline, { y: 69.4, size: 4.4, cls: 'display italic cream', lh: 1.2, delay: 0.7 }),
  at(saveTheDate(C.events.find((e) => e.key === C.date.event) || C.events[0], couple, { small: true }), { y: 86.5, w: 40, hit: true, delay: 0.9, cls: 'cream-pill' }),
]);

/* ── 4 · the couple on the palace walk (artwork page 4) or a collage of supplied photos ── */
const page4 = C.collage.photos.length
  ? InvitationPage(4, [at(h('div', { class: 'collage' }, ...C.collage.photos.map((p, i) => h('img', { src: p.src, alt: p.alt || '', loading: 'lazy', style: { '--i': i } }))), { y: 50, w: 86, z: 3 })], { cls: 'drift' })
  : InvitationPage(4, [], { cls: 'drift' });

/* ── 6–9 · function details ── */
function detailPage(ev) {
  const n = ev.page;
  const top = { 6: { title: 13.4, line: 16.7, tag: 21.4 }, 7: { title: 13, line: 16.6, tag: 21.2 }, 8: { title: 13, line: 16.6, tag: 21.2 }, 9: { title: 11.4, line: 16.6, tag: 18.7 } }[n];
  const bottom = n === 9
    ? { day: 78.3, date: 81.3, time: 84, orn: 86.3, venue: 88.6, city: 90.6, btn: 95.4 }
    : { day: n === 6 ? 71 : 72.7, date: n === 6 ? 74 : 75.4, time: n === 6 ? 76 : 77.6, orn: n === 6 ? 78.3 : 79.9, pin: n === 6 ? 80.6 : 81.9, venue: n === 6 ? 82.7 : 84.3, city: n === 6 ? 85 : 86.3, map: n === 6 ? 90.1 : 90.6, cal: 95.4 };
  const overlays = [
    n === 6 ? art('f-divider', { x: 50, y: 5.6, w: 30, delay: 0.1, z: 3 }) : null, // pages 7–9 carry this ornament in the artwork
    txt(ev.title, { y: top.title, size: 10, cls: 'cinzel green bold', delay: 0.2 }),
    n === 6 ? art('f-line-2', { x: 50, y: top.line, w: 28, delay: 0.3, z: 3 }) : null,
    txt(ev.tagline, { y: top.tag, size: 3.5, cls: 'display italic green', lh: 1.25, delay: 0.4 }),
    txt(weekdayOf(ev), { y: bottom.day, size: 3.4, cls: 'display italic green', delay: 0.3 }),
    txt(dateOf(ev), { y: bottom.date, size: 5.2, cls: 'display bold green', delay: 0.4 }),
    txt(ev.time, { y: bottom.time, size: n === 9 ? 2.9 : 3.2, cls: n === 9 ? 'serif caps green' : 'display italic green', delay: 0.5 }),
  ];
  if (n === 9) {
    overlays.push(
      divider({ y: bottom.orn, w: 16, glyph: '❖', delay: 0.55 }),
      txt(ev.venue, { y: bottom.venue, size: 4.6, cls: 'display bold green', delay: 0.6 }),
      txt(ev.city, { y: bottom.city, size: 2.7, cls: 'serif caps green', delay: 0.65 }),
      at(openMaps(ev, { small: true }), { x: 31, y: bottom.btn, w: 32, hit: true, delay: 0.8 }),
      at(saveTheDate(ev, couple, { small: true }), { x: 69, y: bottom.btn, w: 32, hit: true, delay: 0.9 }),
    );
  } else {
    overlays.push(
      divider({ y: bottom.orn, w: 22, glyph: '❖', delay: 0.55 }),
      at(h('i', { class: 'pin-ico', html: icon.pin }), { y: bottom.pin, w: 4, delay: 0.6 }),
      txt(ev.venue, { y: bottom.venue, size: 4.6, cls: 'display bold green', delay: 0.65 }),
      txt(ev.city, { y: bottom.city, size: 3.1, cls: 'display italic green', delay: 0.7 }),
      at(openMaps(ev), { y: bottom.map, w: 40, hit: true, delay: 0.8 }),
      at(saveTheDate(ev, couple, { small: true }), { y: bottom.cal, w: 31, hit: true, delay: 0.9 }),
    );
  }
  return InvitationPage(n, overlays, { lazy: false });
}

/* ── 5 · our functions: four cards; the frames and pictures are in the artwork ── */
const CARD_TOP = [15.8, 35.9, 56.2, 76.6];
function card(ev, i) {
  const t = CARD_TOP[i], d = 0.25 + i * 0.12;
  const open = h('button', { class: 'pill solid small view', type: 'button', 'aria-haspopup': 'dialog', 'aria-label': `View details of ${ev.title}` }, h('span', {}, 'View Details'), h('i', { class: 'chev light', 'aria-hidden': 'true' }));
  open.addEventListener('click', () => openDetail(ev, () => detailPage(ev), open));
  const row = (ico, text, y, extra = '') => at(h('div', { class: `info-row ${extra}`, html: `<i class="ico">${ico}</i><span>${text}</span>` }), { x: 70.3, y: t + y, w: 29, delay: d, cls: 'left' });
  return [
    txt(ev.title, { x: 70.3, y: t + 2.9, w: 29, size: 4.5, cls: 'cinzel green bold', align: 'left', delay: d }),
    row(icon.calendar, dateOf(ev), 5.7),
    row(icon.clock, ev.time, 7.4),
    row(icon.pin, `${ev.venue}<br>${ev.city}`, 9.9, 'two'),
    at(open, { x: 69.5, y: t + 15.1, w: 26, hit: true, delay: d + 0.1 }),
  ];
}
const page5 = InvitationPage(5, [
  at(h('i', { class: 'orn', html: '❖' }), { y: 2.6, w: 6, delay: 0.1 }),
  txt(C.functions.title, { y: 7.4, size: 5.6, cls: 'cinzel green', delay: 0.2 }),
  txt(C.functions.intro, { y: 12.3, size: 3.1, cls: 'display italic green', lh: 1.25, delay: 0.35 }),
  ...[[7, -3, 'f-lantern-1'], [7, 12, 'f-lantern-2'], [7, 30, 'f-lantern-3'], [7, 46, 'f-lantern-1'], [7, 64, 'f-lantern-2'],
      [93, -1, 'f-lantern-2'], [93, 15, 'f-lantern-3'], [93, 34, 'f-lantern-1'], [93, 51, 'f-lantern-2'], [93, 68, 'f-lantern-3']]
    .map(([x, y, id], i) => art(id, { x, y, w: 6.2, anchor: 'top', motion: 'sway hang', delay: 0.2 + i * 0.08, z: 3 })),
  ...C.events.flatMap(card),
]);

/* ── 10 · RSVP ── */
const page10 = InvitationPage(10, [
  txt(C.rsvp.title, { y: 16, size: 7.4, cls: 'cinzel green bold', delay: 0.2 }),
  divider({ y: 20, w: 20, glyph: '❖', delay: 0.3 }),
  txt(C.rsvp.lines, { y: 23.4, size: 2.75, cls: 'serif green', lh: 1.4, delay: 0.4 }),
  at(RSVPForm(C.rsvp), { x: 50.5, y: 52.2, w: 54, hit: true, delay: 0.5, cls: 'form-wrap' }),
  divider({ y: 76.5, w: 16, glyph: '❖', delay: 0.7 }),
]);

/* ── 11 · need help / thank you — the three bars (and their icons) are painted in the artwork ── */
const bars = contactBars(C.contact);
const page11 = InvitationPage(11, [
  txt(C.contact.title, { y: 38.8, size: 5, cls: 'cinzel green bold', delay: 0.2 }),
  txt(C.contact.lines, { y: 43.6, size: 3, cls: 'serif green', lh: 1.35, delay: 0.3 }),
  ...bars.map((b, i) => at(b, { x: 50, y: [48.6, 53.7, 58.9][i], w: 46.8, hit: true, delay: 0.4 + i * 0.1, cls: 'bar-wrap' })),
  txt(C.contact.thankYou, { y: 67.6, size: 5.4, cls: 'cinzel green bold', delay: 0.5 }),
  txt(C.contact.thanks, { y: 73, size: 2.9, cls: 'serif green', lh: 1.4, delay: 0.6 }),
  at(h('i', { class: 'heart red', html: icon.heart }), { y: 77.2, w: 4, delay: 0.7 }),
]);

const invitation = h('main', { class: 'invitation column', id: 'invitation' }, page2, page3, page4, page5, page10, page11);
app.append(invitation);

/* a gentle drift of the couple page as it scrolls by (parallax, none under reduced motion) */
if (!reducedMotion()) {
  const bg = page4.querySelector('.bg');
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = page4.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    const p = (vh - r.top) / (vh + r.height); // 0 → 1 as the page crosses the viewport
    bg.style.transform = `scale(${1.06 + p * 0.02}) translateY(${(p - 0.5) * -3}%)`;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// layout refresh when fullscreen comes or goes (viewport units settle a frame later)
document.addEventListener('fullscreenchange', () => requestAnimationFrame(() => dispatchEvent(new Event('resize'))));

OpeningScreen(C.opening, {
  audio,
  onOpened() {
    invitation.classList.add('shown');
    sparkle.show();
    page2.classList.add('on');
    observePages(invitation);
    window.scrollTo(0, 0);
  },
});
