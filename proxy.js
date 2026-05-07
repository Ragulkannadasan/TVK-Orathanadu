/**
 * middleware.js
 * Route protection using NextAuth session.
 * - /dashboard → any authenticated user
 * - /profile-setup → authenticated, profile not complete
 * - /poruppalar → role: Poruppalar or Admin
 * - /admin → role: Admin only
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;
  const profileComplete = session?.user?.profileComplete;

  const isAuthPage = nextUrl.pathname.startsWith('/login') ||
    nextUrl.pathname.startsWith('/verify-request');
  const isDashboard = nextUrl.pathname.startsWith('/dashboard');
  const isProfileSetup = nextUrl.pathname.startsWith('/profile-setup');
  const isPoruppalar = nextUrl.pathname.startsWith('/poruppalar');
  const isAdmin = nextUrl.pathname.startsWith('/admin');

  // Redirect authenticated users away from login
  if (isLoggedIn && isAuthPage) {
    if (!profileComplete) return NextResponse.redirect(new URL('/profile-setup', req.url));
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Protected routes — must be logged in
  if (!isLoggedIn && (isDashboard || isProfileSetup || isPoruppalar || isAdmin)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Profile must be complete to access dashboard/portals
  if (isLoggedIn && !profileComplete && isDashboard) {
    return NextResponse.redirect(new URL('/profile-setup', req.url));
  }

  // Poruppalar portal — requires Poruppalar or Admin role
  if (isPoruppalar && role !== 'Poruppalar' && role !== 'Admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Admin portal — requires Admin role
  if (isAdmin && role !== 'Admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
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
