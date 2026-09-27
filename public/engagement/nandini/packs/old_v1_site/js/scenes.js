/* =====================================================================
   Scene definitions — every scene is a design canvas in the pixel space of
   its finished reference image (W x H). Layers are the separated pack PNGs
   placed at (x, y, w) in that space; all wording is real HTML.
   fx : idle motion class (style.css)   t : motion period (s)
   rv : reveal direction on scroll      d : reveal delay (s)
   px : parallax depth (-1 .. 1)        z : stacking      o : opacity
   ===================================================================== */
const ASSET_VERSION = "2";

const EVENT = {
  title: "Engagement Ceremony of Nandini SS & Madhu N",
  startUTC: "20261115T050000Z",   // 10:30 IST
  endUTC:   "20261115T093000Z",   // 15:00 IST
  venue: "Udupi Sri Krishnarajathadri Party Hall",
  address: "330, 13th Cross Rd, near Sri Saibaba Devasthana, Vyalikaval, Kodandarampura, Malleshwaram, Bengaluru, Karnataka 560003",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Udupi Sri Krishnarajathadri Party Hall, 330, 13th Cross Rd, Vyalikaval, Kodandarampura, Malleshwaram, Bengaluru, Karnataka 560003"),
  icsFile: "event.ics"
};

/* text helpers */
const T = (cls, inner, d, style) => `<div class="t ${cls}" style="--d:${d || 0}s;${style || ""}">${inner}</div>`;
const HEART = `<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.4 3 5 6.4 5c2 0 3.4 1 4.3 2.4h2.6C14.2 6 15.6 5 17.6 5 21 5 23.1 8.4 21.6 11.7 19.5 16.4 12 21 12 21z"/></svg>`;
const FLEUR_PATH = `<path d="M20 2c2 5 1 9-2 12 1-6-1-8-4-9 2 3 2 7 3 10-4-2-8-2-11 0 4 0 7 2 9 5-3 0-5 1-6 3 3-1 6-1 8 1-3 2-4 5-3 8 1-3 3-5 6-6v12h1V26c3 1 5 3 6 6 1-3 0-6-3-8 2-2 5-2 8-1-1-2-3-3-6-3 2-3 5-5 9-5-3-2-7-2-11 0 1-3 1-7 3-10-3 1-5 3-4 9-3-3-4-7-2-12z"/>`;
const FLEUR = (s) => `<svg viewBox="0 0 40 40" style="width:${s};height:${s};fill:var(--gold);display:block;margin:0 auto">${FLEUR_PATH}</svg>`;
const DIVIDER = (d, plain, w) => T("", `<div class="divider${plain ? " plain" : ""}"${w ? ` style="width:${w}"` : ""}>${plain ? FLEUR("4cqw") : HEART}</div>`, d);
const ORN = (d, w) => T("", `<div class="orn-lines"${w ? ` style="width:${w}"` : ""}>${FLEUR("6cqw")}</div>`, d);
const SWIRL = `<svg class="swirl" viewBox="0 0 300 40"><path d="M4 26c40-14 80-14 112-2 8 3 14 4 20 2 6-2 10-8 14-8s8 6 14 8c6 2 12 1 20-2 32-12 72-12 112 2"/><path d="M150 18c-4-6-12-6-12 0 0 4 12 12 12 12s12-8 12-12c0-6-8-6-12 0z"/></svg>`;

const SCENES = [

/* ================= 1. ENGAGEMENT CEREMONY (868 x 1812) ================= */
{
  id: "ceremony", W: 868, H: 1812, ref: "2058df0a-881f-44bf-aa91-8b89c5e543c8.png", lap: 0, blur: "bg/ceremony-blur.jpg",
  layers: [
    { s: "cer/05_waterfall_gazebo_landscape.png", x: 84, y: 1010, w: 700, z: 2, mask: "land", fx: "shimmer", t: 12, rv: "fade", d: .5, px: -.5 },
    { s: "cer/01_complete_arch.png", x: 0, y: -10, w: 868, z: 5, rv: "scale", d: .1 },
    { s: "cer/02_left_curtain_florals.png", x: -12, y: -10, w: 236, z: 8, fx: "curtain", t: 10, rv: "left", d: .25 },
    { s: "cer/03_right_curtain_florals.png", x: 588, y: -12, w: 300, z: 8, fx: "curtain", t: 11, rv: "right", d: .3 },
    { s: "cer/18_hanging_pink_strands.png", x: 165, y: 330, w: 140, z: 9, fx: "sway", t: 8, rv: "up", d: .5 },
    { s: "cer/18_hanging_pink_strands.png", x: 688, y: 400, w: 140, z: 9, fx: "sway2", t: 9.5, rv: "up", d: .6 },
    { s: "cer/06_top_right_floral_cluster.png", x: 628, y: -10, w: 250, z: 12, fx: "float", t: 9, rv: "right", d: .35, px: .25 },
    { s: "cer/04_chandelier.png", x: 299, y: 66, w: 270, z: 14, fx: "chand", t: 8, rv: "down", d: .45, glint: true },
    { s: "cer/08_marble_steps_platform.png", x: 104, y: 1496, w: 660, z: 6, rv: "up", d: .4 },
    { s: "cer/09_gold_engagement_rings.png", x: 284, y: 1300, w: 310, z: 16, fx: "float", t: 7, rv: "up", d: .7, glint: true },
    { s: "cer/07_far_right_floral_cluster.png", x: 664, y: 1180, w: 222, z: 18, fx: "leaf", t: 9, rv: "right", d: .5, px: .35 },
    { s: "cer/11_teal_flower.png", x: 44, y: 1270, w: 150, z: 18, fx: "breathe", t: 8, rv: "left", d: .55 },
    { s: "cer/11_teal_flower.png", x: 696, y: 1350, w: 140, z: 19, fx: "breathe", t: 9, rv: "right", d: .6 },
    { s: "cer/10_red_flower.png", x: 52, y: 1382, w: 190, z: 20, fx: "breathe", t: 7.5, rv: "left", d: .65, px: .45 },
    { s: "cer/13_gold_leaf_sprig.png", x: 196, y: 1490, w: 112, z: 20, fx: "leaf", t: 7, rv: "up", d: .7, glint: true },
    { s: "cer/14_pink_flower_sprig.png", x: 686, y: 1520, w: 204, z: 21, fx: "leaf", t: 8.5, rv: "right", d: .7, px: .4 },
    { s: "cer/12_blush_flower.png", x: 146, y: 1560, w: 152, z: 22, fx: "breathe", t: 9, rv: "up", d: .75 },
    { s: "cer/12_blush_flower.png", x: 598, y: 1596, w: 150, z: 22, fx: "breathe", t: 8, rv: "up", d: .8 },
    { s: "cer/16_small_flower_sprigs.png", x: -4, y: 1640, w: 306, z: 23, fx: "leaf", t: 9, rv: "left", d: .8, px: .5 },
    { s: "cer/15_loose_petals.png", x: 296, y: 1686, w: 320, z: 24, fx: "drift", t: 16, rv: "fade", d: .9 }
  ],
  petals: { n: 7, z: 40 },
  texts: [
    { y: 548, z: 26, html:
      ORN(.55, "40%") +
      T("script", "Engagement", .7, "font-size:20cqw;line-height:.95;margin-top:-1%") +
      T("caps", "Ceremony", .95, "font-size:5.4cqw;margin-top:-1%") +
      DIVIDER(1.1, true, "62%") }
  ]
},

/* ================= 2. WELCOME (960 x 1637) ================= */
{
  id: "welcome", W: 960, H: 1637, ref: "156bd7d0-50ae-4883-b419-85530e7214c4.png", lap: 5, blur: "bg/welcome-blur.jpg",
  layers: [
    { s: "wel/05_waterfall_lake_landscape.png", x: 110, y: 900, w: 760, z: 2, mask: "land", fx: "shimmer", t: 13, rv: "fade", d: .4, px: -.5 },
    { s: "wel/08_palm_trees.png", x: 820, y: 430, w: 150, z: 3, fx: "leaf", t: 10, rv: "right", d: .5, px: -.3 },
    { s: "wel/07_gazebo.png", x: 668, y: 880, w: 300, z: 4, rv: "fade", d: .45, px: -.35 },
    { s: "wel/01_main_arch.png", x: 30, y: 90, w: 900, z: 5, rv: "scale", d: .1 },
    { s: "wel/02_top_center_floral_garland.png", x: 90, y: -30, w: 600, z: 8, fx: "sway2", t: 10, rv: "down", d: .25 },
    { s: "wel/03_top_right_floral_cluster.png", x: 700, y: -20, w: 260, z: 9, fx: "float", t: 9, rv: "right", d: .3, px: .25 },
    { s: "wel/04_far_right_hanging_garland.png", x: 870, y: -10, w: 95, z: 9, fx: "sway", t: 8, rv: "up", d: .4 },
    { s: "wel/18_hanging_pink_strands.png", x: 8, y: 270, w: 166, z: 9, fx: "sway", t: 9, rv: "up", d: .5 },
    { s: "wel/10_red_flower.png", x: -6, y: 10, w: 206, z: 12, fx: "breathe", t: 8, rv: "left", d: .35, px: .4 },
    { s: "wel/11_blue_flower.png", x: 100, y: 100, w: 200, z: 13, fx: "breathe", t: 9, rv: "left", d: .45, px: .35 },
    { s: "wel/15_green_leaf_sprigs.png", x: 26, y: 636, w: 204, z: 12, fx: "leaf", t: 8, rv: "left", d: .5 },
    { s: "wel/13_small_flower_sprigs.png", x: -14, y: 700, w: 206, z: 13, fx: "leaf", t: 9, rv: "left", d: .55, px: .3 },
    { s: "wel/12_blush_flower.png", x: 0, y: 780, w: 160, z: 13, fx: "breathe", t: 8, rv: "left", d: .55 },
    { s: "wel/06_balustrade.png", x: 30, y: 1380, w: 900, z: 10, rv: "up", d: .5 },
    { s: "wel/09_marble_steps.png", x: 0, y: 1500, w: 960, z: 11, rv: "up", d: .6 },
    { s: "wel/14_loose_petals.png", x: 376, y: 1466, w: 300, z: 14, fx: "drift", t: 15, rv: "fade", d: .9 },
    { s: "wel/12_blush_flower.png", x: -4, y: 1290, w: 200, z: 15, fx: "breathe", t: 8, rv: "left", d: .6 },
    { s: "wel/10_red_flower.png", x: 20, y: 1420, w: 220, z: 16, fx: "breathe", t: 9, rv: "left", d: .7, px: .5 },
    { s: "wel/19_bottom_right_rock_florals.png", x: 746, y: 1376, w: 224, z: 16, fx: "leaf", t: 10, rv: "right", d: .7, px: .45 },
    { s: "wel/17_gold_vertical_ornament.png", x: 420, y: 258, w: 120, z: 20, rv: "down", d: .5, glint: true }
  ],
  petals: { n: 6, z: 40 },
  texts: [
    { y: 440, z: 26, html:
      T("ital", "Mr. &amp; Mrs.", .6, "font-size:6.6cqw;line-height:1") +
      T("serif", "Shivanna &amp; Taradevi", .75, "font-size:7.8cqw;line-height:1.1;margin-top:.5%") +
      DIVIDER(.9, true, "52%") +
      T("ital", `<span class="line">Warmly welcome you</span><span class="line">to the Engagement Ceremony</span><span class="line">of their beloved daughter</span>`, 1.05, "font-size:5.6cqw;line-height:1.22;margin-top:4%") +
      DIVIDER(1.2, true, "52%") }
  ]
},

/* ================= 3. COUPLE (845 x 1860) ================= */
{
  id: "couple", W: 845, H: 1860, ref: "419aa18b-7e07-4d0a-9116-cad83c63fbfc.png", lap: 5, blur: "bg/couple-blur.jpg",
  layers: [
    { s: "cpl/05_waterfall_landscape.png", x: 40, y: 1020, w: 640, z: 2, mask: "land", fx: "shimmer", t: 12, rv: "fade", d: .4, px: -.5 },
    { s: "cpl/06_gazebo.png", x: 90, y: 1200, w: 170, z: 3, rv: "fade", d: .5, px: -.35 },
    { s: "cpl/01_main_arch.png", x: 8, y: -10, w: 830, z: 5, rv: "scale", d: .1 },
    { s: "cpl/02_top_hanging_florals.png", x: -10, y: -30, w: 760, z: 8, fx: "sway2", t: 10, rv: "down", d: .25 },
    { s: "cpl/03_top_right_floral.png", x: 610, y: -10, w: 240, z: 9, fx: "float", t: 9, rv: "right", d: .3, px: .25 },
    { s: "cpl/04_far_right_hanging_strands.png", x: 730, y: 110, w: 120, z: 9, fx: "sway", t: 8, rv: "up", d: .4 },
    { s: "cpl/14_right_hanging_garlands.png", x: 715, y: 560, w: 140, z: 9, fx: "sway2", t: 9, rv: "up", d: .5 },
    { s: "cpl/12_leaf_sprigs.png", x: -14, y: 860, w: 264, z: 12, fx: "leaf", t: 9, rv: "left", d: .45, px: .3 },
    { s: "cpl/13_right_floral_sprig.png", x: 690, y: 900, w: 160, z: 12, fx: "leaf", t: 8, rv: "right", d: .5, px: .3 },
    { s: "cpl/11_red_bud.png", x: 28, y: 1380, w: 92, z: 13, fx: "breathe", t: 8, rv: "left", d: .55 },
    { s: "cpl/10_pink_flower.png", x: 40, y: 1500, w: 110, z: 13, fx: "breathe", t: 9, rv: "left", d: .6 },
    { s: "cpl/08_balustrade.png", x: -20, y: 1610, w: 560, z: 10, rv: "up", d: .5 },
    { s: "cpl/09_marble_steps.png", x: -8, y: 1740, w: 860, z: 11, rv: "up", d: .6 },
    { s: "cpl/07_couple.png", x: 290, y: 1150, w: 600, z: 15, fx: "breathe", t: 9, rv: "up", d: .55, px: .15 },
    { s: "cpl/18_loose_petals.png", x: 88, y: 1760, w: 204, z: 16, fx: "drift", t: 15, rv: "fade", d: .9 },
    { s: "cpl/15_gold_leaf_flourish.png", x: 156, y: 574, w: 172, z: 20, rv: "left", d: .85, glint: true },
    { s: "cpl/15_gold_leaf_flourish.png", x: 516, y: 574, w: 172, z: 20, rv: "right", d: .85, flip: true, glint: true },
    { s: "cpl/17_gold_bottom_leaf_flourish.png", x: 244, y: 970, w: 356, z: 20, rv: "up", d: 1.15, glint: true }
  ],
  petals: { n: 6, z: 40 },
  texts: [
    { y: 400, z: 26, html:
      T("script", "Nandini SS", .6, "font-size:19.5cqw;line-height:.9") +
      T("gold", "&amp;", .8, "font-size:11cqw;line-height:.85;margin-top:-1%;font-family:'Cormorant Garamond',serif;font-weight:600") +
      T("script", "Madhu N", .95, "font-size:19.5cqw;line-height:.9;margin-top:-2%") +
      T("ital", `<span class="line">Two hearts,</span><span class="line">One beautiful journey...</span>`, 1.1, "font-size:5.4cqw;line-height:1.2;margin-top:1%") }
  ]
},

/* ================= 4. SAVE OUR DATE — envelope (866 x 1816) ================= */
{
  id: "date", W: 866, H: 1816, ref: "71450d76-568e-4e80-8e6e-df75eaaad0d9.png", lap: 5, kind: "envelope", blur: "bg/date-blur.jpg",
  layers: [
    { s: "env/12_waterfall_gazebo_landscape.png", x: 83, y: 1200, w: 700, z: 2, mask: "land", fx: "shimmer", t: 12, rv: "fade", d: .4, px: -.5 },
    { s: "env/01_main_arch.png", x: 10, y: -20, w: 846, z: 5, rv: "scale", d: .1 },
    { s: "env/02_top_floral_garland.png", x: -7, y: -60, w: 880, z: 8, fx: "sway2", t: 10, rv: "down", d: .25 },
    { s: "env/03_gold_hanging_ornament.png", x: 374, y: -5, w: 120, z: 9, fx: "pend", t: 6.5, rv: "down", d: .45, glint: true },
    { s: "env/04_hanging_flower_strands.png", x: -60, y: 240, w: 300, z: 9, fx: "sway", t: 9, rv: "up", d: .5 },
    { s: "env/04_hanging_flower_strands.png", x: 630, y: 230, w: 300, z: 9, fx: "sway2", t: 8.5, rv: "up", d: .55, flip: true },
    { s: "env/10_right_floral_cluster.png", x: 684, y: 630, w: 206, z: 12, fx: "leaf", t: 9, rv: "right", d: .45, px: .3 },
    { s: "env/10_right_floral_cluster.png", x: -24, y: 690, w: 206, z: 12, fx: "leaf", t: 10, rv: "left", d: .5, flip: true, px: .3 },
    { s: "env/11_right_floral_sprig.png", x: 728, y: 1056, w: 152, z: 12, fx: "leaf", t: 8, rv: "right", d: .55 },
    { s: "env/17_teal_flower.png", x: -2, y: 1288, w: 132, z: 13, fx: "breathe", t: 8, rv: "left", d: .55 },
    { s: "env/15_red_flower.png", x: 18, y: 1398, w: 144, z: 13, fx: "breathe", t: 9, rv: "left", d: .6, px: .4 },
    { s: "env/17_teal_flower.png", x: 738, y: 1436, w: 132, z: 13, fx: "breathe", t: 8.5, rv: "right", d: .6 },
    { s: "env/14_balustrade.png", x: 53, y: 1480, w: 760, z: 10, rv: "up", d: .5 },
    { s: "env/13_marble_steps.png", x: -7, y: 1600, w: 880, z: 11, rv: "up", d: .6 },
    { s: "env/16_blush_flower.png", x: -8, y: 1558, w: 162, z: 15, fx: "breathe", t: 9, rv: "left", d: .65 },
    { s: "env/18_leaf_sprigs.png", x: -6, y: 1650, w: 330, z: 16, fx: "leaf", t: 9, rv: "left", d: .7, px: .45 },
    { s: "env/19_loose_petals.png", x: 236, y: 1690, w: 400, z: 16, fx: "drift", t: 15, rv: "fade", d: .9 }
  ],
  envelope: { x: 158, y: 730, w: 550 },
  petals: { n: 6, z: 40 },
  texts: [
    { y: 350, z: 26, cls: "date-head", html:
      T("caps", "Save Our", .6, "font-size:6.2cqw;letter-spacing:.3em") +
      T("script", "Date", .75, "font-size:25cqw;line-height:.8;margin-top:-1%") +
      T("", SWIRL, .9, "margin-top:-3%") },
    { y: 1085, z: 26, cls: "date-tap", html:
      T("", `<svg viewBox="0 0 48 60" style="width:7cqw;height:8.5cqw;fill:none;stroke:var(--gold2);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;display:block;margin:0 auto"><path d="M20 30V12a4 4 0 0 1 8 0v18M28 24a4 4 0 0 1 8 0v6M36 28a4 4 0 0 1 8 0v12c0 8-6 16-16 16h-4c-6 0-9-3-12-8l-8-12a4 4 0 0 1 6-5l6 7"/><path d="M12 8a12 12 0 0 1 24 0" stroke-dasharray="2 3"/></svg>`, 1.0) +
      T("ital", `Tap to reveal our special date <span style="font-style:normal">♡</span>`, 1.1, "font-size:4.6cqw;margin-top:1.5%") }
  ]
},

/* ================= 5. VENUE (1099 x 1431) ================= */
{
  id: "venue", W: 1099, H: 1431, ref: "91d0620d-3c46-4525-ba6e-6f9fb872d592.png", lap: 4, kind: "venue", blur: "bg/venue-blur.jpg",
  layers: [
    { s: "ven/13_waterfall_gazebo_landscape.png", x: 270, y: 1090, w: 560, z: 2, mask: "land", fx: "shimmer", t: 12, rv: "fade", d: .4, px: -.5 },
    { s: "ven/03_venue_card.png", x: 100, y: 30, w: 900, z: 4, rv: "scale", d: .15, o: .92 },
    { s: "ven/01_main_floral_arch.png", x: 20, y: -30, w: 1060, z: 5, rv: "scale", d: .1 },
    { s: "ven/04_hanging_flower_strands.png", x: 90, y: -10, w: 250, z: 9, fx: "sway", t: 9, rv: "up", d: .4 },
    { s: "ven/04_hanging_flower_strands.png", x: 770, y: -10, w: 250, z: 9, fx: "sway2", t: 8.5, rv: "up", d: .45, flip: true },
    { s: "ven/06_right_floral_cluster.png", x: 826, y: 560, w: 282, z: 12, fx: "leaf", t: 9, rv: "right", d: .45, px: .3 },
    { s: "ven/06_right_floral_cluster.png", x: -12, y: 600, w: 282, z: 12, fx: "leaf", t: 10, rv: "left", d: .5, flip: true, px: .3 },
    { s: "ven/07_right_flower_sprig.png", x: 936, y: 880, w: 164, z: 12, fx: "leaf", t: 8, rv: "right", d: .5 },
    { s: "ven/11_leaf_sprigs.png", x: -12, y: 950, w: 142, z: 12, fx: "leaf", t: 9, rv: "left", d: .55 },
    { s: "ven/12_balustrade_steps.png", x: 50, y: 1140, w: 1000, z: 10, rv: "up", d: .5 },
    { s: "ven/14_small_flower_sprigs.png", x: -20, y: 1160, w: 304, z: 14, fx: "leaf", t: 9, rv: "left", d: .6, px: .4 },
    { s: "ven/09_blue_flower.png", x: 948, y: 1060, w: 132, z: 14, fx: "breathe", t: 8, rv: "right", d: .6 },
    { s: "ven/08_red_flower.png", x: -6, y: 1240, w: 204, z: 15, fx: "breathe", t: 9, rv: "left", d: .65, px: .45 },
    { s: "ven/08_red_flower.png", x: 906, y: 1258, w: 196, z: 15, fx: "breathe", t: 8, rv: "right", d: .65, flip: true, px: .45 },
    { s: "ven/10_blush_flower.png", x: 138, y: 1298, w: 162, z: 16, fx: "breathe", t: 9, rv: "up", d: .7 },
    { s: "ven/16_loose_petals.png", x: 336, y: 1318, w: 404, z: 16, fx: "drift", t: 15, rv: "fade", d: .9 },
    { s: "ven/15_gold_divider.png", x: 440, y: 72, w: 220, z: 20, rv: "down", d: .5, glint: true }
  ],
  map: { x: 195, y: 680, w: 710 },
  petals: { n: 5, z: 40 },
  texts: [
    { y: 168, z: 26, cls: "venue-text", html:
      T("", `<svg class="pin" viewBox="0 0 24 30"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18C24 5.4 18.6 0 12 0zm0 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/></svg>`, .55) +
      T("name", `<span class="line">Udupi Sri Krishnarajathadri</span><span class="line">Party Hall</span>`, .7) +
      T("addr", `<span class="line">330, 13th Cross Rd, near Sri Saibaba</span><span class="line">Devastana, Vyalikaval, Kodandarampura,</span><span class="line">Malleshwaram, Bengaluru,</span><span class="line">Karnataka 560003</span>`, .85) +
      DIVIDER(1.0) },
    { y: 1010, z: 27, html: T("", `<a class="btn venue-btn" href="${EVENT.mapsUrl}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg><span class="sep"></span><span>Open in Google Maps</span></a>`, 1.1) }
  ]
},

/* ================= 6. LORD GANESHA (979 x 1606) ================= */
{
  id: "ganesha", W: 979, H: 1606, ref: "44ca107d-03c4-469c-9cb4-9d41e51bb9a7.png", lap: 7,
  backdrop: "bg/ganesha.jpg",
  flames: [
    { x: 176, y: 686, w: 90 }, { x: 806, y: 686, w: 90 },
    { x: 130, y: 726, w: 60, d: .4 }, { x: 852, y: 726, w: 60, d: .7 },
    { x: 182, y: 322, w: 60, d: .2 }, { x: 800, y: 322, w: 60, d: .9 },
    { x: 84, y: 754, w: 46, d: 1.1 }, { x: 895, y: 754, w: 46, d: .5 }
  ],
  layers: [
    { s: "ff/05_hanging_strings.png", x: 40, y: -20, w: 220, z: 11, fx: "sway", t: 9, rv: "up", d: .4, o: .95 },
    { s: "ff/05_hanging_strings.png", x: 720, y: -20, w: 220, z: 11, fx: "sway2", t: 8.5, rv: "up", d: .45, flip: true, o: .95 }
  ],
  petals: { n: 6, z: 40 },
  texts: [
    { y: 1092, z: 26, html:
      T("ital", "With the blessings of", .5, "font-size:5.1cqw;line-height:1.1") +
      T("serif", "Lord Ganesha", .65, "font-size:6.4cqw;line-height:1.1;margin-top:.5%") +
      T("ital", `<span class="line">may this new journey be filled</span><span class="line">with love, happiness and prosperity.</span>`, .8, "font-size:5.1cqw;line-height:1.2;margin-top:1%") }
  ]
},

/* ================= 7. FAMILY & FRIENDS — peacock (838 x 1877) ================= */
{
  id: "peacock", W: 838, H: 1877, ref: "09d21895-6c7c-4f79-a582-73423de01f6f.png", lap: 4, kind: "panel", blur: "bg/peacock-blur.jpg",
  layers: [
    { s: "cer/05_waterfall_gazebo_landscape.png", x: 30, y: 200, w: 780, z: 2, mask: "land", fx: "shimmer", t: 12, rv: "fade", d: .5, px: -.5 },
    { s: "env/12_waterfall_gazebo_landscape.png", x: 60, y: 980, w: 720, z: 2, mask: "land", fx: "shimmer", t: 10, rv: "fade", d: .6, px: -.4 },
    { s: "pk/05_gazebo.png", x: 598, y: 1100, w: 176, z: 3, rv: "fade", d: .5, px: -.35 },
    { s: "pk/07_left_pillar.png", x: 20, y: 880, w: 80, z: 4, rv: "fade", d: .3 },
    { s: "pk/08_right_pillar.png", x: 740, y: 860, w: 80, z: 4, rv: "fade", d: .3 },
    { s: "pk/01_complete_arch_with_flower_corners.png", x: 0, y: -20, w: 838, z: 5, rv: "scale", d: .1 },
    { s: "ff/19_hanging_gold_lantern.png", x: 386, y: 150, w: 72, z: 8, fx: "pend", t: 6, rv: "down", d: .5, glint: true },
    { s: "pk/09_hanging_flower_strands.png", x: 590, y: 220, w: 90, z: 8, fx: "sway", t: 8, rv: "up", d: .45 },
    { s: "pk/09_hanging_flower_strands.png", x: 90, y: 200, w: 60, z: 8, fx: "sway2", t: 9, rv: "up", d: .5 },
    { s: "pk/02_top_floral_garland.png", x: 430, y: -10, w: 420, z: 9, fx: "sway2", t: 10, rv: "right", d: .3, px: .25 },
    { s: "pk/12_right_flower_cluster.png", x: 610, y: 60, w: 230, z: 10, fx: "leaf", t: 9, rv: "right", d: .4, px: .3 },
    { s: "pk/11_left_flower_cluster.png", x: 58, y: 470, w: 140, z: 10, fx: "leaf", t: 9, rv: "left", d: .45, px: .3 },
    { s: "pk/06_balustrade.png", x: 34, y: 1290, w: 770, z: 12, rv: "up", d: .5 },
    { s: "pk/10_marble_steps.png", x: -10, y: 1690, w: 860, z: 13, rv: "up", d: .6 },
    { s: "cer/14_pink_flower_sprig.png", x: -8, y: 1000, w: 262, z: 14, fx: "leaf", t: 9, rv: "left", d: .5, px: .35 },
    { s: "pk/03_peacock.png", x: 230, y: 1090, w: 620, z: 16, fx: "peacock", rv: "up", d: .55, px: .12 },
    { s: "wel/10_red_flower.png", x: 18, y: 1556, w: 222, z: 18, fx: "breathe", t: 8, rv: "left", d: .6, px: .45 },
    { s: "wel/12_blush_flower.png", x: 150, y: 1650, w: 172, z: 19, fx: "breathe", t: 9, rv: "up", d: .65 },
    { s: "cer/12_blush_flower.png", x: -4, y: 1706, w: 152, z: 19, fx: "breathe", t: 8, rv: "left", d: .7 },
    { s: "pk/15_bottom_flower_cluster.png", x: 0, y: 1740, w: 164, z: 20, fx: "leaf", t: 9, rv: "left", d: .75 },
    { s: "pk/13_petals_group.png", x: 180, y: 1760, w: 400, z: 20, fx: "drift", t: 15, rv: "fade", d: .9 },
    { s: "ff/18_gold_ornament_small.png", x: 348, y: 590, w: 142, z: 24, rv: "down", d: .7, glint: true }
  ],
  panel: { x: 90, y: 540, w: 660 },
  petals: { n: 6, z: 40 },
  texts: [
    { y: 720, z: 26, html: T("ital", "With best compliments from", .8, "font-size:6.4cqw;line-height:1") },
    { y: 838, z: 26, html: DIVIDER(.95, false, "50%") + T("serif", "Family &amp; Friends", 1.1, "font-size:7.8cqw;line-height:1;margin-top:4%") }
  ]
},

/* ================= 8. THANK YOU (1025 x 1535) ================= */
{
  id: "thanks", W: 1025, H: 1535, ref: "ffd6537b-52fa-4ef1-b18e-a76eb6a811cb.png", lap: 8,
  backdrop: "bg/thankyou.jpg", last: true,
  layers: [
    { s: "door/10_pink_butterfly.png", x: 120, y: 560, w: 120, z: 12, fx: "butterfly", t: 14, wings: true, rv: "fade", d: .8 },
    { s: "door/11_blue_butterfly.png", x: 640, y: 1020, w: 110, z: 12, fx: "butterfly", t: 17, wings: true, rv: "fade", d: 1.0, o: .95 },
    { s: "env/19_loose_petals.png", x: 120, y: 1380, w: 360, z: 12, fx: "drift", t: 16, rv: "fade", d: .8, o: .85 }
  ],
  water: { y: 1150 },
  petals: { n: 5, z: 40 },
  texts: [
    { y: 350, z: 26, html:
      T("script", "Thank You", .5, "font-size:21cqw;line-height:.9") +
      T("ital", `<span class="line">for being a part of</span><span class="line">our special moments.</span>`, .7, "font-size:6cqw;line-height:1.15;margin-top:-1%") +
      DIVIDER(.85) +
      T("", `<span class="line" style="font-weight:600;font-size:4.8cqw;line-height:1.25">Your love, blessings and presence</span><span class="line" style="font-weight:600;font-size:4.8cqw;line-height:1.25">make our celebration</span><span class="line" style="font-weight:600;font-size:4.8cqw;line-height:1.25">truly memorable.</span>`, 1.0, "margin-top:3%") }
  ]
}
];

/* ================= DOOR (entrance, 941 x 1672) ================= */
const DOOR = {
  W: 941, H: 1672,
  florals: [
    { s: "door/04_top_left_floral.png", x: -24, y: -14, w: 372, z: 6, fx: "float", t: 9 },
    { s: "door/06_top_right_floral.png", x: 512, y: -12, w: 464, z: 6, fx: "float", t: 10 },
    { s: "door/08_center_hanging_floral.png", x: 128, y: 150, w: 124, z: 6, fx: "sway", t: 8 },
    { s: "door/08_center_hanging_floral.png", x: 800, y: 130, w: 124, z: 6, fx: "sway2", t: 9, flip: true },
    { s: "door/07_left_side_floral.png", x: -10, y: 300, w: 176, z: 7, fx: "leaf", t: 9 },
    { s: "door/21_right_leaf_sprigs.png", x: 680, y: 700, w: 300, z: 7, fx: "leaf", t: 10 },
    { s: "door/18_blue_flower.png", x: 20, y: 1150, w: 150, z: 8, fx: "breathe", t: 8 },
    { s: "door/17_red_flower.png", x: 0, y: 1360, w: 196, z: 8, fx: "breathe", t: 9 },
    { s: "door/16_flower_sprig.png", x: 690, y: 1400, w: 150, z: 8, fx: "leaf", t: 8 },
    { s: "door/20_bottom_flower_set.png", x: 560, y: 1500, w: 380, z: 8, fx: "breathe", t: 9 },
    { s: "door/10_pink_butterfly.png", x: 40, y: 640, w: 140, z: 9, fx: "butterfly", t: 12, wings: true },
    { s: "door/11_blue_butterfly.png", x: 770, y: 1230, w: 140, z: 9, fx: "butterfly", t: 15, wings: true }
  ]
};
