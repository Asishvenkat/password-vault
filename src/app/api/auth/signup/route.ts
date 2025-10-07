import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { hashPassword, createToken, generateTOTPSecret, generateQRCode } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashed = await hashPassword(password);

    // Generate TOTP secret for 2FA
    const { secret, otpauthUrl } = generateTOTPSecret();
    const qrCode = await generateQRCode(otpauthUrl);

    const user = await User.create({
      email,
      password: hashed,
      totpSecret: secret,
      is2FAEnabled: false, // Will be enabled after verification
      createdAt: new Date()
    });

    const token = createToken(user._id.toString(), email);

    const res = NextResponse.json({
      message: 'ok',
      totpSetup: {
        qrCode,
        secret: secret // For backup/manual entry
      }
    }, { status: 201 });
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (err) {
    console.error('Signup error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
