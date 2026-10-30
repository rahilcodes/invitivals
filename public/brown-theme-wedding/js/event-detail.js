/* EventDetail — pages 4 (Shaadi) and 5 (Reception): a full-screen view over
   the invitation with Back. The invitation keeps its scroll position and the
   music keeps playing; the browser's back button closes the view too. */
import { h, toast, downloadIcs, mapsHref, observePages } from './util.js';

let current = null;

export function openDetail(key, buildPage) {
  if (current) return;
  const scrollY = window.scrollY;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  history.pushState({ detail: key }, ''); // before the body is fixed, so the entry keeps the real scroll position
  const view = h('div', { class: 'detail', role: 'dialog', 'aria-modal': 'true', 'aria-label': `${key} details` });
  const back = h('button', { class: 'back', type: 'button' }, 'Back');
  const column = h('div', { class: 'column' }, buildPage());
  view.append(back, column);
  document.body.append(view);
  document.body.classList.add('locked');
  document.body.style.top = `-${scrollY}px`;
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  requestAnimationFrame(() => { view.classList.add('shown'); observePages(view); });
  back.focus({ preventScroll: true });
  current = { view, scrollY, popped: false };

  const close = () => {
    if (!current) return;
    const { view, scrollY } = current; current = null;
    view.classList.remove('shown');
    document.body.classList.remove('locked');
    document.body.style.position = ''; document.body.style.top = ''; document.body.style.width = '';
    window.scrollTo(0, scrollY);
    requestAnimationFrame(() => window.scrollTo(0, scrollY));
    setTimeout(() => view.remove(), 500);
  };
  back.addEventListener('click', () => history.back());
  window.addEventListener('popstate', function onPop() { window.removeEventListener('popstate', onPop); close(); });
  view.addEventListener('keydown', (e) => { if (e.key === 'Escape') history.back(); });
}

/* the two action buttons of a detail page */
export function saveTheDate(ev, art) {
  const b = h('button', { class: 'img-btn', type: 'button', 'aria-label': `Save the date — ${ev.title}` }, art);
  b.addEventListener('click', () => {
    downloadIcs({ title: `${ev.title} — Arjun & Aadhya`, start: ev.start, end: ev.end, location: [ev.venue, ...(ev.address || [])].filter(Boolean).join(', '), details: (ev.tagline || []).join(' ') });
    toast('Calendar file downloaded — open it to add the date.');
  });
  return b;
}
export function openMaps(ev, art) {
  const href = mapsHref(ev);
  if (!href) {
    const b = h('button', { class: 'img-btn', type: 'button', 'aria-label': `${ev.title} map — demo, no venue link yet` }, art);
    b.addEventListener('click', () => toast('Demo: the venue and its map link are not configured yet.'));
    return b;
  }
  return h('a', { class: 'img-btn', href, target: '_blank', rel: 'noopener', 'aria-label': `Open the ${ev.title} venue in Google Maps` }, art);
}
