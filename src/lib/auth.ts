import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { DecodedToken } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in .env.local');
}

export async function hashPassword(password: string): Promise<string> {
  // Reduced salt rounds from 12 to 10 for faster hashing and verification
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function createToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (error) {
    return null;
  }
}

export async function getUserFromToken(): Promise<DecodedToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;
  return verifyToken(token);
}

// TOTP Functions
export function generateTOTPSecret(): { secret: string; otpauthUrl: string } {
  const secret = speakeasy.generateSecret({
    name: 'Password Vault',
    issuer: 'Password Vault App'
  });

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url!
  };
}

export function verifyTOTPCode(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow 2 time windows (30 seconds each)
  });
}

export async function generateQRCode(otpauthUrl: string): Promise<string> {
  try {
    const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);
    return qrCodeDataURL;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
}

