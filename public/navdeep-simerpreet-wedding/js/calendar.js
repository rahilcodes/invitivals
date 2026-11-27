import { couple, toast } from './util.js';
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
const whenLine = (ev) => new Date(ev.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }) + (ev.time ? ' · ' + ev.time : '');
const attr = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export const eventDetails = (cfg, ev) => ({
  title: `${ev.name} – ${couple(cfg).join(' & ')}`,   // the client's calendar title, e.g. Jago Night – Navdeep Singh Kahlon & Simerpreet Brar
  start: ev.date,
  end: ev.main && cfg.weddingEnd ? cfg.weddingEnd : ev.date,   // only start times were supplied: no invented end (Google Calendar gets start = end)
  /* a short description: whose wedding, the Gurmukhi name of the venue, its map, the invitation's address */
  details: [`${ev.name} · the wedding of ${cfg.groomName} & ${cfg.brideName}.`, ev.subtitle, ev.note, ev.etiquette,
    ev.dressCode ? `${ev.dressCode.label}: ${ev.dressCode.text}` : '', ev.allDay ? 'Time to be announced.' : '', ev.venueLocal || '',
    ev.maps ? `Map: ${ev.maps}` : '', location.origin + location.pathname].filter(Boolean).join('\n'),
  location: ev.cal || [ev.venue, ev.address].filter(Boolean).join(', '),   // the client's calendar place line
  allDay: !!ev.allDay,
});

/* one event */
export const CalendarLink = (cfg, ev, { label = 'Add to Calendar', cls = 'btn-ghost btn-sm', small = false } = {}) => {
  const d = eventDetails(cfg, ev);
  return `<a class="${small ? '' : `btn ${cls}`}" href="assets/cal/${ev.id}.ics" data-cal="event"
     data-title="${attr(d.title)}" data-name="${attr(ev.name)}" data-when="${attr(whenLine(ev))}" data-start="${d.start}" data-end="${d.end}" data-details="${attr(d.details)}" data-location="${attr(d.location)}"${d.allDay ? ' data-allday="1"' : ''}>${Icon('calendar', small ? 'ico ico-xs' : 'ico ico-btn')}${small ? label : `<span>${label}</span>`}</a>`;
};

/* the whole programme */
export const CalendarAllLink = (cfg, { label = 'Add All to Calendar', cls = 'btn-ghost btn-sm', small = false } = {}) =>
  `<a class="${small ? '' : `btn ${cls}`}" href="${cfg.allIcs || 'assets/cal/all.ics'}" data-cal="all">${Icon('calendar', small ? 'ico ico-xs' : 'ico ico-btn')}${small ? label : `<span>${label}</span>`}</a>`;

/* Each event's "Add to Calendar" offers both ways, on every device (the guest chooses; no device is assumed):
     · Google Calendar, filled in (Android app or the web; through Google's sign-in address on other devices, so a
       guest who is not signed in does not lose the event)
     · the event's own .ics file — Apple Calendar (iPhone, iPad, Mac), Outlook and every other calendar app
   Without JavaScript the button is simply the .ics file. "Add All to Calendar" keeps its own sheet (cal-all.js). */
let sheet = null;
export function enhanceCalendarLinks() {
  if (sheet) return;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  sheet = document.createElement('div');
  sheet.className = 'sheet cal-sheet cal-one'; sheet.hidden = true;
  sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-labelledby', 'cal-one-h');
  sheet.innerHTML = `
    <div class="sheet-card cal-card">
      <p class="eyebrow">Add to Calendar</p>
      <h3 class="cal-one-name" id="cal-one-h"></h3>
      <p class="cal-one-when"></p>
      <a class="btn btn-primary cal-one-google" href="#" target="_blank" rel="noopener">${Icon('calendar', 'ico ico-btn')}<span>Google Calendar</span></a>
      <a class="btn btn-ghost cal-one-file" href="#">${Icon('calendar', 'ico ico-btn')}<span>Apple Calendar · Outlook · Others</span></a>
      <p class="cal-hint">The calendar file opens in Apple Calendar on iPhone, iPad and Mac, and in Outlook or any other calendar app.</p>
      <button type="button" class="sheet-close" aria-label="Close">×</button>
    </div>`;
  document.body.appendChild(sheet);
  const q = (s) => sheet.querySelector(s);
  let last = null;
  const close = () => { sheet.classList.remove('is-on'); setTimeout(() => { sheet.hidden = true; }, 350); last?.focus?.({ preventScroll: true }); };
  sheet.addEventListener('click', (e) => { if (e.target === sheet) close(); });
  q('.sheet-close').addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) close(); });
  q('.cal-one-google').addEventListener('click', (e) => {
    const a = e.currentTarget;
    if (/Android/i.test(ua)) return;                       // the plain link: the Google Calendar app takes it
    e.preventDefault();
    const url = 'https://accounts.google.com/ServiceLogin?' + new URLSearchParams({ service: 'cl', continue: a.dataset.url });
    let w = null; try { w = window.open(url, '_blank'); } catch { /* blocked */ }
    if (w) { try { w.opener = null; } catch { /* cross-origin */ } } else { location.href = url; }
  });
  q('.cal-one-google').addEventListener('click', () => toast('Google Calendar is opening — press Save there', 4200));
  q('.cal-one-file').addEventListener('click', () => toast(iOS ? 'Opening your calendar — choose “Add”' : 'Calendar file saved — open it to add the event', 4200));

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-cal="event"]');
    if (!a || sheet.contains(a)) return;
    e.preventDefault();
    const u = new URL('https://calendar.google.com/calendar/render');
    u.search = new URLSearchParams({
      action: 'TEMPLATE', text: a.dataset.title, dates: googleDates(a.dataset.start, a.dataset.end, !!a.dataset.allday),
      details: a.dataset.details, location: a.dataset.location, ctz: 'Asia/Kolkata',
    });
    const g = q('.cal-one-google'), f = q('.cal-one-file');
    g.href = u.toString(); g.dataset.url = u.toString();
    f.href = a.getAttribute('href');
    if (iOS) f.removeAttribute('download'); else f.setAttribute('download', a.getAttribute('href').split('/').pop());
    q('.cal-one-name').textContent = a.dataset.name;
    q('.cal-one-when').textContent = a.dataset.when;
    last = a;
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add('is-on'));
    g.focus({ preventScroll: true });
  }, true);
}
