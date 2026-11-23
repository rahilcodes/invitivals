/* ThankYouSection — the second-last page (client, 2026-11-23): the couple's thank-you, the heart and their AH
   monogram, on the clean paper. Share the Invitation and the closing scene now end the Warm Wishes page after it. */
import { LotusDecoration, Icon, Monogram } from '../decor.js';

export const ThankYouSection = (cfg) => `
<section class="sec thanks" id="thanks" aria-labelledby="thanks-h">
  <div class="sec-inner">
    ${LotusDecoration()}
    <h2 class="visually-hidden" id="thanks-h">${cfg.thankYou.title}</h2>
    <p class="prose thanks-msg" data-reveal>${cfg.thankYou.lines.map((l) => `<span>${l}</span>`).join('')}</p>
    <span class="thanks-heart" data-reveal>${Icon('heart')}</span>
    ${cfg.thankYou.signoff ? `<p class="signoff" data-reveal>${cfg.thankYou.signoff}</p>` : ''}
    <div data-reveal>${Monogram(cfg.pair[0], cfg.pair[1], 'thanks-mono')}</div>
  </div>
</section>`;
