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
const isoDay = (iso) => iso.slice(0, 10);
/* where the venue has a Gurmukhi name too, it stands under the English one */
const venueSub = (ev) => [ev.address ? esc(ev.address) : '', ev.venueLocal ? `<span class="venue-local" lang="pa">${esc(ev.venueLocal)}</span>` : ''].filter(Boolean).join('');
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
              <a href="#${ev.id}"><i></i>${ev.time ? `<span class="tl-time">${esc(ev.time)}</span>` : ''}<span class="tl-name">${esc(ev.name)}</span>${ev.venue ? `<span class="tl-venue">${esc(ev.venue)}</span>` : ''}${ev.dressCode ? `<span class="tl-dress"><b aria-hidden="true">${ev.dressCode.swatches.map((c) => `<em style="--sw:${c}"></em>`).join('')}</b>${esc(ev.dressCode.label)}: ${esc(ev.dressCode.text)}</span>` : ''}</a>
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
      ${ev.subtitle ? `<p class="event-sub">${esc(ev.subtitle)}</p>` : ''}
      <div class="details">
        ${DetailRow('calendar', dateLine(ev.date))}
        ${ev.time ? DetailRow('clock', esc(ev.time)) : ''}
        ${ev.venue ? DetailRow('pin', esc(ev.venue), venueSub(ev)) : ''}
      </div>
      ${ev.dressCode ? `<div class="dress" role="group" aria-label="${esc(ev.dressCode.label)}: ${esc(ev.dressCode.text)}">
        <p class="dress-label"><i></i><span>${esc(ev.dressCode.label)}</span><i></i></p>
        <p class="dress-text">${esc(ev.dressCode.text)}</p>
        <div class="dress-swatches" aria-hidden="true">${ev.dressCode.swatches.map((c) => `<span style="--sw:${c}"></span>`).join('')}</div>
      </div>` : ''}
      ${ev.note ? `<p class="event-note">${esc(ev.note)}</p>` : ''}
      ${ev.etiquette ? `<p class="etiquette">${Icon('faith', 'ico ico-xs')}<span>${esc(ev.etiquette)}</span></p>` : ''}
      <div class="event-actions">
        ${ev.maps ? Button({ label: 'View on Map', icon: 'pin', href: ev.maps, cls: 'btn-primary', attrs: 'data-map' }).replace(' target="_blank"', '') : ''}
        ${CalendarLink(cfg, ev)}
      </div>
    </div>
  </div>
</section>`;

/* a day with its own banner (the wedding day) is announced before its first card */
const DayBanner = (b) => `
<div class="day-banner" data-reveal>
  <p class="db-eyebrow"><i></i><span>${esc(b.eyebrow)}</span><i></i></p>
  <h2 class="db-title">${esc(b.title)}</h2>
</div>`;
export const EventsSection = (cfg) => cfg.events.map((ev, i) => {
  const b = cfg.dayBanners?.[isoDay(ev.date)];
  const first = cfg.events.findIndex((e) => isoDay(e.date) === isoDay(ev.date)) === i;
  return (b && first ? DayBanner(b) : '') + EventCard(cfg, ev, i);
}).join('');
