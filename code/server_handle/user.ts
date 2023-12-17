import * as express from 'express';
import * as fse from 'fs-extra';
import * as path from 'path';
import { createCipher } from '../utils/MyCrypto'
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { secretKey } from '../consts';
import { Request as JwtRequest } from 'express-jwt';
// import { Jwt } from 'jsonwebtoken';

const users = fse.readJSONSync(path.join(__dirname, '../../users.json')) as User[];

const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password, enckey } = req.body;


    const cipher = createCipher(enckey, '');
    const decryptedPassword = cipher.decrypt(password);
    const decryptUserName = cipher.decrypt(username);
    for (let user of users) {
        if (user.username === decryptUserName) {// 用户名匹配
            // 验证密码信息
            bcrypt.compare(decryptedPassword, user.enc_password).then(bool => {
                if (bool) {
                    let token = jwt.sign({
                        username: user.username,
                    }, secretKey, {
                        expiresIn: '10h',

                    })
                    res.json({
                        code: 0,
                        msg: '登录成功',
                        token,
                    })
                } else {
                    res.json({
                        code: 1,
                        msg: '密码错误',
                    })
                }
            }).catch(e => {
                try {
                    res.json({
                        code: 1,
                        msg: (<Error>e).message,
                    })
                } catch { }
            })
            return;
        }
    }
    res.json({
        code: 2,
        msg: '该用户不存在',
    })
})

router.get('/getuserinfo', (req: JwtRequest, res: express.Response) => {
    res.json({
        code: 0,
        msg: '获取成功',
        data: req.auth
    })
})

interface User {
    username: string;
    enc_password: string;

}

// console.log(users);

export default router;