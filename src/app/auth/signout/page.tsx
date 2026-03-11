'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function SignOutPage() {
  useEffect(() => {
    // Auto sign out after a short delay
    const timer = setTimeout(() => {
      signOut({ callbackUrl: '/' });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Signing Out...
          </h1>
          <p className="text-gray-600">
            You are being signed out. Please wait...
          </p>
        </div>

        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Sign out now
        </button>
      </div>
    </main>
  );
}
