/* Swarnit Wayal & Kaumudi Shewale — Maharashtrian wedding invitation (client brief 2026-11-22),
   public/swarnit-kaumudi-wedding, a separate page on the hindu-south-wedding template (never edited for it).

     node tools/swarnit-kaumudi-wedding.mjs

   From the client's pictures in invites/src/swarnit-kaumudi-wedding/ it writes:
   - assets/hero-arch.webp   the hill fort through the marigold arch (fort-hill-arch.jpg), the hero's scene;
     assets/intro-last.webp  the same scene at the film's size;
   - assets/venue.webp  the client's photograph of the venue (venue.jpg), only resized;
   - assets/og.jpg  the WhatsApp / link-preview cover (1200 x 630), shot from tools/swarnit-kaumudi-wedding-og.html;
   - index.html's title, description and sharing tags.
   The couple (assets/couple.webp) is cut from couple-on-black.jpg by tools/varun-diksha-couple.mjs:
     SRC=invites/src/swarnit-kaumudi-wedding/couple-on-black.jpg OUT=… POCKET=150 node tools/varun-diksha-couple.mjs
   and the groom's hair (which that setting holes) is restored from a POCKET=Infinity run; it is not rebuilt here. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'swarnit-kaumudi-wedding'), A = path.join(DIR, 'assets');
const SRC = path.join(ROOT, 'invites', 'src', 'swarnit-kaumudi-wedding');
const { weddingConfig: C } = await import(pathToFileURL(path.join(DIR, 'config.js')).href + '?t=' + Date.now());
const URL_ = `https://invitivals.com/${C.slug}/`;
const webp = (img, name, q = 84) => img.webp({ quality: q, effort: 6 }).toFile(path.join(A, name)).then((i) => console.log('✓', name, i.width + 'x' + i.height, i.size));

/* ── artwork ── */
await webp(sharp(path.join(SRC, 'fort-hill-arch.jpg')).resize(941, 1672, { fit: 'cover' }), 'hero-arch.webp', 86);
await webp(sharp(path.join(SRC, 'fort-hill-arch.jpg')).resize(720, 1280, { fit: 'cover' }), 'intro-last.webp', 80);
await webp(sharp(path.join(SRC, 'venue.jpg')).resize({ width: 1000 }), 'venue.webp', 86);   // the client's venue photograph, whole

/* ── link preview ── */
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const png = path.join(os.tmpdir(), 'swarnit-kaumudi-og.png');
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630',
  '--virtual-time-budget=8000', '--allow-file-access-from-files', `--screenshot=${png}`, pathToFileURL(path.join(ROOT, 'tools', 'swarnit-kaumudi-wedding-og.html')).href], { stdio: 'ignore' });
const og = await sharp(png).flatten({ background: '#f4e4ca' }).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(A, 'og.jpg'));
if (og.width !== 1200 || og.height !== 630) throw new Error('cover is ' + og.width + 'x' + og.height);
console.log('✓ og.jpg', og.width + 'x' + og.height, og.size);

/* ── sharing tags: the whole head block, written fresh ── */
const PAIR = `${C.groomFull} & ${C.brideFull}`;
const TITLE = `${PAIR} · Wedding Invitation`;
const DESC = `With joy in our hearts, ${PAIR} cordially invite you and your family to their wedding celebrations on 26 & 27 December 2026 at ${C.venue}, ${C.venueAddress}.`;
const OGD = `Sunday, 27 December 2026 · ${C.venue}, Washim. Tap to open the invitation.`;
const IMG = `${URL_}assets/og.jpg`;
const ALT = `Wedding invitation of ${PAIR}, 27 December 2026, Washim`;
const h = (x) => x.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const block = [
  `<title>${h(TITLE)}</title>`,
  `<meta name="description" content="${h(DESC)}">`,
  '<meta name="author" content="Invitivals">',
  '<meta name="theme-color" content="#4a0e18">',
  `<link rel="canonical" href="${URL_}">`,
  ...[['og:type', 'website'], ['og:site_name', 'Invitivals'], ['og:locale', 'en_IN'], ['og:url', URL_], ['og:title', TITLE], ['og:description', OGD],
    ['og:image', IMG], ['og:image:secure_url', IMG], ['og:image:type', 'image/jpeg'], ['og:image:width', '1200'], ['og:image:height', '630'], ['og:image:alt', ALT]]
    .map(([n, v]) => `<meta property="${n}" content="${h(v)}">`),
  ...[['twitter:card', 'summary_large_image'], ['twitter:title', TITLE], ['twitter:description', OGD], ['twitter:image', IMG], ['twitter:image:alt', ALT]]
    .map(([n, v]) => `<meta name="${n}" content="${h(v)}">`),
].join('\n');
const ix = path.join(DIR, 'index.html');
const html = fs.readFileSync(ix, 'utf8').replace(/\r\n/g, '\n').replace(/<title>[\s\S]*?<meta name="twitter:[^>]*>(\n<meta name="twitter:[^>]*>)*/, block);
if (!html.includes(IMG) || /anirudh|sreya|creativals|hindu-south/i.test(html)) throw new Error('index.html tags not replaced');
fs.writeFileSync(ix, html);
console.log('✓ index.html tags');
