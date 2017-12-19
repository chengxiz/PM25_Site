// app.js
// npm install express
// npm init -y : this help you to get package.json
var express = require('express');
var app = express();

// installation to directory of node_modules: $ npm install hbs --save-dev 
var hbs = require('hbs');
// Parse incoming request bodies in a middleware before your handlers
// available under the req.body property.
// installation: $ npm install body-parser
var bodyParser = require('body-parser')

// load data
var statesEngine = require('./states');

// to store states
var state_list = [];
var city_list = [];
var state_name;
var city_name;
// Sub-apps will inherit the value of this setting
// ref: http://expressjs.com/en/api.html#app.set
app.set('view engine', 'html');
// to map the HBS template engine to “.html” files
app.engine('html', hbs.__express);

// app.use: the middleware function is executed 

// how to use body-parsing middleware to populate req.body.
// Returns middleware that only parses urlencoded bodies 
// and only looks at requests where the Content-Type header matches the type option. 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// store all static files (css, images .etc)
app.use(express.static('public'));


app.get('/', function(req, res) {
	statesEngine.getStates(function(data){
		state_list = data;
        
        states_1 = data.slice(0,13);
        states_2 = data.slice(13,26);
        states_3 = data.slice(26,38);
        states_4 = data.slice(38,50);
        console.log(states_4);
		res.render('index',{
			title:"PM25: Visualization of PM2.5",
			states_col1:states_1,
			states_col2:states_2,
			states_col3:states_3,
			states_col4:states_4
		});
	});
});



app.get('/state/:name', function(req, res) {	
	statesEngine.getCitiesByState(state_name, function(data){
		try {
		    // console.log(data[0].city);
		    // city_name = data[0].city
			city_list = data;
			
			// var first = city_list[0]["city"];
			// console.log(first)
			state_name = req.params.name;
			//console.log("hehe"+city_name);
				console.log(city_list.length);
				console.log(city_list);
				console.log('mf');			
			if (city_list.length > 0) {

				res.render('state', {
					title:state_name + ': the map of cities', 
					state_name:state_name,
					cities_objs:city_list
				});	
			} else{
				// location.reload();
				res.redirect('/state/'+state_name);
			}

		}
		catch(err) {
		    console.log(err);
		}
			
	})
});
// app.get('/state/:name', function(req, res) {
// 		var state_name = req.params.name;
// 		res.render('state', {
// 			title:state_name + ': the map of cities', 
// 			state_name:state_name,
// 			cities_objs:'data'
// 		});
// });
app.get('/inside', function(req, res) {
   res.render('inside', {title:"hehehe"});
});

app.listen(4000)