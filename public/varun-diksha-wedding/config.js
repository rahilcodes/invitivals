/* ─────────────────────────────────────────────────────────────
   weddingConfig — GROOM-SIDE (Baswal family) invitation of Varun & Diksha, built 2026-10-27 on the Invitivals
   South-Indian-temple design (hindu-south-wedding family of pages).
   The page (js/app.js) renders only from this object, so a new
   invitation is: copy the folder, edit this file, swap photos.
   Dates are ISO strings in India time (+05:30).
   Only what the client supplied is used: no RSVP number, no ceremony hours, no bride's grandparents.
   ───────────────────────────────────────────────────────────── */
export const weddingConfig = {
  groomName: 'Varun',
  brideName: 'Diksha',
  brideFirst: false, // groom-side invitation: Varun is written first everywhere
  tagline: ['Two hearts.', 'One journey.', 'Forever.'],
  invocation: 'Om Sri Ganeshaya Namaha',
  /* a blessing in the family's own script; set to null to hide. font = any Google Font that covers it */
  regional: { text: 'शुभ विवाह', meaning: 'Shubh Vivah', font: 'Noto Serif Devanagari', lang: 'hi' },
  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Varun & Diksha · 25 November 2026, Ambala City',

  /* the ceremony is "as per programme": the day's one fixed time is the Baraat leaving Sarita Vihar at 10 AM,
     so the countdown and the calendar start there; no ceremony hours are shown */
  weddingDate: '2026-11-25T10:00:00+05:30',
  weddingEnd: '',
  weddingTimeLabel: 'As per programme',
  ceremonyTitle: 'Wedding Ceremony',
  ceremonyLine: '',
  muhurtham: '',

  venue: 'The Glen Manor',
  venueAddress: 'Khanna Farms, Chandigarh Road, Ambala City',
  venueCity: 'Ambala City',
  mapsUrl: 'https://share.google/roQGgvYO2wtCDj2TP',
  venueImage: 'assets/venue-glen-manor.webp', // the client's photo of the gate, sign included
  coupleImage: null, // no couple picture supplied yet: the hero shows the arch without one

  welcome: {
    title: 'Welcome',
    lines: [
      'With the blessings of the Almighty',
      'and the love of our families,',
      'we joyfully invite you to be part of',
      'the most sacred day of our lives.',
    ],
  },

  story: null,

  families: {
    groom: {
      label: "Groom's Family",
      person: 'Varun',
      relation: 'Son of',
      parents: ['Smt. Sushma', 'Sh. R. K. Baswal'],
      grandparents: 'Grandson of Smt. Dhapa & Sh. Panna Lal',
    },
    bride: {
      label: "Bride's Family",
      person: 'Diksha',
      relation: 'Daughter of',
      parents: ['Smt. Sandhiya', 'Sh. J. K. Bhambhoria'],
    },
  },

  familyOrder: ['groom', 'bride'], // groom-side invitation: groom's family first

  /* icon: vratham | nichayam | ring | haldi | mehendi | sangeet | muhurtham | forever | reception */
  /* details = [label, value] rows; nothing beyond the client's brief */
  events: [
    { icon: 'haldi', name: 'Haldi & Mehndi', date: '2026-11-23T15:00:00+05:30',
      details: [['Time', '3:00 PM']],
      venue: 'J124, Pocket J, Sarita Vihar, New Delhi, Delhi 110076',
      maps: 'https://www.google.com/maps/search/?api=1&query=J124%2C%20Pocket%20J%2C%20Sarita%20Vihar%2C%20New%20Delhi%2C%20Delhi%20110076' },
    { icon: 'nichayam', name: 'Manda & Bhaat', date: '2026-11-24T18:00:00+05:30',
      details: [['Time', '6:00 PM']],
      venue: 'J124, Pocket J, Sarita Vihar, New Delhi, Delhi 110076',
      maps: 'https://www.google.com/maps/search/?api=1&query=J124%2C%20Pocket%20J%2C%20Sarita%20Vihar%2C%20New%20Delhi%2C%20Delhi%20110076' },
    { icon: 'forever', name: 'Wedding Ceremony', date: '2026-11-25T10:00:00+05:30', main: true,
      details: [['Ceremony', 'As per programme'], ['Baraat', '10:00 AM · Sarita Vihar to Ambala City']],
      venue: 'The Glen Manor, Khanna Farms, Chandigarh Road, Ambala City',
      maps: 'https://share.google/roQGgvYO2wtCDj2TP' },
    { icon: 'reception', name: 'Reception', date: '2026-11-28T19:00:00+05:30',
      details: [['Time', '7:00 PM']],
      venue: 'Tivoli Royal Court, Okhla Phase-I, New Delhi',
      maps: 'https://share.google/ZhpNneaABMEk9xFQE' },
  ],

  gallery: [],

  /* no RSVP contact supplied: RSVP opens WhatsApp and the guest picks the contact (no number is invented) */
  rsvp: {
    deadline: '',
    whatsapp: '',
  },

  travelNote: 'All our venues, one tap from your maps',
  travel: [
    { icon: 'pin', title: 'Sarita Vihar, New Delhi', text: 'J124, Pocket J, Sarita Vihar, New Delhi, Delhi 110076 · Haldi & Mehndi, Manda & Bhaat', link: { label: 'Open in Maps', href: 'https://www.google.com/maps/search/?api=1&query=J124%2C%20Pocket%20J%2C%20Sarita%20Vihar%2C%20New%20Delhi%2C%20Delhi%20110076' } },
    { icon: 'pin', title: 'The Glen Manor', text: 'The Glen Manor, Khanna Farms, Chandigarh Road, Ambala City · Wedding Ceremony', link: { label: 'Wedding map', href: 'https://share.google/roQGgvYO2wtCDj2TP' } },
    { icon: 'pin', title: 'Tivoli Royal Court', text: 'Tivoli Royal Court, Okhla Phase-I, New Delhi · Reception', link: { label: 'Open in Maps', href: 'https://share.google/ZhpNneaABMEk9xFQE' } },
  ],

  contact: null,
  gifting: null,

  wishes: { prompt: 'Leave your blessings for the couple.' },

  thankYou: {
    title: 'Thank You',
    lines: ['For being a part of our special day.', 'Your love and blessings', 'mean the world to us.'],
    signoff: 'With love, Baswal Family',
  },

  creditCampaign: 'varun-diksha-wedding',
  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
