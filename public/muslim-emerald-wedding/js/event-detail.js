/* EventDetail — the four function pages (6–9) as a full-screen view over the
   invitation. The page beneath keeps its scroll position and the music keeps
   playing; Back, Escape and the browser's back button all close it and return
   focus to the card that opened it. */
import { h, toast, downloadIcs, mapsHref, observePages } from './util.js';

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

/* the action buttons of a detail page */
export function saveTheDate(ev, couple, { small = false } = {}) {
  const b = h('button', { class: `pill outline ${small ? 'small' : ''}`, type: 'button', 'aria-label': `Add ${ev.title} to your calendar` },
    h('i', { class: 'ico', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>' }),
    h('span', {}, 'Add to Calendar'));
  b.addEventListener('click', () => {
    downloadIcs({ title: `${ev.title} — ${couple}`, start: ev.start, end: ev.end, location: [ev.venue, ev.city].filter(Boolean).join(', '), details: (ev.tagline || []).join(' ') });
    toast('Calendar file downloaded — open it to add the date.');
  });
  return b;
}
export function openMaps(ev, { small = false } = {}) {
  const inner = [h('i', { class: 'ico', html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>' }), h('span', {}, 'View on Map')];
  const href = mapsHref({ venue: ev.venue, address: [ev.city], mapsUrl: ev.mapsUrl });
  if (!href) {
    const b = h('button', { class: `pill solid ${small ? 'small' : ''}`, type: 'button', 'aria-label': `${ev.title} map — venue not configured` }, ...inner);
    b.addEventListener('click', () => toast('The venue and its map link are not configured yet.'));
    return b;
  }
  return h('a', { class: `pill solid ${small ? 'small' : ''}`, href, target: '_blank', rel: 'noopener', 'aria-label': `Open the ${ev.title} venue in Google Maps` }, ...inner);
}
