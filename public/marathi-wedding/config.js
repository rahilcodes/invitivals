/* ─────────────────────────────────────────────────────────────
   Marathi wedding — champagne, magenta and gold (designer pack "marathi wedding").
   Sample content is the pack's own text reference: आदिती आणि सिद्धार्थ,
   रॉयल पॅलेस, पुणे, 21–24 November 2024 (the date is the designer's sample,
   not a confirmed wedding date).
   Everything the page shows comes from this object. Dates are ISO in India
   time (+05:30); the Marathi weekday and month are derived from the date.
   ───────────────────────────────────────────────────────────── */
export const config = {
  couple: {
    bride: 'आदिती',
    groom: 'सिद्धार्थ',
    and: 'आणि',
    short: 'आदिती आणि सिद्धार्थ',   // calendar entries, the page title
    latin: 'Aditi & Siddharth',     // link previews
  },

  /* screen 1 — the hero over the sunset palace */
  hero: {
    intro: ['आमच्या', 'नव्या प्रवासाची', 'सुरुवात ...'],
    invite: ['यांच्या', 'शुभविवाह सोहळ्याचे', 'आपणांस सादर निमंत्रण'],
  },

  /* screen 2 — three embroidered frames. The pack's frames carry their own
     pictures and captions (आपली गोष्ट…, हमारी बंधन…, सदैव सोबत…); put the
     couple's photo paths here to show them inside the frames instead. */
  memories: {
    photos: ['', '', ''], // e.g. ['assets/photo-1.jpg', 'assets/photo-2.jpg', 'assets/photo-3.jpg']
  },

  /* screen 3 — the calendar. Shows the month of the event named in `event`;
     "तारीख उलगडा करा" (printed on the pack's button) reveals the day. */
  date: {
    title: ['आमच्या', 'शुभविवाहाची तारीख'],
    event: 'wedding',
    saveLabel: 'कॅलेंडरमध्ये जतन करा',
    weekdays: ['सो', 'मं', 'बु', 'गु', 'शु', 'श', 'र'],   // Monday first, as printed on the pack's calendar (whose Sunday reads 'वि'; 'र' for रविवार here)
    weekdayNames: ['सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार'],
    months: ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'],
  },

  /* screen 4 — one row per function, in display order. `art` is the pack's
     picture for the row: haldi (turmeric bowl), mehndi (bowl of colours),
     mandap (the wedding stage), throne (the reception seat). `time` is shown
     as written; `start`/`end` feed the calendar entry. */
  events: [
    {
      key: 'haldi', title: 'हळदी समारंभ', art: 'haldi',
      start: '2024-11-21T10:00:00+05:30', end: '2024-11-21T13:00:00+05:30',
      time: 'सकाळी 10:00 वा.',
      venue: 'रॉयल पॅलेस', address: '123, सोलोलेशन स्ट्रीट, पुणे, महाराष्ट्र',
      mapsUrl: '', // paste the venue's own Google Maps link; empty = a Google Maps search for the address
    },
    {
      key: 'mehndi', title: 'मेहेंदी समारंभ', art: 'mehndi',
      start: '2024-11-22T18:00:00+05:30', end: '2024-11-22T21:00:00+05:30',
      time: 'संध्याकाळी 6:00 वा.',
      venue: 'रॉयल पॅलेस', address: '123, सोलोलेशन स्ट्रीट, पुणे, महाराष्ट्र',
      mapsUrl: '',
    },
    {
      key: 'wedding', title: 'विवाह समारंभ', art: 'mandap',
      start: '2024-11-24T11:00:00+05:30', end: '2024-11-24T14:00:00+05:30',
      time: 'सकाळी 11:00 वा.',
      venue: 'रॉयल पॅलेस', address: '123, सोलोलेशन स्ट्रीट, पुणे, महाराष्ट्र',
      mapsUrl: '',
    },
    {
      key: 'reception', title: 'सत्कार समारंभ', art: 'throne',
      start: '2024-11-24T19:00:00+05:30', end: '2024-11-24T22:30:00+05:30',
      time: 'संध्याकाळी 7:00 वा.',
      venue: 'रॉयल पॅलेस', address: '123, सोलोलेशन स्ट्रीट, पुणे, महाराष्ट्र',
      mapsUrl: '',
    },
  ],

  /* screen 5 — the venue */
  venue: {
    title: 'स्थळ',
    name: 'रॉयल पॅलेस',
    address: ['123, सोलोलेशन स्ट्रीट,', 'पुणे, महाराष्ट्र'],
    mapsUrl: '', // the venue's Google Maps link; empty = a Google Maps search for the address
  },

  /* screen 6 — attendance and wishes. Replies are stored by rsvp.php next to
     this page (data/entries.php); the family reads them at rsvp.php?key=… */
  rsvp: {
    title: 'आपली उपस्थिती',
    sub: 'आमच्यासाठी अनमोल आहे',
    wishesTitle: 'शुभेच्छा',
    wishesLines: ['आपल्या शुभेच्छा आमच्या', 'नव्या प्रवासासाठी नेहमी', 'सोबत राहतील...'],
    wishPlaceholder: 'तुमच्या शुभेच्छा येथे लिहा...',
    endpoint: 'rsvp.php',
    storageKey: 'marathi-wedding:rsvp',
    maxGuests: 10,
    form: { // the attendance sheet opened by the printed "उपस्थिती नोंदवा" button
      title: 'उपस्थिती नोंदवा',
      name: 'तुमचे नाव',
      accept: 'मी नक्की येईन',
      decline: 'मी येऊ शकणार नाही',
      guests: 'एकूण पाहुणे',
      send: 'पाठवा',
      needChoice: 'कृपया उपस्थिती निवडा.',
      needName: 'कृपया तुमचे नाव लिहा.',
      needWish: 'कृपया तुमच्या शुभेच्छा लिहा.',
      failed: 'पाठवता आले नाही. कृपया पुन्हा प्रयत्न करा.',
      thanksYes: 'धन्यवाद, {name}! तुमची उपस्थिती नोंदवली.',
      thanksNo: 'धन्यवाद, {name}. तुमची उणीव भासेल.',
      recordedYes: 'नोंदवले: {name} · येणार',
      recordedNo: 'नोंदवले: {name} · येऊ शकणार नाही',
      wishSent: 'तुमच्या शुभेच्छा पाठवल्या. धन्यवाद!',
      close: 'बंद करा',
    },
  },

  /* screen 7 — blessings. The printed button opens these details; leave them
     empty and the button says the details are not configured yet. */
  gift: {
    lines: ['आपल्या प्रेमाची', 'आमच्यासाठी हीच भेट...'],
    sheetTitle: 'आशीर्वाद स्वरूप भेट',
    upiId: '',        // e.g. 'aditi@upi'
    upiName: '',      // the account holder shown with the UPI ID
    bank: [],         // e.g. ['बँक: ...', 'खाते क्र.: ...', 'IFSC: ...']
    note: '',         // any line to show above the details
    copy: 'कॉपी करा', copied: 'कॉपी झाले',
    notConfigured: 'भेट तपशील अद्याप जोडलेले नाहीत.',
  },

  /* screen 8 — thank you */
  closing: {
    title: 'मनापासून',
    big: 'आभार',
    lines: ['आपल्या विशेष दिवशी', 'तुमची सोबत आमच्यासाठी', 'खूपच मौल्यवान आहे...'],
  },

  opening: {
    poster: 'assets/open.webp',
    tap: 'स्पर्श करा',
    video: 'assets/opening.mp4',
    music: 'assets/music.mp3', // Sanson Ki Mala Pe (instrumental, slowed + reverb)
    musicVolume: 0.75,
    musicFadeSeconds: 3,
  },

  ui: {
    mute: 'संगीत बंद करा', unmute: 'संगीत सुरू करा',
    scroll: 'खाली सरकवा',
    skip: 'पुढे जा',
    mapsLabel: 'नकाशा पहा',
    calendarDownloaded: 'कॅलेंडर फाइल डाउनलोड झाली — उघडून तारीख जतन करा.',
  },
};
