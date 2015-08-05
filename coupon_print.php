<?php
error_reporting(E_WARNING);
// header('Content-Type: application/pdf');
include('mpdf/mpdf.php');
// include('/Users/krasulya/Dropbox/Work/psd2html/20131206_mishlen/mpdf/classes/grad.php');

$html = file_get_contents('./coupon_print.html');

// echo $html;

$mpdf = new mPDF();
$mpdf->WriteHTML($html);
$mpdf->Output();
exit;
?>