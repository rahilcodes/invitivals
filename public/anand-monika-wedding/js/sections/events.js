/* EventsSection — the days of celebration on one vertical gold line.
   Each event carries its dress code, a map and its own calendar entry; the line knows what is today. */
import { Heading, Icon, FloralVine } from '../decor.js';
import { $$, day, monthShort, weekdayShort, addToCalendar, dayState } from '../util.js';

const WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
const dayCount = (events) => new Set(events.map((e) => e.date.slice(0, 10))).size;

export const EventsSection = (cfg) => `
<section class="sec events" id="events" aria-labelledby="events-h">
  ${FloralVine({ side: 'r', top: '60px', height: '640px', crop: 0, depth: 0.05, cls: 'vine-soft' })}
  <div class="sec-inner">
    ${Heading('Wedding Festivities', `${WORDS[dayCount(cfg.events)] || ''} days of rituals, music and blessings`.trim(), { id: 'events-h' })}
    <ol class="timeline">
      ${cfg.events.map((e, i) => `
        <li class="t-item ${e.main ? 'is-main' : ''}" data-reveal data-event="${i}">
          <span class="t-medal">${Icon(e.icon)}</span>
          <div class="t-body">
            <p class="t-date">${[weekdayShort(e.date), `${day(e.date)} ${monthShort(e.date)}`, e.time].filter(Boolean).join(' · ')}<b class="t-status" hidden></b></p>
            <h3 class="t-name">${e.name}</h3>
            ${e.venue ? `<p class="t-venue">${e.venue}</p>` : ''}
            <p class="t-text">${e.text}</p>
            ${e.dress ? `<p class="t-dress"><span>Attire</span>${e.dress}</p>` : ''}
            <p class="t-actions">
              ${e.venue ? `<a href="${e.maps || cfg.mapsUrl}" target="_blank" rel="noopener">${Icon('pin', 'ico ico-xs')}Map</a>` : ''}
              <button type="button" data-cal="${i}">${Icon('calendar', 'ico ico-xs')}Remind me</button>
              ${e.main ? '<a href="#ceremony">The ceremony ↓</a>' : ''}
            </p>
          </div>
        </li>`).join('')}
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
  $$('[data-cal]').forEach((b) => b.addEventListener('click', () => {
    const e = cfg.events[+b.dataset.cal];
    addToCalendar({
      title: `${e.name} · ${cfg.groomName} & ${cfg.brideName}`,
      start: e.date, allDay: !e.time, details: `${e.text}${e.dress ? ` Attire: ${e.dress}.` : ''}`, location: e.venue || cfg.venueCity,
    });
  }));
}
