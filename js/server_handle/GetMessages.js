"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var MessageHandle_1 = require("../utils/MessageHandle");
var MyCrypto_1 = require("../utils/MyCrypto");
var router = express.Router();
router.post('/getmsgs', function (req, res) {
    var _a;
    var enckey = req.body.enckey;
    if (!enckey) {
        return res.json({
            code: 1,
            msg: 'missed enckey'
        });
    }
    try {
        var cipher = (0, MyCrypto_1.createCipher)(enckey, (_a = req.auth) === null || _a === void 0 ? void 0 : _a.username);
        var msgs = MessageHandle_1.default.getMessages();
        var encmsgs = cipher.encrypt(JSON.stringify(msgs));
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
