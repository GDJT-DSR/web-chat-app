"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const AddMessage_1 = require("./server_handle/AddMessage");
const GetMessages_1 = require("./server_handle/GetMessages");
const RemoveMessage_1 = require("./server_handle/RemoveMessage");
const sse_1 = require("./server_handle/sse");
const express_jwt_1 = require("express-jwt");
const consts_1 = require("./consts");
const user_1 = require("./server_handle/user");
const app = express();
const PORT = process.env.PORT || 8080;
// 处理json数据
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// token验证
app.use('/api/chat/*', (0, express_jwt_1.expressjwt)({
    secret: consts_1.secretKey,
    algorithms: ['HS256']
}).unless({
    path: [
        { url: '/api/chat/login' },
        { url: '/api/chat/getpubkey' },
        { url: '/api/chat/sse' }
    ]
}));
// 中间件注册
app.use('/api/chat/', AddMessage_1.default, GetMessages_1.default, RemoveMessage_1.default, user_1.default, sse_1.router);
app.get('/api/chat/getpubkey', (_, res) => {
    res.sendFile(path.join(__dirname, '../pem/public.pem'));
});
app.use(express.static(path.join(__dirname, '../dist')));
// session
// app.use(session)
//错误处理
app.use((err, _req, res, _next) => {
    if (err.name === 'UnauthorizedError') {
        try {
            res.json({
                code: 401,
                msg: 'invalid token'
            });
        }
        catch { }
    }
    else {
        try {
            res.json({
                code: 500,
                msg: 'something wrong about server'
            });
        }
        catch { }
    }
});
app.listen(PORT, () => {
    console.clear();
    console.log(`server is running at http://localhost:${PORT}`);
});
// http.createServer(app).listen(PORT, () => {
//     console.clear()
//     console.log(`server is running at http://localhost:${PORT}`);
// })
