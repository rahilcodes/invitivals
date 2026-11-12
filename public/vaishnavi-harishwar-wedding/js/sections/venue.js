/* VenueSection — the mandapam in a soft arch, address and map. */
import { Heading, Button, FloralVine } from '../decor.js';

export const VenueSection = (cfg) => `
<section class="sec venue" id="venue" aria-labelledby="venue-h">
  ${FloralVine({ side: 'l', top: '200px', height: '620px', crop: 85, depth: 0.05 })}
  <div class="sec-inner">
    ${Heading('The Wedding Venue', '', { id: 'venue-h' })}
    <figure class="venue-frame" data-reveal>
      <img src="${cfg.venueImage}" alt="${cfg.venueImageAlt || ''}" loading="lazy" decoding="async" data-parallax="0.035">
    </figure>
    <p class="venue-name" data-reveal>${cfg.venue}</p>
    <p class="venue-addr" data-reveal>${cfg.venueAddress}</p>
    <div data-reveal>${Button({ label: 'Open in Google Maps', icon: 'map', href: cfg.mapsUrl, attrs: 'data-map' }).replace(' target="_blank" rel="noopener"', ' rel="noopener"')}</div>
  </div>
</section>`;
