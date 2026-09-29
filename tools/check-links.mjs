/* ─────────────────────────────────────────────────────────────────────────
   The guard for links that families have already shared.

     node tools/check-links.mjs            check dist/ (run after a build)
     node tools/check-links.mjs --update   add dist's new files to the list

   1. Every file named in tools/live-files.txt must still be in dist/.
      The list only ever grows: once an address has been sent to a guest it
      must keep working, so nothing is removed from it by --update.
   2. Every link and picture on the marketing pages must lead somewhere.

   The deploy refuses to upload when this fails.
   ───────────────────────────────────────────────────────────────────────── */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const LIST = path.join(ROOT, 'tools/live-files.txt');

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/ is missing — run "npm run build" first.');
  process.exit(1);
}

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, out) : out.push(path.relative(DIST, p).split(path.sep).join('/'));
  }
  return out;
};
const built = walk(DIST);
const have = new Set(built);
const listed = fs.readFileSync(LIST, 'utf8').split(/\r?\n/).filter(Boolean);

if (process.argv.includes('--update')) {
  // hashed bundles change name with every build and are never linked by hand
  const next = [...new Set([...listed, ...built.filter((f) => !f.startsWith('_astro/'))])].sort();
  fs.writeFileSync(LIST, next.join('\n') + '\n');
  console.log(`live-files.txt: ${listed.length} → ${next.length} files`);
  process.exit(0);
}

let failed = false;

/* ── 1. nothing that is live has gone missing ── */
const missing = listed.filter((f) => !have.has(f));
if (missing.length) {
  failed = true;
  console.error(`\n✗ ${missing.length} live file(s) are missing from dist/ — these links would break:`);
  missing.slice(0, 40).forEach((f) => console.error('    /' + f));
  if (missing.length > 40) console.error(`    … and ${missing.length - 40} more`);
} else {
  console.log(`✓ all ${listed.length} live files are present`);
}

/* ── 2. the marketing pages link only to things that exist ── */
const resolves = (from, ref) => {
  let p = ref.split('#')[0].split('?')[0];
  if (!p) return true;
  try {
    p = decodeURIComponent(p);
  } catch {}
  const target = p.startsWith('/') ? p.slice(1) : path.posix.join(path.posix.dirname(from), p);
  return have.has(target) || have.has(path.posix.join(target, 'index.html')) || have.has(target.replace(/\/$/, '') + '/index.html');
};
// the studio's own pages; families' invitations are self-contained folders
const isSite = (f) => f === 'index.html' || f === '404.html' || /^(invitations|plans|about)\/.*\.html$/.test(f);
const broken = [];
for (const f of built.filter(isSite)) {
  const html = fs.readFileSync(path.join(DIST, f), 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const ref = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|data:|#|javascript:|\/\/)/.test(ref)) continue;
    if (!resolves(f, ref)) broken.push(`/${f}  →  ${ref}`);
  }
}
if (broken.length) {
  failed = true;
  console.error(`\n✗ ${broken.length} broken link(s) on the site's own pages:`);
  [...new Set(broken)].forEach((b) => console.error('    ' + b));
} else {
  console.log('✓ no broken links on the site’s own pages');
}

const fresh = built.filter((f) => !f.startsWith('_astro/') && !listed.includes(f));
if (fresh.length) console.log(`  ${fresh.length} new file(s) not yet on the list — "npm run links:update" after they go live`);

process.exit(failed ? 1 : 0);
