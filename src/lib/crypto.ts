import CryptoJS from 'crypto-js';

/**
 * Client-side encryption using AES-256
 * The user's master password is used as the encryption key
 * This ensures the server never sees plaintext passwords
 */

export function encryptData(data: string, key: string): string {
  return CryptoJS.AES.encrypt(data, key).toString();
}

export function decryptData(encrypted: string, key: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

/**
 * Generate a cryptographically secure random password
 */
export function generatePassword(
  length: number = 16,
  includeNumbers: boolean = true,
  includeSymbols: boolean = true,
  excludeLookalikes: boolean = true
): string {
  let chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const allNumbers = '0123456789';
  const symbols = '!@#$%^&*-_=+';
  const lookalikes = 'il1Lo0O';

  if (includeNumbers) {
    chars += excludeLookalikes ? numbers : allNumbers;
  }
  if (includeSymbols) {
    chars += symbols;
  }
  if (!excludeLookalikes) {
    chars += lookalikes;
  }

  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  
  return password;
}
