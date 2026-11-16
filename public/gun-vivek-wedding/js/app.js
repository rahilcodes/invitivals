/* InvitationPage — composes one continuous invitation from weddingConfig.
   Gun & Vivek (client, 2026-11-16): no RSVP, no Getting There and no Warm Wishes — those modules are not in this copy. */
import { weddingConfig as cfg } from '../config.js?v=1';
import { GoldDefs, GoldThread } from './decor.js?v=1';
import { guestName } from './util.js?v=1';
import { IntroExperience, initIntro } from './sections/intro.js?v=1';
import { HeroSection } from './sections/hero.js?v=1';
import { WelcomeSection } from './sections/welcome.js?v=1';
import { StorySection } from './sections/story.js?v=1';
import { FamilySection } from './sections/families.js?v=1';
import { EventsSection, initEvents } from './sections/events.js?v=1';
import { CeremonySection } from './sections/ceremony.js?v=1';
import { VenueSection } from './sections/venue.js?v=1';
import { CountdownSection, initCountdown } from './sections/countdown.js?v=1';
import { GallerySection, initGallery } from './sections/gallery.js?v=1';
import { SaveTheDateSection, initSaveTheDate, weddingCalendar } from './sections/save-the-date.js?v=1';
import { ContactSection } from './sections/contact.js?v=1';
import { GiftingSection, initGifting } from './sections/gifting.js?v=1';
import { ThankYouSection } from './sections/thank-you.js?v=1';
import { initReveals, initParallax, initParticles } from './motion.js?v=1';
import { createMusic } from './music.js?v=1';
import { createMenu } from './menu.js?v=1';

/* sections in reading order; GoldThread stitches them without a horizontal break,
   every third stitch is a kolam instead of a plain diamond */
/* sections without details in the config (no story, no photos, no gifting) are left out */
/* names as they read on the card: groom first by default, bride first on a bride-side invitation */
cfg.pair = cfg.brideFirst ? [cfg.brideName, cfg.groomName] : [cfg.groomName, cfg.brideName];

const SECTIONS = [
  HeroSection, WelcomeSection, cfg.story && StorySection, FamilySection, EventsSection, CeremonySection,
  VenueSection, CountdownSection, cfg.gallery?.length && GallerySection, SaveTheDateSection,
  cfg.contact && ContactSection, cfg.gifting && GiftingSection, ThankYouSection,
].filter(Boolean);
const NO_THREAD_AFTER = new Set([HeroSection, ThankYouSection]);
const guest = guestName();

const page = document.getElementById('invitation');
page.innerHTML = GoldDefs() + SECTIONS.map((S, i) => S(cfg, guest) + (NO_THREAD_AFTER.has(S) ? '' : GoldThread(i % 3 === 1))).join('');
document.body.insertAdjacentHTML('afterbegin', IntroExperience(cfg, guest));
document.getElementById('boot')?.remove(); // static poster that covered the page while modules loaded
document.title = `${cfg.pair[0]} & ${cfg.pair[1]} · Wedding Invitation`;

/* regional blessing: load only the glyphs it needs from Google Fonts */
if (cfg.regional) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cfg.regional.font)}:wght@500&text=${encodeURIComponent(cfg.regional.text)}&display=swap`;
  document.head.appendChild(l);
  document.documentElement.style.setProperty('--regional', `'${cfg.regional.font}'`);
}

initEvents(cfg);
initCountdown(cfg);
if (cfg.gallery?.length) initGallery(cfg);
initSaveTheDate(cfg);
if (cfg.gifting) initGifting();

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
