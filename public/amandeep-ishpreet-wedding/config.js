/* ─────────────────────────────────────────────────────────────
   weddingConfig — everything a family would change lives here.
   The page (js/app.js) renders only from this object, so a new
   invitation is: copy the folder, edit this file, swap art.
   Dates are ISO strings in India time (+05:30).

   "Royal Ivory & Sapphire" — a Sikh wedding invitation, laid out
   as one continuous scroll in the order of the design mockup.

   THE BRIDE'S FAMILY'S INVITATION (the Sidhu family). The groom's
   family's invitation lives in public/ishpreet-amandeep-wedding.
   ───────────────────────────────────────────────────────────── */

/* an honest Google Maps search for a named venue (no invented pins) */
const maps = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const weddingConfig = {
  groomName: 'Ishpreet Singh',
  brideName: 'Amandeep Kaur',
  shortGroom: 'Ishpreet',
  shortBride: 'Amandeep',
  /* the bride's family is hosting: the bride is named first everywhere */
  hostSide: 'bride',

  /* the Mool Mantar opening in Gurmukhi; set to null to hide */
  invocation: { text: 'ੴ ਸਤਿ ਨਾਮੁ', meaning: 'Ik Onkar · There is One Creator', font: 'Noto Serif Gurmukhi' },

  /* the invitation block that follows the hero scene */
  invite: {
    motto: ['Together in Faith', 'Forever in Love'],
    tagline: ['Two Souls', 'One Journey', 'Blessed by Guru Sahib'],
    eyebrow: ['You are', 'cordially invited'],
    line: 'by S. Baldev Singh Sidhu & Sdn. Inderjeet Kaur Sidhu to celebrate the wedding of their beloved daughter Amandeep with Ishpreet, in the presence of Guru Sahib.',
  },

  /* purpose-made side borders, once the designer supplies them (transparent PNG,
     tall and narrow, drawn to repeat): set to e.g. { left: 'assets/border-l.webp', right: 'assets/border-r.webp' } */
  sideBorders: null,

  /* ?to=Name in the link greets each guest personally; this is used when there is none */
  guestFallback: 'You & Your Family',
  shareText: 'With the blessings of Guru Sahib — the wedding of Amandeep Kaur & Ishpreet Singh · 13 December 2026, New Delhi',

  /* the Anand Karaj — the main ceremony everything counts down to */
  weddingDate: '2026-12-13T10:30:00+05:30',
  weddingEnd: '2026-12-13T11:30:00+05:30',
  venueCity: 'New Delhi',

  blessing: {
    title: ['With the Blessings of', 'Sri Guru Granth Sahib Ji'],
    lines: [
      'With the blessings of Sri Guru Granth Sahib Ji',
      'and the love of our families,',
      'we invite you to bless our daughter',
      'as she begins a beautiful journey together.',
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
    bride: { label: "Bride's Parents", parents: ['S. Baldev Singh Sidhu', 'Sdn. Inderjeet Kaur Sidhu'] },
    groom: { label: "Groom's Parents", parents: ['S. Ravinder Pal Singh Sandhu', 'Sdn. Tejinder Kaur'] },
  },

  story: {
    heading: 'Our Story',
    text: 'A journey of faith, love and two families coming together. With the blessings of Guru Sahib, we begin a beautiful chapter of our lives.',
    image: 'assets/gallery/g5.webp?v=32dc7fa1a1',
    imageAlt: 'The couple by the Gurudwara sarovar at golden hour',
    motto: ['Different Paths', 'One Destiny'],
    pillars: [{ icon: 'faith', label: 'Faith' }, { icon: 'heart', label: 'Love' }, { icon: 'family', label: 'Family' }],
  },

  /* in the order of the day. art: dhol | horse | gurudwara | lantern */
  events: [
    {
      id: 'jaggo', art: 'dhol', menu: 'Jaggo',
      name: 'Jaggo', subtitle: 'An Evening of Song & Dance',
      date: '2026-12-12T18:30:00+05:30', time: '6:30 PM Onwards',
      venue: 'Clay 1 Glorious', address: 'Moti Nagar, New Delhi',
      note: 'Followed by the Batna & Haldi ceremony.',
      maps: maps('Clay 1 Glorious, Moti Nagar, New Delhi'),
    },
    {
      id: 'anand-karaj', art: 'gurudwara', main: true, menu: 'Laavan',
      name: 'Anand Karaj', subtitle: 'The Laavan',
      date: '2026-12-13T10:30:00+05:30', time: '10:30 AM',
      venue: 'Gurudwara Sri Guru Singh Sabha', address: 'Kirti Nagar, New Delhi – 110015',
      note: 'We humbly request your presence as our daughter takes the four laavan around Sri Guru Granth Sahib Ji.',
      etiquette: 'Kindly cover your head and remove footwear before entering the Darbar Sahib.',
      maps: maps('Gurudwara Sri Guru Singh Sabha, Kirti Nagar, New Delhi 110015'),
    },
    {
      id: 'reception', art: 'lantern', menu: 'Reception',
      name: 'Reception', subtitle: 'Celebrating the Newlyweds',
      date: '2026-12-13T11:30:00+05:30', time: '11:30 AM Onwards',
      venue: 'Banquet Majestic Crown', address: '24, Najafgarh Road Industrial Area, New Delhi – 110015',
      maps: maps('Banquet Majestic Crown, Najafgarh Road Industrial Area, New Delhi 110015'),
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
      { icon: 'pin', label: 'Directions', sub: 'Open the Gurudwara in Google Maps', href: maps('Gurudwara Sri Guru Singh Sabha, Kirti Nagar, New Delhi 110015') },
      { icon: 'car', label: 'Parking Info', sub: 'Find parking near the venue', href: maps('parking near Gurudwara Sri Guru Singh Sabha, Kirti Nagar, New Delhi') },
      { icon: 'hotel', label: 'Nearby Hotels', sub: 'Stays around Kirti Nagar', href: maps('hotels near Kirti Nagar, New Delhi') },
    ],
  },

  rsvp: {
    title: 'Kindly RSVP',
    note: 'Your presence will make our celebration even more special.',
    deadline: 'Kindly respond by 1 December 2026',
    /* Put the family's WhatsApp number here in full international form, digits only,
       e.g. '919812345678'. While it still contains an X, the page shows the choice
       without claiming the reply is delivered. */
    whatsapp: '91XXXXXXXXXX',
  },

  closing: {
    title: ['With Love', 'and Blessings'],
    lines: ['We look forward to celebrating', 'this special chapter with you.'],
    signoff: 'With love, the Sidhu family',
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
