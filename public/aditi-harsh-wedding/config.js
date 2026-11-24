/* ─────────────────────────────────────────────────────────────
   weddingConfig — Aditi & Harsh, a Gujarati wedding, 11 & 12 January 2027 (client brief 2026-11-18).
   Design: the client chose public/nandini-satyam-wedding (never edited for this); this folder is a separate copy
   of that design (made from the pooja-deepak-wedding copy, which carries the Ganesh shloka on the opening doors
   and the mobile hero fixes).
   The page (js/app.js) renders only from this object. Every name, date and time is exactly as the client wrote
   it; nothing they did not supply is shown: no event descriptions, no dress codes, no end times, no RSVP.
   Dates are ISO strings in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
/* the one venue of all five functions. The name and road are what the client's own map link opens
   (Google: "KRUSHNAKUNJ MANDAPAM · Bhavnagar - Sidsar Rd · Shampara, Gujarat") and what the gate in their picture says. */
const VENUE = 'Krushnakunj Mandapam';
const MAP = 'https://maps.app.goo.gl/zSDqWw7sZbBe4Fyb9?g_st=iw';   // the client's corrected link (20 Nov), exactly as supplied
const at = (d, t) => `2027-01-${d}T${t}:00+05:30`;

export const weddingConfig = {
  groomName: 'Harsh',
  brideName: 'Aditi',
  brideFirst: true, // the client writes "Aditi & Harsh": Aditi first everywhere
  tagline: ['Two hearts.', 'One journey.', 'Forever.'],
  invocation: 'Shri Ganeshaya Namah',
  /* Ganpati at the beginning, in the family's own script (Gujarati). font = a Google Font that covers it */
  regional: { text: '॥ શ્રી ગણેશાય નમઃ ॥', meaning: 'Shri Ganeshaya Namah', font: 'Noto Serif Gujarati', lang: 'gu' },
  /* the Ganesh Vandana on the closed doors of the opening slide (js/sections/intro.js), in Hindi (Devanagari), the client's exact text (20 Nov) */
  introShloka: { lines: ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥'], font: 'Noto Serif Devanagari', lang: 'sa' },
  /* Ganpati over the names on the first page (the seated Ganesha of the Invitivals art library) */
  ganeshImage: 'assets/ganesha.webp',
  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'With love and blessings, we invite you to celebrate the wedding festivities of Aditi & Harsh · 11 & 12 January 2027',

  /* the wedding: Hast Melap, Tuesday 12 January 2027, 6:30 PM. The countdown runs to it. */
  weddingDate: at(12, '18:30'),
  weddingEnd: '',                 // no end time was supplied: calendar entries carry the start only
  weddingTimeLabel: '6:30 PM',
  ceremonyTitle: 'Hast Melap',
  ceremonyLine: 'Your presence will make our celebration complete.',
  muhurtham: '',
  weddingIcs: 'hast-melap.ics',

  venue: VENUE,
  venueAddress: 'Bhavnagar – Sidsar Road, Shampara, Gujarat',
  venueCity: 'Shampara, Gujarat',
  heroPlace: VENUE,
  venueNote: 'All our functions will be held here',
  mapsUrl: MAP,
  venueImage: 'assets/venue-krushnakunj-mandapam.webp', // the client's own picture of the venue, whole, only re-encoded

  welcome: {
    title: 'Welcome',
    /* the client's wording: "TO THE CELEBRATION OF LOVE" under Welcome (2026-11-24, replacing "to our wedding
       celebration"; the separate greeting line is removed), then the invitation, which runs on into "Aditi weds Harsh" */
    eyebrow: 'to the celebration of love',
    greeting: '',
    lines: ['With the love and blessings of Lord Ganesha,', 'we invite you to celebrate', 'the wedding festivities of'],
  },

  /* Our Story, the client's own words (2026-11-23). `image` is the couple's own photograph, supplied 2026-11-24 and
     used as it is (only resized), in the arch frame at its own 2:3 proportions */
  story: {
    intro: '',
    image: 'assets/story-couple.webp',
    chapters: [
      { icon: 'love', title: 'We fell in love', when: '2014', text: 'From school corridors to college campus, our story slowly unfolded. We grew together, navigating life’s many chapters hand in hand.' },
      { icon: 'forever', title: 'Now we begin forever', when: '2027', text: 'Twelve years, countless milestones and one big decision; to do life together. A journey of friendship, love and togetherness now begins a new chapter.' },
    ],
  },

  families: {
    bride: {
      label: "Bride's Family",
      person: 'Aditi',
      relation: 'Daughter of',
      parents: ['Smt Shila Chauhan &', 'Sh Harshal Chauhan'],
      grandRelation: 'Granddaughter of',
      grandparents: ['Late Vrajlal Chauhan &', 'Late Nirmalaben Chauhan'],
    },
    groom: {
      label: "Groom's Family",
      person: 'Harsh',
      relation: 'Son of',
      parents: ['Smt Hiraben Desai &', 'Sh Bhagvanbhai Desai'],
      grandRelation: 'Grandson of',
      grandparents: ['Late Kalubhai Desai &', 'Late Gauriben Desai'],
    },
  },
  familyOrder: ['bride', 'groom'],

  /* exactly five functions on two days: name, date and time only (the client wants no descriptions and no venue
     under each one; the venue has its own section). icon: haldi | sangeet | vratham | forever | muhurtham …
     ics: the Apple / Outlook calendar file of the function (written by tools/aditi-harsh-wedding.mjs) */
  eventsHeading: 'Wedding Festivities',
  eventsSub: '11 &amp; 12 January 2027',
  events: [
    { icon: 'haldi', name: 'Haldi Affair', date: at(11, '14:00'), time: '2:00 PM', ics: 'haldi-affair.ics' },
    { icon: 'sangeet', name: 'Sangeet & Garba', date: at(11, '19:00'), time: '7:00 PM', ics: 'sangeet-garba.ics' },
    { icon: 'vratham', name: 'Ganesh Sthapan', date: at(12, '08:30'), time: '8:30 AM', ics: 'ganesh-sthapan.ics' },
    { icon: 'forever', name: 'Baarat', date: at(12, '16:00'), time: '4:00 PM', ics: 'baarat.ics' },
    { icon: 'muhurtham', name: 'Hast Melap', date: at(12, '18:30'), time: '6:30 PM', ics: 'hast-melap.ics', main: true },
  ],

  gallery: [],
  rsvp: null,
  travel: [],
  contact: null,
  gifting: null,

  /* Send Wishes opens a WhatsApp chat with the client's UK number +44 7442 087724 (changed 2026-11-23; it was the
     bride's Indian number). The number itself is not printed anywhere. It is the page's only WhatsApp link. */
  wishes: { prompt: 'Leave your blessings for the couple.', whatsapp: '447442087724' },

  /* the final message, exactly as the client wrote it */
  thankYou: {
    title: 'Thank You',
    lines: ['Thank you for being part of this beautiful journey.', 'Your love and presence mean the world to us.'],   // one thank-you only (client, 2026-11-24)
    signoff: '',
  },

  creditCampaign: 'aditi-harsh-wedding',
  music: 'assets/audio/aditi-harsh.mp3',   // the client's own song (2026-11-18)
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
