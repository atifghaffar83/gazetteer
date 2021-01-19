<?php

//Following is preparing country list on page load
$executionStartTime = microtime(true) / 1000;

//country list
$contents = file_get_contents("../data/countryBorders.geo.json");
$jsonDecode = json_decode($contents);
$featuresList = $jsonDecode->features;

$countriesList = [];
foreach($featuresList as $val){
    $countriesList[] = $val->properties;
}


$countryCoord = [];
if(isset($countrySelect)){
    $countryCoord = $countrySelect[0];
}


$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $countriesList;


//header('Content-Type: application/json; charset=UTF-8');

echo(json_encode($output));


?>