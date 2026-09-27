import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { DESIGNS, LIVE_OCCASIONS, designUrl, occasionUrl } from '../data/designs';

// Marketing pages, every occasion and every design. The sample invitations and
// families' own invitations are deliberately left out.
export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);
  const pages = [
    { path: '/', priority: '1.0' },
    { path: '/invitations/', priority: '0.9' },
    ...LIVE_OCCASIONS.map((o) => ({ path: occasionUrl(o), priority: '0.8' })),
    ...DESIGNS.map((d) => ({ path: designUrl(d), priority: '0.7', image: d.open, title: d.title })),
    { path: '/plans/', priority: '0.6' },
    { path: '/about/', priority: '0.5' },
  ] as { path: string; priority: string; image?: string; title?: string }[];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.priority}</priority>${p.image ? `\n    <image:image><image:loc>${SITE}${p.image}</image:loc></image:image>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
