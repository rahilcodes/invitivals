/* sikh-finish.mjs — finish one Sikh-engine invitation folder from its config.js:
 *
 *   node tools/sikh-finish.mjs public/<folder>
 *
 * Writes, from the folder's own config.js:
 *   assets/cal/<event-id>.ics + assets/cal/all.ics   (real files: iPhone opens
 *                                                    them in Calendar, Android and
 *                                                    desktop download them)
 *   assets/og.jpg                                    (link preview with the names)
 *   index.html <title>, description, og:* and url   (static tags for WhatsApp)
 *   index.html import map + ?v= stamps               (every script, the config,
 *                                                    the stylesheet and the gallery
 *                                                    photos get a new address when
 *                                                    their content changes, so a
 *                                                    correction reaches guests whose
 *                                                    browser kept the old copy)
 *
 * Run it after editing config.js, before deploying.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = process.argv[2];
if (!folder) { console.error('usage: node tools/sikh-finish.mjs public/<folder>'); process.exit(1); }
const DIR = path.resolve(ROOT, folder);
const slug = path.basename(DIR);
const SITE = 'https://invitivals.com';
const { weddingConfig: cfg } = await import(pathToFileURL(path.join(DIR, 'config.js')).href);
/* the bride's family's invitation (hostSide: 'bride') names the bride first */
const [N1, N2] = cfg.hostSide === 'bride' ? [cfg.brideName, cfg.groomName] : [cfg.groomName, cfg.brideName];
const [S1, S2] = cfg.hostSide === 'bride' ? [cfg.shortBride, cfg.shortGroom] : [cfg.shortGroom, cfg.shortBride];

/* ── calendar files ─────────────────────────────────────────── */
const stamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (s) => String(s ?? '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
const vevent = (ev) => {
  const end = ev.main && cfg.weddingEnd ? cfg.weddingEnd : new Date(new Date(ev.date).getTime() + 3 * 36e5).toISOString();
  const title = `${ev.name} — ${S1} & ${S2}`;
  return [
    'BEGIN:VEVENT',
    `UID:${stamp(ev.date)}-${ev.id}@invitivals.com`,
    `DTSTAMP:${stamp(new Date().toISOString())}`, `DTSTART:${stamp(ev.date)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${icsText(title)}`,
    `DESCRIPTION:${icsText([ev.subtitle, ev.note, ev.etiquette].filter(Boolean).join(' '))}`,
    `LOCATION:${icsText(`${ev.venue}, ${ev.address}`)}`,
    `URL:${SITE}/${slug}/`,
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(title)}`, 'END:VALARM',
    'END:VEVENT',
  ].join('\r\n');
};
const wrap = (events) => ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Creativals//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  ...events.map(vevent), 'END:VCALENDAR'].join('\r\n') + '\r\n';
const CAL = path.join(DIR, 'assets', 'cal');
fs.mkdirSync(CAL, { recursive: true });
for (const ev of cfg.events) fs.writeFileSync(path.join(CAL, `${ev.id}.ics`), wrap([ev]));
fs.writeFileSync(path.join(CAL, 'all.ics'), wrap(cfg.events.filter((e) => !e.gate)));
fs.writeFileSync(path.join(CAL, 'all-with-mehndi.ics'), wrap(cfg.events));
console.log('  ✓ assets/cal/*.ics', cfg.events.map((e) => e.id).join(', '), '+ all');

/* ── link preview ───────────────────────────────────────────── */
const main = cfg.events.find((e) => e.main) || cfg.events[0];
const TZ = 'Asia/Kolkata';
const fmt = (o) => new Intl.DateTimeFormat('en-IN', { timeZone: TZ, ...o }).format(new Date(main.date));
const dateLine = `${fmt({ day: 'numeric' })} ${fmt({ month: 'long' })} ${fmt({ year: 'numeric' })}`.toUpperCase();
const temple = path.join(ROOT, 'invites/src/sikh-premium/Golden Temple Reflections at Sunrise.png');
if (fs.existsSync(temple)) {
  const tm = await sharp(temple).metadata();
  const cropH = Math.round(tm.width * 630 / 1200);
  const top = Math.min(tm.height - cropH, Math.max(0, Math.round(tm.height * 0.62) - Math.round(cropH / 2)));
  const bg = await sharp(temple).extract({ left: 0, top, width: tm.width, height: cropH }).resize({ width: 1200, height: 630 }).toBuffer();
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b2a52" stop-opacity="0.12"/><stop offset="0.5" stop-color="#1b2a52" stop-opacity="0"/>
      <stop offset="1" stop-color="#0f1a38" stop-opacity="0.78"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#v)"/>
    <g transform="translate(550 60)" fill="none" stroke="#e7c87a" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="50" cy="58" r="17"/><path d="M50 12 L54 32 L52 70 L48 70 L46 32 Z"/><ellipse cx="50" cy="76" rx="7" ry="2.6"/>
      <path d="M50 79 V88"/><circle cx="50" cy="90" r="2.4"/>
      <path d="M50 88 C33 86 20 68 25 46 C28 36 35 30 42 27"/><path d="M50 88 C67 86 80 68 75 46 C72 36 65 30 58 27"/>
    </g>
    <g text-anchor="middle" font-family="Georgia, 'Times New Roman', serif">
      <text x="600" y="462" font-size="27" letter-spacing="9" fill="#e7c87a">THE ${esc(main.name).toUpperCase()} OF</text>
      <text x="600" y="536" font-size="72" font-style="italic" fill="#f8f0df">${esc(S1)} &amp; ${esc(S2)}</text>
      <text x="600" y="584" font-size="24" letter-spacing="6" fill="#f1e6cf">${dateLine} · ${esc(cfg.venueCity).toUpperCase()}</text>
    </g></svg>`);
  await sharp(bg).composite([{ input: svg }]).jpeg({ quality: 86 }).toFile(path.join(DIR, 'assets', 'og.jpg'));
  console.log('  ✓ assets/og.jpg');
} else console.log('  · og.jpg skipped (source pack missing)');

/* ── static meta tags ───────────────────────────────────────── */
const ix = path.join(DIR, 'index.html');
let html = fs.readFileSync(ix, 'utf8');
const dateHuman = `${fmt({ weekday: 'long' })}, ${fmt({ day: 'numeric' })} ${fmt({ month: 'long' })} ${fmt({ year: 'numeric' })}`;
const h = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const title = `${N1} & ${N2} · Wedding Invitation · Designed by Creativals`;
const desc = `With the blessings of Sri Guru Granth Sahib Ji, ${N1} and ${N2} invite you to their ${main.name} on ${dateHuman} at ${main.venue}, ${main.address}.`;
const set = (re, val) => { if (!re.test(html)) console.warn('  ! tag not found:', re); html = html.replace(re, val); };
set(/<title>[^<]*<\/title>/, `<title>${h(title)}</title>`);
set(/(<meta name="description" content=")[^"]*(")/, `$1${h(desc)}$2`);
set(/(<meta property="og:url" content=")[^"]*(")/, `$1${SITE}/${slug}/$2`);
set(/(<meta property="og:title" content=")[^"]*(")/, `$1${h(`${N1} & ${N2} · Wedding Invitation`)}$2`);
set(/(<meta property="og:description" content=")[^"]*(")/, `$1${h(`${dateHuman} · ${main.venue}, ${cfg.venueCity}. Tap to open the invitation.`)}$2`);
set(/(<meta property="og:image" content=")[^"]*(")/, `$1${SITE}/${slug}/assets/og.jpg$2`);
set(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${h(`${N1} & ${N2} — ${main.name}, ${dateHuman}, ${cfg.venueCity}`)}$2`);
set(/(<meta name="apple-mobile-web-app-title" content=")[^"]*(")/, `$1${h(`${S1} & ${S2}`)}$2`);

/* ── cache stamps ───────────────────────────────────────────── */
const hash = (p) => crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex').slice(0, 10);
// gallery photos are named g1…g6 and get replaced in place, so their links carry the content hash
const cfgPath = path.join(DIR, 'config.js');
let cfgSrc = fs.readFileSync(cfgPath, 'utf8');
cfgSrc = cfgSrc.replace(/'(assets\/gallery\/[\w-]+\.(?:webp|jpg|png))(?:\?v=\w+)?'/g, (m, p) =>
  fs.existsSync(path.join(DIR, p)) ? `'${p}?v=${hash(path.join(DIR, p))}'` : m);
fs.writeFileSync(cfgPath, cfgSrc);
// every module, mapped to a versioned address (imports inside the scripts stay plain)
const mods = ['config.js'];
const walk = (d) => { for (const e of fs.readdirSync(path.join(DIR, d), { withFileTypes: true })) {
  const rel = `${d}/${e.name}`; if (e.isDirectory()) walk(rel); else if (e.name.endsWith('.js')) mods.push(rel); } };
walk('js');
const v = Object.fromEntries(mods.map((m) => [m, hash(path.join(DIR, m))]));
const map = JSON.stringify({ imports: Object.fromEntries(mods.map((m) => [`./${m}`, `./${m}?v=${v[m]}`])) });
html = html.replace(/<script type="importmap">[^<]*<\/script>\n?/, '');
// the map must come before anything that loads a module, so it sits ahead of the preload
set(/(<link rel="modulepreload" href="js\/app\.js)(?:\?v=\w+)?(">)/, `<script type="importmap">${map}</script>\n$1?v=${v['js/app.js']}$2`);
set(/(<link rel="stylesheet" href="css\/invite\.css)(?:\?v=\w+)?(">)/, `$1?v=${hash(path.join(DIR, 'css/invite.css'))}$2`);
set(/<script type="module" src="js\/app\.js(?:\?v=\w+)?"><\/script>/,
  `<script type="module" src="js/app.js?v=${v['js/app.js']}"></script>`);
fs.writeFileSync(ix, html);
console.log('  ✓ index.html meta →', `${SITE}/${slug}/`);
console.log('  ✓ cache stamps →', mods.length, 'scripts, stylesheet, gallery photos');
