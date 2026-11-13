/* OpeningScreen — the pack's door artwork (1.png, "Tap to Open" is part of it)
   with a hit area over its tap mark, then VIDEO.mp4 once. The one tap asks for
   fullscreen (synchronously, inside the gesture), starts the film with sound
   where the browser allows it and primes the music silently. The invitation is
   already rendered beneath, so when the film ends it cross-fades straight onto
   the hero — no black frame, no loop. A Continue button is there throughout. */
import { h } from './util.js';

export function OpeningScreen(cfg, { audio, onOpened }) {
  const tap = h('button', { class: 'tap', type: 'button', 'aria-label': 'Tap to open the invitation' }, h('span', { class: 'ring', 'aria-hidden': 'true' }));
  const frame = h('div', { class: 'frame' }, h('img', { class: 'art', src: cfg.poster, alt: 'Emerald and gold doors of the wedding invitation', fetchpriority: 'high', decoding: 'async' }), tap);
  const opening = h('div', { class: 'opening' }, h('div', { class: 'column' }, frame));

  const video = h('video', { playsinline: true, 'webkit-playsinline': true, preload: 'auto', src: cfg.video, 'aria-label': 'Opening film' });
  const film = h('div', { class: 'film' }, h('div', { class: 'column' }, video));
  const skip = h('button', { class: 'skip', type: 'button', style: { display: 'none' } }, 'Continue');
  document.body.append(opening, film, skip);

  let opened = false, done = false;

  function finish() {
    if (done) return; done = true;
    onOpened();
    audio.begin();
    film.classList.add('fade');
    skip.remove();
    setTimeout(() => { video.pause(); video.removeAttribute('src'); video.load(); film.remove(); }, 1300);
  }

  tap.addEventListener('click', () => {
    if (opened) return; opened = true;
    // fullscreen where the browser allows it — asked right here in the gesture, never awaited
    const el = document.documentElement;
    const fs = el.requestFullscreen || el.webkitRequestFullscreen;
    if (fs) { try { const p = fs.call(el, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch { /* unsupported here: carry on */ } }
    audio.prime();
    film.classList.add('playing');
    opening.classList.add('out');
    setTimeout(() => opening.remove(), 1000);
    video.muted = false;
    const started = video.play();
    video.addEventListener('playing', () => { skip.style.display = ''; }, { once: true });
    video.addEventListener('ended', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
    if (started && started.catch) started.catch(() => {
      // sound refused: play silently; if even that fails, go straight in
      video.muted = true;
      video.play().catch(finish);
    });
    // a stalled network must never trap the guest
    setTimeout(() => { if (!done && (video.readyState < 3 || video.paused)) skip.style.display = ''; }, 4000);
    skip.addEventListener('click', finish);
  });
}
