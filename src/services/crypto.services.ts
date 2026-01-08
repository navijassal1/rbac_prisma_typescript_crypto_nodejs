import crypto from "crypto"
import {CRYPTO} from "../constants/backend.js"
const IV = crypto.randomBytes(16)
const ENCRYPTION_KEY_BUFFER=Buffer.from(CRYPTO.ENCRYPTION_KEY,'hex')


export const encrytPayload = (payload: object): string => {
 
    const cipher = crypto.createCipheriv('aes-256-cbc',ENCRYPTION_KEY_BUFFER, IV)

    let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64')

    encrypted += cipher.final('base64')

    return `${IV.toString('base64')}:${encrypted}`
}
export const decryptedPayload = (encryptedPayload: string): any => {

    // console.log('encryptedPayload',encryptedPayload)
    // console.log('CRYPTO.ENCRYPTION_KEY',CRYPTO.ENCRYPTION_KEY)
    const [IVBase64, encrypted] = encryptedPayload.split(':')

    if (!IVBase64 || !encrypted) throw new Error('Invalid payload');

    const iv = Buffer.from(IVBase64, "base64"); // ✅ USE STORED IV

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY_BUFFER, iv)

    // console.log([decipher], 'decipher')

    let decrypted = decipher.update(encrypted, 'base64', 'utf8')

    decrypted += decipher.final('utf8')

    // console.log([decrypted], 'decrypted')

    return JSON.parse(decrypted)
}