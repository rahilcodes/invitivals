/* WishesSection — a note to the couple, delivered on WhatsApp. */
import { Heading, Button, BrassLamp } from '../decor.js';
import { $, whatsappLink } from '../util.js';

export const WishesSection = (cfg) => `
<section class="sec wishes" id="wishes" aria-labelledby="wishes-h">
  <div class="sec-inner">
    ${BrassLamp('wishes-lamp')}
    ${Heading('Warm Wishes', cfg.wishes.prompt, { id: 'wishes-h' })}
    <form class="wish-form" id="wish-form" data-reveal novalidate>
      <label class="field"><span>Your name</span><input name="name" autocomplete="name" placeholder="Full name"></label>
      <label class="field"><span>Your blessing</span><textarea name="msg" rows="4" maxlength="600" placeholder="Type your message here…" required></textarea></label>
      ${Button({ label: 'Send Wishes', icon: 'send', id: 'wish-send' })}
    </form>
    <p class="wish-thanks prose" id="wish-thanks" hidden>Your blessing is on its way. Thank you for your love.</p>
  </div>
</section>`;

export function initWishes(cfg, guest) {
  const form = $('#wish-form');
  if (guest) form.elements.name.value = guest;
  $('#wish-send').addEventListener('click', () => {
    const msg = form.elements.msg.value.trim();
    if (!msg) { form.elements.msg.focus(); form.elements.msg.closest('.field').classList.add('is-invalid'); return; }
    const who = form.elements.name.value.trim();
    window.open(whatsappLink(cfg.contact?.whatsapp || cfg.rsvp.whatsapp || '', `Wishes for ${cfg.groomName} & ${cfg.brideName}:\n\n${msg}${who ? `\n\n— ${who}` : ''}`), '_blank', 'noopener');
    form.hidden = true; $('#wish-thanks').hidden = false;
  });
}
