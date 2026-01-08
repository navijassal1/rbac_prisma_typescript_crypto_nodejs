// Import Router from Express to define protected user routes
import { Router } from "express";
// Import controller functions for user management
import { listUsers, userDetails, updateUser, deleteUser, changePassword } from "../../controllers/user.controller.js";
// Import middleware to validate request body results
import { validateResult } from "../../utils/validation.result.middleware.js";
// Import user-specific validations and utility middleware
import { ChangePasswordValidation, // Validation rules for password change
attachTargetUser // Middleware to attach target user to request
 } from "../../validations/user.validations.js";
// Import middleware to verify JWT token
import { verifyToken } from "../../middlewares/token.manager.js";
// Import middleware for role-based access control
import { authorize } from "../../middlewares/authorize.role.js";
// Import enums for resource and action types
import { Resource, Action } from "../../enums/enums.js";
// Create a router instance for protected user routes
const userProtectedRouter = Router();
// All routes below require a valid JWT token
userProtectedRouter.use(verifyToken);
// Route: List all users
// Permissions: SYSTEM resource, READ action
// Endpoint: GET /api/users/list-users
userProtectedRouter.get("/list-users", authorize([Resource.USER], [Action.READ]), listUsers);
// Route: Update a user
// Permissions: USER resource, CREATE action
// Middleware attachTargetUser ensures we know which user is being updated
// Endpoint: PUT /api/users/:username
userProtectedRouter.put("/:username", authorize([Resource.USER], [Action.CREATE]), attachTargetUser, updateUser);
// Route: Get user details of the current user
// Permissions: USER resource, READ action
// Endpoint: GET /api/users/user-details
userProtectedRouter.get("/user-details", authorize([Resource.USER], [Action.READ]), userDetails);
// Route: Change password for a user
// Permissions: USER resource, UPDATE action
// Validates new password and attaches target user
// Endpoint: PATCH /api/users/:username
userProtectedRouter.patch("/:username", authorize([Resource.USER], [Action.UPDATE]), attachTargetUser, ChangePasswordValidation, validateResult, changePassword);
// Route: Delete a user
// Permissions: USER resource, DELETE action
// Middleware attachTargetUser ensures the correct user is targeted
// Endpoint: DELETE /api/users/:username
userProtectedRouter.delete("/:username", authorize([Resource.USER], [Action.DELETE]), attachTargetUser, deleteUser);
// Export the protected user router
export default userProtectedRouter;
//# sourceMappingURL=user.protected.routes.js.map