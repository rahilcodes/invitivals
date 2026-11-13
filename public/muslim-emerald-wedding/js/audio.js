/* AudioControl — one looping music player for the whole invitation and its
   fixed mute button. The player is started muted inside the opening tap (so
   browsers allow it) and faded in once the film has finished, so the film's
   own soundtrack and the music never compete. Volume lives in config. */
import { h } from './util.js';

export function AudioControl(cfg) {
  const music = new Audio();
  music.loop = true; music.preload = 'none'; music.volume = 0;
  let wanted = true; // the guest's own choice
  let fadeTimer = null, primed = false;

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
    else music.muted = true;
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
  // pause when the tab is hidden, resume when it is back (if the guest wants music)
  document.addEventListener('visibilitychange', () => {
    if (!primed) return;
    if (document.hidden) music.pause(); else if (wanted) music.play().catch(() => {});
  });
  addEventListener('pagehide', () => { clearInterval(fadeTimer); music.pause(); });

  return {
    /* call inside the user gesture: starts the player silently */
    prime() {
      if (!cfg.music) return;
      primed = true; music.src = cfg.music; music.muted = true;
      return music.play().catch(() => {});
    },
    /* the film is over: let the music in */
    begin() {
      if (!cfg.music) return;
      btn.classList.add('shown');
      if (!wanted) return;
      if (!primed) { primed = true; music.src = cfg.music; }
      music.muted = false;
      music.play().catch(() => {});
      fadeTo(cfg.musicVolume, cfg.musicFadeSeconds);
    },
    element: music,
  };
}
