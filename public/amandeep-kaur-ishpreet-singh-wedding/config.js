/* ─────────────────────────────────────────────────────────────
   weddingConfig — everything a family would change lives here.
   The page (js/app.js) renders only from this object, so a new
   invitation is: copy the folder, edit this file, swap art.
   Dates are ISO strings in India time (+05:30).

   "Royal Ivory & Sapphire" — a Sikh wedding invitation, laid out
   as one continuous scroll in the order of the design mockup.
   ───────────────────────────────────────────────────────────── */

/* an honest Google Maps search for a named venue (no invented pins) */
const maps = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const weddingConfig = {
  groomName: 'Ishpreet Singh',
  brideName: 'Amandeep Kaur',
  shortGroom: 'Ishpreet',
  shortBride: 'Amandeep',
  /* BRIDE-SIDE copy of public/ishpreet-amandeep-wedding (client, 2026-10-29; that page is unchanged): the bride is
     named first everywhere and her parents' card comes first (js/util.js couple(), js/sections/welcome.js) */
  hostSide: 'bride',

  /* the Mool Mantar opening in Gurmukhi; set to null to hide */
  invocation: null, // removed at the family's request (client brief, 11 Oct 2026)

  /* the invitation block that follows the hero scene */
  invite: {
    motto: [],
    tagline: ['Two Souls', 'One Journey', 'Blessed by Guru Sahib'],
    /* the groom side's "You are cordially invited to join the celebrations as our families come together in the
       presence of Guru Sahib." in the family's Punjabi (client, 2026-10-29), exactly as sent */
    eyebrow: [],
    line: 'ਤੁਹਾਨੂੰ ਗੁਰੂ ਸਾਹਿਬ ਦੀ ਹਜ਼ੂਰੀ ਵਿੱਚ ਸਾਡੇ ਪਰਿਵਾਰਾਂ ਦੇ ਮਿਲਾਪ ਅਤੇ ਵਿਆਹ ਦੀਆਂ ਖੁਸ਼ੀਆਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣ ਲਈ ਸਤਿਕਾਰ ਸਹਿਤ ਸੱਦਾ ਦਿੰਦੇ ਹਾਂ।',
    lineLang: 'pa',
    placement: 'blessing', // written into the arch scene of the next section (client, 11 Oct 2026)
  },

  /* purpose-made side borders, once the designer supplies them (transparent PNG,
     tall and narrow, drawn to repeat): set to e.g. { left: 'assets/border-l.webp', right: 'assets/border-r.webp' } */
  sideBorders: null,

  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'With the blessings of Guru Sahib — the wedding of Amandeep Kaur & Ishpreet Singh · 13 December 2026, New Delhi',

  /* the Anand Karaj — the main ceremony everything counts down to */
  weddingDate: '2026-12-13T10:30:00+05:30',
  weddingEnd: '2026-12-13T12:30:00+05:30',
  venueCity: 'New Delhi',
  saveTheDate: { details: false },

  blessing: {
    title: ['With the Blessings of', 'Sri Guru Granth Sahib Ji'],
    lines: [],
    quote: null,
  },

  families: {
    heading: '',
    showWho: false,
    bride: { label: "Bride's Parents", parents: ['S. Baldev Singh', 'Sdn. Inderjeet Kaur'] },
    groom: { label: "Groom's Parents", parents: ['S. Ravinder Pal Singh Sandhu', 'Sdn. Tejinder Kaur'] },
  },

  story: null,

  /* in the order of the day. art: dhol | horse | gurudwara | lantern */
  events: [
    {
      id: 'sehrabandi', art: 'horse', menu: 'Sehrabandi',
      name: 'Sehrabandi & Ghurchari', subtitle: 'The groom sets out',
      date: '2026-12-13T09:00:00+05:30', time: '9:00 AM',
      venue: 'Hotel Picasso Prive', address: 'Naraina, New Delhi',
      maps: maps('Hotel Picasso Prive, Naraina, New Delhi'),
    },
    {
      id: 'anand-karaj', art: 'gurudwara', main: true, menu: 'Anand Karaj',
      name: 'Anand Karaj', subtitle: 'The Blissful Union',
      date: '2026-12-13T10:30:00+05:30', time: '10:30 AM',
      venue: 'Gurudwara Sri Guru Singh Sabha', address: 'Kirti Nagar, New Delhi – 110015',
      note: 'We humbly request your presence as we take the four laavan around Sri Guru Granth Sahib Ji.',
      etiquette: 'Kindly cover your head and remove footwear before entering the Darbar Sahib.',
      maps: maps('Gurudwara Sri Guru Singh Sabha, Kirti Nagar, New Delhi 110015'),
    },
    {
      id: 'lunch', art: 'lantern', menu: 'Lunch',
      name: 'Wedding Lunch', subtitle: 'Food · Family · Festivity',
      date: '2026-12-13T12:00:00+05:30', time: '12:00 Noon Onwards',
      venue: 'Banquet Majestic Crown', address: '24, Najafgarh Road Industrial Area, New Delhi – 110015',
      maps: maps('Banquet Majestic Crown, Najafgarh Road Industrial Area, New Delhi 110015'),
    },
  ],

  schedule: { sub: '', art: 'dhol' },
  dayChips: false,

  countdown: {
    title: 'Until We Celebrate',
    sub: 'Counting the days to the Anand Karaj',
    passed: 'The laavan have been taken. Thank you for your blessings.',
  },

  gallery: null,

  gettingHere: null,

  rsvp: null,

  closing: {
    title: ['With Love', 'and Blessings'],
    lines: ['We look forward to celebrating', 'this special chapter with you.'],
    signoff: '',
    farewell: '',
    credit: 'Designed by Invitivals',
  },

  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-video.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
    eyebrow: 'Wedding Invitation', // replaces "Specially for" (client, 11 Oct 2026)
    /* the family's Gurbani, written over the opened arch at the end of the film (exactly as they sent it) */
    gurbani: ['ੴ', 'ਲੱਖ ਖੁਸ਼ੀਆਂ ਪਾਤਸ਼ਾਹੀਆਂ', 'ਜੇ ਸਤਿਗੁਰੁ ਨਦਰਿ ਕਰੇ ॥'],
    textAt: 2,  // second of the film when the doors have opened onto the arch
    hold: 1,    // that final scene stays one second longer
  },
};
