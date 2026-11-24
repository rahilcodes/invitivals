<?php
/* Shazli & Ashir — the RSVP replies as a CSV (opens in Excel and Google Sheets), read live from the stored replies at
 * every download, the same data as the dashboard. Since 26 Nov (client) it downloads directly, no sign-in.
 * Accepts the dashboard's filters (?status=…&link=…&q=…); without them every reply is included. */
define('SA_RSVP', 1);
require dirname(__DIR__) . '/_lib.php';

$rows = sa_filter(sa_rows(), sa_params());
/* a cell that a spreadsheet would read as a formula is written as plain text */
$text = fn($s) => preg_match('/^[=+\-@\t\r]/', $s) ? "'" . $s : $s;

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="shazli-ashir-rsvp-' . (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('Y-m-d') . '.csv"');
$out = fopen('php://output', 'w');
fwrite($out, "\xEF\xBB\xBF");   // UTF-8 mark, so Excel shows every name correctly
fputcsv($out, ['Guest Name', 'Attendance Status', 'Number of Guests', 'Submission Date', 'Submission Time (IST)', 'Invitation Version']);
foreach ($rows as $r) {
    fputcsv($out, [$text($r['name']), sa_status_label($r['attending']), $r['attending'] === 'yes' ? $r['guests'] : 0, $r['isoDate'], $r['time'], sa_link_label($r['link'])]);
}
fclose($out);
