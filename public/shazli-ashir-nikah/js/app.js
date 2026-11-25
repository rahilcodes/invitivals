/* Shazli & Ashir — the Muslim Emerald invitation (reference: /muslim-emerald-wedding/) with the client's text set
   live on the design's clean plates. Same order and interactions as the reference, without its film, its couple
   page and its Need Help panel (client):
     doors (tap) → main invitation → Save the Date (scratch card) → Our Functions (View Details opens each
     function's own page) → RSVP → thank you.
   Both links run this file; config.js decides which function cards are shown. */
import { config as C } from '../config.js?v=7';

const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v; else if (k === 'html') el.innerHTML = v; else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
};
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const ICON = {
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>',
  dish: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 17h18M5 17a7 7 0 0 1 14 0M12 8V6M10 6h4"/></svg>',
  send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2.5 11.2 21 3.5l-7.7 18.5-2.4-7.4-8.4-3.4zm8.9 3.1 1.5 4.6L18.2 6l-12.9 5.3 5.3 2.1 4.9-4.9-4.1 5.8z"/></svg>',
  hand: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.8-2.4L4.6 15.4a1.5 1.5 0 0 1 2.3-1.9L9 15.5"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>',
  form: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
};
const chev = '<i class="chev" aria-hidden="true"></i>';
const pill = (label, icon, attrs = {}, cls = 'solid') => h(attrs.href ? 'a' : 'button', { type: attrs.href ? null : 'button', ...attrs, class: `pill ${cls} ${attrs.class || ''}`, html: `${icon ? ICON[icon] : ''}<span>${label}</span>` });

/* a page = one plate at its own proportions; overlays are placed in percent of the plate (x, y = centre) */
function page(cls, art, w, hgt, ...kids) {
  const p = h('section', { class: `page ${cls}`, style: `aspect-ratio:${w}/${hgt}` },
    h('img', { class: 'bg', src: `assets/${art}`, alt: '', width: w, height: hgt, decoding: 'async', loading: cls.includes('hero') ? 'eager' : 'lazy' }));
  p.append(...kids.flat(3).filter(Boolean));
  return p;
}
const at = (node, { x = 50, y, w, top = false, cls = '' }) => h('div', { class: `el ${top ? 'from-top' : ''} ${cls}`, style: `left:${x}%;top:${y}%;${w ? `width:${w}%;` : ''}` }, node);

/* ── calendar: Google Calendar on Android/desktop, an .ics on Apple; start time only (no end time was supplied) ── */
const stamp = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const isApple = () => /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);
function addToCalendar(ev) {
  const title = `${ev.title} · ${C.bride} & ${C.groomFull}`;
  const where = ev.venue ? (ev.location || C.venue.full) : '';
  if (isApple()) {
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Invitation//EN', 'BEGIN:VEVENT', `UID:${ev.key}-${C.slug}@invitivals.com`, `DTSTAMP:${stamp(Date.now())}`, `DTSTART:${stamp(ev.start)}`,
      `SUMMARY:${title}`, `LOCATION:${where.replace(/,/g, '\\,')}`, 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
    const a = h('a', { href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })), download: `${ev.key}.ics` });
    document.body.append(a); a.click(); a.remove();
    return;
  }
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${stamp(ev.start)}/${stamp(ev.start)}`, location: where, ctz: 'Asia/Kolkata' });
  window.open(`https://calendar.google.com/calendar/render?${q}`, '_blank', 'noopener');
}
const mapLink = (cls = 'solid') => pill('View on Map', 'pin', { href: C.venue.mapsUrl, target: '_blank', rel: 'noopener', 'aria-label': `Open ${C.venue.full} in Google Maps` }, cls);

/* ── 1 · main invitation: the reference's own plate (its painted Bismillah, "Wedding Invitation" and ornaments are
   kept exactly); below the first divider the client's wording is set in the reference's hierarchy — tracked caps for
   the invitation lines (the mother's name in bold at the same size), the reference's ornament, the names in bold
   serif with each family's names in small caps under them (as "MBBS" sits in the reference). ── */
const orn = () => h('img', { class: 'orn', src: 'assets/ornament.webp', alt: '', width: 200, height: 48, 'aria-hidden': 'true' });
const hero = page('hero', 'hero.webp', 941, 1672,
  h('p', { class: 'vh', lang: 'ar' }, 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — Wedding Invitation'),
  at(h('div', { class: 'invite-text' },
    h('p', { class: 'caps' }, h('b', {}, C.host), h('br'), 'requests the pleasure of', h('br'), 'your company on the joyous', h('br'), 'occasion of the wedding', h('br'), 'ceremony of her daughter'),
    orn(),
    h('p', { class: 'name' }, C.bride),
    h('p', { class: 'sub' }, `Daughter of ${C.brideParents[0]}`, h('br'), `& ${C.brideParents[1]}`),
    h('p', { class: 'with' }, 'with'),
    h('p', { class: 'name' }, C.groom[0], h('br'), C.groom[1]),
    h('p', { class: 'sub' }, `Son of ${C.groomParents[0]}`, h('br'), `& ${C.groomParents[1]}`)), { y: 25.2, w: 58, top: true }));

/* ── 2 · Save the Date: the reference's scratch card. The date sits on the revealed plaque UNDER an opaque gold
   cover drawn on a canvas; nothing of it shows until the cover is rubbed away with a finger or the mouse. ── */
const S = C.saveTheDate;
const PLATE = { x: 50.2, y: 51, w: 57.8, h: 21.6 }, SEAL = { cx: 1.03, cy: 0.79, r: 0.112 }; // the reference's measures
const canvas = h('canvas', { class: 'scratch', 'aria-hidden': 'true' });
const under = h('div', { class: 'under' }, h('img', { src: 'assets/plate-reveal.webp', alt: '', width: 880, height: 581 }),
  h('div', { class: 'date' }, h('b', {}, S.day), h('span', {}, S.month)));
const box = h('div', { class: 'scratch-box', role: 'img', 'aria-label': 'Scratch the gold plate to reveal the date' }, under, canvas);
const live = h('p', { class: 'vh', role: 'status', 'aria-live': 'polite' });
const hint = h('button', { type: 'button', class: 'pill hint-pill', 'aria-label': 'Scratch to reveal the date (keyboard: press to reveal)', html: `<span>Scratch to Reveal</span>${ICON.hand}` });
/* "Save the Date" stays where the reference has it; In shaa Allah (gold calligraphy, the Bismillah's gold) and
   "A new chapter begins" directly under it form one block where the reference's tagline sits, under the plaque */
const save = page('save', 'save.webp', 941, 1672,
  at(h('p', { class: 'std' }, 'Save the Date'), { y: 35.2, w: 80 }),
  h('div', { class: 'el plate', style: `left:${PLATE.x}%;top:${PLATE.y}%;width:${PLATE.w}%;height:${PLATE.h}%` }, box),
  at(h('div', { class: 'blessing' }, h('p', { class: 'inshallah', lang: 'ar', dir: 'rtl' }, S.arabic), h('p', { class: 'line' }, S.line)), { y: 63.2, w: 72, top: true }),
  at(hint, { y: 79.4, w: 50 }), at(live, { y: 90, w: 10 }));
{
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const cover = new Image(); cover.src = 'assets/plate-cover.webp';
  let W = 0, H = 0, revealed = false, painted = false, strokes = 0;
  const paint = () => {
    const r = box.getBoundingClientRect(); if (!r.width) return;
    const dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    if (cover.complete && cover.naturalWidth) ctx.drawImage(cover, 0, 0, W, H); else { ctx.fillStyle = '#c99c45'; ctx.fillRect(0, 0, W, H); }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(SEAL.cx * W, SEAL.cy * H, SEAL.r * W, 0, Math.PI * 2); ctx.fill(); // the painted seal stays in view
    painted = true; box.classList.add('ready');
  };
  cover.onload = () => { if (!revealed) paint(); };
  new ResizeObserver(() => { if (!revealed && (!painted || Math.abs(W - box.clientWidth) > 1)) paint(); }).observe(box);
  /* the share of the plate actually cleared, read from the canvas itself */
  const cleared = () => {
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data; let clear = 0, n = 0;
    for (let i = 3; i < d.length; i += 4 * 16) { n++; if (d[i] < 40) clear++; }
    return clear / n;
  };
  const rub = (x, y) => { ctx.beginPath(); ctx.arc(x, y, Math.max(14, W * 0.075), 0, Math.PI * 2); ctx.fill(); };
  const reveal = () => {
    if (revealed) return; revealed = true;
    canvas.classList.add('gone'); box.classList.add('revealed'); hint.classList.add('is-done');
    live.textContent = `The date: ${S.day} ${S.month}`;
    setTimeout(() => canvas.remove(), reduced() ? 50 : 1300);
  };
  let down = false, last = null;
  const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  canvas.addEventListener('pointerdown', (e) => { if (revealed) return; down = true; canvas.setPointerCapture(e.pointerId); last = pos(e); rub(...last); e.preventDefault(); });
  canvas.addEventListener('pointermove', (e) => {
    if (!down || revealed) return;
    const p = pos(e), d = Math.hypot(p[0] - last[0], p[1] - last[1]), n = Math.ceil(d / 5);
    for (let i = 1; i <= n; i++) rub(last[0] + (p[0] - last[0]) * i / n, last[1] + (p[1] - last[1]) * i / n);
    last = p; e.preventDefault();
    if (++strokes % 8 === 0 && cleared() > 0.55) reveal();
  });
  const up = () => { if (down && !revealed && cleared() > 0.55) reveal(); down = false; };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  /* the pill is the instruction; only a keyboard press (no pointer) uses it to reveal, for guests who cannot scratch */
  hint.addEventListener('click', (e) => { if (e.detail === 0) reveal(); else { hint.classList.add('nudge'); setTimeout(() => hint.classList.remove('nudge'), 600); } });
}

/* ── 3 · Our Functions: the reference's card plate; text and the green View Details pills on each card ──
   Positions are in pixels of the 941-wide plate: card k's text panel starts 277.6 + 340.3·k from the top. */
const FN = C.events.length > 2 ? { art: 'functions.webp', H: 1672 } : { art: 'functions-2.webp', H: 993 };
const py = (px) => (px / FN.H) * 100;
const icoRow = (icon, text, cls = '') => h('p', { class: `row ${cls}`, html: `${ICON[icon]}<span>${text}</span>` });
const cards = C.events.map((ev, k) => {
  const top = 277.6 + 340.3 * k;
  const open = pill('View Details', '', { 'aria-haspopup': 'dialog', 'aria-label': `View details of ${ev.title}`, class: 'view' });
  open.insertAdjacentHTML('beforeend', chev);
  open.addEventListener('click', () => openDetail(ev, open));
  return [
    h('div', { class: 'el card-text', style: `left:57%;top:${py(top - 8)}%;width:34%;height:${py(216)}%` },
      h('h3', {}, ev.title),
      icoRow('cal', ev.date),
      icoRow('clock', ev.time),
      ev.extra && icoRow('dish', ev.extra),
      ev.venue && icoRow('pin', C.venue.name, 'venue')),
    at(open, { x: 69.8, y: py(top + 248), w: 27.6 }),
  ];
});
const functions = page(`functions n${C.events.length}`, FN.art, 941, FN.H,
  at(h('h2', {}, 'Our Functions'), { y: py(122), w: 80 }),
  at(h('p', { class: 'intro' }, 'Join us in a beautiful celebration', h('br'), 'of love, faith and family.'), { y: py(181), w: 70 }),
  cards);

/* ── function details: the reference's pages 6–9 as a full-screen view over the invitation ── */
/* [plate, top of the date block in % of the page, the plate paints its own gold lines around the title].
   27 Nov: the Mehendi and Nikah plates paint a gold line at 7.9% and 16.8% of the page (x 268–672 of 941, centred on
   the page); every title is centred between those two heights, and on Mayun and Rukhsati (plain plates) the same two
   lines are drawn at the same places, so all four pages share one heading geometry. The date blocks sit lower than
   before, each by what its own artwork allows (Mehendi between its painted diamond and its rule at 79.6%). */
/* 25 Nov: the gold rule painted across the Mehendi and Nikah date blocks is taken out of those plates (the build tool), so
   Mehendi's group sits where Mayun's does, in the same sizes, and Nikah's lines get room to breathe */
const PLATES = { mayun: ['d-mayun.webp', 75.2, false], mehendi: ['d-mehendi.webp', 75.2, true], nikah: ['d-nikah.webp', 64.8, true], rukhsati: ['d-rukhsati.webp', 72.0, false] };
const LINE_TOP = 7.9, LINE_BOTTOM = 16.8;
let current = null;
function detailPage(ev) {
  const [art, y, painted] = PLATES[ev.key];
  return page(`detail-page d-${ev.key}`, art, 941, 1672,
    !painted && at(h('i', { class: 'flour', 'aria-hidden': 'true' }), { y: LINE_TOP, w: 43 }),
    at(h('div', { class: 'd-title' }, h('h2', {}, ev.title)), { y: (LINE_TOP + LINE_BOTTOM) / 2, w: 86 }),
    !painted && at(h('i', { class: 'flour', 'aria-hidden': 'true' }), { y: LINE_BOTTOM, w: 43 }),
    at(h('div', { class: 'd-info' },
      h('p', { class: 'wd' }, ev.weekday),
      h('p', { class: 'dt' }, ev.date),
      h('p', { class: 'tm' }, ev.time),
      ev.extra && h('p', { class: 'tm' }, ev.extra),
      ev.venue && h('i', { class: 'rule', 'aria-hidden': 'true' }),
      /* the venue as the client set it (26 Nov), one line each: the name lines in the venue type, the city under them */
      ev.venue && ev.venueLines.slice(0, -1).map((l) => h('p', { class: 'vn' }, l)),
      ev.venue && h('p', { class: 'vc' }, ev.venueLines.at(-1)),
      h('div', { class: 'acts' }, ev.venue && mapLink(), pill('Add to Calendar', 'cal', { onclick: () => addToCalendar(ev) }, ev.venue ? 'line' : 'solid'))), { y, w: 84, top: true }));
}
function openDetail(ev, opener) {
  if (current) return;
  const scrollY = window.scrollY;
  history.pushState({ detail: ev.key }, '');
  const back = h('button', { class: 'back', type: 'button' }, 'Back to Functions');
  const view = h('div', { class: 'detail', role: 'dialog', 'aria-modal': 'true', 'aria-label': `${ev.title} details` }, back, h('div', { class: 'column' }, detailPage(ev)));
  document.body.append(view);
  document.body.style.cssText = `position:fixed;top:-${scrollY}px;width:100%`;
  requestAnimationFrame(() => { view.classList.add('shown'); view.querySelector('.page').classList.add('on'); });
  back.focus({ preventScroll: true });
  current = { view, scrollY, opener };
  back.addEventListener('click', () => history.back());
  view.addEventListener('keydown', (e) => { if (e.key === 'Escape') history.back(); });
}
addEventListener('popstate', () => {
  if (!current) return;
  const { view, scrollY, opener } = current; current = null;
  view.classList.remove('shown');
  document.body.style.cssText = '';
  window.scrollTo(0, scrollY);
  setTimeout(() => view.remove(), 450);
  opener.focus({ preventScroll: true });
});

/* ── 4 · RSVP (25 Nov): the reference's compact form on its own paper arch (paper.webp, 941 x 1672) — heading, the
   reference's wording, the form, Send Response and the help line, in one flow. Replies are stored on our server by
   /shazli-ashir-wedding/rsvp.php (both links; each reply records its link) and are read by the family at
   /admin/shazli-ashir-rsvp/ with a CSV at /admin/shazli-ashir-rsvp/export/ (both open without sign-in since 26 Nov). ── */
/* 26 Nov (client): only three fields, in this order — attendance, guest name, number of guests attending (a list,
   shown only for "Yes") — then Send Response and the help line. No contact number. */
const choice = (value, text) => h('label', {}, h('input', { type: 'radio', name: 'attending', value }), h('i', { class: 'ring', 'aria-hidden': 'true' }), h('span', {}, text));
const send = pill('Send Response', 'send', { type: 'submit', class: 'send' });
send.type = 'submit';
const note = h('p', { class: 'note', role: 'status', 'aria-live': 'polite' });
const guestList = h('select', { name: 'guests', 'aria-label': 'Number of guests attending' },
  h('option', { value: '', selected: true, disabled: true }, 'Number of Guests Attending'),
  ...Array.from({ length: C.rsvp.maxGuests }, (_, i) => h('option', { value: String(i + 1) }, i ? `${i + 1} Guests` : '1 Guest')));
const form = h('form', { class: 'rsvp-form', novalidate: true, 'aria-label': 'RSVP' },
  h('fieldset', { class: 'choices' }, h('legend', { class: 'vh' }, 'Will you attend?'), choice('yes', C.rsvp.choices[0]), choice('no', C.rsvp.choices[1])),
  h('label', { class: 'field' }, h('span', { class: 'vh' }, 'Guest name'), h('input', { name: 'name', autocomplete: 'name', maxlength: 80, required: true, placeholder: 'Guest Name' })),
  h('label', { class: 'field select guests' }, h('span', { class: 'vh' }, 'Number of guests attending'), guestList, h('i', { class: 'caret', 'aria-hidden': 'true' })),
  h('input', { name: 'website', class: 'vh', tabindex: -1, autocomplete: 'off', 'aria-hidden': 'true' }),
  send, note);
/* a guest who declines is not asked for a number */
form.addEventListener('change', () => { const no = form.elements.attending.value === 'no'; form.querySelector('.guests').hidden = no; if (no) guestList.selectedIndex = 0; });
guestList.addEventListener('change', () => guestList.classList.toggle('picked', !!guestList.value));
let sending = false;
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (sending) return;                                         // no second send while one is on its way
  const el = form.elements;
  const name = el.name.value.trim(), attending = el.attending.value;
  const bad = (msg, input) => { note.className = 'note bad'; note.textContent = msg; if (input) input.focus(); };
  if (!attending) return bad(`Please choose “${C.rsvp.choices[0]}” or “${C.rsvp.choices[1]}”.`);
  if (name.length < 2) return bad('Please enter your name.', el.name);
  const guests = attending === 'yes' ? Math.round(+guestList.value || 0) : 0;
  if (attending === 'yes' && (guests < 1 || guests > C.rsvp.maxGuests)) return bad('Please choose the number of guests attending.', guestList);
  sending = true; send.disabled = true; note.className = 'note'; note.textContent = 'Sending…';
  try {
    const r = await fetch(C.rsvp.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, attending, guests, link: C.link, website: el.website.value }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) throw new Error(j.error || 'Your reply could not be sent. Please try again.');
    /* shown only after the server has confirmed that the reply is stored */
    form.replaceChildren(h('p', { class: 'done' }, attending === 'yes' ? 'Thank you! Your reply has been received. We look forward to welcoming you.' : 'Thank you for letting us know. You will be missed.'));
  } catch (err) {
    sending = false; send.disabled = false; note.className = 'note bad';
    note.textContent = /fetch|network/i.test(err.message) ? 'Your reply could not be sent. Please check your connection and try again.' : err.message;
  }
});
const rsvp = page('rsvp', 'paper.webp', 941, 1672,
  at(h('div', { class: 'rsvp-in' },
    h('h2', {}, 'RSVP'),
    h('p', { class: 'lead' }, 'Your presence and blessings mean the world to us.', h('br'), 'Kindly let us know if you will be joining', h('br'), 'our celebrations.'),
    form,
    C.rsvp.googleForm && h('div', { class: 'gform' }, h('p', {}, 'Or reply on Google Forms (the family’s Google Sheet)'), pill('Open Google Form', 'form', { href: C.rsvp.googleForm, target: '_blank', rel: 'noopener' }, 'line')),
    h('p', { class: 'help' }, `${C.rsvp.help} `, h('a', { href: `tel:${C.rsvp.tel}` }, C.rsvp.phone), '.')), { y: 14.2, w: 64, top: true }));

/* ── 5 · thank you (the reference's closing plate; its Call / WhatsApp / Email bars are painted out) ── */
const thanks = page('thanks', 'thanks.webp', 941, 1672,
  at(h('img', { class: 'mono', src: 'assets/monogram.webp', alt: 'SA monogram', width: 600, height: 641, loading: 'lazy' }), { y: 42.2, w: 22 }),
  at(h('div', { class: 'thanks-text' }, h('p', { class: 't1' }, C.thanks[0]), h('p', { class: 't2' }, C.thanks[1], h('br'), C.thanks[2])), { y: 56.2, w: 64 }));

const main = h('main', { class: 'invitation', id: 'invitation' }, hero, save, functions, rsvp, thanks);
document.getElementById('app').append(main);

/* each page fades its words in as it arrives */
const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { threshold: 0.15 }) : null;

/* ── music: ONE player for the whole invitation, started by the opening tap; never restarted ── */
const music = new Audio(C.music); music.loop = true; music.preload = 'auto';
const mbtn = h('button', { class: 'audio', type: 'button', 'aria-label': 'Pause music', html:
  '<svg class="on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>' +
  '<svg class="off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/><path d="M3 3l18 18" stroke-width="1.8"/></svg>' });
const showMusic = () => { const off = music.paused; mbtn.classList.toggle('muted', off); mbtn.setAttribute('aria-label', off ? 'Play music' : 'Pause music'); };
let wanted = true;
mbtn.addEventListener('click', () => { if (music.paused) { wanted = true; music.play().catch(showMusic); } else { wanted = false; music.pause(); } });
music.addEventListener('play', showMusic); music.addEventListener('pause', showMusic);
document.addEventListener('visibilitychange', () => { if (!document.documentElement.classList.contains('is-open')) return; if (document.hidden) music.pause(); else if (wanted) music.play().catch(showMusic); });
document.body.append(mbtn);

/* ── opening (24 Nov): no film. One tap starts the song; the two door leaves (lifted out of the door plate) swing
   open inwards, warm light and the palace walk show through the doorway, gold confetti bursts from the opening,
   and the view moves through the doorway onto the invitation. About 2.4 s in all. ── */
const tap = h('button', { class: 'tap', type: 'button', 'aria-label': 'Tap to open the invitation' }, h('span', { class: 'ring', 'aria-hidden': 'true' }));
const doorway = h('div', { class: 'doorway' },
  h('img', { class: 'art', src: 'assets/doors.webp', alt: 'Emerald and gold doors of the invitation', fetchpriority: 'high' }),
  h('div', { class: 'through', 'aria-hidden': 'true' }, h('img', { src: 'assets/door-in.webp', alt: '' }), h('i', { class: 'light' })),
  h('img', { class: 'leaf l', src: 'assets/door-l.webp', alt: '', 'aria-hidden': 'true' }),
  h('img', { class: 'leaf r', src: 'assets/door-r.webp', alt: '', 'aria-hidden': 'true' }),
  tap);
const opening = h('div', { class: 'opening' }, h('div', { class: 'frame' }, doorway));
document.body.append(opening);

/* confetti: gold, ivory and emerald paper; a burst from the doorway, then a light fall over the invitation */
function confetti(ox, oy) {
  if (reduced()) return;
  const c = h('canvas', { class: 'confetti', 'aria-hidden': 'true' });
  document.body.append(c);
  const ctx = c.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  const W = innerWidth, H = innerHeight; c.width = W * dpr; c.height = H * dpr; ctx.scale(dpr, dpr);
  const COLORS = ['#d9b45a', '#f3dfa2', '#b8862e', '#fff7e2', '#1f6b4c', '#e8c873', '#0f4a35'];
  const k = Math.max(0.8, Math.min(1.4, W / 420));
  const P = [];
  const add = (x, y, vx, vy, delay) => P.push({ x, y, vx, vy, delay, w: (5 + Math.random() * 6) * k, h: (3 + Math.random() * 4) * k, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3, flip: Math.random() * 6.28, vf: 0.08 + Math.random() * 0.12, col: COLORS[(Math.random() * COLORS.length) | 0], round: Math.random() < 0.22 });
  for (let i = 0; i < 150; i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.3, s = (5 + Math.random() * 9) * k; add(ox + (Math.random() - 0.5) * 30, oy + (Math.random() - 0.5) * 60, Math.cos(a) * s, Math.sin(a) * s - 2, 0); }
  for (let i = 0; i < 70; i++) add(Math.random() * W, -20 - Math.random() * 120, (Math.random() - 0.5) * 1.5, 1 + Math.random() * 1.5, 30 + Math.random() * 60);
  let t = 0;
  const tick = () => {
    t++; ctx.clearRect(0, 0, W, H); let alive = 0;
    const fade = t > 200 ? Math.max(0, 1 - (t - 200) / 60) : 1;
    for (const p of P) {
      if (t < p.delay) { alive++; continue; }
      p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.18; p.x += p.vx + Math.sin(p.flip) * 0.6; p.y += p.vy; p.r += p.vr; p.flip += p.vf;
      if (p.y > H + 30) continue; alive++;
      ctx.save(); ctx.globalAlpha = fade; ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.col;
      if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.h * 0.6, 0, 6.28); ctx.fill(); } else ctx.fillRect(-p.w / 2, (-p.h / 2) * Math.abs(Math.cos(p.flip)), p.w, p.h * Math.abs(Math.cos(p.flip)) + 0.5);
      ctx.restore();
    }
    if (alive && fade > 0) requestAnimationFrame(tick); else c.remove();
  };
  requestAnimationFrame(tick);
}

opening.addEventListener('click', () => {
  if (opening.classList.contains('opening-doors')) return;
  try { music.volume = C.musicVolume; } catch { /* iOS: fixed volume */ }
  music.play().catch(showMusic);
  mbtn.classList.add('shown'); showMusic();
  opening.classList.add('opening-doors');
  const r = doorway.getBoundingClientRect();
  const enter = () => {
    document.documentElement.classList.add('is-open');
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
    opening.classList.add('out');
    setTimeout(() => opening.remove(), 1300);
    main.querySelectorAll('.page').forEach((p) => (io ? io.observe(p) : p.classList.add('on')));
  };
  if (reduced()) { enter(); return; }
  setTimeout(() => confetti(r.left + r.width * 0.5, r.top + r.height * 0.45), 420);
  setTimeout(enter, 1350);
});
