/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WEDDING LUXE — the only file you need to edit.
 *
 *  1. Replace the demo content below with your own.
 *  2. Drop your photos into /public/photos and update the photo paths.
 *  3. Deploy. (See SETUP.md for the 10-minute guide.)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type PaletteName = 'ivory-gold' | 'sage' | 'midnight';

/** A colorway is exactly eight values — see THEMING.md to add your own. */
export interface Palette {
  bg: string;      // main light surface
  bg2: string;     // tinted secondary surface
  ink: string;     // primary text
  mut: string;     // muted text
  gold: string;    // metallic accent
  goldSoft: string;// hairlines / soft accent
  dark: string;    // dark interlude surface
  darkInk: string; // text on dark
}

export interface Person {
  /** Full display name, e.g. "Amara Bennett" */
  name: string;
  /** First name only — used in headings */
  first: string;
  /** Single initial for the monogram */
  initial: string;
  /** e.g. "The Bride" */
  role: string;
  /** One-line bio shown under the portrait */
  bio: string;
  /** Portrait photo (3:4), path inside /public */
  photo: string;
}

export interface WeddingConfig {
  /* ── Theme ────────────────────────────────────────────────────────────── */
  /** 'ivory-gold' | 'sage' | 'midnight' — or provide `customPalette` */
  palette: PaletteName;
  /** Optional: overrides `palette` with your own eight values */
  customPalette?: Palette;

  /* ── Site / SEO ───────────────────────────────────────────────────────── */
  site: {
    /** Canonical URL of the deployed site (no trailing slash) */
    url: string;
    /** <title> and og:title. Leave '' to auto-generate from the couple. */
    title: string;
    /** Meta description / og:description. '' auto-generates. */
    description: string;
    /**
     * Share-preview image (1200×630 recommended). Drop `og.jpg` into
     * /public/photos and it is picked up automatically; otherwise the hero
     * photo is used.
     */
    ogImage: string;
  };

  /* ── The couple ───────────────────────────────────────────────────────── */
  bride: Person;
  groom: Person;
  /** Italic quote on the envelope intro */
  quote: string;

  /* ── When & where (the one date that drives everything) ───────────────── */
  /** Ceremony start, ISO 8601 with UTC offset, e.g. '2026-09-26T15:30:00+01:00' */
  datetime: string;
  /** Reception end — used for the "Add to calendar" link */
  datetimeEnd: string;
  /** IANA timezone of the venue, e.g. 'Europe/London' */
  timezone: string;
  /** Locale used to format the date, e.g. 'en-US' → "Saturday, September 26, 2026" */
  locale: string;
  /** Full-bleed hero photo (your favorite couple photo) */
  heroPhoto: string;
  /** Second line under the names in the hero, e.g. "Hartwell Estate · The Cotswolds, England" */
  heroLocationLine: string;

  /* ── Our story ────────────────────────────────────────────────────────── */
  story: {
    heading: string;
    milestones: { date: string; title: string; text: string }[];
    /** Wide engagement photo (3:2) */
    photo: string;
    photoAlt: string;
  };

  /* ── Countdown ────────────────────────────────────────────────────────── */
  countdown: { heading: string };

  /* ── The wedding day, hour by hour ────────────────────────────────────── */
  dayTimeline: {
    heading: string;
    hint: string;
    items: { time: string; label: string; note: string }[];
  };

  /* ── Events (the weekend) ─────────────────────────────────────────────── */
  events: {
    heading: string;
    items: {
      day: string;      // "Fri"
      date: string;     // "25"
      month: string;    // "Sept"
      title: string;
      body: string;
      dress: string;
      /** The main event gets a gold frame */
      highlight?: boolean;
    }[];
  };

  /* ── Family & wedding party ───────────────────────────────────────────── */
  family: {
    heading: string;
    members: { name: string; role: string; photo: string }[];
  };

  /* ── Venue ────────────────────────────────────────────────────────────── */
  venue: {
    name: string;
    description: string;
    address: string;
    /** Full-bleed venue photo */
    photo: string;
    /** Search text used for Google Maps links */
    mapsQuery: string;
    /** Coordinates for the embedded map */
    coords: { lat: number; lng: number };
    /** Optional: paste a full Google Maps embed URL to override the coords embed */
    embedUrl?: string;
    /** Travel notes under the map (each item is one line) */
    travelNotes: string[];
  };

  /* ── Accommodation ────────────────────────────────────────────────────── */
  hotels: {
    heading: string;
    /** Sentence before the room-block code */
    intro: string;
    /** Room-block code shown in gold */
    code: string;
    items: { name: string; meta: string; blurb: string; photo: string; bookUrl: string }[];
  };

  /* ── Dress code ───────────────────────────────────────────────────────── */
  dressCode: {
    title: string;
    body: string[];
    /** Wearable swatches (hex colors) */
    swatches: string[];
    caption: string;
  };

  /* ── Menu ─────────────────────────────────────────────────────────────── */
  menu: {
    overline: string;
    title: string;
    courses: { label: string; dish: string; alt: string }[];
    footnote: string;
  };

  /* ── Gallery ──────────────────────────────────────────────────────────── */
  gallery: {
    heading: string;
    /** Mixed aspect ratios look best — see the demo set */
    photos: { src: string; alt: string; w: number; h: number }[];
  };

  /* ── Film ─────────────────────────────────────────────────────────────── */
  film: {
    heading: string;
    poster: string;
    /** YouTube / Vimeo / direct .mp4 URL. Leave '' to show the poster only. */
    video: string;
  };

  /* ── Guest wishes ─────────────────────────────────────────────────────── */
  wishes: {
    heading: string;
    entries: { text: string; name: string }[];
    placeholder: string;
    /** Attribution shown on a wish the guest just sent */
    newWishLabel: string;
  };

  /* ── RSVP ─────────────────────────────────────────────────────────────── */
  rsvp: {
    title: string;
    /** Display date, e.g. "August 26, 2026" */
    deadline: string;
    maxGuests: number;
    acceptLabel: string;
    declineLabel: string;
    /**
     * Where replies are sent. Supports a Google Apps Script web-app URL
     * (type 'apps-script') or any JSON webhook (type 'webhook').
     * Leave '' to run the form purely client-side. See SETUP.md.
     */
    endpoint: string;
    endpointType: 'apps-script' | 'webhook';
    thanks: {
      acceptTitle: string;
      /** {count} → number of guests, {guests} → "guest"/"guests" */
      acceptBody: string;
      declineTitle: string;
      declineBody: string;
    };
  };

  /* ── Guestbook endpoint (wishes) ──────────────────────────────────────── */
  guestbookEndpoint: string;

  /* ── FAQ ──────────────────────────────────────────────────────────────── */
  faq: {
    heading: string;
    /** `a` may contain simple HTML (<strong>, <em>) */
    items: { q: string; a: string }[];
  };

  /* ── Contact ──────────────────────────────────────────────────────────── */
  contact: {
    heading: string;
    intro: string;
    /** E.164 phone for the Call button, e.g. '+447700900123' */
    phone: string;
    callLabel: string;
    /** Digits only for wa.me */
    whatsapp: string;
    whatsappMessage: string;
    shareTitle: string;
    shareText: string;
  };

  /* ── Footer ───────────────────────────────────────────────────────────── */
  hashtag: string;
  footerClosing: string;

  /* ── Music ────────────────────────────────────────────────────────────── */
  music: {
    /**
     * 'generative' — a soft ambient score synthesised in the browser
     *                (no audio file, no licensing).
     * 'file'       — loops the MP3 at `src` (drop it into /public/audio).
     */
    mode: 'generative' | 'file';
    src: string;
    /** 0–1, only used in 'file' mode */
    volume: number;
  };

  /* ── Section toggles — flip any section off without deleting content ──── */
  sections: {
    intro: boolean;
    hero: boolean;
    couple: boolean;
    story: boolean;
    countdown: boolean;
    dayTimeline: boolean;
    events: boolean;
    family: boolean;
    venue: boolean;
    map: boolean;
    hotels: boolean;
    dressCode: boolean;
    menu: boolean;
    gallery: boolean;
    film: boolean;
    wishes: boolean;
    rsvp: boolean;
    faq: boolean;
    contact: boolean;
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEMO CONTENT — Amara & Julian · September 26, 2026 · Hartwell Estate
   ═══════════════════════════════════════════════════════════════════════════ */

const config: WeddingConfig = {
  palette: 'ivory-gold',

  site: {
    url: 'https://amara-and-julian.example.com',
    title: '',
    description: '',
    ogImage: '',
  },

  bride: {
    name: 'Amara Bennett',
    first: 'Amara',
    initial: 'A',
    role: 'The Bride',
    bio: 'Daughter of Elizabeth & Thomas Bennett. Landscape architect, incurable romantic, keeper of the world’s longest playlist.',
    photo: '/photos/demo/bride.svg',
  },
  groom: {
    name: 'Julian Hart',
    first: 'Julian',
    initial: 'J',
    role: 'The Groom',
    bio: 'Son of Margaret & David Hart. Documentary filmmaker, terrible dancer, the reason the playlist gets skipped.',
    photo: '/photos/demo/groom.svg',
  },
  quote: '“Whatever our souls are made of, his and mine are the same.”',

  datetime: '2026-09-26T15:30:00+01:00',
  datetimeEnd: '2026-09-27T00:00:00+01:00',
  timezone: 'Europe/London',
  locale: 'en-US',
  heroPhoto: '/photos/demo/hero.svg',
  heroLocationLine: 'Hartwell Estate · The Cotswolds, England',

  story: {
    heading: 'It started with a wrong turn',
    milestones: [
      {
        date: 'June 2019 · Lisbon',
        title: 'The meeting',
        text: 'Two strangers, one hopelessly wrong map, and the last two seats at a tiny fado bar in Alfama. Amara asked for directions; Julian gave the wrong ones on purpose.',
      },
      {
        date: 'March 2022 · London',
        title: 'The little flat on Rowan Lane',
        text: 'One key, two toothbrushes, and a kitchen far too small for two people who both insist on cooking. We kept the flat. We kept each other.',
      },
      {
        date: 'September 2025 · The Dolomites',
        title: 'The question',
        text: 'At sunrise above Lago di Braies, Julian finally gave the right directions — down on one knee. She said yes before he finished the sentence.',
      },
    ],
    photo: '/photos/demo/story.svg',
    photoAlt: 'Amara and Julian at their engagement',
  },

  countdown: { heading: 'Until we say “I do”' },

  dayTimeline: {
    heading: 'Saturday, hour by hour',
    hint: 'Swipe through the day →',
    items: [
      { time: '3:30', label: 'Ceremony', note: 'In the walled garden, beneath the old oak' },
      { time: '5:00', label: 'Cocktails', note: 'Champagne & lawn games on the terrace' },
      { time: '7:00', label: 'Dinner', note: 'Candlelit supper in the Orangery' },
      { time: '9:00', label: 'Dancing', note: 'First dance, then everyone else’s' },
      { time: '11:30', label: 'Send-off', note: 'Sparklers on the drive as we slip away' },
    ],
  },

  events: {
    heading: 'A weekend of it',
    items: [
      {
        day: 'Fri', date: '25', month: 'Sept',
        title: 'Welcome Dinner',
        body: '7:00 PM · The Hartwell Inn. Casual, candlelit, come as you are — we just want to hug you before the big day.',
        dress: 'Smart casual',
      },
      {
        day: 'Sat', date: '26', month: 'Sept',
        title: 'Ceremony & Reception',
        body: '3:30 PM · Hartwell Estate. The main event — vows in the walled garden, dinner in the Orangery, dancing until they make us stop.',
        dress: 'Garden formal',
        highlight: true,
      },
      {
        day: 'Sun', date: '27', month: 'Sept',
        title: 'Farewell Brunch',
        body: '10:30 AM · Estate lawns. Pastries, bloody marys, and one last round of stories before everyone scatters.',
        dress: 'Come comfy',
      },
    ],
  },

  family: {
    heading: 'Our families',
    members: [
      { name: 'Elizabeth & Thomas Bennett', role: 'Parents of the bride', photo: '/photos/demo/family-1.svg' },
      { name: 'Margaret & David Hart', role: 'Parents of the groom', photo: '/photos/demo/family-2.svg' },
      { name: 'Priya Sharma', role: 'Maid of honour', photo: '/photos/demo/family-3.svg' },
      { name: 'Marcus Cole', role: 'Best man', photo: '/photos/demo/family-4.svg' },
    ],
  },

  venue: {
    name: 'Hartwell Estate',
    description: 'A 17th-century manor wrapped in walled gardens and old oaks.',
    address: 'Hartwell Lane, Little Barrow, Gloucestershire GL54 2QT',
    photo: '/photos/demo/venue.svg',
    mapsQuery: 'Hartwell Estate Gloucestershire',
    coords: { lat: 51.9925, lng: -1.7055 },
    travelNotes: [
      '90 min from London Paddington to Moreton-in-Marsh, then a 15-minute taxi.',
      'Free parking on the estate. A shuttle runs from both hotels at 2:45 PM.',
    ],
  },

  hotels: {
    heading: 'Where to rest your feet',
    intro: 'We’ve reserved room blocks at both — mention',
    code: 'AMARA&JULIAN',
    items: [
      {
        name: 'The Hartwell Inn',
        meta: 'On the estate · from £140',
        blurb: 'Sixteen rooms in the old coach house. Stumble home in two minutes flat.',
        photo: '/photos/demo/hotel-1.svg',
        bookUrl: '#',
      },
      {
        name: 'The Swan at Ashwell',
        meta: '2 miles · from £95',
        blurb: 'A honey-stone village pub with famously good breakfasts. Shuttle provided.',
        photo: '/photos/demo/hotel-2.svg',
        bookUrl: '#',
      },
    ],
  },

  dressCode: {
    title: 'Garden formal',
    body: [
      'Long dresses, linen suits, something you can dance in on grass.',
      'Soft, natural tones photograph beautifully here — and please, no white or ivory.',
    ],
    swatches: ['#6e7a5e', '#b7a27a', '#8a6d54', '#444a3f', '#cbb9a2'],
    caption: 'Sage · Champagne · Taupe · Forest · Sand',
  },

  menu: {
    overline: 'Wedding supper',
    title: 'The menu',
    courses: [
      { label: 'To begin', dish: 'Burrata, heritage tomatoes & basil oil', alt: 'or chilled garden pea soup, mint cream' },
      { label: 'The main', dish: 'Slow-roasted lamb shoulder, rosemary jus', alt: 'or wild mushroom & truffle pithivier' },
      { label: 'To finish', dish: 'Lemon & elderflower wedding cake', alt: 'with English strawberries & clotted cream' },
    ],
    footnote: 'Wines from the Hartwell cellar · dietary needs? Tell us in your RSVP',
  },

  gallery: {
    heading: 'The two of us, so far',
    photos: [
      { src: '/photos/demo/gallery-1.svg', alt: 'Amara and Julian, Lisbon', w: 250, h: 340 },
      { src: '/photos/demo/gallery-2.svg', alt: 'A walk on the South Bank', w: 300, h: 300 },
      { src: '/photos/demo/gallery-3.svg', alt: 'Sunday mornings on Rowan Lane', w: 250, h: 360 },
      { src: '/photos/demo/gallery-4.svg', alt: 'The Dolomites, the morning after yes', w: 340, h: 280 },
      { src: '/photos/demo/gallery-5.svg', alt: 'Dancing in the kitchen', w: 250, h: 340 },
      { src: '/photos/demo/gallery-6.svg', alt: 'Golden hour at Hartwell', w: 300, h: 300 },
    ],
  },

  film: {
    heading: 'Three minutes of us',
    poster: '/photos/demo/film.svg',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },

  wishes: {
    heading: 'Leave us a wish',
    entries: [
      { text: '“Amara, you found someone who finally laughs at your puns. Keep him.”', name: 'Priya · Maid of honour' },
      { text: '“Jules, I’ve seen you cry at dog food adverts. September is going to destroy you. Can’t wait.”', name: 'Marcus · Best man' },
      { text: '“To the couple who made us all believe in wrong turns.”', name: 'The Okafors · Lisbon, 2019' },
    ],
    placeholder: 'Write your wish…',
    newWishLabel: 'You · just now',
  },

  rsvp: {
    title: 'Will you join us?',
    deadline: 'August 26, 2026',
    maxGuests: 8,
    acceptLabel: 'Joyfully accept',
    declineLabel: 'Regretfully decline',
    endpoint: '',
    endpointType: 'apps-script',
    thanks: {
      acceptTitle: 'We can’t wait to see you',
      acceptBody: 'Your reply for {count} {guests} is noted. Watch your inbox — the good details are coming.',
      declineTitle: 'You’ll be missed',
      declineBody: 'Thank you for letting us know. We’ll raise a glass to you on the day.',
    },
  },

  guestbookEndpoint: '',

  faq: {
    heading: 'Questions, answered',
    items: [
      {
        q: 'Can I bring a plus one?',
        a: 'If your invitation says “and guest,” absolutely. Otherwise we’ve kept the day intimate — thank you for understanding.',
      },
      {
        q: 'Are children welcome?',
        a: 'We love your little ones, but the evening is adults-only. Babes in arms are always welcome at the ceremony.',
      },
      {
        q: 'What about gifts?',
        a: 'Your presence is the present. If you insist, a contribution to our honeymoon in Kyoto would mean the world.',
      },
      {
        q: 'Will the ceremony be outdoors?',
        a: 'Yes, weather permitting — bring a wrap for the evening. If England does its thing, we move to the Orangery, which is arguably prettier.',
      },
      {
        q: 'Can I share photos from the day?',
        a: 'Please do — after the ceremony. We’re having an unplugged ceremony, then tag everything <strong>#TheHartOfIt</strong>.',
      },
    ],
  },

  contact: {
    heading: 'We’re a message away',
    intro: 'Rosa, our wonderful coordinator, has answers to everything.',
    phone: '+91 7997001700',
    callLabel: 'Call Rosa',
    whatsapp: '917997001700',
    whatsappMessage: 'Hello! A question about Amara & Julian’s wedding:',
    shareTitle: 'Amara & Julian — September 26, 2026',
    shareText: 'You’re invited! Amara & Julian are getting married.',
  },

  hashtag: '#TheHartOfIt',
  footerClosing: 'We can’t wait to celebrate with you',

  music: {
    mode: 'generative',
    src: '/audio/ambient.mp3',
    volume: 0.6,
  },

  sections: {
    intro: true,
    hero: true,
    couple: true,
    story: true,
    countdown: true,
    dayTimeline: true,
    events: true,
    family: true,
    venue: true,
    map: true,
    hotels: true,
    dressCode: true,
    menu: true,
    gallery: true,
    film: true,
    wishes: true,
    rsvp: true,
    faq: true,
    contact: true,
  },
};

export default config;
