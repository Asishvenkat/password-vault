import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const res = NextResponse.json({ message: 'ok' });
  res.cookies.set('token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
