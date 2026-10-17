/* QuickMenu — a small lotus seal beside the music button; opens a sheet of the invitation's
   chapters so a guest returning for the venue or RSVP doesn't have to scroll the whole way. */
import { Icon, Kolam } from './decor.js';
import { $, $$, shareInvite, addToCalendar } from './util.js';

const LINKS = [
  ['story', 'Our Story'], ['families', 'Families'], ['events', 'Festivities'], ['ceremony', 'Muhurtham'],
  ['venue', 'Venue'], ['gallery', 'Moments'], ['rsvp', 'RSVP'], ['travel', 'Getting There'],
  ['gifting', 'Gifting'], ['wishes', 'Wishes'],
];

export function createMenu(cfg, calendar) {
  const btn = document.createElement('button');
  btn.className = 'menu-btn'; btn.type = 'button';
  btn.setAttribute('aria-label', 'Open invitation menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = Icon('lotus');

  const sheet = document.createElement('div');
  sheet.className = 'sheet'; sheet.hidden = true;
  sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'Invitation menu');
  sheet.innerHTML = `
    <div class="sheet-card">
      ${Kolam('sheet-kolam')}
      <p class="eyebrow">${cfg.groomName} &amp; ${cfg.brideName}</p>
      <nav class="sheet-links">${LINKS.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}</nav>
      <div class="sheet-actions">
        <button type="button" class="js-share">${Icon('send', 'ico ico-xs')}Share</button>
        <button type="button" class="js-cal">${Icon('calendar', 'ico ico-xs')}Calendar</button>
        <a href="${cfg.mapsUrl}" target="_blank" rel="noopener">${Icon('pin', 'ico ico-xs')}Map</a>
      </div>
      <button type="button" class="sheet-close" aria-label="Close menu">×</button>
    </div>`;

  const open = () => {
    sheet.hidden = false; btn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => sheet.classList.add('is-on'));
    $('.sheet-links a', sheet).focus({ preventScroll: true });
  };
  const close = () => {
    sheet.classList.remove('is-on'); btn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { sheet.hidden = true; }, 350);
  };
  btn.addEventListener('click', open);
  sheet.addEventListener('click', (e) => { if (e.target === sheet) close(); });
  $('.sheet-close', sheet).addEventListener('click', close);
  $$('.sheet-links a', sheet).forEach((a) => a.addEventListener('click', close));
  $('.js-cal', sheet).addEventListener('click', () => addToCalendar(calendar));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) close(); });

  return {
    show() {
      document.body.append(btn, sheet);
      requestAnimationFrame(() => btn.classList.add('is-shown'));
      // every share button on the page (menu + thank-you) shares the plain link
      $$('.js-share').forEach((b) => b.addEventListener('click', () => shareInvite(cfg.shareText)));
    },
  };
}
