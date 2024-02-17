"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const MessageHandle_1 = require("../utils/MessageHandle");
const MyCrypto_1 = require("../utils/MyCrypto");
const router = express.Router();
router.post('/getmsgs', (req, res) => {
    const { enckey } = req.body;
    if (!enckey) {
        return res.json({
            code: 1,
            msg: 'missed enckey'
        });
    }
    try {
        const cipher = (0, MyCrypto_1.createCipher)(enckey, req.auth?.username);
        console.log(req.auth?.username);
        let msgs = MessageHandle_1.default.getMessages();
        let encmsgs = cipher.encrypt(JSON.stringify(msgs));
        res.json({
            code: 0,
            msg: 'ok',
            encdata: encmsgs,
        });
    }
    catch (err) {
        res.json({
            code: 1,
            msg: err.message
        });
    }
});
exports.default = router;
