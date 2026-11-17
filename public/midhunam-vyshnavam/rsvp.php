<?php
/* RSVP for the Midhunam & Vyshnavam Gruhapravesham invitation. This page's own backend: its own key, its own list.
 *
 *   POST rsvp.php  (JSON {name, attending: "yes"|"no", guests, message (optional)})
 *       → appends one JSON line to data/entries.php and answers {ok:true}  (ok means STORED)
 *   GET  rsvp.php?key=ADMIN_KEY          → the replies as a page (for the hosts)
 *   GET  rsvp.php?key=ADMIN_KEY&csv=1    → the replies as a CSV download (opens in Excel and Google Sheets)
 *
 * data/ is created next to this file and closed to the web by its own .htaccess; the entries file is also a .php
 * that exits on its first line, so even a server that ignores .htaccess never shows it.
 * The hosts' key is not in this file (nor in git, nor anywhere in the invitation page): rsvp.secret.php, next to this
 * file, returns it. Without that file the replies are still stored; only the hosts' view and test mode are off.
 * A POST carrying the header "X-Test-Key: ADMIN_KEY" is stored as a test row (shown faded, left out of the totals). */
$__k = is_file(__DIR__ . '/rsvp.secret.php') ? (include __DIR__ . '/rsvp.secret.php') : '';
define('ADMIN_KEY', is_string($__k) && strlen($__k) >= 24 ? $__k : '');
const EVENT = 'Gruhapravesham – Midhunam & Vyshnavam';
const MAX_GUESTS = 20;
const MAX_MESSAGE = 500;
const DATA_DIR = __DIR__ . '/data';
const DATA_FILE = DATA_DIR . '/entries.php';
const GUARD = "<?php exit; ?>\n";

ini_set('display_errors', '0');                      // a PHP notice must never be printed into a JSON reply
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');
header('Referrer-Policy: no-referrer');              // the hosts' link (with its key) is never passed on to another site

function reply($code, $body) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}
function clean($s, $max, $oneLine = true) {
    $s = is_string($s) ? $s : '';
    if (!preg_match('//u', $s)) $s = '';             // not valid UTF-8: dropped rather than stored
    $s = preg_replace($oneLine ? '/[\x00-\x1F\x7F]+/u' : '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', $oneLine ? ' ' : '', $s) ?? '';
    $s = trim(preg_replace($oneLine ? '/\s+/u' : '/\R{3,}/u', $oneLine ? ' ' : "\n\n", $s) ?? '');
    return function_exists('mb_substr') ? mb_substr($s, 0, $max, 'UTF-8') : substr($s, 0, $max);
}
function rows($fh = null) {
    /* with a handle: read through it (the caller holds its lock) */
    if ($fh) { rewind($fh); $text = stream_get_contents($fh); }
    else $text = file_exists(DATA_FILE) ? file_get_contents(DATA_FILE) : '';
    $rows = [];
    foreach (preg_split('/\R/', (string)$text) as $l) {
        if ($l === '' || $l[0] !== '{') continue;
        $r = json_decode($l, true);
        if (is_array($r)) $rows[] = $r;
    }
    return $rows;
}
/* a spreadsheet must show a guest's words as words, never run them as a formula */
function cell($s) { $s = (string)$s; return ($s !== '' && strpos("=+-@\t\r", $s[0]) !== false) ? "'" . $s : $s; }
function ist($iso) { $t = strtotime((string)$iso); return $t ? gmdate('d M Y, h:i A', $t + 19800) : ''; }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input', false, null, 0, 20000);
    $in = json_decode((string)$raw, true);
    if (!is_array($in)) reply(400, ['ok' => false, 'error' => 'The reply could not be read']);
    if (clean($in['website'] ?? '', 200) !== '') reply(200, ['ok' => true]);              // the hidden field only robots fill

    $name = clean($in['name'] ?? '', 80);
    $attending = $in['attending'] ?? '';
    $message = clean($in['message'] ?? '', MAX_MESSAGE, false);
    $guests = is_numeric($in['guests'] ?? null) ? (int)$in['guests'] : 0;
    $len = function_exists('mb_strlen') ? mb_strlen($name, 'UTF-8') : strlen($name);
    if ($len < 2) reply(422, ['ok' => false, 'error' => 'Please enter your full name']);
    if (!in_array($attending, ['yes', 'no'], true)) reply(422, ['ok' => false, 'error' => 'Please choose whether you will attend']);
    if ($attending === 'yes' && ($guests < 1 || $guests > MAX_GUESTS)) reply(422, ['ok' => false, 'error' => 'The number of guests must be from 1 to ' . MAX_GUESTS]);
    if ($attending === 'no') $guests = 0;

    $test = ADMIN_KEY !== '' && hash_equals(ADMIN_KEY, (string)($_SERVER['HTTP_X_TEST_KEY'] ?? ''));
    $ip = substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45);

    if (!is_dir(DATA_DIR) && !mkdir(DATA_DIR, 0755, true)) reply(500, ['ok' => false, 'error' => 'The reply could not be stored']);
    $ht = DATA_DIR . '/.htaccess';
    if (!file_exists($ht)) @file_put_contents($ht, "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n");

    $fh = fopen(DATA_FILE, 'c+');
    if (!$fh || !flock($fh, LOCK_EX)) reply(500, ['ok' => false, 'error' => 'The reply could not be stored']);
    /* the very same reply sent again within ten minutes (a double tap, a retry, a reload) is stored once; a guest who
       changes the answer is recorded again, so the hosts see the latest; a flood from one address is refused */
    $recent = 0;
    foreach (rows($fh) as $r) {
        $age = time() - (int)strtotime($r['at'] ?? '');
        if ($age < 600 && strcasecmp($r['name'] ?? '', $name) === 0 && ($r['attending'] ?? '') === $attending
            && (int)($r['guests'] ?? 0) === $guests && ($r['message'] ?? '') === $message) { flock($fh, LOCK_UN); fclose($fh); reply(200, ['ok' => true, 'duplicate' => true]); }
        if (($r['ip'] ?? '') === $ip && $age < 3600) $recent++;
    }
    if ($recent >= 12 && !$test) { flock($fh, LOCK_UN); fclose($fh); reply(429, ['ok' => false, 'error' => 'Too many replies from this connection; please try later']); }

    $row = ['at' => gmdate('c'), 'name' => $name, 'attending' => $attending, 'guests' => $guests, 'message' => $message, 'ip' => $ip];
    if ($test) $row['test'] = true;
    fseek($fh, 0, SEEK_END);
    $line = (ftell($fh) === 0 ? GUARD : '') . json_encode($row, JSON_UNESCAPED_UNICODE) . "\n";
    $ok = fwrite($fh, $line);
    fflush($fh); flock($fh, LOCK_UN); fclose($fh);
    if ($ok === false) reply(500, ['ok' => false, 'error' => 'The reply could not be stored']);
    reply(200, ['ok' => true]);
}

/* ── the hosts' view ── */
$key = (string)($_GET['key'] ?? '');
if ($key === '' || ADMIN_KEY === '' || !hash_equals(ADMIN_KEY, $key)) { http_response_code(404); header('Content-Type: text/plain'); echo 'Not found'; exit; }
$rows = array_reverse(rows());
$status = fn($r) => ($r['attending'] ?? '') === 'yes' ? 'Joyfully Accept' : 'Regretfully Decline';
if (isset($_GET['csv'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="rsvp-midhunam-vyshnavam.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, ['Submitted (India time)', 'Guest name', 'Attendance', 'Number of guests', 'Message', 'Test']);
    foreach ($rows as $r) fputcsv($out, [ist($r['at'] ?? ''), cell($r['name'] ?? ''), $status($r), (int)($r['guests'] ?? 0), cell($r['message'] ?? ''), empty($r['test']) ? '' : 'test']);
    exit;
}
$e = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
$real = array_filter($rows, fn($r) => empty($r['test']));
$yes = array_filter($real, fn($r) => ($r['attending'] ?? '') === 'yes');
$no = count($real) - count($yes);
$heads = array_sum(array_map(fn($r) => (int)($r['guests'] ?? 0), $yes));
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer">
<title>Midhunam &amp; Vyshnavam · RSVP replies</title>
<style>
*{box-sizing:border-box}
body{font-family:Georgia,'Times New Roman',serif;background:#f6ecd6;color:#5a3209;margin:0;padding:22px 16px 40px;line-height:1.45}
main{max-width:980px;margin:0 auto}
h1{font-weight:400;font-size:26px;margin:0 0 2px} .sub{margin:0 0 18px;color:#8a5a1e;font-size:15px} a{color:#8a4a1a}
.tot{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:0 0 16px}
.tot div{background:#fffdf6;border:1px solid #d8b878;border-radius:8px;padding:12px 10px;text-align:center}
.tot b{display:block;font-size:30px;font-weight:600;color:#8a4a1a;line-height:1.1} .tot span{font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;color:#8a5a1e}
.bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:0 0 16px}
.btn{display:inline-block;padding:11px 18px;border:1px solid #8a5a1e;border-radius:6px;background:#8a4a1a;color:#fff7e2;text-decoration:none;font-size:15px}
.btn.alt{background:transparent;color:#8a4a1a}
table{width:100%;border-collapse:collapse;background:#fffdf6;border:1px solid #d8b878}
th,td{padding:9px 11px;border-bottom:1px solid #eedfbd;text-align:left;vertical-align:top;font-size:15px}
th{background:#f3e5c8;font-weight:600;white-space:nowrap} td.msg{white-space:pre-wrap;overflow-wrap:anywhere;max-width:44ch} td.n{text-align:center} td.t{white-space:nowrap}
.yes{color:#2f5a35;font-weight:600} .no{color:#9c3d2e;font-weight:600} tr.test td{opacity:.5} .note{margin:14px 0 0;font-size:13.5px;color:#8a5a1e}
@media (max-width:640px){
  h1{font-size:22px} .tot{grid-template-columns:repeat(2,1fr)}
  table,tbody,tr,td{display:block;width:100%} thead{display:none} table{border:0;background:none}
  tr{background:#fffdf6;border:1px solid #d8b878;border-radius:8px;margin:0 0 10px;padding:6px 0}
  td{border:0;padding:5px 12px;max-width:none!important;text-align:left!important;white-space:normal} td.msg{white-space:pre-wrap}
  td::before{content:attr(data-l);display:block;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:#a07840}
  td:empty{display:none}
}
</style></head><body><main>
<h1>Midhunam &amp; Vyshnavam · RSVP replies</h1>
<p class="sub">Gruhapravesham invitation · newest reply first · times are India time</p>
<div class="tot">
  <div><b><?= count($real) ?></b><span>Total submissions</span></div>
  <div><b><?= count($yes) ?></b><span>Accepting</span></div>
  <div><b><?= $no ?></b><span>Declining</span></div>
  <div><b><?= $heads ?></b><span>Confirmed attendees</span></div>
</div>
<div class="bar"><a class="btn" href="?key=<?= $e($key) ?>&amp;csv=1">Download CSV (Excel / Google Sheets)</a><a class="btn alt" href="?key=<?= $e($key) ?>">Refresh</a></div>
<table><thead><tr><th>Submitted</th><th>Guest name</th><th>Attendance</th><th>Guests</th><th>Message</th></tr></thead><tbody>
<?php if (!$rows): ?><tr><td colspan="5">No replies yet.</td></tr><?php endif; ?>
<?php foreach ($rows as $r): $y = ($r['attending'] ?? '') === 'yes'; ?>
<tr<?= empty($r['test']) ? '' : ' class="test"' ?>><td class="t" data-l="Submitted"><?= $e(ist($r['at'] ?? '')) ?></td><td data-l="Guest name"><?= $e($r['name'] ?? '') ?><?= empty($r['test']) ? '' : ' (test)' ?></td><td class="<?= $y ? 'yes' : 'no' ?>" data-l="Attendance"><?= $e($status($r)) ?></td><td class="n" data-l="Guests"><?= $y ? (int)($r['guests'] ?? 0) : '0' ?></td><td class="msg" data-l="Message"><?= $e($r['message'] ?? '') ?></td></tr>
<?php endforeach; ?>
</tbody></table>
<p class="note">Keep this link private: anyone who has it can read the replies.</p>
</main></body></html>
