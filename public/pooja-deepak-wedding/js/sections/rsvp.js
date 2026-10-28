/* RSVPSection — name, number of guests, and two answers. The reply goes to the family on WhatsApp. */
import { Heading, Button, FloralVine } from '../decor.js';
import { $, whatsappLink } from '../util.js';

export const RSVPSection = (cfg) => `
<section class="sec rsvp" id="rsvp" aria-labelledby="rsvp-h">
  ${FloralVine({ side: 'l', top: '-60px', height: '620px', crop: 15, depth: 0.05 })}
  ${FloralVine({ side: 'r', top: '-60px', height: '620px', crop: 15, depth: 0.05 })}
  <div class="sec-inner">
    ${Heading('Kindly RSVP', 'We would love to know if you can join us', { id: 'rsvp-h' })}
    <form class="rsvp-form" id="rsvp-form" data-reveal novalidate>
      <label class="field"><span>Your name</span><input name="name" autocomplete="name" placeholder="Full name" required></label>
      <div class="field">
        <span id="guests-l">Guests</span>
        <div class="stepper" role="group" aria-labelledby="guests-l">
          <button type="button" data-step="-1" aria-label="Fewer guests">−</button>
          <output name="guests" aria-live="polite">2</output>
          <button type="button" data-step="1" aria-label="More guests">+</button>
        </div>
      </div>
      <div class="rsvp-actions">
        ${Button({ label: 'I’ll Be There', id: 'rsvp-yes', attrs: 'data-answer="yes"' })}
        ${Button({ label: 'Unable to Attend', id: 'rsvp-no', cls: 'btn-ghost', attrs: 'data-answer="no"' })}
      </div>
      ${cfg.rsvp.deadline ? `<p class="rsvp-note">${cfg.rsvp.deadline}</p>` : ''}
    </form>
    <p class="rsvp-thanks prose" id="rsvp-thanks" hidden></p>
  </div>
</section>`;

export function initRSVP(cfg, guest) {
  const form = $('#rsvp-form');
  const out = form.querySelector('output');
  const name = form.elements.name;
  if (guest) name.value = guest;
  form.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => {
    out.value = Math.min(12, Math.max(1, +out.value + +b.dataset.step));
  }));
  form.querySelectorAll('[data-answer]').forEach((b) => b.addEventListener('click', () => {
    if (!name.value.trim()) { name.focus(); name.closest('.field').classList.add('is-invalid'); return; }
    name.closest('.field').classList.remove('is-invalid');
    const yes = b.dataset.answer === 'yes';
    const who = name.value.trim();
    const msg = yes
      ? `Namaste! ${who} will be there for the wedding of ${cfg.pair[0]} & ${cfg.pair[1]}. Guests: ${out.value}.`
      : `Namaste! ${who} is unable to attend the wedding of ${cfg.pair[0]} & ${cfg.pair[1]}, but sends warm blessings.`;
    window.open(whatsappLink(cfg.rsvp.whatsapp, msg), '_blank', 'noopener');
    const thanks = $('#rsvp-thanks');
    thanks.innerHTML = yes
      ? `Thank you, ${who.replace(/</g, '&lt;')}. We can’t wait to see you there.`
      : `Thank you, ${who.replace(/</g, '&lt;')}. You will be in our hearts on the day.`;
    form.hidden = true; thanks.hidden = false;
  }));
}
