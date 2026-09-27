/* =====================================================================
   Theme: Floral Palace (engagement)
   Everything that belongs to the ARTWORK lives here: image sizes, where the
   ornaments, overlays, buttons and text slots sit. Nothing about a particular
   couple. All coordinates are in each image's own pixel space.

   blocks : [x0, y0, x1, y1, delay]  pieces of the plate that rise into view
   slots  : live wording, filled from the invitation's data by `key`
            size / lh are in image pixels; the engine shrinks a line that
            would not fit its rect, so long names never overflow
   ===================================================================== */
(function () {
  "use strict";
  var INK = "#8a1a3b";
  window.INVITE_THEME = {
    id: "floral-palace",
    base: new URL(".", document.currentScript.src).href,
    audio: "audio/background.mp3",
    og: "art/og.jpg",
    colors: { page: "#f4dfcc", theme: "#f3dcc8" },

    door: {
      W: 864, H: 1536, img: "art/door.webp", leafL: "art/door-leaf-l.webp", leafR: "art/door-leaf-r.webp",
      // only the two rectangular panels below the transom swing; the fanlight and its crest stay on the base art
      doorway: { x: 150, y: 362, w: 592, h: 1064 },
      pendant: { img: "art/door-pendant.webp", x: 388, y: 358, w: 90 }
    },

    sections: [
      { id: "ceremony", W: 736, H: 1536, lap: 0,
        overlays: [
          { s: "floral-pink-white", x: 104, y: 232, w: 78, cls: "sway", t: 6.5 },
          { s: "floral-daisy", x: 632, y: 268, w: 74, cls: "sway", t: 7.5, d: -3 }
        ],
        blocks: [[214, 462, 526, 566, .1], [42, 526, 700, 752, .25], [150, 738, 600, 806, .45], [120, 794, 530, 900, .6]],
        petals: { n: 3, y0: 62, y1: 100 },
        reads: ["eventType"] },

      { id: "welcome", W: 901, H: 1536, lap: 8,
        overlays: [
          { s: "floral-daisy", x: 590, y: -6, w: 92, cls: "sway", t: 7 },
          { s: "floral-pink-white", x: 806, y: 0, w: 76, cls: "sway", t: 6, d: -2 },
          { s: "floral-pink-white", x: 44, y: 224, w: 70, cls: "sway", t: 8, d: -4 }
        ],
        blocks: [[372, 242, 528, 348, .1], [270, 392, 630, 478, .2], [130, 470, 770, 580, .35], [392, 582, 508, 648, .45], [150, 652, 750, 846, .55], [372, 852, 528, 948, .7]],
        slots: [
          { key: "hosts.title", rect: [110, 406, 790, 484], font: "serif", italic: true, weight: 600, size: 62, delay: .2 },
          { key: "hosts.names", rect: [100, 488, 800, 572], font: "serif", weight: 700, size: 70, delay: .35 },
          { key: "hosts.message", rect: [110, 668, 790, 864], font: "serif", italic: true, weight: 600, size: 56, lh: 57, delay: .55 }
        ],
        petals: { n: 3, y0: 70, y1: 100 } },

      { id: "couple", W: 698, H: 1536, lap: 8,
        overlays: [
          { s: "floral-pink-white", x: 28, y: 284, w: 66, cls: "sway", t: 7, d: -1 },
          { s: "floral-daisy", x: 628, y: 140, w: 66, cls: "sway", t: 6.5, d: -3 }
        ],
        blocks: [[80, 308, 614, 470, .15], [100, 458, 594, 566, .3], [80, 554, 614, 730, .45], [150, 714, 550, 800, .6], [170, 788, 530, 860, .7]],
        slots: [
          { key: "couple.first", rect: [70, 312, 628, 474], font: "script", size: 138, delay: .15 },
          { key: "couple.second", rect: [70, 552, 628, 714], font: "script", size: 138, delay: .45 }
        ],
        petals: { n: 3, y0: 58, y1: 100 } },

      { id: "date", W: 732, H: 1536, lap: 8, kind: "envelope", open: "date-open",
        overlays: [
          { s: "floral-daisy", x: 26, y: 240, w: 78, cls: "sway", t: 7, d: -2 },
          { s: "floral-pink-white", x: 642, y: 232, w: 74, cls: "sway", t: 6, d: -5 }
        ],
        blocks: [[200, 286, 540, 358, .1], [118, 344, 652, 580, .25], [170, 890, 570, 1034, .5]],
        envelope: {
          // measured in the closed artwork
          seal: { cx: 397, cy: 776, r: 80 }, top: 600, glide: 130,
          cut: { img: "art/date-envelope.webp", x: 116, y: 584, w: 510, h: 394 },   // the envelope as a soft-edged cut-out
          body: [[129, 597], [611, 597], [611, 908], [604, 908], [600, 952], [558, 954], [520, 908], [256, 908], [242, 964], [148, 964], [138, 908], [129, 908]],
          hit: { x0: 130, y0: 590, x1: 610, y1: 970 },
          // measured in the open artwork
          card: { x0: 158, y0: 236, x1: 582, y1: 886 },
          btn: { x0: 226, y0: 776, x1: 522, y1: 836 }, btnY: 1102
        },
        // wording printed on the date card (it travels with the card)
        slots: [
          { key: "event.day", rect: [250, 532, 490, 570], font: "serif", weight: 600, size: 33, on: "card" },
          { key: "event.dateText", rect: [196, 570, 544, 612], font: "serif", weight: 700, size: 39, on: "card" },
          { key: "event.time", rect: [254, 660, 360, 720], font: "serif", weight: 600, size: 23, lh: 23, align: "left", on: "card" },
          { key: "event.extra", rect: [480, 654, 578, 734], font: "serif", weight: 600, size: 22, lh: 23, align: "left", on: "card" }
        ] },

      { id: "venue", W: 1180, H: 1536, lap: 8, kind: "venue",
        // the side columns are trimmed so the card, address and button draw ~20% larger on a phone
        crop: [100, 1080],
        overlays: [
          { s: "floral-daisy", x: 118, y: -10, w: 100, cls: "sway", t: 7.5 },
          { s: "floral-pink-white", x: 900, y: -16, w: 104, cls: "sway", t: 6.5, d: -3 }
        ],
        blocks: [[430, 82, 750, 148, .05], [530, 150, 650, 318, .15], [200, 300, 980, 452, .3], [320, 652, 860, 720, .55], [236, 1060, 970, 1234, .7]],
        slots: [
          { key: "venue.name", rect: [200, 306, 980, 462], font: "serif", weight: 700, size: 76, lh: 72, delay: .3 },
          { key: "venue.address", rect: [200, 466, 980, 640], font: "serif", weight: 700, size: 42, lh: 52, valign: "top", delay: .45 },
          { key: "venue.area", rect: [420, 922, 770, 964], font: "sans", weight: 800, size: 33, color: "#16203f", track: ".02em", plain: true },
          { key: "venue.areaLocal", rect: [420, 966, 770, 1026], font: "sans", weight: 600, size: 36, color: "#16203f", plain: true }
        ],
        links: [
          { to: "maps", rect: { x0: 272, y0: 1084, x1: 934, y1: 1210 }, label: "Open in Google Maps", round: true },
          { to: "maps", rect: { x0: 212, y0: 738, x1: 976, y1: 1060 }, label: "Open the venue in Google Maps" }
        ],
        petals: { n: 2, y0: 78, y1: 100 } },

      { id: "thanks", W: 1026, H: 1536, lap: 8,
        overlays: [
          { s: "lantern-round", x: 700, y: -4, w: 66, cls: "sway lantern", t: 6, light: true },
          { s: "floral-pink-white", x: 560, y: -14, w: 84, cls: "sway", t: 7, d: -2 }
        ],
        blocks: [[130, 296, 822, 570, .15], [822, 388, 896, 570, .15], [236, 558, 816, 732, .35], [210, 750, 840, 820, .45], [218, 820, 834, 1012, .55]],
        reads: ["Thank you for being a part of our special moments. Your love, blessings and presence make our celebration truly memorable."],
        petals: { n: 3, y0: 78, y1: 100 } },

      { id: "family", W: 686, H: 1536, lap: 8,
        overlays: [
          { s: "lantern-gold", x: 128, y: 92, w: 74, cls: "sway lantern", t: 6.5, d: -2, light: true },
          { s: "floral-daisy", x: 566, y: 58, w: 76, cls: "sway", t: 7.5, d: -4 }
        ],
        blocks: [[292, 482, 398, 568, .1], [72, 586, 618, 660, .25], [80, 672, 600, 738, .4], [110, 726, 590, 810, .55]],
        slots: [
          { key: "closing.from", rect: [120, 732, 566, 796], font: "serif", weight: 700, size: 46, delay: .55 }
        ],
        reads: ["With best compliments from"],
        petals: { n: 3, y0: 82, y1: 100 } }
    ],
    ink: INK
  };
})();
