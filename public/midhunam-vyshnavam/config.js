/* Midhunam & Vyshnavam — Gruhapravesham invitation (client brief 2026-11-17). ALL client information lives in this one file.
   After editing it, run:  node tools/midhunam-vyshnavam.mjs   (it rewrites index.html from these values; the page's
   script reads the same file for the countdown and the RSVP).
   Every name, date and time is exactly as the family wrote it. The Gruhapravesham is dated 22 August 2026 and the
   three celebrations 20 November 2026: both are kept as supplied, neither is "corrected". */
export const invite = {
  slug: 'midhunam-vyshnavam',
  title: 'Gruhapravesham — Midhunam & Vyshnavam',

  /* the cover */
  hero: {
    deva: '॥ श्री गणेशाय नमः ॥',
    invocations: [
      '॥ Sri Matre Namah ॥',
      '॥ Sri Venkateshwaraya Namah ॥',
      '॥ Sri Parvathi Parameshwaraya Namah ॥',
      '॥ Sri Shirdi Sainadhaya Namah ॥',
    ],
    ceremony: 'Gruhapravesham',
    sub: 'Of Our New Homes',
    home: 'Midhunam & Vyshnavam',
    scrollCue: 'SCROLL TO EXPLORE',      // shown at the foot of the screen once the doors open, until the guest scrolls
  },

  /* the families: each elder with her own line beneath */
  blessingsOf: [
    ['Sri. Dukka Sanyasamma', 'W/o Sri. (Late) Dukka Peddappanna'],
    ['Sri. Joga Bharathi', 'W/o Sri. (Late) Joga Ramarao'],
  ],
  hosts: ['Dukka Srinuvasa Rao', 'Kanaka Swarupa'],
  inviteLine: 'Cordially invite you and your family to join us and bless us on the auspicious occasion of the Gruhapravesham and celebrations of our new homes.',

  /* the homes */
  homes: { label: 'OUR NEW HOMES', name: 'Midhunam & Vyshnavam', lines: ['Flat No. 215 & 402,', 'Supra Majestic,', 'Tagarapuvalasa, Visakhapatnam.'] },

  /* every time is India time */
  timeZone: 'Asia/Kolkata',
  utcOffset: '+05:30',
  place: 'Tagarapuvalasa, Visakhapatnam',

  /* the four celebrations, each on its own card. `calendar: true` gives the card its own "Add to Google Calendar"
     link (start only: no end times were supplied, so the entry ends when it starts). The Gruhapravesham of 22 August
     had already passed when this invitation was made, so its card carries no calendar link. */
  events: [
    { name: 'Gruhapravesham', date: '2026-08-22', dateText: 'Saturday, 22 August 2026', time: '06:03', label: '6:03 AM', art: 'entry', alt: 'Family entering the new home', calendar: false },
    { name: 'Ganesh & Vasthu Puja', date: '2026-11-20', dateText: 'Friday, 20 November 2026', time: '06:30', label: '6:30 AM', art: 'ganesha', alt: 'Lord Ganesha', calendar: true },
    { name: 'Satyanarayana Swamy Pooja', date: '2026-11-20', dateText: 'Friday, 20 November 2026', time: '08:00', label: '8:00 AM', art: 'satyanarayana', alt: 'Sri Satyanarayana Swamy', calendar: true },
    { name: 'Lunch', date: '2026-11-20', dateText: 'Friday, 20 November 2026', time: '12:00', label: '12:00 PM onwards', art: 'meal', alt: 'Banana leaf meal', calendar: true },
  ],
  /* the countdown runs to this one (the first celebration of 20 November) */
  countdownTo: 1,

  venue: {
    name: 'MIDHUNAM & VYSHNAVAM',
    lines: ['Flat No. 215 & 402, Supra Majestic,', 'Tagarapuvalasa, Visakhapatnam.'],
    note: 'Venue celebrations: 20 November 2026, 8:00 AM onwards',
    /* NO Google Maps link was supplied. Until the family sends their own pin, the button opens Google Maps' search
       for the written address (not a guessed pin). Replace this with their link when it arrives. */
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Supra Majestic, Tagarapuvalasa, Visakhapatnam'),
  },

  /* An RSVP is recorded by rsvp.php in this folder: every reply lands in one list the hosts open with their private
     link (rsvp.php?key=…, also as CSV). The key is NOT here or anywhere in the page: it lives in rsvp.secret.php. */
  rsvp: { endpoint: 'rsvp.php', maxGuests: 20, defaultGuests: 2, maxMessage: 500 },

  calendar: { location: 'Midhunam & Vyshnavam, Flat No. 215 & 402, Supra Majestic, Tagarapuvalasa, Visakhapatnam' },

  closing: 'We warmly look forward to celebrating this special occasion with you and your family.',
};
