/* RSVPModal — Confirm Your Presence. Accessible dialog (focus trap, Escape,
   labelled fields), validation, and a submit handler ready for a backend:
   with cfg.endpoint empty the reply is kept in this browser only. */
import { h } from './util.js';

export function RSVPModal(cfg) {
  const name = h('input', { type: 'text', id: 'rsvp-name', autocomplete: 'name', maxlength: '80', required: true });
  const yes = h('input', { type: 'radio', name: 'attending', value: 'yes' });
  const no = h('input', { type: 'radio', name: 'attending', value: 'no' });
  const err = h('p', { class: 'err', role: 'alert' });
  const form = h('form', { novalidate: true },
    h('label', { for: 'rsvp-name' }, 'Your name'), name,
    h('label', {}, 'Will you attend?'),
    h('div', { class: 'choices' }, h('label', {}, yes, h('span', {}, 'Yes, joyfully')), h('label', {}, no, h('span', {}, 'Sadly, no'))),
    err,
    h('button', { class: 'confirm', type: 'submit' }, 'Confirm'),
    h('p', { class: 'note' }, cfg.endpoint ? 'Your reply is sent to the couple.' : 'Demo: your reply is saved on this device only, not sent anywhere.'));
  const closeBtn = h('button', { class: 'close', type: 'button', 'aria-label': 'Close' }, '×');
  const box = h('div', { class: 'box', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'rsvp-title' },
    closeBtn, h('h2', { id: 'rsvp-title' }, 'RSVP'), h('p', {}, 'Confirm your presence'), form);
  const modal = h('div', { class: 'modal' }, box);
  document.body.append(modal);

  let opener = null;
  const focusables = () => [...box.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])')].filter((el) => !el.disabled && el.offsetParent !== null);
  function open(from) {
    opener = from || document.activeElement;
    modal.classList.add('shown');
    document.body.classList.add('locked');
    const saved = load();
    if (saved) { name.value = saved.name; (saved.attending === 'yes' ? yes : no).checked = true; }
    setTimeout(() => name.focus(), 50);
  }
  function close() {
    modal.classList.remove('shown');
    document.body.classList.remove('locked');
    if (opener && opener.focus) opener.focus();
  }
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') {
      const f = focusables(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function load() { try { return JSON.parse(localStorage.getItem(cfg.storageKey) || 'null'); } catch { return null; } }

  /* the submission handler: swap the body for a fetch to cfg.endpoint when a backend exists */
  async function submitRsvp(data) {
    if (cfg.endpoint) {
      const r = await fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(`RSVP failed (${r.status})`);
      return { stored: 'server' };
    }
    localStorage.setItem(cfg.storageKey, JSON.stringify(data));
    return { stored: 'local' };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.textContent = '';
    const n = name.value.trim();
    const attending = yes.checked ? 'yes' : no.checked ? 'no' : '';
    if (n.length < 2) { err.textContent = 'Please enter your name.'; name.focus(); return; }
    if (!attending) { err.textContent = 'Please tell us whether you will attend.'; yes.focus(); return; }
    const btn = form.querySelector('.confirm'); btn.disabled = true;
    try {
      const { stored } = await submitRsvp({ name: n, attending, at: new Date().toISOString(), page: location.pathname });
      form.replaceWith(h('div', { class: 'done' },
        h('div', { class: 'tick', 'aria-hidden': 'true' }, '✓'),
        h('p', {}, attending === 'yes' ? `Thank you, ${n}. We can't wait to celebrate with you!` : `Thank you, ${n}. You will be missed.`),
        h('p', { class: 'note' }, stored === 'local' ? 'Demo mode: this reply is stored in your browser only and was not sent to the couple.' : 'Your reply has been sent.')));
      setTimeout(() => box.querySelector('.close').focus(), 50);
    } catch (ex) {
      err.textContent = 'Sorry, that did not go through. Please try again.';
      btn.disabled = false;
    }
  });

  return { open, close };
}
