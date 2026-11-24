<?php
/* Dr. Sai Sushmitha Reddy & Sai Santosh Reddy — the family's RSVP dashboard; it opens directly from its link:
 * totals, All / Attending / Not attending, search by name, every reply with its number of
 * guests and its date and time (India time), and the CSV download (export/). Read only. */
define('SA_RSVP', 1);
require __DIR__ . '/_lib.php';
header('Content-Type: text/html; charset=utf-8');
$all = sa_rows();
$p = sa_params();
$rows = sa_filter($all, $p);
$acc = array_filter($all, fn($r) => $r['attending'] === 'yes');
$stats = [
    'Total responses' => count($all),
    'Attending' => count($acc),
    'Not attending' => count($all) - count($acc),
    'Total guests attending' => array_sum(array_column($acc, 'guests')),
];
?><!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>RSVP Responses · Sai Sushmitha &amp; Sai Santosh</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Playfair+Display:ital,wght@0,600;1,400&family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
<style>
:root{--green:#0f3b2c;--green2:#1f5a43;--gold:#c9a24f;--goldd:#9a7428;--cream:#f6ecd4;--paper:#fffaf0;--ink:#24382f;--line:#e7d6ad;--red:#9c3d2e}
*{box-sizing:border-box}
body{margin:0;background:#f3e8cf;color:var(--ink);font:500 17px/1.45 'Cormorant Garamond',Georgia,serif}
a{color:var(--green)}
.top{background:linear-gradient(180deg,#14452f,#0d3324);color:var(--cream);border-bottom:2px solid var(--gold)}
.top .in{max-width:1160px;margin:0 auto;padding:16px 20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.top h1{margin:0;font:600 clamp(18px,3.4vw,24px)/1.2 'Cinzel',serif;letter-spacing:.06em}
.top small{display:block;font:italic 400 15px 'Playfair Display',serif;color:#e7d39b;letter-spacing:0}
.top .sp{flex:1}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;padding:0 18px;border-radius:999px;border:1px solid var(--gold);font:600 13px/1 'Cinzel',serif;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;cursor:pointer;white-space:nowrap}
.btn.solid{background:linear-gradient(180deg,var(--green2),var(--green));color:var(--cream)}
.btn.light{background:rgba(255,250,240,.12);color:var(--cream)}
.btn.line{background:var(--paper);color:var(--green)}
main{max-width:1160px;margin:0 auto;padding:22px 20px 48px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
.stat{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:14px 16px;box-shadow:0 4px 14px rgba(120,90,30,.06)}
.stat b{display:block;font:600 30px/1.1 'Playfair Display',serif;color:var(--green)}
.stat span{font-size:15px;color:#6b5a36}
.tools{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:14px}
.tabs{display:flex;gap:6px;flex-wrap:wrap}
.tab{padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:var(--paper);text-decoration:none;color:var(--ink);font-weight:600;font-size:16px}
.tab.on{background:var(--green);border-color:var(--green);color:var(--cream)}
form.find{display:flex;gap:8px;flex-wrap:wrap;margin-left:auto}
.find input,.find select{min-height:42px;padding:0 12px;border:1px solid var(--line);border-radius:10px;background:var(--paper);font:500 16px 'Cormorant Garamond',Georgia,serif;color:var(--ink)}
.find input{width:230px}
.count{margin:0 0 10px;color:#6b5a36}
table{width:100%;border-collapse:collapse;background:var(--paper);border:1px solid var(--line);border-radius:14px;overflow:hidden}
th,td{padding:11px 12px;text-align:left;border-bottom:1px solid #f0e4c6;vertical-align:top}
th{background:#f6ead0;font:600 12px 'Cinzel',serif;letter-spacing:.08em;text-transform:uppercase;color:#5d4b25}
td.n{color:#8b7a55;width:42px}
.st{display:inline-block;padding:2px 10px;border-radius:999px;font-weight:700;font-size:15px;white-space:nowrap}
.st.yes{background:#e3efe6;color:#1f5a35}.st.no{background:#f6e3dd;color:var(--red)}
.ver{font-size:15px;color:#6b5a36;white-space:nowrap}
.empty{padding:28px;text-align:center;color:#6b5a36;background:var(--paper);border:1px solid var(--line);border-radius:14px}
@media (max-width:760px){
  .stats{grid-template-columns:repeat(2,1fr)}
  form.find{margin-left:0;width:100%}.find input{flex:1;width:auto}
  table,thead,tbody,tr,td{display:block}thead{display:none}
  table{background:none;border:0}
  tr{background:var(--paper);border:1px solid var(--line);border-radius:14px;margin-bottom:10px;padding:8px 4px}
  td{border:0;padding:4px 12px;display:flex;gap:10px}
  td::before{content:attr(data-l);flex:0 0 110px;font:600 11px/1.9 'Cinzel',serif;letter-spacing:.08em;text-transform:uppercase;color:#8b7a55}
  td.n{display:none}
}
</style></head><body>
<header class="top"><div class="in">
  <h1>Sai Sushmitha &amp; Sai Santosh · RSVP Responses<small>Wedding · Sunday, 13 December 2026</small></h1>
  <span class="sp"></span>
  <a class="btn solid" href="export/<?= sa_e(sa_query($p)) ?>">Download CSV</a>
</div></header>
<main>
  <section class="stats">
    <?php foreach ($stats as $label => $n): ?><div class="stat"><b><?= (int)$n ?></b><span><?= sa_e($label) ?></span></div><?php endforeach; ?>
  </section>
  <div class="tools">
    <nav class="tabs" aria-label="Filter">
      <?php foreach (['all' => 'All responses', 'accepts' => 'Attending', 'declines' => 'Not attending'] as $k => $label): ?>
      <a class="tab<?= $p['status'] === $k ? ' on' : '' ?>" href="<?= sa_e(SA_BASE . sa_query($p, ['status' => $k])) ?>"><?= sa_e($label) ?></a>
      <?php endforeach; ?>
    </nav>
    <form class="find" method="get" role="search">
      <?php if ($p['status'] !== 'all'): ?><input type="hidden" name="status" value="<?= sa_e($p['status']) ?>"><?php endif; ?>
      <input type="search" name="q" value="<?= sa_e($p['q']) ?>" placeholder="Search by guest name" aria-label="Search by guest name">
      <button class="btn line">Search</button>
    </form>
  </div>
  <p class="count"><?= count($rows) ?> of <?= count($all) ?> responses shown<?= $p['q'] !== '' ? ' for “' . sa_e($p['q']) . '”' : '' ?>. Times are India time.</p>
  <?php if (!$rows): ?>
    <div class="empty"><?= $all ? 'No responses match this filter.' : 'No responses yet.' ?></div>
  <?php else: ?>
  <table>
    <thead><tr><th>#</th><th>Guest name</th><th>Attendance</th><th>Guests</th><th>Submitted</th></tr></thead>
    <tbody>
    <?php foreach ($rows as $i => $r): ?>
      <tr>
        <td class="n"><?= $i + 1 ?></td>
        <td data-l="Guest"><strong><?= sa_e($r['name']) ?></strong></td>
        <td data-l="Attendance"><span class="st <?= $r['attending'] ?>"><?= sa_status_label($r['attending']) ?></span></td>
        <td data-l="Guests"><?= $r['attending'] === 'yes' ? (int)$r['guests'] : '–' ?></td>
        <td data-l="Submitted"><?= sa_e($r['date']) ?>, <?= sa_e($r['time']) ?></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  <?php endif; ?>
</main>
</body></html>
