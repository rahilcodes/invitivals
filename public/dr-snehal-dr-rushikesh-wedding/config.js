/* ─────────────────────────────────────────────────────────────
   Dr. Snehal & Dr. Rushikesh: 3–5 December 2026, IKON Celebration and Nandini Lawns, Chhatrapati Sambhajinagar.
   A separate copy of the IKON Celebration page (public/ikon-celebration-wedding, client brief 2026-11-16, never
   edited for this) with the couple and their families added (client brief 2026-11-17). Every family name is exactly as the client
   wrote it. Second brief of 2026-11-17: the SR monogram on the wax seal (in the film itself, see
   tools/dr-snehal-dr-rushikesh-film), the couple's degrees under their names, the four functions under the names
   the client gave them, and the Mehendi once only: 3 December, from 5:00 PM (it is no longer listed on the 4th).
   Every other word is the client's. No event has an end time, and none is invented.
   Dates are ISO in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
const IKON = {
  venue: 'IKON Celebration', address: ['Beed Bypass, Opposite Madhuban Hotel,', 'Chhatrapati Sambhajinagar.'],
  mapsUrl: 'https://maps.app.goo.gl/PxirWymrL4aPGYqy7?g_st=iw',
};
const NANDINI = { venue: 'Nandini Lawns', address: [], mapsUrl: 'https://maps.app.goo.gl/ccWmxxgMxsPKw2h46?g_st=iw' };

export const config = {
  couple: { bride: 'Dr. Snehal', groom: 'Dr. Rushikesh' },
  /* the qualifications, exactly as the client wrote them, under each name on the first page */
  degrees: { bride: ['(M.B.B.S., M.D. Radio Diagnosis)'], groom: ['(M.B.B.S., M.D., General Medicine,', 'DM-Nephrology)'] },   // the groom's, on two lines so it stays readable on a phone

  /* the Bride and Groom pages (the design's gold frame; the Groom's mirrored). Each array is the lines as they
     are set, so the long names break where they read naturally and never wrap on their own. */
  families: [
    { key: 'bride', label: 'The Bride', name: 'Dr. Snehal',
      parents: ['D./O. Mrs. Meera and', 'Mr. Abasaheb Ganpatrao', 'Jagtap (Patil)'],
      elders: { label: 'Granddaughter of', lines: ['Late Ganpatrao Nivrutti', 'Jagtap (Patil)'] } },
    { key: 'groom', label: 'The Groom', name: 'Dr. Rushikesh', mirror: true,
      parents: ['Son of Mrs. Kalpana and', 'Mr. Panjabrao Anandrao Chavan'],
      elders: { label: 'Grandson of', lines: ['Mr. Anandrao Bapurao Chavan'] } },
  ],

  /* page 1: Ganesha (the design's own), the mantra, the couple (`title` is shown only without a couple) */
  hero: {
    ganesha: 'assets/p1-ganesha.webp',
    hindi: ['॥ श्री गणेशाय नमः ॥'],
    eyebrow: 'Wedding Invitation',
    title: ['Wedding', 'Celebrations'],
    dates: '3 – 5 December 2026',
    place: ['IKON Celebration', 'Chhatrapati Sambhajinagar'],
  },

  /* page 2: the date on the parchment (the wedding ceremony) */
  date: { day: '5', suffix: 'th', month: 'December', year: '2026', time: '6:00 PM' },

  /* the wedding, for the countdown and Save the Date */
  wedding: { start: '2026-12-05T18:00:00+05:30', dateLine: '5 December 2026', weekday: 'Saturday', time: '6:00 PM Onwards', title: 'Wedding Ceremony & Varmala', ...IKON },

  /* page 3 → the four functions, in the order they happen; each opens its own detail page. `title` is the name
     the client gave the function (`titleLines`: how it is set between the arch's flowers on its own page), `sub` the ceremony it is. schedule rows: [time, event, note, start]; `start`
     (ISO) gives the row its own "Add to Google Calendar" link. */
  days: [
    {
      key: 'mehendi', date: '3 December 2026', weekday: 'Thursday', title: 'Mehfil-e-Mehendi', titleLines: ['Mehfil-e-', 'Mehendi'], sub: 'Mehendi Ceremony',
      schedule: [['5:00 PM onwards', 'Mehendi Ceremony', '', '2026-12-03T17:00:00+05:30']],
      ...NANDINI,
    },
    {
      key: 'haldi', date: '4 December 2026', weekday: 'Friday', title: 'Sunshine Hustle', titleLines: ['Sunshine', 'Hustle'], sub: 'Haldi Ceremony',
      schedule: [['12:00 PM', 'Haldi Ceremony', 'Dress Code: Shades of Yellow & Pink', '2026-12-04T12:00:00+05:30']],
      ...IKON,
    },
    {
      key: 'sangeet', date: '4 December 2026', weekday: 'Friday', title: 'Rhythm of Love', titleLines: ['Rhythm', 'of Love'], sub: 'Sangeet Ceremony',
      schedule: [['7:00 PM', 'Sangeet Ceremony', 'Dress Code: Shimmer & Sparkle', '2026-12-04T19:00:00+05:30']],
      ...IKON,
    },
    {
      key: 'wedding', date: '5 December 2026', weekday: 'Saturday', title: 'Saptpadi & Varmala', titleLines: ['Saptpadi &', 'Varmala'], sub: 'The Wedding',
      schedule: [
        ['10:00 AM', 'Saptpadi', 'Theme / Attire: Maharashtrian Traditional', '2026-12-05T10:00:00+05:30'],
        ['6:00 PM Onwards', 'Wedding Ceremony', 'Dress Code: Formal Indian', '2026-12-05T18:00:00+05:30'],
        ['7:00 PM', 'Varmala', '', '2026-12-05T19:00:00+05:30'],
      ],
      ...IKON,
    },
  ],

  /* the countdown page */
  countdown: { title: ['The Countdown', 'to Forever'], lines: ['The wait is almost over.', 'A beautiful new beginning awaits!'], done: 'The day is here. A beautiful new beginning begins!', units: ['Days', 'Hours', 'Minutes', 'Seconds'] },

  /* the Save the Date page: the wedding with Add to Google Calendar and the venue map */
  saveTheDate: { title: 'Save the Date', button: 'Add to Calendar', maps: 'View on Google Maps', labels: ['Date', 'Time'] },

  /* the closing, in the client's words */
  closing: { title: ['With Love', '& Blessings'], lines: 'We cordially invite you to join us and bless the couple as they begin their beautiful journey together.' },

  opening: {
    /* the film and the still, with the couple's SR monogram embossed on the wax seal in the picture itself
       (tools/dr-snehal-dr-rushikesh-film): it cracks and flies apart with the seal, so nothing is laid over the film */
    video: 'assets/opening-sr.mp4',
    poster: 'assets/opening-sr.webp',
    music: 'assets/music.mp3',
    musicFadeSeconds: 3,
    musicVolume: 0.8,
    filmMaxSeconds: 14,
  },
};
