import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

// Helper functions to convert to and from Base64URL
export function base64UrlEncode(str) {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' to make the length a multiple of 4
  while (str.length % 4) {
    str += '=';
  }
  return str;
}
const IV_LENGTH = 16; // AES block size
export const aesEncrypt = (text: string, aesEncryptionkey: string) => {
  try {
    const ENCRYPTION_KEY = crypto
      .createHash('sha256')
      .update(aesEncryptionkey)
      .digest();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const ivBase64 = iv.toString('base64');
    // Combine IV and encrypted text with a separator
    const combined = `${ivBase64}:${encrypted}`;
    // Convert to URL-safe Base64
    return base64UrlEncode(combined);
  } catch (error) {
    console.error(error.message);
    throw new BadRequestException('Endcrypt Error');
  }
};

export const aesDecrypt = (encryptedText: string, aesEncryptionkey: string) => {
  try {
    const ENCRYPTION_KEY = crypto
      .createHash('sha256')
      .update(aesEncryptionkey)
      .digest();
    const combined = base64UrlDecode(encryptedText);
    const [ivBase64, encrypted] = combined.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error(error.message);
    throw new BadRequestException('Decrypt Error');
  }
};
