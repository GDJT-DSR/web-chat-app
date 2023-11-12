import * as express from 'express';

export const router = express.Router();

let responses = new Set<express.Response>()
router.all('/sse', (req, res) => {

    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    res.flushHeaders();

    responses.add(res);

    setTimeout(() => {
        responses.delete(res);
        res.end();
    }, 3 * 10 ** 5)

})

export function sendMsg(msg: string) {
    responses.forEach(res => res.write(`event: message\ndata: ${msg}\n\n`));
}
