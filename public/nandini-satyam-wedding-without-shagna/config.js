/* ─────────────────────────────────────────────────────────────
   weddingConfig — BRIDE-SIDE invitation of Nandini & Satyam without the 8 Dec engagement evening (client, 2026-10-25):
   a separate copy of public/nandini-satyam-wedding for guests not invited to the 8 Dec event — the
   original page is unchanged. Copy of the Anirudh & Sreya design
   (reference: public/hindu-south-wedding, unchanged). Client event text kept verbatim.
   The page (js/app.js) renders only from this object, so a new
   invitation is: copy the folder, edit this file, swap photos.
   Dates are ISO strings in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
export const weddingConfig = {
  groomName: 'Satyam',
  brideName: 'Nandini',
  brideFirst: true, // bride-side invitation: Nandini is written first everywhere
  tagline: ['Two hearts.', 'One journey.', 'Forever.'],
  invocation: 'Om Sri Ganeshaya Namaha',
  /* a blessing in the family's own script; set to null to hide. font = any Google Font that covers it */
  regional: { text: 'शुभ विवाह', meaning: 'Shubh Vivah', font: 'Noto Serif Devanagari', lang: 'hi' },
  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Nandini & Satyam · 12 December 2026, Ghaziabad',

  weddingDate: '2026-12-12T19:00:00+05:30',
  weddingEnd: '2026-12-12T23:00:00+05:30',
  weddingTimeLabel: '7 PM BARAT',
  ceremonyTitle: 'Pheras & Forever',
  ceremonyLine: 'Traditions in our hearts, forever in our promises.<br>“Saat phere, lakh khushiyan, te ik sohni jehi zindagi.”',
  muhurtham: '',

  venue: 'Vishnu Green Argan Hall',
  venueAddress: 'Plot No. 1250, G.T. Road, NH-91, Lal Kuan, Ghaziabad – 201009',
  venueCity: 'Ghaziabad',
  mapsUrl: 'https://share.google/uxsBfOmI0Gay2BkdC',
  venueImage: 'assets/venue-argan-hall.webp', // the hall front the client supplied

  welcome: {
    title: 'Welcome',
    lines: [
      'With the blessings of the Almighty',
      'and the love of our families,',
      'we joyfully invite you to be part of',
      'the most sacred day of our lives.',
    ],
  },

  story: null, // the demo story was fictional; add the couple's own if they send it

  families: {
    bride: {
      label: "Bride's Family",
      person: 'Nandini',
      relation: 'Daughter of',
      parents: ['Smt. Sheetal Dhall', 'Sh. Sanjeev Kumar Dhall'],
      grandparents: 'Granddaughter of Late Shree Radhey Shyam Dhall & Late Shrimati Darshana Rani Dhall',
    },
    groom: {
      label: "Groom's Family",
      person: 'Satyam',
      relation: 'Son of',
      parents: ['Sh. Gulveer Parashar', 'Smt. Sushma Sharma'],
      grandparents: 'Grandson of Smt. Ram Murti Devi & Late Sh. Krishan Prakash Parashar',
    },
  },

  familyOrder: ['bride', 'groom'], // bride-side invitation: bride's family first

  /* icon: vratham | nichayam | ring | haldi | mehendi | sangeet | muhurtham | forever | reception */
  /* client wording verbatim; details = [label, value] rows */
  events: [
    { icon: 'vratham', name: 'Shri Hanuman Ji Ka Aashirwad', date: '2026-11-28T16:00:00+05:30',
      subtitle: 'Sunderkand Paath & Bhajan Sandhya',
      lines: ['Jai Shri Ram, Jai Hanuman — har shubh kaarya mein Prabhu ka aashirwad.'],
      details: [['Time', '4:00 PM onwards']],
      note: 'The Paath will conclude with Bhog and Prasad at 7:00 PM.',
      venue: 'At our residence, Gagan Enclave, Amrit Nagar, Ghaziabad',
      maps: 'https://share.google/QvsvtZtR8V6GK4EKV' },
    { icon: 'mehendi', name: 'Mehndi Mela', date: '2026-12-11T19:00:00+05:30',
      subtitle: 'Drama, giggles and heena that refuses to dry',
      details: [['Time', '7 PM onwards']],
      venue: 'Clubhouse, Gagan Enclave, Amrit Nagar, Ghaziabad',
      maps: 'https://share.google/QvsvtZtR8V6GK4EKV' },
    { icon: 'haldi', name: 'The Haldi Hangover', date: '2026-12-12T09:00:00+05:30',
      lines: ['Oye Hoye! Saadi Dulhan Da Din Aa Gaya!', 'Choora chadhega, ghadoli sajegi,', 'Dhol vajjega te saari family nachhegi!', 'Thodi jehi rasam, bahut saari masti,'],
      details: [['Time', '9 AM morning']],
      venue: 'At our residence, B-15, Second Floor, Gagan Enclave, Amrit Nagar, Ghaziabad',
      maps: 'https://share.google/QvsvtZtR8V6GK4EKV' },
    { icon: 'forever', name: 'Pheras & Forever', date: '2026-12-12T19:00:00+05:30', main: true,
      subtitle: 'Traditions in our hearts, forever in our promises.',
      lines: ['“Saat phere, lakh khushiyan, te ik sohni jehi zindagi.”'],
      details: [['Time', '7 PM BARAT'], ['Dinner', '8 PM'], ['Dolli', 'TARRON KI CHAAON']],
      venue: 'Vishnu Green Argan Hall, Plot No. 1250, G.T. Road, NH-91, Lal Kuan, Ghaziabad – 201009',
      maps: 'https://share.google/uxsBfOmI0Gay2BkdC' },
  ],

  gallery: [], // demo photos were AI-made stand-ins; real couple photos go here

  /* no family number supplied: RSVP opens WhatsApp and the guest picks the contact;
     the demo's placeholder phone, e-mail, UPI and Hyderabad hotels are deliberately not carried over */
  rsvp: {
    deadline: '',
    whatsapp: '',
  },

  travelNote: 'All our venues, one tap from your maps',
  travel: [
    { icon: 'pin', title: 'Vishnu Green Argan Hall', text: 'Vishnu Green Argan Hall, Plot No. 1250, G.T. Road, NH-91, Lal Kuan, Ghaziabad – 201009', link: { label: 'Wedding map', href: 'https://share.google/uxsBfOmI0Gay2BkdC' } },
    { icon: 'pin', title: 'Gagan Enclave, Amrit Nagar', text: 'At our residence, B-15, Second Floor, Gagan Enclave, Amrit Nagar, Ghaziabad', link: { label: 'Open in Maps', href: 'https://share.google/QvsvtZtR8V6GK4EKV' } },
  ],

  contact: null,
  gifting: null,

  wishes: { prompt: 'Leave your blessings for the couple.' },

  thankYou: {
    title: 'Thank You',
    lines: ['For being a part of our special day.', 'Your love and blessings', 'mean the world to us.'],
    signoff: 'With love, Smt. Sheetal Dhall & Sh. Sanjeev Kumar Dhall',
  },

  creditCampaign: 'nandini-satyam-wedding-without-shagna',
  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
