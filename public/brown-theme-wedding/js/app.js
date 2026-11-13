/* Brown Theme Wedding: the invitation assembled from its components.
   Scroll order: 1 hero, 2 date, 3 functions, 6 memories, 7 RSVP, 8 thank you.
   Pages 4 and 5 are detail views opened from page 3. */
import { config as C } from '../config.js';
import { h, observePages } from './util.js';
import { InvitationPage, spr, textOr, control, pic, butterfly } from './page.js';
import { OpeningScreen } from './opening.js';
import { AudioControl } from './audio.js';
import { SparkleOverlay } from './sparkle.js';
import { DateReveal } from './date-reveal.js';
import { openDetail, saveTheDate, openMaps } from './event-detail.js';
import { MemoriesCarousel } from './memories.js';
import { RSVPModal } from './rsvp.js';

const app = document.getElementById('app');
const audio = AudioControl(C.opening);
const sparkle = SparkleOverlay();
const rsvp = RSVPModal(C.rsvp);

const page1 = InvitationPage(1, [
  spr('p1-flowers-a', { still: true, motion: 'sway soft', origin: '0% 45%', z: 1 }),
  spr('p1-flowers-b', { still: true, motion: 'sway soft alt', origin: '0% 50%', z: 1 }),
  butterfly('p1-butterfly', { z: 2 }),
  spr('p1-ganesha', { delay: 0.1, alt: 'Lord Ganesha' }),
  spr('p1-blessing1', { delay: 0.3, alt: 'With the blessings of' }),
  spr('p1-blessing2', { delay: 0.45, alt: 'Lord Ganesha' }),
  spr('p1-rule1', { delay: 0.6 }),
  spr('p1-request', { delay: 0.75, alt: 'We request the pleasure of your company at the wedding celebration of' }),
  textOr(C.couple.groom, 'Arjun', 'p1-groom', { size: 13, cls: 'script', delay: 0.6, slow: true }),
  spr('p1-and', { delay: 1.25, alt: 'and' }),
  textOr(C.couple.bride, 'Aadhya', 'p1-bride', { size: 13, cls: 'script', delay: 0.9, slow: true }),
  spr('p1-rule2', { delay: 1.7 }),
  h('div', { class: 'hint', 'aria-hidden': 'true' }, h('span', {}, 'Scroll'), h('i')),
]);

const page2 = InvitationPage(2, [
  spr('p2-flowers-a', { still: true, motion: 'sway soft', origin: '0% 45%', z: 1 }),
  spr('p2-flowers-b', { still: true, motion: 'sway soft alt', origin: '100% 20%', z: 1 }),
  spr('p2-flowers-c', { still: true, motion: 'sway soft alt', origin: '0% 60%', z: 1 }),
  spr('p2-flowers-d', { still: true, motion: 'sway soft', origin: '100% 60%', z: 1 }),
  butterfly('p2-butterfly-a', { z: 2 }),
  butterfly('p2-butterfly-b', { z: 2 }),
  spr('p2-title', { delay: 0.2, alt: 'Reveal Our Date' }),
  spr('p2-rule', { delay: 0.45 }),
  spr('p2-click', { delay: 0.6, alt: 'Click the button' }),
  ...DateReveal(C.date),
]);

const plaque = (id, label, onOpen, delay) => control(id,
  h('button', { class: 'plaque', type: 'button', 'aria-label': `${label}: view details`, onclick: onOpen }, pic(id, '')), { delay, cls: 'plaque-wrap' });

const S = C.events.shaadi;
const shaadiPage = () => InvitationPage(4, [
  spr('p4-title', { delay: 0.15, alt: S.title }),
  spr('p4-rule', { delay: 0.3 }),
  spr('p4-tagline', { delay: 0.4, alt: S.tagline.join(' ') }),
  textOr(`${S.day}${S.suffix}`, '1st', 'p4-day', { size: 6, delay: 0.55 }),
  textOr(`${S.month.toUpperCase()} ${S.year}`, 'NOVEMBER 2026', 'p4-month', { size: 2.6, delay: 0.55 }),
  textOr(S.time, '11:00 AM', 'p4-time', { size: 2.6, delay: 0.7 }),
  spr('p4-rule2', { delay: 0.8 }),
  textOr(S.venue, 'Virupakshi Gardens', 'p4-venue', { size: 3, delay: 0.9 }),
  textOr(S.address.join(' '), 'Karimnagar road, Govindpalli, Jagtial, Telangana, 505327', 'p4-address', { size: 1.9, delay: 1 }),
  control('p4-save', saveTheDate(S, pic('p4-save', 'Save the Date')), { delay: 1.1 }),
  control('p4-maps', openMaps(S, pic('p4-maps', 'Open in Google Maps')), { delay: 1.1 }),
]);

const R = C.events.reception;
const receptionPage = () => InvitationPage(5, [
  spr('p5-lantern-a', { still: true, motion: 'sway hang', origin: '50% 0%', z: 2 }),
  spr('p5-lantern-b', { still: true, motion: 'sway hang alt', origin: '50% 0%', z: 2 }),
  spr('p5-lantern-c', { still: true, motion: 'sway hang', origin: '50% 0%', z: 2 }),
  butterfly('p5-butterfly-a', { z: 3 }),
  butterfly('p5-butterfly-b', { z: 3 }),
  butterfly('p5-butterfly-c', { z: 3 }),
  spr('p5-title', { delay: 0.15, alt: R.title }),
  spr('p5-heart', { delay: 0.35 }),
  spr('p5-lines', { delay: 0.45, alt: R.tagline.join(' ') }),
  spr('p5-flourish', { delay: 0.6 }),
  textOr(`${R.day}${R.suffix} ${R.month}`, '1st November', 'p5-date', { size: 4.2, delay: 0.7 }),
  textOr(R.year, '2026', 'p5-year', { size: 3, delay: 0.75 }),
  textOr(R.time, '11:00 AM', 'p5-time', { size: 3, delay: 0.85 }),
  control('p5-save', saveTheDate(R, pic('p5-save', 'Save the Date')), { delay: 1 }),
  control('p5-maps', openMaps(R, pic('p5-maps', 'View on Google Maps')), { delay: 1 }),
]);

const page3 = InvitationPage(3, [
  spr('p3-flowers-a', { motion: 'sway', origin: '0% 30%', delay: 0.1, z: 2 }),
  spr('p3-flowers-b', { motion: 'sway alt', origin: '0% 50%', delay: 0.2, z: 2 }),
  spr('p3-flowers-c', { motion: 'sway', origin: '0% 50%', delay: 0.3, z: 2 }),
  spr('p3-flowers-d', { motion: 'sway alt', origin: '100% 50%', delay: 0.2, z: 2 }),
  spr('p3-flowers-e', { motion: 'sway', origin: '100% 50%', delay: 0.3, z: 2 }),
  spr('p3-pin1', { motion: 'bob', delay: 0.5, z: 3 }),
  plaque('p3-plaque1', 'Shaadi', () => openDetail('Shaadi', 4, shaadiPage), 0.45),
  spr('p3-pin2', { motion: 'bob alt', delay: 0.75, z: 3 }),
  plaque('p3-plaque2', 'Reception', () => openDetail('Reception', 5, receptionPage), 0.7),
  h('div', { class: 'tap-hint plaques-hint', 'aria-hidden': 'true' }, 'Tap to view'),
]);

const page6 = InvitationPage(6, [
  spr('p6-our', { delay: 0.15, alt: 'Our' }),
  spr('p6-title', { delay: 0.3, alt: 'Memories' }),
  spr('p6-rule', { delay: 0.5 }),
  ...MemoriesCarousel(C.memories.photos),
  spr('p6-frame', { still: true, z: 3 }),
]);

const page7 = InvitationPage(7, [
  spr('p7-rule1', { delay: 0.15 }),
  spr('p7-kindly', { delay: 0.3, alt: C.rsvp.title[0] }),
  spr('p7-rsvp', { delay: 0.45, alt: C.rsvp.title[1] }),
  spr('p7-rule2', { delay: 0.6 }),
  spr('p7-lines', { delay: 0.7, alt: C.rsvp.lines.join(' ') }),
  control('p7-button', h('button', { class: 'img-btn', type: 'button', 'aria-haspopup': 'dialog', onclick: (e) => rsvp.open(e.currentTarget) }, pic('p7-button', 'Confirm Your Presence')), { delay: 0.9 }),
]);

const page8 = InvitationPage(8, [
  spr('p8-love', { delay: 0.2, alt: 'With Love' }),
  spr('p8-title', { delay: 0.4, alt: '& Gratitude' }),
  spr('p8-rule', { delay: 0.6 }),
  spr('p8-lines', { delay: 0.75, alt: C.thankYou.lines.join(' ') }),
  spr('p8-heart', { delay: 0.95 }),
  h('a', { class: 'created', href: 'https://invitivals.com/', target: '_blank', rel: 'noopener' }, 'Created by ', h('b', {}, 'INVITIVALS')),
]);

const invitation = h('main', { class: 'invitation column', id: 'invitation' }, page1, page2, page3, page6, page7, page8);
app.append(invitation);

/* the detail pages' art is ready before the first tap */
addEventListener('load', () => { for (const n of [4, 5]) { new Image().src = `assets/plate${n}.webp`; } }, { once: true });

OpeningScreen(C.opening, {
  audio,
  onStart() { invitation.classList.add('shown'); },
  onOpened() {
    sparkle.show();
    observePages(invitation);
    window.scrollTo(0, 0);
  },
});
