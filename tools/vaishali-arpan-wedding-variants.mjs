/* Vaishali & Arpan: the five other links, derived from the main bride-side invitation
   (public/vaishali-arpan-wedding, which this tool only reads):
     vaishali-arpan-wedding-engagement  bride side, the Engagement and the Wedding (19–20 Nov)
     vaishali-arpan-wedding-only        bride side, the Wedding alone (20 Nov)
     arpan-vaishali-wedding             groom side, all three days
     arpan-vaishali-wedding-engagement  groom side, 19–20 Nov
     arpan-vaishali-wedding-only        groom side, 20 Nov
   Each is a full copy of the main folder with its days trimmed in config.js, the programme cards centred
   for their number, the link preview's dates, and its own og.jpg (the main tool renders it with the dates,
   and the names' order, passed in). The groom side puts Arpan and his parents first wherever the couple
   and the families are named (hero, Save the Date, preview, calendar files); nothing else changes.
   Rerun after any change to the main folder: the copies are rebuilt from scratch.
     node --experimental-websocket tools/vaishali-arpan-wedding-variants.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAIN = 'vaishali-arpan-wedding';
const ALL = ['day1', 'day2', 'day3'];
const VARIANTS = [
  { slug: 'vaishali-arpan-wedding-engagement', keep: ['day2', 'day3'], dates: '19 – 20 November 2026' },
  { slug: 'vaishali-arpan-wedding-only', keep: ['day3'], dates: '20 November 2026' },
  { slug: 'arpan-vaishali-wedding', keep: ALL, dates: '18 – 20 November 2026', groom: true },
  { slug: 'arpan-vaishali-wedding-engagement', keep: ['day2', 'day3'], dates: '19 – 20 November 2026', groom: true },
  { slug: 'arpan-vaishali-wedding-only', keep: ['day3'], dates: '20 November 2026', groom: true },
];
const ICS = { day1: 'event-18nov.ics', day2: 'event-19nov.ics', day3: 'event.ics' };
/* the programme cards (the main page's three sit at 33.6 / 53.4 / 73.2 %, 16.8 % tall): fewer cards keep the
   same size and pitch, centred on the same band */
const CARDS = {
  2: `  'f-card-2a': { x: 12, y: 43.5, w: 76, h: 16.8 },\n  'f-card-2b': { x: 12, y: 63.3, w: 76, h: 16.8 },`,
  1: `  'f-card-1a': { x: 12, y: 53.4, w: 76, h: 16.8 },`,
};

/* the groom side's hero: his parents host (the bride side names his mother as "Wife of Late Sh. Suresh
   Singla", so he is named beside her), "our beloved son", Arpan first with the bride side's own line under
   him, then Vaishali as the daughter of her parents (who host the bride side). Every name as the client
   supplied it; nothing new is spelled here. */
const GROOM = {
  config: [
    ["couple: { bride: 'Vaishali', groom: 'Arpan' }", "couple: { bride: 'Vaishali', groom: 'Arpan', groomFirst: true }"],
    ["parents: 'Mrs. Vanita Gupta & Mr. Subhash Chand Gupta'", "parents: ['Smt. Neelam Singla &', 'Late Sh. Suresh Singla']"],
    ["'the wedding of our beloved daughter.'", "'the wedding of our beloved son.'"],
    ["brideOf: 'Granddaughter of Late Mrs. Resham Devi & Late Mr. Shiv Dayal Gupta'", "brideOf: ['Daughter of Mrs. Vanita Gupta &', 'Mr. Subhash Chand Gupta']"],
  ],
  app: [
    /* the first name slot carries the groom, the second the bride; each with its own line */
    ["live('h-bride', C.couple.bride,", "live('h-bride', C.couple.groom,"],
    ["live('h-bride-of', H.brideOf,", "live('h-bride-of', H.groomOf,"],
    ["live('h-groom', C.couple.groom,", "live('h-groom', C.couple.bride,"],
    ["live('h-groom-of', H.groomOf,", "live('h-groom-of', H.brideOf,"],
    ['`${C.couple.bride} & ${C.couple.groom}`', '`${C.couple.groom} & ${C.couple.bride}`'],
    ['/* ── 1 · the invitation, bride first ── */', '/* ── 1 · the invitation, groom first (the groom side) ── */'],
  ],
  calendar: [
    ['`Wedding of ${C.couple.bride} & ${C.couple.groom}`', '`Wedding of ${C.couple.groom} & ${C.couple.bride}`'],
    ['`${C.couple.bride} & ${C.couple.groom} · ${day.title}`', '`${C.couple.groom} & ${C.couple.bride} · ${day.title}`'],
  ],
  html: [
    ['Vaishali &amp; Arpan', 'Arpan &amp; Vaishali'],
    ['Mrs. Vanita Gupta &amp; Mr. Subhash Chand Gupta invite you to the wedding of their daughter Vaishali with Arpan', 'Smt. Neelam Singla &amp; Late Sh. Suresh Singla invite you to the wedding of their son Arpan with Vaishali'],
  ],
  ics: [['Vaishali & Arpan', 'Arpan & Vaishali']],
};

const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) throw new Error(`${file}: missing "${String(a).slice(0, 60)}"`);
    s = s.split(a).join(b);
  }
  fs.writeFileSync(file, s);
};

for (const v of VARIANTS) {
  const out = path.join(ROOT, 'public', v.slug);
  const which = v.keep.length === 3 ? 'all three days' : v.keep.length === 1 ? 'the wedding day only' : 'the Engagement and the Wedding';
  fs.rmSync(out, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 }); // the dev server may still hold a film open
  fs.cpSync(path.join(ROOT, 'public', MAIN), out, { recursive: true });
  for (const k of ALL) if (!v.keep.includes(k)) fs.rmSync(path.join(out, ICS[k]));
  if (!v.keep.includes('day1')) for (const c of ['blue', 'pink', 'peach', 'green']) fs.rmSync(path.join(out, 'assets', `pastel-${c}.webp`));

  /* config.js: only the kept days */
  const cfg = path.join(out, 'config.js');
  let s = fs.readFileSync(cfg, 'utf8');
  if (v.keep.length < 3) {
    const m = s.match(/(  days: \[\n)([\s\S]*?)(\n  \],\n)/);
    if (!m) throw new Error('days block not found');
    const days = m[2].split(/\n    \},\n    \{\n/).map((d, i, a) => (i ? '    {\n' : '') + d + (i < a.length - 1 ? '\n    },' : ''));
    const kept = days.filter((d) => v.keep.some((k) => d.includes(`key: '${k}'`)));
    if (kept.length !== v.keep.length) throw new Error('a day is missing');
    s = s.replace(m[0], m[1] + kept.join('\n') + m[3]);
    s = s.replace('/* page 3 → the three days (detail pages).', `/* page 3 → ${which} (this link's days; the main link has all three).`);
  }
  s = s.replace('Vaishali & Arpan: bride-side wedding invitation on the Brown Theme Wedding design.',
    `Vaishali & Arpan (${v.slug}): the ${v.groom ? 'groom' : 'bride'}-side invitation with ${which};\n   a copy of vaishali-arpan-wedding made by tools/vaishali-arpan-wedding-variants.mjs — edit the main folder and rerun it.`);
  fs.writeFileSync(cfg, s);

  /* app.js and layout.js: as many cards as days, the wedding found by its key */
  if (v.keep.length < 3) {
    edit(path.join(out, 'js/app.js'), [
      ['const [day1, day2, day3] = C.days;', "const day3 = C.days.find((d) => d.key === 'day3');"],
      [`  card('f-card-a', day1, 'I', 0.4),\n  card('f-card-b', day2, 'II', 0.6),\n  card('f-card-c', day3, 'III', 0.8),`,
        "  ...C.days.map((d, i) => card(`f-card-${C.days.length}${'abc'[i]}`, d, ['I', 'II', 'III'][i], 0.4 + 0.2 * i)),"],
      ['Scroll order: 1 the invitation, 2 the date, 3 the programme (three days),', `Scroll order: 1 the invitation, 2 the date, 3 the programme (${v.keep.length === 1 ? 'the wedding' : 'two days'}),`],
    ]);
    edit(path.join(out, 'js/layout.js'), [
      [`  'f-card-a': { x: 12, y: 33.6, w: 76, h: 16.8 },\n  'f-card-b': { x: 12, y: 53.4, w: 76, h: 16.8 },\n  'f-card-c': { x: 12, y: 73.2, w: 76, h: 16.8 },`, CARDS[v.keep.length]],
      ['/* page 3: the programme, three cards under', `/* page 3: the programme, ${v.keep.length === 1 ? 'one card' : 'two cards'} under`],
    ]);
  }

  /* index.html: this link's address and dates */
  edit(path.join(out, 'index.html'), [
    [`https://invitivals.com/${MAIN}/`, `https://invitivals.com/${v.slug}/`],
    ['18 – 20 November 2026', v.dates],
  ]);
  const ics = fs.readdirSync(out).filter((n) => n.endsWith('.ics')).map((n) => path.join(out, n));
  for (const f of ics) edit(f, [[`URL:https://invitivals.com/${MAIN}/`, `URL:https://invitivals.com/${v.slug}/`]]);

  /* the groom side: his family and his name first */
  if (v.groom) {
    edit(cfg, GROOM.config);
    edit(path.join(out, 'js/app.js'), GROOM.app);
    edit(path.join(out, 'js/calendar.js'), GROOM.calendar);
    edit(path.join(out, 'index.html'), GROOM.html);
    for (const f of ics) edit(f, GROOM.ics);
  }

  /* og.jpg with this link's dates (and names' order), by the main tool */
  const r = spawnSync(process.execPath, ['--experimental-websocket', path.join(ROOT, 'tools/vaishali-arpan-wedding.mjs'), 'og', v.slug, v.dates.toUpperCase(), ...(v.groom ? ['groom'] : [])], { stdio: 'inherit' });
  if (r.status) throw new Error('og.jpg failed');
  console.log(`✓ ${v.slug}: ${v.groom ? 'groom side' : 'bride side'}, ${v.keep.join(' + ')}`);
}
