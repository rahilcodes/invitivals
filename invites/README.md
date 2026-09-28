# Invitations

One engine, a theme per design, one small data file per couple.

```
invites/<slug>.json                      the couple's details — the ONLY thing you write
public/engagement/_engine/v1/            engine.js, engine.css, fonts   (shared by every invitation)
public/engagement/_themes/<theme>/       theme.js + art/ + audio/        (shared by every invitation of that design)
public/engagement/<slug>/                index.html, invite.js, event.ics (generated — do not edit)
```

| theme | design | entrance | sample |
| --- | --- | --- | --- |
| `floral-palace` | engagement, painted palace plates | a door | `invites/demo.json` |
| `rose-red` | wedding / nikah, burgundy, blush and gold | a sealed envelope | `invites/rose-red-demo.json` |

## New couple

1. Copy the theme's sample (`invites/demo.json` or `invites/rose-red-demo.json`) to `invites/<slug>.json` and change the details.
2. `node tools/new-invite.mjs <slug>`
3. Open `http://localhost:4321/engagement/<slug>/index.html`

To give an invitation its own address, add `"out": "ayesha-imran"` (or `"nikah/ayesha-imran"`): it is then
built into `public/ayesha-imran/` and its link is `invitivals.com/ayesha-imran/`. Remove `"out"` from a copy
of the sample, or change it — two invitations must not share a folder.

The build stops with a message if something is wrong: a missing field, a weekday that does not
match the date, an end time before the start, an unknown theme.

Names, hosts, date, times, venue, address and the map label are live text set over the artwork,
so nothing has to be repainted. A line that is too long for its place is shrunk to fit.

## Fields

| field | what it is |
| --- | --- |
| `couple.first` / `couple.second` | the two names, as they should appear |
| `couple.short` | used in the page title and link preview, e.g. `Ananya & Karthik` |
| `hosts.title` / `hosts.names` / `hosts.message` | the welcome panel; `message` is a list of lines |
| `event.start` / `event.end` | ISO time **with offset**, e.g. `2026-11-15T10:30:00+05:30` (drives the calendar) |
| `event.day` / `event.dateText` / `event.time` / `event.extra` | what is printed on the date card |
| `venue.name` / `venue.address` | lists of lines |
| `venue.area` / `venue.areaLocal` | the label on the map, in English and in the local script (optional) |
| `venue.mapsUrl` or `venue.mapsQuery` | optional; otherwise the venue name + address is searched |
| `closing.from` | the last panel, e.g. `Family & Friends` |
| `audio` | optional: the couple's own track (path inside their folder) |
| `og` | optional: the couple's own link-preview image (1200×630, inside their folder) — draw it with `node tools/make-og.mjs <slug>` |
| `share.title` / `share.description` | optional: the wording under the link preview (default: occasion — names, then the invitation line with the date) |
| `share.emblem` | optional: a picture of theirs set above the wording of the link preview |
| `overlays` | optional: the couple's own pieces laid over a section, e.g. a Ganesha — see below |
| `art` | optional: the couple's own plates — see below |

## A couple with their own lettering

If a client has approved custom lettering (as Nandini & Madhu did), put their plates in
`public/engagement/<slug>/art/` and list them under `art`, naming the wording that is already
painted so it is not drawn twice:

```json
"art": { "couple": { "full": "art/couple-full.webp", "baked": ["couple.first", "couple.second"] } }
```

To change one line of approved lettering later, paint it out of their plate and leave it out of
`baked`, so it becomes live text. Nandini & Madhu's plates are built by `tools/nandini-madhu-art.mjs`.

## A piece of their own over a section

```json
"overlays": { "ceremony": [{ "img": "art/ganesha.webp", "x": 282, "y": 390, "w": 172, "cls": "rise halo", "alt": "Lord Ganesha" }] }
```

`x`, `y`, `w` are in the section plate's pixels. `rise` brings it in with the wording, `halo` puts a soft glow behind it.

## The link preview (WhatsApp banner)

`node tools/make-og.mjs <slug>` draws `og.jpg`: the occasion, the names and the date inside the theme's arch.
Set `"og": "og.jpg"` and rebuild. WhatsApp keeps an old preview for a link it has already seen —
after a change, test by sending the link with `?v=2` on the end.

## Rose Red

Same fields as above, plus:

| field | what it is |
| --- | --- |
| `blessing` | optional: a line above the occasion, e.g. `بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ` (leave it out for none) |
| `hide` | optional: pieces to leave out. `["figures"]` removes the illustrated couple from the first page |
| `closing.message` / `closing.label` | optional: the thank-you lines and the words above the family name (default: "With love") |
| `ui.venueTitle` / `ui.thanksTitle` | optional: the two script headings (default: "The Venue", "Thank You") |
| `ui.invited` / `ui.enter` | optional: the wording on the envelope's card and under the envelope |

`event.extra` is not printed in this theme; put a second timing in `event.time`, e.g. `["7:00 PM", "· Dinner 8:30 PM"]`.
Without `venue.area` the map is shown without a place name.

The designer delivers loose elements, not finished pages. `node tools/build-rose-red-art.mjs` lays them out
into one plate per section (that file decides where each flower sits; `theme.js` decides where the wording sits).
The source packs are in `invites/src/rose-red/` — kept out of git and out of `public/`, so they are never uploaded.

## After changing the engine or the theme

`node tools/new-invite.mjs --all` re-stamps every invitation so guests get the new files, not cached ones.
Breaking changes to the engine go in a new folder (`_engine/v2`) so invitations already sent keep working.

## Rebuilding the theme art

`node tools/build-theme-art.mjs [folder of source PNGs]` — converts the designer's PNGs to WebP,
paints the personal wording out of the shared plates and cuts the envelope. Source PNGs are never modified.

## Debug switches

`?nodoor` skip the entrance · `?slow` 6× slower choreography · `?hold` freeze the open door · `?eager` load all art at once
