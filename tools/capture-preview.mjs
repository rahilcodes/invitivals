/* Captures the two gallery pictures for a design: the closed cover and the opened invitation.
 *
 *   node tools/capture-preview.mjs <url> <name> [--wait=7] [--scroll=0] [--click=#tapOpen]
 *
 *   url   the sample invitation on a running dev server,
 *         e.g. http://localhost:4321/engagement/demo/index.html
 *   name  file name under public/showcase/previews, e.g. engagement
 *
 * Writes <name>-door.webp (as the page first appears) and <name>.webp (after one tap in the
 * middle of the screen — or a click on --click, for a sample that opens from its own button —
 * and --wait seconds). Look at the second picture afterwards: it must show the invitation open. Only ever point this at an anonymised sample.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const [url, name, ...flags] = process.argv.slice(2);
if (!url || !name) {
  console.error('usage: node tools/capture-preview.mjs <url> <name> [--wait=7] [--scroll=0]');
  process.exit(1);
}
const flag = (k, d) => Number((flags.find((f) => f.startsWith(`--${k}=`)) || '').split('=')[1] ?? d);
const WAIT = flag('wait', 7);
const SCROLL = flag('scroll', 0);
const CLICK = (flags.find((f) => f.startsWith('--click=')) || '').slice(8);

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'showcase', 'previews');
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9347;
const W = 390;
const H = 784;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'inv-capture-'));
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--remote-allow-origins=*', `--user-data-dir=${profile}`,
  '--autoplay-policy=no-user-gesture-required', '--mute-audio', '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });

try {
  let target;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(250);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      target = list.find((t) => t.type === 'page');
    } catch {}
  }
  if (!target) throw new Error('Chrome did not start — set CHROME to its path');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); }
  };
  const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });

  const shot = async (file) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    await sharp(Buffer.from(data, 'base64')).resize(540, 1085, { fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(path.join(OUT, file));
    console.log('wrote', path.join('public/showcase/previews', file));
  };

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await send('Page.navigate', { url });
  await sleep(6000);
  await shot(`${name}-door.webp`);

  if (CLICK) {
    await send('Runtime.evaluate', { expression: `document.querySelector(${JSON.stringify(CLICK)}).click()`, userGesture: true });
  } else {
    const at = { x: W / 2, y: H / 2, button: 'left', clickCount: 1 };
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...at });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...at });
  }
  await sleep(WAIT * 1000);
  if (SCROLL) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${SCROLL})` });
    await sleep(2500);
  }
  await shot(`${name}.webp`);
  ws.close();
} finally {
  chrome.kill();
  await sleep(500);
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
}
