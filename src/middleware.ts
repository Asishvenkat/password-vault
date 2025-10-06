import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/';
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  // Redirect to dashboard if logged in and trying to access auth page
  // Previously we redirected authenticated users from '/' to '/dashboard'.
  // This caused immediate navigation to /dashboard before client state (sessionStorage) was available,
  // resulting in a blank page. Stop redirecting here and only protect the dashboard route when unauthenticated.

  // Redirect to login if not logged in and trying to access dashboard
  if (!token && isDashboard) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
