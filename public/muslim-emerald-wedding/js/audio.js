/* AudioControl — ONE looping music player for the whole invitation and its
   fixed mute button. It lives outside the pages, is created once, and starts
   inside the very first tap (the same gesture that opens the doors), so the
   song plays through the film, the hero dissolve and every section without
   restarting. The film's own track is muted; the song is the only music.
   Volume lives in config. If the browser still refuses playback, the button
   shows as muted so the guest can start the song with a tap. */
import { h } from './util.js';

export function AudioControl(cfg) {
  const music = new Audio();
  music.loop = true; music.preload = 'auto'; music.volume = 0; music.crossOrigin = null;
  if (cfg.music) music.src = cfg.music; // buffering begins on load, so the tap starts it at once
  let wanted = true; // the guest's own choice
  let fadeTimer = null, started = false;

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
  function fadeTo(target, seconds) {
    clearInterval(fadeTimer);
    const steps = Math.max(1, Math.round(seconds * 20));
    const from = music.volume; let i = 0;
    fadeTimer = setInterval(() => {
      i++; try { music.volume = from + (target - from) * (i / steps); } catch { /* iOS: volume is read-only */ }
      if (i >= steps) clearInterval(fadeTimer);
    }, 50);
  }
  /* muting keeps the playback position; unmuting continues from the same place */
  function set(on) {
    wanted = on; render();
    if (on) { music.muted = false; music.play().catch(() => { wanted = false; render(); }); fadeTo(cfg.musicVolume, 1); }
    else music.muted = true;
  }
  // pause when the tab is hidden, resume where it was when it is back (if the guest wants music)
  document.addEventListener('visibilitychange', () => {
    if (!started) return;
    if (document.hidden) music.pause(); else if (wanted) music.play().catch(() => {});
  });
  addEventListener('pagehide', () => { clearInterval(fadeTimer); music.pause(); });

  return {
    /* call FIRST inside the opening tap: the song starts right away and fades up */
    start() {
      if (!cfg.music || started) return;
      started = true;
      btn.classList.add('shown');
      music.muted = false;
      try { music.volume = 0; } catch { /* iOS */ }
      const p = music.play();
      fadeTo(cfg.musicVolume, cfg.musicFadeSeconds);
      if (p && p.catch) p.catch(() => { wanted = false; render(); }); // blocked: offer the button instead of pretending
    },
    element: music,
  };
}
