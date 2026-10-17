/* ThankYouSection — the paper stays clean and warm, then the temple tank rises slowly out of it. */
import { LotusDecoration, Icon, Monogram, Button } from '../decor.js';

/* floating diya flames measured on finale.webp (percent), with relative size */
const DIYAS = [[20.7, 83.4, 1.3], [87.5, 87.1, 1.4], [79.3, 87.9, 1], [3.5, 80.3, .8], [29.2, 79, .7], [86.3, 76.7, .7], [95.4, 71.9, .6], [19.1, 75.6, .6]];

export const ThankYouSection = (cfg) => `
<section class="sec thanks" id="thanks" aria-labelledby="thanks-h">
  <div class="sec-inner">
    ${LotusDecoration()}
    <h2 class="script-title" id="thanks-h" data-reveal>${cfg.thankYou.title}</h2>
    <p class="prose" data-reveal>${cfg.thankYou.lines.join('<br>')}</p>
    <span class="thanks-heart" data-reveal>${Icon('heart')}</span>
    <p class="signoff" data-reveal>${cfg.thankYou.signoff}</p>
    <div class="thanks-share" data-reveal>${Button({ label: 'Share the Invitation', icon: 'send', cls: 'btn-ghost js-share' })}</div>
    <p class="credit">Designed by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=hindu-south-wedding" target="_blank" rel="noopener">Invitivals</a></p>
  </div>
  <div class="finale" aria-hidden="true">
    <img src="assets/finale.webp" alt="" loading="lazy" decoding="async">
    ${DIYAS.map(([x, y, s], i) => `<span class="diya-glow" style="left:${x}%;top:${y}%;--i:${i};--s:${s}"></span>`).join('')}
    ${Monogram(cfg.groomName, cfg.brideName, 'finale-mono')}
  </div>
</section>`;
