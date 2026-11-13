/* Gift — screen 7. The pack's printed "आशीर्वाद स्वरूप भेट" button opens the
   configured details (UPI ID with a copy button, bank lines, a note). With
   nothing configured it says so instead of pretending. */
import { h, toast, openSheet } from './util.js';
import { icon } from './ornaments.js';
import { artSizes } from './art-sizes.js';

export function GiftButton(cfg, F) {
  const [bw, bh] = artSizes['btn-gift'];
  const configured = !!(cfg.upiId || (cfg.bank && cfg.bank.length) || cfg.note);
  const btn = h('button', { class: 'img-btn', type: 'button', 'aria-haspopup': configured ? 'dialog' : null, 'aria-label': cfg.sheetTitle },
    h('img', { src: 'assets/btn-gift.webp', alt: '', width: bw, height: bh, loading: 'lazy', decoding: 'async' }));
  btn.addEventListener('click', () => {
    if (!configured) { toast(cfg.notConfigured); return; }
    const body = h('div', { class: 'gift-body', lang: 'mr' });
    if (cfg.note) body.append(h('p', { class: 'gift-note' }, cfg.note));
    if (cfg.upiId) {
      const copy = h('button', { class: 'pill small', type: 'button' }, h('i', { class: 'ico', html: icon('copy') }), h('span', {}, cfg.copy));
      copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(cfg.upiId); copy.querySelector('span').textContent = cfg.copied; setTimeout(() => { copy.querySelector('span').textContent = cfg.copy; }, 2000); }
        catch { toast(cfg.upiId); }
      });
      body.append(h('div', { class: 'box gift-upi' }, h('div', { class: 'row' }, h('span', { class: 'glabel' }, 'UPI'), h('b', { class: 'upi-id', dir: 'ltr' }, cfg.upiId)), cfg.upiName ? h('div', { class: 'row sub' }, cfg.upiName) : null, h('div', { class: 'row' }, copy)));
    }
    if (cfg.bank && cfg.bank.length) body.append(h('div', { class: 'box gift-bank' }, ...cfg.bank.map((l) => h('div', { class: 'row' }, l))));
    openSheet(cfg.sheetTitle, body, { closeLabel: F.close });
  });
  return btn;
}
