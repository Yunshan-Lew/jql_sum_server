//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/jql_sum';
var ObjectId = mongodb.ObjectId;

var techshare_api = function(req, res){
	var pullDate = function(db, callback){
		var token = req.body.token;
		if(typeof token == 'undefined' || token.length !== 24){
			token = '111111111111111111111111';
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
				getShare(result[0].user);
			}
		});
		
		function getShare(username){
			var collection = db.collection('tech_share');
		
			collection.find({ }).sort({ "date": -1 }).toArray(function(err, result){
				if(err){
					console.log('Error:' + err);
					return;
				}
				result.forEach(function(item, i){
					// 按照 React 的规范，dataSource和columns里的数据值都需要指定key值
					item.key = i;
					
					// 喜欢人数
					var fans = item.like.split('&&');
					item.like = item.like.length == 0 ? 0 : fans.length;
					
					// 是否有当前用户
					var isFans = false;
					fans.forEach(function(item){
						if(item == username)isFans = true;
					});
					item.isFans = isFans;
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
		
	}
	
	MongoClient.connect(DB_CONN_STR, function(err, db){
		pullDate(db, function(result){
			res.status(200);
			res.json(result);
			db.close();
		});
	});
}

module.exports = techshare_api;