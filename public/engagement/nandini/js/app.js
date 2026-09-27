/* =====================================================================
   V2 engine: approved reference templates as-is + a few overlays,
   the door entrance, the Save-Our-Date envelope, calendar + maps.
   ===================================================================== */
(function () {
  "use strict";
  const V = "?v=8";
  // the supplied PNGs are served untouched (no re-encoding) so the artwork stays as sharp as the source files allow
  const A = (s) => "assets/v2/" + s + V;
  const qs = new URLSearchParams(location.search);
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SKIP_DOOR = qs.has("nodoor");
  const K = qs.has("slow") ? 6 : 1;            // debug: ?slow=1 stretches the door/envelope choreography 6x for inspection
  document.documentElement.style.setProperty("--k", K);

  const EVENT = {
    title: "Nandini S S & Madhu N Engagement",
    startUTC: "20261115T050000Z", endUTC: "20261115T093000Z",
    details: "Engagement Ceremony · Sunday, 15 November 2026 · 10:30 AM onwards · Lunch 12:30 PM onwards",
    venue: "Udupi Sri Krishnarajathadri Party Hall",
    address: "330, 13th Cross Rd, near Sri Saibaba Devastana, Malleshwaram, Bengaluru, Karnataka 560003",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Udupi Sri Krishnarajathadri Party Hall, 330, 13th Cross Rd, near Sri Saibaba Devastana, Malleshwaram, Bengaluru, Karnataka 560003"),
    ics: "event.ics" + V
  };

  /* ---- section list: approved templates in supplied order (W/H = image pixels) ---- */
  const SECTIONS = [
    /* overlays = the pack's hanging garlands / lanterns placed where the artwork already hangs strands, so the painted
       strands read as the moving ones; positions are in each image's pixel space and never reach the text areas */
    /* blocks = the baked text/ornament groups of each reference (image px). The section shows a copy of the reference with
       those blocks cleared, and each block is a pixel-exact clip of the original that fades/rises in when it scrolls into view,
       so the typography stays exactly as designed and nothing is duplicated. */
    { id: "ceremony", img: "02_Engagement_Ceremony.png", W: 736, H: 1536, lap: 0,
      overlays: [
        { s: "04_floral_hanging_pink_white.png", x: 104, y: 232, w: 78, cls: "sway", t: 6.5 },
        { s: "06_floral_hanging_daisy.png", x: 632, y: 268, w: 74, cls: "sway", t: 7.5, d: -3 }
      ],
      blocks: [[214, 462, 526, 566, .1], [42, 526, 700, 752, .25], [150, 738, 600, 806, .45], [120, 794, 530, 900, .6]],
      petals: { n: 3, y0: 62, y1: 100 } },
    { id: "welcome", img: "03_Parents_Welcome.png", W: 901, H: 1536, lap: 8,
      overlays: [
        { s: "06_floral_hanging_daisy.png", x: 590, y: -6, w: 92, cls: "sway", t: 7 },
        { s: "04_floral_hanging_pink_white.png", x: 806, y: 0, w: 76, cls: "sway", t: 6, d: -2 },
        { s: "04_floral_hanging_pink_white.png", x: 44, y: 224, w: 70, cls: "sway", t: 8, d: -4 }
      ],
      blocks: [[372, 242, 528, 348, .1], [270, 392, 630, 478, .2], [130, 470, 770, 580, .35], [392, 582, 508, 648, .45], [150, 652, 750, 846, .55], [372, 852, 528, 948, .7]],
      petals: { n: 3, y0: 70, y1: 100 } },
    { id: "couple", img: "04_Nandini_Madhu.png", W: 698, H: 1536, lap: 8,
      overlays: [
        { s: "04_floral_hanging_pink_white.png", x: 28, y: 284, w: 66, cls: "sway", t: 7, d: -1 },
        { s: "06_floral_hanging_daisy.png", x: 628, y: 140, w: 66, cls: "sway", t: 6.5, d: -3 }
      ],
      blocks: [[80, 308, 614, 470, .15], [100, 458, 594, 566, .3], [80, 554, 614, 730, .45], [150, 714, 550, 800, .6], [170, 788, 530, 860, .7]],
      petals: { n: 3, y0: 58, y1: 100 } },
    { id: "date", img: "05_Save_Our_Date_Closed.png", open: "06_Save_Our_Date_Open.png", W: 732, H: 1536, lap: 8, kind: "env",
      overlays: [
        { s: "06_floral_hanging_daisy.png", x: 26, y: 240, w: 78, cls: "sway", t: 7, d: -2 },
        { s: "04_floral_hanging_pink_white.png", x: 642, y: 232, w: 74, cls: "sway", t: 6, d: -5 }
      ],
      blocks: [[200, 286, 540, 358, .1], [118, 344, 652, 580, .25], [170, 890, 570, 1034, .5]],
      // measured in the closed reference
      seal: { cx: 397, cy: 776, r: 80 },
      flap: [[138, 604], [602, 604], [372, 776]],   // top flap triangle (tip hidden behind the seal)
      flapY: 604, pocketY: 616,
      // measured in the open reference
      card: { x0: 158, y0: 236, x1: 582, y1: 886 },
      btn: { x0: 226, y0: 776, x1: 522, y1: 836 },   // the card's button in the open reference; shown below the envelope at btnY
      glide: 130, btnY: 1102 },
    { id: "venue", img: "07_Venue_Maps.png", W: 1180, H: 1536, lap: 8, kind: "venue",
      btn: { x0: 272, y0: 1084, x1: 934, y1: 1210 },
      overlays: [
        { s: "06_floral_hanging_daisy.png", x: 118, y: -10, w: 100, cls: "sway", t: 7.5 },
        { s: "04_floral_hanging_pink_white.png", x: 900, y: -16, w: 104, cls: "sway", t: 6.5, d: -3 }
      ],
      blocks: [[430, 82, 750, 148, .05], [530, 150, 650, 318, .15], [200, 300, 980, 452, .3], [320, 652, 860, 720, .55], [236, 1060, 970, 1234, .7]],
      petals: { n: 2, y0: 78, y1: 100 },
      // the painted address block was cleared from the artwork; the corrected address is set in the same position and style
      address: { y: 466, lines: ["330, 13th Cross Rd, near Sri Saibaba Devastana,", "Malleshwaram, Bengaluru,", "Karnataka 560003"] } },
    { id: "thanks", img: "08_Thank_You.png", W: 1026, H: 1536, lap: 8,
      overlays: [
        { s: "02_hanging_lantern_round.png", x: 700, y: -4, w: 66, cls: "sway lantern", t: 6, light: true },
        { s: "04_floral_hanging_pink_white.png", x: 560, y: -14, w: 84, cls: "sway", t: 7, d: -2 }
      ],
      blocks: [[130, 296, 822, 570, .15], [822, 388, 896, 570, .15], [236, 558, 816, 732, .35], [210, 750, 840, 820, .45], [218, 820, 834, 1012, .55]],
      petals: { n: 3, y0: 78, y1: 100 } },
    { id: "family", img: "09_Family_Friends.png", W: 686, H: 1536, lap: 8,
      overlays: [
        { s: "01_hanging_lantern_gold.png", x: 128, y: 92, w: 74, cls: "sway lantern", t: 6.5, d: -2, light: true },
        { s: "06_floral_hanging_daisy.png", x: 566, y: 58, w: 76, cls: "sway", t: 7.5, d: -4 }
      ],
      blocks: [[292, 482, 398, 568, .1], [72, 586, 618, 660, .25], [80, 672, 600, 738, .4], [110, 726, 590, 810, .55]],
      petals: { n: 3, y0: 82, y1: 100 } }
  ];

  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const setv = (e, o) => { for (const k in o) if (o[k] != null) e.style.setProperty("--" + k, o[k]); };
  const pct = (v, base) => (v / base * 100).toFixed(3) + "%";

  function overlay(o, S) {
    const d = el("div", "ov " + (o.cls || "")); setv(d, { x: o.x, y: o.y, w: o.w, t: o.t ? o.t + "s" : null, d: o.d != null ? o.d + "s" : null });
    if (o.light) { const g = el("div", "lantern-light"); setv(g, { t: (4 + Math.random() * 2).toFixed(1) + "s" }); d.appendChild(g); }
    const img = el("img"); img.src = A(o.s); img.alt = ""; img.loading = "lazy"; img.decoding = "async"; d.appendChild(img);
    return d;
  }
  function petals(p) {
    const box = el("div", "petals"); setv(box, { y0: p.y0, y1: p.y1 });
    const n = REDUCED ? 0 : p.n;
    for (let i = 0; i < n; i++) {
      const q = el("div", "petal " + ["", "p2", "p3"][i % 3]);
      setv(q, { px: (6 + Math.random() * 88).toFixed(1) + "%", s: (2 + Math.random() * 1.6).toFixed(2), t: (12 + Math.random() * 8).toFixed(1) + "s", d: (-Math.random() * 20).toFixed(1) + "s", dx: (Math.random() * 12 - 6).toFixed(1) + "%" });
      box.appendChild(q);
    }
    return box;
  }
  function hit(S, b, cls, label) {
    const h = el("a", "hit " + cls); setv(h, { x: b.x0, y: b.y0, w: b.x1 - b.x0, h: b.y1 - b.y0 }); h.setAttribute("aria-label", label); return h;
  }

  function buildSection(S, i) {
    const s = el("section", "sec" + (S.kind === "env" ? " env" : "")); s.id = S.id;
    setv(s, { W: S.W, H: S.H, w: S.W, h: S.H, lap: S.lap, fade: S.lap ? (S.lap * 1.05).toFixed(1) + "%" : "0%" });
    const hasBlocks = S.blocks && S.blocks.length;
    const img = el("img", "ref"); img.src = A(hasBlocks ? S.img.replace(/\.png$/i, "_clean.png") : S.img); img.alt = ""; img.loading = (i > 1 && !qs.has("eager")) ? "lazy" : "eager"; img.decoding = "async"; s.appendChild(img);
    (S.blocks || []).forEach(b => {
      const t = el("div", "tblock"); t.style.backgroundImage = "url(" + A(S.img) + ")";
      t.style.clipPath = "inset(" + pct(b[1], S.H) + " " + pct(S.W - b[2], S.W) + " " + pct(S.H - b[3], S.H) + " " + pct(b[0], S.W) + ")";
      t.style.transitionDelay = b[4] + "s";
      const sent = el("div", "tsent"); setv(sent, { x: b[0], y: b[1], w: b[2] - b[0], h: b[3] - b[1] }); sent._block = t;
      s.appendChild(t); s.appendChild(sent);
    });
    (S.overlays || []).forEach(o => s.appendChild(overlay(o, S)));
    if (S.petals) s.appendChild(petals(S.petals));
    if (S.kind === "env") buildEnvelope(S, s);
    if (S.kind === "venue") {
      if (S.address) {
        const t = el("div", "address tblock-text", S.address.lines.map(l => "<span>" + l + "</span>").join("")); t.style.top = (S.address.y / S.H * 100) + "%"; t.style.transitionDelay = ".45s"; s.appendChild(t);
        const sent = el("div", "tsent"); setv(sent, { x: 200, y: S.address.y, w: 780, h: 150 }); sent._block = t; s.appendChild(sent);
      }
      const h = hit(S, S.btn, "maps-btn", "Open in Google Maps"); h.href = EVENT.mapsUrl; h.target = "_blank"; h.rel = "noopener"; s.appendChild(h);
    }
    return s;
  }

  /* ---- envelope: built from the CLOSED artwork only (plus the open artwork's card, a self-contained object).
     Rest = the closed reference untouched. Tap: seal press -> heading/tap line fade -> the sealed envelope glides down while
     the date card rises out of its top edge through a pocket window (so the envelope always masks the card's lower part) ->
     the card's Save-the-Date button settles in below the envelope. No cross-fades between the two references. ---- */
  function buildEnvelope(S, s) {
    const W = S.W, H = S.H;
    const P = (pts) => "polygon(" + pts.map(p => pct(p[0], W) + " " + pct(p[1], H)).join(",") + ")";
    const envPoly = P([[129, 597], [611, 597], [611, 908], [604, 908], [600, 952], [558, 954], [520, 908], [256, 908], [242, 964], [148, 964], [138, 908], [129, 908]]);
    const seal = "circle(" + pct(S.seal.r, W) + " at " + pct(S.seal.cx, W) + " " + pct(S.seal.cy, H) + ")";
    const card = "inset(" + pct(S.card.y0, H) + " " + pct(W - S.card.x1, W) + " " + pct(H - S.card.y1, H) + " " + pct(S.card.x0, W) + " round 1.2%)";
    const btn = "inset(" + pct(S.btn.y0, H) + " " + pct(W - S.btn.x1, W) + " " + pct(H - S.btn.y1, H) + " " + pct(S.btn.x0, W) + " round 999px)";
    const glide = S.glide, envTop = 600;
    setv(s, { glide: pct(glide, H), pocket0: pct(envTop - S.card.y0, H), pocket1: pct(envTop + glide - S.card.y0, H), pocketTop: pct(S.card.y0, H),
      cardStart: pct(envTop - S.card.y0, H), btnShift: pct(S.btnY - S.btn.y0, H), sealX: pct(S.seal.cx, W), sealY: pct(S.seal.cy, H) });
    const closed = "url(" + A(S.img) + ")", open = "url(" + A(S.open) + ")";

    const pocket = el("div", "pocket");                                   // window from the card's final top down to the envelope's top edge
    const cardEl = el("div", "copy card"); cardEl.style.backgroundImage = open; cardEl.style.clipPath = card; pocket.appendChild(cardEl); s.appendChild(pocket);
    const mv = el("div", "envmove");                                      // the sealed envelope (with its seal) as one gliding unit
    const body = el("div", "copy envbody"); body.style.backgroundImage = closed; body.style.clipPath = envPoly; mv.appendChild(body);
    const se = el("div", "copy seal"); se.id = "envSeal"; se.style.backgroundImage = closed; se.style.clipPath = seal; mv.appendChild(se);
    s.appendChild(mv);
    const bt = el("div", "copy cardbtn"); bt.style.backgroundImage = open; bt.style.clipPath = btn; s.appendChild(bt);
    const envHit = hit(S, { x0: 130, y0: 590, x1: 610, y1: 970 }, "env-hit", "Tap to reveal our special date"); envHit.id = "envHit"; envHit.href = "#"; envHit.setAttribute("role", "button"); s.appendChild(envHit);
    const dateBtn = hit(S, { x0: S.btn.x0, y0: S.btnY, x1: S.btn.x1, y1: S.btnY + (S.btn.y1 - S.btn.y0) }, "date-btn", "Save the Date — add to calendar"); dateBtn.id = "saveDate"; dateBtn.href = EVENT.ics; dateBtn.setAttribute("role", "button"); s.appendChild(dateBtn);
  }
  function openEnvelope() {
    const s = document.getElementById("date");
    if (!s || s.classList.contains("open") || s.dataset.busy) return;
    s.dataset.busy = "1";
    const seal = document.getElementById("envSeal");
    seal.classList.add("press");
    setTimeout(() => { seal.classList.remove("press"); seal.classList.add("release"); }, 200 * K);
    setTimeout(() => { seal.classList.remove("release"); s.classList.add("open"); }, 420 * K);
    setTimeout(() => { const c = s.querySelector(".card").getBoundingClientRect(); if (c.top < 8) window.scrollBy({ top: c.top - 20, behavior: "smooth" }); }, 1900 * K);
  }
  /* ---- calendar ---- */
  function gcalUrl() {
    const p = new URLSearchParams({ action: "TEMPLATE", text: EVENT.title, dates: EVENT.startUTC + "/" + EVENT.endUTC, details: EVENT.details, location: EVENT.venue + ", " + EVENT.address, ctz: "Asia/Kolkata" });
    return "https://calendar.google.com/calendar/render?" + p.toString();
  }
  let toastT;
  function toast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 3200); }
  function saveTheDate() {
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    
    if (isAndroid) window.open(gcalUrl(), "_blank", "noopener");
    else if (isIOS) window.location.href = EVENT.ics;
    else { const a = document.createElement("a"); a.href = EVENT.ics; a.download = "Nandini-Madhu-Engagement.ics"; document.body.appendChild(a); a.click(); a.remove(); }
    toast("Added to your calendar ✓");
  }

  /* ---- door ---- */
  const DOOR = { W: 864, H: 1536 };
  function sizeDoor() {
    // fit the full height of the door artwork to the viewport (crest and steps always complete); on phones narrower than
    // 9:16 only the outer floral margin leaves the screen, on wider screens the ambient ivory fills the sides
    const k = innerHeight / DOOR.H;
    const st = document.getElementById("doorStage"); if (!st) return;
    st.style.setProperty("--dw", (DOOR.W * k) + "px"); st.style.setProperty("--dh", (DOOR.H * k) + "px");
  }
  /* ---- background music: one looping element for the whole invitation, started by the door tap (first gesture) ---- */
  const bgm = document.getElementById("bgm"), muteBtn = document.getElementById("mute");
  let muted = false; try { muted = localStorage.getItem("bgm-muted") === "1"; } catch (e) {}
  function applyMute() { bgm.muted = muted; muteBtn.classList.toggle("is-muted", muted); muteBtn.setAttribute("aria-pressed", muted ? "true" : "false"); muteBtn.setAttribute("aria-label", muted ? "Unmute music" : "Mute music"); }
  function startMusic() {
    bgm.volume = 0.45; applyMute(); muteBtn.hidden = false;
    const p = bgm.play(); if (p && p.catch) p.catch(() => { /* if playback is refused, the first later tap retries below */ });
  }
  document.addEventListener("pointerdown", () => { if (entered && bgm.paused && !muted) { const p = bgm.play(); if (p && p.catch) p.catch(() => {}); } }, { passive: true });
  muteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); muted = !muted; try { localStorage.setItem("bgm-muted", muted ? "1" : "0"); } catch (err) {}
    applyMute(); if (!muted && bgm.paused) { const p = bgm.play(); if (p && p.catch) p.catch(() => {}); }
  });

  let entered = false;
  function enter() {
    if (entered) return; entered = true;
    startMusic();
    const ent = document.getElementById("entrance"), veil = document.getElementById("veil");
    ent.classList.add("opening");
    const T1 = (REDUCED ? 500 : 1500) * K, T2 = (REDUCED ? 1300 : 2400) * K;
    if (qs.has("hold")) return;                 // debug: freeze the entrance so its animations can be scrubbed
    setTimeout(() => veil.classList.add("on"), Math.max(100, T1 - 900));
    setTimeout(() => {
      ent.classList.add("gone");
      document.body.classList.remove("locked");
      document.getElementById("invite").setAttribute("aria-hidden", "false");
      window.scrollTo(0, 0);
      veil.classList.remove("on"); veil.classList.add("off");
      setTimeout(() => veil.remove(), 1600);
      startObservers();
    }, T2);
  }

  /* ---- observers ---- */
  let started = false;
  function startObservers() {
    if (started) return; started = true;
    const secs = [...document.querySelectorAll(".sec")];
    const sents = [...document.querySelectorAll(".tsent")];
    const check = () => {
      const vh = innerHeight;
      secs.forEach(s => { const r = s.getBoundingClientRect(); s.classList.toggle("vis", r.bottom > -vh * .2 && r.top < vh * 1.2); if (r.top < vh * .92 && r.bottom > 0) s.classList.add("in"); });
      sents.forEach(t => { if (t._block.classList.contains("in")) return; const r = t.getBoundingClientRect(); if (r.top < vh * .9 && r.bottom > 0) t._block.classList.add("in"); });
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: 0.05, rootMargin: "0px 0px -6% 0px" });
      const iv = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("vis", e.isIntersecting)), { threshold: 0, rootMargin: "20% 0px 20% 0px" });
      const it = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target._block.classList.add("in"); it.unobserve(e.target); } }), { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
      secs.forEach(s => { io.observe(s); iv.observe(s); });
      sents.forEach(t => it.observe(t));
    }
    addEventListener("scroll", check, { passive: true }); check();
  }

  /* continuous petals: one fixed viewport layer, petals confined to the two side columns so they never cross the centred text */
  function fixedPetals() {
    const box = el("div", "petals-fixed"); box.id = "petalsFixed";
    const n = REDUCED ? 0 : 9;
    for (let i = 0; i < n; i++) {
      const q = el("div", "petal " + ["", "p2", "p3"][i % 3]);
      const left = i % 2 === 0;
      setv(q, { px: (left ? 2 + Math.random() * 17 : 80 + Math.random() * 17).toFixed(1) + "%", s: (2.2 + Math.random() * 1.6).toFixed(2), t: (13 + Math.random() * 9).toFixed(1) + "s", d: (-Math.random() * 22).toFixed(1) + "s", dx: (Math.random() * 6 - 3).toFixed(1) + "%" });
      box.appendChild(q);
    }
    document.body.appendChild(box);
  }

  function init() {
    const world = document.getElementById("world");
    SECTIONS.forEach((S, i) => world.appendChild(buildSection(S, i)));
    fixedPetals();
    const ent = document.getElementById("entrance");
    // door geometry (reference pixels): doorway box, light shape, crown ornament
    setv(document.getElementById("doorStage"), DOOR_GEO);
    sizeDoor(); addEventListener("resize", sizeDoor);
    const critical = [...ent.querySelectorAll("img")];
    Promise.all(critical.map(im => im.complete ? Promise.resolve() : new Promise(r => { im.onload = r; im.onerror = r; }))).then(() => ent.classList.add("ready"));
    setTimeout(() => ent.classList.add("ready"), 3500);
    ent.addEventListener("click", enter);
    ent.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enter(); } });
    document.addEventListener("click", e => {
      if (e.target.closest("#envHit")) { e.preventDefault(); openEnvelope(); return; }
      if (e.target.closest("#saveDate")) { e.preventDefault(); saveTheDate(); }
    });
    if (SKIP_DOOR) { entered = true; ent.remove(); document.getElementById("veil").remove(); document.body.classList.remove("locked"); document.getElementById("invite").setAttribute("aria-hidden", "false"); startObservers(); applyMute(); muteBtn.hidden = false; }
  }
  // doorway box in door-reference pixels; ltop = extra light above the leaves (fan area) as % of doorway height; crown box
  // only the two rectangular door panels below the transom rail swing; the arched fanlight and its gold crest stay static on the base art
  const DOOR_GEO = { dx: 150, dy: 362, dwid: 592, dhei: 1064, lr: "0%" };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
