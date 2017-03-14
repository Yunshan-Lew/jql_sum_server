//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/jql_sum';
var ObjectId = mongodb.ObjectId;

var username_api = function(req, res){
	//拿到数据后到数据库中查询
	var findData = function(db, callback){
		var token = req.body.token;
		if(token.length !== 24){
			token = '111111111111111111111111';
		}
		var searchStr = { "_id": ObjectId(token) };
		var collection = db.collection('users');
		
		collection.find(searchStr).toArray(function(err, result){
			if(err){
				console.log('Error:' + err);
				return;
			}
			response = { };
			if(typeof result[0] == 'undefined'){
				response.code = "0";
				response.message = "该用户不存在";
				callback(response);
			}
			else{
				response.code = "1";
				response.message = "已找到用户名";
				response.username = result[0].user;
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

module.exports = username_api;