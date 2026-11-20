/* RsvpSection — the family's request to confirm attendance (client, 2026-11-20): the heading, the person to reply
   to, and one button that opens WhatsApp to their number with a message the guest can edit before sending.
   wa.me opens the app on a phone and WhatsApp Web / the download page in a desktop browser. */
import { Heading, Icon } from '../decor.js';
import { whatsappLink } from '../util.js';

export const RsvpSection = (cfg) => `
<section class="section rsvp" id="rsvp">
  ${Heading(cfg.rsvp.title)}
  <div class="card card-rsvp" data-reveal>
    <p class="rsvp-who">${cfg.rsvp.name}</p>
    <div class="rsvp-contact">
      <a class="btn btn-wa" href="${whatsappLink(cfg.rsvp.whatsapp, cfg.rsvp.message)}" target="_blank" rel="noopener">${Icon('whatsapp', 'ico ico-btn')}<span>${cfg.rsvp.button}</span></a>
    </div>
  </div>
</section>`;
