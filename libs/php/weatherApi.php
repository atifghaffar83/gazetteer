<?php
include('../../config.php');
$url = 'https://api.openweathermap.org/data/2.5/find?lat=' . $_REQUEST['lat'] . '&lon=' . $_REQUEST['lng'] . '&cnt=1&appid='.$appidOpenWeather;


//Following is http request for weather api
$executionStartTime = microtime(true) / 1000;
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);	

/* $countriesList = [];

foreach($featuresList as $val){
    $countriesList[] = $val->properties;
} */

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $decode['list'];

header('Content-Type: application/json; charset=UTF-8');

echo(json_encode($output));


?>