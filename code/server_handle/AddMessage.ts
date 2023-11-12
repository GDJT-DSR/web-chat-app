import * as express from 'express';
import MessageHandle from '../utils/MessageHandle';
import { createCipher } from '../utils/MyCrypto';
import { Request } from 'express-jwt';
import { sendMsg } from './sse';

const router = express.Router();

router.post('/addmsg', async (req: Request, res) => {
    let { message, enckey } = req.body as {
        message?: string,
        enckey?: string
    };
    if (!enckey || !message?.trim()) {
        return res.json({
            code: 1,
            msg: '参数错误'
        })
    }
    let username = req.auth?.username as string;
    try {
        const cipher = createCipher(enckey, req.auth?.username as string);
        message = cipher.decrypt(message).trim();
        console.log(username, message);
    } catch (err) {
        console.log(err);
        return res.json({
            code: 2,
            msg: '解密失败'
        })
    }
    if (!message) {
        return res.json({
            code: 4,
            msg: '消息为空'
        })
    }
    await MessageHandle.addMessage({
        message,
        username,
        time: Date.now()
    })
    res.json({
        code: 0,
        msg: '添加成功'
    })
    sendMsg('update');
})

export default router;

