<?php

//Following is preparing country list on page load
$executionStartTime = microtime(true) / 1000;
//$contents = file_get_contents("../data/countries.geojson");
$contents = file_get_contents("../data/countryBorders.geo.json");
$jsonDecode = json_decode($contents);
$featuresList = $jsonDecode->features;

if(isset($_REQUEST['isoa2'])){


$countrySelect = array_filter($featuresList, function($key){
    //return $key->properties->iso_a2 == "BS";
    return $key->properties->iso_a2 == $_REQUEST['isoa2'];
    });
$countrySelect = array_values($countrySelect);
}

$countryCoord = [];
if(isset($countrySelect)){
    $countryCoord = $countrySelect[0];
}


//=================================================================

$URLs = array( 
    "http://api.worldbank.org/v2/country/".$_REQUEST['isoa2']."?format=json",
    //country information api endpoint
    //"https://restcountries.eu/rest/v2/alpha/".$_REQUEST['isoa2']

);

//running apis using curl
function apisCountry($urlApis){

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
    $output['apisCountryData'] = $content;
    $output['countryCoord'] = $countryCoord;

    return $output;


}

echo(json_encode(apisCountry($URLs)));


?>