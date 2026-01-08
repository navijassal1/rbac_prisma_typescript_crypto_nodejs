import crypto from "crypto";
const ENCRYPTION_KEY = crypto.randomBytes(32);
const IV = crypto.randomBytes(16);
export const encrytPayload = (payload) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return `${IV.toString('base64')}:${encrypted}`;
};
export const decryptedPayload = (encryptedPayload) => {
    // console.log([encryptedPayload])
    const [IVBase64, encrypted] = encryptedPayload.split(':');
    // console.log([IVBase64,encrypted])
    if (!IVBase64 || !encrypted)
        throw new Error('Invalid payload');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    // console.log([decipher],'decipher')
    let decrypted = decipher.update(encrypted, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return JSON.parse(decrypted);
};
//# sourceMappingURL=crypto.service.js.map