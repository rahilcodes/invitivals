/* RsvpSection — R.S.V.P. as printed on the family's card (client, 2026-11-22): the family's name and their two
   mobile numbers, each a tap-to-call link (tel:, which opens the dialler on a phone and the calling app on a
   computer that has one), then "With Best Compliments From". */
import { Heading, Icon } from '../decor.js';
import { esc } from '../util.js';

export const RsvpSection = (cfg) => `
<section class="section rsvp" id="rsvp">
  ${Heading(cfg.rsvp.title)}
  <div class="card card-rsvp" data-reveal>
    ${cfg.rsvp.name ? `<p class="rsvp-who">${esc(cfg.rsvp.name)}</p>` : ''}
    ${cfg.rsvp.names ? `<ul class="rsvp-names">${cfg.rsvp.names.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
    <div class="rsvp-calls">
      ${cfg.rsvp.phones.map((p) => `<a class="btn btn-primary rsvp-call" href="tel:${p.tel}" aria-label="Call ${esc(p.label)}">${Icon('phone', 'ico ico-btn')}<span>(M) ${esc(p.label)}</span></a>`).join('')}
    </div>
    ${cfg.rsvp.compliments ? `<div class="rsvp-compliments">
      <p class="rc-label">${esc(cfg.rsvp.compliments.label)}</p>
      <p class="rc-who">${esc(cfg.rsvp.compliments.from)}</p>
    </div>` : ''}
  </div>
</section>`;
