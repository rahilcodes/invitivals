/* OpeningScreen — the pack's door artwork (1.png, "Tap to Open" is part of it)
   with a hit area over its tap mark, then VIDEO.mp4 once. The one tap starts
   the song first (same gesture), asks for fullscreen synchronously, and starts
   the film with its own track muted so the song is the only music. The hero is
   already rendered beneath the film; just before the film's last frame — which
   is the hero scene — the film dissolves away over it, so there is no cut, no
   black frame and no scale jump. A Continue button is there throughout. */
import { h } from './util.js';

export function OpeningScreen(cfg, { audio, onOpened }) {
  const tap = h('button', { class: 'tap', type: 'button', 'aria-label': 'Tap to open the invitation' }, h('span', { class: 'ring', 'aria-hidden': 'true' }));
  const frame = h('div', { class: 'frame' }, h('img', { class: 'art', src: cfg.poster, alt: 'Emerald and gold doors of the wedding invitation', fetchpriority: 'high', decoding: 'async' }), tap);
  const opening = h('div', { class: 'opening' }, h('div', { class: 'column' }, frame));

  const video = h('video', { playsinline: true, 'webkit-playsinline': true, preload: 'auto', muted: true, src: cfg.video, 'aria-label': 'Opening film' });
  video.muted = true;
  /* the stage is the hero page's own box (same width, same 941:1672 ratio, top of the column);
     it is scaled up to cover the screen while the film plays and settles back onto the hero
     box as the film dissolves, so the last frame and the hero line up to the pixel */
  const stage = h('div', { class: 'stage' }, video);
  const film = h('div', { class: 'film' }, stage);
  function fitStage(cover) {
    const w = stage.offsetWidth || 1, hgt = w * 1672 / 941, vh = innerHeight;
    const k = cover ? Math.max(1, vh / hgt) : 1;
    const ty = cover ? Math.max(0, (vh - hgt) / 2) : 0;
    stage.style.transform = `translate(-50%, ${ty}px) scale(${k})`;
  }
  const skip = h('button', { class: 'skip', type: 'button', style: { display: 'none' } }, 'Continue');
  document.body.append(opening, film, skip);

  let opened = false, done = false;
  const DISSOLVE_BEFORE_END = cfg.dissolveSeconds || 0.9; // the film's last frame is the hero; start blending here

  function finish() {
    if (done) return; done = true;
    onOpened();
    film.classList.add('fade');
    fitStage(false); // zoom out onto the hero box while fading
    skip.remove();
    // the film keeps playing its last frames under the dissolve; removed only once it is fully gone
    setTimeout(() => { video.pause(); video.removeAttribute('src'); video.load(); film.remove(); }, 1400);
  }

  tap.addEventListener('click', () => {
    if (opened) return; opened = true;
    audio.start(); // first thing in the gesture: the song begins now and never restarts
    // fullscreen where the browser allows it — asked right here in the gesture, never awaited
    const el = document.documentElement;
    const fs = el.requestFullscreen || el.webkitRequestFullscreen;
    if (fs) { try { const p = fs.call(el, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch { /* unsupported here: carry on */ } }
    film.classList.add('playing');
    fitStage(true);
    addEventListener('resize', () => { if (!done) fitStage(true); }, { passive: true });
    opening.classList.add('out');
    setTimeout(() => opening.remove(), 1000);
    const started = video.play();
    video.addEventListener('playing', () => { skip.style.display = ''; }, { once: true });
    video.addEventListener('timeupdate', () => {
      if (!done && video.duration && video.duration - video.currentTime <= DISSOLVE_BEFORE_END) finish();
    });
    video.addEventListener('ended', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
    if (started && started.catch) started.catch(finish); // even a muted film refused: go straight in
    // a stalled network must never trap the guest
    setTimeout(() => { if (!done && (video.readyState < 3 || video.paused)) skip.style.display = ''; }, 4000);
    setTimeout(() => { if (!done && video.paused) finish(); }, 20000);
    skip.addEventListener('click', finish);
  });
}
