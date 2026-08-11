# Handoff: Wedding Luxe V1 — Premium Digital Wedding Invitation Template

## Overview
A luxury, mobile-first, single-page digital wedding invitation designed to be sold as a template. Guests arrive via WhatsApp on mobile; the site opens with an envelope-style intro, unlocks ambient music on tap, and scrolls through a 19-section emotional arc ending at the RSVP.

## About the design files
The `.dc.html` files in this folder are **HTML design references** (working prototypes), not production code. The task is to **recreate them in a real stack** (see `CLAUDE-CODE-PROMPT.md` for a ready-to-paste Claude Code prompt with the recommended stack and deliverables).

## Fidelity
**High-fidelity.** Colors, type scale, spacing, copy voice, animation timings, and interactions are final. Recreate pixel-perfectly.

## Files
- `Wedding Invitation.dc.html` — the full prototype (open in a browser; `support.js` + `image-slot.js` must sit beside it)
- `Design Spec.dc.html` — visual spec document (journey, IA, tokens, palettes, components, animations, critique)
- `CLAUDE-CODE-PROMPT.md` — the implementation prompt for Claude Code
- `image-slot.js`, `support.js` — prototype runtime helpers (reference only; don't ship)

## Design tokens
Fonts: Cormorant Garamond (display 300–600 + italic) + Jost (body/labels 300–500).
Type scale (clamp mobile→desktop): names 52→110px, H2 34→52px, H3 20–26px, body 14–15px/1.7–1.8, overline 10–11px uppercase ls .24–.34em.
Space: 4/8/12/16/24/34/52/96 — sections pad 96px; content max-width 680px.
Radius: 0 (cards), 2–4px (media), 999px (pills/arches/avatars).
Borders: 1px `--goldSoft` hairlines; gold accent rules 1px × 26–46px.
Shadow: `0 24px 50px -34px rgba(ink,.4)`. Glass: 74–82% bg + blur 12–16px.
Touch targets ≥44px.

### Palettes (8 CSS variables each: --bg --bg2 --ink --mut --gold --goldSoft --dark --darkInk)
- **Ivory & Gold** (default): #faf8f2 #f2ede1 #2c2a24 #77715f #a5843e #e6dcc2 #22211c #efe9da
- **Sage**: #f7f8f3 #eaefe2 #272c23 #6f7765 #6f815a #d9e1cc #242920 #edf0e6
- **Midnight** (full dark): #15171c #1d2027 #ebe8e0 #98958b #bb9c57 #3b3524 #0e1014 #ebe8e0

## Screens / sections (order fixed)
1. **Envelope intro** — fixed overlay, double hairline inset frames (14/20px), monogram circle 74px, names clamp(44–84px), Brontë quote italic, date, outlined pill "Open Invitation" with kBreath pulse. Tap → kOut fade (1s), music starts.
2. **Hero** — 60svh photo with 22s Ken Burns, 5 floating petal divs (kFloat 17–26s), overlapping ivory plate (margin-top −84px, gold top rule) with kWide overline + kMask names + date lines, scroll cue (animated 1px line).
3. **Bride & Groom** — two arch-framed portraits (border-radius 999px 999px 0 0, 8px padded hairline frame), opposing kL/kR entrances, name + role overline + 1-line bio.
4. **Our Story** — left rail timeline (1px goldSoft, 9px gold dots), 3 milestones (date overline, serif H3, body), wide engagement photo with kMask.
5. **Countdown** — dark section (--dark/--darkInk), italic serif heading, 4 serif digit groups (clamp 46–84px) with gold labels + colons, live 1s tick, "Add to calendar" (Google Calendar template URL).
6. **Day timeline** — scroll-snap carousel, 168px cards (bg2, hairline), alternating 22px vertical offsets, serif time + overline + note.
7. **Events** — 3 stacked cards on bg2 band: 74px date block (day/serif number/month) + hairline divider + title/body/dress overline. Saturday card gets gold border + gold-tinted shadow.
8. **Family** — auto-fit grid, 124px circle photo slots, serif names, role overlines.
9. **Venue** — full-bleed 78svh photo, bottom glass card (blur 16px): name, address, "Open in Google Maps" ink pill.
10. **Map** — 300px placeholder (replace with real Google Maps embed), gold teardrop pin, "Get directions" + "View on map" pills, travel notes (train/parking/shuttle).
11. **Accommodation** — 2 hotel cards (photo 160px, serif name, price overline, blurb, underlined "Book a room"), room-block code callout.
12. **Dress code** — centered italic serif "Garden formal", guidance copy, 5 wearable swatch dots (34px: #6e7a5e #b7a27a #8a6d54 #444a3f #cbb9a2) + caption.
13. **Menu** — 480px framed card, double hairline (inset 8px), 3 courses: gold course overlines, serif 19px dishes, italic alternatives, 26px gold dividers.
14. **Gallery** — snap carousel of 6 mixed-ratio photo slots (250×340, 300×300, 340×280…), "Swipe →" hint.
15. **Film** — 16:9 media frame with kMask reveal, centered 76px glass play button (CSS triangle) with kBreath.
16. **Guest wishes** — dark section, 3 alternating-indent quote cards (serif italic 19px + gold attribution overline), pill input + gold "Send" button.
17. **RSVP** — gold-framed card, floating "Kindly reply" label, name/contact inputs (bg2, hairline, gold focus), accept/decline pill toggle (gold fill when selected), ± guest stepper (44px buttons, serif count), notes textarea, ink submit pill → in-place thank-you state (monogram, dynamic copy for accept vs decline, "Change my reply" link).
18. **FAQ** — 5 `<details>` rows, serif 19px summaries, gold "+", hairline dividers.
19. **Contact + Footer** — Call (ink pill, `tel:`), WhatsApp (`wa.me` pre-filled), Share (`navigator.share`, clipboard fallback, "Link copied" state). Footer: dark, monogram circle, serif names, date overline, gold italic hashtag.
Persistent: glass sticky nav (Events/Venue/RSVP pill) + fixed 52px glass music toggle bottom-right with 3 kBar equalizer bars (paused/dimmed when muted).

## Interactions & behavior
- Music: WebAudio ambient (A-major pad 110/165/220Hz + random pentatonic plucks through 0.42s feedback delay, master gain .055) started by the intro tap; mute = AudioContext suspend. Production may swap in a config MP3.
- Countdown target: 2026-09-26T15:30+01:00, zero-padded, freezes at 00.
- Scroll reveals: CSS `animation-timeline: view()`, ranges ≈ entry 10–20% → cover 28–40%; add IntersectionObserver fallback in production.
- `prefers-reduced-motion`: all animation ≤10ms, smooth scroll off.
- Forms are visual-only in the prototype; production POSTs to a configurable endpoint.

## State
`opened/closing` (intro), `muted`, countdown digits (1s interval), `attending` (yes/no), `guests` (1–8), `rsvpDone`, `shared`.

## Assets
No licensed imagery included — all photos are drag-and-drop `<image-slot>` placeholders (hero, bride, groom, story, venue, 2 hotels, 4 family, 6 gallery, film poster). Fonts via Google Fonts; self-host in production.
