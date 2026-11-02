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

## Sai Charan & Lakshmi — Engagement (`public/saicharan-lakshmi-engagement/`)

A six-page scrolling engagement invitation built from the designer's "engagement AG" pack (cream, blush and gold
embroidery): a sealed envelope that opens with one tap into a short film and the music, then the couple, the
November calendar with Reveal the Date, the pavilion, the ring ceremony and venue, the photographs, and With Love.

- `config.js` — the event (date, time, `durationMinutes`, venue, the exact Google Maps link); the words are in `index.html`
- `js/app.js` — the tap-to-open, scroll-in animations, Reveal the Date, Save the Date (.ics + Google Calendar), music, petals
- `css/invite.css` — the pages at the paintings' own proportion; every piece sits at percentages of its painting
- `assets/bg/`, `assets/el/` — the paintings and the separated pieces as WebP, built by
  `node tools/build-saicharan-lakshmi-art.mjs` from `invites/src/saicharan-lakshmi-engagement/` (the zip, not committed);
  pieces that came on a baked white or checkerboard background are keyed there
- `assets/media/` — the opening film (muted, 10 s) and the music; `assets/og.jpg` by `node tools/saicharan-lakshmi-og.mjs`
- `?open` skips the envelope while working on the page; in `astro dev` open `…/index.html` (the folder URL only works on the built site)

## Rose Red Engagement (`public/rose-red-engagement/`)

A layered engagement template built from the designer's separated element packs (burgundy, blush and gold:
sealed envelope, the couple on the lake terrace, Save Our Date with the swans, the venue, thank you).
Unlike the engine themes, every flower, drape, lantern and petal is its own piece set on a 900-px stage, so the
pages move: petals fall, lanterns swing and glow, drapes drift, the date hides under a gold cover the guest rubs away.

- `config.js` — the only file a new couple changes (names, hosts, date, venue, music, share text)
- `js/app.js` — lays the pieces out and runs the page; `css/invite.css` — the stage, type and motion
- `assets/el/` — the pieces as WebP, built by `node tools/build-rose-red-engagement-art.mjs` from
  `invites/src/rose-red-engagement/` (the client's zip, not committed) with a `manifest.json` of sizes
- `assets/og.jpg` — the WhatsApp banner, photographed from `og.html` by
  `node --experimental-websocket tools/rose-red-engagement-og.mjs <dev url of og.html>`
- `event.ics` — the calendar file behind "Add to calendar" (update it with the couple's date)
- `?to=Name` personalises the envelope card and the thank-you page; `?open` skips the envelope while working

## Bengali Wedding (`public/bengali-wedding/`)

An Invitivals design demo (not a client's invitation). Its nine pages are the designer's finished references,
`invites/src/bengali-wedding/with text temp/1.png … 9.png`, used as drawn: the references are the specification.
A tap plays the sealed-envelope film with sound (fullscreen where the browser allows it), then: hero, scratch-to-reveal
date, functions menu, গায়ে হলুদ, লক্ষ্মী পূজা, সঙ্গীত সন্ধ্যা, বিবাহ, ভোজন, moments & thanks; after them a venues list and RSVP.

- `assets/bg/r1…r9.webp` — built by `node tools/build-bengali-wedding-ref.mjs`, which also corrects six slips in the
  references' Bengali with the references' own letters (listed at the top of the tool)
- page 2: the cover the guest rubs away is the page's own gold; beneath it lies the scratch-off reference's date
- the painted buttons and menu rows carry invisible real controls (`.hit`, boxes in % of the 941×1672 page); the words are
  repeated for screen readers from `config.js`, which also feeds maps, calendar (.ics + Google, Asia/Dhaka) and the venues list
- `tools/build-bengali-wedding-art.mjs` builds the older pieces still used by the venues section and the banner;
  `assets/og.jpg` by `node tools/bengali-wedding-og.mjs`
- `?open` skips the envelope while working on the page; in `astro dev` open `…/index.html`
