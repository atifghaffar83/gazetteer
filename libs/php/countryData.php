<?php

//Following is preparing country list on page load
$executionStartTime = microtime(true) / 1000;


//=================================================================
//reading json file for countries border
$contents = file_get_contents("../data/countryBorders.geo.json");
$jsonDecode = json_decode($contents);
$featuresList = $jsonDecode->features;

//=================================================================
//city list with lat/lon
/* $city = file_get_contents("../data/city.list.json");
$jsonCity = json_decode($city); */

/* $cityList = [];
foreach($jsonCity as $val){
    $cityList[] = $val;
}
 */
/* if(isset($_REQUEST['isoa2'])){
    $cityList = array_filter($jsonCity, function($key){
        return $key->country == $_REQUEST['isoa2'];
    });
} */
/* $selectedCities = array_values($cityList);
}

$citiesData = [];
if(isset($selectedCities)){
    $citiesData = $selectedCities[0];
} */
//=================================================================
// returning selected country coordinates
if(isset($_REQUEST['isoa2'])){
    $countrySelect = array_filter($featuresList, function($key){
        return $key->properties->iso_a2 == $_REQUEST['isoa2'];
    });

$countrySelect = array_values($countrySelect);
}

$countryCoord = [];
if(isset($countrySelect)){
    $countryCoord = $countrySelect[0];
}

//=================================================================
//array for different apis

$URLs = array( 
    "http://api.worldbank.org/v2/country/".$_REQUEST['isoa2']."?format=json",
    //country information api endpoint
    "https://restcountries.eu/rest/v2/alpha/".$_REQUEST['isoa2']
    

);

//=================================================================
//running apis using curl
function apisCountry($urlApis){

    global $executionStartTime, $countryCoord, $cityList ;

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

    //=================================================================
    //setting the output for js file

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "mission saved";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['apisCountryData'] = $content;
    $output['countryCoord'] = $countryCoord;
    //$output['cityList'] = $cityList;

    return $output;
}

//=================================================================
//echoing output to js
echo(json_encode(apisCountry($URLs)));


?>