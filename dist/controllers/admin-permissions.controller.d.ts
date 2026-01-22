/**
 * Admin Permissions Controller
 * --------------------------------------------------
 * This file contains Express middleware functions
 * responsible for handling admin-level permission
 * and role management requests.
 *
 * Each controller:
 * - Validates required request context
 * - Calls the appropriate service
 * - Returns a standardized API response
 */
import type { ExpressMiddlewareParams } from "../types/common.types.js";
/**
 * @description Fetch all users in the system
 * @route       GET /list-users
 * @access      Protected / Admin
 */
export declare const listUsers: ExpressMiddlewareParams;
/**
 * @description Fetch all permissions available in the system
 * @route       GET /list-permissions
 * @access      Protected / Admin
 */
export declare const listPermissions: ExpressMiddlewareParams;
/**
 * @description Fetch all roles defined in the system
 * @route       GET /list-roles
 * @access      Protected / Admin
 */
export declare const listRoles: ExpressMiddlewareParams;
/**
 * @description Fetch permissions assigned to a specific user
 * @route       GET /users/:userId/permissions
 * @access      Protected / Admin
 * @requires    req.targetUserId (attached by middleware)
 */
export declare const getUserPermissions: ExpressMiddlewareParams;
/**
 * @description Grant permissions to a specific user
 *              Existing permissions are replaced
 * @route       PUT /permissions
 * @access      Protected / Admin
 * @body        GrantPermissionParams
 *              - user_id
 *              - permission_ids[]
 */
export declare const grantPermissions: ExpressMiddlewareParams;
/**
 * @description Grant roles to a specific user
 *              Existing roles are replaced
 * @route       PUT /roles
 * @access      Protected / Admin
 * @body        GrantRolesParams
 *              - user_id
 *              - role_ids[]
 */
export declare const grantRoles: ExpressMiddlewareParams;
/**
 * @description Fetch all roles defined in the system
 * @route       GET /list-roles
 * @access      Protected / Admin
 */
export declare const fetchUsersWithRoles: ExpressMiddlewareParams;
//# sourceMappingURL=admin-permissions.controller.d.ts.map