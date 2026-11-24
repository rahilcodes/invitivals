/* Shazli Haider & Syed Mohammed Ashir Kamal — NIKAH + RUKHSATI invitation (no Mayun, no Mehendi anywhere).
   The complete link is public/shazli-ashir-wedding/ (same code, its own config.js); RSVP replies are stored there.
   Hosted by the bride's mother (client): mother-only wording, never "Late". The bride's father, Syed Shamshad Haider,
   was named in the 24 Nov brief but no line was given for him, so he is not printed (the first brief asked that he
   stay out of the host wording).
   Dates are India time (+05:30); weekdays checked: 18 Jan 2027 Monday, 19 Tuesday, 20 Wednesday, 21 Thursday. */
const VENUE = {
  name: 'Majestic Heaven',
  city: 'Bodhgaya',
  place: 'Nirvana Grand Hotel and Resort, Bodhgaya',
  full: 'Majestic Heaven, Nirvana Grand Hotel and Resort, Bodhgaya',
  mapsUrl: 'https://maps.app.goo.gl/cTws4DmJN9qvzTcq9?g_st=ac',
};

export const config = {
  slug: 'shazli-ashir-nikah',
  link: 'nikah-rukhsati',
  bride: 'Shazli Haider',
  groom: ['Syed Mohammed', 'Ashir Kamal'],          // "Syed Mohammed Ashir Kamal", set on two lines
  groomFull: 'Syed Mohammed Ashir Kamal',
  host: 'Mrs. Roomana Haider',
  groomParents: 'Md. Kamal Hassan & Sarwer Naz',
  venue: VENUE,

  saveTheDate: { day: '20', month: 'January 2027', arabic: 'إِنْ شَاءَ ٱللَّٰهُ', line: 'A new chapter begins' },

  /* the Our Functions cards, in date order; only Nikah and Rukhsati carry the venue and its map */
  events: [
    { key: 'nikah', title: 'Nikah', weekday: 'Wednesday', date: '20 January 2027', time: '7:00 PM', extra: 'Dinner at 8:00 PM onwards', start: '2027-01-20T19:00:00+05:30', venue: true },
    { key: 'rukhsati', title: 'Rukhsati', weekday: 'Thursday', date: '21 January 2027', time: '10:00 AM', start: '2027-01-21T10:00:00+05:30', venue: true },
  ],

  rsvp: {
    endpoint: '/shazli-ashir-wedding/rsvp.php',      // both links store their replies here, each marked with its link
    phone: '+91 9572630015', tel: '+919572630015',
    googleForm: null,                                // the family's Google Form (responses in a Google Sheet): pending
  },

  thanks: ['Thank you for being a part of the special day.', 'With love,', 'All relatives and family members.'],
  music: 'assets/music.mp3', musicVolume: 0.7,
};
