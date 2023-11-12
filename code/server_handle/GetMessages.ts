import * as express from 'express';
import MessageHandle from '../utils/MessageHandle';
import { createCipher } from '../utils/MyCrypto';
import { Request } from 'express-jwt';

const router = express.Router();

router.post('/getmsgs', (req: Request, res) => {
    const { enckey } = req.body as { enckey?: string };
    if (!enckey) {
        return res.json({
            code: 1,
            msg: 'missed enckey'
        })
    }
    try {
        const cipher = createCipher(enckey, req.auth?.username as string);
        console.log(req.auth?.username as string);
        let msgs = MessageHandle.getMessages();
        let encmsgs = cipher.encrypt(JSON.stringify(msgs));
        res.json({
            code: 0,
            msg: 'ok',
            encdata: encmsgs,
        });
    } catch (err) {
        res.json({
            code: 1,
            msg: (err as Error).message
        })
    }
})

export default router;
