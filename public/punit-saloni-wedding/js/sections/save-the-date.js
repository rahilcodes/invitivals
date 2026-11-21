/* SaveTheDateSection — right after the opening: a gold foil card the guest scratches (finger or mouse) to
   reveal the wedding date, with a "reveal" button for anyone who cannot scratch; then the wedding's own
   calendar entry. The full schedule, each event with its own entry, follows in the Festivities. */
import { Heading, Button, Kolam } from '../decor.js';
import { $, googleCalUrl, icsUrl, reducedMotion } from '../util.js';

export const SaveTheDateSection = (cfg) => {
  const main = cfg.events.find((e) => e.main);
  return `
<section class="sec save" id="save" aria-labelledby="save-h">
  <div class="sec-inner">
    ${Heading('Save the Date', 'Scratch the gold to reveal our wedding day', { id: 'save-h' })}
    <div class="save-wrap" data-reveal>
      ${Kolam('save-kolam')}
      <div class="scratch" id="scratch">
        <div class="scratch-under" aria-live="polite">
          <span class="scratch-day">14</span>
          <span class="scratch-month">December 2026</span>
          <i class="scratch-rule" aria-hidden="true"></i>
          <span class="scratch-wd">Monday · ${main.time}</span>
        </div>
        <canvas class="scratch-foil" aria-hidden="true"></canvas>
        <p class="scratch-hint" aria-hidden="true"><span>Scratch to Reveal</span><span>the Wedding Date</span></p>
      </div>
      <button type="button" class="scratch-btn" id="scratch-btn">Can’t scratch? Tap to reveal</button>
    </div>
    <div class="save-actions" data-reveal>
      ${Button({ label: 'Add to Google Calendar', icon: 'calendar', href: googleCalUrl(cfg, main), id: 'add-cal' })}
      <a class="save-ics" href="${icsUrl(main)}" download>Apple Calendar / Outlook: download .ics</a>
    </div>
  </div>
</section>`;
};

/* the menu's Calendar button opens the same Google entry */
export const weddingCalendar = (cfg) => googleCalUrl(cfg, cfg.events.find((e) => e.main));

export function initSaveTheDate() {
  const box = $('#scratch'), cv = box.querySelector('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
  let done = false, drawn = false, moves = 0, last = null, down = false;
  const reveal = () => {
    if (done) return; done = true;
    box.classList.add('is-revealed');
    $('#scratch-btn').hidden = true;
    if (navigator.vibrate && !reducedMotion()) try { navigator.vibrate(20); } catch { /* not allowed */ }
  };
  /* the foil: antique gold with a fine diagonal sheen and a maroon keyline, drawn at the card's real size */
  const paint = () => {
    const r = box.getBoundingClientRect(), k = Math.min(2, window.devicePixelRatio || 1);
    if (!r.width) return;
    cv.width = Math.round(r.width * k); cv.height = Math.round(r.height * k);
    const w = cv.width, h = cv.height;
    const g = cx.createLinearGradient(0, 0, w, h);
    [[0, '#7d5518'], [.22, '#b88932'], [.4, '#e3c584'], [.58, '#a87a2a'], [.76, '#d6b46c'], [1, '#7d5518']].forEach(([o, c]) => g.addColorStop(o, c));
    cx.globalCompositeOperation = 'source-over';
    cx.fillStyle = g; cx.fillRect(0, 0, w, h);
    cx.strokeStyle = 'rgba(255,240,200,.16)'; cx.lineWidth = k;
    for (let x = -h; x < w; x += 7 * k) { cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x + h, h); cx.stroke(); }
    cx.strokeStyle = 'rgba(101,21,34,.55)'; cx.lineWidth = 1.5 * k;
    cx.strokeRect(9 * k, 9 * k, w - 18 * k, h - 18 * k);
    drawn = true;
  };
  const pos = (ev) => { const r = cv.getBoundingClientRect(); return { x: (ev.clientX - r.left) / r.width * cv.width, y: (ev.clientY - r.top) / r.height * cv.height }; };
  /* share of the foil already scratched off, sampled on a coarse grid */
  const cleared = () => {
    const { width: w, height: h } = cv, d = cx.getImageData(0, 0, w, h).data;
    let n = 0, off = 0;
    for (let y = 4; y < h; y += 12) for (let x = 4; x < w; x += 12) { n++; if (d[(y * w + x) * 4 + 3] < 40) off++; }
    return n ? off / n : 0;
  };
  const rub = (ev) => {
    if (done) return;
    const p = pos(ev);
    cx.globalCompositeOperation = 'destination-out';
    cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.lineWidth = cv.width * 0.17;
    cx.beginPath(); cx.moveTo((last || p).x, (last || p).y); cx.lineTo(p.x + 0.1, p.y); cx.stroke();
    last = p;
    if (++moves % 6 === 0 && cleared() > 0.5) reveal();
  };
  cv.addEventListener('pointerdown', (ev) => {
    if (!drawn) paint();
    down = true; last = null; box.classList.add('is-scratching');
    try { cv.setPointerCapture(ev.pointerId); } catch { /* older browsers */ }
    rub(ev);
  });
  cv.addEventListener('pointermove', (ev) => { if (down) { ev.preventDefault(); rub(ev); } });
  /* kept easy: a third of the foil gone, or three strokes across it, and the rest falls away */
  let strokes = 0;
  const up = () => { if (!down) return; down = false; last = null; if (++strokes >= 3 || cleared() > 0.3) reveal(); };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  $('#scratch-btn').addEventListener('click', reveal);
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { paint(); o.disconnect(); } }).observe(box);
  window.addEventListener('resize', () => { if (!done && moves === 0) paint(); });
}
