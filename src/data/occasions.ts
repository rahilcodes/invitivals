/* ─────────────────────────────────────────────────────────────────────────
   The occasions people browse by. Each one with at least one design gets
   its own page at /invitations/<slug>/ — an occasion with no designs yet is
   simply not shown, so it is safe to list occasions ahead of the artwork.

   To add an occasion: add an entry here, then name its slug in the
   "occasions" list of any design in src/data/designs/.
   ───────────────────────────────────────────────────────────────────────── */

export interface Occasion {
  slug: string;
  /** short label for chips, cards and breadcrumbs */
  name: string;
  group: 'Weddings' | 'Before the wedding' | 'Family and home';
  /** page heading */
  heading: string;
  /** <title> — what people type into a search box */
  title: string;
  /** meta description, 140–160 characters */
  description: string;
  /** the opening paragraph of the page */
  intro: string;
  /** other names the same occasion goes by */
  aka: string[];
  /** the language question, answered for this occasion */
  languages: string;
}

export const OCCASIONS: Occasion[] = [
  {
    slug: 'telugu-wedding',
    name: 'Telugu wedding',
    group: 'Weddings',
    heading: 'Telugu wedding invitations',
    title: 'Telugu Wedding Invitation Designs — Digital Pelli Patrika | Invitivals',
    description:
      'Digital Telugu wedding invitations made by hand: Sita-Rama blessing, scratch-to-reveal muhurtham, every event with a map. In Telugu or English. Ready in 48 hours.',
    intro:
      'A Telugu wedding invitation that opens on a phone. The Sita-Rama blessing at the top, the muhurtham under a scratch-to-reveal card, and every event from Pellikuthuru to the vindu with its venue and a map.',
    aka: ['Pelli patrika', 'Subhalekha', 'Kalyanam invitation'],
    languages: 'Telugu, English, or the two side by side.',
  },
  {
    slug: 'hindu-wedding',
    name: 'Hindu wedding',
    group: 'Weddings',
    heading: 'Hindu wedding invitations',
    title: 'Hindu Wedding Invitation Designs — Digital Wedding Cards | Invitivals',
    description:
      'Digital Hindu wedding invitations made by hand. The blessing at the top, the muhurtham, every event with venue and map, in your own language. Ready in 48 hours.',
    intro:
      'It begins with the blessing your family has always printed at the top of the card. Then the names, the muhurtham, and every event with its venue and a map, in the language your elders read.',
    aka: ['Vivaha invitation', 'Shaadi card', 'Lagna patrika'],
    languages: 'Telugu, Hindi, Kannada, Tamil, Marathi or English.',
  },
  {
    slug: 'tamil-wedding',
    name: 'Tamil wedding',
    group: 'Weddings',
    heading: 'Tamil wedding invitations',
    title: 'Tamil Wedding Invitation Designs — Digital Thirumana Pathirikai | Invitivals',
    description:
      'Digital Tamil wedding invitations made by hand, with the rituals in their proper order, the muhurtham, and every event with a map. In Tamil or English.',
    intro:
      'A Tamil wedding invitation with the rituals in their proper order, the muhurtham, and every event with its venue and a map.',
    aka: ['Thirumana pathirikai', 'Kalyana pathirikai'],
    languages: 'Tamil, English, or the two side by side.',
  },
  {
    slug: 'kannada-wedding',
    name: 'Kannada wedding',
    group: 'Weddings',
    heading: 'Kannada wedding invitations',
    title: 'Kannada Wedding Invitation Designs — Digital Lagna Patrike | Invitivals',
    description:
      'Digital Kannada wedding invitations made by hand, with the dhare at the centre of the day and every event with a map. In Kannada or English.',
    intro:
      'A Kannada wedding invitation with the dhare at the centre of the day, the blessing at the top, and every event with its venue and a map.',
    aka: ['Lagna patrike', 'Maduve invitation'],
    languages: 'Kannada, English, or the two side by side.',
  },
  {
    slug: 'marathi-wedding',
    name: 'Marathi wedding',
    group: 'Weddings',
    heading: 'Marathi wedding invitations',
    title: 'Marathi Wedding Invitation Designs — Digital Lagna Patrika | Invitivals',
    description:
      'Digital Marathi wedding invitations made by hand, with the blessing at the top, the muhurta, and every event with a map. In Marathi or English.',
    intro:
      'A Marathi wedding invitation with the blessing at the top, the muhurta, and every event from the haldi to the reception with its venue and a map.',
    aka: ['Lagna patrika', 'Vivah patrika'],
    languages: 'Marathi, English, or the two side by side.',
  },
  {
    slug: 'nikah',
    name: 'Nikah',
    group: 'Weddings',
    heading: 'Nikah and Valima invitations',
    title: 'Nikah Invitation Designs — Digital Nikah & Valima Cards | Invitivals',
    description:
      'Digital Nikah and Valima invitations made by hand: Bismillah at the top, Hijri dates, each event with a map, and duas from guests on WhatsApp. Ready in 48 hours.',
    intro:
      'Bismillah at the top, the Nikah and the Valima as separate events, Hijri dates beside the Gregorian, and a place for guests to send their duas.',
    aka: ['Nikah card', 'Valima invitation', 'Walima invitation', 'Shaadi card'],
    languages: 'Urdu, English, or the two side by side, with Arabic for the verses.',
  },
  {
    slug: 'christian-wedding',
    name: 'Christian wedding',
    group: 'Weddings',
    heading: 'Christian wedding invitations',
    title: 'Christian Wedding Invitation Designs — Digital Wedding Cards | Invitivals',
    description:
      'Digital Christian wedding invitations made by hand: a verse of scripture, the ceremony and the reception with maps, and RSVP on WhatsApp. Ready in 48 hours.',
    intro:
      'A verse of scripture chosen by the family, chapel doors that open to the order of the day, and the reception with its own map and RSVP.',
    aka: ['Holy matrimony invitation', 'Church wedding invitation'],
    languages: 'English, Malayalam, Tamil, Telugu or Kannada.',
  },
  {
    slug: 'anand-karaj',
    name: 'Anand Karaj',
    group: 'Weddings',
    heading: 'Anand Karaj invitations',
    title: 'Anand Karaj Invitation Designs — Digital Sikh Wedding Cards | Invitivals',
    description:
      'Digital Sikh wedding invitations made by hand: Ik Onkar at the top, the Anand Karaj at the Gurdwara, every event with a map. In Punjabi or English.',
    intro:
      'Ik Onkar at the top, the Anand Karaj at the Gurdwara with guidance for guests, and every event with its venue and a map.',
    aka: ['Sikh wedding invitation'],
    languages: 'Punjabi, English, or the two side by side.',
  },
  {
    slug: 'engagement',
    name: 'Engagement',
    group: 'Before the wedding',
    heading: 'Engagement invitations',
    title: 'Engagement Invitation Designs — Digital Ring Ceremony Cards | Invitivals',
    description:
      'Digital engagement invitations made by hand: doors that open on the two names, the date saved to the calendar, and the venue with a map. Ready in 48 hours.',
    intro:
      'One evening, one venue, and the two names. An engagement invitation that opens like a door, with the date saved to the calendar in one tap and directions straight from the venue name.',
    aka: ['Nischitartham', 'Nischitarthamu', 'Sagai', 'Ring ceremony'],
    languages: 'English, Telugu, Kannada, Hindi or Urdu, with the map labelled in your own script.',
  },
  {
    slug: 'aqeeqah',
    name: 'Aqeeqah',
    group: 'Family and home',
    heading: 'Aqeeqah invitations',
    title: 'Aqeeqah Invitation Designs — Digital Aqiqah Cards | Invitivals',
    description:
      'Digital Aqeeqah invitations made by hand: the dua, the child’s name, Hijri and Gregorian dates, the venue with a map, and duas from guests on WhatsApp.',
    intro:
      'A gentle invitation for a child’s Aqeeqah. The dua, the name, Hijri and Gregorian dates, the venue with a map, and duas from guests delivered on WhatsApp.',
    aka: ['Aqiqah', 'Aqeeqa', 'Akikah'],
    languages: 'Urdu, English, or the two side by side, with Arabic for the dua.',
  },
  {
    slug: 'gruhapravesha',
    name: 'Gruhapravesha',
    group: 'Family and home',
    heading: 'Gruhapravesha invitations',
    title: 'Gruhapravesha Invitation Designs — Digital Housewarming Cards | Invitivals',
    description:
      'Digital Gruhapravesha and housewarming invitations made by hand: a garlanded door, pooja timings, and the new address with a map. Ready in 48 hours.',
    intro:
      'A garlanded door, the pooja timings in their order, and the new address with a map, so nobody has to call for directions.',
    aka: ['Griha Pravesh', 'Gruhapravesam', 'Housewarming'],
    languages: 'Telugu, Kannada, Hindi, Tamil or English.',
  },
  {
    slug: 'namakaranam',
    name: 'Namakaranam',
    group: 'Family and home',
    heading: 'Namakaranam invitations',
    title: 'Namakaranam Invitation Designs — Digital Naming Ceremony Cards | Invitivals',
    description:
      'Digital naming ceremony invitations made by hand: the blessing, the name revealed on the first tap, and the venue with a map. Ready in 48 hours.',
    intro:
      'A naming ceremony invitation where the name is revealed on the first tap, after the blessing. With the venue, a map, and wishes from guests on WhatsApp.',
    aka: ['Naming ceremony', 'Barasala', 'Namkaran'],
    languages: 'Telugu, Hindi, Kannada, Tamil or English.',
  },
];
