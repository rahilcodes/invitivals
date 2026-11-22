/* EventsSection — the days of celebration on one vertical gold line, in the client's order.
   Each event shows its date, name, time and venue only. The functions are grouped by venue (the residence on
   10–12 December, the resort on 13–14 December; client, 2026-11-22): after the last event of each group one common
   card gives the venue, its address, Get Directions and one Google Calendar entry for the whole group. No map or
   calendar buttons sit under single events. The line knows what is today. */
import { Heading, Icon, FloralVine } from '../decor.js';
import { $$, day, monthShort, weekdayShort, dayState, groupCalUrl } from '../util.js';

const WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
const dayCount = (events) => new Set(events.map((e) => e.date.slice(0, 10))).size;

export const EventsSection = (cfg) => `
<section class="sec events" id="events" aria-labelledby="events-h">
  ${FloralVine({ side: 'r', top: '60px', height: '640px', crop: 0, depth: 0.05, cls: 'vine-soft' })}
  <div class="sec-inner">
    ${Heading('Wedding Festivities', `${WORDS[dayCount(cfg.events)] || ''} days of rituals, music and blessings`.trim(), { id: 'events-h' })}
    <ol class="timeline">
      ${cfg.events.map((e, i) => `${EventItem(cfg, e, i)}${commonAfter(cfg, i)}`).join('')}
    </ol>
  </div>
</section>`;


/* a place marked `common` gets one card right after the last event held there */
const commonAfter = (cfg, i) => {
  const p = cfg.events[i].place;
  if (!p.common || cfg.events.map((e) => e.place).lastIndexOf(p) !== i) return '';
  const held = cfg.events.filter((e) => e.place === p), first = held[0].date, last = held[held.length - 1].date;
  return `
        <li class="t-common" data-reveal>
          <div class="t-common-card">
            <span class="t-common-pin">${Icon('pin')}</span>
            <p class="t-date">${day(first)}–${day(last)} ${monthShort(last)} · All functions</p>
            <h3 class="t-common-name">${p.title || p.name}</h3>
            <p class="t-common-addr">${p.address.join('<br>')}</p>
            <div class="t-common-btns">
              <a class="btn t-common-btn" href="${p.maps}" target="_blank" rel="noopener" data-maps>${Icon('pin', 'ico ico-btn')}<span>Get Directions</span></a>
              <a class="btn btn-ghost t-common-btn" href="${groupCalUrl(cfg, p, held)}" target="_blank" rel="noopener" data-group-cal aria-label="Save the date: all ${held.length} functions of ${day(first)} to ${day(last)} ${monthShort(last)} in Google Calendar">${Icon('calendar', 'ico ico-btn')}<span>Save the Date</span></a>
            </div>
          </div>
        </li>`;
};

const EventItem = (cfg, e, i) => `
        <li class="t-item ${e.main ? 'is-main' : ''}" data-reveal data-event="${i}">
          <span class="t-medal">${Icon(e.icon)}</span>
          <div class="t-body">
            <p class="t-date">${weekdayShort(e.date)} · ${day(e.date)} ${monthShort(e.date)}<b class="t-status" hidden></b></p>
            <h3 class="t-name">${e.name.replace(/&/g, '<span class="amp-i">&amp;</span>')}</h3>
            ${e.subtitle ? `<p class="t-sub">${e.subtitle}</p>` : ''}
            <dl class="t-details"><div><dt>Time</dt><dd>${e.time}</dd></div></dl>
            ${e.note ? `<p class="t-text">${e.note}</p>` : ''}
            <p class="t-venue">${e.place.name}</p>
          </div>
        </li>`;

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
