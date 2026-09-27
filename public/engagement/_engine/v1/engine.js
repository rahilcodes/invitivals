/* =====================================================================
   Invitation engine v1 — shared by every invitation.
   window.INVITE        the couple's details        (<slug>/invite.js, generated from invites/<slug>.json)
   window.INVITE_THEME  the artwork and its geometry (_themes/<theme>/theme.js)
   Nothing in this file is specific to a couple or to a theme.

   Debug: ?nodoor skips the entrance · ?slow stretches the choreography 6x · ?hold freezes the open door · ?eager loads all art
   ===================================================================== */
(function () {
  "use strict";
  const I = window.INVITE, T = window.INVITE_THEME;
  if (!I || !T) return;                                  // the plain invitation stays on screen
  const V = I.v ? "?v=" + I.v : "";
  const qs = new URLSearchParams(location.search);
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const K = qs.has("slow") ? 6 : 1;
  const $ = (id) => document.getElementById(id);

  /* ---- helpers ---- */
  const el = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
  const setv = (e, o) => { for (const k in o) if (o[k] != null) e.style.setProperty("--" + k, o[k]); };
  const pct = (v, base) => (v / base * 100).toFixed(3) + "%";
  const themeUrl = (p) => T.base + p + V;
  const get = (key) => key.split(".").reduce((o, k) => (o == null ? o : o[k]), I);
  const lines = (v) => (v == null || v === "" ? [] : Array.isArray(v) ? v : [String(v)]);
  const bakedOf = (id) => (I.art && I.art[id] && I.art[id].baked) || [];
  // a section's finished plate: the couple's own art when supplied, else the theme's
  const fullUrl = (id) => (I.art && I.art[id] && I.art[id].full) ? I.art[id].full + V : themeUrl("art/" + id + "-full.webp");
  const place = (e, x, y, w, h) => setv(e, { x: x, y: y, bw: w, bh: h });

  /* ---- event ---- */
  const utc = (iso) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const venueLine = [lines(I.venue.name).join(" ")].concat(lines(I.venue.address)).join(", ");
  const mapsUrl = I.venue.mapsUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(I.venue.mapsQuery || venueLine);
  const icsUrl = "event.ics" + V;
  function gcalUrl() {
    const p = new URLSearchParams({ action: "TEMPLATE", text: I.event.title, dates: utc(I.event.start) + "/" + utc(I.event.end), details: I.event.details || "", location: venueLine, ctz: I.event.timezone || "Asia/Kolkata" });
    return "https://calendar.google.com/calendar/render?" + p.toString();
  }

  /* ---- images are attached only when their section is near the screen ---- */
  function lazyBg(e, url) { e._bg = url; }
  function hydrate(s) {
    if (s._art) return; s._art = true;
    s.querySelectorAll("*").forEach(e => { if (e._bg) { e.style.backgroundImage = "url(" + e._bg + ")"; e._bg = null; } });
    s.querySelectorAll("img[data-src]").forEach(im => { im.src = im.dataset.src; im.removeAttribute("data-src"); });
  }

  /* ---- builders ---- */
  function overlay(o) {
    const d = el("div", "ov " + (o.cls || "")); place(d, o.x, o.y, o.w); setv(d, { t: o.t ? o.t + "s" : null, d: o.d != null ? o.d + "s" : null, delay: o.delay != null ? o.delay + "s" : null });
    if (o.light) { const g = el("div", "lantern-light"); setv(g, { t: (4 + Math.random() * 2).toFixed(1) + "s" }); d.appendChild(g); }
    // o.img: the couple's own piece, in their folder
    const img = el("img"); img.dataset.src = o.img ? o.img + V : themeUrl("art/" + o.s + ".webp"); img.alt = o.alt || ""; img.decoding = "async"; d.appendChild(img);
    return d;
  }
  function petalSet(box, n, side) {
    for (let i = 0; i < (REDUCED ? 0 : n); i++) {
      const q = el("div", "petal " + ["", "p2", "p3"][i % 3]);
      const px = side ? (i % 2 === 0 ? 2 + Math.random() * 17 : 80 + Math.random() * 17) : 6 + Math.random() * 88;
      setv(q, { px: px.toFixed(1) + "%", s: (2.1 + Math.random() * 1.6).toFixed(2), t: (12 + Math.random() * 9).toFixed(1) + "s", d: (-Math.random() * 21).toFixed(1) + "s", dx: ((Math.random() - .5) * (side ? 6 : 12)).toFixed(1) + "%" });
      box.appendChild(q);
    }
    return box;
  }
  function hit(tag, r, cls, label) {
    const h = el(tag, "hit " + cls); place(h, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0); h.setAttribute("aria-label", label);
    if (tag === "button") h.type = "button";
    return h;
  }
  /* a piece of the finished plate, sized to its own rect (not a full-section layer) */
  function block(S, b, url) {
    const w = b[2] - b[0], h = b[3] - b[1];
    const t = el("div", "tblock"); place(t, b[0], b[1], w, h); setv(t, { delay: b[4] + "s" });
    t.style.backgroundSize = pct(S.W, w) + " " + pct(S.H, h);
    t.style.backgroundPosition = pct(b[0], S.W - w) + " " + pct(b[1], S.H - h);
    lazyBg(t, url);
    return t;
  }
  /* live wording. When the couple's own art already carries it (baked), it is kept for screen readers only. */
  function slot(S, d, baked) {
    const txt = lines(get(d.key)); if (!txt.length) return null;
    if (baked) { const p = el("p", "sr"); p.textContent = txt.join(" "); return p; }
    const r = d.rect, e = el("p", "slot " + (d.font === "script" ? "script" : d.font === "sans" ? "sans" : "") + (d.align === "left" ? " left" : "") + (d.valign === "top" ? " top" : "") + (d.plain ? " flat" : "") + (d.on || d.plain ? "" : " rise"));
    place(e, r[0], r[1], r[2] - r[0], r[3] - r[1]);
    setv(e, { fs: d.size, lh: d.lh ? (d.lh / d.size).toFixed(3) : null, delay: d.delay != null ? d.delay + "s" : null });
    if (d.weight) e.style.fontWeight = d.weight;
    if (d.italic) e.style.fontStyle = "italic";
    if (d.color) e.style.color = d.color;
    if (d.track) e.style.letterSpacing = d.track;
    txt.forEach(l => { const s = el("span", "ln"); s.textContent = l; e.appendChild(s); });
    return e;
  }
  /* shrink any line that is wider than its slot (long names, long venues) */
  function fitSlots() {
    document.querySelectorAll(".slot").forEach(e => {
      e.style.removeProperty("--fit");
      const w = e.clientWidth, h = e.clientHeight; if (!w) return;
      let widest = 0, tall = 0; e.querySelectorAll(".ln").forEach(l => { widest = Math.max(widest, l.offsetWidth); tall += l.offsetHeight; });
      const f = Math.min(1, w / (widest || 1), h * 1.06 / (tall || 1));
      if (f < 1) e.style.setProperty("--fit", f.toFixed(4));
    });
  }

  function buildSection(S, i) {
    const s = el("section", "sec" + (S.kind === "envelope" ? " env" : "")); s.id = S.id;
    const crop = S.crop || [0, S.W], cw = crop[1] - crop[0];
    setv(s, { w: cw, h: S.H, lap: S.lap, fade: S.lap ? (S.lap * 1.05).toFixed(1) + "%" : "0%" });
    const cv = el("div", "cv"); setv(cv, { W: S.W, H: S.H });
    if (S.crop) { s.classList.add("cropped"); setv(cv, { cvx: pct(-crop[0], cw), cvw: pct(S.W, cw) }); }
    s.appendChild(cv);

    const full = fullUrl(S.id), baked = bakedOf(S.id);
    const img = el("img", "ref"); img.alt = ""; img.decoding = "async"; img.dataset.src = themeUrl("art/" + S.id + "-clean.webp"); cv.appendChild(img);
    (S.blocks || []).forEach(b => cv.appendChild(block(S, b, full)));
    (S.overlays || []).concat((I.overlays && I.overlays[S.id]) || []).forEach(o => cv.appendChild(overlay(o)));
    if (S.petals) { const box = el("div", "petals"); setv(box, { y0: S.petals.y0, y1: S.petals.y1 }); cv.appendChild(petalSet(box, S.petals.n)); }

    let card = null;
    if (S.kind === "envelope") card = buildEnvelope(S, cv);
    // wording that is part of the artwork itself, for screen readers
    (S.reads || []).forEach(r => { const v = get(r); const p = el("p", "sr"); p.textContent = typeof v === "string" ? v : r; cv.appendChild(p); });
    (S.slots || []).forEach(d => {
      const open = d.on === "card", e = slot(S, d, (open ? bakedOf(S.open) : baked).indexOf(d.key) >= 0);
      if (e) (open && card && !e.classList.contains("sr") ? card : cv).appendChild(e);
    });
    (S.links || []).forEach(l => {
      const a = hit("a", l.rect, l.to + "-btn" + (l.round ? " round" : ""), l.label);
      a.href = l.to === "maps" ? mapsUrl : "#"; a.target = "_blank"; a.rel = "noopener"; cv.appendChild(a);
    });
    if (i < 2 || qs.has("eager")) hydrate(s);
    return s;
  }

  /* ---- envelope: built from the closed artwork plus the open artwork's card.
     Tap: seal press -> heading fades -> the sealed envelope glides down while the date card rises out of its top edge
     through a pocket window (so the envelope always masks the card's lower part) -> the card's button settles in below. ---- */
  function buildEnvelope(S, cv) {
    const W = S.W, H = S.H, E = S.envelope;
    const inset = (r, round) => "inset(" + pct(r.y0, H) + " " + pct(W - r.x1, W) + " " + pct(H - r.y1, H) + " " + pct(r.x0, W) + " round " + round + ")";
    setv(cv, { glide: pct(E.glide, H), pocket0: pct(E.top - E.card.y0, H), pocket1: pct(E.top + E.glide - E.card.y0, H), pocketTop: pct(E.card.y0, H),
      cardStart: pct(E.top - E.card.y0, H), btnShift: pct(E.btnY - E.btn.y0, H), sealX: pct(E.seal.cx, W), sealY: pct(E.seal.cy, H) });
    const closed = fullUrl(S.id), open = fullUrl(S.open);
    const copy = (cls, url, clip) => { const c = el("div", "copy " + cls); lazyBg(c, url); c.style.clipPath = clip; return c; };

    const pocket = el("div", "pocket"), wrap = el("div", "cardwrap");
    wrap.appendChild(copy("card", open, inset(E.card, "1.2%"))); pocket.appendChild(wrap); cv.appendChild(pocket);
    const mv = el("div", "envmove");
    if (E.cut) { const b = el("div", "envcut"); place(b, E.cut.x, E.cut.y, E.cut.w, E.cut.h); lazyBg(b, themeUrl(E.cut.img)); mv.appendChild(b); }
    else mv.appendChild(copy("envbody", closed, "polygon(" + E.body.map(p => pct(p[0], W) + " " + pct(p[1], H)).join(",") + ")"));
    const seal = copy("seal", closed, "circle(" + pct(E.seal.r, W) + " at " + pct(E.seal.cx, W) + " " + pct(E.seal.cy, H) + ")"); mv.appendChild(seal);
    cv.appendChild(mv);
    cv.appendChild(copy("cardbtn", open, inset(E.btn, "999px")));

    const envHit = hit("button", E.hit, "env-hit", "Open the envelope to reveal the date");
    const dateBtn = hit("button", { x0: E.btn.x0, y0: E.btnY, x1: E.btn.x1, y1: E.btnY + (E.btn.y1 - E.btn.y0) }, "date-btn round", "Save the date: add to your calendar");
    cv.appendChild(envHit); cv.appendChild(dateBtn);
    envHit.addEventListener("click", () => {
      const s = cv.parentNode; if (s.classList.contains("open") || s._busy) return; s._busy = true;
      seal.classList.add("press");
      setTimeout(() => { seal.classList.remove("press"); seal.classList.add("release"); }, 200 * K);
      setTimeout(() => { seal.classList.remove("release"); s.classList.add("open"); say([get("event.day"), get("event.dateText")].concat(lines(get("event.time"))).filter(Boolean).join(", ")); }, 420 * K);
      setTimeout(() => { const c = wrap.querySelector(".card").getBoundingClientRect(), top = c.top + c.height * (E.card.y0 / H); if (top < 8) window.scrollBy({ top: top - 20, behavior: REDUCED ? "auto" : "smooth" }); dateBtn.focus({ preventScroll: true }); }, 1900 * K);
    });
    dateBtn.addEventListener("click", saveTheDate);
    return wrap;
  }

  /* ---- calendar ---- */
  let toastT;
  function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 3200); }
  function say(msg) { const t = $("live"); if (t) t.textContent = msg; }
  function saveTheDate() {
    const ua = navigator.userAgent;
    const inApp = /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|Snapchat/i.test(ua);   // in-app browsers cannot open .ics files
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (/Android/i.test(ua) || inApp) { window.open(gcalUrl(), "_blank", "noopener"); toast("Opening Google Calendar…"); }
    else if (isIOS) { window.location.href = icsUrl; toast("Opening your calendar…"); }
    else { const a = document.createElement("a"); a.href = icsUrl; a.download = (I.slug || "invitation") + ".ics"; document.body.appendChild(a); a.click(); a.remove(); toast("Calendar file downloaded"); }
  }

  /* ---- music: one looping track, fetched and started by the door tap (the first gesture) ---- */
  let bgm = null, muted = false, entered = false;
  try { muted = localStorage.getItem("bgm-muted") === "1"; } catch (e) {}
  const play = () => { if (!bgm || muted || document.hidden) return; const p = bgm.play(); if (p && p.catch) p.catch(() => {}); };
  function applyMute() {
    const b = $("mute"); if (bgm) bgm.muted = muted;
    b.classList.toggle("is-muted", muted); b.setAttribute("aria-pressed", muted ? "true" : "false"); b.setAttribute("aria-label", muted ? "Turn music on" : "Turn music off");
  }
  function startMusic() {
    if (!T.audio && !I.audio) return;
    if (!bgm) { bgm = new Audio(I.audio ? I.audio + V : themeUrl(T.audio)); bgm.loop = true; bgm.preload = "auto"; bgm.volume = 0.45; }
    applyMute(); $("mute").hidden = false; play();
  }

  /* ---- door ---- */
  function buildEntrance() {
    const D = T.door, ent = el("div", "entrance"); ent.id = "entrance";
    ent.setAttribute("role", "button"); ent.tabIndex = 0; ent.setAttribute("aria-label", (I.ui && I.ui.enterLabel) || "You're invited. Tap to open the invitation");
    ent.innerHTML = '<div class="door-stage"><img class="door-base" alt=""><div class="doorway"><div class="light"></div><div class="doors">' +
      '<div class="leaf l"><img alt=""></div><div class="leaf r"><img alt=""></div></div></div><img class="pendant" alt=""><div class="seam-flash"></div></div>' +
      '<div class="tap-hint"><span class="tap-ring"></span><span class="tap-text"></span></div>';
    const st = ent.firstChild, ims = ent.querySelectorAll("img");
    ims[0].src = themeUrl(D.img); ims[1].src = themeUrl(D.leafL); ims[2].src = themeUrl(D.leafR); ims[3].src = themeUrl(D.pendant.img);
    ent.querySelector(".tap-text").textContent = (I.ui && I.ui.enter) || "Tap to Enter";
    setv(st, { W: D.W, H: D.H, dx: D.doorway.x, dy: D.doorway.y, dwid: D.doorway.w, dhei: D.doorway.h, px: D.pendant.x, py: D.pendant.y, pw: D.pendant.w });
    // the full height of the door always fits the screen; on a narrow phone only the outer floral margin leaves it
    const size = () => { const k = innerHeight / D.H; st.style.setProperty("--dw", (D.W * k) + "px"); st.style.setProperty("--dh", (D.H * k) + "px"); };
    size(); addEventListener("resize", size);
    const veil = el("div", "veil"); veil.id = "veil"; veil.setAttribute("aria-hidden", "true");
    document.body.insertBefore(veil, document.body.firstChild); document.body.insertBefore(ent, veil);
    Promise.all([...ims].map(im => im.complete ? 0 : new Promise(r => { im.onload = r; im.onerror = r; }))).then(() => ent.classList.add("ready"));
    setTimeout(() => ent.classList.add("ready"), 3500);
    ent.addEventListener("click", enter);
    ent.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enter(); } });
  }
  function reveal() {
    document.body.classList.remove("locked");
    const inv = $("invite"); inv.removeAttribute("aria-hidden"); inv.removeAttribute("inert");
    startObservers();
  }
  function enter() {
    if (entered) return; entered = true;
    startMusic();
    const ent = $("entrance"), veil = $("veil");
    ent.classList.add("opening");
    const T1 = (REDUCED ? 500 : 1500) * K, T2 = (REDUCED ? 1300 : 2400) * K;
    if (qs.has("hold")) return;
    setTimeout(() => veil.classList.add("on"), Math.max(100, T1 - 900));
    setTimeout(() => {
      ent.classList.add("gone");
      window.scrollTo(0, 0); reveal();
      veil.classList.remove("on"); veil.classList.add("off");
      setTimeout(() => { veil.remove(); ent.remove(); }, 1600);
      const h = document.querySelector(".sec .sr"); if (h) say(h.textContent);
    }, T2);
  }

  /* ---- observers ---- */
  let started = false;
  function startObservers() {
    if (started) return; started = true;
    const secs = [...document.querySelectorAll(".sec")], rise = [...document.querySelectorAll(".tblock, .slot.rise, .ov.rise")];
    if (!("IntersectionObserver" in window)) { secs.forEach(s => { hydrate(s); s.classList.add("vis"); }); rise.forEach(t => t.classList.add("in")); return; }
    const near = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { hydrate(e.target); near.unobserve(e.target); } }), { rootMargin: "150% 0px 150% 0px" });
    const vis = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("vis", e.isIntersecting)), { rootMargin: "20% 0px 20% 0px" });
    const up = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); up.unobserve(e.target); } }), { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    secs.forEach(s => { near.observe(s); vis.observe(s); });
    rise.forEach(t => up.observe(t));
  }

  function init() {
    document.documentElement.style.setProperty("--theme", T.colors.theme);
    const world = $("world");
    T.sections.forEach((S, i) => world.appendChild(buildSection(S, i)));
    document.body.appendChild(petalSet(el("div", "petals-fixed"), 9, true));
    $("mute").addEventListener("click", () => {
      muted = !muted; try { localStorage.setItem("bgm-muted", muted ? "1" : "0"); } catch (e) {}
      applyMute(); if (muted) { if (bgm) bgm.pause(); } else play();
    });
    // music and drifting petals stop when the guest leaves the page or locks the phone
    document.addEventListener("visibilitychange", () => { document.body.classList.toggle("away", document.hidden); if (!bgm || !entered) return; if (document.hidden) bgm.pause(); else play(); });
    document.addEventListener("pointerdown", () => { if (entered && bgm && bgm.paused) play(); }, { passive: true });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSlots);
    fitSlots(); addEventListener("load", fitSlots);

    $("plain").hidden = true;                             // the artwork is up: retire the plain invitation
    if (qs.has("nodoor")) { entered = true; applyMute(); reveal(); if (T.audio || I.audio) $("mute").hidden = false; }
    else { document.body.classList.add("locked"); $("invite").setAttribute("inert", ""); buildEntrance(); }
  }
  function boot() {
    try { init(); }
    catch (err) {                                          // never leave a guest locked behind a door that cannot open
      document.body.classList.remove("locked");
      const p = $("plain"); if (p) p.hidden = false;
      const inv = $("invite"); if (inv) inv.hidden = true;
      const e = $("entrance"); if (e) e.remove();
      if (window.console) console.error("[invite]", err);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
