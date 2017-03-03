//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/jql_sum';

var login_api = function(req, res){
	//拿到数据后到数据库中查询
	var findData = function(db, callback){
		var user = req.body.user;
		var password = req.body.password;
		var searchStr = { "user": user };
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
			else if(result[0].password !== password){
				response.code = "0";
				response.message = "密码不正确";
				callback(response);
			}
			else{
				response.code = "1";
				response.message = "登陆成功";
				response.token = result[0]._id;
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

module.exports = login_api;