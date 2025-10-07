import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getUserFromToken, verifyTOTPCode } from '@/lib/auth';

/**
 * POST /api/2fa/disable
 * Disable 2FA after verification
 * Body: { totpCode: string }
 * Requires: Valid JWT token in cookie
 * Returns: Success message with 2FA disabled status
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
    const { totpCode } = body;

    // Validate input
    if (!totpCode) {
      return NextResponse.json(
        { message: 'TOTP code is required' },
        { status: 400 }
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

    // Check if 2FA is enabled
    if (!userDoc.is2FAEnabled || !userDoc.twoFASecret) {
      return NextResponse.json(
        { message: '2FA is not enabled for this account' },
        { status: 400 }
      );
    }

    // Verify the 6-digit TOTP code using speakeasy
    const isValid = verifyTOTPCode(userDoc.twoFASecret, totpCode);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid TOTP code - Please try again' },
        { status: 401 }
      );
    }

    // Disable 2FA (keep the secret for potential re-enabling)
    userDoc.is2FAEnabled = false;
    await userDoc.save();

    return NextResponse.json({
      message: '2FA disabled successfully',
      is2FAEnabled: false
    });
  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
