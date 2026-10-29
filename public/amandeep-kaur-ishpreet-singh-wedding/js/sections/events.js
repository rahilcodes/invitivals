/* ScheduleSection — "The Celebrations": the whole programme as a
   gold-threaded timeline card, with every event added to the calendar in one
   tap. EventsSection — each festivity as a premium detail card: a day chip,
   art rising out of the card's top edge (dhol, horse), a scene header for the
   Anand Karaj, a gold medallion for the lunch; name, detail rows, etiquette,
   map and calendar.

   Calendar actions are plain links to real .ics files (written by
   tools/sikh-finish.mjs): iPhone opens them straight into Calendar, Android
   and desktop download them. */
import { KhandaMark, Dhol, Horse, Icon, DetailRow, Button, RestingPetals, Heading } from '../decor.js';
import { day, weekday, weekdayShort, month, monthShort, year, esc } from '../util.js';
import { CalendarLink, CalendarAllLink } from '../calendar.js';

export const ordinal = (n) => n + (['th', 'st', 'nd', 'rd'][(n % 100 > 10 && n % 100 < 14) ? 0 : Math.min(n % 10, 4) % 4] || 'th');
const dateLine = (iso) => `${weekday(iso)}, ${ordinal(+day(iso))} ${month(iso)} ${year(iso)}`;
const dayKey = (iso) => day(iso) + month(iso);
const dayIndex = (cfg, ev) => [...new Set(cfg.events.map((e) => dayKey(e.date)))].indexOf(dayKey(ev.date)) + 1;

/* ── the programme at a glance ─────────────────────────────── */
export const ScheduleSection = (cfg) => {
  const days = [];
  for (const ev of cfg.events) {
    const key = dayKey(ev.date);
    let d = days.find((x) => x.key === key);
    if (!d) { d = { key, iso: ev.date, items: [] }; days.push(d); }
    d.items.push(ev);
  }
  const sub = days.length > 1 ? `${days.length === 2 ? 'Two' : days.length} days of joy, one blessed union` : 'One blessed day';
  return `
<section class="section schedule" id="schedule">
  ${RestingPetals(12)}
  ${Heading('The Celebrations', cfg.schedule?.sub ?? sub)}
  ${cfg.schedule?.art === 'dhol' ? `<div class="schedule-art" data-reveal>${Dhol()}</div>` : ''}
  <div class="card card-timeline" data-reveal>
    ${days.map((d, i) => `
      <div class="tl-day">
        <div class="tl-badge"><b>${day(d.iso)}</b><span>${monthShort(d.iso)}</span><em>${weekdayShort(d.iso)}</em></div>
        <ol class="tl-list" aria-label="Day ${i + 1}">
          ${d.items.map((ev) => `
            <li class="tl-item ${ev.main ? 'is-main' : ''}">
              <a href="#${ev.id}"><i></i><span class="tl-time">${esc(ev.time)}</span><span class="tl-name">${esc(ev.name)}</span><span class="tl-venue">${esc(ev.venue)}</span></a>
            </li>`).join('')}
        </ol>
      </div>`).join('')}
    <div class="tl-actions">${CalendarAllLink(cfg)}</div>
  </div>
</section>`;
};

/* ── the detail cards ──────────────────────────────────────── */
const art = (ev) => {
  if (ev.image) return `
    <div class="card-scene"><img src="${ev.image}" alt="${esc(ev.imageAlt || '')}" width="900" height="600" loading="lazy" decoding="async"></div>`;
  if (ev.art === 'dhol') return `<div class="card-art">${Dhol()}</div>`;
  if (ev.art === 'horse') return `<div class="card-art card-art-wide">${Horse()}</div>`;
  if (ev.art === 'gurudwara') return `
    <div class="card-scene"><img src="assets/anand-karaj.webp" alt="The Gurudwara across the sarovar at golden hour" width="900" height="593" loading="lazy" decoding="async"></div>`;
  return `<div class="card-medal">${Icon(ev.icon || 'hall', 'ico ico-medal')}</div>`;
};

const EventCard = (cfg, ev, i) => `
<section class="section event ${ev.main ? 'is-main' : ''} art-${ev.art}" id="${ev.id}" aria-labelledby="${ev.id}-h">
  ${RestingPetals(3 + i)}
  <div class="card card-event" data-reveal>
    ${art(ev)}
    <div class="card-body">
      ${cfg.dayChips === false ? '' : `<span class="day-chip">Day ${dayIndex(cfg, ev)} · ${weekday(ev.date)}</span>`}
      ${KhandaMark('card-mark')}
      <h3 class="event-name" id="${ev.id}-h">${esc(ev.name)}</h3>
      <p class="event-sub">${esc(ev.subtitle)}</p>
      <div class="details">
        ${DetailRow('calendar', dateLine(ev.date))}
        ${DetailRow('clock', esc(ev.time))}
        ${DetailRow('pin', esc(ev.venue), esc(ev.address))}
      </div>
      ${ev.note ? `<p class="event-note">${esc(ev.note)}</p>` : ''}
      ${ev.etiquette ? `<p class="etiquette">${Icon('faith', 'ico ico-xs')}<span>${esc(ev.etiquette)}</span></p>` : ''}
      <div class="event-actions">
        ${Button({ label: 'View on Map', icon: 'pin', href: ev.maps, cls: 'btn-primary' })}
        ${CalendarLink(cfg, ev)}
      </div>
    </div>
  </div>
</section>`;

export const EventsSection = (cfg) => cfg.events.map((ev, i) => EventCard(cfg, ev, i)).join('');
