/* ─────────────────────────────────────────────────────────────
   Brown Theme Wedding — Arjun & Aadhya (sample names from the designer pack).
   Everything the page shows comes from this object; a client version is
   this file edited plus photos in assets/.  Dates are ISO in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
export const config = {
  couple: {
    groom: 'Arjun',   // the pack has gold calligraphy for exactly "Arjun" and "Aadhya";
    bride: 'Aadhya',  // other names fall back to styled text
  },
  hero: {
    blessing: ['With the blessings of', 'Lord Ganesha'],
    request: ['We request the pleasure', 'of your company at the', 'wedding celebration of'],
  },
  /* page 2 — the date on the parchment (sample until the client's details arrive) */
  date: { day: '1', suffix: 'st', month: 'November', year: '2026', time: '11:00 AM' },

  events: {
    shaadi: {
      title: 'Shaadi',
      tagline: ['A sacred union,', 'blessed by love'],
      start: '2026-11-01T11:00:00+05:30',
      end: '2026-11-01T15:00:00+05:30',
      day: '1', suffix: 'st', month: 'November', year: '2026', time: '11:00 AM',
      venue: 'Virupakshi Gardens',
      address: ['Karimnagar road, Govindpalli', 'Jagtial, Telangana, 505327'],
      mapsUrl: '', // paste the client's Google Maps link; empty = a search for the address above
    },
    reception: {
      title: 'Reception',
      tagline: ['We would be delighted', 'to have you with us at'],
      start: '2026-11-01T19:00:00+05:30',
      end: '2026-11-01T22:00:00+05:30',
      day: '1', suffix: 'st', month: 'November', year: '2026', time: '11:00 AM',
      venue: '',   // not supplied — the detail page says so instead of inventing one
      address: [],
      mapsUrl: '', // no venue, no link: the Maps button shows a demo notice
    },
  },

  /* page 6 — replaceable photos; no client photos were supplied, these are
     demo crops of the designer's own page-6 artwork */
  memories: {
    photos: [
      { src: 'assets/demo-1.webp', alt: 'Demo photo 1', demo: true },
      { src: 'assets/demo-2.webp', alt: 'Demo photo 2', demo: true },
      { src: 'assets/demo-3.webp', alt: 'Demo photo 3', demo: true },
    ],
  },

  rsvp: {
    title: ['Kindly', 'RSVP'],
    lines: ['We would love to', 'have you with us!'],
    storageKey: 'brown-theme-wedding:rsvp',
    endpoint: '', // a POST URL for a real backend; empty = saved in this browser only (demo)
  },

  thankYou: {
    title: ['With Love', '& Gratitude'],
    lines: ['We look forward to celebrating', 'this special day with you and your family.'],
  },

  opening: {
    video: 'assets/opening.mp4',
    poster: 'assets/opening.webp',
    music: 'assets/music.mp3',
    /* the door sound lives in the video's own track; after this many seconds the
       video is muted and the music fades in. Adjust once the cut-off is confirmed. */
    doorSoundSeconds: 3.5,
    musicFadeSeconds: 3,
    musicVolume: 0.8,
  },
};
