/* CalendarSheet — Add to Calendar: a small sheet offering the static .ics file (Apple, Outlook) or a
   Google Calendar link. One sheet serves every day; open(day) fills it for that day. */
import { h } from './util.js';

export function CalendarSheet(C) {
  const ics = h('a', { class: 'sheet-opt', href: '#' }, 'Apple / Outlook Calendar ', h('small', {}, '(.ics file)'));
  const gcal = h('a', { class: 'sheet-opt', href: '#', target: '_blank', rel: 'noopener' }, 'Google Calendar');
  const sub = h('p', { class: 'sheet-sub' });
  const closeBtn = h('button', { class: 'sheet-close', type: 'button' }, 'Close');
  const sheet = h('div', { class: 'sheet', hidden: true },
    h('div', { class: 'sheet-backdrop' }),
    h('div', { class: 'sheet-box', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Add to Calendar' }, h('p', { class: 'sheet-title' }, 'Add to Calendar'), sub, ics, gcal, closeBtn));
  document.body.append(sheet);
  let opener = null;
  const close = () => { sheet.hidden = true; if (opener) opener.focus({ preventScroll: true }); };
  sheet.querySelector('.sheet-backdrop').addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  for (const a of [ics, gcal]) a.addEventListener('click', () => setTimeout(close, 300));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) close(); });

  const z = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return {
    /* day: { title, start, ics, venue, address[], mapsUrl, lines? } */
    open(day, from) {
      opener = from || null;
      const start = new Date(day.start), end = new Date(start.getTime() + C.wedding.gcalHours * 3600e3);
      sub.textContent = `${day.title} · ${day.weekday}, ${day.date} · ${day.time || day.schedule[0][0]}`;
      ics.href = day.ics;
      gcal.href = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
        action: 'TEMPLATE', text: day.key === 'day3' ? `Wedding of ${C.couple.groom} & ${C.couple.bride}` : `${C.couple.groom} & ${C.couple.bride} · ${day.title}`,
        dates: `${z(start)}/${z(end)}`, ctz: 'Asia/Kolkata',
        location: [day.venue, ...day.address].join(', '),
        details: (day.sections
          ? [day.title, ...day.sections.flatMap((p) => ['', p.label, ...p.schedule.map(([t, w]) => (t ? `${t} – ${w}` : w)), ...(p.venue ? [`${p.venue}, ${p.address.join(', ')}`, `Map: ${p.mapsUrl}`] : [])])]
          : [day.title, ...day.schedule.map(([t, w]) => (t ? `${t} – ${w}` : w)), '', `Map: ${day.mapsUrl}`]).join('\n'),
      });
      sheet.hidden = false;
      ics.focus({ preventScroll: true });
    },
  };
}
