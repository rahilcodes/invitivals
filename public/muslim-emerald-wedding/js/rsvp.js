/* RSVPForm — page 10, real inputs on the parchment: attendance, name, number
   of guests, an optional message. Validation inline; the submit posts JSON to
   cfg.endpoint when one is configured, otherwise it says so plainly and keeps
   the reply on this device only. */
import { h } from './util.js';

export function RSVPForm(cfg) {
  const yes = h('input', { type: 'radio', name: 'attending', value: 'yes', id: 'rsvp-yes' });
  const no = h('input', { type: 'radio', name: 'attending', value: 'no', id: 'rsvp-no' });
  const name = h('input', { type: 'text', id: 'rsvp-name', autocomplete: 'name', maxlength: '80', placeholder: cfg.namePlaceholder, 'aria-label': 'Your name', required: true });
  const guests = h('select', { id: 'rsvp-guests', 'aria-label': 'Number of guests' });
  for (let i = 1; i <= cfg.maxGuests; i++) guests.append(h('option', { value: String(i) }, `${i} ${i === 1 ? 'guest' : 'guests'}`));
  const message = h('textarea', { id: 'rsvp-message', rows: '2', maxlength: '400', placeholder: cfg.messagePlaceholder, 'aria-label': 'Your message (optional)' });
  const err = h('p', { class: 'form-err', role: 'alert' });
  const send = h('button', { class: 'pill solid send', type: 'submit' },
    h('i', { class: 'ico', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 11.5 21 3l-6.5 18-3.2-7.3z"/><path d="M21 3 11.3 13.7"/></svg>' }),
    h('span', {}, cfg.button));
  const note = h('p', { class: 'form-note' }, cfg.endpoint ? '' : 'RSVP delivery is not configured yet — replies are kept on this device only.');

  const form = h('form', { class: 'rsvp-form', novalidate: true, 'aria-label': 'RSVP' },
    h('fieldset', { class: 'box choices' }, h('legend', { class: 'sr-only' }, 'Will you attend?'),
      h('label', { class: 'row', for: 'rsvp-yes' }, yes, h('i', { class: 'radio', 'aria-hidden': 'true' }), h('span', {}, cfg.accept)),
      h('label', { class: 'row', for: 'rsvp-no' }, no, h('i', { class: 'radio', 'aria-hidden': 'true' }), h('span', {}, cfg.decline))),
    h('div', { class: 'box fields' },
      h('div', { class: 'row' }, name),
      h('div', { class: 'row' }, h('label', { for: 'rsvp-guests', class: 'glabel' }, cfg.guestsLabel), guests)),
    h('div', { class: 'box fields msg' }, message),
    err, send, note);

  const saved = load();
  if (saved) { name.value = saved.name || ''; guests.value = String(saved.guests || 1); (saved.attending === 'yes' ? yes : no).checked = true; message.value = saved.message || ''; }

  function load() { try { return JSON.parse(localStorage.getItem(cfg.storageKey) || 'null'); } catch { return null; } }
  async function submit(data) {
    if (cfg.endpoint) {
      const r = await fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(`RSVP failed (${r.status})`);
      return 'server';
    }
    try { localStorage.setItem(cfg.storageKey, JSON.stringify(data)); } catch { /* private mode */ }
    return 'local';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.textContent = '';
    const attending = yes.checked ? 'yes' : no.checked ? 'no' : '';
    const n = name.value.trim();
    if (!attending) { err.textContent = 'Please choose whether you will be joining us.'; yes.focus(); return; }
    if (n.length < 2) { err.textContent = 'Please enter your name.'; name.focus(); return; }
    const g = Number(guests.value);
    if (!(g >= 1 && g <= cfg.maxGuests)) { err.textContent = 'Please choose the number of guests.'; guests.focus(); return; }
    send.disabled = true;
    try {
      const stored = await submit({ name: n, attending, guests: g, message: message.value.trim(), at: new Date().toISOString(), page: location.pathname });
      form.replaceWith(h('div', { class: 'rsvp-done', role: 'status' },
        h('div', { class: 'tick', 'aria-hidden': 'true' }, '✓'),
        h('p', {}, attending === 'yes' ? `Thank you, ${n}. We can't wait to celebrate with you!` : `Thank you, ${n}. You will be missed.`),
        h('p', { class: 'form-note' }, stored === 'local' ? 'RSVP delivery is not configured: this reply is stored in your browser only and was not sent to the family.' : 'Your reply has been sent.')));
    } catch {
      err.textContent = 'Sorry, that did not go through. Please try again.';
      send.disabled = false;
    }
  });
  return form;
}
