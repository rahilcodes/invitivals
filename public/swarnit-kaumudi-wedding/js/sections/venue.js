/* VenueSection — the venue's name and address under a kolam seal, and the map. No picture of the venue was
   supplied, so none is shown (the fort scenes are artwork, not the venue). */
import { Heading, Button, FloralVine, Kolam, Icon } from '../decor.js';

export const VenueSection = (cfg) => `
<section class="sec venue" id="venue" aria-labelledby="venue-h">
  ${FloralVine({ side: 'l', top: '120px', height: '520px', crop: 85, depth: 0.05 })}
  <div class="sec-inner">
    ${Heading('The Venue', 'A beautiful place to witness our new beginning', { id: 'venue-h' })}
    <div class="venue-seal" data-reveal>${Kolam('venue-kolam')}${Icon('pin', 'ico venue-pin')}</div>
    <p class="venue-name" data-reveal><a href="${cfg.mapsUrl}" target="_blank" rel="noopener">${cfg.venue}</a></p>
    <p class="venue-addr" data-reveal>${cfg.venueAddress}</p>
    <div data-reveal>${Button({ label: 'Get Directions', icon: 'map', href: cfg.mapsUrl })}</div>
  </div>
</section>`;
