/* GallerySection — editorial layout: an arch-topped lead image, then offset pairs and wide plates.
   Tap opens a quiet full-screen viewer. */
import { Heading, FloralVine, Icon } from '../decor.js';
import { $, $$ } from '../util.js';

export const GallerySection = (cfg) => `
<section class="sec gallery" id="gallery" aria-labelledby="gallery-h">
  ${FloralVine({ side: 'r', top: '-80px', height: '600px', crop: 40, depth: 0.05 })}
  <div class="sec-inner wide">
    ${Heading('Moments', 'Glimpses we will treasure forever', { id: 'gallery-h' })}
    <div class="plates">
      ${cfg.gallery.map((g, i) => `
        <button class="plate plate-${g.shape}" type="button" data-index="${i}" data-reveal aria-label="View photo: ${g.alt}">
          <img src="${g.src}" alt="${g.alt}" loading="lazy" decoding="async">
        </button>`).join('')}
    </div>
  </div>
  <div class="viewer" id="viewer" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
    <button class="viewer-close" type="button" aria-label="Close">×</button>
    <button class="viewer-nav prev" type="button" aria-label="Previous photo">${Icon('arrow')}</button>
    <img class="viewer-img" alt="">
    <button class="viewer-nav next" type="button" aria-label="Next photo">${Icon('arrow')}</button>
    <p class="viewer-cap"></p>
    <p class="viewer-count" aria-live="polite"></p>
  </div>
</section>`;

export function initGallery(cfg) {
  const viewer = $('#viewer');
  const img = $('.viewer-img', viewer);
  const cap = $('.viewer-cap', viewer);
  const count = $('.viewer-count', viewer);
  let i = 0, x0 = null, lastFocus = null;
  viewer.classList.toggle('is-single', cfg.gallery.length < 2);
  const show = (n) => {
    i = (n + cfg.gallery.length) % cfg.gallery.length;
    img.src = cfg.gallery[i].src;
    img.alt = cap.textContent = cfg.gallery[i].alt;
    count.textContent = `${i + 1} / ${cfg.gallery.length}`;
  };
  const open = (n) => {
    lastFocus = document.activeElement;
    show(n); viewer.hidden = false;
    requestAnimationFrame(() => viewer.classList.add('is-on'));
    document.documentElement.classList.add('no-scroll');
    $('.viewer-close', viewer).focus();
  };
  const close = () => {
    viewer.classList.remove('is-on');
    document.documentElement.classList.remove('no-scroll');
    setTimeout(() => { viewer.hidden = true; }, 350);
    lastFocus?.focus();
  };
  $$('.plate').forEach((p) => p.addEventListener('click', () => open(+p.dataset.index)));
  $('.viewer-close', viewer).addEventListener('click', close);
  $('.prev', viewer).addEventListener('click', () => show(i - 1));
  $('.next', viewer).addEventListener('click', () => show(i + 1));
  viewer.addEventListener('click', (e) => { if (e.target === viewer) close(); });
  document.addEventListener('keydown', (e) => {
    if (viewer.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(i + 1);
    if (e.key === 'ArrowLeft') show(i - 1);
  });
  viewer.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}
