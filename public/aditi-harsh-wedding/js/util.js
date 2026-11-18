/* small shared helpers */
const TZ = 'Asia/Kolkata';
const fmt = (opts) => new Intl.DateTimeFormat('en-IN', { timeZone: TZ, ...opts });

export const day = (iso) => fmt({ day: 'numeric' }).format(new Date(iso));
export const weekday = (iso) => fmt({ weekday: 'long' }).format(new Date(iso));
export const weekdayShort = (iso) => fmt({ weekday: 'short' }).format(new Date(iso));
export const month = (iso) => fmt({ month: 'long' }).format(new Date(iso));
export const monthShort = (iso) => fmt({ month: 'short' }).format(new Date(iso));
export const year = (iso) => fmt({ year: 'numeric' }).format(new Date(iso));
export const longDate = (iso) => `${day(iso)} ${month(iso)} ${year(iso)}`;

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* script faces draw a poor ampersand: set it in the italic serif instead */
export const escScript = (s) => esc(s).replace(/&amp;/g, '<span class="amp-i">&amp;</span>');

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const whatsappLink = (number, text) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

/* ── guest personalisation: invitivals.com/…/?to=Priya%20%26%20Family ── */
export const guestName = () => {
  const n = new URLSearchParams(location.search).get('to');
  return n ? n.trim().replace(/\s+/g, ' ').slice(0, 60) : '';
};

/* ── calendar. No end time was supplied for any function, so none is invented: the Google Calendar entry starts
      and ends at the same moment (the guest sets its length), written as the wall-clock time at the venue with
      ctz naming its zone; the .ics files (one per function, beside index.html) carry the start only. ── */
const wall = (iso) => new Intl.DateTimeFormat('sv-SE', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(new Date(iso)).replace(/[-:]/g, '').replace(' ', 'T');
export function googleCalendarUrl({ title, start, details = '', location = '' }) {
  return 'https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${wall(start)}/${wall(start)}`, ctz: TZ, location, details }).toString();
}
/* a guest who is not signed in to Google would be sent to Google's product page and lose the event, so the link goes
   through Google's own sign-in address with the event as its destination; on Android the Calendar app opens it itself */
export const googleCalendarHref = (ev) => {
  const direct = googleCalendarUrl(ev);
  return /Android/i.test(navigator.userAgent) ? direct : 'https://accounts.google.com/ServiceLogin?' + new URLSearchParams({ service: 'cl', continue: direct }).toString();
};
/* one tap (the quick menu): Google Calendar on Android, the .ics file everywhere else (iOS opens it in Calendar) */
export function addToCalendar(ev) {
  if (/android/i.test(navigator.userAgent) || !ev.ics) { window.open(googleCalendarUrl(ev), '_blank', 'noopener'); return; }
  const a = document.createElement('a'); a.href = ev.ics; a.download = ev.ics; document.body.appendChild(a); a.click(); a.remove();
}

/* ── share the invitation (without the personal ?to= so each guest's link stays theirs) ── */
export async function shareInvite(text) {
  const url = location.origin + location.pathname;
  if (navigator.share) {
    try { await navigator.share({ title: document.title, text, url }); } catch { /* dismissed */ }
    return;
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noopener');
}

/* day state of an event relative to today in India: past | today | future */
export const dayState = (iso) => {
  const d = (x) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(x);
  const a = d(new Date(iso)), b = d(new Date());
  return a < b ? 'past' : a === b ? 'today' : 'future';
};
