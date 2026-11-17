/* The client's own text boxes, in % of their page, added to the demo's measured art boxes (js/art.js).
   The demo's hero, functions, detail, memories and closing pages carry different words here, so these are
   placed by hand inside the same arches and frames the demo's lettering used. */
import { art } from './art.js';

Object.assign(art, {
  /* page 1: the invitation, bride first, centred on the arch (its axis is at 52.4 %). One vertical rhythm:
     every box is as tall as its words, with a steady gap of ~0.8 % between groups and a smaller one between a
     name and its own line. The block starts below the arch's cusps (~13.2 % at x 39 / 63 %) and ends above
     the painted couple, whose heads begin at ~57 % on the right (x > 72 %) */
  'h-ganesha': { x: 48.7, y: 12.4, w: 7.4, h: 5.65 }, /* the demo's small Ganesha, 140×190, under the arch's point */
  'h-invocation': { x: 32.4, y: 12.0, w: 40, h: 1.3 }, /* only when the invocation line is set (then Ganesha is not) */
  'h-hindi': { x: 27.4, y: 19.2, w: 50, h: 2.2 },
  'h-rule1': { x: 40.4, y: 22.8, w: 24, h: 1.913 },
  /* no names were supplied (2026-11-16): "Wedding Invitation", the celebration in the names' face, the dates, the place */
  'h-blessings': { x: 32.4, y: 26.4, w: 40, h: 1.3 },
  /* (2026-11-17, the couple named) bride, "&", groom with room between them */
  'h-bride': { x: 22.4, y: 28.6, w: 60, h: 5.4 },
  /* each name has its degrees right under it (client, 2026-11-17); everything below moved down to make room */
  'h-bride-deg': { x: 19.4, y: 34.0, w: 66, h: 1.9 },
  'h-with': { x: 37.4, y: 36.1, w: 30, h: 2.3 },
  'h-groom': { x: 22.4, y: 38.3, w: 60, h: 5.4 },
  'h-groom-deg': { x: 19.4, y: 43.7, w: 66, h: 3.6 },
  'h-rule2': { x: 40.4, y: 47.7, w: 24, h: 1.913 },
  'h-dates': { x: 22.4, y: 50.1, w: 60, h: 2.2 },
  'h-place': { x: 24.4, y: 52.9, w: 56, h: 3.7 },

  /* the Bride and Groom pages on plate 7 (the design's empty gold frame, axis at 50 %): clear of its flowers
     between y ≈ 22 and 66 % and x ≈ 28 and 72 %. The Groom's page mirrors the plate and these boxes. */
  'fam-label': { x: 20, y: 25.4, w: 60, h: 5.2 },
  'fam-rule1': { x: 40.7, y: 31.0, w: 18.597, h: 1.794 },
  'fam-name': { x: 15, y: 33.6, w: 70, h: 4.9 },
  'fam-parents': { x: 22, y: 39.4, w: 56, h: 7.8 },
  'fam-rule2': { x: 39.5, y: 48.6, w: 21, h: 2.87 },
  'fam-elders-k': { x: 22, y: 52.6, w: 56, h: 2.4 },
  'fam-elders': { x: 22, y: 55.3, w: 56, h: 5.3 },

  /* page 2: the parchment's date, three lines (day, month, year), centred on the paper (its axis 50.37 %) */
  'p2-date3': { x: 35.37, y: 57.6, w: 30, h: 12.6 },

  /* page 3: the programme, three cards under the plate's "Our Functions" lettering, over the venue's bokeh */
  /* four functions since 2026-11-17 (were three day cards of 16.8) */
  'f-card-a': { x: 12, y: 31.2, w: 76, h: 13.7 },
  'f-card-b': { x: 12, y: 46.3, w: 76, h: 13.7 },
  'f-card-c': { x: 12, y: 61.4, w: 76, h: 13.7 },
  'f-card-d': { x: 12, y: 76.5, w: 76, h: 13.7 },

  /* the three day pages on plate 4: title over the arch, date in the plate's own gold frame (44.6–50 %) */
  'd4-title': { x: 17, y: 28.2, w: 66, h: 6.4 },
  'd4-sub': { x: 17, y: 34.9, w: 66, h: 2.2 },
  'd4-rule': { x: 40.914, y: 37.8, w: 18.597, h: 1.794 },
  'd4-date': { x: 33, y: 45, w: 34, h: 2.6 },
  'd4-weekday': { x: 34.5, y: 47.5, w: 31, h: 2.1 },

  /* the countdown on the top half of plate 8 (its plain wall with soft florals in the upper corners; the
     closing page shows the plate from 26 % down): title, line, four light tiles, the day under them */
  'c-title': { x: 15, y: 9.2, w: 70, h: 8.6 },
  'c-rule': { x: 40.914, y: 18.6, w: 18.597, h: 1.794 },
  'c-lines': { x: 22, y: 21.2, w: 56, h: 3.9 },
  'c-tray': { x: 15, y: 27.2, w: 70, h: 10.4 },
  'c-date': { x: 20, y: 39.6, w: 60, h: 2.6 },
  'c-weekday': { x: 20, y: 42.1, w: 60, h: 2.1 },

  /* Save the Date on plate 5, the plate made for it: the title in the arch, the names and the venue under it,
     the day beside the card's calendar icon, the time beside its clock, and the plate's own two buttons */
  /* (2026-11-17) one block on the arch's axis (50.65 %: its point, and the painted buttons' centre), with even
     gaps: title, rule, the couple, the ceremony, the venue and address, then the card, then the two buttons.
     The plate's painted card is painted out under the card's lower edge by tools/dr-snehal-dr-rushikesh-wedding.mjs,
     so the card stands 2.7 % clear of the buttons. */
  'sd-title': { x: 15.65, y: 14.2, w: 70, h: 5.6 },
  'sd-rule': { x: 41.35, y: 20.6, w: 18.597, h: 1.794 },
  'sd-couple': { x: 15.65, y: 23.5, w: 70, h: 3.4 },
  'sd-names': { x: 20.65, y: 28.0, w: 60, h: 2.0 },
  'sd-venue': { x: 20.65, y: 31.2, w: 60, h: 2.0 },
  'sd-addr': { x: 20.65, y: 33.4, w: 60, h: 1.8 },
  'sd-card': { x: 24.25, y: 38.0, w: 52.8, h: 12.9 }, /* covers the painted card's frame and sprigs (x 24.6–76.3 %) */
  'sd-save': { x: 11.85, y: 53.6, w: 37.8, h: 6.0 },  /* two equal buttons over the painted ones (x 12.8–89.1 %, y 54.1–58.9 %) */
  'sd-maps': { x: 51.45, y: 53.6, w: 37.8, h: 6.0 },

  /* little stars on plate 7, inside the frame's clear middle (x ≈ 22–78 %) */
  's-rule1': { x: 32.412, y: 27.5, w: 35.6, h: 5.144 },
  's-title': { x: 23, y: 33.4, w: 54, h: 5.2 },
  's-big': { x: 20, y: 39.2, w: 60, h: 10.4 },
  's-rule2': { x: 32.412, y: 50.0, w: 35.6, h: 3.708 },
  's-line': { x: 25, y: 54.2, w: 50, h: 5 },
  's-love': { x: 30, y: 59.8, w: 40, h: 2.4 },
  's-names': { x: 22, y: 62.4, w: 56, h: 2.8 },

  /* closing on plate 8 (the page shows the plate from 26 % down; Page() converts these) */
  'z-title': { x: 15, y: 38.8, w: 70, h: 8.4 },
  'z-rule': { x: 31.35, y: 48.4, w: 37.726, h: 2.632 },
  'z-lines': { x: 20, y: 51.8, w: 60, h: 5.2 },
  'z-hashtag': { x: 25, y: 58.2, w: 50, h: 3 },
  'z-heart': { x: 35.919, y: 59.2, w: 28.905, h: 3.947 },
  'z-logo': { x: 41, y: 60.8, w: 18, h: 10.13 }, /* the couple's monogram (square) in place of the heart, under the hashtag */
});
