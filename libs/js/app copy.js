$(document).ready(()=>{
//global variables
    let tileLayerKey = config.tileLayer;
    let ipinfoTokenKey = config.ipinfoToken;
    let userGeoname = config.usernameGeoname;
    let border;
    let circle;
    let featureGroup;
    let temp;
    let date;
    let markers;
    let fgCity;
    let cityMarks;
    let valIsoa3;
    let valIsoa2;
    let valCountry;
    let countryCode;
    let latLng;

//=========================================================================================================
//sidebar function
var toggleBtn = document.querySelector('.sidebar-toggle');
var sidebar = document.querySelector('.sidebar');

toggleBtn.addEventListener('click', function() {
  toggleBtn.classList.toggle('is-closed');
  sidebar.classList.toggle('is-closed');
});


//=========================================================================================================
//Setting up map and tiles
    var mymap = L.map('mapid');
    let tileLayer = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key='+tileLayerKey, {
    attribution: 'Map data &copy; <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    maxZoom: 16,
    zoom: 6,
    minZoom: 2,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: tileLayerKey
});

mymap.addLayer(tileLayer);

mymap.zoomControl.setPosition('bottomright');

//global variable
let popup = L.popup();



  
//=========================================================================================================
//conerting miliseconds into human readable 
/* const timeConvert = data =>{
    data = parseInt(data+'000');
    const dateObject = new Date(data);
    const humanDateFormat = dateObject.toLocaleString("en-GB", {dateStyle: "short"});
    const humanTimeFormat = dateObject.toLocaleString("en-GB", {timeStyle: "short"});
    return {humanDateFormat, humanTimeFormat};
} */

//=========================================================================================================
//function to chaange sidebar contents
const sidebarContents = function(results){
   
    let allImg = [];
    let imgTop = `https://farm${results[3].photos.photo[0].farm}.staticflickr.com/${results[3].photos.photo[0].server}/${results[3].photos.photo[0].id}_${results[3].photos.photo[0].secret}_b.jpg`;
    let src = `https://openweathermap.org/img/wn/${results[0].list[0].weather[0].icon}@2x.png`;
    
    let images = results[4].photos.photo;
    if(results=="undefined"){
        $(".sidebar").html("change location no data found for these coordinates");    
    } else{
        $(".imgTop").attr("src", imgTop);
        $(".area").html(results[0].list[0].name);
        $(".weatherIcon").attr("src", src);
        $(".tempDesc").html(results[0].list[0].weather[0].description.toLowerCase()+" ");
        $(".temp").html(temp);
        $(".time").html(date);
        $(".facts").html(results[1].geonames[0].summary);
        $(".wikilink").attr("href", "https://"+results[1].geonames[0].wikipediaUrl); 
        images.forEach(img =>{
            let imgUrl = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_b.jpg`;
            //$(`<img src=${imgUrl}>`).appendTo('.gallery');
            allImg.push(`<img src=${imgUrl} />`);
        });
        
        $(".gallery").html(allImg);
    }
    
}

//=========================================================================================================
//popup card for weather to display on each click
const clickPopup = function(data){

    var city = data[0].list[0].name.toUpperCase();
    let cTemp = Math.round(data[0].list[0].main.temp_max - 273.15);
    let fTemp = Math.round((data[0].list[0].main.temp_max - 273.16) * 1.8 + 32);
    temp = Math.round(cTemp) + "&deg;C | " + Math.round(fTemp) + "&deg;F";
    var desc = data[0].list[0].weather[0].description;
    date = new Date();
    let hours =  date.getHours() + data[8].gmtOffset;
    date.setHours(hours);

    var months = [
      "January",
      "February",
      "March",  
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    let font_color;
    let bg_color;
    if (cTemp > 25) {
      font_color = "#fff";
      bg_color = "#ff9090";
    } else {
      font_color = "#fff";
      bg_color = "#9899a0";
    }
    let weathercon;
    if (data[0].list[0].weather[0].main == "Sunny" || data[0].list[0].weather[0].main == "sunny") {
      /* $(".weathercon").html(
        "<i class='fas fa-sun' style='color: #d36326;'></i>"
      ); */
        weathercon = "<i class='fas fa-sun' style='color: #d36326;'></i>";
    } else {
        weathercon = "<i class='fas fa-cloud' style='color: #44c3de;'></i>";
      /* $(".weathercon").html(
        "<i class='fas fa-cloud' style='color: #44c3de;'></i>"
      ); */
    }

    let minutes =
      date.getMinutes() < 11 ? "0" + date.getMinutes() : date.getMinutes();
    date =
      weekday[date.getDay()] +
      " | " +
      months[date.getMonth()].substring(0, 3) +
      " " +
      date.getDate() +
      " | " +
      date.getHours() +
      ":" +
      minutes;
  
    let html = `
    <div class='box'>
    
    
        <div class='wave -one'></div>
        <div class='wave -two'></div>
        <div class='wave -three'></div>
        <div>

            <div class="flexing">
         
                <div><img class="flexingcontent aa" src="https://openweathermap.org/img/wn/${data[0].list[0].weather[0].icon}@2x.png" > </div>
                <div class="flexcol">
                <h2 class="temp" >${temp}</h2> 
                <p class="temp">${data[0].list[0].weather[0].description}</p> 
                </div>
                
            </div>
            
            <div class="flexing"> 
                <h2 class="location">${city}</h2>
                <p class="date">${date}</p>
            </div>
            
            <div class="flexing"> 
                <h5 class="heading"><strong>${data[2].name} (${data[2].nativeName})</strong></h5>
                
            </div>
            <div class="margintop">
                <div class="flexing"> 
                <p class="leftalign"><strong>Capital: </strong>${data[2].capital}</p>
                <p class="leftalign"><strong>Population: </strong>${data[2].population}</p>
                </div>
                <div class="flexing"> 
                <p class="leftalign"><strong>Area: </strong>${data[2].area}</p>
                <p class="leftalign"><strong>Currency: </strong>${data[2].currencies[0].name}</p>
                </div>
                <div class="flexing"> 
                <img class="flag" src=${data[2].flag} >
                </div>
                <div class="flexing"> 
                
                </div>


            </div>
        

        </div>
      
    </div>
    
`;

    
    return html;
}

//=========================================================================================================
//weather apis ajax call
const ajaxWeather = (latLng, countryCode=null, country=null, capital=null) =>{
    if(mymap.hasLayer(markers)){
        mymap.removeLayer(markers);
    }
    
      $.ajax({
        url: "./libs/php/apis.php",
        type: "POST",
        data: {
            
            isoa3: latLng,
            isoa2: countryCode,
            country: country,
            lat: latLng[0],
            lng: latLng[1],
            capital: capital
            
        },
        dataType: "json",
        success: function(results){
            if (results.status.name == "ok"){
                let data = results.apisData;
                console.log("\nApis Result <<<======>>>\n");
                console.log(data);
             
                switch(countryCode){
                    case "PS":
                        latLng = [31.5, 34.4667];
                        break;
                
                    case "PK":
                        latLng = [33.693056, 73.063889];
                        break;
                }

                let features = data[5].features;
                featureGroup = L.featureGroup();
                markers = new L.MarkerClusterGroup();

                /* let customMarker = L.AwesomeMarkers.icon({
                    icon: 'fa-coffee',
                    markerColor: 'green',
                    prefix: 'fa',
                    iconColor: 'white',
                    marginTop: "10px"
                  }); */

                  var myIcon = L.icon({
                    iconUrl: './libs/images/marker-32.png',
                    iconSize: [32, 32],
                    iconAnchor: [22, 94],
                    popupAnchor: [-3, -76],
                    color: "green"
                    /* shadowUrl: 'my-icon-shadow.png',
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94] */
                });
                      
                features.forEach(feature=>{
                let lat = feature.geometry.coordinates[1];
                let lng = feature.geometry.coordinates[0];
                let name = feature.properties.name;
                //var marker = new L.Marker([lat, lng]).bindPopup(name);
                let customMarker = new L.Marker([lat, lng], {icon: myIcon}).bindPopup(name);
                featureGroup.addLayer(customMarker);  
                markers.addLayer(featureGroup);
                //featureGroup.setStyle({color:'pink',opacity:.5});
                
                });

                mymap.addLayer(markers);
                console.log("\najax pk/ps "+latLng);
                popup
                .setLatLng(latLng)
                .setContent(clickPopup(data))
                .openOn(mymap);

                //sidebar function calling
                sidebarContents(data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("No data coming from apis.php file");
        }
    });
}

//==============================================================================================
//callback function for country border coordinates
const coorCountry = (valIsoa2, valIsoa3, valCountry)=>{
  $.ajax({
    url: "./libs/php/countryData.php",
    type: "POST",
    data: {
        
        isoa3: valIsoa3,
        isoa2: valIsoa2,
        country: valCountry,
        
    },
    dataType: "json",
    success: function(results){
        if (results.status.name == "ok"){
            
            console.log("\nCountry api results=========>");
            console.log(results);
            console.log("\n");

            let countryFeatures = results["countryCoord"];
            
            border.addData(countryFeatures);
            mymap.fitBounds(border.getBounds());
      
            latLng = [results.apisCountryData[0][1][0].latitude, results.apisCountryData[0][1][0].longitude];
            let country = results.apisCountryData[0][1][0].name;
            let capital = results.apisCountryData[0][1][0].capitalCity;
            ajaxWeather(latLng, valIsoa2, country, capital);
            
            
            
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log("No data coming from countryData.php file");
    }
});
};


//==============================================================================================
//catching select value from dropdown country list

const countryData = function(countryCode=null){
    if(mymap.hasLayer(border)){
        mymap.removeLayer(border);
        //mymap.removeLayer(cityMarks);
    }
    if(mymap.hasLayer(markers)){
      mymap.removeLayer(markers);
  }
    
    valIsoa3 = $(this).find(':selected').data('isoa3');
    valIsoa2 = $("select :selected").val();
    valCountry = $("select :selected").text();
    
    border = L.geoJSON().addTo(mymap);
    mymap.addLayer(border);
  
    coorCountry(valIsoa2, valIsoa3, valCountry);
    
}

//=========================================================================================================
//onmap click event calling function
$("select").click(countryData);

//=========================================================================================================
//onmap click calling the following function
function onMapClick(e) {
   latLng = [e.latlng['lat'], e.latlng['lng']];
   console.log(latLng);
    /* $.get("http://api.geonames.org/countryCodeJSON?formatted=true&lat="+latLng[0]+"&lng="+latLng[1]+"&username="+userGeoname, function(response) {
    ajaxWeather(latLng, response.countryCode);    
}, "jsonp"); */

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
const mapLocation = (latLng, country) =>{
   //latLng = [lat, lng];
   //mymap.setView([lat, lng], 10);
   if(mymap.hasLayer(circle)){
     mymap.removeLayer(circle);
   }
   mymap.setView(latLng, 10);

//adding the circle around the current loaction
circle = L.circle(latLng, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
//}).addTo(mymap);
});
//circle popup message
circle.bindPopup("Current Location");
mymap.addLayer(circle);
//calling the ajaxWeather function and passing an array of lat/lng to find my location

ajaxWeather(latLng, country);
}

//==============================================================================================
//callback function for country border coordinates
const onloadCoorCountry = (valIsoa2)=>{
  if(mymap.hasLayer(border)){
    mymap.removeLayer(border);
    //mymap.removeLayer(cityMarks);
}
  border = L.geoJSON().addTo(mymap);
  mymap.addLayer(border);
  
  $.ajax({
    url: "./libs/php/countryData.php",
    type: "POST",
    data: {
        
        isoa2: valIsoa2,
        
    },
    dataType: "json",
    success: function(results){
        if (results.status.name == "ok"){
            let countryFeatures = results["countryCoord"];
            border.addData(countryFeatures);
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log("No data coming from countryData.php file");
    }
});
};

// =========================================================================================================
//using ipinfo to get coordinates from secure https to get current user location (navigator.geolocation is not working without HTTPS :) ) 
function location(latLng) {
    
    $.get("https://ipinfo.io?token="+ipinfoTokenKey, function(response) {
    
    let loc = response.loc.split(',');
    console.log("\nipinfo lat/lng"+loc[0]+ "/"+ loc[1]);
    countryCode = response.country;
    mapLocation(latLng, countryCode);
    onloadCoorCountry(countryCode);
        
}, "jsonp");

}


  // =========================================================================================================
  /* const parks

  //Parks Api Button
  L.easyButton( {
    states:[
      {
        //icon: '<span class="target">&target;</span>',
        icon: '<span class="fas fa-tree fa-2x target"></span>',
        onClick: location
      }
    ]
  })
  .setPosition("bottomright")
  .addTo(mymap); */

// ===========================================================================================================
// success callback for navigator geolocation
  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    latLng = [latitude, longitude];
    location(latLng);
    console.log(`nav geo Lat/Lon/: ${latitude} / ${longitude}`);    
  }

// ===========================================================================================================
// error callback function if an issue findind currentPosition
function error(err) {
    console.warn(`Location ERROR(${err.code}): ${err.message}`);
  }

// ============================================================================================================
//Following windows navigator.geolocation property will find current position
function locationNav(){
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
}
locationNav();

// =========================================================================================================
//button to move to current location
L.easyButton( {
    states:[
      {
        
        icon: '<span class="fas fa-crosshairs fa-2x target"></span>',
        onClick: locationNav
      }
    ]
  })
  .setPosition("bottomright")
  .addTo(mymap);

  $(".form-select")
  .focusout(function(){
    $(".form-select").attr("size", "0");
  })
  .blur(function(){
    $(".form-select").attr("size", "0");
  });

});