"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCipher = void 0;
var cryptoObj = require("crypto");
var fs = require("fs");
var path = require("path");
var NodeRSA = require("node-rsa");
// const privkey = cryptoObj.createPrivateKey(fs.readFileSync(path.join(__dirname, '../../pem/private.pem')));
var privkey = new NodeRSA(fs.readFileSync(path.join(__dirname, '../../pem/private.pem')));
privkey.setOptions({ encryptionScheme: 'pkcs1' });
function createCipher(enckey, pad) {
    // console.log(enckey);
    // let aeskey = cryptoObj.privateDecrypt({
    //     key: privkey,
    //     padding: cryptoObj.constants.RSA_PKCS1_PADDING
    // }, Buffer.from(enckey, 'base64'));
    // 解密，获取随机字符串
    var randStr = privkey.decrypt(Buffer.from(enckey, 'base64'), 'utf8');
    // 计算aes的key
    var aeskey = cryptoObj.createHash('md5').update(randStr + pad).digest();
    console.log(randStr, aeskey.toString('hex'));
    return {
        encrypt: function (data) {
            var cipher = cryptoObj.createCipheriv('aes-256-cbc', aeskey, '0102030405060708');
            cipher.setAutoPadding(true);
            return cipher.update(data, 'utf-8', 'base64') + cipher.final('base64');
        },
        decrypt: function (data) {
            var decipher = cryptoObj.createDecipheriv('aes-256-cbc', aeskey, '0102030405060708');
            decipher.setAutoPadding(true);
            return decipher.update(data, 'base64', 'utf-8') + decipher.final('utf-8');
        },
    };
}
exports.createCipher = createCipher;
