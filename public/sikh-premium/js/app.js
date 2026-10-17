/* InvitationPage — composes one continuous Sikh wedding invitation from
   weddingConfig, in the order of the design mockup.

   Two links from one folder: an event with `gate: 'mehndi'` in config appears
   only when the address carries ?mehndi. Everything (programme, cards, menu,
   calendar files) follows that one filtered list. */
import { weddingConfig as cfg } from '../config.js';
import { GoldDefs, GoldThread, PageBorders } from './decor.js';
import { guestName, toast, couple } from './util.js';
import { IntroExperience, initIntro } from './sections/intro.js';
import { HeroScene, InviteBlock, fitNames } from './sections/hero.js';
import { BlessingSection, FamilySection, StorySection } from './sections/welcome.js';
import { EventsSection, ScheduleSection } from './sections/events.js';
import { CountdownSection, initCountdown } from './sections/countdown.js';
import { GallerySection, initGallery } from './sections/gallery.js';
import { GettingHereSection, initGettingHere } from './sections/getting-here.js';
import { RSVPSection, initRSVP } from './sections/rsvp.js';
import { ClosingSection, initClosing } from './sections/closing.js';
import { initReveals, initParallax, initParticles } from './motion.js';
import { createMusic } from './music.js';
import { createMenu } from './menu.js';
import { enhanceCalendarLinks } from './calendar.js';

const params = new URLSearchParams(location.search);
const guest = guestName();
const events = cfg.events.filter((e) => !e.gate || params.has(e.gate));
const view = {
  ...cfg,
  events,
  allIcs: events.some((e) => e.gate) ? 'assets/cal/all-with-mehndi.ics' : 'assets/cal/all.ics',
};

/* a section whose config is null is left out, and the gold threads close up around it */
const chapters = [
  HeroScene(view) + InviteBlock(view, guest),
  BlessingSection(view),
  FamilySection(view),
  view.story ? StorySection(view) : '',
  ScheduleSection(view) + EventsSection(view),
  CountdownSection(view),
  view.gallery ? GallerySection(view) : '',
  view.gettingHere ? GettingHereSection(view) : '',
  view.rsvp ? RSVPSection(view, guest) : '',
].filter(Boolean);
const markup = GoldDefs() + (view.sideBorders ? PageBorders(view.sideBorders) : '')
  + chapters.join(GoldThread())
  + ClosingSection(view);

const page = document.getElementById('invitation');
page.innerHTML = markup;
document.body.insertAdjacentHTML('afterbegin', IntroExperience(view, guest));
document.getElementById('boot')?.remove();
document.title = `${couple(view).join(' & ')} · Wedding Invitation`;

/* Gurmukhi (the invocation and/or the intro's Gurbani): load only the glyphs needed */
const gurText = [view.invocation?.text, ...(view.intro.gurbani || [])].filter(Boolean).join('');
if (gurText) {
  const font = view.invocation?.font || 'Noto Serif Gurmukhi';
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@500;600;700&text=${encodeURIComponent(gurText)}&display=swap`;
  document.head.appendChild(l);
  document.documentElement.style.setProperty('--gur', `'${font}', serif`);
}

/* a hairline of gold tracking how far the guest has read */
const progress = document.createElement('div');
progress.className = 'progress'; progress.setAttribute('aria-hidden', 'true');
document.body.appendChild(progress);
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
};
addEventListener('scroll', onScroll, { passive: true });

enhanceCalendarLinks();
initCountdown(view);
if (view.gallery) initGallery(view);
if (view.gettingHere) initGettingHere(view);
if (view.rsvp) initRSVP(view, guest);
initClosing(view);

const music = createMusic(view.music, { onBlocked: () => toast('Tap ♪ to play the music') });
const menu = createMenu(view);
let remeasure;

fitNames();
initIntro({
  textAt: view.intro.textAt ?? 2,
  hold: view.intro.hold ?? 0,
  onTap: () => music.prime(),
  onOpen: () => {
    window.scrollTo(0, 0);
    music.show();
    setTimeout(() => music.play(), 700); // let the film's audio hand over first
    menu.show();
    enhanceCalendarLinks();
    initReveals();
    remeasure = initParallax();
    initParticles();
    onScroll();
  },
});

window.addEventListener('load', () => remeasure?.());
