import { listCategoriesService, createCategoriesService, categoryDetailsService, updateCategoryService, deleteCategoryService } from "../services/category.services.js";
import { response } from '../helpers/helper.js';
import { STATUS } from '../enums/enums.js';
/**
 * @description Middleware to fetch all categories for a specific user
 * @route GET /users/:userId/categories
 * @access Protected (requires targetUserId)
 */
export const listCategories = async (req, res, next) => {
    try {
        if (!req.targetUserId) {
            return response(res, STATUS.BAD_REQUEST, false, "Target user not set");
        }
        const targetUser = { id: req.targetUserId };
        const result = await listCategoriesService(targetUser);
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
 * @description Middleware to create a new category for a user
 * @route POST /users/:userId/categories
 * @access Protected (requires targetUserId)
 * @body { CategoryNameParams } - Contains category_name
 */
export const createCategories = async (req, res, next) => {
    try {
        if (!req.targetUserId) {
            return response(res, STATUS.BAD_REQUEST, false, "Target user not set");
        }
        const targetUser = { id: req.targetUserId };
        const categoryName = req.body;
        const result = await createCategoriesService(targetUser, categoryName);
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.CREATED, true, result.message);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Middleware to fetch details of a single category
 * @route GET /users/:userId/categories/:categoryId
 * @access Protected (requires targetUserId and targetCategoryId)
 */
export const categoryDetails = async (req, res, next) => {
    try {
        if (!req.targetUserId || !req.targetCategoryId) {
            return response(res, STATUS.BAD_REQUEST, false, "Target user or category not set");
        }
        const targetCategoryId = { id: req.targetCategoryId };
        const result = await categoryDetailsService(targetCategoryId);
        if (!result.success) {
            return response(res, STATUS.NOT_FOUND, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, 'Category details', result.data);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Middleware to update a category's details
 * @route PUT /users/:userId/categories/:categoryId
 * @access Protected (requires targetUserId and targetCategoryId)
 * @body { UpdateCategoryParams } - Contains updated category_name
 */
export const updateCategory = async (req, res, next) => {
    try {
        if (!req.targetUserId || !req.targetCategoryId) {
            return response(res, STATUS.BAD_REQUEST, false, "Target user or category not set");
        }
        const targetCategory = { id: req.targetCategoryId };
        const reqBody = req.body;
        const result = await updateCategoryService(targetCategory, reqBody);
        if (!result.success) {
            return response(res, STATUS.NOT_FOUND, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Middleware to soft delete a category
 * @route DELETE /users/:userId/categories/:categoryId
 * @access Protected (requires targetUserId and targetCategoryId)
 */
export const deleteCategory = async (req, res, next) => {
    try {
        if (!req.targetUserId || !req.targetCategoryId) {
            return response(res, STATUS.BAD_REQUEST, false, "Target user or category not set");
        }
        const targetCategory = { id: req.targetCategoryId };
        const result = await deleteCategoryService(targetCategory);
        if (!result.success) {
            return response(res, STATUS.NOT_FOUND, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
//# sourceMappingURL=category.controller.js.map