'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Suspense } from 'react';

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const required = searchParams.get('required');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="text-yellow-500">
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            {error === 'not_in_group' && (
              <>You are not a member of any authorized AD groups.</>
            )}
            {error === 'access_denied' && (
              <>Your account does not have permission to access this application.</>
            )}
            {error === 'insufficient_permissions' && (
              <>
                You do not have the required permissions to access{' '}
                <span className="font-semibold">{required}</span>.
              </>
            )}
            {!error && (
              <>You do not have permission to access this resource.</>
            )}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p className="font-medium mb-2">What you can do:</p>
          <ul className="list-disc list-inside text-left space-y-1">
            <li>Contact your IT administrator to request access</li>
            <li>Verify you are using the correct Microsoft account</li>
            <li>Check if you have been added to the required AD group</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign in with a different account
          </button>
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

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <UnauthorizedContent />
    </Suspense>
  );
}
