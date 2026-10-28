/* IntroExperience — the sealed doors video. Tap breaks the seal, the doors open,
   and the final arch frame dissolves into the hero, which is composed to match it. */
import { $, escScript, reducedMotion } from '../util.js';

export const IntroExperience = (cfg, guest) => `
<div class="intro" id="intro" role="dialog" aria-label="Wedding invitation of ${cfg.pair[0]} and ${cfg.pair[1]}">
  <video class="intro-video" id="intro-video" src="${cfg.intro.video}" poster="${cfg.intro.poster}"
         muted playsinline preload="auto" disablepictureinpicture></video>
  ${cfg.introShloka ? `<div class="intro-frame"><p class="intro-shloka" lang="${cfg.introShloka.lang || 'sa'}">${cfg.introShloka.lines.map((l) => `<span>${l}</span>`).join('')}</p></div>` : ''}
  <span class="intro-glow" aria-hidden="true"></span>
  <p class="intro-guest"><small>Specially for</small><span>${escScript(guest || cfg.guestFallback)}</span></p>
  <span class="intro-bloom" aria-hidden="true"></span>
  <button class="intro-tap" id="intro-tap" type="button" aria-label="Tap to open the invitation"></button>
  <p class="intro-wait" aria-live="polite">Opening…</p>
  <button class="intro-skip" id="intro-skip" type="button">Skip</button>
</div>`;

/* onTap runs inside the user gesture (music may only start there); onOpen once the page is revealed */
export function initIntro({ onTap, onOpen }) {
  const intro = $('#intro');
  const video = $('#intro-video');
  const tap = $('#intro-tap');
  const skip = $('#intro-skip');
  let opened = false;
  document.documentElement.classList.add('is-sealed');

  const reveal = (fast = false) => {
    if (opened) return;
    opened = true;
    if (fast) intro.classList.add('is-skipped');
    document.documentElement.classList.remove('is-sealed');
    document.documentElement.classList.add('is-open');
    onOpen?.();
    setTimeout(() => { intro.remove(); }, 2200);
  };

  tap.addEventListener('click', () => {
    tap.disabled = true;
    intro.classList.add('is-playing');
    navigator.vibrate?.(18); // the seal giving way, felt on Android
    onTap?.();
    if (reducedMotion()) { reveal(true); return; }
    if (video.readyState < 3) intro.classList.add('is-loading');
    video.addEventListener('playing', () => {
      intro.classList.remove('is-loading');
      setTimeout(() => skip.classList.add('is-shown'), 900);
      setTimeout(() => reveal(), 10000); // safety net if the video stalls mid-way
    }, { once: true });
    const p = video.play();
    if (p && p.catch) p.catch(() => reveal(true)); // no video playback → straight to the hero
    // the last ~0.7s of the film is the still arch; dissolve over it so there is never a frozen or black frame
    video.addEventListener('timeupdate', () => {
      if (video.duration && video.currentTime >= video.duration - 0.75) reveal();
    });
    video.addEventListener('ended', () => reveal(), { once: true });
    video.addEventListener('error', () => reveal(true), { once: true });
    setTimeout(() => reveal(true), 25000); // very slow networks: never trap the guest
  }, { once: true });

  skip.addEventListener('click', () => { video.pause(); reveal(true); });
}
