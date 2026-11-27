/* ─────────────────────────────────────────────────────────────
   Navdeep Singh Kahlon & Simerpreet Brar — Sikh wedding invitation from
   the groom's family (client brief 2026-11-25). A separate page on the design
   the client chose (public/amandeep-ishpreet-wedding, never edited for this),
   copied from the engine of public/manbir-arshleen-wedding (also never edited
   for this).

   Everything a family would change lives here; the page (js/app.js) renders
   only from this object. Dates are ISO strings in India time (+05:30).
   After editing:
     node tools/sikh-finish.mjs public/navdeep-simerpreet-wedding   (meta tags, cache stamps)
     node tools/navdeep-simerpreet.mjs                              (calendar files, link preview, tags)
   then deploy the folder.

   Names, parents, events, dates, times, venues, addresses and map links are
   the client's, exactly as supplied. Only start times were supplied, so no
   calendar entry carries an end time. No couple photograph was supplied: the
   cover shows the design's own illustrated couple.
   ───────────────────────────────────────────────────────────── */

/* the family's own Google Maps links, exactly as supplied — one per event, never a search, never a guess */
const MAP = {
  jago: 'https://maps.app.goo.gl/ibdaQgNajddaZxqK6?g_st=iwb',                 // Dhani Bikaneri, Fatehabad
  anand: 'https://maps.app.goo.gl/BHyM9MKuM3f4jho9A?g_st=iwb',                // Gurudwara Jhad Sahib, Khanpur
  wedding: 'https://maps.google.com?ftid=0x3911658b176a40d7:0x9266586d0890376a&entry=gps&shh=CAE&lucs=,94231188,100821555,47071704,94218641,100849091,100838877,121816461,100798797,100848091&g_st=iwb',   // Sheesh Mahal Resorts
};

export const weddingConfig = {
  groomName: 'Navdeep Singh Kahlon',
  brideName: 'Simerpreet Brar',
  shortGroom: 'Navdeep',
  shortBride: 'Simerpreet',
  /* the invitation is from the groom's family: the groom and his family stand first */
  hostSide: 'groom',

  /* the opening symbol in Gurmukhi; set to null to hide */
  invocation: { text: 'ੴ', meaning: 'Ik Onkar', font: 'Noto Serif Gurmukhi' },

  invite: {
    motto: ['Together in Faith', 'Forever in Love'],
    tagline: ['Two Souls', 'One Journey', 'Blessed by Guru Sahib'],
    /* the client's own wording (2026-11-28), exactly: the opening line, then two paragraphs */
    eyebrow: ['With the blessings of Waheguru Ji,'],
    line: [
      'We joyfully invite you to grace the wedding ceremony of our beloved son Navdeep Singh Kahlon with Simerpreet Brar.',
      'We warmly invite you to join us and shower the couple with your love and blessings in the divine presence of Guru Sahib.',
    ],
    /* who the invitation is from: the groom's parents, as the client gave their names */
    from: { label: 'Invitation From', lines: ['Sardar Amarjeet Singh Kahlon', '& Sardarni Harpreet Kaur'] },
  },

  sideBorders: null,

  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'With the blessings of Guru Sahib — the wedding of Navdeep Singh Kahlon & Simerpreet Brar · Anand Karaj, Saturday 27 February 2027, Fatehabad',

  /* the Anand Karaj — the main ceremony everything counts down to */
  weddingDate: '2027-02-27T10:00:00+05:30',
  weddingEnd: null,                       // not supplied
  venueCity: 'Fatehabad',

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

  /* the groom's family first; each family's names in the client's own order and wording */
  families: {
    heading: 'With the Blessings of Our Families',
    sub: '',
    groom: { label: 'Groom’s Family', person: 'Navdeep Singh Kahlon', relation: 'Son of', parents: ['Sardar Amarjeet Singh Kahlon', 'Sardarni Harpreet Kaur'] },
    bride: { label: 'Bride’s Family', person: 'Simerpreet Brar', relation: 'Daughter of', parents: ['Sardar Lakhbir Singh Brar', 'Sardarni Rajwinder Kaur'] },
  },

  story: null,

  /* the programme in date order. Each event has its own map link and its own calendar entry.
     `cal` is the calendar title's place line, exactly as the client wrote it for the calendar. */
  schedule: { sub: 'Two days of celebration, one blessed union' },
  dayChips: false,
  dayBanners: { '2027-02-27': { eyebrow: 'The Wedding Day', title: 'Saturday, 27th February 2027' } },
  events: [
    {
      id: 'jago-night', art: 'dhol', menu: 'Jago Night',
      name: 'Jago Night',
      subtitle: 'Lights, dhol and a night of Punjabi celebration',
      date: '2027-02-26T18:00:00+05:30', time: '6:00 PM onwards',
      venue: 'Dhani Bikaneri, Fatehabad', address: 'GF8M+RFX, Fatehabad, Haryana 125050, India',
      cal: 'Dhani Bikaneri, Fatehabad',
      maps: MAP.jago,
    },
    {
      id: 'anand-karaj', art: 'gurudwara', main: true, menu: 'Anand Karaj',
      name: 'Anand Karaj',
      subtitle: 'The sacred union in the presence of Sri Guru Granth Sahib Ji',
      date: '2027-02-27T10:00:00+05:30', time: '10:00 AM',
      venue: 'Gurudwara Jhad Sahib', address: 'GFW8+7CP, Khanpur, Haryana 125050, India',
      cal: 'Gurudwara Jhad Sahib, Khanpur, Haryana',
      maps: MAP.anand,
    },
    {
      id: 'wedding', art: 'lantern', menu: 'Wedding',
      name: 'Wedding',
      subtitle: 'Celebrations, blessings and togetherness',
      date: '2027-02-27T11:00:00+05:30', time: '11:00 AM',
      venue: 'Sheesh Mahal Resorts', address: 'Dhani Masitaw Wali, Fatehabad, Haryana 125050, India',
      cal: 'Sheesh Mahal Resorts, Fatehabad',
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
