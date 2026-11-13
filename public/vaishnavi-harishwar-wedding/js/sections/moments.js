/* MomentsSection — the couple's own photograph (client, 2026-11-13), whole and untouched, in a cream mount with a
   fine gold frame and four corner sprigs. The picture keeps its own proportions; nothing is cropped. */
import { Heading, FloralVine } from '../decor.js?v=3';

const Corner = (pos) => `<svg class="mo-corner mo-${pos}" viewBox="0 0 40 40" aria-hidden="true"><path d="M3 37V13C3 7.5 7.5 3 13 3h24"/><path d="M8 37V16c0-4.4 3.6-8 8-8h21" opacity=".55"/><path d="M14 14c4.5-.6 7.8 1.2 9.5 5-4.2 1-7.6-.6-9.500-5z"/><circle cx="26.500" cy="22" r="1.300"/><circle cx="22" cy="26.500" r="1.300"/></svg>`;

export const MomentsSection = (cfg) => `
<section class="sec moments" id="moments" aria-labelledby="moments-h">
  ${FloralVine({ side: 'r', top: '40px', height: '620px', crop: 55, depth: 0.05, cls: 'vine-soft' })}
  <div class="sec-inner">
    ${Heading(cfg.moments.title, cfg.moments.sub, { id: 'moments-h' })}
    <figure class="mo-frame" data-reveal>
      <img src="${cfg.moments.photo}" width="${cfg.moments.width}" height="${cfg.moments.height}" alt="${cfg.moments.alt}" loading="lazy" decoding="async">
      ${['tl', 'tr', 'bl', 'br'].map(Corner).join('')}
    </figure>
  </div>
</section>`;
