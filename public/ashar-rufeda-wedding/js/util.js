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

/* Google Calendar's event-creation screen with the ceremony filled in. The time is the India wall-clock time with
   ctz naming the zone, so it lands at the right moment for a guest anywhere. No end time was supplied, so the entry
   ends when it starts (nothing is invented) unless the config gives the ceremony a length in `minutes`. */
export function addMinutes(local, minutes) {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/.exec(local);
  const d = new Date(Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5] + Number(minutes), +m[6]));
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`;
}
export function googleCalendarUrl({ title, local, minutes, allDay, timeZone, location, details }) {
  /* an event with no clock time (the Nikah, "After Jumma Namaz") is an all-day entry on its date */
  if (allDay) {
    const d = new Date(Date.UTC(+allDay.slice(0, 4), +allDay.slice(4, 6) - 1, +allDay.slice(6, 8) + 1)), p = (n) => String(n).padStart(2, '0');
    const next = `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}`;
    return 'https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${allDay}/${next}`, ctz: timeZone, location, details }).toString();
  }
  const end = minutes ? addMinutes(local, minutes) : local;
  return 'https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${local}/${end}`, ctz: timeZone, location, details }).toString();
}
/* A guest who is not signed in to Google would be sent by that address to Google's product page and lose the event,
   so the link goes through Google's own sign-in address with the event as its destination. On Android the direct
   address is used: the Google Calendar app opens it itself. */
export function calendarHref(ev) {
  const direct = googleCalendarUrl(ev);
  return /Android/i.test(navigator.userAgent) ? direct : 'https://accounts.google.com/ServiceLogin?' + new URLSearchParams({ service: 'cl', continue: direct }).toString();
}

/* fade in each page's content as it scrolls into view */
export function observePages(root) {
  if (!('IntersectionObserver' in window)) { root.classList.add('no-io'); return; } // nothing ever stays hidden
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  }, { threshold: 0.15 });
  root.querySelectorAll('.page').forEach((p) => io.observe(p));
}
