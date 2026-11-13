/* small helpers shared by the components */
export const h = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') { for (const [p, val] of Object.entries(v)) { if (p.startsWith('--')) el.style.setProperty(p, val); else el.style[p] = val; } }
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
};

/* lines of text with <br> between them: lines(['a', 'b']) */
export const lines = (arr) => (Array.isArray(arr) ? arr : [arr]).flatMap((l, i) => (i ? [h('br'), l] : [l]));

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let toastEl, toastTimer;
export function toast(msg, ms = 3200) {
  if (!toastEl) { toastEl = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(toastEl); }
  toastEl.textContent = msg;
  toastEl.classList.add('shown');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('shown'), ms);
}

/* ── scroll lock that gives the same position back (iOS included) ── */
let lockY = 0, locks = 0;
export function lockScroll() {
  if (locks++) return;
  lockY = scrollY;
  Object.assign(document.body.style, { position: 'fixed', top: `-${lockY}px`, left: '0', right: '0', width: '100%' });
  document.body.classList.add('locked');
}
export function unlockScroll() {
  if (--locks > 0) return; locks = 0;
  Object.assign(document.body.style, { position: '', top: '', left: '', right: '', width: '' });
  document.body.classList.remove('locked');
  scrollTo({ top: lockY, behavior: 'instant' });
}

/* ── calendar: a valid .ics the phone opens in its calendar app ── */
const icsText = (s) => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
const stamp = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
export function downloadIcs({ title, start, end, location, details, url }) {
  const endIso = end || new Date(new Date(start).getTime() + 2 * 3600e3).toISOString();
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${stamp(start)}-${title.replace(/\W+/g, '-').toLowerCase()}@invitivals.com`,
    `DTSTAMP:${stamp(Date.now())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(endIso)}`,
    `SUMMARY:${icsText(title)}`, `DESCRIPTION:${icsText(details || '')}`, `LOCATION:${icsText(location || '')}`,
    url ? `URL:${url}` : null,
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(title)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR', '',
  ].filter((l) => l !== null).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  a.download = `${title.replace(/\W+/g, '-').toLowerCase()}.ics`;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/* Google Maps: the configured link, else a search for the venue and address */
export function mapsHref(v) {
  if (v.mapsUrl) return v.mapsUrl;
  const q = [v.venue || v.name, ...(v.address || [])].filter(Boolean).join(', ');
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : '';
}

/* every .reveal block enters once when it first scrolls into view; anything a browser could not
   observe is shown after a moment, so nothing ever stays hidden */
export function observeReveals(root) {
  const blocks = [...root.querySelectorAll('.reveal')];
  if (!('IntersectionObserver' in window)) { blocks.forEach((b) => b.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  blocks.forEach((b) => io.observe(b));
  setTimeout(() => blocks.forEach((b) => { if (b.getBoundingClientRect().top < innerHeight) b.classList.add('in'); }), 2500);
}

/* the gold line icons the pack does not supply, drawn in the same single-stroke style */
export const icons = {
  clock: '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="18"/><path d="M24 12v12l8 5"/></svg>',
  cutlery: '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8v10a5 5 0 0 0 10 0V8M19 8v32M19 23v17"/><path d="M34 8c-3 0-5 4-5 10 0 5 2 7 5 7v15"/></svg>',
  family: '<svg viewBox="0 0 64 40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="12" r="6"/><circle cx="46" cy="12" r="6"/><circle cx="32" cy="18" r="5"/><path d="M4 36c0-8 6-13 14-13 3 0 6 .8 8 2.2M60 36c0-8-6-13-14-13-3 0-6 .8-8 2.2M22 38c0-6 4-10 10-10s10 4 10 10"/></svg>',
  person: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M3 5h18a1 1 0 0 1 1 1v1l-10 6L2 7V6a1 1 0 0 1 1-1zm-1 4.5 10 6 10-6V18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/></svg>',
  people: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="3"/><path d="M2 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5zM15.5 13.6c3.6.2 6.5 2.4 6.5 6.4h-4.3c0-2.6-.8-4.8-2.2-6.4z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm3 4v2h10V8zm0 4v2h7v-2z"/></svg>',
  envelope: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  gift: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="9" width="18" height="12" rx="1.5"/><path d="M3 13h18M12 9v12M7.5 9c-2 0-3-1.2-3-2.5S5.5 4 7 4c2 0 3.5 2.5 5 5 1.5-2.5 3-5 5-5 1.5 0 2.5 1.2 2.5 2.5S18.5 9 16.5 9z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 20.5s-7.5-4.6-7.5-10A4 4 0 0 1 12 8a4 4 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z"/></svg>',
  hand: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V11m0-3.5a1.5 1.5 0 0 1 3 0V11m0-2a1.5 1.5 0 0 1 3 0v6.5A5.5 5.5 0 0 1 12.5 21H11a5 5 0 0 1-4.2-2.3L4 14.5a1.4 1.4 0 0 1 2.2-1.7L9 15.5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15m-5-5 5 5-5 5"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s6-6.5 6-11a6 6 0 0 0-12 0c0 4.5 6 11 6 11z"/><circle cx="12" cy="10" r="2.2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M7 5v14l12-7z"/></svg>',
  note: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>',
  mute: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="m16 9 5 6m0-6-5 6"/></svg>',
  sound: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/></svg>',
  replay: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v5h5"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
};
