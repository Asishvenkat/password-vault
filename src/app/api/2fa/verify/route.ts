import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getUserFromToken, verifyTOTPCode } from '@/lib/auth';

/**
 * POST /api/2fa/verify
 * Verify 6-digit TOTP code and enable 2FA
 * Body: { totpCode: string, secret: string }
 * Requires: Valid JWT token in cookie
 * Returns: Success message with 2FA enabled status
 */
export async function POST(req: Request) {
  try {
    // Verify user is authenticated via JWT token
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const { totpCode, secret } = body;

    // Validate input
    if (!totpCode || !secret) {
      return NextResponse.json(
        { message: 'TOTP code and secret are required' },
        { status: 400 }
      );
    }

    // Verify the 6-digit TOTP code using speakeasy
    const isValid = verifyTOTPCode(secret, totpCode);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid TOTP code - Please try again' },
        { status: 401 }
      );
    }

    // Find user in database
    const userDoc = await User.findById(user.userId);
    if (!userDoc) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Save the TOTP secret and enable 2FA
    userDoc.twoFASecret = secret;
    userDoc.is2FAEnabled = true;
    await userDoc.save();

    return NextResponse.json({
      message: '2FA enabled successfully',
      is2FAEnabled: true
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
