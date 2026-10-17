/* SaveTheDateSection — the date set large, one tap to the guest's calendar. */
import { Heading, Button, Kolam } from '../decor.js';
import { $, day, year, addToCalendar } from '../util.js';

const mm = (iso) => new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', month: '2-digit' }).format(new Date(iso));

export const SaveTheDateSection = (cfg) => `
<section class="sec save" id="save" aria-labelledby="save-h">
  <div class="sec-inner">
    ${Heading('Save the Date', 'Add it to your calendar so you don’t miss it', { id: 'save-h' })}
    <div class="save-wrap" data-reveal>
      ${Kolam('save-kolam')}
      <p class="save-date"><span>${day(cfg.weddingDate).padStart(2, '0')}</span><i></i><span>${mm(cfg.weddingDate)}</span><i></i><span>${year(cfg.weddingDate)}</span></p>
    </div>
    <div data-reveal>${Button({ label: 'Add to Calendar', icon: 'calendar', id: 'add-cal' })}</div>
  </div>
</section>`;

export const weddingCalendar = (cfg) => ({
  title: `Wedding of ${cfg.groomName} & ${cfg.brideName}`,
  start: cfg.weddingDate, end: cfg.weddingEnd,
  details: `${cfg.muhurtham}. We look forward to your blessings.`,
  location: `${cfg.venue}, ${cfg.venueAddress}`,
});

export function initSaveTheDate(cfg) {
  $('#add-cal').addEventListener('click', () => addToCalendar(weddingCalendar(cfg)));
}
