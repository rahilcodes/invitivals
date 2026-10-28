/* InvitationPage — composes one continuous invitation from weddingConfig. */
import { weddingConfig as cfg } from '../config.js';
import { GoldDefs, GoldThread } from './decor.js';
import { guestName } from './util.js';
import { IntroExperience, initIntro } from './sections/intro.js';
import { HeroSection } from './sections/hero.js';
import { WelcomeSection } from './sections/welcome.js';
import { StorySection } from './sections/story.js';
import { FamilySection } from './sections/families.js';
import { EventsSection, initEvents } from './sections/events.js';
import { CeremonySection } from './sections/ceremony.js';
import { VenueSection } from './sections/venue.js';
import { CountdownSection, initCountdown } from './sections/countdown.js';
import { GallerySection, initGallery } from './sections/gallery.js';
import { SaveTheDateSection, initSaveTheDate, weddingCalendar } from './sections/save-the-date.js';
import { RSVPSection, initRSVP } from './sections/rsvp.js';
import { TravelSection } from './sections/travel.js';
import { ContactSection } from './sections/contact.js';
import { GiftingSection, initGifting } from './sections/gifting.js';
import { WishesSection, initWishes } from './sections/wishes.js';
import { ThankYouSection } from './sections/thank-you.js';
import { initReveals, initParallax, initParticles } from './motion.js';
import { createMusic } from './music.js';
import { createMenu } from './menu.js';

/* sections in reading order; GoldThread stitches them without a horizontal break,
   every third stitch is a kolam instead of a plain diamond */
/* sections without details in the config (no story, no photos, no gifting) are left out */
/* names as they read on the card: groom first by default, bride first on a bride-side invitation */
cfg.pair = cfg.brideFirst ? [cfg.brideName, cfg.groomName] : [cfg.groomName, cfg.brideName];

const SECTIONS = [
  HeroSection, WelcomeSection, cfg.story && StorySection, FamilySection, EventsSection, CeremonySection,
  VenueSection, CountdownSection, cfg.gallery?.length && GallerySection, SaveTheDateSection, RSVPSection,
  cfg.travel?.length && TravelSection, cfg.contact && ContactSection, cfg.gifting && GiftingSection, WishesSection, ThankYouSection,
].filter(Boolean);
const NO_THREAD_AFTER = new Set([HeroSection, ThankYouSection]);
const guest = guestName();

const page = document.getElementById('invitation');
page.innerHTML = GoldDefs() + SECTIONS.map((S, i) => S(cfg, guest) + (NO_THREAD_AFTER.has(S) ? '' : GoldThread(i % 3 === 1))).join('');
document.body.insertAdjacentHTML('afterbegin', IntroExperience(cfg, guest));
document.getElementById('boot')?.remove(); // static poster that covered the page while modules loaded
document.title = `${cfg.pair[0]} & ${cfg.pair[1]} · Wedding Invitation`;

/* regional blessing (and the opening shloka, same font): load only the glyphs it needs from Google Fonts, the whole font
   when there is a shloka (a text= subset can drop the shaping its conjuncts need) */
if (cfg.regional) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cfg.regional.font)}:wght@500&${cfg.introShloka ? '' : `text=${encodeURIComponent(cfg.regional.text)}&`}display=swap`;
  document.head.appendChild(l);
  document.documentElement.style.setProperty('--regional', `'${cfg.regional.font}'`);
}

/* hero fit, on every phone: browsers without svh get the real visible height, and the couple is given only
   the room left below the date (long names, big system fonts and short screens can never push them together) */
const root = document.documentElement;
const fitHero = () => {
  if (!CSS.supports?.("height", "1svh")) root.style.setProperty("--sv", innerHeight / 100 + "px");
  const stage = document.querySelector(".hero-stage"), copy = document.querySelector(".hero-copy"), wrap = document.querySelector(".hero-couple-wrap");
  if (!stage || !copy || !wrap) return;
  // layout boxes, not on-screen rects: the parallax and entrance transforms must not skew the measure
  const room = stage.clientHeight - (copy.offsetTop + copy.offsetHeight) - parseFloat(getComputedStyle(wrap).bottom) - 30; // 14px of air + the parallax lift of the couple
  root.style.setProperty("--couple-fit", Math.max(90, Math.round(room)) + "px");
};
fitHero();
document.fonts?.ready.then(fitHero);
// re-fit whenever the text block changes height (web fonts arriving late, the Devanagari line, text zoom)
if (window.ResizeObserver) new ResizeObserver(fitHero).observe(document.querySelector(".hero-copy"));
addEventListener("load", fitHero);
let fitT; addEventListener("resize", () => { clearTimeout(fitT); fitT = setTimeout(fitHero, 120); });
addEventListener("orientationchange", () => setTimeout(fitHero, 300));

initEvents(cfg);
initCountdown(cfg);
if (cfg.gallery?.length) initGallery(cfg);
initSaveTheDate(cfg);
initRSVP(cfg, guest);
if (cfg.gifting) initGifting();
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
