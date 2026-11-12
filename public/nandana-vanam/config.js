/* Nandana Vanam — Gruhapravesam invitation. ALL client information lives in this one file.
   After editing it, run:  node tools/nandana-vanam.mjs   (it rewrites index.html and event.ics from these values;
   the page's script reads the same file for the countdown, the RSVP and the calendar). */
export const invite = {
  slug: 'nandana-vanam',
  title: 'Gruhapravesam Ceremony — Nandana Vanam',

  /* the cover */
  hero: {
    /* the devotional lines over the heading, exactly as the client wrote them (2026-11-12) */
    invocations: [
      '॥ Sri Parvati Parameshwara Prasanna ॥',
      '॥ Sri Venkateshwara Swamy Prasanna ॥',
      '॥ Sri Shirdi Sai Baba Prasanna ॥',
      '॥ Sri Bhoo Lakshmi Varaha Prasanna ॥',
    ],
    kicker: 'WE CORDIALLY INVITE YOU TO THE',
    ceremony: 'Gruhapravesam',
    sub: 'of our new home',
    home: 'Nandana Vanam',
  },

  /* the families */
  blessingsOf: ['Sri Nunna Ratnarao & Smt. Nunna Varalakshmi', 'Sri Mallela Nageswara Rao & Smt. Mallela Hemalatha'],
  hosts: ['Sri Srinivas Sai Pavan Nunna', 'Smt. Harsha Jasmin Mallela'],
  inviteLine: 'Cordially invite you and your family to celebrate the Gruhapravesham Ceremony of their new home.',

  /* the day — the event's own wall-clock time and IANA timezone; never the visitor's */
  date: '2026-12-12',
  dateText: 'Saturday, December 12, 2026',
  timeZone: 'America/New_York',
  utcOffsetFallback: '-05:00',          // Eastern Standard Time on 12 December; used only if a browser has no timezone data
  place: 'Fuquay Varina, North Carolina, USA',

  /* the programme; the countdown runs to the first of these */
  events: [
    { name: 'Gruhapravesham', time: '16:00', label: '4:00 PM', art: 'entry', alt: 'Family entering the new home' },
    { name: 'Satyanarayana Swamy Pooja', time: '18:40', label: '6:40 PM', art: 'satyanarayana', alt: 'Sri Satyanarayana Swamy' },
    { name: 'Dinner', time: '20:30', label: '8:30 PM', art: 'meal', alt: 'Banana leaf meal' },
  ],

  venue: {
    name: 'NANDANA VANAM',
    lines: ['1305 Addison Lake St,', 'Fuquay Varina, NC 27526'],
    mapsUrl: 'https://share.google/E4Nl01ck8vAjr4h9J',
  },

  rsvp: {
    endpoint: 'rsvp.php',
    email: 'caharshajasmin777@gmail.com',
    phoneText: '+1 716-259-4524',
    whatsapp: '17162594524',
    maxGuests: 20,
    defaultGuests: 2,
  },

  /* Save the Date: the button opens Google Calendar's "new event" screen with the details filled in (client,
     2026-11-12: no automatic .ics download). event.ics is still written, only as the fallback link shown after the tap.
     The start is the Gruhapravesham, 4:00 PM (corrected by the client on 2026-11-12 from 4:40 PM). No end time was
     ever confirmed, so event.ics carries DTSTART and no DTEND, and nothing is invented.
     If an end is ever confirmed, put it here as 'HH:MM' (24-hour, the event's local time) and run the tool. */
  calendar: {
    title: 'Gruhapravesham Ceremony – Nandana Vanam',   // the client's spelling for the calendar event (2026-11-12)
    hosts: 'Sri Srinivas Sai Pavan Nunna & Smt. Harsha Jasmin Mallela',
    location: 'Nandana Vanam, 1305 Addison Lake St, Fuquay Varina, NC 27526',
    enabled: true,
    endTime: null,
  },

  closing: 'We warmly look forward to celebrating this special occasion with you and your family.',
};
