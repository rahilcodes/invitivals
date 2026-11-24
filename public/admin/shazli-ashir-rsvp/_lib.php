<?php
/* Shazli & Ashir — RSVP dashboard: shared sign-in and data helpers (25 Nov).
 *   /admin/shazli-ashir-rsvp/          the dashboard (sign-in page when signed out)
 *   /admin/shazli-ashir-rsvp/export/   the CSV of the same replies (same sign-in)
 * Replies are the ones stored by /shazli-ashir-wedding/rsvp.php (both invitation links post there, each reply records
 * its link) in shazli-ashir-wedding/data/entries.php, which is closed to the web. Rows marked as tests are left out.
 * The sign-in name and the password's hash are in auth.secret.php next to this file (not in git; the plain password
 * is kept only by the family). Failed sign-ins are counted per address in data/ here (closed to the web). */
if (!defined('SA_RSVP')) { http_response_code(404); exit; }
ini_set('display_errors', '0');
header('Cache-Control: no-store, private');
header('X-Robots-Tag: noindex, nofollow');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');

const SA_BASE = '/admin/shazli-ashir-rsvp/';
define('SA_ENTRIES', dirname(__DIR__, 2) . '/shazli-ashir-wedding/data/entries.php');
define('SA_AUTH', __DIR__ . '/auth.secret.php');
define('SA_DATA', __DIR__ . '/data');
const SA_SESSION_HOURS = 12;
const SA_MAX_FAILS = 8;          // failed sign-ins per address …
const SA_FAIL_WINDOW = 900;      // … within 15 minutes, then sign-in is refused for the rest of the window
const SA_LINKS = ['all-events' => 'All Events', 'nikah-rukhsati' => 'Nikah + Rukhsati'];

function sa_e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

function sa_session() {
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('sa_rsvp');
    session_set_cookie_params(['lifetime' => 0, 'path' => SA_BASE, 'secure' => $https, 'httponly' => true, 'samesite' => 'Lax']);
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
}
function sa_authed() { return !empty($_SESSION['ok']) && (int)($_SESSION['exp'] ?? 0) > time(); }
function sa_csrf_ok() { return is_string($_POST['csrf'] ?? null) && hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf']); }
function sa_creds() {
    $c = is_file(SA_AUTH) ? (include SA_AUTH) : null;
    return is_array($c) && !empty($c['user']) && !empty($c['hash']) ? $c : null;
}

/* failed sign-ins, per address */
function sa_fail_file() {
    if (!is_dir(SA_DATA)) @mkdir(SA_DATA, 0755, true);
    $ht = SA_DATA . '/.htaccess';
    if (!file_exists($ht)) @file_put_contents($ht, "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n");
    return SA_DATA . '/fails.json';
}
function sa_fails($ip, $add = false) {
    $f = sa_fail_file();
    $fh = @fopen($f, 'c+'); if (!$fh) return 0;
    flock($fh, LOCK_EX);
    $all = json_decode((string)stream_get_contents($fh), true); if (!is_array($all)) $all = [];
    $now = time();
    foreach ($all as $k => $list) { $all[$k] = array_values(array_filter((array)$list, fn($t) => $t > $now - SA_FAIL_WINDOW)); if (!$all[$k]) unset($all[$k]); }
    $key = hash('sha256', $ip);
    if ($add) $all[$key][] = $now;
    ftruncate($fh, 0); rewind($fh); fwrite($fh, json_encode($all));
    fflush($fh); flock($fh, LOCK_UN); fclose($fh);
    return count($all[$key] ?? []);
}

/* the replies, newest first, without test rows */
function sa_rows() {
    $text = is_file(SA_ENTRIES) ? (string)file_get_contents(SA_ENTRIES) : '';
    $rows = [];
    foreach (preg_split('/\R/', $text) as $l) {
        if ($l === '' || $l[0] !== '{') continue;
        $r = json_decode($l, true);
        if (!is_array($r) || !empty($r['test'])) continue;
        $t = strtotime($r['at'] ?? '') ?: 0;
        $d = (new DateTime('@' . $t))->setTimezone(new DateTimeZone('Asia/Kolkata'));
        $rows[] = [
            'name' => (string)($r['name'] ?? ''),
            'phone' => (string)($r['phone'] ?? ''),
            'attending' => ($r['attending'] ?? '') === 'yes' ? 'yes' : 'no',
            'guests' => ($r['attending'] ?? '') === 'yes' ? (int)($r['guests'] ?? 0) : 0,
            'link' => (string)($r['link'] ?? ''),
            'ts' => $t,
            'date' => $d->format('d M Y'),
            'isoDate' => $d->format('Y-m-d'),
            'time' => $d->format('h:i A'),
        ];
    }
    usort($rows, fn($a, $b) => $b['ts'] <=> $a['ts']);
    return $rows;
}
function sa_status_label($a) { return $a === 'yes' ? 'Joyfully Accepts' : 'Regretfully Declines'; }
function sa_link_label($l) { return SA_LINKS[$l] ?? 'Not recorded'; }

/* the filters shared by the dashboard and the CSV: ?status=all|accepts|declines&link=…&q=… */
function sa_params() {
    $status = in_array($_GET['status'] ?? '', ['accepts', 'declines'], true) ? $_GET['status'] : 'all';
    $link = array_key_exists($_GET['link'] ?? '', SA_LINKS) ? $_GET['link'] : '';
    $q = trim(mb_substr((string)($_GET['q'] ?? ''), 0, 60, 'UTF-8'));
    return compact('status', 'link', 'q');
}
function sa_filter($rows, $p) {
    $qd = preg_replace('/\D/', '', $p['q']);
    $ql = mb_strtolower($p['q'], 'UTF-8');
    return array_values(array_filter($rows, function ($r) use ($p, $qd, $ql) {
        if ($p['status'] === 'accepts' && $r['attending'] !== 'yes') return false;
        if ($p['status'] === 'declines' && $r['attending'] !== 'no') return false;
        if ($p['link'] !== '' && $r['link'] !== $p['link']) return false;
        if ($ql !== '') {
            $inName = mb_strpos(mb_strtolower($r['name'], 'UTF-8'), $ql, 0, 'UTF-8') !== false;
            $inPhone = $qd !== '' && strpos(preg_replace('/\D/', '', $r['phone']), $qd) !== false;
            if (!$inName && !$inPhone) return false;
        }
        return true;
    }));
}
function sa_query($p, $over = []) {
    $q = array_filter(array_merge($p, $over), fn($v) => $v !== '' && $v !== 'all');
    return $q ? '?' . http_build_query($q) : '';
}
