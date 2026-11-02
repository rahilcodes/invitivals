import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
const SRC = 'invites/src/modern-wedding';
const OUT = process.argv[2];
async function rgb(f, w, h) { const { data, info } = await sharp(f).removeAlpha().resize(w, h, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true }); return { d: data, w: info.width, h: info.height }; }
// 1) background vs reference diffs
const pairs = [['1.png','with text temp/1.png'],['2.png','with text temp/2.png'],['2.png','with text temp/2(WHEN REVEAL).png'],['with text temp/2.png','with text temp/2(WHEN REVEAL).png'],['3.png','with text temp/3.png'],['4.png','with text temp/4.png'],['5.png','with text temp/5.png'],['6.png','with text temp/6.png']];
for (const [a, b] of pairs) {
  const A = await rgb(path.join(SRC, a), 941, 1671), B = await rgb(path.join(SRC, b), 941, 1671);
  const w = A.w, h = A.h; const diff = Buffer.alloc(w * h);
  let big = 0, rows = new Array(h).fill(0);
  for (let i = 0; i < w * h; i++) { const dd = Math.max(Math.abs(A.d[i*3]-B.d[i*3]), Math.abs(A.d[i*3+1]-B.d[i*3+1]), Math.abs(A.d[i*3+2]-B.d[i*3+2])); diff[i] = Math.min(255, dd * 3); if (dd > 40) { big++; rows[Math.floor(i / w)]++; } }
  // rows of change as % bands
  const bands = []; let start = -1;
  for (let y = 0; y < h; y++) { const on = rows[y] > 3; if (on && start < 0) start = y; if (!on && start >= 0) { bands.push([start, y]); start = -1; } }
  if (start >= 0) bands.push([start, h]);
  console.log(a, 'vs', b, 'pixels >40:', (big / (w * h) * 100).toFixed(2) + '%', 'bands(y):', bands.filter(b => b[1]-b[0] > 4).map(b => b.join('-')).join(' '));
  await sharp(diff, { raw: { width: w, height: h, channels: 1 } }).png().toFile(path.join(OUT, 'diff-' + a.replace(/\W/g,'_') + '-' + b.replace(/\W/g, '_') + '.png'));
}
// 2) alpha of elements
async function alphaInfo(f) { const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); let t = 0, o = 0, p = 0; for (let i = 3; i < data.length; i += 4) { if (data[i] === 0) t++; else if (data[i] === 255) o++; else p++; } const n = data.length / 4; const c0 = [data[0], data[1], data[2], data[3]]; return `${info.width}x${info.height} hasAlpha=${info.channels===4} transparent=${(t/n*100).toFixed(1)}% partial=${(p/n*100).toFixed(1)}% opaque=${(o/n*100).toFixed(1)}% corner=${c0}`; }
function walk(d) { for (const e of fs.readdirSync(d)) { const p = path.join(d, e); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.png$/i.test(e)) list.push(p); } }
const list = []; walk(path.join(SRC, 'elements'));
for (const f of list) { const meta = await sharp(f).metadata(); console.log(path.relative(SRC, f).padEnd(70), 'channels', meta.channels, meta.hasAlpha, await alphaInfo(f)); }
