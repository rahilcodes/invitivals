/* Shared by the artwork builders: clears wording out of a painted plate so it can be set again as live text. */

/* colour tests for what gets painted out */
export const burgundy = (r, g, b) => r > 85 && g < 150 && r - g > 45 && r - b > 25;
export const navy = (r, g, b) => r < 120 && g < 120 && b < 140 && b >= r - 6;
export const gold = (r, g, b) => r - b > 55 && g > 95 && g - b > 25;

/* ---- paint-out: mask the wording by colour, then fill the mask by diffusion from the surrounding plate ---- */
export function paintOut(px, W, H, C, { test, rects, grow = 3, omega = 1.85, passes = 900 }) {
  for (const [rx0, ry0, rx1, ry1] of rects) {
    const x0 = Math.max(1, rx0), y0 = Math.max(1, ry0), x1 = Math.min(W - 1, rx1), y1 = Math.min(H - 1, ry1);
    const w = x1 - x0, h = y1 - y0;
    let mask = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = ((y + y0) * W + x + x0) * C;
      if (test(px[i], px[i + 1], px[i + 2], x + x0, y + y0)) mask[y * w + x] = 1;
    }
    for (let k = 0; k < grow; k++) {                       // grow over the anti-aliased edge of every stroke
      const m = new Uint8Array(mask);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (mask[y * w + x]) continue;
        if ((x > 0 && mask[y * w + x - 1]) || (x < w - 1 && mask[y * w + x + 1]) || (y > 0 && mask[(y - 1) * w + x]) || (y < h - 1 && mask[(y + 1) * w + x])) m[y * w + x] = 1;
      }
      mask = m;
    }
    // the outer ring of the rect is always kept: it is what the fill grows in from
    for (let x = 0; x < w; x++) mask[x] = mask[(h - 1) * w + x] = 0;
    for (let y = 0; y < h; y++) mask[y * w] = mask[y * w + w - 1] = 0;
    const idx = []; for (let i = 0; i < mask.length; i++) if (mask[i]) idx.push(i);
    if (!idx.length) continue;
    // grain of the untouched plate inside the rect, to give the fill the same texture
    let n = 0, s2 = 0;
    for (let y = 1; y < h - 1; y += 2) for (let x = 1; x < w - 1; x += 2) {
      if (mask[y * w + x] || mask[y * w + x - 1] || mask[y * w + x + 1] || mask[(y - 1) * w + x] || mask[(y + 1) * w + x]) continue;
      const i = ((y + y0) * W + x + x0) * C;
      const d = px[i + 1] - (px[i + 1 - C] + px[i + 1 + C] + px[i + 1 - W * C] + px[i + 1 + W * C]) / 4; s2 += d * d; n++;
    }
    const grain = Math.min(2.5, n ? Math.sqrt(s2 / n) * 0.8 : 1);
    for (let c = 0; c < 3; c++) {
      const v = new Float32Array(w * h); let sum = 0, cnt = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const t = px[((y + y0) * W + x + x0) * C + c]; v[y * w + x] = t; if (!mask[y * w + x]) { sum += t; cnt++; } }
      const mean = cnt ? sum / cnt : 240; for (const i of idx) v[i] = mean;
      const at = (x, y, self) => (x < 0 || y < 0 || x >= w || y >= h) ? self : v[y * w + x];   // the rect edge is never masked in practice
      for (let it = 0; it < passes; it++) for (const i of idx) {
        const x = i % w, y = (i / w) | 0, cur = v[i];
        v[i] = cur + omega * ((at(x - 1, y, cur) + at(x + 1, y, cur) + at(x, y - 1, cur) + at(x, y + 1, cur)) / 4 - cur);
      }
      for (const i of idx) {
        const g = (Math.random() + Math.random() + Math.random() - 1.5) * 2 * grain;
        px[((((i / w) | 0) + y0) * W + (i % w) + x0) * C + c] = Math.max(0, Math.min(255, Math.round(v[i] + g)));
      }
    }
  }
}
