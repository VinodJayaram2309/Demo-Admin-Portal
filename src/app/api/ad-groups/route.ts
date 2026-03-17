import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

interface GraphGroup {
  id: string;
  displayName: string;
  description?: string | null;
  mail?: string | null;
  groupTypes?: string[];
}

interface GraphGroupsResponse {
  '@odata.context': string;
  '@odata.nextLink'?: string;
  value: GraphGroup[];
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accessToken = session.user.accessToken;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'No access token available in session' },
      { status: 401 }
    );
  }

  try {
    const groups: GraphGroup[] = [];
    let nextLink: string | undefined =
      'https://graph.microsoft.com/v1.0/groups?$select=id,displayName,description,mail,groupTypes&$top=100';

    while (nextLink) {
      const response = await fetch(nextLink, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        // Revalidate on every request — do not cache the token-sensitive result
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Microsoft Graph API error:', response.status, errorBody);

        if (response.status === 403) {
          return NextResponse.json(
            {
              error: 'Insufficient permissions. Ensure the app has Group.Read.All permission.',
            },
            { status: 403 }
          );
        }

        return NextResponse.json(
          { error: `Graph API error: ${response.status}` },
          { status: response.status }
        );
      }

      const data: GraphGroupsResponse = await response.json();
      groups.push(...data.value);
      nextLink = data['@odata.nextLink'];
    }

    return NextResponse.json({ groups, total: groups.length });
  } catch (error) {
    console.error('Error fetching AD groups:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
