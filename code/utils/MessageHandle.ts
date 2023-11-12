import * as path from "path";
import * as fse from 'fs-extra';
import * as cryptoObj from 'crypto';

let messagePath = path.join(__dirname, '../../messages.json');

let filejson = fse.readJsonSync(messagePath) as {
    messages: Message[],
    id: number
};
let aeskey = '9syp2on79scnhrlad1ali12szwgz0gat';

let encmsgs = <Message[]>filejson.messages;

interface Message {
    id?: number,
    time: number,
    message: string,
    username: string,
}

let msgs = new Array<Message>();
for (let i = 0; i < encmsgs.length; i++) {
    let msg = encmsgs[i];
    const decipher = cryptoObj.createDecipheriv('aes-256-cbc', Buffer.from(aeskey, 'utf-8'), '0102030405060708');
    let message: string;
    try {

        // console.log(msg.message);
        message = decipher.update(msg.message, 'base64', 'utf8') + decipher.final('utf8')
        msgs.push({
            ...msg,
            message,
        })
    } catch (e) {
        encmsgs.splice(i, 1);
        i--;
    }
}

export default {
    getMessages(): Message[] {
        return msgs;
    },
    async addMessage(message: Message): Promise<void> {
        message.id = filejson.id++;
        msgs.push({
            ...message
        })
        const cipher = cryptoObj.createCipheriv('aes-256-cbc', Buffer.from(aeskey), '0102030405060708');

        message.message = cipher.update(message.message, 'utf8', 'base64') + cipher.final('base64');
        encmsgs.push(message);
        await saveinFile();
        return;
    },
    async deleteMessage(id: number): Promise<void> {
        msgs = msgs.filter((msg: Message) => msg.id !== id)
        filejson.messages = encmsgs = encmsgs.filter((msg: Message) => msg.id !== id);

        await saveinFile();
        return void 0;
    }
};
async function saveinFile() {
    await fse.writeJson(messagePath, filejson, {
        // spaces: 2,
    });
}