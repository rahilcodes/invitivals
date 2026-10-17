/* CeremonySection — the muhurtham, framed by a gold temple arch, bells either side, deepams lit beneath. */
import { TempleOrnament, GoldBell, BrassLamp, Kalasha, GoldDivider } from '../decor.js';
import { day, month, year, weekday } from '../util.js';

export const CeremonySection = (cfg) => `
<section class="sec ceremony" id="ceremony" aria-labelledby="ceremony-h">
  <div class="sec-inner">
    <div class="shrine" data-reveal>
      ${GoldBell({ side: 'l', cls: 'shrine-bell' })}
      ${GoldBell({ side: 'r', cls: 'shrine-bell' })}
      ${TempleOrnament()}
      <div class="shrine-copy">
        ${Kalasha()}
        <p class="eyebrow" id="ceremony-h">${cfg.ceremonyTitle || 'The Wedding'}</p>
        <p class="c-weekday">${weekday(cfg.weddingDate)}</p>
        <p class="c-day">${day(cfg.weddingDate)}</p>
        <p class="c-month">${month(cfg.weddingDate)} ${year(cfg.weddingDate)}</p>
        ${GoldDivider('diamond', 'c-div')}
        ${cfg.weddingTimeLabel ? `<p class="c-time">${cfg.weddingTimeLabel}</p>` : ''}
        ${cfg.muhurtham ? `<p class="c-muhurtham">${cfg.muhurtham}</p>` : `<p class="c-muhurtham">${cfg.venue}<br>${cfg.venueCity}</p>`}
      </div>
    </div>
    ${BrassLamp('ceremony-lamp')}
    <p class="prose" data-reveal>${cfg.ceremonyLine || 'Your presence will make our celebration complete.<br>Please join us as we take the seven sacred steps.'}</p>
  </div>
</section>`;
