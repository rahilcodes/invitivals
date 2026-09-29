import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import sharp from 'sharp';

const PORT = 4321;
const CHROME_PORT = 9347;
const PUBLIC_DIR = path.resolve('public');
const OUT = path.resolve('public', 'showcase', 'previews');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const W = 390;
const H = 784;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
};

const server = http.createServer((req, res) => {
  let cleanUrl = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(PUBLIC_DIR, cleanUrl);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found: ' + req.url);
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`Static server running at http://localhost:${PORT}`);

  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'inv-capture-'));
  const chrome = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${CHROME_PORT}`, '--remote-allow-origins=*', `--user-data-dir=${profile}`,
    '--autoplay-policy=no-user-gesture-required', '--mute-audio', '--hide-scrollbars', 'about:blank',
  ], { stdio: 'ignore' });

  try {
    let target;
    for (let i = 0; i < 40 && !target; i++) {
      await sleep(250);
      try {
        const list = await (await fetch(`http://127.0.0.1:${CHROME_PORT}/json`)).json();
        target = list.find((t) => t.type === 'page');
      } catch {}
    }
    if (!target) throw new Error('Chrome did not start');

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
    let id = 0;
    const pending = new Map();
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); }
    };
    const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });

    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true });

    const shot = async (file) => {
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      await sharp(Buffer.from(data, 'base64')).resize(540, 1085, { fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(path.join(OUT, file));
      console.log('Successfully wrote:', file);
    };

    const targets = [
      { name: 'nikah', url: `http://127.0.0.1:${PORT}/showcase/nikah/index.html` },
      { name: 'christian-wedding', url: `http://127.0.0.1:${PORT}/showcase/christian-wedding/index.html` },
      { name: 'telugu-wedding', url: `http://127.0.0.1:${PORT}/showcase/telugu-wedding/index.html` },
      { name: 'aqeeqah', url: `http://127.0.0.1:${PORT}/showcase/aqeeqah/index.html` },
      { name: 'gruhapravesha', url: `http://127.0.0.1:${PORT}/showcase/gruhapravesha/index.html` },
      { name: 'engagement', url: `http://127.0.0.1:${PORT}/engagement/demo/index.html` },
    ];

    for (const t of targets) {
      console.log(`Processing ${t.name}...`);
      await send('Page.navigate', { url: t.url });
      await sleep(6000);
      await shot(`${t.name}-door.webp`);

      const at = { x: W / 2, y: H / 2, button: 'left', clickCount: 1 };
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...at });
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...at });
      await sleep(7000);
      await shot(`${t.name}.webp`);
    }

    ws.close();
  } catch (err) {
    console.error('Capture error:', err);
  } finally {
    chrome.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
    server.close(() => {
      console.log('All done!');
      process.exit(0);
    });
  }
});
