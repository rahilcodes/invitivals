/* How this invitation opens Google Maps and WhatsApp, so that a tap always does something on every phone. */

/* A phone or tablet (any touch-first device), as opposed to a desktop browser. */
export const isHandheld = () => /Android|iPhone|iPad|iPod|Mobile|Silk|Opera Mini/i.test(navigator.userAgent)
  || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  || (window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches);

/* Google Maps links ([data-map]) are plain https anchors with the family's own URLs and NO target: tapping one simply
   navigates, which every phone browser, in-app browser and WebView can do — the Maps app takes the link when it is
   installed, the browser shows the map when it is not. (A link that asks for a new tab is ignored by some Android
   in-app browsers, so the tap seems to do nothing.) Only a desktop browser, where there is no app to hand over to,
   gets a new tab so the invitation stays open beside the map. */
export function initMapLinks(root = document) {
  if (isHandheld()) return;
  root.querySelectorAll('a[data-map], a[data-wa]').forEach((a) => { a.target = '_blank'; });
}

/* Open WhatsApp from a tap: a new tab where the browser gives one, otherwise the same tab — never a tap that does
   nothing. */
export function openWhatsApp(url) {
  let w = null;
  try { w = window.open(url, '_blank'); } catch { /* blocked */ }
  if (w) { try { w.opener = null; } catch { /* cross-origin */ } } else { window.location.href = url; }
  return url;
}
