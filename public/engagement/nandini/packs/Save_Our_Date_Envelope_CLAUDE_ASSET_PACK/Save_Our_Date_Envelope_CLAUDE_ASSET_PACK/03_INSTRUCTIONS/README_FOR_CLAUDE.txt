SAVE OUR DATE — TAP-TO-REVEAL ENVELOPE — CLAUDE ASSET PACK

SOURCE OF TRUTH
Use 01_REFERENCE/finished_reference.png for composition, colors and scale.
Assets are based on the recreated clean master sheet.

IMPORTANT INTERACTION
The envelope is the interactive reveal.

INITIAL STATE
• Show the envelope closed.
• Display “SAVE OUR Date” and “Tap to reveal our special date ♡” using HTML/CSS/SVG.
• Keep the date itself hidden.
• Use a subtle idle glow on the wax seal only; do not make the whole envelope bounce.

ON TAP
1. Wax seal gives a tiny press/release response.
2. Left and right ribbon tails loosen slightly.
3. Envelope flap rotates upward from its top fold.
4. A separate ivory date card slides upward from inside the envelope.
5. Reveal:
   Sunday
   15 November 2026
   10:30 AM onwards
   Lunch 12:30 PM onwards
6. Then reveal the Save the Date button beneath/with the card.
7. Keep the card visible after opening.

DO NOT hard-cut to another screen. The reveal must happen inside this same section.

SUGGESTED TIMING
seal response 180–250ms
ribbon loosen 300–450ms
flap opening 650–850ms
card slide 700–900ms, beginning shortly after flap starts
text/date fade 300–450ms

LAYER ORDER
z0 scenic background
z10 waterfall/gazebo
z20 architecture
z30 florals
z40 envelope back/body
z45 hidden date card
z50 envelope flap
z55 ribbons
z60 wax seal
z70 petals/foreground
z90 HTML/CSS/SVG text

TEXT
Recreate all normal wording as HTML/CSS/SVG. Do not flatten the heading/date/instruction into decorative PNGs.

OTHER MOTION
Hanging florals: tiny sway.
Petals: sparse slow fall.
Landscape: mostly still; optional subtle water shimmer.
Arch/steps/balustrade: static.

TRANSPARENCY
Individual files are RGBA PNGs with transparent safety padding. Verify against checkerboard/dark background before deployment.
