import { listCategoriesService, createCategoriesService, categoryDetailsService, updateCategoryService, deleteCategoryService } from "../services/category.services.js";
import { response } from '../helpers/helper.js';
import { STATUS } from '../enums/enums.js';
import { errorHandler } from '../middlewares/error.handler.js';
/**
 * @description Middleware to fetch all categories for a specific user
 * @route GET /users/:userId/categories
 * @access Protected (requires targetUserId)
 */
export const listCategories = async (req, res) => {
    try {
        const targetUserId = req.targetUserId;
        const result = await listCategoriesService(targetUserId);
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
 * @description Middleware to create a new category for a user
 * @route POST /users/:userId/categories
 * @access Protected (requires targetUserId)
 * @body { CategoryNameParams } - Contains category_name
 */
export const createCategories = async (req, res) => {
    try {
        const targetUserId = req.targetUserId;
        const categoryName = req.body;
        const result = await createCategoriesService(targetUserId, categoryName);
        if (!result.success) {
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        }
        return response(res, STATUS.CREATED, true, result.message);
    }
    catch (e) {
        return errorHandler(e, res);
    }
};
/**
 * @description Middleware to fetch details of a single category
 * @route GET /users/:userId/categories/:categoryId
 * @access Protected (requires targetUserId and targetCategoryId)
 */
export const categoryDetails = async (req, res) => {
    try {
        const targetCategoryId = req.targetCategoryId;
        const result = await categoryDetailsService(targetCategoryId);
        if (!result.success) {
            return response(res, STATUS.NOT_FOUND, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, 'Category details', result.data);
    }
    catch (e) {
        return errorHandler(e, res);
    }
};
/**
 * @description Middleware to update a category's details
 * @route PUT /users/:userId/categories/:categoryId
 * @access Protected (requires targetUserId and targetCategoryId)
 * @body { UpdateCategoryParams } - Contains updated category_name
 */
export const updateCategory = async (req, res) => {
    try {
        const targetCategoryId = req.targetCategoryId;
        const reqBody = req.body;
        const result = await updateCategoryService(targetCategoryId, reqBody);
        if (!result.success) {
            return response(res, STATUS.NOT_FOUND, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message);
    }
    catch (e) {
        return errorHandler(e, res);
    }
};
/**
 * @description Middleware to soft delete a category
 * @route DELETE /users/:userId/categories/:categoryId
 * @access Protected (requires targetUserId and targetCategoryId)
 */
export const deleteCategory = async (req, res) => {
    try {
        const targetCategoryId = req.targetCategoryId;
        const result = await deleteCategoryService(targetCategoryId);
        if (!result.success) {
            return response(res, STATUS.NOT_FOUND, false, result.message);
        }
        return response(res, STATUS.SUCCESS, true, result.message);
    }
    catch (e) {
        return errorHandler(e, res);
    }
};
//# sourceMappingURL=category.controller.js.map