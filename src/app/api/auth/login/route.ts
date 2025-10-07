import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyPassword, createToken, verifyTOTPCode } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { email, password, totpCode } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Check if 2FA is enabled
    if (user.is2FAEnabled) {
      if (!totpCode) {
        return NextResponse.json({ message: '2FA code required', requires2FA: true }, { status: 401 });
      }

      if (!user.totpSecret || !verifyTOTPCode(user.totpSecret, totpCode)) {
        return NextResponse.json({ message: 'Invalid 2FA code' }, { status: 401 });
      }
    }

    const token = createToken(user._id.toString(), email);
    const res = NextResponse.json({ message: 'ok' });
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (err) {
    console.error('Login error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
