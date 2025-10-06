import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getUserFromToken, verifyTOTPCode } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { totpCode, action } = body; // action: 'enable' or 'disable'

    if (!totpCode) {
      return NextResponse.json({ message: 'TOTP code required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const users = db.collection('users');

    const userDoc = await users.findOne({ _id: new ObjectId(user.userId) });
    if (!userDoc) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!userDoc.totpSecret) {
      return NextResponse.json({ message: 'TOTP not set up' }, { status: 400 });
    }

    // Verify the TOTP code
    if (!verifyTOTPCode(userDoc.totpSecret, totpCode)) {
      return NextResponse.json({ message: 'Invalid TOTP code' }, { status: 401 });
    }

    // Update 2FA status
    const updateData = action === 'enable'
      ? { is2FAEnabled: true }
      : { is2FAEnabled: false };

    await users.updateOne(
      { _id: new ObjectId(user.userId) },
      { $set: updateData }
    );

    return NextResponse.json({
      message: `2FA ${action}d successfully`,
      is2FAEnabled: action === 'enable'
    });
  } catch (err) {
    console.error('2FA setup error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
