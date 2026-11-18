/* EventsSection — the five functions on one vertical gold line, under their two days.
   Aditi & Harsh (client, 2026-11-18): each function shows its name, date and time only — no description, no venue
   (the venue has its own section) — and two calendar links: Google Calendar with the function filled in, and the
   .ics file Apple Calendar and Outlook open. No end time was supplied, so none is written. The line knows what is today. */
import { Heading, Icon, FloralVine } from '../decor.js';
import { $$, day, month, year, monthShort, weekday, weekdayShort, googleCalendarHref, dayState } from '../util.js';

const WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
export const eventCalendar = (cfg, e) => ({ title: `${e.name} — ${cfg.pair[0]} & ${cfg.pair[1]}`, start: e.date, location: `${cfg.venue}, ${cfg.venueAddress}`, details: cfg.mapsUrl });

export const EventsSection = (cfg) => {
  let last = '', n = 0;
  return `
<section class="sec events" id="events" aria-labelledby="events-h">
  ${FloralVine({ side: 'r', top: '60px', height: '640px', crop: 0, depth: 0.05, cls: 'vine-soft' })}
  <div class="sec-inner">
    ${Heading(cfg.eventsHeading || 'Wedding Festivities', cfg.eventsSub || '', { id: 'events-h' })}
    <ol class="timeline">
      ${cfg.events.map((e, i) => {
        const key = e.date.slice(0, 10), head = key !== last ? `
        <li class="t-day" data-reveal><span>Day ${WORDS[++n]}</span><b>${weekday(e.date)}, ${day(e.date)} ${month(e.date)} ${year(e.date)}</b></li>` : '';
        last = key;
        return `${head}
        <li class="t-item ${e.main ? 'is-main' : ''}" data-reveal data-event="${i}">
          <span class="t-medal">${Icon(e.icon)}</span>
          <div class="t-body">
            <p class="t-date">${weekdayShort(e.date)} · ${day(e.date)} ${monthShort(e.date)}<b class="t-status" hidden></b></p>
            <h3 class="t-name">${e.name.replace(/&/g, '<span class="amp-i">&amp;</span>')}</h3>
            <p class="t-time">${e.time}</p>
            <p class="t-actions">
              <a href="${googleCalendarHref(eventCalendar(cfg, e))}" target="_blank" rel="noopener" data-gcal="${i}" aria-label="Add ${e.name} to Google Calendar">${Icon('calendar', 'ico ico-xs')}Google Calendar</a>
              <a href="${e.ics}" download="${e.ics}" data-ics="${i}" aria-label="Add ${e.name} to Apple Calendar or Outlook">${Icon('calendar', 'ico ico-xs')}Apple / Outlook</a>
            </p>
          </div>
        </li>`; }).join('')}
    </ol>
  </div>
</section>`; };

export function initEvents(cfg) {
  let next = false;
  $$('.t-item').forEach((li) => {
    const e = cfg.events[+li.dataset.event];
    const st = dayState(e.date), badge = li.querySelector('.t-status');
    if (st === 'past') { li.classList.add('is-past'); badge.textContent = 'Completed'; badge.hidden = false; }
    if (st === 'today') { li.classList.add('is-today'); badge.textContent = 'Today'; badge.hidden = false; next = true; }
    if (st === 'future' && !next) { li.classList.add('is-next'); badge.textContent = 'Up next'; badge.hidden = false; next = true; }
  });
}
