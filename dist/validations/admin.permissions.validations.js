// External modules
import { body } from "express-validator";
import prisma from '../lib/prisma.client.js';
import { STATUS } from "../enums/enums.js";
import { response } from "../helpers/helper.js";
/**
 * Validation rules for granting permissions to a user (admin only)
 */
export const adminPermissionValidation = [
    // Validate user_id
    body("user_id")
        .trim()
        .notEmpty()
        .withMessage("User ID is required.")
        .bail()
        .custom(async (value) => {
        const user = await prisma.user.findUnique({
            where: { id: Number(value) }
        });
        if (!user) {
            throw ({ code: STATUS.UNPROCESSIBLE, message: 'Enter a valid user ID.' });
        }
        return true;
    }),
    // Validate permission_ids
    body("permission_ids")
        .trim()
        .notEmpty()
        .withMessage("Permission IDs are required.")
        .bail()
        .custom(async (value) => {
        let permissionIds;
        // Parse stringified array if necessary
        if (Array.isArray(value)) {
            permissionIds = value.map(Number);
        }
        else if (typeof value === 'string') {
            try {
                permissionIds = JSON.parse(value);
                if (!Array.isArray(permissionIds)) {
                    throw new Error();
                }
            }
            catch {
                throw ({ code: STATUS.NOT_FOUND, message: 'Permission IDs must be a valid array.' });
            }
        }
        else {
            throw ({ code: STATUS.NOT_FOUND, message: 'Permission IDs must be a valid array.' });
        }
        // Verify that all IDs exist in the database
        const existingPermissions = await prisma.permission.findMany({
            where: { id: { in: permissionIds } },
            select: { id: true }
        });
        if (permissionIds.length !== existingPermissions.length) {
            throw ({ code: STATUS.NOT_FOUND, message: 'Enter valid permission IDs.' });
        }
        return true;
    }),
];
/**
 * Middleware to attach target user based on the user_id parameter
 */
export const attachTargetUser = async (req, res, next) => {
    const userId = Number(req.params.user_id);
    // Find the user
    const userExists = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!userExists) {
        return response(res, STATUS.NOT_FOUND, false, 'User Not Found');
    }
    // Attach the target user ID to the request
    req.targetUserId = userExists.id;
    next();
};
//# sourceMappingURL=admin.permissions.validations.js.map