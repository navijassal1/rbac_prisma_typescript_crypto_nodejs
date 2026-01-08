import { listPermissionsService, grantPermissionsService, getUserPermissionsService } from "../services/admin.permissions.services.js";
import { response } from "../helpers/helper.js";
import { STATUS } from "../enums/enums.js";
/**
 * @description Middleware to fetch all permissions in the system
 * @route GET /permissions
 * @access Protected (requires tokenUser)
 */
export const getPermissions = async (req, res, next) => {
    try {
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
 * @description Middleware to fetch permissions assigned to a specific user
 * @route GET /users/:userId/permissions
 * @access Protected (requires targetUserId param)
 */
export const getUserPermissions = async (req, res, next) => {
    try {
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
 * @description Middleware to grant permissions to a specific user
 *              Replaces existing permissions with the new set
 * @route POST /users/:userId/permissions
 * @access Protected (requires tokenUser)
 * @body { GrantPermissionParams } - Contains user_id and permission_ids
 */
export const grantPermissions = async (req, res, next) => {
    try {
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
//# sourceMappingURL=admin.permissions.controller.js.map