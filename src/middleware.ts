import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { AUTH_CONFIG, isMockAuthEnabled, getSecurePageGroups } from '@/config/auth.config';

export default withAuth(
  function middleware(req) {
    if (isMockAuthEnabled()) {
      return NextResponse.next();
    }

    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Check if there's an error in the token (e.g., not in allowed groups)
    if (token?.error === 'AccessDenied') {
      return NextResponse.redirect(
        new URL(`${AUTH_CONFIG.routes.unauthorized}?error=access_denied`, req.url)
      );
    }

    // Secure page: requires specific AD groups from SECURE_PAGE_AD_GROUPS env var
    if (pathname.startsWith('/secure')) {
      const requiredGroups = getSecurePageGroups();
      if (requiredGroups.length > 0) {
        const userGroupIds: string[] = (token?.groups as string[]) || [];
        const hasAccess = requiredGroups.some((g) => userGroupIds.includes(g));
        if (!hasAccess) {
          return NextResponse.redirect(
            new URL(
              `${AUTH_CONFIG.routes.unauthorized}?error=insufficient_permissions&required=/secure`,
              req.url
            )
          );
        }
      }
    }

    // Check route-specific group requirements from AUTH_CONFIG
    const protectedRoutes = AUTH_CONFIG.protectedRoutes;
    
    for (const [route, requiredGroups] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route) && requiredGroups.length > 0) {
        const userGroupIds: string[] = (token?.groups as string[]) || [];
        const hasRequiredGroup = requiredGroups.some((group: string) =>
          userGroupIds.includes(group)
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
      authorized: ({ token }) => isMockAuthEnabled() || !!token,
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
    '/secure/:path*',
    '/admin/:path*',
  ],
};
