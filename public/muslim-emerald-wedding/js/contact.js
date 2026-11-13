/* ContactBars — page 11: the three bars painted in the reference plate (icons,
   labels and chevrons included) get invisible Call / WhatsApp / Email actions.
   A bar whose detail is not configured says so instead of pretending. */
import { h, toast } from './util.js';

export function contactBar(label, href, { configured }) {
  if (!configured) {
    const b = h('button', { type: 'button', 'aria-label': `${label} — not configured yet` });
    b.addEventListener('click', () => toast(`${label} details are not configured yet.`));
    return b;
  }
  return h('a', { href, 'aria-label': label, target: href.startsWith('http') ? '_blank' : null, rel: href.startsWith('http') ? 'noopener' : null });
}

export function contactBars(c) {
  const phone = (c.phone || '').replace(/[^\d+]/g, '');
  const wa = (c.whatsapp || '').replace(/\D/g, '');
  return [
    contactBar('Call', phone ? `tel:${phone}` : '', { configured: !!phone }),
    contactBar('WhatsApp', wa ? `https://wa.me/${wa}` : '', { configured: !!wa }),
    contactBar('Email', c.email ? `mailto:${c.email}` : '', { configured: !!c.email }),
  ];
}
