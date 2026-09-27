TEMPLE DOOR — ANIMATION ASSET PACK FOR CLAUDE
================================================

SOURCE OF TRUTH
Use 01_base/01_full_reference_background.png as the exact visual source of truth for composition, proportions, colors, lighting and placement.
This pack is extracted from the supplied finished reference. Because the source is one flattened raster image, elements that overlap other artwork cannot be perfectly reconstructed behind occluded areas. The transparent PNG crops are intended as animation layers while the full reference remains the visual base.

SCREEN BEHAVIOR
This is the CLOSED opening screen. The two door leaves remain closed until the guest taps the interactive “Tap to Open” control.
Do not bake interface text into new decorative layers. Recreate “Tap to Open” and the Om symbol as HTML/SVG for clean animation and accessibility.

RECOMMENDED LAYER ORDER / Z-INDEX
0  01_full_reference_background.png — static base
10 02_top_arch.png
11 03_left_column_arch.png / 04_right_column_arch.png
20 05_temple_door_left.png / 06_temple_door_right.png
30 floral layers 07–12
40 bells and diya layers 13–18
50 petals / water foreground 19–20
80 HTML/SVG Om symbol
90 HTML “Tap to Open” button

POSITIONING
All positions should be derived from the finished reference image. Keep the screen portrait/mobile-first and use object-fit: cover only when it does not crop the central door.
The door seam must stay exactly centered. Preserve the staircase, florals and lamps so the next screen can visually continue from the same lower scenery.

ANIMATION RECOMMENDATIONS
Door left/right: on tap, rotate outward from the outer vertical hinges with a slow ceremonial ease; 1.4–2.0s.
Bells: extremely subtle pendulum sway, 2–4 degrees, slow and asynchronous.
Diyas: subtle warm flame flicker only; avoid moving the lamp bodies.
Florals: mostly still; optional 1–3px slow parallax.
Petals: add separate CSS/SVG particles for sparse slow falling petals; do not overdo.
Glow around Om: soft breathing glow before interaction.
Tap button: very slight glow/pulse; on tap, depress briefly and fade as doors begin opening.
Architecture/columns: stay still.
Bottom water/lotus foreground: stay still or use only a nearly invisible shimmer.

FILES
02_top_arch.png — upper carved temple architecture.
03_left_column_arch.png / 04_right_column_arch.png — side architecture.
05_temple_door_left.png / 06_temple_door_right.png — the two independently animatable door leaves.
07_top_left_florals.png / 08_top_right_florals.png — upper floral masses.
09_lower_left_florals.png / 10_lower_right_florals.png — long side floral masses.
11_bottom_lotus_cluster_left.png / 12_bottom_lotus_cluster_right.png — foreground lotus/floral clusters.
13_bell_left.png / 14_bell_right.png — bell regions for subtle sway.
15–18 diya clusters — warm lighting accents for flicker/glow.
19_petals_steps_center.png — central stair/petal foreground detail.
20_water_lotus_foreground.png — lowest foreground continuation.
21_om_button_reference_ONLY.png — placement reference only; DO NOT use as final UI if clean HTML/SVG is possible.

IMPORTANT
Claude must always compare the assembled result against the finished reference image. Do not redesign the door, colors, floral density, architecture, button position or overall composition.
