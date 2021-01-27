$(window).on('load', function () { 
  if ($('#preloader').length) { 
    $('#preloader').delay(500).fadeOut('slow', function () { 
      //$(this).remove(); 
      $(this).hide(); 
      
    }); 
  } 
});

$(document).ready(()=>{
  //POPOVER
  $(function () {
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();
  });

  $("#data-alert").hide();

  //global variables
      let tileLayerKey = config.tileLayer;
      let ipinfoTokenKey = config.ipinfoToken;
      let mapboxkey = config.mapbox;
      let border;
      let circle;
      let featureGroup;
      let temp;
      let date;
      let markers;
      let valIsoa3;
      let valIsoa2;
      let valCountry;
      let countryCode;
      let ccTarget;
      let llTarget;
      let control;
      let fgCountry;
      let tempCountry = "TR";
      
  
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
  
  let mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		mbUrl = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxkey}`;

  let grayscale   = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', 
                                        tileSize: 512, 
                                        zoomOffset: -1, 
                                        attribution: mbAttr, 
                                        maxZoom: 16,
                                        zoom: 6,
                                        minZoom: 2}),
    streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', 
                                  tileSize: 512, 
                                  zoomOffset: -1, 
                                  attribution: mbAttr, 
                                  maxZoom: 16,
                                  zoom: 6,
                                  minZoom: 2}
    );

let mymap = L.map('mapid',{
  center: [51.505, -0.09],
  zoom: 8,
  layers: [streets]
});

/* mapboxgl.accessToken = 'pk.eyJ1IjoiYXRpZmdoYWZmYXIiLCJhIjoiY2trNTZuNW9wMDRiNzJ4bndicDF1Y2syaSJ9.LdnIxYIrf08e7Tt5Im_Kzw';
let mymap = L.map('mapid',{
container: 'mapid',
style: 'mapbox://styles/mapbox/streets-v11',
center: [-74.5, 40],
zoom: 9,
accessToken: 'pk.eyJ1IjoiYXRpZmdoYWZmYXIiLCJhIjoiY2trNTZuNW9wMDRiNzJ4bndicDF1Y2syaSJ9.LdnIxYIrf08e7Tt5Im_Kzw',
layers: [streets]
}); */

//  mymap.addLayer(tileLayer);

let baseLayers = {
  "Grayscale": grayscale,
  "Streets": streets,
  "TileLayer" : tileLayer,
};

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
//currency live rate usd to selected country
const currency = (currencyCode)=>{
  
  $.ajax({
    url: "./libs/php/currencyapi.php",
    type: "POST",
    data: {
        
        currency: currencyCode,
        
    },
    beforeSend: function () {
      $('#preloader').show();
  },
    dataType: "json",
    success: function(results){
      if (results.status.name == "ok"){
      
      let cur = results.currency[`USD_${currencyCode}`];
      $(".currency").html(`1 USD : ${cur} ${currencyCode}`); 
      let curfor = Math.round((cur + Number.EPSILON) * 100) / 100;
      $(".currency").html(`<strong>Currency: </strong>1 USD : ${curfor} ${currencyCode}`);
      }  
    },
    complete: function () {
      $('#preloader').hide();
  },

    error: function(jqXHR, textStatus, errorThrown) {
      // your error code
      console.log("No data coming from currencyapi.php file");
  }
});
}

  //=========================================================================================================
//currency live rate usd to selected country
const holiday = (cCode)=>{
  
  $.ajax({
    url: "./libs/php/holidayApi.php",
    type: "POST",
    data: {
        
        countryCode: cCode,
        
    },
    beforeSend: function () {
      $('#preloader').show();
  },
    dataType: "json",
    success: function(results){
      if (results.status.name == "ok"){
      
        let holidaylist = results.holiday.holidays;
        
        holidaylist.forEach(holiday =>{
        //$("#dropdownMenuLink").append(`<li class="dropdown-item"><strong>"aaa"</strong>"bbb"</li>`);
        $("#holiday").append(`<li class="dropdown-item"><strong>${holiday.name}</strong> ${holiday.date}</li>`);
      })

      }  
    },
    complete: function () {
      $('#preloader').hide();
  },

    error: function(jqXHR, textStatus, errorThrown) {
      // your error code
      console.log("No data coming from holidayApi.php file");
     
  }
});
}

  //=========================================================================================================
  //function to chaange sidebar contents
  const sidebarContents = function(results){
     
      let allImg = [];
      let imgTop;
      let imgBanner = results[3].photos.photo[0];

      if(results[3].photos.photo.length){
        imgTop = `https://farm${imgBanner.farm}.staticflickr.com/${imgBanner.server}/${imgBanner.id}_${imgBanner.secret}_b.jpg`;
      } else {
        imgTop = results[2].flag;
      }

      //imgTop = `https://farm${imgBanner.farm}.staticflickr.com/${imgBanner.server}/${imgBanner.id}_${imgBanner.secret}_b.jpg`;
      let src = `https://openweathermap.org/img/wn/${results[0].list[0].weather[0].icon}@2x.png`;
      
      let images = results[4].photos.photo;

      if(results[0]=="undefined"){
          $(".sidebar").html("Refresh your page Again");
          ajaxWeather(valIsoa2);
      } else{
          $(".imgTop").attr("src", imgTop);
          $(".area").html(results[0].city.name);
          $(".weatherIcon").attr("src", src);
          $(".tempDesc").html(results[0].list[0].weather[0].description.toLowerCase()+" ");
          //$(".temp").html(temp);
          currency(results[2].currencies[0].code);
          holiday(results[0].city.country);
          $(".facts").html(results[1].geonames[0].summary);
          $(".wikilink").attr("href", "https://"+results[1].geonames[0].wikipediaUrl);
          images.forEach(img =>{
           
          let menuIcon = `<i class="fas fa-link fa-lg"></i>`;
              let imgUrl = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_b.jpg`;
              let aTag = `<div class="content"><a href="https://www.flickr.com/photo.gne?rb=1&id=${img.id}" target="_blank">
                          <div class="content-overlay"></div>
                          `;
              let imgContent = `<div class="content-details fadeIn-top">
                                  <h5>${img.title}</h5>
                                  <p>${img.description._content}</p>
                                  ${menuIcon}
                                </div>`
              
              //$(`<img src=${imgUrl}>`).appendTo('.gallery');
              //allImg.push(`${aTag}<img src=${imgUrl} /></a>`);
              allImg.push(`${aTag}<img src=${imgUrl} />${imgContent}</a></div>`);
          });
          
          $(".gallery").html(allImg);
      }
      
  }
  
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


  //=========================================================================================================
  //popup card for weather to display on each click
  const clickPopup = function(data){
    let weather = data[0];
      var city = weather.city.name.toUpperCase();
      let cTemp = Math.round(weather.list[0].main.temp - 273.15);
      let fTemp = Math.round((weather.list[0].main.temp - 273.16) * 1.8 + 32);
      temp = Math.round(cTemp) + "&deg;C | " + Math.round(fTemp) + "&deg;F";
      /* var desc = weather.list[0].weather[0].description; */
      $(".temp").html(temp);

      /* let font_color;
      let bg_color;
      if (cTemp > 25) {
        font_color = "#fff";
        bg_color = "#ff9090";
      } else {
        font_color = "#fff";
        bg_color = "#9899a0";
      }
      let weathercon;
      if (weather.list[0].weather[0].main == "Sunny" || weather.list[0].weather[0].main == "sunny") {
          weathercon = "<i class='fas fa-sun' style='color: #d36326;'></i>";
      } else {
          weathercon = "<i class='fas fa-cloud' style='color: #44c3de;'></i>";
      } */
  
      let html = `
      <div class='box'>
      
      
          <div class='wave -one'></div>
          <div class='wave -two'></div>
          <div class='wave -three'></div>
          <div>
  
              <div class="flexing">
           
                  <div><img class="flexingcontent aa" src="https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png" > </div>
                  <div class="flexcol">
                  <h2 class="temp" >${temp}</h2> 
                  <p class="temp">${weather.list[0].weather[0].description}</p> 
                  </div>
                  
              </div>
              
              <div class="flexing"> 
                  <h2 class="location">${city}</h2>
                  <p class="llDate"></p>
                  
              </div>
              
              <div class="flexing"> 
                  <h5 class="heading"><strong>${data[2] ? data[2].name : "n/a"} (${data[2] ? data[2].nativeName: "n/a"})</strong></h5>
                  
              </div>
              <div class="margintop">
                  <div class="flexing"> 
                  <p class="leftalign"><strong>Capital: </strong>${data[2] ? data[2].capital : "n/a"}</p>
                  <p class="leftalign"><strong>Population: </strong>${data[2] ? data[2].population.toLocaleString(): "n/a"}</p>
                  </div>
                  <div class="flexing"> 
                  <p class="leftalign"><strong>Area: </strong>${data[2] ? data[2].area.toLocaleString(): "n/a"}</p>
                  <p class="leftalign"><strong>Currency: </strong>${data[2].currencies[0] ? data[2].currencies[0].name : "n/a"}</p>
                  </div>
                  <div class="flexing"> 
                  <img class="flag" src=${data[2] ? data[2].flag : ""} >
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
  // featues ajax call
  const featureMarks = (latLng, countryCode=null, country=null, capital=null)=>{
    if (control != undefined) {
      control.remove(mymap);
      }
    $.ajax({
      url: "./libs/php/parkApi.php",
      type: "POST",
      data: {
          
          isoa3: latLng,
          isoa2: countryCode,
          country: country,
          lat: latLng[0],
          lng: latLng[1],
          capital: capital
          
      },
      beforeSend: function () {
        $('#preloader').show();
    },
      dataType: "json",
      success: function(results){
        
        let features = results.features[0].features;
        let geonameTime = results.features[1].gmtOffset;

        date = new Date();
        let hours =  date.getHours() + geonameTime;
        date.setHours(hours);

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
      $(".llDate").html(date);
      $(".time").html(date);
      


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

        //let allFeatures = results[0].features; 
        featureGroup = L.featureGroup();
        markers = new L.MarkerClusterGroup();
        features.forEach(feature=>{
          let lat = feature.geometry.coordinates[1];
          let lng = feature.geometry.coordinates[0];
          let name = feature.properties.name;
          let customMarker = new L.Marker([lat, lng], {icon: myIcon}).bindPopup(`<div class="markpopup"><strong>Lat/Lon</strong> (${lat} / ${lng})<br><strong>${name}</strong></div`);
          featureGroup.addLayer(customMarker);  
          markers.addLayer(featureGroup);
        //featureGroup.setStyle({color:'pink',opacity:.5});
                  
      });
  
      //mymap.addLayer(markers);

      let overlays = {
        "Landmarks": markers
      };
      control = L.control.layers(baseLayers, overlays, {position : 'topright'});
      mymap.addLayer(markers);
      control.addTo(mymap);

      },
      complete: function () {
        $('#preloader').hide();
    },
      error: function(jqXHR, textStatus, errorThrown) {
      // your error code
      console.log("No data coming from apis.php file");
          }
  });
}


  //=========================================================================================================
  //weather apis ajax call
  const ajaxWeather = (latLng, countryCode=null, country=null, capital=null) =>{
      if(mymap.hasLayer(markers)){
          mymap.removeLayer(markers);
      }
      if(mymap.hasLayer(fgCountry)){
        mymap.removeLayer(fgCountry);
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
          beforeSend: function () {
            $('#preloader').show();
            $('#options').prop('disabled', true);
        },
          success: function(results){
              if (results.status.name == "ok"){
                  let data = results.apisData;
                  data = data.filter(Boolean);
                  console.log(data);
                  $(".wfcast").html("");
                  for(i=8; i<data[0].list.length; i+=8){
                    
                    let content = data[0].list[i];
                    let dDate = new Date(`${content.dt_txt}`);
                    let dDay = dDate.getDay();
                    let mcTemp = Math.round(content.main.temp_max - 273.15);
                    let mfTemp = Math.round((content.main.temp_max - 273.16) * 1.8 + 32);
                    let lcTemp = Math.round(content.main.temp_min - 273.15);
                    let lfTemp = Math.round((content.main.temp_min - 273.16) * 1.8 + 32);
                    
                    $(".wfcast").append(
                      `<div class="forecast" data-wob-di="7" role="button" tabindex="0">

                          <div class="fdcolor fdld">
                            ${weekday[dDay]}
                          </div>
                          <div class="fimg">
                            <img class="fmsize" alt="Rain and snow" src="https://openweathermap.org/img/wn/${content.weather[0].icon}@2x.png" data-atf="1">
                          </div>
                          <div class="ftemp">
                            <div class="fht fhts">
                            <span class="wob_t" style="display:inline">${mcTemp}</span>
                            <span class="wob_t" style="display:none">${mfTemp}</span>°
                          </div>
                          <div class="fdcolor flts">
                            <span class="wob_t" style="display:inline">${lcTemp}</span>
                            <span class="wob_t" style="display:none">${lfTemp}</span>°
                          </div>
                        
                      </div>`

                      );

                  }
               
                  switch(countryCode){
                      case "PS":
                          latLng = [31.5, 34.4667];
                          break;
                  
                      case "PK":
                          latLng = [33.693056, 73.063889];
                          break;
                  }

                  let latLngData = [data[0].city.coord.lat, data[0].city.coord.lon];
                  
                  sidebarContents(data);
                  featureMarks(latLngData, countryCode, country, capital);

                  fgCountry = L.featureGroup();
                  let countryMarker = new L.Marker(latLngData).bindPopup(clickPopup(data));
                  fgCountry.addLayer(countryMarker); 
                  mymap.addLayer(fgCountry);
                  
                  popup
                  .setContent(clickPopup(data))
                  .setLatLng(latLngData)
                  .openOn(mymap);
                  ;
  
              }
            },
            complete: function () {
                $('#preloader').hide();
                $("#options").prop('disabled', false);
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
    $(".sidebar").removeClass('is-closed');

    $.ajax({
      url: "./libs/php/countryData.php",
      type: "POST",
      data: {
          
          isoa3: valIsoa3,
          isoa2: valIsoa2,
          country: valCountry,
          
      },
      beforeSend: function () {
        $('#preloader').show();
    },
      dataType: "json",
      success: function(results){
          if (results.status.name == "ok"){
              console.log("country Code data");
              console.log(results);
              let countryFeatures = results["countryCoord"];
              border = L.geoJSON().addTo(mymap);
              border.addData(countryFeatures);
              mymap.addLayer(border);
              mymap.fitBounds(border.getBounds());
              
              let llcenter = border.getBounds().getCenter();
              centerBounds = [llcenter.lat,llcenter.lng];
              mymap.setView(centerBounds, 4);

              let woData = results.apisCountryData[0][1];
              let restData = results.apisCountryData[1];

              let latLng;
              let country;
              let capital;

              if(woData === undefined ){
                
                latLng = [restData.latlng[0], restData.latlng[1]];
                country = restData.country;
                capital = restData.capital;
              } else {
                latLng = [woData[0].latitude ? woData[0].latitude : restData.latlng[0] , woData[0].longitude ?woData[0].longitude: restData.latlng[1]];
                country = woData[0].name ? woData[0].name : restData.country;
                capital = woData[0].capitalCity ? woData[0].capitalCity : restData.capital;
                }

              ajaxWeather(latLng, valIsoa2, country, capital);
              /* popup
              .setLatLng(latLng)
              .openOn(mymap); */
          }
      },
      complete: function () {
        $('#preloader').hide();
    },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log("No data coming from countryData.php file");
      }
  });
  };

  //==============================================================================================
  //covid html block
  const covidHtml = function(results){
    let covid = results.covid.data.summary;
    let htmlCovid = `
                        <h2 class="d-inline covidCol">Covid</h2>
                        <span class="small text-muted">LIVE UPDATE</span>
                        <div class="covid-flex">
                        <div class="covid-cat">
                          <div class="">
                            <button class="btn btn-danger">
                                <strong data-country-placeholder="total_cases">${covid.total_cases.toLocaleString()}</strong>
                            </button>
                          </div>
                          <div class="pl-1 pl-sm-2">
                              <span class="text-muted small">Confirmed</span>
                          </div>
                        </div>

                        <div class="covid-cat">
                            <div class="">
                              <button class="btn btn-warning">
                                  <strong data-country-placeholder="active_cases">${covid.active_cases.toLocaleString()}</strong>
                              </button>
                            </div>
                            <div class="pl-1 pl-sm-2">
                                <span class="text-muted small">Active</span>
                            </div>
                        </div>

                        <div class="covid-cat">
                            <div class="">
                              <button class="btn btn-success">
                                  <strong data-country-placeholder="recovered">${covid.recovered.toLocaleString()}</strong>
                              </button>
                            </div>
                            <div class="pl-1 pl-sm-2">
                                <span class="text-muted small">Recoved</span>
                            </div>
                        </div>
                        
                        <div class="covid-cat">
                            <div class="">
                              <button class="btn btn-secondary">
                                  <strong data-country-placeholder="deaths">${covid.deaths.toLocaleString()}</strong>
                              </button>
                            </div>
                            <div class="pl-1 pl-sm-2">
                                <span class="text-muted small">Deaths</span>
                            </div>
                        </div>

                      </div>  

                      `;
    return htmlCovid;
  }

  //==============================================================================================
  //covid function using api
  const covid = countryName => {
    $.ajax({
      url: "./libs/php/covid.php",
      type: "POST",
      data: {
        cName : countryName
      },
      beforeSend: function () {
        $('#preloader').show();
    },
      dataType: "json",
      success: function(results){
          
          if (results.status.name == "ok") {
           console.log("COVID results");
           console.log(results);
           $("#covid").html(covidHtml(results));
            
      }
    },
      complete: function () {
        $('#preloader').hide();
    },

      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log("No data passed from Areas PHP File");
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
      
     /*  border = L.geoJSON().addTo(mymap);
      mymap.addLayer(border); */
    
      coorCountry(valIsoa2, valIsoa3, valCountry);
      covid(valCountry);
  }
  
  //=========================================================================================================
  //onmap click event calling function
  $("select").change(countryData);
  
  //=========================================================================================================
  //onmap click calling the following function
  function onMapClick(e) {
     let latLng = [e.latlng['lat'], e.latlng['lng']];
     $(".sidebar").addClass('is-closed');
      
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
      beforeSend: function () {
        $('#preloader').show();
    },
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
                  
                  //$("#options").append('<option data-isoa3='+allData[row]['iso_a3']+ ' value='+allData[row]['iso_a2']+'>'+allData[row]['name']+'</option>');
                  $("#options").append(`<option data-isoa3=${allData[row]['iso_a3']} value=${allData[row]['iso_a2']} ${tempCountry == allData[row]['iso_a2'] ? 'selected=true' : ''} > ${allData[row]['name']} </option>`);
                  /* if ( s.options[i].text == v ) {
                    console.log(s.options[i].text);
                    s.options[i].selected = true; */
              }
              
          }
      },
      complete: function () {
        $('#preloader').hide();
    },

      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log("No data passed from Areas PHP File");
      }
  });
  
  //=========================================================================================================
  //setting up the map view according to provided Lat/Lng
  const mapLocation = (latLng, country) =>{
    if(mymap.hasLayer(border)){
      mymap.removeLayer(border);
  }
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
  }).addTo(mymap);
  
  //circle popup message
  circle.bindPopup("Current Location");
  
  }
  
  //==============================================================================================
  //callback function for country border coordinates
  const onloadCoorCountry = (valIsoa2, latLng=null)=>{
    if(mymap.hasLayer(border)){
      mymap.removeLayer(border);
    }
    if(mymap.hasLayer(markers)){
      mymap.removeLayer(markers);
    }

    border = L.geoJSON().addTo(mymap);
    mymap.addLayer(border);
    
    $.ajax({
      url: "./libs/php/countryData.php",
      type: "POST",
      data: {
          
          isoa2: valIsoa2,
          
      },
      beforeSend: function () {
        $('#preloader').show();
    },
      dataType: "json",
      success: function(results){
          if (results.status.name == "ok"){
            
              let countryFeatures = results["countryCoord"];
              border.addData(countryFeatures);
              mymap.fitBounds(border.getBounds());

              let latLng;
              let country;
              let capital;

              if(results.apisCountryData[0][1] === undefined ){
                
                latLng = [results.apisCountryData[1].latlng[0], results.apisCountryData[1].latlng[1]];
                country = results.apisCountryData[1].name;
                capital = results.apisCountryData[1].capital;
              } else {
                latLng = [results.apisCountryData[0][1][0].latitude, results.apisCountryData[0][1][0].longitude];
                country = results.apisCountryData[0][1][0].name;
                capital = results.apisCountryData[0][1][0].capitalCity;
                }
              
              covid(country);
              ajaxWeather(latLng, valIsoa2);
              /* popup
              .setLatLng(latLng)
              .openOn(mymap); */
          }
      },
      complete: function () {
        $('#preloader').hide();
    },
      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log("No data coming from countryData.php file");
      }
  });
  };
  
  // =========================================================================================================
  //using ipinfo to get coordinates from secure https to get current user location (navigator.geolocation is not working without HTTPS :) ) 
 /*  function location(latLng) {
      
      $.get("https://ipinfo.io?token="+ipinfoTokenKey, function(response) {
      let loc = response.loc.split(',');
      countryCode = response.country;
      ccTarget = countryCode;
      onloadCoorCountry(countryCode, latLng);
//      ajaxWeather(latLng, countryCode);
          
  }, "jsonp");
  
  } */


// ===========================================================================================================
// getting current location information using lat/lng
  function location(latLng) {

    $.ajax({
      url: "./libs/php/ipinfo.php",
      type: "POST",
      //data: data,
      beforeSend: function () {
        $('#preloader').show();
    },
      dataType: "json",
      success: function(results){
          
          if (results.status.name == "ok") {

            countryCode = results.ipinfo.country;
            ccTarget = countryCode;
            onloadCoorCountry(countryCode, latLng);
            
      }
    },
      complete: function () {
        $('#preloader').hide();
    },

      error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log("No data passed from Areas PHP File");
      }
  });
      
}


  
  // ===========================================================================================================
  // success callback for navigator geolocation
    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
      let latLng = [latitude, longitude];
      llTarget = latLng;
      location(latLng);
      
    }
  
  // ===========================================================================================================
  // error callback function if an issue findind currentPosition
  function error(err) {
      console.warn(`Location ERROR(${err.code}): ${err.message}`);
      let latLng = [41, 28.96];
      llTarget =  latLng;
      let countryCode = "TR";
      onloadCoorCountry(countryCode, latLng);
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
  
  const targetLoc = ()=>{
    
    mapLocation(llTarget);
    onloadCoorCountry(ccTarget, llTarget);
    /*ajaxWeather(llTarget, ccTarget); */
  }


  // =========================================================================================================
  //button to move to current location
  L.easyButton( {
      states:[
        {
          
          icon: '<span class="fas fa-crosshairs fa-2x target"></span>',
          onClick: targetLoc
        }
      ]
    })
    .setPosition("bottomright")
    .addTo(mymap);
  
  // =========================================================================================================
  // select country fields
    $(".form-select")
    .focusout(function(){
      $(".form-select").attr("size", "0");
    })
    .blur(function(){
      $(".form-select").attr("size", "0");
    });


    function setSelectedIndex(s, v) {

      for ( var i = 0; i < s.options.length; i++ ) {
  
          if ( s.options[i].text == v ) {
              console.log(s.options[i].text);
              s.options[i].selected = true;

              return;
  
          }
  
      }
  
  }
  
  setSelectedIndex(document.getElementById('options'),"Turkey");
  
  // Create a condition that targets viewports at least 415px wide
/* const mediaQuery = window.matchMedia('(max-width: 415px)');

if(mediaQuery.matches){
  console.log("matches");
  
} else{
  console.log("no match");
} */

/* // Register event listener
mediaQuery.addEventListener(handleTabletChange);

//Initial check
handleTabletChange(mediaQuery); */

  });
  