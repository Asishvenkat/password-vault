import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getUserFromToken, verifyTOTPCode, generateTOTPSecret, generateQRCode } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();
    const { totpCode, action, secret } = body; // action: 'setup', 'confirm', 'enable', 'disable'

    const userDoc = await User.findById(user.userId);
    if (!userDoc) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (action === 'setup') {
      // Generate new TOTP secret and QR code
      const { secret: newSecret, otpauthUrl } = generateTOTPSecret();
      const qrCode = await generateQRCode(otpauthUrl);

      return NextResponse.json({
        message: 'TOTP setup initiated',
        secret: newSecret,
        qrCode
      });
    }

    if (action === 'confirm') {
      if (!totpCode || !secret) {
        return NextResponse.json({ message: 'TOTP code and secret required' }, { status: 400 });
      }

      // Verify the TOTP code with the provided secret
      if (!verifyTOTPCode(secret, totpCode)) {
        return NextResponse.json({ message: 'Invalid TOTP code' }, { status: 401 });
      }

      // Save secret and enable 2FA
      userDoc.totpSecret = secret;
      userDoc.is2FAEnabled = true;
      await userDoc.save();

      return NextResponse.json({
        message: '2FA enabled successfully',
        is2FAEnabled: true
      });
    }

    if (action === 'enable' || action === 'disable') {
      if (!totpCode) {
        return NextResponse.json({ message: 'TOTP code required' }, { status: 400 });
      }

      if (!userDoc.totpSecret) {
        return NextResponse.json({ message: 'TOTP not set up' }, { status: 400 });
      }

      // Verify the TOTP code
      if (!verifyTOTPCode(userDoc.totpSecret, totpCode)) {
        return NextResponse.json({ message: 'Invalid TOTP code' }, { status: 401 });
      }

      // Update 2FA status
      userDoc.is2FAEnabled = action === 'enable';
      await userDoc.save();

      return NextResponse.json({
        message: `2FA ${action}d successfully`,
        is2FAEnabled: action === 'enable'
      });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('2FA error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
