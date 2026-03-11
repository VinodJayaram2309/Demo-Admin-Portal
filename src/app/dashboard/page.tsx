import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { UserInfo } from '@/components/auth';
import { AuthButton } from '@/components/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <AuthButton />
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <UserInfo />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                View Profile
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
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
