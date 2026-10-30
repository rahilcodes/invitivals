/* ─────────────────────────────────────────────────────────────────────────────
   Bengali wedding — runs the page: the tap that plays the intro film (with
   sound, fullscreen where allowed) and fades its last frame into the hero; the
   words from config; the functions menu and the five function pages; the
   scratch-to-reveal date; maps and calendar; music; RSVP and contact.
   ───────────────────────────────────────────────────────────────────────────── */
import { invite as C } from '../config.js?v=2';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const opening = $('#opening'), film = $('#film'), tap = $('#tap'), skip = $('#skip'), mute = $('#mute'), stage = $('#stage');
const ANIM = '.rise, .drop, .pop, .tilt, .swing';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const lines = (v) => (Array.isArray(v) ? v.map(esc).join('<br>') : esc(v));
const get = (k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), C);

/* ── words from config ── */
for (const el of $$('[data-t]')) { const v = get(el.dataset.t); if (v != null) el.innerHTML = lines(v); }

/* ── container units: phones without them get the same sizes from the stage's width ── */
if (!(window.CSS && CSS.supports && CSS.supports('width', '1cqw'))) {
  const cq = () => stage.style.setProperty('--cq', (stage.getBoundingClientRect().width || Math.min(innerWidth, 520)) / 100 + 'px');
  cq(); addEventListener('resize', cq); addEventListener('orientationchange', () => setTimeout(cq, 300));
}

/* ── functions menu + the five pages ── */
const mapsUrl = (ev) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ev.mapQuery || ev.venue.join(' '));
const menu = $('#menu');
const TOPS = [38.4, 47, 55.4, 63.8, 72.2];
menu.innerHTML = C.events.map((ev, i) => `<a class="menu__item rise" href="#${ev.id}" style="top:${TOPS[i]}%;--d:${.35 + i * .12}s">${esc(ev.label)}</a>`).join('');
for (const sec of $$('.fn')) {
  const ev = C.events.find((e) => e.id === sec.dataset.event); if (!ev) continue;
  const others = C.events.filter((e) => e !== ev).map((e) => `<li><a class="chip" href="#${e.id}">${esc(e.label)}</a></li>`).join('');
  $('.fn__body', sec).innerHTML = `
    <a class="back" href="#p3"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.5 4.5L8 12l7.5 7.5-1.4 1.4L5.2 12l8.9-8.9z"/></svg>${esc(C.labels.back)}</a>
    <h2 class="bn-fn rise" style="--d:.1s">${esc(ev.title)}</h2>
    <p class="txt bn-sub rise" style="--d:.25s">${lines(ev.tagline)}</p>
    <span class="haze" aria-hidden="true"></span>
    <ul class="details rise" style="--d:.4s">
      <li><svg aria-hidden="true"><use href="#i-cal"/></svg><span>${esc(C.labels.date)}</span><span class="sep">:</span><span>${esc(ev.dateBn)}</span></li>
      <li><svg aria-hidden="true"><use href="#i-clock"/></svg><span>${esc(C.labels.time)}</span><span class="sep">:</span><span>${esc(ev.timeBn)}</span></li>
      <li><svg aria-hidden="true"><use href="#i-pin"/></svg><span>${esc(C.labels.venue)}</span><span class="sep">:</span><span>${lines(ev.venue)}</span></li>
    </ul>
    <a class="act act--maps rise" style="--d:.55s" href="${mapsUrl(ev)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-pin"/></svg>${esc(C.labels.maps)}</a>
    <button class="act act--cal rise" style="--d:.7s" type="button" data-cal="${ev.id}"><svg aria-hidden="true"><use href="#i-cal"/></svg>${esc(C.labels.calendar)}</button>
    <ul class="chips rise" style="--d:.8s"><li class="chips__label">${esc(C.labels.others)}</li>${others}</ul>`;
}
/* venues section */
$('#vlist').innerHTML = C.events.map((ev) => `<article class="vcard rise" style="--d:.2s">
    <h3>${esc(ev.label)}</h3><p class="when">${esc(ev.dateBn)} · ${esc(ev.timeBn)}</p><p class="where">${lines(ev.venue)}</p>
    <div class="row"><a class="btn btn--primary" href="${mapsUrl(ev)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-pin"/></svg>${esc(C.labels.maps)}</a>
    <button class="btn" type="button" data-cal="${ev.id}"><svg aria-hidden="true"><use href="#i-cal"/></svg>${esc(C.labels.calendar)}</button></div></article>`).join('');
/* in-page links scroll smoothly and never leave a stale hash in the address */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
  e.preventDefault(); t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => { const f = t.querySelector('.back, h2'); if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); } }, reduced ? 0 : 600);
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
  if (!reduced) heroIn();
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
}
function repaint() {
  requestAnimationFrame(() => {
    const y = window.scrollY; window.scrollTo(0, y + 1); window.scrollTo(0, y);
    for (const el of $$(ANIM, stage)) { if (el.classList.contains('in')) continue; const r = el.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) el.classList.add('in'); }
  });
}
function watch() {
  const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  for (const el of $$(ANIM, stage)) if (!el.classList.contains('in')) io.observe(el);
}
if (new URLSearchParams(location.search).has('open')) { wantMusic = false; openStage(); }

/* ── scratch to reveal: a gold foil over the plaque's brushstroke; rub it with a finger or the mouse and the date shows ── */
(function scratchCard() {
  const card = $('#scard'), foil = $('#foil'), hint = $('#scardHint'), btn = $('#revealBtn');
  const ctx = foil.getContext('2d');
  const GX = 26, GY = 14, cells = new Uint8Array(GX * GY); let hit = 0, done = false, drawing = false, last = null, dirty = false, W = 0, H = 0, dpr = 1;
  /* the gold brushstroke of the painting, as a rotated rounded box inside the canvas (fractions of its size) */
  const BOX = { cx: .5, cy: .5, w: .72, h: .62, rot: -7 * Math.PI / 180 };
  function paint() {
    const r = foil.getBoundingClientRect(); if (!r.width || done || hit) return;
    dpr = Math.min(2, devicePixelRatio || 1); W = foil.width = Math.round(r.width * dpr); H = foil.height = Math.round(r.height * dpr);
    ctx.clearRect(0, 0, W, H); ctx.save();
    ctx.translate(W * BOX.cx, H * BOX.cy); ctx.rotate(BOX.rot);
    const bw = W * BOX.w, bh = H * BOX.h, rad = bh * .12;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-bw / 2, -bh / 2, bw, bh, rad) : ctx.rect(-bw / 2, -bh / 2, bw, bh); ctx.clip();
    const g = ctx.createLinearGradient(-bw / 2, -bh / 2, bw / 2, bh / 2);
    g.addColorStop(0, '#e2b84f'); g.addColorStop(.3, '#f9e49a'); g.addColorStop(.5, '#d7a93a'); g.addColorStop(.72, '#f6dd8e'); g.addColorStop(1, '#c08f22');
    ctx.fillStyle = g; ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
    for (const [x0, a] of [[.15, .35], [.6, .25]]) { const s = ctx.createLinearGradient(-bw / 2 + bw * x0, -bh / 2, -bw / 2 + bw * (x0 + .25), bh / 2);
      s.addColorStop(0, 'rgba(255,250,225,0)'); s.addColorStop(.5, `rgba(255,250,225,${a})`); s.addColorStop(1, 'rgba(255,250,225,0)'); ctx.fillStyle = s; ctx.fillRect(-bw / 2, -bh / 2, bw, bh); }
    ctx.restore();
    const img = ctx.getImageData(0, 0, W, H), d = img.data;
    for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const n = (Math.random() - .5) * 22; d[i] += n; d[i + 1] += n; d[i + 2] += n * .7; }
    ctx.putImageData(img, 0, 0);
    ctx.save(); ctx.translate(W * BOX.cx, H * BOX.cy); ctx.rotate(BOX.rot);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(110,70,10,.85)'; ctx.font = `700 ${Math.round(bh * .16)}px "Noto Serif Bengali", serif`; ctx.fillText(C.reveal.hint, 0, -bh * .06);
    ctx.fillStyle = 'rgba(110,70,10,.7)'; ctx.font = `600 ${Math.round(bh * .085)}px "Cormorant Garamond", Georgia, serif`; ctx.fillText('S C R A T C H', 0, bh * .14);
    ctx.restore();
  }
  const pos = (e) => { const r = foil.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; };
  function mark(p) { const cx = p.x * GX, cy = p.y * GY;
    for (let gx = Math.max(0, Math.floor(cx - 1.5)); gx <= Math.min(GX - 1, Math.floor(cx + 1.5)); gx++)
      for (let gy = Math.max(0, Math.floor(cy - 1.2)); gy <= Math.min(GY - 1, Math.floor(cy + 1.2)); gy++) { const i = gy * GX + gx; if (!cells[i]) { cells[i] = 1; hit++; } } }
  function dab(x, y, r) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.95)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); }
  function rub(a, b) {
    ctx.globalCompositeOperation = 'destination-out';
    const r = W * .07, ax = a.x * W, ay = a.y * H, bx = b.x * W, by = b.y * H, n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / (r * .35)));
    for (let k = 0; k <= n; k++) dab(ax + (bx - ax) * k / n, ay + (by - ay) * k / n, r);
    const m = Math.max(1, Math.ceil(Math.hypot((b.x - a.x) * GX, (b.y - a.y) * GY)));
    for (let k = 0; k <= m; k++) mark({ x: a.x + (b.x - a.x) * k / m, y: a.y + (b.y - a.y) * k / m });
    ctx.globalCompositeOperation = 'source-over';
    if (!dirty) { dirty = true; hint.classList.add('is-gone'); card.classList.add('is-scratching'); }
    if (hit / cells.length > .4) reveal();
  }
  function reveal() {
    if (done) return; done = true; drawing = false;
    foil.classList.add('is-gone'); card.classList.add('is-revealed'); hint.classList.add('is-gone'); btn.classList.add('is-done');
    foil.setAttribute('aria-hidden', 'true'); foil.tabIndex = -1;
    navigator.vibrate?.(12);
    setTimeout(() => foil.remove(), 1000);
  }
  foil.addEventListener('pointerdown', (e) => { if (done || (e.pointerType === 'mouse' && e.button !== 0)) return; e.preventDefault(); drawing = true; last = pos(e); try { foil.setPointerCapture(e.pointerId); } catch {} rub(last, last); });
  foil.addEventListener('pointermove', (e) => { if (!drawing) return; e.preventDefault(); const co = e.getCoalescedEvents ? e.getCoalescedEvents() : null; for (const ev of (co && co.length ? co : [e])) { const p = pos(ev); rub(last, p); last = p; } });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) foil.addEventListener(t, () => { drawing = false; });
  foil.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });
  btn.addEventListener('click', reveal);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(paint);
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
