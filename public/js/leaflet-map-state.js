// execute script after the html page has loaded
$(document).ready(function(){
  var cities = [];
  var growth = [];
  var pop = [];
  var lon = [];
  var lat = [];
  $(".city").each(function(){
   cities.push($(this).text());
  });
  $(".growth").each(function(){
   growth.push($(this).text()) ;
  });
  $(".pop").each(function(){
   pop.push($(this).text());
  });
  $(".lon").each(function(){
   lon.push($(this).val());
  });
  $(".lat").each(function(){
   lat.push($(this).val());
  });

  // $(".leaflet-popup-content").css({"width": "301px", "height":"400px"});

  var center_lon = lon.reduce(function(p,c,i){return p+(c-p)/(i+1)},0);
  var center_lat = lat.reduce(function(p,c,i){return p+(c-p)/(i+1)},0);
  console.log("lon:" + center_lon);
  console.log("lat:" + center_lat);
  var mbAttr = 'Map data &copy; ' + 
      '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoiY2hlbmd4aXoiLCJhIjoiY2phcDZpd25rMHBiODMzbWlkazQ1Z3BydiJ9.pOPfmK_vuEIcMyWLq_s-nQ';
  var satellite = L.tileLayer( mbUrl, 
    {
      minZoom: 3,
      maxZoom: 15,
      attribution: mbAttr,
      id: 'mapbox.satellite'
    }
  );
  var grayscale = L.tileLayer( mbUrl,
    {
      minZoom: 3,
      maxZoom: 15,
      attribution: mbAttr,
      id: 'mapbox.light'
    }
  );
  var baseLayers = {
    "Grayscale": grayscale,
    "Satellite": satellite
  };
  var mymap = L.map('mapid',{
    zoom : 7,
    center : [center_lat, center_lon],
    layers : grayscale
  });
  for (i = 0; i < cities.length; i++){
    var m =  L.marker([lat[i], lon[i]],{
      title :cities[i]
    }).bindTooltip(cities[i], 
    {
        permanent: true, 
        direction: 'right'
    });
    
    var popupContent =  '<p style="text-align:left">city:'+
                            cities[i] +
                          '</p>'+
                          '<p style="text-align:left">population: ' + 
                            pop[i] + 
                          '</p>'+
                          '<p style="text-align:left">grow 2000-2013:'+
                            growth[i] + 
                          '</p>'   
                        ;
    console.log(popupContent);
    m.addTo(mymap);
    m.bindPopup(popupContent).openPopup();
  }

  
  L.control.layers(baseLayers).addTo(mymap);

  $(".city").each(function(){
   $(this).click(function(){
    var lat = $(this).text()+'_lat';
    var lon = $(this).text()+'_lon';
    var lat_value = document.getElementById(lat).value;
    var lon_value = document.getElementById(lon).value;
    mymap.setView(new L.LatLng(lat_value, lon_value), 12);
    markers[i].openPopup()
   });
  });

  
});

