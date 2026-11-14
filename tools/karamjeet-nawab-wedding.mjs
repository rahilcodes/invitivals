/* Karamjeet Kaur & Nawab Singh Sekhon — the artwork of public/karamjeet-nawab-wedding.
 *
 *   node --experimental-websocket tools/karamjeet-nawab-wedding.mjs        everything
 *   node --experimental-websocket tools/karamjeet-nawab-wedding.mjs art    only the pictures made with sharp
 *
 * The page is a separate invitation on the Brown Theme design. public/vaishali-arpan-wedding (another client's
 * page, the design reference) and public/brown-theme-wedding (the demo) are only READ here, never written.
 *
 * What it makes, all inside public/karamjeet-nawab-wedding:
 *  - assets/couple.webp     the client's Sikh couple (invites/src/karamjeet-nawab-wedding/couple.jpg). The file
 *                           arrived as a JPEG on black, so its background is cut here: only the black that touches
 *                           the picture's border goes, the edge is pulled in a pixel and its colour taken from
 *                           inside, so no dark fringe is left around the clothes.
 *  - assets/plate1.webp     the hero plate without the design's own painted couple (the wall, the arch's frame and
 *                           the curtain are continued down behind where they stood) and with its butterfly painted
 *                           back in from the design's reference page.
 *  - assets/plate2/5.webp   the same for their butterflies: the reference design moved butterfly cut-outs over
 *                           filled holes, and the fills showed as grey smudges. Here every butterfly is the
 *                           reference page's own painting, part of the plate, so nothing can come apart.
 *                           plate5 also loses its painted card and painted buttons (the page has its own).
 *  - assets/seal.png, opening.webp   the wax seal with a plain embossed flower instead of any initials.
 *  - assets/ik-onkar.webp   the Ik Onkar over the hero.
 *  - assets/og.jpg          the link preview.
 *  - event.ics, event-19dec.ics
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'karamjeet-nawab-wedding';
const DIR = path.join(ROOT, 'public', SLUG);
const A = path.join(DIR, 'assets');
const REF = path.join(ROOT, 'public', 'vaishali-arpan-wedding', 'assets');   // read only
const DEMO = path.join(ROOT, 'public', 'brown-theme-wedding', 'assets');      // read only
const PACK = path.join(ROOT, 'invites', 'src', 'brown-theme-wedding-zip', 'brown theme wedding', 'with text temp');
const SRC = path.join(ROOT, 'invites', 'src', SLUG);
const only = process.argv[2] || '';
const W = 941, H = 1672;

const raw = async (file) => { const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); return { d: data, w: info.width, h: info.height }; };
const save = (img, file, q = 90) => sharp(img.d, { raw: { width: img.w, height: img.h, channels: 4 } }).removeAlpha().webp({ quality: q }).toFile(file);

/* ── the couple: cut from black ── */
async function couple() {
  const { d, w, h } = await raw(path.join(SRC, 'couple.jpg'));
  const N = w * h, bg = new Uint8Array(N), T = 16;
  const dark = (i) => d[i * 4] <= T && d[i * 4 + 1] <= T && d[i * 4 + 2] <= T;
  const stack = [];
  const push = (x, y) => { const i = y * w + x; if (!bg[i] && dark(i)) { bg[i] = 1; stack.push(i); } };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) { const i = stack.pop(), x = i % w, y = (i / w) | 0; if (x) push(x - 1, y); if (x < w - 1) push(x + 1, y); if (y) push(x, y - 1); if (y < h - 1) push(x, y + 1); }
  /* distance (chessboard, up to 4) of every figure pixel from the background */
  const dist = new Uint8Array(N).fill(9);
  for (let i = 0; i < N; i++) if (bg[i]) dist[i] = 0;
  for (let pass = 1; pass <= 4; pass++) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (dist[i] !== 9) continue;
    let near = false; for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= w || Y >= h) continue; if (dist[Y * w + X] === pass - 1) { near = true; break; } }
    if (near) dist[i] = pass; }
  /* the outermost two pixels carry the black mixed in: the first goes, the next two take the colour found further inside */
  const out = Buffer.from(d);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x, k = dist[i];
    if (k === 0 || k === 1) { out[i * 4 + 3] = 0; continue; }
    if (k <= 3) { let r = 0, g = 0, b = 0, n = 0;
      for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= w || Y >= h) continue; const j = Y * w + X; if (dist[j] >= 4) { r += d[j * 4]; g += d[j * 4 + 1]; b += d[j * 4 + 2]; n++; } }
      if (n) { out[i * 4] = r / n; out[i * 4 + 1] = g / n; out[i * 4 + 2] = b / n; } }
    out[i * 4 + 3] = 255; }
  /* a soft edge: the alpha alone is blurred a little */
  const alpha = Buffer.alloc(N); for (let i = 0; i < N; i++) alpha[i] = out[i * 4 + 3];
  const soft = await sharp(alpha, { raw: { width: w, height: h, channels: 1 } }).blur(0.9).toColourspace('b-w').extractChannel(0).raw().toBuffer();
  for (let i = 0; i < N; i++) out[i * 4 + 3] = Math.min(out[i * 4 + 3] ? 255 : 110, soft[i]);
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 90, alphaQuality: 95 }).toFile(path.join(A, 'couple.webp'));
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toFile(path.join(SRC, 'couple-cut.png'));
  console.log(`✓ couple.webp ${w}×${h}`);
}

/* a rectangle of the reference page laid back over the plate, feathered at its border */
function pasteRef(plate, ref, bx, pad = 2.2, feather = 7, maxX = 100) {
  const x0 = Math.max(0, Math.round(((bx.x - pad) / 100) * plate.w)), x1 = Math.min(plate.w, Math.round((Math.min(maxX, bx.x + bx.w + pad) / 100) * plate.w));
  const y0 = Math.max(0, Math.round(((bx.y - pad * 0.6) / 100) * plate.h)), y1 = Math.min(plate.h, Math.round(((bx.y + bx.h + pad * 0.6) / 100) * plate.h));
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const e = Math.min(x0 === 0 ? 99 : x - x0, x1 === plate.w ? 99 : x1 - 1 - x, y - y0, y1 - 1 - y);
    const a = Math.min(1, (e + 1) / feather), i = (y * plate.w + x) * 4;
    for (let c = 0; c < 3; c++) plate.d[i + c] = Math.round(plate.d[i + c] * (1 - a) + ref.d[i + c] * a);
  }
}

/* a block filled by carrying each column's colour from the row above the block to the row below it */
function fillDown(p, x0p, x1p, y0p, y1p, feather = 6) {
  const x0 = Math.round((x0p / 100) * p.w), x1 = Math.round((x1p / 100) * p.w), y0 = Math.round((y0p / 100) * p.h), y1 = Math.round((y1p / 100) * p.h);
  const band = (x, y, c) => { let s = 0, n = 0; for (let dx = -2; dx <= 2; dx++) for (let dy = -3; dy <= 0; dy++) { const X = Math.min(p.w - 1, Math.max(0, x + dx)); s += p.d[((y + dy) * p.w + X) * 4 + c]; n++; } return s / n; };
  const bandB = (x, y, c) => { let s = 0, n = 0; for (let dx = -2; dx <= 2; dx++) for (let dy = 0; dy <= 3; dy++) { const X = Math.min(p.w - 1, Math.max(0, x + dx)); s += p.d[((y + dy) * p.w + X) * 4 + c]; n++; } return s / n; };
  const src = Buffer.from(p.d);
  for (let x = x0; x < x1; x++) for (let c = 0; c < 3; c++) {
    const top = band(x, y0 - 1, c), bot = bandB(x, y1, c);
    for (let y = y0; y < y1; y++) {
      /* the wall above is carried down; only the last rows lean towards what lies under the block */
      const t0 = (y - y0 + 0.5) / (y1 - y0), t = t0 < 0.86 ? 0 : (t0 - 0.86) / 0.14, v = top * (1 - t) + bot * t;
      const e = Math.min(x - x0, x1 - 1 - x), a = Math.min(1, (e + 1) / feather), i = (y * p.w + x) * 4 + c;
      p.d[i] = Math.round(src[i] * (1 - a) + v * a);
    }
  }
}

async function plates() {
  const art = JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'vaishali-arpan-wedding', 'js', 'art.js'), 'utf8').match(/export const art = (\{.*\});/s)[1]);

  /* plate 1 */
  const p1 = await raw(path.join(DEMO, 'plate1.webp')), r1 = await raw(path.join(PACK, '1.png'));
  pasteRef(p1, r1, art['p1-butterfly']);
  /* the painted couple stood on x > 57 %, y > 55 %. Each row takes the pattern of the band just over their heads
     (the wall, the arch's gold frame, the curtain), lit as that row's own wall is at the left of the block. */
  const X0 = Math.round(0.535 * W), Y0 = Math.round(0.553 * H), XL0 = Math.round(0.455 * W), XL1 = Math.round(0.505 * W);
  const rowMean = (y) => { const m = [0, 0, 0]; for (let x = XL0; x < XL1; x++) for (let c = 0; c < 3; c++) m[c] += p1.d[(y * W + x) * 4 + c]; return m.map((v) => v / (XL1 - XL0)); };
  const pat = []; const B0 = Math.round(0.515 * H), B1 = Math.round(0.548 * H);
  for (let x = 0; x < W; x++) { const m = [0, 0, 0]; for (let y = B0; y < B1; y++) for (let c = 0; c < 3; c++) m[c] += p1.d[(y * W + x) * 4 + c]; pat.push(m.map((v) => v / (B1 - B0))); }
  const base = [0, 0, 0]; for (let y = B0; y < B1; y++) { const m = rowMean(y); for (let c = 0; c < 3; c++) base[c] += m[c] / (B1 - B0); }
  let seed = 7; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296 - 0.5);
  const src1 = Buffer.from(p1.d);
  for (let y = Y0; y < H; y++) { const m = rowMean(y);
    for (let x = X0 - 24; x < W; x++) { const i = (y * W + x) * 4; const ax = Math.min(1, Math.max(0, (x - (X0 - 24)) / 24)), ay = Math.min(1, (y - Y0 + 1) / 22), a = ax * ay, g = rnd() * 3;
      for (let c = 0; c < 3; c++) { const v = Math.min(255, Math.max(0, (pat[x][c] * m[c]) / base[c] + g)); p1.d[i + c] = Math.round(src1[i + c] * (1 - a) + v * a); } } }
  /* soften the continued part a little along the vertical, so it reads as wall and cloth, not stripes */
  const soft = await sharp(p1.d, { raw: { width: W, height: H, channels: 4 } }).extract({ left: X0 - 24, top: Y0, width: W - X0 + 24, height: H - Y0 }).blur(1.6).raw().toBuffer();
  const sw = W - X0 + 24;
  for (let y = Y0 + 20; y < H; y++) for (let x = X0; x < W; x++) { const i = (y * W + x) * 4, j = ((y - Y0) * sw + (x - X0 + 24)) * 4; for (let c = 0; c < 3; c++) p1.d[i + c] = soft[j + c]; }
  await save(p1, path.join(A, 'plate1.webp'));

  /* plate 2 */
  const p2 = await raw(path.join(DEMO, 'plate2.webp')), r2 = await raw(path.join(PACK, '2.png'));
  pasteRef(p2, r2, art['p2-butterfly-a']); pasteRef(p2, r2, art['p2-butterfly-b'], 2.2, 7, 31.2); /* the reference's open parchment begins at 31.7 % */
  await save(p2, path.join(A, 'plate2.webp'));

  /* plate 5: the reference client's retouched plate (no ghost lettering), butterflies painted back, and the
     painted card and buttons taken out: the page lays its own card and buttons there */
  const p5 = await raw(path.join(REF, 'plate5.webp')), r5 = await raw(path.join(PACK, '5.png'));
  for (const k of ['p5-butterfly-a', 'p5-butterfly-b', 'p5-butterfly-c']) pasteRef(p5, r5, art[k], 1.4, 5);
  fillDown(p5, 24.5, 75.5, 39.4, 52.9);
  fillDown(p5, 11.3, 88.7, 53.1, 60.3); /* wholly under the page's own two buttons (11–89 %, 52.9–60.4 %) */
  await save(p5, path.join(A, 'plate5.webp'));
  console.log('✓ plate1 (no painted couple), plate2, plate5 (butterflies painted in, no painted buttons)');
}

/* ── calendar files ── */
function ics() {
  const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75; while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; } out.push(b.toString('utf8')); return out.join('\r\n '); };
  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const URL_ = `https://invitivals.com/${SLUG}/`;
  const make = (file, uid, start, end, summary, location, description) => {
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Karamjeet Kaur & Nawab Singh Sekhon Wedding//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
      'BEGIN:VEVENT', `UID:${uid}@invitivals.com`, 'DTSTAMP:20261114T000000Z', `DTSTART;TZID=Asia/Kolkata:${start}`, `DTEND;TZID=Asia/Kolkata:${end}`,
      `SUMMARY:${esc(summary)}`, `LOCATION:${esc(location)}`, `DESCRIPTION:${esc(description)}`, `URL:${URL_}`,
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(summary)} tomorrow`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'];
    fs.writeFileSync(path.join(DIR, file), lines.map(fold).join('\r\n') + '\r\n');
  };
  make('event.ics', `${SLUG}-20261220`, '20261220T090000', '20261220T170000', 'Wedding of Karamjeet Kaur & Nawab Singh Sekhon', 'The Regal Classic, Dirba',
    'Wedding Ceremony\n9:00 AM – Arrival of Barat\n10:30 AM – Anand Karaj\n12:00 PM – Wedding Lunch\n4:00 PM – Vidai\n\nMap: https://maps.app.goo.gl/ADWkDFmXzhfkApjC6');
  make('event-19dec.ics', `${SLUG}-20261219`, '20261219T150000', '20261219T210000', 'Karamjeet Kaur & Nawab Singh Sekhon · Shagan & Jago', 'Our Residence, Village Seona, PO Badshahpur',
    'Pre-Wedding Celebrations\n3:00 PM – Shagan Ceremony\n6:00 PM – Jago Ceremony');
  console.log('✓ event.ics, event-19dec.ics');
}

if (only === 'couple') { await couple(); process.exit(0); }
if (only === 'ics') { ics(); process.exit(0); }
await couple();
await plates();
ics();
if (only === 'art') process.exit(0);

/* ── headless Chrome: the seal's flower, the Ik Onkar and the link preview ── */
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9357;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const url = (p) => pathToFileURL(p).href;
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Playfair+Display:ital,wght@1,500&family=Noto+Sans+Gurmukhi:wght@500&display=block" rel="stylesheet">';
const READY = `<script>Promise.all([document.fonts.ready,document.fonts.load('500 200px "Noto Sans Gurmukhi"','ੴ'),...[...document.images].map(i=>i.decode().catch(()=>{}))]).then(()=>{document.title='ready'})</script>`;

/* the seal face on the demo's poster (947×1660): centre and radius, as measured for the reference page */
const SEAL = { cx: 490, cy: 830, r: 97 };
const petals = Array.from({ length: 8 }, (_, i) => `<path transform="rotate(${i * 45} 100 100)" d="M100 96C88 78 88 52 100 34c12 18 12 44 0 62z"/>`).join('');
const petals2 = Array.from({ length: 8 }, (_, i) => `<path transform="rotate(${i * 45 + 22.5} 100 100)" d="M100 92c-6-10-6-24 0-34 6 10 6 24 0 34z"/>`).join('');
const sealHtml = `<!DOCTYPE html><meta charset="utf-8"><style>
*{margin:0}html,body{background:transparent}body{width:${SEAL.r * 4}px;height:${SEAL.r * 4}px;position:relative}
.face{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 42% 36%,#d3a872 0%,#c6975f 45%,#b4824c 78%,#a8753f 100%)}
.rim{position:absolute;inset:4%;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(255,236,200,.35),inset 0 3px 6px rgba(255,240,210,.35),inset 0 -4px 8px rgba(90,50,20,.3)}
svg{position:absolute;inset:13%;width:74%;height:74%;filter:drop-shadow(0 2px 2px rgba(70,35,10,.5)) drop-shadow(0 -1px 1px rgba(255,240,210,.4))}
</style><div class="face"></div><div class="rim"></div>
<svg viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe9a8"/><stop offset=".45" stop-color="#f0b93c"/><stop offset="1" stop-color="#c98a1c"/></linearGradient></defs>
<circle cx="100" cy="100" r="88" fill="none" stroke="url(#g)" stroke-width="4"/><circle cx="100" cy="100" r="78" fill="none" stroke="url(#g)" stroke-width="1.6" stroke-dasharray="1.5 6" stroke-linecap="round"/>
<g fill="url(#g)">${petals}${petals2}<circle cx="100" cy="100" r="9"/></g><circle cx="100" cy="100" r="4" fill="#b4824c"/></svg>${READY}`;

const ikHtml = `<!DOCTYPE html><meta charset="utf-8">${FONTS}<style>*{margin:0}html,body{background:transparent}body{width:520px;height:420px;display:flex;align-items:center;justify-content:center}
p{font:500 260px/1 'Noto Sans Gurmukhi',sans-serif;background:linear-gradient(160deg,#b9862f,#7a4a14 55%,#a87428);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 3px 2px rgba(255,236,196,.9)) drop-shadow(0 -1px 1px rgba(80,40,10,.25))}
</style><p>ੴ</p>${READY}`;

const ogHtml = `<!DOCTYPE html><meta charset="utf-8">${FONTS}<style>
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;overflow:hidden;position:relative;background:#e9cfa8;font-variant-numeric:lining-nums}
.bg{position:absolute;left:0;top:-330px;width:1200px;height:2132px}
.fl{position:absolute;left:-60px;top:-90px;width:400px}
.cp{position:absolute;right:26px;bottom:-150px;height:700px;filter:drop-shadow(0 0 26px rgba(255,232,186,.75))}
.veil{position:absolute;left:0;right:0;bottom:0;height:120px;background:linear-gradient(transparent,rgba(240,220,186,.92))}
.c{position:absolute;left:150px;width:640px;top:0;height:630px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding-top:6px}
.k{font:600 20px 'Cormorant Garamond',serif;letter-spacing:.36em;padding-left:.36em;color:#8a5a1e}
.n{margin-top:10px;font:italic 500 62px/1.12 'Playfair Display',Georgia,serif;letter-spacing:.01em;background:linear-gradient(180deg,#7b1e2b,#5a1420 55%,#7b1e2b);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 2px 2px rgba(255,235,200,.85));white-space:nowrap}
.a{font:600 19px 'Cormorant Garamond',serif;letter-spacing:.4em;padding-left:.4em;color:#8a5a1e;margin:10px 0 0}
.d{margin-top:24px;font:700 28px 'Cormorant Garamond',serif;letter-spacing:.14em;padding-left:.14em;color:#4a291b}
.p{margin-top:6px;font:600 18px 'Cormorant Garamond',serif;letter-spacing:.3em;padding-left:.3em;color:#8a5a1e}
</style>
<img class="bg" src="${url(path.join(A, 'plate1.webp'))}"><img class="fl" src="${url(path.join(A, 'p1-flowers-a.webp'))}"><img class="cp" src="${url(path.join(SRC, 'couple-cut.png'))}"><div class="veil"></div>
<div class="c"><p class="k">WEDDING INVITATION</p><p class="n">Karamjeet Kaur</p><p class="a">WEDS</p><p class="n">Nawab Singh Sekhon</p><p class="d">20 DECEMBER 2026</p><p class="p">THE REGAL CLASSIC · DIRBA</p></div>${READY}`;

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'inv-kn-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--remote-allow-origins=*', `--user-data-dir=${path.join(work, 'profile')}`,
  '--allow-file-access-from-files', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
try {
  let target;
  for (let i = 0; i < 40 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page'); } catch {} }
  if (!target) throw new Error('Chrome did not start — set CHROME to its path');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); } };
  const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
  await send('Page.enable');
  const shot = async (html, w, h, transparent) => {
    const page = path.join(work, `p${++id}.html`); fs.writeFileSync(page, html);
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    await send('Emulation.setDefaultBackgroundColorOverride', transparent ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {});
    await send('Page.navigate', { url: url(page) });
    for (let i = 0; i < 60; i++) { await sleep(250); const r = await send('Runtime.evaluate', { expression: 'document.title' }); if (r.result.value === 'ready') break; }
    await sleep(500);
    return Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64');
  };
  const sealPng = await shot(sealHtml, SEAL.r * 4, SEAL.r * 4, true);
  const face = await sharp(sealPng).resize(SEAL.r * 2, SEAL.r * 2).png().toBuffer();
  await sharp(path.join(DEMO, 'opening.webp')).composite([{ input: face, left: SEAL.cx - SEAL.r, top: SEAL.cy - SEAL.r }]).webp({ quality: 92 }).toFile(path.join(A, 'opening.webp'));
  await sharp(sealPng).png().toFile(path.join(A, 'seal.png'));
  console.log('✓ opening.webp, seal.png (a flower on the seal, no initials)');
  await sharp(await shot(ikHtml, 520, 420, true)).trim().resize({ height: 220 }).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(A, 'ik-onkar.webp'));
  const ik = await sharp(path.join(A, 'ik-onkar.webp')).metadata(); console.log(`✓ ik-onkar.webp ${ik.width}×${ik.height}`);
  await sharp(await shot(ogHtml, 1200, 630, false)).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(A, 'og.jpg'));
  console.log('✓ og.jpg');
  ws.close();
} finally { chrome.kill(); await sleep(400); try { fs.rmSync(work, { recursive: true, force: true }); } catch {} }
