/* FromSection — the last slide (client, 26 Nov): who sends the invitation, their address and numbers, on the same
   paper as the invitation, in a small card with the design's gold frame and kolam seal. It follows the temple-tank
   finale of the Thank You section directly: the finale's foot fades into this paper, so there is no gap or seam. */
import { Kolam } from '../decor.js';

export const FromSection = (cfg) => {
  const F = cfg.from;
  return `
<section class="sec from" id="from" aria-labelledby="from-h">
  <div class="sec-inner">
    <div class="from-card" data-reveal>
      <span class="from-seal">${Kolam('from-kolam')}</span>
      <p class="script-title from-title" id="from-h">${F.title}</p>
      <p class="from-names">${F.names.join('<br>')}</p>
      <i class="from-rule" aria-hidden="true"></i>
      <p class="from-addr">${F.address.join('<br>')}</p>
      <p class="from-cell">Cell: ${F.phones.map((p) => `<a href="tel:+91${p}">${p}</a>`).join(', ')}.</p>
    </div>
    <p class="credit">Designed by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=${cfg.creditCampaign}" target="_blank" rel="noopener">Invitivals</a></p>
  </div>
</section>`;
};
