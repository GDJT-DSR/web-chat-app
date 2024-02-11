import * as express from 'express'
import * as path from 'path';
import * as bodyParser from 'body-parser';
import AddMessage from './server_handle/AddMessage';
import GetMessages from './server_handle/GetMessages';
import RemoveMessage from './server_handle/RemoveMessage';
import { router as sse } from './server_handle/sse';
import { expressjwt } from 'express-jwt'
import { secretKey } from './consts';
import User from './server_handle/user';
import * as http from 'http';

const app = express();

const PORT = 8080;

// 处理json数据
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// token验证
app.use('/api/chat/*', expressjwt({
    secret: secretKey,
    algorithms: ['HS256']
}).unless({
    path: [
        { url: '/api/chat/login' },
        { url: '/api/chat/getpubkey' },
        { url: '/api/chat/sse' }
    ]
}))

// 中间件注册
app.use('/api/chat/', AddMessage, GetMessages, RemoveMessage, User, sse)
app.get('/api/chat/getpubkey', (_, res) => {
    res.sendFile(path.join(__dirname, '../pem/public.pem'));
})
app.use(express.static(path.join(__dirname, '../dist')))

// session
// app.use(session)

//错误处理
app.use((err: Error, _req: express.Request, res: express.Response, _next: Function): void => {
    if ((err as Error).name === 'UnauthorizedError') {
        try {
            res.json({
                code: 401,
                msg: 'invalid token'
            })
        } catch { }
    } else {
        try {
            res.json({
                code: 500,
                msg: 'something wrong about server'
            })
        } catch { }
    }
})


// app.listen(PORT, () => {
//     // console.clear();
//     console.clear()
//     console.log(`server is running at http://localhost:${PORT}`);
// })

http.createServer(app).listen(PORT, () => {
    console.clear()
    console.log(`server is running at http://localhost:${PORT}`);
})
