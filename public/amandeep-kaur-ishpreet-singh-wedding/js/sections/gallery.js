/* GallerySection — "A Glimpse": illustrative artwork (not photographs of the
   couple) in a wide/square rhythm, and a "See more photos" button that opens
   a swipeable viewer with all of them. */
import { Heading, Button, Icon, RestingPetals } from '../decor.js';
import { $, $$, esc } from '../util.js';

const SHAPES = ['wide', 'square', 'square', 'wide'];

export const GallerySection = (cfg) => {
  const g = cfg.gallery;
  return `
<section class="section gallery" id="gallery">
  ${RestingPetals(8)}
  ${Heading(g.title, g.sub)}
  <div class="gal-grid" data-reveal>
    ${g.images.slice(0, 4).map((im, i) => `
      <button class="gal-item shape-${SHAPES[i]}" type="button" data-lb="${i}" aria-label="View: ${esc(im.alt)}">
        <img src="${im.src}" alt="${esc(im.alt)}" loading="lazy" decoding="async">
        <span class="gal-zoom" aria-hidden="true">${Icon('photos', 'ico ico-xs')}</span>
      </button>`).join('')}
  </div>
  <div class="gal-more" data-reveal>${Button({ label: `See All ${g.images.length} Photos`, icon: 'photos', cls: 'btn-primary', id: 'gal-more' })}</div>
  <p class="gal-note">${esc(g.note)}</p>
</section>`;
};

export function initGallery(cfg) {
  const imgs = cfg.gallery.images;
  const box = document.createElement('div');
  box.className = 'lightbox'; box.hidden = true;
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Gallery viewer');
  box.innerHTML = `
    <button class="lb-close" aria-label="Close">×</button>
    <button class="lb-nav lb-prev" aria-label="Previous">‹</button>
    <figure><img alt=""><figcaption></figcaption></figure>
    <button class="lb-nav lb-next" aria-label="Next">›</button>
    <p class="lb-count"></p>`;
  document.body.appendChild(box);
  const imgEl = $('img', box), cap = $('figcaption', box), count = $('.lb-count', box);
  let cur = 0, lastFocus;
  const show = (i) => {
    cur = (i + imgs.length) % imgs.length;
    imgEl.src = imgs[cur].src; imgEl.alt = imgs[cur].alt; cap.textContent = imgs[cur].alt;
    count.textContent = `${cur + 1} / ${imgs.length}`;
    // warm the neighbours so swiping feels instant
    [cur + 1, cur - 1].forEach((k) => { const p = new Image(); p.src = imgs[(k + imgs.length) % imgs.length].src; });
  };
  const open = (i) => { lastFocus = document.activeElement; show(i); box.hidden = false; requestAnimationFrame(() => { box.classList.add('is-on'); $('.lb-close', box).focus(); }); };
  const close = () => { box.classList.remove('is-on'); setTimeout(() => { box.hidden = true; lastFocus?.focus?.(); }, 350); };

  $$('.gal-item').forEach((b) => b.addEventListener('click', () => open(+b.dataset.lb)));
  $('#gal-more')?.addEventListener('click', () => open(4 < imgs.length ? 4 : 0));
  $('.lb-close', box).addEventListener('click', close);
  $('.lb-prev', box).addEventListener('click', () => show(cur - 1));
  $('.lb-next', box).addEventListener('click', () => show(cur + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
  // swipe between pictures on touch screens
  let x0 = null;
  box.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
  }, { passive: true });
}
