/* Builds an invitation from its data file. A new couple is ONE json file — no artwork, no code.
 *
 *   node tools/new-invite.mjs <slug>        build public/engagement/<slug>/ from invites/<slug>.json
 *   node tools/new-invite.mjs --all         rebuild every invitation in invites/
 *
 * Writes index.html, invite.js and event.ics. The folder's own art/ and og.jpg (if any) are left alone.
 * The engine and the theme art are shared by every invitation (public/engagement/_engine, _themes).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://invitivals.com';
const ENGINE = 'v1';
const BASE = path.join(ROOT, 'public/engagement');

const lines = (v) => (v == null || v === '' ? [] : Array.isArray(v) ? v : [String(v)]);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const icsText = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (l) => { const out = []; let s = l; while (Buffer.byteLength(s) > 74) { let n = 74; while (Buffer.byteLength(s.slice(0, n)) > 74) n--; out.push(s.slice(0, n)); s = ' ' + s.slice(n); } out.push(s); return out.join('\r\n'); };
const utc = (iso) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');

function check(I, file) {
  const need = ['slug', 'theme', 'eventType', 'couple.first', 'couple.second', 'couple.short', 'event.start', 'event.end', 'event.day', 'event.dateText', 'event.time', 'venue.name', 'venue.address'];
  const miss = need.filter((k) => { const v = k.split('.').reduce((o, p) => (o == null ? o : o[p]), I); return v == null || v === '' || (Array.isArray(v) && !v.length); });
  if (miss.length) throw new Error(`${file}: missing ${miss.join(', ')}`);
  if (!/^[a-z0-9-]+$/.test(I.slug)) throw new Error(`${file}: slug must be lowercase letters, digits and hyphens`);
  for (const k of ['start', 'end']) {
    if (!/[+-]\d\d:\d\d$|Z$/.test(I.event[k]) || isNaN(new Date(I.event[k]))) throw new Error(`${file}: event.${k} must be an ISO time with its offset, e.g. 2026-11-15T10:30:00+05:30`);
  }
  if (new Date(I.event.end) <= new Date(I.event.start)) throw new Error(`${file}: event.end is not after event.start`);
  const said = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: I.event.timezone || 'Asia/Kolkata' }).format(new Date(I.event.start));
  if (said.toLowerCase() !== String(I.event.day).toLowerCase()) throw new Error(`${file}: event.day says "${I.event.day}" but ${I.event.start} is a ${said}`);
  if (!fs.existsSync(path.join(BASE, '_themes', I.theme, 'theme.js'))) throw new Error(`${file}: unknown theme "${I.theme}"`);
  for (const o of Object.values(I.overlays || {}).flat()) if (!o.img || !fs.existsSync(path.join(BASE, I.slug, o.img))) throw new Error(`${file}: overlays → ${o.img} does not exist in public/engagement/${I.slug}/`);
  if (I.og && !fs.existsSync(path.join(BASE, I.slug, I.og))) throw new Error(`${file}: og → ${I.og} does not exist in public/engagement/${I.slug}/ (node tools/make-og.mjs ${I.slug})`);
  for (const [id, a] of Object.entries(I.art || {})) if (a.full && !fs.existsSync(path.join(BASE, I.slug, a.full))) throw new Error(`${file}: art.${id}.full → ${a.full} does not exist in public/engagement/${I.slug}/`);
}

function build(slug) {
  const file = path.join(ROOT, 'invites', slug + '.json');
  const I = JSON.parse(fs.readFileSync(file, 'utf8'));
  check(I, path.relative(ROOT, file));
  const out = path.join(BASE, I.slug); fs.mkdirSync(out, { recursive: true });

  const venueName = lines(I.venue.name).join(' '), address = lines(I.venue.address).join(' ');
  const when = `${I.event.day}, ${I.event.dateText} · ${lines(I.event.time).join(' ')}`;
  const extra = lines(I.event.extra).join(' ');
  /* what a shared link shows (WhatsApp, iMessage): the occasion and the names, then the invitation line with the date */
  const share = I.share || {};
  const title = share.title || `${I.eventType} — ${I.couple.first} & ${I.couple.second}`;
  const desc = share.description || `We cordially invite you to the ${I.eventType} of ${I.couple.first} & ${I.couple.second} — ${I.event.day}, ${I.event.dateText}.`;
  const mapsUrl = I.venue.mapsUrl || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(I.venue.mapsQuery || [venueName, address].join(', '));
  I.event.title = I.event.title || `${I.couple.first} & ${I.couple.second} ${I.eventType.replace(/ Ceremony$/, '')}`;
  I.event.details = I.event.details || [I.eventType, `${I.event.day}, ${I.event.dateText}`, lines(I.event.time).join(' '), extra].filter(Boolean).join(' · ');

  /* one version stamp for everything the page loads: changes whenever the data, the engine or the theme changes */
  const hash = crypto.createHash('sha1').update(JSON.stringify(I));
  for (const f of [`_engine/${ENGINE}/engine.js`, `_engine/${ENGINE}/engine.css`, `_themes/${I.theme}/theme.js`]) hash.update(fs.readFileSync(path.join(BASE, f)));
  const artDir = path.join(BASE, '_themes', I.theme, 'art');
  for (const f of fs.readdirSync(artDir).sort()) hash.update(f + fs.statSync(path.join(artDir, f)).size);
  const ownDir = path.join(out, 'art');                    // the couple's own plates
  if (fs.existsSync(ownDir)) for (const f of fs.readdirSync(ownDir).sort()) hash.update(f + fs.statSync(path.join(ownDir, f)).size);
  const v = hash.digest('hex').slice(0, 8);

  const { _art, ...data } = I; data.v = v;
  fs.writeFileSync(path.join(out, 'invite.js'), `/* generated from invites/${slug}.json by tools/new-invite.mjs — edit the json, not this file */\nwindow.INVITE = ${JSON.stringify(data, null, 2)};\n`);

  const tz = I.event.timezone || 'Asia/Kolkata';
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitivals//Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    `UID:${I.slug}-${utc(I.event.start)}@invitivals.com`, `DTSTAMP:${utc(new Date().toISOString())}`,
    `DTSTART:${utc(I.event.start)}`, `DTEND:${utc(I.event.end)}`,
    `SUMMARY:${icsText(I.event.title)}`, `DESCRIPTION:${icsText(I.event.details.replace(/ · /g, '\n'))}`,
    `LOCATION:${icsText([venueName, address].join(', '))}`, `URL:${mapsUrl}`, `X-TIMEZONE-HINT:${tz}`, 'STATUS:CONFIRMED',
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(I.event.title)} tomorrow`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'];
  fs.writeFileSync(path.join(out, 'event.ics'), ics.map(fold).join('\r\n') + '\r\n');

  const url = `${SITE}/engagement/${I.slug}/`;
  const og = I.og ? url + I.og + '?v=' + v : `${SITE}/engagement/_themes/${I.theme}/${'art/og.jpg'}`;
  const T = `../_themes/${I.theme}`, E = `../_engine/${ENGINE}`;
  const html = `<!DOCTYPE html>
<!-- generated from invites/${slug}.json by tools/new-invite.mjs — edit the json, not this file -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#f3dcc8">
<meta name="robots" content="noindex, nofollow">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Invitivals">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="${esc(title)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%238d1a3c' d='M12 21s-7.5-4.6-9.6-9.3C.9 8.4 3 5 6.4 5c2 0 3.4 1 4.3 2.4h2.6C14.2 6 15.6 5 17.6 5 21 5 23.1 8.4 21.6 11.7 19.5 16.4 12 21 12 21z'/%3E%3C/svg%3E">
<link rel="preload" as="image" href="${T}/art/door.webp?v=${v}">
<link rel="preload" as="image" href="${T}/art/door-leaf-l.webp?v=${v}">
<link rel="preload" as="image" href="${T}/art/door-leaf-r.webp?v=${v}">
<link rel="preload" as="font" type="font/woff2" href="${E}/fonts/marcellus-latin-400-normal.woff2" crossorigin>
<link rel="stylesheet" href="${E}/engine.css?v=${v}">
</head>
<body>

<!-- the invitation in plain words: shown if scripts are blocked or fail, replaced by the artwork otherwise -->
<section id="plain" class="plain">
  <p class="k">${esc(I.eventType)}</p>
  <h1>${esc(I.couple.first)} &amp; ${esc(I.couple.second)}</h1>
${I.hosts ? `  <p>${esc([I.hosts.title, I.hosts.names].filter(Boolean).join(' '))}<br>${esc(lines(I.hosts.message).join(' '))}</p>\n` : ''}  <p><strong>${esc(I.event.day)}, ${esc(I.event.dateText)}</strong><br>${esc(lines(I.event.time).join(' '))}${extra ? ' · ' + esc(extra) : ''}</p>
  <p><strong>${esc(venueName)}</strong><br>${esc(address)}</p>
  <p><a href="${esc(mapsUrl)}" target="_blank" rel="noopener">Open in Google Maps</a> <a href="event.ics?v=${v}">Save the Date</a></p>
</section>

<main id="invite" class="invite"><div class="world" id="world"></div></main>
<div class="ambient" aria-hidden="true"></div>
<div id="toast" class="toast" role="status" aria-live="polite"></div>
<div id="live" class="sr" aria-live="polite"></div>
<button id="mute" class="mute" type="button" aria-label="Turn music off" aria-pressed="false" hidden>
  <svg class="on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path class="w" d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12"/></svg>
  <svg class="off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path class="w" d="M16 9l5 6M21 9l-5 6"/></svg>
</button>

<script src="invite.js?v=${v}"></script>
<script src="${T}/theme.js?v=${v}"></script>
<script src="${E}/engine.js?v=${v}"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(out, 'index.html'), html);
  console.log(`✓ ${I.slug}  v=${v}  →  public/engagement/${I.slug}/   (${url})`);
}

const arg = process.argv[2];
if (!arg) { console.error('usage: node tools/new-invite.mjs <slug> | --all'); process.exit(1); }
const slugs = arg === '--all' ? fs.readdirSync(path.join(ROOT, 'invites')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)) : [arg];
let bad = false;
for (const s of slugs) { try { build(s); } catch (e) { bad = true; console.error('✗ ' + e.message); } }
if (bad) process.exit(1);
