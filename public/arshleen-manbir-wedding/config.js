/* ─────────────────────────────────────────────────────────────
   Arshleen Kaur & Manbir Singh — Sikh wedding invitation from the BRIDE's
   family (client brief 2026-11-26). The bride-side twin of the groom page
   public/manbir-arshleen-wedding (never edited for this): the same design,
   sections, pictures and animations, with its sapphire turned to deep plum by
   tools/arshleen-manbir-wedding-theme.mjs.

   Everything a family would change lives here; the page (js/app.js) renders
   only from this object. Dates are ISO strings in India time (+05:30).
   After editing:
     node tools/sikh-finish.mjs public/arshleen-manbir-wedding   (meta tags, cache stamps)
     node tools/arshleen-manbir-wedding.mjs                      (calendar files, link preview, tags)
   then deploy the folder. (Colours: tools/arshleen-manbir-wedding-theme.mjs, run BEFORE the two above.)

   Names, parents, events, dates, times, venues and map links are the
   client's, as typed. Only start times were supplied, so no calendar entry
   carries an end time. The Wedding Celebration has no time: it is shown
   without one and its calendar entry is for the whole day.
   ───────────────────────────────────────────────────────────── */

/* the family's own Google Maps links, exactly as supplied — never a search, never a guess.
   The brief assigns the wedding-day link to BOTH the Anand Karaj and the Wedding Celebration. (On 2026-11-21 that
   link was found to open "Lilly Resort, Vallah, Amritsar"; it is used for the Anand Karaj as the brief says.) */
const MAP = {
  shagun: 'https://maps.app.goo.gl/NGEKpNvX8zY6oawU7?g_st=ic',      // Din Shagna Da — Riviera
  wedding: 'https://maps.app.goo.gl/JwHjUbnXJEcEe7XJ6?g_st=ic',     // Anand Karaj and Wedding Celebration
};

export const weddingConfig = {
  groomName: 'Manbir Singh',
  brideName: 'Arshleen Kaur',
  shortGroom: 'Manbir',
  shortBride: 'Arshleen',
  /* the invitation is from the bride's family: the bride and her family stand first */
  hostSide: 'bride',

  /* the opening symbol in Gurmukhi; set to null to hide */
  invocation: { text: 'ੴ', meaning: 'Ik Onkar', font: 'Noto Serif Gurmukhi' },

  invite: {
    motto: ['Together in Faith', 'Forever in Love'],
    tagline: ['Two Souls', 'One Journey', 'Blessed by Guru Sahib'],
    eyebrow: ['With the blessings of Waheguru Ji,', 'we joyfully invite you'],
    line: 'to grace the wedding of our daughter Arshleen Kaur with Manbir Singh, and to bless the couple in the presence of Guru Sahib.',
    /* who the invitation is from: the bride's parents, as the client gave their names */
    from: { label: 'Invitation From', lines: ['Sardarni Rajinder Kaur', '& Sardar Paramjit Singh Bhullar'] },
  },

  sideBorders: null,

  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'With the blessings of Guru Sahib — the wedding of Arshleen Kaur & Manbir Singh · Anand Karaj, Tuesday 19 January 2027, Amritsar',

  /* the Anand Karaj — the main ceremony everything counts down to */
  weddingDate: '2027-01-19T10:00:00+05:30',
  weddingEnd: null,                       // not supplied
  venueCity: 'Amritsar',

  blessing: {
    title: ['With the Blessings of', 'Sri Guru Granth Sahib Ji'],
    lines: [],
    /* the Gurbani written into the sky of the arch, as on the groom page */
    quote: {
      eyebrow: '',
      lines: ['ਕਰਣ ਕਾਰਣ ਪ੍ਰਭੁ ਏਕੁ ਹੈ ਦੂਸਰ ਨਾਹੀ ਕੋਇ ॥', 'ਨਾਨਕ ਤਿਸੁ ਬਲਿਹਾਰਣੈ ਜਲਿ ਥਲਿ ਮਹੀਅਲਿ ਸੋਇ ॥੧॥'],
      lang: 'pa',
      source: 'ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ',
      sourceLang: 'pa',
      ref: 'ਅੰਗ ੨੯੬ · ਰਾਗੁ ਗਉੜੀ · ਮਹਲਾ ੫',
    },
  },

  /* the bride's family first (hostSide), each family's names in the client's own order and wording */
  families: {
    heading: 'With the Blessings of Our Families',
    sub: '',
    groom: { label: 'The Groom', person: 'Manbir Singh', relation: 'Son of', parents: ['Sardarni Amandeep Kaur', 'Sardar Jyoti Saroop Singh Bamrah'] },
    bride: { label: 'The Bride', person: 'Arshleen Kaur', relation: 'Daughter of', parents: ['Sardarni Rajinder Kaur', 'Sardar Paramjit Singh Bhullar'] },
  },

  story: null,

  /* the programme in date order, as on the groom page: seven cards; `time`, `venue`, `address` and `maps` are shown
     only when given. `parts` is one card with two activities, each with its own time and calendar entry. */
  schedule: { sub: 'Six days of celebration, one blessed union' },
  dayChips: false,                        // the days are not consecutive, so no 'Day 1, Day 2…' chips
  dayBanners: { '2027-01-19': { eyebrow: 'The Wedding Day', title: 'Tuesday, 19th January 2027' } },
  events: [
    {
      id: 'akhand-path', icon: 'faith', menu: 'Akhand Path',
      name: 'Akhand Path and Bangle Ceremony',
      date: '2027-01-01T12:00:00+05:30', time: '12:00 PM & 3:00 PM',
      parts: [
        { id: 'akhand-path-12pm', name: 'Akhand Path', date: '2027-01-01T12:00:00+05:30', time: '12:00 PM' },
        { id: 'bangle-ceremony', name: 'Bangle Ceremony', date: '2027-01-01T15:00:00+05:30', time: '3:00 PM' },
      ],
      venue: 'At Residence',
    },
    {
      id: 'din-shagna-da', icon: 'heart', menu: 'Din Shagna Da',
      name: 'Din Shagna Da',
      date: '2027-01-15T11:00:00+05:30', time: '11:00 AM',
      venue: 'Riviera', address: 'Airport Road, Amritsar',
      maps: MAP.shagun,
    },
    {
      id: 'haldi', icon: 'family', menu: 'The Golden Glow',
      name: 'The Golden Glow (Haldi)',
      date: '2027-01-16T12:00:00+05:30', time: '12:00 PM',
      venue: 'Farmhouse',
    },
    {
      id: 'mehndi', art: 'dhol', menu: 'Jashn-e-Heena',
      name: 'Jashn-e-Heena (Mehndi)',
      date: '2027-01-17T11:00:00+05:30', time: '11:00 AM',
      venue: 'At Residence',
    },
    {
      id: 'jaggo', art: 'lantern', menu: 'Ashi’s Jaggo Night',
      name: 'Ashi’s Jaggo Night',
      date: '2027-01-18T19:00:00+05:30', time: '7:00 PM',
      venue: 'Bhullar Farms',
    },
    {
      id: 'anand-karaj', art: 'gurudwara', main: true, menu: 'Anand Karaj',
      name: 'Anand Karaj',
      date: '2027-01-19T10:00:00+05:30', time: '10:00 AM',
      venue: 'Gurudwara Chhevin Patshahi', venueLocal: 'ਗੁਰਦੁਆਰਾ ਛੇਵੀਂ ਪਾਤਸ਼ਾਹੀ',
      maps: MAP.wedding,
    },
    {
      id: 'wedding-celebration', icon: 'lunch', menu: 'Wedding Celebration',
      name: 'Wedding Celebration',
      date: '2027-01-19T00:00:00+05:30', time: '', allDay: true,
      venue: 'Lily Resort', address: 'Vallah, Amritsar',
      maps: MAP.wedding,
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
    lines: ['We look forward to celebrating', 'this blessed union with you.'],
    signoff: 'With Love, The Bride’s Family',
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
