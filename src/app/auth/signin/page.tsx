'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In</h1>
          <p className="text-gray-600">
            Sign in with your Microsoft account to continue.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error === 'OAuthSignin' && 'Error starting the sign-in process.'}
            {error === 'OAuthCallback' && 'Error during the sign-in callback.'}
            {error === 'OAuthCreateAccount' && 'Error creating account.'}
            {error === 'Callback' && 'Error in the callback handler.'}
            {error === 'AccessDenied' && 'Access denied. You may not have the required permissions.'}
            {error === 'Configuration' && 'Server configuration error.'}
            {!['OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'Callback', 'AccessDenied', 'Configuration'].includes(error) && 
              'An unexpected error occurred.'}
          </div>
        )}

        <button
          onClick={() => signIn('azure-ad', { callbackUrl })}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-3"
        >
          <MicrosoftIcon />
          Continue with Microsoft
        </button>

        <p className="text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}

function MicrosoftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 23 23"
    >
      <path fill="#f3f3f3" d="M0 0h23v23H0z" />
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H12z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  );
}
