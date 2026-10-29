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
    /* the card under the arch, in the family's Punjabi (client, 2026-10-29), exactly as sent; it was
       "With the blessings of Sri Guru Granth Sahib Ji and the love of our families, we invite you to bless our daughter …" */
    lines: ["ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਦੀ ਅਪਾਰ ਬਖ਼ਸ਼ਿਸ਼ ਅਤੇ ਸਾਡੇ ਪਰਿਵਾਰਾਂ ਦੇ ਪਿਆਰ ਸਦਕਾ, ਅਸੀਂ ਤੁਹਾਨੂੰ ਸਾਡੀ ਧੀ ਦੇ ਜੀਵਨ ਦੇ ਇਸ ਨਵੇਂ ਅਤੇ ਸੁੰਦਰ ਸਫ਼ਰ ਦੀ ਸ਼ੁਰੂਆਤ 'ਤੇ ਆਪਣਾ ਪਿਆਰ ਅਤੇ ਅਸ਼ੀਰਵਾਦ ਦੇਣ ਲਈ ਸੱਦਾ ਦਿੰਦੇ ਹਾਂ।"],
    linesLang: 'pa',
    /* written into the sky of the arch scene; set to null to hide */
    quote: {
      eyebrow: 'Gurbani',
      /* in Punjabi (client, 2026-10-29), exactly as sent; it was "They alone are called husband and wife, who have one light in two bodies." */
      lines: ['ਉਹੀ ਸੁਹਾਗੀ ਜੋੜਾ ਕਹੀਦਾ ਹੈ, ਜਿਨ੍ਹਾਂ ਦੇ ਦੋ ਸਰੀਰਾਂ ਵਿੱਚ ਇੱਕੋ ਜੋਤਿ ਵੱਸਦੀ ਹੈ।'],
      lang: 'pa',
      source: 'Sri Guru Granth Sahib Ji · Ang 788',
    },
  },

  families: {
    heading: 'With the Blessings of Our Families',
    bride: { label: "Bride's Parents", parents: ['S. Baldev Singh Sidhu', 'Sdn. Inderjeet Kaur Sidhu'] },
    groom: { label: "Groom's Parents", parents: ['S. Ravinder Pal Singh Sandhu', 'Sdn. Tejinder Kaur'] },
  },

  story: null, // removed at the family's request (client, 2026-10-29)

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

  gallery: null, // removed at the family's request (client, 2026-10-29)

  gettingHere: null, // removed at the family's request (client, 2026-10-29)

  rsvp: null, // removed at the family's request (client, 2026-10-29)

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
