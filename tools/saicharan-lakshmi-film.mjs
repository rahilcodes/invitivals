#!/usr/bin/env node
/* Sai Charan & Lakshmi — the opening film with the couple's CL monogram on the wax seal, in every frame.

     FFMPEG=/path/to/ffmpeg node tools/saicharan-lakshmi-film.mjs [--sheet out.jpg]

   The designer's film (assets/media/opening.mp4) shows the envelope's seal with the pack's dummy "A G"
   for its first ~4.2 s: a slow zoom, a white flash, then the flap lifts and the seal tilts away.
   An overlay on top let the old letters show through, so the film itself is rebuilt:

   1. the film's own first frame gets the same treatment as the still (tools/saicharan-lakshmi-cl.mjs):
      the seal's inner disc is emptied of "A G" and its flowers and the CL monogram is pressed in.
      D = (that frame) − (original frame 0) is exactly the change, in the film's own pixels.
   2. the seal is tracked in every frame against frame 0 — centre, and horizontal / vertical scale, so
      the tilt of the lifting flap is followed — sub-pixel, the flash bridged by interpolation.
   3. each frame gets D warped onto the tracked seal, weighted by how much of the seal's own contrast
      survives (a least-squares fit F ≈ a·seal + b): in the white flash the change fades with the seal,
      so the flash and the glints play over the CL monogram as they did over the letters.
   4. re-encoded as H.264, same size, rate and sound, to assets/media/opening-cl.mp4.
   Inputs are never modified. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const FF = process.env.FFMPEG || 'ffmpeg';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const A = path.join(ROOT, 'public/saicharan-lakshmi-engagement/assets');
const SRC = path.join(ROOT, 'invites/src/saicharan-lakshmi-engagement');
const IN = path.join(A, 'media/opening.mp4'), OUT = path.join(A, 'media/opening-cl.mp4');
const W = 720, H = 1280, FPS = 24;
const C0 = { x: 362, y: 649 }, R_DISC = 73;                    // the seal's inner disc in frame 0 (measured on the film)
const R_TPL = 82;                                               // tracking template reaches onto the rim
const LOGO = Math.round(164 * R_DISC / 90);                     // same proportion to the disc as on the still
const SHEET = process.argv.includes('--sheet') ? process.argv[process.argv.indexOf('--sheet') + 1] : null;

function frames(onFrame) {
  return new Promise((ok, no) => {
    const p = spawn(FF, ['-v', 'error', '-i', IN, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']);
    const size = W * H * 3; let parts = [], have = 0, n = 0, chain = Promise.resolve();
    p.stdout.on('data', (d) => {
      parts.push(d); have += d.length;
      while (have >= size) { const all = Buffer.concat(parts); const f = Buffer.from(all.subarray(0, size)); parts = [all.subarray(size)]; have -= size; const k = n++; chain = chain.then(() => onFrame(f, k)); }
    });
    p.on('close', (code) => chain.then(() => (code ? no(new Error('ffmpeg decode ' + code)) : ok(n))));
  });
}
const lum = (f, x, y) => {
  if (x < 0 || y < 0 || x >= W - 1 || y >= H - 1) return 0;
  const x0 = x | 0, y0 = y | 0, tx = x - x0, ty = y - y0, L = (i) => .3 * f[i] + .59 * f[i + 1] + .11 * f[i + 2];
  const i = (y0 * W + x0) * 3; return (L(i) * (1 - tx) + L(i + 3) * tx) * (1 - ty) + (L(i + W * 3) * (1 - tx) + L(i + W * 3 + 3) * tx) * ty;
};

/* ---- pass 1: frame 0, and the seal's track ---- */
const pts = []; for (let a = 0; a < 360; a += 4) for (let r = .1; r <= 1.001; r += .075) pts.push([Math.cos(a * Math.PI / 180) * r, Math.sin(a * Math.PI / 180) * r]);
let F0 = null, tz = null, tn = 0;
const track = [];
let prev = { x: C0.x, y: C0.y, sx: 1, sy: 1 }, lost = 0, gap = 0;
const score = (f, x, y, sx, sy) => { let m = 0; const v = new Float64Array(pts.length);
  for (let i = 0; i < pts.length; i++) { const q = lum(f, x + pts[i][0] * R_TPL * sx, y + pts[i][1] * R_TPL * sy); v[i] = q; m += q; } m /= v.length;
  let num = 0, den = 0; for (let i = 0; i < v.length; i++) { const z = v[i] - m; num += z * tz[i]; den += z * z; } return num / (Math.sqrt(den) * tn + 1e-6); };
await frames((f, k) => {
  if (k === 0) { F0 = Buffer.from(f); const tpl = pts.map(([u, v]) => lum(f, C0.x + u * R_TPL, C0.y + v * R_TPL)); const m = tpl.reduce((a, b) => a + b) / tpl.length; tz = tpl.map((q) => q - m); tn = Math.hypot(...tz); }
  if (lost >= 2 || k > 130) { track.push(null); return; }
  const lifting = k >= 86;                                      // the flap lifts: the seal rises fast and tilts
  let best = { sc: -2 };
  // after the flash the camera has kept zooming: the longer the seal was lost, the wider the search
  const g = Math.min(gap, 24), dys = lifting ? [-34, 8, 2] : [-4 - g, 4 + g, 1], dxs = lifting ? [-8, 8, 2] : [-4 - g / 2, 4 + g / 2, 1];
  const sxs = lifting ? [-.05, .04, .01] : [-.02, .03 + g * .007, .005], sys = lifting ? [-.16, .04, .02] : null;
  for (let ds = sxs[0]; ds <= sxs[1] + 1e-9; ds += sxs[2]) for (let dsy = sys ? sys[0] : 0; dsy <= (sys ? sys[1] : 0) + 1e-9; dsy += sys ? sys[2] : 1)
    for (let dy = dys[0]; dy <= dys[1]; dy += dys[2]) for (let dx = dxs[0]; dx <= dxs[1]; dx += dxs[2]) {
      const sx = prev.sx + ds, sy = sys ? prev.sy + dsy : sx; if (sy < .3) continue;
      const sc = score(f, prev.x + dx, prev.y + dy, sx, sy); if (sc > best.sc) best = { sc, x: prev.x + dx, y: prev.y + dy, sx, sy };
    }
  for (let it = 0; it < 2; it++) {                               // refine
    const st = it ? .25 : 1, ss = it ? .002 : .006, b = best;
    for (let dsx = -ss * 2; dsx <= ss * 2 + 1e-9; dsx += ss) for (let dsy = -ss * 2; dsy <= ss * 2 + 1e-9; dsy += ss)
      for (let dy = -2 * st; dy <= 2 * st; dy += st) for (let dx = -2 * st; dx <= 2 * st; dx += st) {
        const sx = b.sx + dsx, sy = lifting ? b.sy + dsy : sx; const sc = score(f, b.x + dx, b.y + dy, sx, sy); if (sc > best.sc) best = { sc, x: b.x + dx, y: b.y + dy, sx, sy };
      }
  }
  track.push({ k, t: k / FPS, ...best });
  const bar = lifting ? .5 : .72;                              // the tilted, blurred seal matches less well
  if (best.sc > bar) { prev = best; lost = 0; gap = 0; } else { gap++; if (lifting) lost++; }
});
// trust confident frames; bridge the flash; light smoothing before the lift
const good = track.map((p, k) => p && p.sc > (k >= 86 ? .5 : .72));
const lastGood = good.lastIndexOf(true);
const T = track.map((p, k) => {
  if (!p || k > lastGood) return null;
  if (good[k]) return { ...p };
  let a = k - 1; while (a >= 0 && !good[a]) a--; let b = k + 1; while (b <= lastGood && !good[b]) b++;
  const u = (k - a) / (b - a), P = track[a], Q = track[b];
  return { ...p, x: P.x + (Q.x - P.x) * u, y: P.y + (Q.y - P.y) * u, sx: P.sx + (Q.sx - P.sx) * u, sy: P.sy + (Q.sy - P.sy) * u, bridged: true };
});
const Ts = T.map((p, k) => { if (!p || k >= 84) return p; let n = 0, x = 0, y = 0, sx = 0, sy = 0;
  for (let j = k - 2; j <= k + 2; j++) if (T[j] && j < 84) { x += T[j].x; y += T[j].y; sx += T[j].sx; sy += T[j].sy; n++; } return { ...p, x: x / n, y: y / n, sx: sx / n, sy: sy / n }; });

/* ---- D: frame 0's seal emptied and stamped, minus frame 0 ---- */
const px = Float32Array.from(F0);
{
  const inDisc = (x, y) => (x - C0.x) ** 2 + (y - C0.y) ** 2 <= R_DISC ** 2;
  const x0 = C0.x - R_DISC - 2, x1 = C0.x + R_DISC + 2, y0 = C0.y - R_DISC - 2, y1 = C0.y + R_DISC + 2;
  let acc = [0, 0, 0], n = 0;
  for (let a = 0; a < 360; a += 2) { const x = Math.round(C0.x + Math.cos(a * Math.PI / 180) * (R_DISC + 1)), y = Math.round(C0.y + Math.sin(a * Math.PI / 180) * (R_DISC + 1)); for (let c = 0; c < 3; c++) acc[c] += px[(y * W + x) * 3 + c]; n++; }
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inDisc(x, y)) for (let c = 0; c < 3; c++) px[(y * W + x) * 3 + c] = acc[c] / n;
  for (let it = 0; it < 900; it++) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inDisc(x, y)) {
    const i = (y * W + x) * 3; for (let c = 0; c < 3; c++) px[i + c] = (px[i - 3 + c] + px[i + 3 + c] + px[i - W * 3 + c] + px[i + W * 3 + c]) / 4; }
  let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - .5;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inDisc(x, y)) {
    const u = (x - C0.x) / R_DISC, v = (y - C0.y) / R_DISC, light = 1 + .05 * (-u - v) / 1.4, g = rnd() * 3;
    for (let c = 0; c < 3; c++) px[(y * W + x) * 3 + c] = px[(y * W + x) * 3 + c] * light + g; }
}
const plate = Buffer.alloc(px.length); for (let i = 0; i < px.length; i++) plate[i] = Math.max(0, Math.min(255, Math.round(px[i])));
/* where the old "A G" and its flowers were (frame 0 vs the emptied disc), grown by 3 px — in the flash those
   raised letters catch the light, so any highlight in exactly that shape is smoothed away (see pass 2) */
const MR = R_DISC + 4, MS = MR * 2 + 1, MASK = new Float32Array(MS * MS);
{ const raw = new Uint8Array(MS * MS);
  for (let j = 0; j < MS; j++) for (let i = 0; i < MS; i++) { const x = C0.x - MR + i, y = C0.y - MR + j, p = (y * W + x) * 3;
    const d = Math.abs(.3 * (F0[p] - plate[p]) + .59 * (F0[p + 1] - plate[p + 1]) + .11 * (F0[p + 2] - plate[p + 2]));
    if (Math.hypot(x - C0.x, y - C0.y) <= R_DISC - 1 && d > 9) raw[j * MS + i] = 1; }
  for (let j = 0; j < MS; j++) for (let i = 0; i < MS; i++) { let m = 0;
    for (let dy = -3; dy <= 3 && !m; dy++) for (let dx = -3; dx <= 3; dx++) { const a = i + dx, b = j + dy; if (a >= 0 && b >= 0 && a < MS && b < MS && raw[b * MS + a] && dx * dx + dy * dy <= 9) { m = 1; break; } }
    MASK[j * MS + i] = m; } }
const sampleM = (u, v) => { const x = Math.round(u + MR), y = Math.round(v + MR); return x < 0 || y < 0 || x >= MS || y >= MS ? 0 : MASK[y * MS + x]; };
const logo = await sharp(path.join(A, 'el/cl-logo.webp')).resize(LOGO, LOGO, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
const alpha = await sharp(logo).extractChannel(3).toBuffer();
const shadow = await sharp({ create: { width: LOGO, height: LOGO, channels: 3, background: { r: 92, g: 58, b: 22 } } }).joinChannel(alpha).png().toBuffer().then((b) => sharp(b).blur(1.3).png().toBuffer());
const L0 = Math.round(C0.x - LOGO / 2), T0 = Math.round(C0.y - LOGO / 2 + 2);
const stamped = await sharp(plate, { raw: { width: W, height: H, channels: 3 } })
  .composite([{ input: shadow, left: L0 + 1, top: T0 + 2, blend: 'multiply' }, { input: logo, left: L0, top: T0 }]).removeAlpha().raw().toBuffer();
const DR = R_DISC + 4, DS = DR * 2 + 1, D = new Float32Array(DS * DS * 3);
for (let j = 0; j < DS; j++) for (let i = 0; i < DS; i++) { const x = C0.x - DR + i, y = C0.y - DR + j, p = (y * W + x) * 3, q = (j * DS + i) * 3;
  const r = Math.hypot(x - C0.x, y - C0.y), soft = Math.max(0, Math.min(1, (R_DISC + 1.5 - r) / 2.5));   // fade over the last pixels into the rim
  for (let c = 0; c < 3; c++) D[q + c] = (stamped[p + c] - F0[p + c]) * soft; }
const sampleS = (u, v, c) => { const X = C0.x + u, Y = C0.y + v, x0 = X | 0, y0 = Y | 0, tx = X - x0, ty = Y - y0, j = (y0 * W + x0) * 3 + c;
  return (stamped[j] * (1 - tx) + stamped[j + 3] * tx) * (1 - ty) + (stamped[j + W * 3] * (1 - tx) + stamped[j + W * 3 + 3] * tx) * ty; };
const sampleD = (u, v, c) => { const fx = u + DR, fy = v + DR; if (fx < 0 || fy < 0 || fx >= DS - 1 || fy >= DS - 1) return 0;
  const x0 = fx | 0, y0 = fy | 0, tx = fx - x0, ty = fy - y0, i = (y0 * DS + x0) * 3 + c;
  return (D[i] * (1 - tx) + D[i + 3] * tx) * (1 - ty) + (D[i + DS * 3] * (1 - tx) + D[i + DS * 3 + 3] * tx) * ty; };
if (SHEET) await sharp(stamped, { raw: { width: W, height: H, channels: 3 } }).extract({ left: C0.x - 110, top: C0.y - 110, width: 220, height: 220 }).png().toFile(SHEET.replace(/\.jpg$/, '-frame0.png'));

/* ---- pass 2: apply, encode ---- */
/* the cut: the rebuilt film is used while it is verifiably clean (CL on the seal, the slow zoom, the first glow);
   from CUT it dissolves over XF frames into the designer's film at JUMP, the first frame after the lifting
   flap has carried the seal off the top of the screen. The flash and the tilt — where any trace of the old
   letters could survive — are never shown. The page plays the film muted, so no sound track is kept. */
const CUT = 48, XF = 12, JUMP = 104;
const enc = spawn(FF, ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
  '-map', '0:v', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', OUT]);
/* the live page plays assets/media/opening-cl-v2.mp4: this film cut at 4.0 s, because after the sparkle burst the
   designer's film is only blank cream paper (the client saw it as an empty slide). Re-cut after a rebuild:
   ffmpeg -i opening-cl.mp4 -t 4.0 -an -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -profile:v high -movflags +faststart opening-cl-v2.mp4 */
let encErr = ''; enc.stderr.on('data', (d) => { encErr += d; });
const write = (b) => new Promise((ok) => (enc.stdin.write(b) ? ok() : enc.stdin.once('drain', ok)));
const held = []; const log = [], sheet = [], SHEETK = [0, 30, 55, 58, 62, 66, 70, 74, 80, 86, 89, 92, 95, 98, 101];
await frames(async (f, k) => {
  const p = Ts[k];
  if (p) {
    let sB = 0, sF = 0, sBB = 0, sBF = 0, n = 0;
    for (const [u, v] of pts) { if (u * u + v * v > (R_DISC / R_TPL) ** 2) continue;
      const B = lum(F0, C0.x + u * R_TPL, C0.y + v * R_TPL), F = lum(f, p.x + u * R_TPL * p.sx, p.y + v * R_TPL * p.sy); sB += B; sF += F; sBB += B * B; sBF += B * F; n++; }
    const a = Math.max(0, Math.min(1.15, (n * sBF - sB * sF) / (n * sBB - sB * sB + 1e-6)));
    log.push([p.t.toFixed(3), p.x.toFixed(2), p.y.toFixed(2), p.sx.toFixed(4), p.sy.toFixed(4), p.sc.toFixed(2), a.toFixed(2), p.bridged ? 'b' : ''].join(' '));
    const b = (sF - a * sB) / n;
    const Rx = R_DISC * p.sx + 4, Ry = R_DISC * p.sy + 4;
    const bx0 = Math.max(0, Math.floor(p.x - Rx)), bx1 = Math.min(W - 1, Math.ceil(p.x + Rx)), by0 = Math.max(0, Math.floor(p.y - Ry)), by1 = Math.min(H - 1, Math.ceil(p.y + Ry));
    const bw = bx1 - bx0 + 1, bh = by1 - by0 + 1;
    // residual light outside the letters, and the letter mask, on this frame's pixels
    const E = new Float32Array(bw * bh * 3), Mk = new Float32Array(bw * bh);
    for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
      const u = (x - p.x) / p.sx, v = (y - p.y) / p.sy, q = (y - by0) * bw + (x - bx0), i = (y * W + x) * 3;
      Mk[q] = sampleM(u, v);
      const X = C0.x + u, Y = C0.y + v;
      for (let c = 0; c < 3; c++) { const x0 = X | 0, y0 = Y | 0, tx = X - x0, ty = Y - y0, j = (y0 * W + x0) * 3 + c;
        const B = X < 0 || Y < 0 || X >= W - 1 || Y >= H - 1 ? 0 : (F0[j] * (1 - tx) + F0[j + 3] * tx) * (1 - ty) + (F0[j + W * 3] * (1 - tx) + F0[j + W * 3 + 3] * tx) * ty;
        E[q * 3 + c] = f[i + c] - (a * B + b); }
    }
    // normalised box blur of E over the unmasked pixels (radius 9) — the light the letters would have had without their own highlight
    const r = 9, Es = new Float32Array(bw * bh * 3);
    if (a < .97) { const acc = new Float32Array((bw + 1) * (bh + 1) * 4);
      for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) { const q = y * bw + x, w = 1 - Mk[q], o = ((y + 1) * (bw + 1) + x + 1) * 4, oL = o - 4, oU = o - (bw + 1) * 4, oUL = oU - 4;
        for (let c = 0; c < 4; c++) { const val = c < 3 ? E[q * 3 + c] * w : w; acc[o + c] = val + acc[oL + c] + acc[oU + c] - acc[oUL + c]; } }
      const S = (x0, y0, x1, y1, c) => acc[(y1 * (bw + 1) + x1) * 4 + c] - acc[(y0 * (bw + 1) + x1) * 4 + c] - acc[(y1 * (bw + 1) + x0) * 4 + c] + acc[(y0 * (bw + 1) + x0) * 4 + c];
      for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) { const x0 = Math.max(0, x - r), y0 = Math.max(0, y - r), x1 = Math.min(bw, x + r + 1), y1 = Math.min(bh, y + r + 1);
        const wsum = S(x0, y0, x1, y1, 3), q = y * bw + x; for (let c = 0; c < 3; c++) Es[q * 3 + c] = wsum > .5 ? S(x0, y0, x1, y1, c) / wsum : E[q * 3 + c]; } }
    for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
      const u = (x - p.x) / p.sx, v = (y - p.y) / p.sy; if (u * u + v * v > (R_DISC + 3) ** 2) continue;
      const i = (y * W + x) * 3, q = (y - by0) * bw + (x - bx0), m = a < .97 ? Mk[q] * Math.min(1, (1 - a) * 3) : 0;
      const rr = Math.sqrt(u * u + v * v), keep = Math.max(0, Math.min(1, (rr - (R_DISC - 3)) / 3.5));   // 0 inside, 1 at the rim
      for (let c = 0; c < 3; c++) {
        const add = f[i + c] + a * sampleD(u, v, c) - m * (E[q * 3 + c] - Es[q * 3 + c]);       // near the rim: the change only
        const rep = a * sampleS(u, v, c) + b;                                                   // inside: the CL disc itself
        f[i + c] = Math.max(0, Math.min(255, Math.round(rep * (1 - keep) + add * keep)));
      }
    }
  }
  if (SHEET && SHEETK.includes(k)) sheet.push(Buffer.from(f));
  if (k < CUT || k >= JUMP + XF) return write(f);
  if (k < CUT + XF) { held[k - CUT] = Buffer.from(f); return; }
  if (k < JUMP) return;                                          // the flash and the lift are skipped
  const i = k - JUMP, u = (i + 1) / (XF + 1), w = u * u * (3 - 2 * u), A0 = held[i], out = Buffer.alloc(f.length);
  for (let j = 0; j < f.length; j++) out[j] = Math.round(A0[j] * (1 - w) + f[j] * w);
  return write(out);
});
enc.stdin.end();
await new Promise((ok, no) => enc.on('close', (c) => (c ? no(new Error('encode failed: ' + encErr)) : ok())));
fs.writeFileSync(path.join(SRC, 'opening-cl.track.txt'), 't x y sx sy score a\n' + log.join('\n') + '\n');
console.log('film ->', path.relative(ROOT, OUT), `(${(fs.statSync(OUT).size / 1e6).toFixed(1)} MB; cut ${CUT}→${JUMP}, ${((241 - (JUMP - CUT)) / FPS).toFixed(2)} s long)`);
if (SHEET) {
  const tiles = await Promise.all(sheet.map((f) => sharp(f, { raw: { width: W, height: H, channels: 3 } }).extract({ left: C0.x - 140, top: 380, width: 280, height: 420 }).resize(140, 210).png().toBuffer()));
  await sharp({ create: { width: 145 * tiles.length, height: 210, channels: 3, background: '#fff' } }).composite(tiles.map((input, i) => ({ input, left: i * 145, top: 0 }))).jpeg({ quality: 88 }).toFile(SHEET);
}
