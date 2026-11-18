/* DateReveal — screen 3. The pack's calendar frame (its printed November grid
   painted out) carries a live month grid for the configured event; the pack's
   button (its printed label painted out, "Reveal the Date" written on it) is
   the reveal: the pearl heart frame closes around the day, the weekday and
   date are written beneath the calendar, and the button gives way to a
   save-to-calendar pill. */
import { h, partsOf, marathiDate, marathiWeekday, saveEvent, reducedMotion } from './util.js?v=3';
import { at, txt } from './page.js?v=3';
import { icon } from './ornaments.js?v=3';
import { artSizes } from './art-sizes.js?v=3';

export function DateReveal(cfg, ev, couple, ui, { month, grid, button, date }) {
  /* grid: { x, y, w, head, row, cols } in percent of the page (y = top of the weekday row) */
  const p = partsOf(ev.start);
  const first = new Date(Date.UTC(p.year, p.month, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Monday = 0
  const days = new Date(Date.UTC(p.year, p.month + 1, 0)).getUTCDate();
  const rows = Math.ceil((offset + days) / 7);
  const rowH = rows > 5 ? grid.row * 5 / 6 : grid.row;

  const PAGE = 1671 / 941; // page height in cqw, so row heights stay a share of the page
  /* the pearl heart frame: appended inside the wedding day's cell below, centred on it by CSS,
     so it is anchored to the date on every screen */
  const [hw, hh] = artSizes.heart;
  const heart = h('i', { class: 'heart-frame', 'aria-hidden': 'true' }, h('img', { src: 'assets/heart.webp', alt: '', width: hw, height: hh, loading: 'lazy', decoding: 'async' }));
  const table = h('div', { class: 'cal', role: 'grid', 'aria-label': `${cfg.months[p.month]} ${p.year}`, style: { '--rows': rows, '--head': `${grid.head * PAGE}cqw`, '--row': `${rowH * PAGE}cqw` } });
  const monthLine = txt(`${cfg.months[p.month]} ${p.year}`, { x: month.x, y: month.y, w: 50, size: month.size, cls: 'maroon display', lh: 1.2, delay: 0.45, anim: 'a-wipe' });
  const head = h('div', { class: 'cal-head', role: 'row' }, ...cfg.weekdays.map((d, i) => h('span', { role: 'columnheader', 'aria-label': cfg.weekdayNames[i] }, d)));
  table.append(head);
  let dayCell = null;
  for (let r = 0; r < rows; r++) {
    const row = h('div', { class: 'cal-row', role: 'row' });
    for (let c = 0; c < 7; c++) {
      const n = r * 7 + c - offset + 1;
      const cell = h('span', { role: 'gridcell' }, n >= 1 && n <= days ? String(n) : '');
      if (n === p.day) { cell.classList.add('the-day'); dayCell = cell; cell.append(heart); }
      row.append(cell);
    }
    table.append(row);
  }
  const gridEl = at(table, { x: grid.x, y: grid.y, w: grid.w, anchor: 'top', z: 5, delay: 0.5, cls: 'cal-wrap' });
  gridEl.style.height = `${grid.head + rowH * rows}%`;


  const label = `${marathiWeekday(ev.start, cfg)}, ${marathiDate(ev.start, cfg)}`;
  const dateLine = txt([marathiWeekday(ev.start, cfg), marathiDate(ev.start, cfg)], { x: date.x, y: date.y, w: 70, size: date.size, cls: 'maroon display', lh: 1.35, delay: 0 });
  dateLine.classList.add('date-line');

  const [bw, bh] = artSizes['btn-reveal'];
  const reveal = h('button', { class: 'img-btn reveal-btn', type: 'button', 'aria-controls': 'date-grid', 'aria-expanded': 'false', 'aria-label': cfg.revealLabel },
    h('img', { src: 'assets/btn-reveal.webp', alt: '', width: bw, height: bh, loading: 'lazy', decoding: 'async' }),
    h('span', { class: 'lbl', style: { fontSize: `${button.label}cqw` }, 'aria-hidden': 'true' }, cfg.revealLabel));
  const save = h('button', { class: 'pill', type: 'button', 'aria-label': cfg.saveLabel }, h('i', { class: 'ico', html: icon('calendar') }), h('span', {}, cfg.saveLabel));
  const buttons = h('div', { class: 'reveal-stack' }, reveal, save);
  const btnEl = at(buttons, { x: button.x, y: button.y, w: button.w, hit: true, delay: 0.35, z: 6, cls: 'a-soft' });
  table.id = 'date-grid';
  const live = h('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
  btnEl.append(live);

  let revealed = false;
  function open() {
    if (revealed) return; revealed = true;
    reveal.setAttribute('aria-expanded', 'true');
    buttons.classList.add('revealed');
    heart.classList.add('shown');
    if (dayCell) dayCell.classList.add('lit');
    dateLine.classList.add('shown');
    live.textContent = label;
    if (!reducedMotion()) gridEl.closest('.page')?.classList.add('glow');
  }
  reveal.addEventListener('click', open);
  save.addEventListener('click', () => saveEvent({
    title: `${ev.title} — ${couple}`, start: ev.start, end: ev.end,
    location: [ev.venue, ev.address].filter(Boolean).join(', '), details: '',
  }, ui.calendarDownloaded));

  return [monthLine, gridEl, dateLine, btnEl];
}
