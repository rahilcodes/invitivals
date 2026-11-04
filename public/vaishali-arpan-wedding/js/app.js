/* Vaishali & Arpan: the opening tap and music, scroll reveals, the countdown and the Add to Calendar sheet.
   The words all live in index.html, so the page is complete without this script. */
import { SparkleOverlay } from './sparkle.js';

const $ = (s) => document.querySelector(s);
const WEDDING = '2026-11-20T20:00:00+05:30';            // the Save the Date and the countdown: 20 Nov 2026, 8:00 PM IST

/* ── music: started inside the opening tap so browsers allow it ── */
const music = new Audio('assets/music.mp3');
music.loop = true; music.preload = 'auto';
let wanted = true;
const audioBtn = document.createElement('button');
audioBtn.className = 'audio'; audioBtn.type = 'button'; audioBtn.setAttribute('aria-label', 'Mute music'); audioBtn.setAttribute('aria-pressed', 'false');
audioBtn.innerHTML =
  '<svg class="on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>' +
  '<svg class="off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/><path d="M3 3l18 18" stroke-width="1.8"/></svg>';
audioBtn.addEventListener('click', () => {
  wanted = !wanted;
  audioBtn.classList.toggle('muted', !wanted);
  audioBtn.setAttribute('aria-pressed', String(!wanted));
  audioBtn.setAttribute('aria-label', wanted ? 'Mute music' : 'Play music');
  if (wanted) music.play().catch(() => {}); else music.pause();
});
document.body.append(audioBtn);
// a hidden tab pauses the music; coming back resumes it if the guest wanted it
document.addEventListener('visibilitychange', () => { if (document.hidden) music.pause(); else if (wanted && audioBtn.classList.contains('shown')) music.play().catch(() => {}); });

/* ── opening ── */
const sparkle = SparkleOverlay();
const opening = $('#opening');
document.body.classList.add('locked');
$('#tap').addEventListener('click', () => {
  music.volume = 0.8;
  music.play().catch(() => {});
  audioBtn.classList.add('shown');
  opening.classList.add('out');
  document.body.classList.remove('locked');
  window.scrollTo(0, 0);
  sparkle.show();
  reveal();
  setTimeout(() => opening.remove(), 1000);
}, { once: true });

/* ── every block enters once as it scrolls into view; whatever cannot be observed is simply shown ── */
function reveal() {
  const blocks = [...document.querySelectorAll('.rv')];
  if (!('IntersectionObserver' in window)) { blocks.forEach((b) => b.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
  blocks.forEach((b) => io.observe(b));
}

/* ── countdown: worked out every second from the real moment, never below zero ── */
(() => {
  const box = $('#countdown'), done = $('#cd-done');
  const target = new Date(box.dataset.target || WEDDING).getTime();
  const cell = (u) => box.querySelector(`[data-u="${u}"]`);
  const D = cell('d'), H = cell('h'), M = cell('m'), S = cell('s');
  const pad = (n) => String(n).padStart(2, '0');
  let timer = 0;
  const tick = () => {
    const left = Math.max(0, Math.floor((target - Date.now()) / 1000));
    if (left === 0) { clearInterval(timer); box.hidden = true; done.hidden = false; return; }
    D.textContent = Math.floor(left / 86400); H.textContent = pad(Math.floor(left / 3600) % 24);
    M.textContent = pad(Math.floor(left / 60) % 60); S.textContent = pad(left % 60);
  };
  tick(); timer = setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
})();

/* ── Add to Calendar: the static event.ics, or Google Calendar ── */
(() => {
  // the invitation gives no end time; Google Calendar needs one, so its entry lasts this long (event.ics has no end)
  const GCAL_HOURS = 3;
  const start = new Date(WEDDING), end = new Date(start.getTime() + GCAL_HOURS * 3600e3);
  const z = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  $('#gcal').href = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Wedding of Vaishali & Arpan',
    dates: `${z(start)}/${z(end)}`,
    ctz: 'Asia/Kolkata',
    location: 'The Sherioan By Kawatra Tent, Colosseum Hall, Pitampura, Delhi – 110034 (Near DCP Office, Outer District)',
    details: 'The Wedding Celebration\n8:00 PM – Welcome of Baraat\n9:00 PM – Dinner\nVidaai – Taron Ki Chhaon Mein\n\nMap: https://maps.app.goo.gl/8svFQVQ7mBP4o59D8?g_st=ic',
  });
  const sheet = $('#sheet'), opener = $('#add-cal');
  const open = () => { sheet.hidden = false; sheet.querySelector('.sheet-opt').focus({ preventScroll: true }); };
  const close = () => { sheet.hidden = true; opener.focus({ preventScroll: true }); };
  opener.addEventListener('click', open);
  sheet.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
  sheet.querySelectorAll('.sheet-opt').forEach((a) => a.addEventListener('click', () => setTimeout(close, 300)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) close(); });
})();
