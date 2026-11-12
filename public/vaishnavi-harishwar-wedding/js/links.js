/* How this invitation opens Google Maps and WhatsApp (added 2026-11-13).
   In a file of its own on purpose: a guest whose browser still holds an older copy of the other scripts gets this
   one fresh, so old and new files always fit together. */
import { whatsappLink } from './util.js';

/* A phone or tablet (any touch-first device), as opposed to a desktop browser. */
export const isHandheld = () => /Android|iPhone|iPad|iPod|Mobile|Silk|Opera Mini/i.test(navigator.userAgent)
  || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  || (window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches);

/* Google Maps links ([data-map]) are plain https anchors with the family's own URLs and NO target: tapping one simply
   navigates, which every phone browser, in-app browser and WebView can do — the Maps app takes the link when it is
   installed, the browser shows the map when it is not. (They used to ask for a new tab; some Android in-app browsers
   and WebViews ignore that request or leave a blank tab, so the tap seemed to do nothing.) Only a desktop browser,
   where there is no app to hand over to, gets a new tab so the invitation stays open beside the map. */
export function initMapLinks(root = document) {
  if (isHandheld()) return;
  root.querySelectorAll('a[data-map]').forEach((a) => { a.target = '_blank'; });
}

/* Open WhatsApp from a tap: a new tab where the browser gives one, otherwise the same tab — never a tap that does
   nothing. Returns the address so the page can also offer it as an ordinary link. */
export function openWhatsApp(number, text) {
  const url = whatsappLink(number, text);
  let w = null;
  try { w = window.open(url, '_blank'); } catch { /* blocked */ }
  if (w) { try { w.opener = null; } catch { /* cross-origin */ } } else { window.location.href = url; }
  return url;
}
