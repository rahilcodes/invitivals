/* OpeningScreen — the sealed envelope and Tap to Open. One tap: fullscreen (where allowed), the music is
   primed inside the gesture and fades in, and the envelope fades straight onto page 1, which is already
   rendered beneath. (The demo's door film is not used here: its wax seal carries another couple's initials.) */
import { h } from './util.js';

export function OpeningScreen(cfg, { audio, onStart, onOpened }) {
  const tap = h('button', { class: 'tap', type: 'button', 'aria-label': 'Tap to open the invitation' },
    h('span', { class: 'ring', 'aria-hidden': 'true' }), h('span', {}, 'Tap to Open'));
  const frame = h('div', { class: 'frame' }, h('img', { class: 'art', src: cfg.poster, alt: 'Sealed wedding invitation', fetchpriority: 'high', decoding: 'async' }), tap);
  const opening = h('div', { class: 'opening' }, h('div', { class: 'column' }, frame));
  document.body.append(opening);
  let opened = false;

  tap.addEventListener('click', () => {
    if (opened) return; opened = true;
    const fs = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
    // best effort, never awaited: some browsers leave this promise pending
    if (fs) { try { const p = fs.call(document.documentElement, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch { /* not allowed here, that's fine */ } }
    onStart();
    audio.prime();
    opening.classList.add('out');
    audio.begin();
    onOpened();
    setTimeout(() => opening.remove(), 1000);
  });
}
