/* The bride-side skin of public/arshleen-manbir-wedding: the groom page public/manbir-arshleen-wedding (READ ONLY)
   with its sapphire turned to deep plum, by one colour rule (tools/lib/plum-grade.mjs) applied to everything that
   carries colour. Every composition, picture, size and animation stays the groom page's.

     FFMPEG="C:/Program Files/DownloadHelper CoApp/ffmpeg.exe" node tools/arshleen-manbir-wedding-theme.mjs [--no-film]

   Always works FROM the groom page's originals, so running it again never compounds the grade:
     assets/*.webp                  every picture (couple, hero, arch, garland, lantern, dhol, bells, doors…)
     assets/intro-video.mp4         the opening film: every frame graded, re-encoded once (H.264, same size and
                                    frame rate, its sound copied untouched), +faststart for phones
     css/invite.css                 every colour literal graded, then the bride page's own additions (BRIDE_CSS)
     js/decor.js, js/motion.js      their colour literals graded (the drawn ornaments, the petals)
     favicon.svg                    graded
   Then run the content tools:  node tools/sikh-finish.mjs public/arshleen-manbir-wedding
                                node tools/arshleen-manbir-wedding.mjs */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { plumBuffer, plumText } from './lib/plum-grade.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'public', 'manbir-arshleen-wedding');
const DST = path.join(ROOT, 'public', 'arshleen-manbir-wedding');
const FF = process.env.FFMPEG || 'C:/Program Files/DownloadHelper CoApp/ffmpeg.exe';
const NO_FILM = process.argv.includes('--no-film');

/* ── pictures ───────────────────────────────────────────────── */
const PICS = fs.readdirSync(path.join(SRC, 'assets')).filter((f) => f.endsWith('.webp') && f !== 'horse.webp');   // the horse is the groom's ghodi: not on the bride page
for (const f of PICS) {
  const { data, info } = await sharp(path.join(SRC, 'assets', f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const meta = await sharp(path.join(SRC, 'assets', f)).metadata();
  plumBuffer(data, 4);
  let img = sharp(data, { raw: info });
  if (!meta.hasAlpha) img = img.removeAlpha();
  await img.webp({ quality: 86, alphaQuality: 90, effort: 5 }).toFile(path.join(DST, 'assets', f));
}
console.log(`✓ ${PICS.length} pictures graded`);

/* ── stylesheet and scripts ─────────────────────────────────── */
const BRIDE_CSS = `
/* ── Arshleen & Manbir, bride side (tools/arshleen-manbir-wedding-theme.mjs) ──────────────────────────────────
   Royal Ivory & Plum: the groom page's design, its sapphire turned to deep plum by the theme tool; below, only what
   the bride side adds. */
/* Jaggo Night: the engine's gold lanterns (as on the dhol card: the art rises a little out of the card's top edge) */
.event.art-lantern{padding-top:96px}
.card-art-lantern{height:170px}
/* the Akhand Path and the Bangle Ceremony: two times in one card, each with its own calendar entry */
.drow-part b{font-weight:600;color:var(--ink-navy)}
.event-actions-parts .btn{min-width:min(100%,236px);justify-content:center}
.event-actions-parts .btn span{display:flex;flex-direction:column;align-items:center;line-height:1.35}
.event-actions-parts .btn small{font-size:.92em;letter-spacing:.1em;text-transform:none;font-family:var(--serif);font-style:italic;opacity:.85}
`;
fs.writeFileSync(path.join(DST, 'css', 'invite.css'), plumText(fs.readFileSync(path.join(SRC, 'css', 'invite.css'), 'utf8')) + BRIDE_CSS);
for (const f of ['js/decor.js', 'js/motion.js', 'favicon.svg']) fs.writeFileSync(path.join(DST, f), plumText(fs.readFileSync(path.join(SRC, f), 'utf8')));
console.log('✓ css/invite.css, js/decor.js, js/motion.js, favicon.svg graded');

/* ── the opening film ───────────────────────────────────────── */
if (!NO_FILM) {
  const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'am-film-'));
  const ff = (...a) => execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: 'inherit' });
  const IN = path.join(SRC, 'assets', 'intro-video.mp4');
  ff('-i', IN, '-vsync', '0', path.join(TMP, 'f-%04d.png'));
  const frames = fs.readdirSync(TMP).filter((f) => f.startsWith('f-')).sort();
  for (const f of frames) {
    const p = path.join(TMP, f);
    const { data, info } = await sharp(p).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    plumBuffer(data, 3);
    await sharp(data, { raw: info }).png({ compressionLevel: 1 }).toFile(path.join(TMP, 'g' + f.slice(1)));
  }
  ff('-framerate', '30', '-i', path.join(TMP, 'g-%04d.png'), '-i', IN, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19',
     '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-c:a', 'copy', '-movflags', '+faststart', '-shortest', path.join(DST, 'assets', 'intro-video.mp4'));
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(`✓ assets/intro-video.mp4 — ${frames.length} frames graded`);
}
