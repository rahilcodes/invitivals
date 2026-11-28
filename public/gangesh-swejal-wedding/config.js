/* ─────────────────────────────────────────────────────────────
   weddingConfig — Gangesh Dhuri & Swejal Shirgavkar, 24–27 December 2026 (client brief 2026-11-28).
   A separate invitation on the design of /swarnit-kaumudi-wedding/ (that page is never edited for this): a copy of
   its engine with the venue and RSVP sections removed (no venue name or RSVP contact was supplied) and a Google Maps
   + Google Calendar button on every ceremony. The page (js/app.js) renders only from this object.
   After a change run  node tools/gangesh-swejal-wedding.mjs  (calendar files, link preview, sharing tags).
   Dates are ISO strings in India time (+05:30).

   Every name, place, date, time and map link is the client's, exactly as supplied. No venue names or addresses were
   supplied, so none are shown. Only start times ("onwards") were supplied: calendar entries carry no end.
   ───────────────────────────────────────────────────────────── */
/* the family's Google Maps links, exactly as supplied — one per ceremony, never swapped */
const MAP = {
  ring: 'https://maps.app.goo.gl/CxbjWeeQPmGfZYcZA',
  haldi: 'https://goo.gl/maps/gCMjnkjGacSA3Jgh9?g_st=aw',
  wedding: 'https://maps.app.goo.gl/ACE95GsFyoNbPYsP8?g_st=aw',   // Wedding Rituals and Wedding Ceremony
};
const at = (d, t) => `2026-12-${d}T${t}:00+05:30`;

export const weddingConfig = {
  slug: 'gangesh-swejal-wedding',
  groomName: 'Gangesh',
  brideName: 'Swejal',
  groomFull: 'Gangesh Dhuri',
  brideFull: 'Swejal Shirgavkar',
  tagline: ['Two Hearts', 'One Beautiful Journey'],
  invocation: 'Shree Ganeshaya Namah',
  /* the design's blessing in Marathi; font = a Google Font that covers Devanagari */
  regional: { text: '॥ शुभ विवाह ॥', meaning: 'Shubh Vivah', font: 'Noto Serif Devanagari', lang: 'mr' },
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Gangesh Dhuri & Swejal Shirgavkar · 27 December 2026',

  /* the Wedding Ceremony, Sunday 27 December 2026, 1:00 PM onwards: the hero date, the ceremony page and the countdown */
  weddingDate: at(27, '13:00'),
  weddingEnd: null,
  weddingTimeLabel: '1:00 PM onwards',
  ceremonyTitle: 'The Wedding Ceremony',
  muhurtham: '',
  venueCity: '',

  welcome: {
    title: 'Welcome',
    lines: [
      'With joy in our hearts,',
      'Gangesh Dhuri & Swejal Shirgavkar',
      'cordially invite you and your family',
      'to be a part of our wedding celebrations.',
    ],
  },

  families: {
    groom: {
      label: "Groom's Family",
      person: 'Gangesh Dhuri',
      initial: 'G',
      relation: 'Son of',
      parents: ['Mahendra Shantaram Dhuri', 'Manisha Mahendra Dhuri'],
      place: 'Native Village: Dhuriwadi, Elaye, Devgad.',
    },
    bride: {
      label: "Bride's Family",
      person: 'Swejal Shirgavkar',
      initial: 'S',
      relation: 'Daughter of',
      parents: ['Mahendra Devaji Shirgavkar', 'Madhavi Mahendra Shirgavkar'],
      place: 'Native Village: Padhavewadi, Velneshwar, Guhagar.',
    },
  },

  /* icon: vratham | nichayam | haldi | mehendi | sangeet | muhurtham | reception | ring.
     cal = the client's calendar description, word for word */
  events: [
    { id: 'ring-ceremony', icon: 'ring', theme: 'ring', name: 'Ring Ceremony', date: at(24, '10:00'), time: '10:00 AM onwards', maps: MAP.ring,
      cal: 'Ring Ceremony celebration of Gangesh Dhuri and Swejal Shirgavkar.' },
    { id: 'haldi', icon: 'haldi', theme: 'haldi', name: 'Haldi', date: at(25, '18:00'), time: '6:00 PM onwards', maps: MAP.haldi,
      cal: 'Haldi ceremony of Gangesh Dhuri and Swejal Shirgavkar.' },
    { id: 'wedding-rituals', icon: 'vratham', theme: 'rituals', name: 'Wedding Rituals', date: at(27, '11:30'), time: '11:30 AM onwards', maps: MAP.wedding,
      cal: 'Wedding rituals of Gangesh Dhuri and Swejal Shirgavkar.' },
    { id: 'wedding-ceremony', icon: 'muhurtham', theme: 'wedding', name: 'Wedding Ceremony', date: at(27, '13:00'), time: '1:00 PM onwards', maps: MAP.wedding, main: true,
      cal: 'Wedding ceremony of Gangesh Dhuri and Swejal Shirgavkar.' },
  ],

  thankYou: {
    title: 'Thank You',
    lines: ['Your presence and blessings', 'will mean the world to us.'],
    signoff: 'With love, the Dhuri & Shirgavkar families',
  },
  /* the design's closing picture, whole, the last thing on the invitation */
  closingImage: { src: 'assets/closing-scene.webp', w: 1600, h: 837, alt: 'A hill fort across a lake at sunset, seen through a carved stone arch with brass lamps, a dhol and a rangoli' },

  music: 'assets/audio/music.mp3',   // the design's own song (public/hindu-south-wedding); none was supplied
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
    revealAt: 4.15,
  },
};
