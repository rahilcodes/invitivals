import sharp from 'sharp'; import path from 'node:path';
const SRC = 'invites/src/modern-wedding';
// page 4: bright (cream) pixels inside the four glass boxes, per row and per column
const { data, info } = await sharp(path.join(SRC, 'with text temp/4.png')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const lum = (x, y) => { const i = (y * W + x) * 3; return 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]; };
const boxes = [[480, 690], [695, 900], [905, 1110], [1115, 1320]];
for (const [x0, x1] of boxes) {
  const rows = []; for (let y = 480; y < 730; y++) { let n = 0; for (let x = x0; x < x1; x++) if (lum(x, y) > 215) n++; rows.push(n); }
  const bands = []; let s = -1; rows.forEach((n, k) => { const on = n > 2; if (on && s < 0) s = k; if (!on && s >= 0) { bands.push([s + 480, k + 480]); s = -1; } });
  const cols = []; for (let x = x0; x < x1; x++) { let n = 0; for (let y = 530; y < 640; y++) if (lum(x, y) > 215) n++; cols.push(n); }
  const cb = []; s = -1; cols.forEach((n, k) => { const on = n > 1; if (on && s < 0) s = k; if (!on && s >= 0) { cb.push([s + x0, k + x0]); s = -1; } });
  console.log(`box ${x0}-${x1} bright rows:`, bands.map(b => b.join('-')).join(' '), '| cols (digit rows):', cb.map(b => b.join('-')).join(' '));
}
// sample the glass box interior colour and digit colour
const px = (x, y) => { const i = (y * W + x) * 3; return [data[i], data[i + 1], data[i + 2]]; };
console.log('glass interior', px(520, 600), px(660, 540), 'digit', px(585, 585), 'plaque', px(900, 500), 'label', px(585, 652));
// alpha bboxes of the elements
for (const f of ['elements/2/Glossy Golden Heart Frame.png', 'elements/2/WHEN REVEALED.png', 'elements/page_joining_top_satin.png.png', 'elements/5/will_attend_transparent.png', 'elements/5/unable_to_attend_transparent.png', 'elements/2/Glossy Save the Date Button.png', 'elements/2/Glossy Gold Google Maps Badge.png']) {
  const { data: d, info: inf } = await sharp(path.join(SRC, f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (const t of [8, 128, 200]) { let x0 = inf.width, y0 = inf.height, x1 = 0, y1 = 0; for (let y = 0; y < inf.height; y++) for (let x = 0; x < inf.width; x++) { if (d[(y * inf.width + x) * 4 + 3] > t) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } } console.log(path.basename(f).padEnd(45), `alpha>${t}`.padEnd(10), `x ${x0}-${x1} y ${y0}-${y1}  (${x1 - x0 + 1}x${y1 - y0 + 1}) of ${inf.width}x${inf.height}`); }
}
// page 5 tiles and page 2 heart: bbox of the diff mask inside the expected rects
async function rgb(f, w, h) { return sharp(path.join(SRC, f)).removeAlpha().resize(w, h, { fit: 'fill' }).raw().toBuffer(); }
async function diffBox(bg, ref, rect, thr) { const m = await sharp(path.join(SRC, bg)).metadata(); const A = await rgb(bg, m.width, m.height), B = await rgb(ref, m.width, m.height); let x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0; for (let y = rect[1]; y < rect[1] + rect[3]; y++) for (let x = rect[0]; x < rect[0] + rect[2]; x++) { const i = (y * m.width + x) * 3; const d = Math.max(Math.abs(A[i] - B[i]), Math.abs(A[i + 1] - B[i + 1]), Math.abs(A[i + 2] - B[i + 2])); if (d > thr) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } } return `x ${x0}-${x1} y ${y0}-${y1} (${x1 - x0 + 1}x${y1 - y0 + 1})`; }
console.log('tile will  ', await diffBox('5.png', 'with text temp/5.png', [180, 700, 290, 330], 30));
console.log('tile unable', await diffBox('5.png', 'with text temp/5.png', [470, 700, 290, 330], 30));
console.log('heart ring ', await diffBox('with text temp/2.png', 'with text temp/2(WHEN REVEAL).png', [190, 850, 110, 90], 90));
console.log('p2 pill    ', await diffBox('2.png', 'with text temp/2.png', [200, 1070, 530, 140], 30));
console.log('p2 pill rev', await diffBox('2.png', 'with text temp/2(WHEN REVEAL).png', [200, 1070, 530, 140], 30));
console.log('p2 save    ', await diffBox('2.png', 'with text temp/2.png', [200, 1214, 530, 104], 30));
console.log('p2 maps    ', await diffBox('2.png', 'with text temp/2.png', [200, 1316, 530, 104], 30));
console.log('p2 cal     ', await diffBox('2.png', 'with text temp/2.png', [140, 660, 660, 420], 30));
