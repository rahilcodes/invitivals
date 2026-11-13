/* ─────────────────────────────────────────────────────────────
   Tanveer Kaur & Prabhjit Singh — Sikh wedding invitation, the BRIDE'S
   family's (client, 2026-11-13). A separate copy of the design chosen by
   the client (public/amandeep-ishpreet-wedding, never edited for this).

   Everything a family would change lives here; the page (js/app.js) renders
   only from this object. Dates are ISO strings in India time (+05:30).
   After editing:  node tools/sikh-finish.mjs public/tanveer-prabhjit-wedding
   (calendar files, link preview, cache stamps), then deploy the folder.

   All wording below is the client's. Nothing of the earlier couple remains:
   their names, parents, Gurbani quotation, Punjabi welcome card, venues,
   notes and photograph are gone (the couple on the cover is the design's own
   illustration). Nothing the client did not supply is shown.
   ───────────────────────────────────────────────────────────── */

/* the family's own Google Maps links, exactly as supplied — never a search, never a guess */
const MAP = {
  santGarh: 'https://maps.app.goo.gl/FVjFhzY7ZSvAdkKC9?g_st=ic',   // Sant Garh Harkhowaliye — Bride-side Paath, Anand Karaj
  irmenia: 'https://maps.app.goo.gl/srxaVKEia1appzuv5',             // Irmenia Farms — Mehndi, Haldi, Jagoo
  kamalGrand: 'https://maps.app.goo.gl/zJTfwXFxhKdqW4oA8?g_st=ic',  // Hotel Kamal Grand — Wedding Lunch
  ajitCastle: 'https://maps.app.goo.gl/xqh5APJBeHfv7ndT7?g_st=ic',  // Ajit Castle — Wedding Reception
};

export const weddingConfig = {
  groomName: 'Prabhjit Singh',
  brideName: 'Tanveer Kaur',
  shortGroom: 'Prabhjit',
  shortBride: 'Tanveer',
  /* the bride's family is hosting: the bride is named first everywhere */
  hostSide: 'bride',

  /* the opening symbol in Gurmukhi; set to null to hide */
  invocation: { text: 'ੴ', meaning: 'Ik Onkar', font: 'Noto Serif Gurmukhi' },

  /* the invitation, in the client's words */
  invite: {
    motto: [],
    tagline: ['With the Blessings of', 'Waheguru Ji'],
    eyebrow: ['With the Blessings of', 'Waheguru Ji'],
    line: 'Tanveer Kaur & Prabhjit Singh request the pleasure of your presence and blessings as they celebrate their wedding.',
  },

  sideBorders: null,

  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'With the blessings of Waheguru Ji — the wedding of Tanveer Kaur & Prabhjit Singh · 14 February 2027, Jalandhar',

  /* the Anand Karaj — the main ceremony everything counts down to */
  weddingDate: '2027-02-14T09:00:00+05:30',
  weddingEnd: null,                       // not supplied: a calendar entry runs three hours from its start
  venueCity: 'Jalandhar',

  blessing: {
    title: ['With the Blessings of', 'Sri Guru Granth Sahib Ji'],
    lines: [],                            // no welcome card: the client supplied no further wording
    /* the Gurbani written into the sky of the arch (client, 2026-11-14), laid out as on the design they chose: the
       two lines, a fine rule, the scripture, then Ang · Raag · Mahla.
       The client's reference pictures read "ਜਲਿ ਥਲਿ ਮਹੀਅਲਿ" and "ਅੰਗ ੨੯੬"; their typed brief had "ਮਹਿਆਲਿ" and "ਅੰਗ ੨੬੬".
       The pictures were followed (ਮਹੀਅਲਿ is how the line stands in Gurbani) and both differences were reported to them. */
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
    bride: { label: "Bride's Family", person: 'Tanveer Kaur', relation: 'Daughter of', parents: ['Pirthipal Singh', 'Amarjeet Kaur'] },
    groom: { label: "Groom's Family", person: 'Prabhjit Singh', relation: 'Son of', parents: ['Manjit Singh', 'Daljit Kaur'] },
  },

  story: null,

  schedule: { sub: 'Six days of celebration' },

  /* in the order of the days. art: dhol | horse | gurudwara | lantern, or icon: faith | heart | family | lunch | hall
     maps: only where the family supplied a link; an event without one shows no map button */
  events: [
    {
      id: 'bride-paath', icon: 'faith', menu: 'Bride-side Paath',
      name: 'Bride-side Paath',
      date: '2027-02-09T11:00:00+05:30', time: '11:00 AM',
      venue: 'Sant Garh Harkhowaliye', address: 'Jalandhar, Punjab, India',
      maps: MAP.santGarh,
    },
    {
      id: 'groom-paath', icon: 'faith', menu: 'Groom-side Paath & Bhog',
      name: 'Groom-side Paath & Bhog',
      date: '2027-02-11T11:00:00+05:30', time: '11:00 AM',
      venue: 'Bassi Jalal', address: 'Tanda',
    },
    {
      id: 'mehndi', icon: 'heart', menu: 'Mehndi',
      name: 'Mehndi Ceremony',
      date: '2027-02-12T09:00:00+05:30', time: '9:00 AM',
      venue: 'Irmenia Farms', address: 'Bhogpur',
      maps: MAP.irmenia,
    },
    {
      id: 'haldi', icon: 'family', menu: 'Haldi',
      name: 'Haldi Ceremony',
      date: '2027-02-12T14:00:00+05:30', time: '2:00 PM',
      venue: 'Irmenia Farms', address: 'Bhogpur',
      maps: MAP.irmenia,
    },
    {
      id: 'jagoo', art: 'dhol', menu: 'Jagoo',
      name: 'Jagoo Ceremony',
      date: '2027-02-12T19:00:00+05:30', time: '7:00 PM',
      venue: 'Irmenia Farms', address: 'Bhogpur',
      maps: MAP.irmenia,
    },
    {
      id: 'chooda', icon: 'heart', menu: 'Chooda',
      name: 'Chooda Ceremony',
      date: '2027-02-13T19:00:00+05:30', time: '7:00 PM',
      venue: 'Our Residence', address: 'Jalandhar',
    },
    {
      id: 'anand-karaj', art: 'gurudwara', main: true, menu: 'Anand Karaj',
      name: 'Anand Karaj', subtitle: 'Wedding Ceremony',
      date: '2027-02-14T09:00:00+05:30', time: '9:00 AM',
      venue: 'Sant Garh Harkhowaliye', address: 'Jalandhar, Punjab, India',
      maps: MAP.santGarh,
    },
    {
      id: 'lunch', icon: 'lunch', menu: 'Wedding Lunch',
      name: 'Wedding Lunch',
      date: '2027-02-14T12:00:00+05:30', time: '12:00 PM onwards',
      venue: 'Hotel Kamal Grand', address: 'Grand Trunk Road, near Lamba Pind Chowk Bypass, Div Colony, Preet Nagar, Jalandhar',
      maps: MAP.kamalGrand,
    },
    {
      id: 'doli', icon: 'family', menu: 'Doli',
      name: 'Doli Ceremony',
      date: '2027-02-14T18:00:00+05:30', time: '6:00 PM',
      venue: 'Our Residence', address: 'Jalandhar',
    },
    {
      id: 'reception', art: 'lantern', menu: 'Reception',
      name: 'Wedding Reception',
      date: '2027-02-15T15:00:00+05:30', time: '3:00 PM',
      venue: 'Ajit Castle', address: 'Tanda Hoshiarpur Road',
      maps: MAP.ajitCastle,
    },
  ],

  countdown: {
    title: 'Until We Celebrate',
    sub: 'Counting the days to the Anand Karaj',
    passed: 'The celebrations have begun. Thank you for your blessings.',
  },

  gallery: null,
  gettingHere: null,

  rsvp: null, // the whole RSVP section was removed at the client's request (2026-11-14)

  closing: {
    title: ['With Love', 'and Blessings'],
    lines: [
      'With the blessings of Waheguru Ji, we look forward to celebrating these joyous occasions with you.',
      'Your presence and blessings will make our celebrations even more special.',
    ],
    signoff: 'With Love, The Bride’s Family',
    farewell: '',
    credit: 'Designed by Invitivals',
  },

  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-video.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
