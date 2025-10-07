import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { hashPassword, createToken } from '@/lib/auth';

/**
 * POST /api/register
 * Create a new user account
 * Body: { email: string, password: string }
 * Returns: JWT token in HTTP-only cookie
 */
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password with bcryptjs
    const hashedPassword = await hashPassword(password);

    // Create new user (2FA will be disabled by default)
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      is2FAEnabled: false,
      createdAt: new Date()
    });

    // Create JWT token
    const token = createToken(user._id.toString(), user.email);

    // Return success with token in HTTP-only cookie
    const response = NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email
        }
      },
      { status: 201 }
    );

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
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
