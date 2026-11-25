/* ─────────────────────────────────────────────────────────────
   Kiranjit Singh & Sharnjit Kaur — Sikh wedding invitation from the groom's parents (client brief 2026-11-22), on the
   design of public/amandeep-ishpreet-wedding (a real client's page, never edited for this), copied through the engine
   of public/balram-anushka-groom-wedding (also never edited for this).

   Everything a family would change lives here; the page (js/app.js) renders only from this object.
   Dates are ISO strings in India time (+05:30). After editing:
     node tools/sikh-finish.mjs public/kiranjit-sharnjit-wedding   (meta tags, cache stamps)
     node tools/kiranjit-sharnjit.mjs                              (calendar files, link preview, tags)
   then deploy the folder.

   Names, wording, parents, events, times, venues, phone numbers and map links are the client's, as typed. Only the
   Kirtan has an end time (12:00 Noon); every other calendar entry carries its start only. Two map links only:
   the residence (it opens "Kwality General Store, Dashmesh Nagar, Mukerian" — used as supplied, by the user's
   decision of 2026-11-22) and J.S. Resorts. No couple photograph or monogram was supplied: the cover shows the
   design's illustrated couple, the closing the design's own K & S initials.
   ───────────────────────────────────────────────────────────── */

const MAP = {
  home: 'https://maps.app.goo.gl/Ya4BPxBXY5s9TKW3A?g_st=iw',
  resort: 'https://maps.google.com/maps/place//data=!4m2!3m1!1s0x391bb3dd3360106d:0xdb2ba2b3f21cd7fc?entry=s&sa=X&ved=2ahUKEwi3kI_Y05qYAxVTkOEIHYeiETEQ4kB6BAgfEAA&hl=en',
};
const HOME = { venue: 'At Our Residence', address: '', maps: MAP.home, group: 'home' };
const RESORT = { venue: 'J.S. Resorts', address: '', maps: MAP.resort, group: 'wedding' };

export const weddingConfig = {
  groomName: 'Kiranjit Singh',
  brideName: 'Sharnjit Kaur',
  shortGroom: 'Kiranjit',
  shortBride: 'Sharnjit',
  hostSide: 'groom',

  invocation: { text: 'ੴ', meaning: 'Ik Onkar', font: 'Noto Serif Gurmukhi' },

  invite: {
    /* the card's own wording, above the couple's names on the first screen */
    host: {
      name: 'Sardarni Lovepreet Kaur & S. Amarjit Singh Ghotra',
      relation: '',
      line: 'request the pleasure of your company on the auspicious occasion of the wedding ceremony of their beloved son',
    },
    amp: 'with',
    motto: [],
    tagline: [],
    eyebrow: ['You are', 'cordially invited'],
    line: 'to celebrate the wedding of Kiranjit Singh with Sharnjit Kaur, in the presence of Guru Sahib.',
    from: null,
  },

  sideBorders: null,
  guestFallback: 'You & Your Family',
  shareText: 'With the blessings of Guru Sahib — the wedding of Kiranjit Singh & Sharnjit Kaur · Sunday 6 December 2026',

  /* the wedding day: the Baraat leaves at 9:00 AM — the hero date and the countdown */
  weddingDate: '2026-12-06T09:00:00+05:30',
  weddingEnd: null,
  venueCity: 'Punjab',

  /* the Save the Date card: the wedding itself, as the client asked */
  saveTheDate: {
    couple: 'Kiranjit Singh & Sharnjit Kaur',
    timeLabel: 'Baraat Departure',
    event: {
      id: 'wedding', name: 'Wedding', calTitle: 'Wedding of Kiranjit Singh & Sharnjit Kaur',
      calDetails: 'Wedding of Kiranjit Singh & Sharnjit Kaur. Baraat departure 09:00 AM, Lavaan 10:30 AM.',
      date: '2026-12-06T09:00:00+05:30', time: '09:00 AM',
      venue: 'J.S. Resorts', address: 'Begowal to Nadala Road, Adda Sikri.', maps: MAP.resort,
    },
  },

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
    groom: { label: 'The Groom', person: 'Kiranjit Singh', relation: 'Son of', parents: ['Sardarni Lovepreet Kaur', 'S. Amarjit Singh Ghotra'] },
    bride: { label: 'The Bride', person: 'Sharnjit Kaur', relation: 'D/o', parents: ['Sardarni Satwinder Kaur', 'S. Tarlok Singh'], of: 'of Vill. Bhadas, Distt. Kapurthala' },
  },

  story: null,

  /* in date order. `group` = the shared venue card that follows the last event of that venue */
  schedule: { sub: 'Four days of celebration, one blessed union' },
  dayChips: false,
  venueGroups: {
    home: { eyebrow: 'All Residence Functions', title: 'At Our Residence', lines: ['H. No. 87, Green Avenue Colony,', 'Mukerian, Distt. Hoshiarpur.'], maps: MAP.home },
    wedding: { eyebrow: 'Wedding Day Functions', title: 'J.S. Resorts', lines: ['Begowal to Nadala Road,', 'Adda Sikri.'], maps: MAP.resort },
  },
  events: [
    {
      id: 'arambh', icon: 'faith', menu: 'Arambh',
      name: 'Shri Akhand Path Sahib Arambh',   // client, 26 Nov (was 'Arambh' with this subtitle)
      date: '2026-12-01T10:00:00+05:30', time: '10:00 AM', ...HOME,
    },
    {
      id: 'bhog', icon: 'faith', menu: 'Bhog',
      name: 'Bhog', subtitle: 'Shri Akhand Path Sahib',
      date: '2026-12-03T10:00:00+05:30', time: '10:00 AM', ...HOME,
    },
    {
      id: 'kirtan', icon: 'hall', menu: 'Kirtan',
      name: 'Kirtan',
      date: '2026-12-03T11:00:00+05:30', end: '2026-12-03T12:00:00+05:30', time: '11:00 AM to 12:00 Noon', ...HOME,
    },
    {
      id: 'langar', icon: 'lunch', menu: 'Guru Ka Langar',
      name: 'Guru Ka Langar',
      date: '2026-12-03T13:00:00+05:30', time: '01:00 PM', ...HOME,
    },
    {
      id: 'jaggo', art: 'dhol', menu: 'Jaggo & DJ Night',
      name: 'Jaggo & DJ Night',
      date: '2026-12-04T19:30:00+05:30', time: '07:30 PM', ...HOME,
    },
    {
      id: 'baraat', art: 'horse', menu: 'Baraat',
      name: 'Baraat', subtitle: 'Departure',
      date: '2026-12-06T09:00:00+05:30', time: '09:00 AM', ...RESORT,
    },
    {
      id: 'lavaan', art: 'gurudwara', main: true, menu: 'Lavaan',
      name: 'Lavaan',
      date: '2026-12-06T10:30:00+05:30', time: '10:30 AM',
      /* client, 26 Nov: the Lavaan moved from J.S. Resorts to Bhadas Begowal. No map link was supplied for it, so it has
         none (the resort's map is not reused) and it no longer belongs to the resort's venue card. */
      venue: 'Bhadas Begowal', address: '',
    },
  ],

  countdown: {
    title: 'Until We Celebrate',
    sub: 'Counting the days to the wedding',
    passed: 'The celebrations have begun. Thank you for your blessings.',
  },

  gallery: null,
  gettingHere: null,
  /* as printed on the card */
  rsvp: {
    title: 'R.S.V.P.',
    name: 'Ghotra Family',
    phones: [{ label: '70091-33727', tel: '+917009133727' }, { label: '97796-61817', tel: '+919779661817' }],
    compliments: { label: 'With Best Compliments From', from: 'All Relatives & Friends' },
  },

  closing: {
    title: ['With Love', 'and Blessings'],
    lines: ['We look forward to celebrating', 'this special chapter with you.'],
    signoff: 'The Ghotra Family',
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
