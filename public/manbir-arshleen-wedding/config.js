/* ─────────────────────────────────────────────────────────────
   Manbir Singh & Arshleen Kaur — Sikh wedding invitation from the groom's
   family (client brief 2026-11-21). A separate copy of the design the client
   chose (public/amandeep-ishpreet-wedding, never edited for this), on the
   same engine as public/balram-anushka-wedding (also never edited for this).

   Everything a family would change lives here; the page (js/app.js) renders
   only from this object. Dates are ISO strings in India time (+05:30).
   After editing:
     node tools/sikh-finish.mjs public/manbir-arshleen-wedding   (meta tags, cache stamps)
     node tools/manbir-arshleen.mjs                              (calendar files, link preview, tags)
   then deploy the folder.

   Names, parents, events, times, venues and map links are the client's, as
   typed. The year 2027 was confirmed by the user on 2026-11-21 (the brief
   gave none). Only start times were supplied, so no calendar entry carries
   an end time. The Haldi has no venue (client). The wedding party at Lily
   Resort has no time, so it is shown without one and its calendar entry is
   for the whole day. No couple photograph has been supplied yet: the cover
   shows the design's own illustrated couple.
   ───────────────────────────────────────────────────────────── */

/* the family's own Google Maps links, exactly as supplied — never a search, never a guess.
   Checked 2026-11-21: they open "Riviera Retreat, near Airport, Heir, Punjab 143101",
   "Parin Azure, Majitha-Verka By Pass, near Fortis Escort, Verka, Amritsar 143501" and
   "Lilly Resort, Vallah, Amritsar 143501". That third link was sent for the Gurudwara, but it opens Lily Resort;
   the user chose (2026-11-21) to put it on Lily Resort and to leave the Gurudwara without a map until a link arrives. */
const MAP = {
  riviera: 'https://maps.app.goo.gl/NGEKpNvX8zY6oawU7?g_st=ic',     // Shagun
  azure: 'https://maps.app.goo.gl/o8CETveDosF7ZmAF9?g_st=ic',       // Cocktail Party
  lily: 'https://maps.app.goo.gl/JwHjUbnXJEcEe7XJ6?g_st=ic',        // Wedding Party (see above)
};

export const weddingConfig = {
  groomName: 'Manbir Singh',
  brideName: 'Arshleen Kaur',
  shortGroom: 'Manbir',
  shortBride: 'Arshleen',
  /* the invitation is from the groom's family: the groom and his family stand first */
  hostSide: 'groom',

  /* the opening symbol in Gurmukhi; set to null to hide */
  invocation: { text: 'ੴ', meaning: 'Ik Onkar', font: 'Noto Serif Gurmukhi' },

  invite: {
    motto: ['Together in Faith', 'Forever in Love'],
    tagline: ['Two Souls', 'One Journey', 'Blessed by Guru Sahib'],
    eyebrow: ['With the blessings of Waheguru Ji,', 'we joyfully invite you'],
    line: 'to grace the wedding of our son Manbir Singh with Arshleen Kaur, and to bless the couple in the presence of Guru Sahib.',
    /* who the invitation is from: the groom's parents, as the client gave their names */
    from: { label: 'Invitation From', lines: ['Sardarni Amandeep Kaur', '& Sardar Jyoti Saroop Singh Bamrah'] },
  },

  sideBorders: null,

  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'With the blessings of Guru Sahib — the wedding of Manbir Singh & Arshleen Kaur · Anand Karaj, Tuesday 19 January 2027, Amritsar',

  /* the Anand Karaj — the main ceremony everything counts down to */
  weddingDate: '2027-01-19T10:00:00+05:30',
  weddingEnd: null,                       // not supplied
  venueCity: 'Amritsar',

  blessing: {
    title: ['With the Blessings of', 'Sri Guru Granth Sahib Ji'],
    lines: [],
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
    groom: { label: 'The Groom', person: 'Manbir Singh', relation: 'Son of', parents: ['Sardarni Amandeep Kaur', 'Sardar Jyoti Saroop Singh Bamrah'] },
    bride: { label: 'The Bride', person: 'Arshleen Kaur', relation: 'Daughter of', parents: ['Sardarni Rajinder Kaur', 'Sardar Paramjit Singh Bhullar'] },
  },

  story: null,

  /* the programme in date order. `time`, `venue`, `address` and `maps` are shown only when given.
     `day` marks the first card of a day that gets its own banner (the wedding day). */
  schedule: { sub: 'Five days of celebration, one blessed union' },
  dayChips: false,                        // the days are not consecutive, so no 'Day 1, Day 2…' chips
  dayBanners: { '2027-01-19': { eyebrow: 'The Wedding Day', title: 'Tuesday, 19th January 2027' } },
  events: [
    {
      id: 'path-da-bhog', icon: 'faith', menu: 'Path Da Bhog',
      name: 'Path Da Bhog',
      date: '2027-01-04T13:00:00+05:30', time: '1:00 PM',
      venue: 'At Home',
    },
    {
      id: 'shagun', icon: 'heart', menu: 'Shagun',
      name: 'Shagun',
      date: '2027-01-15T11:00:00+05:30', time: '11:00 AM',
      venue: 'Riviera', address: 'Airport Road, Amritsar',
      maps: MAP.riviera,
    },
    {
      id: 'haldi', icon: 'family', menu: 'Haldi',
      name: 'Haldi',
      date: '2027-01-16T12:00:00+05:30', time: '12:00 PM',
      /* no venue, by the client's instruction */
    },
    {
      id: 'cocktail', art: 'dhol', menu: 'Cocktail Party',
      name: 'Cocktail Party',
      date: '2027-01-17T19:00:00+05:30', time: '7:00 PM',
      venue: 'Azure Parin', address: 'Verka Bypass, Amritsar',
      maps: MAP.azure,
    },
    {
      id: 'sehra-bandi', art: 'horse', menu: 'Sehra Bandi',
      name: 'Sehra Bandi',
      date: '2027-01-19T08:00:00+05:30', time: '8:00 AM',
    },
    {
      id: 'anand-karaj', art: 'gurudwara', main: true, menu: 'Anand Karaj',
      name: 'Anand Karaj',
      date: '2027-01-19T10:00:00+05:30', time: '10:00 AM',
      venue: 'Gurudwara Chhevin Patshahi', venueLocal: 'ਗੁਰਦੁਆਰਾ ਛੇਵੀਂ ਪਾਤਸ਼ਾਹੀ',
      /* no map: the link sent for it opens Lily Resort (see MAP above) */
    },
    {
      id: 'wedding-party', icon: 'lunch', menu: 'Wedding Celebration',
      name: 'Wedding Celebration',
      date: '2027-01-19T00:00:00+05:30', time: '', allDay: true,
      venue: 'Lily Resort', address: 'Vallah, Amritsar',
      maps: MAP.lily,
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
    signoff: 'With Love, The Groom’s Family',
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
