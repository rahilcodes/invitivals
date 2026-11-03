/* RSVP (page 5): the two tiles record the choice at once through rsvp.php; the Dua box under
   "Dua for Us" is a real text field in the frame's empty area, and typing happens in a comfortable
   sheet with the guest's name, sent through the same endpoint. Nothing is ever reported as sent
   unless the server said so. */
import { h, toast, store, guestId } from './util.js';
import { box } from './page.js';

export function Rsvp(cfg) {
  const key = (k) => `${cfg.storageKey}:${k}`;
  const guest = guestId(cfg.storageKey);
  const saved = store.get(key('rsvp')) || {}; // { attending, name, message }

  async function send(data) {
    const r = await fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, guest }) });
    let body = null; try { body = await r.json(); } catch { /* not json */ }
    if (!r.ok || !body || !body.ok) throw new Error((body && body.error) || `HTTP ${r.status}`);
    return body;
  }

  /* ── the two tiles ── */
  const tiles = {};
  const pick = (id, label, value, delay) => {
    const b = h('button', { class: 'tile', type: 'button', 'aria-pressed': 'false', 'aria-label': label }, h('img', { src: `assets/${id}.webp`, alt: '', decoding: 'async', draggable: 'false' }));
    const wrap = h('div', { class: 's hit reveal', style: { ...box(id), zIndex: 5, '--d': `${delay}s` } }, b);
    tiles[value] = b;
    b.addEventListener('click', async () => {
      if (b.classList.contains('busy')) return;
      mark(value);
      b.classList.add('busy');
      try {
        await send({ kind: 'rsvp', attending: value, name: saved.name || '' });
        saved.attending = value; store.set(key('rsvp'), saved);
        toast(value === 'yes' ? 'Thank you! Your RSVP is recorded: will attend.' : 'Thank you. Your RSVP is recorded: unable to attend.');
      } catch (e) {
        mark(saved.attending || null);
        toast('Sorry, your RSVP could not be saved. Please check your connection and try again.');
      } finally { b.classList.remove('busy'); }
    });
    return wrap;
  };
  function mark(value) {
    for (const [v, b] of Object.entries(tiles)) {
      b.classList.toggle('sel', v === value);
      b.classList.toggle('dim', value != null && v !== value);
      b.setAttribute('aria-pressed', String(v === value));
    }
  }
  const will = pick('p5-will', 'Will attend', 'yes', 0.5);
  const unable = pick('p5-unable', 'Unable to attend', 'no', 0.62);

  /* ── the Dua box in the frame's empty area ── */
  const field = h('textarea', { class: 'dua-field', rows: '2', readonly: true, placeholder: cfg.placeholder, 'aria-label': 'Your dua for the couple' });
  const submit = h('button', { class: 'dua-submit', type: 'button' }, 'Submit');
  const area = h('div', { class: 's hit dua', style: { ...box('p5-dua-area'), zIndex: 5 } }, field, submit);
  field.addEventListener('pointerdown', (e) => { e.preventDefault(); open(); });
  field.addEventListener('focus', () => open());
  field.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  submit.addEventListener('click', () => open());

  /* ── the writing sheet ── */
  const name = h('input', { type: 'text', id: 'dua-name', autocomplete: 'name', maxlength: '80', placeholder: 'Your name', required: true });
  const message = h('textarea', { id: 'dua-text', rows: '5', maxlength: '1000', placeholder: cfg.placeholder, required: true });
  const yes = h('input', { type: 'radio', name: 'attending', value: 'yes' });
  const no = h('input', { type: 'radio', name: 'attending', value: 'no' });
  const err = h('p', { class: 'err', role: 'alert' });
  const go = h('button', { class: 'confirm', type: 'submit' }, 'Send your dua');
  const form = h('form', { novalidate: true },
    h('label', { for: 'dua-name' }, 'Your name'), name,
    h('label', { for: 'dua-text' }, 'Your dua'), message,
    h('label', {}, 'Will you attend?'),
    h('div', { class: 'choices' }, h('label', {}, yes, h('span', {}, 'Will Attend')), h('label', {}, no, h('span', {}, 'Unable to Attend'))),
    err, go);
  const closeBtn = h('button', { class: 'close', type: 'button', 'aria-label': 'Close' }, '×');
  const sheet = h('div', { class: 'box', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'dua-title' }, closeBtn, h('h2', { id: 'dua-title' }, 'Dua for Us'), form);
  const modal = h('div', { class: 'modal' }, sheet);
  document.body.append(modal);
  let opener = null;
  function open() {
    opener = document.activeElement;
    name.value = saved.name || ''; message.value = field.value || saved.message || '';
    yes.checked = saved.attending === 'yes'; no.checked = saved.attending === 'no';
    err.textContent = '';
    modal.classList.add('shown'); document.body.classList.add('locked');
    setTimeout(() => (name.value ? message : name).focus(), 60);
  }
  function close() {
    modal.classList.remove('shown'); document.body.classList.remove('locked');
    if (opener && opener.focus && opener !== field) opener.focus();
  }
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') {
      const f = [...sheet.querySelectorAll('button, input, textarea')].filter((el) => !el.disabled && el.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); err.textContent = '';
    const n = name.value.trim(), m = message.value.trim();
    const attending = yes.checked ? 'yes' : no.checked ? 'no' : '';
    if (n.length < 2) { err.textContent = 'Please write your name.'; name.focus(); return; }
    if (m.length < 2) { err.textContent = 'Please write your dua or wishes.'; message.focus(); return; }
    go.disabled = true;
    try {
      await send({ kind: 'dua', name: n, message: m, attending });
      Object.assign(saved, { name: n, message: m }); if (attending) saved.attending = attending;
      store.set(key('rsvp'), saved);
      if (attending) mark(attending);
      showSent();
      close();
      toast(`Thank you, ${n}. Your dua has been sent to the couple.`);
    } catch (ex) {
      err.textContent = 'Sorry, that did not go through. Please try again.';
    } finally { go.disabled = false; }
  });
  function showSent() {
    field.value = saved.message || '';
    field.setAttribute('aria-label', 'Your dua for the couple (sent)');
    area.classList.add('done');
    submit.textContent = 'Edit';
  }

  if (saved.attending) mark(saved.attending);
  if (saved.message) showSent();
  return [will, unable, area];
}
