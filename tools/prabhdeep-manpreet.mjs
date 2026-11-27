/* Prabhdeep & Manpreet — two separate pages (client brief 2026-11-27), on the design of
   public/amandeep-ishpreet-wedding via the engine of public/kiranjit-sharnjit-wedding (both only READ here):
     public/prabhdeep-manpreet-wedding   the Sikh wedding, Sunday 24 January 2027, Kolkata (six events, two venues)
     public/prabhdeep-manpreet-sangeet   the Sangeet, Thursday 21 January 2027, 3:00 PM onwards, Howrah

     node tools/prabhdeep-manpreet.mjs theme          RETIRED (client, 2026-11-28): the Sangeet uses exactly the wedding page's
                                                      colours, pictures and film; do not run (it would plum-grade the page again)
     node tools/sikh-finish.mjs public/<slug>         meta tags and cache stamps (each page)
     node tools/prabhdeep-manpreet.mjs                calendar files, link-preview pictures and sharing tags (both)

   Calendar files carry the start only (no end time was supplied), TZID Asia/Kolkata, the venue's address and its
   map link in the description; one file per event and one with all of a page's events. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { plumBuffer, plumText } from './lib/plum-grade.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIG = path.join(ROOT, 'public/kiranjit-sharnjit-wedding');
const FF = process.env.FFMPEG || 'C:/Program Files/DownloadHelper CoApp/ffmpeg.exe';

/* ── the Sangeet's skin ─────────────────────────────────────── */
if (process.argv[2] === 'theme') {
  throw new Error('retired: the Sangeet keeps the wedding page’s own colours (client, 2026-11-28)');
  const D = path.join(ROOT, 'public/prabhdeep-manpreet-sangeet');
  for (const f of fs.readdirSync(path.join(ORIG, 'assets')).filter((f) => f.endsWith('.webp') && f !== 'horse.webp')) {
    const { data, info } = await sharp(path.join(ORIG, 'assets', f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const meta = await sharp(path.join(ORIG, 'assets', f)).metadata();
    plumBuffer(data, 4);
    let img = sharp(data, { raw: info }); if (!meta.hasAlpha) img = img.removeAlpha();
    await img.webp({ quality: 86, alphaQuality: 90, effort: 5 }).toFile(path.join(D, 'assets', f));
  }
  /* the stylesheet and scripts are this page's own (patched): graded once, marked so it never happens twice */
  const MARK = '/* plum evening skin: tools/prabhdeep-manpreet.mjs theme */';
  const css = fs.readFileSync(path.join(D, 'css/invite.css'), 'utf8');
  if (!css.startsWith(MARK)) {
    fs.writeFileSync(path.join(D, 'css/invite.css'), MARK + '\n' + plumText(css));
    for (const f of ['js/decor.js', 'js/motion.js', 'favicon.svg']) fs.writeFileSync(path.join(D, f), plumText(fs.readFileSync(path.join(ORIG, f), 'utf8')));
  }
  const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-film-'));
  const ff = (...a) => execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: 'inherit' });
  const IN = path.join(ORIG, 'assets/intro-video.mp4');
  ff('-i', IN, '-vsync', '0', path.join(TMP, 'f-%04d.png'));
  for (const f of fs.readdirSync(TMP).filter((f) => f.startsWith('f-'))) {
    const { data, info } = await sharp(path.join(TMP, f)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    plumBuffer(data, 3);
    await sharp(data, { raw: info }).png({ compressionLevel: 1 }).toFile(path.join(TMP, 'g' + f.slice(1)));
  }
  ff('-framerate', '30', '-i', path.join(TMP, 'g-%04d.png'), '-i', IN, '-map', '0:v', '-map', '1:a?', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
     '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', '-shortest', path.join(D, 'assets/intro-video.mp4'));
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('✓ Sangeet skin');
  process.exit(0);
}

/* ── calendar files, link previews and sharing tags ─────────── */
const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (l) => { const out = []; let b = Buffer.from(l, 'utf8'), lim = 75;
  while (b.length > lim) { let cut = lim; while ((b[cut] & 0xC0) === 0x80) cut--; out.push(b.subarray(0, cut).toString('utf8')); b = b.subarray(cut); lim = 74; }
  out.push(b.toString('utf8')); return out.join('\r\n '); };
const wall = (iso) => { if (!/\+05:30$/.test(iso)) throw new Error('expected an India-time date: ' + iso); return iso.slice(0, 19).replace(/[-:]/g, ''); };
const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const PAGES = {
  'prabhdeep-manpreet-wedding': {
    title: 'Prabhdeep Kaur &amp; Manpreet Singh Sabharwal | Wedding Invitation',
    desc: 'With the grace of Waheguru, Sardar Manjit Singh &amp; Sardarni Ekta Kaur invite you to the wedding of their daughter Prabhdeep Kaur with Manpreet Singh Sabharwal — Anand Karaj, Sunday 24 January 2027, 10:30 AM, Gurudwara Sant Kutia, Kolkata.',
    ogd: 'Wedding Invitation · Anand Karaj · Sunday, 24 January 2027 · Kolkata. Tap to open the invitation.',
    alt: 'Prabhdeep Kaur &amp; Manpreet Singh Sabharwal — Wedding Invitation, 24 January 2027, Kolkata',
    detail: (cfg, ev) => `${ev.name} · the wedding of ${cfg.brideName} & ${cfg.groomName}`,
    og: { bg: 'anand-karaj.webp', tint: '#1b2a52', deep: '#0f1a38', kicker: 'THE WEDDING OF', lines: ['Prabhdeep Kaur', 'Manpreet Singh Sabharwal'], foot: 'ANAND KARAJ · 24 JANUARY 2027 · KOLKATA' },
  },
  'prabhdeep-manpreet-sangeet': {
    title: 'Sangeet · Prabhdeep &amp; Manpreet | Invitation',
    desc: 'Manjit Singh &amp; Ekta Kaur cordially invite you to an evening of music &amp; dance to celebrate the upcoming wedding of Prabhdeep &amp; Manpreet — Thursday 21 January 2027, 3:00 PM onwards, Bika Banquet, Rangoli Mall, Howrah.',
    ogd: 'Sangeet · Thursday, 21 January 2027 · 3:00 PM onwards · Bika Banquet, Howrah. Tap to open the invitation.',
    alt: 'Sangeet of Prabhdeep &amp; Manpreet — 21 January 2027, Bika Banquet, Howrah',
    detail: (cfg, ev) => ev.calDetails,
    og: { bg: 'finale-bg.webp', tint: '#1b2a52', deep: '#0f1a38', kicker: 'AN EVENING OF MUSIC & DANCE', script: 'Sangeet', lines: ['Prabhdeep & Manpreet'], foot: 'THURSDAY · 21 JANUARY 2027 · 3:00 PM ONWARDS', dhol: true },   // the wedding page's colours (client, 2026-11-28: no plum)
  },
};

for (const [SLUG, P] of Object.entries(PAGES)) {
  const DIR = path.join(ROOT, 'public', SLUG), URL_ = `https://invitivals.com/${SLUG}/`;
  const { weddingConfig: cfg } = await import(pathToFileURL(path.join(DIR, 'config.js')).href + '?t=' + Date.now());
  const PAIR = `${cfg.brideName} & ${cfg.groomName}`;
  const vevent = (ev) => {
    const title = `${ev.name} – ${PAIR}`;
    const desc = [P.detail(cfg, ev), `Venue: ${ev.cal || [ev.venue, ev.address].filter(Boolean).join(', ')}`, ev.maps ? `Map: ${ev.maps}` : '', URL_].filter(Boolean).join('\n');
    return ['BEGIN:VEVENT', `UID:${wall(ev.date)}-${ev.id}@${SLUG}.invitivals.com`, 'DTSTAMP:20261127T000000Z',
      `DTSTART;TZID=Asia/Kolkata:${wall(ev.date)}`,                              // no DTEND: only the start was supplied
      `SUMMARY:${esc(title)}`, `LOCATION:${esc(ev.cal || [ev.venue, ev.address].filter(Boolean).join(', '))}`, `DESCRIPTION:${esc(desc)}`, `URL:${URL_}`,
      'STATUS:CONFIRMED', 'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(title)}`, 'END:VALARM', 'END:VEVENT'];
  };
  const wrap = (events) => ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//Invitivals//${PAIR}//EN`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(PAIR)}`, 'X-WR-TIMEZONE:Asia/Kolkata',
    'BEGIN:VTIMEZONE', 'TZID:Asia/Kolkata', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0530', 'TZOFFSETTO:+0530', 'TZNAME:IST', 'END:STANDARD', 'END:VTIMEZONE',
    ...events.flatMap(vevent), 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
  const CAL = path.join(DIR, 'assets/cal');
  fs.mkdirSync(CAL, { recursive: true });
  for (const ev of cfg.events) fs.writeFileSync(path.join(CAL, `${ev.id}.ics`), wrap([ev]));
  for (const f of [`${SLUG}.ics`, 'all.ics']) fs.writeFileSync(path.join(CAL, f), wrap(cfg.events));
  fs.rmSync(path.join(CAL, 'all-with-mehndi.ics'), { force: true });          // left by the finishing tool; nothing links to it
  console.log(`✓ ${SLUG}: assets/cal — ${cfg.events.map((e) => e.id).join(', ')} (start times only)`);

  /* link preview: the page's own scene, its words in the middle (a square crop keeps them) */
  const O = P.og, T = (c) => (O.plum ? plumText(c) : c);
  const bg = await sharp(path.join(DIR, 'assets', O.bg)).resize({ width: 1200, height: 630, fit: 'cover', position: O.dhol ? 'centre' : 'top' }).toBuffer();
  const layers = [];
  const two = O.lines.length > 1;
  const svg = Buffer.from(T(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${O.tint}" stop-opacity="0.25"/><stop offset="0.3" stop-color="${O.tint}" stop-opacity="0.12"/>
    <stop offset="0.55" stop-color="${O.deep}" stop-opacity="0.66"/><stop offset="1" stop-color="${O.deep}" stop-opacity="0.95"/></linearGradient>
    <radialGradient id="w" cx="600" cy="420" r="480" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 420) scale(1 .55) translate(-600 -420)"><stop offset="0" stop-color="${O.deep}" stop-opacity="0.6"/><stop offset="1" stop-color="${O.deep}" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="630" fill="url(#v)"/><rect width="1200" height="630" fill="url(#w)"/>
  ${O.dhol ? '' : `<g transform="translate(550 22)" fill="none" stroke="#e7c87a" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="58" r="17"/><path d="M50 12 L54 32 L52 70 L48 70 L46 32 Z"/><ellipse cx="50" cy="76" rx="7" ry="2.6"/>
    <path d="M50 79 V88"/><circle cx="50" cy="90" r="2.4"/>
    <path d="M50 88 C33 86 20 68 25 46 C28 36 35 30 42 27"/><path d="M50 88 C67 86 80 68 75 46 C72 36 65 30 58 27"/></g>`}
  <g text-anchor="middle" font-family="Georgia, 'Times New Roman', serif">
    <text x="600" y="${O.dhol ? 318 : 292}" font-size="22" letter-spacing="8" fill="#e7c87a">${x(O.kicker)}</text>
    ${O.script ? `<text x="600" y="398" font-size="84" font-style="italic" fill="#f8f0df">${x(O.script)}</text>` : ''}
    ${two ? `<text x="600" y="368" font-size="58" font-style="italic" fill="#f8f0df">${x(O.lines[0])}</text>
    <text x="600" y="418" font-size="34" font-style="italic" fill="#e7c87a">&amp;</text>
    <text x="600" y="482" font-size="54" font-style="italic" fill="#f8f0df">${x(O.lines[1])}</text>`
    : `<text x="600" y="470" font-size="54" font-style="italic" fill="#f1e6cf">${x(O.lines[0])}</text>`}
    <line x1="420" y1="${two ? 520 : 506}" x2="780" y2="${two ? 520 : 506}" stroke="#e7c87a" stroke-opacity="0.7" stroke-width="1.5"/>
    <text x="600" y="${two ? 566 : 556}" font-size="23" letter-spacing="4" fill="#f1e6cf">${x(O.foot)}</text>
  </g></svg>`));
  layers.push({ input: svg });
  if (O.dhol) {
    const dhol = await sharp(path.join(DIR, 'assets/dhol.webp')).resize({ height: 230 }).toBuffer();
    const m = await sharp(dhol).metadata();
    layers.push({ input: dhol, left: Math.round(600 - m.width / 2), top: 30 });
  }
  const info = await sharp(bg).composite(layers).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(DIR, 'assets/og.jpg'));
  console.log(`✓ ${SLUG}: assets/og.jpg`, info.size, 'bytes');

  /* sharing tags */
  const ix = path.join(DIR, 'index.html');
  let html = fs.readFileSync(ix, 'utf8');
  const set = (re, val) => { if (!re.test(html)) throw new Error(`${SLUG}: tag not found ${re}`); html = html.replace(re, val); };
  set(/<title>[^<]*<\/title>/, `<title>${P.title}</title>`);
  set(/(<meta property="og:title" content=")[^"]*(")/, `$1${P.title}$2`);
  set(/(<meta name="description" content=")[^"]*(")/, `$1${P.desc}$2`);
  set(/(<meta property="og:description" content=")[^"]*(")/, `$1${P.ogd}$2`);
  set(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${P.alt}$2`);
  set(/(<meta name="author" content=")[^"]*(")/, '$1Invitivals$2');
  set(/(<meta property="og:site_name" content=")[^"]*(")/, '$1Invitivals$2');
  html = html.replace(/(<meta name="theme-color" content=")[^"]*(")/, "$1#1b2a52$2");   // both pages: the wedding page’s navy
  html = html.replace(/(<meta name="apple-mobile-web-app-title" content=")[^"]*(")/, `$1${O.script ? 'Sangeet' : 'Prabhdeep &amp; Manpreet'}$2`);
  if (!/rel="canonical"/.test(html)) set(/(<meta property="og:url"[^>]*>)/, `<link rel="canonical" href="${URL_}">\n$1`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${URL_}$2`).replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${URL_}$2`);
  html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${URL_}assets/og.jpg?v=1$2`);
  html = html.replace(/\n<meta name="twitter:title"[^>]*>\n<meta name="twitter:description"[^>]*>\n<meta name="twitter:image"[^>]*>/, '');
  html = html.replace(/(<meta name="twitter:card"[^>]*>)/, `$1
<meta name="twitter:title" content="${P.title}">
<meta name="twitter:description" content="${P.ogd}">
<meta name="twitter:image" content="${URL_}assets/og.jpg?v=1">`);
  if (/kiranjit|sharnjit|ghotra|mukerian/i.test(html)) throw new Error(`${SLUG}: index.html still carries the earlier couple`);
  fs.writeFileSync(ix, html);
  console.log(`✓ ${SLUG}: sharing tags`);
}
