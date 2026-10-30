/* ─────────────────────────────────────────────────────────────────────────────
   Bengali wedding — everything the page says and knows about the events lives
   here: the Bengali wording (transcribed from the designer's with-text pages),
   dates and times (Bangladesh time, Asia/Dhaka), venues, map searches, RSVP and
   contact details, media. index.html lays it out, js/app.js runs it.

   ► TO FILL IN (the designer's pages carried placeholders here):
     couple.groom / couple.bride      the name boxes on the first page
     events[*].venue / mapQuery       exact venue names and addresses
     rsvp.host, rsvp.whatsapp, rsvp.deadline, rsvp.phone
     rsvp.endpoint                    a real form endpoint, or leave '' (no form is shown)
   ───────────────────────────────────────────────────────────────────────────── */
export const invite = {
  slug: 'bengali-wedding',
  url: 'https://invitivals.com/bengali-wedding/',
  lang: 'bn',
  title: 'শুভ বিবাহ · বিবাহের আমন্ত্রণ',
  /* the two name boxes under the couple — the design pack showed "শুভ" and "পরিরা" */
  couple: { groom: 'শুভ', bride: 'পরিরা' },
  timeZone: 'Asia/Dhaka',
  utcOffset: '+06:00',

  hero: {
    title: 'শুভ বিবাহ',
    sub: ['দুই পরিবারের মিলনে', 'এক পবিত্র বন্ধন'],
    para: ['ভালোবাসা, আশা ও পারিবারিক', 'সম্পর্কের এই পবিত্র বন্ধনে', 'আপনাদের উপস্থিতি', 'আমাদের জন্য', 'অনেক অনুপ্রেরণা।'],
  },
  reveal: {
    title: 'শুভ লগ্নের শুভ তারিখ',
    sub: 'ঘষে দেখুন আমাদের বিশেষ দিন',
    date: '১২ ডিসেম্বর ২০২৬',
    day: 'শনিবার',
    hint: 'ঘষুন',
    button: 'তারিখ দেখুন',
  },
  menu: {
    title: 'আমাদের অনুষ্ঠান',
    sub: ['আমাদের সাথে এই বিশেষ দিনে', 'থাকার জন্য রইল আমন্ত্রণ।'],
  },
  labels: { date: 'তারিখ', time: 'সময়', venue: 'স্থান', maps: 'গুগল ম্যাপ দেখুন', calendar: 'ক্যালেন্ডারে রাখুন', back: 'অনুষ্ঠান তালিকা', others: 'অন্যান্য অনুষ্ঠান' },

  /* the five functions, in the menu's order. date/time are local wall-clock (Asia/Dhaka). */
  events: [
    { id: 'haldi', label: 'গায়ে হলুদ', title: 'গায়ে হলুদ', tagline: ['গায়ের হলুদে রঙিন হোক', 'ভালোবাসার আগমনী'],
      date: '2026-12-10', time: '13:00', durationMinutes: 180, dateBn: '১০ ডিসেম্বর ২০২৬', timeBn: 'দুপুর ১টা',
      venue: ['আমাদের বাসা,', 'ঢাকা'], mapQuery: 'Dhaka, Bangladesh' /* ► replace with the house address */ },
    { id: 'lakshmi', label: 'লক্ষ্মী পূজা', title: 'লক্ষ্মী পূজা', tagline: ['শুভ কাজের আগে', 'মায়ের আশীর্বাদ'],
      date: '2026-12-10', time: '10:00', durationMinutes: 120, dateBn: '১০ ডিসেম্বর ২০২৬', timeBn: 'সকাল ১০টা',
      venue: ['আমাদের বাসা,', 'ঢাকা'], mapQuery: 'Dhaka, Bangladesh' /* ► replace with the house address */ },
    { id: 'sangeet', label: 'সঙ্গীত সন্ধ্যা', title: 'সঙ্গীত সন্ধ্যা', tagline: ['সুরে সুরে জমুক', 'আনন্দের আসর'],
      date: '2026-12-11', time: '18:00', durationMinutes: 240, dateBn: '১১ ডিসেম্বর ২০২৬', timeBn: 'সন্ধ্যা ৬টা',
      venue: ['কমিউনিটি সেন্টার,', 'গুলশান, ঢাকা'], mapQuery: 'Community Center, Gulshan, Dhaka' },
    { id: 'wedding', label: 'বিবাহ', title: 'বিবাহ', tagline: ['দুই প্রাণের এক হওয়ার', 'শুভ মুহূর্ত'],
      date: '2026-12-12', time: '13:00', durationMinutes: 240, dateBn: '১২ ডিসেম্বর ২০২৬', timeBn: 'দুপুর ১টা',
      venue: ['শ্রী শ্রী লক্ষ্মীনারায়ণ মন্দির,', 'ঢাকা'], mapQuery: 'Sri Sri Lakshmi Narayan Mandir, Dhaka' },
    { id: 'reception', label: 'রিসেপশন', title: 'ভোজন', tagline: ['একসাথে ভাত খাবার,', 'সম্পর্কের আরও গভীরতা'],
      date: '2026-12-12', time: '19:00', durationMinutes: 240, dateBn: '১২ ডিসেম্বর ২০২৬', timeBn: 'সন্ধ্যা ৭টা',
      venue: ['রেডিসন ব্লু হোটেল,', 'ঢাকা'], mapQuery: 'Radisson Blu Dhaka Water Garden' },
  ],

  venues: { title: 'অনুষ্ঠানের ঠিকানা', sub: 'কোথায়, কবে — এক নজরে' },
  ending: {
    title: 'আমাদের কিছু মুহূর্ত', sub: 'ভালোবাসার কিছু স্মৃতি',
    thanks: ['আপনাদের', 'ধন্যবাদ'],
    para: ['আমাদের এই বিশেষ দিনে', 'আমাদের সাথে থাকার জন্য', 'আপনাদের প্রতি', 'রইল আন্তরিক কৃতজ্ঞতা।'],
  },
  rsvp: {
    title: 'উপস্থিতি জানান',
    sub: 'আপনার আসার খবরটি আমাদের জানালে খুশি হব।',
    host: '',            // ► e.g. 'রায় ও সেন পরিবার'
    whatsapp: '',        // ► digits with country code, e.g. '8801XXXXXXXXX'
    phone: '',           // ► for the Call button, e.g. '+8801XXXXXXXXX'
    deadline: '',        // ► e.g. '৫ ডিসেম্বর ২০২৬'
    endpoint: '',        // ► a real POST endpoint (Formspree etc.); '' hides the form
    message: 'নমস্কার! আমি {name} — বিবাহের আমন্ত্রণ পেয়ে আনন্দিত। আমরা {count} জন আসছি। শুভেচ্ছা।',
  },

  music: 'assets/media/music.mp3',          // leave '' if there is no song
  video: 'assets/media/intro-clean.mp4',
  videoPoster: 'assets/media/intro-poster.webp',
  videoTimeoutMs: 25000,
  share: {
    description: 'শুভ বিবাহ — ১০, ১১ ও ১২ ডিসেম্বর ২০২৬, ঢাকা। গায়ে হলুদ, লক্ষ্মী পূজা, সঙ্গীত সন্ধ্যা, বিবাহ ও ভোজন। আমন্ত্রণটি খুলতে ট্যাপ করুন।',
  },
};
