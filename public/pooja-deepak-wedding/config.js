/* ─────────────────────────────────────────────────────────────
   weddingConfig — Pooja & Deepak, 29 November 2026, Noida (client brief 2026-10-28).
   Design: the client chose public/nandini-satyam-wedding-without-shagna (unchanged); this is a copy of that
   design with the mobile hero fixes made for public/varun-diksha-wedding.
   The page (js/app.js) renders only from this object, so a new
   invitation is: copy the folder, edit this file, swap photos.
   Dates are ISO strings in India time (+05:30).
   Only what the client supplied is used: no Haldi venue name (its map link only), no RSVP contact,
   no grandparents, no ceremony time beyond "7:00 PM onwards · Dinner".
   ───────────────────────────────────────────────────────────── */
export const weddingConfig = {
  groomName: 'Deepak',
  brideName: 'Pooja',
  brideFirst: true, // the client writes "Pooja & Deepak": Pooja first everywhere
  tagline: ['Two hearts.', 'One journey.', 'Forever.'],
  invocation: 'Om Sri Ganeshaya Namaha',
  /* a blessing in the family's own script; set to null to hide. font = any Google Font that covers it */
  regional: { text: 'शुभ विवाह', meaning: 'Shubh Vivah', font: 'Noto Serif Devanagari', lang: 'hi' },
  /* the client's shloka, on the closed doors of the opening slide only (js/sections/intro.js), wording exactly as sent */
  introShloka: { lines: ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥'], font: 'Noto Serif Devanagari', lang: 'sa' },
  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Pooja & Deepak · 29 November 2026, Noida',

  weddingDate: '2026-11-29T19:00:00+05:30',
  weddingEnd: '',
  weddingTimeLabel: '7 PM onwards',
  ceremonyTitle: 'Wedding Celebration',
  ceremonyLine: 'Your presence will make our celebration complete.<br>Please join us for the wedding and dinner.',
  muhurtham: '',

  venue: 'R.S Farm Banquet',
  venueAddress: 'Near Parthala Bridge, Sector 12, Noida, Uttar Pradesh 201307',
  venueCity: 'Noida',
  mapsUrl: 'https://share.google/wCmAaZipCqtWKXlEY',
  venueImage: 'assets/venue-rs-farm.webp', // the client's photo of the banquet aisle (2026-10-29), in place of the kolam seal and pin
  coupleImage: 'assets/couple.webp', // the client's couple seen from behind (2026-10-29), cut off its black by tools/varun-diksha-couple.mjs

  welcome: {
    title: 'Welcome',
    lines: [
      'With the blessings of the Almighty',
      'and the love of our families,',
      'we joyfully invite you to be a part of',
      'the most sacred day of our lives.',
    ],
  },

  story: null,

  families: {
    bride: {
      label: "Bride's Family",
      person: 'Pooja',
      relation: 'Daughter of',
      parents: ['Mrs Ramvati', 'Late Shri Rajkumar'],
    },
    groom: {
      label: "Groom's Family",
      person: 'Deepak',
      relation: 'Son of',
      parents: ['Mrs Meena Lalwani', 'Ramesh Lalwani'],
    },
  },

  familyOrder: ['bride', 'groom'],

  /* icon: vratham | nichayam | ring | haldi | mehendi | sangeet | muhurtham | forever | reception */
  events: [
    { icon: 'haldi', name: 'Haldi', date: '2026-11-29T09:00:00+05:30',
      details: [['Time', '9:00 AM']],
      maps: 'https://maps.app.goo.gl/s6yeTBJ6DEE62A6y7' },
    { icon: 'forever', name: 'Wedding Celebration', date: '2026-11-29T19:00:00+05:30', main: true,
      details: [['Time', '7:00 PM onwards · Dinner']],
      venue: 'R.S Farm Banquet, Near Parthala Bridge, Sector 12, Noida, Uttar Pradesh 201307',
      maps: 'https://share.google/wCmAaZipCqtWKXlEY' },
  ],

  /* the client's own pictures (tools/pooja-deepak-art.mjs), each shown whole */
  gallery: [
    { src: 'assets/gallery-pd-couple.webp', alt: 'Pooja and Deepak in each other’s arms beneath a floral arch, she in a blush-pink gown and he in a navy suit', shape: 'portrait' },
    { src: 'assets/gallery-pd-haldi.webp', alt: 'Pooja and Deepak in yellow at their Haldi, marigold garlands behind them', shape: 'pair' },
    { src: 'assets/gallery-pd-hills.webp', alt: 'Deepak twirling a laughing Pooja on a hilltop', shape: 'pair' },
  ],

  /* no RSVP contact supplied: RSVP opens WhatsApp and the guest picks the contact (no number is invented) */
  rsvp: {
    deadline: '',
    whatsapp: '',
  },

  travelNote: 'Both our venues, one tap from your maps',
  travel: [
    { icon: 'pin', title: 'R.S Farm Banquet', text: 'R.S Farm Banquet, Near Parthala Bridge, Sector 12, Noida, Uttar Pradesh 201307 · Wedding Celebration', link: { label: 'Wedding map', href: 'https://share.google/wCmAaZipCqtWKXlEY' } },
    { icon: 'pin', title: 'Haldi', text: 'Sunday, 29 November · 9:00 AM', link: { label: 'Haldi map', href: 'https://maps.app.goo.gl/s6yeTBJ6DEE62A6y7' } },
  ],

  contact: null,
  gifting: null,

  wishes: { prompt: 'Leave your blessings for the couple.' },

  thankYou: {
    title: 'Thank You',
    lines: ['For being a part of our special day.', 'Your love and blessings', 'mean the world to us.'],
    signoff: 'With love, both families',
  },

  creditCampaign: 'pooja-deepak-wedding',
  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
