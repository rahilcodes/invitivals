/* =====================================================================
   Theme: Rose Red (wedding / nikah)
   The designer's finished pages, used whole. Everything that belongs to
   the ARTWORK lives here: page sizes, where the buttons and the text
   slots sit. Nothing about a particular couple. All coordinates are in
   each page's own pixels (the same numbers tools/build-rose-red-art.mjs
   uses to clear the sample couple's wording from the pages).

   slots  : live wording, filled from the invitation's data by `key`
            keys   several details set as one line
            text   the theme's own wording, used when the couple gives none
            join   sets a list on one line
            size / lh are in page pixels; a line that would not fit its
            rect is shrunk, so long names never overflow
   ===================================================================== */
(function () {
  "use strict";
  var CREAM = "#fbecd0", GOLD = "#f3d596";
  window.INVITE_THEME = {
    id: "rose-red",
    base: new URL(".", document.currentScript.src).href,
    css: "theme.css",
    audio: "audio/background.mp3",
    og: "art/og.jpg",
    colors: { page: "#3a0b18", theme: "#3a0b18", ink: CREAM, gold: GOLD },

    entrance: {
      kind: "flaps", W: 916, H: 1600,
      img: "art/envelope.webp", soft: "art/envelope-soft.webp",
      seal: { cx: 455, cy: 856, r: 142 },
      // the four flaps meet under the seal; their edges follow the envelope's gold folds
      flaps: {
        top: [[0, 0], [916, 0], [916, 500], [455, 858], [0, 482]],
        right: [[916, 500], [916, 1133], [455, 858]],
        bottom: [[916, 1133], [916, 1600], [0, 1600], [0, 1138], [455, 858]],
        left: [[0, 482], [455, 858], [0, 1138]]
      },
      preload: ["art/envelope.webp", "art/envelope-soft.webp"]
    },

    sections: [
      { id: "couple", plate: "art/couple-page.webp", W: 900, H: 1600, lap: 0,
        overlays: [
          { s: "spark", x: 96, y: 236, w: 34, cls: "twinkle", t: 3.4 },
          { s: "spark", x: 770, y: 560, w: 30, cls: "twinkle", t: 4.1, d: -1.6 }
        ],
        reads: ["Together with their families"],
        slots: [
          { key: "blessing", rect: [230, 30, 670, 98], font: "arabic", size: 44, color: GOLD, delay: .05 },
          { keys: ["hosts.title", "hosts.names"], rect: [150, 308, 750, 362], font: "serif", weight: 600, size: 43, track: ".02em", delay: .15 },
          { key: "hosts.message", rect: [170, 366, 730, 492], font: "serif", weight: 600, size: 37, lh: 42, track: ".03em", delay: .25 },
          { key: "couple.first", rect: [110, 498, 790, 676], font: "script", size: 150, color: "#fdf0c4", delay: .4 },
          { key: "couple.second", rect: [110, 716, 790, 894], font: "script", size: 150, color: "#fdf0c4", delay: .6 }
        ],
        petals: { n: 3, y0: 55, y1: 100 } },

      { id: "date", plate: "art/date-page.webp", W: 900, H: 1600, lap: 9,
        overlays: [
          { s: "spark", x: 96, y: 560, w: 40, cls: "twinkle", t: 2.9, d: -1.2 },
          { s: "spark", x: 776, y: 1010, w: 36, cls: "twinkle", t: 3.8, d: -2.2 }
        ],
        reads: ["Save our date"],
        // the date lies under a gold cover until the guest wipes it away
        scratch: { img: "art/date-cover.webp", rect: [108, 606, 792, 968], label: "Touch or swipe to reveal the date", say: ["event.day", "event.dateText", "event.time"] },
        slots: [
          { key: "event.day", rect: [346, 640, 556, 706], font: "serif", weight: 600, size: 58, plain: true },
          { key: "event.dateText", rect: [214, 706, 722, 772], font: "serif", weight: 700, size: 66, color: GOLD, plain: true },
          { key: "event.time", join: " ", rect: [250, 790, 650, 844], font: "serif", weight: 600, size: 40, plain: true }
        ],
        links: [
          { to: "calendar", rect: { x0: 220, y0: 860, x1: 685, y1: 945 }, label: "Save the date: add to your calendar", round: true }
        ],
        petals: { n: 2, y0: 0, y1: 36 } },

      { id: "venue", plate: "art/venue-page.webp", W: 708, H: 1600, lap: 9,
        reads: ["Venue"],
        slots: [
          { key: "venue.name", rect: [92, 366, 616, 468], font: "serif", weight: 600, size: 47, lh: 51, delay: .15 },
          { key: "venue.address", rect: [104, 480, 604, 598], font: "serif", weight: 600, size: 28, lh: 37, track: ".02em", valign: "top", delay: .3 },
          { key: "venue.area", rect: [222, 764, 488, 802], font: "sans", weight: 800, size: 28, color: "#16203f", track: ".02em", plain: true },
          { key: "venue.areaLocal", rect: [222, 802, 488, 838], font: "sans", weight: 600, size: 25, color: "#16203f", plain: true }
        ],
        links: [
          { to: "maps", rect: { x0: 138, y0: 880, x1: 570, y1: 955 }, label: "Take me there: open in Google Maps", round: true },
          { to: "maps", rect: { x0: 103, y0: 645, x1: 605, y1: 860 }, label: "Open the venue in Google Maps" }
        ],
        petals: { n: 2, y0: 60, y1: 100 } },

      { id: "thanks", plate: "art/thanks-page.webp", W: 687, H: 1600, lap: 9,
        overlays: [
          { s: "spark", x: 560, y: 470, w: 30, cls: "twinkle", t: 3.3 },
          { s: "spark", x: 96, y: 900, w: 28, cls: "twinkle", t: 4.2, d: -1.5 }
        ],
        reads: ["With all our love. Thank you for being a part of our special journey."],
        slots: [
          { key: "closing.from", rect: [130, 962, 557, 1010], font: "caps", size: 25, track: ".2em", color: GOLD, delay: .3 }
        ],
        petals: { n: 3, y0: 60, y1: 100 } }
    ],
    ink: CREAM
  };
})();
