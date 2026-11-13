/* OpeningScreen — the pack's door artwork with a "स्पर्श करा" mark; the whole
   screen is the tap. The one tap starts the song (same gesture), asks for
   fullscreen synchronously, and plays the pack's film — the same door scene,
   the bride reaching for the lotus medallion — muted, so the song is the only
   music. The hero is rendered beneath; just before the film ends it dissolves
   away over the hero. A "पुढे जा" button is there throughout. */
import { h } from './util.js';
import { icon } from './ornaments.js';

export function OpeningScreen(cfg, ui, { audio, onOpened }) {
  const mark = h('span', { class: 'mark', 'aria-hidden': 'true' }, h('span', { class: 'ring' }));
  const label = h('span', { class: 'tap-label', 'aria-hidden': 'true' }, h('i', { html: icon('hand') }), h('span', { lang: 'mr' }, cfg.tap));
  const tap = h('button', { class: 'tap', type: 'button', 'aria-label': cfg.tap }, mark, label);
  const frame = h('div', { class: 'frame' }, h('img', { class: 'art', src: cfg.poster, alt: '', fetchpriority: 'high', decoding: 'async' }), tap);
  const opening = h('div', { class: 'opening' }, h('div', { class: 'column' }, frame));

  const video = h('video', { playsinline: true, 'webkit-playsinline': true, preload: 'auto', muted: true, src: cfg.video, 'aria-label': 'Opening film' });
  video.muted = true;
  /* the stage is the hero page's own box (same width, same 941:1672 ratio, top of the column),
     scaled up to cover the screen while the film plays */
  const stage = h('div', { class: 'stage' }, video);
  const film = h('div', { class: 'film' }, stage);
  function fitStage() {
    const w = stage.offsetWidth || 1, hgt = w * 1671 / 941, vh = innerHeight;
    const k = Math.max(1, vh / hgt);
    const ty = Math.max(0, (vh - hgt) / 2);
    stage.style.transform = `translate(-50%, ${ty}px) scale(${k})`;
  }
  const skip = h('button', { class: 'skip', type: 'button', style: { display: 'none' } }, ui.skip);
  document.body.append(opening, film, skip);

  let opened = false, done = false;
  const DISSOLVE_BEFORE_END = cfg.dissolveSeconds || 1.1;

  function finish() {
    if (done) return; done = true;
    onOpened();
    film.classList.add('fade');
    skip.remove();
    setTimeout(() => { video.pause(); video.removeAttribute('src'); video.load(); film.remove(); }, 1500);
  }

  tap.addEventListener('click', () => {
    if (opened) return; opened = true;
    audio.start(); // first thing in the gesture: the song begins now and never restarts
    const el = document.documentElement;
    const fs = el.requestFullscreen || el.webkitRequestFullscreen;
    if (fs) { try { const p = fs.call(el, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch { /* unsupported here: carry on */ } }
    film.classList.add('playing');
    fitStage();
    addEventListener('resize', () => { if (!done) fitStage(); }, { passive: true });
    const started = video.play();
    const reveal = () => { opening.classList.add('out'); setTimeout(() => opening.remove(), 1000); };
    video.addEventListener('playing', () => { reveal(); skip.style.display = ''; }, { once: true });
    video.addEventListener('timeupdate', () => {
      if (!done && video.duration && video.duration - video.currentTime <= DISSOLVE_BEFORE_END) finish();
    });
    video.addEventListener('ended', finish, { once: true });
    video.addEventListener('error', () => { reveal(); finish(); }, { once: true });
    if (started && started.catch) started.catch(() => { reveal(); finish(); }); // even a muted film refused: go straight in
    // a stalled network must never trap the guest
    setTimeout(() => { if (!done && (video.readyState < 3 || video.paused)) { reveal(); skip.style.display = ''; } }, 3500);
    setTimeout(() => { if (!done && video.paused) finish(); }, 16000);
    skip.addEventListener('click', finish);
  });
}
