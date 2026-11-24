<?php
/* Shazli & Ashir — the RSVP replies as a CSV (opens in Excel and Google Sheets), read live from the stored replies at
 * every download. Same sign-in as the dashboard; signed out it sends no data and leads to the sign-in page.
 * Accepts the dashboard's filters (?status=…&link=…&q=…); without them every reply is included. */
define('SA_RSVP', 1);
require dirname(__DIR__) . '/_lib.php';
sa_session();
if (!sa_authed()) { header('Location: ' . SA_BASE, true, 303); exit; }

$rows = sa_filter(sa_rows(), sa_params());
/* a cell that a spreadsheet would read as a formula is written as plain text; contact numbers are kept as text
   so a leading + and long numbers survive (="…" holds only the digits and + ( ) - . and spaces the form allows) */
$text = fn($s) => preg_match('/^[=+\-@\t\r]/', $s) ? "'" . $s : $s;
$phone = fn($s) => $s === '' ? '' : (preg_match('/^\+?[0-9\s().-]+$/', $s) ? '="' . $s . '"' : $text($s));

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="shazli-ashir-rsvp-' . (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('Y-m-d') . '.csv"');
$out = fopen('php://output', 'w');
fwrite($out, "\xEF\xBB\xBF");   // UTF-8 mark, so Excel shows every name correctly
fputcsv($out, ['Guest Name', 'Contact Number', 'Attendance Status', 'Number of Guests', 'Submission Date', 'Submission Time (IST)', 'Invitation Version']);
foreach ($rows as $r) {
    fputcsv($out, [$text($r['name']), $phone($r['phone']), sa_status_label($r['attending']), $r['attending'] === 'yes' ? $r['guests'] : 0, $r['isoDate'], $r['time'], sa_link_label($r['link'])]);
}
fclose($out);
