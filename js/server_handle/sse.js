"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMsg = exports.router = void 0;
var express = require("express");
exports.router = express.Router();
var responses = new Set();
exports.router.all('/sse', function (req, res) {
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.flushHeaders();
    responses.add(res);
    setTimeout(function () {
        responses.delete(res);
        res.end();
    }, 3 * Math.pow(10, 5));
});
function sendMsg(msg) {
    responses.forEach(function (res) { return res.write("event: message\ndata: ".concat(msg, "\n\n")); });
}
exports.sendMsg = sendMsg;
