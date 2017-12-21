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
app.use(express.static('./public'));

var	states = require('./routes/states');

app.use('/', states);




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