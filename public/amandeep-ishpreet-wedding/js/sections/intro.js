/* IntroExperience — the sealed ivory-and-navy doors film. A tap breaks the
   seal, the Khanda shimmers, the doors open onto the Gurudwara, and the final
   frame dissolves into the hero, which is composed to match it. The film has
   its own audio, so it plays with sound inside the tap gesture (muted fallback
   if a browser refuses). */
import { $, escScript, reducedMotion, couple } from '../util.js';

export const IntroExperience = (cfg, guest) => `
<div class="intro" id="intro" role="dialog" aria-label="Wedding invitation of ${couple(cfg).join(' and ')}"
     style="background-image:url(${cfg.intro.poster})">
  <video class="intro-video" id="intro-video" src="${cfg.intro.video}" poster="${cfg.intro.poster}"
         playsinline preload="auto" disablepictureinpicture></video>
  <span class="intro-glow" aria-hidden="true"></span>
  <p class="intro-guest">${(cfg.intro.eyebrow ?? 'Specially for') ? `<small>${escScript(cfg.intro.eyebrow ?? 'Specially for')}</small>` : ''}<span>${escScript(guest || cfg.guestFallback)}</span></p>
  ${cfg.intro.gurbani ? `<div class="intro-gurbani" aria-hidden="true" lang="pa">${cfg.intro.gurbani.map((l) => `<span>${escScript(l)}</span>`).join('')}</div>` : ''}
  <span class="intro-bloom" aria-hidden="true"></span>
  <button class="intro-tap" id="intro-tap" type="button" aria-label="Tap to open the invitation"></button>
  <p class="intro-wait" aria-live="polite">Opening…</p>
  <button class="intro-sound" id="intro-sound" type="button" aria-label="Mute">🔊</button>
  <button class="intro-skip" id="intro-skip" type="button">Skip</button>
</div>`;

/* onOpen runs once the page is revealed. textAt: second of the film at which the
   Gurbani (if any) appears over the opened arch; hold: extra seconds the final
   scene stays before it dissolves into the hero. */
export function initIntro({ onTap, onOpen, textAt = 2, hold = 0 }) {
  const intro = $('#intro');
  const video = $('#intro-video');
  const tap = $('#intro-tap');
  const skip = $('#intro-skip');
  const sound = $('#intro-sound');
  let opened = false;
  let revealAt = null;
  // the final arch scene stays `hold` seconds longer; the film rests on its last (still) frame meanwhile
  const finish = () => { if (revealAt === null) revealAt = setTimeout(() => reveal(), hold * 1000); };
  document.documentElement.classList.add('is-sealed');

  const reveal = (fast = false) => {
    if (opened) return;
    opened = true;
    if (fast) intro.classList.add('is-skipped');
    document.documentElement.classList.remove('is-sealed');
    document.documentElement.classList.add('is-open');
    try { video.pause(); } catch {}
    onOpen?.();
    setTimeout(() => intro.remove(), 2200);
  };

  sound.addEventListener('click', () => {
    video.muted = !video.muted;
    sound.textContent = video.muted ? '🔇' : '🔊';
    sound.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
  });

  tap.addEventListener('click', () => {
    tap.disabled = true;
    onTap?.();
    intro.classList.add('is-playing');
    navigator.vibrate?.(18);
    if (reducedMotion()) { reveal(true); return; }
    if (video.readyState < 3) intro.classList.add('is-loading');
    video.addEventListener('playing', () => {
      intro.classList.remove('is-loading');
      setTimeout(() => { skip.classList.add('is-shown'); sound.classList.add('is-shown'); }, 900);
      setTimeout(() => reveal(), 11000 + hold * 1000); // safety net if the film stalls
    }, { once: true });
    // try with sound (allowed inside the gesture); fall back to muted if refused
    video.muted = false;
    const p = video.play();
    if (p && p.catch) p.catch(() => {
      video.muted = true; sound.textContent = '🔇';
      video.play().catch(() => reveal(true));
    });
    // last ~0.7s is the still arch; dissolve over it so there is never a frozen frame
    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      if (video.currentTime >= textAt) intro.classList.add('is-ending');
      if (video.currentTime >= video.duration - 0.7) finish();
    });
    video.addEventListener('ended', finish, { once: true });
    video.addEventListener('error', () => reveal(true), { once: true });
    setTimeout(() => reveal(true), 25000);
  }, { once: true });

  skip.addEventListener('click', () => { video.pause(); reveal(true); });
}
