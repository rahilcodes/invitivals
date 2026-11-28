/* ThankYouSection — the closing: the SK monogram, the couple's thanks, the share button and the studio's credit,
   and then, as the very last thing on the invitation, the client's fort-and-lake picture (client, 2026-11-23):
   whole, at its own proportions, edge to edge of the page, with nothing over it and nothing after it. */
import { LotusDecoration, Icon, Monogram, Button } from '../decor.js';

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
    <p class="credit">Designed by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=gangesh-swejal-wedding" target="_blank" rel="noopener">Invitivals</a></p>
  </div>
  <figure class="closing-scene">
    <img src="${cfg.closingImage.src}" alt="${cfg.closingImage.alt}" width="${cfg.closingImage.w}" height="${cfg.closingImage.h}" loading="lazy" decoding="async">
  </figure>
</section>`;
