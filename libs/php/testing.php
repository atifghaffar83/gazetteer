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

//open weather api end points
$URLs = array( 
    //? working but not sure useful
    //"http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=4f8f4e7abf4d3e54ac0cb51fdc2f52a4",
    //ok weather city and country wise
    "http://api.openweathermap.org/data/2.5/weather?q=glasgow&appid=ea469c06c8b7433265361ef6889e5439",
    //ok weather latlng
    //"https://api.openweathermap.org/data/2.5/find?lat=' . $_REQUEST['lat'] . '&lon=' . $_REQUEST['lng'] . '&cnt=1&appid=4f8f4e7abf4d3e54ac0cb51fdc2f52a4",
    //ok earthquake
    "http://api.geonames.org/earthquakesJSON?formatted=true&north=55.0583836008072&south=47.2701236047002&east=15.0418156516163&west=5.8663152683722&username=geonamesag&style=full",
    //ok find wiki link latlng
    "http://api.geonames.org/findNearbyWikipediaJSON?formatted=true&lat=55.94&lng=-4.32&username=geonamesag&style=full",
    //ok currency echange rate base $ all countries    
    "https://openexchangerates.org/api/latest.json?app_id=98052232601948bfb212f84740710a97",
    //ok country information flag, currency, capital, languag, currency,  time offset, region ASAI, country code, population, area, ltlan
    "https://restcountries.eu/rest/v2/all",
    //ok museums latlng
    "https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=-4.32&lat=55.94&kinds=museums&format=geojson&apikey=5ae2e3f221c38a28845f05b6b81f99f92d56cb8bd590f0528124e689",
    //ok monuments and memorials details
    "https://api.opentripmap.com/0.1/en/places/radius?radius=3000&lon=-4.32&lat=55.94&kinds=monuments_and_memorials&format=json&apikey=5ae2e3f221c38a28845f05b6b81f99f92d56cb8bd590f0528124e689",
    //intresting plaxes using latlng
    "https://api.opentripmap.com/0.1/en/places/radius?radius=3000&lon=-4.32&lat=55.94&kinds=interesting_places&format=json&apikey=5ae2e3f221c38a28845f05b6b81f99f92d56cb8bd590f0528124e689",
    //photos keyword and latlng
    "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=d196f29bed4717b640485fc44148164c&tags=Hunterian+Art+Gallery&lat=55.87&lon=-4.28&format=json&nojsoncallback=1"
);

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