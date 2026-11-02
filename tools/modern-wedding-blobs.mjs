/* lists the connected regions where a reference differs from its clean template (ref px, 941 wide) */
import sharp from 'sharp'; import path from 'node:path';
const SRC = 'invites/src/modern-wedding';
const [bgName, refName, thr = 50, minArea = 40, x0 = 0, y0 = 0, x1 = 9999, y1 = 9999] = process.argv.slice(2);
const bgMeta = await sharp(path.join(SRC, bgName)).metadata();
const W = bgMeta.width, H = bgMeta.height;
const rgb = async (f) => (await sharp(f).removeAlpha().resize(W, H, { fit: 'fill' }).raw().toBuffer());
const A = await rgb(path.join(SRC, bgName)), B = await rgb(path.join(SRC, refName));
const m = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) { const d = Math.max(Math.abs(A[i*3]-B[i*3]), Math.abs(A[i*3+1]-B[i*3+1]), Math.abs(A[i*3+2]-B[i*3+2])); const x = i % W, y = (i / W) | 0; if (d > +thr && x >= +x0 && x < +x1 && y >= +y0 && y < +y1) m[i] = 1; }
// dilate by 3 so letters of a word join
let cur = m; for (let k = 0; k < 3; k++) { const n = cur.slice(); for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; if (!cur[i] && (cur[i-1]||cur[i+1]||cur[i-W]||cur[i+W])) n[i] = 1; } cur = n; }
const lab = new Int32Array(W * H); let next = 0; const boxes = [];
for (let s = 0; s < W * H; s++) { if (!cur[s] || lab[s]) continue; next++; const st = [s]; lab[s] = next; let bx0 = W, by0 = H, bx1 = 0, by1 = 0, area = 0; while (st.length) { const i = st.pop(); const x = i % W, y = (i / W) | 0; area++; if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; for (const j of [i-1, i+1, i-W, i+W]) if (j >= 0 && j < W * H && cur[j] && !lab[j]) { lab[j] = next; st.push(j); } } if (area >= +minArea) boxes.push({ x: bx0, y: by0, w: bx1 - bx0 + 1, h: by1 - by0 + 1, area }); }
boxes.sort((a, b) => a.y - b.y || a.x - b.x);
console.log(W + 'x' + H, boxes.length, 'regions'); for (const b of boxes) console.log(`y ${String(b.y).padStart(4)}-${String(b.y + b.h).padStart(4)}  x ${String(b.x).padStart(4)}-${String(b.x + b.w).padStart(4)}  ${b.w}x${b.h} area ${b.area}`);
