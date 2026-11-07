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
  'h-hindi': { x: 27.4, y: 18.4, w: 50, h: 4.2 },
  'h-rule1': { x: 40.4, y: 23.2, w: 24, h: 1.913 },
  'h-blessings': { x: 32.4, y: 25.6, w: 40, h: 1.3 },
  'h-parents': { x: 29.4, y: 27.3, w: 46, h: 4.44 },  /* the grandparents, two lines */
  'h-parents2': { x: 27.4, y: 31.7, w: 50, h: 3.9 },  /* the parents, two lines, a little smaller */
  'h-request': { x: 28.4, y: 35.9, w: 48, h: 3.8 },
  'h-bride': { x: 25.4, y: 39.6, w: 54, h: 5.4 },
  'h-bride-of': { x: 29.4, y: 45.4, w: 46, h: 3.66 },
  'h-with': { x: 37.4, y: 49.8, w: 30, h: 1.35 },
  'h-groom': { x: 25.4, y: 51.6, w: 54, h: 5.4 },
  'h-groom-of': { x: 29.4, y: 57.4, w: 46, h: 3.66 },

  /* page 2: the parchment's date, three lines */
  'p2-date3': { x: 35, y: 57.8, w: 30, h: 12.4 },

  /* page 3: the programme, one card under the plate's "Our Functions" lettering, over the venue's bokeh */
  'f-card-1a': { x: 12, y: 53.4, w: 76, h: 16.8 },

  /* the three day pages on plate 4: title over the arch, date in the plate's own gold frame (44.6–50 %) */
  'd4-title': { x: 17, y: 28.4, w: 66, h: 9.2 },
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
  'sd-title': { x: 15, y: 13.8, w: 70, h: 5.6 },
  'sd-rule': { x: 40.914, y: 20.4, w: 18.597, h: 1.794 },
  'sd-names': { x: 20, y: 23.2, w: 60, h: 2.0 },
  'sd-venue': { x: 20, y: 26.3, w: 60, h: 1.9 },
  'sd-addr': { x: 20, y: 28.5, w: 60, h: 1.7 },
  'sd-card': { x: 21, y: 40.2, w: 58, h: 13 },      /* one solid card over the plate's painted one (its ornaments included) */
  'sd-save': { x: 11, y: 53.0, w: 38.6, h: 7.2 },   /* over the plate's painted buttons, which they hide */
  'sd-maps': { x: 50.4, y: 53.0, w: 38.6, h: 7.2 },

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
  'z-heart': { x: 35.919, y: 62.6, w: 28.905, h: 3.947 },
  'z-logo': { x: 41, y: 60.8, w: 18, h: 10.13 }, /* the couple's monogram (square) in place of the heart, under the hashtag */
});
