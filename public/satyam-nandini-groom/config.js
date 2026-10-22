/* ─────────────────────────────────────────────────────────────
   weddingConfig — GROOM-SIDE invitation of Satyam & Nandini: the companion of the bride-side page
   (public/nandini-satyam-wedding, unchanged) — same design, groom's name and family first,
   the groom's family's own functions. Client event text kept verbatim (brief of 2026-10-21).
   The page (js/app.js) renders only from this object, so a new
   invitation is: copy the folder, edit this file, swap photos.
   Dates are ISO strings in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
export const weddingConfig = {
  groomName: 'Satyam',
  brideName: 'Nandini',
  brideFirst: false, // groom-side invitation: Satyam is written first everywhere
  tagline: ['Two hearts.', 'One journey.', 'Forever.'],
  invocation: 'Om Sri Ganeshaya Namaha',
  /* a blessing in the family's own script; set to null to hide. font = any Google Font that covers it */
  regional: { text: 'शुभ विवाह', meaning: 'Shubh Vivah', font: 'Noto Serif Devanagari', lang: 'hi' },
  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Satyam & Nandini · 12 December 2026, Ghaziabad',

  weddingDate: '2026-12-12T17:00:00+05:30', // Baraat departure — no separate wedding time was supplied
  weddingEnd: '2026-12-12T23:00:00+05:30',
  weddingTimeLabel: '',
  ceremonyTitle: 'The Wedding Day',
  ceremonyLine: 'A Celebration of Love &amp; Togetherness<br>With love, laughter, and the blessings of our families, we look forward to celebrating these beautiful moments with you!',
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

  familyOrder: ['groom', 'bride'], // groom-side invitation: groom's family first

  /* icon: vratham | nichayam | ring | haldi | mehendi | sangeet | muhurtham | forever | reception */
  /* client wording verbatim; details = [label, value] rows */
  events: [
    { icon: 'ring', name: 'Shagna Di Shaam', date: '2026-12-08T19:00:00+05:30',
      subtitle: 'Pyaar Ke Rang, Shagna Ke Sang',
      lines: ['Ek nayi kahaani ka aagaaz hai,', 'Apno ke saath khushiyon ka ehsaas hai.', 'Kuch naye rishte, kuch naye armaan,', 'Chehron par khushi, dilon mein muskaan.'],
      details: [['Time', '7:00 PM'], ['Dinner', '8:00 PM onwards']],
      venue: 'Velvet Leaf by Melrose Hotel, Marco Polo Road, Near Raj Nagar Extension, Uttar Pradesh – 201017',
      maps: 'https://share.google/A1SkFrTF34qgIxYrY' },
    { icon: 'gift', name: 'Bhanje Ka Bhaat, Mama Ke Thaat!', date: '2026-12-09T11:00:00+05:30',
      subtitle: 'Bhanje ki shaadi ka shagun, Mama ke pyaar aur thaat ke sang!',
      lines: ['Shagun bhi hoga, pyaar bhi hoga —', 'Kyunki bhaat hai bhanje ka,', 'Par thaat toh Mama ke hi honge!'],
      details: [['Time', '11:00 AM']],
      venue: 'Clubhouse, Gulmohar Greens, Mohan Nagar, Ghaziabad',
      maps: 'https://maps.app.goo.gl/TufEPGHjNfNmsN7a6?g_st=iw' },
    { icon: 'vratham', name: 'Sankat Mochan Sunderkand', date: '2026-12-09T16:00:00+05:30',
      subtitle: 'Bhakti, Shakti &amp; Bajrangbali’s Blessings',
      lines: ['With hearts full of devotion, we seek the divine blessings', 'of Bajrangbali for this auspicious new beginning.'],
      details: [['Time', '4:00 PM onwards'], ['Bhog &amp; Prasad', '7:00 PM']],
      venue: 'Clubhouse, Gulmohar Greens, Mohan Nagar, Ghaziabad',
      maps: 'https://maps.app.goo.gl/TufEPGHjNfNmsN7a6?g_st=iw' },
    { icon: 'lotus', name: 'Shubh Janeu Sanskar', date: '2026-12-10T10:00:00+05:30',
      lines: ['Gyaan ki raahon par badhein kadam,', 'Sanskaaron se roshan ho jeevan ka aangan.', 'Apno ki duaayein, badon ka aashirwad,', 'Khushiyon se saje yeh mangalmay avsar aaj.'],
      details: [['Time', '10:00 AM']],
      venue: '607-B, 6th Floor, Gulmohar Greens, Mohan Nagar, Ghaziabad',
      maps: 'https://maps.app.goo.gl/TufEPGHjNfNmsN7a6?g_st=iw' },
    { icon: 'haldi', name: 'Shubh Haldi Utsav', date: '2026-12-10T12:00:00+05:30',
      lines: ['Rasm-o-riwaaz aur khushiyon ki bahaar,', 'Haldi ke rang mein range rishton ka pyaar.'],
      details: [['Time', '12:00 PM']],
      venue: '607-B, Gulmohar Greens, Mohan Nagar, Ghaziabad',
      maps: 'https://maps.app.goo.gl/TufEPGHjNfNmsN7a6?g_st=iw' },
    { icon: 'mehendi', name: 'Ladle Ki Mehndi', date: '2026-12-11T19:00:00+05:30',
      subtitle: 'Rang Mehndi Ka, Mehfil Apno Ke Pyaar Ki',
      lines: ['Mehndi ke rangon se sajegi shaam,', 'Dhol ki thaap par goonjega laadle ka naam!'],
      details: [['Time', '7:00 PM']],
      venue: 'Velvet Leaf by Melrose Hotel, Marco Polo Road, Near Raj Nagar Extension, Uttar Pradesh – 201017',
      maps: 'https://maps.app.goo.gl/TufEPGHjNfNmsN7a6?g_st=iw' },
    { icon: 'sangeet', name: 'Band Baaja, Baraat', date: '2026-12-12T16:00:00+05:30',
      subtitle: 'Dhol Bajega, Ghodhi chadhega, Apna Laadka Dulha Banega!',
      lines: ['Band-baaje ki dhun, dhol ki pukaar,', 'Naachne ko taiyaar hai saara parivaar.', 'Hansi aur masti ki ho barsaat,', 'Aaiye, milkar sajaayein dulhe ki baraat!'],
      details: [['Ghudchadhi', '4:00 PM'], ['Baraat Departure', '5:00 PM']],
      venue: 'Our Residence, 607-B, Gulmohar Greens, Mohan Nagar, Ghaziabad',
      maps: 'https://maps.app.goo.gl/TufEPGHjNfNmsN7a6?g_st=iw' },
    { icon: 'forever', name: 'The Wedding Day', date: '2026-12-12T17:00:00+05:30', main: true,
      subtitle: 'A Celebration of Love &amp; Togetherness',
      note: 'With love, laughter, and the blessings of our families, we look forward to celebrating these beautiful moments with you!',
      venue: 'Vishnu Green Argan Hall, Plot No. 1250, G.T. Road, NH-91, Lal Kuan, Ghaziabad – 201009',
      maps: 'https://share.google/uxsBfOmI0Gay2BkdC' },
  ],

  gallery: [], // demo photos were AI-made stand-ins; real couple photos go here

  /* no family number supplied: RSVP opens WhatsApp and the guest picks the contact;
     the demo's placeholder phone, e-mail, UPI and Hyderabad hotels are deliberately not carried over */
  rsvp: {
    deadline: '',
    whatsapp: '',
    phones: ['9818506120', '9990171308'], // shown in the RSVP section, tap to call (client, 2026-10-22)
  },

  travelNote: 'All our venues, one tap from your maps',
  travel: [
    { icon: 'pin', title: 'Vishnu Green Argan Hall', text: 'The Wedding Day · Plot No. 1250, G.T. Road, NH-91, Lal Kuan, Ghaziabad – 201009', link: { label: 'Wedding map', href: 'https://share.google/uxsBfOmI0Gay2BkdC' } },
    { icon: 'pin', title: 'Velvet Leaf by Melrose Hotel', text: 'Shagna Di Shaam · Marco Polo Road, Near Raj Nagar Extension, Uttar Pradesh – 201017', link: { label: 'Open in Maps', href: 'https://share.google/A1SkFrTF34qgIxYrY' } },
    { icon: 'pin', title: 'Gulmohar Greens, Mohan Nagar', text: 'Bhaat, Sunderkand, Janeu Sanskar, Haldi, Mehndi &amp; Baraat · Ghaziabad', link: { label: 'Open in Maps', href: 'https://maps.app.goo.gl/TufEPGHjNfNmsN7a6?g_st=iw' } },
  ],

  contact: null,
  gifting: null,

  wishes: { prompt: 'Leave your blessings for the couple.' },

  thankYou: {
    title: 'Thank You',
    lines: ['For being a part of our special day.', 'Your love and blessings', 'mean the world to us.'],
    signoff: 'Smt. Ram Murti Devi<br>Smt. Sushma Sharma<br>Sh. Gulveer Parashar<br>Sh. Shivam Parashar', // client's order, 2026-10-22
  },

  creditCampaign: 'satyam-nandini-groom',
  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
