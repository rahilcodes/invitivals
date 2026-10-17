/* HeroScene — the scene the doors opened onto: the Gurudwara across the water
   at golden hour, the names written into its sky, the couple walking towards
   it. Same framing as the last frame of the intro film.
   InviteBlock — "You are cordially invited" (to the guest by name when the
   link carries one), a save-the-date card and a landscape vignette. */
import { GoldKhanda, KhandaMark, HangingBell, WeddingCouple, PetalShower, RestingPetals, Icon, Button, ScrollCue } from '../decor.js';
import { esc, escScript, day, month, year, weekday, couple } from '../util.js';
import { CalendarLink } from '../calendar.js';

export const HeroScene = (cfg) => {
  const inv = cfg.invite;
  const [first, second] = couple(cfg);
  return `
<section class="hero" id="top" aria-labelledby="hero-names">
  <div class="hero-stage">
    <img class="hero-bg" src="assets/hero-bg.webp" alt="" width="920" height="1634" fetchpriority="high" decoding="async" data-parallax="-0.05">
    ${HangingBell({ side: 'l', cls: 'hero-bell' })}
    ${HangingBell({ side: 'r', cls: 'hero-bell' })}
    ${GoldKhanda('hero-khanda')}
    ${PetalShower(8)}
    <div class="hero-copy">
      ${cfg.invocation ? `<p class="hero-ikonkar h-in" style="--h:0" lang="pa" title="${esc(cfg.invocation.meaning)}">${cfg.invocation.text}</p>` : ''}
      ${inv.motto?.length ? `<p class="motto h-in" style="--h:1">${inv.motto.map(esc).join(' <i>·</i> ')}</p>` : ''}
      <div class="h-in" style="--h:2">${KhandaMark('hero-mark')}</div>
      <p class="eyebrow h-in" style="--h:3">The Wedding of</p>
      <h1 class="names" id="hero-names">
        <span class="name h-in sheen" style="--h:4">${esc(first)}</span>
        <span class="amp h-in" style="--h:5">and</span>
        <span class="name h-in sheen" style="--h:6">${esc(second)}</span>
      </h1>
      <p class="tagline-lines h-in" style="--h:7">${inv.tagline.map(esc).join('<br>')}</p>
      <p class="hero-date h-in" style="--h:8"><b>${weekday(cfg.weddingDate)}, ${day(cfg.weddingDate)} ${month(cfg.weddingDate)} ${year(cfg.weddingDate)}</b></p>
    </div>
    <div class="hero-couple-wrap" data-parallax="0.03">${WeddingCouple({ cls: 'hero-couple', eager: true })}</div>
    ${ScrollCue('#invite')}
  </div>
</section>`;
};

/* each name stays on one line: shrink a name's script only as much as its line needs */
export function fitNames() {
  const fit = () => document.querySelectorAll('.hero-copy .names .name').forEach((n) => {
    n.style.fontSize = '';
    const room = n.clientWidth, need = n.scrollWidth;
    if (need > room) n.style.fontSize = `${parseFloat(getComputedStyle(n).fontSize) * (room / need) * 0.97}px`;
  });
  fit();
  document.fonts?.ready.then(fit);
  addEventListener('resize', fit, { passive: true });
}

export const InviteBlock = (cfg, guest) => {
  const main = cfg.events.find((e) => e.main) || cfg.events[0];
  return `
<section class="section invite" id="invite">
  ${RestingPetals(1)}
  <div data-reveal>${GoldKhanda('invite-khanda')}</div>
  ${guest ? `<p class="invite-guest" data-reveal><small>Dear</small><span>${escScript(guest)}</span></p>` : ''}
  ${cfg.invite.placement === 'blessing' ? '' : `
  <p class="eyebrow-lines" data-reveal>${cfg.invite.eyebrow.map(esc).join('<br>')}</p>
  <p class="invite-line" data-reveal>${esc(cfg.invite.line)}</p>`}
  <div class="card card-date" data-reveal>
    <p class="cd-eyebrow">Save the Date</p>
    <div class="bigdate">
      <span class="bd-dow">${weekday(main.date)}</span>
      <span class="bd-day">${day(main.date)}</span>
      <span class="bd-month">${month(main.date)} ${year(main.date)}</span>
    </div>
    <div class="bd-rule" aria-hidden="true"><i></i>${Icon('anandkaraj', 'ico ico-mini')}<i></i></div>
    ${cfg.saveTheDate?.details === false ? '' : `
    <p class="bd-event">${esc(main.name)} <em>· ${esc(main.time)}</em></p>
    <p class="bd-venue">${esc(main.venue)}<span>${esc(main.address)}</span></p>`}
    <div class="bd-actions">
      ${CalendarLink(cfg, main, { cls: 'btn-primary' })}
    </div>
  </div>
  <div class="vignette" data-reveal aria-hidden="true"><img src="assets/vignette.webp" alt="" width="820" height="459" loading="lazy" decoding="async"></div>
</section>`;
};
