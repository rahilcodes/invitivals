/* Vaishali & Arpan, bride-side wedding (18–20 Nov 2026, Delhi), on the Brown Theme Wedding demo.
 *
 *   node --experimental-websocket tools/vaishali-arpan-wedding.mjs        everything below
 *   node --experimental-websocket tools/vaishali-arpan-wedding.mjs og     only the opening seal + og.jpg
 *   node --experimental-websocket tools/vaishali-arpan-wedding.mjs art    only the retouched frame and plates
 *
 * The page (index.html, config.js, css/, js/) lives in public/vaishali-arpan-wedding/ and is the demo's
 * own engine (plates + overlay boxes in %) with the client's words as live text. This tool prepares its assets:
 *  - the demo's plates, florals, butterflies, lanterns, pins, rules, buttons and music, copied as they are
 *    (public/brown-theme-wedding is only read, never written);
 *  - the client's four photos and the dress-code circles from invites/src/vaishali-arpan-wedding/
 *    (73.jpg reference, 74–77.jpg couple), only resized / cropped / converted, never retouched;
 *  - the opening envelope: the demo's poster with the seal's "CL" replaced by "VA" (the only part painted here,
 *    because the pack has no cover for this couple); the demo's door film plays with its seal covered by seal.png until it breaks;
 *  - three .ics files (one per day, start times only, no invented end times) and assets/og.jpg, 1200×630,
 *    the demo's hero plate with the names inside the centre 630 px square (WhatsApp's square crop).
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'vaishali-arpan-wedding';
const SRC = path.join(ROOT, 'invites/src', SLUG);
const DEMO = path.join(ROOT, 'public/brown-theme-wedding/assets');
const OUT = path.join(ROOT, 'public', SLUG);
const A = path.join(OUT, 'assets');
const only = process.argv[2];
/* "og <slug> <DATES>": only og.jpg, into public/<slug>/assets with that date line (the shorter links made by
   tools/vaishali-arpan-wedding-variants.mjs); the seal and this folder's files are left alone */
const VAR = only === 'og' && process.argv[3] ? { slug: process.argv[3], dates: process.argv[4] } : null;
fs.mkdirSync(A, { recursive: true });

/* ── the three days, for the calendar files ── */
const DAYS = [
  { file: 'event-18nov.ics', start: '20261118T110000', title: 'Vaishali & Arpan · A Day of Love, Colours & Celebrations',
    venue: 'Vyom Luxury Gym and Wellness, Near True Value, Sector 16, Rohini, Delhi', map: 'https://share.google/XcZWmq2nKNx3zUg58',
    lines: ['Dress Code: Pastel Colour Theme', '11:00 AM – Guest Welcome Lunch', '1:00 PM – Radha Krishna Phoolon Ki Haldi', '2:00 PM onwards – Pool Party (Note- Come dressed in your pastel best and enjoy the water fun! If joining, do carry an extra outfit for the evening Mehendi. Please note, only shower rooms are available; no changing rooms.)', '4:00 PM onwards – Mehendi', '5:00 PM – Bhaat', '7:00 PM onwards – DJ Night', '8:00 PM – Dinner'] },
  { file: 'event-19nov.ics', start: '20261119T190000', title: 'Vaishali & Arpan · The Engagement Celebration',
    venue: 'Golden Apple Mansion, Hall No. 2, Darbaar Hall, Pitampura, Delhi', map: 'https://share.google/7iebx6d5qkqSQan4a',
    lines: ['7:00 PM – Engagement Ceremony', '8:00 PM onwards – Dinner'] },
  { file: 'event.ics', start: '20261120T200000', title: 'Wedding of Vaishali & Arpan',
    venue: 'The Sherioan By Kawatra Tent, Colosseum Hall, Pitampura, Delhi – 110034 (Near DCP Office, Outer District)', map: 'https://share.google/6FekKRjN2AlnVlOxE',
    lines: ['The Wedding Celebration', '8:00 PM – Welcome of Baraat', '9:00 PM – Dinner', 'Vidaai – Taron Ki Chhaon Mein'] },
];

if (only !== 'og') {
  /* the demo's art and music, as they are */
  const demo = ['plate1', 'plate2', 'plate3', 'plate4', 'plate5', 'plate6', 'plate7', 'plate8',
    'p1-flowers-a', 'p1-flowers-b', 'p1-butterfly', 'p1-rule1', 'p1-ganesha',
    'p2-flowers-a', 'p2-flowers-b', 'p2-flowers-c', 'p2-flowers-d', 'p2-butterfly-a', 'p2-butterfly-b', 'p2-title', 'p2-rule', 'p2-click', 'p2-paper', 'p2-roller', 'p2-daterule',
    'p3-flowers-a', 'p3-flowers-b', 'p3-flowers-c', 'p3-flowers-d', 'p3-flowers-e',
    'p4-rule', 'p4-save', 'p4-maps',
    'p5-lantern-a', 'p5-lantern-b', 'p5-lantern-c', 'p5-butterfly-a', 'p5-butterfly-b', 'p5-butterfly-c', 'p5-heart',
    'p6-our', 'p6-title', 'p6-rule', 'p6-frame', 'p7-rule1', 'p7-rule2', 'p8-rule', 'p8-heart'];
  for (const f of demo) fs.copyFileSync(path.join(DEMO, f + '.webp'), path.join(A, f + '.webp'));
  fs.copyFileSync(path.join(DEMO, 'music.mp3'), path.join(A, 'music.mp3'));
  fs.copyFileSync(path.join(DEMO, 'opening.mp4'), path.join(A, 'opening.mp4')); // the door film; its CL seal is covered by assets/seal.png in js/opening.js

  /* photos: original aspect ratios, sized for the memories window at 2× */
  const photos = { 'photo-1': '76.jpg', 'photo-2': '74.jpg', 'photo-3': '75.jpg', 'photo-4': '77.jpg' };
  for (const [name, file] of Object.entries(photos)) {
    await sharp(path.join(SRC, file)).rotate().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(A, `${name}.webp`));
  }

  /* the four pastel circles of the dress-code reference (1206×400), each cut round */
  const circles = [['blue', 287], ['pink', 492], ['peach', 698], ['green', 903]];
  const D = 200, cy = 242;
  const mask = Buffer.from(`<svg width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2 - 1}" fill="#fff"/></svg>`);
  for (const [name, cx] of circles) {
    await sharp(path.join(SRC, '73.jpg')).extract({ left: cx - D / 2, top: cy - D / 2, width: D, height: D })
      .ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(A, `pastel-${name}.webp`));
  }

  /* .ics: start times only; no DTEND, because the invitation gives no end times */
  const esc = (s) => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const fold = (l) => { const b = Buffer.from(l); if (b.length <= 75) return l; const out = []; let i = 0, first = true;
    while (i < b.length) { let n = first ? 75 : 74; while (i + n < b.length && (b[i + n] & 0xc0) === 0x80) n--; out.push((first ? '' : ' ') + b.subarray(i, i + n).toString()); i += n; first = false; } return out.join('\r\n'); };
  for (const d of DAYS) {
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Vaishali & Arpan Wedding//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `UID:${SLUG}-${d.start.slice(0, 8)}@invitivals.com`,
      'DTSTAMP:20261104T000000Z',
      `DTSTART;TZID=Asia/Kolkata:${d.start}`,
      `SUMMARY:${esc(d.title)}`,
      `LOCATION:${esc(d.venue)}`,
      `DESCRIPTION:${esc([...d.lines, '', `Map: ${d.map}`].join('\n'))}`,
      `URL:https://invitivals.com/${SLUG}/`,
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(d.title)} tomorrow`, 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR', '',
    ];
    fs.writeFileSync(path.join(OUT, d.file), ics.map(fold).join('\r\n'));
  }
  console.log('✓ demo art, photos, pastel circles, 3 × .ics');
}

/* ── retouches for this client's pages (the demo's files are only read) ── */
if (only !== 'og') {
  /* the memories frame without its two flower clusters: the frame's lines are mirror-symmetric about their own
     centre (x 28–37 ↔ 395–404, y 40–49 ↔ 690–701 in the 418×767 cut-out), so the frame is rebuilt from its
     clean bottom-left quarter, mirrored, and all four corners carry the same ornament */
  const FRAME = path.join(DEMO, 'p6-frame.webp');
  const fm = await sharp(FRAME).metadata();
  if (fm.width !== 418 || fm.height !== 767) throw new Error(`p6-frame.webp is ${fm.width}×${fm.height}, the mirror lines below assume 418×767`);
  const CX = 216, CY = 371; // 2·CX = 432 (left line 28 ↔ right line 404), 2·CY = 741 (top line 40 ↔ bottom line 701)
  const quarter = (x, y, w, hh) => sharp(FRAME).extract({ left: x, top: y, width: w, height: hh });
  const BL = await quarter(0, CY, CX, fm.height - CY).png().toBuffer();
  const TL = await quarter(0, CY, CX, CY).flip().png().toBuffer();
  const BR = await quarter(2 * CX - fm.width + 1, CY, fm.width - CX, fm.height - CY).flop().png().toBuffer();
  const TR = await quarter(2 * CX - fm.width + 1, CY, fm.width - CX, CY).flip().flop().png().toBuffer();
  await sharp({ create: { width: fm.width, height: fm.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: BL, left: 0, top: CY }, { input: TL, left: 0, top: 0 }, { input: TR, left: CX, top: 0 }, { input: BR, left: CX, top: CY }])
    .webp({ quality: 90, alphaQuality: 92 }).toFile(path.join(A, 'p6-frame.webp'));

  /* plate 6: the same flowers are painted into the plate beside its window (the photographs cover the window
     itself). They are painted over with the wall from just above, and with the mirror image of the frame's clean
     left side (the lines mirror at x 284 ↔ 660 in the plate); the rebuilt frame then draws its lines on top. */
  const feather = (w, hh, s) => sharp(Buffer.from(`<svg width="${w}" height="${hh}"><rect x="${s * 2}" y="${s * 2}" width="${w - s * 4}" height="${hh - s * 4}" fill="#fff"/></svg>`)).blur(s).png().toBuffer();
  /* a feathered patch for a plate: a region copied from [sx, sy] to [tx, ty], optionally mirrored or blurred */
  const patch = async (plate, [sx, sy], [tx, ty], w, hh, { flop = false, blur = 0, s = 6 } = {}) => {
    let p = sharp(plate).extract({ left: sx, top: sy, width: w, height: hh });
    if (flop) p = p.flop();
    if (blur) p = sharp(await p.blur(blur).toBuffer());
    return { input: await p.ensureAlpha().composite([{ input: await feather(w, hh, s), blend: 'dest-in' }]).png().toBuffer(), left: tx, top: ty };
  };
  const P6 = path.join(DEMO, 'plate6.webp');
  await sharp(P6).composite([
    await patch(P6, [236, 200], [236, 330], 30, 100),           // the sliver beside the left panel's top: wall from 130 px higher
    await patch(P6, [258, 195], [258, 330], 414, 135),          // above the window: wall from 135 px higher
    await patch(P6, [500, 200], [500, 420], 172, 120),          // the frame's top-right corner: wall
    await patch(P6, [639, 405], [250, 405], 55, 365, { flop: true }), // left of the window: the right side's lines, mirrored
    await patch(P6, [239, 900], [490, 900], 215, 270, { flop: true }), // bottom right: the bottom left (ornament, platform, panel edge), mirrored
  ]).webp({ quality: 86 }).toFile(path.join(A, 'plate6.webp'));

  /* plates 4 and 5 keep faint traces of the lettering that was painted out of them (ghost words in plate 5's
     arch and card, a "li," above plate 4's daybed): the traces are smoothed into the wall around them */
  const P5 = path.join(DEMO, 'plate5.webp');
  await sharp(P5).composite([
    await patch(P5, [240, 230], [240, 230], 460, 450, { blur: 28, s: 10 }), // the arch's wall
    await patch(P5, [400, 712], [400, 712], 250, 84, { blur: 14, s: 5 }),   // the card, beside the calendar
    await patch(P5, [432, 812], [432, 812], 220, 50, { blur: 14, s: 4 }),   // the card, beside the clock
  ]).webp({ quality: 86 }).toFile(path.join(A, 'plate5.webp'));
  const P8 = path.join(DEMO, 'plate8.webp');
  await sharp(P8).composite([await patch(P8, [170, 420], [170, 420], 600, 400, { blur: 28, s: 10 })]).webp({ quality: 86 }).toFile(path.join(A, 'plate8.webp'));
  const P4 = path.join(DEMO, 'plate4.webp');
  await sharp(P4).composite([await patch(P4, [455, 905], [540, 905], 100, 80, { s: 7 })]).webp({ quality: 86 }).toFile(path.join(A, 'plate4.webp'));

  /* plate 3: the functions page keeps the plate's "Our Functions" lettering and marble wall; below it the
     painted pathway and stages become a soft bokeh of the venue, the backdrop for the programme cards */
  const P3 = path.join(DEMO, 'plate3.webp');
  const m3 = await sharp(P3).metadata();
  const topH = Math.round(m3.height * 0.33);
  const fade = Buffer.from(`<svg width="${m3.width}" height="${topH}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.833" stop-color="#fff" stop-opacity="1"/><stop offset="0.87" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`);
  const sharpTop = await sharp(P3).extract({ left: 0, top: 0, width: m3.width, height: topH }).ensureAlpha().composite([{ input: fade, blend: 'dest-in' }]).png().toBuffer();
  await sharp(await sharp(P3).blur(30).modulate({ brightness: 1.04, saturation: 0.9 }).toBuffer())
    .composite([{ input: sharpTop, left: 0, top: 0 }]).webp({ quality: 84 }).toFile(path.join(A, 'plate3.webp'));
  console.log('✓ p6-frame.webp (no flowers), plate6.webp, plate5.webp, plate4.webp + plate8.webp (patched), plate3.webp (bokeh below the title)');
}

/* ── the couple's AV monogram (invites/src/vaishali-arpan-wedding/av-logo.jpg, gold on black): the black is
      keyed to transparency from each pixel's brightness, and the edge colours are un-blended from the black ── */
{
  const src = sharp(path.join(SRC, 'av-logo.jpg'));
  const { data, info } = await src.raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, o = 0; i < data.length; i += info.channels, o += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const a = Math.min(1, Math.max(r, g, b) / 215);
    out[o] = a ? Math.min(255, r / a) : 0; out[o + 1] = a ? Math.min(255, g / a) : 0; out[o + 2] = a ? Math.min(255, b / a) : 0; out[o + 3] = Math.round(a * 255);
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).resize({ width: 320 }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(A, 'av-logo.png'));
  console.log('✓ av-logo.png (the monogram, transparent)');
}
if (only === 'art') process.exit(0);

/* ── headless Chrome: the seal's new letters and the link preview ── */
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9353;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const url = (p) => pathToFileURL(p).href;
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Great+Vibes&family=Playfair+Display:ital,wght@1,500&display=block" rel="stylesheet">';
const READY = `<script>Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode().catch(()=>{}))]).then(()=>{document.title='ready'})</script>`;

/* the seal face on the demo's poster (947×1660): centre and radius, measured on the picture */
const SEAL = { cx: 490, cy: 830, r: 97 };
const sealHtml = `<!DOCTYPE html><meta charset="utf-8">${FONTS}<style>
*{margin:0}html,body{background:transparent}body{width:${SEAL.r * 4}px;height:${SEAL.r * 4}px;position:relative}
.face{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 42% 36%,#d3a872 0%,#c6975f 45%,#b4824c 78%,#a8753f 100%)}
.rim{position:absolute;inset:4%;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(255,236,200,.35),inset 0 3px 6px rgba(255,240,210,.35),inset 0 -4px 8px rgba(90,50,20,.3)}
.m{position:absolute;inset:15%;display:block;width:70%;height:70%;filter:drop-shadow(0 2px 2px rgba(70,35,10,.45)) drop-shadow(0 -1px 1px rgba(255,240,210,.35))}
</style><div class="face"></div><div class="rim"></div><img class="m" src="${url(path.join(A, 'av-logo.png'))}" alt="">${READY}`;

/* og: the demo's hero plate (its own og is this plate with the names), names inside the centre square */
const ogHtml = `<!DOCTYPE html><meta charset="utf-8">${FONTS}<style>
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;overflow:hidden;position:relative;background:#e9cfa8;font-variant-numeric:lining-nums}
.bg{position:absolute;left:0;top:-400px;width:1200px;height:2132px}
.fl{position:absolute;left:-40px;top:-70px;width:440px}
.c{position:absolute;left:285px;width:630px;top:0;height:630px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding-top:14px}
.k{font:600 21px 'Cormorant Garamond',serif;letter-spacing:.36em;padding-left:.36em;color:#8a5a1e}
.n{font:italic 500 108px/1.1 'Playfair Display',Georgia,serif;letter-spacing:.01em;color:#5a2e12;background:linear-gradient(180deg,#8a5a1e,#5a3418 45%,#8a5a1e);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 2px 2px rgba(255,235,200,.8))}
.a{font:italic 400 52px/1 'Playfair Display',Georgia,serif;color:#a1742a;margin:2px 0}
.d{margin-top:22px;font:700 30px 'Cormorant Garamond',serif;letter-spacing:.14em;padding-left:.14em;color:#5a3418}
.p{margin-top:6px;font:600 19px 'Cormorant Garamond',serif;letter-spacing:.32em;padding-left:.32em;color:#8a5a1e}
</style>
<img class="bg" src="${url(path.join(A, 'plate1.webp'))}"><img class="fl" src="${url(path.join(A, 'p1-flowers-a.webp'))}">
<div class="c"><p class="k">WEDDING INVITATION</p><p class="n">Vaishali</p><p class="a">&amp;</p><p class="n">Arpan</p><p class="d">${VAR ? VAR.dates : '18 – 20 NOVEMBER 2026'}</p><p class="p">DELHI</p></div>${READY}`;

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'inv-og-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--remote-allow-origins=*', `--user-data-dir=${path.join(work, 'profile')}`,
  '--allow-file-access-from-files', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
try {
  let target;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(250);
    try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page'); } catch {}
  }
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
    if (transparent) await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    await send('Page.navigate', { url: url(page) });
    for (let i = 0; i < 60; i++) { await sleep(250); const r = await send('Runtime.evaluate', { expression: 'document.title' }); if (r.result.value === 'ready') break; }
    await sleep(500);
    return Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64');
  };

  if (!VAR) {
  // the seal: rendered at 2×, scaled onto the poster's seal face
  const face = await sharp(await shot(sealHtml, SEAL.r * 4, SEAL.r * 4, true)).resize(SEAL.r * 2, SEAL.r * 2).png().toBuffer();
  await sharp(path.join(DEMO, 'opening.webp')).composite([{ input: face, left: SEAL.cx - SEAL.r, top: SEAL.cy - SEAL.r }]).webp({ quality: 92 }).toFile(path.join(A, 'opening.webp'));
  console.log('✓ opening.webp (seal reads VA)');
  // the same face, transparent, for js/opening.js to lay over the film's seal until it breaks
  await sharp(await shot(sealHtml, SEAL.r * 4, SEAL.r * 4, true)).png().toFile(path.join(A, 'seal.png'));
  console.log('✓ seal.png (the seal face for the film)');
  }

  const OG = path.join(VAR ? path.join(ROOT, 'public', VAR.slug, 'assets') : A, 'og.jpg');
  await sharp(await shot(ogHtml, 1200, 630, false)).jpeg({ quality: 86, mozjpeg: true }).toFile(OG);
  console.log(`✓ ${path.relative(ROOT, OG)} ${(fs.statSync(OG).size / 1024).toFixed(0)} KB`);
  ws.close();
} finally {
  chrome.kill();
  await sleep(500);
  try { fs.rmSync(work, { recursive: true, force: true }); } catch {}
}
