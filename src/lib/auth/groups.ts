/**
 * AD Group utilities for fetching and validating user group memberships
 */

interface GraphGroup {
  id: string;
  displayName: string;
}

interface GraphGroupsResponse {
  '@odata.context': string;
  '@odata.nextLink'?: string;
  value: GraphGroup[];
}

export interface GroupDetail {
  id: string;
  name: string;
}

/**
 * Fetch user's group memberships from Microsoft Graph API
 * @param accessToken - The user's access token
 * @returns Array of GroupDetail objects (id + name) the user belongs to
 */
export async function fetchUserGroups(accessToken: string): Promise<GroupDetail[]> {
  try {
    const groups: GroupDetail[] = [];
    let nextLink: string | undefined = 'https://graph.microsoft.com/v1.0/me/memberOf?$select=id,displayName';

    while (nextLink) {
      const response = await fetch(nextLink, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to fetch user groups:', error);
        return [];
      }

      const data: GraphGroupsResponse = await response.json();

      // Extract group ID and display name
      groups.push(
        ...data.value.map((group) => ({ id: group.id, name: group.displayName }))
      );

      // Check for pagination
      nextLink = data['@odata.nextLink'];
    }

    return groups;
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return [];
  }
}

/**
 * Check if user belongs to any of the allowed groups
 * @param userGroups - Array of group IDs the user belongs to
 * @param allowedGroups - Array of allowed group IDs
/**
 * Check if user belongs to any of the allowed groups
 * @param userGroups - Array of GroupDetail objects the user belongs to
 * @param allowedGroups - Array of allowed group IDs
 * @returns Boolean indicating if user has access
 */
export function isUserInAllowedGroups(
  userGroups: GroupDetail[],
  allowedGroups: string[]
): boolean {
  // If no allowed groups are configured, allow all authenticated users
  if (allowedGroups.length === 0) {
    return true;
  }

  // Check if user belongs to at least one allowed group
  return userGroups.some((group) => allowedGroups.includes(group.id));
}

/**
 * Check if user belongs to a specific group
 * @param userGroups - Array of GroupDetail objects the user belongs to
 * @param groupId - The group ID to check
 * @returns Boolean indicating if user is in the group
 */
export function isUserInGroup(userGroups: GroupDetail[], groupId: string): boolean {
  return userGroups.some((group) => group.id === groupId);
}

/**
 * Check if user belongs to all specified groups
 * @param userGroups - Array of GroupDetail objects the user belongs to
 * @param requiredGroups - Array of required group IDs
 * @returns Boolean indicating if user is in all required groups
 */
export function isUserInAllGroups(
  userGroups: GroupDetail[],
  requiredGroups: string[]
): boolean {
  return requiredGroups.every((reqId) => userGroups.some((g) => g.id === reqId));
}

/**
 * Get the intersection of user groups and specified groups
 * @param userGroups - Array of GroupDetail objects the user belongs to
 * @param targetGroups - Array of target group IDs
 * @returns Array of matching GroupDetail objects
 */
export function getMatchingGroups(
  userGroups: GroupDetail[],
  targetGroups: string[]
): GroupDetail[] {
  return userGroups.filter((group) => targetGroups.includes(group.id));
}
