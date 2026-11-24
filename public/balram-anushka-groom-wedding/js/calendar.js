import { couple } from './util.js';
/* Calendar links that behave on every device.
   Rendered as plain links to the real .ics files (written by tools/sikh-finish.mjs),
   so they work with no JavaScript at all. Once the page is live, each link is
   tuned to the visitor's device:
     iPhone / iPad  → the .ics as is: Safari opens it straight into Calendar
     Android, desktop, single event → Google Calendar, pre-filled, in a new tab
     Android, desktop, whole programme → the .ics as a download */
import { Icon } from './decor.js';

const stamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const attr = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export const eventDetails = (cfg, ev) => ({
  title: `${ev.name}${ev.subtitle ? ' – ' + ev.subtitle : ''} — ${couple(cfg, true).join(' & ')}`,
  start: ev.date,
  end: ev.main && cfg.weddingEnd ? cfg.weddingEnd : ev.date,   // only start times were supplied: no invented end (Google Calendar gets start = end)
  /* a short description: whose wedding, from whom, the map */
  details: [`The wedding of ${cfg.groomName} & ${cfg.brideName}, with love from Nagra Family.`, ev.note, ev.etiquette,
    ev.maps ? `Map: ${ev.maps}` : ''].filter(Boolean).join('\n'),
  location: [ev.venue, ev.address].filter(Boolean).join(", "),
});

/* one event */
export const CalendarLink = (cfg, ev, { label = 'Add to Calendar', cls = 'btn-ghost btn-sm', small = false } = {}) => {
  const d = eventDetails(cfg, ev);
  return `<a class="${small ? '' : `btn ${cls}`}" href="assets/cal/${ev.id}.ics" data-cal="event"
     data-title="${attr(d.title)}" data-start="${d.start}" data-end="${d.end}" data-details="${attr(d.details)}" data-location="${attr(d.location)}">${Icon('calendar', small ? 'ico ico-xs' : 'ico ico-btn')}${small ? label : `<span>${label}</span>`}</a>`;
};

/* the whole programme */
export const CalendarAllLink = (cfg, { label = 'Add All to Calendar', cls = 'btn-ghost btn-sm', small = false } = {}) =>
  `<a class="${small ? '' : `btn ${cls}`}" href="${cfg.allIcs || 'assets/cal/all.ics'}" data-cal="all">${Icon('calendar', small ? 'ico ico-xs' : 'ico ico-btn')}${small ? label : `<span>${label}</span>`}</a>`;

export function enhanceCalendarLinks(root = document) {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (iOS) return; // Safari turns the .ics straight into a Calendar sheet
  for (const a of root.querySelectorAll('a[data-cal]')) {
    if (a.dataset.cal === 'all') { a.setAttribute('download', ''); continue; }
    const u = new URL('https://calendar.google.com/calendar/render');
    u.search = new URLSearchParams({
      action: 'TEMPLATE', text: a.dataset.title, dates: `${stamp(a.dataset.start)}/${stamp(a.dataset.end)}`,
      details: a.dataset.details, location: a.dataset.location, ctz: 'Asia/Kolkata',
    });
    a.href = u.toString(); a.target = '_blank'; a.rel = 'noopener';
  }
}
