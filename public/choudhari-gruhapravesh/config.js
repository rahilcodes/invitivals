/* Choudhari Family — Gruhapravesh (Housewarming Ceremony) invitation (client brief 2026-11-19). ALL client information
   lives in this one file. After editing it, run:  node tools/choudhari-gruhapravesh.mjs   (it rewrites index.html
   from these values; the page's script reads the same file for the countdown and the song).
   Every word is the client's own. The brief asked for: Shree Ganesha only (no other deity, no Venkateshwara picture),
   no Pooja schedule, no name for the home, no other family names, no RSVP of any kind. Only the start time was
   given, so the calendar entry has no invented end. */
export const invite = {
  slug: 'choudhari-gruhapravesh',
  title: 'Gruhapravesh – Choudhari Family',

  /* the cover: Shree Ganesha and the two lines of the greeting, exactly as supplied */
  hero: {
    deva: ['॥ श्री गणेश प्रसन्न ॥', 'श्री गणेशाय नमः'],
    invite: 'We cordially invite you to our',   // small line above the title (client, 20 Nov)
    ceremony: 'Gruhapravesh',
    sub: null,                                    // 'Housewarming Ceremony' removed with the new wording (client, 20 Nov)
    family: 'Choudhari Family',
    showFamily: false,                            // the family name is no longer shown on the cover (client, 20 Nov); it stays in the closing and the link preview
    scrollCue: 'SCROLL TO EXPLORE',
  },

  /* the invitation, in the client's words */
  heading: null,   // the second GRUHAPRAVESH heading and its lotus divider were removed (client, 20 Nov)
  paragraphs: [
    'With the blessings of Shree Ganesha, we are delighted to invite you and your family to grace the auspicious occasion of our Gruhapravesh (Housewarming Ceremony).',
    'As we step into our new home and begin a beautiful new chapter of life, your presence and blessings would make this occasion even more special.',
  ],

  /* the one event. India time. */
  timeZone: 'Asia/Kolkata',
  utcOffset: '+05:30',
  event: { name: 'Celebratory Dinner', date: '2026-11-25', dateText: '25th November 2026', time: '19:00', label: '7:00 PM onwards' },

  venue: {
    lines: ['N-74, First Floor,', 'Near Reshimbagh Garden, Nagpur'],
    full: 'N-74, First Floor, Near Reshimbagh Garden, Nagpur',
    /* the family's own Google Maps link, exactly as supplied (checked 2026-11-19: it opens a pin at 21.132981, 79.110518, Nagpur) */
    mapsUrl: 'https://goo.gl/maps/WB7qovrxSJGkxieMA?g_st=aw',
  },
  contact: { label: '+91 7028788669', tel: '+917028788669' },

  calendar: {
    title: 'Gruhapravesh – Choudhari Family',
    details: 'Gruhapravesh (Housewarming Ceremony) of the Choudhari Family.\n25th November 2026, 7:00 PM onwards.\nVenue: N-74, First Floor, Near Reshimbagh Garden, Nagpur.\nContact: +91 7028788669',
  },

  closing: { message: 'We look forward to celebrating this special milestone with you.', regards: 'Awaiting the pleasure of your company', sign: 'Choudhari Family' },

  /* the client's own song; null = no song and no music button */
  music: 'assets/music.mp3',   // the client's file (OM GAN GANPATAYE, received 2026-11-19): its first two minutes, on a loop
};
