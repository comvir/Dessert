*	这是一个基于nodejs编写的静态资源站，它具备文件动态合并以及热更新功能
  
 	**用法示例**

	资源文件放置于public目录下
	 ```
	 public
		|————scripts
           |————demo1.js
           |————demo2.js
	 ```
	请求单个文件
	http://localhost:1337/scripts/demo1.js

	请求多个文件
	http://localhost:1337/?f=/scripts/demo1.js,/scripts/demo2.js
	
	**注意**
	请求多个文件时，样式和脚本分开请求
  
	**部署方式**
	
	准备好node运行环境，node启动bin目录下的www文件
