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

switch($_REQUEST['isoa2']){
    case "PS":
        $_REQUEST["lat"] = 31.5;
        $_REQUEST["lng"] = 34.4667;
        break;

    case "PK":
        $_REQUEST["lat"] = 33.693056;
        $_REQUEST["lng"] = 73.063889;
        break;
  
    
}

//open weather api end points
$URLs = array( 
    /* //openeather Api
    "https://api.openweathermap.org/data/2.5/find?lat=" . $_REQUEST['lat'] . "&lon=" . $_REQUEST['lng'] . "&cnt=1&appid=".$appidOpenWeather,
    //? working but not sure useful
    //"http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=".$appidOpenWeather,
    //ok weather city and country wise
    //"http://api.openweathermap.org/data/2.5/weather?q=glasgow&appid=".$appidOpenWeather,
    //ok weather latlng
    //"https://api.openweathermap.org/data/2.5/find?lat=' . $_REQUEST['lat'] . '&lon=' . $_REQUEST['lng'] . '&cnt=1&appid=".$appidOpenWeather,
    //ok earthquake
    //"http://api.geonames.org/earthquakesJSON?formatted=true&north=55.0583836008072&south=47.2701236047002&east=15.0418156516163&west=5.8663152683722&username=".$usernameGeoname."&style=full",
    //ok find wiki link latlng
    "http://api.geonames.org/findNearbyWikipediaJSON?formatted=true&lat=".$_REQUEST['lat']."&lng=".$_REQUEST['lng']."&username=".$usernameGeoname."&style=full&maxRows=1",
    //ok currency echange rate base $ all countries    
    //"https://openexchangerates.org/api/latest.json?app_id=".$appidOpenxchng,
    //ok country information flag, currency, capital, languag, currency,  time offset, region ASAI, country code, population, area, ltlan
    "https://restcountries.eu/rest/v2/alpha/".$_REQUEST['isoa2'],
    //1 hpoto for banner
    "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=".$apikeyFlickr."&lat=".$_REQUEST['lat']."&lon=".$_REQUEST['lng']."&per_page=1&page=1&format=json&nojsoncallback=1",
     *///photos keyword and latlng
    "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=".$apikeyFlickr."&lat=".$_REQUEST['lat']."&lon=".$_REQUEST['lng']."&per_page=10&page=10&format=json&nojsoncallback=1",
    //ok museums latlng
    "https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=".$_REQUEST['lng']."&lat=".$_REQUEST['lat']."&kinds=museums&format=geojson&apikey=".$apikeyOpenTripMap,
    //ok monuments and memorials details
    //"https://api.opentripmap.com/0.1/en/places/radius?radius=3000&lon=".$_REQUEST['lng']."&lat=".$_REQUEST['lat']."&kinds=monuments_and_memorials&format=json&apikey=".$apikeyOpenTripMap,
    //intresting plaxes using latlng
    //"https://api.opentripmap.com/0.1/en/places/radius?radius=3000&lon=".$_REQUEST['lat']."&lat=".$_REQUEST['lat']."&kinds=interesting_places&format=json&apikey=".$apikeyOpenTripMap,
    
    
);

function apisLatLng($urlApis){

    //global $executionStartTime, $countryCoord ;
    global $executionStartTime ;

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
    //$output['countryCoord'] = $countryCoord;

    return $output;


}

echo(json_encode(apisLatLng($URLs)));
//flickr image link
//https://farm" + photo.farm + ".staticflickr.com/" +  photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg