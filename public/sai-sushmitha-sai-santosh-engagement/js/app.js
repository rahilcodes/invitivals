/* Dr. Sai Sushmitha Reddy & Sai Santosh Reddy — Engagement Ceremony: the invitation, one continuous column, on the
   design of dr-mohammed-nihal-nooha kept exactly as it is (only the wording and the monogram are this couple's).
   Scroll order: 1 the invitation card (invocation, SS monogram, the hosts and the couple) · 2 Save the Date
   (December 2026, the 4th revealed) · 3 the ceremony and the families (the reference's two cards) · 4 the countdown
   to the ceremony (landscape) · 5 the closing (SS monogram, Thank You) · then Share / Copy Link.
   Pages 2 and 3 follow the reference's layout: their pieces take the boxes the reference measured (js/art.js).
   There is no RSVP. */
import { config as C } from '../config.js?v=1';
import { art, box } from './art.js?v=1';
import { h, observePages, calendarHref, reducedMotion } from './util.js?v=1';
import { OpeningScreen } from './opening.js?v=1';
import { AudioControl } from './audio.js?v=1';
import { SparkleOverlay } from './sparkle.js?v=1';
import { Countdown } from './countdown.js?v=1';

const app = document.getElementById('app');
const audio = AudioControl(C.opening);
const sparkle = SparkleOverlay();
const URL_ = `https://invitivals.com/${C.slug}/`;

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
const br = (lines) => lines.flatMap((l, i) => (i ? [h('br'), l] : [l]));
/* the box the reference's layout gives a piece: at('p3-n-date') → left/top/width/height in % of the page */
const at = (id, grow = {}) => { const [x, y, w, hh] = box[id]; return { left: `${x + (grow.dx || 0)}%`, top: `${y + (grow.dy || 0)}%`, width: `${grow.w ?? w}%`, height: `${grow.h ?? hh}%` }; };
/* a cut-out of the reference in its own place */
const spr = (id, d, alt = '', grow = {}) => r(d, 'div', { class: 's', style: at(id, grow) }, pic(id, alt, ''));
/* the calendar entry carries the programme, the venue and its map link */
const calOf = (ev) => ({ title: `${ev.title} — ${C.couple}`, local: ev.local, minutes: ev.minutes, timeZone: C.timeZone, location: ev.venue,
  details: `${ev.date}\n${C.programme.join('\n')}\nVenue: ${ev.venue}\nLocation: ${ev.mapsUrl}\n\n${URL_}` });
const [EV] = C.events;

/* ── the chooser sheet: Google Calendar or a calendar file ── */
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
const saveSheet = () => openSheet('Save the Date', [
  'Google Calendar',
  { label: EV.title, sub: `${EV.date} · ${EV.time}`, href: calendarHref(calOf(EV)) },
  'Apple / Outlook calendar (.ics)',
  { label: EV.title, sub: 'Calendar file', href: EV.ics, download: 'engagement-ceremony.ics', quiet: true },
]);

/* ── page 1: the invitation card ── */
const H = C.hero;
const page1 = Page(1, 'p-hero', [h('div', { class: 'card' },
  r(0.1, 'p', { class: 'invocation' }, H.invocation),
  r(0.3, 'div', { class: 'mono' }, pic('ss-plum', 'S S monogram of Sai Sushmitha and Sai Santosh', '')),
  r(0.45, 'p', { class: 'kind' }, H.title),
  r(0.6, 'p', { class: 'hosts' }, ...br(H.hosts)),
  r(0.75, 'p', { class: 'request' }, ...br(H.request)),
  r(0.9, 'h1', { class: 'name' }, H.bride),
  r(1.05, 'p', { class: 'and' }, h('i'), H.and, h('i')),
  r(1.2, 'p', { class: 'name name--groom' }, H.groom),
  r(1.35, 'p', { class: 'of' }, h('em', {}, H.groomOf[0]), ...br(H.groomOf.slice(1))),
  r(1.5, 'p', { class: 'blessing' }, H.blessing),
)], { satin: false });

/* ── page 2: Save the Date. The reference's frame, panel (its SUN … SAT heading is painted in the plate) and painted
      buttons; the month and its figures are live. The 4th wears the golden heart once the guest taps Reveal Date,
      exactly as the reference reveals its day. ── */
const S = C.saveOurDate;
const first = new Date(Date.UTC(S.year, S.month - 1, 1)).getUTCDay(), days = new Date(Date.UTC(S.year, S.month, 0)).getUTCDate();
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][S.month - 1];
const cells = [];
for (let i = 0; i < first; i++) cells.push(h('span', { 'aria-hidden': 'true' }));
for (let d = 1; d <= days; d++) {
  const mark = S.marks.find((m) => m.day === d);
  cells.push(mark ? h('span', { class: 'day day--mark', 'aria-label': `${d} ${MONTH} ${S.year}: ${mark.label}` }, pic('p2-heart', '', 'day__heart'), h('b', {}, String(d))) : h('span', { class: 'day' }, String(d)));
}
const revealBtn = h('button', { class: 'reveal-hit', type: 'button', 'aria-pressed': 'false', style: at('p2-reveal-hit') }, h('span', { class: 'sr-only' }, 'Reveal the engagement date'));
const page2 = Page(2, 'p-date', [
  r(0.1, 'div', { class: 's orn2', style: { left: '43.5%', top: '11.6%', width: '13%' } }, pic('p5-ornament', '', '')),
  spr('p2-divider', 0.25),
  spr('p2-title', 0.4, 'Save Our Date'),
  r(0.6, 'p', { class: 'month', style: at('p2-month', { dx: -8, w: 51.6 }) }, `${MONTH} ${S.year}`),
  r(0.75, 'div', { class: 'cal', role: 'group', 'aria-label': `${MONTH} ${S.year}` }, ...cells),
  h('div', { class: 's reveal-pill', style: at('p2-reveal'), 'aria-hidden': 'true' }, pic('p2-reveal', '', '')),
  h('div', { class: 'legend', style: at('p2-reveal', { dy: 0.4 }) }, ...S.legend.map((parts, i) => h('p', { class: i ? 'legend__sub' : '' }, ...parts.map((t, k) => (k % 2 ? t : h('b', {}, t)))))),
  revealBtn,
  h('button', { class: 'hit', type: 'button', style: at('p2-save-hit'), 'aria-label': 'Save the date to your calendar', 'data-open': 'save', onclick: saveSheet }),
  h('a', { class: 'hit', style: at('p2-maps-hit'), href: C.mapsUrl, target: '_blank', rel: 'noopener', 'data-maps': 'venue', 'aria-label': `View the venue location on Google Maps: ${EV.venue}` }),
]);
revealBtn.addEventListener('click', () => {
  if (page2.classList.contains('revealed')) return;
  page2.classList.add('revealed');
  revealBtn.setAttribute('aria-pressed', 'true');
  revealBtn.firstChild.textContent = `Date revealed: ${S.legend.map((p) => p.join('')).join('. ')}`;
  revealBtn.disabled = true;
  confetti(revealBtn);
});

/* ── page 3: the reference's two cards. The first is the ceremony: date, time and venue beside their icons, and its
      two painted buttons (Save the Date → the calendar choice, View on Google Maps → the family's own link). The
      second card is the families; its painted buttons are taken out of this page's plate (the build tool). ── */
const page3 = Page(3, 'p-func', [
  r(0.2, 'h2', { class: 'fn-title', style: at('p3-title', { dx: -6, w: 60.6, dy: -0.6, h: 11.4 }) }, h('b', {}, 'Engagement'), h('span', {}, 'Ceremony')),
  spr('p3-divider', 0.4),
  r(0.55, 'h3', { class: 'ev-title', style: at('p3-n-title', { dx: -8.2, w: 32 }) }, 'Date & Venue'),
  r(0.67, 'div', { class: 's', style: at('p3-n-divider', { dx: -1.9 }) }, pic('p3-n-divider', '', '')),
  spr('p3-n-icon-date', 0.79, '', { dy: -0.5 }),
  r(0.79, 'p', { class: 'ev-line', style: at('p3-n-date', { w: 37, dy: -0.5 }) }, EV.date),
  spr('p3-n-icon-time', 0.91, '', { dy: -0.7 }),
  r(0.91, 'p', { class: 'ev-line', style: at('p3-n-time', { w: 37, dy: -0.7 }) }, EV.time),
  spr('p3-n-icon-venue', 1.03, '', { dy: -0.9 }),
  r(1.03, 'p', { class: 'ev-line ev-venue', style: at('p3-n-venue', { w: 37, dy: -0.9, h: 6.2 }) }, h('b', {}, C.venue), h('br'), C.address),
  h('button', { class: 'hit', type: 'button', style: at('p3-n-save-hit'), 'data-cal': EV.key, 'aria-label': `Save the date: ${EV.title}, ${EV.date}, ${EV.time}`, onclick: saveSheet }),
  h('a', { class: 'hit', style: at('p3-n-maps-hit'), href: C.mapsUrl, target: '_blank', rel: 'noopener', 'data-maps': EV.key, 'aria-label': `View location on Google Maps: ${EV.venue}` }),
  r(1.0, 'h3', { class: 'ev-title', style: at('p3-r-title', { dx: -7, w: 32 }) }, 'Our Families'),
  r(1.12, 'div', { class: 's', style: at('p3-r-divider', { dx: -1.9 }) }, pic('p3-r-divider', '', '')),
  r(1.25, 'div', { class: 'families' }, ...C.families.map((f) => h('div', { class: 'fam' }, h('p', { class: 'fam__label' }, f.label), h('p', { class: 'fam__names' }, ...br(f.lines))))),
]);

/* ── page 4: counting down to forever (landscape) ── */
const page4 = Page(4, 'p-count', [
  r(0.1, 'h2', { class: 'until' }, ...C.countdown.heading.map((l) => h('b', {}, l))),
  r(0.3, 'div', { class: 'until-rule' }, pic('p4-divider', '', '')),
  ...Countdown(C.countdown),
]);

/* ── page 5: the closing ── */
const page5 = Page(5, 'p-end', [
  r(0.1, 'div', { class: 'mono' }, pic('ss-gold', 'S S monogram', '')),
  r(0.4, 'h2', { class: 'thanks' }, C.closing.title),
  r(0.65, 'div', { class: 'closing' }, h('p', {}, ...br(C.closing.lines)), h('p', { class: 'closing__from' }, h('em', {}, 'With love,'), h('br'), C.closing.from)),
  h('a', { class: 'created', href: `https://invitivals.com/?utm_source=invitation&utm_medium=footer&utm_campaign=${C.slug}`, target: '_blank', rel: 'noopener' }, 'Created by ', h('b', {}, 'INVITIVALS')),
]);

/* ── share: WhatsApp with the invitation's link, and Copy Link (with a fallback where the clipboard is closed) ── */
const shareText = `You are cordially invited to the Engagement Ceremony of ${C.couple} on ${EV.date}, ${EV.time} at ${C.venue}, ${C.address}\n${URL_}`;
const note = h('p', { class: 'share__note', role: 'status', 'aria-live': 'polite' });
async function copyLink() {
  let ok = false;
  try { await navigator.clipboard.writeText(URL_); ok = true; } catch {
    const t = h('textarea', { style: { position: 'fixed', top: '-100px', opacity: '0' }, readonly: true }); t.value = URL_; document.body.append(t); t.select();
    try { ok = document.execCommand('copy'); } catch { ok = false; } t.remove();
  }
  note.textContent = ok ? 'Invitation link copied.' : `Copy this link: ${URL_}`;
}
const share = h('section', { class: 'share', 'aria-label': 'Share this invitation' },
  h('p', { class: 'share__title' }, 'Share this Invitation'),
  h('div', { class: 'share__row' },
    h('a', { class: 'sheet__btn share__btn', href: `https://wa.me/?text=${encodeURIComponent(shareText)}`, target: '_blank', rel: 'noopener', 'data-share': 'whatsapp' }, h('b', {}, 'Share on WhatsApp')),
    h('button', { class: 'sheet__btn sheet__btn--quiet share__btn', type: 'button', 'data-share': 'copy', onclick: copyLink }, h('b', {}, 'Copy Link'))),
  note);

const invitation = h('main', { class: 'invitation column', id: 'invitation' }, page1, page2, page3, page4, page5, share);
app.append(invitation);

/* ── confetti: a light shower of champagne, blush and plum paper, as the invitation opens and as the date is revealed ── */
function confetti(from) {
  if (reducedMotion()) return;
  const c = h('canvas', { class: 'confetti', 'aria-hidden': 'true' });
  document.body.append(c);
  const ctx = c.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, Ht = innerHeight;
  c.width = W * dpr; c.height = Ht * dpr; ctx.scale(dpr, dpr);
  const COL = ['#e9cf9a', '#d8b36a', '#f6e7d6', '#e6bfcf', '#b58aa3', '#8a5574', '#fff6df'];
  const k = Math.max(0.8, Math.min(1.3, W / 420)), P = [];
  const add = (x, y, vx, vy, delay) => P.push({ x, y, vx, vy, delay, w: (5 + Math.random() * 6) * k, hh: (3 + Math.random() * 4) * k, r: Math.random() * 6.3, vr: (Math.random() - 0.5) * 0.3, f: Math.random() * 6.3, vf: 0.08 + Math.random() * 0.12, col: COL[(Math.random() * COL.length) | 0], round: Math.random() < 0.25 });
  if (from) {
    const b = from.getBoundingClientRect(), ox = b.left + b.width / 2, oy = b.top + b.height / 2;
    for (let i = 0; i < 110; i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2, s = (4 + Math.random() * 8) * k; add(ox, oy, Math.cos(a) * s, Math.sin(a) * s - 2, 0); }
  } else for (let i = 0; i < 120; i++) add(Math.random() * W, -20 - Math.random() * 200, (Math.random() - 0.5) * 1.6, 1 + Math.random() * 2, Math.random() * 50);
  let t = 0;
  const tick = () => {
    t++; ctx.clearRect(0, 0, W, Ht); let alive = 0;
    const fade = t > 200 ? Math.max(0, 1 - (t - 200) / 60) : 1;
    for (const p of P) {
      if (t < p.delay) { alive++; continue; }
      p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.16; p.x += p.vx + Math.sin(p.f) * 0.6; p.y += p.vy; p.r += p.vr; p.f += p.vf;
      if (p.y > Ht + 30) continue; alive++;
      ctx.save(); ctx.globalAlpha = fade; ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.col;
      if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.hh * 0.6, 0, 6.28); ctx.fill(); } else ctx.fillRect(-p.w / 2, (-p.hh / 2) * Math.abs(Math.cos(p.f)), p.w, p.hh * Math.abs(Math.cos(p.f)) + 0.5);
      ctx.restore();
    }
    if (alive && fade > 0) requestAnimationFrame(tick); else c.remove();
  };
  requestAnimationFrame(tick);
}

/* the next page's plate is fetched once the hero is ready, without layout cost */
addEventListener('load', () => { new Image().src = 'assets/plate2.webp'; }, { once: true });

OpeningScreen(C.opening, {
  audio,
  onStart() { invitation.classList.add('shown'); },
  onOpened() {
    page1.classList.add('on');
    sparkle.show();
    confetti();
    observePages(invitation);
    window.scrollTo(0, 0);
  },
});
