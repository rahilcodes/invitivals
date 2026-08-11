# Prompt for Claude Code — paste everything below the line

---

You are an award-winning frontend engineer and luxury brand designer. Build **"Wedding Luxe V1"** — a premium, sellable digital wedding invitation website template.

## Reference files (in this folder — study them first)
- `Wedding Invitation.dc.html` — the high-fidelity design prototype. Recreate it **pixel-perfectly**: layout, spacing, type scale, colors, copy voice, and animations are all final design decisions, not suggestions.
- `Design Spec.dc.html` + `README.md` — full spec: user journey, IA, tokens, palettes, component list, animation timings, and interaction rules.
These are HTML design references, NOT production code — re-implement them properly in the stack below.

## Stack
- Astro or Next.js (static export), vanilla CSS with custom properties (no Tailwind), zero runtime frameworks on the scroll path.
- All content driven by one config file (`wedding.config.ts`): couple names, date/time/timezone, quote, story milestones, day-of timeline, events, family, venue + coordinates, hotels, dress code, menu, FAQ, contact numbers, hashtag, palette choice, section on/off toggles.
- Ship as a template: a buyer edits ONLY the config + drops photos into `/public/photos`.

## Design system (must match the prototype exactly)
- Fonts: Cormorant Garamond (display, 300–600 + italics) + Jost (body/labels, 300–500), self-hosted with `font-display: swap`.
- Theming: exactly 8 CSS variables — `--bg --bg2 --ink --mut --gold --goldSoft --dark --darkInk`. Ship 3 palettes (values in README): Ivory & Gold (default), Sage, Midnight. A palette = 8 values, nothing else.
- Tokens: section padding 96px; content max-width 680px; hairline borders 1px `--goldSoft`; radius 0/4px/999px only; soft far shadows (`0 24px 50px -34px`); glass = 74–82% bg + 12–16px blur; touch targets ≥44px; body text ≥13px.
- Overline labels: 10–11px, uppercase, letter-spacing .24–.34em, gold.

## Structure (19 sections, this order)
Envelope intro (fixed overlay: double hairline frame, monogram circle, names, quote, "Open Invitation" button) → Hero (Ken Burns photo, mask-revealed names, floating petals, scroll cue) → Bride & Groom (arch portraits) → Our Story (rail timeline, 3 milestones) → Countdown (dark inversion, live timer, Add to Calendar) → Day timeline (scroll-snap carousel) → Events (3 date-block cards) → Family (circle avatars) → Venue (full-bleed photo + glass card + Google Maps link) → Map (real Google Maps embed replacing the prototype's placeholder + Directions button) → Accommodation (2 hotel cards, room-block code) → Dress code (italic serif + wearable swatch dots) → Menu (double-hairline framed card) → Gallery (snap carousel, mixed aspect ratios) → Film (16:9 poster + glass play button → lightbox video) → Guest wishes (staggered cards + input) → RSVP (framed card: name, contact, accept/decline pills, guest stepper, notes, in-place thank-you state) → FAQ (accordion) → Contact (Call / WhatsApp / Share buttons) → Footer (dark, monogram, hashtag).

## Animation rules
- Scroll reveals via CSS `animation-timeline: view()` with an IntersectionObserver fallback for browsers without support. No scroll-jacking, no JS parallax.
- Keyframe vocabulary (reuse, don't invent): kRise, kFade, kMask (clip-path curtain), kWide (letter-spacing settle), kL/kR (opposing slide-ins), kZoom, kKen (22s hero drift), kFloat (petals 17–26s), kBreath (CTA pulse), kBar (music equalizer).
- `prefers-reduced-motion: reduce` collapses ALL animation to ≤10ms.
- 60fps on mid-range Android: animate only transform/opacity/clip-path.

## Behavior
- Music: starts on the "Open Invitation" tap (autoplay is blocked — the tap is the unlock). Use a soft looping instrumental (config-supplied MP3, lazy-loaded) OR the WebAudio generative ambient approach from the prototype. Persistent glass mute toggle bottom-right with animated bars.
- Countdown: live to the config date/timezone, zero-padded, freezes at 00 on the day.
- RSVP + guestbook: POST to a configurable endpoint (support Google Sheets via Apps Script and a generic webhook); optimistic thank-you state with "change my reply".
- Buttons: `tel:`, `wa.me` (pre-filled message), Google Calendar template URL, `navigator.share` with clipboard fallback.
- SEO + share: full meta/OG tags, og:image generated from couple config; single-file-ish output, <150KB JS total, Lighthouse ≥95 across the board, lazy-load all imagery below the hero.
- Accessibility: semantic landmarks, keyboard-operable accordion/carousels/forms, visible focus states, WCAG AA contrast in all 3 palettes.

## Deliverables
1. The working template with `wedding.config.ts` and demo content matching the prototype (Amara & Julian, Sept 26 2026, Hartwell Estate).
2. `THEMING.md` — how to add a new 8-variable palette.
3. `SETUP.md` — 10-minute buyer guide: edit config, drop photos, deploy to Vercel/Netlify.

Match the prototype before adding anything. When in doubt, open `Wedding Invitation.dc.html` in a browser and compare side by side.
