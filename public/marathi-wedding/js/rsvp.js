/* RSVP — screen 6. The pack's printed "उपस्थिती नोंदवा" button opens an
   attendance sheet (name, coming or not, number of guests); the pack's wishes
   bar is a real input that sends a wish with the guest's name. Both post JSON
   to rsvp.php; a reply is remembered on the device so the sheet reopens filled
   in and the wish keeps the name. */
import { h, toast, openSheet } from './util.js';
import { icon } from './ornaments.js';
import { artSizes } from './art-sizes.js';

const fill = (s, name) => s.replace('{name}', name);

export function RSVP(cfg) {
  const F = cfg.form;
  const load = () => { try { return JSON.parse(localStorage.getItem(cfg.storageKey) || 'null') || {}; } catch { return {}; } };
  const remember = (patch) => { try { localStorage.setItem(cfg.storageKey, JSON.stringify({ ...load(), ...patch })); } catch { /* private mode */ } };
  async function post(data) {
    if (!cfg.endpoint) throw new Error('no endpoint');
    const r = await fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, at: new Date().toISOString(), page: location.pathname }) });
    if (!r.ok) throw new Error(`RSVP failed (${r.status})`);
    return r.json().catch(() => ({ ok: true }));
  }

  /* ── the printed button and the status line under it ── */
  const [bw, bh] = artSizes['btn-rsvp'];
  const open = h('button', { class: 'img-btn', type: 'button', 'aria-haspopup': 'dialog', 'aria-label': F.title },
    h('img', { src: 'assets/btn-rsvp.webp', alt: '', width: bw, height: bh, loading: 'lazy', decoding: 'async' }));
  const status = h('p', { class: 'rsvp-status', role: 'status', lang: 'mr' });
  const wrap = h('div', { class: 'rsvp-wrap' }, open, status);
  const showStatus = (s) => { if (s && s.name && s.attending) status.textContent = fill(s.attending === 'yes' ? F.recordedYes : F.recordedNo, s.name); };
  showStatus(load());

  open.addEventListener('click', () => {
    const saved = load();
    const yes = h('input', { type: 'radio', name: 'attending', value: 'yes', id: 'rsvp-yes' });
    const no = h('input', { type: 'radio', name: 'attending', value: 'no', id: 'rsvp-no' });
    const name = h('input', { type: 'text', id: 'rsvp-name', autocomplete: 'name', maxlength: '80', placeholder: F.name, 'aria-label': F.name, lang: 'mr' });
    const guests = h('select', { id: 'rsvp-guests', 'aria-label': F.guests });
    for (let i = 1; i <= cfg.maxGuests; i++) guests.append(h('option', { value: String(i) }, String(i)));
    const err = h('p', { class: 'form-err', role: 'alert', lang: 'mr' });
    const send = h('button', { class: 'pill solid', type: 'submit' }, h('i', { class: 'ico', html: icon('send') }), h('span', { lang: 'mr' }, F.send));
    const form = h('form', { class: 'rsvp-form', novalidate: true, lang: 'mr' },
      h('div', { class: 'box' }, h('div', { class: 'row' }, name)),
      h('fieldset', { class: 'box choices' }, h('legend', { class: 'sr-only' }, F.title),
        h('label', { class: 'row', for: 'rsvp-yes' }, yes, h('i', { class: 'radio', 'aria-hidden': 'true' }), h('span', {}, F.accept)),
        h('label', { class: 'row', for: 'rsvp-no' }, no, h('i', { class: 'radio', 'aria-hidden': 'true' }), h('span', {}, F.decline))),
      h('div', { class: 'box guests-row' }, h('label', { class: 'row', for: 'rsvp-guests' }, h('span', { class: 'glabel' }, F.guests), guests)),
      err, send);
    if (saved.name) name.value = saved.name;
    if (saved.attending === 'yes') yes.checked = true; else if (saved.attending === 'no') no.checked = true;
    if (saved.guests) guests.value = String(saved.guests);
    const sheet = openSheet(F.title, form, { closeLabel: F.close });
    if (!sheet) return;
    const attendingRows = form.querySelector('.guests-row');
    const syncGuests = () => { attendingRows.style.display = no.checked ? 'none' : ''; };
    yes.addEventListener('change', syncGuests); no.addEventListener('change', syncGuests); syncGuests();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      err.textContent = '';
      const attending = yes.checked ? 'yes' : no.checked ? 'no' : '';
      const n = name.value.trim();
      if (n.length < 2) { err.textContent = F.needName; name.focus(); return; }
      if (!attending) { err.textContent = F.needChoice; yes.focus(); return; }
      const g = attending === 'yes' ? Number(guests.value) : 0;
      send.disabled = true;
      try {
        await post({ kind: 'rsvp', name: n, attending, guests: g });
        remember({ name: n, attending, guests: g });
        showStatus({ name: n, attending });
        sheet.close();
        toast(fill(attending === 'yes' ? F.thanksYes : F.thanksNo, n));
      } catch {
        err.textContent = F.failed;
        send.disabled = false;
      }
    });
  });

  /* ── the wishes bar: the pack's bar (its printed placeholder removed) with a real input on it ── */
  const [ww, wh] = artSizes['bar-wish'];
  const wish = h('input', { type: 'text', class: 'wish-input', maxlength: '300', placeholder: cfg.wishPlaceholder, 'aria-label': cfg.wishesTitle, lang: 'mr', autocomplete: 'off' });
  const wishSend = h('button', { class: 'wish-send', type: 'submit', 'aria-label': F.send });
  const bar = h('div', { class: 'wish-bar' }, h('img', { src: 'assets/bar-wish.webp', alt: '', width: ww, height: wh, loading: 'lazy', decoding: 'async' }), wish, wishSend);
  const who = h('input', { type: 'text', class: 'wish-name', maxlength: '80', placeholder: F.name, 'aria-label': F.name, lang: 'mr', autocomplete: 'name' });
  const whoWrap = h('div', { class: 'wish-name-wrap' }, who);
  const wishErr = h('p', { class: 'form-err', role: 'alert', lang: 'mr' });
  const wishForm = h('form', { class: 'wish-form', novalidate: true }, bar, whoWrap, wishErr);
  const needName = () => { if (!who.value.trim() && load().name) who.value = load().name; return !who.value.trim(); }; // a name given on the attendance sheet carries over
  wish.addEventListener('focus', () => { if (needName()) wishForm.classList.add('ask-name'); });
  wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    wishErr.textContent = '';
    const m = wish.value.trim();
    if (!m) { wishErr.textContent = F.needWish; wish.focus(); return; }
    if (needName()) { wishForm.classList.add('ask-name'); wishErr.textContent = F.needName; who.focus(); return; }
    const n = who.value.trim();
    wishSend.disabled = true;
    try {
      await post({ kind: 'wish', name: n, message: m });
      remember({ name: n });
      wish.value = '';
      wishForm.classList.remove('ask-name');
      toast(F.wishSent);
    } catch {
      wishErr.textContent = F.failed;
    }
    wishSend.disabled = false;
  });

  return { button: wrap, wishes: wishForm };
}
