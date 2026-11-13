/* ClosingSection — the last scene: the Gurudwara at sunset. The blessing is
   written into its sky, the couple's monogram, the date and the share actions
   rest over the water, and a quiet credit line ends the scroll. */
import { GoldKhanda, Monogram, Button, Icon, PetalShower } from '../decor.js';
import { esc, day, month, year, shareInvite, copyText, toast, couple } from '../util.js';

export const ClosingSection = (cfg) => `
<section class="closing" id="closing" aria-labelledby="closing-h">
  <img class="closing-bg" src="assets/finale-bg.webp" alt="" loading="lazy" decoding="async" data-parallax="-0.03">
  ${PetalShower(6)}
  <div class="closing-sky">
    <div data-reveal>${GoldKhanda('closing-khanda')}</div>
    <h2 id="closing-h" data-reveal>${cfg.closing.title.map(esc).join('<br>')}</h2>
    <div class="closing-lines" data-reveal>${cfg.closing.lines.map((l) => `<p>${esc(l)}</p>`).join('')}</div>
    ${cfg.closing.signoff ? `<p class="closing-signoff" data-reveal>${esc(cfg.closing.signoff)}</p>` : ''}
  </div>
  <div class="closing-water">
    <div data-reveal>${Monogram(...couple(cfg, true))}</div>
    <p class="closing-names" data-reveal>${couple(cfg, true).map(esc).join(' <i>&amp;</i> ')}</p>
    <p class="closing-date" data-reveal>${day(cfg.weddingDate)} · ${month(cfg.weddingDate)} · ${year(cfg.weddingDate)}</p>
    ${cfg.closing.farewell ? `<p class="closing-farewell" data-reveal>${esc(cfg.closing.farewell)}</p>` : ''}
    <div class="closing-share" data-reveal>
      ${Button({ label: 'Share', icon: 'send', cls: 'btn-primary js-share' })}
      ${Button({ label: 'WhatsApp', icon: 'whatsapp', cls: 'btn-light', id: 'share-wa' })}
      ${Button({ label: 'Copy Link', icon: 'copy', cls: 'btn-light', id: 'share-copy' })}
    </div>
    <p class="closing-credit"><a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=${encodeURIComponent(location.pathname.split('/')[1] || 'invitation')}" target="_blank" rel="noopener">${esc(cfg.closing.credit)}</a></p>
  </div>
</section>`;

export function initClosing(cfg) {
  const url = location.origin + location.pathname;
  document.getElementById('share-wa')?.addEventListener('click', () =>
    window.open(`https://wa.me/?text=${encodeURIComponent(`${cfg.shareText}\n${url}`)}`, '_blank', 'noopener'));
  document.getElementById('share-copy')?.addEventListener('click', async () =>
    toast((await copyText(url)) ? 'Link copied — share it with your loved ones' : 'Could not copy — long-press the address bar'));
}
