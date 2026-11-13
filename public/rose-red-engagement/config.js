/* ─────────────────────────────────────────────────────────────────────────────
   Rose Red Engagement — the invitation's words. The page (js/app.js) draws only
   from this object, so a new couple is: copy the folder, edit this file, replace
   assets/audio/music.mp3 and assets/og.jpg. Times are ISO strings in India time.
   The artwork (assets/el/) is the designer's separated element pack, built by
   tools/build-rose-red-engagement-art.mjs — nothing in it belongs to one couple
   except the map panel, which names the venue's area (see venue.mapPanel).
   ───────────────────────────────────────────────────────────────────────────── */
export const invite = {
  slug: 'rose-red-engagement',
  occasion: 'Engagement Ceremony',
  couple: { first: 'Nandini S S', second: 'Madhu N', short: 'Nandini & Madhu' },
  hosts: {
    intro: 'Together with their families',
    names: 'Mr. Shivanna & Mrs. Taradevi',
    lines: ['warmly invite you', 'to the engagement ceremony', 'of their beloved daughter'],
  },
  blessing: 'Your presence will make our celebration more special.',
  /* ?to=Name in the link addresses each guest personally */
  guestFallback: 'You & Your Family',

  event: {
    start: '2026-11-15T12:30:00+05:30',
    end: '2026-11-15T16:30:00+05:30',
    day: 'Sunday',
    date: '15 November 2026',
    time: '12:30 PM onwards',
    title: 'Nandini & Madhu — Engagement Ceremony',
  },
  venue: {
    name: ['Udupi Sri Krishnarajathadri', 'Party Hall'],
    address: ['330, 13th Cross Rd, near Sri Saibaba', 'Devastana, Malleshwaram,', 'Bengaluru, Karnataka 560003'],
    area: 'Malleshwaram',
    /* the painted map panel already reads MALLESHWARAM / ಮಲ್ಲೇಶ್ವರಂ; set to false for another area and the
       area is written as live text over a plain panel instead */
    mapPanel: true,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Udupi Sri Krishnarajathadri Party Hall, 13th Cross Rd, Malleshwaram, Bengaluru 560003'),
  },
  thanks: {
    over: 'With all our love',
    title: 'Thank You',
    lines: ['for being a part of', 'our special journey.'],
    from: 'Shivanna & Taradevi · Family & Friends',
  },
  music: 'assets/audio/music.mp3',
  musicTitle: 'Tumhi Dekho Naa · sitar lofi',
  share: {
    title: 'Nandini & Madhu · Engagement Invitation',
    text: 'You are warmly invited to the engagement ceremony of Nandini S S & Madhu N — Sunday, 15 November 2026, 12:30 PM onwards, Malleshwaram, Bengaluru.',
  },
  ui: {
    tapSeal: 'Tap the seal to open',
    reveal: 'Touch or swipe to reveal',
    addToCalendar: 'Add to calendar',
    takeMeThere: 'Take me there',
    countdown: 'The celebration begins in',
    today: 'Today is the day!',
    past: 'With gratitude for celebrating with us',
    share: 'Share this invitation',
  },
  creditCampaign: 'rose-red-engagement',
};
