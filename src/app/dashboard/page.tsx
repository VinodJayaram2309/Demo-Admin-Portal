import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserInfo } from '@/components/auth';
import { AuthButton } from '@/components/auth';
import { FetchADGroupsButton } from '@/components/auth';
import { isMockAuthEnabled } from '@/config/auth.config';

export default async function DashboardPage() {
  const mockAuthEnabled = isMockAuthEnabled();
  const session = mockAuthEnabled ? getMockSession() : await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {!mockAuthEnabled && <AuthButton />}
        </header>

        {mockAuthEnabled && (
          <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
            Mock authentication is enabled for development (<code>MOCK_AUTH=true</code>).
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {mockAuthEnabled ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{session.user.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{session.user.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-gray-900 text-sm font-mono">{session.user.id || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : (
            <UserInfo />
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/secure"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <LockIcon />
                Go to Secure Page
              </Link>
              <FetchADGroupsButton />
            </div>
          </div>
        </div>

        {/* AD Groups Panel */}
        {!mockAuthEnabled && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your AD Groups</h2>
            <ADGroupsPanel session={session} />
          </div>
        )}

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Session Information</h2>
          <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
            <pre className="text-sm text-gray-700">
              {JSON.stringify(
                {
                  user: {
                    name: session.user.name,
                    email: session.user.email,
                    id: session.user.id,
                    groupCount: session.user.groups?.length || 0,
                  },
                  expires: session.expires,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}

function ADGroupsPanel({ session }: { session: Session }) {
  const groupDetails = session.user.groupDetails || [];
  const groups = session.user.groups || [];

  if (groupDetails.length === 0 && groups.length === 0) {
    return <p className="text-gray-500 text-sm">No AD groups found for your account.</p>;
  }

  // Use groupDetails if available, otherwise fall back to IDs only
  const displayGroups =
    groupDetails.length > 0
      ? groupDetails
      : groups.map((id) => ({ id, name: null as string | null }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 pr-4 font-medium text-gray-500">Group Name</th>
            <th className="text-left py-2 font-medium text-gray-500">Group ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {displayGroups.map((group) => (
            <tr key={group.id} className="hover:bg-gray-50">
              <td className="py-2 pr-4 font-medium text-gray-900">
                {group.name ?? <span className="text-gray-400 italic">Unknown</span>}
              </td>
              <td className="py-2 font-mono text-xs text-gray-500">{group.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function getMockSession(): Session {
  return {
    user: {
      id: 'dev-user-id',
      name: 'Development User',
      email: 'dev.user@local.test',
      groups: ['dev-group-id'],
      groupDetails: [{ id: 'dev-group-id', name: 'Development Group' }],
      accessToken: 'mock-access-token',
      image: null,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}
