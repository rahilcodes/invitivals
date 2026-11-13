/* ─────────────────────────────────────────────────────────────────────────────
   Bengali wedding — runs the page: the tap that plays the intro film (with
   sound, fullscreen where allowed) and fades its last frame into the hero; the
   words from config; the lifted wording and hanging pieces of each page (assets/fx); the five function
   pages and the Our Functions view; the
   scratch-to-reveal date; maps and calendar; music; RSVP and contact.
   ───────────────────────────────────────────────────────────────────────────── */
import { invite as C } from '../config.js?v=7';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const opening = $('#opening'), film = $('#film'), tap = $('#tap'), skip = $('#skip'), mute = $('#mute'), stage = $('#stage');
const ANIM = '.rise, .drop, .pop, .tilt, .swing, .develop, .glow, .lift, .sway';
/* the lifted words wait hidden for their entrance only once this script runs: if it never does, they simply show */
document.documentElement.classList.add('anim');
if (!('IntersectionObserver' in window)) document.documentElement.classList.remove('anim');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const lines = (v) => (Array.isArray(v) ? v.map(esc).join('<br>') : esc(v));
const get = (k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), C);

/* ── words from config ── */
for (const el of $$('[data-t]')) { const v = get(el.dataset.t); if (v != null) el.innerHTML = lines(v); }

/* ── container units: phones without them get the same sizes from the stage's width ── */
if (!(window.CSS && CSS.supports && CSS.supports('width', '1cqw'))) {
  const cq = () => { const v = (stage.getBoundingClientRect().width || Math.min(innerWidth, 520)) / 100 + 'px'; stage.style.setProperty('--cq', v); $('#fnstage').style.setProperty('--cq', v); };
  cq(); addEventListener('resize', cq); addEventListener('orientationchange', () => setTimeout(cq, 300));
}

/* ── the five function pages: their words are painted; screen readers get them from config, and the
   painted "গুগল ম্যাপ দেখুন" buttons open each function's map ── */
const mapsUrl = (ev) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ev.mapQuery || ev.venue.join(' '));
for (const ev of C.events) {
  const sr = $(`[data-sr="${ev.id}"]`), maps = $(`[data-maps="${ev.id}"]`);
  if (sr) sr.innerHTML = `<h2>${esc(ev.title)}</h2><p>${esc(ev.tagline.join(' '))}</p>
    <p>${esc(C.labels.date)}: ${esc(ev.dateBn)}। ${esc(C.labels.time)}: ${esc(ev.timeBn)}। ${esc(C.labels.venue)}: ${esc(ev.venue.join(' '))}</p>`;
  if (maps) maps.href = mapsUrl(ev);
}
/* ── the five function pages are not in the scroll. activeFunction is null (the invitation) or a function's id:
   a row of the menu on page 3 opens that function's own designed page as a full view; its "অনুষ্ঠান তালিকা" button,
   Escape or the browser's Back close it and put the invitation back at the same scroll position. ── */
const fnview = $('#fnview');
const FN_IDS = C.events.map((ev) => ev.id);
let activeFunction = null, savedY = 0, fnFrom = null;
function replay(sec) {                                   // the page's words and pieces make their entrance each time it opens
  const els = $$(ANIM, sec);
  for (const el of els) el.classList.remove('in');
  void sec.offsetWidth;
  setTimeout(() => { for (const el of els) el.classList.add('in'); }, 80);
}
function openFunction(id, from, push = true) {
  const sec = FN_IDS.includes(id) && document.getElementById(id); if (!sec) return;
  if (activeFunction === null) savedY = window.scrollY;
  for (const s of $$('.page.fn', fnview)) s.classList.toggle('is-active', s === sec);
  activeFunction = id; fnFrom = from || fnFrom;
  fnview.hidden = false; fnview.scrollTop = 0;
  document.body.classList.add('fn-open');
  stage.setAttribute('aria-hidden', 'true'); stage.inert = true;
  if (push) { try { history.pushState({ fn: id }, '', '#' + id); } catch {} }
  replay(sec);
  setTimeout(() => $('.back', sec)?.focus({ preventScroll: true }), 30);
}
function closeFunction(fromPop = false) {
  if (activeFunction === null) return;
  activeFunction = null;
  fnview.hidden = true;
  for (const s of $$('.page.fn.is-active', fnview)) s.classList.remove('is-active');
  document.body.classList.remove('fn-open');
  stage.removeAttribute('aria-hidden'); stage.inert = false;
  window.scrollTo(0, savedY);                                     // the menu, exactly where the guest left it
  requestAnimationFrame(() => { window.scrollTo(0, savedY); fnFrom?.focus({ preventScroll: true }); });
  if (!fromPop && history.state && history.state.fn) history.back();
}
addEventListener('popstate', () => {
  const id = location.hash.slice(1);
  if (FN_IDS.includes(id) && opened) openFunction(id, null, false); else closeFunction(true);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && activeFunction !== null && $('#sheet').hidden) closeFunction(); });
document.addEventListener('click', (e) => {
  const row = e.target.closest('[data-fn]'); if (row) { e.preventDefault(); openFunction(row.dataset.fn, row); return; }
  const back = e.target.closest('[data-fnback]'); if (back) { e.preventDefault(); closeFunction(); }
});
/* in-page links scroll smoothly and never leave a stale hash in the address */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]'); if (!a || a.hasAttribute('data-fn') || a.hasAttribute('data-fnback')) return;
  const t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
  e.preventDefault(); t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => { const f = t.querySelector('.back, .hit, h2'); if (f) { if (f.matches('h2')) f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); } }, reduced ? 0 : 600);
});

/* ── music (optional): starts once the film has ended, never over it ── */
let music = null, wantMusic = true, musicTried = false, opened = false;
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
if (C.music) { music = new Audio(C.music); music.loop = true; music.preload = 'auto'; }
function startMusic() {
  if (!music || musicTried || !wantMusic) return; musicTried = true;
  mute.hidden = false;
  try { music.volume = 0; } catch {}
  const p = music.play();
  const ok = () => { mute.classList.remove('is-blocked'); fade(music, 1, 1200); syncMute(); };
  const no = () => { musicTried = false; wantMusic = false; mute.classList.add('is-blocked'); syncMute(); };
  if (p && p.then) p.then(ok, no); else ok();
}
function fade(a, to, ms) { const from = a.volume, t0 = performance.now(); const step = (t) => { const k = Math.min(1, (t - t0) / ms); try { a.volume = Math.min(1, Math.max(0, from + (to - from) * k)); } catch {} if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }
mute.addEventListener('click', (e) => {
  e.stopPropagation(); if (!music) return;
  wantMusic = !wantMusic;
  if (wantMusic) { music.volume = 1; music.play().then(() => mute.classList.remove('is-blocked')).catch(() => { wantMusic = false; syncMute(); }); }
  else music.pause();
  syncMute();
});
function syncMute() { const on = !!music && wantMusic && !music.paused; mute.setAttribute('aria-pressed', on ? 'false' : 'true'); mute.setAttribute('aria-label', on ? 'সঙ্গীত থামান' : 'সঙ্গীত চালান'); }
if (music) { music.addEventListener('play', syncMute); music.addEventListener('pause', syncMute); }
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { if (music) music.pause(); if (!opened && !film.paused) film.pause(); }
  else { if (opened && music && wantMusic) music.play().catch(() => {}); else if (!opened && playing && film.paused && !film.ended) film.play().catch(() => {}); }
});

/* ── opening: the tap → fullscreen (best effort, inside the gesture), the film with sound; its end → the hero ── */
let playing = false;
function heroIn() { for (const el of $$(ANIM, $('#p1'))) el.classList.add('in'); }
function open() {
  if (opened) return;
  tap.disabled = true;
  const root = document.documentElement, fs = root.requestFullscreen || root.webkitRequestFullscreen;
  if (fs && !isIOS) { try { const p = fs.call(root, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch {} }
  let done = false, started = false, stall = 0;
  const enter = () => { if (done) return; done = true; clearTimeout(bail); clearTimeout(slow); clearTimeout(stall); openStage(); };
  const bail = setTimeout(enter, C.videoTimeoutMs || 25000);
  const slow = setTimeout(() => { if (!started) enter(); }, 6000);
  film.addEventListener('ended', enter, { once: true });
  film.addEventListener('error', enter, { once: true });
  film.addEventListener('waiting', () => { clearTimeout(stall); stall = setTimeout(enter, 4000); });
  film.addEventListener('playing', () => { started = true; playing = true; clearTimeout(stall); opening.classList.add('is-playing'); skip.hidden = false; });
  skip.addEventListener('click', (e) => { e.stopPropagation(); enter(); }, { once: true });
  film.muted = false; film.volume = 1;
  const p = film.play();
  if (p && p.then) p.then(() => { started = true; playing = true; opening.classList.add('is-playing'); skip.hidden = false; })
    .catch(() => { film.muted = true; film.play().then(() => { started = true; playing = true; opening.classList.add('is-playing'); skip.hidden = false; }).catch(enter); });
}
tap.addEventListener('click', open);
opening.addEventListener('click', (e) => { if (!playing && e.target !== tap && !tap.contains(e.target)) open(); });

function openStage() {
  opened = true;
  try { history.scrollRestoration = 'manual'; } catch {}
  window.scrollTo(0, 0);
  document.body.classList.remove('is-closed'); document.body.classList.add('is-open');
  opening.classList.add('is-leaving');                 // the film's last frame dissolves into the hero beneath it
  heroIn();
  const stopFilm = () => { try { film.pause(); fade(film, 0, 500); } catch {} };
  if (!film.ended) stopFilm();
  startMusic();
  setTimeout(() => { opening.remove(); try { film.removeAttribute('src'); film.load(); } catch {} repaint(); }, 1300);
  setTimeout(repaint, 2600);
  watch();
  const want = location.hash.slice(1);
  if (FN_IDS.includes(want)) { try { history.replaceState(null, '', location.pathname + location.search); history.pushState({ fn: want }, '', '#' + want); } catch {} openFunction(want, null, false); }
  setTimeout(() => { for (const img of $$('img', fnview)) img.loading = 'eager'; }, 2500);     // the function pages are ready before they are asked for
  startSparkles();
}
function repaint() {
  requestAnimationFrame(() => {
    const y = window.scrollY; window.scrollTo(0, y + 1); window.scrollTo(0, y);
    for (const el of $$(ANIM, stage)) { if (el.classList.contains('in')) continue; const r = el.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) el.classList.add('in'); }
  });
}
function watch() {
  const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  for (const el of $$(ANIM, stage)) if (!el.classList.contains('in')) io.observe(el);
}
if (new URLSearchParams(location.search).has('open')) { wantMusic = false; openStage(); }

/* ── scratch to reveal: the cover is page 2's own gold (assets/el/date-cover.webp, cut from the page at the same box),
   so it is invisible until rubbed; beneath it lies the scratch-off reference's date. Rub with a finger or the mouse. ── */
(function scratchCard() {
  const card = $('#scard'), foil = $('#foil'), hint = $('#scardHint'), btn = $('#revealBtn');
  const ctx = foil.getContext('2d');
  const cover = new Image(); cover.decoding = 'async'; cover.src = 'assets/el/date-cover.webp?v=5';
  const GX = 24, GY = 12, cells = new Uint8Array(GX * GY); let hit = 0, done = false, drawing = false, last = null, dirty = false, W = 0, H = 0, dpr = 1;
  const page = $('#p2 .bg');                          // the cover only goes up once the page under it has arrived
  page.addEventListener('load', () => paint());
  function paint() {
    const r = foil.getBoundingClientRect(); if (!r.width || done || hit || !cover.complete || !cover.naturalWidth || !page.complete || !page.naturalWidth) return;
    dpr = Math.min(2, devicePixelRatio || 1); W = foil.width = Math.round(r.width * dpr); H = foil.height = Math.round(r.height * dpr);
    ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H); ctx.drawImage(cover, 0, 0, W, H);
    card.classList.add('is-ready');
  }
  cover.onload = paint;
  const pos = (e) => { const r = foil.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; };
  function mark(p) { const cx = p.x * GX, cy = p.y * GY;
    for (let gx = Math.max(0, Math.floor(cx - 1.5)); gx <= Math.min(GX - 1, Math.floor(cx + 1.5)); gx++)
      for (let gy = Math.max(0, Math.floor(cy - 1.2)); gy <= Math.min(GY - 1, Math.floor(cy + 1.2)); gy++) { const i = gy * GX + gx; if (!cells[i]) { cells[i] = 1; hit++; } } }
  function dab(x, y, r) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.95)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); }
  function rub(a, b) {
    ctx.globalCompositeOperation = 'destination-out';
    const r = W * .075, ax = a.x * W, ay = a.y * H, bx = b.x * W, by = b.y * H, n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / (r * .35)));
    for (let k = 0; k <= n; k++) dab(ax + (bx - ax) * k / n, ay + (by - ay) * k / n, r);
    const m = Math.max(1, Math.ceil(Math.hypot((b.x - a.x) * GX, (b.y - a.y) * GY)));
    for (let k = 0; k <= m; k++) mark({ x: a.x + (b.x - a.x) * k / m, y: a.y + (b.y - a.y) * k / m });
    ctx.globalCompositeOperation = 'source-over';
    if (!dirty) { dirty = true; hint.classList.add('is-gone'); card.classList.add('is-scratching'); }
    if (hit / cells.length > .45) reveal();
  }
  function reveal() {
    if (done) return; done = true; drawing = false;
    foil.classList.add('is-gone'); card.classList.add('is-revealed'); hint.classList.add('is-gone'); btn.classList.add('is-done');
    foil.setAttribute('aria-hidden', 'true'); foil.tabIndex = -1;
    $('#scardNote').textContent = `${C.reveal.date}, ${C.reveal.day}`;
    if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(12);
    setTimeout(() => foil.remove(), 1000);
  }
  foil.addEventListener('pointerdown', (e) => { if (done || (e.pointerType === 'mouse' && e.button !== 0)) return; e.preventDefault(); drawing = true; last = pos(e); try { foil.setPointerCapture(e.pointerId); } catch {} rub(last, last); });
  foil.addEventListener('pointermove', (e) => { if (!drawing) return; e.preventDefault(); const co = e.getCoalescedEvents ? e.getCoalescedEvents() : null; for (const ev of (co && co.length ? co : [e])) { const p = pos(ev); rub(last, p); last = p; } });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) foil.addEventListener(t, () => { drawing = false; });
  foil.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });
  btn.addEventListener('click', reveal);
  new ResizeObserver(() => { if (!done && !hit) paint(); }).observe(foil);
})();

/* ── add to calendar: an .ics and a Google Calendar link per function, Asia/Dhaka wall-clock ── */
const sheet = $('#sheet');
const pad = (n) => String(n).padStart(2, '0');
const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
function calendar(ev) {
  const start = new Date(`${ev.date}T${ev.time}:00Z`), end = new Date(start.getTime() + (ev.durationMinutes || 180) * 60000);
  const wall = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00`;
  const summary = `${ev.title} — ${C.hero.title}`, loc = ev.venue.join(' '), desc = `${ev.tagline.join(' ')}\nMap: ${mapsUrl(ev)}\n${C.url}`;
  const off = C.utcOffset.replace(':', '');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Wedding Invitation//BN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE', `TZID:${C.timeZone}`, 'BEGIN:STANDARD', 'DTSTART:19700101T000000', `TZOFFSETFROM:${off}`, `TZOFFSETTO:${off}`, 'TZNAME:BST', 'END:STANDARD', 'END:VTIMEZONE',
    'BEGIN:VEVENT', `UID:${C.slug}-${ev.id}-${ev.date}@invitivals.com`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART;TZID=${C.timeZone}:${wall(start)}`, `DTEND;TZID=${C.timeZone}:${wall(end)}`,
    `SUMMARY:${icsText(summary)}`, `LOCATION:${icsText(loc)}`, `DESCRIPTION:${icsText(desc)}`, `URL:${C.url}`,
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(summary)}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  const g = new URL('https://calendar.google.com/calendar/render');
  g.searchParams.set('action', 'TEMPLATE'); g.searchParams.set('text', summary); g.searchParams.set('dates', `${wall(start)}/${wall(end)}`);
  g.searchParams.set('ctz', C.timeZone); g.searchParams.set('details', desc); g.searchParams.set('location', loc);
  return { ics, gcal: g.toString(), file: `${C.slug}-${ev.id}.ics` };
}
let lastTrigger = null, icsUrl = null;
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-cal]'); if (!b) return;
  const ev = C.events.find((x) => x.id === b.dataset.cal); if (!ev) return;
  const { ics, gcal, file } = calendar(ev);
  if (icsUrl) URL.revokeObjectURL(icsUrl);
  try { icsUrl = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' })); $('#ics').href = icsUrl; }
  catch { $('#ics').href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics); }
  $('#ics').download = file; $('#gcal').href = gcal;
  $('#sheetTitle').textContent = ev.title; $('#sheetWhen').textContent = `${ev.dateBn} · ${ev.timeBn} · ${ev.venue.join(' ')}`;
  lastTrigger = b; sheet.hidden = false; $('#ics').focus();
});
const closeSheet = () => { sheet.hidden = true; lastTrigger?.focus(); };
for (const el of $$('[data-close]', sheet)) el.addEventListener('click', closeSheet);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });

/* ── RSVP & contact: only links that really go somewhere ── */
(function rsvp() {
  const R = C.rsvp, acts = $('#rsvpActions'), meta = $('#rsvpMeta'), form = $('#rsvpForm');
  const metaBits = [R.host && `আমন্ত্রণে: ${R.host}`, R.deadline && `উত্তর জানানোর শেষ তারিখ: ${R.deadline}`].filter(Boolean);
  if (metaBits.length) { meta.innerHTML = metaBits.map(esc).join('<br>'); meta.hidden = false; }
  const html = [];
  if (R.whatsapp) {
    const msg = R.message.replace('{name}', '…').replace('{count}', '…');
    html.push(`<a class="btn btn--wa" href="https://wa.me/${encodeURIComponent(R.whatsapp.replace(/\D/g, ''))}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>হোয়াটসঅ্যাপে জানান</a>`);
  }
  if (R.phone) html.push(`<a class="btn" href="tel:${encodeURIComponent(R.phone)}"><svg aria-hidden="true"><use href="#i-tel"/></svg>ফোন করুন</a>`);
  if (!html.length) html.push('<p class="rsvp__note">যোগাযোগের বিবরণ শীঘ্রই যুক্ত হবে।</p>');
  acts.innerHTML = html.join('');
  if (!R.endpoint) return;
  form.hidden = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const st = $('.rsvp__status', form), fd = new FormData(form);
    if (!String(fd.get('name') || '').trim()) { st.textContent = 'আপনার নাম লিখুন।'; form.name.focus(); return; }
    st.textContent = 'পাঠানো হচ্ছে…';
    try {
      const res = await fetch(R.endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
      if (!res.ok) throw new Error(String(res.status));
      st.textContent = 'ধন্যবাদ! আপনার উত্তর পৌঁছে গেছে।'; form.reset();
    } catch { st.textContent = 'দুঃখিত, পাঠানো যায়নি। অনুগ্রহ করে হোয়াটসঅ্যাপ বা ফোনে জানান।'; }
  });
})();

/* ── golden sparkles: a dozen or so tiny warm-gold motes drifting down over the invitation and the function pages.
   One canvas above everything but the opening and the calendar sheet; it never takes a tap. ── */
function startSparkles() {
  const cv = $('#sparkles'); if (!cv || reduced || cv.dataset.on) return; cv.dataset.on = '1';
  const ctx = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  let W = 0, H = 0, raf = 0, last = 0;
  const parts = [];
  const size = () => { W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const N = () => Math.max(10, Math.min(18, Math.round(innerWidth / 30)));
  const make = (fresh) => { const bright = Math.random() < .22; return {
    x: Math.random() * W, y: fresh ? -10 - Math.random() * H * .25 : Math.random() * H, r: bright ? 1.6 + Math.random() * 1.2 : .8 + Math.random() * 1,
    vy: 14 + Math.random() * 16, drift: 6 + Math.random() * 10, ph: Math.random() * 6.28, sp: .5 + Math.random() * .7,
    life: 0, span: 7 + Math.random() * 8, peak: bright ? .85 : .35 + Math.random() * .3, bright, tw: 1.2 + Math.random() * 1.6 }; };
  size(); for (let i = 0; i < N(); i++) { const p = make(false); p.life = Math.random() * p.span; parts.push(p); }
  addEventListener('resize', () => { size(); const n = N(); while (parts.length < n) parts.push(make(true)); parts.length = n; });
  const tick = (t) => {
    const dt = Math.min(.05, (t - last) / 1000 || .016); last = t;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]; p.life += dt; p.ph += dt * p.sp; p.y += p.vy * dt; p.x += Math.sin(p.ph) * p.drift * dt;
      const k = p.life / p.span; if (k >= 1 || p.y > H + 12) { parts[i] = make(true); continue; }
      const fadeIO = Math.min(1, k / .18, (1 - k) / .25), al = p.peak * fadeIO * (.75 + .25 * Math.sin(p.ph * p.tw));
      if (al <= 0) continue;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.2);
      g.addColorStop(0, 'rgba(255, 236, 170, ' + al + ')'); g.addColorStop(.35, 'rgba(240, 196, 92, ' + al * .55 + ')'); g.addColorStop(1, 'rgba(226, 170, 60, 0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.2, 0, 6.2832); ctx.fill();
      if (p.bright) { ctx.strokeStyle = 'rgba(255, 244, 205, ' + al * .8 + ')'; ctx.lineWidth = .7; const L = p.r * 3.4; ctx.beginPath(); ctx.moveTo(p.x - L, p.y); ctx.lineTo(p.x + L, p.y); ctx.moveTo(p.x, p.y - L); ctx.lineTo(p.x, p.y + L); ctx.stroke(); }
    }
    raf = requestAnimationFrame(tick);
  };
  const run = () => { if (!raf && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else run(); });
  window.__sparkles = parts;
  run();
}
