/* Countdown — live days, hours, minutes and seconds to the engagement ceremony, each figure in its own glass box of the landscape
   plaque. The target is one absolute instant (India time is written into it) and the guest's own clock is read
   every second, so it is right in any timezone. Tabular figures in fixed boxes, so nothing shifts.
   Once the moment has come the boxes rest at 00 and the plaque's heading changes to `done`, and from `afterFrom`
   to `after` (both two short lines, set like the heading). */
import { h } from './util.js?v=1';

const BOX = [30.82, 43.447, 56.254, 69.12];           // the four glass boxes of the plate, % of its width
const LABELS = ['Days', 'Hours', 'Minutes', 'Seconds'];

export function Countdown({ target: targetIso, word, done, after, afterFrom }) {
  const target = Date.parse(targetIso), later = afterFrom ? Date.parse(afterFrom) : Infinity;
  const cells = BOX.map((x, k) => h('div', { class: 'digit reveal', style: { left: `${x}%`, '--d': `${0.45 + k * 0.1}s` } }, h('span', {}, '00')));
  const labels = BOX.map((x, k) => h('div', { class: 'digit-label reveal', style: { left: `${x}%`, '--d': `${0.5 + k * 0.1}s` }, 'aria-hidden': 'true' }, LABELS[k]));
  const live = h('div', { class: 'sr-only', 'aria-live': 'polite', 'aria-atomic': 'true' });
  let lastMinute = -1, state = '', timer = 0;
  function update() {
    const now = Date.now(), left = Math.max(0, target - now);
    if (!left) {
      const next = now >= later ? 'after' : 'done';
      if (next !== state) {
        state = next;
        const lines = next === 'after' ? after : done;
        cells.forEach((c) => { c.firstChild.textContent = '00'; c.firstChild.classList.remove('n3'); });
        const page = live.parentElement;
        page?.classList.add('count-over');
        page?.querySelector('.until')?.replaceChildren(...lines.map((l) => h('b', {}, l)));
        live.textContent = lines.join(' ');
      }
      if (next === 'after') clearInterval(timer);
      return;
    }
    const s = Math.floor(left / 1000);
    const v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    v.forEach((n, k) => {
      const text = String(n).padStart(2, '0');
      const span = cells[k].firstChild;
      if (span.textContent !== text) { span.textContent = text; span.classList.toggle('n3', text.length > 2); }
    });
    const minute = Math.floor(s / 60);
    if (minute !== lastMinute) { lastMinute = minute; live.textContent = `${v[0]} days, ${v[1]} hours and ${v[2]} minutes until the ${word}`; }
  }
  /* the first reading waits until the pieces are on the page, so the heading can be found */
  queueMicrotask(update);

  timer = setInterval(update, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  return [...cells, ...labels, live];
}
