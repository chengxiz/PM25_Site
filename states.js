
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017';
var COLLECTION_NAME = 'modis_db_data';
var DOC_NAME = 'cities_US'
var whereStr = "state";
exports.getStates = function (callback){	
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
exports.getCitiesByState = function(state, callback) {
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
