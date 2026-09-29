# Invitivals

The studio site at [invitivals.com](https://invitivals.com) and every invitation it serves.
Astro, static output, no runtime framework.

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # build, then make sure no live link has broken
npm run deploy     # build, check, upload what changed
```

## The one rule

**An address that has been sent to a family keeps working, for ever.**
`tools/live-files.txt` lists every file that is live. `npm run check` fails, and
`npm run deploy` refuses to upload, if any of them is missing from the build.
After new invitations go live, add them to the list with `npm run links:update`.
The deploy never deletes anything on the server.

## Where things are

```
src/
  data/site.ts              everything the studio site says: plans, FAQs, WhatsApp number
  data/designs/*.json       one file per design in the gallery
  data/occasions.ts         the occasions designs are browsed by
  layouts/SiteLayout.astro  the studio site's shell, shared styles, SEO
  components/site/          gallery card, plans, sticky bar …
  pages/                    /, /invitations/…, /plans/, /about/, 404
  pages/{hindu,nikah,sikh,christian,modern,mountain,luxe}.astro
                            the earlier illustrated templates — live addresses, keep
  layouts/Layout.astro, components/*.astro, wedding.config.ts
                            the /luxe template (see docs/luxe-template/)

public/
  <family-folder>/          a family's invitation — LIVE, shared on WhatsApp
  showcase/<design>/        anonymised copies shown in the gallery (built by a tool)
  engagement/_engine, _themes   the shared engine and themes for generated invitations
  engagement/<slug>/        generated invitations — edit invites/<slug>.json instead
  brand/                    logo and seal
  .htaccess                 our own 404 page, no caching of pages

invites/                    one json per couple → tools/new-invite.mjs (see invites/README.md)
invites/src/                designer source packs — not committed, not deployed
tools/                      scripts, below
docs/                       older guides and the original design spec
```

## Tools

| command | what it does |
| --- | --- |
| `npm run invite <slug>` | build an invitation from `invites/<slug>.json` |
| `node tools/make-showcase.mjs` | rebuild the anonymised gallery samples from families' folders |
| `node tools/capture-preview.mjs <url> <name>` | take the gallery pictures of a sample |
| `node tools/make-og.mjs <slug>` | draw a link-preview banner |
| `npm run links` | check `dist/` against the list of live files |
| `npm run deploy` | build, check, upload (`--all` via `node tools/deploy.mjs --all`) |

## Adding a design to the gallery

1. Build its sample with fictional names (`tools/make-showcase.mjs`, or an `invites/*.json`).
2. `node tools/capture-preview.mjs <sample url> <name>`
3. Copy any file in `src/data/designs/` and change the details.

Never link the gallery to a family's own folder, and never show real photos of people.

## Deploying

Copy `.env.deploy.example` to `.env.deploy` and fill it in. The file is ignored by git —
connection details never belong in the repository.
