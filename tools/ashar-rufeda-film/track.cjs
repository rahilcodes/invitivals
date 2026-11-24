/* tracks the seal's face in every frame against frame 0: p_t = M (p0 - C0) + T, six numbers per frame → track.json */
const sharp = require('sharp');
const fs = require('fs');
const S = __dirname, W = 720, H = 1280, N = Number(process.argv[2] || 84);
const C0 = { x: 366, y: 596 }, RX = 72, RY = 64, ROT = -8 * Math.PI / 180;
const gray = async (i) => { const { data } = await sharp(`${S}/f/${String(i + 1).padStart(3, '0')}.png`).greyscale().blur(1.4).raw().toBuffer({ resolveWithObject: true }); return data; };
const samp = (g, x, y) => { if (x < 0 || y < 0 || x > W - 2 || y > H - 2) return -1; const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, i = y0 * W + x0; return (g[i] * (1 - fx) + g[i + 1] * fx) * (1 - fy) + (g[i + W] * (1 - fx) + g[i + W + 1] * fx) * fy; };
(async () => {
  const g0 = await gray(0);
  /* template points: the ring and everything in it, but only the part that never breaks away (left and top) */
  const pts = [];
  const c = Math.cos(ROT), s = Math.sin(ROT);
  for (let dy = -90; dy <= 90; dy++) for (let dx = -95; dx <= 95; dx++) {
    const u = (dx * c + dy * s) / RX, v = (-dx * s + dy * c) / RY, r = Math.hypot(u, v);
    if (r > 1.16) continue;
    if (dx > 22 && dy > -10) continue;            // the lower right breaks off
    if (dx > 40) continue;                        // the butterfly's corner
    pts.push([dx, dy, samp(g0, C0.x + dx, C0.y + dy)]);
  }
  console.log('template points', pts.length);
  const score = (g, p) => {
    let n = 0, sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
    for (let k = 0; k < pts.length; k += 2) {
      const [dx, dy, a] = pts[k];
      const b = samp(g, p[0] + p[2] * dx + p[3] * dy, p[1] + p[4] * dx + p[5] * dy);
      if (b < 0) continue;
      n++; sa += a; sb += b; saa += a * a; sbb += b * b; sab += a * b;
    }
    if (n < pts.length / 8) return -2;
    const va = saa - sa * sa / n, vb = sbb - sb * sb / n;
    return (sab - sa * sb / n) / Math.sqrt(va * vb + 1e-6);
  };
  let p = [C0.x, C0.y, 1, 0, 0, 1], prev = null;
  const out = [];
  for (let i = 0; i < N; i++) {
    const g = await gray(i);
    /* start from the last frame's answer, moved on by the last step (constant-velocity guess) */
    let q = p.slice(); if (prev) { const q2 = p.map((v, k) => v + (v - prev[k])); if (score(g, q2) > score(g, q)) q = q2; }
    let best = score(g, q);
    let st = [3, 3, .03, .03, .03, .03];
    for (let lvl = 0; lvl < 9; lvl++) {
      for (let pass = 0; pass < 4; pass++) {
        let moved = false;
        for (let k = 0; k < 6; k++) for (const d of [-1, 1]) {
          const t = q.slice(); t[k] += d * st[k]; const sc = score(g, t);
          if (sc > best) { best = sc; q = t; moved = true; }
        }
        if (!moved) break;
      }
      st = st.map((v) => v / 2);
    }
    prev = p; p = q; out.push({ f: i, p: q.map((v) => +v.toFixed(4)), ncc: +best.toFixed(3) });
    if (i % 6 === 0 || best < .6) console.log(i, q.map((v) => v.toFixed(2)).join(' '), best.toFixed(3));
  }
  fs.writeFileSync(`${S}/track.json`, JSON.stringify(out));
})();
