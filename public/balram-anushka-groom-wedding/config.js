/* ─────────────────────────────────────────────────────────────
   Balram Singh & Anushka Kairon — the GROOM-SIDE invitation (client brief 2026-11-22), from Sdn. Baljinder Kaur
   and the Nagra Family. A separate copy of the bride-side page public/balram-anushka-wedding (never edited for this),
   which is itself a copy of the design the client chose (public/amandeep-ishpreet-wedding).

   Everything a family would change lives here; the page (js/app.js) renders only from this object.
   Dates are ISO strings in India time (+05:30). After editing:
     node tools/sikh-finish.mjs public/balram-anushka-groom-wedding   (meta tags, cache stamps)
     node tools/balram-anushka-groom.mjs                              (calendar files, link preview, tags)
   then deploy the folder.

   Names, honorifics, parents, events, times, venues and map links are the client's, as typed. Only start times were
   supplied, so no calendar entry carries an end time. No RSVP and no dress code were given for this side, so none is
   shown. The couple on the cover is the design's own illustration; the Gurbani in the arch and the closing lines are
   the design's own wording, as on the bride-side page.
   ───────────────────────────────────────────────────────────── */

/* the family's own Google Maps links, exactly as supplied */
const MAP = {
  fatehpur: 'https://maps.app.goo.gl/JyZYdV9Fujdq64788?g_st=i',    // Village Fatehpur Kalan — the Path and the Baraat
  gurdwara: 'https://maps.app.goo.gl/bfaseQHsVytEttHM9?g_st=i',    // Gurdwara Baba Chart Singh — Anand Karaj
  raniMahal: 'https://maps.app.goo.gl/GG9wrR1E5kuCB6VPA?g_st=i',   // Rani Mahal Palace, Garshankar — Shagun, Jaggo, Lunch, Doli
};
const RANI = { venue: 'Rani Mahal Palace', address: 'Garshankar', maps: MAP.raniMahal };
const VILLAGE = { venue: 'Village Fatehpur Kalan', address: '', maps: MAP.fatehpur };

export const weddingConfig = {
  groomName: 'Balram Singh',
  brideName: 'Anushka Kairon',
  shortGroom: 'Balram',
  shortBride: 'Anushka',
  /* the groom's side: the groom, his family and his parents always stand first */
  hostSide: 'groom',

  /* the opening symbol in Gurmukhi; set to null to hide */
  invocation: { text: 'ੴ', meaning: 'Ik Onkar', font: 'Noto Serif Gurmukhi' },

  invite: {
    /* the client's own opening, shown above the couple's names on the first screen */
    host: {
      name: 'Sdn. Baljinder Kaur',
      relation: '(W/o Late S. Avtar Singh Nagra)',
      line: 'requests the pleasure of your company on the auspicious occasion of the marriage of her loving grandson',
    },
    motto: [],
    tagline: [],
    eyebrow: ['You are', 'cordially invited'],
    line: 'to celebrate the wedding of Balram Singh and Anushka Kairon, in the presence of Guru Sahib.',
    from: { label: 'Invitation From', lines: ['The Nagra Family', 'Dadke & Nanke'] },
  },

  sideBorders: null,

  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'With the blessings of Guru Sahib — the wedding of Balram Singh & Anushka Kairon · Anand Karaj, Wednesday 3 February 2027',

  /* the Anand Karaj — the main ceremony everything counts down to */
  weddingDate: '2027-02-03T10:30:00+05:30',
  weddingEnd: null,                       // not supplied
  venueCity: 'Punjab',

  blessing: {
    title: ['With the Blessings of', 'Sri Guru Granth Sahib Ji'],
    lines: [],
    quote: {
      eyebrow: '',
      lines: ['ਕਰਣ ਕਾਰਣ ਪ੍ਰਭੁ ਏਕੁ ਹੈ ਦੂਸਰ ਨਾਹੀ ਕੋਇ ॥', 'ਨਾਨਕ ਤਿਸੁ ਬਲਿਹਾਰਣੈ ਜਲਿ ਥਲਿ ਮਹੀਅਲਿ ਸੋਇ ॥੧॥'],
      lang: 'pa',
      source: 'ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ',
      sourceLang: 'pa',
      ref: 'ਅੰਗ ੨੯੬ · ਰਾਗੁ ਗਉੜੀ · ਮਹਲਾ ੫',
    },
  },

  families: {
    heading: 'With the Blessings of Our Families',
    sub: '',
    groom: { label: 'The Groom', person: 'Balram Singh', relation: 'Son of', parents: ['Sr. Jaspal Singh', 'Sdn. Sarbjeet Kaur'] },
    bride: { label: 'The Bride', person: 'Anushka Kairon', relation: 'Daughter of', parents: ['Late Pramod Passi', 'Mrs. Sandeep Pramod Passi'] },
  },

  story: null,

  /* in date order. art: dhol | horse | gurudwara | lantern, or icon: faith | heart | family | lunch | hall */
  schedule: { sub: 'Four days of celebration, one blessed union' },
  dayChips: false,                        // 30 Jan and 1 Feb are not consecutive days, so no 'Day 1, Day 2…' chips
  events: [
    {
      id: 'shubh-arambh', icon: 'faith', menu: 'Shubh Arambh',
      name: 'Shubh Arambh', subtitle: 'Shri Akhand Path Sahib',
      date: '2027-01-30T10:00:00+05:30', time: '10:00 AM',
      ...VILLAGE,
    },
    {
      id: 'sampoornta-bhog', icon: 'faith', menu: 'Sampoornta & Bhog',
      name: 'Sampoornta & Bhog', subtitle: 'Shri Akhand Path Sahib',
      date: '2027-02-01T10:30:00+05:30', time: '10:30 AM',
      ...VILLAGE,
    },
    {
      id: 'shagun', icon: 'heart', menu: 'Shagun',
      name: 'Shagun',
      date: '2027-02-02T10:00:00+05:30', time: '10:00 AM',
      ...RANI,
    },
    {
      id: 'jaggo', art: 'dhol', menu: 'Jaggo',
      name: 'Jaggo',
      date: '2027-02-02T17:00:00+05:30', time: '5:00 PM',
      ...RANI,
    },
    {
      id: 'baraat', art: 'horse', menu: 'Baraat',
      name: 'Baraat',
      date: '2027-02-03T09:30:00+05:30', time: '9:30 AM',
      venue: 'Fatehpur Kalan', address: '', maps: MAP.fatehpur,
    },
    {
      id: 'anand-karaj', art: 'gurudwara', main: true, menu: 'Anand Karaj',
      name: 'Anand Karaj',
      date: '2027-02-03T10:30:00+05:30', time: '10:30 AM',
      venue: 'Gurdwara Baba Chart Singh', address: 'Banga-Garshankar Road, 144508, India',
      maps: MAP.gurdwara,
    },
    {
      id: 'lunch', icon: 'lunch', menu: 'Wedding Lunch',
      name: 'Wedding Lunch',
      date: '2027-02-03T13:00:00+05:30', time: '1:00 PM',
      ...RANI,
    },
    {
      id: 'doli', icon: 'family', menu: 'Doli',
      name: 'Doli',
      date: '2027-02-03T16:00:00+05:30', time: '4:00 PM',
      ...RANI,
    },
  ],

  countdown: {
    title: 'Until We Celebrate',
    sub: 'Counting the days to the Anand Karaj',
    passed: 'The celebrations have begun. Thank you for your blessings.',
  },

  gallery: null,
  gettingHere: null,
  rsvp: null,

  closing: {
    title: ['With Love', 'and Blessings'],
    lines: ['We look forward to celebrating', 'this special chapter with you.'],
    signoff: 'The Nagra Family · Dadke & Nanke',
    farewell: 'Until we meet in the presence of Guru Sahib',
    credit: 'Designed by Invitivals',
  },

  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-video.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
