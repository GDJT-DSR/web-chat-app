"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var AddMessage_1 = require("./server_handle/AddMessage");
var GetMessages_1 = require("./server_handle/GetMessages");
var RemoveMessage_1 = require("./server_handle/RemoveMessage");
var sse_1 = require("./server_handle/sse");
var express_jwt_1 = require("express-jwt");
var consts_1 = require("./consts");
var user_1 = require("./server_handle/user");
var http = require("http");
var app = express();
var PORT = 8080;
// 处理json数据
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// token验证
app.use('/api/*', (0, express_jwt_1.expressjwt)({
    secret: consts_1.secretKey,
    algorithms: ['HS256']
}).unless({
    path: [
        { url: '/api/login' },
        { url: '/api/getpubkey' },
        { url: '/api/sse' }
    ]
}));
// 中间件注册
app.use('/api/', AddMessage_1.default, GetMessages_1.default, RemoveMessage_1.default, user_1.default, sse_1.router);
app.get('/api/getpubkey', function (_, res) {
    res.sendFile(path.join(__dirname, '../pem/public.pem'));
});
app.use(express.static(path.join(__dirname, '../dist')));
// session
// app.use(session)
//错误处理
app.use(function (err, _req, res, _next) {
    if (err.name === 'UnauthorizedError') {
        try {
            res.json({
                code: 401,
                msg: 'invalid token'
            });
        }
        catch (_a) { }
    }
    else {
        try {
            res.json({
                code: 500,
                msg: 'something wrong about server'
            });
        }
        catch (_b) { }
    }
});
// app.listen(PORT, () => {
//     // console.clear();
//     console.clear()
//     console.log(`server is running at http://localhost:${PORT}`);
// })
http.createServer(app).listen(PORT, function () {
    console.clear();
    console.log("server is running at http://localhost:".concat(PORT));
});
