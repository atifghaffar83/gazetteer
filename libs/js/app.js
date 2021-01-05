$(document).ready(()=>{

const tileLayer = config.tileLayer;
//=========================================================================================================
//Setting up map and tiles
    var mymap = L.map('mapid');
    let tileLayer = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key='+tileLayer, {
    attribution: 'Map data &copy; <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    maxZoom: 16,
    zoom: 6,
    minZoom: 2,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'Pj6mWHQX5zATlyPXKqc4'
});

mymap.addLayer(tileLayer);

mymap.zoomControl.setPosition('bottomright');

var popup = L.popup();

//=========================================================================================================
//conerting miliseconds into human readable 
const timeConvert = data =>{
    data = parseInt(data+'000');
    const dateObject = new Date(data);
    const humanDateFormat = dateObject.toLocaleString("en-GB", {dateStyle: "short"});
    const humanTimeFormat = dateObject.toLocaleString("en-GB", {timeStyle: "short"});
    return {humanDateFormat, humanTimeFormat};
}

//=========================================================================================================
//popup card for weather to display on each click
const clickPopup = function(data){
       let html = `
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="card1 col-sm-12 col-xs-12">
                            <div class="d-flex">
                            <h6 class="flex-grow-1">${data[0].list[0].name}</h6>
                            <h6>${timeConvert(data[0].list[0].dt).humanTimeFormat}</h6>
                            </div>
                            <div class="d-flex flex-column temp mt-5 mb-3"> 
                                <h3 class="mb-0 font-weight-bold" id="heading"> ${(data[0].list[0].main.temp - 273.15).toFixed(2)}° C </h3> <span class="small grey">${data[0].list[0].weather[0].description}</span>
                            </div>
                            <div class="d-flex">
                                <div class="temp-details flex-grow-1">
                                    <p class="my-1"> <img src="https://i.imgur.com/B9kqOzp.png" height="17px"> <span> ${(data[0].list[0].wind.speed*3.60).toFixed(2)} km/h </span> </p>
                                    <p class="my-1"> <i class="fa fa-tint mr-2" aria-hidden="true"></i> <span> ${data[0].list[0].main.humidity}% Humidity</span> </p>
                                    
                                </div>
                                <div> <img class="weatherimg" src="http://openweathermap.org/img/wn/${data[0].list[0].weather[0].icon}@4x.png" > </div>
                            </div>
            
                        </div>
                    </div>
                </div>
            
      `;
    
    return html;
}

//=========================================================================================================
//weather apis ajax call
const ajaxWeather = (latLng) =>{
    $.ajax({
        url: "./libs/php/apis.php",
        type: "POST",
        data: {
            
            isoa3: latLng,
            isoa2: $("select").val(),
            lat: latLng[0],
            lng: latLng[1],
            
        },
        dataType: "json",
        success: function(results){
            if (results.status.name == "ok"){
                console.log(results);
                let data = results.apisData;
                
                popup
                .setLatLng(latLng)
                .setContent(clickPopup(data))
                .openOn(mymap);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("No data coming from weatherApi.php file");
        }
    });
}

//==============================================================================================

//catching select value from dropdown country list
$("select").click(function(){

    let valIsoa3 = $(this).find(':selected').data('isoa3');
    let valIsoa2 = $("select :selected").val();
    let valCountry = $("select :selected").text();
    
    var countryLayer = L.geoJSON().addTo(mymap);
    mymap.addLayer(countryLayer);
    
  
    //ajax call when selcting countries
    $.ajax({
        url: "./libs/php/areas.php",
        type: "POST",
        data: {
            
            isoa3: valIsoa3,
            isoa2: valIsoa2,
            country: valCountry,
            
        },
        dataType: "json",
        success: function(results){
            if (results.status.name == "ok"){
                console.log(results);
                let countryFeatures = results["countryCoord"];
                countryLayer.addData(countryFeatures);
                mymap.fitBounds(countryLayer.getBounds());
                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("No data coming from areas.php file");
        }
    });
});

//=========================================================================================================
//onmap click calling the following function
function onMapClick(e) {
   let latLng = [e.latlng['lat'], e.latlng['lng']];
   
ajaxWeather(latLng);
}

//=========================================================================================================
//on click event
mymap.on('click', onMapClick);

//=========================================================================================================
//Following ajax call to make the <select> country option on page Ready
$.ajax({
    url: "./libs/php/areas.php",
    type: "POST",
    //data: data,
    dataType: "json",
    success: function(results){
        
        if (results.status.name == "ok") {

            //sorting array of objects alphabatically country name
            const compare = (a,b)=>{
                const countryA = a.name.toUpperCase();
                const countryB = b.name.toUpperCase();
                let comparison = 0;
                if (countryA > countryB) {
                    comparison = 1;
                } else if (countryA < countryB) {
                    comparison = -1;
                }
                return comparison;
                }
            
            let allData = results.data.sort(compare);
                        
            for( row in allData){
                
                $("#options").append('<option data-isoa3='+allData[row]['iso_a3']+ ' value='+allData[row]['iso_a2']+'>'+allData[row]['name']+'</option>');
            }
            
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log("No data passed from Areas PHP File");
    }
});

//=========================================================================================================
//setting up the map view according to provided Lat/Lng
const mapLocation = (lat, lng) =>{
   let latLng = [lat, lng];
   mymap.setView([lat, lng], 10);

//adding the circle around the current loaction
var circle = L.circle([lat, lng], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);
//circle popup message
circle.bindPopup("Current Location");

//calling the ajaxWeather function and passing an array of lat/lng to find my location
ajaxWeather(latLng);
}

// =========================================================================================================
//success callback function will run get the current user Lat/Lng
function success(pos) {
    var crd = pos.coords;
    let currentLat = pos.coords.latitude;
    let currentLng = pos.coords.longitude;
    mapLocation(currentLat, currentLng);

}

// ===========================================================================================================
// error callback function if an issue findind currentPosition
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

// ============================================================================================================
//Following windows navigator.geolocation property will find current position 
if(navigator.geolocation){
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
    navigator.geolocation.getCurrentPosition(success, error, options);
    let watch = navigator.geolocation.watchPosition(success, error);
    navigator.geolocation.clearWatch(watch);
} else{
    //geolocation not enabled
    console.log("geolocation not enabled");
}


});