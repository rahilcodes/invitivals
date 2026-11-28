/* EventsSection — the four ceremonies on one vertical gold line (gangesh-swejal-wedding).
   Each is its own card with a motif of its own (diamond rings · haldi marigolds · ritual kalasha · wedding garland),
   the date and time, and two full-width buttons: View on Google Maps (the ceremony's own link, as supplied) and
   Add to Calendar (Google Calendar, filled in), with the ceremony's .ics file beneath for Apple / Outlook. */
import { Heading, Icon, FloralVine, Kalasha, GoldDivider } from '../decor.js';
import { $$, day, month, year, weekday, dayState, ceremonyCalendar, googleCalendarUrl, esc } from '../util.js';

const WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
const dayCount = (events) => new Set(events.map((e) => e.date.slice(0, 10))).size;

/* a small motif over each card's name */
const MOTIF = {
  ring: `<svg class="ev-motif m-ring" viewBox="0 0 120 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="50" cy="25" r="12"/><circle cx="70" cy="25" r="12"/></g><path d="M45 9l5-6 5 6-5 4.5z" fill="#fffaf0" stroke="currentColor" stroke-width="1.2"/><g fill="currentColor"><path d="M20 22l1.4 3.6 3.6 1.4-3.6 1.4L20 32l-1.4-3.6-3.6-1.4 3.6-1.4z"/><path d="M100 22l1.4 3.6 3.6 1.4-3.6 1.4L100 32l-1.4-3.6-3.6-1.4 3.6-1.4z"/><circle cx="8" cy="27" r="1.4"/><circle cx="112" cy="27" r="1.4"/></g></svg>`,
  haldi: `<svg class="ev-motif m-haldi" viewBox="0 0 120 40" aria-hidden="true"><path d="M6 22h108" stroke="#d9a520" stroke-width="1" stroke-dasharray="1 5" stroke-linecap="round"/>${[22, 42, 60, 78, 98].map((x, i) => `<g transform="translate(${x} ${i === 2 ? 20 : 22})"><circle r="${i === 2 ? 9 : 6.5}" fill="#f2b320"/><circle r="${i === 2 ? 5.5 : 4}" fill="#f7c948"/><circle r="${i === 2 ? 2.2 : 1.6}" fill="#c98a0a"/></g>`).join('')}</svg>`,
  rituals: null,   // the kalasha (below)
  wedding: null,   // the lotus divider (below)
};

export const EventsSection = (cfg) => `
<section class="sec events" id="events" aria-labelledby="events-h">
  ${FloralVine({ side: 'r', top: '60px', height: '640px', crop: 0, depth: 0.05, cls: 'vine-soft' })}
  <div class="sec-inner">
    ${Heading('Wedding Festivities', `${WORDS[dayCount(cfg.events)] || ''} days of rituals, joy and blessings`.trim(), { id: 'events-h' })}
    <ol class="timeline">
      ${cfg.events.map((e, i) => {
        const cal = ceremonyCalendar(cfg, e);
        return `
        <li class="t-item ev-${e.theme} ${e.main ? 'is-main' : ''}" id="${e.id}" data-reveal data-event="${i}">
          <span class="t-medal">${Icon(e.icon)}</span>
          <div class="t-body ev-card">
            <div class="ev-top">${e.theme === 'rituals' ? Kalasha() : e.theme === 'wedding' ? GoldDivider('lotus', 'ev-div') : MOTIF[e.theme]}</div>
            <h3 class="t-name">${esc(e.name)}</h3>
            <p class="ev-when"><span>${weekday(e.date)}</span><b>${day(e.date)} ${month(e.date)} ${year(e.date)}</b></p>
            <p class="ev-time">${esc(e.time)}<b class="t-status" hidden></b></p>
            <div class="ev-btns">
              <a class="btn" href="${esc(e.maps)}" target="_blank" rel="noopener" data-map>${Icon('pin', 'ico ico-btn')}<span>View on Google Maps</span></a>
              <a class="btn btn-ghost" href="${esc(googleCalendarUrl(cal))}" target="_blank" rel="noopener" data-gcal="${i}">${Icon('calendar', 'ico ico-btn')}<span>Add to Calendar</span></a>
            </div>
            <a class="ev-ics" href="assets/cal/${e.id}.ics" download="${e.id}.ics">Apple / Outlook calendar (.ics)</a>
          </div>
        </li>`;
      }).join('')}
    </ol>
  </div>
</section>`;

export function initEvents(cfg) {
  let next = false;
  $$('.t-item').forEach((li) => {
    const e = cfg.events[+li.dataset.event];
    const st = dayState(e.date), badge = li.querySelector('.t-status');
    if (st === 'past') { li.classList.add('is-past'); badge.textContent = 'Completed'; badge.hidden = false; }
    if (st === 'today') { li.classList.add('is-today'); badge.textContent = 'Today'; badge.hidden = false; next = true; }
    if (st === 'future' && !next) { li.classList.add('is-next'); badge.textContent = 'Up next'; badge.hidden = false; next = true; }
  });
  /* the links carry this page's own address in their description now that it is known */
  $$('[data-gcal]').forEach((a) => { a.href = googleCalendarUrl(ceremonyCalendar(cfg, cfg.events[+a.dataset.gcal])); });
}
