import { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { AUTH_CONFIG } from '@/config/auth.config';
import { fetchUserGroups } from '@/lib/auth/groups';

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope: 'openid profile email User.Read GroupMember.Read.All',
        },
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: AUTH_CONFIG.session.maxAge,
    updateAge: AUTH_CONFIG.session.updateAge,
  },

  pages: {
    signIn: AUTH_CONFIG.routes.signIn,
    signOut: AUTH_CONFIG.routes.signOut,
    error: AUTH_CONFIG.routes.error,
  },

  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        // Fetch user's group memberships (id + name) from Microsoft Graph API
        const groupDetails = await fetchUserGroups(account.access_token!);
        const groups = groupDetails.map((g) => g.id);

        return {
          ...token,
          id: user.id,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at! * 1000,
          groups,
          groupDetails,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires || 0)) {
        return token;
      }

      // Access token has expired, try to refresh it
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token.error) {
        session.error = token.error;
      }

      session.user = {
        ...session.user,
        id: token.id || token.sub || '',
        groups: token.groups || [],
        groupDetails: token.groupDetails || [],
        accessToken: token.accessToken,
      };

      return session;
    },

    async signIn({ account }) {
      if (!account) {
        return false;
      }
      return true;
    },
  },

  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token.email}`);
    },
  },

  debug: process.env.NODE_ENV === 'development',
};

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(token: any): Promise<any> {
  try {
    const url = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
        scope: 'openid profile email User.Read GroupMember.Read.All',
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    // Fetch updated groups
    const groups = await fetchUserGroups(refreshedTokens.access_token);

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      groups,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
