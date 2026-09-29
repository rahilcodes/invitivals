# Wedding Luxe — Theming

The entire template is driven by **exactly eight CSS variables**. A palette is
eight values — nothing else. That's the whole theming system.

| Variable | Role |
| --- | --- |
| `--bg` | main light surface |
| `--bg2` | tinted secondary surface (cards, bands, inputs) |
| `--ink` | primary text |
| `--mut` | muted text |
| `--gold` | the metallic accent (overlines, rules, CTAs) |
| `--goldSoft` | hairline borders / soft accent |
| `--dark` | the dark interlude surface (countdown, wishes, footer) |
| `--darkInk` | text on dark surfaces |

## Switching palettes

In `src/wedding.config.ts`:

```ts
palette: 'ivory-gold', // or 'sage' | 'midnight'
```

Shipped colorways:

| | bg | bg2 | ink | mut | gold | goldSoft | dark | darkInk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Ivory & Gold** | `#faf8f2` | `#f2ede1` | `#2c2a24` | `#77715f` | `#a5843e` | `#e6dcc2` | `#22211c` | `#efe9da` |
| **Sage** | `#f7f8f3` | `#eaefe2` | `#272c23` | `#6f7765` | `#6f815a` | `#d9e1cc` | `#242920` | `#edf0e6` |
| **Midnight** (full dark) | `#15171c` | `#1d2027` | `#ebe8e0` | `#98958b` | `#bb9c57` | `#3b3524` | `#0e1014` | `#ebe8e0` |

## Adding your own palette (2 ways)

### A. One-off custom palette — config only, no CSS

```ts
customPalette: {
  bg: '#faf6f4', bg2: '#f3e9e4', ink: '#33261f', mut: '#8a7266',
  gold: '#b0725a', goldSoft: '#e9d5c9', dark: '#2a1d17', darkInk: '#f2e7df',
},
```

`customPalette` overrides `palette` and is applied as inline variables on `<html>`.

### B. A named, reusable palette

1. Add a block to `src/styles/global.css`:

```css
html[data-palette='rose'] {
  --bg: #faf6f4;  --bg2: #f3e9e4;  --ink: #33261f;  --mut: #8a7266;
  --gold: #b0725a; --goldSoft: #e9d5c9; --dark: #2a1d17; --darkInk: #f2e7df;
}
```

2. Widen the type + set it in `src/wedding.config.ts`:

```ts
export type PaletteName = 'ivory-gold' | 'sage' | 'midnight' | 'rose';
…
palette: 'rose',
```

## Rules for a palette that "works"

The design intent, so new colorways stay premium:

1. **One light surface, one tinted surface, one metallic accent, one dark interlude.**
   `bg` and `bg2` should be siblings (bg2 slightly deeper/warmer), never contrasting.
2. `--gold` doesn't have to be gold — it's the *jewellery* of the page.
   Muted, desaturated metallics and earth tones read luxury; neon reads costume.
3. `--goldSoft` is `--gold` heavily diluted toward `--bg` — hairlines should whisper.
4. **Contrast (WCAG AA):** `ink` on `bg`/`bg2` ≥ 7:1, `mut` on `bg` ≥ 4.5:1,
   `darkInk` on `dark` ≥ 7:1, and `gold` on `bg` ≥ 3:1 (it's used for 10–11px
   uppercase labels — verify at https://webaim.org/resources/contrastchecker/).
5. For a dark colorway (like Midnight), keep `dark` *darker* than `bg` so the
   countdown/wishes interlude still lands as an inversion beat.
6. Petals, swatch rings, shadows, glass and focus states all derive from the
   eight variables automatically — nothing else to update.

## Fonts

Cormorant Garamond (display) and Jost (body) are self-hosted via Fontsource and
imported in `src/layouts/Layout.astro`. Swapping families is possible but they
are part of the design's identity — change with care.
