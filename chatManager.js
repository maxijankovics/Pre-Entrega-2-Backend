import fs from 'fs/promises';

class ChatManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getMessages() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async saveMessage(message) {
        const messages = await this.getMessages();
        messages.push(message);
        await fs.writeFile(this.filePath, JSON.stringify(messages, null, 2));
    }
}

export default ChatManager;
