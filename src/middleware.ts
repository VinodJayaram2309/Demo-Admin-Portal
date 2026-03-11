import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { AUTH_CONFIG } from '@/config/auth.config';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Check if there's an error in the token (e.g., not in allowed groups)
    if (token?.error === 'AccessDenied') {
      return NextResponse.redirect(
        new URL(`${AUTH_CONFIG.routes.unauthorized}?error=access_denied`, req.url)
      );
    }

    // Check route-specific group requirements
    const protectedRoutes = AUTH_CONFIG.protectedRoutes;
    
    for (const [route, requiredGroups] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route) && requiredGroups.length > 0) {
        const userGroups = token?.groups || [];
        const hasRequiredGroup = requiredGroups.some((group: string) =>
          userGroups.includes(group)
        );

        if (!hasRequiredGroup) {
          return NextResponse.redirect(
            new URL(
              `${AUTH_CONFIG.routes.unauthorized}?error=insufficient_permissions&required=${route}`,
              req.url
            )
          );
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth.js authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     * - public pages (/, /unauthorized, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|unauthorized|auth).*)',
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
