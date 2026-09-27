ENGAGEMENT DOOR — CLAUDE ANIMATION ASSET PACK

Use 01_REFERENCE/finished_reference.png as the visual source of truth. Individual assets come from the recreated clean master sheet.

DOOR OPENING:
Start 02_left_door.png and 03_right_door.png fully closed with inner edges meeting at the center seam. Left transform-origin = outer left hinge; right transform-origin = outer right hinge. The next invitation screen must already exist underneath. On tap, open both leaves outward smoothly (about 1.5 s, ease-in-out), revealing the next screen naturally. No hard cut, white/black flash, or rectangular overlay.

LAYERING:
z0 next screen/background; z10 architecture; z20 arch/pillars; z30 doors; z40 florals; z50 hanging florals; z60 butterflies; z70 ornaments; z80 HTML/CSS/SVG text.

ANIMATION:
Doors = opening interaction. Butterflies = subtle drift. Hanging flowers = tiny slow sway. Florals/leaves = extremely subtle parallax. Gold ornaments = occasional glint. Arch/pillars = still.

TEXT:
Recreate normal invitation text with HTML/CSS/SVG in production rather than flattening it into decorative assets.

TRANSPARENCY:
Assets are RGBA PNGs with transparent safety padding. Check against a dark/checkerboard background before use.
