/**
 * Admin Permission Routes
 * ---------------------------------------------------
 * This router handles all admin-level RBAC operations:
 * - Listing users, roles, and permissions
 * - Viewing user permissions
 * - Granting roles and permissions
 *
 * All routes are protected by JWT authentication
 * and role-based authorization (RBAC).
 */
// ---------------------------------------------------
// Imports
// ---------------------------------------------------
// Express router
import { Router } from "express";
// Controllers for admin permission management
import { listUsers, // Fetch all users
listPermissions, // Fetch all available permissions
listRoles, // Fetch all available roles
getUserPermissions, // Fetch permissions for a specific user
grantPermissions, // Assign permissions to a user
grantRoles // Assign roles to a user
 } from "../../controllers/admin.permissions.controller.js";
// JWT authentication middleware
import { verifyToken } from "../../middlewares/token.manager.js";
// RBAC enums
import { Resource, Action } from "../../enums/enums.js";
// Authorization middleware (RBAC enforcement)
import { authorize } from "../../middlewares/authorize.role.js";
// Validation and helper middlewares
import { adminPermissionValidation, // Validation rules for permission assignment
adminRolesValidation, // Validation rules for role assignment
attachTargetUser // Attaches target user to request object
 } from "../../validations/admin.permissions.validations.js";
// Middleware to handle validation result errors
import { validateResult } from "../../utils/validation.result.middleware.js";
// ---------------------------------------------------
// Router Initialization
// ---------------------------------------------------
const adminPermissionRouter = Router();
// ---------------------------------------------------
// Global Middleware
// ---------------------------------------------------
// All admin permission routes require a valid JWT
adminPermissionRouter.use(verifyToken);
// ---------------------------------------------------
// Routes
// ---------------------------------------------------
/**
 * @route   GET /list-users
 * @desc    List all users in the system
 * @access  Requires USER:READ permission
 */
adminPermissionRouter.get("/list-users", authorize([Resource.USER], [Action.READ]), listUsers);
/**
 * @route   GET /list-permissions
 * @desc    List all available permissions in the system
 * @access  Requires SYSTEM:READ permission
 */
adminPermissionRouter.get("/list-permissions", authorize([Resource.SYSTEM], [Action.READ]), listPermissions);
/**
 * @route   GET /list-roles
 * @desc    List all roles available in the system
 * @access  Requires SYSTEM:READ permission
 */
adminPermissionRouter.get("/list-roles", adminRolesValidation, // Validate request (if needed)
validateResult, // Handle validation errors
authorize([Resource.SYSTEM], [Action.READ]), listRoles);
/**
 * @route   GET /users/:user_id/permissions
 * @desc    Get permissions assigned to a specific user
 * @access  Requires SYSTEM:READ permission
 */
adminPermissionRouter.get("/users/:user_id/permissions", authorize([Resource.SYSTEM], [Action.READ]), attachTargetUser, // Ensure target user exists and attach to request
getUserPermissions);
/**
 * @route   PUT /permissions
 * @desc    Grant permissions to a user
 * @access  Requires SYSTEM:UPDATE permission
 */
adminPermissionRouter.put("/permissions", authorize([Resource.SYSTEM], [Action.UPDATE]), adminPermissionValidation, // Validate permission payload
validateResult, // Handle validation errors
grantPermissions);
/**
 * @route   PUT /roles
 * @desc    Grant roles to a user
 * @access  Requires SYSTEM:READ permission
 */
adminPermissionRouter.put("/roles", adminRolesValidation, // Validate role payload
validateResult, // Handle validation errors
authorize([Resource.SYSTEM], [Action.READ]), grantRoles);
// ---------------------------------------------------
// Export Router
// ---------------------------------------------------
export default adminPermissionRouter;
//# sourceMappingURL=admin.permissions.routes.js.map