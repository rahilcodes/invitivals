/* ─────────────────────────────────────────────────────────────
   Prabhdeep Kaur & Manpreet Singh Sabharwal — the Sikh wedding, Sunday 24 January 2027, Kolkata (client brief
   2026-11-27). A separate page on the design the client chose (public/amandeep-ishpreet-wedding, never edited
   for this), on the engine of public/kiranjit-sharnjit-wedding with the calendar sheet of
   public/navdeep-simerpreet-wedding (neither edited for this). Its Sangeet has its own page:
   public/prabhdeep-manpreet-sangeet.

   After editing:
     node tools/sikh-finish.mjs public/prabhdeep-manpreet-wedding   (meta tags, cache stamps)
     node tools/prabhdeep-manpreet.mjs                              (calendar files, link previews, tags — both pages)

   Every name, word, time, venue, address, phone number and map link is the client's, exactly as supplied. Only
   start times were supplied: no calendar entry carries an end time.
   ───────────────────────────────────────────────────────────── */

/* the family's own Google Maps links, exactly as supplied — one per venue, never swapped, never a search */
const MAP = {
  kutia: 'https://maps.app.goo.gl/Vtop9y7PtRvWTN6X6?g_st=ic',     // Gurudwara Sant Kutia — Anand Karaj
  bradree: 'https://maps.app.goo.gl/BorqKVyKNi8RF8nV7?g_st=ic',   // Punjab Bradree — the other celebrations
};
const KUTIA = { venue: 'Gurudwara Sant Kutia', address: '10A, Harish Mukherjee Road, Bhowanipore, Kolkata, West Bengal – 700025.' };
const BRADREE = { venue: 'Punjab Bradree', lines: ['7 Mayfair Road, Park Circus,', 'Ballygunge, Kolkata,', 'West Bengal – 700019.'] };
const BRADREE_CAL = 'Punjab Bradree, 7 Mayfair Road, Park Circus, Ballygunge, Kolkata, West Bengal – 700019';
const at = (time, hm) => ({ date: `2027-01-24T${hm}:00+05:30`, time });
const bradree = (id, name, time, hm, icon) => ({ id, name, menu: name, ...at(time, hm), venue: BRADREE.venue, address: BRADREE.lines.join(' '), cal: BRADREE_CAL, maps: MAP.bradree, group: 'bradree', icon });

export const weddingConfig = {
  groomName: 'Manpreet Singh Sabharwal',
  brideName: 'Prabhdeep Kaur',
  shortGroom: 'Manpreet',
  shortBride: 'Prabhdeep',
  /* the invitation is from the bride's family: her name stands first everywhere */
  hostSide: 'bride',
  pageTitle: 'Prabhdeep Kaur & Manpreet Singh Sabharwal · Wedding Invitation',

  /* the page's order: cover · the Gurbani Shabad · the invitation and families · the celebrations · countdown · closing */
  chapters: ['hero', 'blessing', 'invite', 'events', 'countdown'],

  invocation: null,                       // the cover carries only the names and the date (brief)

  invite: {
    heroEyebrow: 'The Wedding of',
    motto: [],
    tagline: [],
    /* page 3, exactly as supplied */
    eyebrow: ['With the grace of Waheguru,'],
    line: 'Sardar Manjit Singh & Sardarni Ekta Kaur would be privileged and honoured to have your blessings & gracious presence on the auspicious occasion of the wedding ceremony of their beloved daughter,',
    couple: [
      { name: 'Prabhdeep Kaur', line: 'Granddaughter of Sardar Gurdiyal Singh & Sardarni Surinder Kaur' },
      { name: 'Manpreet Singh Sabharwal', line: 'Son of Sardar Sarbjeet Singh Sabharwal & Sardarni Shaili Sabharwal' },
    ],
    coupleJoin: 'with',
    from: null,
  },

  sideBorders: null,
  guestFallback: 'You & Your Family',
  shareText: 'With the grace of Waheguru — the wedding of Prabhdeep Kaur & Manpreet Singh Sabharwal · Sunday 24 January 2027, Kolkata',

  /* the Anand Karaj, 10:30 AM: the cover's date, the countdown and the Save the Date card */
  weddingDate: '2027-01-24T10:30:00+05:30',
  weddingEnd: null,
  venueCity: 'Kolkata',

  /* page 2: the Gurbani Shabad exactly as supplied — no heading, translation or reference added */
  blessing: {
    title: [],
    lines: [],
    quote: {
      eyebrow: '',
      lines: ['ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥', 'ਆਪੇ ਦਇਆ ਕਰੇ ਪ੍ਰਭੁ ਦਾਤਾ ਸਤਿਗੁਰੁ ਪੁਰਖੁ ਮਿਲਾਏ ॥', 'ਜਨਮ ਜਨਮ ਕੇ ਵਿਛੁੜੇ ਜਨ ਮੇਲੇ ਨਾਨਕ ਸਹਜਿ ਸੁਭਾਏ ॥੩॥'],
      lang: 'pa',
      source: '',
      sourceLang: 'pa',
      ref: '',
    },
  },

  families: {
    heading: '', sub: '',
    bride: { label: 'The Bride', person: 'Prabhdeep Kaur', relation: 'Granddaughter of', parents: ['Sardar Gurdiyal Singh', 'Sardarni Surinder Kaur'] },
    groom: { label: 'The Groom', person: 'Manpreet Singh Sabharwal', relation: 'Son of', parents: ['Sardar Sarbjeet Singh Sabharwal', 'Sardarni Shaili Sabharwal'] },
  },

  story: null,

  /* page 4, in the brief's order: the Anand Karaj, then the other celebrations at Punjab Bradree in one card */
  eventsHeading: { title: 'Wedding Celebrations', sub: 'Sunday, 24th January 2027' },
  schedule: null,
  dayChips: false,
  venueGroups: {
    bradree: { compact: true, icon: 'lunch', title: 'Other Wedding Celebrations', sub: '', venue: BRADREE.venue, lines: BRADREE.lines, maps: MAP.bradree },
  },
  events: [
    {
      id: 'anand-karaj', art: 'gurudwara', main: true, menu: 'Anand Karaj',
      name: 'Anand Karaj',
      ...at('10:30 AM', '10:30'),
      ...KUTIA, cal: 'Gurudwara Sant Kutia, 10A, Harish Mukherjee Road, Bhowanipore, Kolkata, West Bengal – 700025',
      maps: MAP.kutia,
    },
    bradree('reception-of-baraat', 'Reception of Baraat', '9:00 AM', '09:00', 'family'),
    bradree('milni', 'Milni', '9:15 AM', '09:15', 'heart'),
    bradree('breakfast', 'Breakfast', '9:30 AM', '09:30', 'lunch'),
    bradree('lunch', 'Lunch', '1:30 PM', '13:30', 'lunch'),
    bradree('doli', 'Doli', '4:00 PM', '16:00', 'heart'),
  ],

  countdown: {
    title: 'Until We Celebrate',
    sub: 'Counting down to the Anand Karaj',
    passed: 'The celebrations have begun. Thank you for your blessings.',
    today: 'Today is the day — Anand Karaj. Blessings to all who gather.',
  },

  gallery: null,
  gettingHere: null,
  rsvp: null,

  /* the closing, exactly as supplied */
  closing: {
    title: [],
    lines: ['We look forward to celebrating with you.', 'Your presence & blessings mean the world to us.'],
    signoff: '— Bhoi & Sandhu Family',
    date: '24.01.2027',
    /* the family's M & P logo goes here once it arrives: { src, alt, w, h }. Never redrawn, so until then: none */
    logo: null,
    monogram: false,
    farewell: null,
    credit: 'Designed by Invitivals',
  },
  contacts: {
    label: 'For any queries, please contact',
    people: [{ name: 'Manjit Singh', label: '9903502359', tel: '+919903502359' }, { name: 'Ekta Kaur', label: '9903608566', tel: '+919903608566' }],
  },

  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-video.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
