import * as express from 'express';
import MessageHandle from '../utils/MessageHandle'
import { sendMsg } from './sse';

const router = express.Router();

router.post('/remove', async (req, res) => {
    const { id } = req.body;
    try {
        MessageHandle.deleteMessage(id);
        res.json({
            code: 0,
            msg: '删除成功'
        })
        sendMsg('update');
    } catch {
        res.json({
            code: 1,
            msg: '删除失败'
        })
    }
});

export default router;
