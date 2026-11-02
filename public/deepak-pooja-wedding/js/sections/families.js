/* FamilySection — the two households, set like the inside leaf of a printed patrika. */
import { Heading, Mandala, FloralVine, Cameo } from '../decor.js';

const Family = (f) => `
  <div class="family" data-reveal>
    ${Cameo(f.person)}
    <p class="eyebrow">${f.label}</p>
    <p class="family-person">${f.person}</p>
    ${f.note ? `<p class="family-note">${f.note}</p>` : ''}
    <p class="family-rel">${f.relation}</p>
    <p class="family-parents">${f.parents.join('<br>')}</p>
    ${f.grandparents ? `<p class="family-gp">${f.grandparents}</p>` : ''}
  </div>`;

export const FamilySection = (cfg) => `
<section class="sec families" id="families" aria-labelledby="families-h">
  ${FloralVine({ side: 'l', top: '120px', height: '700px', crop: 30, depth: 0.05 })}
  <div class="sec-inner">
    ${Heading('Meet Our Families', 'With the blessings of our elders', { id: 'families-h' })}
    ${(cfg.familyOrder || ['bride', 'groom']).map((k) => Family(cfg.families[k])).join(`<div class="family-amp" data-reveal>${Mandala('amp-mandala')}<span>&amp;</span></div>`)}
  </div>
</section>`;
