/* ─────────────────────────────────────────────────────────────
   Dr. Mohammed Nihal & Nooha — Nikah and Walima (client brief 2026-11-17), on the Modern Wedding design
   (public/modern-wedding, never edited for this). Every word below is the family's own, exactly as supplied;
   nothing they did not give (end times, addresses, contacts, more family names) is shown.
   Times are India time (+05:30): Shivamogga and Mangaluru are both in Karnataka.
   There is no RSVP on this invitation, by the client's instruction.
   ───────────────────────────────────────────────────────────── */
export const config = {
  /* the short form, used for the calendar entries and the closing */
  couple: 'Dr. Mohammed Nihal & Nooha',

  /* page 1 */
  hero: {
    hosts: 'Abdul Majeed Abbas and Family',
    request: ['Request the honour of your presence at the', 'Nikah and Walima ceremonies of'],
    groom: ['Dr. Mohammed Nihal', 'Abbas Majeed'],       // one name, set on two lines
    and: 'AND',
    bride: 'Nooha Masood',
    brideOf: ['Daughter of', 'Mr. and Mrs. Masood Ahmed'],
  },

  /* page 2, Save Our Date: the month's calendar with the two ceremonies marked */
  saveOurDate: { year: 2027, month: 1, marks: [{ day: 9, label: 'Nikah Ceremony' }, { day: 11, label: 'Walima Ceremony' }] },

  /* page 3, Our Functions (and the buttons of page 2). `start` is the only time supplied ("onwards"): the calendar entries begin then and carry no
     invented end. `mapsUrl` is the family's own link, used as it is. */
  events: [
    {
      key: 'nikah', title: 'Nikah Ceremony', date: 'Saturday, 9th January 2027', time: '11:30 AM onwards',
      start: '2027-01-09T11:30:00+05:30', local: '20270109T113000', venue: 'Hidden Leaf Resort, Shimoga', venueLines: ['Hidden Leaf Resort,', 'Shimoga'],
      mapsUrl: 'https://share.google/DJD3AS4V8UoEhtGd5', ics: 'nikah.ics',
    },
    {
      key: 'walima', title: 'Walima Ceremony', date: 'Monday, 11th January 2027', time: '11:30 AM onwards',
      start: '2027-01-11T11:30:00+05:30', local: '20270111T113000', venue: 'Indiana Convention Hall, Mangaluru', venueLines: ['Indiana Convention Hall,', 'Mangaluru'],
      mapsUrl: 'https://share.google/NmQoWq2kjiKA5V9Ii', ics: 'walima.ics',
    },
  ],
  timeZone: 'Asia/Kolkata',

  /* page 4: the live countdown runs to the Nikah */
  countdown: { lead: 'Until We Say', word: 'Nikah', target: '2027-01-09T11:30:00+05:30' },

  /* page 5 */
  closing: { title: 'Thank You', lines: ['We look forward to', 'your presence and Duas.'] },

  opening: {
    /* the film and its first frame, rebuilt with the family's NN on the wax seal in every frame
       (tools/dr-mohammed-nihal-nooha-film): the pack's own film was lettered for another couple */
    video: 'assets/opening-nn.mp4',
    poster: 'assets/opening-nn.webp',
    /* The film file runs 10.0 s, but its picture is finished at about 5.6 s: from there to the end it only holds the
       empty card (that hold was the "pause, then a blank screen" of the reference). The invitation therefore takes
       over at this moment of the film's own clock (not a timer: a film that buffers is waited for), and the film's
       real end, an error or a stall still hand over too. */
    filmEndsAt: 5.5,
    /* no `seal` overlay any more: the NN monogram is in the film's own pixels now, so nothing lies over it */
    music: 'assets/music.mp3',
    musicVolume: 0.8,
    musicFadeSeconds: 1.2,
  },
};
