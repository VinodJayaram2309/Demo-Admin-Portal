import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

export interface GroupDetail {
  id: string;
  name: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      groups: string[];
      groupDetails: GroupDetail[];
      accessToken?: string;
    } & DefaultSession['user'];
    error?: string;
  }

  interface User extends DefaultUser {
    groups?: string[];
    groupDetails?: GroupDetail[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    groups?: string[];
    groupDetails?: GroupDetail[];
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
