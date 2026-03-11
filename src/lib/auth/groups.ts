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

/**
 * Fetch user's group memberships from Microsoft Graph API
 * @param accessToken - The user's access token
 * @returns Array of group IDs the user belongs to
 */
export async function fetchUserGroups(accessToken: string): Promise<string[]> {
  try {
    const groups: string[] = [];
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

      // Extract group IDs
      groups.push(...data.value.map((group) => group.id));

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
 * @returns Boolean indicating if user has access
 */
export function isUserInAllowedGroups(
  userGroups: string[],
  allowedGroups: string[]
): boolean {
  // If no allowed groups are configured, allow all authenticated users
  if (allowedGroups.length === 0) {
    return true;
  }

  // Check if user belongs to at least one allowed group
  return userGroups.some((group) => allowedGroups.includes(group));
}

/**
 * Check if user belongs to a specific group
 * @param userGroups - Array of group IDs the user belongs to
 * @param groupId - The group ID to check
 * @returns Boolean indicating if user is in the group
 */
export function isUserInGroup(userGroups: string[], groupId: string): boolean {
  return userGroups.includes(groupId);
}

/**
 * Check if user belongs to all specified groups
 * @param userGroups - Array of group IDs the user belongs to
 * @param requiredGroups - Array of required group IDs
 * @returns Boolean indicating if user is in all required groups
 */
export function isUserInAllGroups(
  userGroups: string[],
  requiredGroups: string[]
): boolean {
  return requiredGroups.every((group) => userGroups.includes(group));
}

/**
 * Get the intersection of user groups and specified groups
 * @param userGroups - Array of group IDs the user belongs to
 * @param targetGroups - Array of target group IDs
 * @returns Array of matching group IDs
 */
export function getMatchingGroups(
  userGroups: string[],
  targetGroups: string[]
): string[] {
  return userGroups.filter((group) => targetGroups.includes(group));
}
