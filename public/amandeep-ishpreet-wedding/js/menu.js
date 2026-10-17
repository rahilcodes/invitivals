/* QuickMenu — a small Khanda seal beside the music button; opens a sheet of the
   invitation's chapters so a returning guest can jump to the venue or RSVP,
   with share, calendar files and map at hand. The chapters follow the events
   actually shown on this link. */
import { Khanda, Icon } from './decor.js';
import { $, $$, shareInvite, couple } from './util.js';
import { CalendarLink, CalendarAllLink } from './calendar.js';

export function createMenu(cfg) {
  const main = cfg.events.find((e) => e.main) || cfg.events[0];
  const links = [
    ['invite', 'Invitation'], ['families', 'Families'], ['story', 'Our Story'], ['schedule', 'Programme'],
    ...cfg.events.map((e) => [e.id, e.menu || e.name]),
    ['gallery', 'Moments'], ['getting-here', 'Getting Here'], ['rsvp', 'RSVP'], ['closing', 'Blessings'],
  ].filter(([id]) => document.getElementById(id)); // only chapters this invitation actually has

  const btn = document.createElement('button');
  btn.className = 'menu-btn'; btn.type = 'button';
  btn.setAttribute('aria-label', 'Open invitation menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = Khanda('menu-khanda');

  const sheet = document.createElement('div');
  sheet.className = 'sheet'; sheet.hidden = true;
  sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'Invitation menu');
  sheet.innerHTML = `
    <div class="sheet-card">
      ${Khanda()}
      <p class="eyebrow">${couple(cfg, true).join(' &amp; ')}</p>
      <nav class="sheet-links">${links.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}</nav>
      <div class="sheet-actions">
        <button type="button" class="js-share">${Icon('send', 'ico ico-xs')}Share</button>
        ${CalendarLink(cfg, main, { label: main.menu || main.name, small: true })}
        ${cfg.events.length > 1 ? CalendarAllLink(cfg, { label: 'All events', small: true }) : ''}
        <a href="${main.maps}" target="_blank" rel="noopener">${Icon('pin', 'ico ico-xs')}Map</a>
        <a href="#top" class="js-top">${Icon('up', 'ico ico-xs')}Top</a>
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
  $$('.sheet-links a, .js-top', sheet).forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) close(); });

  return {
    show() {
      document.body.append(btn, sheet);
      requestAnimationFrame(() => btn.classList.add('is-shown'));
      $$('.js-share').forEach((b) => b.addEventListener('click', () => shareInvite(cfg.shareText)));
    },
  };
}
