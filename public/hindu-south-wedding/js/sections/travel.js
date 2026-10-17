/* TravelSection — directions, parking and stays, each a quiet fold-out line. */
import { Heading, Icon } from '../decor.js';

export const TravelSection = (cfg) => `
<section class="sec travel" id="travel" aria-labelledby="travel-h">
  <div class="sec-inner">
    ${Heading('Getting There', 'Location, parking and nearby stays for your convenience', { id: 'travel-h' })}
    <div class="folds">
      ${cfg.travel.map((t) => `
        <details class="fold" data-reveal>
          <summary>${Icon(t.icon)}<span>${t.title}</span><i class="fold-mark" aria-hidden="true"></i></summary>
          <div class="fold-body">
            <p>${t.text}</p>
            ${t.link ? `<a href="${t.link.href}" target="_blank" rel="noopener">${t.link.label} →</a>` : ''}
          </div>
        </details>`).join('')}
    </div>
  </div>
</section>`;
