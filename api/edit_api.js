//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/jql_sum';
var ObjectId = mongodb.ObjectId;

var edit_api = function(req, res){
	var addData = function(db, callback){
		var token = req.body.token;
		if(token.length !== 24){
			token = '111111111111111111111111';
		}
		var thisWeek = req.body.thisWeek;
		var nextWeek = req.body.nextWeek;
		var date = req.body.date;
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
			else{
				checkExist(result[0].user);
			}
		});
		
		function checkExist(username){
			var collection = db.collection('summary');
			
			collection.find({ "username": username, "date": date }).toArray(function(err, result){
				if(err){
					console.log("Error: " + err);
					return;
				}
				var response = { };
				if(typeof result[0] == "undefined"){
					response.code = "0";
					response.message = "修改的内容不存在";
					callback(response);
				}else{
					updateInfo(username);
				}
			});
		}
		
		function updateInfo(username){
			var collection = db.collection('summary');
			var searchStr = { "username": username, "date": date };
			var updateStr = { $set: { "thisWeek": thisWeek, "nextWeek": nextWeek } }
			
			collection.update(searchStr, updateStr, function(err, result){
				if(err){
					console.log("Error: " + err);
					return;
				}
				var response = { };
				if(result.result.ok == 1){
					response.code = "1";
					response.message = "总结修改成功";
					callback(response);
				}
				else{
					response.code = "0";
					response.message = "总结修改失败";
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

module.exports = edit_api;
