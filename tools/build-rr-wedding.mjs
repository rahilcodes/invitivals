#!/usr/bin/env node
/* Rose Red — detailed wedding invitation (client liked /muslim-wedding-rose-red/).
   The designer's Rose Red pages used whole, plus the couple's photos, the full
   day's programme, a gallery, the venue and a contact number.

   node tools/build-rr-wedding.mjs [config]   -> public/<C.out>/index.html + event.ics
   config: rr-wedding-26nov (default) | chanchal-jp-sharma-wedding | mamatha-sairama-wedding
   Assets first: python tools/prep-rr-wedding.py <C.out>   (Chanchal & JP: node tools/prep-rr-chanchal-jp.mjs;
   Mamatha & Sai Rama: node tools/prep-rr-mamatha-sairama.mjs)
   Optional per-invitation fields (families, details, blessings, per-event maps, heading, qualifications,
   locations, events without an end or a note, no story photo, no gallery yet, …) render only when set,
   so the Rupam & Taniya page is built exactly as before.

   Edit wording HERE and re-run; never edit the generated index.html. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const CONFIGS = {};
CONFIGS['rr-wedding-26nov'] = {
  out: 'rr-wedding-26nov',
  couple: { first: 'Dr. Rupam', second: 'Dr. Taniya', short: 'Rupam & Taniya', initials: ['R', 'T'] },
  invite: ['request the pleasure of your company', 'at the wedding celebration of'],
  dateISO: '2026-11-26',
  day: 'Thursday',
  dateText: '26th November 2026',
  timeText: '10 AM onwards',
  countdownTo: '2026-11-26T10:00:00+05:30',
  events: [
    { name: 'Vriddhi Puja', date: '2026-11-26', time: '10:00', end: '11:30', label: '10 AM onwards', icon: 'diya', note: 'Seeking the blessings of our ancestors' },
    { name: 'Haldi', date: '2026-11-26', time: '12:00', end: '13:30', label: '12 PM onwards', icon: 'haldi', note: 'A splash of turmeric, laughter and love' },
    { name: 'Ashirwad & Engagement Ceremony', date: '2026-11-26', time: '13:30', end: '16:00', label: '1:30 PM onwards', icon: 'rings', note: 'Followed by lunch' },
    { name: 'Wedding', date: '2026-11-26', time: '18:00', end: '19:30', label: '6 PM onwards', icon: 'agni', note: 'Two souls, seven vows, one forever' },
    { name: 'Reception', date: '2026-11-26', time: '19:30', end: '23:00', label: '7:30 PM onwards', icon: 'reception', note: 'An evening of dinner, music and joy' },
    { name: 'Bidaai', date: '2026-11-27', time: '10:00', end: '12:00', label: '10 AM onwards', icon: 'doli', note: 'With tearful eyes and full hearts' }
  ],
  venue: {
    // TODO(client): venue name/address not given — only the map pin
    name: ['Wedding Venue'],
    address: ['Tap the map for directions'],
    maps: 'https://maps.app.goo.gl/qrQr8DnLaL9DgmUR8'
  },
  phone: '+91 94746 39548',
  closing: 'With love, both families',
  title: 'Dr. Rupam & Dr. Taniya — Wedding Invitation',
  description: 'Tap to open your invitation',
  // Our Story arch (client brief 2026-10-15: the twirling watercolour)
  story: { src: 'assets/photo-7.webp', alt: 'The couple twirling at a mountain viewpoint' },
  // gallery, in the client's order; pos = object-position inside the 3:4 frame
  photos: [
    { src: 'assets/photo-6.webp', alt: 'The couple on a lit street with the clock tower behind them', pos: '50% 37%' },
    { src: 'assets/photo-5.webp', alt: 'The couple sitting together in a restaurant', pos: '50% 50%' },
    { src: 'assets/photo-4.webp', alt: 'The couple sitting on stone steps among white flowers', pos: '50% 50%' }
  ]
};

/* Chanchal Sharma & JP Sharma — Rajasthani Hindu wedding (client brief 2026-10-20).
   Every date, time, map link, name and the tithi/route wording are the client's own; nothing guessed.
   One map link was supplied and it is used for all four functions, as instructed. */
const CJ_MAP = 'https://maps.app.goo.gl/RSTD7MqNDrLRwGW88?g_st=aw';
CONFIGS['chanchal-jp-sharma-wedding'] = {
  out: 'chanchal-jp-sharma-wedding',
  couplePage: 'assets/couple-page.webp?v=3',   // client's Rajasthani couple, re-blended 2026-10-21; ?v= so cached copies refresh
  couple: { first: 'Chanchal Sharma', second: 'JP Sharma', short: 'Chanchal & JP Sharma', initials: ['C', 'J'] },
  invite: ['request the pleasure of your company', 'at the wedding celebration of'],
  dateISO: '2026-12-02',
  day: 'Wednesday',
  dateText: '2nd December 2026',
  timeText: '11:30 PM – 1:30 AM',
  countdownTo: '2026-12-02T23:30:00+05:30',
  events: [
    { name: 'Baan', date: '2026-11-26', time: '10:30', end: '13:30', label: '10:30 AM – 1:30 PM', icon: 'haldi', note: 'Turmeric, traditions and the first blessings', maps: CJ_MAP },
    { name: 'Tilak', date: '2026-11-30', time: '13:30', end: '18:00', label: '1:30 PM – 6:00 PM', icon: 'tilak', note: 'The groom is welcomed with tilak and blessings', maps: CJ_MAP },
    { name: 'Janeev', date: '2026-12-01', allDay: true, label: 'Morning', icon: 'diya', note: 'The sacred thread ceremony, with prayers and blessings', maps: CJ_MAP },
    { name: 'Wedding · Fera', date: '2026-12-02', time: '23:30', endDate: '2026-12-03', end: '01:30', label: '11:30 PM – 1:30 AM', when: '11:30 PM on 2 December to 1:30 AM on 3 December', icon: 'agni', note: 'Margashirsha Krishna Paksha Budhwar · seven sacred rounds around the holy fire', maps: CJ_MAP }
  ],
  venue: {
    name: ['VRW6+GVP, Bhagtawar Nagar'],
    address: ['Near Bhagtawar Nagar, Rajasthan'],
    maps: CJ_MAP
  },
  phone: '+91 92465 85317',
  closing: 'With love, both families',
  title: 'Chanchal Sharma & JP Sharma — Wedding Invitation',
  description: 'Wednesday, 2 December 2026 · Bhagtawar Nagar, Rajasthan. Tap to open your invitation',
  story: { src: 'assets/photo-story.webp?v=2', alt: 'Chanchal and JP at Jal Mahal, Jaipur', pos: '50% 50%' },
  storyLead: 'Two hearts, one promise — with the blessings of Shri Ganesh ji and our families, we begin our forever.',
  photos: [
    { src: 'assets/photo-g1.webp?v=2', full: 'assets/photo-g1-full.webp?v=2', alt: 'Chanchal and JP at sunset by the lake, Jal Mahal behind them', pos: '50% 50%' },
    { src: 'assets/photo-g2.webp?v=2', full: 'assets/photo-g2-full.webp?v=2', alt: 'Chanchal and JP laughing in front of Hawa Mahal, Jaipur', pos: '50% 50%' },
    { src: 'assets/photo-g3.webp?v=2', full: 'assets/photo-g3-full.webp?v=2', alt: 'Chanchal and JP seated together on a wooden bridge', pos: '50% 50%' },
    { src: 'assets/photo-g4.webp?v=2', full: 'assets/photo-g4-full.webp?v=2', alt: 'Chanchal and JP holding hands in front of a wooden gate', pos: '50% 50%' },
    { src: 'assets/photo-g5.webp?v=2', full: 'assets/photo-g5-full.webp?v=2', alt: 'Chanchal and JP walking hand in hand beneath the trees as pigeons take flight', pos: '50% 50%' }
  ],
  invocation: 'Shri Ganeshaya Namah',
  families: {
    bride: { label: 'Bride', name: 'Chanchal Sharma', parents: 'Daughter of Savitha Sharma & Ashok Sharma' },
    groom: { label: 'Groom', name: 'JP Sharma', parents: 'Son of Krishna Sharma & Manju Devi' }
  },
  details: [
    ['Wedding', 'Wednesday, 2 December 2026'],
    ['Tithi', 'Margashirsha Krishna Paksha Budhwar'],
    ['Route', 'Teencholi, Rajasthan to Sanjay Nagar, Paparna'],
    ['Venue', 'VRW6+GVP, Bhagtawar Nagar, Rajasthan', 'Near Bhagtawar Nagar, Rajasthan']
  ],
  contact: { kicker: 'RSVP', title: 'Kindly Respond', name: 'Krishna Kumar Sharma', lead: 'Please let us know if you will be joining us — we would love to celebrate with you.' },
  blessings: {
    lead: 'Your presence and blessings will make our celebration even more special. Send your love and blessings to Chanchal & JP as they begin this beautiful new chapter.'
  }
};

/* Dr. Mamatha Reddy & Dr. Sai Rama Reddy — Telugu wedding (client brief 2026-10-28).
   Every detail is the client's own. Not supplied, so not shown: the reception venue's name and address
   (its map link is), any end times, family details (the old printed invitation's family section,
   names, address and numbers are deliberately not used). One RSVP number only. */
const MS_WED_MAP = 'https://maps.app.goo.gl/TMtTFRso7TvirLG69?g_st=aw';
// reception link (client, 2026-10-28, third try): opens MNR Convention Hall A/C, Nalgonda – Pamangundla Rd, Telangana 508002.
// The two before it (share.google/N2Op5OpGAX6JdtgORx, share.google/7BWmgBiq02v3ipT5) were dead links: Google answered both
// with its "this URL isn't available" page.
const MS_REC_MAP = 'https://share.google/bkMpneOxdAkmyr5sV';
CONFIGS['mamatha-sairama-wedding'] = {
  out: 'mamatha-sairama-wedding',
  couple: { first: 'Dr. Mamatha Reddy', second: 'Dr. Sai Rama Reddy', short: 'Mamatha & Sai Rama', initials: ['M', 'S'],
    firstQual: '(M.S. Obstetrics & Gynaecology)', secondQual: '(M.D. Paediatrics)',
    // client 2026-10-28: the parents, under each name in the story band
    firstParents: 'Daughter of Smt. Gorantla Hemalatha and Sri Gorantla Laxmi Kantha Reddy',
    secondParents: 'Son of Smt. Soodyreddy Rajitha and Sri Laxma Reddy' },
  invite: ['request the pleasure of your company', 'at the wedding celebration of'],
  music: 'assets/music-v2.mp3',   // the client's track, 2026-10-28 (new name so cached copies of the first one are not reused)
  // client 2026-10-28: on the Thank You page, between its words and its flowers
  special: { title: 'A Special Invitation from Shivani Reddy & Gowthami Reddy',
    text: 'With love and joy, Shivani Reddy and Gowthami Reddy warmly invite you to join the celebration and bless the couple as they begin their beautiful new journey together.' },
  // Telugu heading only (client: no full translation). The brief's own Telugu text did not come through, so this is the
  // customary opening of a Telugu wedding card — to be confirmed with the client.
  heading: { text: 'శ్రీరస్తు · శుభమస్తు · అవిఘ్నమస్తు', font: 'Noto Serif Telugu', lang: 'te' },   // first line of the story band
  dateISO: '2026-11-20',
  day: 'Friday',
  dateText: '20th November 2026',
  timeText: 'Muhurtham 9:56 AM',
  countdownTo: '2026-11-20T09:56:00+05:30',
  events: [
    { name: 'Wedding · Muhurtham', date: '2026-11-20', time: '09:56', label: '9:56 AM', icon: 'agni',
      note: 'Dhanussu Lagnam · Vishwanadha Gardens, Hall No. 1, JP Nagar, Miyapur, Hyderabad · Lunch follows', maps: MS_WED_MAP },
    { name: 'Reception', date: '2026-11-22', time: '19:00', label: '7:00 PM onwards', icon: 'reception', maps: MS_REC_MAP }
  ],
  locations: [['View Wedding Location', MS_WED_MAP], ['View Reception Location', MS_REC_MAP]],
  venue: {
    name: ['Vishwanadha Gardens, Hall No. 1'],
    address: ['JP Nagar, Miyapur, Hyderabad'],
    maps: MS_WED_MAP
  },
  phone: '+91 94910 63207',
  closing: 'With love, both families',
  title: 'Dr. Mamatha Reddy & Dr. Sai Rama Reddy — Wedding Invitation',
  description: 'Friday, 20 November 2026 · Vishwanadha Gardens, Miyapur, Hyderabad. Tap to open your invitation',
  // the client's five photographs (tools/prep-rr-mamatha-sairama.mjs): featured first, then in story order
  story: { src: 'assets/photo-story.webp', alt: 'Mamatha and Sai Rama together, a bouquet of red roses in her hand', pos: '50% 50%' },
  photos: [
    { src: 'assets/photo-g1.webp', full: 'assets/photo-g1-full.webp', alt: 'Mamatha and Sai Rama in garlands of jasmine and pink lotus before the floral arch', pos: '50% 50%' },
    { src: 'assets/photo-g2.webp', full: 'assets/photo-g2-full.webp', alt: 'Mamatha and Sai Rama together, a bouquet of red roses in her hand', pos: '50% 50%' },
    { src: 'assets/photo-g3.webp', full: 'assets/photo-g3-full.webp', alt: 'Sai Rama placing the ring on Mamatha’s finger, their mothers beside them', pos: '50% 50%' },
    { src: 'assets/photo-g4.webp', full: 'assets/photo-g4-full.webp', alt: 'Mamatha and Sai Rama smiling at each other under the floral arch', pos: '50% 50%' },
    { src: 'assets/photo-g5.webp', full: 'assets/photo-g5-full.webp', alt: 'Mamatha and Sai Rama with both their families', pos: '50% 50%' }
  ],
  contact: { kicker: 'RSVP', title: 'Kindly Respond', lead: 'Please let us know if you will be joining us — we would love to celebrate with you.' }
};

const C = CONFIGS[process.argv[2] || 'rr-wedding-26nov'];
if (!C) { console.error('unknown config: ' + process.argv[2] + ' (known: ' + Object.keys(CONFIGS).join(', ') + ')'); process.exit(1); }

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const digits = C.phone.replace(/\D/g, '');
const url = `https://invitivals.com/${C.out}/`;
const W = { couple: 900, date: 900, venue: 708, thanks: 687 };

// a slot over a page: rect in the page's own pixels (theme.js numbers)
function slot(page, [x0, y0, x1, y1], cls, size, html, css = '') {
  const w = W[page], h = 1600;
  return `<div class="slot ${cls}" style="left:${(x0 / w * 100).toFixed(3)}%;top:${(y0 / h * 100).toFixed(3)}%;width:${((x1 - x0) / w * 100).toFixed(3)}%;height:${((y1 - y0) / h * 100).toFixed(3)}%;--fs:${(size / w * 100).toFixed(3)}cqw;${css}">${html}</div>`;
}
const lines = a => a.map(l => `<span class="ln">${esc(l)}</span>`).join('');
const pct = (page, [x0, y0, x1, y1]) => `left:${(x0 / W[page] * 100).toFixed(3)}%;top:${(y0 / 1600 * 100).toFixed(3)}%;width:${((x1 - x0) / W[page] * 100).toFixed(3)}%;height:${((y1 - y0) / 1600 * 100).toFixed(3)}%`;

const nextDay = d => new Date(Date.parse(d + 'T00:00:00Z') + 864e5).toISOString().slice(0, 10).replace(/-/g, '');
const gcal = e => {
  const s = e.allDay ? e.date.replace(/-/g, '') : `${e.date.replace(/-/g, '')}T${e.time.replace(':', '')}00`;
  const en = e.allDay ? nextDay(e.date) : e.end ? `${(e.endDate || e.date).replace(/-/g, '')}T${e.end.replace(':', '')}00` : s;
  const q = new URLSearchParams({ action: 'TEMPLATE', text: `${e.name} — ${C.couple.short}`, dates: `${s}/${en}`, ctz: 'Asia/Kolkata', details: `${C.title}\n${url}`, location: e.maps || C.venue.maps });
  return `https://calendar.google.com/calendar/render?${q}`;
};

const ICON = {
  diya: '<path d="M12 4c1.6 2 2.2 3.4 1.6 4.6-.5 1-2.7 1-3.2 0C9.8 7.4 10.4 6 12 4z"/><path d="M4 13h16c-.6 3.4-3.8 5.6-8 5.6S4.6 16.4 4 13z"/><path d="M9 20.5h6"/>',
  haldi: '<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M7 11c.8-2 2.6-3 5-3s4.2 1 5 3"/><circle cx="18.5" cy="5.5" r="1.6"/><path d="M17.3 6.7 14 10"/>',
  rings: '<circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="M13.5 5.5 15 3.5l1.5 2-1.5 2z"/>',
  agni: '<path d="M12 3c2.6 3 4 5.4 3.4 8-.4 1.8-1.8 2.8-3.4 2.8S9 12.8 8.6 11C8 8.4 9.4 6 12 3z"/><path d="M5 16h14l-1.4 4H6.4z"/><path d="M3.5 16h17"/>',
  reception: '<path d="M7 3h4l-.4 4.5a1.6 1.6 0 0 1-3.2 0z"/><path d="M9 9.5V17M6.5 17h5"/><path d="M14 3h4l-.4 4.5a1.6 1.6 0 0 1-3.2 0z"/><path d="M16 9.5V17M13.5 17h5"/><path d="M10 21h4"/>',
  tilak: '<path d="M3 14h18c-.8 3.6-4.4 6-9 6s-8.2-2.4-9-6z"/><path d="M12 4.5c1.3 1.6 1.8 2.8 1.3 3.8-.4.8-2.2.8-2.6 0-.5-1 0-2.2 1.3-3.8z"/><path d="M9 14v-1.6c0-1 1.3-1.9 3-1.9s3 .9 3 1.9V14"/><path d="M5.5 14v-1M18.5 14v-1"/>',
  doli: '<path d="M2 7h20"/><path d="M6 7v-.5A6 3 0 0 1 18 6.5V7"/><path d="M7 7v10h10V7"/><path d="M10 17v-5a2 2 0 0 1 4 0v5"/><path d="M5 20h14"/>'
};
const icon = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDay = d => { const [y, m, dd] = d.split('-').map(Number); return `${WEEKDAYS[new Date(Date.UTC(y, m - 1, dd)).getUTCDay()]}, ${dd} ${MONTHS[m - 1]} ${y}`; };
const days = [...new Set(C.events.map(e => e.date))];
const programme = days.map(d => `
      <div class="day reveal">
        <div class="day-h"><span class="rule"></span><span>${esc(fmtDay(d))}</span><span class="rule"></span></div>
        <ol class="events">${C.events.filter(e => e.date === d).map(e => `
          <li class="ev reveal">
            <div class="ev-ic">${icon(e.icon)}</div>
            <div class="ev-b">
              <h3>${esc(e.name)}</h3>
              <p class="ev-t">${esc(e.label)}</p>${e.note ? `
              <p class="ev-n">${esc(e.note)}</p>` : ''}
              <a class="ev-cal" href="${esc(gcal(e))}" target="_blank" rel="noopener">Add to calendar</a>${e.maps ? `<a class="ev-cal ev-map" href="${esc(e.maps)}" target="_blank" rel="noopener" aria-label="${esc(e.name)} location on Google Maps">View on map</a>` : ''}
            </div>
          </li>`).join('')}
        </ol>
      </div>`).join('');

const gallery = C.photos.map((p, i) => `
        <figure class="g-item"><button type="button" class="g-btn" data-i="${i}" aria-label="View photo ${i + 1} larger"><img src="${p.src}" alt="${esc(p.alt)}" style="object-position:${p.pos}" loading="lazy" decoding="async" width="1000" height="1333"></button></figure>`).join('');

const hasFull = C.photos.some(p => p.full);
const ics = () => {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const ev = C.events.map((e, i) => [
    'BEGIN:VEVENT', `UID:${C.out}-${i}@invitivals.com`, `DTSTAMP:${stamp}`,
    e.allDay ? `DTSTART;VALUE=DATE:${e.date.replace(/-/g, '')}` : `DTSTART;TZID=Asia/Kolkata:${e.date.replace(/-/g, '')}T${e.time.replace(':', '')}00`,
    e.allDay ? `DTEND;VALUE=DATE:${nextDay(e.date)}` : e.end ? `DTEND;TZID=Asia/Kolkata:${(e.endDate || e.date).replace(/-/g, '')}T${e.end.replace(':', '')}00` : null,
    `SUMMARY:${e.name} — ${C.couple.short}`, `LOCATION:${e.maps || C.venue.maps}`, `URL:${url}`, 'END:VEVENT'].filter(Boolean).join('\r\n'));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Rose Red//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
    ...ev, 'END:VCALENDAR', ''].join('\r\n');
};

const orn = '<div class="orn reveal"><i></i><svg viewBox="0 0 16 16"><path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg><i></i></div>';
const familiesBand = C.families ? `
  <section class="band" id="families" aria-labelledby="fam-h">
    <img class="corner tl" src="assets/corner-floral.webp" alt="">
    <p class="kicker reveal">Blessed by our elders</p>
    <h2 class="h2 reveal" id="fam-h">Our Families</h2>
    ${orn}
    <div class="fam reveal">${['bride', 'groom'].map(k => { const p = C.families[k]; return `
      <div class="fam-p"><p class="fam-l">${esc(p.label)}</p><p class="fam-n">${esc(p.name)}</p><p class="fam-r">${esc(p.parents)}</p></div>`; }).join('<div class="fam-amp">&amp;</div>')}
    </div>
    <dl class="facts reveal">${C.details.map(([k, ...v]) => `<div><dt>${esc(k)}</dt><dd>${v.map(esc).join('<br>')}</dd></div>`).join('')}</dl>
    <div class="btns reveal"><a class="btn" href="${esc(C.venue.maps)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>View venue on map</a></div>
    <img class="corner br" src="assets/corner-floral.webp" alt="">
  </section>` : '';
const blessingsBand = C.blessings ? `
  <section class="band" id="blessings" aria-labelledby="bless-h">
    <img class="corner tl" src="assets/corner-floral.webp" alt="">
    <p class="kicker reveal">Blessings for the couple</p>
    <h2 class="h2 reveal" id="bless-h">Your Blessings</h2>
    ${orn}
    <p class="lead reveal">${esc(C.blessings.lead)}</p>
    <form class="bless reveal" id="bless" novalidate>
      <label class="sr" for="bless-t">Your blessings</label>
      <textarea id="bless-t" maxlength="500" rows="4" placeholder="Write your blessings for Chanchal &amp; JP…"></textarea>
      <p class="bless-m" id="bless-m" role="status"></p>
      <button class="btn" type="submit"><svg viewBox="0 0 24 24"><path d="M2 21 23 12 2 3v7l15 2-15 2z"/></svg>Send blessings</button>
    </form>
    <img class="corner br" src="assets/corner-floral.webp" alt="">
  </section>` : '';
/* a special message on the Thank You page: the page is opened between its words (down to y=CUT of 1600) and its
   flowers, and the message sits on the page's own burgundy in between, both cut edges feathered */
const CUT = 1040;
const thanksSplit = C.special ? `  <section class="plate thx" id="thanks" aria-label="Thank you">
    <div class="thx-a" style="aspect-ratio:687/${CUT}">
      <img src="assets/thanks-page.webp" alt="With all our love. Thank you for being a part of our special journey." width="1031" height="2401" loading="lazy">
      <div class="slot caps rise" style="left:${(100 / 687 * 100).toFixed(3)}%;top:${(962 / CUT * 100).toFixed(3)}%;width:${(487 / 687 * 100).toFixed(3)}%;height:${(48 / CUT * 100).toFixed(3)}%;--fs:${(25 / 687 * 100).toFixed(3)}cqw">${esc(C.closing)}</div>
    </div>
    <div class="thx-msg reveal">
      <div class="orn"><i></i><svg viewBox="0 0 16 16"><path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg><i></i></div>
      <h2 class="thx-h">${esc(C.special.title)}</h2>
      <p class="thx-t">${esc(C.special.text)}</p>
    </div>
    <div class="thx-b" style="aspect-ratio:687/${1600 - CUT}"><img src="assets/thanks-page.webp" alt="" width="1031" height="2401" loading="lazy"></div>
  </section>` : '';
const THX_CSS = `
/* parents under the names; the Thank You page opened for a special message */
.names .par{display:block;font-family:var(--serif);font-style:italic;font-weight:500;font-size:clamp(16px,4.4vw,19px);line-height:1.45;color:#f6dfc0;max-width:28ch;margin:.35em auto .25em;text-wrap:balance}
.thx{background:#461217}
.thx-a,.thx-b{position:relative;overflow:hidden}
.thx-a>img,.thx-b>img{position:absolute;left:0;width:100%;height:auto}
.thx-a>img{top:0;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 3%,#000 60.5%,transparent 65%);mask-image:linear-gradient(180deg,transparent 0,#000 3%,#000 60.5%,transparent 65%)}
.thx-b>img{bottom:0;-webkit-mask-image:linear-gradient(180deg,transparent 67%,#000 77%);mask-image:linear-gradient(180deg,transparent 67%,#000 77%)}
.thx-msg{position:relative;margin:-4px 0;padding:4px 30px 10px;text-align:center;background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(120,40,46,.45),transparent 75%)}
.thx-msg .orn{margin:0 auto 14px}
.thx-h{font-family:var(--caps);font-weight:400;text-transform:uppercase;letter-spacing:.16em;font-size:clamp(14px,3.9vw,17px);line-height:1.6;color:var(--gold);margin:0 auto 12px;max-width:26ch;text-wrap:balance}
.thx-t{font-family:var(--serif);font-style:italic;font-size:clamp(18px,5vw,21px);line-height:1.5;color:#f6dfc0;margin:0 auto;max-width:30ch;text-wrap:pretty}
`;
const EXTRA_CSS = `
/* added for invitations with families / blessings sections (same palette and type as the template) */
.invoc{font-family:var(--caps);text-align:center;letter-spacing:.24em;text-transform:uppercase;font-size:14px;color:#fdf0c4;margin-bottom:10px}
.invoc::before,.invoc::after{content:"॥";margin:0 .6em;color:var(--gold)}
.ev-b .ev-cal{margin-right:18px}
.fam{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
.fam-l{font-family:var(--caps);text-transform:uppercase;letter-spacing:.3em;font-size:12px;color:var(--gold)}
.fam-n{font-family:var(--script);font-size:clamp(40px,11.5vw,52px);line-height:1.15;color:#fdf0c4;text-shadow:0 0 .22em rgba(255,214,150,.28),0 2px 3px rgba(30,0,8,.5)}
.fam-r{font-size:19px;font-style:italic;color:#f6dfc0;line-height:1.4}
.fam-amp{font-family:var(--serif);font-style:italic;font-weight:600;font-size:34px;color:var(--gold);margin:6px 0}
.facts{margin:30px auto 6px;max-width:420px;border:1px solid rgba(243,213,150,.35);border-radius:16px;background:linear-gradient(180deg,rgba(255,236,208,.08),rgba(255,236,208,.03));padding:6px 18px}
.facts div{padding:12px 0;border-bottom:1px solid rgba(243,213,150,.2);text-align:center}
.facts div:last-child{border-bottom:0}
.facts dt{font-family:var(--caps);text-transform:uppercase;letter-spacing:.24em;font-size:11px;color:var(--gold)}
.facts dd{margin-top:4px;font-size:19px;font-weight:600;line-height:1.35;color:#fff1d6}
.rsvp-name{text-align:center;font-family:var(--serif);font-weight:700;font-size:25px;letter-spacing:.04em;color:#fff1d6;margin-top:18px;line-height:1.2}
.bless{max-width:420px;margin:22px auto 0;display:flex;flex-direction:column;align-items:center;gap:10px}
.bless textarea{width:100%;min-height:120px;resize:vertical;padding:14px 16px;border-radius:14px;border:1px solid rgba(243,213,150,.5);background:rgba(42,6,17,.6);color:#fff1d6;font:italic 600 18px/1.45 var(--serif)}
.bless textarea::placeholder{color:rgba(246,223,192,.6)}
.bless textarea:focus{outline:2px solid var(--gold);outline-offset:2px}
.bless-m{min-height:1.2em;font-style:italic;color:#f6dfc0;text-align:center}
`;
const BLESS_JS = `
  // blessings: opens WhatsApp to the family with the guest's words
  (function(){var f=document.getElementById("bless"),t=document.getElementById("bless-t"),m=document.getElementById("bless-m");
    f.addEventListener("submit",function(e){e.preventDefault();var v=t.value.trim();if(!v){m.textContent="Please write a few words of blessing first.";t.focus();return}
      window.open("https://wa.me/${digits}?text="+encodeURIComponent("Blessings for ${C.couple.short}:\\n\\n"+v),"_blank","noopener");m.textContent="Thank you — your blessings mean the world to us.";t.value=""})})();`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(C.title)}</title>
<meta name="description" content="${esc(C.description)}">
<meta name="theme-color" content="#3a0b18">
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(C.title)}">
<meta property="og:description" content="${esc(C.description)}">
<meta property="og:image" content="${url}assets/og.jpg">
<meta property="og:image:secure_url" content="${url}assets/og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" as="image" href="assets/envelope.webp">
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/pinyon-script-latin-400-normal.woff2" crossorigin>
<style>
@font-face{font-family:"Cormorant Garamond";font-weight:600;font-display:swap;src:url(assets/fonts/cormorant-garamond-latin-600-normal.woff2) format("woff2")}
@font-face{font-family:"Cormorant Garamond";font-style:italic;font-weight:600;font-display:swap;src:url(assets/fonts/cormorant-garamond-latin-600-italic.woff2) format("woff2")}
@font-face{font-family:"Cormorant Garamond";font-weight:700;font-display:swap;src:url(assets/fonts/cormorant-garamond-latin-700-normal.woff2) format("woff2")}
@font-face{font-family:"Pinyon Script";font-display:swap;src:url(assets/fonts/pinyon-script-latin-400-normal.woff2) format("woff2")}
@font-face{font-family:"Marcellus";font-display:swap;src:url(assets/fonts/marcellus-latin-400-normal.woff2) format("woff2")}
:root{--page:#3a0b18;--deep:#2a0611;--ink:#fbecd0;--gold:#f3d596;--gold2:#c99a4b;--rose:#e88aa6;
  --serif:"Cormorant Garamond",Georgia,serif;--script:"Pinyon Script",cursive;--caps:"Marcellus",Georgia,serif;--col:min(100vw,480px)}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--page);-webkit-text-size-adjust:100%}
body{font-family:var(--serif);color:var(--ink);background:radial-gradient(90% 60% at 50% 30%,rgba(122,24,48,.55),transparent 70%),linear-gradient(180deg,#3a0b18,#4a1022 50%,#3a0b18);min-height:100vh;overflow-x:hidden}
body.locked{overflow:hidden;height:100vh}
img{display:block;max-width:100%;height:auto}
a{color:inherit}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

/* ---------- envelope ---------- */
#env{position:fixed;inset:0;z-index:50;overflow:hidden;touch-action:none}
#env .stage{position:absolute;left:50%;top:50%;width:max(100vw,calc(100vh*916/1600));height:max(100vh,calc(100vw*1600/916));transform:translate(-50%,-50%)}
#env .flap{position:absolute;inset:0;background:url(assets/envelope.webp) center/100% 100% no-repeat;transition:transform 1.5s cubic-bezier(.7,0,.25,1),opacity 1.5s ease}
#env .f-top{clip-path:polygon(0 0,100% 0,100% 31.25%,49.67% 53.63%,0 30.13%)}
#env .f-right{clip-path:polygon(100% 31.25%,100% 70.81%,49.67% 53.63%)}
#env .f-bottom{clip-path:polygon(100% 70.81%,100% 100%,0 100%,0 71.13%,49.67% 53.63%)}
#env .f-left{clip-path:polygon(0 30.13%,49.67% 53.63%,0 71.13%)}
#env.open .f-top{transform:translateY(-62%)}#env.open .f-bottom{transform:translateY(62%)}
#env.open .f-left{transform:translateX(-70%)}#env.open .f-right{transform:translateX(70%)}
#env.open .flap{opacity:0;transition:transform 1.5s cubic-bezier(.7,0,.25,1),opacity .6s ease .9s}
#env .seal{position:absolute;left:49.67%;top:53.5%;width:31%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;border:0;background:transparent;cursor:pointer;-webkit-tap-highlight-color:transparent}
#env .seal::after{content:"";position:absolute;inset:-6%;border-radius:50%;box-shadow:0 0 0 2px rgba(243,213,150,.55),0 0 40px 8px rgba(255,214,150,.35);animation:pulse 2.4s ease-in-out infinite}
#env.open .seal{opacity:0;transition:opacity .4s}
#env .hint{position:absolute;left:0;right:0;top:calc(53.5% + 12vh);text-align:center;pointer-events:none}
#env .dear{position:absolute;left:0;right:0;top:20%;text-align:center;pointer-events:none;padding:0 24px}
#env .dear .to{font-family:var(--caps);letter-spacing:.3em;text-transform:uppercase;font-size:13px;color:var(--gold)}
#env .dear .nm{font-family:var(--script);font-size:clamp(40px,12vw,58px);color:#fdf0c4;text-shadow:0 2px 12px rgba(30,0,8,.8)}
#env .hint span{display:inline-block;padding:10px 20px;border-radius:30px;background:rgba(42,6,17,.6);border:1px solid rgba(243,213,150,.45);font-family:var(--caps);text-transform:uppercase;letter-spacing:.3em;font-size:12px;color:var(--ink);animation:hint 2.6s ease-in-out infinite;backdrop-filter:blur(3px)}
#env.open .hint,#env.open .dear{opacity:0;transition:opacity .4s}
#env.gone{display:none}
@keyframes pulse{0%,100%{transform:scale(1);opacity:.65}50%{transform:scale(1.08);opacity:1}}
@keyframes hint{0%,100%{opacity:.75}50%{opacity:1}}

/* ---------- column ---------- */
#invite{position:relative;width:var(--col);margin:0 auto;background:var(--page)}
@media (min-width:481px){#invite{box-shadow:0 0 110px rgba(0,0,0,.55)}}
.plate{position:relative;container-type:inline-size}
.plate>img{width:100%;height:auto}
.plate+.plate>img,.band+.plate>img{-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 7%);mask-image:linear-gradient(180deg,transparent 0,#000 7%)}
.slot{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-size:calc(var(--fs) * var(--fit,1));line-height:1.12;color:var(--ink);text-shadow:0 1px 2px rgba(30,0,8,.55)}
.slot .ln{display:block;white-space:nowrap}
.slot.script{font-family:var(--script);line-height:1.15;color:#fdf0c4;text-shadow:0 0 .22em rgba(255,214,150,.28),0 2px 3px rgba(30,0,8,.5)}
.slot.serif{font-weight:600;letter-spacing:.03em}
.slot.gold{color:var(--gold)}
.slot.caps{font-family:var(--caps);text-transform:uppercase;letter-spacing:.2em;color:var(--gold)}
.hit{position:absolute;display:block;border-radius:40px}
.hit:focus-visible{outline:2px solid var(--gold);outline-offset:3px}

/* scratch-to-reveal date */
.scratch{position:absolute;touch-action:none;cursor:grab;transition:opacity .9s ease}
.scratch canvas{width:100%;height:100%;display:block}
.scratch .lbl{position:absolute;left:0;right:0;bottom:-13%;text-align:center;font-family:var(--caps);font-size:3.1cqw;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);animation:hint 2.4s infinite;pointer-events:none}
.scratch.done{opacity:0;pointer-events:none}

/* ---------- bands between the designer's pages ---------- */
.band{position:relative;padding:64px 22px 70px;background:linear-gradient(180deg,rgba(58,11,24,.55),rgba(42,6,17,.35) 50%,rgba(58,11,24,.6)),url(assets/damask.webp) center/260px auto repeat;overflow:hidden}
.band::before,.band::after{content:"";position:absolute;left:0;right:0;height:60px;pointer-events:none;z-index:1}
.band::before{top:0;background:linear-gradient(180deg,var(--page),transparent)}
.band::after{bottom:0;background:linear-gradient(0deg,var(--page),transparent)}
.band>*{position:relative;z-index:2}
.corner{position:absolute;width:42%;max-width:200px;pointer-events:none;z-index:1;opacity:.95}
.corner.tl{top:-18px;left:-30px}
.corner.br{bottom:-24px;right:-30px;transform:rotate(180deg)}
.kicker{font-family:var(--caps);text-transform:uppercase;letter-spacing:.34em;text-indent:.34em;font-size:13px;color:var(--gold);text-align:center}
.h2{font-family:var(--script);font-weight:400;font-size:clamp(44px,13vw,60px);line-height:1.05;text-align:center;color:#fdf0c4;text-shadow:0 0 .25em rgba(255,214,150,.3),0 2px 3px rgba(30,0,8,.5);margin:6px 0 4px}
.orn{display:flex;align-items:center;justify-content:center;gap:10px;color:var(--gold);margin:6px auto 26px}
.orn i{display:block;width:70px;height:1px;background:linear-gradient(90deg,transparent,var(--gold))}
.orn i:last-child{transform:scaleX(-1)}
.orn svg{width:16px;height:16px;fill:var(--gold)}
.lead{text-align:center;font-size:19px;line-height:1.5;font-style:italic;color:#f6dfc0;max-width:30ch;margin:0 auto}

/* arch portrait */
.arch{position:relative;width:78%;margin:6px auto 22px;padding:7px;border-radius:999px 999px 18px 18px;background:linear-gradient(160deg,#f7dc9c,#b9853a 40%,#f3d596 60%,#9c6a2a);box-shadow:0 18px 40px rgba(0,0,0,.45),0 0 0 1px rgba(243,213,150,.25)}
.arch img{width:100%;aspect-ratio:3/4;object-fit:cover;object-position:50% 30%;border-radius:999px 999px 13px 13px}
.arch::after{content:"";position:absolute;inset:7px;border-radius:999px 999px 13px 13px;box-shadow:inset 0 0 0 1px rgba(255,240,200,.5),inset 0 -60px 60px -30px rgba(42,6,17,.45);pointer-events:none}
.names{font-family:var(--script);text-align:center;font-size:clamp(40px,11.5vw,54px);line-height:1.1;color:#fdf0c4}
.names .amp{display:block;font-family:var(--serif);font-style:italic;font-weight:600;font-size:1em;line-height:1;margin:.05em 0;color:var(--gold)}

/* countdown */
.count{display:flex;justify-content:center;gap:10px;margin-top:26px}
.count div{width:68px;padding:12px 0 10px;border:1px solid rgba(243,213,150,.45);border-radius:12px;background:rgba(42,6,17,.55);text-align:center}
.count b{display:block;font-family:var(--serif);font-weight:700;font-size:28px;color:var(--gold);font-variant-numeric:lining-nums tabular-nums}
.count span{font-family:var(--caps);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#f1d9b8}

/* programme */
.day{margin-top:8px}
.day+.day{margin-top:34px}
.day-h{display:flex;align-items:center;gap:12px;justify-content:center;font-family:var(--caps);text-transform:uppercase;letter-spacing:.16em;font-size:13px;color:var(--gold);margin-bottom:18px;text-align:center}
.day-h .rule{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(243,213,150,.6))}
.day-h .rule:last-child{transform:scaleX(-1)}
.events{list-style:none;position:relative;padding-left:0}
.events::before{content:"";position:absolute;left:31px;top:14px;bottom:14px;width:1px;background:linear-gradient(180deg,transparent,rgba(243,213,150,.6) 8%,rgba(243,213,150,.6) 92%,transparent)}
.ev{position:relative;display:flex;gap:14px;align-items:flex-start;margin-bottom:16px}
.ev-ic{flex:none;width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 30%,#7d1a37,#3d0a19);border:1px solid rgba(243,213,150,.75);box-shadow:0 0 0 4px rgba(58,11,24,.9),0 0 18px rgba(243,213,150,.25)}
.ev-ic svg{width:30px;height:30px;fill:none;stroke:var(--gold);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.ev-b{flex:1;padding:14px 16px 14px;border-radius:14px;background:linear-gradient(180deg,rgba(255,236,208,.08),rgba(255,236,208,.03));border:1px solid rgba(243,213,150,.3);backdrop-filter:blur(2px)}
.ev-b h3{font-family:var(--serif);font-weight:700;font-size:22px;line-height:1.15;color:#fff1d6;letter-spacing:.01em}
.ev-t{margin-top:4px;display:inline-block;font-family:var(--caps);font-size:13px;letter-spacing:.14em;color:#2a0611;background:linear-gradient(90deg,#f7dc9c,#e2b866);padding:3px 10px;border-radius:20px}
.ev-n{margin-top:7px;font-style:italic;font-size:16.5px;line-height:1.35;color:#efd5b3}
.ev-cal{display:inline-block;margin-top:8px;font-family:var(--caps);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);text-decoration:none;border-bottom:1px solid rgba(243,213,150,.45);padding-bottom:1px}

/* gallery */
.gal{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 -22px;padding:6px 22px 14px;scrollbar-width:none}
.gal::-webkit-scrollbar{display:none}
.g-item{flex:0 0 74%;scroll-snap-align:center}
.g-btn{display:block;width:100%;border:0;padding:6px;cursor:zoom-in;border-radius:16px;background:linear-gradient(160deg,#f7dc9c,#b9853a 45%,#f3d596 65%,#9c6a2a);box-shadow:0 14px 30px rgba(0,0,0,.45)}
.g-btn img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:11px}
.dots{display:flex;justify-content:center;gap:8px;margin-top:8px}
.dots i{width:7px;height:7px;border-radius:50%;background:rgba(243,213,150,.35);transition:all .3s}
.dots i.on{background:var(--gold);width:20px;border-radius:4px}
.box{position:fixed;inset:0;z-index:60;background:rgba(20,2,8,.94);display:none;align-items:center;justify-content:center;padding:18px}
.box.on{display:flex}
.box img{max-height:88vh;width:auto;border-radius:10px;border:2px solid rgba(243,213,150,.6)}
.box button{position:absolute;top:14px;right:14px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(243,213,150,.6);background:rgba(58,11,24,.8);color:var(--ink);font-size:24px;cursor:pointer}
.box .nav{top:50%;transform:translateY(-50%)}
.box .prev{left:10px;right:auto}.box .next{right:10px}

/* contact */
.btns{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:20px}
.btn{display:inline-flex;align-items:center;gap:9px;padding:13px 22px;border-radius:40px;text-decoration:none;font-family:var(--caps);letter-spacing:.14em;text-transform:uppercase;font-size:13px;color:#2a0611;background:linear-gradient(180deg,#f9e2a8,#d9aa5a);box-shadow:0 8px 20px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.6);border:0;cursor:pointer}
.btn.ghost{color:var(--ink);background:rgba(42,6,17,.55);border:1px solid rgba(243,213,150,.55)}
.btn svg{width:18px;height:18px;fill:currentColor}
.phone{display:block;text-align:center;font-family:var(--serif);font-weight:700;font-size:28px;letter-spacing:.04em;color:var(--gold);margin-top:6px;text-decoration:none}

/* music */
.mute{position:fixed;z-index:40;right:max(14px,calc(50vw - 240px + 14px));bottom:18px;width:48px;height:48px;border-radius:50%;border:1px solid rgba(243,213,150,.7);background:rgba(58,11,24,.85);display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:opacity .6s}
.mute.on{opacity:1;pointer-events:auto}
.mute svg{width:22px;height:22px;fill:var(--ink)}
.mute .bars{display:flex;gap:2px;align-items:flex-end;height:18px}
.mute .bars i{width:3px;background:var(--gold);border-radius:2px;animation:eq 1s ease-in-out infinite}
.mute .bars i:nth-child(2){animation-delay:-.3s}.mute .bars i:nth-child(3){animation-delay:-.6s}.mute .bars i:nth-child(4){animation-delay:-.15s}
.mute.off .bars i{animation:none;height:3px!important}
@keyframes eq{0%,100%{height:4px}50%{height:18px}}

/* petals */
.petals{position:fixed;inset:0;pointer-events:none;z-index:30;overflow:hidden}
.petal{position:absolute;top:-30px;width:14px;height:10px;border-radius:70% 0 70% 0;background:linear-gradient(135deg,#f6a8c0,#d55d84);opacity:.75;animation:fall linear infinite}
@keyframes fall{0%{transform:translate3d(0,-20px,0) rotate(0)}100%{transform:translate3d(var(--dx),110vh,0) rotate(540deg)}}

/* reveal */
.reveal{opacity:0;transform:translateY(22px);transition:opacity 1s ease,transform 1s cubic-bezier(.2,.7,.2,1)}
.reveal.in{opacity:1;transform:none}
.slot.rise{opacity:0;transform:translateY(10px);transition:opacity 1.2s ease var(--d,0s),transform 1.2s ease var(--d,0s)}
.plate.in .slot.rise{opacity:1;transform:none}
.twinkle{position:absolute;pointer-events:none;animation:tw 3.4s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.05)}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.reveal,.slot.rise{opacity:1;transform:none}}
${C.families || C.blessings ? EXTRA_CSS : ''}${C.special || C.couple.firstParents ? THX_CSS : ''}${C.couple.firstQual || C.heading || C.locations ? `
/* qualifications under the names, a regional heading on the opening page, labelled location buttons */
.slot .qual{font-family:var(--serif);font-weight:600;font-size:calc(var(--fs) * .21);letter-spacing:.04em;line-height:1.25;color:var(--gold);text-shadow:0 1px 2px rgba(30,0,8,.6);margin-top:.15em}
.names .qual{display:block;font-family:var(--serif);font-weight:600;font-size:.36em;letter-spacing:.04em;line-height:1.3;color:var(--gold);margin:.1em 0 .2em}
.heading{text-align:center;font-weight:600;font-size:clamp(17px,4.9vw,21px);line-height:1.6;color:#fdf0c4;text-shadow:0 1px 2px rgba(30,0,8,.55);margin:0 auto 12px}
.btns.loc .btn{min-width:min(100%,290px);justify-content:center}` : ''}</style>${C.heading ? `
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(C.heading.font)}:wght@600&amp;display=swap">` : ''}
</head>
<body class="locked">
<div id="env" role="dialog" aria-label="Invitation envelope">
  <div class="stage">
    <div class="flap f-top"></div><div class="flap f-right"></div><div class="flap f-bottom"></div><div class="flap f-left"></div>
    <button class="seal" type="button" aria-label="Open the invitation"></button>
  </div>
  <div class="dear" hidden><div class="to">Dear</div><div class="nm"></div></div>
  <div class="hint"><span>Tap the seal to open</span></div>
</div>

<main id="invite">
  <section class="plate" id="couple" aria-label="Invitation">
    <img src="${C.couplePage || 'assets/couple-page.webp'}" alt="Together with their families. Your presence will make our celebration more special." width="1350" height="2400">
    ${slot('couple', [150, 330, 750, 480], 'serif rise', 37, lines(C.invite))}
    ${slot('couple', [110, 498, 790, 676], 'script rise', 150, lines([C.couple.first]) + (C.couple.firstQual ? `<span class="ln qual">${esc(C.couple.firstQual)}</span>` : ''))}
    ${slot('couple', [110, 716, 790, 894], 'script rise', 150, lines([C.couple.second]) + (C.couple.secondQual ? `<span class="ln qual">${esc(C.couple.secondQual)}</span>` : ''))}
    <img class="twinkle" src="assets/spark.webp" alt="" style="left:10.6%;top:14.7%;width:3.8%">
    <img class="twinkle" src="assets/spark.webp" alt="" style="left:85.5%;top:35%;width:3.4%;animation-delay:-1.6s">
  </section>

  <section class="band" id="story" aria-labelledby="story-h">
    <img class="corner tl" src="assets/corner-floral.webp" alt="">
${C.invocation ? `<p class="invoc reveal">${esc(C.invocation)}</p>\n` : ''}${C.heading ? `    <p class="heading reveal" lang="${C.heading.lang || 'te'}" style="font-family:'${C.heading.font}',serif">${esc(C.heading.text)}</p>\n` : ''}    <p class="kicker reveal">Two hearts, one journey</p>
    <h2 class="h2 reveal" id="story-h">Our Story</h2>
    <div class="orn reveal"><i></i><svg viewBox="0 0 16 16"><path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg><i></i></div>
${C.story ? `    <div class="arch reveal"><img src="${C.story.src}" alt="${esc(C.story.alt)}"${C.story.pos ? ` style="object-position:${C.story.pos}"` : ''} loading="lazy" width="1000" height="1333"></div>
` : ''}    <p class="names reveal">${esc(C.couple.first)}${C.couple.firstQual ? `<span class="qual">${esc(C.couple.firstQual)}</span>` : ''}${C.couple.firstParents ? `<span class="par">${esc(C.couple.firstParents)}</span>` : ''}<span class="amp">&amp;</span>${esc(C.couple.second)}${C.couple.secondQual ? `<span class="qual">${esc(C.couple.secondQual)}</span>` : ''}${C.couple.secondParents ? `<span class="par">${esc(C.couple.secondParents)}</span>` : ''}</p>
    <p class="lead reveal" style="margin-top:14px">${esc(C.storyLead || 'From a chance hello to a lifetime of together — with the blessings of our families, we begin our forever.')}</p>
    <div class="count reveal" id="count" aria-label="Countdown to the wedding day">
      <div><b data-k="d">00</b><span>Days</span></div><div><b data-k="h">00</b><span>Hours</span></div><div><b data-k="m">00</b><span>Mins</span></div><div><b data-k="s">00</b><span>Secs</span></div>
    </div>
  </section>

  <section class="plate" id="date" aria-label="Save our date">
    <img src="assets/date-page.webp" alt="Save our date" width="1350" height="2400" loading="lazy">
    ${slot('date', [346, 640, 556, 706], 'serif', 58, esc(C.day))}
    ${slot('date', [214, 706, 722, 772], 'serif gold', 66, esc(C.dateText), 'font-weight:700')}
    ${slot('date', [250, 790, 650, 844], 'serif', 40, esc(C.timeText))}
    <div class="scratch" id="scratch" style="${pct('date', [108, 606, 792, 968])}"><canvas></canvas></div>
    <button class="sr" id="reveal-btn" type="button">Reveal the date: ${esc(C.day)}, ${esc(C.dateText)}, ${esc(C.timeText)}</button>
    <a class="hit" href="event.ics" download="wedding.ics" style="${pct('date', [220, 860, 685, 945])}" aria-label="Add the celebrations to your calendar"></a>
  </section>

  <section class="band" id="programme" aria-labelledby="prog-h">
    <img class="corner tl" src="assets/corner-floral.webp" alt="">
    <p class="kicker reveal">Join us for</p>
    <h2 class="h2 reveal" id="prog-h">The Celebrations</h2>
    <div class="orn reveal"><i></i><svg viewBox="0 0 16 16"><path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg><i></i></div>
    ${programme}${C.locations ? `
    <div class="btns loc reveal">${C.locations.map(([label, href]) => `<a class="btn" href="${esc(href)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>${esc(label)}</a>`).join('')}</div>` : ''}
    <div class="btns reveal"><a class="btn" href="event.ics" download="wedding.ics"><svg viewBox="0 0 24 24"><path d="M7 2h2v2h6V2h2v2h3v18H4V4h3zm11 8H6v10h12z"/></svg>Save all dates</a></div>
  </section>

${C.families ? familiesBand + '\n' : ''}${C.photos.length ? `  <section class="band" id="gallery" aria-labelledby="gal-h">
    <p class="kicker reveal">Moments together</p>
    <h2 class="h2 reveal" id="gal-h">Gallery</h2>
    <div class="orn reveal"><i></i><svg viewBox="0 0 16 16"><path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg><i></i></div>
    <div class="gal reveal" id="gal">${gallery}
    </div>
    <div class="dots" id="dots">${C.photos.map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('')}</div>
    <img class="corner br" src="assets/corner-floral.webp" alt="">
  </section>
` : ''}
  <section class="plate" id="venue" aria-label="Venue">
    <img src="assets/venue-page.webp" alt="Venue" width="1062" height="2400" loading="lazy">
    ${slot('venue', [92, 366, 616, 468], 'serif rise', 47, lines(C.venue.name))}
    ${slot('venue', [104, 480, 604, 598], 'serif rise', 28, lines(C.venue.address), '--d:.2s')}
    <a class="hit" href="${esc(C.venue.maps)}" target="_blank" rel="noopener" style="${pct('venue', [103, 645, 605, 860])}" aria-label="Open the venue in Google Maps"></a>
    <a class="hit" href="${esc(C.venue.maps)}" target="_blank" rel="noopener" style="${pct('venue', [138, 880, 570, 955])}" aria-label="Take me there: open in Google Maps"></a>
  </section>

  <section class="band" id="contact" aria-labelledby="contact-h">
    <p class="kicker reveal">${esc((C.contact || {}).kicker || 'For any assistance')}</p>
    <h2 class="h2 reveal" id="contact-h">${esc((C.contact || {}).title || 'Get in Touch')}</h2>
    <div class="orn reveal"><i></i><svg viewBox="0 0 16 16"><path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg><i></i></div>
    <p class="lead reveal">${esc((C.contact || {}).lead || 'We would be delighted to help with directions, timings or anything you need.')}</p>
    ${(C.contact || {}).name ? `<p class="rsvp-name reveal">${esc(C.contact.name)}</p>` : ''}<a class="phone reveal" href="tel:+${digits}">${esc(C.phone)}</a>
    <div class="btns reveal">
      <a class="btn" href="tel:+${digits}"><svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>Call</a>
      <a class="btn ghost" href="https://wa.me/${digits}?text=${encodeURIComponent('Hello! I received the wedding invitation 💐')}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.6 2 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>WhatsApp</a>
      <button class="btn ghost" type="button" id="share"><svg viewBox="0 0 24 24"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1z"/></svg>Share</button>
    </div>
  </section>

${C.blessings ? blessingsBand + '\n' : ''}${C.special ? thanksSplit : `  <section class="plate" id="thanks" aria-label="Thank you">
    <img src="assets/thanks-page.webp" alt="With all our love. Thank you for being a part of our special journey." width="1031" height="2401" loading="lazy">
    ${slot('thanks', [100, 962, 587, 1010], 'caps rise', 25, esc(C.closing))}
  </section>`}
</main>

<button class="mute" id="mute" type="button" aria-label="Pause music"><span class="bars"><i></i><i></i><i></i><i></i></span></button>
<div class="box" id="box" role="dialog" aria-label="Photo"><img alt=""><button type="button" class="x" aria-label="Close">&times;</button><button type="button" class="nav prev" aria-label="Previous photo">&#8249;</button><button type="button" class="nav next" aria-label="Next photo">&#8250;</button></div>
<div class="petals" id="petals" aria-hidden="true"></div>
<audio id="music" src="${C.music || 'assets/music.mp3'}" loop preload="none"></audio>

<script>
(function(){
  "use strict";
  var PHOTOS=${JSON.stringify(C.photos)}, COUNT_TO=${JSON.stringify(C.countdownTo)};
  var env=document.getElementById("env"), audio=document.getElementById("music"), mute=document.getElementById("mute");
  var q=new URLSearchParams(location.search), to=(q.get("to")||"").trim().slice(0,40);
  if(to){var d=env.querySelector(".dear");d.hidden=false;d.querySelector(".nm").textContent=to;document.title=to+" — "+document.title}
  var muted=false;try{muted=localStorage.getItem("inv-muted")==="1"}catch(e){}

  function fadeIn(){audio.volume=0;var v=0,t=setInterval(function(){v=Math.min(.7,v+.05);audio.volume=v;if(v>=.7)clearInterval(t)},120)}
  function play(){if(muted)return;var p=audio.play();if(p&&p.then)p.then(fadeIn).catch(function(){})}
  function setMute(m){muted=m;mute.classList.toggle("off",m);mute.setAttribute("aria-label",m?"Play music":"Pause music");try{localStorage.setItem("inv-muted",m?"1":"0")}catch(e){}m?audio.pause():play()}
  mute.addEventListener("click",function(){setMute(!muted)});

  var opened=false;
  function open(){
    if(opened)return;opened=true;
    play();env.classList.add("open");document.body.classList.remove("locked");
    setTimeout(function(){env.classList.add("gone");mute.classList.add("on");mute.classList.toggle("off",muted);petals();fit()},1500);
    document.getElementById("couple").classList.add("in");
  }
  env.addEventListener("click",open);
  if(q.has("nodoor"))open();

  // shrink a line that would overflow its place
  function fit(){document.querySelectorAll(".slot").forEach(function(s){s.style.setProperty("--fit",1);var r=1;for(var i=0;i<12;i++){var over=false;s.querySelectorAll(".ln").forEach(function(l){if(l.scrollWidth>s.clientWidth)over=true});if(s.scrollHeight>s.clientHeight+2)over=true;if(!over)break;r*=.92;s.style.setProperty("--fit",r)}})}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);addEventListener("resize",fit);fit();

  // reveal on scroll
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.15});
  document.querySelectorAll(".reveal,.plate").forEach(function(el){io.observe(el)});

  // countdown
  var end=new Date(COUNT_TO).getTime(), cb=document.querySelectorAll("#count b");
  function tick(){var s=Math.max(0,Math.floor((end-Date.now())/1000)),v={d:Math.floor(s/86400),h:Math.floor(s%86400/3600),m:Math.floor(s%3600/60),s:s%60};cb.forEach(function(b){var n=v[b.dataset.k];b.textContent=n<10?"0"+n:n})}
  tick();setInterval(tick,1000);

  // scratch cover over the date
  (function(){
    var box=document.getElementById("scratch"),cv=box.querySelector("canvas"),cx=cv.getContext("2d"),img=new Image(),done=false,strokes=0,last=null;
    img.src="assets/date-cover.webp";
    function size(){var r=box.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);cv.width=Math.max(1,r.width*d);cv.height=Math.max(1,r.height*d);draw()}
    function draw(){cx.globalCompositeOperation="source-over";cx.clearRect(0,0,cv.width,cv.height);if(img.complete&&img.naturalWidth)cx.drawImage(img,0,0,cv.width,cv.height);else{cx.fillStyle="#b88a3e";cx.fillRect(0,0,cv.width,cv.height)}}
    img.onload=draw;
    function reveal(){if(done)return;done=true;box.classList.add("done");burst()}
    function pos(e){var r=cv.getBoundingClientRect(),p=e.touches?e.touches[0]:e;return{x:(p.clientX-r.left)/r.width*cv.width,y:(p.clientY-r.top)/r.height*cv.height}}
    function rub(e){if(done)return;var p=pos(e);cx.globalCompositeOperation="destination-out";cx.lineCap="round";cx.lineWidth=cv.width*.13;cx.beginPath();cx.moveTo((last||p).x,(last||p).y);cx.lineTo(p.x,p.y);cx.stroke();last=p;if(++strokes>40)reveal()}
    var down=false;
    box.addEventListener("pointerdown",function(e){down=true;last=null;box.setPointerCapture&&box.setPointerCapture(e.pointerId);rub(e)});
    box.addEventListener("pointermove",function(e){if(down){e.preventDefault();rub(e)}});
    box.addEventListener("pointerup",function(){down=false;if(strokes>14)reveal()});
    box.addEventListener("click",function(){if(strokes<3)setTimeout(reveal,150)});
    document.getElementById("reveal-btn").addEventListener("click",reveal);
    addEventListener("resize",function(){if(!done)size()});
    new IntersectionObserver(function(es,o){if(es[0].isIntersecting){size();o.disconnect()}}).observe(box);
  })();

  function burst(){var host=document.getElementById("date");for(var i=0;i<26;i++){var p=document.createElement("i");p.className="petal";p.style.cssText="position:absolute;top:45%;left:"+(30+Math.random()*40)+"%;--dx:"+(Math.random()*160-80)+"px;animation:fall "+(2.5+Math.random()*2)+"s linear forwards;animation-delay:"+(Math.random()*.4)+"s";host.appendChild(p);setTimeout(function(n){n.remove()}.bind(null,p),5200)}}

  function petals(){var h=document.getElementById("petals");if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;for(var i=0;i<9;i++){var p=document.createElement("i");p.className="petal";p.style.left=Math.random()*100+"%";p.style.setProperty("--dx",(Math.random()*120-60)+"px");p.style.animationDuration=(9+Math.random()*8)+"s";p.style.animationDelay=(-Math.random()*14)+"s";p.style.transform="scale("+(.6+Math.random()*.6)+")";h.appendChild(p)}}

  // gallery: dots + lightbox
  var gal=document.getElementById("gal")${C.photos.length ? '' : '||document.createElement("div")'},dots=document.querySelectorAll("#dots i");
  gal.addEventListener("scroll",function(){var w=gal.firstElementChild.getBoundingClientRect().width+14,i=Math.round(gal.scrollLeft/w);dots.forEach(function(d,k){d.classList.toggle("on",k===i)})},{passive:true});
  var lb=document.getElementById("box"),li=lb.querySelector("img"),cur=0;
  function show(i){cur=(i+PHOTOS.length)%PHOTOS.length;li.src=${hasFull ? 'PHOTOS[cur].full||PHOTOS[cur].src' : 'PHOTOS[cur].src'};li.alt=PHOTOS[cur].alt;lb.classList.add("on")}
  gal.querySelectorAll(".g-btn").forEach(function(b){b.addEventListener("click",function(){show(+b.dataset.i)})});
  lb.querySelector(".x").addEventListener("click",function(){lb.classList.remove("on")});
  lb.querySelector(".prev").addEventListener("click",function(e){e.stopPropagation();show(cur-1)});
  lb.querySelector(".next").addEventListener("click",function(e){e.stopPropagation();show(cur+1)});
  lb.addEventListener("click",function(e){if(e.target===lb)lb.classList.remove("on")});
  addEventListener("keydown",function(e){if(!lb.classList.contains("on"))return;if(e.key==="Escape")lb.classList.remove("on");if(e.key==="ArrowLeft")show(cur-1);if(e.key==="ArrowRight")show(cur+1)});

${C.blessings ? BLESS_JS + '\n' : ''}  // share
  document.getElementById("share").addEventListener("click",function(){var u=location.origin+location.pathname,t=document.title.replace(/^.* — /,"");if(navigator.share){navigator.share({title:t,url:u}).catch(function(){})}else{location.href="https://wa.me/?text="+encodeURIComponent(t+" "+u)}});
  document.addEventListener("visibilitychange",function(){if(document.hidden)audio.pause();else if(opened)play()});
})();
</script>
<script src="/_credit/v1/credit.js" defer data-into="#invite" data-bg="#3a0b18" data-color="#f3d596"></script>
</body>
</html>
`;

const dir = path.join(ROOT, 'public', C.out);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'index.html'), html);
fs.writeFileSync(path.join(dir, 'event.ics'), ics());
console.log('wrote', path.relative(ROOT, dir));
