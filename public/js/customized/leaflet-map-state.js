// execute script after the html page has loaded
$(document).ready(function(){
  var cities = [];
  var growth = [];
  var pop = [];
  var rank = [];
  var lon = [];
  var lat = [];
  var markergroup = [];
  $(".city").each(function(){
   cities.push($(this).text());
  });
  $(".growth").each(function(){
   growth.push($(this).text()) ;
  });
  $(".pop").each(function(){
   pop.push($(this).text());
  });
  $(".rank").each(function(){
   rank.push($(this).text());
  });
  $(".lon").each(function(){
   lon.push($(this).val());
  });
  $(".lat").each(function(){
   lat.push($(this).val());
  });

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
  var mymap = L.map('mapid',{
    zoom : 7,
    center : [center_lat, center_lon],
    layers : [grayscale]
  });  
  function onClick(e) {
    mymap.setView(this.getLatLng(), 12);
  }
  for (i = 0; i < cities.length; i++){
    var m =  L.marker([lat[i], lon[i]],{
      title :cities[i]
    }).on('click', onClick);
    markergroup.push(m);

    m.bindTooltip(cities[i], 
    {
        permanent: true, 
        direction: 'right',
        opacity:0.75
    });
    
    var popupContent =  '<p style="text-align:left">city: '+
                            cities[i] +
                          '</p>'+
                          '<p style="text-align:left">population: ' + 
                            pop[i] + 
                          '</p>'+
                          '<p style="text-align:left">growth :'+
                            growth[i] + 
                          '</p>'  +
                          '<p style="text-align:left">rank :'+
                            rank[i] + 
                          '</p>'
                        ;
    console.log(popupContent);
    //m.addTo(mymap);
    m.bindPopup(popupContent);
  }
  var citiesLayer = L.layerGroup(markergroup);
  var baseLayers = {
    "Grayscale": grayscale,
    "Satellite": satellite
  };
  var overlayMaps = {
    "Cities": citiesLayer
  };


  mymap.addLayer(citiesLayer);

  L.control.layers(baseLayers, overlayMaps).addTo(mymap);

  var group = new L.featureGroup(markergroup);
  mymap.fitBounds(group.getBounds());


  $(".city").each(function(){
   $(this).click(function(){
    var lat = $(this).text()+'_lat';
    var lon = $(this).text()+'_lon';
    var lat_value = document.getElementById(lat).value;
    var lon_value = document.getElementById(lon).value;
    mymap.setView(new L.LatLng(lat_value, lon_value), 12);
    // return the page back to #mapid at center
    $("html, body").animate({
      scrollTop: $("#mapid").offset().top }, {duration: 500,easing: "swing"});
    return false;
   });
  });

  $("#name").on({
    'click': function() { mymap.fitBounds(group.getBounds()); }
  });

  
});

