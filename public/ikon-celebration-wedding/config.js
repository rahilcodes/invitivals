/* ─────────────────────────────────────────────────────────────
   A wedding invitation on the design the client chose (the Vaishali & Arpan page, public/vaishali-arpan-wedding,
   never edited for this): 3–5 December 2026, IKON Celebration and Nandini Lawns, Chhatrapati Sambhajinagar
   (client brief 2026-11-16).
   THE COUPLE'S NAMES WERE NOT SUPPLIED: nothing on the page names them, and the seal carries no initials.
   When they come, set `couple` below (and the page title / link preview) — the hero, Save the Date and the
   calendar entries then read them.
   Every other word is the client's. Nothing they did not supply is shown: the 4 December Mehendi has no date or
   time ("To be confirmed", and no calendar button); no event has an end time, and none is invented.
   Dates are ISO in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
const IKON = {
  venue: 'IKON Celebration', address: ['Beed Bypass, Opposite Madhuban Hotel,', 'Chhatrapati Sambhajinagar.'],
  mapsUrl: 'https://maps.app.goo.gl/PxirWymrL4aPGYqy7?g_st=iw',
};
const NANDINI = { venue: 'Nandini Lawns', address: [], mapsUrl: 'https://maps.app.goo.gl/ccWmxxgMxsPKw2h46?g_st=iw' };

export const config = {
  couple: null,   /* e.g. { bride: '…', groom: '…' } once the client sends the names */

  /* page 1: Ganesha (the design's own), the mantra, and the celebration in place of names */
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

  /* page 3 → the three days (detail pages). schedule rows: [time, event, note, start]; `start` (ISO) gives the
     row its own "Add to Google Calendar" link; a row without one (the unconfirmed Mehendi) has none. */
  days: [
    {
      key: 'day0', date: '3 December 2026', weekday: 'Thursday', title: 'Mehendi Celebration', titleLines: ['Mehendi', 'Celebration'],
      schedule: [['6:00 PM onwards', 'Mehendi Celebration', '', '2026-12-03T18:00:00+05:30']],
      ...NANDINI,
    },
    {
      key: 'day1', date: '4 December 2026', weekday: 'Friday', title: 'Haldi, Mehendi & Sangeet',
      schedule: [
        ['12:00 PM', 'Haldi Ceremony', 'Dress Code: Shades of Yellow & Pink', '2026-12-04T12:00:00+05:30'],
        ['Date & Time: To be confirmed', 'Mehendi Ceremony', 'Dress Code: Shades of Green', null],
        ['7:00 PM', 'Sangeet Ceremony', 'Dress Code: Shimmer & Sparkle', '2026-12-04T19:00:00+05:30'],
      ],
      ...IKON,
    },
    {
      key: 'day2', date: '5 December 2026', weekday: 'Saturday', title: 'Saptapadi & the Wedding',
      schedule: [
        ['10:00 AM', 'Saptapadi', 'Theme / Attire: Maharashtrian Traditional', '2026-12-05T10:00:00+05:30'],
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
    video: 'assets/opening.mp4',
    poster: 'assets/opening.webp',
    music: 'assets/music.mp3',
    musicFadeSeconds: 3,
    musicVolume: 0.8,
    /* the design's film has a lettered wax seal: this plain face (no initials — the names are not known) is laid
       over it until the seal breaks at `sealUntil` seconds; a burst of light then covers the flying pieces */
    sealFace: 'assets/seal.png',
    seal: { cx: 0.526, cy: 0.499, r: 0.141 },
    sealUntil: 2.42,
    burstEnd: 3.3,
    filmMaxSeconds: 14,
  },
};
