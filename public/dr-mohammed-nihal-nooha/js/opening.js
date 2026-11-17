/* OpeningScreen — the film's first frame with Tap to Play. One tap starts the film (with its own sound) and primes
   the music silently inside the same gesture, which is what lets the music start later without a second tap.

   The hand-over to the invitation happens the moment the film's picture is finished: `cfg.filmEndsAt` on the film's
   own clock (the file then only holds the empty card for four more seconds — waiting for that was the pause and the
   blank screen). It is read from the playing film frame by frame, never from a timer, so a film that buffers is
   simply waited for. The film's real `ended`, an `error`, and a film that never starts or stalls for good all hand
   over as well, so no guest is ever left on a frozen or empty screen.
   The invitation is already complete beneath the film, and the film dissolves onto it while it is still moving:
   no black frame, no loading screen. The music comes in with that dissolve; the film's own sound fades under it. */
import { h } from './util.js?v=2';

export function OpeningScreen(cfg, { audio, onStart, onOpened }) {
  const tap = h('button', { class: 'tap', type: 'button', 'aria-label': 'Tap to open the invitation' },
    h('span', { class: 'ring', 'aria-hidden': 'true' }), h('span', {}, 'Tap to Open'));
  /* the film's wax seal carries another couple's letters: the family's NN monogram lies over it, on the poster and
     on the film, in a box that matches the picture's own frame (9:16, covering the screen) so it stays on the seal */
  const S = cfg.seal;
  const sealOn = () => (S ? h('div', { class: 'seal', style: { left: `${S.cx}%`, top: `${S.cy}%`, width: `${S.d}%` }, 'aria-hidden': 'true' }, h('img', { src: S.face, alt: '', decoding: 'async' })) : null);
  const frame = h('div', { class: 'frame' }, h('div', { class: 'cover' }, h('img', { class: 'art', src: cfg.poster, alt: 'Wedding invitation envelope', fetchpriority: 'high', decoding: 'async', width: 720, height: 1280 }), sealOn()), tap);
  const opening = h('div', { class: 'opening' }, h('div', { class: 'column' }, frame));

  const video = h('video', { playsinline: true, 'webkit-playsinline': true, preload: 'auto', src: cfg.video, poster: cfg.poster, 'aria-label': 'Opening film', width: 720, height: 1280 });
  const filmSeal = sealOn(), burst = S ? h('div', { class: 'burst', style: { left: `${S.cx}%`, top: `${S.cy}%`, width: `${S.d * 2.6}%` }, 'aria-hidden': 'true' }) : null;
  const film = h('div', { class: 'film' }, h('div', { class: 'column' }, h('div', { class: 'cover' }, video, filmSeal, burst)));
  const skip = h('button', { class: 'skip', type: 'button', style: { display: 'none' } }, 'Skip');
  document.body.append(opening, film, skip);

  let opened = false, done = false, watch = 0, stall = 0;
  function finish() {
    if (done) return; done = true;
    cancelAnimationFrame(watch); clearInterval(stall);
    audio.begin();                       // the music comes in as the invitation opens
    onOpened();
    film.classList.add('fade');          // 0.9 s dissolve onto the finished page beneath, the film still running
    skip.remove();
    const v0 = video.volume, t0 = performance.now();
    const duck = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / 800); try { video.volume = v0 * (1 - k); } catch { /* iOS: read-only */ } if (k >= 1) clearInterval(duck); }, 60);
    setTimeout(() => { clearInterval(duck); video.pause(); video.removeAttribute('src'); video.load(); film.remove(); }, 1000);
  }

  tap.addEventListener('click', () => {
    if (opened) return; opened = true;
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
    /* the film's own clock, read every frame */
    const end = Number(cfg.filmEndsAt) || Infinity;
    const tick = () => {
      if (done) return;
      const t = video.currentTime;
      if (t >= end) return finish();
      /* as the seal breaks, a soft burst of light takes the monogram away with it */
      if (S && t >= S.until && !film.classList.contains('broken')) film.classList.add('broken');
      if (S && t >= S.burstEnd && !film.classList.contains('cleared')) film.classList.add('cleared');
      watch = requestAnimationFrame(tick);
    };
    watch = requestAnimationFrame(tick);
    video.addEventListener('timeupdate', () => { if (video.currentTime >= end) finish(); });   // a background tab gets no frames
    /* a film that makes no progress at all for six seconds (no network, a codec the phone refuses) is not waited for */
    let lastT = -1, idle = 0;
    stall = setInterval(() => { if (video.currentTime === lastT) { idle += 1; if (idle >= 6) finish(); } else { idle = 0; lastT = video.currentTime; } }, 1000);
  });
}
