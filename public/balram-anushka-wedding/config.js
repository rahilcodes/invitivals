/* ─────────────────────────────────────────────────────────────
   Balram Singh & Anushka Kairon — Sikh wedding invitation from the
   Passi Family, Dadke & Nanke (client, 2026-11-18). A separate copy of the
   design the client chose (public/amandeep-ishpreet-wedding, never edited
   for this), on the same engine as public/tanveer-prabhjit-wedding.

   Everything a family would change lives here; the page (js/app.js) renders
   only from this object. Dates are ISO strings in India time (+05:30).
   After editing:
     node tools/sikh-finish.mjs public/balram-anushka-wedding   (meta tags, cache stamps)
     node tools/balram-anushka.mjs                              (calendar files, link preview)
   then deploy the folder.

   Names, parents, events, times, venues and map links are the client's, as
   typed. The year 2027 was confirmed by the client on 2026-11-18. Only start
   times were supplied, so no calendar entry carries an end time.
   The couple on the cover is the design's own illustration (no photograph
   was supplied); the hero motto and tagline, the Gurbani in the arch and the
   closing lines are the design's own wording.
   ───────────────────────────────────────────────────────────── */

/* the family's own Google Maps links, exactly as supplied — never a search, never a guess.
   Checked 2026-11-18: they open "RANI MAHAL RESORT, Garhshankar to Banga Rd, Dagam, Garhshankar, Punjab 144527",
   "Fatehpur Kalan, Punjab 144527" and "Gurdwara Baba Chart Singh, Banga-Garhshankar Rd, Punjab 144508". */
const MAP = {
  raniMahal: 'https://maps.app.goo.gl/GG9wrR1E5kuCB6VPA?g_st=i',   // Rani Mahal Palace — Shagun, Jaggo, Wedding Lunch, Doli
  fatehpur: 'https://maps.app.goo.gl/JyZYdV9Fujdq64788?g_st=i',    // Fatehpur Kalan — Baraat
  gurdwara: 'https://maps.app.goo.gl/bfaseQHsVytEttHM9',           // Gurdwara Baba Chart Singh — Anand Karaj
};
/* the palace's road and town are read from what the family's own map link opens */
const RANI = { venue: 'Rani Mahal Palace', address: 'Garhshankar – Banga Road, Dagam, Garhshankar, Punjab', maps: MAP.raniMahal };

export const weddingConfig = {
  groomName: 'Balram Singh',
  brideName: 'Anushka Kairon',
  shortGroom: 'Balram',
  shortBride: 'Anushka',
  /* the names stand in the client's own order, the groom first (the invitation itself is from the bride's family:
     see invite.from) */
  hostSide: 'groom',

  /* the opening symbol in Gurmukhi; set to null to hide */
  invocation: { text: 'ੴ', meaning: 'Ik Onkar', font: 'Noto Serif Gurmukhi' },

  invite: {
    motto: ['Together in Faith', 'Forever in Love'],
    tagline: ['Two Souls', 'One Journey', 'Blessed by Guru Sahib'],
    eyebrow: ['You are', 'cordially invited'],
    line: 'to celebrate the wedding of Balram Singh and Anushka Kairon, in the presence of Guru Sahib.',
    /* who the invitation is from, exactly as the client gave it */
    from: { label: 'Invitation From', lines: ['Passi Family', 'Dadke & Nanke'] },
  },

  sideBorders: null,

  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'With the blessings of Guru Sahib — the wedding of Balram Singh & Anushka Kairon · 2 & 3 February 2027',

  /* the Anand Karaj — the main ceremony everything counts down to */
  weddingDate: '2027-02-03T10:30:00+05:30',
  weddingEnd: null,                       // not supplied
  venueCity: 'Punjab',

  blessing: {
    title: ['With the Blessings of', 'Sri Guru Granth Sahib Ji'],
    lines: [],                            // no welcome card: the earlier family's Punjabi message is not this family's
    /* the Gurbani written into the sky of the arch, as on the design the client chose */
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

  /* in the order of the two days. art: dhol | horse | gurudwara | lantern, or icon: faith | heart | family | lunch | hall */
  events: [
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
      venue: 'Fatehpur Kalan', address: 'Punjab 144527',
      maps: MAP.fatehpur,
    },
    {
      id: 'anand-karaj', art: 'gurudwara', main: true, menu: 'Anand Karaj',
      name: 'Anand Karaj',
      date: '2027-02-03T10:30:00+05:30', time: '10:30 AM',
      venue: 'Gurdwara Baba Chart Singh', address: 'Banga-Garshankar Road, 144508, India',
      maps: MAP.gurdwara,
      /* for this event only (client). The four pinks are sampled from the middle of the four swatches in the
         client's picture; its printed codes were cropped, so none is quoted on the page. */
      dressCode: { label: 'Dress Code', text: 'Shades of Pink', swatches: ['#fdd6e8', '#fdc5de', '#fdb6d8', '#fda4d0'] },
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
  /* attendance is confirmed on WhatsApp (client, 2026-11-20); the number itself is not printed */
  rsvp: {
    title: 'Kindly Confirm Your Attendance',
    name: 'Sandeep Passi',
    whatsapp: '917016976099',
    button: 'Confirm Attendance on WhatsApp',
    message: 'Hello, I would like to confirm my attendance for the wedding of Balram & Anushka.',
  },

  closing: {
    title: ['With Love', 'and Blessings'],
    lines: ['We look forward to celebrating', 'this special chapter with you.'],
    signoff: 'Passi Family · Dadke & Nanke',
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
