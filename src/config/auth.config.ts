/**
 * Authentication configuration constants
 */

export const AUTH_CONFIG = {
  // Session configuration
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },

  // Routes configuration
  routes: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    unauthorized: '/unauthorized',
    home: '/',
    dashboard: '/dashboard',
  },

  // Public routes that don't require authentication
  publicRoutes: [
    '/',
    '/auth/signin',
    '/auth/signout',
    '/auth/error',
    '/unauthorized',
    '/api/auth',
  ],

  // Protected routes that require specific AD groups
  protectedRoutes: {
    '/dashboard': [] as string[], // Empty array means any authenticated user can access
    '/admin': ['admin-group-id'] as string[], // Specific group required
  } as Record<string, string[]>,
};

/**
 * Get allowed AD groups from environment variable
 */
export function getAllowedGroups(): string[] {
  const groups = process.env.ALLOWED_AD_GROUPS || '';
  return groups.split(',').filter((group) => group.trim() !== '');
}
