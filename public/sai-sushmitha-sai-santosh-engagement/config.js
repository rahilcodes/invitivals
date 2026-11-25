/* ─────────────────────────────────────────────────────────────
   Dr. Sai Sushmitha Reddy & Sai Santosh Reddy — Engagement Ceremony, Friday 4 December 2026, 7:30 PM onwards
   (client brief 2026-11-24). A separate invitation on the design of public/dr-mohammed-nihal-nooha, kept exactly as
   that design (client: "keep exactly same as reference link, just add engagement feel"); neither the reference nor
   its earlier copy is edited for this page.
   Only the details the client supplied are used: names, both families, the date, the start time ("onwards", so no
   end time), the venue, its address and its map link. Times are India time (+05:30): Manneguda is in Telangana.
   The bride's parents are the hosts; the groom's parentage is the client's own "S/o." line.
   After a change run  node tools/sai-sushmitha-sai-santosh-engagement.mjs  (it rewrites the .ics file and the tags).
   ───────────────────────────────────────────────────────────── */
const VENUE = 'BMR SARTHA CONVENTION';
const ADDRESS = 'Exit No. 12, Manneguda, Telangana.';
const MAPS = 'https://maps.app.goo.gl/cxGwBMV6bjLJPHjt9?g_st=iw';

export const config = {
  slug: 'sai-sushmitha-sai-santosh-engagement',
  /* used for the calendar entry and the sharing tags */
  couple: 'Dr. Sai Sushmitha Reddy & Sai Santosh Reddy',

  /* page 1: the invitation card (the reference's Bismillah place carries a Hindu invocation) */
  hero: {
    invocation: '|| Shri Ganeshaya Namah ||',
    title: 'Engagement Invitation',
    hosts: ['Smt. Beeravally Padmavathi', '& Sri Beeravally Gopal Reddy'],
    request: ['Together with our families, we cordially invite you', 'to celebrate the engagement ceremony of'],
    bride: 'Dr. Sai Sushmitha Reddy',
    and: 'AND',
    groom: 'Sai Santosh Reddy',
    groomOf: ['S/o.', 'Smt. & Sri Kotha Venkata', 'Sandhya Rani - Laxma Reddy'],
    blessing: 'With the blessings and love of our families.',
  },

  /* page 2, Save the Date: the month's calendar, the 4th marked once the guest taps Reveal Date */
  saveOurDate: {
    year: 2026, month: 12,
    marks: [{ day: 4, label: 'Engagement Ceremony' }],
    legend: [['Friday, 4th December 2026'], ['7:30 PM onwards']],
  },

  /* page 3: the reference's two cards — the ceremony (date, time, venue, its Save the Date and map buttons) and the
     families. `minutes` is null: only the start time was supplied, so the calendar entry has no end. */
  venue: VENUE,
  address: ADDRESS,
  mapsUrl: MAPS,
  events: [
    {
      key: 'engagement', title: 'Engagement Ceremony', date: 'Friday, 4th December 2026', time: '7:30 PM onwards',
      start: '2026-12-04T19:30:00+05:30', local: '20261204T193000', minutes: null,
      venue: `${VENUE}, ${ADDRESS}`, venueLines: [VENUE, ADDRESS], mapsUrl: MAPS, ics: 'engagement.ics',
    },
  ],
  families: [
    { label: "Bride's Parents", lines: ['Smt. Beeravally Padmavathi', 'Sri Beeravally Gopal Reddy'] },
    { label: "Groom's Parents", lines: ['Smt. & Sri Kotha Venkata', 'Sandhya Rani - Laxma Reddy'] },
  ],
  /* written into the calendar entry's description */
  programme: ['Engagement Ceremony – 7:30 PM onwards'],
  timeZone: 'Asia/Kolkata',

  /* page 4: the live countdown runs to the ceremony; from that moment the heading reads `done`, and `after` from the next day */
  countdown: {
    heading: ['Counting Down', 'to Forever'], word: 'Engagement Ceremony', target: '2026-12-04T19:30:00+05:30',
    done: ['The Day', 'Has Arrived'], after: ['Thank You', 'for Your Blessings'], afterFrom: '2026-12-05T00:00:00+05:30',
  },

  /* page 5 */
  closing: {
    title: 'Thank You',
    lines: ['Your presence and blessings will make', 'this special occasion even more memorable.', 'We look forward to celebrating', 'this beautiful beginning with you.'],
    from: 'Beeravally & Kotha Venkata Families',   // client, 25 Nov
  },

  opening: {
    /* the design's film, rebuilt with the couple's SS monogram on the wax seal in every frame
       (tools/sai-sushmitha-sai-santosh-film) */
    video: 'assets/opening-ss.mp4',
    poster: 'assets/opening-ss.webp',
    /* the film's picture is finished at about 5.6 s (the file then only holds the empty card), so the invitation
       takes over at this moment of the film's own clock; its real end, an error or a stall still hand over too */
    filmEndsAt: 5.5,
    music: 'assets/music.mp3',   // the design's own song (client, 2026-11-24)
    musicVolume: 0.8,
    musicFadeSeconds: 1.2,
  },
};
