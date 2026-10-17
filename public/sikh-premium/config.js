/* ─────────────────────────────────────────────────────────────
   weddingConfig — everything a family would change lives here.
   The page (js/app.js) renders only from this object, so a new
   invitation is: copy the folder, edit this file, then run
   `node tools/sikh-finish.mjs public/<folder>` for the calendar
   files, the link preview and the static meta tags.
   Dates are ISO strings in India time (+05:30).

   THIS FOLDER IS THE DEMO — fictional names, shown in the studio gallery.
   "Royal Ivory & Sapphire" — a Sikh wedding invitation.
   ───────────────────────────────────────────────────────────── */

/* an honest Google Maps search for a named venue (no invented pins) */
const maps = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const weddingConfig = {
  groomName: 'Harpreet Singh',
  brideName: 'Simran Kaur',
  shortGroom: 'Harpreet',
  shortBride: 'Simran',

  /* the Mool Mantar opening in Gurmukhi; set to null to hide */
  invocation: { text: 'ੴ ਸਤਿ ਨਾਮੁ', meaning: 'Ik Onkar · There is One Creator', font: 'Noto Serif Gurmukhi' },

  /* the invitation block that follows the hero scene */
  invite: {
    motto: ['Together in Faith', 'Forever in Love'],
    tagline: ['Two Souls', 'One Journey', 'Blessed by Guru Sahib'],
    eyebrow: ['You are', 'cordially invited'],
    line: 'to join the celebrations as our families come together in the presence of Guru Sahib.',
  },

  /* purpose-made side borders, once the designer supplies them (transparent PNG,
     tall and narrow, drawn to repeat): set to e.g. { left: 'assets/border-l.webp', right: 'assets/border-r.webp' } */
  sideBorders: null,

  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'With the blessings of Guru Sahib — the wedding of Harpreet Singh & Simran Kaur · 14 February 2027, New Delhi',

  /* the Anand Karaj — the main ceremony everything counts down to */
  weddingDate: '2027-02-14T10:30:00+05:30',
  weddingEnd: '2027-02-14T12:30:00+05:30',
  venueCity: 'New Delhi',

  blessing: {
    title: ['With the Blessings of', 'Sri Guru Granth Sahib Ji'],
    lines: [
      'With the blessings of Sri Guru Granth Sahib Ji',
      'and the love of our families,',
      'we invite you to join us as we celebrate',
      'the beginning of a beautiful journey together.',
    ],
    /* written into the sky of the arch scene; set to null to hide */
    quote: {
      eyebrow: 'Gurbani',
      lines: ['They alone are called', 'husband and wife,', 'who have one light', 'in two bodies.'],
      source: 'Sri Guru Granth Sahib Ji · Ang 788',
    },
  },

  families: {
    heading: 'With the Blessings of Our Families',
    groom: { label: "Groom's Parents", parents: ['S. Gurdeep Singh Gill', 'Sdn. Manjit Kaur'] },
    bride: { label: "Bride's Parents", parents: ['S. Harbhajan Singh', 'Sdn. Kuldeep Kaur'] },
  },

  story: {
    heading: 'Our Story',
    text: 'A journey of faith, love and two families coming together. With the blessings of Guru Sahib, we begin a beautiful chapter of our lives.',
    image: 'assets/gallery/g3.webp?v=44d3e88be5',
    imageAlt: 'The Gurudwara mirrored across still water at golden hour',
    motto: ['Different Paths', 'One Destiny'],
    pillars: [{ icon: 'faith', label: 'Faith' }, { icon: 'heart', label: 'Love' }, { icon: 'family', label: 'Family' }],
  },

  /* in the order of the day. art: dhol | horse | gurudwara | lantern
     gate: an event shown only when the link carries that word, e.g. ?mehndi */
  events: [
    {
      id: 'mehndi', art: 'dhol', gate: 'mehndi', menu: 'Mehndi',
      name: 'Mehndi Di Raat', subtitle: 'Music, Dance & Dinner',
      date: '2027-02-13T18:00:00+05:30', time: '6:00 PM Onwards',
      venue: 'The Imperial Lawns', address: 'Naraina Vihar, New Delhi',
      maps: maps('The Imperial Lawns, Naraina Vihar, New Delhi'),
    },
    {
      id: 'sehrabandi', art: 'horse', menu: 'Sehrabandi',
      name: 'Sehrabandi & Ghurchari', subtitle: 'The groom sets out',
      date: '2027-02-14T09:00:00+05:30', time: '9:00 AM',
      venue: 'The Imperial Lawns', address: 'Naraina Vihar, New Delhi',
      maps: maps('The Imperial Lawns, Naraina Vihar, New Delhi'),
    },
    {
      id: 'anand-karaj', art: 'gurudwara', main: true, menu: 'Anand Karaj',
      name: 'Anand Karaj', subtitle: 'The Blissful Union',
      date: '2027-02-14T10:30:00+05:30', time: '10:30 AM',
      venue: 'Gurudwara Sri Guru Singh Sabha', address: 'Rajouri Garden, New Delhi – 110027',
      note: 'We humbly request your presence as we take the four laavan around Sri Guru Granth Sahib Ji.',
      etiquette: 'Kindly cover your head and remove footwear before entering the Darbar Sahib.',
      maps: maps('Gurudwara Sri Guru Singh Sabha, Rajouri Garden, New Delhi'),
    },
    {
      id: 'lunch', art: 'lantern', menu: 'Lunch',
      name: 'Wedding Lunch', subtitle: 'Food · Family · Festivity',
      date: '2027-02-14T12:00:00+05:30', time: '12:00 Noon Onwards',
      venue: 'Banquet Grand Crown', address: 'Najafgarh Road, New Delhi',
      maps: maps('Banquet Grand Crown, Najafgarh Road, New Delhi'),
    },
  ],

  countdown: {
    title: 'Until We Celebrate',
    sub: 'Counting the days to the Anand Karaj',
    passed: 'The laavan have been taken. Thank you for your blessings.',
  },

  gallery: {
    title: 'A Glimpse',
    sub: 'Moments that last forever',
    note: 'Illustrative artwork in the spirit of the day.',
    /* the first four show in the grid; "See more" opens the viewer with all of them */
    images: [
      { src: 'assets/gallery/g1.webp?v=7a3383d4d0', alt: 'The Anand Karaj ceremony inside Sri Darbar Sahib' },
      { src: 'assets/gallery/g2.webp?v=83e53f37ba', alt: 'Sehrabandi ceremony as the groom prepares for the wedding' },
      { src: 'assets/gallery/g3.webp?v=44d3e88be5', alt: 'Mehndi Di Raat celebration with music and dhol' },
      { src: 'assets/gallery/g4.webp?v=8d8069ea90', alt: 'Joyful Baraat procession arriving at the venue' },
      { src: 'assets/gallery/g5.webp?v=32dc7fa1a1', alt: 'The couple by the serene Gurudwara sarovar' },
      { src: 'assets/gallery/g6.webp?v=0fd488da20', alt: 'The Milni ceremony welcoming family members' },
    ],
  },

  /* each row opens an honest map search around the main venue — nothing invented */
  gettingHere: {
    title: 'Getting Here',
    sub: 'Location, parking and nearby stay options for your convenience.',
    rows: [
      { icon: 'pin', label: 'Directions', sub: 'Open the Gurudwara in Google Maps', href: maps('Gurudwara Sri Guru Singh Sabha, Rajouri Garden, New Delhi') },
      { icon: 'car', label: 'Parking Info', sub: 'Find parking near the venue', href: maps('parking near Gurudwara Sri Guru Singh Sabha, Rajouri Garden, New Delhi') },
      { icon: 'hotel', label: 'Nearby Hotels', sub: 'Stays around Rajouri Garden', href: maps('hotels near Rajouri Garden, New Delhi') },
    ],
  },

  rsvp: {
    title: 'Kindly RSVP',
    note: 'Your presence will make our celebration even more special.',
    deadline: 'Kindly respond by 1 February 2027',
    /* the family's WhatsApp number in full international form, digits only, e.g. '919812345678'.
       While it still contains an X, replies open WhatsApp with the message written and the
       guest chooses the family's contact. */
    whatsapp: '917997001900', /* the demo replies to the studio */
  },

  closing: {
    title: ['With Love', 'and Blessings'],
    lines: ['We look forward to celebrating', 'this special chapter with you.'],
    signoff: 'The Gill & Harbhajan Singh families',
    farewell: 'Until we meet in the presence of Guru Sahib',
    credit: 'Designed by Invitivals',
  },

  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-video.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
