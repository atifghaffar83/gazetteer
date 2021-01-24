<?php
include('../../config.php');
// is cURL installed yet?
if (!function_exists('curl_init')){
die('Sorry cURL is not installed!');
}

$executionStartTime = microtime(true) / 1000;

$fileContents = file_get_contents("../data/countryBorders.geo.json");
$jsonDecode = json_decode($fileContents);
$featuresList = $jsonDecode->features;

/* $_REQUEST["lat"] = 55.94;
$_REQUEST["lng"] = -4.32;
$_REQUEST["isoa2"] = "GB"; */

switch($_REQUEST['isoa2']){
    case "PS":
        $_REQUEST["lat"] = 31.5;
        $_REQUEST["lng"] = 34.4667;
        break;

    case "PK":
        $_REQUEST["lat"] = 33.693056;
        $_REQUEST["lng"] = 73.063889;
        break;
    
    case "ML":
        $_REQUEST["lat"] = 12.79;
        $_REQUEST["lng"] = -7.98;
        break;

    case "MR":
        $_REQUEST["lat"] = 18.07;
        $_REQUEST["lng"] = -15.96;
        break;

    case "CF":
        $_REQUEST["lat"] = 4.39;
        $_REQUEST["lng"] = 18.55;
        break;
    
    default:
    $_REQUEST["lat"];
    $_REQUEST["lng"];
    
}

//open weather api end points
$URLs = array( 
    //ok museums latlng
    "https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=".$_REQUEST['lng']."&lat=".$_REQUEST['lat']."&kinds=museums,monuments_and_memorials,interesting_places&limit=100&format=geojson&apikey=".$apikeyOpenTripMap,
    //timezone api
    "http://api.geonames.org/timezoneJSON?formatted=true&lat=".$_REQUEST['lat']."&lng=".$_REQUEST['lng']."&username=".$usernameGeoname."&style=full",
    
);

function apisLatLng($urlApis){

    //global $executionStartTime, $countryCoord ;
    global $executionStartTime ;

    $ch = array();
    $mh = curl_multi_init();
    $total = 100;
    $t1 = microtime(true);
/* 
    $i = 0;
    foreach($urlApis as $url) {

    $ch[$i] = curl_init();
    
    curl_setopt($ch[$i], CURLOPT_URL, $url);
    curl_setopt($ch[$i], CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch[$i], CURLOPT_HEADER, 0);
    curl_setopt($ch[$i], CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch[$i], CURLOPT_TIMEOUT, 0);
    
    curl_multi_add_handle($mh, $ch[$i]);
    
    $i ++;
    } */

    
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
    //usleep(100); // Maybe needed to limit CPU load (See P.S.)
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
    $output['features'] = $content;
    //$output['data'] = $countriesList;
    //$output['countryCoord'] = $countryCoord;

    return $output;


}

echo(json_encode(apisLatLng($URLs)));
//flickr image link
//https://farm" + photo.farm + ".staticflickr.com/" +  photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg