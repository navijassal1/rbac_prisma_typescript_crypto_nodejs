import type { GrantPermissionParams } from "../types/admin.permissions.types.js";
import type { serviceResponse } from "../types/common.types.js";
/**
 * @description Fetch all permissions available in the system
 * @returns {Promise<serviceResponse>} - Returns success status, message, and list of permissions
 */
export declare const listPermissionsService: () => Promise<serviceResponse>;
/**
 * @description Fetch all permissions assigned to a specific user
 * @param {number} targetUserId - User ID to fetch permissions for
 * @returns {Promise<serviceResponse>} - Success status, message, and list of user's permissions
 */
export declare const getUserPermissionsService: (targetUserId: number) => Promise<serviceResponse>;
/**
 * @description Grant a set of permissions to a specific user
 *              This function replaces existing permissions with the new set
 * @param {GrantPermissionParams} reqBody - Contains user ID and list of permission IDs to grant
 * @returns {Promise<serviceResponse>} - Success status and message
 */
export declare const grantPermissionsService: (reqBody: GrantPermissionParams) => Promise<serviceResponse>;
//# sourceMappingURL=admin.permissions.services.d.ts.map