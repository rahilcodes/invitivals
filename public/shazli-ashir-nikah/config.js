/* Shazli Haider & Syed Mohammed Ashir Kamal — NIKAH + RUKHSATI invitation (no Mayun, no Mehendi anywhere).
   The complete link is public/shazli-ashir-wedding/ (same code, its own config.js); RSVP replies are stored there.
   Hosted by the bride's mother (client): mother-only host wording, never "Late". Since the 24 Nov refinement the
   bride's parents (Syed Shamshad Haider, named in the client's brief, and Roomana Haider) are printed under her name,
   as the groom's are under his. Venue since 24 Nov: Nirvana Grand Hotel and Resort, Bodhgaya (no hall name).
   Dates are India time (+05:30); weekdays checked: 18 Jan 2027 Monday, 19 Tuesday, 20 Wednesday, 21 Thursday. */
const VENUE = {
  name: 'Nirvana Grand Hotel and Resort',
  city: 'Bodhgaya',
  place: 'Bodhgaya',
  full: 'Nirvana Grand Hotel and Resort, Bodhgaya',
  mapsUrl: 'https://maps.app.goo.gl/cTws4DmJN9qvzTcq9?g_st=ac',
};

export const config = {
  slug: 'shazli-ashir-nikah',
  link: 'nikah-rukhsati',
  bride: 'Shazli Haider',
  groom: ['Syed Mohammed', 'Ashir Kamal'],          // "Syed Mohammed Ashir Kamal", set on two lines
  groomFull: 'Syed Mohammed Ashir Kamal',
  host: 'Mrs. Roomana Haider',
  brideParents: ['Syed Shamshad Haider', 'Roomana Haider'],
  groomParents: ['Md. Kamal Hassan', 'Sarwer Naz'],
  venue: VENUE,

  saveTheDate: { day: '20', month: 'January 2027', arabic: 'إِنْ شَاءَ ٱللَّٰهُ', line: 'A new chapter begins' },

  /* the Our Functions cards, in date order; only Nikah and Rukhsati carry the venue and its map. The cards show
     venue.name; each View Details page shows the function's own venueLines, one line each, as the client set them
     on 26 Nov (Nikah: hall, property, city; Rukhsati: property, city) */
  events: [
    { key: 'nikah', title: 'Nikah', weekday: 'Wednesday', date: '20 January 2027', time: '7:00 PM', extra: 'Dinner at 8:00 PM onwards', start: '2027-01-20T19:00:00+05:30', venue: true,
      venueLines: ['“Majestic Heaven”', 'Nirvana Grand Hotel and Resort', 'Bodhgaya'],   // hall (in quotes, client 27 Nov), property, city
      location: 'Majestic Heaven, Nirvana Grand Hotel and Resort, Bodhgaya' },
    { key: 'rukhsati', title: 'Rukhsati', weekday: 'Thursday', date: '21 January 2027', time: '10:00 AM', start: '2027-01-21T10:00:00+05:30', venue: true,
      venueLines: ['Nirvana Grand Hotel and Resort', 'Bodhgaya'],                        // no "Venue" (client, 26 Nov)
      location: 'Nirvana Grand Hotel and Resort, Bodhgaya' },
  ],

  rsvp: {
    endpoint: '/shazli-ashir-wedding/rsvp.php',      // both links store their replies here, each marked with its link
    help: 'Please feel free to reach out for any help or query on',   // the client's exact sentence (24 Nov)
    choices: ['Yes, I’ll be attending', 'No, apologies can’t make it'],   // the client's wording (26 Nov)
    maxGuests: 20,
    phone: '7280979429', tel: '+917280979429',
    googleForm: null,                                // the family's Google Form (responses in a Google Sheet): pending
  },

  thanks: ['Thank you for being a part of the special day.', 'With love,', 'All relatives and family members.'],
  music: 'assets/music.mp3', musicVolume: 0.7,
};
