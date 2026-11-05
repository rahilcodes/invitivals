/* ─────────────────────────────────────────────────────────────
   Vaishali & Arpan (vaishali-arpan-wedding-only): the bride-side invitation with the wedding day only;
   a copy of vaishali-arpan-wedding made by tools/vaishali-arpan-wedding-variants.mjs — edit the main folder and rerun it.
   Every word on the page comes from here (and index.html's meta tags).
   Dates are ISO in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
export const config = {
  couple: { bride: 'Vaishali', groom: 'Arpan' },

  /* page 1 */
  hero: {
    /* the client's final round (5 Nov) opens the slide with Ganesha and his mantra; the earlier Nirankar
       invocation stays here in case the family wants it back: set ganesha to '' and restore these two */
    ganesha: 'assets/p1-ganesha.webp',
    invocation: '', /* was 'Ek Tu Hi Nirankar' */
    hindi: ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥'], /* was ['तेरे आसरा ले के करता हूँ काम,', 'मेरे सतगुरु तुझको लाखो सलाम ।'] */
    blessings: 'With Blessings',
    parents: 'Mrs. Vanita Gupta & Mr. Subhash Chand Gupta',
    request: ['With joy and love, we invite you to bless', 'the wedding of our beloved daughter.'],
    brideOf: 'Granddaughter of Late Mrs. Resham Devi & Late Mr. Shiv Dayal Gupta',
    with: 'With',
    groomOf: ['Son of Smt. Neelam Singla', '(Wife of Late Sh. Suresh Singla)'],
  },

  /* page 2: the date on the parchment */
  date: { day: '20', suffix: 'th', month: 'November', year: '2026', time: '8:00 PM' },

  /* the wedding, for the countdown and Save the Date */
  wedding: { start: '2026-11-20T20:00:00+05:30', dateLine: '20 November 2026', weekday: 'Friday', time: '8:00 PM', ics: 'event.ics', gcalHours: 3 /* Google Calendar needs an end; the invitation gives none */ },

  /* page 3 → the wedding day only (this link's days; the main link has all three). Each day's Google Maps link is the client's own, used as supplied. */
  days: [
    {
      key: 'day3', date: '20 November 2026', weekday: 'Friday', title: 'The Wedding Celebration', time: '8:00 PM',
      schedule: [['8:00 PM', 'Welcome of Baraat'], ['9:00 PM', 'Dinner'], ['', 'Vidaai – Taron Ki Chhaon Mein']],
      venue: 'The Sherioan By Kawatra Tent', venueLines: ['The Sherioan By', 'Kawatra Tent'], address: ['Colosseum Hall, Pitampura, Delhi – 110034.', '(Near DCP Office, Outer District)'],
      mapsUrl: 'https://share.google/6FekKRjN2AlnVlOxE', ics: 'event.ics', start: '2026-11-20T20:00:00+05:30',
    },
  ],

  /* the countdown page */
  countdown: { title: ['The Countdown', 'to Forever'], lines: ['The wait is almost over.', 'A beautiful new beginning awaits!'], done: 'The day is here. A beautiful new beginning begins!', units: ['Days', 'Hours', 'Minutes', 'Seconds'] },

  /* the Save the Date page: the wedding day with Add to Calendar and the venue map */
  saveTheDate: { title: 'Save the Date', button: 'Save the Date', maps: 'View on Google Maps', labels: ['Date', 'Time'] },

  /* the memories page: the couple's own photographs. `pos` is object-position: where the couple stands in
     the picture, so the frame (narrower than a 3:4 photograph) is cut around both of them. */
  memories: {
    photos: [
      { src: 'assets/photo-1.webp', pos: '50% 50%', alt: 'Vaishali in a flowing red gown and Arpan in a beige suit, on white marble stairs' },
      { src: 'assets/photo-2.webp', pos: '52% 50%', alt: 'Vaishali and Arpan in a softly lit hallway' },
      { src: 'assets/photo-3.webp', pos: '49% 50%', alt: 'Vaishali and Arpan in navy, beside a floral arch at night' },
      { src: 'assets/photo-4.webp', pos: '47% 50%', alt: 'Arpan and Vaishali in black, before a wall of fairy lights' },
    ],
  },

  stars: { title: 'A Little Message from Our Little Stars', big: 'My Bua is getting married!', line: ['Please join us to celebrate', 'this beautiful new beginning!'], love: 'With love,', names: 'Mishika, Navya & Himanshi' },

  /* logo: the couple's own AV monogram (the client's file, its black background keyed out by the tool),
     in place of the demo's heart flourish under the hashtag; set logo to '' to show the heart again */
  closing: { title: ['Your Presence Is', 'Our Greatest Gift'], lines: 'We look forward to celebrating these beautiful moments with you and your family.', hashtag: '#theARVAStory', logo: 'assets/av-logo.png' },

  opening: {
    video: 'assets/opening.mp4',
    poster: 'assets/opening.webp',
    music: 'assets/music.mp3',
    /* the film's own soundtrack plays with the film; the invitation's music starts when the film is over */
    musicFadeSeconds: 3,
    musicVolume: 0.8,
    /* the demo film's wax seal reads CL: this face (VA) is laid over it, placed by these fractions of the
       film's 720×1280 frame (centre and radius), until the seal breaks at `sealUntil` seconds; a burst of
       light then covers the flying pieces, fading out by `burstEnd` */
    sealFace: 'assets/seal.png',
    seal: { cx: 0.526, cy: 0.499, r: 0.141 },
    sealUntil: 2.42,
    burstEnd: 3.3,
    /* a film that never plays or stalls gives way to the invitation after this long */
    filmMaxSeconds: 14,
  },
};
