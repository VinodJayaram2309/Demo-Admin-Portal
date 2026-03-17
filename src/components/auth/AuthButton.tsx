'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export function AuthButton() {
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        <span className="text-sm text-gray-500">Loading&hellip;</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {session.user?.email}
        </span>
        <button
          onClick={async () => {
            setIsSigningOut(true);
            await signOut({ callbackUrl: '/' });
          }}
          disabled={isSigningOut}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isSigningOut ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing out&hellip;
            </>
          ) : (
            'Sign Out'
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={async () => {
        setIsSigningIn(true);
        await signIn('azure-ad', { callbackUrl: '/dashboard' });
        setIsSigningIn(false);
      }}
      disabled={isSigningIn}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
    >
      {isSigningIn ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Connecting&hellip;
        </>
      ) : (
        <>
          <MicrosoftIcon />
          Sign in with Microsoft
        </>
      )}
    </button>
  );
}

function MicrosoftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
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
