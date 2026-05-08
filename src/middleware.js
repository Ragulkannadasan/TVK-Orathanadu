import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isPublicRoute = ['/', '/login'].includes(nextUrl.pathname);
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
    const role = req.auth.user.role;
    const pathname = nextUrl.pathname;

    // Strict Role-Based Protection
    if (pathname.startsWith('/dashboard/admin') && role !== 'Admin') {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
    if (pathname.startsWith('/dashboard/leader') && role !== 'Poruppalar') {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
    if (pathname.startsWith('/dashboard/voter') && role !== 'Voter') {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
  }

  return null;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
