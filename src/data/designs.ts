/* ─────────────────────────────────────────────────────────────────────────
   Every design in the gallery — one json file each, in src/data/designs/.

   To add a design:
     1. build its anonymised sample (tools/make-showcase.mjs, or an
        invites/<slug>.json with fictional names)
     2. node tools/capture-preview.mjs <sample url> <name>
     3. copy any file in src/data/designs/, change the details

   The pages, the occasion filters, the sitemap and the footer all follow.
   ───────────────────────────────────────────────────────────────────────── */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { OCCASIONS, type Occasion } from './occasions';
import { wa } from './site';

export interface Design {
  id: string;
  /** the design's own name, e.g. "The Wax Seal" */
  title: string;
  /** occasion slugs; the first is the design's home in the gallery */
  occasions: string[];
  /** lower comes first; new designs without one go last */
  order?: number;
  /** fictional names and date, as written into the sample */
  names: string;
  date: string;
  /** the live, anonymised sample */
  href: string;
  door: string;
  open: string;
  /** 1200×630 picture for link previews */
  share?: string;
  bg: string;
  palette: string[];
  languages?: string[];
  intro: string;
  events: { name: string; when: string }[];
  included: string[];
}

/* Pictures are kept by browsers and by the host for a week. Each address
   therefore carries a mark of the file's contents, so a re-captured picture
   is fetched afresh by everyone while the file keeps its name. */
const marks = new Map<string, string>();
export const stamp = (src: string) => {
  if (!marks.has(src)) {
    let v = '';
    try {
      v = '?v=' + createHash('md5').update(fs.readFileSync('public' + src)).digest('hex').slice(0, 8);
    } catch {}
    marks.set(src, src + v);
  }
  return marks.get(src)!;
};

const files = import.meta.glob<Design>('./designs/*.json', { eager: true, import: 'default' });
const known = new Set(OCCASIONS.map((o) => o.slug));

export const DESIGNS: Design[] = Object.entries(files)
  .map(([file, d]) => {
    const bad = d.occasions.filter((s) => !known.has(s));
    if (!d.occasions.length || bad.length)
      throw new Error(`${file}: unknown occasion "${bad.join(', ')}" — add it to src/data/occasions.ts`);
    return { ...d, door: stamp(d.door), open: stamp(d.open) };
  })
  .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999) || a.title.localeCompare(b.title));

export const occasionOf = (slug: string) => OCCASIONS.find((o) => o.slug === slug) as Occasion;
export const primary = (d: Design) => occasionOf(d.occasions[0]);
export const designsFor = (slug: string) => DESIGNS.filter((d) => d.occasions.includes(slug));

/** occasions that have something to show, in catalogue order */
export const LIVE_OCCASIONS = OCCASIONS.filter((o) => designsFor(o.slug).length > 0);
export const GROUPS = (['Weddings', 'Before the wedding', 'Family and home'] as const)
  .map((name) => ({ name, occasions: LIVE_OCCASIONS.filter((o) => o.group === name) }))
  .filter((g) => g.occasions.length);

// every internal link ends in a slash, the way the pages are served
export const occasionUrl = (o: Occasion | string) => `/invitations/${typeof o === 'string' ? o : o.slug}/`;
export const designUrl = (d: Design) => `/invitations/${d.occasions[0]}/${d.id}/`;
export const byId = (id: string) => DESIGNS.find((d) => d.id === id);

export const designWa = (d: Design) =>
  wa(`Hello Invitivals, we saw “${d.title}”, the ${primary(d).name} invitation on your site, and would like one like it for our family.`);
