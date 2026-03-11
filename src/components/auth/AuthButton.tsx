'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Signed in as {session.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('azure-ad', { callbackUrl: '/dashboard' })}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
    >
      <MicrosoftIcon />
      Sign in with Microsoft
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
