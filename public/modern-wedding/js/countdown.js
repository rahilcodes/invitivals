/* Countdown — page 4: live days, hours, minutes and seconds to the Nikkah, each figure in its own glass
   box of the landscape plaque (the reference's figures were erased from the plate). Tabular figures in
   fixed boxes, so nothing around them ever shifts; zeros once the moment has come. */
import { h } from './util.js';
import { box } from './page.js';

export function Countdown(targetIso) {
  const target = Date.parse(targetIso);
  const cells = [0, 1, 2, 3].map((k) => h('div', { class: 's digit reveal', style: { ...box(`p4-digit${k}`), zIndex: 3, '--d': `${0.45 + k * 0.1}s` } }, h('span', {}, '00')));
  const live = h('div', { class: 'sr-only', 'aria-live': 'polite', 'aria-atomic': 'true' });
  const labels = ['days', 'hours', 'minutes', 'seconds'];
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
    if (minute !== lastMinute) { lastMinute = minute; live.textContent = left ? `${v[0]} ${labels[0]}, ${v[1]} ${labels[1]} and ${v[2]} ${labels[2]} until we say Nikkah` : 'The Nikkah day is here'; }
  }
  update();
  const timer = setInterval(update, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  cells.push(live);
  cells.stop = () => clearInterval(timer);
  return cells;
}
