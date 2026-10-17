/* ContactSection — the family's number written out in full, tap to call; WhatsApp beside it. */
import { Heading, Icon } from '../decor.js';

const digits = (p) => p.replace(/[^+\d]/g, '');

export const ContactSection = (cfg) => `
<section class="sec contact" id="contact" aria-labelledby="contact-h">
  <div class="sec-inner">
    ${Heading('Need Help?', cfg.contact.note, { id: 'contact-h' })}
    <div class="phone-card" data-reveal>
      ${Icon('phone', 'ico phone-ico')}
      <a class="phone-number" href="tel:${digits(cfg.contact.phones[0])}">${cfg.contact.display || cfg.contact.phones[0]}</a>
      <p class="phone-links">
        <a href="tel:${digits(cfg.contact.phones[0])}">Call</a><i aria-hidden="true"></i>
        <a href="https://wa.me/${cfg.contact.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
      </p>
    </div>
  </div>
</section>`;
