# dsr-chat-app
这是一个基于node.js的聊天室项目，前端使用vue3-ts，后端使用ts开发。


## 如何运行？

1. 将项目下载至本地。
2. 使用npm i下载所需的包文件
3. 修改users.json中的默认账户密码(admin:password)(密码使用bcrypt加密)
4. 如有需要，可以在./pem中重新生成rsa公私密钥
5. npm start运行项目，程序会在8080端口运行(可在./js/server.js中更改)
6. 访问http://localhost:8080 即可

## 如何使用？

- 在弹出登录框时点击‘取消’，或在登录页面全部留空，会进入游客模式，只能预览消息
- 双击信息可删除
