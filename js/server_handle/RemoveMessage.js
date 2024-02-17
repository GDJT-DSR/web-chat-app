"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const MessageHandle_1 = require("../utils/MessageHandle");
const sse_1 = require("./sse");
const router = express.Router();
router.post('/remove', async (req, res) => {
    const { id } = req.body;
    try {
        MessageHandle_1.default.deleteMessage(id);
        res.json({
            code: 0,
            msg: '删除成功'
        });
        (0, sse_1.sendMsg)('update');
    }
    catch {
        res.json({
            code: 1,
            msg: '删除失败'
        });
    }
});
exports.default = router;
