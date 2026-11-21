/* VenueSection — the two places of the celebrations, each with its own map: the family residence
   (10, 11 and 12 December) and Tulsi Resort (13 and 14 December). */
import { Heading, Button, FloralVine, Kolam, Icon } from '../decor.js';
import { day, monthShort } from '../util.js';

const daysAt = (cfg, place) => [...new Set(cfg.events.filter((e) => e.place === place).map((e) => day(e.date)))];

export const VenueSection = (cfg) => `
<section class="sec venue" id="venue" aria-labelledby="venue-h">
  ${FloralVine({ side: 'l', top: '200px', height: '620px', crop: 85, depth: 0.05 })}
  <div class="sec-inner">
    ${Heading('The Venues', 'Where we celebrate together', { id: 'venue-h' })}
    ${cfg.venues.map((v, i) => {
      const d = daysAt(cfg, v);
      const when = `${d.slice(0, -1).join(', ')}${d.length > 1 ? ' & ' : ''}${d[d.length - 1]} ${monthShort(cfg.events.find((e) => e.place === v).date)}`;
      return `${i ? '<i class="venue-gap" aria-hidden="true"></i>' : ''}
    <div class="venue-card" data-reveal>
      <div class="venue-seal">${Kolam('venue-kolam')}${Icon('pin', 'ico venue-pin')}</div>
      <p class="eyebrow">${when}</p>
      <p class="venue-name">${v.name}</p>
      <div>${Button({ label: v.button, icon: 'map', href: v.maps })}</div>
    </div>`;
    }).join('')}
  </div>
</section>`;
