/* ─────────────────────────────────────────────────────────────
   weddingConfig — Lokesh & Akansha, 25–26 November 2026, Panipat (groom-side brief PDF, 2026-11-02).
   Design: a copy of public/pooja-deepak-wedding (the Nandini & Satyam design with the mobile hero fixes).
   The page (js/app.js) renders only from this object.
   Groom side: Lokesh and his family come first everywhere (client, 2026-11-02).
   Dates are ISO strings in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
const COSMOS = 'COSMOS Cafe & Lounge, Sector 25, Panipat, Haryana';
const COSMOS_MAP = 'https://share.google/pOU3fFbjNnsn068Wq';
const PALM = 'Palm Luxuria Banquets, Bal Vikas Progressive School Road, Shodapur, Panipat';
const PALM_MAP = 'https://share.google/MfaBFtqryZA8yG071';

export const weddingConfig = {
  groomName: 'Lokesh',
  brideName: 'Akansha',
  brideFirst: false, // groom side: "Lokesh & Akansha"
  tagline: ['Two hearts.', 'One journey.', 'Forever.'],
  invocation: 'Om Sri Ganeshaya Namaha',
  /* a blessing in the family's own script; set to null to hide. font = any Google Font that covers it */
  regional: { text: '।। श्री गणेशाय नमः ।।', meaning: 'Shri Ganeshaya Namah', font: 'Noto Serif Devanagari', lang: 'sa' }, // client, 2026-11-02, exactly as sent
  introShloka: null,
  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Lokesh & Akansha · 26 November 2026, Panipat',

  weddingDate: '2026-11-26T15:00:00+05:30', // Feras at 03:00 PM (client, 2026-11-04; was the Wedding Ceremony at 12:00 PM)
  weddingEnd: '',
  weddingTimeLabel: '03:00 PM',
  ceremonyTitle: 'Feras',
  ceremonyLine: 'Your presence will make our celebration complete.<br>Please join us as Lokesh and Akansha take the seven sacred steps.',
  muhurtham: '',

  venue: 'Palm Luxuria Banquets',
  venueAddress: 'Bal Vikas Progressive School Road, Shodapur, Panipat',
  venueCity: 'Panipat',
  mapsUrl: PALM_MAP,
  venueImage: 'assets/venue-palm-luxuria.webp', // the client's Palm Luxuria picture (2026-11-02), in place of the kolam-and-pin seal
  coupleImage: 'assets/couple.webp', // the client's couple seen from behind (2026-11-02), cut off its white by tools/akansha-lokesh-couple.mjs

  welcome: {
    title: 'Welcome',
    lines: [
      'With the blessings of the Almighty and our elders,',
      'the loving families of the groom and bride',
      'cordially invite you and your family',
      'to celebrate the wedding of Lokesh and Akansha.',
    ],
  },

  story: null,

  families: {
    groom: {
      label: "Groom's Family",
      person: 'Lokesh',
      relation: 'Beloved son of',
      parents: ['Manju and Ramdass'], // mother first (client, 2026-11-04)
      grandparents: 'Grandson of Late Smt. Shakuntala Devi<br>and Late Shree Girraj Prasad', // grandmother first
    },
    bride: {
      label: "Bride's Family",
      person: 'Akansha',
      relation: 'Daughter of',
      parents: ['Usha and Chandrashekhar'],
      grandparents: 'Granddaughter of Late Smt. Kevla Devi<br>and Shree Ramprayag', // Ramprayag (client, 2026-11-04)
    },
  },

  familyOrder: ['groom', 'bride'],

  /* icon: vratham | nichayam | ring | haldi | mehendi | sangeet | muhurtham | forever | reception | kalasha */
  events: [
    { icon: 'haldi', name: 'Haldi Ceremony', date: '2026-11-25T10:00:00+05:30', subtitle: 'Pre-wedding celebrations',
      details: [['Time', '10:00 AM']], venue: COSMOS, maps: COSMOS_MAP },
    { icon: 'mehendi', name: 'Mehndi & Sangeet', date: '2026-11-25T16:00:00+05:30', subtitle: 'Pre-wedding celebrations',
      details: [['Time', '4:00 PM']], venue: COSMOS, maps: COSMOS_MAP },
    { icon: 'kalasha', name: 'Ghudhchadhi', date: '2026-11-26T09:00:00+05:30', subtitle: 'Wedding day',
      details: [['Time', '9:00 AM']], venue: PALM, maps: PALM_MAP },
    { icon: 'sangeet', name: 'Baraat', date: '2026-11-26T11:00:00+05:30', subtitle: 'Wedding day',
      details: [['Time', '11:00 AM']], venue: PALM, maps: PALM_MAP },
    { icon: 'forever', name: 'Feras', date: '2026-11-26T15:00:00+05:30', main: true, subtitle: 'Wedding day',
      details: [['Time', '03:00 PM']], venue: PALM, maps: PALM_MAP },
  ],

  gallery: [],

  /* RSVP and Send Wishes both open WhatsApp to +91 95355 88856 (client, 2026-11-02); the guest sends it */
  rsvp: { whatsapp: '919535588856', deadline: '' },

  travelNote: 'Both our venues, one tap from your maps',
  travel: [
    { icon: 'pin', title: 'Palm Luxuria Banquets', text: `${PALM} · Ghudhchadhi, Baraat & Feras, Thursday 26 November`, link: { label: 'Palm Luxuria map', href: PALM_MAP } },
    { icon: 'pin', title: 'COSMOS Cafe & Lounge', text: `${COSMOS} · Haldi, Mehndi & Sangeet, Wednesday 25 November`, link: { label: 'Cosmos map', href: COSMOS_MAP } },
  ],

  contact: null,
  gifting: null,

  wishes: { prompt: 'Leave your blessings for Lokesh & Akansha.', whatsapp: '919535588856' },

  thankYou: {
    title: 'Thank You',
    lines: ['Your gracious presence and blessings', 'will make these joyous occasions', 'truly memorable.'],
    signoff: 'With love and warm regards,<br>the loving families of the groom and bride',
  },

  creditCampaign: 'akansha-lokesh-wedding',
  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
