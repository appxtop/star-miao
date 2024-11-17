# star-miao

来自星星的喵


## 架构
前端: vue3+vite+ts

游戏引擎 :div

## 数据库

该项目使用 mongodb 加 redis 数据库


## 使用方法

```
//git clone 
//cd
//安装依赖
npm install
//将根项目编译(根项目里面主要是对子项目的一些操作工具)
npm run build
//将所有子项目编译
npm run build-all
//复制环境变量配置文件并修改其中的数据库连接
//cp .env.example .env
//初始化数据库在packages/launcher中,执行其中的方法就行了
//前端服务器
npm run backend
//前端静态页面
npm run client-web
```

## 等待解决问题