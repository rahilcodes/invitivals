/* ─────────────────────────────────────────────────────────────
   Maham Azeem & Nasir Hussain — Nikah (client brief 2026-11-17). Every word below is the client's own, exactly as
   supplied; nothing that was not given (parents, family, more functions, an address) is shown.
   ONE event only: the Nikah Ceremony. Times are Pakistan time (Asia/Karachi, +05:00).
   ───────────────────────────────────────────────────────────── */
export const config = {
  couple: 'Maham Azeem & Nasir Hussain',
  bride: 'Maham Azeem',
  groom: 'Nasir Hussain',

  /* page 1: the card's own Bismillah and translation are in the plate; the monogram and these lines are live */
  welcome: { title: 'Nikah Invitation', date: 'Monday, 21 December 2026', place: 'Sialkot, Pakistan', cue: 'Scroll' },

  /* page 2 */
  message: ['With gratitude and joy, we request', 'the honour of your presence', 'at our Nikah ceremony.'],

  /* Save Our Date (after the couple): the month of the Nikah with its day marked once the guest taps Reveal Date */
  saveOurDate: { title: 'Save Our Date', year: 2026, month: 12, day: 21, reveal: 'Reveal Date', save: 'Save the Date', maps: 'View on Google Maps' },

  /* the one event */
  event: {
    title: 'Nikah Ceremony',
    weekday: 'Monday', day: '21', month: 'December', year: '2026', time: '2:00 PM – 5:00 PM',
    date: 'Monday, 21 December 2026',
    venue: 'The Kitchen Garden', place: 'Sialkot, Pakistan',
    local: '20261221T140000', localEnd: '20261221T170000', timeZone: 'Asia/Karachi',
    mapsUrl: 'https://maps.app.goo.gl/KAGqM6aHq6YW6QG3A?g_st=iw',     // the client's own link, used as it is
    ics: 'nikah.ics',
  },

  /* page 5: one absolute instant, 2:00 PM in Pakistan, so it is right in any guest's time zone */
  countdown: { heading: ['Counting Down', 'to Forever'], word: 'Nikah', target: '2026-12-21T14:00:00+05:00', note: ['Monday, 21 December 2026', '2:00 PM · Pakistan Standard Time'] },

  /* page 7 */
  closing: { title: 'Thank You', lines: ['Please join us in', 'prayer and celebration.'] },

  opening: {
    /* the envelope film with the client's M N on the wax seal in every frame, in champagne and ivory
       (tools/maham-azeem-nasir-hussain-nikah-film) */
    video: 'assets/opening-mn.mp4',
    poster: 'assets/opening-mn.webp',
    filmEndsAt: 5.5,          // the film's picture is finished here; the file then only holds an empty card
    music: 'assets/music.mp3',
    musicVolume: 0.8,
    musicFadeSeconds: 1.2,
  },
};
