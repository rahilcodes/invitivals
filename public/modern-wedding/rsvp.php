<?php
/* RSVP and dua storage for the Modern Wedding invitation.
 *
 *   POST rsvp.php  (JSON {kind: "rsvp"|"dua", attending: "yes"|"no"|"", name, message, guest})
 *       → appends one JSON line to data/entries.php and answers {ok:true}
 *   GET  rsvp.php?key=ADMIN_KEY          → the entries as a page
 *   GET  rsvp.php?key=ADMIN_KEY&csv=1    → the entries as a CSV download
 *
 * data/ is created next to this file and closed to the web by its own .htaccess; the entries file is
 * also a .php that exits on its first line, so even a server that ignores .htaccess never shows it. */
const ADMIN_KEY = 'ar-2026-mauve-9f3c7e';          // change before sharing the link with the couple
const DATA_DIR = __DIR__ . '/data';
const DATA_FILE = DATA_DIR . '/entries.php';
const GUARD = "<?php exit; ?>\n";

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply($code, $body) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}
function clean($s, $max) {
    $s = is_string($s) ? $s : '';
    $s = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s));
    if (function_exists('mb_substr')) return mb_substr($s, 0, $max, 'UTF-8');
    return substr($s, 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input', false, null, 0, 20000);
    $in = json_decode($raw, true);
    if (!is_array($in)) reply(400, ['ok' => false, 'error' => 'Expected a JSON body']);
    $kind = ($in['kind'] ?? '') === 'dua' ? 'dua' : 'rsvp';
    $attending = $in['attending'] ?? '';
    if (!in_array($attending, ['yes', 'no', ''], true)) reply(400, ['ok' => false, 'error' => 'attending must be yes, no or empty']);
    $name = clean($in['name'] ?? '', 80);
    $message = clean($in['message'] ?? '', 1000);
    $guest = preg_replace('/[^a-z0-9]/i', '', (string)($in['guest'] ?? ''));
    if ($kind === 'rsvp' && $attending === '') reply(400, ['ok' => false, 'error' => 'No choice given']);
    if ($kind === 'dua' && ($name === '' || $message === '')) reply(400, ['ok' => false, 'error' => 'A name and a message are needed']);

    if (!is_dir(DATA_DIR) && !mkdir(DATA_DIR, 0755, true)) reply(500, ['ok' => false, 'error' => 'Storage folder cannot be created']);
    $ht = DATA_DIR . '/.htaccess';
    if (!file_exists($ht)) @file_put_contents($ht, "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n");
    $row = [
        'at' => gmdate('c'),
        'kind' => $kind,
        'attending' => $attending,
        'name' => $name,
        'message' => $message,
        'guest' => substr($guest, 0, 40),
        'ip' => substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45),
    ];
    $line = (file_exists(DATA_FILE) ? '' : GUARD) . json_encode($row, JSON_UNESCAPED_UNICODE) . "\n";
    $ok = file_put_contents(DATA_FILE, $line, FILE_APPEND | LOCK_EX);
    if ($ok === false) reply(500, ['ok' => false, 'error' => 'Could not write the entry']);
    reply(200, ['ok' => true]);
}

/* ── the couple's view ── */
$key = (string)($_GET['key'] ?? '');
if ($key === '' || !hash_equals(ADMIN_KEY, $key)) { http_response_code(404); header('Content-Type: text/plain'); echo 'Not found'; exit; }
$rows = [];
if (file_exists(DATA_FILE)) {
    foreach (file(DATA_FILE, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $l) { if ($l[0] !== '{') continue; $r = json_decode($l, true); if (is_array($r)) $rows[] = $r; }
}
$rows = array_reverse($rows);
if (isset($_GET['csv'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="rsvp-modern-wedding.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, ['Time (UTC)', 'Kind', 'Attending', 'Name', 'Message', 'Guest']);
    foreach ($rows as $r) fputcsv($out, [$r['at'] ?? '', $r['kind'] ?? '', $r['attending'] ?? '', $r['name'] ?? '', $r['message'] ?? '', $r['guest'] ?? '']);
    exit;
}
$e = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
$yes = count(array_filter($rows, fn($r) => ($r['kind'] ?? '') === 'rsvp' && ($r['attending'] ?? '') === 'yes'));
$no = count(array_filter($rows, fn($r) => ($r['kind'] ?? '') === 'rsvp' && ($r['attending'] ?? '') === 'no'));
$duas = count(array_filter($rows, fn($r) => ($r['kind'] ?? '') === 'dua'));
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Ayesha &amp; Rehan · RSVP &amp; duas</title>
<style>
body{font-family:Georgia,serif;background:#f6edf1;color:#4a1f35;margin:0;padding:24px}
h1{font-weight:400;margin:0 0 6px} .sum{color:#8a5a74;margin:0 0 18px} a{color:#7b4668}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e3cfd9} th,td{padding:8px 10px;border-bottom:1px solid #eee0e7;text-align:left;vertical-align:top;font-size:14px}
th{background:#f0e2e9;font-weight:600} td.msg{white-space:pre-wrap;max-width:46ch} .yes{color:#2c6e3a} .no{color:#9b1b1b}
</style></head><body>
<h1>Ayesha &amp; Rehan · RSVP &amp; duas</h1>
<p class="sum"><?= $yes ?> will attend · <?= $no ?> unable to attend · <?= $duas ?> duas · <a href="?key=<?= $e($key) ?>&amp;csv=1">Download CSV</a></p>
<table><thead><tr><th>Time (UTC)</th><th>Kind</th><th>Attending</th><th>Name</th><th>Message</th></tr></thead><tbody>
<?php if (!$rows): ?><tr><td colspan="5">No entries yet.</td></tr><?php endif; ?>
<?php foreach ($rows as $r): ?>
<tr><td><?= $e($r['at'] ?? '') ?></td><td><?= $e($r['kind'] ?? '') ?></td><td class="<?= $e($r['attending'] ?? '') ?>"><?= $e($r['attending'] ?? '') ?></td><td><?= $e($r['name'] ?? '') ?></td><td class="msg"><?= $e($r['message'] ?? '') ?></td></tr>
<?php endforeach; ?>
</tbody></table>
</body></html>
