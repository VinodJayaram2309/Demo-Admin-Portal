'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to access this resource.',
  Verification: 'The verification token has expired or has already been used.',
  OAuthSignin: 'Error occurred during OAuth sign-in.',
  OAuthCallback: 'Error occurred during OAuth callback.',
  OAuthCreateAccount: 'Could not create OAuth provider user in the database.',
  EmailCreateAccount: 'Could not create email provider user in the database.',
  Callback: 'Error in the authentication callback.',
  OAuthAccountNotLinked: 'This email is already linked to another account.',
  SessionRequired: 'Please sign in to access this page.',
  Default: 'An unexpected error occurred.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';

  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="text-red-500">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600">{errorMessage}</p>
          {error !== 'Default' && (
            <p className="text-sm text-gray-400 mt-2">Error code: {error}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/auth/signin"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
