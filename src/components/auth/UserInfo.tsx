'use client';

import { useSession } from 'next-auth/react';

export function UserInfo() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
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
        
        <div>
          <label className="text-sm font-medium text-gray-500">AD Groups</label>
          {session.user.groupDetails && session.user.groupDetails.length > 0 ? (
            <ul className="mt-1 space-y-1">
              {session.user.groupDetails.map((group) => (
                <li key={group.id} className="flex flex-col text-sm">
                  <span className="font-medium text-gray-900">{group.name}</span>
                  <span className="font-mono text-xs text-gray-500">{group.id}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No groups found</p>
          )}
        </div>
      </div>
    </div>
  );
}
