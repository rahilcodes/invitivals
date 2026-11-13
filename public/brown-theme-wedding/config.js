/* ─────────────────────────────────────────────────────────────
   Brown Theme Wedding: an Invitivals design demo, not a client's invitation.
   Names, dates and places are the designer's sample wording from the references.
   While a value equals the reference's wording the page shows the reference's own lettering;
   edit it and that line becomes live text in the same place.
   Dates are ISO in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
export const config = {
  couple: {
    groom: 'Arjun',
    bride: 'Aadhya',
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
      address: ['Karimnagar road, Govindpalli,', 'Jagtial, Telangana, 505327'],
      mapsUrl: '', // paste the client's Google Maps link; empty = a search for the address above
    },
    reception: {
      title: 'Reception',
      tagline: ['We would be delighted', 'to have you with us at'],
      start: '2026-11-01T11:00:00+05:30', // the time the reference shows
      end: '2026-11-01T15:00:00+05:30',
      day: '1', suffix: 'st', month: 'November', year: '2026', time: '11:00 AM',
      // the reference names no reception venue, so none is printed; the calendar entry and Maps button use the demo's one sample venue
      venue: 'Virupakshi Gardens',
      address: ['Karimnagar road, Govindpalli,', 'Jagtial, Telangana, 505327'],
      mapsUrl: '',
    },
  },

  /* page 6: replaceable photos. These three are the designer's own, taken from the reference's panels */
  memories: {
    photos: [
      { src: 'assets/photo-1.webp', alt: 'The couple, forehead to forehead' },
      { src: 'assets/photo-2.webp', alt: 'The couple, seen from behind' },
      { src: 'assets/photo-3.webp', alt: 'The couple, smiling in an embrace' },
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
