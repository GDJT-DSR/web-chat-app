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

router.post('/login', async (req, res) => {
    const { username, password, enckey } = req.body;

    try {
        const cipher = createCipher(enckey, '');
        const decryptedPassword = cipher.decrypt(password);
        const decryptUserName = cipher.decrypt(username);
        for (let user of users) {
            if (user.username === decryptUserName && // 用户名匹配
                // 验证密码信息
                (await bcrypt.compare(decryptedPassword, user.enc_password))) {
                let token = jwt.sign({
                    username: user.username,
                }, secretKey, {
                    expiresIn: '10h',
                })
                return res.json({
                    code: 0,
                    msg: '登录成功',
                    token,
                })
            }
        }
    } catch (e) {
        res.json({
            code: 1,
            msg: (<Error>e).message,
        })
    }

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