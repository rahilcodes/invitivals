/* Builds anonymised showcase copies of real client invitations.
 *
 *   node tools/make-showcase.mjs
 *
 * Each job copies public/<src> to public/showcase/<slug>, swaps every personal
 * detail for a fictional one (same initials, so monograms stay right), moves the
 * event to a future date, strips assets that carry names, neutralises phone /
 * WhatsApp targets and adds the "Get this design" pill. The run FAILS if any
 * forbidden token (an original name, number or place) survives in the output —
 * including inside URL-encoded links. Live client folders are never modified.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const OUT = path.join(PUBLIC, 'showcase');
const SITE = 'https://invitivals.com';

const PILL = `
<a class="mi-bar" href="/#collection" aria-label="Get this design from Invitivals">✦ Get this design — <b>Invitivals</b></a>
<style>
  .mi-bar { position: fixed; left: 14px; bottom: 14px; z-index: 2147483000; display: flex; align-items: center; gap: 6px; background: rgba(18,15,12,.82); color: #f5edd9; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(212,166,67,.5); border-radius: 999px; padding: 11px 16px; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11.5px; font-weight: 600; letter-spacing: .04em; text-decoration: none; transition: transform .2s ease, border-color .2s ease; }
  .mi-bar b { color: #d4a643; font-style: italic; font-family: Georgia, serif; font-weight: 400; font-size: 13px; }
  .mi-bar:hover { transform: translateY(-2px); border-color: #d4a643; color: #f5edd9; }
</style>
<script>
(function(){
  var c = document.querySelector('.inv-credit'), p = document.querySelector('.mi-bar');
  if (!c || !p || !('IntersectionObserver' in window)) return;
  p.style.transition = 'opacity .35s ease, transform .2s ease, border-color .2s ease';
  new IntersectionObserver(function(e){
    var on = e[0].isIntersecting;
    p.style.opacity = on ? '0' : '1';
    p.style.pointerEvents = on ? 'none' : 'auto';
  }, { threshold: 0.25 }).observe(c);
})();
</script>
`;

const jobs = [
  /* ───────────────────────── Aqeeqah ───────────────────────── */
  {
    src: 'aqeeqah-mirha', slug: 'aqeeqah', sample: 'Aqeeqah Ceremony',
    exclude: ['assets/og-cover.jpg'],
    replace: [
      [/<span class="mid" aria-label="Mirha">[\s\S]*?<\/span><\/span>/,
        '<span class="mid" aria-label="Inaya">' + [...'Inaya'].map((c, i) => `<span class="ch" style="--i:${i}" aria-hidden="true">${c}</span>`).join('') + '</span>'],
      ['<span class="first">Syeda</span>', '<span class="first">Noor</span>'],
      ['<span class="last">Sadat</span>', '<span class="last">Fatima</span>'],
      ['aqeeqah-syeda-mirha-sadat.ics', 'aqeeqah-invitation.ics'],
      ['Syeda Mirha Sadat', 'Noor Inaya Fatima'],
      ['Syeda%20Mirha%20Sadat', 'Noor%20Inaya%20Fatima'],
      ['Syed Sadat Ali (Zafar)', 'Imran Ahmed Khan'],
      ['Umme Mirha', 'Umme Inaya'],
      ['Al-Hajj Meer Nisar Ali Sahab', 'Al-Hajj Abdul Rahman Sahab'],
      ['Meer Nisar Ali Sahab', 'Abdul Rahman Sahab'],
      ['Tanveer Ali Rasiq', 'Faisal Rahman'],
      ['MIRHA', 'INAYA'], ['Mirha', 'Inaya'], ['mirha', 'inaya'],
      ['https://wa.me/919848046985?text=', 'https://wa.me/?text='],
      ['tel:+919848046985', 'tel:+919876543210'], ['+91 98480 46985', '+91 98765 43210'],
      ['tel:+918555028509', 'tel:+919123456789'], ['+91 85550 28509', '+91 91234 56789'],
      ['Prime+Function+Hall+Beside+My+Apartment+Near+Anwar-ul-Uloom+Girls+Gate', 'Rose+Garden+Function+Hall+Banjara+Hills+Hyderabad'],
      ['Prime Function Hall, Beside My Apartment, Near Anwar-ul-Uloom Girls Gate', 'Rose Garden Function Hall, Road No. 12, Banjara Hills, Hyderabad'],
      ['Beside My Apartment<br>Near Anwar-ul-Uloom Girls Gate', 'Road No. 12, Banjara Hills<br>Hyderabad'],
      ['Prime Function Hall', 'Rose Garden Function Hall'],
      ['14<sup>th</sup> September 2026', '13<sup>th</sup> September 2027'],
      ['datetime="2026-09-14"', 'datetime="2027-09-13"'],
      ['14th September 2026', '13th September 2027'],
      ['02 Rabi’ al-Thani, 1448 AH', '11 Rabi’ al-Thani, 1449 AH'],
      ['02 Rabi al-Thani, 1448 AH', '11 Rabi al-Thani, 1449 AH'],
      ["'20260914'", "'20270913'"], ['/20260915', '/20270914'], ['DATE:20260915', 'DATE:20270914'],
      ['2026-09-14T00:00:00+05:30', '2027-09-13T00:00:00+05:30'],
      ['20260914@', '20270913@'],
      ['<p class="credit">Designed with love by <span>Creativals</span></p>', '<p class="credit inv-credit"><a href="/#collection" style="color:inherit;text-decoration:none">Created by <span>Invitivals</span></a></p>'],
      ['Designed by Creativals', 'Created by Invitivals'], ['content="Creativals"', 'content="Invitivals"'],
      
    ],
    forbid: ['mirha', 'sadat', 'zafar', 'nisar', 'tanveer', 'rasiq', '9848046985', '8555028509', 'anwar', 'prime function', '2026', 'creativals'],
  },

  /* ───────────────────────── Nikah ───────────────────────── */
  {
    src: 'nikah-rayees', slug: 'nikah', sample: 'Nikah',
    exclude: [],
    replace: [
      ['Khwaja Azimuddin and Noorjahan', 'Abdul Kareem and Zainab'],
      ['Ismail Tahir', 'Yusuf Hameed'],
      ['Rayees', 'Rehan'], ['rayees', 'rehan'], ['RAYEES', 'REHAN'],
      ['Thanisha', 'Tasneem'], ['thanisha', 'tasneem'], ['THANISHA', 'TASNEEM'],
      ['Majestic House, Gujjadi', 'Noor Mahal, Bunder Road'],
      ['Halima Sabju Auditorium, Udyavara', 'Al-Ameen Auditorium, Falnir'],
      ['President Convention Center, Thekkatte', 'Crescent Convention Centre, Kankanady'],
      ['A J Resort, Hemmadi', 'Palm Grove Resort, Ullal'],
      ['https://maps.app.goo.gl/tLQdytqQiuS5gDJC7', 'https://www.google.com/maps/search/?api=1&query=Bunder+Road+Mangaluru'],
      ['https://maps.app.goo.gl/aKg63k46weF2bfBj8', 'https://www.google.com/maps/search/?api=1&query=Falnir+Mangaluru'],
      ['https://maps.app.goo.gl/FtkaV4X72h7g9s4p6', 'https://www.google.com/maps/search/?api=1&query=Kankanady+Mangaluru'],
      ['https://maps.app.goo.gl/fvJbD9YwyudiMVKg7', 'https://www.google.com/maps/search/?api=1&query=Ullal+Mangaluru'],
      ['09TH OCT', '08TH OCT'], ['10TH OCT', '09TH OCT'], ['11TH OCT', '10TH OCT'], ['13TH OCT', '12TH OCT'],
      ['2026-10-09T', '2027-10-08T'], ['2026-10-10T', '2027-10-09T'], ['2026-10-11T', '2027-10-10T'], ['2026-10-13T', '2027-10-12T'],
      ['10th October 2026', '9th October 2027'],
      ["29th Rabi' al-Thani 1448 AH", '9th Jumada al-Awwal 1449 AH'],
      [/28 Rabi(&rsquo;|'|’) al-Thani/g, '8 Jumada al-Awwal'],
      [/29 Rabi(&rsquo;|'|’) al-Thani/g, '9 Jumada al-Awwal'],
      [/30 Rabi(&rsquo;|'|’) al-Thani/g, '10 Jumada al-Awwal'],
      ['2 Jumada al-Awwal', '12 Jumada al-Awwal'],
      ['Date.UTC(2026, 8, 10, 11, 30, 0)', 'Date.UTC(2027, 9, 9, 11, 30, 0)'],
    ],
    credit: ["<img class=\"floral floral-bl\" src=\"assets/floral-bl.webp\" alt=\"\" loading=\"lazy\">", 'before', "<a class=\"inv-credit\" href=\"/#collection\" aria-label=\"Created by Invitivals\" style=\"position:absolute;left:0;right:0;bottom:calc(34px + env(safe-area-inset-bottom, 0px));z-index:2;text-align:center;font-family:'Marcellus',serif;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:#8a6a24;text-decoration:none\">Created by <b style=\"font-weight:600;letter-spacing:.2em\">Invitivals</b></a>\n            "],
    forbid: ['rayees', 'thanisha', 'azimuddin', 'noorjahan', 'ismail', 'gujjadi', 'udyavara', 'thekkatte', 'hemmadi', 'halima', 'goo.gl', '2026'],
  },

  /* ───────────────────────── Christian wedding ───────────────────────── */
  {
    src: 'neha-joel-wedding', slug: 'christian-wedding', sample: 'Christian Wedding',
    exclude: ['assets/og-cover.jpg'],
    replace: [
      ['Mr. Mathew Varghese', 'Mr. Philip Kurian'], ['Mrs. Lissy Mathew', 'Mrs. Mary Philip'],
      ['Mr. Thomas Abraham', 'Mr. George Paul'], ['Mrs. Anitha Thomas', 'Mrs. Susan George'],
      ['Neha Maria', 'Nina Grace'], ['Joel Mathew', 'Jason Philip'],
      ['Neha', 'Nina'], ['Joel', 'Jason'], ['neha', 'nina'], ['joel', 'jason'],
      ["'https://wa.me/' + COUPLE_WA + '?text='", "'https://wa.me/?text='"],
    ],
    credit: ['To God be the glory</p>', 'after', "\n        <a class=\"inv-credit\" href=\"/#collection\" aria-label=\"Created by Invitivals\" style=\"display:block;margin:26px 0 0;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:rgba(240,220,174,.72);text-decoration:none\">Created by <b style=\"font-weight:600;letter-spacing:.2em\">Invitivals</b></a>"],
    forbid: ['neha', 'joel', 'varghese', 'lissy', 'anitha', 'thomas abraham', 'mathew'],
  },

  /* ───────────────────────── Telugu wedding ───────────────────────── */
  {
    src: 'govindarao-marriage', slug: 'telugu-wedding', sample: 'Telugu Wedding',
    exclude: [],
    replace: [
      ['శ్రీ కొప్పు నవరయ్య – శ్రీమతి బాలమ్మ', 'శ్రీ వేముల రామచంద్రరావు – శ్రీమతి సీతామహాలక్ష్మి'],
      ['గోవిందరావు', 'కార్తికేయ'], ['వనజాక్షి', 'మీనాక్షి'],
      ['<div class="mono">గో<b>♥</b>వ</div>', '<div class="mono">కా<b>♥</b>మీ</div>'],
      ['>గో<b style="font-size:10px">♥</b>వ</div>', '>కా<b style="font-size:10px">♥</b>మీ</div>'],
      ['invitivals.com/govindarao-marriage', 'invitivals.com/showcase/telugu-wedding/'],
      ['గోపాలపురం', 'రామాపురం'], ['Gopalapuram', 'Ramapuram'], ['gopalapuram', 'ramapuram'],
      ['27 ఆగస్టు 2026', '26 ఆగస్టు 2027'],
      ['font-weight:600">27</div>', 'font-weight:600">26</div>'],
      ['AUGUST 2026', 'AUGUST 2027'], ['27-08-2026', '26-08-2027'], ['27 · 08 · 2026', '26 · 08 · 2027'],
      ['2026-08-27T12:00:00+05:30', '2027-08-26T12:00:00+05:30'],
      ['Date.UTC(2026, 7, 27,', 'Date.UTC(2027, 7, 26,'],
      ['20260827T', '20270826T'],
    ],
    credit: ["</section>\n\n</div>\n</div>\n\n<button id=\"musicBtn\"", 'before', "<a class=\"inv-credit\" href=\"/#collection\" aria-label=\"Created by Invitivals\" style=\"display:block;text-align:center;background:#4A1016;padding:14px 0 calc(20px + env(safe-area-inset-bottom, 0px));font-family:'Cormorant Garamond',serif;font-size:10.5px;letter-spacing:.3em;text-transform:uppercase;color:rgba(241,223,160,.8);text-decoration:none\">Created by <b style=\"font-weight:600;letter-spacing:.2em\">Invitivals</b></a>\n"],
    forbid: ['గోవింద', 'వనజాక్షి', 'కొప్పు', 'నవరయ్య', 'బాలమ్మ', 'గోపాలపురం', 'gopalapuram', 'govindarao', '2026'],
  },

  /* ───────────────────────── Gruhapravesha ───────────────────────── */
  {
    src: 'poornajnana', slug: 'gruhapravesha', sample: 'Gruhapravesha',
    exclude: ['og-cover.jpg'],
    replace: [
      ['Smt. Seethalakshmamma', 'Smt. Saraswathamma'], ['Sri Srinivasa Shetty', 'Sri Narayana Rao'],
      ['Smt. Poornima and Sri Jnaneshwara', 'Smt. Lakshmi and Sri Raghavendra'],
      ['Smt. Deepthi and Sri Madan', 'Smt. Divya and Sri Manoj'],
      ['Kum. Kiyansh', 'Kum. Aarav'], ['Smt. Veena and Sri. Prakash', 'Smt. Vani and Sri. Pramod'],
      ['Amidala Family Members', 'Rao Family Members'],
      ['Sri PoornaJnana', 'Sri Sai Nilaya'], ['PoornaJnana', 'Sai Nilaya'], ['poornajnana', 'gruhapravesha'],
      ['C104, Shriram Solitaire &ndash; Yelahanka New Town', 'A-204, Palm Meadows &ndash; Whitefield'],
      ['Shriram Solitaire, 4/4, Veerasagara Main Road,<br>Yelahanka New Town, Veerasagara,<br>Bengaluru &ndash; 560064', 'Palm Meadows, Varthur Main Road,<br>Whitefield,<br>Bengaluru &ndash; 560066'],
      ['Shriram+Solitaire+Veerasagara+Main+Rd+Yelahanka+New+Town+Bengaluru+560064', 'Whitefield+Bengaluru+560066'],
      ['31st August 2026', '30th August 2027'],
      ['Date.UTC(2026, 7, 31,', 'Date.UTC(2027, 7, 30,'],
    ],
    credit: ['alt="Temple doorway garden">', 'after', "\n        <a class=\"inv-credit\" href=\"/#collection\" aria-label=\"Created by Invitivals\" style=\"position:absolute;left:50%;bottom:calc(12 * var(--u));transform:translateX(-50%);z-index:3;white-space:nowrap;padding:calc(6 * var(--u)) calc(14 * var(--u));border-radius:999px;background:rgba(255,248,230,.88);border:1px solid rgba(138,90,30,.35);font-size:calc(11 * var(--u));letter-spacing:calc(2.4 * var(--u));text-transform:uppercase;color:#7a4a12;text-decoration:none\">Created by <b style=\"font-weight:600;letter-spacing:.2em\">Invitivals</b></a>"],
    forbid: ['poorna', 'jnan', 'seethalakshm', 'srinivasa shetty', 'deepthi', 'madan', 'kiyansh', 'veena', 'prakash', 'amidala', 'shriram', 'solitaire', 'yelahanka', 'veerasagara', '560064', 'august 2026'],
  },
];

/* ── helpers ── */
const applyAll = (text, pairs) => pairs.reduce((t, [from, to]) => (from instanceof RegExp ? t.replace(from, to) : t.split(from).join(to)), text);

/* names hide inside URL-encoded query values (calendar / WhatsApp share links): decode, swap, re-encode */
function fixEncodedLinks(html, pairs) {
  return html.replace(/(href=")([^"]*%[0-9A-Fa-f]{2}[^"]*)(")/g, (m, a, url, z) => {
    const q = url.indexOf('?');
    if (q < 0) return m;
    const amp = url.includes('&amp;') ? '&amp;' : '&';
    const parts = url.slice(q + 1).split(amp).map((kv) => {
      const eq = kv.indexOf('=');
      if (eq < 0) return kv;
      let val;
      try { val = decodeURIComponent(kv.slice(eq + 1)); } catch { return kv; }
      const next = applyAll(val, pairs);
      return next === val ? kv : kv.slice(0, eq + 1) + encodeURIComponent(next);
    });
    return a + url.slice(0, q + 1) + parts.join(amp) + z;
  });
}

function copyDir(from, to, exclude, rel = '') {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const r = rel ? rel + '/' + e.name : e.name;
    if (exclude.includes(r)) continue;
    if (e.isDirectory()) copyDir(path.join(from, e.name), path.join(to, e.name), exclude, r);
    else fs.copyFileSync(path.join(from, e.name), path.join(to, e.name));
  }
}

const decodedView = (s) => s.replace(/(?:%[0-9A-Fa-f]{2})+/g, (m) => { try { return decodeURIComponent(m); } catch { return m; } });

/* ── run ── */
let failed = false;
for (const job of jobs) {
  const from = path.join(PUBLIC, job.src), to = path.join(OUT, job.slug);
  fs.rmSync(to, { recursive: true, force: true });
  copyDir(from, to, job.exclude);

  const file = path.join(to, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  html = fixEncodedLinks(html, job.replace);
  html = applyAll(html, job.replace);
  if (job.credit) {
    const [anchor, where, add] = job.credit;
    if (!html.includes(anchor)) { failed = true; console.error(`✗ ${job.slug}: credit anchor not found`); }
    else html = html.replace(anchor, where === 'after' ? anchor + add : add + anchor);
  }

  // share metadata: point at the showcase URL, drop name-bearing banners, never index fictional people
  const url = `${SITE}/showcase/${job.slug}/`;
  html = html
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta property="og:image(?::secure_url)?" content="[^"]*">/g, (m) => m.replace(/content="[^"]*"/, `content="${SITE}/showcase/previews/${job.slug}.jpg"`))
    .replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${SITE}/showcase/previews/${job.slug}.jpg">`)
    .replace(/\s*<meta property="og:image:(?:width|height|type)"[^>]*>/g, '')
    .replace(/<meta property="og:site_name"[^>]*>/, '<meta property="og:site_name" content="Invitivals">');
  if (!/name="robots"/.test(html)) html = html.replace('<head>', '<head>\n<meta name="robots" content="noindex">');
  html = html.replace(/<\/title>/, ' · Sample by Invitivals</title>');
  html = html.replace(/<\/body>/i, PILL + '</body>');
  fs.writeFileSync(file, html);

  // verification: nothing of the original may survive, even URL-encoded (embedded base64 art is ignored)
  const hay = decodedView(html.replace(/data:[a-z/+-]+;base64,[A-Za-z0-9+/=]+/g, '')).toLowerCase();
  const hits = job.forbid.filter((t) => hay.includes(t.toLowerCase()));
  const files = fs.readdirSync(to, { recursive: true }).length;
  if (!/class="[^"]*inv-credit/.test(html) || !/Created by/.test(html)) { failed = true; console.error(`✗ ${job.slug}: missing the "Created by Invitivals" credit`); }
  if (hits.length) { failed = true; console.error(`✗ ${job.slug}: leftover tokens → ${hits.join(', ')}`); }
  else console.log(`✓ ${job.slug}  (${files} files, from ${job.src})`);
}
if (failed) { console.error('\nShowcase build FAILED — fix the replacement maps above.'); process.exit(1); }
console.log('\nShowcase copies are in public/showcase/. Client folders were not modified.');
