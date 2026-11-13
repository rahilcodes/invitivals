/* ─────────────────────────────────────────────────────────────
   Muslim wedding — emerald & gold (designer pack "MUSLIM TEMP 2").
   Sample content is the pack's own: Dr. Ayesha Fatima & U. Syed Rehan Ali,
   Falaknuma Palace, Hyderabad, 10–13 December 2025.
   Everything the page shows comes from this object. Dates are ISO in
   India time (+05:30); the weekday is derived from the date unless
   `weekday` is given.
   ───────────────────────────────────────────────────────────── */
export const config = {
  couple: {
    bride: 'Dr. Ayesha Fatima', brideTitle: 'MBBS',
    groom: 'U. Syed Rehan Ali', groomTitle: 'MBBS',
    short: 'Ayesha & Rehan',
  },
  hero: {
    bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    title: ['Wedding', 'Invitation'],
    invite: ['Together', 'with our families', 'we cordially invite you', 'to the Nikah of'],
    blessing: ['In the blessings', 'and the presence of', 'our loved ones'],
  },

  /* page 3 — the scratch card. The gold-brush plate from the pack already carries
     "13 December 2025"; if the date below is changed, the text is drawn over it. */
  date: {
    day: '13', month: 'December', year: '2025',
    artworkLabel: '13 December 2025',
    tagline: ['A new chapter', 'of our story begins'],
    event: 'nikah', // which event "Add to Calendar" on this page saves
  },

  functions: {
    title: 'Our Functions',
    intro: ['Join us in a beautiful celebration', 'of love, faith and family.'],
  },

  /* one entry per function card, in display order; `page` is the pack's artwork */
  events: [
    {
      key: 'mayun', title: 'Mayun', page: 6,
      tagline: ['Join us for a joyful celebration', 'with love and family'],
      // the directory reference (WITH TEXT TEMP/4.png) shows 10 December, the detail page 12 December
      start: '2025-12-12T10:00:00+05:30', end: '2025-12-12T13:00:00+05:30',
      time: '10:00 AM onwards',
      venue: 'Falaknuma Palace', city: 'Hyderabad',
      mapsUrl: '', // paste the venue's Google Maps link; empty = a search for "Falaknuma Palace, Hyderabad"
    },
    {
      key: 'mehendi', title: 'Mehendi', page: 7,
      tagline: ['Join us for a joyful evening of', 'love, colour and celebration'],
      start: '2025-12-11T16:00:00+05:30', end: '2025-12-11T20:00:00+05:30',
      time: '4:00 PM onwards',
      venue: 'Falaknuma Palace', city: 'Hyderabad',
      mapsUrl: '',
    },
    {
      key: 'nikah', title: 'Nikah', page: 8,
      tagline: ['Join us for a blessed celebration of', 'love, faith and togetherness'],
      start: '2025-12-13T11:00:00+05:30', end: '2025-12-13T14:00:00+05:30',
      time: '11:00 AM onwards',
      venue: 'Falaknuma Palace', city: 'Hyderabad',
      mapsUrl: '',
    },
    {
      key: 'valima', title: 'Valima', page: 9,
      tagline: ['Join us for an elegant evening of love,', 'blessings and celebration'],
      start: '2025-12-13T19:00:00+05:30', end: '2025-12-13T22:30:00+05:30',
      time: '7:00 PM onwards',
      venue: 'Falaknuma Palace', city: 'Hyderabad',
      mapsUrl: '',
    },
  ],

  /* page 4 of the pack (the couple on the palace walk) — a photo interlude.
     No separate couple photos were supplied; add { src, alt } entries here to
     show a collage in its place. */
  collage: { photos: [] },

  rsvp: {
    title: 'RSVP',
    lines: ['Your presence and blessings mean the world to us.', 'Kindly let us know if you will be joining', 'our celebrations.'],
    accept: 'Joyfully Accepts', decline: 'Regretfully Declines',
    namePlaceholder: 'Your name', guestsLabel: 'Guests',
    messagePlaceholder: 'Type your message here...',
    button: 'Send Response',
    maxGuests: 10,
    storageKey: 'muslim-emerald-wedding:rsvp',
    endpoint: '', // a POST URL (JSON body) for a real backend; empty = the form says so and keeps the reply on this device only
  },

  contact: {
    title: 'Need Help?',
    lines: ['Feel free to reach out to us', 'or our family members.'],
    phone: '',    // e.g. '+91 98765 43210' — empty = the Call button says it is not configured
    whatsapp: '', // digits with country code, e.g. '919876543210'
    email: '',    // e.g. 'family@example.com'
    thankYou: 'Thank You',
    thanks: ['For being a part of our special day.', 'Your love and blessings', 'mean the world to us.'],
  },

  opening: {
    poster: 'assets/bg1.webp',
    video: 'assets/opening.mp4',
    music: 'assets/music.mp3', // Sanson Ki Mala Pe (instrumental, slowed + reverb)
    musicVolume: 0.75,
    musicFadeSeconds: 3,
  },
};
