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
import { listPermissionsService, grantPermissionsService, getUserPermissionsService, listUsersService, listRolesService, fetchUsersWithRolesService, grantRolesService } from "../services/admin-permissions.services.js";
// --------------------------------------------------
// Helpers & Enums
// --------------------------------------------------
import { response } from "../helpers/helper.js";
import { STATUS } from "../enums/enums.js";
import { errorHandler } from "../middlewares/error.handler.js";
// --------------------------------------------------
// Controllers
// --------------------------------------------------
/**
 * @description Fetch all users in the system
 * @route       GET /list-users
 * @access      Protected / Admin
 */
export const listUsers = async (req, res) => {
    try {
        const param = String(req.params.role);
        const reqQuery = {
            page: req.query.page ? parseInt(req.query.page, 10) : 1,
            sort_by: req.query.sort_by || 'id',
            sort_order: (req.query.sort_order?.toLowerCase() == 'desc' ? 'desc' : 'asc'),
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 10,
            search: req.query.search || ''
        };
        const result = await listUsersService(reqQuery);
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        return errorHandler(e, res);
    }
};
/**
 * @description Fetch all permissions available in the system
 * @route       GET /list-permissions
 * @access      Protected / Admin
 */
export const listPermissions = async (req, res) => {
    try {
        const result = await listPermissionsService();
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        return errorHandler(e, res);
    }
};
/**
 * @description Fetch all roles defined in the system
 * @route       GET /list-roles
 * @access      Protected / Admin
 */
export const listRoles = async (req, res) => {
    try {
        const result = await listRolesService();
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        return errorHandler(e, res);
    }
};
/**
 * @description Fetch permissions assigned to a specific user
 * @route       GET /users/:userId/permissions
 * @access      Protected / Admin
 * @requires    req.targetUserId (attached by middleware)
 */
export const getUserPermissions = async (req, res) => {
    try {
        const targetUserId = req.targetUserId;
        const result = await getUserPermissionsService(targetUserId);
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        return errorHandler(e, res);
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
export const grantPermissions = async (req, res) => {
    try {
        const reqBody = req.body;
        console.log(reqBody, 'req body');
        const result = await grantPermissionsService(reqBody);
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        return errorHandler(e, res);
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
export const grantRoles = async (req, res) => {
    try {
        const reqBody = req.body;
        const result = await grantRolesService(reqBody);
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        return errorHandler(e, res);
    }
};
/**
 * @description Fetch all roles defined in the system
 * @route       GET /list-roles
 * @access      Protected / Admin
 */
export const fetchUsersWithRoles = async (req, res) => {
    try {
        const param = String(req.params.role);
        const reqQuery = {
            page: req.query.page ? parseInt(req.query.page, 10) : 1,
            sort_by: req.query.sort_by || 'id',
            sort_order: (req.query.sort_order?.toLowerCase() == 'desc' ? 'desc' : 'asc'),
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 10,
            search: req.query.search || '',
        };
        const result = await fetchUsersWithRolesService(param, reqQuery);
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        return errorHandler(e, res);
    }
};
//# sourceMappingURL=admin-permissions.controller.js.map