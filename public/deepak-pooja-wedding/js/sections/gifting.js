/* GiftingSection — said gently; details only when asked for. */
import { Heading, Button, Icon, FloralVine } from '../decor.js';
import { $ } from '../util.js';

export const GiftingSection = (cfg) => `
<section class="sec gifting" id="gifting" aria-labelledby="gifting-h">
  ${FloralVine({ side: 'r', top: '-40px', height: '640px', crop: 60, depth: 0.05 })}
  <div class="sec-inner">
    ${Heading('Gifting', '', { id: 'gifting-h' })}
    <p class="prose" data-reveal>${cfg.gifting.text}</p>
    <div data-reveal>${Button({ label: 'View Gift Details', icon: 'gift', id: 'gift-toggle', attrs: 'aria-expanded="false" aria-controls="gift-panel"' })}</div>
    <div class="gift-panel" id="gift-panel" hidden>
      <p class="eyebrow">UPI</p>
      <p class="gift-upi"><span id="gift-upi">${cfg.gifting.upi}</span>
        <button type="button" class="copy" id="gift-copy" aria-label="Copy UPI ID">${Icon('copy')}</button></p>
      <p class="gift-name">${cfg.gifting.name}</p>
    </div>
  </div>
</section>`;

export function initGifting() {
  const t = $('#gift-toggle'), panel = $('#gift-panel');
  t.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    t.setAttribute('aria-expanded', String(open));
    t.querySelector('span').textContent = open ? 'Hide Gift Details' : 'View Gift Details';
  });
  $('#gift-copy').addEventListener('click', async (e) => {
    try { await navigator.clipboard.writeText($('#gift-upi').textContent); } catch { return; }
    e.currentTarget.classList.add('is-done');
    setTimeout(() => e.currentTarget?.classList.remove('is-done'), 1600);
  });
}
