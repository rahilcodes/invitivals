/* =====================================================================
   Theme: Rose Red (wedding / nikah)
   Everything that belongs to the ARTWORK lives here: plate sizes, where the
   moving pieces, buttons and text slots sit. Nothing about a particular
   couple. All coordinates are in each plate's own pixel space (1080 wide).

   The plates are laid out by tools/build-rose-red-art.mjs from the
   designer's loose elements — move an ornament there, move wording here.

   slots  : live wording, filled from the invitation's data by `key`
            text   the theme's own wording, used when the couple gives none
            join   sets a list on one line
            size / lh are in plate pixels; a line that would not fit its
            rect is shrunk, so long names never overflow
   overlays with a `name` can be left out per couple:  "hide": ["figures"]
   ===================================================================== */
(function () {
  "use strict";
  var INK = "#7a1533", GOLD = "#a0702a", CREAM = "#fbe9c6", CARDGOLD = "#f3d596";
  window.INVITE_THEME = {
    id: "rose-red",
    base: new URL(".", document.currentScript.src).href,
    css: "theme.css",
    audio: "audio/background.mp3",
    og: "art/og.jpg",
    colors: { page: "#fbeae3", theme: "#fbeae3", ink: INK, gold: GOLD },

    entrance: {
      kind: "envelope", W: 800, H: 865,
      closed: "art/env-closed.webp", open: "art/env-open.webp",
      // the front of the open envelope (what the card slides behind), measured in the open artwork
      pocket: [[0, 366], [294, 612], [479, 612], [800, 366], [800, 865], [0, 865]],
      corners: [
        { img: "art/corner-floral.webp", at: "tl", w: 46 },
        { img: "art/corner-lace.webp", at: "tr", w: 44 },
        { img: "art/bouquet-br.webp", at: "br", w: 44 }
      ],
      preload: ["art/env-closed.webp", "art/env-open.webp", "art/corner-floral.webp"]
    },

    sections: [
      { id: "hero", W: 1080, H: 2200, lap: 0,
        overlays: [
          { s: "lanterns", x: 800, y: -8, w: 150, cls: "sway lantern", t: 6.5, light: true },
          { s: "spark", x: 236, y: 520, w: 46, cls: "twinkle", t: 3.4 },
          { s: "spark", x: 930, y: 860, w: 40, cls: "twinkle", t: 4.1, d: -1.6 },
          { s: "couple", name: "figures", x: 548, y: 1604, w: 440, cls: "rise", delay: .5 }
        ],
        slots: [
          { key: "blessing", rect: [140, 280, 940, 384], font: "arabic", size: 62, color: GOLD, delay: .05 },
          { key: "eventType", rect: [140, 404, 940, 462], font: "caps", size: 37, track: ".32em", color: GOLD, delay: .15 },
          { key: "couple.first", rect: [70, 596, 1010, 806], font: "script", size: 170, delay: .3 },
          { key: "couple.second", rect: [70, 930, 1010, 1140], font: "script", size: 170, delay: .5 },
          { key: "event.dateText", rect: [140, 1232, 940, 1292], font: "caps", size: 38, track: ".26em", color: GOLD, delay: .7 }
        ],
        petals: { n: 3, y0: 60, y1: 100 } },

      { id: "hosts", W: 1080, H: 1560, lap: 0,
        overlays: [
          { s: "lantern", x: 96, y: -10, w: 92, cls: "sway lantern", t: 7, d: -2, light: true },
          { s: "lantern-b", x: 894, y: -10, w: 88, cls: "sway lantern", t: 6, d: -4, light: true }
        ],
        slots: [
          { key: "hosts.title", rect: [200, 396, 880, 476], font: "serif", italic: true, weight: 600, size: 58, delay: .1 },
          { key: "hosts.names", rect: [140, 480, 940, 590], font: "serif", weight: 700, size: 74, delay: .25 },
          { key: "hosts.message", rect: [250, 700, 830, 920], font: "serif", italic: true, weight: 600, size: 52, lh: 68, delay: .4 },
          { key: "couple.short", rect: [230, 950, 850, 1130], font: "script", size: 124, delay: .6 }
        ],
        petals: { n: 3, y0: 70, y1: 100 } },

      { id: "date", W: 1080, H: 1900, lap: 0,
        overlays: [
          { s: "spark-b", x: 60, y: 960, w: 70, cls: "twinkle", t: 3.6 },
          { s: "spark", x: 960, y: 1010, w: 56, cls: "twinkle", t: 2.9, d: -1.2 },
          { s: "spark", x: 930, y: 1690, w: 48, cls: "twinkle", t: 3.8, d: -2.2 },
          { s: "spark", x: 880, y: 560, w: 44, cls: "twinkle", t: 4.4, d: -.8 }
        ],
        reads: ["Save our date"],
        // printed on the burgundy card
        slots: [
          { key: "event.day", rect: [250, 1304, 830, 1368], font: "serif", weight: 600, size: 52, color: CREAM, delay: .2 },
          { key: "event.dateText", rect: [190, 1368, 890, 1462], font: "serif", weight: 700, size: 76, color: CARDGOLD, delay: .3 },
          { key: "event.time", join: " ", rect: [250, 1464, 830, 1530], font: "serif", weight: 600, size: 44, color: CREAM, delay: .4 }
        ],
        links: [
          { to: "calendar", rect: { x0: 305, y0: 1560, x1: 775, y1: 1674 }, label: "Save the date: add to your calendar", round: true }
        ],
        petals: { n: 2, y0: 0, y1: 50 } },

      { id: "venue", W: 1080, H: 1980, lap: 0,
        overlays: [
          { s: "spark", x: 880, y: 330, w: 42, cls: "twinkle", t: 3.7, d: -1 }
        ],
        slots: [
          { key: "ui.venueTitle", text: "The Venue", rect: [140, 236, 940, 408], font: "script", size: 150, delay: .1 },
          { key: "venue.name", rect: [110, 490, 970, 660], font: "serif", weight: 700, size: 74, lh: 80, delay: .25 },
          { key: "venue.address", rect: [130, 668, 950, 830], font: "serif", weight: 600, size: 42, lh: 53, valign: "top", delay: .35 },
          { key: "venue.area", rect: [270, 1050, 810, 1112], font: "sans", weight: 800, size: 42, color: "#16203f", track: ".02em", plain: true },
          { key: "venue.areaLocal", rect: [270, 1114, 810, 1180], font: "sans", weight: 600, size: 40, color: "#16203f", plain: true }
        ],
        links: [
          { to: "maps", rect: { x0: 220, y0: 1276, x1: 860, y1: 1413 }, label: "Take me there: open in Google Maps", round: true },
          { to: "maps", rect: { x0: 110, y0: 850, x1: 970, y1: 1233 }, label: "Open the venue in Google Maps" }
        ],
        petals: { n: 2, y0: 72, y1: 100 } },

      { id: "thanks", W: 1080, H: 1600, lap: 0,
        overlays: [
          { s: "spark", x: 770, y: 420, w: 44, cls: "twinkle", t: 3.3 },
          { s: "spark", x: 250, y: 1180, w: 40, cls: "twinkle", t: 4.2, d: -1.5 }
        ],
        slots: [
          { key: "ui.thanksTitle", text: "Thank You", rect: [100, 510, 980, 700], font: "script", size: 176, delay: .1 },
          { key: "closing.message", text: ["Your presence and your prayers", "are the greatest gift of all.", "We look forward to celebrating", "this blessed day with you."],
            rect: [150, 800, 930, 1070], font: "serif", italic: true, weight: 600, size: 48, lh: 64, delay: .3 },
          { key: "closing.label", text: "With love", rect: [200, 1110, 880, 1160], font: "caps", size: 32, track: ".32em", color: GOLD, delay: .45 },
          { key: "closing.from", rect: [170, 1166, 910, 1256], font: "serif", weight: 700, size: 60, delay: .55 }
        ],
        petals: { n: 3, y0: 70, y1: 100 } }
    ],
    ink: INK
  };
})();
