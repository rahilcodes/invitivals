/* This invitation's own boxes, in % of their page, added to the design's measured art boxes (js/art.js).
   Every group of words is placed by hand inside the arch or frame its plate paints. */
import { art } from './art.js';

Object.assign(art, {
  /* page 1: the invitation, centred on the arch (its axis is at 52.4 %). One vertical rhythm from the arch's
     point down to 53 %; the couple stand below it, on the right, from 58 % */
  'h-ik': { x: 46.4, y: 12.5, w: 12, h: 3.55 },         /* 419×220 */
  'h-blessings': { x: 30.4, y: 16.9, w: 44, h: 3.8 },
  'h-rule1': { x: 40.4, y: 21.2, w: 24, h: 1.913 },
  'h-parents': { x: 26.4, y: 23.7, w: 52, h: 4.6 },
  'h-request': { x: 26.4, y: 29.0, w: 52, h: 5.6 },
  'h-bride': { x: 22.4, y: 35.6, w: 60, h: 4.0 },
  'h-with': { x: 37.4, y: 40.5, w: 30, h: 1.4 },
  'h-groom': { x: 22.4, y: 42.6, w: 60, h: 4.0 },
  'h-rule2': { x: 40.4, y: 47.6, w: 24, h: 1.913 },
  'h-date': { x: 22.4, y: 50.4, w: 60, h: 1.5 },
  'h-venue': { x: 22.4, y: 52.4, w: 60, h: 1.6 },
  /* the couple: 1086×1448, 56 % of the page wide, reaching a little past the right edge as the design's own
     couple did; the picture's cut lower edge dissolves into the mist at the foot of the page */
  'h-couple': { x: 46, y: 58.2, w: 56, h: 42.02 },

  /* the families on plate 7, inside the frame's clear middle */
  'm-b-label': { x: 25, y: 27.4, w: 50, h: 1.4 },
  'm-b-name': { x: 20, y: 29.3, w: 60, h: 3.5 },
  'm-b-rel': { x: 25, y: 33.3, w: 50, h: 1.5 },
  'm-b-parents': { x: 22, y: 35.0, w: 56, h: 3.9 },
  'm-b-village': { x: 25, y: 39.5, w: 50, h: 1.4 },
  'm-rule': { x: 32.412, y: 41.6, w: 35.6, h: 3.708 },
  'm-g-label': { x: 25, y: 46.0, w: 50, h: 1.4 },
  'm-g-name': { x: 18, y: 47.9, w: 64, h: 3.5 },
  'm-g-rel': { x: 25, y: 51.9, w: 50, h: 1.5 },
  'm-g-parents': { x: 20, y: 53.6, w: 60, h: 3.9 },
  'm-g-village': { x: 25, y: 58.1, w: 50, h: 1.4 },

  /* page 2: the parchment's date, three lines */
  'p2-date3': { x: 35, y: 57.8, w: 30, h: 12.4 },

  /* page 3: the programme, two cards under the plate's "Our Functions" lettering */
  'f-card-a': { x: 12, y: 43.5, w: 76, h: 16.8 },
  'f-card-b': { x: 12, y: 63.3, w: 76, h: 16.8 },

  /* the day pages on plate 4: title over the arch, date in the plate's own gold frame (44.6–50 %) */
  'd4-title': { x: 17, y: 28.4, w: 66, h: 9.2 },
  'd4-rule': { x: 40.914, y: 37.8, w: 18.597, h: 1.794 },
  'd4-date': { x: 33, y: 45, w: 34, h: 2.6 },
  'd4-weekday': { x: 34.5, y: 47.5, w: 31, h: 2.1 },

  /* the countdown on the top half of plate 8 */
  'c-title': { x: 15, y: 9.2, w: 70, h: 8.6 },
  'c-rule': { x: 40.914, y: 18.6, w: 18.597, h: 1.794 },
  'c-lines': { x: 22, y: 21.2, w: 56, h: 3.9 },
  'c-tray': { x: 15, y: 27.2, w: 70, h: 10.4 },
  'c-date': { x: 20, y: 39.6, w: 60, h: 2.6 },
  'c-weekday': { x: 15, y: 42.1, w: 70, h: 2.1 },

  /* Save the Date on plate 5. The card and the two buttons are ONE block: the same left and right edges
     (11–89 %), a clear gap between the card and the buttons, the two buttons equal with a gap between them.
     (On the design's reference page the card was narrower than the button row and sat on top of it.) */
  'sd-title': { x: 15, y: 13.8, w: 70, h: 5.6 },
  'sd-rule': { x: 40.914, y: 20.4, w: 18.597, h: 1.794 },
  'sd-names': { x: 20, y: 22.9, w: 60, h: 4.2 },
  'sd-venue': { x: 20, y: 28.0, w: 60, h: 1.9 },
  'sd-addr': { x: 20, y: 30.2, w: 60, h: 1.7 },
  'sd-card': { x: 11, y: 40.3, w: 78, h: 11.3 },
  'sd-save': { x: 11, y: 52.9, w: 38.2, h: 7.5 },
  'sd-maps': { x: 50.8, y: 52.9, w: 38.2, h: 7.5 },

  /* the closing on plate 8 (the page shows the plate from 26 % down; Page() converts these) */
  'z-love': { x: 12, y: 37.4, w: 76, h: 4.2 },
  'z-family': { x: 15, y: 42.4, w: 70, h: 2.6 },
  'z-rule': { x: 40.701, y: 46.3, w: 18.597, h: 1.794 },
  'z-special': { x: 19, y: 49.6, w: 62, h: 9.4 },
  'z-lines': { x: 17, y: 60.6, w: 66, h: 5.6 },
  'z-heart': { x: 35.919, y: 67.4, w: 28.905, h: 3.947 },
});
