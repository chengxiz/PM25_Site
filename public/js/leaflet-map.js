var mbAttr = 'Map data &copy; ' + 
			'<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoiY2hlbmd4aXoiLCJhIjoiY2phcDZpd25rMHBiODMzbWlkazQ1Z3BydiJ9.pOPfmK_vuEIcMyWLq_s-nQ';
var satellite = L.tileLayer( mbUrl, 
	{
		minZoom: 3,
		maxZoom: 10,
		attribution: mbAttr,
		id: 'mapbox.satellite'
	}
);
var grayscale = L.tileLayer( mbUrl,
	{
		minZoom: 3,
		maxZoom: 10,
		attribution: mbAttr,
		id: 'mapbox.light'
	}
);
var baseLayers = {
	"Grayscale": grayscale,
	"Satellite": satellite
};
var mymap = L.map('mapid',{
	zoom : 4,
	center : [37, -95],
	layers : grayscale
});
L.control.layers(baseLayers).addTo(mymap);