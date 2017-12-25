var Connection = require('mongodb-connection-model');
var express = require('express');
var app = express();
var router = express.Router();
// to store states
var state_list = [],
	city_list = [],
	state_name,
	city_name;

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://18.217.147.167:27017';
var COLLECTION_NAME = 'modis_db_data';
var DOC_NAME = 'cities_US'
var whereStr = "state";
var connect = Connection.connect;
const options = {
  hostname: 'localhost',
  port: 27017,
  ssh_tunnel: 'IDENTITY_FILE',
  ssh_tunnel_hostname: 'ec2-18-217-147-167.us-east-2.compute.amazonaws.com',
  ssh_tunnel_username: 'ec2-user',
  ssh_tunnel_identity_file: ['/home/chengxi/Node/PM25_Site-master/PM25_chengxi.pem']
};
 
connect(options).on('status', (evt) => console.log('status:', evt));

getStates = function (callback){	
	connect(options, (err, client) =>{
		if (err) {
    		return console.log(err);
  		}
		var db = client.db(COLLECTION_NAME);
		db.authenticate('chengxiz', 'Bibby100!', function(err, result){
			var collection = result.collection(DOC_NAME);		
			console.log("conncect successfully!");
		    collection.distinct(whereStr,  function(err, objs){
		        var returnable_states;
		        if (err) throw err;        
		        returnable_states = [];
		        var objs_sorted = objs.sort()
		     	for (i = 0; i < objs_sorted.length; i++){
			 		returnable_states[i] = {name: objs_sorted[i]};
			 	}
			 	client.close();	// remeber to close it before callback
		        callback(returnable_states);        
		    });
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
			city_list = data;
			state_name = req.params.name;
				console.log(city_list);
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