/* OpeningScreen — the sealed envelope, Tap to Open, then the door film.
   One tap: fullscreen (where allowed), the film plays with its own door sound,
   the music is primed silently and fades in after cfg.doorSoundSeconds, when the
   film's remaining soundtrack is muted. The invitation is already rendered
   beneath, so the film fades straight onto page 1 — no black frame. */
import { h } from './util.js';

export function OpeningScreen(cfg, { audio, onStart, onOpened }) {
  const tap = h('button', { class: 'tap', type: 'button', 'aria-label': 'Tap to open the invitation' },
    h('span', { class: 'ring', 'aria-hidden': 'true' }), h('span', {}, 'Tap to Open'));
  const frame = h('div', { class: 'frame' }, h('img', { class: 'art', src: cfg.poster, alt: 'Sealed wedding invitation', fetchpriority: 'high', decoding: 'async' }), tap);
  const opening = h('div', { class: 'opening' }, h('div', { class: 'column' }, frame));

  const video = h('video', { playsinline: true, 'webkit-playsinline': true, preload: 'auto', src: cfg.video, 'aria-label': 'Opening film' });
  const film = h('div', { class: 'film' }, h('div', { class: 'column' }, video));
  const skip = h('button', { class: 'skip', type: 'button', style: { display: 'none' } }, 'Skip');
  document.body.append(opening, film, skip);

  let opened = false, doorTimer = null, done = false;

  function finish() {
    if (done) return; done = true;
    clearTimeout(doorTimer);
    audio.begin();
    onOpened();
    film.classList.add('fade');
    skip.remove();
    setTimeout(() => { video.pause(); video.removeAttribute('src'); video.load(); film.remove(); }, 1100);
  }

  tap.addEventListener('click', () => {
    if (opened) return; opened = true;
    const fs = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
    // best effort, never awaited: some browsers leave this promise pending, and the film must not wait for it
    if (fs) { try { const p = fs.call(document.documentElement, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch { /* not allowed here, that's fine */ } }
    onStart(); // the invitation is complete behind the film from now on, so the film can fade straight onto it
    audio.prime();
    film.classList.add('playing');
    opening.classList.add('out');
    setTimeout(() => opening.remove(), 1000);
    video.muted = false;
    const started = video.play();
    const onPlaying = () => {
      skip.style.display = '';
      // the door sound is the first part of the film's track; after it, the film goes quiet and the music takes over
      doorTimer = setTimeout(() => { video.muted = true; audio.begin(); }, cfg.doorSoundSeconds * 1000);
    };
    video.addEventListener('playing', onPlaying, { once: true });
    video.addEventListener('ended', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
    if (started && started.catch) started.catch(() => {
      // autoplay with sound refused: try silently, else go straight in
      video.muted = true;
      video.play().then(() => { audio.begin(); }).catch(finish);
    });
    skip.addEventListener('click', finish);
  });
}
