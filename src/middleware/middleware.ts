import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('🔍 Middleware running for:', req.nextUrl.pathname);
  console.log('🍪 All cookies:', req.cookies.getAll());
  
  const token = req.cookies.get('authToken')?.value;
  console.log('🔑 Auth token found:', !!token);
  console.log('🔑 Token value:', token ? 'exists' : 'missing');

  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard');
  console.log('🛡️ Is protected route:', isProtectedRoute);

  if (isProtectedRoute && !token) {
    console.log('❌ Redirecting to login - no token found');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  console.log('✅ Allowing access to:', req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // protects all /dashboard routes
};