/* VenueSection — the client's own photograph of the venue, whole in a gold frame (never cropped or stretched),
   then its name, address and the map. */
import { Heading, Button, FloralVine } from '../decor.js';

export const VenueSection = (cfg) => `
<section class="sec venue" id="venue" aria-labelledby="venue-h">
  ${FloralVine({ side: 'l', top: '200px', height: '620px', crop: 85, depth: 0.05 })}
  <div class="sec-inner">
    ${Heading('The Venue', 'A beautiful place to witness our new beginning', { id: 'venue-h' })}
    ${cfg.venueImage ? `<figure class="venue-photo" data-reveal>
      <img src="${cfg.venueImage.src}" alt="${cfg.venueImage.alt}" width="${cfg.venueImage.w}" height="${cfg.venueImage.h}" loading="lazy" decoding="async">
    </figure>` : ''}
    <p class="venue-name" data-reveal><a href="${cfg.mapsUrl}" target="_blank" rel="noopener">${cfg.venue}</a></p>
    <p class="venue-addr" data-reveal>${cfg.venueAddress}</p>
    <div data-reveal>${Button({ label: 'Get Directions', icon: 'map', href: cfg.mapsUrl })}</div>
  </div>
</section>`;
