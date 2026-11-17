/* ─────────────────────────────────────────────────────────────
   weddingConfig — Gun & Vivek, the wedding (client, 2026-11-16).
   A separate copy of the design the client chose, public/nandini-satyam-wedding-without-shagna (never edited for this).
   The page (js/app.js) renders only from this object. Every name, date and line is exactly as the family wrote it;
   nothing they did not supply is shown (no Doli time, no RSVP, no travel cards, no wishes).
   Dates are ISO strings in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
const VENUE = 'The Vivann Banquet – Platinum Hall';
const ADDRESS = '25 Plot No., CBD Ground, Opposite Park Plaza Hotel.';
const MAP = 'https://maps.app.goo.gl/wumRYK2xQ54nxPma9?g_st=iw';   // the family's own link, exactly as supplied

export const weddingConfig = {
  groomName: 'Vivek',
  brideName: 'Gun',
  brideFirst: true, // "Gun Weds Vivek": the bride is written first everywhere
  tagline: ['Together Forever'],
  /* the three blessings over the names, as the family wrote them */
  blessings: ['॥ Jai Kalka Maa ॥', '॥ Jai baba mohan ram ॥', '॥ Jai baba shyamgiri ॥'],   // corrected by the client, 2026-11-17: spelling and capitals exactly as typed
  invocation: null,
  regional: null,
  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Gun & Vivek · 4 December 2026',

  /* the wedding evening: the Reception of Barat at 6:00 PM; the countdown runs to it */
  weddingDate: '2026-12-04T18:00:00+05:30',
  weddingEnd: null,                       // not supplied: Save the Date's calendar entry runs three hours from 6:00 PM
  weddingTimeLabel: '6:00 PM',                      // the hero's line: Friday · 6:00 PM
  ceremonyTimeLabel: 'Reception of Barat · 6:00 PM', // the ceremony card's line
  ceremonyTitle: 'The Wedding',
  ceremonyLine: 'Your presence and blessings will make our celebration complete.',
  muhurtham: '',

  venue: VENUE,
  venueAddress: ADDRESS,
  venueCity: 'CBD Ground',
  heroPlace: 'THE VIVANN',                // the cover's place line (client, 2026-11-17); the ceremony card keeps the venue and CBD Ground
  mapsUrl: MAP,
  venueImage: 'assets/venue-vivann-platinum.webp', // the family's own picture of Vivann Platinum, only resized

  welcome: {
    title: 'Wedding Invitation',
    lines: [
      'With the blessings of the Almighty',
      'and the love of our families,',
      'we joyfully invite you to celebrate',
      'the wedding of',
    ],
  },

  story: null,

  familiesHeading: ['Our Families', 'With the blessings of our elders'],
  families: {
    bride: {
      label: 'The Bride',
      person: 'Gun',
      relation: 'Daughter of',
      parents: ['Smt. Shashi Devi &', 'Ch. Rupesh Singh Dedhia'],
      familyName: 'Dedha',                 // the family name under the bride's parents (client, 2026-11-17)
    },
    groom: {
      label: 'The Groom',
      person: 'Vivek',
      relation: 'Son of',
      parents: ['Smt. Savita &', 'Ch. Satish Rexwal'],
    },
  },
  familyOrder: ['bride', 'groom'],
  /* the family elders, named after both families: only these two names (client, 2026-11-17: no ladies' names) */
  elders: {
    title: 'Family Elders',
    lines: ['Late Ch. Gyanchand Nambardar', 'Late Ch. Mahavir Singh Nambardar'],
  },

  eventsHeading: 'Wedding Celebrations',
  /* icon: vratham | nichayam | ring | haldi | mehendi | sangeet | muhurtham | forever | reception
     noCal: no "Remind me" — the Doli has no time, and none is invented */
  events: [
    { icon: 'forever', name: 'Reception of Barat', date: '2026-12-04T18:00:00+05:30', main: true,
      details: [['Time', '6:00 PM']], venue: `${VENUE}, ${ADDRESS}`, maps: MAP },
    { icon: 'reception', name: 'Dinner', date: '2026-12-04T19:00:00+05:30',
      details: [['Time', '7:00 PM']], venue: `${VENUE}, ${ADDRESS}`, maps: MAP },
    { icon: 'muhurtham', name: 'Doli', date: '2026-12-05T00:00:00+05:30', subtitle: 'Taaron Ki Chhaon Mein', noCal: true },
  ],

  gallery: [],
  rsvp: null,
  travel: [],
  contact: null,
  gifting: null,
  wishes: null,

  thankYou: {
    title: 'Thank You',
    lines: ['For being a part of our special day.', 'Your love and blessings', 'mean the world to us.'],
    signoff: 'With Love,<br>Dedha Family',
  },

  creditCampaign: 'gun-vivek-wedding',
  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
