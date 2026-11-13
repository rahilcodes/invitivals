/* Countdown — four rings (the pack's round counter) counting to the configured wedding start.
   No valid date: the "missing" line. Date past: the rings rest at 00 and the "past" line shows beneath. */
import { h } from './util.js?v=5';

export function Countdown(cfg, wedding) {
  const target = wedding.start ? new Date(wedding.start).getTime() : NaN;
  const note = h('p', { class: 'cd-note', role: 'status' });
  if (Number.isNaN(target)) { note.textContent = cfg.missing; return note; }
  const cells = cfg.units.map((u, i) => h('div', { class: 'ring reveal', style: { '--d': `${i * 0.12}s` } },
    h('img', { src: 'assets/counter.webp', alt: '', decoding: 'async', draggable: 'false' }),
    h('span', { class: 'num' }, '00'), h('span', { class: 'unit' }, u)));
  const rings = h('div', { class: 'rings', role: 'timer', 'aria-live': 'off' }, cells);
  const root = h('div', { class: 'countdown' }, rings, note);
  const nums = cells.map((c) => c.querySelector('.num'));
  let timer = 0;
  function tick() {
    const left = target - Date.now();
    if (left <= 0) {
      clearInterval(timer);
      nums.forEach((n) => { n.textContent = '00'; }); note.textContent = cfg.past;
      return;
    }
    const s = Math.floor(left / 1000);
    const parts = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
    parts.forEach((p, i) => { const v = String(p).padStart(2, '0'); if (nums[i].textContent !== v) nums[i].textContent = v; });
    rings.setAttribute('aria-label', parts.map((p, i) => `${p} ${cfg.units[i]}`).join(', '));
  }
  tick();
  timer = setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  return root;
}
