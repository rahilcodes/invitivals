<?php
/* Dr. Sai Sushmitha Reddy & Sai Santosh Reddy — RSVP dashboard: shared data helpers (24 Nov 2026).
 *   /admin/sai-sushmitha-sai-santosh-rsvp/          the dashboard
 *   /admin/sai-sushmitha-sai-santosh-rsvp/export/   the CSV of the same replies
 * Replies are the ones stored by /sai-sushmitha-sai-santosh-wedding/rsvp.php (this invitation only) in
 * sai-sushmitha-sai-santosh-wedding/data/entries.php, which is closed to the web. Rows marked as tests are left out.
 * Both pages open directly from their links (as the family's other dashboards do): read only, this invitation's
 * replies only (name, attendance, number of guests, time), kept out of search engines (noindex headers). */
if (!defined('SA_RSVP')) { http_response_code(404); exit; }
ini_set('display_errors', '0');
header('Cache-Control: no-store, private');
header('X-Robots-Tag: noindex, nofollow');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');

const SA_BASE = '/admin/sai-sushmitha-sai-santosh-rsvp/';
define('SA_ENTRIES', dirname(__DIR__, 2) . '/sai-sushmitha-sai-santosh-wedding/data/entries.php');
const SA_LINKS = [];   // one invitation link: no versions

function sa_e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

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
function sa_status_label($a) { return $a === 'yes' ? 'Yes, I’ll be attending' : 'Sorry, I won’t be able to attend'; }   // the form's own wording
function sa_link_label($l) { return SA_LINKS[$l] ?? 'Not recorded'; }

/* the filters shared by the dashboard and the CSV: ?status=all|accepts|declines&link=…&q=… */
function sa_params() {
    $status = in_array($_GET['status'] ?? '', ['accepts', 'declines'], true) ? $_GET['status'] : 'all';
    $link = array_key_exists($_GET['link'] ?? '', SA_LINKS) ? $_GET['link'] : '';
    $q = trim(mb_substr((string)($_GET['q'] ?? ''), 0, 60, 'UTF-8'));
    return compact('status', 'link', 'q');
}
function sa_filter($rows, $p) {
    $ql = mb_strtolower($p['q'], 'UTF-8');
    return array_values(array_filter($rows, function ($r) use ($p, $ql) {
        if ($p['status'] === 'accepts' && $r['attending'] !== 'yes') return false;
        if ($p['status'] === 'declines' && $r['attending'] !== 'no') return false;
        if ($p['link'] !== '' && $r['link'] !== $p['link']) return false;
        if ($ql !== '' && mb_strpos(mb_strtolower($r['name'], 'UTF-8'), $ql, 0, 'UTF-8') === false) return false;
        return true;
    }));
}
function sa_query($p, $over = []) {
    $q = array_filter(array_merge($p, $over), fn($v) => $v !== '' && $v !== 'all');
    return $q ? '?' . http_build_query($q) : '';
}
