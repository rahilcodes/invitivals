/* Dr. Sai Sushmitha Reddy & Sai Santosh Reddy — Engagement Ceremony (client brief 2026-11-24),
   public/sai-sushmitha-sai-santosh-engagement: a separate page on the design of public/dr-mohammed-nihal-nooha, kept as
   that design (read only: its plates and cut-outs were copied once; the reference is never edited for this page).

     node tools/sai-sushmitha-sai-santosh-engagement.mjs

   It writes:
   - assets/ss-plum.webp and assets/ss-gold.webp: the client's own SS monogram (invites/src/sai-sushmitha-sai-santosh-engagement/
     ss-monogram.jpg, black ink on a pale background). The shape is the client's exactly (no redraw, no stretch, no crop
     into it): only the pale background is taken away (the ink is read from how dark each pixel is) and the ink is
     coloured plum for the ivory card and champagne gold for the burgundy closing, as the reference does with its own;
   - assets/plate3.webp: the reference's page-3 plate with the second card's two painted buttons (Save the Date / View on
     Google Maps) filled with the card's own paper — that card carries the families here, and has no buttons;
   - js/art.js with the monogram's sizes;
   - engagement.ics from config.js (India time with a VTIMEZONE; only a start time was supplied, so no DTEND);
   - index.html's title, description and sharing tags;
   - assets/cover-sai-sushmitha-sai-santosh.jpg, the link preview, shot from tools/sai-sushmitha-sai-santosh-engagement-og.html.
   The opening film with the SS seal is made separately: tools/sai-sushmitha-sai-santosh-film/README.md. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'sai-sushmitha-sai-santosh-engagement';
const DIR = path.join(ROOT, 'public', SLUG), OUT = path.join(DIR, 'assets');
const SRC = path.join(ROOT, 'invites', 'src', SLUG);
const REF = path.join(ROOT, 'public', 'dr-mohammed-nihal-nooha', 'assets');
const { config: C } = await import(pathToFileURL(path.join(DIR, 'config.js')).href + '?t=' + Date.now());
const URL_ = `https://invitivals.com/${C.slug}/`;

/* ── the monogram: ink = how much darker than the pale background a pixel is ── */
const sizes = {};
{
  const src = path.join(SRC, 'ss-monogram.jpg');
  const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const a = Buffer.alloc(W * H);
  for (let k = 0; k < W * H; k++) a[k] = Math.round(Math.max(0, Math.min(1, (222 - data[k]) / 170)) * 255);   // paper ≥ 222 → clear, ink ≤ 52 → solid
  const ink = async (stops, name) => {
    const grad = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">${stops.map((c, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`)).removeAlpha().raw().toBuffer();
    const png = await sharp(grad, { raw: { width: W, height: H, channels: 3 } }).joinChannel(a, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
    const trimmed = await sharp(png).trim({ threshold: 1 }).png().toBuffer();
    const r = await sharp(trimmed).resize({ width: 560, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(path.join(OUT, name + '.webp'));
    sizes[name] = [r.width, r.height];
  };
  await ink(['#7a4a68', '#5a2a47'], 'ss-plum');
  await ink(['#fbeecb', '#e3c383', '#f3dfae'], 'ss-gold');
}
{
  const f = path.join(DIR, 'js', 'art.js');
  const t = fs.readFileSync(f, 'utf8');
  const art = JSON.parse(/export const art = (\{.*?\});/.exec(t)[1]);
  for (const k of Object.keys(art)) if (/^(n[nd]|ss)-|^bismillah$/.test(k)) delete art[k];
  Object.assign(art, sizes);
  fs.writeFileSync(f, t.replace(/^\/\*[\s\S]*?\*\//, `/* written by tools/dr-mohammed-nihal-nooha.mjs for the reference page, the monogram sizes by
   tools/sai-sushmitha-sai-santosh-engagement.mjs: the pixel sizes of the artwork, and the boxes (x, y, w, h in % of the
   page) the reference's layout gives the pieces of pages 2 and 3 */`).replace(/export const art = \{.*?\};/, `export const art = ${JSON.stringify(art)};`));
  console.log('✓ monogram', sizes);
}

/* ── page 3: the second card without its buttons (x 304–816, y 1344–1456 of 941 × 1672): each row is filled with a
   blend of the card's paper just left and just right of the buttons, then the patch is softened at its edge ── */
{
  const { data, info } = await sharp(path.join(REF, 'plate3.webp')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, X0 = 304, X1 = 816, Y0 = 1344, Y1 = 1456;
  const px = (x, y, c) => data[(y * W + x) * 3 + c];
  const avg = (x, y, c) => { let s = 0, n = 0; for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) { s += px(x + dx, y + dy, c); n++; } return s / n; };
  for (let y = Y0; y <= Y1; y++) {
    const L = [0, 1, 2].map((c) => avg(X0 - 4, y, c)), R = [0, 1, 2].map((c) => avg(X1 + 4, y, c));
    for (let x = X0; x <= X1; x++) { const t = (x - X0) / (X1 - X0); for (let c = 0; c < 3; c++) data[(y * W + x) * 3 + c] = Math.round(L[c] * (1 - t) + R[c] * t + (Math.random() - 0.5) * 2); }
  }
  const patched = sharp(data, { raw: info });
  const soft = await sharp(await patched.clone().png().toBuffer()).extract({ left: X0 - 10, top: Y0 - 10, width: X1 - X0 + 20, height: Y1 - Y0 + 20 }).blur(4).toBuffer();
  const mask = Buffer.from(`<svg width="${X1 - X0 + 20}" height="${Y1 - Y0 + 20}"><defs><filter id="f"><feGaussianBlur stdDeviation="4"/></filter></defs><rect x="8" y="8" width="${X1 - X0 + 4}" height="${Y1 - Y0 + 4}" fill="#fff" filter="url(#f)"/></svg>`);
  const softMasked = await sharp(soft).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  const base = await patched.png().toBuffer();
  await sharp(base).composite([{ input: softMasked, left: X0 - 10, top: Y0 - 10 }]).webp({ quality: 88 }).toFile(path.join(OUT, 'plate3.webp'));
  console.log('✓ plate3 (second card without buttons)');
}

/* ── calendar file ── */
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const details = (e) => `${e.date}\n${C.programme.join('\n')}\nVenue: ${e.venue}\nLocation: ${e.mapsUrl}\n\n${URL_}`;
const vevent = (e) => [
  'BEGIN:VEVENT', `UID:${C.slug}-${e.key}@invitivals.com`, 'DTSTAMP:20261124T000000Z',
  `DTSTART;TZID=${C.timeZone}:${e.local}`,
  `SUMMARY:${esc(`${e.title} — ${C.couple}`)}`, `LOCATION:${esc(e.venue)}`, `DESCRIPTION:${esc(details(e))}`, `URL:${e.mapsUrl}`,
  'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.title)}`, 'END:VALARM', 'END:VEVENT'];
const wrap = (events) => [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Engagement Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'BEGIN:VTIMEZONE', `TZID:${C.timeZone}`, 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
  ...events.flatMap(vevent), 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
for (const e of C.events) fs.writeFileSync(path.join(DIR, e.ics), wrap([e]));
console.log('✓ ics', C.events.map((e) => e.ics).join(', '));

/* ── sharing tags ── */
const COVER = 'cover-sai-sushmitha-sai-santosh.jpg';
const TITLE = `${C.couple} · Engagement Ceremony`;
const OGT = `${C.couple} · Engagement`;
const OGD = 'Engagement Ceremony | Friday, 4 December 2026, 7:30 PM onwards | BMR Sartha Convention, Manneguda';
const DESC = `Together with our families, we cordially invite you to celebrate the engagement ceremony of ${C.couple} on Friday, 4th December 2026, 7:30 PM onwards, at BMR SARTHA CONVENTION, Exit No. 12, Manneguda, Telangana.`;
const IMG = `${URL_}assets/${COVER}`;
const ALT = `${C.couple} · Engagement Ceremony · Friday, 4 December 2026`;
const hx = (x) => x.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const block = [
  ['property', 'og:type', 'website'], ['property', 'og:site_name', 'Invitivals'], ['property', 'og:locale', 'en_IN'],
  ['property', 'og:url', URL_], ['property', 'og:title', OGT], ['property', 'og:description', OGD],
  ['property', 'og:image', IMG], ['property', 'og:image:secure_url', IMG], ['property', 'og:image:type', 'image/jpeg'],
  ['property', 'og:image:width', '1200'], ['property', 'og:image:height', '630'], ['property', 'og:image:alt', ALT],
  ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', OGT], ['name', 'twitter:description', OGD],
  ['name', 'twitter:image', IMG],
].map(([k, n, v]) => `<meta ${k}="${n}" content="${hx(v)}">`).join('\n');
const ix = path.join(DIR, 'index.html');
const html = fs.readFileSync(ix, 'utf8')
  .replace(/<title>[^<]*<\/title>/, `<title>${hx(TITLE)}</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${hx(DESC)}">`)
  .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${URL_}">`)
  .replace(/<meta property="og:type"[\s\S]*?<meta name="twitter:image"[^>]*>/, block)
  .replace(/assets\/opening-(n[nd]|ss)\.webp/g, 'assets/opening-ss.webp');
if (!html.includes(IMG) || /nihal|nooha|navas|dharshinisha|nikah|walima/i.test(html)) throw new Error('index.html still carries another invitation: ' + (/nihal|nooha|navas|dharshinisha|nikah|walima/i.exec(html) || [])[0]);
fs.writeFileSync(ix, html);
console.log('✓ index.html');

/* ── link preview ── */
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const png = path.join(os.tmpdir(), 'sai-sushmitha-sai-santosh-og.png');
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630',
  '--virtual-time-budget=8000', '--allow-file-access-from-files', `--screenshot=${png}`, pathToFileURL(path.join(ROOT, 'tools', `${SLUG}-og.html`)).href], { stdio: 'ignore' });
const og = await sharp(png).flatten({ background: '#ead9cf' }).jpeg({ quality: 86, mozjpeg: true, progressive: true }).toFile(path.join(OUT, COVER));
if (og.width !== 1200 || og.height !== 630) throw new Error('cover is ' + og.width + 'x' + og.height);
console.log('✓ cover', og.width + 'x' + og.height, og.size, 'bytes');
