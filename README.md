# 用Express和MongoDB构建周总结系统后台

这是一个用nodeJS框架Express与MongoDB数据库构建的简易后台。

## 相关技术

<img src='./assets/express_mongodb.png' width='750' alt='相关技术'>

## 建立数据库和用户集合

### 在C:\program files\mongodb\server\2.6\bin里运行以下命令

```sh
mongo
use jql_sum
db.users.insert({ user: "Alice", password: "Alice", job: "worker" })
```
