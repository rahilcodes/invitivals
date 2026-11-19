/* ─────────────────────────────────────────────────────────────────────────────
   Sujatha K & Jeevan L — Engagement Ceremony (client brief, 2026-11-19). A separate page on the design of
   public/lakshmi-saicharan-engagement, which is never edited for this.
   Everything the page needs to know about the event lives here; index.html holds the words, js/app.js runs the page.
   Times are India time (Asia/Kolkata). Only start times were supplied ("onwards"), so there is no durationMinutes:
   the calendar entries carry no invented end. After a change here, run  node tools/sujatha-jeevan-engagement.mjs
   (event.ics) and bump ?v= in index.html and js/app.js.
   ───────────────────────────────────────────────────────────────────────────── */
const ADDRESS = ['No. 86, 10th Cross, Anjanaya Temple Street,', 'Malleswaram, Bangalore – 560003'];   // 560003 confirmed by the client (the brief read 56003)
export const invite = {
  slug: 'sujatha-jeevan-engagement',
  title: 'Engagement Ceremony – Sujatha K & Jeevan L',
  couple: { first: 'Sujatha K', second: 'Jeevan L', short: 'Sujatha K & Jeevan L' },
  event: {
    /* local wall-clock start in Asia/Kolkata, as YYYY-MM-DD and HH:MM */
    date: '2026-11-29',
    time: '10:30',
    timeZone: 'Asia/Kolkata',
    utcOffset: '+05:30',
    day: 'Sunday',
    display: { date: '29 November 2026', time: '10:30 AM' },
  },
  venue: {
    name: 'Asha Food Camp',
    address: ADDRESS,
    /* no map link was supplied: a Google Maps search for the venue by name and area, checked on 2026-11-19 */
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Asha%20Food%20Camp%2C%2010th%20Cross%2C%20Malleswaram%2C%20Bangalore%20560003',
  },
  description: 'You are warmly invited to the Engagement Ceremony of Sujatha K & Jeevan L — Sunday, 29 November 2026, 10:30 AM onwards, Asha Food Camp, Malleswaram, Bangalore.',
  /* what the calendar entry says */
  details: 'Engagement Ceremony of Sujatha K & Jeevan L\nSunday, 29 November 2026\nEngagement ceremony: 10:30 AM onwards\nLunch: 12:30 PM onwards\nVenue: Asha Food Camp, ' + ADDRESS.join(' '),
  music: 'assets/media/music-v2.mp3',   // the design's own song (none was supplied)
  video: 'assets/media/opening-sj.mp4', // the design's film with the couple's monogram on the seal in every frame
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
