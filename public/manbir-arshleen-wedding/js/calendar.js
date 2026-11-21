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
/* Google Calendar dates: an all-day event (no time supplied) is the day itself, YYYYMMDD/next day */
export const googleDates = (start, end, allDay) => {
  if (!allDay) return `${stamp(start)}/${stamp(end)}`;
  const d = start.slice(0, 10), n = new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10) + 1)).toISOString().slice(0, 10);
  return `${d.replace(/-/g, '')}/${n.replace(/-/g, '')}`;
};
const attr = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export const eventDetails = (cfg, ev) => ({
  title: `${ev.name} — ${couple(cfg, true).join(' & ')}`,
  start: ev.date,
  end: ev.main && cfg.weddingEnd ? cfg.weddingEnd : ev.date,   // only start times were supplied: no invented end (Google Calendar gets start = end)
  /* a short description: whose wedding, the Gurmukhi name of the venue, its map, the invitation's address */
  details: [`${ev.name} · the wedding of ${cfg.groomName} & ${cfg.brideName}.`, ev.subtitle, ev.note, ev.etiquette,
    ev.dressCode ? `${ev.dressCode.label}: ${ev.dressCode.text}` : '', ev.allDay ? 'Time to be announced.' : '', ev.venueLocal || '',
    ev.maps ? `Map: ${ev.maps}` : '', location.origin + location.pathname].filter(Boolean).join('\n'),
  location: [ev.venue, ev.address].filter(Boolean).join(', '),
  allDay: !!ev.allDay,
});

/* one event */
export const CalendarLink = (cfg, ev, { label = 'Add to Calendar', cls = 'btn-ghost btn-sm', small = false } = {}) => {
  const d = eventDetails(cfg, ev);
  return `<a class="${small ? '' : `btn ${cls}`}" href="assets/cal/${ev.id}.ics" data-cal="event"
     data-title="${attr(d.title)}" data-start="${d.start}" data-end="${d.end}" data-details="${attr(d.details)}" data-location="${attr(d.location)}"${d.allDay ? ' data-allday="1"' : ''}>${Icon('calendar', small ? 'ico ico-xs' : 'ico ico-btn')}${small ? label : `<span>${label}</span>`}</a>`;
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
      action: 'TEMPLATE', text: a.dataset.title, dates: googleDates(a.dataset.start, a.dataset.end, !!a.dataset.allday),
      details: a.dataset.details, location: a.dataset.location, ctz: 'Asia/Kolkata',
    });
    a.href = u.toString(); a.target = '_blank'; a.rel = 'noopener';
  }
}
