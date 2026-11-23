/* WishesSection — the last page (client, 2026-11-23): the lamps, a note to the couple delivered on WhatsApp, and
   Share the Invitation as the final action; the design's temple tank then rises out of the paper to end the page. */
import { Heading, Button, BrassLamp } from '../decor.js';
import { $, whatsappLink } from '../util.js';

/* floating diya flames measured on finale.webp (percent), with relative size */
const DIYAS = [[20.7, 83.4, 1.3], [87.5, 87.1, 1.4], [79.3, 87.9, 1], [3.5, 80.3, .8], [29.2, 79, .7], [86.3, 76.7, .7], [95.4, 71.9, .6], [19.1, 75.6, .6]];

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
    <div class="thanks-share" data-reveal>${Button({ label: 'Share the Invitation', icon: 'send', cls: 'btn-ghost js-share' })}</div>
    <p class="credit">Designed by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=${cfg.creditCampaign || 'hindu-south-wedding'}" target="_blank" rel="noopener">Invitivals</a></p>
  </div>
  <div class="finale" aria-hidden="true">
    <img src="assets/finale.webp" alt="" loading="lazy" decoding="async">
    ${DIYAS.map(([x, y, s], i) => `<span class="diya-glow" style="left:${x}%;top:${y}%;--i:${i};--s:${s}"></span>`).join('')}
  </div>
</section>`;

export function initWishes(cfg, guest) {
  const form = $('#wish-form');
  if (guest) form.elements.name.value = guest;
  $('#wish-send').addEventListener('click', () => {
    const msg = form.elements.msg.value.trim();
    if (!msg) { form.elements.msg.focus(); form.elements.msg.closest('.field').classList.add('is-invalid'); return; }
    const who = form.elements.name.value.trim();
    window.open(whatsappLink(cfg.wishes.whatsapp || cfg.contact?.whatsapp || cfg.rsvp?.whatsapp || '', `Wishes for ${cfg.pair[0]} & ${cfg.pair[1]}:\n\n${msg}${who ? `\n\n— ${who}` : ''}`), '_blank', 'noopener');
    form.hidden = true; $('#wish-thanks').hidden = false;
  });
}
