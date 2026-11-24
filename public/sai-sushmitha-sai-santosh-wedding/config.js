/* ─────────────────────────────────────────────────────────────
   weddingConfig — Dr. Sai Sushmitha Reddy & Sai Santosh Reddy, wedding, Sunday 13 December 2026, 8:19 AM
   (client brief 2026-11-24), a separate copy of the Nandini & Satyam design (public/nandini-satyam-wedding is the
   reference and is never edited for this page). Every word below is the client's own, exactly as supplied:
   invocation, heading, invitation message, names, the groom's "Only S/o." line, date and time, venue and hosts.
   No end time was supplied: the calendar entry carries the start only. The venue photograph is the client's own.
   Dates are ISO strings in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
export const weddingConfig = {
  slug: 'sai-sushmitha-sai-santosh-wedding',
  groomName: 'Sai Santosh Reddy',
  brideName: 'Dr. Sai Sushmitha Reddy',
  brideFirst: true,          // the bride's parents invite: the bride is written first everywhere
  initials: ['S', 'S'],      // the couple's monogram letters (Sai Sushmitha, Sai Santosh)
  heading: 'Wedding Invitation',
  joiner: 'weds',
  tagline: [],
  invocation: 'Sree Ganeshaaya Namaha',
  invocationMarks: ['॥', '॥'],
  regional: null,
  /* ?to=Name in the link greets each guest personally */
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Dr. Sai Sushmitha Reddy & Sai Santosh Reddy · Sunday, 13 December 2026, 8:19 AM · PARINAYA CONVENTIONS, Hyderabad',

  weddingDate: '2026-12-13T08:19:00+05:30',
  weddingEnd: null,          // not supplied: no end time is invented
  weddingTimeLabel: '8:19 AM',
  ceremonyTitle: 'The Wedding',
  ceremonyLine: '',
  muhurtham: '',

  venue: 'PARINAYA CONVENTIONS',
  venueAddress: 'Brahmanpally Road, Turkayamjal, Hyderabad.',
  venueCity: 'Hyderabad',
  mapsUrl: '',               // PENDING: the client's exact Google Maps link (no guessed location goes live)
  venueImage: 'assets/venue-parinaya.webp', // the client's own photograph of the venue
  venueImageRatio: '16 / 9',

  welcome: {
    title: 'Welcome',
    lines: ['We solicit your gracious presence and blessings with family & friends on this auspicious occasion of the marriage of our daughter'],
  },

  story: null,

  families: {
    bride: {
      label: "Bride's Family",
      person: 'Dr. Sai Sushmitha Reddy',
      initial: 'S',
      relation: 'Daughter of',
      parents: ['Smt. Beeravally Padmavathi', 'Sri Beeravally Gopal Reddy'],
      grandparents: '',
    },
    groom: {
      label: "Groom's Family",
      person: 'Sai Santosh Reddy',
      relation: 'Only S/o.',
      parents: ['Smt. & Sri Kotha Venkata', 'Sandhya Rani - Laxma Reddy'],
      grandparents: '',
    },
  },
  familyOrder: ['bride', 'groom'],

  /* one event: the wedding (the festivities timeline is left out for a single event) */
  events: [
    { icon: 'muhurtham', name: 'The Wedding', date: '2026-12-13T08:19:00+05:30', main: true,
      details: [['Time', '8:19 AM']],
      venue: 'PARINAYA CONVENTIONS, Brahmanpally Road, Turkayamjal, Hyderabad.' },
  ],

  gallery: [],

  /* the RSVP is stored on our server (rsvp.php next to this file): name, attendance, number of guests only */
  rsvp: {
    endpoint: '/sai-sushmitha-sai-santosh-wedding/rsvp.php',
    choices: ['Yes, I’ll be attending', 'Sorry, I won’t be able to attend'],
    maxGuests: 12,
    deadline: '',
  },

  travel: [],
  contact: null,
  gifting: null,
  wishes: null,

  thankYou: {
    title: 'Thank You',
    lines: ['For being a part of our special day.', 'Your love and blessings', 'mean the world to us.'],
    signoff: 'With love, Smt. Beeravally Padmavathi & Sri Beeravally Gopal Reddy',
  },

  creditCampaign: 'sai-sushmitha-sai-santosh-wedding',
  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
