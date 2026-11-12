/* InvitationPage — composes one continuous invitation from weddingConfig. */
import { weddingConfig as cfg } from '../config.js';
import { GoldDefs, GoldThread } from './decor.js';
import { guestName } from './util.js';
import { IntroExperience, initIntro } from './sections/intro.js';
import { HeroSection } from './sections/hero.js';
import { WelcomeSection } from './sections/welcome.js';
import { FamilySection } from './sections/families.js';
import { EventsSection, initEvents } from './sections/events.js';
import { CeremonySection } from './sections/ceremony.js';
import { VenueSection } from './sections/venue.js';
import { CountdownSection, initCountdown } from './sections/countdown.js';
import { SaveTheDateSection, initSaveTheDate, weddingCalendar } from './sections/save-the-date.js';
import { RSVPSection, initRSVP } from './sections/rsvp.js';
import { WishesSection, initWishes } from './sections/wishes.js';
import { ThankYouSection } from './sections/thank-you.js';
import { initReveals, initParallax, initParticles } from './motion.js';
import { createMusic } from './music.js';
import { createMenu } from './menu.js';

/* sections in reading order; GoldThread stitches them without a horizontal break,
   every third stitch is a kolam instead of a plain diamond */
/* this client's invitation has no Our Story, Our Moments, Getting There, Need Help or Gifting */
const SECTIONS = [
  HeroSection, WelcomeSection, FamilySection, EventsSection, CeremonySection,
  VenueSection, CountdownSection, SaveTheDateSection, RSVPSection, WishesSection, ThankYouSection,
];
const NO_THREAD_AFTER = new Set([HeroSection, ThankYouSection]);
const guest = guestName();

const page = document.getElementById('invitation');
page.innerHTML = GoldDefs() + SECTIONS.map((S, i) => S(cfg, guest) + (NO_THREAD_AFTER.has(S) ? '' : GoldThread(i % 3 === 1))).join('');
document.body.insertAdjacentHTML('afterbegin', IntroExperience(cfg, guest));
document.getElementById('boot')?.remove(); // static poster that covered the page while modules loaded
document.title = `${cfg.brideName} & ${cfg.groomName} · Wedding Invitation`;

/* regional blessing: load only the glyphs it needs from Google Fonts */
if (cfg.regional) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cfg.regional.font)}:wght@500&text=${encodeURIComponent(cfg.regional.text + (cfg.thankYou.regional || ""))}&display=swap`;
  document.head.appendChild(l);
  document.documentElement.style.setProperty('--regional', `'${cfg.regional.font}'`);
}

initEvents(cfg);
initCountdown(cfg);
initSaveTheDate(cfg);
initRSVP(cfg, guest);
initWishes(cfg, guest);

const music = createMusic(cfg.music);
const menu = createMenu(cfg, weddingCalendar(cfg));
let remeasure;
initIntro({
  onTap: () => music.play(),
  onOpen: () => {
    window.scrollTo(0, 0);
    music.show();
    menu.show();
    initReveals();
    remeasure = initParallax();
    initParticles();
  },
});
// late-loading images change section heights; keep parallax anchors honest
window.addEventListener('load', () => remeasure?.());
