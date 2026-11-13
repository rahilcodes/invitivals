/* Photographs public/rose-red-engagement/og.html (1200×630) into assets/og.jpg, the banner WhatsApp shows under the link.
 *
 *   node tools/rose-red-engagement-og.mjs [url]      default: http://localhost:4321/rose-red-engagement/og.html
 *
 * Needs Chrome (set CHROME to its path if it is elsewhere) and the dev server running.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const url = process.argv[2] || 'http://localhost:4321/rose-red-engagement/og.html';
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public/rose-red-engagement/assets/og.jpg');
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9348;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'inv-og-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--remote-allow-origins=*', `--user-data-dir=${profile}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
try {
  let target;
  for (let i = 0; i < 40 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page'); } catch {} }
  if (!target) throw new Error('Chrome did not start: set CHROME to its path');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); } };
  const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url });
  await sleep(5000);
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  await sharp(Buffer.from(data, 'base64')).jpeg({ quality: 86, progressive: true }).toFile(OUT);
  console.log('wrote', path.relative(process.cwd(), OUT), (fs.statSync(OUT).size / 1024).toFixed(0), 'KB');
  ws.close();
} finally { chrome.kill(); await sleep(500); try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }
