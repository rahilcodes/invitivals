/* OpeningScreen — the chapel doors poster (1.png, with its painted "Tap to Open"), then the film.
   One tap: fullscreen where the browser allows it (best effort, never awaited), the film plays with its own
   soundtrack, the invitation's music is primed silently inside the same gesture and only fades in once the
   film is over, so the two never play together. The hero is already rendered beneath, so the film's last
   frame dissolves straight onto it: no black frame, no jump. Skip ends the film early; a film that cannot
   play, stalls or errors gives way at once. Replay plays the film again over the page (music paused). */
import { h, icons } from './util.js?v=5';

export function OpeningScreen(cfg, { audio, onStart, onOpened }) {
  const b = cfg.tapBox;
  const tap = h('button', { class: 'tap-hit', type: 'button', 'aria-label': 'Tap to open the invitation', style: { left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` } });
  const frame = h('div', { class: 'frame' }, h('img', { class: 'art', src: cfg.poster, alt: 'The chapel doors, closed: tap to open the invitation', fetchpriority: 'high', decoding: 'async', draggable: 'false' }), tap);
  const opening = h('div', { class: 'opening', role: 'dialog', 'aria-label': 'Opening' }, frame);

  const video = h('video', { playsinline: true, 'webkit-playsinline': true, preload: 'auto', src: cfg.video, 'aria-label': 'Opening film', disablepictureinpicture: true, disableremoteplayback: true });
  const film = h('div', { class: 'film' }, h('div', { class: 'frame' }, video));
  const skip = h('button', { class: 'skip', type: 'button', hidden: true }, 'Skip');
  document.body.append(opening, film, skip);

  let opened = false, done = false, raf = 0, lastT = -1, lastMove = 0, letGoOpening = null;
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  /* a frozen film does not hold the guest */
  function watch() {
    if (done) return;
    const t = video.currentTime, now = performance.now();
    if (t !== lastT) { lastT = t; lastMove = now; }
    else if (lastMove && !video.paused && !video.ended && now - lastMove > 3000) { finish(); return; }
    raf = requestAnimationFrame(watch);
  }

  function requestFs() {
    const el = document.documentElement;
    const fs = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!fs || (document.fullscreenEnabled === false)) return;
    try { const p = fs.call(el, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch { /* not allowed here, that's fine */ }
  }

  function finish() {
    if (done) return; done = true;
    cancelAnimationFrame(raf);
    clearTimers();
    if (letGoOpening) letGoOpening();
    audio.begin();
    onOpened();
    film.classList.add('fade');
    skip.hidden = true;
    setTimeout(() => { try { video.pause(); } catch { /* already gone */ } film.classList.remove('playing', 'fade'); }, 1100);
  }

  const open = () => {
    if (opened) return; opened = true;
    tap.disabled = true;
    requestFs();
    onStart(); // the invitation is complete behind the film from now on, so the film can fade straight onto it
    audio.prime(); // the music starts muted inside this gesture, so it may be let in later without another tap
    film.classList.add('playing');
    // the poster stays in view until the film is really playing (a slow connection would otherwise show a
    // black screen that looks stuck); finish() lets it go too, whatever the film does
    const letGo = () => { if (opening.isConnected && !opening.classList.contains('out')) { opening.classList.add('out'); setTimeout(() => opening.remove(), 1000); } };
    letGoOpening = letGo;
    video.muted = false;
    lastMove = performance.now();
    raf = requestAnimationFrame(watch);
    video.addEventListener('playing', () => { skip.hidden = false; letGo(); }, { once: true });
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
  };
  tap.addEventListener('click', (e) => { e.stopPropagation(); open(); });
  frame.addEventListener('click', open); // the doors, the steps, the button: one tap anywhere opens
  skip.addEventListener('click', () => (done ? endReplay() : finish()));
  opening.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

  /* ── replay: the film again, over the open invitation ── */
  let replaying = false, replayBtn = null;
  function endReplay() {
    if (!replaying) return; replaying = false;
    clearTimers();
    film.classList.add('fade'); skip.hidden = true;
    audio.resume();
    setTimeout(() => { video.pause(); film.classList.remove('playing', 'fade'); if (replayBtn) replayBtn.focus({ preventScroll: true }); }, 1100);
  }
  function replay(from) {
    if (replaying || !done) return; replaying = true; replayBtn = from || null;
    audio.hold();
    video.muted = false; video.currentTime = 0;
    film.classList.add('playing');
    const onEnd = () => endReplay();
    video.addEventListener('ended', onEnd, { once: true });
    video.addEventListener('error', onEnd, { once: true });
    later(endReplay, (cfg.filmMaxSeconds || 14) * 1000);
    const p = video.play();
    if (p && p.catch) p.catch(() => { video.muted = true; video.play().catch(endReplay); });
    skip.hidden = false;
  }
  const replayControl = h('button', { class: 'replay', type: 'button', 'aria-label': cfg.replay, title: cfg.replay, html: icons.replay, onclick: (e) => replay(e.currentTarget) });
  return { replayControl };
}
