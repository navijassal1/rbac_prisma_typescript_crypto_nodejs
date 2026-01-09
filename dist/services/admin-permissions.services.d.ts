/**
 * Admin Permission & Role Services
 * --------------------------------------------------
 * This file contains service-layer functions responsible for:
 * - Fetching users, roles, and permissions
 * - Assigning permissions directly to users
 * - Assigning roles to users and synchronizing permissions
 *
 * All database interactions are handled via Prisma.
 */
import type { GrantPermissionParams, GrantRolesParams } from "../types/admin-permissions.types.js";
import type { serviceResponse } from "../types/common.types.js";
/**
 * @description Fetch all users from the database
 *              Includes basic user info and assigned role names
 * @returns {Promise<serviceResponse>}
 */
export declare const listUsersService: () => Promise<serviceResponse>;
/**
 * @description Fetch all permissions available in the system
 * @returns {Promise<serviceResponse>}
 *          Always returns success with an array (may be empty)
 */
export declare const listPermissionsService: () => Promise<serviceResponse>;
/**
 * @description Fetch all Roles from the database
 * @returns {Promise<serviceResponse>}
 */
export declare const listRolesService: () => Promise<serviceResponse>;
/**
 * @description Fetch all permissions assigned to a specific user
 * @param {number} targetUserId - User ID to fetch permissions for
 * @returns {Promise<serviceResponse>}
 */
export declare const getUserPermissionsService: (targetUserId: number) => Promise<serviceResponse>;
/**
 * @description Grant a set of permissions to a specific user
 *              Existing permissions are replaced with the new set
 * @param {GrantPermissionParams} reqBody
 * @returns {Promise<serviceResponse>}
 */
export declare const grantPermissionsService: (reqBody: GrantPermissionParams) => Promise<serviceResponse>;
/**
 * @description Grant roles to a specific user
 *              This operation also synchronizes permissions
 *              derived from the assigned roles
 * @param {GrantRolesParams} reqBody
 * @returns {Promise<serviceResponse>}
 */
export declare const grantRolesService: (reqBody: GrantRolesParams) => Promise<serviceResponse>;
//# sourceMappingURL=admin-permissions.services.d.ts.map