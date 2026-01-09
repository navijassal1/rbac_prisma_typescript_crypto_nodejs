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
// --------------------------------------------------
// Service Imports
// --------------------------------------------------
import { listPermissionsService, grantPermissionsService, getUserPermissionsService, listUsersService, listRolesService, grantRolesService } from "../services/admin-permissions.services.js";
// --------------------------------------------------
// Helpers & Enums
// --------------------------------------------------
import { response } from "../helpers/helper.js";
import { STATUS } from "../enums/enums.js";
// --------------------------------------------------
// Controllers
// --------------------------------------------------
/**
 * @description Fetch all users in the system
 * @route       GET /list-users
 * @access      Protected / Admin
 */
export const listUsers = async (req, res, next) => {
    try {
        const result = await listUsersService();
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Fetch all permissions available in the system
 * @route       GET /list-permissions
 * @access      Protected / Admin
 */
export const listPermissions = async (req, res, next) => {
    try {
        // Ensure authenticated user is attached by token middleware
        if (!req.tokenUser) {
            return response(res, STATUS.BAD_REQUEST, false, "Target user not set");
        }
        const targetUser = req.tokenUser;
        const result = await listPermissionsService();
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Fetch all roles defined in the system
 * @route       GET /list-roles
 * @access      Protected / Admin
 */
export const listRoles = async (req, res, next) => {
    try {
        const result = await listRolesService();
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Fetch permissions assigned to a specific user
 * @route       GET /users/:userId/permissions
 * @access      Protected / Admin
 * @requires    req.targetUserId (attached by middleware)
 */
export const getUserPermissions = async (req, res, next) => {
    try {
        // Ensure target user ID is attached by attachTargetUser middleware
        if (!req.targetUserId) {
            return response(res, STATUS.BAD_REQUEST, false, "Target user not set");
        }
        const targetUserId = req.targetUserId;
        const result = await getUserPermissionsService(targetUserId);
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Grant permissions to a specific user
 *              Existing permissions are replaced
 * @route       PUT /permissions
 * @access      Protected / Admin
 * @body        GrantPermissionParams
 *              - user_id
 *              - permission_ids[]
 */
export const grantPermissions = async (req, res, next) => {
    try {
        // Ensure authenticated user and request body exist
        if (!req.tokenUser || !req.body) {
            return response(res, STATUS.BAD_REQUEST, false, "Target user or request body not set");
        }
        const reqBody = req.body;
        const result = await grantPermissionsService(reqBody);
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Grant roles to a specific user
 *              Existing roles are replaced
 * @route       PUT /roles
 * @access      Protected / Admin
 * @body        GrantRolesParams
 *              - user_id
 *              - role_ids[]
 */
export const grantRoles = async (req, res, next) => {
    try {
        // Ensure authenticated user and request body exist
        if (!req.tokenUser || !req.body) {
            return response(res, STATUS.BAD_REQUEST, false, "Target user or request body not set");
        }
        const reqBody = req.body;
        const result = await grantRolesService(reqBody);
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
//# sourceMappingURL=admin-permissions.controller.js.map