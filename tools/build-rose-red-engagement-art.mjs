/* Builds the art of the Rose Red Engagement template (public/rose-red-engagement/) from the designer's
 * separated element packs in invites/src/rose-red-engagement/ (not committed; the zip the client sent).
 *
 *   node tools/build-rose-red-engagement-art.mjs
 *
 * Every element is used as it was drawn: trimmed of its transparent padding, capped to a sensible size and
 * saved as WebP under assets/el/<pack>-<nn>.webp. A manifest (assets/el/manifest.json) records each piece's
 * size so the page can lay it out by its real proportions. Source files are never modified.
 *
 * Packs: invite (the couple's page) · swans (save our date) · calendar (the date's lettering, button, petals)
 *        venue · envelope-thanks (the CORRECT pack: envelope, seal and the clean flowers of the thank-you page)
 * thanks-raw is the superseded first cut of the thank-you pieces (rectangular crops) — not used.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'invites/src/rose-red-engagement');
const OUT = path.join(ROOT, 'public/rose-red-engagement/assets/el');
const PACKS = { invite: 'nm', swans: 'sw', calendar: 'cal', venue: 'ven', 'envelope-thanks': 'cor' };
/* the biggest pieces are whole scenes drawn at 2×; a phone shows the stage at ~900 px wide at most */
const cap = (w, h) => Math.max(w, h) > 1500 ? 1500 : Math.max(w, h) > 1000 ? 1000 : Math.max(w, h);

if (!fs.existsSync(SRC)) { console.error(`no source packs at ${SRC}`); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const manifest = {};
let total = 0;
for (const [dir, pre] of Object.entries(PACKS)) {
  for (const f of fs.readdirSync(path.join(SRC, dir)).filter((f) => f.endsWith('.png')).sort()) {
    const m = f.match(/element_(\d+)|clean_(\w+)/);
    const id = `${pre}-${m[1] || m[2].replace(/_/g, '-')}`;
    let img = sharp(path.join(SRC, dir, f)).ensureAlpha().trim({ threshold: 8 });
    const { width, height } = await img.toBuffer({ resolveWithObject: true }).then((r) => r.info);
    const max = cap(width, height);
    img = sharp(path.join(SRC, dir, f)).ensureAlpha().trim({ threshold: 8 });
    if (Math.max(width, height) > max) img = img.resize({ [width >= height ? 'width' : 'height']: max, kernel: 'lanczos3' });
    const out = path.join(OUT, id + '.webp');
    const info = await img.webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(out);
    manifest[id] = [info.width, info.height];
    total += info.size;
    console.log(`${id.padEnd(28)} ${String(info.width).padStart(4)}×${String(info.height).padEnd(5)} ${(info.size / 1024).toFixed(0).padStart(5)} KB`);
  }
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest));
console.log(`\n${Object.keys(manifest).length} pieces, ${(total / 1048576).toFixed(1)} MB`);
