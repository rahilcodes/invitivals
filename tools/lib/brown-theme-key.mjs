/* Some "transparent" PNGs in the brown-theme pack carry a painted grey checkerboard instead of alpha.
 * keyOut removes it: neutral pixels connected to the border, or large two-toned enclosed patches. */
import sharp from 'sharp';

/* page/name of every element with no real alpha channel */
export const OPAQUE = new Set([
  '1/Golden Botanical Branch Embellishment', '1/Ornate Golden Ganesha Emblem',
  '2/Glittering Monarch Butterfly Cutout', '2/Ornate Golden Baroque UI Slot', '2/Ornate Golden Floral Parchment Scroll',
  '2/Ornate Golden Parchment Scroll', '2/Ornate Golden Vintage Scroll Banner',
  '3/Golden Botanical Branch Embellishment', '3/Luxurious Bronze and Gold Floral Cascade', '3/Ornate Golden Filigree Location Pin',
  '4/Luxurious Save the Date Plaque',
  '5/Ornate Golden Arabesque Hanging Lantern', '5/Ornate Golden Crystal Lantern Pendant',
]);

export async function keyOut(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const val = (i) => data[i * 3];
  const neutral = (i) => { const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2]; return Math.max(r, g, b) - Math.min(r, g, b) < 18 && r > 105; };
  // label connected components of neutral pixels; a component is background when it touches the
  // border, or when it is a sizeable two-tone (checkerboard) patch rather than a smooth pearl/highlight
  const label = new Int32Array(w * h); let n = 0; const comps = [];
  for (let s0 = 0; s0 < w * h; s0++) {
    if (label[s0] || !neutral(s0)) continue;
    n++; const stack = [s0]; label[s0] = n; const hist = new Uint32Array(256); let size = 0, border = false;
    while (stack.length) {
      const i = stack.pop(); size++; hist[val(i)]++;
      const x = i % w, y = (i - x) / w;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) border = true;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) if (j >= 0 && !label[j] && neutral(j)) { label[j] = n; stack.push(j); }
    }
    // checkerboard patches are large and two-toned (grey + white); pearls and highlights are small, flat and bright
    let lo = 255, hi = 0; for (let v = 0; v < 256; v++) if (hist[v]) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
    const bg = border || (size > 3000 && hi - lo > 50);
    comps[n] = bg;
  }
  const isBg = (i) => label[i] && comps[label[i]];
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    out[i * 4] = data[i * 3]; out[i * 4 + 1] = data[i * 3 + 1]; out[i * 4 + 2] = data[i * 3 + 2];
    if (isBg(i)) { out[i * 4 + 3] = 0; continue; }
    const x = i % w, y = (i - x) / w;
    const edge = (x > 0 && isBg(i - 1)) || (x < w - 1 && isBg(i + 1)) || (y > 0 && isBg(i - w)) || (y < h - 1 && isBg(i + w));
    out[i * 4 + 3] = edge ? 120 : 255;
  }
  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}
