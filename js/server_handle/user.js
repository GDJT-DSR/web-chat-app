"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fse = require("fs-extra");
const path = require("path");
const MyCrypto_1 = require("../utils/MyCrypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const consts_1 = require("../consts");
// import { Jwt } from 'jsonwebtoken';
const users = fse.readJSONSync(path.join(__dirname, '../../users.json'));
const router = express.Router();
router.post('/login', (req, res) => {
    const { username, password, enckey } = req.body;
    const cipher = (0, MyCrypto_1.createCipher)(enckey, '');
    const decryptedPassword = cipher.decrypt(password);
    const decryptUserName = cipher.decrypt(username);
    for (let user of users) {
        if (user.username === decryptUserName) { // 用户名匹配
            // 验证密码信息
            bcrypt.compare(decryptedPassword, user.enc_password).then(bool => {
                if (bool) {
                    let token = jwt.sign({
                        username: user.username,
                    }, consts_1.secretKey, {
                        expiresIn: '10h',
                    });
                    res.json({
                        code: 0,
                        msg: '登录成功',
                        token,
                    });
                }
                else {
                    res.json({
                        code: 1,
                        msg: '密码错误',
                    });
                }
            }).catch(e => {
                try {
                    res.json({
                        code: 1,
                        msg: e.message,
                    });
                }
                catch { }
            });
            return;
        }
    }
    res.json({
        code: 2,
        msg: '该用户不存在',
    });
});
router.get('/getuserinfo', (req, res) => {
    res.json({
        code: 0,
        msg: '获取成功',
        data: req.auth
    });
});
// console.log(users);
exports.default = router;
