/* Countdown — live days, hours, minutes and seconds to the Nikah, each figure in its own glass box of the landscape
   plaque. The target is one absolute instant (India time is written into it), so it is right in any guest's
   timezone. Tabular figures in fixed boxes, so nothing shifts; zeros once the moment has come. */
import { h } from './util.js?v=1';

const BOX = [30.82, 43.447, 56.254, 69.12];           // the four glass boxes of the plate, % of its width
const LABELS = ['Days', 'Hours', 'Minutes', 'Seconds'];

export function Countdown(targetIso, word) {
  const target = Date.parse(targetIso);
  const cells = BOX.map((x, k) => h('div', { class: 'digit reveal', style: { left: `${x}%`, '--d': `${0.45 + k * 0.1}s` } }, h('span', {}, '00')));
  const labels = BOX.map((x, k) => h('div', { class: 'digit-label reveal', style: { left: `${x}%`, '--d': `${0.5 + k * 0.1}s` }, 'aria-hidden': 'true' }, LABELS[k]));
  const live = h('div', { class: 'sr-only', 'aria-live': 'polite', 'aria-atomic': 'true' });
  let lastMinute = -1;
  function update() {
    const left = Math.max(0, target - Date.now());
    const s = Math.floor(left / 1000);
    const v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    v.forEach((n, k) => {
      const text = String(n).padStart(2, '0');
      const span = cells[k].firstChild;
      if (span.textContent !== text) { span.textContent = text; span.classList.toggle('n3', text.length > 2); }
    });
    const minute = Math.floor(s / 60);
    if (minute !== lastMinute) { lastMinute = minute; live.textContent = left ? `${v[0]} days, ${v[1]} hours and ${v[2]} minutes until we say ${word}` : `The ${word} day is here`; }
  }
  update();
  setInterval(update, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  return [...cells, ...labels, live];
}
