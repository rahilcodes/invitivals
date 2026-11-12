/* ─────────────────────────────────────────────────────────────
   weddingConfig — Deepak & Pooja, the GROOM-SIDE invitation (client, 2026-11-03): a copy of
   public/pooja-deepak-wedding (the bride side, live and unchanged) with Deepak and the Lalwani family first,
   ।। श्री गणेशाय नमः ।। over the names, no Haldi, no "Wedding Festivities" heading, firmer event and family text.
   Wedding details as on the bride side: 29 November 2026, R.S Farm Banquet, Noida (client brief 2026-10-28).
   Design: the client chose public/nandini-satyam-wedding-without-shagna (unchanged); this is a copy of that
   design with the mobile hero fixes made for public/varun-diksha-wedding.
   The page (js/app.js) renders only from this object, so a new
   invitation is: copy the folder, edit this file, swap photos.
   Dates are ISO strings in India time (+05:30).
   Only what the client supplied is used: no Haldi venue name (its map link only),
   no grandparents, no ceremony time beyond "7:15 PM onwards · Dinner".
   ───────────────────────────────────────────────────────────── */
export const weddingConfig = {
  groomName: 'Deepak',
  brideName: 'Pooja',
  brideFirst: false, // groom side: "Deepak & Pooja", Deepak first everywhere
  tagline: ['Two hearts.', 'One journey.', 'Forever.'],
  invocation: 'Om Sri Ganeshaya Namaha',
  /* a blessing in the family's own script; set to null to hide. font = any Google Font that covers it */
  regional: { text: '।। श्री गणेशाय नमः ।।', meaning: 'Shri Ganeshaya Namah', font: 'Noto Serif Devanagari', lang: 'sa' }, // client, 2026-11-03, exactly as sent
  /* the client's shloka, on the closed doors of the opening slide only (js/sections/intro.js), wording exactly as sent */
  introShloka: { lines: ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥'], font: 'Noto Serif Devanagari', lang: 'sa' },
  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Deepak & Pooja · 29 November 2026, Noida',

  weddingDate: '2026-11-29T19:15:00+05:30',
  weddingEnd: '',
  weddingTimeLabel: '7:15 PM onwards',
  ceremonyTitle: 'Wedding Celebration',
  ceremonyLine: 'Your presence will make our celebration complete.<br>Please join us for the wedding and dinner.',
  muhurtham: '',

  venue: 'R.S Farm Banquet',
  venueAddress: 'Near Parthala Bridge, Sector 121, Noida, Uttar Pradesh 201307',
  venueCity: 'Noida',
  mapsUrl: 'https://share.google/wCmAaZipCqtWKXlEY',
  venueImage: 'assets/venue-rs-farm-mandap.webp', // the client's RS Farm image (2026-10-30), replacing the aisle photo
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
      parents: ['Mrs Meena Lalwani', 'Shri Ramesh Lalwani'], // "Shri" (client, 2026-11-03)
    },
  },

  familyOrder: ['groom', 'bride'],

  /* icon: vratham | nichayam | ring | haldi | mehendi | sangeet | muhurtham | forever | reception */
  events: [
    /* no Haldi on the groom side (client, 2026-11-03) */
    { icon: 'forever', name: 'Wedding Celebration', date: '2026-11-29T19:15:00+05:30', main: true,
      details: [['Time', '7:15 PM onwards · Dinner']],
      venue: 'R.S Farm Banquet, Near Parthala Bridge, Sector 121, Noida, Uttar Pradesh 201307',
      maps: 'https://share.google/wCmAaZipCqtWKXlEY' },
  ],

  /* the client's own pictures (tools/pooja-deepak-art.mjs), each shown whole */
  /* the client's couple illustration in Moments, as on the bride side (restored at the client's request, 2026-11-03) */
  gallery: [
    { src: 'assets/gallery-pd-couple.webp', alt: 'Deepak and Pooja in each other’s arms beneath a floral arch, she in a blush-pink gown and he in a navy suit', shape: 'portrait' },
  ],

  rsvp: null, // section removed at the client's request (2026-10-30)

  travelNote: 'The venue, one tap from your maps',
  travel: [
    { icon: 'pin', title: 'R.S Farm Banquet', text: 'R.S Farm Banquet, Near Parthala Bridge, Sector 121, Noida, Uttar Pradesh 201307 · Wedding Celebration', link: { label: 'Wedding map', href: 'https://share.google/wCmAaZipCqtWKXlEY' } },
  ],

  contact: null,
  gifting: null,

  wishes: { prompt: 'Leave your blessings for the couple.', whatsapp: '919004646130' }, // Send Wishes opens the bride's WhatsApp (+91 90046 46130), the guest sends it

  thankYou: {
    title: 'Thank You',
    lines: ['For being a part of our special day.', 'Your love and blessings', 'mean the world to us.'],
    signoff: 'With love and blessings,<br>the Lalwani family',
  },

  creditCampaign: 'deepak-pooja-wedding',
  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
