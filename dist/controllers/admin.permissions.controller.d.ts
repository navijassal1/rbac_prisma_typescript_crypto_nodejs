import type { ExpressMiddlewareParams } from "../types/common.types.js";
/**
 * @description Middleware to fetch all permissions in the system
 * @route GET /permissions
 * @access Protected (requires tokenUser)
 */
export declare const getPermissions: ExpressMiddlewareParams;
/**
 * @description Middleware to fetch permissions assigned to a specific user
 * @route GET /users/:userId/permissions
 * @access Protected (requires targetUserId param)
 */
export declare const getUserPermissions: ExpressMiddlewareParams;
/**
 * @description Middleware to grant permissions to a specific user
 *              Replaces existing permissions with the new set
 * @route POST /users/:userId/permissions
 * @access Protected (requires tokenUser)
 * @body { GrantPermissionParams } - Contains user_id and permission_ids
 */
export declare const grantPermissions: ExpressMiddlewareParams;
//# sourceMappingURL=admin.permissions.controller.d.ts.map