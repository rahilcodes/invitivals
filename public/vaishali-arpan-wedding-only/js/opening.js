/* OpeningScreen — the sealed envelope, Tap to Open, then the demo's door film.
   One tap: fullscreen (where allowed), the film plays with its own soundtrack (the seal breaking, the doors),
   the invitation's music is primed silently inside the same gesture and fades in only when the film is over,
   so the two never play together. The invitation is already rendered beneath, so the film fades straight
   onto page 1. Skip ends the film early; a film that cannot play, stalls or errors gives way at once.
   The demo film's wax seal reads CL: a face lettered VA (cfg.sealFace) is laid over it, placed from the
   video's rendered box, until the seal breaks; a burst of light then covers the flying pieces. */
import { h } from './util.js';

export function OpeningScreen(cfg, { audio, onStart, onOpened }) {
  const tap = h('button', { class: 'tap', type: 'button', 'aria-label': 'Tap to open the invitation' },
    h('span', { class: 'ring', 'aria-hidden': 'true' }), h('span', {}, 'Tap to Open'));
  const frame = h('div', { class: 'frame' }, h('img', { class: 'art', src: cfg.poster, alt: 'Sealed wedding invitation', fetchpriority: 'high', decoding: 'async' }), tap);
  frame.style.cursor = 'pointer'; // the seal, the envelope, the button: one tap anywhere opens
  const opening = h('div', { class: 'opening' }, h('div', { class: 'column' }, frame));

  const video = h('video', { playsinline: true, 'webkit-playsinline': true, preload: 'auto', src: cfg.video, 'aria-label': 'Opening film', disablepictureinpicture: true, disableremoteplayback: true });
  const seal = h('img', { class: 'seal', src: cfg.sealFace, alt: '', 'aria-hidden': 'true', decoding: 'async', draggable: 'false' });
  const burst = h('div', { class: 'burst', 'aria-hidden': 'true' });
  const stage = h('div', { class: 'film-stage' }, video, seal, burst);
  const film = h('div', { class: 'film' }, h('div', { class: 'column' }, stage));
  const skip = h('button', { class: 'skip', type: 'button', style: { display: 'none' } }, 'Skip');
  document.body.append(opening, film, skip);

  let opened = false, done = false, raf = 0, lastT = -1, lastMove = 0, letGoOpening = null;
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  /* the seal face and the burst sit where the film's seal is, whatever the viewport makes of the film */
  function place() {
    const W = stage.clientWidth, Hh = stage.clientHeight;
    if (!W || !Hh) return;
    const vw = video.videoWidth || 720, vh = video.videoHeight || 1280;
    const scale = Math.max(W / vw, Hh / vh); // object-fit: cover, centred
    const dw = vw * scale, dh = vh * scale, x0 = (W - dw) / 2, y0 = (Hh - dh) / 2;
    const cx = x0 + cfg.seal.cx * dw, cy = y0 + cfg.seal.cy * dh, r = cfg.seal.r * dw;
    Object.assign(seal.style, { left: `${cx - r}px`, top: `${cy - r}px`, width: `${r * 2}px`, height: `${r * 2}px` });
    const br = r * 2.3;
    Object.assign(burst.style, { left: `${cx - br}px`, top: `${cy - br}px`, width: `${br * 2}px`, height: `${br * 2}px` });
  }
  video.addEventListener('loadedmetadata', place);
  addEventListener('resize', place);

  /* every frame: the face until the seal breaks, then the burst; and a stalled film does not hold the guest */
  function frameStep() {
    if (done) return;
    const t = video.currentTime;
    const b0 = cfg.sealUntil, b1 = cfg.burstEnd;
    seal.style.opacity = t < b0 ? '1' : '0';
    let glow = 0;
    if (t >= b0 - 0.15 && t < b0) glow = (t - (b0 - 0.15)) / 0.15;
    else if (t >= b0 && t < b0 + 0.3) glow = 1; // the pieces fly apart under full light
    else if (t >= b0 + 0.3 && t < b1) glow = 1 - (t - b0 - 0.3) / (b1 - b0 - 0.3);
    burst.style.opacity = glow.toFixed(3);
    const now = performance.now();
    if (t !== lastT) { lastT = t; lastMove = now; }
    else if (lastMove && !video.paused && !video.ended && now - lastMove > 3000) { finish(); return; } // frozen playback
    raf = requestAnimationFrame(frameStep);
  }

  function finish() {
    if (done) return; done = true;
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    removeEventListener('resize', place);
    if (letGoOpening) letGoOpening();
    audio.begin();
    onOpened();
    film.classList.add('fade');
    skip.remove();
    setTimeout(() => { try { video.pause(); video.removeAttribute('src'); video.load(); } catch { /* already gone */ } film.remove(); }, 1100);
  }

  const open = () => {
    if (opened) return; opened = true;
    tap.querySelector('span:last-child').textContent = 'Opening…';
    tap.disabled = true;
    const fs = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
    // best effort, never awaited: some browsers leave this promise pending, and the film must not wait for it
    if (fs) { try { const p = fs.call(document.documentElement, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch { /* not allowed here, that's fine */ } }
    onStart(); // the invitation is complete behind the film from now on, so the film can fade straight onto it
    audio.prime(); // the music starts muted inside this gesture, so it may be let in later without another tap
    film.classList.add('playing');
    requestAnimationFrame(place);
    // the envelope stays in view until the film is really playing (a slow connection otherwise shows a black
    // screen that looks stuck); finish() lets it go too, whatever the film does
    const letGo = () => { if (opening.isConnected && !opening.classList.contains('out')) { opening.classList.add('out'); setTimeout(() => opening.remove(), 1000); } };
    letGoOpening = letGo;
    video.muted = false;
    seal.style.opacity = '1';
    lastMove = performance.now();
    raf = requestAnimationFrame(frameStep);
    const onPlaying = () => { skip.style.display = ''; place(); letGo(); };
    video.addEventListener('playing', onPlaying, { once: true });
    video.addEventListener('ended', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
    later(() => { if (video.currentTime < 0.2) finish(); }, 6000); // never started: go in
    later(finish, (cfg.filmMaxSeconds || 14) * 1000); // never ended: go in
    const started = video.play();
    if (started && started.catch) started.catch(() => {
      // sound refused: the film plays silently and the music comes in now, rather than nothing at all
      video.muted = true;
      video.play().then(() => audio.begin()).catch(finish);
    });
    skip.addEventListener('click', finish);
  };
  tap.addEventListener('click', (e) => { e.stopPropagation(); open(); });
  frame.addEventListener('click', open);
}
