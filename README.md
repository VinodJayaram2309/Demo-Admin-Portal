# Next.js SSO App with Microsoft Azure AD

A Next.js application with Microsoft Azure AD single sign-on (SSO) authentication using NextAuth.js, featuring AD group-based authorization.

## Features

- Microsoft Azure AD SSO authentication
- AD group-based access control
- Protected routes with middleware
- Token refresh handling
- Clean architecture with TypeScript

## Prerequisites

- Node.js 18+ 
- Azure AD tenant with app registration
- Users assigned to AD groups for authorization

## Azure AD Setup

### 1. Register an Application in Azure AD

1. Go to [Azure Portal](https://portal.azure.com) > Azure Active Directory > App registrations
2. Click "New registration"
3. Enter a name for your application
4. Select "Accounts in this organizational directory only"
5. Set Redirect URI to: `http://localhost:3000/api/auth/callback/azure-ad`
6. Click "Register"

### 2. Configure Authentication

1. Go to "Authentication" in your app registration
2. Under "Implicit grant and hybrid flows", check:
   - Access tokens
   - ID tokens
3. Save changes

### 3. Create Client Secret

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Add a description and expiration
4. Copy the secret value (you won't see it again)

### 4. Configure API Permissions

1. Go to "API permissions"
2. Add the following Microsoft Graph permissions:
   - `User.Read` (Delegated)
   - `GroupMember.Read.All` (Delegated) - Required for reading group memberships
3. Grant admin consent for your organization

### 5. Get Required Values

From your app registration, note:
- **Application (client) ID** - Your `AZURE_AD_CLIENT_ID`
- **Directory (tenant) ID** - Your `AZURE_AD_TENANT_ID`
- **Client Secret** - Your `AZURE_AD_CLIENT_SECRET`

### 6. Find AD Group IDs

1. Go to Azure Active Directory > Groups
2. Select the groups you want to authorize
3. Copy the Object ID for each group
4. These will be your `ALLOWED_AD_GROUPS`

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

## Configuration

Edit `.env.local` with your Azure AD credentials:

```env
# Azure AD Configuration
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Allowed AD Groups (comma-separated group Object IDs)
ALLOWED_AD_GROUPS=group-id-1,group-id-2

# Development only: bypass real Azure AD auth and use a mock dashboard session
MOCK_AUTH=false
```

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

## Running the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Development Mock Authentication

For local UI development, you can bypass real authentication and open protected pages like `/dashboard`.

1. Set `MOCK_AUTH=true` in `.env.local`
2. Start the app with `npm run dev`
3. Open `/dashboard`

Notes:
- Mock auth is only active when `NODE_ENV=development`
- Do not enable this in production environments

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/auth/          # NextAuth.js API routes
│   ├── auth/              # Auth pages (signin, signout, error)
│   ├── dashboard/         # Protected dashboard page
│   ├── unauthorized/      # Access denied page
│   ├── layout.tsx         # Root layout with SessionProvider
│   └── page.tsx           # Home page
├── components/
│   ├── auth/              # Auth-related components
│   └── providers/         # Context providers
├── config/
│   └── auth.config.ts     # Auth configuration constants
├── lib/
│   └── auth/              # Auth utilities
│       ├── auth-options.ts # NextAuth configuration
│       ├── groups.ts      # AD group validation utilities
│       └── index.ts       # Exports
├── types/
│   └── next-auth.d.ts     # NextAuth type augmentation
└── middleware.ts          # Route protection middleware
```

## Configuring Protected Routes

Edit `src/config/auth.config.ts` to configure route-specific group requirements:

```typescript
export const AUTH_CONFIG = {
  // ...
  protectedRoutes: {
    '/dashboard': [], // Any authenticated user
    '/admin': ['admin-group-id'], // Specific group required
    '/reports': ['reports-group-id', 'admin-group-id'], // Multiple groups (OR)
  },
};
```

## Usage

### Client-side: Check Groups

```tsx
'use client';
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session } = useSession();
  
  const isAdmin = session?.user?.groups?.includes('admin-group-id');
  
  return isAdmin ? <AdminPanel /> : <UserPanel />;
}
```

### Server-side: Check Groups

```tsx
import { getServerSession } from 'next-auth';
import { authOptions, isUserInGroup } from '@/lib/auth';

export default async function Page() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/');
  }
  
  const isAdmin = isUserInGroup(session.user.groups, 'admin-group-id');
  
  return <div>{isAdmin ? 'Admin' : 'User'}</div>;
}
```

## Troubleshooting

### Common Issues

1. **"Access Denied" error after sign-in**
   - Verify the user is a member of at least one allowed AD group
   - Check that `ALLOWED_AD_GROUPS` contains valid group Object IDs

2. **"GroupMember.Read.All" permission error**
   - Ensure admin consent has been granted for the API permissions
   - The permission may require admin approval

3. **Token refresh issues**
   - Check that your client secret hasn't expired
   - Verify the redirect URI matches exactly

## License

MIT
