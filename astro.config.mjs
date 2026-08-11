import { defineConfig } from 'astro/config';

// Static output, zero runtime framework. The canonical site URL lives in
// src/wedding.config.ts (site.url) — buyers never need to touch this file.
export default defineConfig({
  output: 'static',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
});
