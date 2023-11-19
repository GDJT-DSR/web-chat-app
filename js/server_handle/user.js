"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var fse = require("fs-extra");
var path = require("path");
var MyCrypto_1 = require("../utils/MyCrypto");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var consts_1 = require("../consts");
// import { Jwt } from 'jsonwebtoken';
var users = fse.readJSONSync(path.join(__dirname, '../../users.json'));
var router = express.Router();
router.post('/login', function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password, enckey = _a.enckey;
    var cipher = (0, MyCrypto_1.createCipher)(enckey, '');
    var decryptedPassword = cipher.decrypt(password);
    var decryptUserName = cipher.decrypt(username);
    var _loop_1 = function (user) {
        if (user.username === decryptUserName) { // 用户名匹配
            // 验证密码信息
            bcrypt.compare(decryptedPassword, user.enc_password).then(function (bool) {
                if (bool) {
                    var token = jwt.sign({
                        username: user.username,
                    }, consts_1.secretKey, {
                        expiresIn: '10h',
                    });
                    res.json({
                        code: 0,
                        msg: '登录成功',
                        token: token,
                    });
                }
                else {
                    res.json({
                        code: 1,
                        msg: '密码错误',
                    });
                }
            }).catch(function (e) {
                try {
                    res.json({
                        code: 1,
                        msg: e.message,
                    });
                }
                catch (_a) { }
            });
            return { value: void 0 };
        }
    };
    for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
        var user = users_1[_i];
        var state_1 = _loop_1(user);
        if (typeof state_1 === "object")
            return state_1.value;
    }
});
router.get('/getuserinfo', function (req, res) {
    res.json({
        code: 0,
        msg: '获取成功',
        data: req.auth
    });
});
// console.log(users);
exports.default = router;
