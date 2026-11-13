/* RSVPForm — page 10. The reference plate paints the whole form: two choice
   rows with gold rings, the message box with its placeholder, the Send button.
   Real controls sit exactly over them with no visuals of their own, except a
   green dot inside the chosen ring and a field-coloured patch that hides the
   painted placeholder while the guest types. The submit posts JSON to
   cfg.endpoint when one is configured; otherwise it says so and keeps the
   reply on this device only. */
import { h, toast } from './util.js';
import { at, hotspot } from './page.js';

export function RSVPForm(cfg, geo) {
  /* geo: { accept, decline: {x,y,w,h}, ring: {x, size}, message: {x,y,w,h, patch}, send: {x,y,w,h}, note: {y} } */
  const yes = h('input', { type: 'radio', name: 'attending', value: 'yes', id: 'rsvp-yes', class: 'sr-only' });
  const no = h('input', { type: 'radio', name: 'attending', value: 'no', id: 'rsvp-no', class: 'sr-only' });
  const dot = (input, text) => {
    const l = h('label', { class: 'choice', for: input.id, 'aria-label': text }, input, h('i', { class: 'dot', 'aria-hidden': 'true', style: { left: `${geo.ring.x}%`, width: `${geo.ring.size}cqw`, height: `${geo.ring.size}cqw` } }));
    return l;
  };
  const message = h('textarea', { id: 'rsvp-message', rows: '3', maxlength: '400', 'aria-label': 'Your message (optional)', autocomplete: 'off' });
  const patch = h('i', { class: 'patch', 'aria-hidden': 'true', style: { left: `${geo.message.patch.x}%`, top: `${geo.message.patch.y}%`, width: `${geo.message.patch.w}%`, height: `${geo.message.patch.h}%` } });
  const msgBox = h('div', { class: 'msg' }, patch, message);
  const syncPatch = () => msgBox.classList.toggle('active', document.activeElement === message || message.value.length > 0);
  message.addEventListener('focus', syncPatch); message.addEventListener('blur', syncPatch); message.addEventListener('input', syncPatch);

  const send = h('button', { type: 'submit', 'aria-label': cfg.button });
  const note = h('p', { class: 'form-note', role: 'status', 'aria-live': 'polite' }, cfg.endpoint ? '' : 'RSVP delivery is not configured yet: replies stay on this device.');

  const form = h('form', { class: 'rsvp-form', novalidate: true, 'aria-label': 'RSVP' },
    h('fieldset', { class: 'choices' }, h('legend', { class: 'sr-only' }, 'Will you attend?'),
      at(dot(yes, cfg.accept), { ...geo.accept, hit: true }),
      at(dot(no, cfg.decline), { ...geo.decline, hit: true })),
    at(msgBox, { ...geo.message, hit: true }),
    hotspot(send, geo.send),
    at(note, { y: geo.note.y, w: 56 }));
  form.style.position = 'absolute'; form.style.inset = '0';

  const saved = load();
  if (saved) { (saved.attending === 'yes' ? yes : no).checked = true; message.value = saved.message || ''; syncPatch(); }

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

  let busy = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    const attending = yes.checked ? 'yes' : no.checked ? 'no' : '';
    if (!attending) { toast('Please choose Joyfully Accepts or Regretfully Declines.'); yes.focus(); return; }
    busy = true; send.disabled = true;
    try {
      const stored = await submit({ attending, message: message.value.trim(), at: new Date().toISOString(), page: location.pathname });
      note.textContent = stored === 'local'
        ? (attending === 'yes' ? 'Thank you! ' : 'Thank you. ') + 'RSVP delivery is not configured: this reply is stored in your browser only and was not sent to the family.'
        : (attending === 'yes' ? 'Thank you! Your reply has been sent.' : 'Thank you. Your reply has been sent.');
      note.classList.add('done');
      toast(stored === 'local' ? 'Saved on this device only (RSVP delivery not configured).' : 'Your response has been sent.');
    } catch {
      toast('Sorry, that did not go through. Please try again.');
      busy = false; send.disabled = false; // nothing typed is lost
    }
  });
  return form;
}
