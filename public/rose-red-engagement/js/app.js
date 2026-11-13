/* Rose Red Engagement — composes the invitation from config.js and the designer's element pack.
   Pieces are placed on a 900-px-wide stage in stage pixels (x from the left, y from the top, or b from
   the bottom, r from the right) and given a motion class: sway (hangs and swings), drift (floats),
   bob (rides the water), glow (a lit lantern), twinkle (a star), bloom (grows in with the page). */
import { invite as C } from '../config.js';

const MANIFEST = await fetch('assets/el/manifest.json').then((r) => r.json());
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const guest = (() => { const t = new URLSearchParams(location.search).get('to'); return t ? t.replace(/[+_]/g, ' ').trim().slice(0, 60) : ''; })();

/* ── one piece of art ──────────────────────────────────────────────────────────────────────────── */
function el(id, o = {}) {
  const [W, Hh] = MANIFEST[id] || [100, 100];
  const w = o.w || Math.round((o.h || 100) * W / Hh), h = Math.round(w * Hh / W);
  const pos = [];
  if (o.r != null) pos.push(`right:${o.r}px`); else pos.push(`left:${o.x ?? 0}px`);
  if (o.b != null) pos.push(`bottom:${o.b}px`); else pos.push(`top:${o.y ?? 0}px`);
  const st = [...pos, `width:${w}px`];
  if (o.t) st.push(`--t:${o.t}s`); if (o.dl) st.push(`--dl:${o.dl}s`); if (o.d) st.push(`--d:${o.d}s`);
  if (o.op != null) st.push(`opacity:${o.op}`); if (o.z != null) st.push(`z-index:${o.z}`);
  if (o.rot) st.push(`rotate:${o.rot}deg`);
  if (o.style) st.push(o.style);
  const cls = ['el', o.cls || ''].join(' ').trim();
  return `<img class="${cls}" src="assets/el/${id}.webp" alt="" ${o.eager ? 'fetchpriority="high"' : w >= 240 ? '' : 'loading="lazy"'} decoding="async" width="${w}" height="${h}" style="${st.join(';')}">`;
}
const layer = (z, html) => `<div class="layer z${z}">${html}</div>`;
const words = (y, html, extra = '') => `<div class="words" style="top:${y}px;${extra}">${html}</div>`;

/* falling petals: ids drawn from the pack, each on its own path */
let seed = 7;
const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
function petals(ids, n = 10) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const id = ids[i % ids.length], w = 44 + Math.round(rnd() * 46);
    const t = 11 + rnd() * 10, dl = -rnd() * t, x = Math.round(rnd() * 860), sx = Math.round((rnd() - .5) * 320), rz = Math.round((rnd() - .5) * 720);
    out += `<img class="petal" src="assets/el/${id}.webp" alt="" loading="lazy" decoding="async" style="left:${x}px;width:${w}px;--t:${t.toFixed(1)}s;--dl:${dl.toFixed(1)}s;--sx:${sx}px;--rz:${rz}deg">`;
  }
  return `<div class="petals">${out}</div>`;
}
/* the embossed foliage of the paper: tone-on-tone pieces scattered where the wording is not */
function emboss(list) { return `<div class="emboss">${list.map(([id, o]) => el(id, o)).join('')}</div>`; }
const gline = (id, flip) => `<img class="line${flip ? ' flip' : ''}" src="assets/el/${id}.webp" alt="">`;

/* ── the pages ─────────────────────────────────────────────────────────────────────────────────── */
function envelope() {
  return `
  <div class="door" id="door"><div class="page in"><div class="stage">
    ${layer(0, emboss([
      ['sw-17', { x: 60, y: 480, w: 230 }], ['cor-43', { r: 40, y: 560, w: 240 }], ['cor-32', { x: 560, y: 120, w: 330, rot: 20 }],
      ['nm-16', { x: 40, b: 420, w: 160, rot: -30 }], ['cor-49', { r: 60, b: 360, w: 220 }], ['cal-13', { x: 330, b: 60, w: 210 }], ['cor-46', { x: 650, b: 60, w: 150, rot: 60 }],
    ]))}
    ${layer(2, `
      ${el('nm-02', { r: -140, y: -40, w: 760, cls: 'bloom drift', t: 11, op: .95 })}
      ${el('cor-13', { x: -180, b: 160, w: 720, cls: 'bloom drift', t: 13, dl: -4, op: .95 })}
      ${el('cor-04', { x: -40, y: -20, w: 420, cls: 'bloom drift', t: 10 })}
      ${el('nm-41', { x: -30, y: 300, w: 300, cls: 'bloom', d: .2 })}
      ${el('cor-05', { r: -40, b: 220, w: 300, cls: 'bloom drift', t: 12, dl: -3 })}
      ${el('cor-06', { r: 40, b: 60, w: 260, cls: 'bloom drift', t: 9, dl: -1 })}
      ${el('cor-20', { r: 250, b: 90, w: 150, cls: 'bloom', d: .3 })}
      ${el('cor-08', { x: 300, y: 70, w: 150, cls: 'bloom drift', t: 8, rot: -20 })}
      ${el('cor-56', { r: 110, y: 330, w: 150, cls: 'bloom drift', t: 10, dl: -5, rot: 30 })}
      ${el('nm-03', { x: -60, y: 140, w: 420, cls: 'bloom drift', t: 12, dl: -3, op: .9 })}
      ${el('nm-05', { r: -80, b: 420, w: 400, cls: 'bloom drift', t: 11, dl: -6, op: .9 })}
      ${el('cor-19', { x: 120, b: 300, w: 120, cls: 'bloom drift', t: 9, dl: -2 })}
      ${el('cor-15', { r: 300, y: 420, w: 110, cls: 'bloom drift', t: 8, dl: -4, rot: -20 })}
    `)}
    ${layer(3, `
      <div class="monogram" style="opacity:.16;top:calc(var(--sh) * .5px - 470px)">${esc(C.couple.short)}</div>
      <div class="card" style="top:calc(var(--sh) * .5px - 300px)">
        <div class="caps">${esc(C.occasion)}</div>
        <div class="script">${esc(C.couple.first)}</div>
        <div class="serif">&amp;</div>
        <div class="script">${esc(C.couple.second)}</div>
        <div class="guest">${esc(guest || C.guestFallback)}</div>
      </div>
      <img class="env closed" id="envClosed" src="assets/el/cor-01.webp" alt="A sealed envelope" style="top:calc(var(--sh) * .5px - 333px)" fetchpriority="high">
      <img class="env open" src="assets/el/cor-02.webp" alt="" style="top:calc(var(--sh) * .5px - 358px);width:760px" loading="lazy">
      <img class="seal" src="assets/el/cor-03.webp" alt="" style="top:calc(var(--sh) * .5px - 105px)" fetchpriority="high">
      <button class="seal-btn" id="sealBtn" aria-label="Open the invitation" style="top:calc(var(--sh) * .5px)"></button>
      <div class="tap-hint" style="top:calc(var(--sh) * .5px + 400px)">${esc(C.ui.tapSeal)}</div>
    `)}
    ${layer(4, petals(['nm-06', 'nm-07', 'cor-23', 'cor-33', 'nm-10', 'cor-27', 'cor-12', 'cor-36', 'cor-47', 'cor-57'], 10))}
  </div></div></div>`;
}

function hero() {
  return `
  <section class="page" id="p-invite" data-title="Invitation"><div class="stage">
    ${layer(0, emboss([
      ['nm-20', { x: 90, y: 380, w: 200, rot: -24 }], ['cor-38', { r: 40, y: 400, w: 230 }], ['nm-15', { x: 400, y: 120, w: 150, rot: 40 }], ['nm-45', { r: 300, y: 150, w: 130, rot: -30 }], ['nm-47', { x: 300, y: 1300, w: 150, rot: 15 }], ['nm-46', { x: 600, y: 1260, w: 120 }], ['nm-35', { r: 90, y: 760, w: 220, rot: 30 }],
      ['cor-43', { x: 20, y: 820, w: 220 }], ['sw-17', { r: 0, y: 1020, w: 200 }], ['cal-25', { x: 40, y: 1080, w: 160 }],
    ]))}
    ${layer(2, `
      ${el('nm-22', { x: 0, b: 0, w: 900, cls: 'bloom' })}
      ${el('nm-31', { x: -30, b: 0, w: 250, cls: 'bloom drift', t: 12, d: .2 })}
      ${el('nm-32', { r: -10, b: 300, w: 160, cls: 'bloom drift', t: 14, dl: -5, d: .3 })}
      ${el('nm-17', { x: 350, b: -4, w: 380, cls: 'bloom', d: .35, style: 'filter:drop-shadow(0 20px 30px rgba(0,0,0,.45))' })}
      ${el('nm-38', { x: -20, b: -10, w: 380, cls: 'bloom', d: .5 })}
      ${el('nm-44', { r: -20, b: 0, w: 320, cls: 'bloom', d: .55 })}
      ${el('nm-41', { x: 240, b: -20, w: 420, cls: 'bloom', d: .6 })}
      ${el('nm-39', { r: 120, b: 230, w: 200, cls: 'bloom drift', t: 9, d: .5 })}
    `)}
    ${layer(3, `
      ${el('nm-04', { r: -40, y: -20, w: 520, cls: 'bloom drift', t: 12, dl: -2 })}
      ${el('nm-01', { x: -60, y: -30, w: 420, cls: 'bloom drift', t: 11 })}
      ${el('nm-02', { r: -120, y: -60, w: 640, cls: 'bloom drift', t: 10, dl: -4, op: .95 })}
      <div class="halo" style="right:112px;top:250px;width:260px;height:260px"></div>
      ${el('nm-09', { r: 130, y: -10, w: 150, cls: 'bloom sway glow', t: 6, d: .4 })}
      ${el('nm-19', { r: 150, y: 520, w: 120, cls: 'bloom drift', t: 8, dl: -2, rot: 10 })}
      ${el('nm-13', { x: 20, y: 600, w: 170, cls: 'bloom drift', t: 9, dl: -1 })}
      ${el('nm-14', { r: 30, y: 860, w: 110, cls: 'bloom drift', t: 10, dl: -6 })}
      ${el('nm-25', { x: 30, y: 940, w: 120, cls: 'bloom drift', t: 9, dl: -3 })}
      ${el('nm-36', { r: 40, y: 640, w: 100, cls: 'bloom drift', t: 11, dl: -2, rot: 25 })}
      ${el('nm-11', { x: 60, y: 760, w: 110, cls: 'bloom drift', t: 9, dl: -4 })}
      ${el('nm-42', { x: 10, y: 1120, w: 110, cls: 'bloom drift', t: 10, dl: -1, rot: -15 })}
      ${el('nm-18', { r: 60, y: 1000, w: 100, cls: 'bloom drift', t: 8, dl: -3 })}
      ${el('nm-43', { r: 10, y: 1100, w: 100, cls: 'bloom drift', t: 11, dl: -5, rot: 20 })}
      ${el('nm-21', { x: 150, y: 1180, w: 90, cls: 'bloom drift', t: 9, dl: -2 })}
      ${el('nm-27', { r: 150, y: 1160, w: 90, cls: 'bloom drift', t: 10, dl: -6, rot: 30 })}
      <div class="mid">${words(214, `
        <img class="ornament rise" src="assets/el/nm-26.webp" alt="" style="width:104px;--d:.1s">
        <div class="caps rise shadow" style="--d:.2s;margin-top:6px;font-size:24px">${esc(C.hosts.intro)}</div>
        <img class="ornament rise" src="assets/el/nm-29.webp" alt="" style="width:300px;margin-top:2px;--d:.3s">
        <div class="serif big gold-text rise" style="--d:.4s;margin-top:6px;font-size:43px">${esc(C.hosts.names)}</div>
        <div class="serif soft rise shadow" style="--d:.5s;margin-top:4px;font-size:35px">${C.hosts.lines.map(esc).join('<br>')}</div>
        <div class="names">
          <div class="script rise" style="--d:.7s;margin-top:12px;font-size:128px">${esc(C.couple.first)}</div>
          <div class="amp rise" style="--d:.85s;height:80px">${gline('sw-08')}<img src="assets/el/nm-33.webp" alt="&amp;" style="height:74px">${gline('sw-11', true)}</div>
          <div class="script rise" style="--d:1s;font-size:128px">${esc(C.couple.second)}</div>
        </div>
        <img class="ornament rise" src="assets/el/nm-34.webp" alt="" style="width:240px;margin-top:8px;--d:1.1s">
        <div class="lead rise shadow" style="--d:1.2s;margin-top:10px;font-size:31px">${esc(C.blessing)}</div>
      `)}</div>
    `)}
    ${layer(4, petals(['nm-06', 'nm-07', 'nm-08', 'nm-10', 'nm-12', 'nm-23', 'nm-24', 'nm-37', 'nm-28', 'nm-40', 'nm-48', 'nm-30'], 14) + '<div class="scroll-hint" style="top:calc(var(--sh) * 1px - 96px)">scroll<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></div>')}
  </div></section>`;
}

function date() {
  const fy = 440;  // the frame's top
  return `
  <section class="page hidden-date" id="p-date" data-title="Save our date"><div class="stage">
    ${layer(0, emboss([
      ['cal-07', { x: 60, y: 130, w: 210 }], ['sw-33', { r: 70, y: 470, w: 230 }], ['cal-30', { x: 330, y: 1180, w: 220 }], ['sw-26', { x: 560, y: 120, w: 110, rot: 30 }], ['cal-13', { r: 20, y: 1300, w: 180, rot: -20 }], ['cal-13', { x: 70, y: 1090, w: 200, rot: -30 }],
      ['sw-12', { x: 760, y: 1000, w: 160 }], ['sw-23', { x: 40, y: 760, w: 160, rot: 20 }],
    ]))}
    ${layer(2, `
      ${el('sw-01', { x: 0, b: -330, w: 900, cls: 'bloom' })}
      ${el('cal-51', { x: 90, b: -30, w: 720, cls: 'shimmer', t: 5, op: .75 })}
    `)}
    ${layer(3, `
      ${el('sw-03', { x: -120, y: -50, w: 720, cls: 'bloom drift', t: 11, op: .95 })}
      ${el('sw-04', { r: -40, y: -30, w: 430, cls: 'bloom drift', t: 12, dl: -5, op: .95 })}
      ${el('cal-05', { r: -30, y: -10, w: 250, cls: 'bloom drift', t: 9, dl: -2, z: 3 })}
      ${el('cal-23', { x: -40, y: 1040, w: 320, cls: 'bloom drift', t: 10, dl: -3 })}
      ${el('cal-11', { x: 40, y: 560, w: 130, cls: 'bloom drift', t: 8, dl: -1 })}
      ${el('cal-20', { r: 40, y: 1110, w: 150, cls: 'bloom drift', t: 9, dl: -4 })}
      ${el('sw-28', { r: -120, b: 300, w: 520, cls: 'bloom drift', t: 12, dl: -5, op: .9 })}
      ${el('sw-14', { x: 60, y: 440, w: 60, cls: 'twinkle', t: 4, dl: -1 })}
      ${el('sw-14', { r: 60, y: 440, w: 60, cls: 'twinkle', t: 4, dl: -2.5 })}
      ${el('sw-15', { x: 300, y: fy + 640, w: 160, cls: 'bloom', op: .9 })}
      ${el('sw-15', { r: 300, y: fy + 640, w: 160, cls: 'bloom flip', op: .9 })}
      ${el('cal-06', { x: -20, y: 1220, w: 170, cls: 'bloom drift', t: 10, dl: -3 })}
      ${el('sw-07', { r: 30, y: 1260, w: 130, cls: 'bloom drift', t: 9, dl: -1, rot: 20 })}
      <div class="halo" style="left:-10px;top:160px;width:220px;height:220px"></div>
      ${el('sw-13', { x: 40, y: -20, w: 112, cls: 'bloom sway glow', t: 7, d: .3 })}
      <div class="halo" style="left:70px;top:190px;width:200px;height:200px"></div>
      ${el('sw-24', { x: 150, y: 50, w: 104, cls: 'bloom sway glow', t: 8, dl: -3, d: .4 })}
      ${el('cal-02', { x: 260, y: 86, w: 330, cls: 'bloom', d: .2, style: 'filter:drop-shadow(0 8px 24px rgba(0,0,0,.5))' })}
      ${el('cal-03', { x: 570, y: 206, w: 250, cls: 'bloom', d: .45, style: 'filter:drop-shadow(0 8px 24px rgba(0,0,0,.5))' })}
      <div class="mid">
      ${el('sw-02', { x: 40, y: fy, w: 820, cls: 'bloom', d: .3, style: 'filter:drop-shadow(0 20px 40px rgba(0,0,0,.45))' })}
      ${el('sw-05', { x: 310, y: fy + 40, w: 280, cls: 'bloom breathe', d: .5 })}
      <div class="date-words">
        ${words(fy + 150, `
          <div class="row-gold">${gline('sw-09')}<span class="serif" style="font-size:52px">${esc(C.event.day)}</span>${gline('sw-10', true)}</div>
          <div class="serif gold-text" style="font-size:72px;font-weight:700;margin-top:4px;letter-spacing:.01em">${esc(C.event.date)}</div>
          <div class="row-gold" style="margin-top:6px;gap:14px"><img src="assets/el/sw-16.webp" alt="" style="height:24px;width:auto"><span class="serif soft" style="font-size:40px">${esc(C.event.time)}</span><img class="flip" src="assets/el/sw-16.webp" alt="" style="height:24px;width:auto"></div>
        `)}
      </div>
      <div class="scratch" id="scratch" style="left:120px;top:${fy + 135}px;width:660px;height:250px"><canvas id="scratchCanvas" width="660" height="250"></canvas></div>
      <div class="scratch-hint" id="scratchHint" style="top:${fy + 392}px">
        <svg class="hand" viewBox="0 0 24 24" fill="none" stroke="#5a1020" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="position:absolute;left:423px;top:-180px"><path d="M9 11V5a1.5 1.5 0 0 1 3 0v6"/><path d="M12 10a1.5 1.5 0 0 1 3 0v2"/><path d="M15 11a1.5 1.5 0 0 1 3 0v2"/><path d="M18 12.5a1.5 1.5 0 0 1 3 0V17a5 5 0 0 1-5 5h-2.5a5 5 0 0 1-4.2-2.3L6 14.6a1.5 1.5 0 0 1 2.4-1.8L9 14"/></svg>
        ${esc(C.ui.reveal)}
      </div>
      <a class="btn-img" id="calBtn" href="event.ics" style="left:220px;top:${fy + 436}px;width:460px" aria-label="${esc(C.ui.addToCalendar)}">${el('cal-35', { w: 460, style: 'position:static' })}</a>
      ${words(fy + 562, `
        <div class="caps gold rise" style="font-size:17px;letter-spacing:.3em;--d:.2s" id="cdLabel">${esc(C.ui.countdown)}</div>
        <div class="countdown rise" id="countdown" style="margin-top:8px;--d:.35s"></div>
      `)}
      </div>
      ${['sw-35', 'sw-36', 'sw-37', 'sw-38', 'cal-34', 'cal-40', 'cal-54'].map((id, i) => el(id, { x: [60, 800, 420, 700, 150, 830, 40][i], y: [470, 520, 1140, 1180, 1300, 1010, 1240][i], w: 46 + (i % 3) * 14, cls: 'twinkle', t: 2.4 + i * .5, dl: -i * .7, z: 2 })).join('')}
      ${el('cal-36', { x: 415, y: fy + 24, w: 90, cls: 'twinkle', t: 3.2, op: .7, z: 0 })}
    `)}
    ${layer(4, petals(['sw-06', 'sw-19', 'sw-20', 'sw-21', 'sw-22', 'sw-25', 'sw-27', 'cal-18', 'cal-27', 'cal-31', 'cal-33', 'cal-37', 'cal-38', 'cal-39', 'cal-42', 'cal-43', 'cal-45', 'cal-46', 'cal-49', 'cal-50', 'cal-53', 'cal-04', 'cal-08', 'cal-09', 'cal-10', 'cal-12', 'cal-14', 'cal-16', 'cal-17', 'cal-19', 'cal-21', 'cal-22', 'cal-24', 'cal-26', 'cal-28', 'cal-29', 'cal-32', 'cal-44', 'cal-52', 'cal-55', 'cal-56', 'sw-18', 'sw-29', 'sw-30', 'sw-31', 'sw-32', 'sw-34', 'cal-15'], 18))}
  </div></section>`;
}

function venue() {
  const map = C.venue.mapPanel
    ? `<a class="hotspot" href="${esc(C.venue.mapsUrl)}" target="_blank" rel="noopener" aria-label="Open the venue in Google Maps" style="left:120px;top:740px;width:660px;height:430px"></a>
       ${el('ven-26', { x: 120, y: 740, w: 660, cls: 'bloom', d: .3, style: 'filter:drop-shadow(0 18px 40px rgba(0,0,0,.45))' })}
       <a class="hotspot" href="${esc(C.venue.mapsUrl)}" target="_blank" rel="noopener" aria-label="${esc(C.ui.takeMeThere)}" style="left:150px;top:1170px;width:600px;height:90px"></a>`
    : `<a class="map-plain bloom" href="${esc(C.venue.mapsUrl)}" target="_blank" rel="noopener" style="left:120px;top:740px;width:660px;height:340px;--d:.3s"><span><img class="pin" src="assets/el/ven-43.webp" alt=""><b>${esc(C.venue.area)}</b></span></a>
       <a class="btn-img" href="${esc(C.venue.mapsUrl)}" target="_blank" rel="noopener" style="left:200px;top:1110px;width:500px;height:90px;border:2px solid var(--gold);border-radius:999px;display:flex;align-items:center;justify-content:center;gap:14px;font-family:var(--caps);font-size:26px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);background:rgba(40,6,16,.5)">${esc(C.ui.takeMeThere)}</a>`;
  return `
  <section class="page" id="p-venue" data-title="Venue"><div class="stage">
    ${layer(0, emboss([
      ['ven-06', { r: 30, y: 300, w: 260 }], ['ven-13', { x: 30, y: 420, w: 210 }], ['ven-22', { x: 40, y: 1000, w: 220, rot: -15 }],
      ['ven-17', { r: 40, y: 1150, w: 190 }], ['cor-42', { x: 600, y: 540, w: 150, rot: 30 }], ['ven-09', { x: 120, y: 1240, w: 120 }], ['ven-08', { r: 200, y: 90, w: 80 }], ['ven-38', { x: 340, y: 1300, w: 220 }],
    ]))}
    ${layer(2, `
      ${el('ven-01', { x: 0, b: 0, w: 760, cls: 'bloom' })}
      ${el('ven-29', { r: -20, b: 0, w: 210, cls: 'bloom drift', t: 13, d: .2 })}
      ${el('ven-35', { r: 90, b: 180, w: 280, cls: 'bloom drift', t: 10, dl: -3, d: .3 })}
      ${el('ven-28', { x: 140, b: -10, w: 640, cls: 'bloom', d: .4, style: 'filter:drop-shadow(0 10px 30px rgba(0,0,0,.5))' })}
      ${el('ven-19', { x: 10, b: 340, w: 220, cls: 'bloom drift', t: 9, dl: -2, d: .35 })}
    `)}
    ${layer(3, `
      ${el('ven-05', { r: -60, y: -30, w: 560, cls: 'bloom drift', t: 11, op: .95 })}
      ${el('ven-42', { x: -80, b: 420, w: 520, cls: 'bloom drift', t: 12, dl: -4, op: .9 })}
      ${el('ven-02', { x: -70, y: -40, w: 360, cls: 'bloom drift', t: 10, dl: -1 })}
      ${el('ven-07', { r: 40, y: 150, w: 240, cls: 'bloom drift', t: 9, dl: -3, rot: 20 })}
      <div class="halo" style="right:30px;top:330px;width:260px;height:260px"></div>
      ${el('ven-10', { r: -30, y: 220, w: 300, cls: 'bloom sway glow', t: 7, d: .3 })}
      <div class="halo" style="left:10px;top:420px;width:200px;height:200px"></div>
      ${el('ven-16', { x: 40, y: 360, w: 110, cls: 'bloom sway glow', t: 8, dl: -2, d: .4 })}
      ${el('ven-14', { x: 30, y: 640, w: 150, cls: 'bloom drift', t: 9, dl: -1 })}
      ${el('ven-15', { r: 50, y: 620, w: 130, cls: 'bloom drift', t: 10, dl: -5 })}
      ${el('ven-27', { r: 20, y: 760, w: 150, cls: 'bloom drift', t: 8, dl: -2, rot: -15 })}
      ${el('ven-20', { x: 20, y: 820, w: 100, cls: 'bloom drift', t: 11, dl: -3 })}
      ${el('ven-30', { r: 30, y: 900, w: 130, cls: 'bloom drift', t: 9, dl: -4, rot: 20 })}
      ${el('ven-24', { x: 30, y: 1080, w: 100, cls: 'bloom drift', t: 10, dl: -2 })}
      ${el('ven-31', { r: 40, y: 1060, w: 80, cls: 'bloom drift', t: 9, dl: -5, rot: -15 })}
      ${el('ven-32', { x: 160, y: 1180, w: 50, cls: 'bloom drift', t: 8, dl: -3, rot: 25 })}
      ${el('ven-04', { r: 120, y: 1240, w: 160, cls: 'bloom drift', t: 11, dl: -1 })}
      ${el('ven-44', { x: 820, y: 170, w: 40, cls: 'twinkle', t: 5 })}
      <div class="mid">${words(150, `
        <img class="ornament rise" src="assets/el/ven-43.webp" alt="" style="width:74px;--d:.1s">
        <div class="row-gold rise" style="margin-top:12px;--d:.2s;gap:26px"><img src="assets/el/ven-36.webp" alt="" style="height:12px;width:150px"><span class="caps shadow" style="font-size:58px;letter-spacing:.36em;font-weight:400">Venue</span><img class="flip" src="assets/el/ven-36.webp" alt="" style="height:12px;width:150px"></div>
        <img class="ornament rise" src="assets/el/ven-37.webp" alt="" style="width:300px;margin-top:4px;--d:.3s">
        <div class="serif big rise shadow" style="margin-top:22px;--d:.4s">${C.venue.name.map(esc).join('<br>')}</div>
        <div class="serif soft rise shadow" style="font-size:32px;margin-top:22px;line-height:1.35;--d:.5s">${C.venue.address.map(esc).join('<br>')}</div>
        <img class="ornament rise" src="assets/el/ven-40.webp" alt="" style="width:220px;margin-top:18px;--d:.6s">
      `)}
      ${map}</div>
    `)}
    ${layer(4, petals(['ven-03', 'ven-11', 'ven-12', 'ven-21', 'ven-23', 'ven-25', 'ven-33', 'ven-34', 'ven-39', 'ven-41', 'ven-18'], 12))}
  </div></section>`;
}

function thanks() {
  return `
  <section class="page" id="p-thanks" data-title="Thank you"><div class="stage">
    ${layer(0, emboss([
      ['cor-32', { r: -40, y: 80, w: 360 }], ['cor-49', { x: 40, y: 460, w: 230, rot: -20 }], ['cor-37', { r: 60, y: 560, w: 200 }],
      ['cor-46', { x: 80, y: 1120, w: 190 }], ['cor-25', { r: 30, y: 400, w: 160 }], ['cor-18', { x: 500, y: 1020, w: 140, rot: 25 }], ['cor-51', { x: 560, y: 240, w: 200, rot: -20 }], ['nm-35', { x: 40, y: 900, w: 170, rot: 30 }],
    ]))}
    ${layer(2, `
      ${el('cor-13', { x: -160, b: 200, w: 760, cls: 'bloom drift', t: 12, op: .95 })}
      ${el('cor-09', { r: -80, b: -20, w: 560, cls: 'bloom drift', t: 11, dl: -4, op: .95 })}
      ${el('cor-07', { r: -160, y: -40, w: 700, cls: 'bloom drift', t: 10, dl: -2, op: .95 })}
      ${el('nm-31', { x: -70, b: 160, w: 230, cls: 'bloom drift', t: 13, d: .2 })}
    `)}
    ${layer(3, `
      ${el('cor-04', { x: -60, y: -30, w: 420, cls: 'bloom drift', t: 10 })}
      ${el('cor-small-blush-flower', { x: 20, y: 40, w: 230, cls: 'bloom drift', t: 9, dl: -2, d: .2 })}
      ${el('cor-53', { x: 250, y: 20, w: 150, cls: 'bloom drift', t: 8, dl: -1, rot: -20 })}
      ${el('cor-44', { r: 110, y: 70, w: 150, cls: 'bloom drift', t: 9, dl: -3 })}
      ${el('cor-14', { r: 40, y: 150, w: 170, cls: 'bloom drift', t: 11, dl: -5 })}
      ${el('cor-large-blush-flower', { r: -40, b: 40, w: 520, cls: 'bloom drift', t: 12, dl: -2, d: .3, style: 'filter:drop-shadow(0 16px 30px rgba(0,0,0,.45))' })}
      ${el('cor-burgundy-flower', { r: 380, b: 80, w: 300, cls: 'bloom drift', t: 10, dl: -4, d: .4 })}
      ${el('cor-rosebud', { r: 330, b: 330, w: 170, cls: 'bloom drift', t: 9, dl: -1, d: .5, rot: -25 })}
      ${el('cor-16', { r: 100, b: 520, w: 170, cls: 'bloom drift', t: 10, dl: -3, rot: 15 })}
      ${el('cor-40', { x: 110, b: 60, w: 190, cls: 'bloom drift', t: 11, dl: -2 })}
      ${el('cor-11', { x: 40, b: 330, w: 150, cls: 'bloom drift', t: 9, dl: -5 })}
      ${el('cor-39', { x: 150, b: 420, w: 170, cls: 'bloom drift', t: 10, dl: -1 })}
      ${el('cor-50', { x: 290, b: 120, w: 150, cls: 'bloom drift', t: 8, dl: -3 })}
      ${el('cor-20', { x: 260, b: 10, w: 170, cls: 'bloom drift', t: 9, dl: -2, rot: 20 })}
      ${el('cor-21', { r: 80, y: 760, w: 110, cls: 'bloom drift', t: 10, dl: -4, rot: -30 })}
      ${el('cor-52', { x: 30, y: 760, w: 120, cls: 'bloom drift', t: 11, dl: -6, rot: 40 })}
      ${el('cor-45', { r: 20, y: 560, w: 90, cls: 'bloom drift', t: 9, dl: -2 })}
      ${el('cor-54', { x: 180, y: 300, w: 100, cls: 'bloom drift', t: 10, dl: -4, rot: -25 })}
      ${el('cor-48', { r: 180, y: 300, w: 110, cls: 'bloom drift', t: 8, dl: -1, rot: 15 })}
      <div class="mid">${words(330, `
        <img class="ornament rise" src="assets/el/nm-26.webp" alt="" style="width:130px;--d:.1s">
        <div class="caps rise shadow" style="margin-top:10px;--d:.2s">${esc(C.thanks.over)}</div>
        <img class="ornament rise" src="assets/el/cal-41.webp" alt="" style="width:330px;--d:.3s">
        <div class="script rise" style="font-size:176px;margin-top:10px;--d:.45s">${esc(C.thanks.title)}</div>
        <div class="serif rise shadow" style="font-size:40px;margin-top:4px;--d:.6s">${C.thanks.lines.map(esc).join('<br>')}</div>
        <img class="ornament rise" src="assets/el/cal-48.webp" alt="" style="width:300px;margin-top:14px;--d:.7s">
        <div class="caps gold rise" style="font-size:22px;margin-top:14px;--d:.8s">${esc(C.thanks.from)}</div>
        ${guest ? `<div class="serif soft rise shadow" style="font-style:italic;font-size:32px;margin-top:14px;--d:.85s">With love, for ${esc(guest)}</div>` : ''}
        <div class="rise" style="margin-top:34px;--d:.95s"><button class="share-btn" id="shareBtn" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>${esc(C.ui.share)}</button></div>
      `)}</div>
      <div class="words" style="top:calc(var(--sh) * 1px - 70px)"><p class="credit" style="margin:0">Designed by <a href="https://invitivals.com/?utm_source=invitation&amp;utm_medium=footer&amp;utm_campaign=${esc(C.creditCampaign)}" target="_blank" rel="noopener">Invitivals</a></p></div>
    `)}
    ${layer(4, petals(['cor-10', 'cor-17', 'cor-22', 'cor-23', 'cor-24', 'cor-26', 'cor-27', 'cor-28', 'cor-29', 'cor-30', 'cor-31', 'cor-33', 'cor-34', 'cor-35', 'cor-41', 'cor-55'], 14))}
  </div></section>`;
}

/* ── the stage's scale: fit the width; the height follows the screen ────────────────────────────── */
function fit() {
  const vw = Math.min(innerWidth, 560), vh = innerHeight;
  const k = vw / 900;
  const sh = Math.max(1600, Math.min(2100, Math.round(vh / k)));
  document.documentElement.style.setProperty('--k', k.toFixed(5));
  /* the envelope must be seen whole, so on a short window it is scaled to the height */
  document.documentElement.style.setProperty('--kd', Math.min(k, vh / sh).toFixed(5));
  document.documentElement.style.setProperty('--sh', String(sh));
  return sh;
}
fit();

/* ── build ─────────────────────────────────────────────────────────────────────────────────────── */
const world = document.getElementById('world');
function render() { world.innerHTML = hero() + date() + venue() + thanks(); }
render();
document.body.insertAdjacentHTML('afterbegin', envelope());
document.body.classList.add('is-closed');
document.title = `${C.couple.short} · ${C.occasion} · Designed by Invitivals`;

/* ── chrome: music, dots, calendar sheet, share, toast ──────────────────────────────────────────── */
const audio = new Audio(C.music); audio.loop = true; audio.volume = 0; audio.preload = 'none';
const musicBtn = document.createElement('button');
musicBtn.className = 'music'; musicBtn.type = 'button'; musicBtn.setAttribute('aria-label', 'Pause music'); musicBtn.title = C.musicTitle || 'Music';
musicBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>`;
let fade;
const fadeTo = (v, ms = 1500) => { clearInterval(fade); const from = audio.volume, t0 = performance.now(); fade = setInterval(() => { const q = Math.min(1, (performance.now() - t0) / ms); audio.volume = from + (v - from) * q; if (q === 1) { clearInterval(fade); if (v === 0) audio.pause(); } }, 40); };
const play = () => audio.play().then(() => { fadeTo(.6); musicBtn.classList.add('is-playing'); }).catch(() => musicBtn.classList.remove('is-playing'));
musicBtn.addEventListener('click', () => { if (musicBtn.classList.contains('is-playing')) { fadeTo(0, 400); musicBtn.classList.remove('is-playing'); } else play(); });
document.addEventListener('visibilitychange', () => { if (!musicBtn.classList.contains('is-playing')) return; document.hidden ? audio.pause() : audio.play().catch(() => {}); });
document.body.appendChild(musicBtn);

const dots = document.createElement('nav'); dots.className = 'dots'; dots.setAttribute('aria-label', 'Pages');
const pages = [...document.querySelectorAll('section.page')];
dots.innerHTML = pages.map((p, i) => `<button type="button" data-i="${i}" aria-label="${esc(p.dataset.title)}"${i ? '' : ' class="on"'}></button>`).join('');
dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) pages[+b.dataset.i].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); });
document.body.appendChild(dots);

const toast = document.createElement('div'); toast.className = 'toast'; document.body.appendChild(toast);
let toastT; const say = (m) => { toast.textContent = m; toast.classList.add('is-shown'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('is-shown'), 2600); };

/* the calendar: Google on the web, the .ics file for Apple and Outlook */
const utc = (iso) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(C.event.title)}&dates=${utc(C.event.start)}/${utc(C.event.end)}&details=${encodeURIComponent(`${C.occasion} · ${C.event.day}, ${C.event.date} · ${C.event.time}`)}&location=${encodeURIComponent([...C.venue.name, ...C.venue.address].join(' '))}`;
const sheet = document.createElement('div'); sheet.className = 'sheet';
sheet.innerHTML = `<div><h3>${esc(C.ui.addToCalendar)}</h3>
  <a href="${gcal}" target="_blank" rel="noopener">Google Calendar<small>opens in a new tab</small></a>
  <a href="event.ics" download="${esc(C.slug)}.ics">Apple · Outlook · others<small>downloads a calendar file</small></a>
  <button class="close" type="button">Close</button></div>`;
sheet.addEventListener('click', (e) => { if (e.target === sheet || e.target.closest('.close') || e.target.closest('a')) sheet.classList.remove('is-open'); });
document.body.appendChild(sheet);
document.getElementById('calBtn').addEventListener('click', (e) => { e.preventDefault(); sheet.classList.add('is-open'); });

document.getElementById('shareBtn').addEventListener('click', async () => {
  const url = location.origin + location.pathname;
  try {
    if (navigator.share) await navigator.share({ title: C.share.title, text: C.share.text, url });
    else { await navigator.clipboard.writeText(`${C.share.text}\n${url}`); say('Invitation link copied'); }
  } catch { /* the guest closed the share sheet */ }
});

/* ── countdown ─────────────────────────────────────────────────────────────────────────────────── */
const cd = document.getElementById('countdown'), cdLabel = document.getElementById('cdLabel');
function tick() {
  const now = Date.now(), start = +new Date(C.event.start), end = +new Date(C.event.end);
  if (now >= start && now <= end) { cdLabel.textContent = C.ui.today; cd.innerHTML = ''; return; }
  if (now > end) { cdLabel.textContent = C.ui.past; cd.innerHTML = ''; return; }
  let s = Math.floor((start - now) / 1000);
  const d = Math.floor(s / 86400); s -= d * 86400; const hh = Math.floor(s / 3600); s -= hh * 3600; const m = Math.floor(s / 60); s -= m * 60;
  const unit = (v, l) => `<div class="unit"><b>${String(v).padStart(2, '0')}</b><small>${l}</small></div>`;
  cd.innerHTML = unit(d, 'days') + unit(hh, 'hours') + unit(m, 'mins') + unit(s, 'secs');
}
tick(); setInterval(tick, 1000);

/* ── the date under its gold cover ─────────────────────────────────────────────────────────────── */
(function scratch() {
  const box = document.getElementById('scratch'), cv = document.getElementById('scratchCanvas'), hint = document.getElementById('scratchHint');
  const page = document.getElementById('p-date'), ctx = cv.getContext('2d');
  const img = new Image(); img.src = 'assets/el/cal-47.webp';
  img.onload = () => { ctx.drawImage(img, 0, 0, cv.width, cv.height); };
  let down = false, travelled = 0, done = false, last = null;
  const pt = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
  const finish = () => { if (done) return; done = true; box.classList.add('done'); hint.style.opacity = '0'; page.classList.remove('hidden-date'); };
  const rub = (p) => {
    ctx.globalCompositeOperation = 'destination-out'; ctx.lineCap = 'round'; ctx.lineWidth = 70;
    ctx.beginPath(); ctx.moveTo(...(last || p)); ctx.lineTo(...p); ctx.stroke();
    ctx.beginPath(); ctx.arc(p[0], p[1], 35, 0, Math.PI * 2); ctx.fill();
    if (last) travelled += Math.hypot(p[0] - last[0], p[1] - last[1]);
    last = p;
    if (travelled > 1500) finish();
  };
  box.addEventListener('pointerdown', (e) => { down = true; last = null; box.setPointerCapture(e.pointerId); rub(pt(e)); hint.style.opacity = '.4'; });
  box.addEventListener('pointermove', (e) => { if (down) rub(pt(e)); });
  const up = () => { down = false; last = null; if (travelled > 500) finish(); };
  box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
  box.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') finish(); });
  box.tabIndex = 0; box.setAttribute('role', 'button'); box.setAttribute('aria-label', C.ui.reveal);
})();

/* ── pages wake as they come into view; a page that leaves goes still ──────────────────────────── */
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) e.target.classList.add('in');
}), { threshold: .28 });
const dotBtns = [...dots.querySelectorAll('button')];
function current() {
  const vh = innerHeight; let best = 0, bd = Infinity;
  pages.forEach((p, i) => { const r = p.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - vh / 2); if (d < bd) { bd = d; best = i; } });
  dotBtns.forEach((b, j) => b.classList.toggle('on', j === best));
}
addEventListener('scroll', current, { passive: true });
pages.forEach((p) => io.observe(p));

/* ── parallax: the scenery leans a little with the scroll ──────────────────────────────────────── */
if (!reduced) {
  let raf = 0;
  const lean = () => {
    raf = 0;
    const vh = innerHeight;
    for (const p of pages) {
      const r = p.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) continue;
      const t = (r.top + r.height / 2 - vh / 2) / vh;           // -0.5 … 0.5 while on screen
      p.querySelector('.layer.z2').style.transform = `translateY(${(t * -34).toFixed(1)}px)`;
      p.querySelector('.layer.z4').style.transform = `translateY(${(t * 26).toFixed(1)}px)`;
    }
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(lean); }, { passive: true });
  lean();
}

/* ── the envelope opens ────────────────────────────────────────────────────────────────────────── */
const door = document.getElementById('door');
document.getElementById('sealBtn').addEventListener('click', () => {
  play();
  door.classList.add('is-open');
  setTimeout(() => {
    door.classList.add('is-gone');
    document.body.classList.remove('is-closed');
    scrollTo(0, 0);
    pages[0].classList.add('in');
    musicBtn.classList.add('is-shown'); dots.classList.add('is-shown');
    setTimeout(() => door.remove(), 1600);
  }, 1900);
}, { once: true });
if (new URLSearchParams(location.search).has('open')) { door.remove(); document.body.classList.remove('is-closed'); pages[0].classList.add('in'); musicBtn.classList.add('is-shown'); dots.classList.add('is-shown'); }

/* a rotated or resized screen re-fits the stage; every position follows --sh, so nothing is rebuilt */
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fit, 120); });
