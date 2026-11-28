/* ─────────────────────────────────────────────────────────────
   Harwinder Singh & Simran — the wedding, Sunday 3 January 2027 (client brief 2026-11-28), the groom's family
   inviting. A separate page on the design the client chose (public/amandeep-ishpreet-wedding, never edited for
   this), on a copy of the engine of public/prabhdeep-manpreet-wedding (not edited for this).

   After editing:
     node tools/sikh-finish.mjs public/harwinder-simran-wedding   (meta tags, cache stamps)
     node tools/harwinder-simran.mjs                              (calendar files, link preview, tags)

   Every name, word, time, venue, address, phone number and map link is the client's, exactly as supplied. Only
   start times were supplied: no calendar entry carries an end time.
   ───────────────────────────────────────────────────────────── */

/* the family's own Google Maps links, exactly as supplied — never swapped, never a search */
const MAP = {
  baraat: 'https://maps.app.goo.gl/ZFy4kuZ7wVWQvcF18?g_st=iw',   // Departure of Baraat only
  home: 'https://maps.app.goo.gl/uEmrpX9QTTzV4aiA9?g_st=iw',     // every other event
};
const HOME = { venue: 'At Our Residence', address: 'Vill. Baghthala (Kurukshetra)', cal: 'At Our Residence, Vill. Baghthala (Kurukshetra)' };

export const weddingConfig = {
  groomName: 'Harwinder Singh',
  brideName: 'Simran',
  shortGroom: 'Harwinder',
  shortBride: 'Simran',
  /* the invitation is from the groom's family: his name stands first everywhere */
  hostSide: 'groom',
  pageTitle: 'Harwinder Singh & Simran · Wedding Invitation',

  /* the page's order: cover · the invitation · the programme and its five cards · countdown · R.S.V.P. · closing */
  chapters: ['hero', 'invite', 'schedule+events', 'countdown', 'rsvp'],

  invocation: null,

  invite: {
    heroEyebrow: 'The Wedding of',
    motto: [],
    tagline: [],
    eyebrow: [],
    /* the client's wording, exactly */
    line: 'Sardarni Amarjit Kaur & Sardar Manjeet Singh cordially invite you to grace the auspicious occasion of the wedding ceremony of their beloved son Harwinder Singh with Simran.',
    couple: [
      { name: 'Harwinder Singh', line: 'S/o Sardarni Amarjit Kaur & Sardar Manjeet Singh' },
      { name: 'Simran', line: ['D/o Sardarni Jatinder Kaur & Sardar Sukhwinder Singh', 'Tibba Plot, Vill. Arnoli, Kaithal.'] },
    ],
    coupleJoin: 'with',
    from: { label: 'Invitation From', lines: ['S. Manjeet Singh', 'Vill. Baghthala (Kurukshetra)'], phones: [{ label: '90531-47737', tel: '+919053147737' }, { label: '94166-57723', tel: '+919416657723' }] },
  },
  /* the cover's date in the Save the Date card, without naming one ceremony */
  saveTheDate: { details: false, calendar: false },

  sideBorders: null,
  guestFallback: 'You & Your Family',
  shareText: 'The wedding of Harwinder Singh & Simran · Sunday, 3rd January 2027',

  /* the wedding date as supplied (Sunday 3 January 2027); the time is the Bhog's, the first event that day */
  weddingDate: '2027-01-03T10:00:00+05:30',
  weddingEnd: null,
  venueCity: 'Kurukshetra',

  blessing: { title: [], lines: [], quote: null },   // no Gurbani was supplied: the blessing scene is left out

  families: null,
  story: null,

  eventsHeading: null,
  schedule: { sub: 'Three days of joy, one blessed union' },
  dayChips: false,
  venueGroups: null,
  events: [
    {
      id: 'arambh-shri-akhand-path-sahib', name: 'Arambh Shri Akhand Path Sahib', menu: 'Arambh Shri Akhand Path Sahib',
      date: '2027-01-01T10:00:00+05:30', time: '10:00 AM', icon: 'faith',
      maps: MAP.home,                     // no venue was named for the Path: only the supplied map link
    },
    {
      id: 'bhog-shri-akhand-path-sahib', name: 'Bhog Shri Akhand Path Sahib', menu: 'Bhog Shri Akhand Path Sahib', main: true,
      date: '2027-01-03T10:00:00+05:30', time: '10:00 AM', icon: 'faith',
      maps: MAP.home,
    },
    {
      id: 'lunch', name: 'Lunch', menu: 'Lunch',
      date: '2027-01-03T13:00:00+05:30', time: '1:00 PM', icon: 'lunch',
      ...HOME, maps: MAP.home,
    },
    {
      id: 'jagoo', name: 'Jagoo', menu: 'Jagoo', art: 'lantern',
      date: '2027-01-03T19:00:00+05:30', time: '7:00 PM',
      ...HOME, maps: MAP.home,
    },
    {
      id: 'departure-of-baraat', name: 'Departure of Baraat', menu: 'Departure of Baraat', art: 'horse',
      date: '2027-01-04T08:00:00+05:30', time: '8:00 AM',
      venue: 'Punia Farm House', address: 'Patiala Cheeka Road, Panjola.', cal: 'Punia Farm House, Patiala Cheeka Road, Panjola',
      maps: MAP.baraat,
    },
  ],

  countdown: {
    title: 'Until We Celebrate',
    sub: 'Counting down to Sunday, 3rd January 2027',
    passed: 'The celebrations have begun. Thank you for your blessings.',
    today: 'Today is the day. Blessings to all who gather.',
  },

  gallery: null,
  gettingHere: null,

  /* R.S.V.P. as printed on the family's card: the three names, the two numbers (tap to call), W.B.C.F. */
  rsvp: {
    title: 'R.S.V.P.',
    names: ['Nishan Singh (Jija Ji) – USA', 'Bhupinder Singh – France', 'Ravinder Singh – USA'],
    phones: [{ label: '90531-47737', tel: '+919053147737' }, { label: '94166-57723', tel: '+919416657723' }],
    compliments: { label: 'With Best Compliments From (W.B.C.F)', from: 'All Multani Family, Relatives & Friends' },
  },

  closing: {
    title: [],
    lines: [],
    signoff: '',
    date: '03.01.2027',
    logo: null,
    monogram: true,
    farewell: null,
    credit: 'Designed by Invitivals',
  },
  contacts: null,

  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-video.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
