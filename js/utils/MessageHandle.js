"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fse = require("fs-extra");
const cryptoObj = require("crypto");
let messagePath = path.join(__dirname, '../../messages.json');
let filejson = fse.readJsonSync(messagePath);
let aeskey = '9syp2on79scnhrlad1ali12szwgz0gat';
let encmsgs = filejson.messages;
let msgs = new Array();
for (let i = 0; i < encmsgs.length; i++) {
    let msg = encmsgs[i];
    const decipher = cryptoObj.createDecipheriv('aes-256-cbc', Buffer.from(aeskey, 'utf-8'), '0102030405060708');
    let message;
    try {
        // console.log(msg.message);
        message = decipher.update(msg.message, 'base64', 'utf8') + decipher.final('utf8');
        msgs.push({
            ...msg,
            message,
        });
    }
    catch (e) {
        encmsgs.splice(i, 1);
        i--;
    }
}
exports.default = {
    getMessages() {
        return msgs;
    },
    async addMessage(message) {
        message.id = filejson.id++;
        msgs.push({
            ...message
        });
        const cipher = cryptoObj.createCipheriv('aes-256-cbc', Buffer.from(aeskey), '0102030405060708');
        message.message = cipher.update(message.message, 'utf8', 'base64') + cipher.final('base64');
        encmsgs.push(message);
        await saveinFile();
        return;
    },
    async deleteMessage(id) {
        msgs = msgs.filter((msg) => msg.id !== id);
        filejson.messages = encmsgs = encmsgs.filter((msg) => msg.id !== id);
        await saveinFile();
        return void 0;
    }
};
async function saveinFile() {
    await fse.writeJson(messagePath, filejson, {
    // spaces: 2,
    });
}
