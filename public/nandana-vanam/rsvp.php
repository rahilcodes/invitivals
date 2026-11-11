<?php
/* RSVP for the Nandana Vanam Gruhapravesam invitation.
 *
 *   POST rsvp.php  (JSON {name, email, attending: "yes"|"no", guests, message})
 *       → appends one JSON line to data/entries.php, emails the hosts, answers {ok:true}
 *         ({ok:true} means STORED; the email is a notification on top and its result is recorded with the entry)
 *   GET  rsvp.php?key=ADMIN_KEY          → the replies as a page (for the hosts)
 *   GET  rsvp.php?key=ADMIN_KEY&csv=1    → the replies as a CSV download
 *
 * data/ is created next to this file and closed to the web by its own .htaccess; the entries file is also a .php
 * that exits on its first line, so even a server that ignores .htaccess never shows it.
 * ADMIN_KEY comes from rsvp.secret.php (not in git). A POST carrying the header "X-Test-Key: ADMIN_KEY" is stored as a test and is NOT emailed to the hosts. */
/* the hosts' key is not in this file (nor in git): rsvp.secret.php, next to this file, returns it.
   Without that file the replies are still stored and emailed; only the hosts' view and test mode are off. */
$__k = is_file(__DIR__ . '/rsvp.secret.php') ? (include __DIR__ . '/rsvp.secret.php') : '';
define('ADMIN_KEY', is_string($__k) ? $__k : '');
const NOTIFY_TO = 'caharshajasmin777@gmail.com';
const MAIL_FROM = 'rsvp@invitivals.com';
const EVENT = 'Gruhapravesam Ceremony – Nandana Vanam';
const MAX_GUESTS = 20;
const DATA_DIR = __DIR__ . '/data';
const DATA_FILE = DATA_DIR . '/entries.php';
const GUARD = "<?php exit; ?>\n";

ini_set('display_errors', '0');                      // a PHP notice must never be printed into a JSON reply
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');

function reply($code, $body) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}
function clean($s, $max, $oneLine = true) {
    $s = is_string($s) ? $s : '';
    $s = preg_replace($oneLine ? '/[\x00-\x1F\x7F]+/u' : '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', $oneLine ? ' ' : '', $s) ?? '';
    $s = trim($s);
    return function_exists('mb_substr') ? mb_substr($s, 0, $max, 'UTF-8') : substr($s, 0, $max);
}
function rows($fh = null) {
    /* with a handle: read through it (the caller holds its lock; on Windows a second handle could not read) */
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input', false, null, 0, 20000);
    $in = json_decode($raw, true);
    if (!is_array($in)) reply(400, ['ok' => false, 'error' => 'The reply could not be read']);
    if (clean($in['website'] ?? '', 200) !== '') reply(200, ['ok' => true]);              // the hidden field only robots fill

    $name = clean($in['name'] ?? '', 80);
    $email = clean($in['email'] ?? '', 120);
    $attending = $in['attending'] ?? '';
    $message = clean($in['message'] ?? '', 600, false);
    $guests = (int)($in['guests'] ?? 0);
    $len = function_exists('mb_strlen') ? mb_strlen($name, 'UTF-8') : strlen($name);
    if ($len < 2) reply(422, ['ok' => false, 'error' => 'Please enter your full name']);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) reply(422, ['ok' => false, 'error' => 'Please enter a valid email address']);
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
    /* the same reply sent twice within two minutes (a double tap, a retry) is stored once — sent again later it is a
       new reply and is recorded as one; a flood from one address is refused */
    $existing = rows($fh);
    $recent = 0;
    foreach ($existing as $r) {
        if (strcasecmp($r['email'] ?? '', $email) === 0 && ($r['name'] ?? '') === $name && ($r['attending'] ?? '') === $attending
            && (int)($r['guests'] ?? 0) === $guests && ($r['message'] ?? '') === $message && strtotime($r['at'] ?? '') > time() - 120) { flock($fh, LOCK_UN); fclose($fh); reply(200, ['ok' => true, 'duplicate' => true]); }
        if (($r['ip'] ?? '') === $ip && strtotime($r['at'] ?? '') > time() - 3600) $recent++;
    }
    if ($recent >= 12 && !$test) { flock($fh, LOCK_UN); fclose($fh); reply(429, ['ok' => false, 'error' => 'Too many replies from this connection; please try later']); }

    $mailed = null;
    if (!$test && NOTIFY_TO !== '') {
        $subject = 'RSVP: ' . $name . ' — ' . ($attending === 'yes' ? 'Joyfully accepts (' . $guests . ')' : 'Regretfully declines');
        $body = EVENT . "\n\nName: $name\nEmail: $email\nAttending: " . ($attending === 'yes' ? "Joyfully accepts\nNumber of guests: $guests" : 'Regretfully declines')
            . ($message !== '' ? "\n\nMessage:\n$message" : '') . "\n\nAll replies: https://invitivals.com/nandana-vanam/rsvp.php?key=" . ADMIN_KEY . "\n";
        $headers = 'From: Nandana Vanam Invitation <' . MAIL_FROM . ">\r\nReply-To: " . $email . "\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit";
        $mailed = @mail(NOTIFY_TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . MAIL_FROM);
    }
    $row = ['at' => gmdate('c'), 'name' => $name, 'email' => $email, 'attending' => $attending, 'guests' => $guests, 'message' => $message, 'ip' => $ip, 'mailed' => $mailed];
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
if (isset($_GET['csv'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="rsvp-nandana-vanam.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, ['Time (UTC)', 'Name', 'Email', 'Attending', 'Guests', 'Message', 'Test']);
    foreach ($rows as $r) fputcsv($out, [$r['at'] ?? '', $r['name'] ?? '', $r['email'] ?? '', $r['attending'] ?? '', $r['guests'] ?? '', $r['message'] ?? '', empty($r['test']) ? '' : 'test']);
    exit;
}
$e = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
$real = array_filter($rows, fn($r) => empty($r['test']));
$yes = array_filter($real, fn($r) => ($r['attending'] ?? '') === 'yes');
$no = count(array_filter($real, fn($r) => ($r['attending'] ?? '') === 'no'));
$heads = array_sum(array_map(fn($r) => (int)($r['guests'] ?? 0), $yes));
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Nandana Vanam · RSVP replies</title>
<style>
body{font-family:Georgia,serif;background:#f6ecd6;color:#5a3209;margin:0;padding:24px}
h1{font-weight:400;margin:0 0 6px} .sum{color:#8a5a1e;margin:0 0 18px} a{color:#8a4a1a}
.wrap{overflow-x:auto} table{width:100%;border-collapse:collapse;background:#fffdf6;border:1px solid #d8b878} th,td{padding:8px 10px;border-bottom:1px solid #eedfbd;text-align:left;vertical-align:top;font-size:14px}
th{background:#f3e5c8;font-weight:600} td.msg{white-space:pre-wrap;max-width:46ch} .yes{color:#2f5a35} .no{color:#9c3d2e} tr.test td{opacity:.5}
</style></head><body>
<h1>Nandana Vanam · RSVP replies</h1>
<p class="sum"><?= count($yes) ?> accept (<?= $heads ?> guests in all) · <?= $no ?> decline · <a href="?key=<?= $e($key) ?>&amp;csv=1">Download CSV</a></p>
<div class="wrap"><table><thead><tr><th>Time (UTC)</th><th>Name</th><th>Email</th><th>Attending</th><th>Guests</th><th>Message</th></tr></thead><tbody>
<?php if (!$rows): ?><tr><td colspan="6">No replies yet.</td></tr><?php endif; ?>
<?php foreach ($rows as $r): ?>
<tr<?= empty($r['test']) ? '' : ' class="test"' ?>><td><?= $e($r['at'] ?? '') ?></td><td><?= $e($r['name'] ?? '') ?><?= empty($r['test']) ? '' : ' (test)' ?></td><td><?= $e($r['email'] ?? '') ?></td><td class="<?= $e($r['attending'] ?? '') ?>"><?= ($r['attending'] ?? '') === 'yes' ? 'Accepts' : 'Declines' ?></td><td><?= $e($r['guests'] ?? '') ?></td><td class="msg"><?= $e($r['message'] ?? '') ?></td></tr>
<?php endforeach; ?>
</tbody></table></div>
</body></html>
