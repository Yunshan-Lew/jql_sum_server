//配置mongodb数据库相关的内容
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/jql_sum';

var register_api = function(req, res){
	//拿到数据后到数据库中查询
	var findData = function(db, callback){
		var user = req.body.user;
		var job = req.body.job;
		var password = req.body.password;
		
		response = { };
		
		// 验证收到的信息
		if( user.length < 5 || user > 15 ){
			response.code = "0";
			response.message = "用户名长度需为5-15位";
			callback(response);
			return;
		}
		else if( !/^[\u4E00-\u9FA5a-zA-Z]+$/.test(user) ){
			response.code = "0";
			response.message = "用户名只能由汉字、字母组成";
			callback(response);
			return;
		}
		
		var jobList = ['洗碗工', '扫地工', '搬砖工'];
		
		var exist = false;
		
		jobList.forEach(function(item){
			if( item == job ) exist = true;
		});
		
		if(!exist){
			response.code = "0";
			response.message = "该职位不存在";
			callback(response);
			return;
		}
		
		if( password.length < 6 || user > 18 ){
			response.code = "0";
			response.message = "密码长度需为6-18位";
			callback(response);
			return;
		}
		else if( /^[0-9]+$/.test(password) ){
			response.code = "0";
			response.message = "密码不能全为数字";
			callback(response);
			return;
		}
		
		// 后台查重
		var searchStr = { "user": user };
		var collection = db.collection('users');
		collection.find(searchStr).toArray(function(err, result){
			if(err){
				console.log('Error:' + err);
				return;
			}
			if(result[0] == user){
				response.code = "0";
				response.message = "该用户名已存在";
				callback(response);
			}
			else{
				addUser(user, password);
			}
		});
		
		// 添加用户
		function addUser(user, password){
			var userInfo = { "user": user, "job": job, "password": password };
			
			collection.insert(userInfo, function(err, result){
				if(err){
					console.log("Error: " + err);
					return;
				}
				if(result.result.ok == 1){
					response.code = "1";
					response.message = "注册成功";
					callback(response);
				}
				else{
					response.code = "0";
					response.message = "注册失败";
					callback(response);
				}
			});
		}
		
	}
	
	MongoClient.connect(DB_CONN_STR, function(err, db){
		findData(db, function(result){
			res.status(200);
			res.json(result);
			db.close();
		});
	});
}

module.exports = register_api;