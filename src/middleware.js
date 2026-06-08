import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isPublicRoute = ['/', '/login', '/manifest.webmanifest', '/icon.png'].includes(nextUrl.pathname);
  const isAuthRoute = ['/login'].includes(nextUrl.pathname);

  if (isApiAuthRoute) return null;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/login', nextUrl));
  }

  if (isLoggedIn) {
    const pathname = nextUrl.pathname;

    // Redirect legacy routes to the SPA shell tabs
    if (pathname === '/chat') {
      return Response.redirect(new URL('/dashboard?tab=chat', nextUrl));
    }

    if (pathname.startsWith('/dashboard/') && pathname !== '/dashboard') {
      const parts = pathname.split('/').filter(Boolean);
      let tabId = parts[parts.length - 1];
      
      // Map legacy role dashboard paths back to main dashboard tab
      if (tabId === 'voter' || tabId === 'leader' || tabId === 'admin') {
        tabId = 'dashboard';
      }
      if (tabId === 'booth') {
        tabId = 'booth-grievances';
      }

      return Response.redirect(new URL(`/dashboard?tab=${tabId}`, nextUrl));
    }
  }

  return null;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|icon.png).*)"],
};
