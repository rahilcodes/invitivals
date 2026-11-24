/* paints the SS face over the seal's lettered face in every frame, using track.json → o/NNN.png, face0.png (copied from tools/mohammed-navas-dharshinisha-film) */
const sharp = require('sharp');
const fs = require('fs');
const S = __dirname, W = 720, H = 1280;
const A = process.env.ASSETS || require('path').resolve(__dirname, '../../public/sai-sushmitha-sai-santosh-engagement/assets');
const C0 = { x: 366, y: 596 }, RX = 72, RY = 64, ROT = -8 * Math.PI / 180;
const PW = 200, PH = 190, PX = C0.x - PW / 2, PY = C0.y - PH / 2;         // the face patch, in frame 0
const LAST = Number(process.argv[2] || 83);
const cR = Math.cos(ROT), sR = Math.sin(ROT);
const rad = (dx, dy) => Math.hypot((dx * cR + dy * sR) / RX, (-dx * sR + dy * cR) / RY);
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const rgb = async (i) => (await sharp(`${S}/f/${String(i + 1).padStart(3, '0')}.png`).removeAlpha().raw().toBuffer());

/* the track, repaired: frames the butterfly spoils are bridged between good neighbours; the last frames, where the
   seal is nearly edge-on, carry the trend on */
function track() {
  const t = JSON.parse(fs.readFileSync(`${S}/track.json`)).map((o) => ({ ...o }));
  const good = (o) => (o.f < 37) || (o.f >= 37 && o.f < 56 && o.ncc > .8) || (o.f >= 56 && o.f <= 79);
  const g = t.filter(good);
  for (const o of t) if (!good(o) && o.f < 80) {
    const a = [...g].reverse().find((k) => k.f < o.f), b = g.find((k) => k.f > o.f), w = (o.f - a.f) / (b.f - a.f);
    o.p = a.p.map((v, k) => v + (b.p[k] - v) * w); o.fixed = true;
  }
  for (const o of t) if (o.f >= 80) { const a = t[78].p, b = t[79].p; o.p = b.map((v, k) => v + (v - a[k]) * (o.f - 79)); o.p[5] = Math.max(.04, o.p[5]); o.fixed = true; }
  return t;
}

(async () => {
  const f0 = await rgb(0);
  /* ── the new face, in frame 0's own pixels: the lettered face emptied (filled from the plain wax around the
        letters), the couple's ND monogram pressed in ── */
  const face = new Float32Array(PW * PH * 3), wt = new Float32Array(PW * PH);
  for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) {
    const i = ((PY + y) * W + PX + x) * 3, r = f0[i], g = f0[i + 1], b = f0[i + 2], l = .3 * r + .59 * g + .11 * b;
    const inside = rad(PX + x - C0.x, PY + y - C0.y) < .93;
    const plain = inside && l > 82 && l < 132 && r - g > 22;           // the wax of the face, not letters, leaves or their shadows
    wt[y * PW + x] = plain ? 1 : 0;
  }
  /* shrink the plain mask a little so letter edges do not bleed into the fill */
  const er = new Float32Array(PW * PH);
  for (let y = 2; y < PH - 2; y++) for (let x = 2; x < PW - 2; x++) { let m = 1; for (let j = -2; j <= 2 && m; j++) for (let k = -2; k <= 2; k++) if (!wt[(y + j) * PW + x + k]) { m = 0; break; } er[y * PW + x] = m; }
  const blurF = async (arr, ch, sigma) => { const u = Buffer.alloc(PW * PH); for (let k = 0; k < PW * PH; k++) u[k] = Math.max(0, Math.min(255, Math.round(arr[k * ch]))); return (await sharp(u, { raw: { width: PW, height: PH, channels: 1 } }).blur(sigma).toColourspace('b-w').raw().toBuffer()); };
  const mB = await blurF(er.map((v) => v * 255), 1, 9);
  const mB2 = await blurF(er.map((v) => v * 255), 1, 26);
  const mean = [0, 0, 0]; { let n = 0; for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (er[y * PW + x]) { n++; for (let c = 0; c < 3; c++) mean[c] += f0[((PY + y) * W + PX + x) * 3 + c]; } for (let c = 0; c < 3; c++) mean[c] /= n; console.log('mean wax', mean.map(Math.round).join(',')); }
  for (let c = 0; c < 3; c++) {
    const src = new Float32Array(PW * PH); for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) src[y * PW + x] = er[y * PW + x] * f0[((PY + y) * W + PX + x) * 3 + c];
    const b1 = await blurF(src, 1, 9), b2 = await blurF(src, 1, 26);
    for (let k = 0; k < PW * PH; k++) {
      const n1 = mB[k] / 255, n2 = mB2[k] / 255;
      const v2 = n2 > .2 ? b2[k] / n2 : mean[c], v2b = mean[c] + (v2 - mean[c]) * smooth(.2, .45, n2), v1 = n1 > .3 ? b1[k] / n1 : v2b, w = smooth(.3, .6, n1);
      face[k * 3 + c] = v2b + (v1 - v2b) * w;
    }
  }
  /* a trace of grain so the face is wax, not plastic */
  for (let k = 0; k < PW * PH; k++) { const n = Math.sin((k % PW) * 12.9898 + ((k / PW) | 0) * 78.233) * 43758.5453; const g = (n - Math.floor(n) - .5) * 5; for (let c = 0; c < 3; c++) face[k * 3 + c] += g; }
  const plainFace = Float32Array.from(face);
  /* the monogram: the couple's gold SS crest, with a soft pressed shadow under it */
  const MH = 112, mono = await sharp(`${A}/ss-gold.webp`).resize({ height: MH }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const mw = mono.info.width, mx = Math.round(PW / 2 - mw / 2), my = Math.round(PH / 2 - MH / 2);
  const sh = await sharp(mono.data, { raw: { width: mw, height: MH, channels: 4 } }).extractChannel(3).blur(1.3).toColourspace('b-w').raw().toBuffer();
  for (let y = 0; y < MH; y++) for (let x = 0; x < mw; x++) {
    const k = (my + y) * PW + mx + x; if (k < 0 || k >= PW * PH) continue;
    const sy = y - 1, sx = x - 1, s = (sy >= 0 && sx >= 0 ? sh[sy * mw + sx] : 0) / 255 * .5;
    const a = mono.data[(y * mw + x) * 4 + 3] / 255;
    for (let c = 0; c < 3; c++) { let v = face[k * 3 + c] * (1 - s * .55); v = v * (1 - a) + (mono.data[(y * mw + x) * 4 + c] * .93 + 8) * a; face[k * 3 + c] = v; }
  }
  { const u = Buffer.alloc(PW * PH * 3); for (let k = 0; k < u.length; k++) u[k] = Math.max(0, Math.min(255, Math.round(face[k]))); await sharp(u, { raw: { width: PW, height: PH, channels: 3 } }).png().toFile(`${S}/face0.png`); }
  const sampP = (arr, x, y, c) => { x = Math.max(0, Math.min(PW - 1.001, x)); y = Math.max(0, Math.min(PH - 1.001, y)); const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, i = (y0 * PW + x0) * 3 + c; return (arr[i] * (1 - fx) + arr[i + 3] * fx) * (1 - fy) + (arr[i + PW * 3] * (1 - fx) + arr[i + PW * 3 + 3] * fx) * fy; };

  const T = track();
  fs.mkdirSync(`${S}/o`, { recursive: true });
  for (let fi = 0; fi <= LAST; fi++) {
    const F = await rgb(fi), p = T[fi].p, det = p[2] * p[5] - p[3] * p[4];
    const inv = [p[5] / det, -p[3] / det, -p[4] / det, p[2] / det];
    /* bounding box of the face in this frame */
    let x0 = W, x1 = 0, y0 = H, y1 = 0;
    for (let a = 0; a < 360; a += 6) { const dx = Math.cos(a * Math.PI / 180) * 86, dy = Math.sin(a * Math.PI / 180) * 80; const X = p[0] + p[2] * dx + p[3] * dy, Y = p[1] + p[4] * dx + p[5] * dy; x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y); }
    x0 = Math.max(0, Math.floor(x0) - 2); y0 = Math.max(0, Math.floor(y0) - 2); x1 = Math.min(W - 1, Math.ceil(x1) + 2); y1 = Math.min(H - 1, Math.ceil(y1) + 2);
    const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
    if (bw < 3 || bh < 3) { fs.copyFileSync(`${S}/f/${String(fi + 1).padStart(3, '0')}.png`, `${S}/o/${String(fi + 1).padStart(3, '0')}.png`); continue; }
    const R = new Float32Array(bw * bh), U = new Float32Array(bw * bh), V = new Float32Array(bw * bh);
    /* how this frame's wax is lit against frame 0: the median of frame / (frame 0 warped) over the plain wax */
    const ratios = [[], [], []];
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      const dx = x0 + x - p[0], dy = y0 + y - p[1], u = inv[0] * dx + inv[1] * dy, v = inv[2] * dx + inv[3] * dy, k = y * bw + x;
      R[k] = rad(u, v); U[k] = u + C0.x - PX; V[k] = v + C0.y - PY;
      if (R[k] < .9 && (x + y) % 2 === 0) {
        const ux = Math.round(U[k]), vy = Math.round(V[k]);
        if (ux >= 0 && vy >= 0 && ux < PW && vy < PH && er[vy * PW + ux]) for (let c = 0; c < 3; c++) ratios[c].push(F[((y0 + y) * W + x0 + x) * 3 + c] / Math.max(8, f0[((PY + vy) * W + PX + ux) * 3 + c]));
      }
    }
    const gain = ratios.map((a) => { if (a.length < 20) return 1; a.sort((m, n) => m - n); return a[a.length >> 1]; });
    /* what stands in front of the face or has broken out of it: pixels far paler and warmer than lit wax (the
       butterfly, the envelope in the gaps). Letter strokes are pale too, but thin: an opening removes them. */
    let K = new Uint8Array(bw * bh);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      const k = y * bw + x; if (R[k] > 1.08) continue;
      const i = ((y0 + y) * W + x0 + x) * 3, r = F[i], g = F[i + 1], b = F[i + 2];
      const er_ = sampP(plainFace, U[k], V[k], 0) * gain[0], eg = sampP(plainFace, U[k], V[k], 1) * gain[1], eb = sampP(plainFace, U[k], V[k], 2) * gain[2];
      const l = .3 * r + .59 * g + .11 * b, el = .3 * er_ + .59 * eg + .11 * eb;
      K[k] = (l > el * 1.2 + 10 && (g - b) - (eg - eb) > 3) ? 1 : 0;
    }
    const morph = (src, n, erode) => { const d = new Uint8Array(bw * bh); for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) { let m = erode ? 1 : 0; for (let j = -n; j <= n; j++) { const yy = y + j; if (yy < 0 || yy >= bh) { continue; } for (let k = -n; k <= n; k++) { if (j * j + k * k > n * n + 1) continue; const xx = x + k; if (xx < 0 || xx >= bw) continue; const v = src[yy * bw + xx]; if (erode && !v) { m = 0; j = n + 1; break; } if (!erode && v) { m = 1; j = n + 1; break; } } } d[y * bw + x] = m; } return d; };
    /* outside the face everything counts as "in front", so an occluder reaching in from the rim survives the opening */
    for (let k = 0; k < bw * bh; k++) if (R[k] > 1.08) K[k] = 1;
    const scale = Math.sqrt(Math.abs(det));
    const n = Math.max(3, Math.round(5 * Math.min(1.2, scale)));
    K = morph(morph(K, n, true), n + 1, false);
    const Kb = await sharp(Buffer.from(K.map((v) => v * 255)), { raw: { width: bw, height: bh, channels: 1 } }).blur(1.1).toColourspace('b-w').raw().toBuffer();
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      const k = y * bw + x; if (R[k] >= 1) continue;
      const a = (1 - smooth(.93, 1, R[k])) * (1 - Kb[k] / 255); if (a <= 0) continue;
      const i = ((y0 + y) * W + x0 + x) * 3;
      for (let c = 0; c < 3; c++) F[i + c] = Math.max(0, Math.min(255, Math.round(F[i + c] * (1 - a) + sampP(face, U[k], V[k], c) * gain[c] * a)));
    }
    await sharp(F, { raw: { width: W, height: H, channels: 3 } }).png({ compressionLevel: 3 }).toFile(`${S}/o/${String(fi + 1).padStart(3, '0')}.png`);
    if (fi % 12 === 0) console.log(fi, 'gain', gain.map((v) => v.toFixed(2)).join(' '), T[fi].fixed ? 'bridged' : '');
  }
})();
