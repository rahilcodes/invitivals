/* ─────────────────────────────────────────────────────────────────────────
   INVITIVALS — everything the marketing site says, in one place.
   The invitations themselves live under /public and are never touched here.
   ───────────────────────────────────────────────────────────────────────── */

// ⚠️ Your WhatsApp number, country code, digits only.
export const WHATSAPP = '917997001900';
export const EMAIL = 'hello@invitivals.in';
export const INSTAGRAM = 'https://instagram.com/invitivals.in';
export const SITE = 'https://invitivals.com';

export const wa = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

export const WA = {
  general: wa('Hello Invitivals, we would like to talk about an invitation.'),
  essential: wa('Hello Invitivals, we would like to begin with the Essential plan (Rs 1,499).'),
  signature: wa('Hello Invitivals, we would like to begin with the Signature plan (Rs 2,999).'),
  royal: wa('Hello Invitivals, we would like to begin with the Royal plan (Rs 4,999).'),
};

// The designs themselves are in src/data/designs/ (see designs.ts),
// the occasions they are browsed by in occasions.ts.

// The sample couple used in the hero, the chat mock and the walkthrough —
// the same fictional names as the live Telugu wedding sample.
export const SAMPLE = {
  bride: 'Meenakshi',
  groom: 'Karthikeya',
  names: 'Meenakshi & Karthikeya',
  date: '26 August 2027',
  short: '26 August',
  place: 'Ramapuram',
  family: 'Reddy',
  href: '/showcase/telugu-wedding/index.html',
};

export interface Moment {
  no: string;
  title: string;
  line: string;
  head: string;
  title2?: string;
  bubble?: string;
  seal?: boolean;
  rows: { l: string; r: string }[];
  cta?: string;
}

export const MOMENTS: Moment[] = [
  { no: '01', title: 'Receive the link', line: 'It arrives on WhatsApp, addressed to your family by name.', head: 'WhatsApp · 7.12 pm', bubble: `${SAMPLE.names} invite you. Especially for the Reddy family. invitivals.com/reddy`, rows: [] },
  { no: '02', title: 'Tap the seal', line: 'The wax cracks, light spills out, and the music begins.', head: 'Tap the seal', seal: true, rows: [] },
  { no: '03', title: 'Read the blessing and the names', line: 'The words your family chose, in the language you chose.', head: 'Sri Sita Ramabhyam Namah', title2: SAMPLE.names, rows: [{ l: 'With the blessings of', r: '' }, { l: 'Smt. Seetha & Sri Ramachandra Rao', r: '' }, { l: 'Smt. Latha & Sri Murali Reddy', r: '' }] },
  { no: '04', title: 'See every event', line: 'Each one with its date, its time and its venue.', head: 'The celebrations', rows: [{ l: 'Pellikuthuru', r: '24 Aug · 10 am' }, { l: 'Sangeet', r: '25 Aug · 7 pm' }, { l: 'Muhurtham', r: '26 Aug · 12 noon' }, { l: 'Vindu', r: '26 Aug · 1 pm' }] },
  { no: '05', title: 'One tap for directions', line: 'Maps open straight from the venue name.', head: 'Muhurtham', title2: 'Kalyana Vedika', rows: [{ l: 'Ramapuram', r: '' }], cta: 'Open in Maps' },
  { no: '06', title: 'RSVP, or send duas and wishes', line: 'A short message that reaches you on WhatsApp.', head: 'Will you join us?', rows: [{ l: 'Yes, with joy', r: '4 guests' }, { l: 'Sorry, we can’t', r: '' }], cta: 'Send to the family' },
  { no: '07', title: 'Replay and forward', line: 'Guests watch it again, then send it on to cousins.', head: SAMPLE.names, rows: [{ l: 'Watch again', r: '' }, { l: 'Forward to family', r: '' }, { l: 'Save the dates', r: '' }] },
];

export const TRADITIONS = [
  { id: 'wax-seal', occasion: 'Nikah & Valima', line: 'Bismillah calligraphy at the top, Hijri dates beside the Gregorian, and a place for duas.' },
  { id: 'kalyanam', occasion: 'Telugu wedding', line: 'Sita-Rama blessings, a scratch-to-reveal muhurtham, and the seven vows in Telugu.' },
  { id: 'chapel-doors', occasion: 'Christian wedding', line: 'A verse of scripture, chapel doors that open on scroll, and the order of service.' },
  { id: 'new-home', occasion: 'Gruhapravesha', line: 'Kamadhenu at the threshold, a temple bell that rings once, and the vastu puja timings.' },
];

export const LANGS = [
  { code: 'EN', label: 'English', text: 'With the blessings of our elders, we invite you to the wedding of Meenakshi and Karthikeya.' },
  { code: 'TE', label: 'తెలుగు', text: 'పెద్దల ఆశీస్సులతో, మీనాక్షి మరియు కార్తికేయ వివాహానికి మిమ్మల్ని సాదరంగా ఆహ్వానిస్తున్నాము.' },
  { code: 'HI', label: 'हिन्दी', text: 'बड़ों के आशीर्वाद से, हम आपको मीनाक्षी और कार्तिकेय के विवाह में सादर आमंत्रित करते हैं।' },
  { code: 'UR', label: 'اردو', text: 'بزرگوں کی دعاؤں کے ساتھ، ہم آپ کو میناکشی اور کارتکیہ کی شادی میں شرکت کی دعوت دیتے ہیں۔', rtl: true },
];

export const HOW = [
  'Pick a design and tap <em>“Create this for us”</em>. It opens WhatsApp.',
  'Send your details from a simple checklist: names, dates, events, photos, music. No forms, no logins.',
  'Receive your private link within 48 hours. Request changes, approve, share.',
];

export const TIMELINE = [
  { day: 'Day 0', title: 'You send the details', note: 'Names, dates, events, photos, music, on WhatsApp.' },
  { day: 'Day 1', title: 'First draft arrives', note: 'A private link. Open it, tap the seal, tell us what to change.' },
  { day: 'Day 2', title: 'Approved and live', note: 'Pay the balance. Share the link with your family.' },
];

export const PLANS = [
  {
    name: 'Essential',
    price: 'Rs 1,499',
    href: WA.essential,
    features: ['One design, personalised', 'Names, dates, venues, events', 'Countdown and maps', 'Up to 6 photos', 'Live for 12 months', 'Delivered in 48 hours'],
  },
  {
    name: 'Signature',
    price: 'Rs 2,999',
    href: WA.signature,
    chosen: true,
    features: ['Everything in Essential', 'Your story and full schedule', 'RSVPs to WhatsApp or Google Sheet', 'Your chosen music', 'Up to 20 photos and a film section', 'Personalised guest links', 'Unlimited text revisions'],
  },
  {
    name: 'Royal',
    price: 'Rs 4,999',
    href: WA.royal,
    features: ['Everything in Signature', 'A custom colour palette', 'Extra sections', 'Your own domain', 'Same-day priority delivery', 'Dedicated support'],
  },
];

export const PROMISE = 'Pay 50% to begin, the rest after you approve. Full refund if you don’t love it. UPI or bank transfer.';

export const CHECKLIST = [
  { no: '01', title: 'Names', note: 'The couple or the child, and the parents and grandparents to be named.' },
  { no: '02', title: 'Occasion and tradition', note: 'Telugu wedding, Nikah, Aqeeqah, Gruhapravesha, or something else.' },
  { no: '03', title: 'Events', note: 'Each event with date, time and venue. A Google Maps link if you have one.' },
  { no: '04', title: 'Language', note: 'English, Telugu, Hindi or Urdu. Two side by side is fine.' },
  { no: '05', title: 'Blessing or verse', note: 'The words you want at the top. Or ask us to suggest.' },
  { no: '06', title: 'Photos', note: 'Up to 6, 20 or more, by plan. Send as they are.' },
  { no: '07', title: 'Music', note: 'A song name or a link. Signature and Royal only.' },
  { no: '08', title: 'RSVP number', note: 'The WhatsApp number that should receive RSVPs and wishes.' },
];

/* Real quotes from real families only — never invent one.
   The "From families" block stays off the site until this list has entries:
   { text: '“…”', who: 'Family name · Occasion · City' } */
export const QUOTES: { text: string; who: string }[] = [];

export const FAQS = [
  { q: 'Will it work on every phone?', a: 'Yes. It is a simple web link. It opens in WhatsApp, in any browser, on any phone, old or new. Nothing to download.' },
  { q: 'Can we change details after sending?', a: 'Yes. Text changes are made the same day, and the link stays the same, so guests who already have it see the new version.' },
  { q: 'Can it be in Telugu?', a: 'Yes. Telugu, Hindi and Urdu, or two languages side by side. Send us the words, or ask us to write them.' },
  { q: 'Do guests need to install anything?', a: 'No. They tap the link and it opens. Grandparents manage it without help.' },
  { q: 'How do RSVPs reach us?', a: 'Each RSVP arrives as a WhatsApp message to the number you choose, or in a Google Sheet, or both.' },
  { q: 'What happens after 12 months?', a: 'The link rests. We can keep it live for another year for a small fee, or send you a copy to keep.' },
  { q: 'What if we don’t love it?', a: 'You pay half to begin, and the rest only when you approve. If you don’t love it, we refund the half.' },
];

// Contextual sticky bar (mobile) — the label follows the section in view.
export const CTAS: Record<string, { label: string; href: string; note: string; blank?: boolean }> = {
  top: { label: 'See real invitations', href: '#invitations', note: 'Scrolls to the gallery' },
  story: { label: 'See real invitations', href: '#invitations', note: 'Scrolls to the gallery' },
  gallery: { label: 'Create this for us', href: wa('Hello Invitivals, we saw the invitations on your site and would like one for our family.'), note: 'Opens WhatsApp', blank: true },
  traditions: { label: 'Ask about our tradition', href: wa('Hello Invitivals, we would like an invitation made for our tradition. Can we talk?'), note: 'Opens WhatsApp', blank: true },
  how: { label: 'Begin on WhatsApp', href: wa('Hello Invitivals, we would like to begin. Please send us the checklist.'), note: 'Opens WhatsApp', blank: true },
  plans: { label: 'Begin with Signature', href: WA.signature, note: 'Opens WhatsApp', blank: true },
  close: { label: 'Message us on WhatsApp', href: WA.general, note: 'Opens WhatsApp', blank: true },
};
