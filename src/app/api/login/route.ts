import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyPassword, createToken, verifyTOTPCode } from '@/lib/auth';

/**
 * POST /api/login
 * Authenticate user and return JWT token
 * Body: { email: string, password: string, totpCode?: string }
 * Returns: JWT token in HTTP-only cookie, or requires2FA flag if 2FA is enabled
 */
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { email, password, totpCode } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password with bcryptjs
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if 2FA is enabled for this user
    if (user.is2FAEnabled) {
      // If the secret is missing due to earlier bug, allow login and let user re-setup 2FA
      if (!user.totpSecret) {
        console.warn('User has 2FA enabled but no totpSecret set. Allowing login so they can reconfigure 2FA.', { userId: user._id.toString(), email: user.email });
      } else {
        // If 2FA is enabled but no TOTP code provided, request it
        if (!totpCode) {
          return NextResponse.json(
            {
              message: '2FA code required',
              requires2FA: true
            },
            { status: 401 }
          );
        }

        // Verify TOTP code using speakeasy
        if (!verifyTOTPCode(user.totpSecret, totpCode)) {
          return NextResponse.json(
            { message: 'Invalid 2FA code' },
            { status: 401 }
          );
        }
      }
    }

    // Create JWT token with jsonwebtoken
    const token = createToken(user._id.toString(), user.email);

    // Return success with token in HTTP-only cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        is2FAEnabled: user.is2FAEnabled
      }
    });

    // Set HTTP-only cookie with JWT token (7 days expiry)
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
