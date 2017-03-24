//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var moment = require('moment');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/jql_sum';
var ObjectId = mongodb.ObjectId;

var share_api = function(req, res){
	var addData = function(db, callback){
		var token = req.body.token;
		if(token.length !== 24){
			token = '111111111111111111111111';
		}
		var shareText = req.body.shareText;
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
				insertInfo(result[0].user);
			}
		});
		
		function insertInfo(username){
			var date = moment().format('YYYY/MM/DD HH:mm:ss');
			var insertStr = { "username": username, "shareText": shareText, "date": date, "like": "" };
			var collection = db.collection('tech_share');
			
			collection.insert(insertStr, function(err, result){
				if(err){
					console.log("Error: " + err);
					return;
				}
				var response = { };
				if(result.result.ok == 1){
					response.code = "1";
					response.message = "分享发布成功";
					callback(response);
				}
				else{
					response.code = "0";
					response.message = "分享发布失败";
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

module.exports = share_api;
