// ممكن تسيرش عن createChiperiv & createDecipheriv وانت هتفهم الي مكتوب هنا
import * as crypto from 'crypto';
const algorithm = 'aes-256-cbc';
const key_env = process.env.ENCRYPT_KEY || 'KEy-secret@#';
const key = crypto.createHash('sha256').update(String(key_env)).digest('base64').substr(0, 32);

type Encrypted = {
  iv: string;
  encryptedData: string;
};

export const generateIv = () => crypto.randomBytes(16);

export const encrypt = (text: string, iv: Buffer) => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
};

export const decrypt = (encrypted: Encrypted) => {
  const iv = Buffer.from(encrypted.iv, 'hex');
  const encryptedText = Buffer.from(encrypted.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
