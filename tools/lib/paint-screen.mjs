/* Paints a new version of a full-screen invitation artwork in headless Chrome:
   the original picture, soft patches that hide its old wording, then new
   lettering, photos and ornaments — all in the artwork's own pixel space.

     await paintScreen({ src, out, W, H, css, html })

   src  : original artwork (jpg/png), drawn at 0,0 W×H
   html : what to lay over it (absolutely positioned in source pixels)
   out  : .jpg written with sharp (quality 86) */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { erase } from './erase.mjs';

const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FONTS = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Great+Vibes&family=Tiro+Devanagari+Hindi&display=block';
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'paint-'));

export const url = (p) => pathToFileURL(path.resolve(p)).href;

/* soft-edged rectangle: f = feather in px on every side */
export const feather = (f) =>
  `-webkit-mask-image:linear-gradient(to right,transparent,#000 ${f}px,#000 calc(100% - ${f}px),transparent),linear-gradient(to bottom,transparent,#000 ${f}px,#000 calc(100% - ${f}px),transparent);` +
  `-webkit-mask-composite:source-in;mask-image:linear-gradient(to right,transparent,#000 ${f}px,#000 calc(100% - ${f}px),transparent),linear-gradient(to bottom,transparent,#000 ${f}px,#000 calc(100% - ${f}px),transparent);mask-composite:intersect;`;

/* a patch filled with `fill` (any CSS background), positioned in source pixels */
export const patch = (x, y, w, h, fill, f = 14, extra = '') =>
  `<div class="p" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${fill};${feather(f)}${extra}"></div>`;

/* a patch that repeats another part of the same picture (a clean area) over the old wording */
export const clone = (src, W, H, from, to, f = 14) => {
  const [sx, sy] = from, [x, y, w, h] = to;
  return `<div class="p" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:url('${url(src)}') ${-sx}px ${-sy}px / ${W}px ${H}px no-repeat;${feather(f)}"></div>`;
};

/* centred text block; style = CSS for font/colour */
export const text = (x, y, w, h, html, style) =>
  `<div class="t" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${style}">${html}</div>`;

/* photos are blended in before the lettering: each { file, x, y, w, h, mask } where mask is an
   SVG (w×h, white = photo shows) — rendered by sharp, used as the photo's alpha */
async function prepareBase(src, W, H, eraseBoxes, photos, name) {
  let base = eraseBoxes && eraseBoxes.length ? await erase(src, eraseBoxes) : await sharp(src).png().toBuffer();
  if (photos && photos.length) {
    const layers = [];
    for (const p of photos) {
      // p.crop: cut from p.file first; p.mask: SVG alpha (else the image's own alpha); p.fit: 'cover' | 'contain'
      const img = () => { const s = sharp(p.file); return p.crop ? s.extract(p.crop) : s; };
      const sized = await img().resize(p.w, p.h, { fit: p.fit || 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } }).ensureAlpha().raw().toBuffer();
      const alpha = p.mask ? await sharp(Buffer.from(p.mask)).resize(p.w, p.h).greyscale().extractChannel(0).raw().toBuffer() : null;
      const rgba = Buffer.alloc(p.w * p.h * 4);
      for (let i = 0; i < p.w * p.h; i++) {
        rgba[i * 4] = sized[i * 4]; rgba[i * 4 + 1] = sized[i * 4 + 1]; rgba[i * 4 + 2] = sized[i * 4 + 2];
        rgba[i * 4 + 3] = alpha ? Math.round(alpha[i] * sized[i * 4 + 3] / 255) : sized[i * 4 + 3];
      }
      layers.push({ input: await sharp(rgba, { raw: { width: p.w, height: p.h, channels: 4 } }).png().toBuffer(), left: p.x, top: p.y });
    }
    base = await sharp(base).composite(layers).png().toBuffer();
  }
  const file = path.join(TMP, name + '-base.png');
  fs.writeFileSync(file, base);
  return file;
}

export async function paintScreen({ src, out, W, H, css = '', html, wait = 4000, erase: eraseBoxes, photos }) {
  const name = path.basename(out, path.extname(out));
  src = await prepareBase(src, W, H, eraseBoxes, photos, name);
  const page = path.join(TMP, name + '.html');
  fs.writeFileSync(page, `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="${FONTS}" rel="stylesheet">
<style>
  html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#000}
  .base{position:absolute;left:0;top:0;width:${W}px;height:${H}px}
  .p,.t,.ph{position:absolute}
  .t{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:1.2}
  .noise{position:absolute;inset:0;opacity:.05;mix-blend-mode:multiply;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>")}
  ${css}
</style></head><body>
<img class="base" src="${url(src)}">
${html}
</body></html>`);
  const png = path.join(TMP, path.basename(out, path.extname(out)) + '.png');
  const r = spawnSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    `--user-data-dir=${path.join(TMP, 'chrome')}`, `--window-size=${W},${H}`, '--force-device-scale-factor=1',
    `--virtual-time-budget=${wait}`, `--screenshot=${png}`, url(page)], { encoding: 'utf8' });
  if (!fs.existsSync(png)) throw new Error('Chrome did not render ' + out + '\n' + r.stderr);
  await sharp(png).extract({ left: 0, top: 0, width: W, height: H }).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
  return out;
}
