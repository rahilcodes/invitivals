/* HeroSection — the arch the doors opened onto: temple across the lake, names written in its sky,
   the couple walking towards it. Same framing as the last frame of the intro film. */
import { Kalasha, GoldDivider, GoldBell, WeddingCouple, PetalShower } from '../decor.js';
import { day, month, year, weekday } from '../util.js';

export const HeroSection = (cfg) => `
<section class="hero" id="top" aria-labelledby="hero-names">
  <div class="hero-stage">
    <img class="hero-arch" src="assets/hero-arch.webp" alt="" fetchpriority="high" decoding="async" data-parallax="-0.06">
    ${GoldBell({ side: 'l', cls: 'hero-bell' })}
    ${GoldBell({ side: 'r', cls: 'hero-bell' })}
    ${PetalShower(8)}
    <div class="hero-copy">
      <div class="h-in" style="--h:0">${Kalasha()}</div>
      ${cfg.regional
        ? `<p class="regional h-in" style="--h:1" lang="${cfg.regional.lang || 'te'}" title="${cfg.regional.meaning}">${cfg.regional.text}</p>`
        : `<p class="invocation h-in" style="--h:1">|| ${cfg.invocation} ||</p>`}
      <p class="eyebrow h-in" style="--h:2">The Wedding of</p>
      <h1 class="names" id="hero-names">
        <span class="name h-in" style="--h:3">${cfg.pair[0]}</span>
        <span class="amp h-in" style="--h:4">&amp;</span>
        <span class="name h-in" style="--h:5">${cfg.pair[1]}</span>
      </h1>
      <p class="tagline h-in" style="--h:6">${cfg.tagline.join(' ')}</p>
      <div class="h-in" style="--h:7">${GoldDivider('lotus', 'hero-divider')}</div>
      <p class="hero-date h-in" style="--h:8">
        <span>${[weekday(cfg.weddingDate), cfg.weddingTimeLabel].filter(Boolean).join(' · ')}</span>
        <b>${day(cfg.weddingDate)} ${month(cfg.weddingDate)} ${year(cfg.weddingDate)}</b>
        <em>${cfg.venueCity}</em>
      </p>
    </div>
    <div class="hero-couple-wrap" data-parallax="0.05">${WeddingCouple({ cls: 'hero-couple', eager: true })}</div>
    <a class="scroll-cue" href="#welcome" aria-label="Scroll to the invitation"><span>Scroll</span><i></i></a>
  </div>
</section>`;
