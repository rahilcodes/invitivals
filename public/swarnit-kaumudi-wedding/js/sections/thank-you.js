/* ThankYouSection — the closing: the SK monogram, the couple's thanks, the share button, and then the couple
   themselves as the last picture of the invitation (client, 2026-11-23), standing on the paper with no added
   background. Nothing follows them but the studio's credit line. */
import { LotusDecoration, Icon, Monogram, Button, WeddingCouple } from '../decor.js';

export const ThankYouSection = (cfg) => `
<section class="sec thanks" id="thanks" aria-labelledby="thanks-h">
  <div class="sec-inner">
    ${LotusDecoration()}
    <div data-reveal>${Monogram(cfg.groomName, cfg.brideName, 'thanks-mono')}</div>
    <h2 class="script-title" id="thanks-h" data-reveal>${cfg.thankYou.title}</h2>
    <p class="prose" data-reveal>${cfg.thankYou.lines.join('<br>')}</p>
    <span class="thanks-heart" data-reveal>${Icon('heart')}</span>
    <p class="signoff" data-reveal>${cfg.thankYou.signoff}</p>
    <div class="thanks-share" data-reveal>${Button({ label: 'Share the Invitation', icon: 'send', cls: 'btn-ghost js-share' })}</div>
    <div class="closing-couple" data-reveal>${WeddingCouple({ cls: 'closing-couple-img' })}</div>
    <p class="credit">Designed by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=swarnit-kaumudi-wedding" target="_blank" rel="noopener">Invitivals</a></p>
  </div>
</section>`;
