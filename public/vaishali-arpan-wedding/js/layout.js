/* The client's own text boxes, in % of their page, added to the demo's measured art boxes (js/art.js).
   The demo's hero, functions, detail, memories and closing pages carry different words here, so these are
   placed by hand inside the same arches and frames the demo's lettering used. */
import { art } from './art.js';

Object.assign(art, {
  /* page 1: the invitation, bride first, centred on the arch (its axis is at 52.4 %); everything ends above
     the painted couple, who stand at the lower right from ~59 % */
  'h-invocation': { x: 32.4, y: 15.0, w: 40, h: 2.2 }, /* below the arch's cusps, which reach down to ~14 % at the sides */
  'h-hindi': { x: 29.4, y: 17.3, w: 46, h: 4.8 },
  'h-rule1': { x: 39.65, y: 22.3, w: 25.505, h: 2.033 },
  'h-blessings': { x: 32.4, y: 24.4, w: 40, h: 2.0 },
  'h-parents': { x: 29.4, y: 26.5, w: 46, h: 5.0 },
  'h-request': { x: 28.4, y: 31.6, w: 48, h: 4.2 },
  'h-bride': { x: 27.4, y: 35.8, w: 50, h: 6.4 },
  'h-bride-of': { x: 29.4, y: 42.3, w: 46, h: 4.0 },
  'h-with': { x: 37.4, y: 46.4, w: 30, h: 2.0 },
  'h-groom': { x: 27.4, y: 48.4, w: 50, h: 6.4 },
  'h-groom-of': { x: 29.4, y: 54.9, w: 46, h: 4.0 },

  /* page 2: the parchment's date, three lines */
  'p2-date3': { x: 35, y: 57.8, w: 30, h: 12.4 },

  /* page 3: three plaques (the pack's plaque is 3:1), centred, each with its pin on its top-right corner */
  'p3-plaque-a': { x: 24, y: 44, w: 52, h: 9.75 },
  'p3-plaque-b': { x: 24, y: 73, w: 52, h: 9.75 },
  'p3-plaque-c': { x: 24, y: 85.2, w: 52, h: 9.75 },
  'p3-pin-a': { x: 70, y: 41.6, w: 7.006, h: 5.153 },
  'p3-pin-b': { x: 70, y: 70.6, w: 7.006, h: 5.153 },
  'p3-pin-c': { x: 70, y: 82.8, w: 7.006, h: 5.153 },

  /* the three day pages on plate 4: title over the arch, date in the plate's own gold frame (44.6–50 %) */
  'd4-title': { x: 17, y: 28.4, w: 66, h: 9.2 },
  'd4-rule': { x: 40.914, y: 37.8, w: 18.597, h: 1.794 },
  'd4-date': { x: 33, y: 45, w: 34, h: 2.6 },
  'd4-weekday': { x: 34.5, y: 47.5, w: 31, h: 2.1 },

  /* Save the Date on plate 4: the demo's own composition (date in the frame, time, venue, the two buttons) */
  'sd-title': { x: 15, y: 27.2, w: 70, h: 9.6 },
  'sd-rule': { x: 40.914, y: 37.4, w: 18.597, h: 1.794 },
  'sd-names': { x: 25, y: 39.6, w: 50, h: 2.6 },
  'sd-date': { x: 33, y: 45, w: 34, h: 2.6 },
  'sd-weekday': { x: 34.5, y: 47.5, w: 31, h: 2.1 },
  'sd-time': { x: 33, y: 54.1, w: 34, h: 2.4 },
  'sd-venue': { x: 32, y: 56.5, w: 36, h: 4.6 }, /* two lines: the clear cream between the flower beds is only 33–67 % wide here */

  /* the countdown on plate 5: the plate's own card (42–52 %) holds the date and time; the tiles sit in a
     tray right under it, over the plate's painted buttons */
  'c-title': { x: 12, y: 17.6, w: 76, h: 12.2 },
  'c-lines': { x: 20, y: 32.2, w: 60, h: 5 },
  'c-date': { x: 41, y: 43.2, w: 30, h: 2.6 },
  'c-weekday': { x: 42.5, y: 45.8, w: 27, h: 2.1 },
  'c-time': { x: 42.5, y: 48.9, w: 27, h: 2.3 },
  'c-tray': { x: 11, y: 53.2, w: 78, h: 10.6 },

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
});
