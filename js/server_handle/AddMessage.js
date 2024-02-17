"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const MessageHandle_1 = require("../utils/MessageHandle");
const MyCrypto_1 = require("../utils/MyCrypto");
const sse_1 = require("./sse");
const router = express.Router();
router.post('/addmsg', async (req, res) => {
    let { message, enckey } = req.body;
    if (!enckey || !message?.trim()) {
        return res.json({
            code: 1,
            msg: '参数错误'
        });
    }
    let username = req.auth?.username;
    try {
        const cipher = (0, MyCrypto_1.createCipher)(enckey, req.auth?.username);
        message = cipher.decrypt(message).trim();
        console.log(username, message);
    }
    catch (err) {
        console.log(err);
        return res.json({
            code: 2,
            msg: '解密失败'
        });
    }
    if (!message) {
        return res.json({
            code: 4,
            msg: '消息为空'
        });
    }
    await MessageHandle_1.default.addMessage({
        message,
        username,
        time: Date.now()
    });
    res.json({
        code: 0,
        msg: '添加成功'
    });
    (0, sse_1.sendMsg)('update');
});
exports.default = router;
