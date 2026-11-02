/* OpeningScreen — the film's first frame with Tap to Play. One tap: fullscreen where allowed, the pack's
   AI film plays once with its own sound (never before the tap, never twice), the music is primed silently
   inside the same gesture, and when the film ends it dissolves straight onto page 1, which is already
   rendered beneath: no black frame. */
import { h } from './util.js';

export function OpeningScreen(cfg, { audio, onStart, onOpened }) {
  const tap = h('button', { class: 'tap', type: 'button', 'aria-label': 'Tap to play the invitation' },
    h('span', { class: 'ring', 'aria-hidden': 'true' }), h('span', {}, 'Tap to Play'));
  const frame = h('div', { class: 'frame' }, h('img', { class: 'art', src: cfg.poster, alt: 'Wedding invitation envelope', fetchpriority: 'high', decoding: 'async', width: 720, height: 1280 }), tap);
  const opening = h('div', { class: 'opening' }, h('div', { class: 'column' }, frame));

  const video = h('video', { playsinline: true, 'webkit-playsinline': true, preload: 'auto', src: cfg.video, poster: cfg.poster, 'aria-label': 'Opening film', width: 720, height: 1280 });
  const film = h('div', { class: 'film' }, h('div', { class: 'column' }, video));
  const skip = h('button', { class: 'skip', type: 'button', style: { display: 'none' } }, 'Skip');
  document.body.append(opening, film, skip);

  let opened = false, done = false;
  function finish() {
    if (done) return; done = true;
    audio.begin();
    onOpened();
    film.classList.add('fade');
    skip.remove();
    setTimeout(() => { video.pause(); video.removeAttribute('src'); video.load(); film.remove(); }, 1300);
  }

  tap.addEventListener('click', () => {
    if (opened) return; opened = true;
    const fs = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
    // best effort, never awaited: some browsers leave this promise pending, and the film must not wait for it
    if (fs) { try { const p = fs.call(document.documentElement, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch { /* not allowed here, that's fine */ } }
    onStart(); // the invitation is complete behind the film from now on, so the film can dissolve onto it
    audio.prime();
    film.classList.add('playing');
    opening.classList.add('out');
    setTimeout(() => opening.remove(), 900);
    video.muted = false;
    const started = video.play();
    video.addEventListener('playing', () => { skip.style.display = ''; }, { once: true });
    video.addEventListener('ended', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
    if (started && started.catch) started.catch(() => {
      // playback with sound refused: try silently, else go straight in
      video.muted = true;
      video.play().catch(finish);
    });
    skip.addEventListener('click', finish);
  });
}
