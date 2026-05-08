/**
 * middleware.js
 * Route protection using NextAuth session.
 * - /dashboard → any authenticated user
 * - /profile-setup → authenticated, profile not complete
 * - /poruppalar → role: Poruppalar or Admin
 * - /admin → role: Admin only
 */

import { auth } from '@/auth';

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;
  const profileComplete = session?.user?.profileComplete;

  const isAuthPage = nextUrl.pathname.startsWith('/login') ||
    nextUrl.pathname.startsWith('/verify-request');
  const isProtected = nextUrl.pathname.startsWith('/dashboard') || 
                      nextUrl.pathname.startsWith('/profile-setup') || 
                      nextUrl.pathname.startsWith('/poruppalar') || 
                      nextUrl.pathname.startsWith('/admin');

  // 1. Redirect authenticated users away from login
  if (isLoggedIn && isAuthPage) {
    const target = profileComplete ? '/dashboard' : '/profile-setup';
    return Response.redirect(new URL(target, req.url));
  }

  // 2. Protected routes - must be logged in
  if (!isLoggedIn && isProtected) {
    return Response.redirect(new URL('/login', req.url));
  }

  // 3. Profile must be complete to access dashboard/portals
  if (isLoggedIn && !profileComplete && nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/profile-setup', req.url));
  }

  // 4. Role-based access
  if (isLoggedIn) {
    if (nextUrl.pathname.startsWith('/poruppalar') && role !== 'Poruppalar' && role !== 'Admin') {
      return Response.redirect(new URL('/dashboard', req.url));
    }
    if (nextUrl.pathname.startsWith('/admin') && role !== 'Admin') {
      return Response.redirect(new URL('/dashboard', req.url));
    }
  }

  return null; // Equivalent to NextResponse.next()
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile-setup/:path*',
    '/poruppalar/:path*',
    '/admin/:path*',
    '/login',
    '/verify-request',
  ],
};
