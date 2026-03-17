'use client';

import { useState } from 'react';

interface ADGroup {
  id: string;
  displayName: string;
  description?: string | null;
  mail?: string | null;
  groupTypes?: string[];
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export function FetchADGroupsButton() {
  const [status, setStatus] = useState<Status>('idle');
  const [groups, setGroups] = useState<ADGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const fetchGroups = async () => {
    setStatus('loading');
    setError(null);
    setGroups([]);

    try {
      const res = await fetch('/api/ad-groups');
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch groups');
        setStatus('error');
        return;
      }

      setGroups(data.groups);
      setStatus('success');
      setIsOpen(true);
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  const filtered = groups.filter(
    (g) =>
      g.displayName.toLowerCase().includes(search.toLowerCase()) ||
      g.id.toLowerCase().includes(search.toLowerCase()) ||
      (g.mail ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <button
        onClick={fetchGroups}
        disabled={status === 'loading'}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm font-medium"
      >
        {status === 'loading' ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Fetching AD Groups&hellip;
          </>
        ) : (
          <>
            <GroupsIcon />
            Fetch All AD Groups
          </>
        )}
      </button>

      {status === 'error' && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === 'success' && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
            onClick={() => setIsOpen((v) => !v)}
          >
            <span className="text-sm font-semibold text-gray-700">
              {groups.length} AD Group{groups.length !== 1 ? 's' : ''} found
            </span>
            <ChevronIcon open={isOpen} />
          </div>

          {isOpen && (
            <>
              {/* Search */}
              <div className="px-3 py-2 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search by name, ID or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {/* Table */}
              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50 z-10">
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-500 whitespace-nowrap">
                        Display Name
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500 whitespace-nowrap">
                        Group ID
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500 whitespace-nowrap">
                        Mail
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500 whitespace-nowrap">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 px-3 text-center text-gray-400 text-sm">
                          No groups match your search.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((group) => (
                        <tr key={group.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3 font-medium text-gray-900 whitespace-nowrap">
                            {group.displayName}
                          </td>
                          <td className="py-2 px-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                            {group.id}
                          </td>
                          <td className="py-2 px-3 text-gray-600 text-xs whitespace-nowrap">
                            {group.mail ?? <span className="text-gray-300">—</span>}
                          </td>
                          <td className="py-2 px-3">
                            <GroupTypeBadge types={group.groupTypes} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {filtered.length > 0 && filtered.length < groups.length && (
                <p className="px-3 py-2 text-xs text-gray-400 border-t border-gray-100">
                  Showing {filtered.length} of {groups.length} groups
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function GroupTypeBadge({ types }: { types?: string[] }) {
  const isM365 = types?.includes('Unified');
  return (
    <span
      className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
        isM365
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-100 text-gray-600'
      }`}
    >
      {isM365 ? 'Microsoft 365' : 'Security'}
    </span>
  );
}

function GroupsIcon() {
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
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
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
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
