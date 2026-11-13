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
    showDate: false,                     // the date line under the home's name was taken off the cover (client, 2026-11-13)
    scrollCue: 'SCROLL TO EXPLORE',      // shown at the foot of the screen once the doors open, until the guest scrolls
  },

  /* the families */
  /* the two family surnames were removed from every name at the client's request, 2026-11-14 */
  blessingsOf: ['Sri Ratnarao & Smt. Varalakshmi', 'Sri Nageswara Rao & Smt. Hemalatha'],
  hosts: ['Sri Srinivas Sai Pavan', 'Smt. Harsha Jasmin'],
  inviteLine: 'Cordially invite you and your family to celebrate the Gruhapravesham Ceremony of their new home.',

  /* the day — the event's own wall-clock time and IANA timezone; never the visitor's */
  date: '2026-12-12',
  dateText: 'Saturday, December 12, 2026',
  timeZone: 'America/New_York',
  utcOffsetFallback: '-05:00',          // Eastern Standard Time on 12 December; used only if a browser has no timezone data
  place: 'Fuquay Varina, North Carolina, USA',

  /* the programme; the countdown runs to the first of these */
  events: [
    { name: 'Gruhapravesham', time: '16:04', label: '4:04 PM', art: 'entry', alt: 'Family entering the new home' },
    { name: 'Satyanarayana Swamy Pooja', time: '18:00', label: '6:00 PM', art: 'satyanarayana', alt: 'Sri Satyanarayana Swamy' },
    { name: 'Dinner', time: '20:00', label: '8:00 PM', art: 'meal', alt: 'Banana leaf meal' },
  ],

  venue: {
    name: 'NANDANA VANAM',
    lines: ['1305 Addison Lake St,', 'Fuquay Varina, NC 27526'],
    mapsUrl: 'https://share.google/E4Nl01ck8vAjr4h9J',
  },

  /* An RSVP is recorded by rsvp.php: every reply (name, contact number, attendance, guests, time) lands in one list
     the hosts open with their private link (rsvp.php?key=…, also as CSV). There is no email step any more: the client
     found following up on separate emails too awkward (2026-11-14).
     NEXT: the client wants the replies in Google Forms / Sheets. A form cannot be created from here (it needs the
     owner's Google account), so the form's link is awaited; when it arrives, the replies are sent to it instead. */
  rsvp: {
    endpoint: 'rsvp.php',
    maxGuests: 20,
    defaultGuests: 2,
  },

  /* Save the Date: the button opens Google Calendar's "new event" screen with the details filled in (client,
     2026-11-12: no automatic .ics download). event.ics is still written, only as the fallback link shown after the tap.
     The start is the Gruhapravesham, 4:04 PM (the client's times, last corrected 2026-11-13). No end time was
     ever confirmed, so event.ics carries DTSTART and no DTEND, and nothing is invented.
     If an end is ever confirmed, put it here as 'HH:MM' (24-hour, the event's local time) and run the tool. */
  calendar: {
    title: 'Gruhapravesham Ceremony – Nandana Vanam',   // the client's spelling for the calendar event (2026-11-12)
    hosts: 'Sri Srinivas Sai Pavan & Smt. Harsha Jasmin',
    location: 'Nandana Vanam, 1305 Addison Lake St, Fuquay Varina, NC 27526',
    enabled: true,
    endTime: null,
  },

  closing: 'We warmly look forward to celebrating this special occasion with you and your family.',
};
