/* ─────────────────────────────────────────────────────────────
   Christian wedding "Golden Aisle" — Invitivals design demo.
   EVERY editable word, date, link and file path lives here (plus the meta tags in index.html).

   The names, dates, venues and copy below are the designer's sample text, read from the pack's
   MOCKUP.png and WITH TEXT TEMPLATE. Nothing has been invented beyond it: fields marked ⚠️ are
   not in the pack and stay empty until the couple supplies them.
   Dates are ISO with the venue's own UTC offset (Jakarta, Indonesia = +07:00).
   ───────────────────────────────────────────────────────────── */
export const config = {
  couple: { groom: 'Adrian', bride: 'Elina' },
  timezone: 'Asia/Jakarta',

  /* the wedding day: countdown, Save the Date, calendar files */
  wedding: {
    start: '2024-11-16T10:00:00+07:00', // ⚠️ sample date from the mockup (already past → the countdown shows its "past" line)
    weekday: 'Saturday',
    dateLine: 'Nov 16, 2024',
  },

  hero: {
    top: ['Together with', 'their families'],
    and: '&',
    invite: ['Joyfully invite you to celebrate', 'their wedding'],
    scroll: 'Scroll to explore',
  },

  specialDay: {
    title: 'Our Special Day',
    sub: 'Scratch to reveal the date',
    foil: 'Scratch here',
    fallback: 'Tap to reveal',
    revealed: 'The date is revealed',
  },

  details: {
    title: 'Wedding Details',
    cards: [
      { icon: 'calendar', label: 'Saturday', value: 'Nov 16, 2024' },
      { icon: 'clock', label: 'Ceremony', value: '10:00 AM' },
      { icon: 'rings', label: 'Reception', value: '06:00 PM' },
      { icon: 'map-pin', label: 'Grace Church', lines: ['123 Faith Avenue', 'Jakarta, Indonesia'] },
    ],
  },

  story: {
    title: 'Our Love Story',
    sub: 'A journey of faith, love and grace',
    items: [
      { title: 'We Met', date: 'Jun 12, 2019', text: ['A chance meeting,', 'guided by His perfect timing.'], photo: 'assets/photo-closeup.webp?v=2', pos: '50% 30%' },
      { title: 'We Grew', date: 'Aug 20, 2020', text: ['Through every season,', 'He made our love stronger.'], photo: 'assets/photo-beach.webp?v=2', pos: '52% 30%' },
      { title: 'We Chose Forever', date: 'Jan 14, 2024', text: ['With prayer, courage', 'and unending grace.'], photo: 'assets/photo-polaroid.webp?v=2', pos: '50% 35%' },
    ],
  },

  families: {
    title: 'Our Families',
    groom: { label: 'The Groom’s Family', names: ['Mr. Daniel Tan', 'Mrs. Grace Tan'] },
    bride: { label: 'The Bride’s Family', names: ['Mr. Michael Lim', 'Mrs. Sarah Lim'] },
  },

  /* the functions: each row opens its own details view with Directions and Add to Calendar.
     mapsUrl ⚠️: paste the couple's verified Google Maps link; empty = a Maps search for the address. */
  schedule: {
    title: 'The Wedding Schedule',
    tap: 'Tap for details',
    events: [
      {
        key: 'matrimony', icon: 'church', title: 'Holy Matrimony',
        time: '10:00 AM – 11:30 AM', start: '2024-11-16T10:00:00+07:00', end: '2024-11-16T11:30:00+07:00',
        venue: 'Grace Church', address: ['123 Faith Avenue', 'Jakarta, Indonesia'], mapsUrl: '',
      },
      {
        key: 'reception', icon: 'champagne', title: 'Wedding Reception',
        time: '06:00 PM – 10:00 PM', start: '2024-11-16T18:00:00+07:00', end: '2024-11-16T22:00:00+07:00',
        venue: 'The Royal Garden', address: ['456 Celebration Road', 'Jakarta, Indonesia'], mapsUrl: '',
      },
      {
        key: 'dinner', icon: 'cutlery', title: 'Dinner & Celebration',
        time: '07:00 PM – 10:00 PM', start: '2024-11-16T19:00:00+07:00', end: '2024-11-16T22:00:00+07:00',
        note: ['Good food, great company', 'and a lifetime of blessings.'],
        venue: '', address: [], mapsUrl: '', // ⚠️ the mockup names no venue for the dinner
      },
    ],
    detail: { directions: 'Get Directions', calendar: 'Add to Calendar', back: 'Back', date: 'Saturday, Nov 16, 2024' },
  },

  venues: {
    title: 'Our Venue',
    button: 'View Location',
    items: [
      { label: 'Holy Matrimony', name: 'Grace Church', address: ['123 Faith Avenue', 'Jakarta, Indonesia'], photo: 'assets/venue-church.webp?v=2', alt: 'A white church with a tall spire among trees at golden hour', mapsUrl: '' },
      { label: 'Wedding Reception', name: 'The Royal Garden', address: ['456 Celebration Road', 'Jakarta, Indonesia'], photo: 'assets/venue-reception.webp?v=2', alt: 'A ballroom with a crystal chandelier and round tables dressed in white', mapsUrl: '' },
    ],
  },

  quote: { text: ['“Two are better than one,', 'for if one falls, the other will lift them up.”'], ref: 'Ecclesiastes 4:9' },

  countdown: {
    title: 'Our Countdown',
    sub: 'Counting the days to forever',
    units: ['Days', 'Hours', 'Minutes', 'Seconds'],
    past: 'The day has come — thank you for celebrating with us.',
    missing: 'The date will be announced soon.',
  },

  memories: {
    title: 'Our Memories',
    sub: 'A glimpse of our journey',
    photos: [
      { src: 'assets/photo-closeup.webp?v=2', alt: 'Adrian and Elina, foreheads touching, among white and peach flowers', pos: '50% 35%' },
      { src: 'assets/photo-rings.webp?v=2', alt: 'Their hands with wedding rings over a bouquet of roses', pos: '50% 50%' },
      { src: 'assets/photo-beach.webp?v=2', alt: 'Walking hand in hand through a garden at sunset', pos: '50% 40%' },
      { src: 'assets/photo-walking.webp?v=2', alt: 'Together on the beach as the sun sets', pos: '50% 55%' },
      { src: 'assets/photo-polaroid.webp?v=2', alt: 'A kiss before the church at golden hour', pos: '50% 40%' },
    ],
  },

  /* RSVP ⚠️: one destination is needed before replies can be sent — none in the pack.
     whatsapp: country code + number, digits only (opens WhatsApp with the reply written out)
     endpoint: a URL that accepts a JSON POST {name, email, attending, message}
     email:    a mailto fallback */
  rsvp: {
    title: 'Kindly Reply',
    sub: 'Let us know if you can join our special day',
    labels: { name: 'Your Name', email: 'Your Email', attend: 'Will You Attend?', message: 'Leave a Message (Optional)' },
    options: ['Joyfully accept', 'Regretfully decline'],
    button: 'Send RSVP',
    pending: 'The RSVP line will be connected once the couple shares their number.',
    whatsapp: '', endpoint: '', email: '',
  },

  wishes: {
    title: 'Wedding Wishes',
    sub: 'Your prayers and blessings mean the world to us',
    button: 'Send Your Wishes',
    whatsapp: '', email: '', // ⚠️ where the wishes go
  },

  gift: {
    title: 'A Special Gift',
    sub: 'Your love, prayers and support are the greatest gift of all',
    button: 'View Gift Details',
    /* ⚠️ e.g. [{ label: 'Bank transfer', value: 'Bank · Account name · Account number' }, { label: 'Registry', value: 'https://…' }] */
    details: [],
    note: 'Gift details will be shared by the couple.',
  },

  thanks: {
    title: 'Thank You',
    lines: ['For being part of', 'our journey'],
    closing: ['May our marriage be a testimony', 'of His grace, love and faithfulness.'],
  },

  opening: {
    poster: 'assets/opening.webp',
    video: 'assets/opening.mp4',
    /* the painted "Tap to Open" pill on the poster, in % of the poster: the real button sits on it */
    tapBox: { x: 33, y: 73.5, w: 34, h: 6 },
    music: 'assets/music.mp3', // "Jessie's Land" — supplied with the brief; set '' for no music
    musicVolume: 0.8,
    musicFadeSeconds: 3,
    filmMaxSeconds: 14, // a film that never plays or stalls gives way after this long
    replay: 'Replay the opening',
  },
};
