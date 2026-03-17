import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { AuthButton } from '@/components/auth';
import { getSecurePageGroups } from '@/config/auth.config';

export default async function SecurePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const requiredGroups = getSecurePageGroups();
  const userGroupIds = session.user.groups || [];

  const hasAccess =
    requiredGroups.length === 0 ||
    requiredGroups.some((g) => userGroupIds.includes(g));

  if (!hasAccess) {
    redirect('/unauthorized?error=insufficient_permissions&required=/secure');
  }

  // Resolve the names of the groups that granted access
  const groupDetails = session.user.groupDetails || [];
  const matchingGroups =
    requiredGroups.length > 0
      ? groupDetails.filter((g) => requiredGroups.includes(g.id))
      : groupDetails;

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <ShieldIcon />
            <h1 className="text-3xl font-bold text-gray-900">Secure Area</h1>
          </div>
          <AuthButton />
        </header>

        {/* Access Badge */}
        <div className="mb-6 rounded-lg border border-green-300 bg-green-50 px-4 py-3 flex items-center gap-3">
          <span className="text-green-600">
            <CheckIcon />
          </span>
          <div>
            <p className="text-sm font-semibold text-green-900">Access Granted</p>
            <p className="text-sm text-green-800">
              You have the required permissions to view this page.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Authorized User Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Authorized User</h2>
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

          {/* Authorized Groups */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LockIcon />
              Authorized Via Groups
            </h2>
            {requiredGroups.length === 0 ? (
              <p className="text-sm text-gray-500">
                No specific groups required — all authenticated users have access.
              </p>
            ) : matchingGroups.length > 0 ? (
              <ul className="space-y-2">
                {matchingGroups.map((group) => (
                  <li
                    key={group.id}
                    className="flex flex-col rounded-md bg-indigo-50 px-3 py-2 border border-indigo-100"
                  >
                    <span className="font-semibold text-indigo-900 text-sm">{group.name}</span>
                    <span className="font-mono text-xs text-indigo-500">{group.id}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                Group details unavailable — authorized via group ID.
              </p>
            )}
          </div>
        </div>

        {/* Secure Content */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Confidential Content</h2>
          <div className="rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50 p-8 text-center">
            <ShieldIcon className="mx-auto mb-3 text-indigo-400 w-12 h-12" />
            <p className="text-indigo-700 font-medium">
              This content is visible only to members of authorized AD groups.
            </p>
            <p className="text-indigo-500 text-sm mt-1">
              Replace this section with your restricted application content.
            </p>
          </div>
        </div>

        {/* Required Groups Config Info */}
        {requiredGroups.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">Required Group IDs</h2>
            <p className="text-sm text-gray-500 mb-3">
              Configured via the <code className="bg-gray-100 px-1 rounded">SECURE_PAGE_AD_GROUPS</code> environment variable.
            </p>
            <div className="flex flex-wrap gap-2">
              {requiredGroups.map((id) => (
                <span
                  key={id}
                  className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-start">
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
