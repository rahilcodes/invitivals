/* Muslim emerald & gold wedding — the invitation assembled from the designer's
   finished WITH TEXT plates. Scroll order (the pack's numbering):
   1 doors (opening) → 2 hero → 3 save the date → 4 couple → 5 functions → 10 RSVP → 11 need help / thank you.
   Pages 6–9 are the function details opened from page 5.
   Plate mapping: ref1→1, ref2→2, ref3→3, ref4→5, ref5→6, ref6→7, ref7→8, ref8→9, ref9→10, ref10→11.
   Nothing visible is drawn in HTML: every rectangle below is an invisible hit
   area measured on the 941 × 1672 reference (centre x / y, width, height in %). */
import { config as C } from '../config.js';
import { h, observePages, reducedMotion } from './util.js';
import { InvitationPage, hotspot, at } from './page.js';
import { OpeningScreen } from './opening.js';
import { AudioControl } from './audio.js';
import { SparkleOverlay } from './sparkle.js';
import { ScratchDate } from './scratch.js';
import { openDetail, saveTheDate, openMaps } from './event-detail.js';
import { RSVPForm } from './rsvp.js';
import { contactBars } from './contact.js';

const app = document.getElementById('app');
const audio = AudioControl(C.opening);
window.invitation = { music: audio.element }; // for checks in the console
const sparkle = SparkleOverlay();
const couple = C.couple.short;

/* ── 2 · hero (ref 2: calligraphy, title, names and lanterns are all in the plate) ── */
const page2 = InvitationPage(2, 'ref2', [], { lazy: false });

/* ── 3 · save the date (ref 3 shows the revealed plaque; the scratch cover hides it until rubbed) ── */
const page3 = InvitationPage(3, 'ref3', [
  ...ScratchDate(C.date, {
    plate: { x: 50.2, y: 51, w: 57.8, h: 21.6 },
    pill: { x: 49.4, y: 79.4, w: 50, h: 5.3 },
    seal: { cx: 1.03, cy: 0.79, r: 0.112 },
  }),
]);

/* ── 4 · the couple on the palace walk (artwork page 4, no text reference) or a collage ── */
const page4 = C.collage.photos.length
  ? InvitationPage(4, 'bg4', [at(h('div', { class: 'collage' }, ...C.collage.photos.map((p, i) => h('img', { src: p.src, alt: p.alt || '', loading: 'lazy', style: { '--i': i } }))), { y: 50, w: 86, z: 3 })], { cls: 'drift' })
  : InvitationPage(4, 'bg4', [], { cls: 'drift' });

/* ── 6–9 · function details: the plates carry everything; the painted buttons get hit areas ── */
const DETAIL = {
  6: { plate: 'ref5', map: { x: 50, y: 90.4, w: 40, h: 4.5 }, cal: { x: 50, y: 95.5, w: 33, h: 3.4 } },
  7: { plate: 'ref6', map: { x: 50, y: 90.1, w: 40, h: 4.5 }, cal: { x: 50, y: 95.3, w: 33, h: 3.6 } },
  8: { plate: 'ref7', map: { x: 50, y: 91, w: 44, h: 4.5 }, cal: { x: 50, y: 96.2, w: 44, h: 4 } },
  9: { plate: 'ref8', map: { x: 32.4, y: 95.2, w: 35, h: 3.9 }, cal: { x: 68.5, y: 95.2, w: 33, h: 3.9 } },
};
function detailPage(ev) {
  const d = DETAIL[ev.page];
  return InvitationPage(ev.page, d.plate, [
    hotspot(openMaps(ev), d.map),
    hotspot(saveTheDate(ev, couple), d.cal),
  ], { lazy: false });
}

/* ── 5 · our functions (ref 4): four painted View Details buttons ── */
const VIEW_Y = [30.9, 51.1, 71.5, 91.7];
const page5 = InvitationPage(5, 'ref4', C.events.map((ev, i) => {
  const open = h('button', { type: 'button', 'aria-haspopup': 'dialog', 'aria-label': `View details of ${ev.title}` });
  open.addEventListener('click', () => openDetail(ev, () => detailPage(ev), open));
  return hotspot(open, { x: 69.8, y: VIEW_Y[i], w: 27.6, h: 3.2 });
}));

/* ── 10 · RSVP (ref 9): real controls over the painted form ── */
const page10 = InvitationPage(10, 'ref9', [
  RSVPForm(C.rsvp, {
    accept: { x: 50, y: 43.5, w: 55.3, h: 6.3 },
    decline: { x: 50, y: 49.8, w: 55.3, h: 6.3 },
    ring: { x: 13.1, size: 2.8 }, // the painted ring's centre, in % of the row box
    message: { x: 50, y: 58.2, w: 55.3, h: 8.7, patch: { x: 4.8, y: 24, w: 62, h: 38 } },
    send: { x: 50, y: 66.4, w: 55.3, h: 4.8 },
    note: { y: 74 },
  }),
]);

/* ── 11 · need help / thank you (ref 10): the three painted bars ── */
const BAR_Y = [49.3, 54.5, 59.7];
const page11 = InvitationPage(11, 'ref10', contactBars(C.contact).map((b, i) => hotspot(b, { x: 50, y: BAR_Y[i], w: 46.8, h: 4.8 })));

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
