/* GettingHereSection — Directions, parking and nearby stays, each an honest
   map search around the main venue, plus a one-tap copy of the address. */
import { Heading, Icon, Button, RestingPetals } from '../decor.js';
import { esc, copyText, toast } from '../util.js';

export const GettingHereSection = (cfg) => {
  const g = cfg.gettingHere;
  const main = cfg.events.find((e) => e.main) || cfg.events[0];
  return `
<section class="section getting" id="getting-here">
  ${RestingPetals(9)}
  ${Heading(g.title, g.sub)}
  <div class="gh-rows" data-reveal>
    ${g.rows.map((r) => `
      <a class="gh-row" href="${r.href}" target="_blank" rel="noopener">
        ${Icon(r.icon, 'ico ico-row')}<span><b>${esc(r.label)}</b><small>${esc(r.sub)}</small></span>${Icon('arrow', 'ico ico-chev')}
      </a>`).join('')}
  </div>
  <div class="gh-address card" data-reveal>
    <p class="gh-venue">${esc(main.venue)}</p>
    <p class="gh-addr">${esc(main.address)}</p>
    ${Button({ label: 'Copy Address', icon: 'copy', cls: 'btn-ghost btn-sm', id: 'copy-address' })}
  </div>
</section>`;
};

export function initGettingHere(cfg) {
  const main = cfg.events.find((e) => e.main) || cfg.events[0];
  document.getElementById('copy-address')?.addEventListener('click', async () =>
    toast((await copyText(`${main.venue}, ${main.address}`)) ? 'Address copied' : 'Could not copy the address'));
}
