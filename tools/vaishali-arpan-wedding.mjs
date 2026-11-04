/* Vaishali & Arpan, bride-side wedding (18–20 Nov 2026, Delhi), on the Brown Theme Wedding design.
 *
 *   node --experimental-websocket tools/vaishali-arpan-wedding.mjs      pictures + event.ics + og.jpg
 *   node --experimental-websocket tools/vaishali-arpan-wedding.mjs og   only the link preview
 *
 * The page itself (index.html, css/, js/) is hand-written in public/vaishali-arpan-wedding/.
 * This tool only prepares what it uses:
 *  - the client's four photos and the dress-code circles from invites/src/vaishali-arpan-wedding/
 *    (73.jpg reference, 74–77.jpg couple), only resized / cropped / converted, never retouched;
 *  - the demo's own florals, butterflies, opening plate and music, copied (the demo folder is never written);
 *  - event.ics for the Save the Date (the wedding, 20 Nov 2026 8:00 PM IST);
 *  - assets/og.jpg, 1200×630, with everything that matters inside the centre 630 px square
 *    (WhatsApp shows a square centre crop), rendered by headless Chrome.
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
fs.mkdirSync(A, { recursive: true });

/* ── the wedding, for the calendar ── */
const WEDDING = {
  title: 'Wedding of Vaishali & Arpan',
  start: '20261120T200000',                 // 20 Nov 2026, 8:00 PM, Asia/Kolkata — Welcome of Baraat
  venue: 'The Sherioan By Kawatra Tent, Colosseum Hall, Pitampura, Delhi – 110034 (Near DCP Office, Outer District)',
  map: 'https://maps.app.goo.gl/8svFQVQ7mBP4o59D8?g_st=ic',
};

if (only !== 'og') {
  /* photos: original aspect ratios, sized for a column up to ~520 px at 2× */
  const photos = { 'photo-red-gown': '76.jpg', 'photo-hallway': '74.jpg', 'photo-arch': '75.jpg', 'photo-lights': '77.jpg' };
  for (const [name, file] of Object.entries(photos)) {
    const img = sharp(path.join(SRC, file)).rotate();
    const m = await img.metadata();
    await img.resize({ width: Math.min(m.width, 960), withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(A, `${name}.webp`));
  }

  /* the four pastel circles of the dress-code reference (1206×400), each cut round */
  const circles = [['blue', 287], ['pink', 492], ['peach', 698], ['green', 903]];
  const D = 200, cy = 242;
  const mask = Buffer.from(`<svg width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2 - 1}" fill="#fff"/></svg>`);
  for (const [name, cx] of circles) {
    await sharp(path.join(SRC, '73.jpg')).extract({ left: cx - D / 2, top: cy - D / 2, width: D, height: D })
      .ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(A, `pastel-${name}.webp`));
  }

  /* the demo's own art and music, copied as they are */
  for (const f of ['p1-flowers-a.webp', 'p2-flowers-b.webp', 'p2-flowers-c.webp', 'p2-flowers-d.webp', 'p1-butterfly.webp', 'p2-butterfly-a.webp', 'p2-butterfly-b.webp', 'plate1.webp', 'music.mp3']) {
    fs.copyFileSync(path.join(DEMO, f), path.join(A, f));
  }

  /* event.ics: the invitation gives no end time, so there is no DTEND (a start-only entry) */
  const esc = (s) => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Vaishali & Arpan Wedding//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${SLUG}-20261120@invitivals.com`,
    'DTSTAMP:20261104T000000Z',
    `DTSTART;TZID=Asia/Kolkata:${WEDDING.start}`,
    `SUMMARY:${esc(WEDDING.title)}`,
    `LOCATION:${esc(WEDDING.venue)}`,
    `DESCRIPTION:${esc(`The Wedding Celebration\n8:00 PM – Welcome of Baraat\n9:00 PM – Dinner\nVidaai – Taron Ki Chhaon Mein\n\nMap: ${WEDDING.map}`)}`,
    `URL:https://invitivals.com/${SLUG}/`,
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(WEDDING.title)} tomorrow`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR', '',
  ];
  // RFC 5545: lines over 75 octets are folded
  const fold = (l) => { const b = Buffer.from(l); if (b.length <= 75) return l; const out = []; let i = 0, first = true;
    while (i < b.length) { let n = first ? 75 : 74; while (i + n < b.length && (b[i + n] & 0xc0) === 0x80) n--; out.push((first ? '' : ' ') + b.subarray(i, i + n).toString()); i += n; first = false; } return out.join('\r\n'); };
  fs.writeFileSync(path.join(OUT, 'event.ics'), ics.map(fold).join('\r\n'));
  console.log('✓ photos, pastel circles, demo art, event.ics');
}

/* ── og.jpg ── */
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9353, W = 1200, H = 630;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const url = (p) => pathToFileURL(p).href;
const html = `<!DOCTYPE html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Great+Vibes&display=block" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;background:#e4c09a;font-variant-numeric:lining-nums}
.side{position:absolute;top:0;height:${H}px;object-fit:cover}
.l{left:0;width:300px;object-position:50% 22%}.r{right:0;width:300px;object-position:50% 18%}
.side::after{content:''}
.card{position:absolute;left:285px;width:630px;top:0;height:${H}px;background:radial-gradient(ellipse 62% 70% at 50% 50%,#fbeedd 0%,#f4dcbc 62%,#e6c39d 100%);
  box-shadow:0 0 40px rgba(60,30,10,.45);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;overflow:hidden}
.fl{position:absolute;opacity:.95}
.fa{left:0;top:0;height:250px}.fd{right:-36px;bottom:-30px;height:290px}
.k{margin-bottom:10px;font:600 20px 'Cormorant Garamond',serif;letter-spacing:.36em;padding-left:.36em;color:#9a6c22}
.n{font:400 104px/1.02 'Great Vibes',cursive;color:#6b1a24;position:relative}
.amp{font:400 52px/1 'Great Vibes',cursive;color:#a1742a;margin:-4px 0 -8px;position:relative}
.rule{width:300px;height:1.5px;background:linear-gradient(90deg,transparent,#c9a24f,transparent);margin:18px 0 14px}
.d{font:700 30px 'Cormorant Garamond',serif;letter-spacing:.12em;padding-left:.12em;color:#5a3418}
.p{margin-top:8px;font:600 18px 'Cormorant Garamond',serif;letter-spacing:.3em;padding-left:.3em;color:#9a6c22}
.dots{display:flex;gap:10px;margin-top:16px}.dots i{width:12px;height:12px;border-radius:50%}
</style>
<img class="side l" src="${url(path.join(A, 'photo-red-gown.webp'))}">
<img class="side r" src="${url(path.join(A, 'photo-arch.webp'))}">
<div class="card">
  <img class="fl fa" src="${url(path.join(A, 'p1-flowers-a.webp'))}"><img class="fl fd" src="${url(path.join(A, 'p2-flowers-d.webp'))}">
  <p class="k">WEDDING INVITATION</p>
  <p class="n">Vaishali</p><p class="amp">&amp;</p><p class="n">Arpan</p>
  <div class="rule"></div>
  <p class="d">18 – 20 NOVEMBER 2026</p>
  <p class="p">DELHI</p>
  <div class="dots"><i style="background:#a9d3f1"></i><i style="background:#f5b5cc"></i><i style="background:#f8bd88"></i><i style="background:#c3e394"></i></div>
</div>
<script>Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode().catch(()=>{}))]).then(()=>{document.title='ready'})</script>`;

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'inv-og-'));
const page = path.join(work, 'og.html'); fs.writeFileSync(page, html);
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
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: url(page) });
  for (let i = 0; i < 60; i++) { await sleep(250); const r = await send('Runtime.evaluate', { expression: 'document.title' }); if (r.result.value === 'ready') break; }
  await sleep(500);
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  await sharp(Buffer.from(data, 'base64')).resize(W, H).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(A, 'og.jpg'));
  console.log(`✓ og.jpg ${(fs.statSync(path.join(A, 'og.jpg')).size / 1024).toFixed(0)} KB`);
  ws.close();
} finally {
  chrome.kill();
  await sleep(500);
  try { fs.rmSync(work, { recursive: true, force: true }); } catch {}
}
