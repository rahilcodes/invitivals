/* ─────────────────────────────────────────────────────────────
   Vaishali & Arpan: bride-side wedding invitation on the Brown Theme Wedding design.
   Every word on the page comes from here (and index.html's meta tags).
   Dates are ISO in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
export const config = {
  couple: { bride: 'Vaishali', groom: 'Arpan' },

  /* page 1 */
  hero: {
    invocation: 'Ek Tu Hi Nirankar',
    hindi: ['तेरे आसरा ले के करता हूँ काम,', 'मेरे सतगुरु तुझको लाखो सलाम ।'],
    blessings: 'With Blessings',
    parents: 'Mrs. Vanita Gupta & Mr. Subhash Chand Gupta',
    request: 'Desire the sweet fragrance of your loving presence to shower your blessings on the auspicious occasion of the wedding ceremony of their beloved daughter',
    brideOf: 'Granddaughter of Late Mrs. Resham Devi & Late Mr. Shiv Dayal Gupta',
    with: 'With',
    groomOf: ['Son of Smt. Neelam Singla', '(Wife of Late Sh. Suresh Singla)'],
  },

  /* page 2: the date on the parchment */
  date: { day: '20', suffix: 'th', month: 'November', year: '2026', time: '8:00 PM' },

  /* the wedding, for the countdown and Save the Date */
  wedding: { start: '2026-11-20T20:00:00+05:30', dateLine: '20 November 2026', weekday: 'Friday', time: '8:00 PM', ics: 'event.ics', gcalHours: 3 /* Google Calendar needs an end; the invitation gives none */ },

  /* page 3 → the three days (detail pages) */
  days: [
    {
      key: 'day1', plate: 4, date: '18 November 2026', weekday: 'Wednesday', title: 'A Day of Love, Colours & Celebrations',
      dressCode: 'Dress Code: Pastel Colour Theme',
      schedule: [
        ['11:00 AM', 'Guest Welcome Lunch'],
        ['1:00 PM', 'Radha Krishna Phoolon Ki Haldi'],
        ['2:00 PM onwards', 'Pool Party', 'Please bring your swimming costumes for the pool party!'],
        ['4:00 PM onwards', 'Mehendi'],
        ['7:00 PM onwards', 'DJ Night'],
        ['8:00 PM', 'Dinner'],
      ],
      venue: 'Vyom Luxury Gym and Wellness', address: ['Near True Value, Sector 16, Rohini, Delhi'],
      mapsUrl: 'https://maps.app.goo.gl/xJUJUJWmYGwAEcJQ6?g_st=ic', ics: 'event-18nov.ics', start: '2026-11-18T11:00:00+05:30',
    },
    {
      key: 'day2', plate: 5, date: '19 November 2026', weekday: 'Thursday', title: 'The Engagement Celebration', time: '7:00 PM',
      schedule: [['7:00 PM', 'Engagement Ceremony'], ['8:00 PM onwards', 'Dinner']],
      venue: 'Golden Apple Mansion', address: ['Hall No. 2, Darbaar Hall, Pitampura, Delhi'],
      mapsUrl: 'https://maps.app.goo.gl/V4mpJjW6xamdfdcP7?g_st=aw', ics: 'event-19nov.ics', start: '2026-11-19T19:00:00+05:30',
    },
    {
      key: 'day3', plate: 4, date: '20 November 2026', weekday: 'Friday', title: 'The Wedding Celebration',
      schedule: [['8:00 PM', 'Welcome of Baraat'], ['9:00 PM', 'Dinner'], ['', 'Vidaai – Taron Ki Chhaon Mein']],
      venue: 'The Sherioan By Kawatra Tent', address: ['Colosseum Hall, Pitampura, Delhi – 110034.', '(Near DCP Office, Outer District)'],
      mapsUrl: 'https://maps.app.goo.gl/8svFQVQ7mBP4o59D8?g_st=ic', ics: 'event.ics', start: '2026-11-20T20:00:00+05:30',
    },
  ],

  countdown: { title: ['The Countdown', 'to Forever'], lines: 'The wait is almost over. A beautiful new beginning awaits!', done: 'The day is here. A beautiful new beginning begins!', units: ['Days', 'Hours', 'Minutes', 'Seconds'], save: 'Save the Date', button: 'Add to Calendar' },

  /* page 6: the couple's own photographs */
  memories: {
    photos: [
      { src: 'assets/photo-1.webp', alt: 'Vaishali in a flowing red gown and Arpan in a beige suit, on white marble stairs' },
      { src: 'assets/photo-2.webp', alt: 'Vaishali and Arpan in a softly lit hallway' },
      { src: 'assets/photo-3.webp', alt: 'Vaishali and Arpan in navy, beside a floral arch at night' },
      { src: 'assets/photo-4.webp', alt: 'Arpan and Vaishali in black, before a wall of fairy lights' },
    ],
  },

  stars: { title: 'A Little Message from Our Little Stars', big: 'My Bua is getting married!', line: 'Please join us to celebrate this beautiful new beginning!', love: 'With love,', names: 'Mishika, Navya & Himanshi' },

  closing: { title: ['Your Presence Is', 'Our Greatest Gift'], lines: 'We look forward to celebrating these beautiful moments with you and your family.', hashtag: '#theARVAStory' },

  opening: {
    poster: 'assets/opening.webp',
    music: 'assets/music.mp3',
    musicFadeSeconds: 3,
    musicVolume: 0.8,
  },
};
