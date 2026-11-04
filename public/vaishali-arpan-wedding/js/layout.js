/* The client's own text boxes, in % of their page, added to the demo's measured art boxes (js/art.js).
   The demo's hero, functions, detail, memories and closing pages carry different words here, so these are
   placed by hand inside the same arches and frames the demo's lettering used. */
import { art } from './art.js';

Object.assign(art, {
  /* page 1: the invitation, bride first, inside the arch (the painted couple stands below right from ~55%) */
  'h-invocation': { x: 36, y: 14, w: 34, h: 2.4 },
  'h-hindi': { x: 28, y: 16.6, w: 48, h: 6.2 },
  'h-rule1': { x: 40.17, y: 22.7, w: 25.505, h: 2.033 },
  'h-blessings': { x: 30, y: 25.1, w: 44, h: 2 },
  'h-parents': { x: 30, y: 27.5, w: 44, h: 5.2 },
  'h-request': { x: 32, y: 33.1, w: 40, h: 10.6 },
  'h-bride': { x: 25, y: 43.9, w: 50, h: 7 },
  'h-bride-of': { x: 31, y: 50.7, w: 42, h: 4.6 },
  'h-with': { x: 35, y: 55.5, w: 30, h: 2 },
  'h-groom': { x: 19, y: 57.5, w: 46, h: 6.4 },
  'h-groom-of': { x: 22, y: 63.7, w: 42, h: 4.6 },

  /* page 2: the parchment's date, three lines */
  'p2-date3': { x: 35, y: 57.8, w: 30, h: 12.4 },

  /* page 3: three plaques (the pack's plaque is 3:1) and their pins */
  'p3-plaque-a': { x: 25, y: 44, w: 50, h: 9.4 },
  'p3-plaque-b': { x: 25, y: 72.2, w: 50, h: 9.4 },
  'p3-plaque-c': { x: 25, y: 84.4, w: 50, h: 9.4 },
  'p3-pin-b': { x: 42.675, y: 68.6, w: 7.643, h: 5.632 },
  'p3-pin-c': { x: 68.153, y: 81.4, w: 7.006, h: 5.153 },

  /* detail pages on plate 4: title over the arch, date in the plate's own gold frame (44.6–50 %) */
  'd4-title': { x: 17, y: 28.4, w: 66, h: 9.2 },
  'd4-rule': { x: 40.914, y: 37.8, w: 18.597, h: 1.794 },
  'd4-date': { x: 33, y: 45, w: 34, h: 2.6 },
  'd4-weekday': { x: 34.5, y: 47.5, w: 31, h: 2.1 },
  /* detail page on plate 5: script title, the plate's own card (42–52 %) with its calendar and clock icons */
  'd5-title': { x: 14, y: 17.6, w: 72, h: 12.2 },
  'd5-date': { x: 41, y: 43.2, w: 30, h: 2.6 },
  'd5-weekday': { x: 42.5, y: 45.8, w: 27, h: 2.1 },
  'd5-time': { x: 42.5, y: 48.9, w: 27, h: 2.3 },

  /* countdown page on plate 5 */
  'c-title': { x: 12, y: 17.6, w: 76, h: 12.2 },
  'c-lines': { x: 20, y: 32.2, w: 60, h: 5 },
  'c-save': { x: 20, y: 37.6, w: 60, h: 4.4 },
  'c-date': { x: 41, y: 43.2, w: 30, h: 2.6 },
  'c-weekday': { x: 42.5, y: 45.8, w: 27, h: 2.1 },
  'c-time': { x: 42.5, y: 48.9, w: 27, h: 2.3 },
  'c-tiles': { x: 9, y: 54, w: 82, h: 8.2 },
  'c-button': { x: 24, y: 64, w: 52, h: 5.6 },

  /* little stars on plate 7 */
  's-rule1': { x: 32.412, y: 27.5, w: 35.6, h: 5.144 },
  's-title': { x: 20, y: 33.6, w: 60, h: 5.2 },
  's-big': { x: 16, y: 39.6, w: 68, h: 10.4 },
  's-rule2': { x: 32.412, y: 50.4, w: 35.6, h: 3.708 },
  's-line': { x: 20, y: 54.6, w: 60, h: 5 },
  's-love': { x: 30, y: 60.2, w: 40, h: 2.4 },
  's-names': { x: 20, y: 62.8, w: 60, h: 2.8 },

  /* closing on plate 8 */
  'z-title': { x: 15, y: 38.8, w: 70, h: 8.4 },
  'z-rule': { x: 31.35, y: 48.4, w: 37.726, h: 2.632 },
  'z-lines': { x: 20, y: 51.8, w: 60, h: 5.2 },
  'z-hashtag': { x: 25, y: 58.2, w: 50, h: 3 },
  'z-heart': { x: 35.919, y: 62.6, w: 28.905, h: 3.947 },
});
