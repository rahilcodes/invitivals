/* CountdownSection — a restrained live countdown to the Anand Karaj on a
   card, in the visitor's own clock, anchored to New Delhi time; a wedding-day
   greeting on the day, and a thank-you once it has passed. */
import { Heading, Icon } from '../decor.js';
import { $, day, month, year, weekday, dayState } from '../util.js';

export const CountdownSection = (cfg) => `
<section class="section countdown" id="countdown">
  ${Heading(cfg.countdown.title, cfg.countdown.sub)}
  <div class="card card-count" data-reveal>
    <div class="cd-grid" id="cd-grid" role="timer" aria-live="off">
      ${['Days', 'Hours', 'Minutes', 'Seconds'].map((l) => `
        <div class="cd-cell"><div class="cd-num" data-cd="${l.toLowerCase()}">—</div><div class="cd-lab">${l}</div></div>`).join('')}
    </div>
    <p class="cd-date" id="cd-date">${Icon('calendar', 'ico ico-xs')}<span>${weekday(cfg.weddingDate)}, ${day(cfg.weddingDate)} ${month(cfg.weddingDate)} ${year(cfg.weddingDate)}</span></p>
    <p class="cd-passed" id="cd-passed" hidden>${cfg.countdown.passed}</p>
  </div>
</section>`;

export function initCountdown(cfg) {
  const grid = $('#cd-grid'), passed = $('#cd-passed'), dateEl = $('#cd-date');
  if (!grid) return;
  const target = new Date(cfg.weddingDate).getTime();
  const cells = Object.fromEntries(['days', 'hours', 'minutes', 'seconds'].map((k) => [k, grid.querySelector(`[data-cd="${k}"]`)]));
  const pad = (n) => String(n).padStart(2, '0');
  let timer;
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      grid.hidden = true; dateEl.hidden = true; passed.hidden = false;
      if (dayState(cfg.weddingDate) === 'today') passed.textContent = 'Today is the day — Anand Karaj. Blessings to all who gather.';
      clearInterval(timer);
      return;
    }
    const s = Math.floor(diff / 1000);
    cells.days.textContent = Math.floor(s / 86400);
    cells.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    cells.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    cells.seconds.textContent = pad(s % 60);
  };
  tick();
  timer = setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
}
