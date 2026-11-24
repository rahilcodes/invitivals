<?php
/* RSVP for Shazli Haider & Syed Mohammed Ashir Kamal (the same system as public/nandana-vanam/rsvp.php, with its own
 * data folder and its own key; no email is sent). BOTH links post here: shazli-ashir-wedding (all events) and
 * shazli-ashir-nikah (Nikah + Rukhsati only); each reply records which link it came from.
 *
 *   POST rsvp.php  (JSON {name, attending: "yes"|"no", guests, link}; a phone is accepted but the form no longer asks)
 *       → appends one JSON line to data/entries.php and answers {ok:true} (ok means STORED)
 *   The family reads the replies at /admin/shazli-ashir-rsvp/ and downloads them as a CSV from
 *   /admin/shazli-ashir-rsvp/export/: public/admin/shazli-ashir-rsvp/ (no sign-in since 26 Nov). Since 26 Nov the form
 *   asks only attendance, name and number of guests. The old private link (rsvp.php?key=ADMIN_KEY) leads to the dashboard.
 *
 * data/ is created next to this file and closed to the web by its own .htaccess; the entries file is also a .php
 * that exits on its first line, so even a server that ignores .htaccess never shows it.
 * ADMIN_KEY comes from rsvp.secret.php (not in git). A POST carrying the header "X-Test-Key: ADMIN_KEY" is stored as a test and is NOT emailed to the hosts. */
/* the hosts' key is not in this file (nor in git): rsvp.secret.php, next to this file, returns it.
   Without that file the replies are still stored and emailed; only the hosts' view and test mode are off. */
$__k = is_file(__DIR__ . '/rsvp.secret.php') ? (include __DIR__ . '/rsvp.secret.php') : '';
define('ADMIN_KEY', is_string($__k) ? $__k : '');
const NOTIFY_TO = '';   // no email: the hosts read the replies in the list below (client, 2026-11-14)
const MAIL_FROM = 'rsvp@invitivals.com';
const EVENT = 'Wedding of Shazli Haider & Syed Mohammed Ashir Kamal';
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
    $phone = clean($in['phone'] ?? '', 24);
    $attending = $in['attending'] ?? '';
    $message = clean($in['message'] ?? '', 600, false);
    $guests = (int)($in['guests'] ?? 0);
    $link = in_array($in['link'] ?? '', ['all-events', 'nikah-rukhsati'], true) ? $in['link'] : '';
    $len = function_exists('mb_strlen') ? mb_strlen($name, 'UTF-8') : strlen($name);
    if ($len < 2) reply(422, ['ok' => false, 'error' => 'Please enter your full name']);
    $digits = strlen(preg_replace('/\D/', '', $phone));   // any country's number: 7 to 15 digits, with + ( ) - . and spaces allowed
    if ($phone !== '' && (!preg_match('/^\+?[0-9\s().-]+$/', $phone) || $digits < 7 || $digits > 15)) reply(422, ['ok' => false, 'error' => 'Please enter a valid contact number']);
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) reply(422, ['ok' => false, 'error' => 'Please enter a valid email address']);
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
        if (strcasecmp($r['email'] ?? '', $email) === 0 && ($r['name'] ?? '') === $name && ($r['phone'] ?? '') === $phone && ($r['attending'] ?? '') === $attending
            && (int)($r['guests'] ?? 0) === $guests && ($r['message'] ?? '') === $message && strtotime($r['at'] ?? '') > time() - 120) { flock($fh, LOCK_UN); fclose($fh); reply(200, ['ok' => true, 'duplicate' => true]); }
        if (($r['ip'] ?? '') === $ip && strtotime($r['at'] ?? '') > time() - 3600) $recent++;
    }
    if ($recent >= 12 && !$test) { flock($fh, LOCK_UN); fclose($fh); reply(429, ['ok' => false, 'error' => 'Too many replies from this connection; please try later']); }

    $mailed = null;
    if (!$test && NOTIFY_TO !== '') {
        $subject = 'Shazli & Ashir – Wedding RSVP';
        $body = "Guest Name: $name\r\n\r\nContact Number: $phone\r\n\r\nAttendance: " . ($attending === 'yes' ? "Attending\r\n\r\nNumber of Guests: $guests" : 'Unable to Attend')
            . ($email !== '' ? "\r\n\r\nEmail: $email" : '') . ($message !== '' ? "\r\n\r\nMessage:\r\n$message" : '')
            . "\r\n\r\nAll replies: https://invitivals.com/shazli-ashir-wedding/rsvp.php?key=" . ADMIN_KEY . "\r\n";
        $headers = 'From: Wedding Invitation <' . MAIL_FROM . '>' . ($email !== '' ? "\r\nReply-To: " . $email : '') . "\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit";
        $mailed = @mail(NOTIFY_TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . MAIL_FROM);
    }
    $row = ['at' => gmdate('c'), 'name' => $name, 'phone' => $phone, 'email' => $email, 'attending' => $attending, 'guests' => $guests, 'message' => $message, 'link' => $link, 'ip' => $ip, 'mailed' => $mailed];
    if ($test) $row['test'] = true;
    fseek($fh, 0, SEEK_END);
    $line = (ftell($fh) === 0 ? GUARD : '') . json_encode($row, JSON_UNESCAPED_UNICODE) . "\n";
    $ok = fwrite($fh, $line);
    fflush($fh); flock($fh, LOCK_UN); fclose($fh);
    if ($ok === false) reply(500, ['ok' => false, 'error' => 'The reply could not be stored']);
    reply(200, ['ok' => true, 'mailed' => $mailed === true]);   // mailed: the server itself emailed the hosts (false while the host has mail switched off)
}

/* ── the old private link: replies are read only at the signed-in dashboard now ── */
$key = (string)($_GET['key'] ?? '');
if ($key !== '' && ADMIN_KEY !== '' && hash_equals(ADMIN_KEY, $key)) { header('Location: /admin/shazli-ashir-rsvp/', true, 302); exit; }
http_response_code(404); header('Content-Type: text/plain'); echo 'Not found';
