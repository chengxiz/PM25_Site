console.log("wtffff");

var express = require('express');
var app = express();
var router = express.Router();
// installation to directory of node_modules: $ npm install hbs --save-dev 




// to store states
var state_list = [];
var city_list = [];
var state_name;
var city_name;
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017';
var COLLECTION_NAME = 'modis_db_data';
var DOC_NAME = 'cities_US'
var whereStr = "state";
getStates = function (callback){	
	MongoClient.connect(DB_CONN_STR, function(err, client){
		var db = client.db(COLLECTION_NAME);
		var collection = db.collection(DOC_NAME);		
		console.log("conncect successfully!");
	    collection.distinct(whereStr,  function(err, objs){
	        var returnable_states;
	        if (err) throw err;        
	        returnable_states = [];
	        var objs_sorted = objs.sort()
	     	for (i = 0; i < objs_sorted.length; i++){
		 		returnable_states[i] = {name: objs_sorted[i]};
		 	}
		 	client.close();	// remeber to put it before callback
	        callback(returnable_states);        
	    });
	    
	});
}
getCitiesByState = function(state, callback) {
	MongoClient.connect(DB_CONN_STR, function(err, client){
		var findStr = {"state":state};
		var db = client.db(COLLECTION_NAME);
		var collection = db.collection(DOC_NAME);		
		console.log("conncect successfully!");
		console.log(findStr);
		collection.find(findStr).toArray(function(err, result) {
			if(err)
			{
			  console.log('Error:'+ err);
			  // return err;
			  client.close();	
			  return err;
			}
			client.close();
			callback(result);
		});			
	});
}


router.get('/', function(req, res) {
	getStates(function(data){
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

router.get('/state/:name', function(req, res) {	
	getCitiesByState(state_name, function(data){
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

module.exports = router;