/* Draws an invitation's link preview (the banner WhatsApp / iMessage show above the link).
 *
 *   node tools/make-og.mjs <slug>
 *
 * Reads invites/<slug>.json and writes public/engagement/<slug>/og.jpg (1200×630): the theme's arch
 * with the occasion, the names and the date. Set "og": "og.jpg" in the json, then run new-invite.mjs.
 * "share": { "emblem": "art/….webp" } puts the couple's own emblem above the wording.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { paintOut } from './lib/paint-out.mjs';

const slug = process.argv[2];
if (!slug) { console.error('usage: node tools/make-og.mjs <slug>'); process.exit(1); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = path.join(ROOT, 'public/engagement');
const I = JSON.parse(fs.readFileSync(path.join(ROOT, 'invites', slug + '.json'), 'utf8'));
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9348, W = 1200, H = 630;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const url = (p) => pathToFileURL(p).href;

/* the part of a theme plate that frames the banner: [plate, x, y, w, h, specks to clear] */
const FRAME = { 'floral-palace': ['art/venue-clean.webp', 0, 0, 1180, 620, [[556, 436, 604, 474], [580, 66, 604, 92]]] };
const [plate, fx, fy, fw, fh, specks] = FRAME[I.theme] || FRAME['floral-palace'];
const theme = path.join(BASE, '_themes', I.theme), fonts = path.join(BASE, '_engine/v1/fonts');
const raw = await sharp(path.join(theme, plate)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
if (specks) paintOut(raw.data, raw.info.width, raw.info.height, raw.info.channels, { test: () => true, rects: specks, grow: 0 });
const bg = await sharp(raw.data, { raw: { width: raw.info.width, height: raw.info.height, channels: raw.info.channels } }).extract({ left: fx, top: fy, width: fw, height: fh }).resize(W, H, { kernel: 'lanczos3' }).png().toBuffer();
const emblem = I.share && I.share.emblem ? path.join(BASE, I.slug, I.share.emblem) : null;

const html = `<!DOCTYPE html><meta charset="utf-8"><style>
@font-face{font-family:"CG";font-weight:600;src:url(${url(path.join(fonts, 'cormorant-garamond-latin-600-normal.woff2'))})}
@font-face{font-family:"CG";font-weight:600;font-style:italic;src:url(${url(path.join(fonts, 'cormorant-garamond-latin-600-italic.woff2'))})}
@font-face{font-family:"CG";font-weight:700;src:url(${url(path.join(fonts, 'cormorant-garamond-latin-700-normal.woff2'))})}
@font-face{font-family:"PS";src:url(${url(path.join(fonts, 'pinyon-script-latin-400-normal.woff2'))})}
@font-face{font-family:"MC";src:url(${url(path.join(fonts, 'marcellus-latin-400-normal.woff2'))})}
*{margin:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;background:#f7e2cf url(data:image/png;base64,${bg.toString('base64')}) 0 0/100% 100%;color:#8a1a3b;
  display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:${emblem ? 74 : 90}px 190px 30px}
body::before{content:"";position:absolute;inset:60px 200px 0;background:radial-gradient(60% 60% at 50% 50%,rgba(255,250,240,.92),rgba(255,250,240,0) 100%)}
body>*{position:relative}
.em{height:178px;margin-bottom:8px}
.k{font:400 31px/1 "MC";letter-spacing:.34em;text-indent:.34em;text-transform:uppercase;color:#a87a22}
.n{font:400 104px/1.16 "PS";white-space:nowrap;-webkit-text-stroke:1.4px currentColor;margin:18px 0 0}
.n i{font:italic 600 .6em "CG";color:#b8892c;-webkit-text-stroke:0;padding:0 .2em;vertical-align:.08em}
.r{display:flex;align-items:center;gap:16px;margin:10px 0 14px;color:#c6952c}
.r::before,.r::after{content:"";width:170px;height:1.5px;background:linear-gradient(90deg,transparent,#c6952c)}
.r::after{transform:scaleX(-1)}
.r b{width:11px;height:11px;background:#c6952c;transform:rotate(45deg)}
.d{font:700 48px/1.1 "CG";font-variant-numeric:lining-nums}
</style>
${emblem ? `<img class="em" src="${url(emblem)}">` : ''}
<p class="k">${esc(I.eventType)}</p>
<p class="n" id="n">${esc(I.couple.first)} <i>&amp;</i> ${esc(I.couple.second)}</p>
<div class="r"><b></b></div>
<p class="d">${esc(I.event.day)}, ${esc(I.event.dateText)}</p>
<script>document.fonts.ready.then(()=>{const n=document.getElementById('n'),max=770;if(n.offsetWidth>max)n.style.fontSize=(104*max/n.offsetWidth)+'px';document.title='ready'})</script>`;

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
  for (let i = 0; i < 40; i++) { await sleep(250); const r = await send('Runtime.evaluate', { expression: 'document.title' }); if (r.result.value === 'ready') break; }
  await sleep(400);
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  const out = path.join(BASE, I.slug, 'og.jpg');
  await sharp(Buffer.from(data, 'base64')).resize(W, H).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
  console.log(`✓ ${path.relative(ROOT, out)}  ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
  ws.close();
} finally {
  chrome.kill();
  await sleep(500);
  try { fs.rmSync(work, { recursive: true, force: true }); } catch {}
}
