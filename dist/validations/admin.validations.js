// External modules
import bcrypt from "bcrypt";
// Internal modules
import { body } from "express-validator";
import prisma from '../lib/prisma.client.js';
import { STATUS } from "../enums/enums.js";
import { response } from "../helpers/helper.js";
// Create Category Validation
export const adminGrantPermissionValidation = [
    body("user_id")
        .trim()
        .notEmpty()
        .withMessage("User ID is required.")
        .bail()
        .matches(/^[a-zA-Z0-9\s&-]+$/)
        .custom(async (value) => {
        console.log(value, 'value');
        console.log(typeof value);
        const success = await prisma.user.findUnique({
            where: {
                id: Number(value)
            }
        });
        console.log(success, 'user');
        if (!success) {
            throw ({ code: STATUS.UNPROCESSIBLE, message: 'Enter valid user ID ' });
        }
        return true;
    }),
    body("permission_id")
        .trim()
        .notEmpty()
        .withMessage("Permission ID is required.")
        .bail()
        .custom(async (value) => {
        const success = await prisma.permission.findUnique({
            where: {
                id: Number(value)
            }
        });
        if (!success) {
            throw ({ code: STATUS.NOT_FOUND, message: 'Enter valid permission ID' });
        }
        return true;
    }),
];
export const attachTargetCategory = async (req, res, next) => {
    if (!req.targetUserId || !req.params.categorySlug) {
        throw new Error("error");
        return response(res, STATUS.BAD_REQUEST, false, "Target user not set");
    }
    console.log(req.targetUserId, req.params.categorySlug);
    const categoryExists = await prisma.category.findFirst({
        where: {
            user_id: req.targetUserId,
            slug: req.params.categorySlug,
            is_deleted: false
        }
    });
    console.log(categoryExists, 'category target');
    if (!categoryExists) {
        return response(res, STATUS.NOT_FOUND, false, 'Category Not Found');
    }
    req.targetCategoryId = categoryExists.id;
    next();
};
//# sourceMappingURL=admin.validations.js.map