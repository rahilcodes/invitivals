#!/usr/bin/env node
/* Shifa & Mohammad Umair — builds the three invitation pages (client brief of 28 Nov 2026) on the
   Rose Red premium design (public/muslim-premium-red — only READ here, never written):

     /shifa-umair-family-wedding/          family: Rang-e-Noor, Qubool Hai, Dawat-e-Ishq
     /shifa-umair-friends-wedding/         friends: the wedding evening only; no calligraphy, Arabic or mosques
     /shifa-personal-wedding-invitation/   Shifa's own invitation to Dawat-e-Ishq

     node tools/shifa-umair-cutout.mjs      once: the client's couple picture → transparent cut-out
     node tools/shifa-umair-art.mjs         the paintings (invites/src/shifa-umair-wedding/plates)
     node tools/shifa-umair-pages.mjs [slug …]   this: every page's files, written fresh

   Each page folder is complete on its own (its own engine copy, stylesheet, config, paintings, calendar files,
   preview image), so a change to one page can never reach another. Wording, dates, times, venues and map
   links below are the client's, exactly as supplied; end times were not supplied, so each calendar entry
   gets a default length (hours) without moving the stated start. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { paintScreen, text } from './lib/paint-screen.mjs';
import { PLATES_DEF, SCENE_TEXT } from './shifa-umair-art.mjs';

const REF = 'public/muslim-premium-red';
const SRC = 'invites/src/shifa-umair-wedding';
const PLATES = path.join(SRC, 'plates');
const ENGINE = 'tools/shifa-umair-engine';
const SITE = 'https://invitivals.com/';

/* ── the client's events ── */
const MAP = {
  rang: 'https://maps.app.goo.gl/s7Bwy855ihXTN9756',
  qubool: 'https://maps.app.goo.gl/D9CiqynYA1Qug2hd7',
  mewar: 'https://maps.app.goo.gl/6HpYV38HwLzFL1GV8',
  mewarPersonal: 'https://maps.app.goo.gl/ViEWbdoj2VGLygfA8',   // the link supplied for Shifa's own invitation (a different link)
};
const PAIR = 'Shifa & Mohammad Umair';
const EV = {
  rangeNoor: { title: 'Rang-e-Noor', date: '2026-12-22', time: '19:00', hours: 4, venue: { name: 'Sterling Wedding Plaza Hall', address: '' },
    dress: 'Green, Pink', mapsUrl: MAP.rang, calTitle: `Rang-e-Noor – ${PAIR}`,
    calDetails: `Rang-e-Noor, the first of the wedding celebrations of ${PAIR}. With love, Parvez & Nazima.` },
  quboolHai: { title: 'Qubool Hai', date: '2026-12-24', time: '16:00', hours: 6.5, times: [['Nikah', '16:00'], ['Dinner Gathering', '19:30']],
    venue: { name: 'Silverador Resort Club', address: '' }, dress: 'Traditional dress in White, Golden, Champagne', mapsUrl: MAP.qubool,
    calTitle: `Qubool Hai (Nikah & Dinner) – ${PAIR}`,
    calDetails: `Qubool Hai, the Nikah of ${PAIR}, followed by a dinner gathering. With love, Parvez & Nazima.` },
  dawat: { title: 'Dawat-e-Ishq', date: '2026-12-26', time: '19:30', hours: 4, venue: { name: 'Mewar Vatika', address: '' }, mapsUrl: MAP.mewar,
    calTitle: `Dawat-e-Ishq – ${PAIR}`,
    calDetails: `Dawat-e-Ishq, the wedding celebration of ${PAIR}. With love, Parvez & Nazima.` },
};

/* ── the three pages ── */
const PAGES = [
  {
    slug: 'shifa-umair-family-wedding',
    title: `${PAIR} · Wedding Invitation`,
    desc: 'With immense gratitude to Allah (SWT), Parvez & Nazima invite you and your family to the wedding of their daughter Shifa with Mohammad Umair: Rang-e-Noor 22 December, Qubool Hai 24 December and Dawat-e-Ishq 26 December 2026.',
    ogDesc: 'Rang-e-Noor 22 Dec · Qubool Hai 24 Dec · Dawat-e-Ishq 26 Dec 2026. Tap to open the invitation.',
    events: { rangeNoor: EV.rangeNoor, quboolHai: EV.quboolHai, dawat: EV.dawat },
    mainEvent: 'dawat', endSection: 'quran', icsName: 'Shifa-Umair-Dawat-e-Ishq.ics',
    sections: ['main:main', 'invite:messageFamily', 'scratch:scratch', 'functions:functions', 'countdown:countdown', 'thanks:thanksFamily', 'quran:quran'],
    fns: ['rangeNoor', 'quboolHai', 'dawat'],
    og: { eyebrow: 'WEDDING INVITATION', lines: ['RANG-E-NOOR · 22 DEC', 'QUBOOL HAI · 24 DEC', 'DAWAT-E-ISHQ · 26 DEC 2026'] },
  },
  {
    slug: 'shifa-umair-friends-wedding',
    title: `${PAIR} · Wedding Invitation`,
    desc: 'With immense joy, Parvez & Nazima Kazi invite you to celebrate the wedding of their daughter Shifa with Mohammad Umair on Saturday, 26 December 2026, 7:30 PM, at Mewar Vatika.',
    ogDesc: 'Saturday, 26 December 2026 · 7:30 PM · Mewar Vatika. Tap to open the invitation.',
    events: { celebration: { ...EV.dawat, title: 'Wedding Celebration', calTitle: `Wedding Celebration – ${PAIR}`,
      calDetails: `With immense joy, Parvez & Nazima Kazi invite you to celebrate the wedding of their daughter Shifa with Mohammad Umair.` } },
    mainEvent: 'celebration', endSection: 'thanks', icsName: 'Shifa-Umair-Wedding.ics',
    sections: ['main:mainFriends', 'invite:messageFriends', 'details:celebration', 'countdown:countdown', 'thanks:thanksFriends'],
    fns: [],
    og: { eyebrow: 'WEDDING CELEBRATION', lines: ['SATURDAY · 26 DECEMBER 2026', '7:30 PM · MEWAR VATIKA'] },
  },
  {
    slug: 'shifa-personal-wedding-invitation',
    title: `Shifa is getting married · ${PAIR}`,
    desc: 'I’m so happy to share that I’m getting married! Dawat-e-Ishq, Saturday, 26 December 2026, 7:30 PM, Mewar Vatika, Mira Road. With love, Shifa.',
    ogDesc: 'Dawat-e-Ishq · Saturday, 26 December 2026 · 7:30 PM · Mewar Vatika, Mira Road. Tap to open.',
    events: { dawat: { ...EV.dawat, venue: { name: 'Mewar Vatika', address: 'Mira Road' }, mapsUrl: MAP.mewarPersonal,
      calTitle: `Dawat-e-Ishq – ${PAIR}`,
      calDetails: 'I’m so happy to share that I’m getting married! Having you there to celebrate would mean the world to me. With love, Shifa.' } },
    mainEvent: 'dawat', endSection: 'thanks', icsName: 'Shifa-Dawat-e-Ishq.ics',
    sections: ['main:main', 'invite:messagePersonal', 'scratch:scratch', 'details:dawat', 'countdown:countdown', 'thanks:thanksPersonal'],
    fns: [],
    og: { eyebrow: 'I’M GETTING MARRIED', lines: ['DAWAT-E-ISHQ', 'SATURDAY · 26 DECEMBER 2026 · 7:30 PM', 'MEWAR VATIKA, MIRA ROAD'] },
  },
];

/* ── paintings: size, alt text, motion layers (cut live from the painting, as in the design) ── */
const P = {
  main: { W: 793, H: 1600, dark: true, alt: 'In the name of Allah, the Most Gracious, the Most Merciful. Together with our families, Shifa and Mohammad Umair. Together in faith, forever in love. You are warmly invited to our wedding celebrations.' },
  mainFriends: { W: 793, H: 1600, dark: true, alt: 'With immense joy. Together with our families, Shifa and Mohammad Umair. Saturday, 26 December 2026. You are warmly invited to our wedding celebrations.' },
  messageFamily: { W: 733, H: 1100, alt: 'You’re invited. With immense gratitude to Allah (SWT), we are delighted to invite you and your family to the wedding of our daughter Shifa with Mohammad Umair on Saturday, 26th December 2026. Your presence and sincere duas are the greatest blessings we could ask for as they begin this new chapter together. Parvez and Nazima. Shifa, daughter of Parvez and Nazima. Mohammad Umair, son of Shahnawaz and Roomana.' },
  messageFriends: { W: 733, H: 1100, alt: 'You’re invited. With immense joy, we invite you and your family to celebrate the wedding of our daughter Shifa with Mohammad Umair. Your friendship has always meant so much to us, and we would truly love to have you there to bless the couple as they begin this new chapter together. Please consider this as a personal invitation, we can’t wait to celebrate with you! Warmly, Parvez and Nazima Kazi.' },
  messagePersonal: { W: 733, H: 1100, alt: 'I’m so happy to share that I’m getting married! As I step into this new chapter of my life, having you there to celebrate and share your best wishes would mean the world to me. Please consider this a personal invitation, I can’t wait to celebrate with you! With love, Shifa.' },
  scratch: { W: 900, H: 1600, dark: true, alt: 'A date written for us. Scratch to reveal our special date.' },
  functions: { W: 689, H: 1600, alt: 'Our Functions. Three beautiful occasions, one blessed journey: Rang-e-Noor, Tuesday 22 December; Qubool Hai, Thursday 24 December; Dawat-e-Ishq, Saturday 26 December. Your presence will make our days more special.' },
  countdown: { W: 628, H: 1600, dark: true, ref: true, alt: 'The wait is almost over. Some moments are worth the wait.' },
  thanksFamily: { W: 733, H: 560, alt: 'Thank you. We sincerely thank you for being a part of our happiness. Your presence, love and blessings will make these celebrations even more memorable. With love, Parvez and Nazima.' },
  thanksFriends: { W: 733, H: 560, alt: 'Thank you. Thank you for celebrating this special moment with us. Your presence and warm wishes mean so much to our family. With love, Parvez and Nazima Kazi.' },
  thanksPersonal: { W: 733, H: 560, alt: 'Thank you. Thank you for being a part of my special journey. Your love, blessings and presence will make my celebration even more meaningful. With love, Shifa.' },
  quran: { W: 995, H: 1581, dark: true, ref: true, alt: 'And of everything We created pairs so that you may remember. Surah Az-Zariyat 51:49.' },
  rangeNoor: { W: 709, H: 1600, alt: 'Rang-e-Noor.' },
  quboolHai: { W: 761, H: 1600, dark: true, alt: 'Nikah. Qubool Hai. A sacred bond in the sight of Allah.' },
  dawat: { W: 761, H: 1600, dark: true, alt: 'Dawat-e-Ishq. An evening of blessings, good food and togetherness.' },
  celebration: { W: 761, H: 1600, dark: true, alt: 'Wedding celebration. An evening of blessings, good food and togetherness.' },
};
const M_MAIN = { sway: [[0, 515, 115, 290, .35, 1.4, 5.2], [675, 395, 118, 270, .63, 1.2, 6.1], [650, 960, 140, 230, .51, 1.0, 5.6]], drift: [[590, 70, 185, 170, 'butterfly']], settle: [[150, 880, 500, 500, 1.04, .5, 1, 2.8, .2]], curtain: [[595, 0, 198, 340, 'r', 1.2, 2.6]], para: [[0, 0, 235, 270, -1.5], [0, 1080, 270, 340, 1.7], [612, 1140, 181, 290, 1.5]] };
const M_MSG = { sway: [[300, 75, 140, 172, .49, 1.2, 5.6], [635, 755, 98, 260, .77, 1.0, 6.3]], drift: [[0, 855, 215, 245, 'bob']], curtain: [[590, 70, 143, 260, 'r', 1.18, 2.4]], para: [[0, 90, 198, 290, -1.3]] };
const M_THANKS = { para: [[0, 330, 203, 140, 1.5], [556, 300, 177, 170, 1.5]] };
const M_BANQUET = { sway: [[245, 0, 300, 262, .51, .8, 7], [688, 135, 73, 270, .64, 1.3, 5.2], [585, 325, 80, 160, .5, 1.6, 4.6], [92, 1025, 75, 150, .5, 1.4, 5.4], [598, 1012, 75, 160, .5, 1.4, 6]], curtain: [[0, 150, 150, 470, 'l', 1.25, 2.8], [602, 0, 159, 620, 'r', 1.25, 2.8]], settle: [[80, 640, 600, 280, 1.035, .5, 1, 2.8, .3], [0, 1230, 160, 370, 1.09, 0, 1, 2.6, .5]], textDelay: 500 };
const MOTION = {
  main: M_MAIN, mainFriends: M_MAIN,
  messageFamily: M_MSG, messageFriends: M_MSG, messagePersonal: M_MSG,
  thanksFamily: M_THANKS, thanksFriends: M_THANKS, thanksPersonal: M_THANKS,
  scratch: { sway: [[0, 95, 165, 450, .37, 1.1, 6.4], [85, 478, 105, 245, .45, 1.6, 4.8]], para: [[0, 120, 330, 195, -1.3], [655, 1080, 245, 380, 1.7]], keep: [[685, 20, 180, 215]],
    refText: [{ p: [335, 192, 240, 82, '#34090a', '#360a0b'] }, { p: [185, 320, 560, 275, '#33090a', '#360a0a'] }, { p: [290, 618, 330, 100, '#330a0a', '#2d0606'] }, { p: [255, 1115, 395, 60, '#320809', '#350a0b'] }] },
  functions: { sway: [[0, 210, 104, 290, .48, 1.3, 5.5]], curtain: [[0, 90, 100, 190, 'l', 1.2, 2.2], [440, 90, 249, 210, 'r', 1.15, 2.4]], para: [[0, 1360, 340, 110, 1.6]],
    refText: [{ p: [105, 222, 480, 210, '#e3c099', '#efd8bf'] }] },
  countdown: { sway: [[245, 70, 150, 185, .49, 1.2, 5.8], [8, 210, 90, 118, .47, 1.8, 4.4]], curtain: [[0, 80, 245, 248, 'l', 1.15, 2.4], [400, 80, 228, 248, 'r', 1.15, 2.4]], para: [[0, 1370, 270, 150, 1.5], [395, 1370, 233, 150, 1.5]],
    refText: [{ p: [50, 330, 535, 100, '#280101', '#270001'] }, { p: [90, 742, 450, 122, '#230001', '#280102'] }] },
  quran: { drift: [[480, 120, 260, 230, 'butterfly'], [190, 140, 180, 210, 'twinkle']], curtain: [[0, 110, 230, 310, 'l', 1.15, 2.4]], para: [[0, 915, 530, 485, 1.7], [685, 120, 310, 210, -1.3]],
    refText: [{ p: [290, 420, 480, 200, '#2b0404', '#230403'] }, { p: [300, 678, 450, 185, '#220304', '#1d0404'] }, { p: [355, 866, 340, 44, '#1c0403', '#1d0404'] }] },
  rangeNoor: { sway: [[210, 0, 270, 170, .5, 1.6, 4.2], [125, 140, 75, 195, .5, 2.2, 3.6], [605, 135, 75, 340, .5, 1.8, 4.4], [55, 500, 54, 410, .5, 1.4, 5]], drift: [[250, 175, 225, 162, 'dhol'], [0, 250, 105, 430, 'breathe']], settle: [[0, 1140, 275, 310, 1.06, 0, 1, 2.2, .3]] },
  quboolHai: { sway: [[265, 0, 230, 262, .5, .8, 7], [70, 212, 105, 190, .5, 1.5, 5], [635, 288, 105, 180, .5, 1.4, 5.6], [35, 588, 100, 135, .5, 1.2, 6]], curtain: [[0, 0, 198, 790, 'l', 1.32, 3.2], [563, 0, 198, 790, 'r', 1.32, 3.2]], settle: [[100, 960, 560, 300, 1.035, .5, 1, 3, .4]], textDelay: 900,
    refText: [{ p: [300, 290, 165, 98, '#3b0704', '#340205'] }, { p: [210, 546, 340, 74, '#2d0104', '#2d0103'] }] },
  dawat: { ...M_BANQUET, refText: [{ p: [190, 537, 395, 70, '#171419', '#19151a'] }] },
  celebration: { ...M_BANQUET, refText: [{ p: [190, 537, 395, 70, '#171419', '#19151a'] }] },
};

/* ── live overlays (source pixels of each painting) ── */
const PIN = '<svg viewBox="0 0 24 30" aria-hidden="true"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.2 12 30 12 30s12-9.8 12-18.3C24 5.2 18.6 0 12 0zm0 16.4a4.7 4.7 0 1 1 0-9.4 4.7 4.7 0 0 1 0 9.4z" fill="currentColor"/></svg>';
const CAL = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="17" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2.5 9.5h19M7.5 2v5M16.5 2v5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="6.5" y="13" width="4" height="4" rx=".8" fill="currentColor"/></svg>';
const ov = (x, y, w, h, extra = '') => `style="--x:${x};--y:${y};--w:${w};--h:${h}${extra}"`;
const buttons = (id, rise, m, c) =>
  `<a class="ov maps${rise}" data-maps="${id}" ${ov(...m, ';--mf:27')} target="_blank" rel="noopener"><i></i>${PIN}<span>View on Google Maps</span></a>\n` +
  `<a class="ov maps maps--cal${rise}" data-gcal="${id}" ${ov(...c, ';--mf:27')} target="_blank" rel="noopener"><i></i>${CAL}<span>Add to Calendar</span></a>`;
function overlays(plate, id, inFn) {
  const r = inFn ? ' rise' : '';
  if (plate === 'rangeNoor') return [
    `<div class="ov info info--ink" data-ev="${id}" ${ov(140, 486, 430, 312, ';--gap:12;--fd:37;--ft:34;--fv:36')}><span class="${r}" data-date></span><span class="${r}" data-times></span><span class="${r}" data-venue></span><span class="${r}" data-dress></span></div>`,
    buttons(id, r, [160, 816, 390, 80], [160, 910, 390, 80])].join('\n');
  if (plate === 'quboolHai') return [
    `<div class="ov info info--gold" data-ev="${id}" ${ov(176, 644, 410, 108, ';--gap:3;--fd:33;--ft:28')}><span class="${r}" data-date></span><span class="${r}" data-times></span></div>`,
    `<div class="ov info info--gold" data-ev="${id}" ${ov(150, 766, 462, 130, ';--gap:8;--fv:34;--fdc:24')}><span class="${r}" data-venue></span><span class="${r}" data-dress></span></div>`,
    buttons(id, r, [186, 1296, 390, 80], [186, 1392, 390, 80])].join('\n');
  /* the banquet card (dawat · celebration) */
  return [
    `<div class="ov info info--ink" data-ev="${id}" ${ov(160, 950, 440, 116, ';--gap:6;--fd:38;--ft:34')}><span class="${r}" data-date></span><span class="${r}" data-times></span></div>`,
    `<div class="ov info info--ink" data-ev="${id}" ${ov(160, 1084, 440, 130, ';--gap:8;--fv:38;--fdc:26')}><span class="info__lbl${r}">Venue</span><span class="${r}" data-venue></span><span class="${r}" data-dress></span></div>`,
    buttons(id, r, [186, 1240, 390, 84], [186, 1378, 390, 84])].join('\n');
}

/* ── section markup ── */
function sectionHtml(id, plate, page) {
  const p = P[plate], img = `assets/screens/${plate}.jpg`, cls = p.dark ? 'sec--dark' : 'sec--light';
  const open = (petals, sparks) => `  <section id="${id}" class="sec ${cls}" style="--W:${p.W};--H:${p.H}" data-petals="${petals}" data-sparkles="${sparks}">\n    <div class="art">\n      <img src="${img}" width="${p.W}" height="${p.H}" alt="${p.alt}" ${id === 'main' ? 'decoding="async" fetchpriority="high"' : 'loading="lazy" decoding="async"'}>`;
  const close = '    </div>\n  </section>';
  switch (id) {
    case 'main': return `${open(5, 10)}
      <i class="glow" style="--gx:5%;--gy:39%;--gs:36"></i>
      <i class="glow" style="--gx:94%;--gy:30%;--gs:36"></i>
      <i class="glow" style="--gx:90%;--gy:67%;--gs:30"></i>
      <div class="scroll-cue" aria-hidden="true"><span></span></div>
${close}`;
    case 'invite': return `${open(3, 6)}
      <i class="glow" style="--gx:50%;--gy:11%;--gs:34"></i>
      <i class="glow" style="--gx:96%;--gy:58%;--gs:30"></i>
${close}`;
    case 'thanks': return `${open(3, 6)}
      <i class="glow" style="--gx:50%;--gy:40%;--gs:30"></i>
${close}`;
    case 'scratch': return `${open(4, 10)}
      <i class="glow" style="--gx:8%;--gy:21%;--gs:38"></i>
      <i class="glow" style="--gx:14%;--gy:37%;--gs:20"></i>
      <div class="ov ticket" style="--x:122;--y:735;--w:658;--h:330">
        <div class="ticket__reveal" id="ticketReveal">
          <p class="ticket__label">Save the Date</p>
          <p class="ticket__date" id="ticketDate"></p>
          <p class="ticket__full" id="ticketFull"></p>
        </div>
        <canvas id="scratchCanvas" class="ticket__canvas" role="button" tabindex="0" aria-label="Scratch to reveal our special date. Press Enter to reveal."></canvas>
        <div class="ticket__burst" aria-hidden="true"></div>
      </div>
${close}`;
    case 'functions': return `${open(4, 6)}
      <i class="glow" style="--gx:7%;--gy:24%;--gs:34"></i>
${page.fns.map((f, i) => `      <button class="ov hotspot hotspot--plaque" data-fn="${f}" style="--x:80;--y:${[614, 804, 994][i]};--w:520;--h:136" aria-label="${page.events[f].title} details"><i></i></button>`).join('\n')}
${close}`;
    case 'countdown': return `${open(4, 14)}
      <i class="glow" style="--gx:50.6%;--gy:8%;--gs:40"></i>
      <i class="glow" style="--gx:6%;--gy:84%;--gs:34"></i>
      <i class="glow" style="--gx:93%;--gy:85.5%;--gs:34"></i>
      <div class="ov cd" style="--x:31;--y:500;--w:123;--h:186"><b id="cdDays">00</b><span>Days</span></div>
      <div class="ov cd" style="--x:178;--y:500;--w:123;--h:186"><b id="cdHours">00</b><span>Hours</span></div>
      <div class="ov cd" style="--x:326;--y:500;--w:123;--h:186"><b id="cdMins">00</b><span>Minutes</span></div>
      <div class="ov cd" style="--x:474;--y:500;--w:123;--h:186"><b id="cdSecs">00</b><span>Seconds</span></div>
      <a class="ov hotspot hotspot--save" id="calSave"    style="--x:88;--y:973;--w:452;--h:102" href="#" aria-label="Save our date to Google Calendar"><i></i></a>
      <a class="ov hotspot hotspot--icon" id="calGoogle"  style="--x:85;--y:1132;--w:130;--h:142" href="#" target="_blank" rel="noopener" aria-label="Add to Google Calendar"></a>
      <a class="ov hotspot hotspot--icon" id="calApple"   style="--x:245;--y:1132;--w:130;--h:142" href="#" aria-label="Add to Apple Calendar"></a>
      <a class="ov hotspot hotspot--icon" id="calOutlook" style="--x:410;--y:1132;--w:130;--h:142" href="#" target="_blank" rel="noopener" aria-label="Add to Outlook Calendar"></a>
${close}`;
    case 'quran': return `${open(4, 16)}
      <i class="glow" style="--gx:79%;--gy:79%;--gs:40"></i>
      <i class="glow" style="--gx:60%;--gy:15%;--gs:30"></i>
      <i class="glow" style="--gx:27.6%;--gy:15%;--gs:22"></i>
${close}`;
    case 'details': return `${open(2, 14)}
      <i class="glow" style="--gx:52%;--gy:8%;--gs:56"></i>
      <i class="glow" style="--gx:96%;--gy:14%;--gs:26"></i>
      <i class="glow glow--flame" style="--gx:6%;--gy:90%;--gs:24"></i>
${overlays(plate, page.mainEvent, false).replace(/^/gm, '      ')}
${close}`;
  }
  throw new Error('section ' + id);
}
function fnHtml(f, page) {
  const p = P[f];
  const dark = p.dark ? 'sec--dark' : 'sec--light';
  const fx = { rangeNoor: 'data-petals="1" data-sparkles="4"', quboolHai: 'data-petals="6" data-sparkles="12"', dawat: 'data-petals="2" data-sparkles="14" data-sparkle-top="1"' }[f];
  return `      <article class="fn__page ${dark}" data-fn="${f}" data-scene="${f}" ${fx} style="--W:${p.W};--H:${p.H}">
        <div class="art">
          <img data-src="assets/screens/${f}.jpg" width="${p.W}" height="${p.H}" alt="${p.alt}" decoding="async">
${overlays(f, f, true).replace(/^/gm, '          ')}
        </div>
      </article>`;
}

/* the colours each rising line hides behind, read from the finished painting */
async function sceneColours(file, boxes) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const avg = (y, x0, x1) => {
    y = Math.max(0, Math.min(H - 1, y)); let r = 0, g = 0, b = 0, n = 0;
    for (let x = Math.max(0, x0); x < Math.min(W, x1); x += 2) { const i = (y * W + x) * 3; r += data[i]; g += data[i + 1]; b += data[i + 2]; n++; }
    const h = (v) => Math.round(v / n).toString(16).padStart(2, '0'); return '#' + h(r) + h(g) + h(b);
  };
  return boxes.map(([x, y, w, h, kind]) => {
    const p = [x, y, w, h, avg(y - 2, x, x + w), avg(y + h + 1, x, x + w)];
    return kind ? { p, cuts: [[x, y, w, h, 0, kind]] } : { p };
  });
}

/* calendar files (Apple / Outlook): Asia/Kolkata, the supplied start, the default length */
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const clock = (t) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
function ics(id, e, url) {
  const st = Date.parse(`${e.date}T${e.time}:00+05:30`), en = st + e.hours * 3600000;
  const wall = (ms) => new Date(ms + 5.5 * 3600000).toISOString().slice(0, 19).replace(/[-:]/g, '');
  const venue = [e.venue.name, e.venue.address].filter(Boolean).join(', ');
  const det = [e.calDetails, e.times ? e.times.map(([n, t]) => `${n}: ${clock(t)}`).join('\n') : '', e.dress ? `Dress code: ${e.dress}` : '',
    `Venue: ${venue}`, `Google Maps: ${e.mapsUrl}`, `Invitation: ${url}`].filter(Boolean).join('\n\n');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Shifa & Mohammad Umair//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
    'BEGIN:VEVENT', `UID:${wall(st)}-${id}@${new URL(url).pathname.replace(/\//g, '')}.invitivals.com`, 'DTSTAMP:20261128T000000Z',
    `DTSTART;TZID=Asia/Kolkata:${wall(st)}`, `DTEND;TZID=Asia/Kolkata:${wall(en)}`,
    `SUMMARY:${esc(e.calTitle)}`, `LOCATION:${esc(venue)}`, `DESCRIPTION:${esc(det)}`, `URL:${url}`, 'STATUS:CONFIRMED',
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.calTitle)}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
}

/* the WhatsApp / link preview: velvet, roses, the couple, the names (1200×630) */
async function og(page, out) {
  const W = 1200, H = 630, TMP = path.join(SRC, 'build'), bg = path.join(TMP, 'og-bg.jpg');
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="v" cx="62%" cy="45%" r="80%"><stop offset="0" stop-color="#6a0f1a"/><stop offset=".55" stop-color="#430812"/><stop offset="1" stop-color="#22030a"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#v)"/></svg>`)).jpeg({ quality: 95 }).toFile(bg);
  const LAY = path.join(REF, 'assets/layers/');
  const cw = 500, chh = Math.round(1312 * cw / 1199);
  const couple = await sharp(path.join(SRC, 'couple-cutout.png')).resize(cw, chh).png().toBuffer();
  const fade = `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${chh}"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="white"/><stop offset=".78" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient></defs><rect width="${cw}" height="${chh}" fill="url(#f)"/></svg>`;
  const glow = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="610"><defs><radialGradient id="g" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="#e9a86a" stop-opacity=".34"/><stop offset="1" stop-color="#2a0406" stop-opacity="0"/></radialGradient></defs><rect width="640" height="610" fill="url(#g)"/></svg>`)).png().toBuffer();
  const ox = 690, oy = 40;
  const GOLD = 'background:linear-gradient(180deg,#f4dc9c 0%,#d9ae5c 45%,#b98a3a 70%,#e8c77e 100%);-webkit-background-clip:text;background-clip:text;color:transparent;';
  const caps = (px, c, ls = .2) => `font:500 ${px}px/1.35 Cinzel,serif;letter-spacing:${ls}em;color:${c};`;
  await paintScreen({
    src: bg, out, W, H, wait: 5000,
    photos: [
      { file: await sharp(LAY + 'rose-b.png').extract({ left: 12, top: 44, width: 298, height: 266 }).png().toBuffer(), x: -40, y: 470, w: 230, h: 205, fit: 'contain' },
      { file: await sharp(LAY + 'rose-a.png').flop().png().toBuffer(), x: 1010, y: -40, w: 230, h: 223, fit: 'contain' },
      { file: glow, x: 620, y: 20, w: 640, h: 610 },
      { file: couple, x: ox, y: oy, w: cw, h: chh, mask: fade },
    ],
    css: `.edge{position:absolute;inset:18px;border:1.5px solid rgba(214,176,108,.6);border-radius:6px}.edge2{position:absolute;inset:26px;border:1px solid rgba(214,176,108,.3);border-radius:4px}`,
    html: ['<div class="edge"></div><div class="edge2"></div>',
      text(60, 70, 640, 40, page.og.eyebrow, caps(22, '#e3c697', .3)),
      text(40, 124, 680, 130, 'Shifa', `font:400 112px/1 'Great Vibes',cursive;${GOLD}padding:20px 0 10px`),
      text(40, 238, 680, 56, '&amp;', "font:italic 500 46px/1 'Cormorant Garamond',serif;color:#e0bf86;"),
      text(40, 290, 680, 120, 'Mohammad Umair', `font:400 92px/1 'Great Vibes',cursive;${GOLD}padding:18px 0 10px`),
      text(200, 432, 360, 4, '', 'border-top:1px solid rgba(225,190,130,.6)'),
      ...page.og.lines.map((l, i) => text(150, 452 + i * 40, 460, 38, l, caps(page.og.lines.length > 2 ? 21 : 25, '#f0d9ae', .12) + 'white-space:nowrap')),
    ].join('\n') + `<script>window.addEventListener('load',function(){setTimeout(function(){document.querySelectorAll('.t').forEach(function(el){var fs=parseFloat(getComputedStyle(el).fontSize),n=0;while(el.scrollWidth>el.clientWidth&&fs>8&&n++<100){fs-=1;el.style.fontSize=fs+'px';}});},300);});</script>`,
  });
}

const copy = (a, b) => { fs.mkdirSync(path.dirname(b), { recursive: true }); fs.copyFileSync(a, b); };
const only = process.argv.slice(2);
for (const page of PAGES) {
  if (only.length && !only.includes(page.slug)) continue;
  const DIR = path.join('public', page.slug), URL_ = SITE + page.slug + '/';
  fs.mkdirSync(DIR, { recursive: true });
  const plates = [...page.sections.map((s) => s.split(':')[1]), ...page.fns];

  /* paintings: the repainted plates, plus the design's own countdown and Qur'an pages unchanged */
  for (const pl of plates) copy(P[pl].ref ? path.join(REF, 'assets/screens', pl + '.jpg') : path.join(PLATES, pl + '.jpg'), path.join(DIR, 'assets/screens', pl + '.jpg'));
  for (const f of ['butterfly', 'corner-l', 'corner-r', 'petal', 'rose-a', 'rose-b']) copy(path.join(REF, 'assets/layers', f + '.png'), path.join(DIR, 'assets/layers', f + '.png'));
  copy(path.join(REF, 'assets/audio/background.mp3'), path.join(DIR, 'assets/audio/background.mp3'));
  copy(path.join(REF, 'assets/intro-poster.jpg'), path.join(DIR, 'assets/intro-poster.jpg'));
  copy(path.join(SRC, 'intro-video.mp4'), path.join(DIR, 'assets/intro-video.mp4'));     // the film, ended on the empty arch
  copy(path.join(REF, '.htaccess'), path.join(DIR, '.htaccess'));

  /* engine, stylesheet, config */
  copy(path.join(ENGINE, 'app.js'), path.join(DIR, 'js/app.js'));
  fs.mkdirSync(path.join(DIR, 'css'), { recursive: true });
  fs.writeFileSync(path.join(DIR, 'css/style.css'), fs.readFileSync(path.join(REF, 'css/style.css'), 'utf8').replace(/\r\n/g, '\n')
    .replace('   Ahmad & Layla · continuous scrollable invitation', `   ${PAIR} · continuous scrollable invitation (the Rose Red premium design)`) + fs.readFileSync(path.join(ENGINE, 'extra.css'), 'utf8'));
  fs.writeFileSync(path.join(DIR, 'js/config.js'), `/* ${page.slug} — EDIT HERE: this invitation's events (written by tools/shifa-umair-pages.mjs from the client's brief of
   28 Nov 2026). Dates, times, venues and map links are the client's, exactly as supplied. Weekdays are computed from the dates.
   hours = the calendar entry's length: no end times were supplied, so a default is used; the start is never moved. */
window.INVITE = ${JSON.stringify({ couple: PAIR, url: URL_, timeZone: 'Asia/Kolkata', utcOffset: '+05:30', music: 'assets/audio/background.mp3', musicVolume: 0.4, musicEndVolume: 0,
    mainEvent: page.mainEvent, endSection: page.endSection, icsName: page.icsName, events: page.events }, null, 2)};
`);
  /* calendar files */
  for (const [id, e] of Object.entries(page.events)) { fs.mkdirSync(path.join(DIR, 'assets/cal'), { recursive: true }); fs.writeFileSync(path.join(DIR, 'assets/cal', id + '.ics'), ics(id, e, URL_)); }

  /* scenes.js: the design's motion layers + this invitation's own lettering, per section id / function page */
  const scenes = {};
  for (const s of page.sections.concat(page.fns.map((f) => f + ':' + f))) {
    const [id, pl] = s.split(':');
    const m = { ...(MOTION[pl] || {}) };
    let textList = m.refText || [];
    delete m.refText;
    if (!P[pl].ref) {
      if (!SCENE_TEXT[pl]) await PLATES_DEF[pl]();
      textList = textList.concat(await sceneColours(path.join(PLATES, pl + '.jpg'), SCENE_TEXT[pl] || []));
    }
    scenes[id] = { text: textList, ...m };
  }
  fs.writeFileSync(path.join(DIR, 'js/scenes.js'), `/* Layer map for every painting of this invitation, in SOURCE pixels of that painting (written by tools/shifa-umair-pages.mjs).
   text: { p:[x,y,w,h,top,bottom], cuts?:[[x,y,w,h,delayMs,kind]] } · sway: [x,y,w,h,pivotX,deg,s] · drift: [x,y,w,h,kind]
   settle: [x,y,w,h,fromScale,ox,oy,s,delay] · curtain: [x,y,w,h,'l'|'r',fromScaleX,s] · para: [x,y,w,h,depth] · keep: [x,y,w,h] */
window.SCENES = ${JSON.stringify(scenes, null, 0).replace(/\},"/g, '},\n  "')};
`);

  /* preview image */
  await og(page, path.join(DIR, 'assets/og.jpg'));

  /* index.html */
  const h = (v) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const IMG = URL_ + 'assets/og.jpg?v=1';
  const sections = page.sections.map((s) => { const [id, pl] = s.split(':'); return sectionHtml(id, pl, page); }).join('\n\n');
  const fnBlock = page.fns.length ? `
<!-- FUNCTION DETAIL (in-place overlay, the invitation stays alive underneath) -->
<div id="fnOverlay" class="fn" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Function details">
  <div class="fn__scroll" id="fnScroll">
    <div class="fn__col">
      <button class="fn__back" id="fnBack" type="button" aria-label="Back to Our Functions">
        <svg viewBox="0 0 18 12" aria-hidden="true"><path d="M6.5 1 1.5 6l5 5M2 6h15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Back
      </button>
${page.fns.map((f) => fnHtml(f, page)).join('\n\n')}
    </div>
  </div>
</div>
` : `
<!-- (no function pages on this invitation; the engine's overlay hooks stay inert) -->
<div id="fnOverlay" class="fn" aria-hidden="true" hidden><div class="fn__scroll" id="fnScroll"><div class="fn__col"><button class="fn__back" id="fnBack" type="button" tabindex="-1">Back</button></div></div></div>
`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#2a0508">
<title>${h(page.title)}</title>
<meta name="description" content="${h(page.desc)}">

<!-- link preview (WhatsApp, iMessage, Facebook, X) -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Invitivals">
<meta property="og:locale" content="en_IN">
<meta property="og:url" content="${URL_}">
<meta property="og:title" content="${h(page.title)}">
<meta property="og:description" content="${h(page.ogDesc)}">
<meta property="og:image" content="${IMG}">
<meta property="og:image:secure_url" content="${IMG}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${h(PAIR)} — ${h(page.ogDesc.split('. Tap')[0])}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${h(page.title)}">
<meta name="twitter:description" content="${h(page.ogDesc)}">
<meta name="twitter:image" content="${IMG}">
<link rel="canonical" href="${URL_}">

<!-- Preload only what the guest sees first: envelope, main invitation, next screen -->
<link rel="preload" as="image" href="assets/intro-poster.jpg" fetchpriority="high">
<link rel="preload" as="image" href="assets/screens/${page.sections[0].split(':')[1]}.jpg">
<link rel="preload" as="image" href="assets/screens/${page.sections[1].split(':')[1]}.jpg">
<link rel="preload" as="image" href="assets/layers/butterfly.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Great+Vibes&display=swap" rel="stylesheet">

<link rel="stylesheet" href="css/style.css">
</head>
<body class="is-sealed">

<!-- ENVELOPE: the design's opening film, ending on the empty arch; the invitation's own arch (the couple) dissolves in -->
<div id="envelope" class="envelope" role="button" tabindex="0" aria-label="Open the invitation">
  <div class="envelope__col">
    <div class="envelope__stage">
      <video id="introVideo" class="envelope__video" src="assets/intro-video.mp4" poster="assets/intro-poster.jpg"
             playsinline webkit-playsinline preload="auto" aria-hidden="true"></video>
      <div class="envelope__seal" aria-hidden="true"><span></span></div>
      <p class="envelope__hint" aria-hidden="true">Tap the seal to open</p>
    </div>
    <button id="introSkip" class="envelope__skip" type="button" tabindex="-1">Skip</button>
  </div>
</div>

<!-- ONE CONTINUOUS SCROLLABLE INVITATION (paintings: tools/shifa-umair-art.mjs; this file: tools/shifa-umair-pages.mjs) -->
<main id="invitation" class="invitation">

${sections}

</main>
${fnBlock}
<!-- the only global fixed control -->
<button id="muteBtn" class="mute" type="button" aria-label="Mute music" aria-pressed="false" hidden>
  <svg class="mute__on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.2L12 18.6V5.4L7.2 9.5H4z" fill="currentColor"/><path d="M15 8.6a4.6 4.6 0 0 1 0 6.8M17.4 6.2a8 8 0 0 1 0 11.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
  <svg class="mute__off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.2L12 18.6V5.4L7.2 9.5H4z" fill="currentColor"/><path d="M15.5 9.5l5 5m0-5l-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
</button>

<script src="js/config.js"></script>
<script src="js/scenes.js"></script>
<script src="js/app.js"></script>
<script src="/_credit/v1/credit.js" defer data-into="#invitation" data-bg="#2a0508" data-color="#e9c98a"></script>
</body>
</html>
`;
  if (page.slug === 'shifa-umair-friends-wedding' && /Allah|Bismillah|Qur|Nikah|Surah|dua/i.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) throw new Error('religious wording on the friends page');
  fs.writeFileSync(path.join(DIR, 'index.html'), html);
  console.log('✓', page.slug);
}
