/* Nandana Vanam — Gruhapravesam invitation. ALL client information lives in this one file.
   After editing it, run:  node tools/nandana-vanam.mjs   (it rewrites index.html and event.ics from these values;
   the page's script reads the same file for the countdown, the RSVP and the calendar). */
export const invite = {
  slug: 'nandana-vanam',
  title: 'Gruhapravesam Ceremony — Nandana Vanam',

  /* the cover */
  hero: {
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
  scratch: { weekday: 'Saturday', day: '12', month: 'December', year: '2026' },

  /* the programme; the countdown runs to the first of these */
  events: [
    { name: 'Gruhapravesham', time: '16:40', label: '4:40 PM', art: 'entry', alt: 'Family entering the new home' },
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
  },

  /* Save the Date (.ics).
     END TIME REQUIRES CONFIRMATION: the client supplied 4:00 PM, which is before the 4:40 PM start, so no end time is
     set and the Save the Date button stays off the page. Put the confirmed end here as 'HH:MM' (24-hour, event's local
     time, e.g. '22:00') and run the tool: the button and event.ics appear. */
  calendar: {
    title: 'Gruhapravesam Ceremony – Nandana Vanam',
    hosts: 'Sri Srinivas Sai Pavan Nunna & Smt. Harsha Jasmin Mallela',
    location: 'Nandana Vanam, 1305 Addison Lake St, Fuquay Varina, NC 27526',
    endTime: null,
  },

  closing: 'We warmly look forward to celebrating this special occasion with you and your family.',
};
