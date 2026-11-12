/* WishesSection — a note to the couple, written out and opened in WhatsApp, addressed to the bride; the guest presses
   Send there. */
import { Heading, Button, BrassLamp } from '../decor.js';
import { $, esc } from '../util.js';
import { openWhatsApp } from '../links.js';

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
    <p class="wish-thanks prose" id="wish-thanks" hidden></p>
  </div>
</section>`;

export function initWishes(cfg, guest) {
  const form = $('#wish-form');
  if (guest) form.elements.name.value = guest;
  $('#wish-send').addEventListener('click', () => {
    const msg = form.elements.msg.value.trim();
    if (!msg) { form.elements.msg.focus(); form.elements.msg.closest('.field').classList.add('is-invalid'); return; }
    form.elements.msg.closest('.field').classList.remove('is-invalid');
    const who = form.elements.name.value.trim();
    if (!who) { form.elements.name.focus(); form.elements.name.closest('.field').classList.add('is-invalid'); return; }
    form.elements.name.closest('.field').classList.remove('is-invalid');
    const text = [
      'Hello! I would like to send my wishes to Vaishnavi and Harishwar.',
      '',
      `From: ${who}`,
      '',
      'My Wishes:',
      msg,
      '',
      'Best wishes to the couple!',
    ].join('\n');
    const url = openWhatsApp(cfg.contact.whatsapp, text);
    const thanks = $('#wish-thanks');
    thanks.innerHTML = `Thank you, ${esc(who)}. WhatsApp is opening with your wishes for the bride.<br>Please press <b>Send</b> there to deliver them.<br><a class="wa-again" href="${esc(url)}" target="_blank" rel="noopener">Open WhatsApp again</a>`;
    form.hidden = true; thanks.hidden = false;
  });
}
