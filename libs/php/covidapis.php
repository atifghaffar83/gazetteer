<?php
include('../../config.php');
// is cURL installed yet?
if (!function_exists('curl_init')){
die('Sorry cURL is not installed!');
}

$executionStartTime = microtime(true) / 1000;
$countryName = $_REQUEST["cName"];

//covid api end points
$URLs = array( 
    //covid19api
    "https://api.quarantine.country/api/v1/summary/region?region=".$countryName,
    //timezone api
    "https://api.covid19api.com/total/country/south-africa".$countryName,
    
);

function apisLatLng($urlApis){

    global $executionStartTime ;

    $ch = array();
    $mh = curl_multi_init();
    $total = 100;
    $t1 = microtime(true);

    foreach($urlApis as $i => $url) {

    $ch[$i] = curl_init();
    
    curl_setopt($ch[$i], CURLOPT_URL, $url);
    curl_setopt($ch[$i], CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch[$i], CURLOPT_HEADER, 0);
    curl_setopt($ch[$i], CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch[$i], CURLOPT_TIMEOUT, 0);
    
    curl_multi_add_handle($mh, $ch[$i]);
    
    }

    $active = null;

    do {
    curl_multi_exec($mh, $active);
    } while ($active);

    $content = array();
    
    foreach ($ch AS $i => $c) {
    $content[$i] = json_decode(curl_multi_getcontent($c));
    curl_multi_remove_handle($mh, $c);
    }

    curl_multi_close($mh);

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "mission saved";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['covidapis'] = $content;
    
    return $output;


}

echo(json_encode(apisLatLng($URLs)));
