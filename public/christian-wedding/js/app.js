/* The invitation: one scrolling page. The pack's backgrounds are used whole, in their numbered order,
   and the sections follow the designer's mockup on them:
     1.png      the doors (opening) → VIDEO.mp4
     2.png      hero: the couple cut-out, the top floral clusters, the words
     SCREENING 8   Our Special Day (scratch) + Wedding Details
     SCREENING 9   Our Love Story
     SCREENING 10  Our Families
     SCREENING 11  The Wedding Schedule (each function opens its details)
     SCREENING 12  Our Venue + the verse
     SCREENING 13  Our Countdown + Our Memories
     SCREENING 14  Kindly Reply
     SCREENING 15  Wedding Wishes + A Special Gift
     ENDING.png    Thank You
   Every word comes from config.js. */
import { config as C } from '../config.js?v=5';
import { h, icons, lines, observeReveals, reducedMotion, mapsHref } from './util.js?v=5';
import { OpeningScreen } from './opening.js?v=5';
import { AudioControl } from './audio.js?v=5';
import { ScratchCard } from './scratch.js?v=5';
import { Countdown } from './countdown.js?v=5';
import { Sheet } from './detail.js?v=5';
import { RSVPForm } from './rsvp.js?v=5';

const app = document.getElementById('app');
const audio = AudioControl(C.opening);
const sheet = Sheet();

/* ── building blocks ── */
const img = (src, attrs = {}) => h('img', { src, alt: '', decoding: 'async', draggable: 'false', loading: 'lazy', ...attrs });
const heading = (title, sub, cls = '') => h('header', { class: `head reveal ${cls}` },
  h('h2', {}, title), img('assets/divider.webp', { class: 'divider', loading: 'eager' }), sub ? h('p', { class: 'sub' }, sub) : null);
const section = (id, cls, ...kids) => h('section', { id, class: `sec ${cls}` }, ...kids);
/* one screen: the plate, whole, with its sections in the plate's clear area (css sets the box per plate) */
const page = (n, accents, ...kids) => h('div', { class: `page p${n}` },
  h('img', { class: 'plate', src: `assets/plate${n}.webp`, alt: '', decoding: 'async', loading: 'eager', fetchpriority: n === 8 ? 'auto' : 'low', draggable: 'false', width: 941, height: 1672 }), // all eight load behind the film: a fast scroll never meets a bare screen
  ...accents, h('div', { class: 'page-body' }, ...kids));
/* a loose flower or candle from the pack, as its own layer */
const accent = (file, cls = '') => h('div', { class: `accent reveal slow ${cls}`, 'aria-hidden': 'true' }, img(`assets/${file}.webp`, { class: cls.includes('candle') ? 'flame' : 'sway' }));
const more = () => h('p', { class: 'more reveal', 'aria-hidden': 'true' }, C.hero.scroll, h('i'));
const packIcon = (name) => img(`assets/icon-${name}.webp`, { class: 'pack-icon' });
const icon = (name) => (name === 'clock' || name === 'cutlery' ? h('span', { class: 'svg-icon', html: icons[name] }) : packIcon(name));
const external = (href, cls, ...kids) => h('a', { class: cls, href, target: '_blank', rel: 'noopener' }, ...kids);

/* ── hero: the aisle plate, the florals, the couple, the words ── */
function Hero() {
  const art = h('div', { class: 'hero-art' },
    h('img', { class: 'plate', src: 'assets/hero.webp', alt: '', decoding: 'async', fetchpriority: 'high', width: 941, height: 1672 }),
    h('div', { class: 'fl sparkles reveal', style: { '--d': '.9s' } }, img('assets/fl-sparkles.webp', { loading: 'eager' })),
    h('div', { class: 'fl cluster-a reveal slow', style: { '--d': '.4s' } }, img('assets/fl-cluster-a.webp', { class: 'sway', loading: 'eager' })),
    h('div', { class: 'fl cluster-b reveal slow', style: { '--d': '.55s' } }, img('assets/fl-cluster-b.webp', { class: 'sway alt', loading: 'eager' })),
    h('div', { class: 'couple reveal slow', style: { '--d': '.15s' } }, h('img', { src: 'assets/couple.webp', alt: `${C.couple.groom} and ${C.couple.bride} walking up the aisle, seen from behind`, decoding: 'async', draggable: 'false' })),
    h('div', { class: 'hero-words' },
      h('p', { class: 'caps reveal', style: { '--d': '.7s' } }, lines(C.hero.top)),
      h('span', { class: 'flourish reveal', style: { '--d': '.85s' } }, img('assets/divider.webp', { loading: 'eager' })),
      h('h1', { class: 'names' },
        h('span', { class: 'name reveal', style: { '--d': '1s' } }, C.couple.groom),
        h('span', { class: 'amp reveal', style: { '--d': '1.2s' } }, C.hero.and),
        h('span', { class: 'name reveal', style: { '--d': '1.3s' } }, C.couple.bride)),
      h('p', { class: 'caps invite reveal', style: { '--d': '1.55s' } }, lines(C.hero.invite))),
    h('a', { class: 'scroll-hint reveal', href: '#special-day', style: { '--d': '2s' } }, C.hero.scroll, h('i', { 'aria-hidden': 'true' })));
  return h('section', { id: 'hero', class: 'hero' }, art);
}

/* ── Our Special Day ── */
const SpecialDay = () => section('special-day', 'special', heading(C.specialDay.title, C.specialDay.sub), h('div', { class: 'reveal' }, ScratchCard(C.specialDay, C.wedding)));

/* ── Wedding Details ── */
const Details = () => section('details', 'details', heading(C.details.title, ''),
  h('div', { class: 'cards' }, C.details.cards.map((c, i) => h('div', { class: 'tile reveal', style: { '--d': `${i * 0.1}s` } },
    icon(c.icon), h('span', { class: 'label' }, c.label), c.lines ? h('span', { class: 'small' }, lines(c.lines)) : h('span', { class: 'value' }, c.value)))));

/* ── Our Love Story ── */
const Story = () => section('story', 'story', heading(C.story.title, C.story.sub),
  h('ol', { class: 'timeline' }, C.story.items.map((s, i) => h('li', { class: 'milestone reveal', style: { '--d': `${i * 0.12}s` } },
    h('span', { class: 'dot', html: icons.heart }),
    h('span', { class: 'round' }, h('img', { src: s.photo, alt: '', loading: 'lazy', decoding: 'async', style: { objectPosition: s.pos } })),
    h('div', { class: 'words' }, h('h3', { class: 'script' }, s.title), h('span', { class: 'when' }, s.date), h('p', {}, lines(s.text)))))));

/* ── Our Families ── */
const family = (f, d) => h('div', { class: 'oval reveal', style: { '--d': d } }, h('span', { class: 'svg-icon fam', html: icons.family }), h('span', { class: 'fam-label' }, f.label), h('p', { class: 'parents' }, f.names[0], h('br'), h('span', { class: 'amp-s' }, '&'), h('br'), f.names[1]));
const Families = () => section('families', 'families', heading(C.families.title, ''), h('div', { class: 'ovals' }, family(C.families.groom, '0s'), family(C.families.bride, '.12s')));

/* ── The Wedding Schedule: the functions, each a button to its details ── */
const Schedule = () => section('schedule', 'schedule', heading(C.schedule.title, ''),
  h('ol', { class: 'functions' }, C.schedule.events.map((ev, i) => h('li', { class: 'reveal', style: { '--d': `${i * 0.12}s` } },
    h('button', { class: 'fn', type: 'button', 'aria-haspopup': 'dialog', onclick: (e) => sheet.event(ev, C.schedule, C.couple, e.currentTarget) },
      h('span', { class: 'fn-icon' }, icon(ev.icon)), h('span', { class: 'fn-dot' }),
      h('span', { class: 'fn-words' }, h('span', { class: 'fn-title' }, ev.title), h('span', { class: 'fn-time' }, ev.time),
        ev.venue ? h('span', { class: 'fn-venue' }, ev.venue, h('br'), ev.address[0]) : h('span', { class: 'fn-venue' }, lines(ev.note)),
        h('span', { class: 'fn-tap' }, C.schedule.tap, h('span', { html: icons.arrow }))))))));

/* ── Our Venue ── */
const Venue = () => section('venue', 'venue', heading(C.venues.title, ''),
  C.venues.items.map((v, i) => h('article', { class: 'venue-card reveal', style: { '--d': `${i * 0.12}s` } },
    h('div', { class: 'venue-photo' }, img(v.photo, { alt: v.alt })),
    h('div', { class: 'venue-words' }, h('span', { class: 'label' }, v.label), h('h3', { class: 'script' }, v.name), h('p', {}, lines(v.address)),
      external(mapsHref(v), 'btn line', C.venues.button, h('span', { html: icons.arrow }))))));

/* ── the verse ── */
const Quote = () => section('quote', 'quote', h('div', { class: 'reveal' }, img('assets/divider.webp', { class: 'divider' }),
  h('blockquote', {}, h('p', { class: 'script-soft' }, lines(C.quote.text)), h('cite', {}, C.quote.ref))));

/* ── Our Countdown ── */
const CountdownSection = () => section('countdown', 'cd', heading(C.countdown.title, C.countdown.sub), Countdown(C.countdown, C.wedding));

/* ── Our Memories: the pack's gold frame around each photograph ── */
const Memories = () => section('memories', 'memories', heading(C.memories.title, C.memories.sub),
  h('div', { class: 'gallery' }, C.memories.photos.map((p, i) => h('figure', { class: 'shot reveal', style: { '--d': `${(i % 2) * 0.14 + Math.floor(i / 2) * 0.08}s` } },
    img(p.src, { alt: p.alt, class: 'ph', style: { objectPosition: p.pos } }), img('assets/frame.webp', { class: 'frame' })))));

/* ── Kindly Reply ── */
const RSVP = () => section('rsvp', 'rsvp', heading(C.rsvp.title, C.rsvp.sub), h('div', { class: 'reveal' }, RSVPForm(C.rsvp, C.couple)));

/* ── Wedding Wishes ── */
function Wishes() {
  const w = C.wishes;
  const text = encodeURIComponent(`Wishes for ${C.couple.groom} & ${C.couple.bride}:\n`);
  const href = w.whatsapp ? `https://wa.me/${w.whatsapp}?text=${text}` : w.email ? `mailto:${w.email}?subject=${encodeURIComponent(`Wishes for ${C.couple.groom} & ${C.couple.bride}`)}` : '';
  const btn = href
    ? external(href, 'btn gold', h('span', { html: icons.envelope }), w.button)
    : h('button', { class: 'btn gold', type: 'button', disabled: true, 'aria-disabled': 'true', title: 'Not connected yet' }, h('span', { html: icons.envelope }), w.button);
  return section('wishes', 'wishes', heading(w.title, w.sub), h('div', { class: 'reveal centre' }, btn));
}

/* ── A Special Gift ── */
const Gift = () => section('gift', 'gift', heading(C.gift.title, C.gift.sub),
  h('div', { class: 'reveal centre' }, h('button', { class: 'btn gold', type: 'button', 'aria-haspopup': 'dialog', onclick: (e) => sheet.gift(C.gift, e.currentTarget) }, h('span', { html: icons.gift }), C.gift.button)));

/* ── Thank You, on the ENDING plate ── */
const Ending = () => h('section', { id: 'thanks', class: 'ending' }, h('div', { class: 'ending-art' },
  h('img', { class: 'plate', src: 'assets/ending.webp', alt: `${C.couple.groom} lifting ${C.couple.bride} in the candle-lit aisle`, decoding: 'async', loading: 'lazy', width: 941, height: 1672 }),
  h('div', { class: 'thanks' }, img('assets/divider.webp', { class: 'divider reveal' }),
    h('h2', { class: 'script big reveal', style: { '--d': '.15s' } }, C.thanks.title),
    h('p', { class: 'caps reveal', style: { '--d': '.35s' } }, lines(C.thanks.lines)),
    h('span', { class: 'heart-mark reveal', style: { '--d': '.5s' }, html: icons.heart }))),
  h('footer', { class: 'ending-foot' }, h('p', { class: 'closing caps reveal' }, lines(C.thanks.closing)), h('span', { class: 'heart-mark small reveal', html: icons.heart }),
    h('a', { class: 'created', href: 'https://invitivals.com/', target: '_blank', rel: 'noopener' }, 'Created by ', h('b', {}, 'Invitivals'))));

/* ── assemble ── */
const invitation = h('main', { class: 'invitation' }, Hero(),
  page(8, [], SpecialDay(), Details(), more()),
  page(9, [accent('fl-cluster-b', 'flip')], Story()),
  page(10, [accent('fl-lily', 'top'), accent('fl-candle-flowers', 'candle')], Families()),
  page(11, [accent('fl-rose')], Schedule()),
  page(12, [accent('candle-three', 'candle')], Venue(), Quote(), more()),
  page(13, [], CountdownSection(), Memories()),
  page(14, [], RSVP()),
  page(15, [], Wishes(), Gift()),
  Ending());
app.append(h('div', { class: 'column' }, invitation));

/* parallax: the hero's florals and the couple drift a little slower than the page */
function parallax() {
  if (reducedMotion()) return;
  const hero = invitation.querySelector('.hero');
  const layers = [[hero.querySelector('.couple'), 0.08], [hero.querySelector('.cluster-a'), 0.16], [hero.querySelector('.cluster-b'), 0.13], [hero.querySelector('.sparkles'), 0.05]];
  let raf = 0;
  const step = () => {
    raf = 0;
    const y = scrollY, hh = hero.offsetHeight;
    if (y > hh) return;
    for (const [el, k] of layers) el.style.setProperty('--py', `${(y * k).toFixed(1)}px`);
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(step); }, { passive: true });
}

const url = new URL(location.href);
const skipOpening = url.searchParams.has('open');
const { replayControl } = OpeningScreen(C.opening, {
  audio,
  onStart() { invitation.classList.add('shown'); },
  onOpened() {
    invitation.classList.add('open');
    observeReveals(invitation);
    parallax();
    document.body.append(replayControl);
  },
});
if (skipOpening) {
  // working on the page: no doors, no film; everything is shown at once
  document.querySelectorAll('.opening, .film').forEach((el) => el.remove());
  invitation.classList.add('shown', 'open');
  observeReveals(invitation);
  parallax();
}
document.addEventListener('fullscreenchange', () => { /* leaving fullscreen is the guest's choice; the page is the same either way */ });
