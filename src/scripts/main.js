/**
 * Wedding Luxe — the only JavaScript on the page.
 * Vanilla, dependency-free, a few KB. Reads its settings from the
 * #wl-data JSON blob rendered by index.astro (which reads wedding.config.ts).
 */

const cfg = JSON.parse(document.getElementById('wl-data').textContent);
const $ = (id) => document.getElementById(id);
const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Gold petal burst — celebratory particles (transform/opacity only) ──── */
function petalBurst(x, y, count = 24) {
  if (REDUCED_MOTION) return;
  const colors = ['var(--gold)', 'var(--goldSoft)', 'color-mix(in srgb, var(--gold) 55%, var(--bg))'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const w = 6 + Math.random() * 7;
    const shape = Math.random() < 0.5 ? '80% 10% 80% 10%' : '10% 80% 10% 80%';
    p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${w}px;height:${w * 1.45}px;` +
      `background:${colors[i % 3]};border-radius:${shape};pointer-events:none;z-index:80;will-change:transform,opacity`;
    document.body.appendChild(p);
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.6;
    const d = 70 + Math.random() * 130;
    const dx = Math.cos(a) * d;
    const dy = Math.sin(a) * d * 0.9 - 50;
    p.animate(
      [
        { transform: 'translate(-50%,-50%) rotate(0deg) scale(1)', opacity: 1 },
        {
          transform: `translate(calc(-50% + ${dx.toFixed(0)}px), calc(-50% + ${(dy + 40).toFixed(0)}px)) ` +
            `rotate(${((Math.random() * 360 - 180) | 0)}deg) scale(${(0.5 + Math.random() * 0.5).toFixed(2)})`,
          opacity: 0,
        },
      ],
      { duration: 800 + Math.random() * 700, easing: 'cubic-bezier(.16,.61,.36,1)' }
    ).onfinish = () => p.remove();
  }
}
const centerOf = (el) => {
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
};

/* ── Scroll-reveal fallback ─────────────────────────────────────────────────
   Browsers with `animation-timeline: view()` run every reveal in pure CSS.
   Everyone else gets an IntersectionObserver that adds `.in`. */
if (!CSS.supports('animation-timeline: view()')) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  document
    .querySelectorAll('.rv-rise,.rv-fade,.rv-mask,.rv-l,.rv-r,.rv-zoom,.rv-grow')
    .forEach((el) => io.observe(el));
}

/* ── Music ──────────────────────────────────────────────────────────────────
   Autoplay is browser-blocked; the "Open Invitation" tap is the unlock.
   'generative': a soft ambient score synthesised with WebAudio — an A-major
   pad (110/165/220 Hz) plus random pentatonic plucks through a feedback
   delay. No audio file, nothing to license.
   'file': lazily creates a looping <audio> from the configured MP3. */
const music = {
  started: false,
  muted: true,
  actx: null,
  audioEl: null,
  noteTimer: null,
  analyser: null,
  raf: 0,

  start() {
    if (this.started) return;
    this.started = true;
    this.muted = false;
    if (cfg.music.mode === 'file' && cfg.music.src) {
      this.audioEl = new Audio(cfg.music.src);
      this.audioEl.loop = true;
      this.audioEl.volume = cfg.music.volume ?? 0.6;
      // Route through an analyser so the equalizer bars follow the track
      try {
        const C = new (window.AudioContext || window.webkitAudioContext)();
        this.actx = C;
        const src = C.createMediaElementSource(this.audioEl);
        this.analyser = C.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.82;
        src.connect(this.analyser);
        this.analyser.connect(C.destination);
        C.resume();
      } catch {
        /* analyser unavailable — audio still plays directly */
      }
      this.audioEl.play().catch(() => {});
    } else {
      this.startGenerative();
      if (this.actx) this.actx.resume();
    }
    this.startBars();
    this.paint();
  },

  startGenerative() {
    try {
      const C = new (window.AudioContext || window.webkitAudioContext)();
      this.actx = C;
      const master = C.createGain();
      master.gain.value = 0.055;
      master.connect(C.destination);

      // Tap the master bus so the equalizer bars follow the real audio
      this.analyser = C.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.82;
      master.connect(this.analyser);

      const delay = C.createDelay(1);
      delay.delayTime.value = 0.42;
      const fb = C.createGain();
      fb.gain.value = 0.38;
      const wet = C.createGain();
      wet.gain.value = 0.5;
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(wet);
      wet.connect(master);

      // soft pad
      const padG = C.createGain();
      padG.gain.value = 0.16;
      padG.connect(master);
      [110, 164.81, 220].forEach((f) => {
        const o = C.createOscillator();
        o.type = 'sine';
        o.frequency.value = f;
        const g = C.createGain();
        g.gain.value = 0.33;
        o.connect(g);
        g.connect(padG);
        o.start();
      });
      const lfo = C.createOscillator();
      lfo.frequency.value = 0.07;
      const lg = C.createGain();
      lg.gain.value = 0.08;
      lfo.connect(lg);
      lg.connect(padG.gain);
      lfo.start();

      // gentle plucks — A major pentatonic, high register
      const notes = [440, 493.88, 554.37, 659.25, 739.99, 880];
      const pluck = () => {
        if (!this.actx) return;
        if (this.muted) {
          this.noteTimer = setTimeout(pluck, 1400);
          return;
        }
        const o = C.createOscillator();
        o.type = 'sine';
        o.frequency.value = notes[Math.floor(Math.random() * notes.length)];
        const g = C.createGain();
        g.gain.setValueAtTime(0, C.currentTime);
        g.gain.linearRampToValueAtTime(0.28, C.currentTime + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, C.currentTime + 2.8);
        o.connect(g);
        g.connect(master);
        g.connect(delay);
        o.start();
        o.stop(C.currentTime + 3);
        this.noteTimer = setTimeout(pluck, 900 + Math.random() * 1600);
      };
      pluck();
    } catch {
      /* audio unsupported — stay silent */
    }
  },

  toggle() {
    if (!this.started) {
      this.start();
      return;
    }
    this.muted = !this.muted;
    if (this.actx) this.muted ? this.actx.suspend() : this.actx.resume();
    if (this.audioEl) this.muted ? this.audioEl.pause() : this.audioEl.play().catch(() => {});
    this.muted ? this.stopBars() : this.startBars();
    this.paint();
  },

  /* Drive the three equalizer bars from live frequency data */
  startBars() {
    if (this.raf || !this.analyser || REDUCED_MOTION) return;
    const btn = $('wl-music');
    if (!btn) return;
    const bars = btn.querySelectorAll('span');
    if (bars.length < 3) return;
    btn.classList.add('is-live');
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    const bands = [
      [0, 2], // pad fundamentals
      [2, 6], // plucks
      [6, 14], // sparkle / delay tails
    ];
    const loop = () => {
      this.analyser.getByteFrequencyData(data);
      bands.forEach(([a, b], i) => {
        let sum = 0;
        for (let k = a; k < b; k++) sum += data[k];
        const v = sum / (b - a) / 255;
        const scale = Math.min(1.15, 0.25 + v * 1.2);
        bars[i].style.transform = `scaleY(${scale.toFixed(3)})`;
      });
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  },

  stopBars() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    const btn = $('wl-music');
    if (!btn) return;
    btn.classList.remove('is-live');
    btn.querySelectorAll('span').forEach((b) => (b.style.transform = ''));
  },

  paint() {
    const btn = $('wl-music');
    if (!btn) return;
    btn.classList.toggle('is-muted', this.muted);
    btn.setAttribute('aria-pressed', String(!this.muted));
  },
};

$('wl-music')?.addEventListener('click', () => music.toggle());

/* ── Envelope intro — parts like double doors along a gold seam ────────── */
const intro = $('wl-intro');
if (intro) {
  document.body.classList.add('intro-locked');
  $('wl-open')?.addEventListener('click', () => {
    music.start();
    intro.classList.add('closing');
    document.body.classList.remove('intro-locked');
    setTimeout(() => intro.remove(), 1800);
  });
}

/* ── Personalized invitation — share links as yoursite.com/?to=Guest+Name ─
   The envelope addresses the guest by name and their RSVP is pre-filled. */
const guestName = (new URLSearchParams(location.search).get('to') || '').trim().slice(0, 60);
if (guestName) {
  const dear = $('wl-dear');
  if (dear) {
    $('wl-dear-name').textContent = guestName;
    dear.hidden = false;
  }
  const nameInput = $('wl-rsvp-name');
  if (nameInput && !nameInput.value) nameInput.value = guestName;
}

/* ── Countdown — live to the config date, zero-padded, freezes at 00 ───── */
const target = new Date(cfg.datetime).getTime();
const digits = { dd: $('wl-dd'), hh: $('wl-hh'), mm: $('wl-mm'), ss: $('wl-ss') };
let countdownTimer;

function tick() {
  if (!digits.dd) return;
  const t = target - Date.now();
  const pad = (n) => String(n).padStart(2, '0');
  if (t <= 0) {
    digits.dd.textContent = digits.hh.textContent = digits.mm.textContent = digits.ss.textContent = '00';
    clearInterval(countdownTimer);
    return;
  }
  digits.dd.textContent = pad(Math.floor(t / 864e5));
  digits.hh.textContent = pad(Math.floor(t / 36e5) % 24);
  digits.mm.textContent = pad(Math.floor(t / 6e4) % 60);
  digits.ss.textContent = pad(Math.floor(t / 1e3) % 60);
}
if (digits.dd) {
  tick();
  countdownTimer = setInterval(tick, 1000);
}

/* ── Endpoint helper — Google Apps Script or generic JSON webhook ──────── */
function post(url, type, payload) {
  if (!url) return;
  try {
    if (type === 'apps-script') {
      // Apps Script web apps accept form posts without CORS preflight.
      fetch(url, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(payload) }).catch(() => {});
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  } catch {
    /* fire-and-forget */
  }
}

/* ── RSVP ──────────────────────────────────────────────────────────────── */
const rsvpForm = $('wl-rsvp-form');
if (rsvpForm) {
  let attending = 'yes';
  let guests = 2;

  const yes = $('wl-rsvp-yes');
  const no = $('wl-rsvp-no');
  const count = $('wl-guests');

  const paintChoice = () => {
    yes.classList.toggle('selected', attending === 'yes');
    no.classList.toggle('selected', attending === 'no');
    yes.setAttribute('aria-pressed', String(attending === 'yes'));
    no.setAttribute('aria-pressed', String(attending === 'no'));
  };
  yes.addEventListener('click', () => {
    const first = attending !== 'yes';
    attending = 'yes';
    paintChoice();
    if (first) petalBurst(...centerOf(yes), 10);
  });
  no.addEventListener('click', () => { attending = 'no'; paintChoice(); });

  $('wl-guests-minus').addEventListener('click', () => {
    guests = Math.max(1, guests - 1);
    count.textContent = guests;
  });
  $('wl-guests-plus').addEventListener('click', () => {
    guests = Math.min(cfg.rsvp.maxGuests, guests + 1);
    count.textContent = guests;
  });

  const done = $('wl-rsvp-done');
  const thanksTitle = $('wl-rsvp-thanks-title');
  const thanksBody = $('wl-rsvp-thanks-body');

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('wl-rsvp-name');
    if (!name.value.trim()) {
      name.setAttribute('aria-invalid', 'true');
      name.focus();
      return;
    }
    name.removeAttribute('aria-invalid');

    post(cfg.rsvp.endpoint, cfg.rsvp.endpointType, {
      form: 'rsvp',
      name: name.value.trim(),
      contact: $('wl-rsvp-contact').value.trim(),
      attending,
      guests: String(guests),
      notes: $('wl-rsvp-notes').value.trim(),
      submittedAt: new Date().toISOString(),
    });

    const accepted = attending === 'yes';
    thanksTitle.textContent = accepted ? cfg.rsvp.thanks.acceptTitle : cfg.rsvp.thanks.declineTitle;
    thanksBody.textContent = (accepted ? cfg.rsvp.thanks.acceptBody : cfg.rsvp.thanks.declineBody)
      .replaceAll('{count}', String(guests))
      .replaceAll('{guests}', guests === 1 ? 'guest' : 'guests');

    rsvpForm.hidden = true;
    done.hidden = false;
    thanksTitle.focus();
    if (accepted) {
      const [x, y] = centerOf(done);
      petalBurst(x, y, 26);
      setTimeout(() => petalBurst(x, y - 30, 14), 260);
    }
  });

  $('wl-rsvp-reset').addEventListener('click', () => {
    done.hidden = true;
    rsvpForm.hidden = false;
    $('wl-rsvp-name').focus();
  });
}

/* ── Guest wishes ──────────────────────────────────────────────────────── */
const wishForm = $('wl-wish-form');
if (wishForm) {
  const list = $('wl-wish-list');
  const input = $('wl-wish-input');
  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) {
      input.focus();
      return;
    }

    post(cfg.guestbookEndpoint, cfg.rsvp.endpointType, {
      form: 'wish',
      message: text,
      submittedAt: new Date().toISOString(),
    });

    const card = document.createElement('div');
    card.className = list.children.length % 2 === 1 ? 'card indent' : 'card';
    const p = document.createElement('p');
    p.textContent = `“${text}”`;
    const who = document.createElement('div');
    who.className = 'who';
    who.textContent = cfg.wishes.newWishLabel;
    card.append(p, who);
    // Match the section's scoped-style hashes so the new card is styled
    const ref = list.querySelector('.card');
    if (ref) {
      for (const attr of ref.getAttributeNames()) {
        if (attr.startsWith('data-astro-cid')) {
          card.setAttribute(attr, '');
          p.setAttribute(attr, '');
          who.setAttribute(attr, '');
        }
      }
    }
    list.appendChild(card);
    input.value = '';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* ── Share — navigator.share with clipboard fallback ───────────────────── */
const shareBtn = $('wl-share');
if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    const data = { title: cfg.share.title, text: cfg.share.text, url: location.href };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(location.href);
        const prev = shareBtn.textContent;
        shareBtn.textContent = 'Link copied';
        setTimeout(() => (shareBtn.textContent = prev), 2000);
      }
    } catch {
      /* user dismissed the share sheet */
    }
  });
}

/* ── Film lightbox ─────────────────────────────────────────────────────── */
const playBtn = $('wl-play');
const lightbox = $('wl-lightbox');
if (playBtn && lightbox) {
  const stage = $('wl-lightbox-stage');
  const open = () => {
    const kind = playBtn.dataset.kind;
    const src = playBtn.dataset.src;
    if (kind === 'iframe') {
      const f = document.createElement('iframe');
      f.src = src;
      f.allow = 'autoplay; fullscreen; picture-in-picture';
      f.allowFullscreen = true;
      f.title = 'Our film';
      stage.appendChild(f);
    } else {
      const v = document.createElement('video');
      v.src = src;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      stage.appendChild(v);
    }
    if (music.started && !music.muted) music.toggle(); // duck the score for the film
    lightbox.showModal();
  };
  const clear = () => {
    stage.innerHTML = ''; // removing the element stops playback
  };
  const close = () => {
    if (lightbox.open) lightbox.close();
    clear();
  };
  playBtn.addEventListener('click', open);
  $('wl-lightbox-close').addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  // Esc and any other native close path
  lightbox.addEventListener('close', clear);
  lightbox.addEventListener('cancel', clear);
}

/* ── Gallery lightbox — tap to view, arrows / keyboard / swipe to browse ── */
const galLb = $('wl-gal-lightbox');
if (galLb) {
  const imgs = [];
  const imgEl = $('wl-gal-img');
  const cap = $('wl-gal-caption');
  const cnt = $('wl-gal-count');
  let cur = 0;

  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    imgEl.src = imgs[cur].src;
    imgEl.alt = imgs[cur].alt;
    cap.textContent = imgs[cur].alt;
    cnt.textContent = `${cur + 1} / ${imgs.length}`;
    if (!galLb.open) galLb.showModal();
  }

  document.querySelectorAll('[data-gal-index]').forEach((btn) => {
    const img = btn.querySelector('img');
    if (!img) {
      btn.disabled = true; // placeholder slot — nothing to view yet
      return;
    }
    const idx = imgs.push({ src: img.currentSrc || img.src, alt: img.alt }) - 1;
    btn.addEventListener('click', () => show(idx));
  });

  if (imgs.length) {
    $('wl-gal-prev').addEventListener('click', () => show(cur - 1));
    $('wl-gal-next').addEventListener('click', () => show(cur + 1));
    galLb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    galLb.addEventListener('click', (e) => {
      if (e.target === galLb) galLb.close();
    });
    $('wl-gal-close').addEventListener('click', () => galLb.close());

    // swipe
    let downX = null;
    galLb.addEventListener('pointerdown', (e) => (downX = e.clientX));
    galLb.addEventListener('pointerup', (e) => {
      if (downX === null) return;
      const dx = e.clientX - downX;
      downX = null;
      if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    });
  }
}
