/* ─────────────────────────────────────────────────────────────────────────────
   Sai Charan & Lakshmi — Engagement. Everything the page needs to know about
   the event lives here; index.html holds the words, js/app.js runs the page.
   Times are India time (Asia/Kolkata). Change durationMinutes rather than
   inventing an end time — the .ics and Google Calendar links are built from it.
   ───────────────────────────────────────────────────────────────────────────── */
export const invite = {
  slug: 'saicharan-lakshmi-engagement',
  title: 'Engagement Ceremony of Annamaneni Sai Charan & Gouravelly Lakshmi',
  couple: { first: 'Annamaneni Sai Charan', second: 'Gouravelly Lakshmi', short: 'Sai Charan & Lakshmi' },
  event: {
    /* local wall-clock start in Asia/Kolkata, as YYYY-MM-DD and HH:MM */
    date: '2026-11-01',
    time: '11:00',
    timeZone: 'Asia/Kolkata',
    utcOffset: '+05:30',
    durationMinutes: 180,
    day: 'Sunday',
    display: { date: '1 November 2026', time: '11:00 AM' },
  },
  venue: {
    name: 'Virupakshi Gardens',
    address: ['Karimnagar Road, Govindpalli,', 'Jagtial, Telangana – 505327'],
    /* the exact link the family shared — opened as-is */
    mapsUrl: 'https://maps.app.goo.gl/Fhd4a2JoTBdyartK8?g_st=ic',
  },
  description: 'You are warmly invited to the Engagement Ceremony of Annamaneni Sai Charan & Gouravelly Lakshmi — Sunday, 1 November 2026, 11:00 AM, Virupakshi Gardens, Karimnagar Road, Govindpalli, Jagtial, Telangana 505327.',
  music: 'assets/media/music-v2.mp3',   // the song with its 3.3 s lead-in and 16 s tail of silence trimmed
  video: 'assets/media/opening-cl.mp4',   // the designer's film with the CL seal in every frame (tools/saicharan-lakshmi-film.mjs)
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
};
