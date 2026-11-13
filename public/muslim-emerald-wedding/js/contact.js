/* ContactBars — page 11: the three bars painted into the artwork (icons included)
   become Call / WhatsApp / Email actions. A bar whose detail is not configured
   says so instead of pretending. */
import { h, toast } from './util.js';

export function contactBar(label, href, { configured }) {
  const inner = [h('span', { class: 'lbl' }, label)]; // the chevron is painted in the artwork
  if (!configured) {
    const b = h('button', { class: 'bar', type: 'button', 'aria-label': `${label} — not configured yet` }, ...inner);
    b.addEventListener('click', () => toast(`${label} details are not configured yet.`));
    return b;
  }
  return h('a', { class: 'bar', href, target: href.startsWith('http') ? '_blank' : null, rel: href.startsWith('http') ? 'noopener' : null }, ...inner);
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
