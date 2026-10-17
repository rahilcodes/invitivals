/* ============================================================
   Ahmad & Layla · continuous scrollable invitation
   ============================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     EDIT HERE: dates, venues, music, dua delivery
     Weekday names are always computed from the date, so they can never disagree.
     ------------------------------------------------------------ */
  var CONFIG = {
    couple: 'Ahmad & Layla',
    utcOffset: '+05:30',                         // India Standard Time
    music: 'assets/audio/background.mp3',        // the only background song
    musicVolume: 0.4,                            // settles at about 40%
    musicEndVolume: 0.0,                         // fades down to this at the Qur'an ending
    mainEvent: 'shadi',                          // countdown, scratch date and calendar use this one
    venue: { name: 'XYZ Function Hall', address: 'Hyderabad, Telangana, India' },
    events: {
      // mapsUrl: paste the real Google Maps share link. While it is empty the button rests in a disabled state.
      // An event may override the shared venue with its own  venue: { name: '', address: '' }
      manje:   { title: 'Manje',   date: '2027-02-11', time: '17:00', hours: 4, mapsUrl: '' },
      sanchak: { title: 'Sanchak', date: '2027-02-12', time: '13:00', hours: 4, mapsUrl: '' },
      shadi:   { title: 'Shadi',   date: '2027-02-13', time: '18:00', hours: 5, mapsUrl: '' },
      valima:  { title: 'Valima',  date: '2027-02-14', time: '20:00', hours: 4, mapsUrl: '' }
    },
    dua: {
      endpoint: '',      // e.g. a Formspree / Google Apps Script URL. Receives JSON { dua, couple, sentAt }
      whatsapp: ''       // or a number in international format without "+", e.g. 923001234567
    }
  };

  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var doc = document, body = doc.body, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rand = function (a, b) { return a + Math.random() * (b - a); };

  /* ------------------------------------------------------------
     Dates
     ------------------------------------------------------------ */
  function parts(ev) {
    var d = ev.date.split('-').map(Number), t = ev.time.split(':').map(Number);
    return { y: d[0], m: d[1], d: d[2], hh: t[0], mm: t[1] };
  }
  function longDate(ev) {
    var p = parts(ev), wd = new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay();
    return DAYS[wd] + ', ' + p.d + ' ' + MONTHS[p.m - 1] + ' ' + p.y;
  }
  function clock(ev) {
    var p = parts(ev), h = p.hh % 12 || 12;
    return h + ':' + ('0' + p.mm).slice(-2) + ' ' + (p.hh < 12 ? 'AM' : 'PM') + ' Onwards';
  }
  function startMs(ev) { return Date.parse(ev.date + 'T' + ev.time + ':00' + CONFIG.utcOffset); }
  function utcStamp(ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function venueOf(ev) { return ev.venue || CONFIG.venue; }
  function venueLine(ev) { var v = venueOf(ev); return v.name + ', ' + v.address; }
  function safeMapsUrl(ev) {                     // only a real http(s) link from CONFIG is ever used; nothing is invented
    var u = (ev.mapsUrl || '').trim();
    return /^https?:\/\//i.test(u) ? u : '';
  }

  /* ------------------------------------------------------------
     --u = exactly 1% of the invitation column (keeps overlay type in scale with the artwork)
     ------------------------------------------------------------ */
  var column = $('#invitation');
  function setUnit() {
    var w = column.getBoundingClientRect().width;
    if (w > 0) root.style.setProperty('--u', (w / 100).toFixed(4) + 'px');
  }
  var hasCq = !!(window.CSS && CSS.supports && CSS.supports('width', '1cqw'));
  if (!hasCq) {                                   // modern browsers do this in pure CSS (container units)
    setUnit();
    if ('ResizeObserver' in window) new ResizeObserver(setUnit).observe(column);
    window.addEventListener('resize', setUnit);
    window.addEventListener('orientationchange', setUnit);
  }

  /* ------------------------------------------------------------
     Scroll lock that remembers the exact position (iOS-safe)
     ------------------------------------------------------------ */
  var lockCount = 0, lockedY = 0;
  function lockScroll() {
    if (lockCount++ > 0) return;
    lockedY = window.pageYOffset || root.scrollTop || 0;
    body.style.position = 'fixed';
    body.style.top = (-lockedY) + 'px';
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
  }
  function unlockScroll() {
    if (lockCount === 0) return;
    if (--lockCount > 0) return;
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    window.scrollTo(0, lockedY);          // instant: back to the very same pixel
  }

  /* ------------------------------------------------------------
     Image safety: no broken icons, no empty flashes
     ------------------------------------------------------------ */
  $$('.art > img').forEach(function (img) {
    var ready = function () { img.parentNode.classList.add('is-ready'); };
    img.addEventListener('load', ready);
    img.addEventListener('error', function () { img.classList.add('is-broken'); ready(); });
    if (img.complete && img.naturalWidth) ready();
  });
  function warm(list) {                    // fetch quietly, one after another
    var i = 0;
    (function next() {
      if (i >= list.length) return;
      var im = new Image();
      im.onload = im.onerror = next;
      im.src = list[i++];
    })();
  }
  function hydrateFnImages() {
    $$('.fn__page img[data-src]').forEach(function (img) {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    });
  }

  /* ------------------------------------------------------------
     Atmosphere (a few sparkles + supplied petal PNGs at two depths). Runs only while visible.
     ------------------------------------------------------------ */
  $$('.sec, .fn__page').forEach(function (sec) {
    if (reduceMotion) return;
    var art = $('.art', sec);
    var fx = doc.createElement('div'); fx.className = 'fx'; fx.setAttribute('aria-hidden', 'true');
    var topOnly = sec.hasAttribute('data-sparkle-top');
    var i, n = +sec.getAttribute('data-sparkles') || 0;
    for (i = 0; i < n; i++) {
      var s = doc.createElement('i'); s.className = 'spark';
      s.style.cssText = 'left:' + rand(4, 96).toFixed(1) + '%;top:' + rand(3, topOnly ? 42 : 97).toFixed(1) + '%;--sz:' + rand(.8, 1.9).toFixed(2) +
        ';--d:' + rand(2.8, 6).toFixed(1) + 's;--dl:-' + rand(0, 6).toFixed(1) + 's';
      fx.appendChild(s);
    }
    n = +sec.getAttribute('data-petals') || 0;
    for (i = 0; i < n; i++) {
      var near = i % 3 === 0;                                // every third petal is nearer the camera: larger, softer, quicker
      var lane = doc.createElement('i'); lane.className = 'petal-lane';
      var dur = near ? rand(15, 21) : rand(24, 36);
      lane.style.cssText = '--px:' + rand(6, 92).toFixed(1) + '%;--d:' + dur.toFixed(1) + 's;--dl:-' + rand(0, dur).toFixed(1) + 's';
      var p = doc.createElement('i'); p.className = 'petal';
      p.style.cssText = '--sz:' + (near ? rand(5.2, 6.4) : rand(2.6, 3.8)).toFixed(2) + ';--pb:' + (near ? '1.2px' : '0px') +
        ';--sd:' + rand(3.5, 6.5).toFixed(1) + 's;--dl:-' + rand(0, 5).toFixed(1) + 's';
      lane.appendChild(p); fx.appendChild(lane);
    }
    art.appendChild(fx);
  });

  /* ------------------------------------------------------------
     PAPER-CUT LAYERS  (see js/scenes.js)
     Every layer is cut live from the reference artwork, so the settled
     screen is the reference. Persistent layers sway / drift / parallax;
     entrance layers (curtains, props, lettering) play once and are removed.
     ------------------------------------------------------------ */
  var SCENES = window.SCENES || {};
  var motionOK = !reduceMotion;

  function cut(art, r, cls) {
    var W = +art.parentNode.style.getPropertyValue('--W'), H = +art.parentNode.style.getPropertyValue('--H');
    var el = doc.createElement('i');
    el.className = 'ly ' + cls;
    el.setAttribute('aria-hidden', 'true');
    el.style.setProperty('--x', r[0]); el.style.setProperty('--y', r[1]);
    el.style.setProperty('--w', r[2]); el.style.setProperty('--h', r[3]);
    el.style.backgroundSize = (W / r[2] * 100).toFixed(3) + '% ' + (H / r[3] * 100).toFixed(3) + '%';
    el.style.backgroundPosition = (W === r[2] ? 0 : r[0] / (W - r[2]) * 100).toFixed(3) + '% ' + (H === r[3] ? 0 : r[1] / (H - r[3]) * 100).toFixed(3) + '%';
    return el;
  }

  function buildPersistent(art, sc) {
    if (!motionOK || art.__persist) return;
    art.__persist = true;
    var first = art.querySelector('.glow') || null, add = function (el) { art.insertBefore(el, first); };
    (sc.para || []).forEach(function (r) { var el = cut(art, r, 'ly--para'); el.style.setProperty('--depth', r[4]); add(el); });
    (sc.sway || []).forEach(function (r) {
      var el = cut(art, r, 'ly--sway');
      el.style.setProperty('--ox', (r[4] * 100) + '%');
      el.style.setProperty('--oy', (r[7] ? -(r[7] / r[3]) * 100 : 0) + '%');
      el.style.setProperty('--a', r[5] + 'deg');
      el.style.setProperty('--d', r[6] + 's');
      el.style.setProperty('--dl', '-' + rand(0, r[6]).toFixed(2) + 's');
      add(el);
    });
    (sc.drift || []).forEach(function (r) { add(cut(art, r, 'ly--' + r[4])); });
    (sc.keep || []).forEach(function (r) { add(cut(art, r, 'ly--keep')); });
  }

  // entrance layers; returns the lettering blocks so the caller can time them
  function buildEntrance(art, sc) {
    $$('.ly--temp, .tx-patch', art).forEach(function (n) { n.parentNode.removeChild(n); });
    if (!motionOK) return [];
    var first = art.querySelector('.glow') || null, blocks = [];
    (sc.curtain || []).forEach(function (r) {
      var el = cut(art, r, 'ly--temp ly--curtain ly--curtain-' + r[4]);
      el.style.setProperty('--sc', r[5]); el.style.setProperty('--d', r[6] + 's');
      art.insertBefore(el, first);
    });
    (sc.settle || []).forEach(function (r) {
      var el = cut(art, r, 'ly--temp ly--settle');
      el.style.setProperty('--sc', r[4]);
      el.style.setProperty('--ox', (r[5] * 100) + '%'); el.style.setProperty('--oy', (r[6] * 100) + '%');
      el.style.setProperty('--d', r[7] + 's'); el.style.setProperty('--dl', r[8] + 's');
      art.insertBefore(el, first);
    });
    $$('.ly--curtain, .ly--settle', art).forEach(function (el) {
      el.addEventListener('animationend', function () { if (el.parentNode) el.parentNode.removeChild(el); });
    });
    (sc.text || []).forEach(function (t) {
      var p = t.p, patch = doc.createElement('i');
      patch.className = 'ly tx-patch ly--temp'; patch.setAttribute('aria-hidden', 'true');
      patch.style.cssText = '--x:' + p[0] + ';--y:' + p[1] + ';--w:' + p[2] + ';--h:' + p[3] + ';--c1:' + p[4] + ';--c2:' + p[5] + ';background-image:linear-gradient(' + p[4] + ',' + p[5] + ');-webkit-mask-image:none;mask-image:none';
      art.insertBefore(patch, first);
      var cuts = (t.cuts || [[p[0], p[1], p[2], p[3], 0, '']]).map(function (c) {
        var el = cut(art, c, 'ly--temp tx-cut' + (c[5] ? ' tx-cut--' + c[5] : ''));
        el.__delay = c[4] || 0; el.__long = !!c[5];
        art.appendChild(el);
        return el;
      });
      blocks.push({ y: p[1], patch: patch, cuts: cuts, html: null });
    });
    return blocks;
  }

  // plays a list of lettering blocks / live HTML lines one after another, top to bottom
  function playLettering(items, startMs) {
    var t = startMs;
    items.sort(function (a, b) { return a.y - b.y; }).forEach(function (it) {
      if (it.html) {
        it.html.style.setProperty('--dl', Math.round(t) + 'ms');
        it.html.classList.remove('on'); void it.html.offsetWidth; it.html.classList.add('on');
        t += 150;
        return;
      }
      var last = 0, long = false;
      it.cuts.forEach(function (el) {
        el.style.setProperty('--dl', Math.round(t + el.__delay) + 'ms');
        el.classList.add('on');
        last = Math.max(last, el.__delay); long = long || el.__long;
      });
      var total = t + last + (long ? 2700 : 1100);
      setTimeout(function () {                       // hand the pixels back to the untouched artwork
        [it.patch].concat(it.cuts).forEach(function (n) { n.style.transition = 'opacity .7s ease'; n.style.opacity = '0'; });
        setTimeout(function () { [it.patch].concat(it.cuts).forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); }); }, 800);
      }, total);
      t += last + (long ? 420 : 190);
    });
    return t;
  }

  function whenReady(art, fn) {
    if (art.classList.contains('is-ready')) { fn(); return; }
    var img = $('img', art), go = function () { img.removeEventListener('load', go); fn(); };
    img.addEventListener('load', go);
  }

  /* --- main scroll: section blends, blooms, layers ------------------ */
  var BLOOMS = {                                     // supplied PNG clusters that sit over each join, nearer the camera
    scratch:   { png: 'rose-a', side: 'left',  off: -5,  by: -17, bw: 42, bar: '330/320', clip: 'inset(11% 36% 0 0)', flip: false },
    functions: { png: 'rose-b', side: 'right', off: -9,  by: -20, bw: 40, bar: '310/310', clip: 'inset(14% 0 0 4%)',  flip: false },
    countdown: { png: 'rose-b', side: 'left',  off: -10, by: -19, bw: 40, bar: '310/310', clip: 'inset(14% 0 0 4%)',  flip: true },
    dua:       { png: 'rose-a', side: 'right', off: -6,  by: -18, bw: 40, bar: '330/320', clip: 'inset(11% 36% 0 0)', flip: true },
    quran:     { png: 'rose-b', side: 'left',  off: -10, by: -20, bw: 40, bar: '310/310', clip: 'inset(14% 0 0 4%)',  flip: true }
  };
  var secs = $$('.sec'), pendingText = [];
  secs.forEach(function (sec, i) {
    var art = $('.art', sec), img = $('img', art), sc = SCENES[sec.id] || {};
    art.style.setProperty('--img', 'url("' + img.src + '")');
    if (i > 0) {
      var lap = doc.createElement('i'); lap.className = 'lap'; lap.setAttribute('aria-hidden', 'true');
      lap.style.setProperty('--prev', 'url("' + $('img', secs[i - 1]).src + '")');
      art.appendChild(lap);
      var b = BLOOMS[sec.id];
      if (b) {
        var bloom = doc.createElement('div'); bloom.className = 'bloom'; bloom.setAttribute('aria-hidden', 'true');
        bloom.style.cssText = '--bw:' + b.bw + ';--by:' + b.by + ';--bar:' + b.bar + ';' + b.side + ':calc(var(--u) * ' + b.off + ')';
        bloom.innerHTML = '<i><b style="clip-path:' + b.clip + ';-webkit-clip-path:' + b.clip + ';background-image:url(assets/layers/' + b.png + '.png);' + (b.flip ? 'transform:scaleX(-1)' : '') + '"></b></i>';
        sec.appendChild(bloom);
      }
    }
    whenReady(art, function () {
      buildPersistent(art, sc);
      buildEntrance(art, sc).forEach(function (blk) { blk.sec = sec; pendingText.push(blk); if (textIO) textIO.observe(blk.patch); });
    });
  });

  // lettering plays when it is actually on screen (not merely when its tall section is)
  var scenesStarted = false, textIO = null, firstBatch = true;
  function revealBlocks(list) {
    var delay = firstBatch ? 1150 : 120;             // the very first batch waits for the velvet to part
    firstBatch = false;
    playLettering(list, delay);
  }
  if ('IntersectionObserver' in window && motionOK) {
    textIO = new IntersectionObserver(function (entries) {
      if (!scenesStarted) return;
      var batch = [];
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        textIO.unobserve(e.target);
        for (var k = 0; k < pendingText.length; k++) if (pendingText[k].patch === e.target) { batch.push(pendingText.splice(k, 1)[0]); break; }
      });
      if (batch.length) revealBlocks(batch);
    }, { rootMargin: '0px 0px -10% 0px', threshold: .3 });
  }

  var liveIO = null;
  function startScenes() {                           // called when the envelope opens
    if (scenesStarted) return;
    scenesStarted = true;
    if ('IntersectionObserver' in window) {
      liveIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          e.target.classList.toggle('is-live', e.isIntersecting);
          if (e.isIntersecting) e.target.classList.add('is-in');
        });
        queueParallax();
      }, { rootMargin: '12% 0px 12% 0px', threshold: 0 });
      secs.forEach(function (s) { liveIO.observe(s); });
      if (textIO) pendingText.forEach(function (b) { textIO.unobserve(b.patch); textIO.observe(b.patch); });

      var nearFunctions = new IntersectionObserver(function (entries, io) {
        if (entries.some(function (e) { return e.isIntersecting; })) { hydrateFnImages(); io.disconnect(); }
      }, { rootMargin: '150% 0px 150% 0px' });
      nearFunctions.observe($('#functions'));
    } else {
      body.classList.add('no-io');
      secs.forEach(function (s) { s.classList.add('is-live', 'is-in'); });
      $$('.ly--temp, .tx-patch').forEach(function (n) { n.parentNode.removeChild(n); });
      hydrateFnImages();
    }
    if (motionOK) flyButterfly();
  }
  if (!motionOK) body.classList.add('no-anim');

  /* --- scroll parallax: one rAF, only for sections on screen --------- */
  var paraQueued = false;
  function queueParallax() { if (!paraQueued && motionOK) { paraQueued = true; requestAnimationFrame(applyParallax); } }
  function applyParallax() {
    paraQueued = false;
    var vh = window.innerHeight || 1;
    secs.forEach(function (sec) {
      if (!sec.classList.contains('is-live')) return;
      var r = sec.getBoundingClientRect();
      var p = ((r.top + r.height / 2) - vh / 2) / vh;
      sec.style.setProperty('--p', Math.max(-1.6, Math.min(1.6, p)).toFixed(3));
    });
  }
  window.addEventListener('scroll', queueParallax, { passive: true });
  window.addEventListener('resize', queueParallax);

  /* --- the supplied butterfly PNG: one short, curved flight, then it lands on the painted one --- */
  function flyButterfly() {
    var art = $('#main .art');
    var f = doc.createElement('div'); f.className = 'fly'; f.setAttribute('aria-hidden', 'true');
    f.innerHTML = '<i></i>';
    art.appendChild(f);
    f.addEventListener('animationend', function (e) { if (e.target === f && f.parentNode) f.parentNode.removeChild(f); });
  }

  /* ------------------------------------------------------------
     Music + mute  (starts inside the wax-seal tap, settles near 40%, loops,
     never restarts between sections, fades away at the Qur'an ending)
     ------------------------------------------------------------ */
  var audio = null, muted = false, muteBtn = $('#muteBtn'), gainNode = null, audioCtx = null, vol = 0, volTarget = 0, volTimer = null;
  function applyVolume(v) {
    vol = Math.max(0, Math.min(1, v));
    if (gainNode) gainNode.gain.value = vol; else if (audio) { try { audio.volume = vol; } catch (e) {} }
  }
  function fadeTo(target, seconds) {
    volTarget = target;
    if (volTimer) clearInterval(volTimer);
    var step = Math.abs(target - vol) / Math.max(1, seconds * 1000 / 80);
    if (!step) return;
    volTimer = setInterval(function () {
      var d = volTarget - vol;
      if (Math.abs(d) <= step) { applyVolume(volTarget); clearInterval(volTimer); volTimer = null; return; }
      applyVolume(vol + (d > 0 ? step : -step));
    }, 80);
  }
  // Qur'an ending: once 40% of the final section is on screen the music bows out over ~5s;
  // scrolling back up brings it home. Checked on scroll as well as by the observer.
  var atEnding = false, quranSec = $('#quran');
  function checkEnding() {
    if (!audio || fnOpen) return;
    var r = quranSec.getBoundingClientRect(), vh = window.innerHeight || 1;
    var seen = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
    var ending = seen / Math.max(1, r.height) >= .4;
    if (ending === atEnding) return;                 // never disturbs the opening fade-in
    atEnding = ending;
    fadeTo(ending ? CONFIG.musicEndVolume : CONFIG.musicVolume, ending ? 5 : 2.5);
  }
  var musicOn = false;
  function playMusic() {                           // after the opening film
    musicOn = true;
    if (!audio) return;
    muteBtn.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { muteBtn.classList.add('is-shown'); }); });
    setTimeout(function () { muteBtn.classList.add('is-shown'); }, 400);   // even if animation frames are paused

    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    var p = audio.play();
    if (p && p.catch) p.catch(function () { setMuted(true); });
    fadeTo(CONFIG.musicVolume, 3.5);
  }
  function startMusic() {
    if (!CONFIG.music) return;
    try {
      audio = new Audio(encodeURI(CONFIG.music));
      audio.loop = true; audio.preload = 'auto';
      // iOS ignores audio.volume, so on http(s) the fade runs through a Web Audio gain node instead
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC && /^https?:$/.test(location.protocol)) {
        try {
          audioCtx = new AC();
          gainNode = audioCtx.createGain();
          audioCtx.createMediaElementSource(audio).connect(gainNode);
          gainNode.connect(audioCtx.destination);
          if (audioCtx.state === 'suspended') audioCtx.resume();
        } catch (e) { gainNode = null; }
      }
      applyVolume(0);
      var p = audio.play();                        // played and paused inside the tap so phones allow it later
      if (p && p.then) p.then(function () { if (!musicOn) audio.pause(); }, function () {});
      else audio.pause();
      audio.addEventListener('error', function () { muteBtn.hidden = true; });
    } catch (e) { audio = null; }

    if ('IntersectionObserver' in window) {          // Qur'an ending: the music bows out; scrolling back up brings it home
      new IntersectionObserver(checkEnding, { threshold: [0, .4] }).observe($('#quran'));
    }
    window.addEventListener('scroll', checkEnding, { passive: true });
    window.__music = function () {                   // read-only status, handy when checking the page
      return { src: audio && audio.src, paused: audio && audio.paused, loop: audio && audio.loop, time: audio && audio.currentTime, volume: +vol.toFixed(2), target: volTarget, muted: muted };
    };
  }
  function setMuted(m) {
    muted = m;
    muteBtn.classList.toggle('is-muted', m);
    muteBtn.setAttribute('aria-pressed', String(m));
    muteBtn.setAttribute('aria-label', m ? 'Play music' : 'Mute music');
    if (!audio) return;
    if (m) audio.pause();
    else {
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      var p = audio.play(); if (p && p.catch) p.catch(function () {});
    }
  }
  muteBtn.addEventListener('click', function () { setMuted(!muted); });
  doc.addEventListener('visibilitychange', function () {
    if (!audio || muted || !musicOn) return;
    if (doc.hidden) audio.pause(); else { var p = audio.play(); if (p && p.catch) p.catch(function () {}); }
  });

  /* ------------------------------------------------------------
     Sparkle burst helper
     ------------------------------------------------------------ */
  function burst(host, count, reach) {
    if (reduceMotion || !host) return;
    for (var i = 0; i < count; i++) {
      var d = doc.createElement('i'); d.className = 'burst-dot';
      var a = (Math.PI * 2 * i) / count + rand(-.3, .3), r = rand(reach * .45, reach);
      d.style.setProperty('--bx', (Math.cos(a) * r).toFixed(1) + 'px');
      d.style.setProperty('--by', (Math.sin(a) * r).toFixed(1) + 'px');
      d.style.animationDelay = rand(0, .18).toFixed(2) + 's';
      host.appendChild(d);
    }
    setTimeout(function () { host.innerHTML = ''; }, 1700);
  }

  /* ------------------------------------------------------------
     ENVELOPE
     ------------------------------------------------------------ */
  var envelope = $('#envelope'), opened = false;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  lockScroll();

  // The opening is the designer's film: tap → it plays with its own sound → its last frame
  // (the arch and the couple) dissolves into the same arch on the invitation, and the music fades in.
  var film = $('#introVideo'), skipBtn = $('#introSkip'), handedOff = false;
  function handOff() {
    if (handedOff) return; handedOff = true;
    if (film) { try { film.pause(); } catch (e) {} }
    envelope.classList.remove('is-playing');
    envelope.classList.add('is-leaving');
    body.classList.remove('is-sealed');
    body.classList.add('is-open');
    startScenes();                                  // layers, lettering and parallax come alive under the dissolve
    playMusic();
    setTimeout(function () {
      envelope.classList.add('is-gone');
      envelope.setAttribute('aria-hidden', 'true');
      if (film) { film.removeAttribute('src'); try { film.load(); } catch (e) {} }   // frees the decoder on phones
      unlockScroll();                               // normal document scrolling begins here
      window.scrollTo(0, 0);
      warm(['assets/screens/functions.jpg', 'assets/screens/countdown.jpg', 'assets/screens/dua.jpg', 'assets/screens/quran.jpg',
            'assets/screens/manje.jpg', 'assets/screens/sanchak.jpg', 'assets/screens/shadi.jpg', 'assets/screens/valima.jpg']);
    }, reduceMotion ? 300 : 1150);
  }
  function openEnvelope() {
    if (opened) return;
    opened = true;
    startMusic();                                   // inside the tap: unlocked now, heard after the film
    envelope.classList.add('is-opening');
    if (!film || reduceMotion) { handOff(); return; }
    film.addEventListener('ended', handOff);
    film.addEventListener('error', handOff);
    var stall = setTimeout(handOff, 16000);          // never strand a guest on a film that will not play
    film.addEventListener('ended', function () { clearTimeout(stall); });
    function playing() { envelope.classList.add('is-playing'); skipBtn.tabIndex = 0; }
    film.muted = false;
    var p = film.play();
    if (p && p.then) {
      p.then(playing, function () {                 // sound refused: play the film silently instead
        film.muted = true;
        var q = film.play();
        if (q && q.then) q.then(playing, handOff); else playing();
      });
    } else playing();
  }
  skipBtn.addEventListener('click', function (e) { e.stopPropagation(); handOff(); });
  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });

  /* ------------------------------------------------------------
     Event text (dates, venues, maps)
     ------------------------------------------------------------ */
  var main = CONFIG.events[CONFIG.mainEvent];
  $$('.fn__page').forEach(function (page) {
    var ev = CONFIG.events[page.getAttribute('data-fn')];
    if (!ev) return;
    var d = $('[data-date]', page), t = $('[data-time]', page), m = $('[data-maps]', page),
        vn = $('[data-venue-name]', page), va = $('[data-venue-addr]', page), v = venueOf(ev), url = safeMapsUrl(ev);
    if (d) d.textContent = longDate(ev);
    if (t) t.textContent = clock(ev);
    if (vn) vn.textContent = v.name;
    if (va) va.textContent = v.address;
    if (m) {
      if (url) {
        m.href = url;
        m.setAttribute('aria-label', 'View ' + v.name + ' on Google Maps');
      } else {                                      // no link configured yet: graceful resting state, nothing invented
        m.removeAttribute('href'); m.removeAttribute('target');
        m.classList.add('is-disabled');
        m.setAttribute('role', 'link'); m.setAttribute('aria-disabled', 'true'); m.tabIndex = -1;
        m.setAttribute('aria-label', 'Google Maps link for ' + v.name + ' will be added soon');
        m.title = 'Location link coming soon';
      }
    }
  });
  (function () {
    var p = parts(main);
    $('#ticketDate').textContent = ('0' + p.d).slice(-2) + ' · ' + ('0' + p.m).slice(-2) + ' · ' + p.y;
    $('#ticketFull').textContent = longDate(main);
  })();

  /* ------------------------------------------------------------
     SCRATCH CARD
     Vertical swipes still scroll the page (touch-action: pan-y); side-to-side strokes scratch.
     Coverage is tracked on a coarse grid, so it works from file:// too (no getImageData).
     ------------------------------------------------------------ */
  (function scratchCard() {
    var canvas = $('#scratchCanvas'), ticket = canvas.parentNode, art = $('#scratch .art > img');
    var ctx = canvas.getContext('2d');
    var CROP = { x: 122, y: 735, w: 658, h: 330 };          // ticket area inside scratch.jpg (900x1600)
    var GX = 24, GY = 12, cells = new Array(GX * GY), hit = 0, revealed = false, drawing = false, last = null, started = false;

    function paintCover() {
      if (started || revealed) return;                      // never repaint over a guest's scratches
      var r = canvas.getBoundingClientRect();
      if (!r.width) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.globalCompositeOperation = 'source-over';
      var ok = false;
      if (art.complete && art.naturalWidth) {
        try {
          var k = art.naturalWidth / 900;
          ctx.drawImage(art, CROP.x * k, CROP.y * k, CROP.w * k, CROP.h * k, 0, 0, canvas.width, canvas.height);
          ok = true;
        } catch (e) { ok = false; }
      }
      if (!ok) {                                            // graceful foil if the artwork is unavailable
        var g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        g.addColorStop(0, '#e6c48a'); g.addColorStop(.5, '#c99d5c'); g.addColorStop(1, '#ecd09a');
        ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#4a1019'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = '600 ' + Math.round(canvas.height * .1) + 'px Georgia, serif';
        ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);
      }
    }
    paintCover();
    art.addEventListener('load', paintCover);
    window.addEventListener('resize', paintCover);

    function pos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    }
    function mark(p) {
      var rad = 1.6, cx = p.x * GX, cy = p.y * GY;
      for (var gx = Math.max(0, Math.floor(cx - rad)); gx <= Math.min(GX - 1, Math.floor(cx + rad)); gx++) {
        for (var gy = Math.max(0, Math.floor(cy - rad)); gy <= Math.min(GY - 1, Math.floor(cy + rad)); gy++) {
          var i = gy * GX + gx;
          if (!cells[i]) { cells[i] = 1; hit++; }
        }
      }
    }
    function scratch(a, b) {
      var w = canvas.width, h = canvas.height;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.lineWidth = w * .12;
      ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w + .01, b.y * h + .01); ctx.stroke();
      var steps = Math.max(1, Math.ceil(Math.hypot((b.x - a.x) * GX, (b.y - a.y) * GY)));
      for (var s = 0; s <= steps; s++) mark({ x: a.x + (b.x - a.x) * s / steps, y: a.y + (b.y - a.y) * s / steps });
      if (!started) { started = true; ticket.classList.add('is-peek'); }
      if (hit / cells.length > .55) reveal();
    }
    function reveal() {
      if (revealed) return;
      revealed = true; drawing = false;
      ticket.classList.add('is-revealed');
      canvas.setAttribute('aria-hidden', 'true'); canvas.tabIndex = -1;
      burst($('.ticket__burst'), 16, ticket.getBoundingClientRect().width * .5);
      setTimeout(function () { canvas.style.display = 'none'; }, 1000);
    }

    canvas.addEventListener('pointerdown', function (e) {
      if (revealed || (e.pointerType === 'mouse' && e.button !== 0)) return;
      drawing = true; last = pos(e);
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
      scratch(last, last);
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = pos(e); scratch(last, p); last = p;
    });
    ['pointerup', 'pointercancel', 'pointerleave', 'lostpointercapture'].forEach(function (t) {
      canvas.addEventListener(t, function () { drawing = false; });   // a vertical pan simply ends the stroke
    });
    canvas.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ticket.classList.add('is-peek'); reveal(); }
    });
    canvas.addEventListener('dragstart', function (e) { e.preventDefault(); });
  })();

  /* ------------------------------------------------------------
     FUNCTION DETAIL overlay
     The invitation underneath is never reloaded or reset; Back returns to the same pixel.
     ------------------------------------------------------------ */
  var fn = $('#fnOverlay'), fnScroll = $('#fnScroll'), fnBack = $('#fnBack');
  var fnOpen = false, fnOpener = null, pushed = false;

  function openFn(name, opener) {
    var page = $('.fn__page[data-fn="' + name + '"]');
    if (!page || fnOpen) return;
    hydrateFnImages();
    $$('.fn__page').forEach(function (p) { p.classList.toggle('is-active', p === page); });
    fnOpen = true; fnOpener = opener || null;
    lockScroll();
    fnScroll.scrollTop = 0;
    fn.classList.add('is-open');
    fn.setAttribute('aria-hidden', 'false');
    fn.setAttribute('aria-label', CONFIG.events[name].title + ' details');
    try { history.pushState({ fn: name }, '', '#' + name); pushed = true; } catch (e) { pushed = false; }
    setTimeout(function () { try { fnBack.focus({ preventScroll: true }); } catch (e) {} }, 60);
    playFnScene(page, name);
  }

  // each opening replays the page's entrance: curtains part, props settle, lettering rises line by line
  function playFnScene(page, name) {
    var art = $('.art', page), img = $('img', art), sc = SCENES[name] || {};
    var rises = $$('.rise', page);
    rises.forEach(function (el) { el.classList.remove('on'); });
    page.classList.remove('is-in');
    whenReady(art, function () {
      if (!fnOpen || !page.classList.contains('is-active')) return;
      art.style.setProperty('--img', 'url("' + img.src + '")');
      buildPersistent(art, sc);
      var items = buildEntrance(art, sc);
      rises.forEach(function (el, i) {
        var ov = el.closest('.ov');
        items.push({ y: (+ov.style.getPropertyValue('--y') || 0) + i, html: el });
      });
      void page.offsetWidth;
      page.classList.add('is-in', 'is-live');
      if (motionOK) playLettering(items, sc.textDelay || 420);
    });
  }

  function closeFn() {
    if (!fnOpen) return;
    fnOpen = false;
    fn.classList.remove('is-open');
    fn.setAttribute('aria-hidden', 'true');
    setTimeout(function () { if (!fnOpen) $$('.fn__page').forEach(function (p) { p.classList.remove('is-live', 'is-in'); }); }, 500);
    unlockScroll();                                   // restores the exact scroll position
    if (fnOpener) { try { fnOpener.focus({ preventScroll: true }); } catch (e) {} }
    fnOpener = null;
  }
  function requestClose() {
    if (pushed) { pushed = false; try { history.back(); return; } catch (e) {} }
    closeFn();
  }
  $$('.hotspot--plaque').forEach(function (b) {
    b.addEventListener('click', function () { openFn(b.getAttribute('data-fn'), b); });
  });
  fnBack.addEventListener('click', requestClose);
  window.addEventListener('popstate', function () { pushed = false; closeFn(); });   // phone Back button works too
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && fnOpen) requestClose(); });
  if (location.hash) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }

  /* ------------------------------------------------------------
     COUNTDOWN
     ------------------------------------------------------------ */
  (function countdown() {
    var target = startMs(main);
    var el = { d: $('#cdDays'), h: $('#cdHours'), m: $('#cdMins'), s: $('#cdSecs') };
    var two = function (n) { return (n < 10 ? '0' : '') + n; };
    function tick() {
      var left = Math.max(0, target - Date.now()), sec = Math.floor(left / 1000);
      var d = Math.floor(sec / 86400);
      el.d.textContent = two(d);
      el.d.classList.toggle('is-long', d > 99);
      el.h.textContent = two(Math.floor(sec % 86400 / 3600));
      el.m.textContent = two(Math.floor(sec % 3600 / 60));
      el.s.textContent = two(sec % 60);
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ------------------------------------------------------------
     SAVE OUR DATE: Google / Apple (.ics) / Outlook
     ------------------------------------------------------------ */
  (function calendar() {
    var start = startMs(main), end = start + main.hours * 3600000;
    var title = CONFIG.couple + ' · ' + main.title;
    var details = 'Together with our families, you are warmly invited to our wedding celebrations.';
    var esc = function (s) { return String(s).replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n'); };

    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + utcStamp(start) + '-' + CONFIG.mainEvent + '@wedding-invitation',
      'DTSTAMP:' + utcStamp(Date.now()),
      'DTSTART:' + utcStamp(start),
      'DTEND:' + utcStamp(end),
      'SUMMARY:' + esc(title),
      'LOCATION:' + esc(venueLine(main)),
      'DESCRIPTION:' + esc(details),
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(title), 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');

    var icsHref = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
    try { if (window.Blob && window.URL && URL.createObjectURL) icsHref = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' })); } catch (e) {}
    ['#calSave', '#calApple'].forEach(function (id) {
      var a = $(id); a.href = icsHref; a.setAttribute('download', 'Ahmad-Layla-Wedding.ics');
    });

    $('#calGoogle').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(title) +
      '&dates=' + utcStamp(start) + '/' + utcStamp(end) +
      '&details=' + encodeURIComponent(details) +
      '&location=' + encodeURIComponent(venueLine(main));

    $('#calOutlook').href = 'https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent' +
      '&subject=' + encodeURIComponent(title) +
      '&startdt=' + encodeURIComponent(new Date(start).toISOString()) +
      '&enddt=' + encodeURIComponent(new Date(end).toISOString()) +
      '&body=' + encodeURIComponent(details) +
      '&location=' + encodeURIComponent(venueLine(main));
  })();

  /* ------------------------------------------------------------
     DUA
     ------------------------------------------------------------ */
  (function dua() {
    var form = $('#duaForm'), text = $('#duaText'), count = $('#duaCount'), msg = $('#duaMsg'),
        thanks = $('#duaThanks'), again = $('#duaAgain'), sending = false;

    function update() { count.textContent = text.value.length; if (msg.textContent) msg.textContent = ''; }
    text.addEventListener('input', update);

    function done() {
      sending = false;
      text.value = ''; update();
      text.hidden = true; thanks.hidden = false;
    }
    again.addEventListener('click', function () {
      thanks.hidden = true; text.hidden = false;
      try { text.focus({ preventScroll: true }); } catch (e) {}
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending || !thanks.hidden) return;
      var value = text.value.trim();
      if (!value) { msg.textContent = 'Please write a few words of dua first.'; try { text.focus({ preventScroll: true }); } catch (err) {} return; }
      var payload = { dua: value, couple: CONFIG.couple, sentAt: new Date().toISOString() };

      try {                                           // always keep a local copy
        var all = JSON.parse(localStorage.getItem('duas') || '[]'); all.push(payload);
        localStorage.setItem('duas', JSON.stringify(all));
      } catch (err) {}

      if (CONFIG.dua.endpoint && window.fetch) {
        sending = true; msg.textContent = 'Sending…';
        fetch(CONFIG.dua.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
          .then(function (r) { if (!r.ok) throw new Error('bad status'); done(); })
          .catch(function () { sending = false; msg.textContent = 'Could not send just now. Please try again.'; });
      } else if (CONFIG.dua.whatsapp) {
        window.open('https://wa.me/' + CONFIG.dua.whatsapp + '?text=' + encodeURIComponent('Dua for ' + CONFIG.couple + ':\n\n' + value), '_blank', 'noopener');
        done();
      } else {
        done();
      }
    });
  })();
})();
