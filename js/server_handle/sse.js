"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMsg = exports.router = void 0;
const express = require("express");
exports.router = express.Router();
let responses = new Set();
exports.router.all('/sse', (req, res) => {
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
    }, 3 * 10 ** 5);
});
function sendMsg(msg) {
    responses.forEach(res => res.write(`event: message\ndata: ${msg}\n\n`));
}
exports.sendMsg = sendMsg;
