/* ─────────────────────────────────────────────────────────────
   Marathi wedding design, English edition — champagne, magenta and gold
   (designer pack "marathi wedding"). Sample content is the pack's own text
   reference, translated: Aditi & Siddharth, Royal Palace, Pune, 21–24 November
   2024 (the date is the designer's sample, not a confirmed wedding date).
   Everything the page shows comes from this object. Dates are ISO in India
   time (+05:30); the weekday and month are derived from the date.
   ───────────────────────────────────────────────────────────── */
export const config = {
  couple: {
    bride: 'Aditi',
    groom: 'Siddharth',
    and: 'and',
    short: 'Aditi & Siddharth',   // calendar entries, the page title
  },

  /* screen 1 — the hero over the sunset palace */
  hero: {
    intro: ['The beginning of', 'our new journey ...'],
    invite: ['request the pleasure', 'of your company', 'at their wedding celebration'],
  },

  /* screen 2 — three embroidered frames. The pack's frames carry their own
     pictures; the captions are written by the page. Put the couple's photo
     paths in `photos` to show them inside the frames instead. */
  memories: {
    captions: ['Our Story...', 'Our Bond...', 'Together Forever...'],
    photos: ['', '', ''], // e.g. ['assets/photo-1.jpg', 'assets/photo-2.jpg', 'assets/photo-3.jpg']
  },

  /* screen 3 — the calendar. Shows the month of the event named in `event`;
     the printed button ("Reveal the Date") lights the day. */
  date: {
    title: ['Our', 'Wedding Date'],
    event: 'wedding',
    revealLabel: 'Reveal the Date',
    saveLabel: 'Save to Calendar',
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],   // Monday first, as printed on the pack's calendar
    weekdayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },

  /* screen 4 — one row per function, in display order. `art` is the pack's
     picture for the row: haldi (turmeric bowl), mehndi (bowl of colours),
     mandap (the wedding stage), throne (the reception seat). `time` is shown
     as written; `start`/`end` feed the calendar entry. */
  events: [
    {
      key: 'haldi', title: 'Haldi Ceremony', art: 'haldi',
      start: '2024-11-21T10:00:00+05:30', end: '2024-11-21T13:00:00+05:30',
      time: '10:00 AM',
      venue: 'Royal Palace', address: '123, Solution Street, Pune, Maharashtra',
      mapsUrl: '', // paste the venue's own Google Maps link; empty = a Google Maps search for the address
    },
    {
      key: 'mehndi', title: 'Mehendi Ceremony', art: 'mehndi',
      start: '2024-11-22T18:00:00+05:30', end: '2024-11-22T21:00:00+05:30',
      time: '6:00 PM',
      venue: 'Royal Palace', address: '123, Solution Street, Pune, Maharashtra',
      mapsUrl: '',
    },
    {
      key: 'wedding', title: 'Wedding Ceremony', art: 'mandap',
      start: '2024-11-24T11:00:00+05:30', end: '2024-11-24T14:00:00+05:30',
      time: '11:00 AM',
      venue: 'Royal Palace', address: '123, Solution Street, Pune, Maharashtra',
      mapsUrl: '',
    },
    {
      key: 'reception', title: 'Reception', art: 'throne',
      start: '2024-11-24T19:00:00+05:30', end: '2024-11-24T22:30:00+05:30',
      time: '7:00 PM',
      venue: 'Royal Palace', address: '123, Solution Street, Pune, Maharashtra',
      mapsUrl: '',
    },
  ],

  /* screen 5 — the venue */
  venue: {
    title: 'Venue',
    name: 'Royal Palace',
    address: ['123, Solution Street,', 'Pune, Maharashtra'],
    mapsUrl: '', // the venue's Google Maps link; empty = a Google Maps search for the address
  },

  /* screen 6 — attendance and wishes. Replies are stored by rsvp.php next to
     this page (data/entries.php); the family reads them at rsvp.php?key=… */
  rsvp: {
    title: 'Your Presence',
    sub: 'is precious to us',
    button: 'Confirm Attendance', // written on the pack's envelope button
    wishesTitle: 'Wishes',
    wishesLines: ['Your blessings will always', 'stay with us on our', 'new journey...'],
    wishPlaceholder: 'Write your wishes here...',
    endpoint: 'rsvp.php',
    storageKey: 'marathi-wedding:rsvp',
    maxGuests: 10,
    form: { // the attendance sheet opened by the envelope button
      title: 'Confirm Attendance',
      name: 'Your name',
      accept: 'I will be there',
      decline: 'I am unable to attend',
      guests: 'Number of guests',
      send: 'Send',
      needChoice: 'Please choose whether you will be joining us.',
      needName: 'Please enter your name.',
      needWish: 'Please write your wishes first.',
      failed: 'That did not go through. Please try again.',
      thanksYes: 'Thank you, {name}! Your attendance is confirmed.',
      thanksNo: 'Thank you, {name}. You will be missed.',
      recordedYes: 'Recorded: {name} · attending',
      recordedNo: 'Recorded: {name} · unable to attend',
      wishSent: 'Your wishes have been sent. Thank you!',
      close: 'Close',
    },
  },

  /* screen 7 — blessings. The printed button opens these details; leave them
     empty and the button says the details are not configured yet. */
  gift: {
    lines: ['Your love is', 'the only gift we need...'],
    button: 'Gift as a Blessing', // written on the pack's button
    sheetTitle: 'Gift as a Blessing',
    upiId: '',        // e.g. 'aditi@upi'
    upiName: '',      // the account holder shown with the UPI ID
    bank: [],         // e.g. ['Bank: ...', 'Account no.: ...', 'IFSC: ...']
    note: '',         // any line to show above the details
    copy: 'Copy', copied: 'Copied',
    notConfigured: 'Gift details have not been added yet.',
  },

  /* screen 8 — thank you */
  closing: {
    title: 'With heartfelt',
    big: 'Gratitude',
    lines: ['Your presence on our', 'special day means', 'the world to us...'],
  },

  opening: {
    poster: 'assets/open.webp',
    tap: 'Tap to Open',
    video: 'assets/opening.mp4',
    music: 'assets/music.mp3', // Sanson Ki Mala Pe (instrumental, slowed + reverb)
    musicVolume: 0.75,
    musicFadeSeconds: 3,
  },

  ui: {
    mute: 'Mute music', unmute: 'Play music',
    scroll: 'Scroll',
    skip: 'Continue',
    mapsLabel: 'View on Map', // written on the pack's map button
    calendarDownloaded: 'Calendar file downloaded — open it to save the date.',
  },
};
