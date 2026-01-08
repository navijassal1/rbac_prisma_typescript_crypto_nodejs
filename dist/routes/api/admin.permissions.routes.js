// Import Router from Express to define admin permission routes
import { Router } from "express";
// Import controller functions for admin permission management
import { getPermissions, // List all available permissions
getUserPermissions, // Get permissions for a specific user
grantPermissions // Grant permissions to a user
 } from "../../controllers/admin.permissions.controller.js";
// Import middleware to verify JWT token
import { verifyToken } from "../../middlewares/token.manager.js";
// Import enums for RBAC: resources and actions
import { Resource, Action } from "../../enums/enums.js";
// Import role-based authorization middleware
import { authorize } from "../../middlewares/authorize.role.js";
// Import validation and attachment middleware for admin permissions
import { adminPermissionValidation, // Validation rules for granting permissions
attachTargetUser // Middleware to attach target user to request
 } from "../../validations/admin.permissions.validations.js";
// Middleware to handle validation errors
import { validateResult } from "../../utils/validation.result.middleware.js";
// Create router instance for admin permission routes
const adminPermissionRouter = Router();
// All routes require a valid JWT token
adminPermissionRouter.use(verifyToken);
// Route: List all permissions in the system
// Permissions: SYSTEM resource, READ action
// Endpoint: GET /api/admin/permissions
adminPermissionRouter.get("/permissions", authorize([Resource.SYSTEM], [Action.READ]), getPermissions);
// Route: Grant permissions to a user
// Permissions: SYSTEM resource, CREATE action
// Validates request body before granting permissions
// Endpoint: PUT /api/admin/permissions
adminPermissionRouter.put("/permissions", authorize([Resource.SYSTEM], [Action.UPDATE]), adminPermissionValidation, validateResult, grantPermissions);
// Route: Get permissions for a specific user
// Permissions: SYSTEM resource, READ action
// attachTargetUser ensures the user exists
// Endpoint: GET /api/admin/users/:user_id/permissions
adminPermissionRouter.get("/users/:user_id/permissions", authorize([Resource.SYSTEM], [Action.READ]), attachTargetUser, getUserPermissions);
// Export the admin permission router
export default adminPermissionRouter;
//# sourceMappingURL=admin.permissions.routes.js.map