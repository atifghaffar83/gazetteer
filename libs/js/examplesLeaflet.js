//Adding markup on the page
/* var marker = L.marker([lat, lng]).addTo(mymap);
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup(); */


//adding polygon 
/* var polygon = L.polygon([ //12,32,15,37,10
    [53.509, 0.28],
    [53.003, 1.50],
    [52.51, 0.047]
], {color: 'green',
fillColor: '#f03',
fillOpacity: 0.5,}).addTo(mymap);
polygon.bindPopup("I am a polygon."); */

/* var popup = L.popup()
    .setLatLng([lat, lng])
    .setContent("I am a standalone popup.")
    .openOn(mymap); */

//ajaxWeather(lat, lng);

/* popup
                //.setLatLng(e.latlng )
                .setLatLng([data[0].coord.lat,data[0].coord.lon])
                //.setContent("You clicked the map at " + e.latlng.toString())
                //.setContent("You clicked the map at LatLng:" + data[0].coord.lat+","+data[0].coord.lon)
                .setContent(myfunction(data))
                .openOn(mymap); */


/* 
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="card1 col-sm-12 col-xs-12">
                            <div class="d-flex">
                            <p>${timeConvert(data[0].list[0].dt).humanTimeFormat}</p>
                            <h6 class="flex-grow-1">${data[2].name}</h6>
                            <h6 class="flex-grow-1">Cap.(${data[2].capital})</h6>
                            <h6 class="flex-grow-1">${data[0].list[0].name}</h6>
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
                </div> */


/*
                <div class="card bg-dark text-white">
                    <img class="card-img" src="${data[2].flag}" alt="Card image">
                    <div class="card-img-overlay">
                        <h5 class="card-title">${data[2].name}</h5>
                        <p class="card-text">Capital: ${data[2].capital}</p>
                        <p class="card-text">City: ${data[0].list[0].name}</p>
                        <div class="d-flex bg-light">
                                <div class="temp-details flex-grow-1">
                                    <p class="my-1"> <img src="https://i.imgur.com/B9kqOzp.png" height="17px"> <span> ${(data[0].list[0].wind.speed*3.60).toFixed(2)} km/h </span> </p>
                                    <p class="my-1"> <i class="fa fa-tint mr-2" aria-hidden="true"></i> <span> ${data[0].list[0].main.humidity}% Humidity</span> </p>
                                    
                                </div>
                                <div> <img class="weatherimg" src="http://openweathermap.org/img/wn/${data[0].list[0].weather[0].icon}@4x.png" > </div>
                            </div>
                    </div>
                </div>
*/

/* 
<div class="info">
<h2 class="location" style='color: ${font_color};'>${city}</h2>
<p class="date">${date}</p>
<h1 class="temp" style='color: ${font_color};'>${temp}</h1>
</div> */