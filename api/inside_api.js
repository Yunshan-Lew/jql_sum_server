//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/jql_sum';

var inside_api = function(req, res){
	var findData = function(db, callback){
		var dateNumber = req.body.dateNumber;
		var date = dateNumber.slice(0, 4) + '-' + dateNumber.slice(4, 6) + '-' + dateNumber.slice(6);
		var current = req.body.current;
		var pageSize = req.body.pageSize;
		var collection = db.collection('summary');
		
		collection.find({ "date": date }, { "thisWeek": 0, "nextWeek": 0 }).toArray(function(err, result){
			if(err){
				console.log('Error:' + err);
				return;
			}
			result.forEach(function(item, i){
				item.key = i;
			});
			var response = { };
			response.code = "1";
			response.results = result.slice( ( current - 1 ) * pageSize, current * pageSize );
			response.total = result.length;
			callback(response);
		});
	}
	
	MongoClient.connect(DB_CONN_STR, function(err, db){
		findData(db, function(result){
			res.status(200);
			res.json(result);
			db.close();
		});
	});
}

module.exports = inside_api;