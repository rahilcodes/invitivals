/* CountdownSection — four engraved numerals, no boxes. */
import { Heading, Kolam } from '../decor.js';
import { $ } from '../util.js';

const UNITS = [['d', 'Days'], ['h', 'Hours'], ['m', 'Minutes'], ['s', 'Seconds']];

export const CountdownSection = () => `
<section class="sec countdown" id="countdown" aria-labelledby="countdown-h">
  <div class="sec-inner">
    ${Heading('Counting the Moments', 'We can’t wait to celebrate with you', { id: 'countdown-h' })}
    <div class="clock" data-reveal role="timer" aria-live="off">
      ${Kolam('clock-kolam')}
      ${UNITS.map(([k, label], i) => `${i ? '<i class="clock-dot" aria-hidden="true"></i>' : ''}
        <div class="clock-unit"><span class="clock-n" data-unit="${k}">00</span><span class="clock-l">${label}</span></div>`).join('')}
    </div>
    <p class="clock-done" hidden>Today is the day. Thank you for celebrating with us.</p>
  </div>
</section>`;

export function initCountdown(cfg) {
  const target = new Date(cfg.weddingDate).getTime();
  const root = $('#countdown');
  const cells = Object.fromEntries([...root.querySelectorAll('[data-unit]')].map((n) => [n.dataset.unit, n]));
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    let ms = target - Date.now();
    if (ms <= 0) {
      root.querySelector('.clock').hidden = true;
      root.querySelector('.clock-done').hidden = false;
      return;
    }
    const d = Math.floor(ms / 864e5); ms -= d * 864e5;
    const h = Math.floor(ms / 36e5); ms -= h * 36e5;
    const m = Math.floor(ms / 6e4); ms -= m * 6e4;
    const s = Math.floor(ms / 1e3);
    const vals = { d: d > 99 ? String(d) : pad(d), h: pad(h), m: pad(m), s: pad(s) };
    for (const k in vals) {
      const c = cells[k];
      if (c.textContent === vals[k]) continue;
      c.textContent = vals[k];
      c.classList.remove('roll'); void c.offsetWidth; c.classList.add('roll'); // digits roll in like a counter
    }
    setTimeout(tick, 1000 - (Date.now() % 1000));
  };
  tick();
}
