/* ─────────────────────────────────────────────────────────────
   Prabhjit Singh & Tanveer Kaur — Sikh wedding invitation, the GROOM'S
   family's (client, 2026-11-14): a separate page at /prabhjit-tanveer-wedding/,
   made from the bride's family's page (public/tanveer-prabhjit-wedding, never
   edited for this). The groom and his family come first, the Groom-side Paath
   & Bhog stands where the bride's page has the Bride-side Paath, and the
   closing is signed by the groom's family. Everything else is the same.

   Everything a family would change lives here; the page (js/app.js) renders
   only from this object. Dates are ISO strings in India time (+05:30).
   After editing:  node tools/sikh-finish.mjs public/prabhjit-tanveer-wedding, then
   node tools/tanveer-prabhjit-cal.mjs prabhjit-tanveer-wedding and node tools/tanveer-prabhjit-og.mjs prabhjit-tanveer-wedding,
   then deploy the folder.

   All wording below is the client's. Nothing of the earlier couple remains:
   their names, parents, Gurbani quotation, Punjabi welcome card, venues,
   notes and photograph are gone (the couple on the cover is the design's own
   illustration). Nothing the client did not supply is shown.
   ───────────────────────────────────────────────────────────── */

/* the family's own Google Maps links, exactly as supplied — never a search, never a guess */
const MAP = {
  santGarh: 'https://maps.app.goo.gl/FVjFhzY7ZSvAdkKC9?g_st=ic',   // Sant Garh Harkhowaliye — Anand Karaj
  iremia: 'https://maps.app.goo.gl/srxaVKEia1appzuv5',             // Iremia Farms — Haldi, Jagoo
  kamalGrand: 'https://maps.app.goo.gl/zJTfwXFxhKdqW4oA8?g_st=ic',  // Hotel Kamal Grand — Wedding Lunch
  ajitCastle: 'https://maps.app.goo.gl/xqh5APJBeHfv7ndT7?g_st=ic',  // Ajit Castle — Wedding Reception
};

export const weddingConfig = {
  groomName: 'Prabhjit Singh',
  brideName: 'Tanveer Kaur',
  shortGroom: 'Prabhjit',
  shortBride: 'Tanveer',
  /* the groom's family's invitation: the groom is named first everywhere, and his family is introduced first */
  hostSide: 'groom',

  /* the opening symbol in Gurmukhi; set to null to hide */
  invocation: { text: 'ੴ', meaning: 'Ik Onkar', font: 'Noto Serif Gurmukhi' },

  /* the invitation, in the client's words */
  invite: {
    motto: [],
    tagline: ['With the Blessings of', 'Waheguru Ji'],
    eyebrow: ['With the Blessings of', 'Waheguru Ji'],
    line: 'Prabhjit Singh & Tanveer Kaur request the pleasure of your presence and blessings as they celebrate their wedding.',
  },

  sideBorders: null,

  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'With the blessings of Waheguru Ji — the wedding of Prabhjit Singh & Tanveer Kaur · 14 February 2027, Jalandhar',

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

  schedule: { sub: 'Four days of celebration' },   /* 11, 12, 14 and 15 February, now that the Chooda of the 13th is not on this invitation */

  /* in the order of the days. art: dhol | horse | gurudwara | lantern, or icon: faith | heart | family | lunch | hall
     maps: only where the family supplied a link; an event without one shows no map button */
  events: [
    /* the groom's family's own Paath (the bride's page has the Bride-side Paath of 9 February here instead); no map link was supplied for it */
    {
      id: 'groom-paath', icon: 'faith', menu: 'Paath and Bhog',   /* shown as "Paath and Bhog" (client, 2026-11-15; was "Groom-side Paath & Bhog") */
      name: 'Paath and Bhog',
      date: '2027-02-11T11:00:00+05:30', time: '11:00 AM',
      venue: 'Bassi Jalal', address: 'Tanda',
    },
    /* the Mehndi (12 Feb) and the Chooda (13 Feb) are not on the groom's invitation (client, 2026-11-15); the bride's page keeps both */
    {
      id: 'haldi', icon: 'family', menu: 'Haldi',
      name: 'Haldi Ceremony',
      date: '2027-02-12T14:00:00+05:30', time: '2:00 PM',
      venue: 'Iremia Farms', address: 'Bhogpur',
      maps: MAP.iremia,
    },
    {
      id: 'jagoo', art: 'dhol', menu: 'Jagoo',
      name: 'Jagoo Ceremony',
      date: '2027-02-12T19:00:00+05:30', time: '7:00 PM',
      venue: 'Iremia Farms', address: 'Bhogpur',
      maps: MAP.iremia,
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
    /* the Doli (14 Feb, 6:00 PM) is not on the groom's invitation either (client, 2026-11-15); the bride's page keeps it */
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
    signoff: 'With Love, The Groom’s Family',
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
