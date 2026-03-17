'use client';

import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function SignOutPage() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          signOut({ callbackUrl: '/' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      {/* Full-page overlay */}
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm px-4">
          {/* Spinner */}
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-red-400 border-t-transparent"></div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Signing Out</h1>
            <p className="text-gray-500">
              You will be signed out in{' '}
              <span className="font-semibold text-red-500">{countdown}</span> second
              {countdown !== 1 ? 's' : ''}…
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Sign Out Now
          </button>
        </div>
      </div>
    </main>
  );
}
