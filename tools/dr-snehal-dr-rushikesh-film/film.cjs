/* Dr. Snehal & Dr. Rushikesh: the opening film with the couple's SR monogram pressed into the wax seal, in the
   film's own pixels, so it cracks and flies apart with the seal (client, 2026-11-17).

   The design's film (public/vaishali-arpan-wedding/assets/opening.mp4, read only) has a seal lettered "CL". Work in
   a scratch folder W (frames in W/f/001.png …, made with  ffmpeg -i opening.mp4 -t 4 f/%03d.png):

     node tools/dr-snehal-dr-rushikesh-film/film.cjs <W> [lastFrame]

   1. the face of frame 0's seal is emptied of its letters (filled from the plain wax round them) and SR is embossed
      into it (sr-monogram.png: the shape; shading as the film lights its own letters) → W/face0.png
   2. while the seal is whole (to frame WHOLE) it is tracked against frame 0 as one piece (an affine fit by
      normalised correlation)
   3. the pieces the seal breaks into are taken from frame PIECES (the first with clear gaps) and each is tracked
      on its own, back to WHOLE and forward for as long as it can be followed
   4. every frame: each pixel of the face, through its piece's track, takes the new face, lit as that piece is lit;
      cracks, the flower's heart and anything else in front of the wax are kept as filmed
   → W/o/001.png …, W/track.json. Encoding and the poster: see README.md. */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Wd = process.argv[2], LAST = Number(process.argv[3] || 80);
const W = 720, H = 1280;
const C0 = { x: Number(process.env.CX || 370), y: Number(process.env.CY || 636.3) }, RF = Number(process.env.RF || 69), RT = 104;   // face radius (inside the inner ring), template radius (to the rim)
const WHOLE = 57, PIECES = 61, OCC0 = Number(process.env.OCC || 30);
const PW = 240, PX = Math.round(C0.x - PW / 2), PY = Math.round(C0.y - PW / 2);
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const file = (i, d = 'f') => path.join(Wd, d, String(i + 1).padStart(3, '0') + '.png');
const rgb = async (i) => sharp(file(i)).removeAlpha().raw().toBuffer();
const grayOf = async (i) => sharp(file(i)).greyscale().blur(1.3).toColourspace('b-w').raw().toBuffer();
const samp = (g, x, y) => { if (x < 0 || y < 0 || x > W - 2 || y > H - 2) return -1; const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, i = y0 * W + x0; return (g[i] * (1 - fx) + g[i + 1] * fx) * (1 - fy) + (g[i + W] * (1 - fx) + g[i + W + 1] * fx) * fy; };
const samp3 = (F, x, y, c) => { x = Math.max(0, Math.min(W - 1.001, x)); y = Math.max(0, Math.min(H - 1.001, y)); const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, i = (y0 * W + x0) * 3 + c; return (F[i] * (1 - fx) + F[i + 3] * fx) * (1 - fy) + (F[i + W * 3] * (1 - fx) + F[i + W * 3 + 3] * fx) * fy; };
const blur1 = async (arr, w, h, sigma) => { const u = Buffer.alloc(w * h); for (let k = 0; k < w * h; k++) u[k] = Math.max(0, Math.min(255, Math.round(arr[k]))); return sharp(u, { raw: { width: w, height: h, channels: 1 } }).blur(sigma).toColourspace('b-w').raw().toBuffer(); };

/* an affine fit: points [x, y, value] of a template about (ox, oy) → the frame `g`; p = [tx, ty, a, b, c, d] */
function fit(pts, ox, oy, g, init, steps = [3, 3, .03, .03, .03, .03]) {
  const score = (p) => {
    let n = 0, sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
    for (let k = 0; k < pts.length; k++) {
      const dx = pts[k][0] - ox, dy = pts[k][1] - oy, a = pts[k][2];
      const b = samp(g, p[0] + p[2] * dx + p[3] * dy, p[1] + p[4] * dx + p[5] * dy);
      if (b < 0) continue;
      n++; sa += a; sb += b; saa += a * a; sbb += b * b; sab += a * b;
    }
    if (n < pts.length / 4) return -2;
    return (sab - sa * sb / n) / Math.sqrt((saa - sa * sa / n) * (sbb - sb * sb / n) + 1e-6);
  };
  let q = init.slice(), best = score(q), st = steps.slice();
  for (let lvl = 0; lvl < 9; lvl++) {
    for (let pass = 0; pass < 5; pass++) {
      let moved = false;
      for (let k = 0; k < 6; k++) for (const d of [-1, 1]) { const t = q.slice(); t[k] += d * st[k]; const sc = score(t); if (sc > best) { best = sc; q = t; moved = true; } }
      if (!moved) break;
    }
    st = st.map((v) => v / 2);
  }
  return { p: q, ncc: best };
}
const apply = (p, ox, oy, x, y) => [p[0] + p[2] * (x - ox) + p[3] * (y - oy), p[1] + p[4] * (x - ox) + p[5] * (y - oy)];
const invert = (p, ox, oy, X, Y) => { const det = p[2] * p[5] - p[3] * p[4], dx = X - p[0], dy = Y - p[1]; return [ox + (p[5] * dx - p[3] * dy) / det, oy + (-p[4] * dx + p[2] * dy) / det]; };

(async () => {
  const f0 = await rgb(0);
  const lum = (F, i) => .3 * F[i] + .59 * F[i + 1] + .11 * F[i + 2];

  /* ── 1 · the new face, in frame 0's pixels ── */
  const face = new Float32Array(PW * PW * 3), plain = new Uint8Array(PW * PW), L = new Float32Array(PW * PW);
  for (let y = 0; y < PW; y++) for (let x = 0; x < PW; x++) L[y * PW + x] = lum(f0, ((PY + y) * W + PX + x) * 3);
  const Lb = await blur1(L, PW, PW, 9);
  for (let y = 1; y < PW - 1; y++) for (let x = 1; x < PW - 1; x++) {
    const k = y * PW + x, r = Math.hypot(PX + x - C0.x, PY + y - C0.y);
    const gx = L[k + 1] - L[k - 1], gy = L[k + PW] - L[k - PW];
    plain[k] = (r < RF - 1 && Math.abs(L[k] - Lb[k]) < 7 && Math.hypot(gx, gy) < 9) ? 1 : 0;
  }
  const er = new Float32Array(PW * PW);
  for (let y = 2; y < PW - 2; y++) for (let x = 2; x < PW - 2; x++) { let m = 1; for (let j = -2; j <= 2 && m; j++) for (let k = -2; k <= 2; k++) if (!plain[(y + j) * PW + x + k]) { m = 0; break; } er[y * PW + x] = m; }
  const mean = [0, 0, 0]; { let n = 0; for (let k = 0; k < PW * PW; k++) if (er[k]) { n++; const i = ((PY + ((k / PW) | 0)) * W + PX + (k % PW)) * 3; for (let c = 0; c < 3; c++) mean[c] += f0[i + c]; } for (let c = 0; c < 3; c++) mean[c] /= n; console.log('plain wax', mean.map(Math.round).join(','), 'pixels', n); }
  const mA = await blur1(er.map((v) => v * 255), PW, PW, 6), mB = await blur1(er.map((v) => v * 255), PW, PW, 20);
  for (let c = 0; c < 3; c++) {
    const src = new Float32Array(PW * PW); for (let k = 0; k < PW * PW; k++) src[k] = er[k] * f0[((PY + ((k / PW) | 0)) * W + PX + (k % PW)) * 3 + c];
    const a = await blur1(src, PW, PW, 6), b = await blur1(src, PW, PW, 20);
    for (let k = 0; k < PW * PW; k++) {
      const n1 = mA[k] / 255, n2 = mB[k] / 255;
      const v2 = n2 > .2 ? b[k] / n2 : mean[c], v2b = mean[c] + (v2 - mean[c]) * smooth(.2, .45, n2), v1 = n1 > .3 ? a[k] / n1 : v2b;
      face[k * 3 + c] = v2b + (v1 - v2b) * smooth(.3, .6, n1);
    }
  }
  for (let k = 0; k < PW * PW; k++) { const n = Math.sin((k % PW) * 12.9898 + ((k / PW) | 0) * 78.233) * 43758.5453, g = (n - Math.floor(n) - .5) * 3; for (let c = 0; c < 3; c++) face[k * 3 + c] += g; }
  const plainFace = Float32Array.from(face);
  /* SR, embossed: the shape's edges take a dark wall on the upper left and a lit wall on the lower right, as the
     film's own letters do; the letter's floor is a shade lighter and warmer than the face */
  {
    const src = await sharp(path.join(__dirname, 'sr-monogram.png')).greyscale().toColourspace('b-w').raw().toBuffer({ resolveWithObject: true });
    let x0 = 1e9, x1 = 0, y0 = 1e9, y1 = 0; const sw = src.info.width, shh = src.info.height;
    for (let y = 0; y < shh; y++) for (let x = 0; x < sw; x++) if (src.data[y * sw + x] > 128) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const MH = Math.round(RF * 2 * Number(process.env.MONO || .7)), sc = MH / (y1 - y0 + 1), MW = Math.round((x1 - x0 + 1) * sc);
    const m = await sharp(src.data, { raw: { width: sw, height: shh, channels: 1 } }).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }).resize(MW, MH, { kernel: 'lanczos3' }).toColourspace('b-w').raw().toBuffer();
    const M = new Float32Array(PW * PW), ox = Math.round(PW / 2 - MW / 2), oy = Math.round(PW / 2 - MH / 2);
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) M[(oy + y) * PW + ox + x] = m[y * MW + x];
    const hgt = await blur1(M, PW, PW, 1.0), soft = await blur1(M, PW, PW, .6);
    const at = (x, y) => hgt[Math.max(0, Math.min(PW - 1, y)) * PW + Math.max(0, Math.min(PW - 1, x))] / 255;
    for (let y = 2; y < PW - 2; y++) for (let x = 2; x < PW - 2; x++) {
      const k = y * PW + x, s = (at(x + 1, y + 1) + at(x + 2, y + 2)) / 2 - (at(x - 1, y - 1) + at(x - 2, y - 2)) / 2, body = soft[k] / 255;
      const dark = Math.max(0, s), lit = Math.max(0, -s);
      const d = [-78 * dark + 46 * lit + 7 * body, -74 * dark + 40 * lit + 4 * body, -62 * dark + 26 * lit - 1 * body];
      for (let c = 0; c < 3; c++) face[k * 3 + c] += d[c];
    }
  }
  { const u = Buffer.alloc(PW * PW * 3); for (let k = 0; k < u.length; k++) u[k] = Math.max(0, Math.min(255, Math.round(face[k]))); await sharp(u, { raw: { width: PW, height: PW, channels: 3 } }).png().toFile(path.join(Wd, 'face0.png')); }
  /* frame 0 with the new face, for the eye and for the poster */
  const sampP = (arr, x, y, c) => { x = Math.max(0, Math.min(PW - 1.001, x - PX)); y = Math.max(0, Math.min(PW - 1.001, y - PY)); const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, i = (y0 * PW + x0) * 3 + c; return (arr[i] * (1 - fx) + arr[i + 3] * fx) * (1 - fy) + (arr[i + PW * 3] * (1 - fx) + arr[i + PW * 3 + 3] * fx) * fy; };
  if (process.env.FACE_ONLY) {
    const F = Buffer.from(f0);
    for (let y = PY; y < PY + PW; y++) for (let x = PX; x < PX + PW; x++) { const a = 1 - smooth(RF - 4, RF, Math.hypot(x - C0.x, y - C0.y)); if (a > 0) for (let c = 0; c < 3; c++) F[(y * W + x) * 3 + c] = Math.round(F[(y * W + x) * 3 + c] * (1 - a) + sampP(face, x, y, c) * a); }
    await sharp(F, { raw: { width: W, height: H, channels: 3 } }).extract({ left: PX - 30, top: PY - 30, width: PW + 60, height: PW + 60 }).resize(900).png().toFile(path.join(Wd, 'face-check.png'));
    return;
  }

  /* ── 2 · the whole seal, frames 0 … WHOLE (and a little beyond, as a first guess for the pieces) ── */
  const g0 = await grayOf(0);
  const tplWhole = [];
  for (let dy = -RT; dy <= RT; dy += 1) for (let dx = -RT; dx <= RT; dx += 1) if (Math.hypot(dx, dy) <= RT && (dx + dy) % 2 === 0) tplWhole.push([C0.x + dx, C0.y + dy, samp(g0, C0.x + dx, C0.y + dy)]);
  const G = []; let p = [C0.x, C0.y, 1, 0, 0, 1];
  for (let i = 0; i <= PIECES; i++) { const r = fit(tplWhole, C0.x, C0.y, await grayOf(i), p); p = r.p; G.push(r); if (i % 8 === 0 || i > WHOLE - 2) console.log('whole', i, p.map((v) => v.toFixed(3)).join(' '), r.ncc.toFixed(3)); }

  /* ── 3 · the pieces, from frame PIECES ── */
  const FP = await rgb(PIECES), gP = await grayOf(PIECES);
  const cP = [G[WHOLE].p[0], G[WHOLE].p[1]], BW = 300, bx = Math.round(cP[0] - BW / 2), by = Math.round(cP[1] - BW / 2);
  const wax = new Uint8Array(BW * BW);
  for (let y = 0; y < BW; y++) for (let x = 0; x < BW; x++) { const i = ((by + y) * W + bx + x) * 3, l = lum(FP, i); wax[y * BW + x] = (l > 112 && FP[i] - FP[i + 2] > 38 && FP[i] - FP[i + 2] < 120 && Math.hypot(bx + x - cP[0], by + y - cP[1]) < 122) ? 1 : 0; }
  const morph = (src, w, h, n, erode) => { const d = new Uint8Array(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let m = erode ? 1 : 0; for (let j = -n; j <= n; j++) { const yy = y + j; if (yy < 0 || yy >= h) continue; let stop = false; for (let k = -n; k <= n; k++) { if (j * j + k * k > n * n + 1) continue; const xx = x + k; if (xx < 0 || xx >= w) continue; const v = src[yy * w + xx]; if (erode && !v) { m = 0; stop = true; break; } if (!erode && v) { m = 1; stop = true; break; } } if (stop) break; } d[y * w + x] = m; } return d; };
  const core = morph(wax, BW, BW, 4, true);
  const lab = new Int16Array(BW * BW); let nl = 0; const areas = [0];
  for (let s = 0; s < BW * BW; s++) if (core[s] && !lab[s]) { nl++; let a = 0; const st = [s]; lab[s] = nl; while (st.length) { const k = st.pop(); a++; const x = k % BW, y = (k / BW) | 0; for (const [ddx, ddy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = x + ddx, yy = y + ddy; if (xx < 0 || yy < 0 || xx >= BW || yy >= BW) continue; const kk = yy * BW + xx; if (core[kk] && !lab[kk]) { lab[kk] = nl; st.push(kk); } } } areas.push(a); }
  /* grow each core back over the wax it was eroded from */
  for (let it = 0; it < 6; it++) { const nx = Int16Array.from(lab); for (let y = 1; y < BW - 1; y++) for (let x = 1; x < BW - 1; x++) { const k = y * BW + x; if (lab[k] || !wax[k]) continue; nx[k] = lab[k - 1] || lab[k + 1] || lab[k - BW] || lab[k + BW]; } lab.set(nx); }
  /* … and over the old letters' dark walls inside it (not wax-coloured, but not as dark as a gap either) */
  for (let it = 0; it < 4; it++) { const nx = Int16Array.from(lab); for (let y = 1; y < BW - 1; y++) for (let x = 1; x < BW - 1; x++) { const k = y * BW + x; if (lab[k]) continue; if (lum(FP, ((by + y) * W + bx + x) * 3) < 88) continue; nx[k] = lab[k - 1] || lab[k + 1] || lab[k - BW] || lab[k + BW]; } lab.set(nx); }
  const pieces = [];
  for (let l = 1; l <= nl; l++) {
    if (areas[l] < 220) continue;
    let sx = 0, sy = 0, n = 0; const pts = [];
    for (let k = 0; k < BW * BW; k++) if (lab[k] === l) { const x = bx + (k % BW), y = by + ((k / BW) | 0); sx += x; sy += y; n++; if ((x + y) % 2 === 0) pts.push([x, y, gP[y * W + x]]); }
    pieces.push({ l, ox: sx / n, oy: sy / n, n, pts, tr: {} });
  }
  console.log('pieces', pieces.map((q) => `#${q.l} ${q.n}px @${q.ox.toFixed(0)},${q.oy.toFixed(0)}`).join('  '));
  { const u = Buffer.alloc(BW * BW * 3); for (let k = 0; k < BW * BW; k++) { const l = lab[k]; u[k * 3] = l ? (l * 97) % 200 + 55 : 0; u[k * 3 + 1] = l ? (l * 57) % 200 + 55 : 0; u[k * 3 + 2] = l ? (l * 151) % 200 + 55 : 0; } await sharp(u, { raw: { width: BW, height: BW, channels: 3 } }).png().toFile(path.join(Wd, 'pieces.png')); }
  const grays = {};
  const gOf = async (i) => (grays[i] || (grays[i] = await grayOf(i)));
  for (const q of pieces) {
    const id = [q.ox, q.oy, 1, 0, 0, 1];
    q.tr[PIECES] = { p: id, ncc: 1 };
    let pp = id; for (let i = PIECES - 1; i >= WHOLE; i--) { const r = fit(q.pts, q.ox, q.oy, await gOf(i), pp, [2, 2, .02, .02, .02, .02]); q.tr[i] = r; pp = r.p; }
    pp = id; let prev = null;
    for (let i = PIECES + 1; i <= LAST; i++) {
      const guess = prev ? pp.map((v, k) => v + (v - prev[k])) : pp, g = await gOf(i);
      let r = fit(q.pts, q.ox, q.oy, g, guess, [4, 4, .04, .04, .04, .04]); const r2 = fit(q.pts, q.ox, q.oy, g, pp, [4, 4, .04, .04, .04, .04]); if (r2.ncc > r.ncc) r = r2;
      if (r.ncc < Number(process.env.NCC || .45)) { q.lost = i; break; }
      q.tr[i] = r; prev = pp; pp = r.p;
    }
    console.log(`piece #${q.l}: back to ${WHOLE} ncc ${q.tr[WHOLE].ncc.toFixed(2)}, followed to ${q.lost ? q.lost - 1 : LAST}`, Object.keys(q.tr).filter((k) => k > PIECES).map((k) => q.tr[k].ncc.toFixed(2)).join(' '));
  }
  fs.writeFileSync(path.join(Wd, 'track.json'), JSON.stringify({ G: G.map((r) => r.p), pieces: pieces.map((q) => ({ l: q.l, ox: q.ox, oy: q.oy, lost: q.lost, tr: q.tr })) }));

  /* ── 4 · paint ── */
  fs.mkdirSync(path.join(Wd, 'o'), { recursive: true });
  const SW = 420;                                                  // the square of the frame that may change
  for (let fi = 0; fi <= LAST; fi++) {
    const F = await rgb(fi);
    const cx = fi <= WHOLE ? G[fi].p[0] : cP[0], cy = fi <= WHOLE ? G[fi].p[1] : cP[1];
    const sx0 = Math.max(0, Math.round(cx - SW / 2)), sy0 = Math.max(0, Math.round(cy - SW / 2)), sw = Math.min(W - sx0, SW), sh = Math.min(H - sy0, SW);
    /* for each pixel: where on frame 0's face it comes from (u, v), or nothing */
    const U = new Float32Array(sw * sh).fill(-1), V = new Float32Array(sw * sh), PI = new Int16Array(sw * sh);
    const maps = fi <= WHOLE ? [{ id: 1, toRef: (x, y) => invert(G[fi].p, C0.x, C0.y, x, y), ok: () => true }]
      : pieces.filter((q) => q.tr[fi] && q.tr[fi].ncc >= .6).map((q, n) => ({ id: n + 1, toRef(x, y) {
        const [px, py] = invert(q.tr[fi].p, q.ox, q.oy, x, y);                    // → frame PIECES
        const lx = Math.round(px) - bx, ly = Math.round(py) - by; if (lx < 0 || ly < 0 || lx >= BW || ly >= BW || lab[ly * BW + lx] !== q.l) return null;
        const [wx, wy] = apply(q.tr[WHOLE].p, q.ox, q.oy, px, py);               // → frame WHOLE
        return invert(G[WHOLE].p, C0.x, C0.y, wx, wy);                          // → frame 0
      } }));
    for (const m of maps) for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      const r = m.toRef(sx0 + x, sy0 + y); if (!r) continue;
      if (Math.hypot(r[0] - C0.x, r[1] - C0.y) > RF) continue;
      const k = y * sw + x; U[k] = r[0]; V[k] = r[1]; PI[k] = m.id;
    }
    /* Once the seal is in pieces, a piece that tilts away can no longer be followed, and the film's old letters would
       show on it. So wherever a piece's face is (by its track, or carried on at its last speed once the track is
       lost), the relief on the wax is smoothed away first: thin lighter or darker strokes lying in plain wax are
       filled from the plain wax round them. Gaps, the flower's heart and glints are left alone. */
    const O = Buffer.from(F);
    if (fi > WHOLE) {
      let roi = new Uint8Array(sw * sh);
      for (const q of pieces) {
        let pt = q.tr[fi] && q.tr[fi].p;
        if (!pt) { const ks = Object.keys(q.tr).map(Number).sort((a, b) => a - b), a = q.tr[ks[ks.length - 1]].p, b = q.tr[ks[ks.length - 2]].p, n = fi - ks[ks.length - 1]; if (n > 10) continue; pt = a.slice(); pt[0] += (a[0] - b[0]) * n; pt[1] += (a[1] - b[1]) * n; }
        for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
          const [px, py] = invert(pt, q.ox, q.oy, sx0 + x, sy0 + y), lx = Math.round(px) - bx, ly = Math.round(py) - by;
          if (lx < 0 || ly < 0 || lx >= BW || ly >= BW || lab[ly * BW + lx] !== q.l) continue;
          const [wx, wy] = apply(q.tr[WHOLE].p, q.ox, q.oy, px, py), r0 = invert(G[WHOLE].p, C0.x, C0.y, wx, wy);
          if (Math.hypot(r0[0] - C0.x, r0[1] - C0.y) <= RF + 4) roi[y * sw + x] = 1;
        }
      }
      roi = morph(roi, sw, sh, 6, false);
      /* from the frame the pieces are clear of each other, the whole neighbourhood of the seal is searched instead:
         the test below passes only matte wax (not the glossy rim, the cream paper, the petals or the flower's heart) */
      if (fi >= PIECES + 1) for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) if (Math.hypot(sx0 + x - cP[0], sy0 + y - cP[1]) < 205) roi[y * sw + x] = 1;
      for (let pass = 0; pass < 2; pass++) {                     // twice: the second pass takes what the first left of a broad stroke
      const SRC = pass ? Buffer.from(O) : F;
      const Lf = new Float32Array(sw * sh); for (let k = 0; k < sw * sh; k++) Lf[k] = lum(SRC, ((sy0 + ((k / sw) | 0)) * W + sx0 + (k % sw)) * 3);
      const Lb4 = await blur1(Lf, sw, sh, 4);
      const sm = new Float32Array(sw * sh);
      for (let k = 0; k < sw * sh; k++) { if (!roi[k]) continue; const i = ((sy0 + ((k / sw) | 0)) * W + sx0 + (k % sw)) * 3, d = SRC[i] - SRC[i + 2]; sm[k] = (Lf[k] > 100 && Lf[k] < 192 && d > 58 && d < 122 && Math.abs(Lf[k] - Lb4[k]) < 6) ? 1 : 0; }
      const wB = await blur1(sm.map((v) => v * 255), sw, sh, 4.5), fill = [];
      for (let c = 0; c < 3; c++) { const src = new Float32Array(sw * sh); for (let k = 0; k < sw * sh; k++) if (sm[k]) src[k] = SRC[((sy0 + ((k / sw) | 0)) * W + sx0 + (k % sw)) * 3 + c]; fill.push(await blur1(src, sw, sh, 4.5)); }
      const er2 = new Float32Array(sw * sh);
      for (let k = 0; k < sw * sh; k++) {
        if (!roi[k] || wB[k] < 70) continue;
        const wgt = wB[k] / 255, fl = .3 * fill[0][k] / wgt + .59 * fill[1][k] / wgt + .11 * fill[2][k] / wgt;
        if (Lf[k] > fl + 52 || Lf[k] < fl - 96 || Lf[k] < 60) continue;                 // a glint, the flower's heart, a gap
        er2[k] = smooth(70, 120, wB[k]);
      }
      const er2b = await blur1(er2.map((v) => v * 255), sw, sh, .8);
      for (let k = 0; k < sw * sh; k++) { const a = Math.min(er2[k], er2b[k] / 255); if (a <= 0) continue; const i = ((sy0 + ((k / sw) | 0)) * W + sx0 + (k % sw)) * 3, wgt = wB[k] / 255; for (let c = 0; c < 3; c++) O[i + c] = Math.round(O[i + c] * (1 - a) + Math.min(255, fill[c][k] / wgt) * a); }
      }
    }
    /* as the pieces scatter the monogram's relief fades from them (they are tumbling by then) */
    const fade = 1 - smooth(63, 69, fi);
    /* how each piece is lit against frame 0 */
    const ratios = {}; for (const m of maps) ratios[m.id] = [[], [], []];
    for (let k = 0; k < sw * sh; k += 3) { if (U[k] < 0) continue; const ux = Math.round(U[k]) - PX, vy = Math.round(V[k]) - PY; if (ux < 0 || vy < 0 || ux >= PW || vy >= PW || !er[vy * PW + ux]) continue; const i = ((sy0 + ((k / sw) | 0)) * W + sx0 + (k % sw)) * 3; for (let c = 0; c < 3; c++) ratios[PI[k]][c].push(F[i + c] / Math.max(8, f0[((PY + vy) * W + PX + ux) * 3 + c])); }
    const gain = {}; for (const m of maps) gain[m.id] = ratios[m.id].map((a) => { if (a.length < 12) return 1; a.sort((x, y) => x - y); return a[a.length >> 1]; });
    /* expected (the film's own old face, as it should look here) against what is filmed: low-pass difference marks
       what stands in front; a dark hairline the old face does not explain is a crack */
    const LF = new Float32Array(sw * sh), LE = new Float32Array(sw * sh);
    for (let k = 0; k < sw * sh; k++) { const i = ((sy0 + ((k / sw) | 0)) * W + sx0 + (k % sw)) * 3; LF[k] = lum(F, i); if (U[k] < 0) { LE[k] = LF[k]; continue; } const g = gain[PI[k]]; LE[k] = .3 * samp3(f0, U[k], V[k], 0) * g[0] + .59 * samp3(f0, U[k], V[k], 1) * g[1] + .11 * samp3(f0, U[k], V[k], 2) * g[2]; }
    const bF3 = await blur1(LF, sw, sh, 3), bE3 = await blur1(LE, sw, sh, 3), bF5 = await blur1(LF, sw, sh, 4.5), bE5 = await blur1(LE, sw, sh, 4.5);
    const keep = new Float32Array(sw * sh);
    for (let y = 1; y < sh - 1; y++) for (let x = 1; x < sw - 1; x++) {
      const k = y * sw + x; if (U[k] < 0) continue;
      const occ = fi <= WHOLE ? smooth(13, 26, Math.abs(bF3[k] - bE3[k])) : smooth(OCC0, OCC0 + 22, Math.abs(bF3[k] - bE3[k]));   // flying pieces tilt and catch the light: more is forgiven
      const hpF = LF[k] - bF5[k]; let hpE = 1e9; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) hpE = Math.min(hpE, LE[k + j * sw + i] - bE5[k + j * sw + i]);
      const crack = smooth(10, 22, -hpF) * smooth(6, 16, hpE - hpF);
      keep[k] = Math.max(occ, crack);
    }
    const keepB = await blur1(keep.map((v) => v * 255), sw, sh, .7);
    /* the edge of the painted area: soft at the face's rim and at each piece's border */
    const A = new Float32Array(sw * sh); for (let k = 0; k < sw * sh; k++) A[k] = U[k] < 0 ? 0 : 255 * (1 - smooth(RF - 4, RF, Math.hypot(U[k] - C0.x, V[k] - C0.y)));
    const Ab = fi <= WHOLE ? A : await blur1(A, sw, sh, .8);
    for (let k = 0; k < sw * sh; k++) {
      if (U[k] < 0) continue;
      const a = Math.min(A[k], Ab[k]) / 255 * (1 - Math.min(1, keepB[k] / 255 * 1.15)); if (a <= .003) continue;
      const i = ((sy0 + ((k / sw) | 0)) * W + sx0 + (k % sw)) * 3, g = gain[PI[k]];
      for (let c = 0; c < 3; c++) { const pl = sampP(plainFace, U[k], V[k], c); O[i + c] = Math.max(0, Math.min(255, Math.round(O[i + c] * (1 - a) + (pl + (sampP(face, U[k], V[k], c) - pl) * fade) * g[c] * a))); }
    }
    await sharp(O, { raw: { width: W, height: H, channels: 3 } }).png({ compressionLevel: 3 }).toFile(file(fi, 'o'));
    if (process.env.DEBUG && fi > WHOLE) { const u = Buffer.alloc(sw * sh * 3); for (let k = 0; k < sw * sh; k++) { u[k * 3] = U[k] < 0 ? 0 : 60 + (PI[k] * 53) % 190; u[k * 3 + 1] = U[k] < 0 ? 0 : Math.round(keepB[k]); u[k * 3 + 2] = Math.round(LF[k]); } fs.mkdirSync(path.join(Wd, 'd'), { recursive: true }); await sharp(u, { raw: { width: sw, height: sh, channels: 3 } }).png().toFile(file(fi, 'd')); }
  }
  console.log('painted 0 …', LAST);
})();
