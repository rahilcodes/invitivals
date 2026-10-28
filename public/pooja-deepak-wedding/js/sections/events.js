/* EventsSection — the days of celebration on one vertical gold line.
   Each event carries the family's own words (title, subtitle, verse, timings) exactly as written,
   a map and its own calendar entry; the line knows what is today. */
import { Heading, Icon, FloralVine } from '../decor.js';
import { $$, day, monthShort, weekdayShort, addToCalendar, dayState } from '../util.js';

const WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
const dayCount = (events) => new Set(events.map((e) => e.date.slice(0, 10))).size;

export const EventsSection = (cfg) => `
<section class="sec events" id="events" aria-labelledby="events-h">
  ${FloralVine({ side: 'r', top: '60px', height: '640px', crop: 0, depth: 0.05, cls: 'vine-soft' })}
  <div class="sec-inner">
    ${Heading('Wedding Festivities', `${dayCount(cfg.events) === 1 ? 'A day' : `${WORDS[dayCount(cfg.events)] || ''} days`} of rituals, music and blessings`.trim(), { id: 'events-h' })}
    <ol class="timeline">
      ${cfg.events.map((e, i) => `
        <li class="t-item ${e.main ? 'is-main' : ''}" data-reveal data-event="${i}">
          <span class="t-medal">${Icon(e.icon)}</span>
          <div class="t-body">
            <p class="t-date">${weekdayShort(e.date)} · ${day(e.date)} ${monthShort(e.date)}<b class="t-status" hidden></b></p>
            <h3 class="t-name">${e.main ? e.name.replace(/&/g, '<span class="amp-i">&amp;</span>') : e.name}</h3>
            ${e.subtitle ? `<p class="t-sub">${e.subtitle}</p>` : ''}
            ${e.lines?.length ? `<p class="t-verse">${e.lines.join('<br>')}</p>` : ''}
            ${e.details?.length ? `<dl class="t-details">${e.details.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
            ${e.note ? `<p class="t-text">${e.note}</p>` : ''}
            ${e.venue ? `<p class="t-venue">${e.venue}</p>` : ''}
            <p class="t-actions">
              ${e.maps ? `<a href="${e.maps}" target="_blank" rel="noopener">${Icon('pin', 'ico ico-xs')}Map</a>` : ''}
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
      title: `${e.name} · ${cfg.pair[0]} & ${cfg.pair[1]}`,
      start: e.date,
      details: [e.subtitle, ...(e.details || []).map(([k, v]) => `${k}: ${v}`)].filter(Boolean).join('. '),
      location: e.venue,
    });
  }));
}
