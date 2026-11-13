/* DateReveal — screen 3. The pack's calendar frame (its printed November grid
   painted out) carries a live month grid for the configured event; the
   printed "तारीख उलगडा करा" button is the reveal: the pearl heart frame
   closes around the day, the weekday and date are written beneath the
   calendar, and the button gives way to a save-to-calendar pill. */
import { h, partsOf, marathiDate, marathiWeekday, saveEvent, reducedMotion } from './util.js';
import { art, at, txt } from './page.js';
import { icon } from './ornaments.js';
import { artSizes } from './art-sizes.js';

export function DateReveal(cfg, ev, couple, ui, { month, grid, button, date }) {
  /* grid: { x, y, w, head, row, cols } in percent of the page (y = top of the weekday row) */
  const p = partsOf(ev.start);
  const first = new Date(Date.UTC(p.year, p.month, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Monday = 0
  const days = new Date(Date.UTC(p.year, p.month + 1, 0)).getUTCDate();
  const rows = Math.ceil((offset + days) / 7);
  const rowH = rows > 5 ? grid.row * 5 / 6 : grid.row;

  const PAGE = 1671 / 941; // page height in cqw, so row heights stay a share of the page
  const table = h('div', { class: 'cal', role: 'grid', 'aria-label': `${cfg.months[p.month]} ${p.year}`, style: { '--rows': rows, '--head': `${grid.head * PAGE}cqw`, '--row': `${rowH * PAGE}cqw` } });
  const monthLine = txt(`${cfg.months[p.month]} ${p.year}`, { x: month.x, y: month.y, w: 50, size: month.size, cls: 'maroon display', lh: 1.2, delay: 0.45 });
  const head = h('div', { class: 'cal-head', role: 'row' }, ...cfg.weekdays.map((d, i) => h('span', { role: 'columnheader', 'aria-label': cfg.weekdayNames[i], lang: 'mr' }, d)));
  table.append(head);
  let dayCell = null;
  for (let r = 0; r < rows; r++) {
    const row = h('div', { class: 'cal-row', role: 'row' });
    for (let c = 0; c < 7; c++) {
      const n = r * 7 + c - offset + 1;
      const cell = h('span', { role: 'gridcell' }, n >= 1 && n <= days ? String(n) : '');
      if (n === p.day) { cell.classList.add('the-day'); dayCell = cell; }
      row.append(cell);
    }
    table.append(row);
  }
  const gridEl = at(table, { x: grid.x, y: grid.y, w: grid.w, anchor: 'top', z: 5, delay: 0.5, cls: 'cal-wrap' });
  gridEl.style.height = `${grid.head + rowH * rows}%`;

  /* the heart frame, centred on the day's cell: its position is computed from the grid geometry */
  const col = (p.day + offset - 1) % 7, row = Math.floor((p.day + offset - 1) / 7);
  const cx = grid.x - grid.w / 2 + grid.w * (col + 0.5) / 7;
  const cy = grid.y + grid.head + rowH * (row + 0.5) + 0.2;
  const heart = art('heart', { x: cx, y: cy, w: grid.w / 7 * 1.95, z: 4, reveal: false, cls: 'heart-frame' });

  const label = `${marathiWeekday(ev.start, cfg)}, ${marathiDate(ev.start, cfg)}`;
  const dateLine = txt([marathiWeekday(ev.start, cfg), marathiDate(ev.start, cfg)], { x: date.x, y: date.y, w: 70, size: date.size, cls: 'maroon display', lh: 1.3, delay: 0 });
  dateLine.classList.add('date-line');

  const [bw, bh] = artSizes['btn-reveal'];
  const reveal = h('button', { class: 'img-btn', type: 'button', 'aria-controls': 'date-grid', 'aria-expanded': 'false', 'aria-label': ui.revealLabel },
    h('img', { src: 'assets/btn-reveal.webp', alt: '', width: bw, height: bh, loading: 'lazy', decoding: 'async' }));
  const save = h('button', { class: 'pill', type: 'button', 'aria-label': cfg.saveLabel }, h('i', { class: 'ico', html: icon('calendar') }), h('span', { lang: 'mr' }, cfg.saveLabel));
  const buttons = h('div', { class: 'reveal-stack' }, reveal, save);
  const btnEl = at(buttons, { x: button.x, y: button.y, w: button.w, hit: true, delay: 0.35, z: 6 });
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

  return [monthLine, gridEl, heart, dateLine, btnEl];
}
