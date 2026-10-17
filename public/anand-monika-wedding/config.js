/* ─────────────────────────────────────────────────────────────
   weddingConfig — Anand Kumar & Monika Kumari, Sitamarhi, Bihar.
   Sent by the groom's family. Everything on the page renders from
   this object; sections with no details (story, gallery, gifting)
   are simply left out. Dates are ISO strings in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
export const weddingConfig = {
  groomName: 'Anand Kumar',
  groomNote: '(Ind-Railway)', // small line under his name wherever it appears
  brideName: 'Monika',
  tagline: ['Two hearts.', 'One journey.', 'Forever.'],
  invocation: 'Shri Ganeshaya Namah',
  regional: null, // English only

  guestFallback: 'You & Your Family',
  shareText: 'You are invited to the wedding of Anand Kumar & Monika · 30 November 2026, Sitamarhi',

  /* no time was given for the wedding: the day is shown, calendars get an all-day entry */
  weddingDate: '2026-11-30T00:00:00+05:30',
  allDay: true,
  weddingTimeLabel: '',
  ceremonyTitle: 'Shubh Vivah',
  ceremonyNote: '',
  ceremonyLine: 'Your presence and blessings will make our celebration complete.<br>Please join us as Anand Kumar and Monika take the seven sacred steps.',
  muhurtham: '',

  venue: 'Ashis Place',
  venueAddress: 'Punaura Road, Sitamarhi, Bihar',
  venueCity: 'Sitamarhi, Bihar',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ashis+Place+Punaura+Road+Sitamarhi+Bihar',
  venueImage: null,

  welcome: {
    title: 'Welcome',
    lines: [
      'With the blessings of Maa Janaki',
      'and Lord Hanuman, and the love of our families,',
      'we joyfully invite you to share',
      'the most sacred day of our lives.',
    ],
  },

  story: null,

  families: {
    groom: {
      label: "Groom's Family",
      person: 'Anand Kumar',
      note: '(Ind-Railway)',
      relation: 'Son of',
      parents: ['Shri Arvind Prasad', 'Smt. Snehlata Devi'],
      grandparents: 'Village Ghurghura, P.S. Sonbarsa, Sitamarhi, Bihar 843317',
    },
    bride: {
      label: "Bride's Family",
      person: 'Monika Kumari',
      relation: 'Daughter of',
      parents: ['Late Shri Mohan Prasad', 'Smt. Munny Devi'],
      grandparents: 'Sister of Shri Ganesh Prasad · Janki Sthan, Sitamarhi, Bihar',
    },
  },
  familyOrder: ['groom', 'bride'],

  /* icon: vratham | nichayam | haldi | mehendi | sangeet | muhurtham | reception
     time: null = no time announced (shown as the day only, all-day calendar entry) */
  events: [
    { icon: 'nichayam', name: 'Cheka · Engagement', date: '2026-10-30T00:00:00+05:30', time: null,
      venue: 'Sidhi Vinayak Hotel, Riga Road, near Janki Sthan, Sitamarhi',
      maps: 'https://www.google.com/maps/search/?api=1&query=Sidhi+Vinayak+Hotel+Riga+Road+Sitamarhi',
      text: 'The engagement, as the two families come together and bless the match.' },
    { icon: 'vratham', name: 'Matkor Puja & Hanuman Aradhana', date: '2026-11-25T00:00:00+05:30', time: null,
      venue: '', text: 'Sacred earth is brought home with songs for the wedding rites, and prayers are offered to Lord Hanuman.' },
    { icon: 'haldi', name: 'Haldi, Mehndi & Priti Bhoj', date: '2026-11-29T11:00:00+05:30', time: '11:00 AM onwards',
      venue: '', text: 'Turmeric, henna and a family feast, from eleven in the morning.' },
    { icon: 'muhurtham', name: 'Shubh Vivah', date: '2026-11-30T00:00:00+05:30', time: null,
      venue: 'Ashis Place, Punaura Road, Sitamarhi', text: 'The wedding ceremony, with jaimala, kanyadaan and the seven pheras.', main: true },
  ],

  gallery: [],

  rsvp: {
    deadline: '',
    whatsapp: '916206517003',
  },

  travelNote: 'Both venues, one tap from your maps',
  travel: [
    { icon: 'pin', title: 'Wedding · Ashis Place', text: 'Punaura Road, Sitamarhi, Bihar.', link: { label: 'Open in Maps', href: 'https://www.google.com/maps/search/?api=1&query=Ashis+Place+Punaura+Road+Sitamarhi+Bihar' } },
    { icon: 'pin', title: 'Engagement · Sidhi Vinayak Hotel', text: 'Riga Road, near Janki Sthan, Sitamarhi, Bihar.', link: { label: 'Open in Maps', href: 'https://www.google.com/maps/search/?api=1&query=Sidhi+Vinayak+Hotel+Riga+Road+Sitamarhi' } },
  ],

  contact: {
    note: 'For anything at all, our family is a call away.',
    phones: ['+916206517003'],
    display: '+91 62065 17003',
    whatsapp: '916206517003',
    email: null,
  },

  gifting: null,

  wishes: { prompt: 'Leave your blessings for Anand Kumar and Monika.' },

  thankYou: {
    title: 'Thank You',
    lines: ['For being a part of our special day.', 'Your love and blessings', 'mean the world to us.'],
    signoff: 'With love, Shri Arvind Prasad, Smt. Snehlata Devi & family · Ghurghura, Sitamarhi',
  },

  creditCampaign: 'anand-monika-wedding',
  music: 'assets/audio/music.mp3',
  intro: {
    video: 'assets/intro-wedding.mp4',
    poster: 'assets/intro-poster.webp',
    lastFrame: 'assets/intro-last.webp',
  },
};
