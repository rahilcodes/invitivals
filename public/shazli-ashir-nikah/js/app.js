/* Shazli & Ashir — emerald & gold Muslim wedding invitation (live text on the Muslim Emerald design's clean plates).
   Doors (tap) → straight into the first page, no film. Pages: welcome · invitation · save the date · functions ·
   venue · RSVP · thank you. Both links run this file; config.js decides the functions shown. */
import { config as C } from '../config.js?v=1';

const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v; else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
};
const ICON = {
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>',
  form: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
};
const btn = (label, icon, attrs = {}) => h(attrs.href ? 'a' : 'button', { class: 'btn', type: attrs.href ? null : 'button', ...attrs, html: `${ICON[icon] || ''}<span>${label}</span>` });
const page = (cls, art, ...kids) => h('section', { class: `page ${cls}` }, h('img', { class: 'bg', src: `assets/${art}`, alt: '', decoding: 'async', loading: cls === 'hero' ? 'eager' : 'lazy' }), h('div', { class: 'in' }, ...kids));

/* ── calendar: Google Calendar on Android/desktop, an .ics on Apple; start time only (no end time was supplied) ── */
const stamp = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const isApple = () => /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);
function addToCalendar(ev) {
  const title = `${ev.title} · ${C.bride} & ${C.groomFull}`;
  if (isApple()) {
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Invitation//EN', 'BEGIN:VEVENT', `UID:${ev.key}-${C.slug}@invitivals.com`, `DTSTAMP:${stamp(Date.now())}`, `DTSTART:${stamp(ev.start)}`,
      `SUMMARY:${title}`, `LOCATION:${ev.venue ? C.venue.full.replace(/,/g, '\\,') : ''}`, 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
    const a = h('a', { href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })), download: `${ev.key}.ics` });
    document.body.append(a); a.click(); a.remove();
    return;
  }
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${stamp(ev.start)}/${stamp(ev.start)}`, location: ev.venue ? C.venue.full : '', ctz: 'Asia/Kolkata' });
  window.open(`https://calendar.google.com/calendar/render?${q}`, '_blank', 'noopener');
}
const nikah = C.events.find((e) => e.key === 'nikah');

/* ── pages ── */
const hero = page('hero', 'hero.webp',
  h('img', { class: 'mono', src: 'assets/monogram.webp', alt: 'SA monogram', width: 560, height: 797 }),
  h('p', { class: 'kicker' }, 'Wedding Invitation'),
  h('h1', { class: 'names' }, h('span', {}, C.bride), h('span', { class: 'amp' }, '&'), h('span', {}, C.groom[0]), h('span', {}, C.groom[1])),
  h('p', { class: 'when' }, '20 · 01 · 2027'));

const invite = page('invite', 'paper.webp',
  h('p', { class: 'host' }, C.host),
  h('p', { class: 'prose' }, 'requests the pleasure of your company on the joyous occasion of the wedding ceremony of her daughter'),
  h('p', { class: 'name' }, C.bride),
  h('p', { class: 'with' }, 'with'),
  h('p', { class: 'name' }, C.groom[0], h('br'), C.groom[1]),
  h('p', { class: 'parents' }, `son of ${C.groomParents}`),
  h('span', { class: 'rule', 'aria-hidden': 'true' }),
  h('p', { class: 'ev' }, 'Nikah'),
  h('p', { class: 'evd' }, `${nikah.date} · ${nikah.time}`),
  h('p', { class: 'evd' }, nikah.extra),
  h('p', { class: 'venue' }, C.venue.full));

const S = C.saveTheDate;
const save = page('save', 'save.webp',
  h('p', { class: 'std' }, 'Save the Date'),
  h('p', { class: 'ar', lang: 'ar', dir: 'rtl' }, S.arabic),
  h('p', { class: 'lat' }, S.latin),
  h('div', { class: 'plaque' }, h('span', { class: 'd' }, S.day), h('span', { class: 'm' }, S.month), h('span', { class: 'w' }, S.weekday)),
  h('p', { class: 'line' }, S.line),
  btn('Add to Calendar', 'cal', { class: 'btn btn-gold', onclick: () => addToCalendar(nikah) }));

const card = (ev) => h('article', { class: `fn${ev.venue ? ' fn-venue' : ''}` },
  h('h3', {}, ev.title),
  h('p', { class: 'fd' }, `${ev.date} · ${ev.time.replace(/ /g, ' ')}`),
  ev.extra && h('p', { class: 'fx' }, ev.extra),
  ev.venue && h('p', { class: 'fv' }, C.venue.full),
  ev.venue && h('div', { class: 'row' }, btn('Map', 'pin', { href: C.venue.mapsUrl, target: '_blank', rel: 'noopener', class: 'btn btn-sm' }), btn('Calendar', 'cal', { class: 'btn btn-sm btn-line', onclick: () => addToCalendar(ev) })));
const functions = page(`functions n${C.events.length}`, 'paper.webp',
  h('h2', {}, C.events.length > 2 ? 'Wedding Functions' : 'Nikah & Rukhsati'),
  h('div', { class: 'fns' }, C.events.map(card)));

const venue = page('venue', 'stage.webp',
  h('h2', {}, 'The Venue'),
  h('p', { class: 'sub' }, 'Nikah & Rukhsati'),
  h('p', { class: 'vn' }, C.venue.name),
  h('p', { class: 'vp' }, C.venue.place),
  btn('View on Map', 'pin', { href: C.venue.mapsUrl, target: '_blank', rel: 'noopener', class: 'btn' }));

/* ── RSVP: the invitation's own form (stored on our server) and, once the family's form exists, their Google Form ── */
const form = h('form', { class: 'rsvp-form', novalidate: true },
  h('label', { class: 'field' }, h('span', {}, 'Your name'), h('input', { name: 'name', autocomplete: 'name', maxlength: 80, required: true })),
  h('fieldset', { class: 'choice' }, h('legend', { class: 'vh' }, 'Will you attend?'),
    h('label', {}, h('input', { type: 'radio', name: 'attending', value: 'yes' }), h('span', {}, 'Yes, I’ll be attending')),
    h('label', {}, h('input', { type: 'radio', name: 'attending', value: 'no' }), h('span', {}, 'Sorry, I can’t make it'))),
  h('label', { class: 'field guests', hidden: true }, h('span', {}, 'Number of guests'), h('input', { name: 'guests', type: 'number', inputmode: 'numeric', min: 1, max: 20, value: 1 })),
  h('input', { name: 'website', class: 'vh', tabindex: -1, autocomplete: 'off', 'aria-hidden': 'true' }),
  btn('Send Response', '', { type: 'submit', class: 'btn' }),
  h('p', { class: 'msg', role: 'status', 'aria-live': 'polite' }));
form.querySelector('button').type = 'submit';
form.addEventListener('change', () => { form.querySelector('.guests').hidden = form.elements.attending.value !== 'yes'; });
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = form.querySelector('.msg'), send = form.querySelector('button');
  const name = form.elements.name.value.trim(), attending = form.elements.attending.value;
  msg.className = 'msg bad';
  if (name.length < 2) { msg.textContent = 'Please enter your name.'; form.elements.name.focus(); return; }
  if (!attending) { msg.textContent = 'Please choose whether you will attend.'; return; }
  const guests = attending === 'yes' ? Math.round(+form.elements.guests.value || 0) : 0;
  if (attending === 'yes' && (guests < 1 || guests > 20)) { msg.textContent = 'The number of guests must be from 1 to 20.'; return; }
  send.disabled = true; msg.className = 'msg'; msg.textContent = 'Sending…';
  try {
    const r = await fetch(C.rsvp.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, attending, guests, link: C.link, website: form.elements.website.value }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) throw new Error(j.error || 'Your reply could not be sent. Please try again.');
    form.replaceChildren(h('p', { class: 'done' }, attending === 'yes' ? 'Thank you! Your reply is received. We look forward to welcoming you.' : 'Thank you for letting us know. You will be missed.'));
  } catch (err) { send.disabled = false; msg.className = 'msg bad'; msg.textContent = err.message.includes('fetch') ? 'Your reply could not be sent. Please check your connection and try again.' : err.message; }
});
const rsvp = page('rsvp', 'paper.webp',
  h('h2', {}, 'RSVP'),
  h('p', { class: 'sub' }, 'Kindly let us know if you will be joining us.'),
  h('div', { class: 'opt' }, h('p', { class: 'opt-h' }, 'Reply here'), form),
  C.rsvp.googleForm && h('div', { class: 'opt' }, h('p', { class: 'opt-h' }, 'Or reply on Google Forms'), h('p', { class: 'opt-n' }, 'Opens a Google Form; replies go to the family’s Google Sheet.'),
    btn('Open the Google Form', 'form', { href: C.rsvp.googleForm, target: '_blank', rel: 'noopener', class: 'btn btn-line' })),
  h('p', { class: 'call' }, 'For RSVP: ', h('a', { href: `tel:${C.rsvp.tel}` }, C.rsvp.phone)));

const thanks = page('thanks', 'thanks.webp',
  h('img', { class: 'mono', src: 'assets/monogram.webp', alt: '', width: 560, height: 797, loading: 'lazy' }),
  h('p', { class: 't1' }, C.thanks[0]),
  h('p', { class: 't2' }, C.thanks[1]));

const main = h('main', { class: 'invitation', id: 'invitation' }, hero, invite, save, functions, venue, rsvp, thanks);
document.getElementById('app').append(main);

/* fade each page's text in as it arrives */
const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { threshold: 0.15 }) : null;

/* ── music: one player, started by the opening tap ── */
const music = new Audio(C.music); music.loop = true; music.preload = 'auto';
const mbtn = h('button', { class: 'audio', type: 'button', 'aria-label': 'Pause music', html:
  '<svg class="on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>' +
  '<svg class="off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/><path d="M3 3l18 18" stroke-width="1.8"/></svg>' });
const showMusic = () => { const off = music.paused; mbtn.classList.toggle('muted', off); mbtn.setAttribute('aria-label', off ? 'Play music' : 'Pause music'); };
mbtn.addEventListener('click', () => { if (music.paused) music.play().catch(showMusic); else music.pause(); });
music.addEventListener('play', showMusic); music.addEventListener('pause', showMusic);
let wanted = true;
document.addEventListener('visibilitychange', () => { if (document.hidden) { wanted = !music.paused; music.pause(); } else if (wanted && document.documentElement.classList.contains('is-open')) music.play().catch(showMusic); });
document.body.append(mbtn);

/* ── opening: the doors; one tap starts the song and goes straight to the first page ── */
const tap = h('button', { class: 'tap', type: 'button', 'aria-label': 'Tap to open the invitation' }, h('span', { class: 'ring', 'aria-hidden': 'true' }));
const opening = h('div', { class: 'opening' }, h('div', { class: 'frame' }, h('img', { class: 'art', src: 'assets/doors.webp', alt: 'Emerald and gold doors of the invitation', fetchpriority: 'high' }), tap));
document.body.append(opening);
opening.addEventListener('click', () => {
  if (document.documentElement.classList.contains('is-open')) return;
  try { music.volume = C.musicVolume; } catch { /* iOS: fixed volume */ }
  music.play().catch(showMusic);
  mbtn.classList.add('shown'); showMusic();
  document.documentElement.classList.add('is-open');
  document.body.classList.remove('locked');
  window.scrollTo(0, 0);
  opening.classList.add('out');
  setTimeout(() => opening.remove(), 1000);
  main.querySelectorAll('.page').forEach((p) => (io ? io.observe(p) : p.classList.add('on')));
});
