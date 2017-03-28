//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/jql_sum';
var ObjectId = mongodb.ObjectId;

var password_api = function(req, res){
	var addData = function(db, callback){
		var token = req.body.token;
		if(typeof token == 'undefined' || token.length !== 24){
			token = '111111111111111111111111';
		}
		var old = req.body.old;
		var New = req.body.New;
		var collection = db.collection('users');
		
		collection.find({ "_id":  ObjectId(token) }).toArray(function(err, result){
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
			else if(old !== result[0].password){
				response.code = "0";
				response.message = "原始密码错误";
				callback(response);
			}
			else if(New.length < 6){
				response.code = "0";
				response.message = "新密码不得低于6位";
				callback(response);
			}
			else{
				updatePassword(token, New);
			}
			
		});
		
		function updatePassword(token, New){
			var collection = db.collection('users');
			
			collection.update({ "_id": ObjectId(token) }, { $set: { "password": New } }, function(err, result){
				if(err){
					console.log("Error: " + err);
					return;
				}
				var response = { };
				if(result.result.ok == 1){
					response.code = "1";
					response.message = "保存成功";
					callback(response);
				}else{
					response.code = "1";
					response.message = "保存失败，请重试";
					callback(response);
				}
			});
		}
	
	}
	
	MongoClient.connect(DB_CONN_STR, function(err, db){
		addData(db, function(result){
			res.status(200);
			res.json(result);
			db.close();
		});
	});
}

module.exports = password_api;
