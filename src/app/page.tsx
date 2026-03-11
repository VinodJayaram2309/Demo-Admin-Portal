import { AuthButton } from '@/components/auth';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-lg w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Next.js SSO App
          </h1>
          <p className="text-gray-600">
            Secure authentication with Microsoft Azure AD and group-based
            authorization.
          </p>
        </div>

        <div className="flex justify-center">
          <AuthButton />
        </div>

        <div className="text-sm text-gray-500">
          <p>Sign in with your Microsoft account to access the dashboard.</p>
          <p className="mt-2">
            Only users in authorized AD groups will be granted access.
          </p>
        </div>
      </div>
    </main>
  );
}
