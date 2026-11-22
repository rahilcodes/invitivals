/* ThankYouSection — the closing slide: the couple's SK monogram, their thanks, and three framed pictures of the
   invitation's own scenes set as one balanced block (a wide plate over two tall ones). */
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
    <div class="closing-plates" role="group" aria-label="Scenes from the invitation">
      ${cfg.closingImages.map((p, i) => `
      <figure class="cplate cplate-${p.shape}" data-reveal style="--d:${i * 140}ms">
        <img src="${p.src}" alt="${p.alt}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async">
      </figure>`).join('')}
    </div>
    <div class="thanks-share" data-reveal>${Button({ label: 'Share the Invitation', icon: 'send', cls: 'btn-ghost js-share' })}</div>
    <p class="credit">Designed by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=swarnit-kaumudi-wedding" target="_blank" rel="noopener">Invitivals</a></p>
  </div>
</section>`;
