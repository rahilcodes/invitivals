/* ─────────────────────────────────────────────────────────────
   Vaishnavi & Harishwar Reddy — wedding invitation (client, 2026-11-12).
   A separate copy of the hindu-south-wedding demo: everything the family
   would change lives here; the page (js/app.js) renders only from this object.
   Dates are ISO strings in India time (+05:30).

   The client did not want Our Story, Our Moments, Getting There, Need Help or
   Gifting: those sections (and their menu links, modules and photos) are gone
   from this copy, not hidden.
   Everything below is exactly as the client wrote it. Nothing they did not
   supply is shown: no tagline, no muhurtham line, no event descriptions or
   dress codes, no RSVP deadline.
   ───────────────────────────────────────────────────────────── */
const WEDDING_MAP = 'https://maps.app.goo.gl/TfF4wG2QPkEMxsNW8';

export const weddingConfig = {
  groomName: 'Harishwar Reddy',
  brideName: 'Vaishnavi',
  /* the cover, the monogram and every title put the bride first, as the client's first screen does */
  tagline: [],
  invocation: null,
  /* the blessing over the names on the cover; font = any Google Font that covers it */
  regional: { text: 'శుభమస్తు!', meaning: 'Shubhamastu', font: 'Noto Serif Telugu' },
  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Vaishnavi & Harishwar Reddy · 3 December 2026',

  weddingDate: '2026-12-03T10:15:00+05:30',
  weddingEnd: null,                      // not supplied: a calendar entry runs three hours from the start
  weddingTimeLabel: '10:15 AM',
  muhurtham: null,                       // not supplied

  venue: 'Y.S.R. Convention',
  venueAddress: 'Beside Bharat Petrol Pump, ORR Exit 12, Sagar Road, Bongloor, Ibrahimpatnam.',
  venueCity: 'Bongloor, Ibrahimpatnam',
  mapsUrl: WEDDING_MAP,
  venueImage: 'assets/venue-ysr.webp',          // the family's own photograph of YSR Conventions (2026-11-13)
  venueImageAlt: 'YSR Conventions, lit up in the evening',

  /* the invitation, in the families' words */
  welcome: {
    title: 'Wedding Invitation',
    hosts: 'Sri Harishwar Reddy & Smt. Vaishnavi',
    lines: [
      'Cordially invite you and your family',
      'to join them in celebrating their wedding',
      'and bless the couple on their special day.',
    ],
  },

  families: {
    bride: {
      label: "Bride's Family",
      person: 'Vaishnavi',
      relation: 'Daughter of',
      parents: ['Sri Manne Krishna Reddy', 'Smt. Manne Manjula'],
    },
    groom: {
      label: "Groom's Family",
      person: 'Harishwar Reddy',
      relation: 'Son of',
      parents: ['Sri Challa Sanjeeva Reddy', 'Smt. Challa Sarala'],
    },
  },

  /* icon: vratham | nichayam | haldi | mehendi | sangeet | muhurtham | reception
     maps: the exact Google Maps link the family supplied for that venue — never a search */
  events: [
    { icon: 'haldi', name: 'Pellikuthuru', sub: 'Bride’s Ceremony', date: '2026-11-30T10:00:00+05:30', time: '10:00 AM',
      venue: 'Plot No. 61, Road No. 1, R. Ranga Raju Colony, Turkayamjal, Brahmanpally Road.',
      maps: 'https://maps.app.goo.gl/Bki9Vce6XxJDiKo3A' },
    { icon: 'vratham', name: 'Pellikoduku', sub: 'Groom’s Ceremony', date: '2026-12-02T16:00:00+05:30', time: '4:00 PM',
      venue: '19-5-82/6/17/C/1, N.M. Guda, Attapur, Hyderabad.',
      maps: 'https://maps.app.goo.gl/zrpXg7EmEqaJvBtL9' },
    { icon: 'muhurtham', name: 'Wedding Ceremony', date: '2026-12-03T10:15:00+05:30', time: '10:15 AM', main: true,
      venue: 'Y.S.R. Convention, Beside Bharat Petrol Pump, ORR Exit 12, Sagar Road, Bongloor, Ibrahimpatnam.',
      maps: WEDDING_MAP },
    { icon: 'reception', name: 'Wedding Reception', date: '2026-12-04T19:00:00+05:30', time: '7:00 PM',
      venue: 'Varahi Farm House, Poshettyguda Village, Shamshabad.',
      maps: 'https://maps.app.goo.gl/iock2XPHctgD1s8s8' },
  ],

  /* RSVP and wishes are written for the guest and opened in WhatsApp, addressed to the bride (+91 6281830575,
     client 2026-11-13). The number is country code first, digits only, no "+". WhatsApp opens with the message
     ready; the guest still presses Send there. */
  rsvp: { deadline: '', whatsapp: '916281830575' },
  contact: { whatsapp: '916281830575' },

  wishes: { prompt: 'Leave your blessings for the couple.' },

  /* the closing, in the families' words */
  thankYou: {
    regional: 'మీ రాకతో మా వేడుక మరింత ఆనందమయం అవుతుంది.',
    lines: ['Your presence and blessings will make', 'our celebrations even more special.'],
    signoff: ['With Best Wishes,', 'The Manne & Challa Families'],
  },

  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
