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