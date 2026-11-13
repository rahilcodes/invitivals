/* Sheet — one accessible dialog for the function details (time, venue, Directions, Add to Calendar) and
   for the gift details. Focus is trapped, Escape and the backdrop close it, Back returns the focus and the
   scroll position to where the guest was. */
import { h, icons, lines, lockScroll, unlockScroll, downloadIcs, mapsHref } from './util.js?v=5';

export function Sheet() {
  const body = h('div', { class: 'sheet-body' });
  const title = h('h2', { class: 'sheet-title', id: 'sheet-title' });
  const back = h('button', { class: 'back', type: 'button' }, h('span', { html: icons.arrow }), h('span', { class: 'back-word' }, 'Back'));
  const closeBtn = h('button', { class: 'sheet-close', type: 'button', 'aria-label': 'Close', html: icons.close });
  const box = h('div', { class: 'sheet-box', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'sheet-title' }, closeBtn, title, body, back);
  const sheet = h('div', { class: 'sheet', hidden: true }, h('div', { class: 'sheet-backdrop' }), box);
  document.body.append(sheet);

  let opener = null;
  const focusables = () => [...box.querySelectorAll('a[href], button, input, [tabindex]:not([tabindex="-1"])')].filter((el) => !el.disabled && el.offsetParent !== null);
  function open(from) {
    opener = from || document.activeElement;
    sheet.hidden = false;
    lockScroll();
    requestAnimationFrame(() => { sheet.classList.add('shown'); setTimeout(() => (focusables()[1] || closeBtn).focus({ preventScroll: true }), 60); });
  }
  function close() {
    sheet.classList.remove('shown');
    setTimeout(() => { sheet.hidden = true; unlockScroll(); if (opener && opener.focus) opener.focus({ preventScroll: true }); }, 320);
  }
  closeBtn.addEventListener('click', close);
  back.addEventListener('click', close);
  sheet.querySelector('.sheet-backdrop').addEventListener('click', close);
  sheet.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') {
      const f = focusables(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  return {
    /* a function: ev from config.schedule.events */
    event(ev, cfg, couple, from) {
      title.textContent = ev.title;
      back.querySelector('.back-word').textContent = cfg.detail.back;
      const rows = [
        h('p', { class: 'sheet-line' }, h('span', { class: 'ico', html: icons.calendar }), cfg.detail.date),
        h('p', { class: 'sheet-line' }, h('span', { class: 'ico', html: icons.clock }), ev.time),
      ];
      if (ev.venue) rows.push(h('p', { class: 'sheet-line' }, h('span', { class: 'ico', html: icons.pin }), h('span', {}, h('b', {}, ev.venue), h('br'), lines(ev.address))));
      if (ev.note) rows.push(h('p', { class: 'sheet-note' }, lines(ev.note)));
      const acts = [];
      const maps = mapsHref(ev);
      if (maps) acts.push(h('a', { class: 'btn gold', href: maps, target: '_blank', rel: 'noopener' }, h('span', { html: icons.pin }), cfg.detail.directions));
      if (ev.start) acts.push(h('button', { class: 'btn', type: 'button', onclick: () => downloadIcs({ title: `${ev.title} · ${couple.groom} & ${couple.bride}`, start: ev.start, end: ev.end, location: [ev.venue, ...(ev.address || [])].filter(Boolean).join(', '), details: [ev.time, ...(ev.note ? [].concat(ev.note) : [])].join('\n'), url: maps }) }, h('span', { html: icons.calendar }), cfg.detail.calendar));
      body.replaceChildren(...rows, h('div', { class: 'sheet-actions' }, acts));
      open(from);
    },
    /* the gift details, or the note that they are still to come */
    gift(cfg, from) {
      title.textContent = cfg.title;
      back.querySelector('.back-word').textContent = 'Back';
      const items = cfg.details.length
        ? cfg.details.map((d) => h('p', { class: 'sheet-line' }, h('span', {}, h('b', {}, d.label), h('br'), /^https?:/.test(d.value) ? h('a', { href: d.value, target: '_blank', rel: 'noopener' }, d.value) : d.value)))
        : [h('p', { class: 'sheet-note' }, cfg.note)];
      body.replaceChildren(h('p', { class: 'sheet-sub' }, cfg.sub), ...items);
      open(from);
    },
    close,
  };
}
