/* RSVPSection — attendance on a card: the choice, how many will come, and a
   line for the couple. With the family's WhatsApp number set in config, the
   reply opens in WhatsApp ready to send; until then the page shows the choice
   without claiming delivery. */
import { Heading, Button, Icon, RestingPetals } from '../decor.js';
import { $, esc, whatsappLink, couple } from '../util.js';

export const RSVPSection = (cfg, guest) => `
<section class="section rsvp" id="rsvp">
  ${RestingPetals(10)}
  ${Heading(cfg.rsvp.title)}
  <div class="card card-rsvp" data-reveal>
    ${guest ? `<p class="rsvp-guest">Dear <b>${esc(guest)}</b>,</p>` : ''}
    <p class="rsvp-note">${esc(cfg.rsvp.note)}</p>
    <p class="rsvp-deadline">${esc(cfg.rsvp.deadline)}</p>
    <div class="rsvp-field">
      <span class="rsvp-label">Guests attending</span>
      <div class="stepper" role="group" aria-label="Number of guests">
        <button type="button" class="step" id="rsvp-minus" aria-label="Fewer guests">${Icon('minus', 'ico ico-xs')}</button>
        <output id="rsvp-count" for="rsvp-minus rsvp-plus">2</output>
        <button type="button" class="step" id="rsvp-plus" aria-label="More guests">${Icon('plus', 'ico ico-xs')}</button>
      </div>
    </div>
    <label class="rsvp-field rsvp-msg">
      <span class="rsvp-label">A line for the couple <small>(optional)</small></span>
      <textarea id="rsvp-message" rows="2" maxlength="180" placeholder="Your blessings and wishes…"></textarea>
    </label>
    <div class="rsvp-choices">
      ${Button({ label: 'Accept with Joy', icon: 'check', cls: 'btn-primary', id: 'rsvp-yes' })}
      ${Button({ label: 'Regretfully Decline', icon: 'regret', cls: 'btn-ghost', id: 'rsvp-no' })}
    </div>
    <p class="rsvp-feedback" id="rsvp-feedback" aria-live="polite"></p>
  </div>
</section>`;

export function initRSVP(cfg, guest) {
  const number = String(cfg.rsvp.whatsapp || '');
  const configured = number && !/x/i.test(number);
  const feedback = $('#rsvp-feedback'), count = $('#rsvp-count'), msg = $('#rsvp-message');
  const who = guest || 'We';
  let n = 2;
  const setN = (v) => { n = Math.min(12, Math.max(1, v)); count.value = n; };
  $('#rsvp-minus')?.addEventListener('click', () => setN(n - 1));
  $('#rsvp-plus')?.addEventListener('click', () => setN(n + 1));

  const respond = (attending) => {
    const note = msg.value.trim();
    const text = attending
      ? `With joy — ${who} will be attending the wedding of ${couple(cfg, true).join(' & ')}. Guests: ${n}.${note ? `\n\n"${note}"` : ''} 🙏`
      : `With regret — ${who} will be unable to attend the wedding of ${couple(cfg, true).join(' & ')}. Our blessings are with you.${note ? `\n\n"${note}"` : ''}`;
    if (configured) {
      window.open(whatsappLink(number, text), '_blank', 'noopener');
      feedback.textContent = 'Thank you — WhatsApp is opening with your reply ready to send.';
    } else {
      // no family number yet: WhatsApp still opens with the reply written, the guest picks the family's contact
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      feedback.textContent = attending
        ? `Thank you! WhatsApp is opening with your reply — choose the family's number to send it.`
        : 'Thank you for letting us know — WhatsApp is opening with your message.';
    }
  };
  $('#rsvp-yes')?.addEventListener('click', () => respond(true));
  $('#rsvp-no')?.addEventListener('click', () => respond(false));

  if (!configured) {
    const hint = document.createElement('p');
    hint.className = 'rsvp-hint';
    hint.textContent = 'Families: add your WhatsApp number in config.js (rsvp.whatsapp) to receive replies here.';
    $('#rsvp')?.appendChild(hint);
  }
}
