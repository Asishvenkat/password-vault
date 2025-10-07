import { NextResponse } from 'next/server';
import { getUserFromToken, generateTOTPSecret, generateQRCode } from '@/lib/auth';

/**
 * POST /api/2fa/setup
 * Generate TOTP secret and QR code for 2FA setup
 * Requires: Valid JWT token in cookie
 * Returns: { secret: string, qrCode: string (base64 image) }
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

    // Generate TOTP secret using speakeasy
    const { secret, otpauthUrl } = generateTOTPSecret(user.email);

    // Generate QR code using qrcode library
    const qrCodeDataURL = await generateQRCode(otpauthUrl);

    return NextResponse.json({
      message: '2FA setup initiated',
      secret: secret, // User can manually enter this in authenticator app as backup
      qrCode: qrCodeDataURL // Base64 encoded QR code image
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
