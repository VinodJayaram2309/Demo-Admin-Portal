'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn('azure-ad', { callbackUrl });
    // Note: page will redirect, but reset in case of error
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      {/* Full-page overlay when loading */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-blue-100"></div>
              <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
            <p className="text-gray-700 font-medium">Redirecting to Microsoft&hellip;</p>
            <p className="text-gray-400 text-sm">Please wait while we connect you securely.</p>
          </div>
        </div>
      )}

      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In</h1>
          <p className="text-gray-600">
            Sign in with your Microsoft account to continue.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
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
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Connecting&hellip;
            </>
          ) : (
            <>
              <MicrosoftIcon />
              Continue with Microsoft
            </>
          )}
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
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-500 text-sm">Loading&hellip;</p>
        </div>
      </div>
    }>
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
