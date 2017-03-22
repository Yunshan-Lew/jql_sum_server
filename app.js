// 配置node服务器相关内容：
var express = require('express');
var app = express();
var bodyParder = require('body-parser'); 
app.use(bodyParder.urlencoded({ extended: true }));

// 引入api
var login_api = require('./api/login_api');
var username_api = require('./api/username_api');
var message_api = require('./api/message_api');
var totallist_api = require('./api/totallist_api');
var inside_api = require('./api/inside_api');
var detail_api = require('./api/detail_api');
var edit_api = require('./api/edit_api');

// 设置跨域访问
app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
   res.header("X-Powered-By", ' 3.2.1');
   res.header("Content-Type", "application/json;charset=utf-8");
   next();
});

// 定义登录的接口
app.post('/login', login_api);

// 定义获取用户名接口
app.post('/username', username_api);

// 定义总结提交接口
app.post('/message', message_api);

// 定义汇总列表接口
app.post('/totallist', totallist_api);

// 定义每周列表接口
app.post('/inside', inside_api);

// 定义总结详情接口
app.post('/detail', detail_api);

// 定义总结修改接口
app.post('/edit', edit_api);

// 配置服务器端口
var server = app.listen(3337, function(){
   var host = server.address().address;
   var port = server.address().port;
   console.log('后台服务启动http://localhost:', port);
});
