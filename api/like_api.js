//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/jql_sum';
var ObjectId = mongodb.ObjectId;

var like_api = function(req, res){
	var addData = function(db, callback){
		var token = req.body.token;
		if(token.length !== 24){
			token = '111111111111111111111111';
		}
		var share_id = req.body.share_id;
		if(share_id.length !== 24){
			share_id = '111111111111111111111111';
		}
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
				whetherLike(result[0].user, share_id);
			}
		});
		
		function whetherLike(username, share_id){
			var collection = db.collection('tech_share');
			
			collection.find({ "_id": ObjectId(share_id) }).toArray(function(err, result){
				if(err){
					console.log("Error: " + err);
					return;
				}
				var response = { };
				if(typeof result[0] == "undefined"){
					response.code = "0";
					response.message = "目标分享不存在";
					callback(response);
				}else{
					updateFans(username, share_id, result[0].like);
				}
			});
		}
		
		function updateFans(username, share_id, fans){
			var fansArr = fans.split('&&');
			// 暂无人点赞
			if(fansArr[0] == ""){
				fansArr.shift();
			}
			
			var likeIt = true;
			var msg = "like succeed";
			
			//取消点赞
			fansArr.forEach(function(item, index){
				if(item == username){
					fansArr.splice(index, 1);
					likeIt = false;
					msg = "dislike succeed";
				}
			});
			// 确定点赞
			if(likeIt)fansArr.push(username);
			
			fans = fansArr.join('&&');
			
			var collection = db.collection('tech_share');
			
			collection.update({ "_id": ObjectId(share_id) }, { $set: { "like": fans } }, function(err, result){
				if(err){
					console.log("Error: " + err);
					return;
				}
				var response = { };
				if(result.result.ok == 1){
					response.code = "1";
					response.message = msg;
					callback(response);
				}
				else{
					response.code = "0";
					response.message = "请求失败，请重试";
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

module.exports = like_api;
