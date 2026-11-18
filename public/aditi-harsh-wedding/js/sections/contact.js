/* ContactSection — call, WhatsApp, email. */
import { Heading, Icon } from '../decor.js';

export const ContactSection = (cfg) => `
<section class="sec contact" id="contact" aria-labelledby="contact-h">
  <div class="sec-inner">
    ${Heading('Need Help?', cfg.contact.note, { id: 'contact-h' })}
    <div class="seals" data-reveal>
      <a class="seal" href="tel:${cfg.contact.phone}">${Icon('phone')}<span>Call</span></a>
      <a class="seal" href="https://wa.me/${cfg.contact.whatsapp}" target="_blank" rel="noopener">${Icon('whatsapp')}<span>WhatsApp</span></a>
      <a class="seal" href="mailto:${cfg.contact.email}">${Icon('mail')}<span>Email</span></a>
    </div>
  </div>
</section>`;
