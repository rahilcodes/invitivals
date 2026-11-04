/* EventDetail — the three days: a full-screen view over the invitation with Back. The invitation keeps
   its scroll position and the music keeps playing; the browser's back button closes the view too. */
import { h, mapsHref, observePages } from './util.js';

let current = null;

export function openDetail(key, plate, buildPage) {
  if (current) return;
  const scrollY = window.scrollY;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  history.pushState({ detail: key }, ''); // before the body is fixed, so the entry keeps the real scroll position
  const view = h('div', { class: 'detail', role: 'dialog', 'aria-modal': 'true', 'aria-label': `${key} details` });
  const back = h('button', { class: 'back', type: 'button' }, 'Back');
  const column = h('div', { class: 'column' }, buildPage());
  // on screens taller than the artwork, its own colours continue behind it
  view.append(h('div', { class: 'detail-bg', style: { backgroundImage: `url(assets/plate${plate}.webp)` }, 'aria-hidden': 'true' }), back, column);
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

/* the two action buttons of a detail page: Save the Date opens the calendar sheet, the other opens Maps */
export function saveTheDate(day, art, sheet) {
  const b = h('button', { class: 'img-btn', type: 'button', 'aria-label': `Save the date: ${day.title}`, 'aria-haspopup': 'dialog' }, art);
  b.addEventListener('click', () => sheet.open(day, b));
  return b;
}
export function openMaps(day, art) {
  return h('a', { class: 'img-btn', href: mapsHref(day), target: '_blank', rel: 'noopener', 'aria-label': `Open the ${day.venue} venue in Google Maps` }, art);
}
