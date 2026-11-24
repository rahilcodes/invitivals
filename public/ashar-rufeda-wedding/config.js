/* ─────────────────────────────────────────────────────────────
   Ashar & Rufeda — Nikah (Friday 25 December 2026, After Jumma Namaz) and Walima Ceremony & Reception (Saturday
   26 December 2026, 7:00 PM – 10:00 PM), client brief 2026-11-24: a separate invitation on the design of
   public/dr-mohammed-nihal-nooha (never edited for this page; this folder began as a copy of its Navas & Dharshinisha copy).
   Every word is the client's own. The Nikah has no clock time ("After Jumma Namaz"): its calendar entry is an
   all-day entry on 25 December whose text says "After Jumma Namaz" — no time is invented. The Walima has its
   supplied start and end. Times are India time (+05:30): Vasai is in Maharashtra.
   After a change run  node tools/ashar-rufeda-wedding.mjs  (it rewrites the .ics files, the tags and the cover).
   ───────────────────────────────────────────────────────────── */
export const config = {
  slug: 'ashar-rufeda-wedding',
  couple: 'Ashar & Rufeda',

  /* page 1: the invitation card */
  hero: {
    request: ['With the blessings of Almighty Allah', 'and the love of our families,', 'we request the honour of your presence', 'at the Nikah of'],
    groom: 'Ashar',
    groomOf: ['son of', 'Hajiyani Shainaz Hussain Bhimani', 'and Haji Hussain Majid Bhimani'],
    and: 'AND',
    bride: 'Rufeda',
    brideOf: ['daughter of', 'Shainaz Rafiq Shaikh', 'and Rafiq Hajimiya Shaikh'],
  },

  /* page 2, Save Our Date: December 2026, the 25th and 26th marked once the guest taps Reveal Date */
  saveOurDate: {
    year: 2026, month: 12,
    marks: [{ day: 25, label: 'Nikah Ceremony' }, { day: 26, label: 'Walima Ceremony & Reception' }],
    legend: [['25 December', ' · Nikah, After Jumma Namaz'], ['26 December', ' · Walima, 7:00 PM – 10:00 PM']],
  },

  /* page 3, Our Functions (and the buttons of page 2) */
  events: [
    {
      key: 'nikah', title: 'Nikah Ceremony', titleLines: ['Nikah Ceremony'],
      date: 'Friday, 25 December 2026', time: 'After Jumma Namaz',
      allDay: '20261225',                       // no clock time supplied: an all-day calendar entry on the day
      venue: 'Jama Masjid, Mussagalli, Vasai – 401201', venueLines: ['Jama Masjid, Mussagalli,', 'Vasai – 401201'],
      mapsUrl: 'https://maps.app.goo.gl/wv5pznntaszpF1Ww8?g_st=iwb', ics: 'nikah.ics',
    },
    {
      key: 'walima', title: 'Walima Ceremony & Reception', titleLines: ['Walima Ceremony', '& Reception'],
      date: 'Saturday, 26 December 2026', time: '7:00 PM – 10:00 PM',
      start: '2026-12-26T19:00:00+05:30', local: '20261226T190000', minutes: 180,
      venue: 'GG Ground, Near Bus Depot, Vasai Gaon, Vasai West – 401201', venueLines: ['GG Ground, Near Bus Depot,', 'Vasai Gaon, Vasai West – 401201'],
      mapsUrl: 'https://maps.app.goo.gl/4aDhjrSJnavqqW2FA?g_st=iwb', ics: 'walima.ics',
    },
  ],
  dayIcs: 'nikah-and-walima.ics',
  timeZone: 'Asia/Kolkata',

  /* page 4: the countdown runs to the Nikah day (no clock time was given, so it counts to the start of 25 December) */
  countdown: {
    heading: ['Counting Down', 'to Forever'], word: 'Nikah', target: '2026-12-25T00:00:00+05:30',
    done: ['The Day', 'Has Arrived'], after: ['Thank You', 'for Your Duas'], afterFrom: '2026-12-27T00:00:00+05:30',
  },

  /* page 5 */
  closing: { title: 'Thank You', lines: ['We look forward to', 'your presence and Duas.'] },

  opening: {
    /* the design's film, rebuilt with the couple's A R monogram on the wax seal (tools/ashar-rufeda-film) */
    video: 'assets/opening-ar.mp4',
    poster: 'assets/opening-ar.webp',
    filmEndsAt: 5.5,
    music: 'assets/music.mp3',
    musicVolume: 0.8,
    musicFadeSeconds: 1.2,
  },
};
