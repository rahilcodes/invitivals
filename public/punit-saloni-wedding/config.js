/* ─────────────────────────────────────────────────────────────
   weddingConfig — CA Punit (Shubham) & Dr. Saloni, Kota, 10–14 December 2026 (client brief 2026-11-21).
   A separate invitation on the Nandini & Satyam design (public/nandini-satyam-wedding is the reference
   and is never edited for this page). The page (js/app.js) renders only from this object;
   after a change run  node tools/punit-saloni-wedding.mjs  (it rewrites the .ics files from it).
   Dates are ISO strings in India time (+05:30). Every name, date, time and venue is the client's.
   ───────────────────────────────────────────────────────────── */
const RESIDENCE = {
  name: 'At Our Residence',
  maps: 'https://maps.app.goo.gl/GVUtrttTHw3wPqpW8?g_st=aw',
  button: 'View Residence Location',
};
const RESORT = {
  name: 'Tulsi Resort, Baran Road, Kota',
  maps: 'https://maps.app.goo.gl/tkwgdkJu5rKo2pvy5?g_st=aw',
  button: 'View Venue on Google Maps',
};
const at = (d, t) => `2026-12-${d}T${t}:00+05:30`;

export const weddingConfig = {
  slug: 'punit-saloni-wedding',
  groomName: 'Punit',
  brideName: 'Saloni',
  brideFirst: false,
  /* how the names are written in full: the title before, the name the family uses after */
  groomFull: { pre: 'CA', name: 'Punit', alias: 'Shubham' },
  brideFull: { pre: 'Dr.', name: 'Saloni', alias: '' },
  fullPair: 'CA Punit (Shubham) & Dr. Saloni',
  tagline: ['Two hearts.', 'One journey.', 'Forever.'],
  invocation: 'Om Sri Ganeshaya Namaha',
  regional: { text: 'शुभ विवाह', meaning: 'Shubh Vivah', font: 'Noto Serif Devanagari', lang: 'hi' },
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of CA Punit (Shubham) & Dr. Saloni · 14 December 2026, Kota',

  /* the wedding: Panigrahan Sanskar (Phere), Monday 14 December 2026, 12:00 Noon. The countdown runs to it. */
  weddingDate: at(14, '12:00'),
  weddingTimeLabel: '12:00 Noon',
  ceremonyTitle: 'Panigrahan Sanskar',
  muhurtham: '',

  venue: 'Tulsi Resort',
  venueAddress: 'Baran Road, Kota',
  venueCity: 'Kota',
  mapsUrl: RESORT.maps,
  venues: [RESIDENCE, RESORT],

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
      person: 'CA Punit',
      initial: 'P',
      note: '(Shubham)',
      relation: 'Son of',
      parents: ['Mr. Amar Nath Singhal', '& Mrs. Vimla, Kota'],
      grandparents: 'Grandson of Late Shri Rambabu & Late Smt. Premvati',
    },
    bride: {
      label: "Bride's Family",
      person: 'Dr. Saloni',
      initial: 'S',
      relation: 'Daughter of',
      parents: ['Mr. Banwari Ji Vijay', '& Mrs. Reena', 'Vijay Fatehpur Wale, Kota'],
      grandparents: 'Granddaughter of Late Shri Bherulal Ji & Late Smt. Kalyani Bai',
    },
  },
  familyOrder: ['groom', 'bride'],

  /* the client's schedule, in order. time = as printed; hours = the length used for calendar entries only
     (the invitation gives start times; the end is an estimate and says so in the entry) */
  events: [
    { icon: 'vratham', name: 'Vinayak Sthapna', date: at(10, '11:00'), time: '11:00 AM', hours: 2, place: RESIDENCE },
    { icon: 'haldi', name: 'Tel Maangal', date: at(11, '11:00'), time: '11:00 AM', hours: 2, place: RESIDENCE },
    { icon: 'nichayam', name: 'Parojan', date: at(12, '09:00'), time: '09:00 AM', hours: 2, place: RESIDENCE },
    { icon: 'meet', name: 'Baasan', date: at(12, '12:00'), time: '12:00 Noon', hours: 2, place: RESIDENCE },
    { icon: 'mehendi', name: 'Mehendi', date: at(12, '15:00'), time: '03:00 PM', hours: 3, place: RESIDENCE },
    { icon: 'haldi', name: 'Haldi', date: at(13, '09:00'), time: '09:00 AM', hours: 2, place: RESORT },
    { icon: 'nichayam', name: 'Bhaat Parojan', date: at(13, '12:00'), time: '12:00 Noon', hours: 2, place: RESORT },
    { icon: 'ring', name: 'Sagai', date: at(13, '14:00'), time: '02:00 PM', hours: 2, place: RESORT },
    { icon: 'sangeet', name: 'Ladies Sangeet', date: at(13, '19:00'), time: '07:00 PM onwards', note: 'Followed by Dinner', hours: 3, place: RESORT },
    { icon: 'love', name: 'Baraat', subtitle: '(Procession)', date: at(14, '09:00'), time: '09:00 AM', hours: 3, place: RESORT },
    { icon: 'forever', name: 'Panigrahan Sanskar', subtitle: '(Phere)', date: at(14, '12:00'), time: '12:00 Noon', hours: 3, place: RESORT, main: true },
    { icon: 'reception', name: 'Reception & Dinner', date: at(14, '19:00'), time: '07:00 PM onwards', hours: 3, place: RESORT },
  ],

  gallery: [], // the couple's photographs go here once they arrive

  rsvp: {
    whatsapp: '919461308655',
    display: '+91 94613 08655',
  },

  wishes: { prompt: 'Leave your blessings for the couple.' },

  thankYou: {
    title: 'Thank You',
    lines: ['For being a part of our special day.', 'Your love and blessings', 'mean the world to us.'],
    signoff: 'With love, both families',
  },

  creditCampaign: 'punit-saloni-wedding',
  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
