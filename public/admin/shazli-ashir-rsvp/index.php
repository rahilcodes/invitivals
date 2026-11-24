<?php
/* Shazli & Ashir — the family's private RSVP dashboard (25 Nov). Signed out: the sign-in page only, no guest data.
 * Signed in: totals, All / Joyfully Accepts / Regretfully Declines, the invitation version, search by name or
 * contact number, every reply with its date and time (India time), and the CSV download (export/). */
define('SA_RSVP', 1);
require __DIR__ . '/_lib.php';
sa_session();

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if (!sa_csrf_ok()) { $error = 'The page had expired. Please try again.'; }
    elseif ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        header('Location: ' . SA_BASE, true, 303); exit;
    } elseif ($action === 'login') {
        $ip = (string)($_SERVER['REMOTE_ADDR'] ?? '');
        $creds = sa_creds();
        if (!$creds) { $error = 'Sign-in is not set up on the server.'; }
        elseif (sa_fails($ip) >= SA_MAX_FAILS) { $error = 'Too many attempts. Please wait 15 minutes and try again.'; }
        else {
            $user = trim((string)($_POST['user'] ?? ''));
            $pass = (string)($_POST['pass'] ?? '');
            if (hash_equals(strtolower($creds['user']), strtolower($user)) && password_verify($pass, $creds['hash'])) {
                session_regenerate_id(true);
                $_SESSION['ok'] = true;
                $_SESSION['exp'] = time() + SA_SESSION_HOURS * 3600;
                $_SESSION['csrf'] = bin2hex(random_bytes(16));
                header('Location: ' . SA_BASE, true, 303); exit;
            }
            sa_fails($ip, true);
            $error = 'The name or password is not correct.';
        }
    }
}
header('Content-Type: text/html; charset=utf-8');
$authed = sa_authed();
if ($authed) {
    $all = sa_rows();
    $p = sa_params();
    $rows = sa_filter($all, $p);
    $acc = array_filter($all, fn($r) => $r['attending'] === 'yes');
    $stats = [
        'Total responses' => count($all),
        'Joyfully Accepts' => count($acc),
        'Regretfully Declines' => count($all) - count($acc),
        'Total attendees' => array_sum(array_column($acc, 'guests')),
    ];
}
?><!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>RSVP Responses · Shazli &amp; Ashir</title>
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
.login{max-width:400px;margin:8vh auto 0;background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:28px 26px;box-shadow:0 10px 30px rgba(80,60,20,.12)}
.login h2{margin:0 0 4px;font:600 22px 'Cinzel',serif;color:var(--green);text-align:center}
.login p{margin:0 0 18px;text-align:center;color:#6b5a36}
.login label{display:block;font-weight:700;margin:12px 0 6px}
.login input{width:100%;min-height:46px;padding:0 12px;border:1px solid var(--line);border-radius:10px;font:500 17px 'Cormorant Garamond',Georgia,serif;background:#fff}
.login .btn{width:100%;margin-top:18px}
.err{color:var(--red);font-weight:700;text-align:center;margin:12px 0 0}
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
  <h1>Shazli &amp; Ashir · RSVP Responses<small>Private: for the family only</small></h1>
  <span class="sp"></span>
  <?php if ($authed): ?>
  <a class="btn solid" href="export/<?= sa_e(sa_query($p)) ?>">Download CSV</a>
  <form method="post" style="margin:0"><input type="hidden" name="csrf" value="<?= sa_e($_SESSION['csrf']) ?>"><button class="btn light" name="action" value="logout">Sign out</button></form>
  <?php endif; ?>
</div></header>
<main>
<?php if (!$authed): ?>
  <form class="login" method="post" autocomplete="on">
    <h2>Sign in</h2>
    <p>The RSVP replies for Shazli &amp; Ashir's wedding.</p>
    <input type="hidden" name="csrf" value="<?= sa_e($_SESSION['csrf']) ?>">
    <label for="user">Name</label><input id="user" name="user" autocomplete="username" required>
    <label for="pass">Password</label><input id="pass" name="pass" type="password" autocomplete="current-password" required>
    <button class="btn solid" name="action" value="login">Sign in</button>
    <?php if ($error): ?><p class="err" role="alert"><?= sa_e($error) ?></p><?php endif; ?>
  </form>
<?php else: ?>
  <section class="stats">
    <?php foreach ($stats as $label => $n): ?><div class="stat"><b><?= (int)$n ?></b><span><?= sa_e($label) ?></span></div><?php endforeach; ?>
  </section>
  <div class="tools">
    <nav class="tabs" aria-label="Filter">
      <?php foreach (['all' => 'All responses', 'accepts' => 'Joyfully Accepts', 'declines' => 'Regretfully Declines'] as $k => $label): ?>
      <a class="tab<?= $p['status'] === $k ? ' on' : '' ?>" href="<?= sa_e(SA_BASE . sa_query($p, ['status' => $k])) ?>"><?= sa_e($label) ?></a>
      <?php endforeach; ?>
    </nav>
    <form class="find" method="get" role="search">
      <?php if ($p['status'] !== 'all'): ?><input type="hidden" name="status" value="<?= sa_e($p['status']) ?>"><?php endif; ?>
      <select name="link" aria-label="Invitation version" onchange="this.form.submit()">
        <option value="">Both invitations</option>
        <?php foreach (SA_LINKS as $k => $label): ?><option value="<?= sa_e($k) ?>"<?= $p['link'] === $k ? ' selected' : '' ?>><?= sa_e($label) ?></option><?php endforeach; ?>
      </select>
      <input type="search" name="q" value="<?= sa_e($p['q']) ?>" placeholder="Search name or number" aria-label="Search by guest name or contact number">
      <button class="btn line">Search</button>
    </form>
  </div>
  <p class="count"><?= count($rows) ?> of <?= count($all) ?> responses shown<?= $p['q'] !== '' ? ' for “' . sa_e($p['q']) . '”' : '' ?>. Times are India time.</p>
  <?php if (!$rows): ?>
    <div class="empty"><?= $all ? 'No responses match this filter.' : 'No responses yet.' ?></div>
  <?php else: ?>
  <table>
    <thead><tr><th>#</th><th>Guest name</th><th>Contact number</th><th>Attendance</th><th>Guests</th><th>Invitation</th><th>Submitted</th></tr></thead>
    <tbody>
    <?php foreach ($rows as $i => $r): ?>
      <tr>
        <td class="n"><?= $i + 1 ?></td>
        <td data-l="Guest"><strong><?= sa_e($r['name']) ?></strong></td>
        <td data-l="Contact"><?= $r['phone'] !== '' ? '<a href="tel:' . sa_e(preg_replace('/[^\d+]/', '', $r['phone'])) . '">' . sa_e($r['phone']) . '</a>' : '<span class="ver">Not given</span>' ?></td>
        <td data-l="Attendance"><span class="st <?= $r['attending'] ?>"><?= sa_status_label($r['attending']) ?></span></td>
        <td data-l="Guests"><?= $r['attending'] === 'yes' ? (int)$r['guests'] : '–' ?></td>
        <td data-l="Invitation"><span class="ver"><?= sa_e(sa_link_label($r['link'])) ?></span></td>
        <td data-l="Submitted"><?= sa_e($r['date']) ?>, <?= sa_e($r['time']) ?></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  <?php endif; ?>
<?php endif; ?>
</main>
</body></html>
