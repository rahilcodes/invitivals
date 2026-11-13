/* InvitationPage — composes one continuous invitation from weddingConfig. */
/* ?v=3 on every import = the files as of the 2026-11-13 revisions. The site lets browsers and its CDN keep scripts for a week, so a
   changed file is asked for under a new address; raise the number (here and in index.html) whenever one changes again. */
import { weddingConfig as cfg } from '../config.js?v=3';
import { GoldDefs, GoldThread } from './decor.js?v=3';
import { guestName } from './util.js?v=3';
import { initMapLinks } from './links.js?v=3';
import { IntroExperience, initIntro } from './sections/intro.js?v=3';
import { HeroSection } from './sections/hero.js?v=3';
import { WelcomeSection } from './sections/welcome.js?v=3';
import { FamilySection } from './sections/families.js?v=3';
import { EventsSection, initEvents } from './sections/events.js?v=3';
import { CeremonySection } from './sections/ceremony.js?v=3';
import { VenueSection } from './sections/venue.js?v=3';
import { CountdownSection, initCountdown } from './sections/countdown.js?v=3';
import { MomentsSection } from './sections/moments.js?v=3';
import { SaveTheDateSection, initSaveTheDate, weddingCalendar } from './sections/save-the-date.js?v=3';
import { RSVPSection, initRSVP } from './sections/rsvp.js?v=3';
import { WishesSection, initWishes } from './sections/wishes.js?v=3';
import { ThankYouSection } from './sections/thank-you.js?v=3';
import { initReveals, initParallax, initParticles } from './motion.js?v=3';
import { createMusic } from './music.js?v=3';
import { createMenu } from './menu.js?v=3';

/* sections in reading order; GoldThread stitches them without a horizontal break,
   every third stitch is a kolam instead of a plain diamond */
/* this client's invitation has no Our Story, Getting There, Need Help or Gifting; Moments is the couple's one photograph */
const SECTIONS = [
  HeroSection, WelcomeSection, FamilySection, EventsSection, CeremonySection,
  VenueSection, CountdownSection, MomentsSection, SaveTheDateSection, RSVPSection, WishesSection, ThankYouSection,
];
const NO_THREAD_AFTER = new Set([HeroSection, ThankYouSection]);
const guest = guestName();

const page = document.getElementById('invitation');
page.innerHTML = GoldDefs() + SECTIONS.map((S, i) => S(cfg, guest) + (NO_THREAD_AFTER.has(S) ? '' : GoldThread(i % 3 === 1))).join('');
document.body.insertAdjacentHTML('afterbegin', IntroExperience(cfg, guest));
document.getElementById('boot')?.remove(); // static poster that covered the page while modules loaded
document.title = `${cfg.first} & ${cfg.second} · Wedding Invitation`;

/* regional blessing: load only the glyphs it needs from Google Fonts */
if (cfg.regional) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cfg.regional.font)}:wght@500&text=${encodeURIComponent(cfg.regional.text + (cfg.thankYou.regional || ""))}&display=swap`;
  document.head.appendChild(l);
  document.documentElement.style.setProperty('--regional', `'${cfg.regional.font}'`);
}

initMapLinks();
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
