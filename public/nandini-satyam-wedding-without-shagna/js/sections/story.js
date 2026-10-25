/* StorySection — an arch window onto the couple, then three numbered chapters strung on one gold thread. */
import { Heading, Icon, FloralVine } from '../decor.js';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export const StorySection = (cfg) => `
<section class="sec story" id="story" aria-labelledby="story-h">
  ${FloralVine({ side: 'r', top: '520px', height: '820px', crop: 55, depth: 0.06 })}
  <div class="sec-inner">
    ${Heading('Our Story', cfg.story.intro, { id: 'story-h' })}
    <figure class="arch-window" data-reveal>
      <div class="arch-window-img"><img src="${cfg.story.image}" alt="${cfg.pair[0]} and ${cfg.pair[1]} beneath a garlanded temple arch" loading="lazy" decoding="async" data-parallax="0.04"></div>
    </figure>
    <ol class="chapters">
      ${cfg.story.chapters.map((c, i) => `
        <li class="chapter" data-reveal>
          <span class="chapter-no" aria-hidden="true">${ROMAN[i] || i + 1}</span>
          <span class="medallion">${Icon(c.icon)}</span>
          <h3>${c.title}</h3>
          <p class="when"><span>${c.when}</span></p>
          <p class="prose small">${c.text}</p>
        </li>`).join('')}
    </ol>
  </div>
</section>`;
