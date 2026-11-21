/* WelcomeSection — the first words on the paper, picked up by the pillars that continue from the hero arch.
   Opens like a printed patrika: invocation, the guest's own name, the couple's monogram. */
import { FloralVine, GoldDivider, Mandala, Monogram } from '../decor.js';
import { escScript } from '../util.js';

export const WelcomeSection = (cfg, guest) => `
<section class="sec welcome" id="welcome" aria-label="Welcome">
  ${FloralVine({ side: 'l', top: '-60px', height: '820px', crop: 8, depth: 0.04 })}
  ${FloralVine({ side: 'r', top: '-60px', height: '820px', crop: 8, depth: 0.04 })}
  <div class="sec-inner">
    ${Mandala('welcome-mandala')}
    <p class="invocation" data-reveal>|| ${cfg.invocation} ||</p>
    <div data-reveal>${Monogram(cfg.pair[0], cfg.pair[1], 'welcome-mono')}</div>
    <p class="script-title" data-reveal>${cfg.welcome.title}</p>
    <p class="eyebrow" data-reveal>to our wedding celebration</p>
    ${guest ? `<p class="dear" data-reveal>Dear <span>${escScript(guest)}</span>,</p>` : ''}
    <p class="prose" data-reveal>${cfg.welcome.lines.join('<br>')}</p>
    <div data-reveal>${GoldDivider('diamond')}</div>
    <p class="pair" data-reveal>
      <span class="pair-name">${cfg.pair[0]}</span>
      <span class="pair-weds">weds</span>
      <span class="pair-name">${cfg.pair[1]}</span>
    </p>
  </div>
</section>`;
