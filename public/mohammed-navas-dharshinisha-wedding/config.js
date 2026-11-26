/* ─────────────────────────────────────────────────────────────
   Mohammed Navas & Dharshinisha — Nikah and Walima, Sunday 13 December 2026 (client brief 2026-11-22),
   a separate invitation on the design of public/dr-mohammed-nihal-nooha (never edited for this page).
   Only the details the client supplied are used: the two names, the date, the two start times, the venue and its
   map link. No family names, hosts, end times or contacts were given, so none are shown.
   Times are India time (+05:30): Muttukadu is near Chennai, Tamil Nadu.
   There is no RSVP on this invitation, by the client's instruction.
   After a change run  node tools/mohammed-navas-dharshinisha-wedding.mjs  (it rewrites the .ics files and the tags).
   ───────────────────────────────────────────────────────────── */
const VENUE = 'Nahar Gardens, Near Muttukadu Lake';
const MAPS = 'https://maps.app.goo.gl/d5x6Pb8irgB74yTT9?g_st=aw';

export const config = {
  slug: 'mohammed-navas-dharshinisha-wedding',
  /* used for the calendar entries and the sharing tags */
  couple: 'Mohammed Navas & Dharshinisha',

  /* page 1: no hosts were supplied, so the invitation line stands on its own */
  hero: {
    request: ['You are cordially invited to the', 'Nikah and Walima ceremonies of'],
    groom: ['Mohammed Navas'],
    and: 'AND',
    bride: 'Dharshinisha',
    when: 'Sunday, 13th December 2026',
  },

  /* page 2, Save Our Date: the month's calendar, the 13th marked once the guest taps Reveal Date */
  saveOurDate: {
    year: 2026, month: 12,
    marks: [{ day: 13, label: 'Nikah & Walima' }],
    legend: [['Sunday, 13 December 2026'], ['Nikah 11:00 AM', ' · ', 'Walima 1:00 PM']],
  },

  /* page 3, Our Functions (and the buttons of page 2). `start` is the time supplied. No end time was given, so
     `minutes` is null and every calendar entry carries the start only; set it (e.g. 120) to give the entries a length. */
  venue: VENUE,
  mapsUrl: MAPS,
  events: [
    {
      key: 'nikah', title: 'Nikah Ceremony', date: 'Sunday, 13th December 2026', time: '11:00 AM',
      start: '2026-12-13T11:00:00+05:30', local: '20261213T110000', minutes: null,
      venue: VENUE, venueLines: ['Nahar Gardens,', 'Near Muttukadu Lake'], mapsUrl: MAPS, ics: 'nikah.ics',
    },
    {
      key: 'walima', title: 'Walima Ceremony', date: 'Sunday, 13th December 2026', time: '1:00 PM',
      start: '2026-12-13T13:00:00+05:30', local: '20261213T130000', minutes: null,
      /* the Walima's address in full (client, 2026-11-26); the map link is the same one, as no other was supplied */
      venue: 'Nahar Gardens, Near Muttukadu Lake Bridge, Near Bus Stand, ECR',
      venueLines: ['Nahar Gardens,', 'Near Muttukadu Lake Bridge,', 'Near Bus Stand, ECR'], mapsUrl: MAPS, ics: 'walima.ics',
    },
  ],
  /* the day's programme, written into every calendar entry's description */
  programme: ['Nikah – 11:00 AM', 'Walima – 1:00 PM'],
  dayIcs: 'nikah-and-walima.ics',
  timeZone: 'Asia/Kolkata',

  /* page 4: the live countdown runs to the Nikah; from that moment the heading reads `done`, and `after` from the next day */
  countdown: {
    heading: ['Counting Down', 'to Forever'], word: 'Nikah', target: '2026-12-13T11:00:00+05:30',
    done: ['The Day', 'Has Arrived'], after: ['Thank You', 'for Your Duas'], afterFrom: '2026-12-14T00:00:00+05:30',
  },

  /* page 5 */
  closing: { title: 'Thank You', lines: ['We look forward to', 'your presence and Duas.'] },

  opening: {
    /* the design's film, rebuilt with the couple's ND monogram on the wax seal in every frame
       (tools/mohammed-navas-dharshinisha-film) */
    video: 'assets/opening-nd.mp4',
    poster: 'assets/opening-nd.webp',
    /* the film's picture is finished at about 5.6 s (the file then only holds the empty card), so the invitation
       takes over at this moment of the film's own clock; its real end, an error or a stall still hand over too */
    filmEndsAt: 5.5,
    music: 'assets/music.mp3',
    musicVolume: 0.8,
    musicFadeSeconds: 1.2,
  },
};
