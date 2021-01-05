<?php
// is cURL installed yet?
if (!function_exists('curl_init')){
die('Sorry cURL is not installed!');
}

$executionStartTime = microtime(true) / 1000;

$fileContents = file_get_contents("../data/countryBorders.geo.json");
$jsonDecode = json_decode($fileContents);
$featuresList = $jsonDecode->features;

$countriesList = [];
foreach($featuresList as $val){
    $countriesList[] = $val->properties;
}

function country(){
    
    global $countriesList, $executionStartTime;
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "mission saved";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $countriesList;
    
    return $output;
}
//header('Content-Type: application/json; charset=UTF-8');
echo(json_encode(country()));
//country();


/*$fileCity = file_get_contents("../data/city.list.json");
$featuresList = $jsonCityDecode->features;
foreach($featuresList as $val){
    $cityList[] = $val->properties;
} */

/* $countrySelect = array_filter($featuresList, function($key){
    //return $key->properties->iso_a2 == "BS";
    return $key->properties->iso_a2 == $_REQUEST['isoa2'];
    });

$countrySelect = array_values($countrySelect);

$countryCoord = [];
$countryCoord = $countrySelect[0];

function apisLatLng($urlApis){

    global $executionStartTime, $countryCoord ;

    $ch = array();
    $mh = curl_multi_init();
    $total = 100;
    $t1 = microtime(true);

    $i = 0;
    foreach($urlApis as $url) {

    $ch[$i] = curl_init();

    curl_setopt($ch[$i], CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch[$i], CURLOPT_HEADER, 0);
    curl_setopt($ch[$i], CURLOPT_RETURNTRANSFER, true);
    curl_multi_add_handle($mh, $ch[$i]);
    curl_setopt($ch[$i], CURLOPT_URL, $url);
    $i ++;
    }

    $active = null;

    do {
    $mrc = curl_multi_exec($mh, $active);
    //usleep(100); // Maybe needed to limit CPU load (See P.S.)
    } while ($active);

    $content = array();

    $i = 0;

    foreach ($ch AS $i => $c) {
    $content[$i] = json_decode(curl_multi_getcontent($c));
    curl_multi_remove_handle($mh, $c);
    }

    curl_multi_close($mh);

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "mission saved";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['apisData'] = $content;
    //$output['data'] = $countriesList;
    $output['countryCoord'] = $countryCoord;

    return $output;


} */
//header('Content-Type: application/json; charset=UTF-8');
//echo(json_encode(apisLatLng($URLs)));
//flickr image link
//https://farm" + photo.farm + ".staticflickr.com/" +  photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg