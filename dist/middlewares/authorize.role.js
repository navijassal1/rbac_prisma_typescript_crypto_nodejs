// Helper functions to send HTTP 401/403 responses
import { forbidden } from "../helpers/helper.js";
// Prisma client for database access
import prisma from "../lib/prisma.client.js";
/**
 * Role-Based Access Control (RBAC) middleware
 *
 * @param allowedResources - list of resources the user can access
 * @param allowedActions - list of actions the user can perform
 * @returns Express middleware function
 */
export const authorize = (allowedResources, allowedActions) => async (req, res, next) => {
    console.log("----------START-----------");
    // The authenticated user should be attached to req.tokenUser by previous JWT middleware
    const user = req.tokenUser;
    // Debug logs for development (remove or disable in production)
    console.log(user, "user\n");
    console.log(allowedResources, "allowedResources\n");
    console.log(allowedActions, "allowedActions\n");
    // Query user permissions from the database
    // Only fetch permissions matching allowed resources and actions
    const userPermissions = await prisma.user_permission.findMany({
        where: {
            user_id: user.id,
            permission: {
                resource: { in: allowedResources }, // Only allowed resources
                action: { in: allowedActions }, // Only allowed actions
            },
        },
        select: {
            permission: { select: { id: true, resource: true, action: true } },
        },
    });
    console.log(userPermissions, "userPermissions");
    console.log("----------END-----------");
    // If the user has no matching permissions, return 403 Forbidden
    if (userPermissions.length === 0) {
        return forbidden(res);
    }
    // User has required permission, proceed to next middleware/controller
    next();
};
//# sourceMappingURL=authorize.role.js.map