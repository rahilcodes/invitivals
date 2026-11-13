/* EventDetail — the four function pages (6–9) as a full-screen view over the
   invitation. The page beneath keeps its scroll position and the music keeps
   playing; Back, Escape and the browser's back button all close it and return
   focus to the card that opened it. */
import { h, toast, downloadIcs, googleCalendarHref, isApple, mapsHref, observePages } from './util.js';

let current = null;

export function openDetail(ev, buildPage, opener) {
  if (current) return;
  const scrollY = window.scrollY;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  history.pushState({ detail: ev.key }, ''); // before the body is fixed, so the entry keeps the real scroll position
  const view = h('div', { class: 'detail', role: 'dialog', 'aria-modal': 'true', 'aria-label': `${ev.title} details` });
  const back = h('button', { class: 'back', type: 'button' }, 'Back to Functions');
  const column = h('div', { class: 'column' }, buildPage());
  view.append(back, column);
  document.body.append(view);
  document.body.classList.add('locked');
  document.body.style.top = `-${scrollY}px`;
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  requestAnimationFrame(() => { view.classList.add('shown'); observePages(view); });
  back.focus({ preventScroll: true });
  current = { view, scrollY, opener };

  const close = () => {
    if (!current) return;
    const { view, scrollY, opener } = current; current = null;
    view.classList.remove('shown');
    document.body.classList.remove('locked');
    document.body.style.position = ''; document.body.style.top = ''; document.body.style.width = '';
    window.scrollTo(0, scrollY);
    requestAnimationFrame(() => window.scrollTo(0, scrollY));
    setTimeout(() => view.remove(), 500);
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  };
  back.addEventListener('click', () => history.back());
  window.addEventListener('popstate', function onPop() { window.removeEventListener('popstate', onPop); close(); });
  view.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); history.back(); }
    if (e.key === 'Tab') { // keep focus inside the view
      const f = [...view.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter((el) => !el.disabled);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

export const weekdayOf = (ev) => ev.weekday || new Date(ev.start).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Asia/Kolkata' });
export const dateOf = (ev) => new Date(ev.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

/* the actions behind the painted buttons of a detail page: no visuals of their own */
export function saveTheDate(ev, couple) {
  const b = h('button', { type: 'button', 'aria-label': `Add ${ev.title} to your calendar` });
  const event = { title: `${ev.title} — ${couple}`, start: ev.start, end: ev.end, location: [ev.venue, ev.city].filter(Boolean).join(', '), details: (ev.tagline || []).join(' ') };
  b.addEventListener('click', () => {
    if (isApple()) { downloadIcs(event); toast('Calendar file downloaded — open it to add the date.'); }
    else { const w = window.open(googleCalendarHref(event), '_blank', 'noopener'); if (!w) { downloadIcs(event); toast('Calendar file downloaded — open it to add the date.'); } }
  });
  return b;
}
export function openMaps(ev) {
  const href = mapsHref({ venue: ev.venue, address: [ev.city], mapsUrl: ev.mapsUrl });
  if (!href) {
    const b = h('button', { type: 'button', 'aria-label': `${ev.title} map — venue not configured` });
    b.addEventListener('click', () => toast('The venue and its map link are not configured yet.'));
    return b;
  }
  return h('a', { href, target: '_blank', rel: 'noopener', 'aria-label': `Open the ${ev.title} venue in Google Maps` });
}
