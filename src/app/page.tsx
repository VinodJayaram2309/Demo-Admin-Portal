import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AuthButton } from '@/components/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-lg w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Admin App
          </h1>
        </div>

        <div className="flex justify-center">
          <AuthButton />
        </div>

        <div className="text-sm text-gray-500">
          <p>Sign in with your Microsoft account to access the portal.</p>
        </div>
      </div>
    </main>
  );
}
