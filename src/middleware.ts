import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('gym_auth_token');
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // Skip middleware for API routes and static files
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (!token && !isLoginPage) {
    // Redirect to login if no token and trying to access protected route
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isLoginPage) {
    // Redirect to home if token exists and trying to access login page
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
