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
  music: 'assets/media/music.mp3',
  video: 'assets/media/opening.mp4',
  /* give up on the opening film after this long and go straight to the invitation */
  videoTimeoutMs: 20000,
  /* the opening film shows the envelope's wax seal (designer's "A G") for its first ~3.8s: the CL seal
     (assets/el/seal-cl.webp) is laid over it, following the camera. Measured on the film by template
     matching, 2026-10-23: [time s, centre x, centre y (fractions of the frame), scale, glare 0–1].
     At scale 1 the disc is 196/941 of the frame wide. It bows out as the flap lifts (3.72s → 3.85s). */
  seal: {
    size: 196 / 941,
    fadeOut: [3.72, 3.85],
    track: [
      [0, .5016, .5203, 1, 0], [.5, .5016, .5219, 1, 0], [1, .5016, .5235, 1.08, 0], [1.5, .4988, .525, 1.15, 0],
      [2, .4988, .5281, 1.21, 0], [2.2, .4988, .5281, 1.23, .05], [2.3, .4988, .5281, 1.25, .18], [2.4, .4988, .5297, 1.26, .36],
      [2.5, .4988, .5297, 1.27, .68], [2.6, .4988, .5297, 1.29, .88], [2.7, .4988, .5313, 1.3, 1], [2.9, .4988, .5313, 1.32, .95],
      [3, .4988, .5313, 1.33, .84], [3.1, .4988, .5313, 1.33, .75], [3.2, .4972, .5313, 1.34, .62], [3.3, .4972, .5313, 1.35, .43],
      [3.4, .4972, .5300, 1.36, .30], [3.5, .4988, .5266, 1.38, .19], [3.6, .4988, .5203, 1.39, .21], [3.7, .4988, .5078, 1.39, .27], [3.85, .4988, .4990, 1.39, .3],
    ],
  },
  creditCampaign: 'saicharan-lakshmi-engagement',
};
