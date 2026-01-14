// Imports
// Express router
import { Router } from "express";

// Controllers for admin permission management
import {
  listUsers,              // Fetch all users
  listPermissions,        // Fetch all available permissions
  listRoles,              // Fetch all available roles
  getUserPermissions,     // Fetch permissions for a specific user
  grantPermissions,       // Assign permissions to a user
  grantRoles              // Assign roles to a user
} from "../../controllers/admin-permissions.controller.js";

// RBAC enums
import { Resource, Action } from "../../enums/enums.js";

// Authorization middleware (RBAC enforcement)
import { authorize } from "../../middlewares/authorize.role.js";

// Validation and helper middlewares
import {
  adminPermissionValidation, // Validation rules for permission assignment
  adminRolesValidation,      // Validation rules for role assignment
  attachTargetUser           // Attaches target user to request object
} from "../../validations/admin-permissions.validations.js";

// ---------------------------------------------------
// Router Initialization
// ---------------------------------------------------
const adminPermissionRouter = Router();
// ---------------------------------------------------
// Routes
// ---------------------------------------------------
/**
 * @route   GET /list-users
 * @desc    List all users in the system
 * @access  Requires USER:READ permission
 */
adminPermissionRouter.get(
  "/list-users",
  authorize([Resource.SYSTEM], [Action.READ]),
  listUsers
);
/**
 * @route   GET /list-permissions
 * @desc    List all available permissions in the system
 * @access  Requires SYSTEM:READ permission
 */
adminPermissionRouter.get(
  "/list-permissions",
  authorize([Resource.SYSTEM], [Action.READ]),
  listPermissions
);
/**
 * @route   GET /list-roles
 * @desc    List all roles available in the system
 * @access  Requires SYSTEM:READ permission
 */
adminPermissionRouter.get(
  "/list-roles",
  authorize([Resource.SYSTEM], [Action.READ]),
  listRoles
);
/**
 * @route   GET /users/:user_id/permissions
 * @desc    Get permissions assigned to a specific user
 * @access  Requires SYSTEM:READ permission
 */
adminPermissionRouter.get(
  "/users/:user_id/permissions",
  authorize([Resource.SYSTEM], [Action.READ]),
  attachTargetUser,       // Ensure target user exists and attach to request
  getUserPermissions
);
/**
 * @route   PUT /permissions
 * @desc    Grant permissions to a user
 * @access  Requires SYSTEM:UPDATE permission
 */
adminPermissionRouter.put(
  "/permissions",
  authorize([Resource.SYSTEM], [Action.UPDATE]),
  adminPermissionValidation, // Validate permission payload
  grantPermissions
);
/**
 * @route   PUT /roles
 * @desc    Grant roles to a user
 * @access  Requires SYSTEM:READ permission
 */
adminPermissionRouter.put(
  "/roles",
  authorize([Resource.SYSTEM], [Action.READ]),
  adminRolesValidation,   // Validate role payload
  grantRoles
);

// ---------------------------------------------------
// Export Router
// ---------------------------------------------------

export default adminPermissionRouter;
