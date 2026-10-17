/* ─────────────────────────────────────────────────────────────
   weddingConfig — everything a family would change lives here.
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
  shareText: 'You are invited to the wedding of Anirudh & Sreya · 24 November 2026, Hyderabad',

  weddingDate: '2026-11-24T10:00:00+05:30',
  weddingEnd: '2026-11-24T13:00:00+05:30',
  weddingTimeLabel: '10:00 AM onwards',
  muhurtham: 'Subha Muhurtham · 10:24 AM, Vrischika Lagnam',

  venue: 'Sri Venkateswara Kalyana Mandapam',
  venueAddress: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
  venueCity: 'Jubilee Hills, Hyderabad',
  mapsUrl: 'https://maps.google.com/?q=Sri+Venkateswara+Kalyana+Mandapam+Jubilee+Hills+Hyderabad',
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

  /* icon: vratham | nichayam | haldi | mehendi | sangeet | muhurtham | reception */
  events: [
    { icon: 'vratham',   name: 'Vratham',          date: '2026-11-21T09:00:00+05:30', time: '9:00 AM',  venue: "Bride's residence, Banjara Hills", text: 'A quiet morning of prayers seeking the blessings of the family deity.', dress: 'Traditional · pastel silks', maps: 'https://maps.google.com/?q=Banjara+Hills+Hyderabad' },
    { icon: 'nichayam',  name: 'Nichayathartham',  date: '2026-11-22T11:00:00+05:30', time: '11:00 AM', venue: 'Sri Venkateswara Kalyana Mandapam', text: 'The formal engagement, as the families exchange thamboolam and promises.', dress: 'Silk sarees · veshti & angavastram' },
    { icon: 'haldi',     name: 'Haldi & Mangala Snanam', date: '2026-11-22T17:00:00+05:30', time: '5:00 PM',  venue: 'The Lawns, Jubilee Hills', text: 'Turmeric, jasmine and laughter for a bright, auspicious beginning.', dress: 'Yellow & green', maps: 'https://maps.google.com/?q=Jubilee+Hills+Hyderabad' },
    { icon: 'sangeet',   name: 'Sangeet',          date: '2026-11-23T19:00:00+05:30', time: '7:00 PM',  venue: 'The Lawns, Jubilee Hills', text: 'An evening of music, dance and two families becoming one.', dress: 'Indo-western · jewel tones', maps: 'https://maps.google.com/?q=Jubilee+Hills+Hyderabad' },
    { icon: 'muhurtham', name: 'Muhurtham',        date: '2026-11-24T10:00:00+05:30', time: '10:00 AM', venue: 'Sri Venkateswara Kalyana Mandapam', text: 'The sacred wedding ceremony, mangalyadharanam and saptapadi.', dress: 'Kanjeevaram & pattu · ivory and gold', main: true },
    { icon: 'reception', name: 'Reception',        date: '2026-11-24T19:00:00+05:30', time: '7:00 PM',  venue: 'Taj Krishna, Banjara Hills', text: 'Dinner and celebration with everyone who made our story.', dress: 'Formal · festive', maps: 'https://maps.google.com/?q=Taj+Krishna+Hyderabad' },
  ],

  gallery: [
    { src: 'assets/gallery-couple-lead.webp',      alt: 'Anirudh & Sreya sharing a tender moment in their wedding silks', shape: 'arch' },
    { src: 'assets/gallery-family-blessing.webp',  alt: 'Parents showering akshata blessings upon the bride and groom', shape: 'wide' },
    { src: 'assets/gallery-couple-ritual.webp',    alt: 'Sacred wedding rituals and holding hands amidst falling petals', shape: 'tall' },
    { src: 'assets/gallery-haldi-celebration.webp', alt: 'Joyful Haldi ceremony surrounded by family and marigolds', shape: 'square' },
    { src: 'assets/gallery-family-portrait.webp',  alt: 'The couple with both families in traditional festive silks', shape: 'square' },
    { src: 'assets/gallery-saptapadi.webp',        alt: 'Saptapadi vows around the holy fire with family cheering', shape: 'wide' },
  ],

  rsvp: {
    deadline: 'Kindly respond by 10 November 2026',
    whatsapp: '919876543210',
  },

  travel: [
    { icon: 'pin',   title: 'Directions', text: 'Ten minutes from Jubilee Hills Check Post on Road No. 36. Rajiv Gandhi International Airport is about 45 minutes away.', link: { label: 'Open in Maps', href: 'https://maps.google.com/?q=Sri+Venkateswara+Kalyana+Mandapam+Jubilee+Hills+Hyderabad' } },
    { icon: 'car',   title: 'Parking',    text: 'Valet parking at the main entrance. Additional parking at the adjacent temple grounds, with a shuttle every ten minutes.' },
    { icon: 'hotel', title: 'Nearby Hotels', text: 'Rooms are held for our guests at Taj Krishna and ITC Kohenur. Mention “Anirudh & Sreya” while booking.', link: { label: 'Taj Krishna', href: 'https://maps.google.com/?q=Taj+Krishna+Hyderabad' } },
  ],

  contact: {
    note: 'For anything at all, our families are a call away.',
    phone: '+919876543210',
    whatsapp: '919876543210',
    email: 'family@example.com',
  },

  gifting: {
    text: 'Your presence and blessings are the greatest gift we could ask for. If you would still like to bless us, a contribution towards our new home would be received with gratitude.',
    upi: 'anirudh.sreya@upi',
    name: 'Anirudh & Sreya',
  },

  wishes: { prompt: 'Leave your blessings for the couple.' },

  thankYou: {
    title: 'Thank You',
    lines: ['For being a part of our special day.', 'Your love and blessings', 'mean the world to us.'],
    signoff: 'With love, the Rajesh & Srinivasa Rao families',
  },

  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
