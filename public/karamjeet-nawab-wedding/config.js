/* ─────────────────────────────────────────────────────────────
   Karamjeet Kaur weds Nawab Singh Sekhon: a Sikh wedding invitation on the Brown Theme design (bride's side:
   the Gill family invites). A separate invitation: nothing here belongs to another client's page.
   Every word on the page comes from here (and index.html's meta tags), exactly as the family wrote it.
   Dates are ISO in India time (+05:30).
   ───────────────────────────────────────────────────────────── */
export const config = {
  couple: { bride: 'Karamjeet Kaur', groom: 'Nawab Singh Sekhon' },

  /* page 1 */
  hero: {
    ikOnkar: 'assets/ik-onkar.webp',   /* the Ik Onkar over the invitation; set to '' to leave it out */
    blessings: ['With the heavenly blessings', 'of their elders,'],
    parents: ['Sardarni Paramjeet Kaur &', 'Late S. Ranjeet Singh Gill'],
    request: ['request the pleasure of your gracious presence', 'and blessings on the auspicious occasion', 'of the wedding of their daughter'],
    weds: 'Weds',
    date: 'Sunday · 20 December 2026',
    venue: 'The Regal Classic, Dirba',
    coupleImage: 'assets/couple.webp',
    coupleAlt: 'The bride and groom, seen from behind: he in a brown embroidered sherwani and turban, she in a matching bridal lehenga and dupatta',
  },

  /* the two families */
  families: {
    bride: { label: 'The Bride', relation: 'Daughter of', parents: ['Sardarni Paramjeet Kaur', '& Late S. Ranjeet Singh Gill'], village: 'Village: Seona' },
    groom: { label: 'The Groom', relation: 'Son of', parents: ['Sardarni Daljinder Kaur', '& Master S. Jaswant Singh Sekhon'], village: 'Village: Pipal The, Jind' },
  },

  /* the date on the parchment: the wedding day and the hour of the Anand Karaj */
  date: { day: '20', suffix: 'th', month: 'December', year: '2026', time: '10:30 AM' },

  /* the wedding, for the countdown (it runs to the Anand Karaj) and Save the Date */
  wedding: { start: '2026-12-20T10:30:00+05:30', dateLine: '20 December 2026', weekday: 'Sunday', time: 'Anand Karaj · 10:30 AM' },

  /* the two days (detail pages). `start`/`end` are the calendar entry: the family gave start times only, so each
     entry's end is the hour noted beside it.
     Only the wedding venue has a Google Maps link (the family's own, used exactly as supplied); the residence has none. */
  days: [
    {
      key: 'day1', date: '19 December 2026', weekday: 'Saturday', title: 'Pre-Wedding Celebrations', titleLines: ['Pre-Wedding', 'Celebrations'], card: 'Shagan 3:00 PM · Jago 6:00 PM',
      schedule: [['3:00 PM', 'Shagan Ceremony'], ['6:00 PM', 'Jago Ceremony']],
      venue: 'Our Residence', address: ['Village Seona, PO Badshahpur.'],
      mapsUrl: '', ics: 'event-19dec.ics', start: '2026-12-19T15:00:00+05:30', end: '2026-12-19T21:00:00+05:30' /* three hours after the Jago begins */,
      calendarTitle: 'Karamjeet Kaur & Nawab Singh Sekhon · Shagan & Jago',
    },
    {
      key: 'day2', main: true, date: '20 December 2026', weekday: 'Sunday', title: 'Wedding Ceremony', titleLines: ['Wedding', 'Ceremony'], card: 'Anand Karaj 10:30 AM · The Regal Classic, Dirba',
      schedule: [['9:00 AM', 'Arrival of Barat'], ['10:30 AM', 'Anand Karaj'], ['12:00 PM', 'Wedding Lunch'], ['4:00 PM', 'Vidai']],
      venue: 'The Regal Classic', address: ['Dirba.'],
      mapsUrl: 'https://maps.app.goo.gl/ADWkDFmXzhfkApjC6', ics: 'event.ics', start: '2026-12-20T09:00:00+05:30', end: '2026-12-20T17:00:00+05:30' /* an hour after the Vidai begins */,
      calendarTitle: 'Wedding of Karamjeet Kaur & Nawab Singh Sekhon',
    },
  ],

  /* the countdown page */
  countdown: { title: ['The Countdown', 'to Forever'], lines: ['The wait is almost over.', 'A beautiful new beginning awaits!'], done: 'The day is here. A beautiful new beginning begins!', units: ['Days', 'Hours', 'Minutes', 'Seconds'] },

  /* the Save the Date page: the wedding day with Add to Calendar and the venue map */
  saveTheDate: { title: 'Save the Date', button: 'Save the Date', maps: 'View on Google Maps', labels: ['Date', 'Anand Karaj'], time: '10:30 AM' },

  /* the closing, in the family's words */
  closing: {
    love: 'With Love & Blessings,',
    family: 'The Gill Family',
    specialLabel: 'Special Invitation From',
    specialName: 'Rachhpal Singh Gill',
    specialRelation: '(Brother)',
    lines: 'Your gracious presence and blessings will make these celebrations truly special.',
  },

  opening: {
    video: 'assets/opening.mp4',
    poster: 'assets/opening.webp',
    music: 'assets/music.mp3',
    /* the film's own soundtrack plays with the film; the invitation's music starts when the film is over */
    musicFadeSeconds: 3,
    musicVolume: 0.8,
    /* the design's film has a lettered wax seal: this face (an embossed flower, no initials) is laid over it,
       placed by these fractions of the film's 720×1280 frame (centre and radius), until the seal breaks at
       `sealUntil` seconds; a burst of light then covers the flying pieces, fading out by `burstEnd` */
    sealFace: 'assets/seal.png',
    seal: { cx: 0.526, cy: 0.499, r: 0.141 },
    sealUntil: 2.42,
    burstEnd: 3.3,
    /* a film that never plays or stalls gives way to the invitation after this long */
    filmMaxSeconds: 14,
  },
};
