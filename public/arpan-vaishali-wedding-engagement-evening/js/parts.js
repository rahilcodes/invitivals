/* Pieces the client's page adds to the demo's engine (js/page.js):
   live()  words in a measured box, like page.js's textOr, for lines that never had reference lettering;
   sprAt() a demo picture in a box of another name (the same rule or heart, placed for different words);
   Page()  a page canvas by plate number with its own id, and optionally
           "tall": a detail page whose words flow below the plate's arch and may push the page longer than
                   the plate (the blurred plate behind the view continues the colours), or
           "crop": a page that shows only part of its plate (top/bottom fractions cut away), so an empty
                   stretch of artwork never sits between two pages. Boxes stay in % of the whole plate. */
import { h } from './util.js';
import { box } from './page.js';
import { art } from './art.js';

export function live(id, value, { size = 3.4, cls = 'serif', delay = 0, z = 3, wrap = true, lang = '', slow = false } = {}) {
  const lines = Array.isArray(value) ? value : [value];
  const el = h('div', { class: `s live reveal ${wrap ? 'wrap' : ''} ${slow ? 'slow' : ''} ${cls}`, style: { ...box(id), zIndex: z, fontSize: `${size}cqw`, '--d': `${delay}s` }, lang: lang || null });
  lines.forEach((l, i) => { if (i) el.append(h('br')); el.append(l); });
  return el;
}

export function sprAt(id, file, { delay = 0, z = 2, alt = '', still = false, cls = '' } = {}) {
  const el = h('div', { class: `s ${still ? '' : 'reveal'} ${cls}`, style: { ...box(id), zIndex: z, '--d': `${delay}s` } });
  el.append(h('img', { src: `assets/${file}.webp`, alt, decoding: 'async', draggable: 'false' }));
  return el;
}

export function Page(plate, overlays, { id, tall = false, flow = null, crop = null } = {}) {
  const [w, ph] = art[`plate${plate}`].px;
  const top = (crop && crop.top) || 0, bottom = (crop && crop.bottom) || 0, keep = 1 - top - bottom;
  const page = h('section', { class: `page ${tall ? 'tall' : ''}`, id, style: tall ? { '--plate-ratio': `${w} / ${ph}` } : { aspectRatio: `${w} / ${ph * keep}` }, 'data-page': id });
  const img = h('img', { class: 'plate', src: `assets/plate${plate}.webp`, alt: '', decoding: 'sync', width: w, height: ph });
  if (crop) Object.assign(img.style, { top: `${(-top / keep) * 100}%`, height: `${100 / keep}%`, bottom: 'auto' });
  // overlays wait for their plate, so a slow connection never shows them floating on an empty page
  const ready = () => page.classList.add('ready');
  img.addEventListener('load', ready); img.addEventListener('error', ready);
  if (img.complete) ready();
  page.append(img);
  for (const o of overlays) if (o) {
    // a tall page grows with its words, so its boxes are measured from the width (cqw), not the page's height
    if (tall) { o.style.top = `${(parseFloat(o.style.top) * ph) / w}cqw`; o.style.height = `${(parseFloat(o.style.height) * ph) / w}cqw`; }
    // a cropped page keeps its boxes in % of the whole plate: moved and stretched to the part that shows
    else if (crop && o.style.top) { o.style.top = `${(parseFloat(o.style.top) - top * 100) / keep}%`; o.style.height = `${parseFloat(o.style.height) / keep}%`; }
    page.append(o);
  }
  if (flow) page.append(flow);
  return page;
}
