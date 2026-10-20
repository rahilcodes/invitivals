/* Lifts painted lettering (or small painted shapes) off an artwork while keeping the
   paper or velvet around it: inside each box, a max filter (dark ink on light paper)
   or min filter (light ink on dark velvet) spreads the surrounding ground over the
   strokes, a soft blur hides the seams, a little grain returns, and the result is
   feathered back into the picture.

     const buf = await erase(src, [{ x, y, w, h, r: 14, mode: 'max', f: 12 }, …])
   returns a PNG buffer the same size as src */
import sharp from 'sharp';

function spread(px, W, H, x0, y0, w, h, r, pick) {
  const tmp = new Float32Array(w * h * 3), res = new Float32Array(w * h * 3);
  const at = (x, y, c) => px[((y0 + y) * W + (x0 + x)) * 3 + c];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < 3; c++) {
    let v = at(x, y, c);
    for (let k = Math.max(0, x - r); k <= Math.min(w - 1, x + r); k++) v = pick(v, at(k, y, c));
    tmp[(y * w + x) * 3 + c] = v;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < 3; c++) {
    let v = tmp[(y * w + x) * 3 + c];
    for (let k = Math.max(0, y - r); k <= Math.min(h - 1, y + r); k++) v = pick(v, tmp[(k * w + x) * 3 + c]);
    res[(y * w + x) * 3 + c] = v;
  }
  return res;
}

/* the ground's own tone: for each pixel, the colour sitting at luminance-percentile p of its
   neighbourhood (worked on a 4× smaller copy, then smoothly enlarged) — big shapes vanish
   without the region turning lighter or darker than the cloth around it */
function percentile(px, W, x0, y0, w, h, r, p) {
  const s = 4, sw = Math.ceil(w / s), sh = Math.ceil(h / s), sr = Math.max(1, Math.round(r / s));
  const small = new Float32Array(sw * sh * 3);
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
    let n = 0; const acc = [0, 0, 0];
    for (let dy = 0; dy < s; dy++) for (let dx = 0; dx < s; dx++) {
      const X = Math.min(w - 1, x * s + dx), Y = Math.min(h - 1, y * s + dy), i = ((y0 + Y) * W + x0 + X) * 3;
      acc[0] += px[i]; acc[1] += px[i + 1]; acc[2] += px[i + 2]; n++;
    }
    for (let c = 0; c < 3; c++) small[(y * sw + x) * 3 + c] = acc[c] / n;
  }
  const res = new Float32Array(sw * sh * 3), lum = (i) => small[i] * .3 + small[i + 1] * .59 + small[i + 2] * .11;
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
    const list = [];
    for (let yy = Math.max(0, y - sr); yy <= Math.min(sh - 1, y + sr); yy++)
      for (let xx = Math.max(0, x - sr); xx <= Math.min(sw - 1, x + sr); xx++) { const i = (yy * sw + xx) * 3; list.push([lum(i), i]); }
    list.sort((a, b) => a[0] - b[0]);
    const k = list[Math.min(list.length - 1, Math.floor(p * list.length))][1];
    for (let c = 0; c < 3; c++) res[(y * sw + x) * 3 + c] = small[k + c];
  }
  const out = new Float32Array(w * h * 3);                // bilinear back to full size
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const fx = Math.min(sw - 1, Math.max(0, (x + .5) / s - .5)), fy = Math.min(sh - 1, Math.max(0, (y + .5) / s - .5));
    const xa = Math.floor(fx), ya = Math.floor(fy), xb = Math.min(sw - 1, xa + 1), yb = Math.min(sh - 1, ya + 1), tx = fx - xa, ty = fy - ya;
    for (let c = 0; c < 3; c++) {
      const v = (res[(ya * sw + xa) * 3 + c] * (1 - tx) + res[(ya * sw + xb) * 3 + c] * tx) * (1 - ty) +
                (res[(yb * sw + xa) * 3 + c] * (1 - tx) + res[(yb * sw + xb) * 3 + c] * tx) * ty;
      out[(y * w + x) * 3 + c] = v;
    }
  }
  return out;
}

function boxBlur(a, w, h, r) {
  const t = new Float32Array(a.length), o = new Float32Array(a.length);
  for (let y = 0; y < h; y++) for (let c = 0; c < 3; c++) {
    let s = 0, n = 0;
    for (let x = -r; x < w + r; x++) {
      const add = x + r, sub = x - r - 1;
      if (add >= 0 && add < w) { s += a[(y * w + add) * 3 + c]; n++; }
      if (sub >= 0 && sub < w) { s -= a[(y * w + sub) * 3 + c]; n--; }
      if (x >= 0 && x < w) t[(y * w + x) * 3 + c] = s / n;
    }
  }
  for (let x = 0; x < w; x++) for (let c = 0; c < 3; c++) {
    let s = 0, n = 0;
    for (let y = -r; y < h + r; y++) {
      const add = y + r, sub = y - r - 1;
      if (add >= 0 && add < h) { s += t[(add * w + x) * 3 + c]; n++; }
      if (sub >= 0 && sub < h) { s -= t[(sub * w + x) * 3 + c]; n--; }
      if (y >= 0 && y < h) o[(y * w + x) * 3 + c] = s / n;
    }
  }
  return o;
}

export async function erase(src, boxes) {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, px = new Float32Array(data);
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - .5;
  for (const b of boxes) {
    const x0 = Math.max(0, b.x), y0 = Math.max(0, b.y);
    const w = Math.min(W - x0, b.w), h = Math.min(H - y0, b.h);
    const r = b.r ?? 12, f = b.f ?? 12, grain = b.grain ?? 5;
    // dark ink on light ground: a morphological closing (max then min) removes strokes narrower than 2r
    // without lifting the ground's own tone; light ink on dark ground: the opening (min then max)
    const light = (b.mode || 'max') === 'max';
    const first = light ? Math.max : Math.min, second = light ? Math.min : Math.max;
    let fill;
    if (b.p !== undefined) fill = percentile(px, W, x0, y0, w, h, r, b.p);
    else fill = spread(px, W, H, x0, y0, w, h, r, first);
    if (b.p === undefined && b.close !== false) {
      const sub = new Float32Array(W * H * 3);              // re-run the second pass on the spread result
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < 3; c++) sub[((y0 + y) * W + (x0 + x)) * 3 + c] = fill[(y * w + x) * 3 + c];
      fill = spread(sub, W, H, x0, y0, w, h, Math.round(r * (b.k ?? .8)), second);
    }
    fill = boxBlur(boxBlur(fill, w, h, b.blur ?? 6), w, h, b.blur ?? 6);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const e = Math.min(x, y, w - 1 - x, h - 1 - y);
      const a = f ? Math.min(1, e / f) : 1, k = a * a * (3 - 2 * a);
      const g = rnd() * grain;
      for (let c = 0; c < 3; c++) {
        const i = ((y0 + y) * W + (x0 + x)) * 3 + c;
        px[i] = px[i] * (1 - k) + (fill[(y * w + x) * 3 + c] + g) * k;
      }
    }
  }
  const outBuf = Buffer.alloc(px.length);
  for (let i = 0; i < px.length; i++) outBuf[i] = Math.max(0, Math.min(255, Math.round(px[i])));
  return sharp(outBuf, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
}
