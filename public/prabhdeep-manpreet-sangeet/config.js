/* ─────────────────────────────────────────────────────────────
   The Sangeet of Prabhdeep & Manpreet — Thursday 21 January 2027, 3:00 PM onwards, Bika Banquet, Rangoli Mall,
   Howrah (client brief 2026-11-27). Its own page, separate from the wedding (public/prabhdeep-manpreet-wedding),
   on the same design (public/amandeep-ishpreet-wedding, never edited for this) dressed for an evening of music:
   the dhol; the very same colours, pictures and film as the wedding page (client, 2026-11-28).

   After editing:
     node tools/sikh-finish.mjs public/prabhdeep-manpreet-sangeet
     node tools/prabhdeep-manpreet.mjs

   Every word, name, time, venue, phone number and map link is the client's, exactly as supplied. No end time was
   supplied: the calendar entry carries the start only.
   ───────────────────────────────────────────────────────────── */

const MAP = { bika: 'https://maps.app.goo.gl/c8UDaxwoxvNTqnZRA?g_st=ic' };   // Bika Banquet, exactly as supplied

export const weddingConfig = {
  groomName: 'Manpreet',
  brideName: 'Prabhdeep',
  shortGroom: 'Manpreet',
  shortBride: 'Prabhdeep',
  hostSide: 'bride',
  pageTitle: 'Sangeet · Prabhdeep & Manpreet',

  /* cover · the hosts' invitation (and its Save the Date card) · the evening · countdown · closing */
  chapters: ['hero+invite', 'events', 'countdown'],

  invocation: null,

  invite: {
    heroEyebrow: 'Sangeet',
    motto: [],
    tagline: ['An evening of music & dance'],
    /* exactly as supplied */
    hosts: 'Manjit Singh & Ekta Kaur',
    eyebrow: [],
    line: 'Cordially invite you to an evening of music & dance to celebrate the upcoming wedding of',
    couple: [{ name: 'Prabhdeep' }, { name: 'Manpreet' }],
    coupleJoin: '&',
    from: null,
  },

  sideBorders: null,
  guestFallback: 'You & Your Family',
  shareText: 'Sangeet — Prabhdeep & Manpreet · Thursday 21 January 2027, 3:00 PM onwards · Bika Banquet, Rangoli Mall, Howrah',

  weddingDate: '2027-01-21T15:00:00+05:30',
  weddingEnd: null,
  venueCity: 'Howrah',

  blessing: { title: [], lines: [], quote: null },
  families: { heading: '', sub: '', bride: { label: '', person: '', relation: '', parents: ['', ''] }, groom: { label: '', person: '', relation: '', parents: ['', ''] } },
  story: null,

  eventsHeading: { title: 'The Evening', sub: 'Thursday, 21st January 2027' },
  schedule: null,
  dayChips: false,
  events: [
    {
      id: 'sangeet', art: 'dhol', main: true, menu: 'Sangeet',
      name: 'Sangeet',
      subtitle: 'An evening of music & dance',
      date: '2027-01-21T15:00:00+05:30', time: '3:00 PM onwards',
      venue: 'Bika Banquet', address: 'Rangoli Mall, Howrah.',
      cal: 'Bika Banquet, Rangoli Mall, Howrah',
      calDetails: 'An evening of music and dance celebrating the upcoming wedding of Prabhdeep and Manpreet.',
      maps: MAP.bika,
    },
  ],

  countdown: {
    title: 'Until the Sangeet',
    sub: 'Thursday, 21st January 2027 · 3:00 PM onwards',
    passed: 'The music has begun. Thank you for celebrating with us.',
    today: 'Tonight is the Sangeet — see you on the dance floor!',
  },

  gallery: null,
  gettingHere: null,
  rsvp: null,

  closing: {
    title: [],
    lines: [],
    signoff: '',
    date: null,
    logo: null,
    monogram: false,
    farewell: null,
    credit: 'Designed by Invitivals',
  },
  contacts: {
    label: 'For Queries',
    people: [{ name: 'Manjit Singh', label: '9903502359', tel: '+919903502359' }, { name: 'Ekta Kaur', label: '9903608566', tel: '+919903608566' }],
  },

  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-video.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
