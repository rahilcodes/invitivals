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

/* ── calendar: Google on Android, an .ics everywhere else (iOS opens it in Calendar) ── */
const stamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (s) => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
export function addToCalendar({ title, start, end, details = '', location = '' }) {
  end = end || new Date(new Date(start).getTime() + 3 * 36e5).toISOString();
  if (/android/i.test(navigator.userAgent)) {
    const u = new URL('https://calendar.google.com/calendar/render');
    u.search = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${stamp(start)}/${stamp(end)}`, details, location });
    window.open(u, '_blank', 'noopener');
    return;
  }
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Creativals//Wedding Invitation//EN', 'BEGIN:VEVENT',
    `UID:${stamp(start)}-${title.replace(/\W+/g, '-').toLowerCase()}@invitivals.com`,
    `DTSTAMP:${stamp(new Date().toISOString())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${icsText(title)}`, `DESCRIPTION:${icsText(details)}`, `LOCATION:${icsText(location)}`,
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(title)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = `${title.replace(/\W+/g, '-').toLowerCase()}.ics`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
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

/* ── calendar entries for this invitation: a Google Calendar link (opens the pre-filled "new event" page)
   and a static .ics file per event (Apple Calendar, Outlook). The invitation gives start times only, so
   each entry's end is an estimate (event.hours) and the description says so. ── */
const local = (iso) => iso.slice(0, 19).replace(/[-:]/g, '');
const plusHours = (iso, h) => {
  const t = new Date(new Date(iso).getTime() + h * 36e5);
  return new Intl.DateTimeFormat('sv-SE', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
    .format(t).replace(' ', 'T').replace(/[-:]/g, '');
};
export const calTitle = (cfg, e) => `${e.name}${e.subtitle ? ' ' + e.subtitle : ''} · ${cfg.pair[0]} & ${cfg.pair[1]}`;
export const calDetails = (cfg, e) => [
  `${e.name}${e.subtitle ? ' ' + e.subtitle : ''}: wedding celebrations of ${cfg.fullPair}.`,
  `Starts ${e.time}${e.note ? ' · ' + e.note : ''}. The end time in this entry is an estimate; the invitation gives the start time only.`,
  `Venue: ${e.place.name}`,
  `Google Maps: ${e.place.maps}`,
  `Invitation: https://invitivals.com/${cfg.slug}/`,
].join('\n');
export const calEnd = (e) => plusHours(e.date, e.hours || 2);
export const calStart = (e) => local(e.date);
/* through Google's sign-in, as on the other invitations: a guest who is not signed in is asked to sign in and then lands
   on the pre-filled event (a bare calendar link sends them to Google's product page instead) */
export const googleCalUrl = (cfg, e) => 'https://accounts.google.com/ServiceLogin?service=cl&continue=' + encodeURIComponent(googleCalDirect(cfg, e));
export const googleCalDirect = (cfg, e) => 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
  action: 'TEMPLATE',
  text: calTitle(cfg, e),
  dates: `${calStart(e)}/${calEnd(e)}`,
  ctz: TZ,
  details: calDetails(cfg, e),
  location: e.place.name,
}).toString();
export const icsSlug = (e) => e.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const icsUrl = (e) => `cal/${icsSlug(e)}.ics`;
