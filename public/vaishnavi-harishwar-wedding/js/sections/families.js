/* FamilySection — the two households, set like the inside leaf of a printed patrika. */
import { Heading, Mandala, FloralVine, Cameo } from '../decor.js?v=3';

const Family = (f) => `
  <div class="family" data-reveal>
    ${Cameo(f.initial || f.person)}
    <p class="eyebrow">${f.label}</p>
    <p class="family-person${f.person.length > 12 ? " is-long" : ""}">${f.person}</p>
    <p class="family-rel">${f.relation}</p>
    <p class="family-parents">${f.parents.join('<br><i class="fam-amp">&amp;</i><br>')}</p>
    ${f.grandparents ? `<p class="family-gp">${f.grandparents}</p>` : ''}
  </div>`;

export const FamilySection = (cfg) => `
<section class="sec families" id="families" aria-labelledby="families-h">
  ${FloralVine({ side: 'l', top: '120px', height: '700px', crop: 30, depth: 0.05 })}
  <div class="sec-inner">
    ${Heading('Meet Our Families', 'With the blessings of our elders', { id: 'families-h' })}
    ${Family(cfg.families.bride)}
    <div class="family-amp" data-reveal>${Mandala('amp-mandala')}<span>&amp;</span></div>
    ${Family(cfg.families.groom)}
  </div>
</section>`;
