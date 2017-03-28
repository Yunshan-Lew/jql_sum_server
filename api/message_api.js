//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/jql_sum';
var ObjectId = mongodb.ObjectId;

var message_api = function(req, res){
	var addData = function(db, callback){
		var token = req.body.token;
		if(typeof token == 'undefined' || token.length !== 24){
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
				checkRepeat(result[0].user, result[0].job);
			}
		});
		
		function checkRepeat(username, job){
			var collection = db.collection('summary');
			
			collection.find({ "username": username, "date": date }).toArray(function(err, result){
				if(err){
					console.log("Error: " + err);
					return;
				}
				var response = { };
				if(typeof result[0] !== "undefined"){
					response.code = "0";
					response.message = "本周总结只能提交一次";
					callback(response);
				}else{
					insertInfo(username, job);
				}
			});
		}
		
		function insertInfo(username, job){
			var insertStr = { "username": username, "job": job, "thisWeek": thisWeek, "nextWeek": nextWeek, "date": date };
			var collection = db.collection('summary');
			
			collection.insert(insertStr, function(err, result){
				if(err){
					console.log("Error: " + err);
					return;
				}
				var response = { };
				if(result.result.ok == 1){
					updateTotal(date);
				}
				else{
					response.code = "0";
					response.message = "总结提交失败";
					callback(response);
				}
			});
		}
		
		function updateTotal(date){
			var totallist = db.collection('totallist');
			totallist.ensureIndex({ eIndex: 1 });
			
			totallist.find({ "date": date }).toArray(function(err, result){
				if(err){
					console.log("Error: " + err);
					return;
				}
				if(typeof result[0] == 'undefined'){
					var totalIndex = date.split('-')[0] + '年' + date.split('-')[1] + '月第' + Math.ceil(date.split('-')[2].replace(/^(0)/, '') / 7 ) + '周总结汇总';
					var intoTotal = { "totalIndex": totalIndex, "date": date };
					
					totallist.insert(intoTotal, function(err, result){
						if(err){
							console.log("Error: " + err);
							return;
						}
						var response = { };
						if(result.result.ok == 1){
							response.code = "1";
							response.message = "总结提交成功";
							callback(response);
						}
						else{
							response.code = "0";
							response.message = "总结提交失败";
							callback(response);
						}
					});
				}
				else{
					// totallist已有这期记录
					var response = { };
					response.code = "1";
					response.message = "总结提交成功";
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

module.exports = message_api;
