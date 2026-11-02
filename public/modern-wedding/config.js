/* ─────────────────────────────────────────────────────────────
   Modern Wedding (Ayesha & Rehan): the wording, dates and places come from the designer's
   with-text references. While a value equals the reference's wording the page shows the
   reference's own lettering; edit it and that line becomes live text in the same place.
   Dates are ISO in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
export const config = {
  couple: {
    first: 'Ayesha',   // the upper name on the card
    second: 'Rehan',
  },
  hero: {
    lines: ['Together with their families', 'you are cordially invited to', 'the wedding ceremony of'],
    tagline: 'Two hearts ~ One journey',
  },

  /* page 2 — Save Our Date. The calendar in the reference marks the 15th with the heart;
     the Save the Date / Google Maps pills use the Nikkah details from page 3. */
  date: {
    month: 'November 2026',
    revealDay: 15,
    event: 'nikkah',
  },

  events: {
    nikkah: {
      title: 'Nikkah',
      date: '1 November 2026',
      time: '11:00 AM',
      start: '2026-11-01T11:00:00+05:30',
      end: '2026-11-01T14:00:00+05:30',
      venue: 'Virupakshi Gardens,',
      address: ['Karimnagar road, Govindpalli,', 'Jagtial, Telangana 505327'],
      mapsUrl: '', // paste the venue's Google Maps link; empty = a search for the address above
    },
    reception: {
      title: 'Reception',
      date: '2 November 2026',
      time: '7:00 PM',
      start: '2026-11-02T19:00:00+05:30',
      end: '2026-11-02T22:00:00+05:30',
      venue: 'Virupakshi Gardens,',
      address: ['Karimnagar road, Govindpalli,', 'Jagtial, Telangana 505327'],
      mapsUrl: '',
    },
  },

  /* page 4 — the live countdown runs to this instant (the Nikkah) */
  countdown: { target: '2026-11-01T11:00:00+05:30' },

  /* page 5 — RSVP and duas are stored by rsvp.php next to this page (data/entries.jsonl);
     the couple reads them at rsvp.php?key=… (the key is set inside rsvp.php). */
  rsvp: {
    endpoint: 'rsvp.php',
    placeholder: 'Leave your beautiful wishes and duas for the couple...',
    storageKey: 'modern-wedding',
  },

  opening: {
    video: 'assets/opening.mp4',   // the pack's AI film, 10 s, with its own sound
    poster: 'assets/opening.webp', // the film's first frame
    music: 'assets/music.mp3',     // "Jessie's Land" from the pack, loops
    musicVolume: 0.8,
    musicFadeSeconds: 2.5,
  },
};
