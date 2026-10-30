/* BlessingSection — "With the blessings of Sri Guru Granth Sahib Ji", the
   Mool Mantar line, the Gurudwara scene under the arch, and the welcome
   words on a card. FamilySection — both families on paired cards.
   StorySection — the couple's words, a picture in an ornate cartouche, three
   pillars, and the motto. */
import { KhandaMark, ArchCrown, Heading, OrnateFrame, RestingPetals, Garland, Icon } from '../decor.js';
import { esc } from '../util.js';

export const BlessingSection = (cfg) => `
<section class="section blessing" id="welcome">
  <p class="blessing-title" data-reveal>${cfg.blessing.title.map(esc).join('<br>')}</p>
  ${cfg.invocation ? `<p class="blessing-ikonkar" data-reveal lang="pa">${cfg.invocation.text}<small>${esc(cfg.invocation.meaning)}</small></p>` : ''}
  <div data-reveal>${KhandaMark()}</div>
  <div class="blessing-scene" data-reveal>
    ${ArchCrown('blessing-arch')}
    <img src="assets/ceremony-bg.webp" alt="The Gurudwara framed by marble pillars at golden hour" width="900" height="1599" loading="lazy" decoding="async">
    ${cfg.invite.placement === 'blessing' ? `<div class="blessing-sky bs-invite">
      <span class="bs-eyebrow">${cfg.invite.eyebrow.map(esc).join('<br>')}</span>
      ${KhandaMark('bs-mark')}
      <p class="bs-text">${esc(cfg.invite.line)}</p>
    </div>` : ''}
    ${cfg.blessing.quote && cfg.invite.placement !== 'blessing' ? `<blockquote class="blessing-sky">
      ${cfg.blessing.quote.eyebrow ? `<span class="bs-eyebrow">${esc(cfg.blessing.quote.eyebrow)}</span>` : ''}
      ${KhandaMark('bs-mark')}
      <p class="bs-text${cfg.blessing.quote.lang ? ' bs-text-' + cfg.blessing.quote.lang : ''}"${cfg.blessing.quote.lang ? ` lang="${cfg.blessing.quote.lang}"` : ''}>${cfg.blessing.quote.lines.map(esc).join('<br>')}</p>
      <cite class="bs-src">${esc(cfg.blessing.quote.source)}</cite>
    </blockquote>` : ''}
  </div>
  ${cfg.blessing.lines?.length ? `<div class="card card-words" data-reveal>
    <span class="card-corner tl"></span><span class="card-corner tr"></span><span class="card-corner bl"></span><span class="card-corner br"></span>
    <div class="welcome-lines${cfg.blessing.linesLang ? ' welcome-lines-' + cfg.blessing.linesLang : ''}"${cfg.blessing.linesLang ? ` lang="${cfg.blessing.linesLang}"` : ''}>${cfg.blessing.lines.map((l) => `<p>${esc(l)}</p>`).join('')}</div>
  </div>` : ''}
</section>`;

export const FamilySection = (cfg) => {
  const f = cfg.families;
  const card = (p, who) => `
    <div class="card card-fam" data-reveal>
      <p class="fam-label">${esc(p.label)}</p>
      ${f.showWho === false ? '' : `<p class="fam-who">${esc(who)}</p>`}
      <p class="fam-parents">${esc(p.parents[0])}<span class="fam-amp">&amp;</span>${esc(p.parents[1])}</p>
    </div>`;
  return `
<section class="section families" id="families">
  ${RestingPetals(2)}
  ${Garland('g-right g-small', 0.04)}
  ${f.heading ? Heading(f.heading, f.sub ?? 'Who invite you with open hearts') : ''}
  <div class="fam-grid">
    ${(cfg.hostSide === 'bride'
      ? [card(f.bride, `Parents of ${cfg.shortBride}`), card(f.groom, `Parents of ${cfg.shortGroom}`)]
      : [card(f.groom, `Parents of ${cfg.shortGroom}`), card(f.bride, `Parents of ${cfg.shortBride}`)]).join('')}
  </div>
</section>`;
};

export const StorySection = (cfg) => {
  const s = cfg.story;
  return `
<section class="section story" id="story">
  ${Heading(s.heading)}
  <p class="story-text" data-reveal>${esc(s.text)}</p>
  ${OrnateFrame(s.image, s.imageAlt, 'story')}
  ${s.pillars ? `
  <div class="pillars" data-reveal>
    ${s.pillars.map((p) => `<div class="pillar"><span class="pillar-ring">${Icon(p.icon, 'ico ico-pillar')}</span><span class="pillar-label">${esc(p.label)}</span></div>`).join('')}
  </div>` : ''}
  <p class="story-motto" data-reveal>${s.motto.map(esc).join('<br>')}</p>
</section>`;
};
