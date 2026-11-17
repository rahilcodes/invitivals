/* Countdown — live days, hours, minutes and seconds to the Nikah, four equal tiles. The target is one absolute
   instant (Pakistan time is written into it), so it is right in any guest's time zone. Tabular figures in fixed
   tiles, so nothing shifts; zeros once the moment has come. */
import { h } from './util.js?v=2';

const LABELS = ['Days', 'Hours', 'Minutes', 'Seconds'];

export function Countdown(targetIso, word) {
  const target = Date.parse(targetIso);
  const figs = LABELS.map(() => h('b', {}, '00'));
  const tiles = h('div', { class: 'tiles reveal', style: { '--d': '.45s' }, 'aria-hidden': 'true' }, ...LABELS.map((l, k) => h('div', { class: 'tile' }, figs[k], h('span', {}, l))));
  const live = h('div', { class: 'sr-only', 'aria-live': 'polite', 'aria-atomic': 'true' });
  let lastMinute = -1;
  function update() {
    const left = Math.max(0, target - Date.now());
    const s = Math.floor(left / 1000);
    const v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    v.forEach((n, k) => { const text = String(n).padStart(2, '0'); if (figs[k].textContent !== text) { figs[k].textContent = text; figs[k].classList.toggle('n3', text.length > 2); } });
    const minute = Math.floor(s / 60);
    if (minute !== lastMinute) { lastMinute = minute; live.textContent = left ? `${v[0]} days, ${v[1]} hours and ${v[2]} minutes until the ${word}` : `The ${word} day is here`; }
  }
  update();
  setInterval(update, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  return [tiles, live];
}
