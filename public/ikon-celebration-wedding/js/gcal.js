/* Google Calendar: a prefilled "Add" link for one event. The family gave start times only, so the entry
   starts and ends at that moment (no end time is invented); Google keeps the time zone from ctz. */
const wall = (iso) => iso.slice(0, 19).replace(/[-:]/g, '');
export const gcalHref = ({ title, start, place, details }) => 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
  action: 'TEMPLATE', text: title, dates: `${wall(start)}/${wall(start)}`, ctz: 'Asia/Kolkata', location: place, details,
}).toString();
