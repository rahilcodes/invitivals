/* RSVPForm — Kindly Reply. The reply goes to the one destination configured: a JSON POST to
   cfg.endpoint, else WhatsApp (the reply written out), else a mailto. With none configured the form is
   shown but cannot send, and says so: no pretend success. */
import { h, icons, toast } from './util.js?v=5';

const field = (icon, input) => h('label', { class: 'field' }, h('span', { class: 'ico', html: icon }), input);

export function RSVPForm(cfg, couple) {
  const name = h('input', { type: 'text', name: 'name', placeholder: cfg.labels.name, 'aria-label': cfg.labels.name, autocomplete: 'name', maxlength: '80', required: true });
  const email = h('input', { type: 'email', name: 'email', placeholder: cfg.labels.email, 'aria-label': cfg.labels.email, autocomplete: 'email', maxlength: '120' });
  const attend = h('select', { name: 'attending', 'aria-label': cfg.labels.attend, required: true },
    h('option', { value: '', disabled: true, selected: true }, cfg.labels.attend),
    h('option', { value: 'yes' }, cfg.options[0]), h('option', { value: 'no' }, cfg.options[1]));
  const message = h('textarea', { name: 'message', placeholder: cfg.labels.message, 'aria-label': cfg.labels.message, rows: '2', maxlength: '500' });
  const err = h('p', { class: 'err', role: 'alert' });
  const send = h('button', { class: 'btn gold wide', type: 'submit' }, cfg.button);
  const destination = cfg.endpoint ? 'endpoint' : cfg.whatsapp ? 'whatsapp' : cfg.email ? 'email' : '';
  const note = h('p', { class: 'note' }, destination ? '' : cfg.pending);
  if (!destination) { send.disabled = true; send.setAttribute('aria-disabled', 'true'); }
  const form = h('form', { class: 'rsvp-form', novalidate: true },
    field(icons.person, name), field(icons.mail, email), field(icons.people, attend), field(icons.chat, message), err, send, note);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.textContent = '';
    const n = name.value.trim(), em = email.value.trim(), a = attend.value, m = message.value.trim();
    if (n.length < 2) { err.textContent = 'Please enter your name.'; name.focus(); return; }
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { err.textContent = 'Please check your email address.'; email.focus(); return; }
    if (!a) { err.textContent = 'Please tell us whether you will attend.'; attend.focus(); return; }
    const data = { name: n, email: em, attending: a, message: m, at: new Date().toISOString(), page: location.pathname };
    const text = [`RSVP for ${couple.groom} & ${couple.bride}'s wedding`, `Name: ${n}`, em ? `Email: ${em}` : '', `Attending: ${a === 'yes' ? cfg.options[0] : cfg.options[1]}`, m ? `Message: ${m}` : ''].filter(Boolean).join('\n');
    send.disabled = true;
    try {
      if (destination === 'endpoint') {
        const r = await fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(`RSVP failed (${r.status})`);
        done(a, n);
      } else if (destination === 'whatsapp') {
        open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
        toast('WhatsApp opens with your reply — just press send.');
        send.disabled = false;
      } else {
        location.href = `mailto:${cfg.email}?subject=${encodeURIComponent(`RSVP · ${n}`)}&body=${encodeURIComponent(text)}`;
        send.disabled = false;
      }
    } catch {
      err.textContent = 'Sorry, that did not go through. Please try again.';
      send.disabled = false;
    }
  });
  function done(a, n) {
    form.replaceWith(h('div', { class: 'done', role: 'status' }, h('span', { class: 'tick', html: icons.heart }),
      h('p', {}, a === 'yes' ? `Thank you, ${n}. We can’t wait to celebrate with you!` : `Thank you, ${n}. You will be missed.`)));
  }
  return form;
}
