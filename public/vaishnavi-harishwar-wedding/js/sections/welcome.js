/* WelcomeSection — the first words on the paper, picked up by the pillars that continue from the hero arch.
   Opens like a printed patrika: invocation, the guest's own name, the couple's monogram. */
import { FloralVine, GoldDivider, Mandala, Monogram } from '../decor.js?v=3';
import { escScript } from '../util.js?v=3';

export const WelcomeSection = (cfg, guest) => `
<section class="sec welcome" id="welcome" aria-label="Welcome">
  ${FloralVine({ side: 'l', top: '-60px', height: '820px', crop: 8, depth: 0.04 })}
  ${FloralVine({ side: 'r', top: '-60px', height: '820px', crop: 8, depth: 0.04 })}
  <div class="sec-inner">
    ${Mandala('welcome-mandala')}
    ${cfg.invocation ? `<p class="invocation" data-reveal>|| ${cfg.invocation} ||</p>` : ''}
    <div data-reveal>${Monogram(cfg.initials[0], cfg.initials[1], 'welcome-mono').replace(/aria-label="[^"]*"/, `aria-label="${cfg.first} and ${cfg.second}"`)}</div>
    <p class="script-title" data-reveal>${cfg.welcome.title}</p>
    ${guest ? `<p class="dear" data-reveal>Dear <span>${escScript(guest)}</span>,</p>` : ''}
    <p class="welcome-hosts" data-reveal>${cfg.welcome.hosts.replace(' & ', '<br><i>&amp;</i><br>')}</p>
    <p class="prose" data-reveal>${cfg.welcome.lines.join(' ')}</p>
    <div data-reveal>${GoldDivider('diamond')}</div>
    <p class="pair" data-reveal>
      <span class="pair-name">${cfg.first}</span>
      <span class="pair-weds">weds</span>
      <span class="pair-name">${cfg.second}</span>
    </p>
  </div>
</section>`;
