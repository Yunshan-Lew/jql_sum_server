//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/jql_sum';
var ObjectId = mongodb.ObjectId;

var techshare_api = function(req, res){
	var findData = function(db, callback){
		var collection = db.collection('tech_share');
		
		collection.find({ }, { "_id": 0 }).sort({ "date": -1 }).toArray(function(err, result){
			if(err){
				console.log('Error:' + err);
				return;
			}
			result.forEach(function(item, i){
				// 按照 React 的规范，dataSource和columns里的数据值都需要指定key值
				item.key = i;
			});
			var response = { };
			response.code = "1";
			
			var leftSide = [ ];
			result.forEach(function(item, index){
				if( index % 2 == 0 )
					leftSide.push(item);
			});
			response.leftSide = leftSide
			
			var rightSide = [ ];
			result.forEach(function(item, index){
				if( index % 2 == 1 )
					rightSide.push(item);
			});
			response.rightSide = rightSide;
			
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

module.exports = techshare_api;