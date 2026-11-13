/* AudioControl — one music player for the whole invitation and its controls: a round button that
   opens a small panel with Pause/Play, Mute and a volume slider. The music is started muted inside the
   opening tap (so browsers allow it) and let in once the film's soundtrack is over. With no music file
   configured there is no player and no button. */
import { h, icons } from './util.js?v=5';

export function AudioControl(cfg) {
  if (!cfg.music) return { prime() {}, begin() {}, hold() {}, resume() {}, element: null };
  const music = new Audio(cfg.music);
  music.loop = true; music.preload = 'auto'; music.volume = 0;
  let wanted = true;   // the guest's own choice to listen
  let paused = false;  // the guest's own pause
  let level = cfg.musicVolume; // the guest's own volume
  let fadeTimer = null, began = false;

  const main = h('button', { class: 'audio', type: 'button', 'aria-label': 'Music controls', 'aria-expanded': 'false', html: `<span class="on">${icons.note}</span><span class="off">${icons.mute}</span>` });
  const playBtn = h('button', { type: 'button', class: 'ctl', 'aria-label': 'Pause music', html: icons.pause });
  const muteBtn = h('button', { type: 'button', class: 'ctl', 'aria-label': 'Mute music', 'aria-pressed': 'false', html: icons.sound });
  const vol = h('input', { type: 'range', min: '0', max: '1', step: '0.05', value: String(level), 'aria-label': 'Music volume' });
  const panel = h('div', { class: 'audio-panel', hidden: true }, playBtn, muteBtn, vol);
  const wrap = h('div', { class: 'audio-wrap' }, main, panel);
  document.body.append(wrap);

  function render() {
    const silent = !wanted || paused;
    main.classList.toggle('muted', silent);
    playBtn.innerHTML = paused ? icons.play : icons.pause;
    playBtn.setAttribute('aria-label', paused ? 'Play music' : 'Pause music');
    muteBtn.innerHTML = wanted ? icons.sound : icons.mute;
    muteBtn.setAttribute('aria-pressed', String(!wanted));
    muteBtn.setAttribute('aria-label', wanted ? 'Mute music' : 'Unmute music');
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
  const apply = () => {
    if (!began) return;
    if (paused) { music.pause(); return; }
    music.muted = !wanted;
    if (wanted) { music.play().catch(() => {}); fadeTo(level, 0.6); }
  };
  main.addEventListener('click', () => { const open = panel.hidden; panel.hidden = !open; main.setAttribute('aria-expanded', String(open)); });
  playBtn.addEventListener('click', () => { paused = !paused; render(); apply(); });
  muteBtn.addEventListener('click', () => { wanted = !wanted; render(); apply(); });
  vol.addEventListener('input', () => { level = Number(vol.value); try { music.volume = level; } catch { /* read-only */ } });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target) && !panel.hidden) { panel.hidden = true; main.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) apply(); });
  render();

  return {
    /* inside the user gesture: start the player silently so it may be let in later without another tap */
    prime() { music.muted = true; return music.play().catch(() => {}); },
    /* the film is over: let the music in */
    begin() {
      began = true; wrap.classList.add('shown');
      if (!wanted || paused) return;
      music.muted = false;
      music.play().catch(() => {});
      fadeTo(level, cfg.musicFadeSeconds);
    },
    /* the film plays again: step aside, then come back */
    hold() { if (began) { fadeTo(0, 0.5); setTimeout(() => music.pause(), 600); } },
    resume() { if (began && wanted && !paused) { music.play().catch(() => {}); fadeTo(level, 1.5); } },
    element: music,
  };
}
