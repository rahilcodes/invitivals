/* ─────────────────────────────────────────────────────────────
   weddingConfig — Swarnit Wayal & Kaumudi Shewale, Washim, 26–27 December 2026 (client brief 2026-11-22).
   A separate Maharashtrian invitation on the hindu-south-wedding template (public/hindu-south-wedding is the
   studio's demo and is never edited for this). The page (js/app.js) renders only from this object.
   After a change run  node tools/swarnit-kaumudi-wedding.mjs  (artwork, sharing tags, link preview).
   Dates are ISO strings in India time (+05:30).

   Every name, date, time and address is the client's, as transcribed from their invitation card.
   The venue's name follows its own Google listing (the client's link): "Mahalaxmi Celebrations and Lawns".
   Only start times were supplied: calendar entries carry no invented end.
   The song and the venue photograph are the client's own files (2026-11-23). No RSVP contact was on the card:
   replies are stored by rsvp.php on the server.
   ───────────────────────────────────────────────────────────── */
/* the venue's Google Maps place, taken from the listing the client's link (share.google/0I4GVkC40WAhZx0W0) opens:
   "Mahalaxmi Celebrations and Lawns Washim", Washim, Maharashtra 444505 */
const MAPS = 'https://www.google.com/maps?cid=8866502210998840338';
const VENUE = 'Mahalaxmi Celebrations and Lawns';
const at = (d, t) => `2026-12-${d}T${t}:00+05:30`;

export const weddingConfig = {
  slug: 'swarnit-kaumudi-wedding',
  groomName: 'Swarnit',
  brideName: 'Kaumudi',
  groomFull: 'Swarnit Wayal',
  brideFull: 'Kaumudi Shewale',
  tagline: ['Two Hearts', 'One Beautiful Journey'],
  invocation: 'Shree Ganeshaya Namah',
  /* a blessing in Marathi; font = a Google Font that covers Devanagari */
  regional: { text: '॥ शुभ विवाह ॥', meaning: 'Shubh Vivah', font: 'Noto Serif Devanagari', lang: 'mr' },
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Swarnit Wayal & Kaumudi Shewale · 27 December 2026, Washim',

  /* the Wedding Ceremony, Sunday 27 December 2026, 7:00 PM: the hero date and the countdown */
  weddingDate: at(27, '19:00'),
  weddingEnd: null,
  weddingTimeLabel: '7:00 PM',
  ceremonyTitle: 'The Wedding Ceremony',
  muhurtham: '',

  venue: VENUE,
  venueAddress: 'Risod Road, Washim, Maharashtra',
  venueCity: 'Washim, Maharashtra',
  mapsUrl: MAPS,
  /* the client's photograph of the venue (2026-11-23), whole: only resized */
  venueImage: { src: 'assets/venue.webp', w: 1000, h: 1103, alt: 'Mahalaxmi Celebrations and Lawns: the white hall with its name in Marathi on the roof, at dusk' },

  welcome: {
    title: 'Welcome',
    lines: [
      'With joy in our hearts,',
      'Swarnit Wayal & Kaumudi Shewale',
      'cordially invite you and your family',
      'to be a part of our wedding celebrations.',
    ],
  },

  families: {
    groom: {
      label: "Groom's Family",
      person: 'Swarnit Wayal',
      initial: 'S',
      relation: 'Son of',
      parents: ['Devidas Sheshrao Wayal', 'Smt. Sunita Devidas Wayal'],
      place: 'Village Padali Shinde, Buldhana 443204',
    },
    bride: {
      label: "Bride's Family",
      person: 'Kaumudi Shewale',
      initial: 'K',
      relation: 'Daughter of',
      parents: ['Tukaram Haribhau Shewale', 'Smt. Kusum Tukaram Shewale'],
      place: 'Vivekandnagar, Lakhala, Washim 444505',
    },
  },

  /* icon: vratham | nichayam | haldi | mehendi | sangeet | muhurtham | reception | ring */
  events: [
    { icon: 'ring',      name: 'Ring Ceremony',    date: at(26, '17:00'), time: '5:00 PM', venue: VENUE },
    { icon: 'haldi',     name: 'Haldi Ceremony',   date: at(26, '18:00'), time: '6:00 PM', venue: VENUE },
    { icon: 'vratham',   name: 'Wedding Rituals',  date: at(27, '10:00'), time: '10:00 AM onwards', venue: VENUE },
    { icon: 'muhurtham', name: 'Wedding Ceremony', date: at(27, '19:00'), time: '7:00 PM', venue: VENUE, main: true },
  ],

  rsvp: { endpoint: 'rsvp.php', maxGuests: 20 },

  thankYou: {
    title: 'Thank You',
    lines: ['Your presence and blessings', 'will mean the world to us.'],
    signoff: 'With love, the Wayal & Shewale families',
  },
  /* the closing: the couple themselves, the last thing on the invitation (client, 2026-11-23; the three framed
     fort pictures were removed at the client's request) */

  music: 'assets/audio/music.mp3',   // the client's own song (2026-11-23), the file exactly as supplied
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
    /* the film's last second shows the template's own temple; the invitation takes over as the doors flood with
       light, so the guest steps straight into the fort arch */
    revealAt: 4.15,
  },
};
