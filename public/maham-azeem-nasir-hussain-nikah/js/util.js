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

/* Google Calendar's event-creation screen with the ceremony filled in. Start and end are the wall-clock times at the
   venue with ctz naming its zone (Asia/Karachi), so the entry lands at the right moment for a guest anywhere. */
export function googleCalendarUrl({ title, local, localEnd, timeZone, location, details }) {
  return 'https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${local}/${localEnd}`, ctz: timeZone, location, details }).toString();
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
