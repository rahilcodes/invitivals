/* "Add All to Calendar" that really adds the events, whatever the guest's phone.

   The button used to hand over one calendar file and nothing more. That works on an iPhone (Safari opens the file
   as "Add All") but not on most Android phones: Google Calendar there cannot take in a file of several events, so the
   file was downloaded and nothing reached the calendar.

   Now the button opens a small sheet with both ways:
     · one file with every event — Apple Calendar, Outlook and Samsung Calendar add them all from it;
     · each event as its own Google Calendar link, filled in, for Google Calendar on Android and the web.
   Every tap says what happened. */
import { Khanda, Icon } from './decor.js';
import { $, esc, toast, day, monthShort, weekdayShort } from './util.js';
import { eventDetails } from './calendar.js';
import { openWhatsApp as openInNewTab } from './links.js';

const stamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function initCalendarAll(cfg) {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const n = cfg.events.length;
  const file = cfg.allIcs;
  const google = (ev) => {
    const d = eventDetails(cfg, ev);
    const u = new URL('https://calendar.google.com/calendar/render');
    u.search = new URLSearchParams({
      action: 'TEMPLATE', text: d.title, dates: `${stamp(d.start)}/${stamp(d.end)}`, ctz: 'Asia/Kolkata',
      location: d.location, details: [d.details, ev.maps ? `Map: ${ev.maps}` : ''].filter(Boolean).join('\n'),
    });
    return u.toString();
  };

  const sheet = document.createElement('div');
  sheet.className = 'sheet cal-sheet'; sheet.hidden = true;
  sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-label', `Add all ${n} events to your calendar`);
  sheet.innerHTML = `
    <div class="sheet-card cal-card">
      ${Khanda()}
      <p class="eyebrow">Add all ${n} events</p>
      <a class="btn btn-primary cal-file" href="${file}"${iOS ? '' : ` download="${file.split('/').pop()}"`}>${Icon('calendar', 'ico ico-btn')}<span>All ${n} events · one file</span></a>
      <p class="cal-hint">For Apple Calendar, Outlook and Samsung Calendar: open the file and choose <b>Add All</b>.</p>
      <p class="cal-or"><i></i><span>Google Calendar · add each event</span><i></i></p>
      <ol class="cal-list">
        ${cfg.events.map((ev, i) => `
        <li>
          <span class="cal-when">${weekdayShort(ev.date)} ${day(ev.date)} ${monthShort(ev.date)} · ${esc(ev.time)}</span>
          <span class="cal-name">${esc(ev.name)}</span>
          <a class="cal-add" href="${esc(google(ev))}" data-i="${i}" rel="noopener" aria-label="Add ${esc(ev.name)} to Google Calendar">Add</a>
        </li>`).join('')}
      </ol>
      <button type="button" class="sheet-close" aria-label="Close">×</button>
    </div>`;
  document.body.appendChild(sheet);

  let lastFocus = null;
  const open = () => {
    lastFocus = document.activeElement;
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add('is-on'));
    $('.cal-file', sheet).focus({ preventScroll: true });
  };
  const close = () => {
    sheet.classList.remove('is-on');
    setTimeout(() => { sheet.hidden = true; }, 350);
    lastFocus?.focus?.({ preventScroll: true });
  };
  sheet.addEventListener('click', (e) => { if (e.target === sheet) close(); });
  $('.sheet-close', sheet).addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) close(); });

  /* the one file: an iPhone opens it in Calendar, everything else saves it */
  $('.cal-file', sheet).addEventListener('click', () => {
    toast(iOS ? `Opening your calendar with all ${n} events — choose “Add All”` : `Calendar file saved — open it to add all ${n} events`, 5200);
  });
  /* each event in Google Calendar, filled in; the row is ticked so the guest can see which are done */
  sheet.addEventListener('click', (e) => {
    const a = e.target.closest('.cal-add');
    if (!a) return;
    e.preventDefault();
    /* a guest not signed in to Google is sent by the plain event link to Google's product page and loses the event,
       so the link goes through Google's own sign-in address (signed in, it passes straight through). On Android the
       plain link is used: the Google Calendar app takes it. */
    const viaSignIn = 'https://accounts.google.com/ServiceLogin?' + new URLSearchParams({ service: 'cl', continue: a.href });
    openInNewTab(/Android/i.test(ua) ? a.href : viaSignIn);
    a.classList.add('is-done'); a.textContent = 'Opened ✓';
    toast(`${cfg.events[+a.dataset.i].name}: Google Calendar is opening — press Save there`, 4200);
  });

  /* every "Add All to Calendar" on the page (the programme card, the menu) opens the sheet */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-cal="all"]');
    if (!a || sheet.contains(a)) return;
    e.preventDefault();
    open();
  }, true);
}
