//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/jql_sum';
var ObjectId = mongodb.ObjectId;

var detail_api = function(req, res){
	var findData = function(db, callback){
		var dateNumber = req.body.dateNumber;
		var date = dateNumber.slice(0, 4) + '-' + dateNumber.slice(4, 6) + '-' + dateNumber.slice(6);
		var _id = req.body._id;
		// 防止_id参数获取出错或被篡改
		if(_id.length !== 24){
			_id = '111111111111111111111111';
		}
		var collection = db.collection('summary');
		
		collection.find({ "date": date, "_id": ObjectId(_id) }).toArray(function(err, result){
			if(err){
				console.log('Error:' + err);
				return;
			}
			var response = { };
			if(typeof result[0] == 'undefined'){
				response.code = "0";
				response.message = '无相关记录';
				callback(response);
			}
			else{
				response.code = "1";
				response.username = result[0].username;
				response.thisWeek = result[0].thisWeek;
				response.nextWeek = result[0].nextWeek;
				callback(response);
			}
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

module.exports = detail_api;