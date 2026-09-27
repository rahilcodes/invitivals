/* =====================================================================
   Engine: builds the door entrance and the continuous scrolling world
   from js/scenes.js, drives reveals (IntersectionObserver), parallax,
   the envelope interaction, calendar + maps actions.
   ===================================================================== */
(function () {
  "use strict";
  const AV = "?v=" + ASSET_VERSION;
  // every pack PNG / backdrop JPG ships as WebP (lossy, alpha preserved); PNG originals remain in assets/ as a fallback
  const WEBP = (() => { try { return document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0; } catch (e) { return false; } })();
  const A = (s) => "assets/" + (WEBP ? s.replace(/\.(png|jpg)$/i, ".webp") : s) + AV;
  const qs = new URLSearchParams(location.search);
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SHOW_REF = qs.has("ref");
  const SKIP_DOOR = qs.has("nodoor");

  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const setv = (e, o) => { for (const k in o) if (o[k] != null) e.style.setProperty("--" + k, o[k]); };

  /* ---------------- layer factory ---------------- */
  function makeLayer(L, scene) {
    const wrap = el("div", "layer rv from-" + (L.rv || "fade"));
    setv(wrap, { x: L.x, y: L.y, w: L.w, z: L.z || 10, d: (L.d || 0) + "s", o: L.o });
    if (L.mask) wrap.classList.add("mask-" + L.mask);
    if (L.px) wrap.dataset.px = L.px;
    const px = el("div", "px");
    const mv = el("div", "mv" + (L.fx ? " fx fx-" + L.fx : ""));
    if (L.t) setv(mv, { t: L.t + "s" });
    const img = el("img");
    img.src = A(L.s); img.alt = ""; img.decoding = "async";
    img.loading = scene && scene.lazy ? "lazy" : "eager";
    if (L.flip) img.classList.add("flip");
    if (L.flipY) img.classList.add("flipY");
    if (L.wings) img.classList.add("fx", "fx-wings");
    mv.appendChild(img);
    if (L.glint) { const g = el("div", "glint"); setv(g, { t: (7 + Math.random() * 6).toFixed(1) + "s", d: (Math.random() * 6).toFixed(1) + "s" }); mv.appendChild(g); }
    px.appendChild(mv); wrap.appendChild(px);
    return wrap;
  }

  function makePetals(cfg, scene) {
    const box = el("div", "petals"); setv(box, { z: cfg.z || 40 });
    const n = REDUCED ? Math.min(2, cfg.n) : cfg.n;
    for (let i = 0; i < n; i++) {
      const p = el("div", "petal " + (["", "p-dark", "p-light"][i % 3]));
      setv(p, { px: (5 + Math.random() * 90).toFixed(1) + "%", s: (1.6 + Math.random() * 1.6).toFixed(2), t: (11 + Math.random() * 9).toFixed(1) + "s", d: (-Math.random() * 18).toFixed(1) + "s", dx: (Math.random() * 14 - 7).toFixed(1) + "cqw" });
      box.appendChild(p);
    }
    return box;
  }

  /* ---------------- scenes ---------------- */
  function buildScene(sc, idx) {
    const s = el("section", "scene"); s.id = sc.id;
    setv(s, { W: sc.W, H: sc.H, lap: sc.lap || 0 });
    s.style.zIndex = 10 + idx;
    sc.lazy = idx > 1;
    if (sc.blur) { const b = el("img", "backdrop blurfield"); b.src = A(sc.blur); b.alt = ""; b.loading = "eager"; s.appendChild(b); }
    if (sc.backdrop) { const b = el("img", "backdrop"); b.src = A(sc.backdrop); b.alt = ""; b.loading = sc.lazy ? "lazy" : "eager"; s.appendChild(b); }
    if (sc.water) { const w = el("div", "water-shimmer fx fx-water"); w.style.top = (sc.water.y / sc.H * 100) + "%"; s.appendChild(w); }
    (sc.glows || []).forEach(G => { const g = el("div", "glow"); setv(g, { x: G.x, y: G.y, w: G.w, h: G.h, z: G.z || 3, a: G.a }); s.appendChild(g); });
    (sc.layers || []).forEach(L => s.appendChild(makeLayer(L, sc)));
    (sc.flames || []).forEach(F => { const f = el("div", "flame"); setv(f, { x: F.x, y: F.y, w: F.w, W: sc.W, H: sc.H, d: (F.d || 0) + "s", t: (1.4 + Math.random() * .8).toFixed(2) + "s" }); s.appendChild(f); });
    if (sc.kind === "envelope") s.appendChild(buildEnvelope(sc));
    if (sc.kind === "venue") s.appendChild(buildMap(sc));
    if (sc.kind === "panel") s.appendChild(buildPanel(sc));
    (sc.texts || []).forEach(Tx => { const t = el("div", "txt" + (Tx.cls ? " " + Tx.cls : ""), Tx.html); setv(t, { y: Tx.y, z: Tx.z || 20 }); s.appendChild(t); });
    if (sc.petals) s.appendChild(makePetals(sc.petals, sc));
    if (SHOW_REF && sc.ref) { const r = el("img", "refov"); r.src = sc.ref; r.alt = ""; s.appendChild(r); }
    return s;
  }

  function buildMap(sc) {
    const m = el("div", "map-frame rv from-scale"); setv(m, { x: sc.map.x, y: sc.map.y, w: sc.map.w, d: ".95s" });
    m.innerHTML = `<img src="${A("ven/map_thumb.png")}" alt="Map of Malleshwaram, Bengaluru" loading="lazy"><div class="pulse"></div>`;
    return m;
  }
  function buildPanel(sc) {
    const p = el("div", "panel rv from-scale"); setv(p, { x: sc.panel.x, y: sc.panel.y, w: sc.panel.w, d: ".6s" });
    p.innerHTML = `<div class="inner"></div><div class="band"></div>`;
    return p;
  }

  /* ---------------- envelope ---------------- */
  function buildEnvelope(sc) {
    const E = sc.envelope;
    const w = el("div", "env-wrap rv from-up"); setv(w, { x: E.x, y: E.y, w: E.w, d: ".7s" });
    w.innerHTML = `
      <img class="part env-back" src="${A("env/05_envelope_complete.png")}" alt="">
      <div class="env-lining"></div>
      <div class="card-clip">
        <div class="card" id="dateCard">
          <img src="${A("rev/04_date_card.png")}" alt="">
          <div class="ctext">
            ${T("caps", "Save Our", .1)}
            ${T("script", "Date", .2)}
            ${T("", SWIRL, .3)}
            ${T("", `<svg class="cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7 14h2M11 14h2M15 14h2M7 18h2M11 18h2"/></svg>`, .4)}
            ${T("day", "Sunday", .5)}
            ${T("date", "15 November 2026", .6)}
            ${T("", `<div class="divider">${HEART}</div>`, .7)}
            ${T("", `<div class="times">
                <div><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>10:30 AM<br>onwards</span></div>
                <div class="vsep"></div>
                <div><svg viewBox="0 0 24 24"><path d="M7 3v7a2 2 0 0 0 4 0V3M9 3v18M17 3c-2 1-3 4-3 7 0 2 1 3 3 3v8"/></svg><span>Lunch<br>12:30 PM<br>onwards</span></div>
              </div>`, .8)}
            ${T("", FLEUR("6cqw"), .9)}
            ${T("", `<button class="btn" id="saveDate" type="button"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15h2M13 15h2M9 18h2"/></svg><span class="sep"></span><span class="lbl">Save the Date</span></button>`, 1.0)}
          </div>
        </div>
      </div>
      <img class="part env-front" src="${A("env/05_envelope_complete.png")}" alt="">
      <div class="env-persp"><img class="env-flap" src="${A("env/06_envelope_flap.png")}" alt=""></div>
      <div class="env-seal" id="envSeal"><div class="halo"></div><img src="${A("env/07_wax_seal.png")}" alt="" style="width:100%;height:auto;position:relative"></div>
      <div class="env-hit" id="envHit" role="button" aria-label="Tap to reveal the date" tabindex="0"></div>`;
    return w;
  }

  function openEnvelope() {
    const w = document.querySelector(".env-wrap");
    if (!w || w.classList.contains("open") || w.dataset.busy) return;
    w.dataset.busy = "1";
    const seal = document.getElementById("envSeal");
    seal.classList.add("press");
    setTimeout(() => { seal.classList.remove("press"); seal.classList.add("release"); }, 200);
    setTimeout(() => seal.classList.remove("release"), 460);
    // ribbons loosen: tiny settle of the whole envelope
    setTimeout(() => {
      w.classList.add("open");                                  // flap opens, card rises, envelope settles lower & larger
      document.querySelector(".date-head").classList.add("out");
      document.querySelector(".date-tap").classList.add("out");
    }, 380);
    setTimeout(() => {
      document.getElementById("dateCard").classList.add("open"); // text stagger inside the card
      const card = document.getElementById("dateCard");
      const r = card.getBoundingClientRect();
      if (r.top < 8) window.scrollBy({ top: r.top - 24, behavior: "smooth" });
    }, 1150);
  }

  /* ---------------- calendar ---------------- */
  function gcalUrl() {
    const p = new URLSearchParams({
      action: "TEMPLATE", text: EVENT.title, dates: EVENT.startUTC + "/" + EVENT.endUTC,
      details: "Sunday, 15 November 2026 · 10:30 AM onwards · Lunch 12:30 PM onwards", location: EVENT.venue + ", " + EVENT.address, ctz: "Asia/Kolkata"
    });
    return "https://calendar.google.com/calendar/render?" + p.toString();
  }
  function saveTheDate(btn) {
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isAndroid) window.open(gcalUrl(), "_blank", "noopener");
    else if (isIOS) window.location.href = EVENT.icsFile + AV;
    else { const a = document.createElement("a"); a.href = EVENT.icsFile + AV; a.download = "Nandini-Madhu-Engagement.ics"; document.body.appendChild(a); a.click(); a.remove(); }
    const lbl = btn.querySelector(".lbl"); const old = lbl.textContent;
    btn.classList.add("done"); lbl.textContent = "Added to calendar";
    setTimeout(() => { btn.classList.remove("done"); lbl.textContent = old; }, 3200);
  }

  /* ---------------- door ---------------- */
  function buildDoor() {
    const d = document.getElementById("doorScene");
    d.appendChild(el("div", "bgfill"));
    d.appendChild(el("div", "floor"));
    const g = el("div", "arch-group");
    g.innerHTML = `
      <div class="fanlight"></div>
      <div class="light"></div>
      <img class="crown" src="${A("door/09_gold_crown_ornament.png")}" alt="">
      <img class="scroll-l" src="${A("door/13_gold_left_scroll.png")}" alt="">
      <img class="scroll-r" src="${A("door/14_gold_right_scroll.png")}" alt="">
      <img class="arch" src="${A("door/01_arch_and_pillars.png")}" alt="">
      <div class="doors">
        <div class="leaf l"><img src="${A("door/02_left_door.png")}" alt=""></div>
        <div class="leaf r"><img src="${A("door/03_right_door.png")}" alt=""></div>
        <div class="leaf-glow"></div>
        <div class="invited">
          <img class="orn flourish" src="${A("door/12_gold_horizontal_flourish.png")}" alt="">
          <div class="caps">You're<br>Invited</div>
          <img class="orn heart" src="${A("door/19_gold_heart_ornament.png")}" alt="">
        </div>
      </div>`;
    d.appendChild(g);
    DOOR.florals.forEach(L => { const l = makeLayer(L, { lazy: false }); l.classList.remove("rv"); d.appendChild(l); });
    d.appendChild(makePetals({ n: 5, z: 30 }));
    if (SHOW_REF) { const r = el("img", "refov"); r.src = "25231204-b2da-42e5-811d-5e016cd8cd0d.png"; d.appendChild(r); }
  }
  function sizeDoor() {
    const vw = innerWidth, vh = innerHeight;
    const k = Math.max(vw / DOOR.W, vh / DOOR.H) * 1.02;
    const st = document.querySelector(".entrance-stage");
    if (!st) return;
    st.style.setProperty("--dw", (DOOR.W * k) + "px");
    st.style.setProperty("--dh", (DOOR.H * k) + "px");
  }
  let entered = false;
  function enter() {
    if (entered) return; entered = true;
    const ent = document.getElementById("entrance"), veil = document.getElementById("veil");
    ent.classList.add("opening");
    const T1 = REDUCED ? 500 : 1500, T2 = REDUCED ? 1300 : 2250;
    setTimeout(() => veil.classList.add("on"), T1 - 900 > 0 ? T1 - 900 : 100);
    setTimeout(() => {
      ent.classList.add("gone");
      document.body.classList.remove("locked");
      document.getElementById("invite").setAttribute("aria-hidden", "false");
      window.scrollTo(0, 0);
      veil.classList.remove("on"); veil.classList.add("off");
      const first = document.querySelector(".scene");
      first.classList.add("in", "vis");
      setTimeout(() => veil.remove(), 1600);
      startObservers();
    }, T2);
  }

  /* ---------------- observers, parallax ---------------- */
  let observersStarted = false;
  function startObservers() {
    if (observersStarted) return; observersStarted = true;
    const scenes = [...document.querySelectorAll(".scene")];
    const check = () => {                       // scroll fallback (also covers browsers/tabs where IO is throttled)
      const vh = innerHeight;
      scenes.forEach(s => {
        const r = s.getBoundingClientRect();
        const vis = r.bottom > -vh * .2 && r.top < vh * 1.2;
        s.classList.toggle("vis", vis);
        if (!s.classList.contains("in") && r.top < vh * .88 && r.bottom > vh * .12) s.classList.add("in");
      });
    };
    if ("IntersectionObserver" in window) {
      const ioIn = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      const ioVis = new IntersectionObserver((es) => es.forEach(e => e.target.classList.toggle("vis", e.isIntersecting)), { threshold: 0, rootMargin: "20% 0px 20% 0px" });
      scenes.forEach(s => { ioIn.observe(s); ioVis.observe(s); });
    }
    addEventListener("scroll", check, { passive: true });
    check();
    if (!REDUCED) initParallax();
  }
  function initParallax() {
    const items = [...document.querySelectorAll(".layer[data-px]")].map(l => ({ el: l.querySelector(".px"), k: parseFloat(l.dataset.px), scene: l.closest(".scene") }));
    let ticking = false;
    const run = () => {
      ticking = false;
      const vh = innerHeight;
      items.forEach(it => {
        if (!it.scene.classList.contains("vis")) return;
        const r = it.scene.getBoundingClientRect();
        const prog = ((r.top + r.height / 2) - vh / 2) / vh;   // -1..1 around centre
        const y = prog * it.k * -28;
        it.el.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
      });
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }

  /* ---------------- init ---------------- */
  function init() {
    const world = document.getElementById("world");
    SCENES.forEach((sc, i) => world.appendChild(buildScene(sc, i)));
    document.body.classList.add("locked");
    buildDoor(); sizeDoor();
    addEventListener("resize", sizeDoor);

    const ent = document.getElementById("entrance");
    const critical = [...ent.querySelectorAll("img")].slice(0, 8);
    Promise.all(critical.map(im => im.complete ? Promise.resolve() : new Promise(r => { im.onload = r; im.onerror = r; })))
      .then(() => ent.classList.add("ready"));
    setTimeout(() => ent.classList.add("ready"), 3500); // never block on slow networks
    ent.addEventListener("click", enter);
    ent.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") enter(); });

    document.addEventListener("click", (e) => {
      const hit = e.target.closest("#envHit, #envSeal");
      if (hit) { e.preventDefault(); openEnvelope(); return; }
      const sd = e.target.closest("#saveDate");
      if (sd) { e.preventDefault(); saveTheDate(sd); }
    });
    document.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.id === "envHit") openEnvelope(); });

    if (SKIP_DOOR) { entered = true; ent.remove(); document.getElementById("veil").remove(); document.body.classList.remove("locked"); document.querySelector(".scene").classList.add("in", "vis"); startObservers(); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
