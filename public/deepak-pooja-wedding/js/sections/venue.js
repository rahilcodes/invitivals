/* VenueSection — the mandapam in a soft arch, address and map. */
import { Heading, Button, FloralVine, Kolam, Icon } from '../decor.js';

export const VenueSection = (cfg) => `
<section class="sec venue" id="venue" aria-labelledby="venue-h">
  ${FloralVine({ side: 'l', top: '200px', height: '620px', crop: 85, depth: 0.05 })}
  <div class="sec-inner">
    ${Heading('The Venue', 'A beautiful place to witness our new beginning', { id: 'venue-h' })}
    ${cfg.venueImage ? `<figure class="venue-frame" data-reveal>
      <img src="${cfg.venueImage}" alt="${cfg.venue}" loading="lazy" decoding="async" data-parallax="0.035">
    </figure>` : `<div class="venue-seal" data-reveal>${Kolam('venue-kolam')}${Icon('pin', 'ico venue-pin')}</div>`}
    <p class="venue-name" data-reveal>${cfg.venue}</p>
    <p class="venue-addr" data-reveal>${cfg.venueAddress}</p>
    <div data-reveal>${Button({ label: 'View on Map', icon: 'map', href: cfg.mapsUrl })}</div>
  </div>
</section>`;
