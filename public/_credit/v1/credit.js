/* ─────────────────────────────────────────────────────────────────────────
   "Designed by Invitivals" — the small footer at the end of every invitation.

     <script src="/_credit/v1/credit.js" defer
             data-into="#invite"        where it goes (last child); default: body
             data-color="#f0dcae"       text colour;  default: the page's own
             data-bg="#1f2d25"          strip colour; default: transparent
             data-max="500px"></script> centred column width; default: full

   One file for every invitation, so a change here reaches all of them.
   Pages that render themselves later (engine, ES modules) are waited for.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  var me = document.currentScript;
  if (!me) return;
  var d = me.dataset;
  var slug = location.pathname.replace(/\/(index\.html)?$/, '').split('/').filter(Boolean).join('-') || 'home';
  var href = 'https://invitivals.com/?utm_source=invitation&utm_medium=footer&utm_campaign=' + encodeURIComponent(slug);

  var css =
    '.inv-foot{position:relative;z-index:5;display:block;box-sizing:border-box;width:100%;margin:0 auto;' +
    'padding:20px 16px calc(22px + env(safe-area-inset-bottom,0px));text-align:center;' +
    'font:500 11px/1.4 "Cormorant Garamond","Cormorant",Georgia,serif;letter-spacing:.22em;text-transform:uppercase;' +
    'color:inherit;background:transparent;clear:both}' +
    '.inv-foot a{color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:9px;padding:6px 4px;opacity:.78;transition:opacity .25s}' +
    '.inv-foot a:hover,.inv-foot a:focus-visible{opacity:1}' +
    '.inv-foot a:focus-visible{outline:1px solid currentColor;outline-offset:3px;border-radius:2px}' +
    '.inv-foot i{display:block;width:5px;height:5px;transform:rotate(45deg);border:1px solid currentColor;opacity:.7}' +
    '.inv-foot b{font-weight:700;letter-spacing:.26em;border-bottom:1px solid currentColor;padding-bottom:1px}';

  function build() {
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    var f = document.createElement('footer');
    f.className = 'inv-foot';
    if (d.color) f.style.color = d.color;
    if (d.bg) f.style.background = d.bg;
    if (d.max) f.style.maxWidth = d.max;
    f.innerHTML = '<a href="' + href + '" target="_blank" rel="noopener"><i aria-hidden="true"></i>' +
      '<span>Designed by <b>Invitivals</b></span><i aria-hidden="true"></i></a>';
    return f;
  }

  var foot = null;
  function place() {
    var host = d.into ? document.querySelector(d.into) : document.body;
    if (!host) return false;
    foot = foot || build();
    if (foot.parentNode !== host || host.lastElementChild !== foot) host.appendChild(foot);
    return true;
  }

  function start() {
    if (place() && !d.into) return;
    // the host may not exist yet, or may be re-rendered: keep the footer last for a while
    var mo = new MutationObserver(function () {
      if (!foot || !foot.isConnected || (foot.parentNode && foot.parentNode.lastElementChild !== foot)) place();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 15000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
