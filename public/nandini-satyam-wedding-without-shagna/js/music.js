/* Background music: starts inside the tap that opens the invitation, fades in, and can be paused. */
import { Icon } from './decor.js';

export function createMusic(src) {
  const audio = new Audio(src);
  audio.loop = true; audio.volume = 0;
  audio.preload = 'none'; // 3.7 MB: fetched only once the guest taps to open
  const btn = document.createElement('button');
  btn.className = 'music'; btn.type = 'button';
  btn.setAttribute('aria-label', 'Pause music');
  btn.innerHTML = `${Icon('music')}<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>`;
  let fade;
  const fadeTo = (v, ms = 1600) => {
    clearInterval(fade);
    const from = audio.volume, t0 = performance.now();
    fade = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      audio.volume = from + (v - from) * k;
      if (k === 1) { clearInterval(fade); if (v === 0) audio.pause(); }
    }, 40);
  };
  const play = () => {
    audio.play().then(() => { fadeTo(0.55); btn.classList.add('is-playing'); btn.setAttribute('aria-label', 'Pause music'); })
      .catch(() => { btn.classList.remove('is-playing'); btn.setAttribute('aria-label', 'Play music'); });
  };
  btn.addEventListener('click', () => {
    if (btn.classList.contains('is-playing')) {
      fadeTo(0, 500); btn.classList.remove('is-playing'); btn.setAttribute('aria-label', 'Play music');
    } else play();
  });
  // pause with the tab, resume on return if it was playing
  document.addEventListener('visibilitychange', () => {
    if (!btn.classList.contains('is-playing')) return;
    if (document.hidden) audio.pause(); else audio.play().catch(() => {});
  });
  return { play, show: () => { document.body.appendChild(btn); requestAnimationFrame(() => btn.classList.add('is-shown')); } };
}
