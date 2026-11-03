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

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* localStorage that never throws (private mode, blocked storage) */
export const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* fine */ } },
};
/* one anonymous id per browser, so a guest's RSVP and dua belong together */
export function guestId(prefix) {
  let id = store.get(`${prefix}:guest`);
  if (!id) { id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36); store.set(`${prefix}:guest`, id); }
  return id;
}

let toastEl, toastTimer;
export function toast(msg, ms = 3400) {
  if (!toastEl) { toastEl = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(toastEl); }
  toastEl.textContent = msg;
  toastEl.classList.add('shown');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('shown'), ms);
}

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
  a.download = `${title.replace(/\W+/g, '-').toLowerCase()}.ics`;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/* Google Maps: the configured link, else a search for the address */
export const placeOf = (ev) => [ev.venue, ...(ev.address || [])].filter(Boolean).join(' ').replace(/,\s*,/g, ',').replace(/,\s*$/, '');
export function mapsHref(ev) {
  if (ev.mapsUrl) return ev.mapsUrl;
  const q = placeOf(ev);
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : '';
}

/* fade in each page's overlays as it scrolls into view */
export function observePages(root) {
  if (!('IntersectionObserver' in window)) { root.classList.add('no-io'); return; } // nothing ever stays hidden
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  }, { threshold: 0.15 });
  root.querySelectorAll('.page').forEach((p) => io.observe(p));
}
