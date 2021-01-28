<?php
include('../../config.php');

$countryName = $_REQUEST["cName"];
//$countryName = "Bosnia and Herzegovina";
//echo($countryName);
$url = "https://api.quarantine.country/api/v1/summary/region?region=".$countryName;




//Following is http request for weather api
$executionStartTime = microtime(true) / 1000;
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);	

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
//$output['currency'] = $decode['result'];
$output['covid'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo(json_encode($output));


?>