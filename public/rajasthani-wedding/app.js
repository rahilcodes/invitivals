/* Rajasthani wedding invitation — behaviour
   opening video → hero, fullscreen on the tap, scroll reveals, in-page
   navigation, maps / calendar / contact links from config.js */
(function () {
  'use strict';
  var cfg = window.INVITE || {};
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- opening ---------- */
  var open = document.getElementById('open');
  var vid = document.getElementById('vid');
  var tap = document.getElementById('tap');
  var skip = document.getElementById('skip');
  var hero = document.getElementById('hero');
  var opened = false, finished = false, fsAsked = false;

  function finish() {
    if (finished) return;
    finished = true;
    try { vid.pause(); } catch (e) {}
    open.classList.add('done');
    document.body.classList.remove('locked');
    hero.classList.add('in');
    setTimeout(function () { open.classList.add('gone'); }, 1400);
  }

  function requestFullscreen() {
    if (fsAsked) return;
    fsAsked = true;
    var el = document.documentElement;
    var fn = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!fn) return;
    try {
      var p = fn.call(el, { navigationUI: 'hide' });
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  function startVideo() {
    if (opened) return;
    opened = true;
    requestFullscreen();                     // directly inside the gesture
    if (reduce) { finish(); return; }
    var guard = setTimeout(function () { if (!open.classList.contains('playing')) finish(); }, 4000);
    vid.addEventListener('ended', finish);
    vid.addEventListener('error', finish);
    vid.addEventListener('stalled', function () { if (vid.currentTime === 0) finish(); });
    var p;
    try { p = vid.play(); } catch (e) { finish(); return; }
    var onPlaying = function () { clearTimeout(guard); open.classList.add('playing'); };
    vid.addEventListener('playing', onPlaying, { once: true });
    if (p && p.catch) p.catch(function () { clearTimeout(guard); finish(); });
  }

  tap.addEventListener('click', startVideo);
  tap.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startVideo(); } });
  skip.addEventListener('click', finish);
  // Fade the last frame into the hero a touch before the clip ends (no black gap)
  vid.addEventListener('timeupdate', function () {
    if (vid.duration && vid.duration - vid.currentTime < 0.35) finish();
  });

  /* ---------- scroll reveals ---------- */
  var plates = document.querySelectorAll('.plate');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    plates.forEach(function (p) { if (p !== hero) io.observe(p); });
  } else {
    plates.forEach(function (p) { p.classList.add('in'); });
  }

  /* ---------- in-page navigation ---------- */
  document.querySelectorAll('[data-goto]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('data-goto'));
      if (!target) return;
      e.preventDefault();
      target.classList.add('in');
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', a.getAttribute('data-goto'));
    });
  });

  /* ---------- links from config ---------- */
  function mapsUrl(q) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q); }
  document.querySelectorAll('[data-map]').forEach(function (a) {
    var key = a.getAttribute('data-map');
    var q = key === 'main' ? cfg.venue : (cfg.maps || {})[key];
    if (q) a.href = mapsUrl(q); else disable(a);
  });

  function disable(a) {
    a.removeAttribute('href');
    a.removeAttribute('target');
    a.setAttribute('aria-disabled', 'true');
    a.classList.add('dead');
    a.addEventListener('click', function (e) { e.preventDefault(); });
  }
  var digits = function (s) { return String(s || '').replace(/\D/g, ''); };
  var c = {
    phone: cfg.phone ? 'tel:+' + digits(cfg.phone) : '',
    whatsapp: cfg.whatsapp ? 'https://wa.me/' + digits(cfg.whatsapp) : '',
    email: cfg.email ? 'mailto:' + cfg.email : '',
    location: cfg.venue ? mapsUrl(cfg.venue) : ''
  };
  document.querySelectorAll('[data-contact]').forEach(function (a) {
    var href = c[a.getAttribute('data-contact')];
    if (href) a.href = href; else disable(a);
  });
  var rsvp = document.getElementById('rsvpBtn');
  if (cfg.whatsapp) rsvp.href = 'https://wa.me/' + digits(cfg.whatsapp) + '?text=' + encodeURIComponent(cfg.rsvpMessage || '');
  else disable(rsvp);
  if (!cfg.phone || !cfg.whatsapp || !cfg.email) console.info('rajasthani-wedding: contact details missing in config.js (phone / whatsapp / email)');

  /* ---------- keep place on fullscreen exit / rotation ---------- */
  var lastY = 0;
  window.addEventListener('scroll', function () { lastY = window.scrollY; }, { passive: true });
  document.addEventListener('fullscreenchange', function () {
    var y = lastY; requestAnimationFrame(function () { window.scrollTo(0, y); });
  });
})();
