/* SaveTheDateSection — the date set large, one tap to the guest's calendar. */
import { Heading, Button, Kolam } from '../decor.js';
import { day, year, googleCalendarHref } from '../util.js';

const mm = (iso) => new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', month: '2-digit' }).format(new Date(iso));

export const SaveTheDateSection = (cfg) => `
<section class="sec save" id="save" aria-labelledby="save-h">
  <div class="sec-inner">
    ${Heading('Save the Date', 'Add it to your calendar so you don’t miss it', { id: 'save-h' })}
    <div class="save-wrap" data-reveal>
      ${Kolam('save-kolam')}
      <p class="save-date"><span>${day(cfg.weddingDate).padStart(2, '0')}</span><i></i><span>${mm(cfg.weddingDate)}</span><i></i><span>${year(cfg.weddingDate)}</span></p>
    </div>
    <div class="save-btns" data-reveal>${Button({ label: 'Google Calendar', icon: 'calendar', id: 'add-cal', href: googleCalendarHref(weddingCalendar(cfg)) })}${Button({ label: 'Apple / Outlook', icon: 'calendar', cls: 'btn-ghost', href: cfg.weddingIcs, attrs: `download="${cfg.weddingIcs}" id="add-ics"` })}</div>
  </div>
</section>`;

/* the wedding itself: Hast Melap */
export const weddingCalendar = (cfg) => ({
  title: `${cfg.ceremonyTitle} — ${cfg.pair[0]} & ${cfg.pair[1]}`,
  start: cfg.weddingDate,
  details: cfg.mapsUrl,
  location: `${cfg.venue}, ${cfg.venueAddress}`,
  ics: cfg.weddingIcs,
});

export function initSaveTheDate() { /* both buttons are plain links */ }
