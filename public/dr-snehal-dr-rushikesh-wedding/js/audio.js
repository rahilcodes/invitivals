/* AudioControl — one music player for the whole invitation and its mute button.
   The music is started inside the opening tap (muted), so browsers allow it;
   it is unmuted and faded in once the film's door sound has played. */
import { h } from './util.js';

export function AudioControl(cfg) {
  const music = new Audio(cfg.music);
  music.loop = true; music.preload = 'auto'; music.volume = 0;
  let wanted = true; // the guest's own choice
  let fadeTimer = null;

  const btn = h('button', { class: 'audio', type: 'button', 'aria-label': 'Mute music', 'aria-pressed': 'false', onclick: () => set(!wanted) });
  btn.innerHTML =
    '<svg class="on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>' +
    '<svg class="off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/><path d="M3 3l18 18" stroke-width="1.8"/></svg>';
  document.body.append(btn);

  function render() {
    btn.classList.toggle('muted', !wanted);
    btn.setAttribute('aria-pressed', String(!wanted));
    btn.setAttribute('aria-label', wanted ? 'Mute music' : 'Play music');
  }
  function set(on) {
    wanted = on; render();
    if (on) { music.muted = false; music.play().catch(() => {}); fadeTo(cfg.musicVolume, 1.2); }
    else { music.muted = true; }
  }
  function fadeTo(target, seconds) {
    clearInterval(fadeTimer);
    const steps = Math.max(1, Math.round(seconds * 20));
    const from = music.volume; let i = 0;
    fadeTimer = setInterval(() => {
      i++; try { music.volume = from + (target - from) * (i / steps); } catch { /* iOS: volume is read-only */ }
      if (i >= steps) clearInterval(fadeTimer);
    }, 50);
  }

  return {
    /* call inside the user gesture: starts the player silently */
    prime() {
      music.muted = true;
      return music.play().catch(() => {});
    },
    /* the door sound is over: let the music in */
    begin() {
      btn.classList.add('shown');
      if (!wanted) return;
      music.muted = false;
      music.play().catch(() => {});
      fadeTo(cfg.musicVolume, cfg.musicFadeSeconds);
    },
    show() { btn.classList.add('shown'); },
    element: music,
  };
}
