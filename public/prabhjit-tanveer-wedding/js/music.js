/* Background music for the scroll. The intro film carries its own audio, so the
   ambient track is primed (unlocked) inside the opening tap and then faded in
   once the film hands over to the invitation. The button mirrors the real
   state of the audio element, so a tap always pauses what is playing. */
import { Icon } from './decor.js';

export function createMusic(src, { onBlocked } = {}) {
  const audio = new Audio(src);
  audio.loop = true; audio.volume = 0; audio.preload = 'none';
  let primed = false, wants = false, stopping = false;

  const btn = document.createElement('button');
  btn.className = 'music'; btn.type = 'button';
  btn.setAttribute('aria-label', 'Play music'); btn.setAttribute('aria-pressed', 'false');
  btn.innerHTML = `${Icon('music')}<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>`;

  const reflect = () => {
    const on = !audio.paused && !stopping;
    btn.classList.toggle('is-playing', on);
    btn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
    btn.setAttribute('aria-pressed', String(on));
  };
  audio.addEventListener('playing', reflect);
  audio.addEventListener('pause', reflect);
  audio.addEventListener('ended', reflect);

  let fade;
  const fadeTo = (v, ms = 1600) => {
    clearInterval(fade);
    const from = audio.volume, t0 = performance.now();
    fade = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      try { audio.volume = from + (v - from) * k; } catch { /* iOS: volume is read-only */ }
      if (k === 1) clearInterval(fade);
    }, 40);
  };

  const start = () => {
    stopping = false;
    btn.classList.add('is-loading');
    audio.play().then(() => { btn.classList.remove('is-loading'); fadeTo(0.5); reflect(); })
      .catch(() => { btn.classList.remove('is-loading'); reflect(); if (wants) onBlocked?.(); });
  };
  const stop = () => {
    stopping = true; clearInterval(fade);
    try { audio.volume = 0; } catch {}
    audio.pause(); reflect();
  };

  btn.addEventListener('click', () => {
    if (!audio.paused) { wants = false; stop(); }
    else { wants = true; start(); }
  });

  document.addEventListener('visibilitychange', () => {
    if (!wants) return;
    if (document.hidden) audio.pause(); else audio.play().catch(() => {});
  });

  return {
    /* call inside the opening tap gesture to unlock deferred playback */
    prime() {
      if (primed) return; primed = true;
      audio.preload = 'auto'; audio.muted = true;
      audio.play().then(() => { audio.pause(); audio.currentTime = 0; audio.muted = false; })
        .catch(() => { audio.muted = false; });
    },
    /* call once the invitation is revealed */
    play() { wants = true; start(); },
    show() {
      document.body.appendChild(btn);
      requestAnimationFrame(() => btn.classList.add('is-shown'));
    },
  };
}
