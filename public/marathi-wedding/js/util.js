/* small helpers shared by the components */
export const h = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
};

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let toastEl, toastTimer;
export function toast(msg, ms = 3400) {
  if (!toastEl) { toastEl = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(toastEl); }
  toastEl.textContent = msg;
  toastEl.classList.add('shown');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('shown'), ms);
}

/* ── dates in India time, written in Marathi ── */
const IST = 'Asia/Kolkata';
export function partsOf(iso) {
  const d = new Date(iso);
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: IST, year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' });
  const p = Object.fromEntries(f.formatToParts(d).filter((x) => x.type !== 'literal').map((x) => [x.type, x.value]));
  const wd = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(p.weekday); // 0 = Monday
  return { day: Number(p.day), month: Number(p.month) - 1, year: Number(p.year), weekday: wd };
}
export const marathiDate = (iso, cfg) => { const p = partsOf(iso); return `${p.day} ${cfg.months[p.month]} ${p.year}`; };
export const marathiWeekday = (iso, cfg) => cfg.weekdayNames[partsOf(iso).weekday];

/* ── calendar: a valid .ics the phone opens in its calendar app ── */
const icsText = (s) => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
const stamp = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
export function downloadIcs({ title, start, end, location, details }) {
  const endIso = end || new Date(new Date(start).getTime() + 3 * 3600e3).toISOString();
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${stamp(start)}-${title.replace(/\W+/g, '-').toLowerCase()}@invitivals.com`,
    `DTSTAMP:${stamp(Date.now())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(endIso)}`,
    `SUMMARY:${icsText(title)}`, `DESCRIPTION:${icsText(details || '')}`, `LOCATION:${icsText(location || '')}`,
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(title)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  a.download = 'wedding.ics';
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/* Google Calendar "add event" link for the same event (Android and desktop) */
export function googleCalendarHref({ title, start, end, location, details }) {
  const endIso = end || new Date(new Date(start).getTime() + 3 * 3600e3).toISOString();
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${stamp(start)}/${stamp(endIso)}`, details: details || '', location: location || '', ctz: IST });
  return `https://calendar.google.com/calendar/render?${q}`;
}
export const isApple = () => /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);

/* saves one event: Google Calendar where it opens, else the .ics */
export function saveEvent(event, note) {
  if (isApple()) { downloadIcs(event); toast(note); return; }
  const w = window.open(googleCalendarHref(event), '_blank', 'noopener');
  if (!w) { downloadIcs(event); toast(note); }
}

/* Google Maps: the configured link, else a Google Maps search for the address */
export function mapsHref({ mapsUrl, venue, address }) {
  if (mapsUrl) return mapsUrl;
  const q = [venue, ...[].concat(address || [])].filter(Boolean).join(', ').replace(/,\s*,/g, ',');
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : '';
}

/* fade in each page's overlays as it scrolls into view */
export function observePages(root) {
  if (!('IntersectionObserver' in window)) { document.documentElement.classList.add('no-io'); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  }, { threshold: 0.15 });
  root.querySelectorAll('.page').forEach((p) => io.observe(p));
}

/* a bottom sheet over the invitation: Escape, the scrim and the back button close it */
let sheetOpen = null;
export function openSheet(title, body, { label, closeLabel = 'Close' } = {}) {
  if (sheetOpen) return null;
  const panel = h('div', { class: 'panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': label || title });
  const close = h('button', { class: 'close', type: 'button', 'aria-label': closeLabel, html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' });
  panel.append(h('h2', { class: 'sheet-title' }, title), close, body);
  const sheet = h('div', { class: 'sheet' }, panel);
  document.body.append(sheet);
  document.body.classList.add('locked');
  requestAnimationFrame(() => sheet.classList.add('shown'));
  history.pushState({ sheet: true }, '');
  const prev = document.activeElement;
  sheetOpen = sheet;
  function dismiss() {
    if (sheetOpen !== sheet) return; sheetOpen = null;
    sheet.classList.remove('shown');
    document.body.classList.remove('locked');
    window.removeEventListener('popstate', onPop);
    setTimeout(() => sheet.remove(), 400);
    if (prev && prev.focus) prev.focus({ preventScroll: true });
  }
  function onPop() { dismiss(); }
  window.addEventListener('popstate', onPop);
  const back = () => { if (sheetOpen === sheet) history.back(); };
  close.addEventListener('click', back);
  sheet.addEventListener('click', (e) => { if (e.target === sheet) back(); });
  sheet.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); back(); } });
  setTimeout(() => { const f = panel.querySelector('input, select, textarea, button:not(.close)'); if (f) f.focus({ preventScroll: true }); }, 60);
  return { close: back, el: sheet };
}
