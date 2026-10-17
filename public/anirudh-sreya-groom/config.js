/* ─────────────────────────────────────────────────────────────
   weddingConfig — GROOM-SIDE copy of the Anirudh & Sreya invitation
   (reference: public/hindu-south-wedding, unchanged). Client event text kept verbatim.
   The page (js/app.js) renders only from this object, so a new
   invitation is: copy the folder, edit this file, swap photos.
   Dates are ISO strings in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
export const weddingConfig = {
  groomName: 'Anirudh',
  brideName: 'Sreya',
  tagline: ['Two hearts.', 'One journey.', 'Forever.'],
  invocation: 'Om Sri Ganeshaya Namaha',
  /* a blessing in the family's own script; set to null to hide. font = any Google Font that covers it */
  regional: { text: 'శుభ వివాహం', meaning: 'Shubha Vivaham', font: 'Noto Serif Telugu' },
  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Anirudh & Sreya · 12 December 2026, Ghaziabad',

  weddingDate: '2026-12-12T19:00:00+05:30',
  weddingEnd: '2026-12-12T23:00:00+05:30',
  weddingTimeLabel: '7 pm barat',
  ceremonyTitle: 'Pheras & Forever',
  ceremonyLine: 'Traditions in our hearts, forever in our promises.<br>“Saat phere, lakh khushiyan, te ik sohni jehi zindagi.',
  muhurtham: '',

  venue: 'Vishnu Green Argan Hall',
  venueAddress: 'Plot No. 1250, G.T. Road, NH-91, Lal Kuan, Ghaziabad – 201009',
  venueCity: 'Ghaziabad',
  mapsUrl: 'https://share.google/uxsBfOmI0Gay2BkdC',
  venueImage: 'assets/gallery-gopuram.webp',

  welcome: {
    title: 'Welcome',
    lines: [
      'With the blessings of Lord Venkateswara',
      'and the love of our families,',
      'we joyfully invite you to be part of',
      'the most sacred day of our lives.',
    ],
  },

  story: {
    intro: 'A journey of friendship, love and togetherness now begins a new chapter.',
    image: 'assets/gallery-arch.webp',
    chapters: [
      { icon: 'meet', title: 'We Met', when: 'Chennai · 2019', text: 'A rain-soaked evening at a Carnatic concert, two strangers sharing one umbrella and an argument about Thyagaraja.' },
      { icon: 'love', title: 'We Fell in Love', when: 'Hyderabad · 2022', text: 'Filter coffee on Sunday mornings slowly became the only plan either of us ever wanted to make.' },
      { icon: 'forever', title: 'Now We Begin Forever', when: 'Jubilee Hills · 2026', text: 'With seven steps around the sacred fire, we promise each other a lifetime of the same.' },
    ],
  },

  families: {
    bride: {
      label: "Bride's Family",
      person: 'Sreya',
      relation: 'Daughter of',
      parents: ['Sri. Rajesh Kumar', 'Smt. Lakshmi Rajesh'],
      grandparents: 'Granddaughter of Late Sri. K. Venkata Ramana & Smt. Saraswathi',
    },
    groom: {
      label: "Groom's Family",
      person: 'Anirudh',
      relation: 'Son of',
      parents: ['Sri. Srinivasa Rao', 'Smt. Padma Srinivasa Rao'],
      grandparents: 'Grandson of Sri. P. Narasimha Rao & Smt. Kamala',
    },
  },

  familyOrder: ['groom', 'bride'], // groom-side invitation: groom's family first

  /* icon: vratham | nichayam | haldi | mehendi | sangeet | muhurtham | reception */
  /* client wording verbatim; details = [label, value] rows */
  events: [
    { icon: 'vratham', name: 'SHRI HANUMAN JI KA AASHIRWAD', date: '2026-11-28T16:00:00+05:30',
      subtitle: 'Sunderkand Paath & Bhajan Sandhya',
      lines: ['Jai Shri Ram, Jai Hanuman — har shubh kaarya mein Prabhu ka aashirwad.'],
      details: [['Time', '4:00 PM onwards']],
      note: 'The Paath will conclude with Bhog and Prasad at 7:00 PM.',
      venue: 'at our residence Gagan enclave Amrit nagar Ghaziabad',
      maps: 'https://share.google/QvsvtZtR8V6GK4EKV' },
    { icon: 'sangeet', name: 'Shagna Di Shaam', date: '2026-12-08T19:00:00+05:30',
      subtitle: 'Pyaar de rang, shagna de sang',
      lines: ['Do dil mile, ik rishta judeya,', 'Khushiyan naal har vehda sajeya.', 'Dhol di thaap te nachan saare,', 'Aao ral-mil manayiye pal eh pyaare!'],
      details: [['Time', '7 pm'], ['Dinner', '8 pm']],
      venue: 'Velvet Leaf by Melrose Hotel, Marco Polo Road, Near Raj Nagar Extension, U.P. – 201017',
      maps: 'https://share.google/A1SkFrTF34qgIxYrY' },
    { icon: 'mehendi', name: 'Mehndi mela', date: '2026-12-11T19:00:00+05:30',
      subtitle: 'Drama , giggles and heena that refuses to dry',
      details: [['Time', '7 pm onwards']],
      venue: 'Clubhouse Gagan enclave amrit nagar Ghaziabad',
      maps: 'https://share.google/QvsvtZtR8V6GK4EKV' },
    { icon: 'haldi', name: 'The haldi hangover', date: '2026-12-12T09:00:00+05:30',
      lines: ['Oye Hoye! Saadi Dulhan Da Din Aa Gaya!', 'Choora chadhega, ghadoli sajegi,', 'Dhol vajjega te saari family nachhegi!', 'Thodi jehi rasam, bahut saari masti,'],
      details: [['Time', '9 am morning']],
      venue: 'at our residence B-15 second floor Gagan enclave Amrit nagar Ghaziabad',
      maps: 'https://share.google/QvsvtZtR8V6GK4EKV' },
    { icon: 'muhurtham', name: 'Pheras & Forever', date: '2026-12-12T19:00:00+05:30', main: true,
      subtitle: 'Traditions in our hearts, forever in our promises.',
      lines: ['“Saat phere, lakh khushiyan, te ik sohni jehi zindagi.'],
      details: [['Time', '7 pm barat'], ['Dinner', '8 pm'], ['Dolli', 'tarron ki chaaon']],
      venue: 'Vishnu Green Argan Hall, Plot No. 1250, G.T. Road, NH-91, Lal Kuan, Ghaziabad – 201009',
      maps: 'https://share.google/uxsBfOmI0Gay2BkdC' },
  ],

  gallery: [
    { src: 'assets/gallery-couple-lead.webp',      alt: 'Anirudh & Sreya sharing a tender moment in their wedding silks', shape: 'arch' },
    { src: 'assets/gallery-family-blessing.webp',  alt: 'Parents showering akshata blessings upon the bride and groom', shape: 'wide' },
    { src: 'assets/gallery-couple-ritual.webp',    alt: 'Sacred wedding rituals and holding hands amidst falling petals', shape: 'tall' },
    { src: 'assets/gallery-haldi-celebration.webp', alt: 'Joyful Haldi ceremony surrounded by family and marigolds', shape: 'square' },
    { src: 'assets/gallery-family-portrait.webp',  alt: 'The couple with both families in traditional festive silks', shape: 'square' },
    { src: 'assets/gallery-saptapadi.webp',        alt: 'Saptapadi vows around the holy fire with family cheering', shape: 'wide' },
  ],

  /* no family number supplied: RSVP opens WhatsApp and the guest picks the contact;
     the demo's placeholder phone, e-mail, UPI and Hyderabad hotels are deliberately not carried over */
  rsvp: {
    deadline: '',
    whatsapp: '',
  },

  travelNote: 'All our venues, one tap from your maps',
  travel: [
    { icon: 'pin', title: 'Vishnu Green Argan Hall', text: 'Vishnu Green Argan Hall, Plot No. 1250, G.T. Road, NH-91, Lal Kuan, Ghaziabad – 201009', link: { label: 'Wedding map', href: 'https://share.google/uxsBfOmI0Gay2BkdC' } },
    { icon: 'pin', title: 'Velvet Leaf by Melrose Hotel', text: 'Velvet Leaf by Melrose Hotel, Marco Polo Road, Near Raj Nagar Extension, U.P. – 201017', link: { label: 'Open in Maps', href: 'https://share.google/A1SkFrTF34qgIxYrY' } },
    { icon: 'pin', title: 'Gagan enclave, Amrit nagar', text: 'at our residence B-15 second floor Gagan enclave Amrit nagar Ghaziabad', link: { label: 'Open in Maps', href: 'https://share.google/QvsvtZtR8V6GK4EKV' } },
  ],

  contact: null,
  gifting: null,

  wishes: { prompt: 'Leave your blessings for the couple.' },

  thankYou: {
    title: 'Thank You',
    lines: ['For being a part of our special day.', 'Your love and blessings', 'mean the world to us.'],
    signoff: 'With love, Sri. Srinivasa Rao & Smt. Padma Srinivasa Rao',
  },

  creditCampaign: 'anirudh-sreya-groom',
  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
