# Wedding Luxe — 10-Minute Setup

Everything you personalise lives in **one file**: `src/wedding.config.ts`.
You never need to touch a component, a stylesheet, or this framework.

## 0. Prerequisites (2 min)

- [Node.js](https://nodejs.org) 20 or newer
- Run once inside the project folder:

```bash
npm install
```

## 1. Edit the config (5 min)

Open `src/wedding.config.ts` and replace the demo content, top to bottom:

| What | Where |
| --- | --- |
| Names, initials, bios | `bride`, `groom` |
| The date | `datetime`, `datetimeEnd`, `timezone` (drives the hero, countdown, calendar link, SEO — one edit updates everything) |
| Quote on the envelope | `quote` |
| Story milestones | `story.milestones` |
| Day-of schedule | `dayTimeline.items` |
| Weekend events | `events.items` (set `highlight: true` on the main day) |
| Family & wedding party | `family.members` |
| Venue, address, map pin | `venue` (coords power the embedded map) |
| Hotels + room-block code | `hotels` |
| Dress code + swatches | `dressCode` |
| Menu | `menu` |
| Film link | `film.video` — YouTube, Vimeo, or a direct `.mp4` |
| Demo wishes | `wishes.entries` |
| RSVP deadline | `rsvp.deadline` |
| Phone / WhatsApp | `contact` |
| Hashtag | `hashtag` |
| Colorway | `palette: 'ivory-gold' \| 'sage' \| 'midnight'` (see THEMING.md) |
| Hide a section | `sections.<name>: false` |

Also set `site.url` to your final address — it powers the share preview and SEO tags.

## 2. Drop your photos (2 min)

Put your photos in `public/photos/` and point the config paths at them, e.g.:

```
public/photos/hero.jpg        → heroPhoto: '/photos/hero.jpg'
public/photos/bride.jpg       → bride.photo: '/photos/bride.jpg'
public/photos/og.jpg          → picked up automatically as the WhatsApp/social preview (1200×630)
```

You need: hero, bride, groom, story (wide), venue, 2 hotels, 4 family, 6 gallery, film poster.
If a referenced photo doesn't exist yet, the site shows an elegant labeled
drop-slot in its place — nothing breaks. The `/photos/demo/` art is safe to delete
once your photos are in.

**Music:** the default is a soft generative ambient score (no file needed).
To use your own track, set `music.mode: 'file'` and drop an MP3 at `public/audio/ambient.mp3`.

## 3. Preview

```bash
npm run dev
```

Open http://localhost:4321 on your phone too (same Wi-Fi: `npm run dev -- --host`).

## 4. Collect RSVPs in a Google Sheet (optional, 3 min)

1. Create a Google Sheet → **Extensions → Apps Script** → paste:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    e.parameter.form === 'wish' ? 'Wishes' : 'RSVPs'
  ) || SpreadsheetApp.getActiveSpreadsheet().insertSheet(
    e.parameter.form === 'wish' ? 'Wishes' : 'RSVPs'
  );
  sheet.appendRow([
    new Date(),
    e.parameter.name || '',
    e.parameter.contact || '',
    e.parameter.attending || '',
    e.parameter.guests || '',
    e.parameter.notes || e.parameter.message || '',
  ]);
  return ContentService.createTextOutput('ok');
}
```

2. **Deploy → New deployment → Web app** — execute as *Me*, access: *Anyone*.
3. Copy the web-app URL into the config:

```ts
rsvp: { endpoint: 'https://script.google.com/macros/s/…/exec', endpointType: 'apps-script', … },
guestbookEndpoint: 'https://script.google.com/macros/s/…/exec',
```

Any JSON webhook (Zapier, Make, your own API) also works: set `endpointType: 'webhook'`.
With no endpoint configured the form still shows the thank-you state — nothing breaks.

## 5. Personalized invitations (optional, 0 min)

Add `?to=Guest+Name` to any link you send and the envelope addresses that guest
by name — *"Especially for The Okafors"* — and their RSVP name field arrives
pre-filled:

```
https://your-site.com/?to=The+Okafors
https://your-site.com/?to=Uncle+John
```

No setup needed; it works on every deployed link. Great for WhatsApp: paste the
same site once per chat with each family's name in the link.

## 6. Deploy (1 min)

```bash
npm run build
```

The static site lands in `dist/` — host it anywhere:

- **Netlify:** drag the `dist` folder onto https://app.netlify.com/drop
- **Vercel:** `npx vercel` (build command `npm run build`, output `dist`)
- **GitHub Pages / any static host:** upload `dist/`

Then send your link on WhatsApp. Done. 🥂
