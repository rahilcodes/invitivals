/* The bride-side colour rule for the Manbir & Arshleen wedding (public/arshleen-manbir-wedding).
   The groom page is "Royal Ivory & Sapphire": ivory paper, champagne gold, and sapphire/navy for velvet, flowers,
   clothes, ink and buttons. The bride page keeps every picture and every composition and turns ONLY the sapphire
   family into a deep plum with a soft rose cast; gold, ivory, skin, greens, the sunset and the reds are untouched.

   Works in HSL. A pixel whose hue lies in the blue band (about 165°–285°) is rotated towards plum; the rotation
   fades out smoothly at the band's edges, so there are no seams. Rotated hues land at 300°–330°, outside the band,
   so the rule never compounds even if run twice. Saturation is eased a little (plum reads richer than sapphire at
   the same saturation), lightness is kept: the shading of every fold and petal is the original's. */

const BAND0 = 165, CORE0 = 195, CORE1 = 255, BAND1 = 285;   // degrees
const SHIFT = 95;                                             // 225° (navy) → 320° (plum)
const SAT = 0.86;

const smooth = (t) => t * t * (3 - 2 * t);
const weight = (h) => {
  if (h <= BAND0 || h >= BAND1) return 0;
  if (h < CORE0) return smooth((h - BAND0) / (CORE0 - BAND0));
  if (h > CORE1) return smooth((BAND1 - h) / (BAND1 - CORE1));
  return 1;
};

/* r, g, b in 0..255 → [r, g, b] */
export function plum(r, g, b) {
  const R = r / 255, G = g / 255, B = b / 255;
  const mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn;
  if (d < 1e-6) return [r, g, b];                             // greys and whites: untouched
  const l = (mx + mn) / 2, s = d / (1 - Math.abs(2 * l - 1));
  let h = mx === R ? ((G - B) / d) % 6 : mx === G ? (B - R) / d + 2 : (R - G) / d + 4;
  h *= 60; if (h < 0) h += 360;
  const w = weight(h);
  if (!w) return [r, g, b];
  const h2 = (h + SHIFT * w) % 360, s2 = s * (1 - (1 - SAT) * w);
  const c = (1 - Math.abs(2 * l - 1)) * s2, x = c * (1 - Math.abs(((h2 / 60) % 2) - 1)), m = l - c / 2;
  const [a, bb, cc] = h2 < 60 ? [c, x, 0] : h2 < 120 ? [x, c, 0] : h2 < 180 ? [0, c, x] : h2 < 240 ? [0, x, c] : h2 < 300 ? [x, 0, c] : [c, 0, x];
  return [Math.round((a + m) * 255), Math.round((bb + m) * 255), Math.round((cc + m) * 255)];
}

/* a raw pixel buffer (channels 3 or 4) in place, through a 32-level-per-channel lookup cube with trilinear blending
   (fast enough for video frames, and smooth) */
let LUT = null; const N = 33;
function lut() {
  if (LUT) return LUT;
  LUT = new Float32Array(N * N * N * 3);
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) {
    const o = ((i * N + j) * N + k) * 3, p = plum(i * 255 / (N - 1), j * 255 / (N - 1), k * 255 / (N - 1));
    LUT[o] = p[0]; LUT[o + 1] = p[1]; LUT[o + 2] = p[2];
  }
  return LUT;
}
export function plumBuffer(buf, channels) {
  const L = lut(), S = (N - 1) / 255;
  for (let p = 0; p < buf.length; p += channels) {
    const fr = buf[p] * S, fg = buf[p + 1] * S, fb = buf[p + 2] * S;
    const r0 = Math.min(N - 2, fr | 0), g0 = Math.min(N - 2, fg | 0), b0 = Math.min(N - 2, fb | 0);
    const dr = fr - r0, dg = fg - g0, db = fb - b0;
    for (let c = 0; c < 3; c++) {
      const at = (i, j, k) => L[(((r0 + i) * N + (g0 + j)) * N + (b0 + k)) * 3 + c];
      const v = ((at(0, 0, 0) * (1 - db) + at(0, 0, 1) * db) * (1 - dg) + (at(0, 1, 0) * (1 - db) + at(0, 1, 1) * db) * dg) * (1 - dr)
              + ((at(1, 0, 0) * (1 - db) + at(1, 0, 1) * db) * (1 - dg) + (at(1, 1, 0) * (1 - db) + at(1, 1, 1) * db) * dg) * dr;
      buf[p + c] = v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
    }
  }
  return buf;
}

/* every colour literal in a stylesheet or script: #rgb, #rrggbb, #rrggbbaa, rgb()/rgba() */
export function plumText(text) {
  const hex2 = (n) => n.toString(16).padStart(2, '0');
  return text
    .replace(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, (m, h) => {
      const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
      const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
      const out = plum(r, g, b);
      return '#' + out.map(hex2).join('') + (full.length === 8 ? full.slice(6) : '');
    })
    .replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[\d.]+\s*)?\)/g, (m, r, g, b, a) => {
      const out = plum(+r, +g, +b);
      return (a ? 'rgba(' : 'rgb(') + out.join(',') + (a || '') + ')';
    });
}
