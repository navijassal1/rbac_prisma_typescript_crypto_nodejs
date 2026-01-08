import type { ExpressMiddlewareParams } from '../types/common.types.js';
/**
 * @description Middleware to fetch all categories for a specific user
 * @route GET /users/:userId/categories
 * @access Protected (requires targetUserId)
 */
export declare const listCategories: ExpressMiddlewareParams;
/**
 * @description Middleware to create a new category for a user
 * @route POST /users/:userId/categories
 * @access Protected (requires targetUserId)
 * @body { CategoryNameParams } - Contains category_name
 */
export declare const createCategories: ExpressMiddlewareParams;
/**
 * @description Middleware to fetch details of a single category
 * @route GET /users/:userId/categories/:categoryId
 * @access Protected (requires targetUserId and targetCategoryId)
 */
export declare const categoryDetails: ExpressMiddlewareParams;
/**
 * @description Middleware to update a category's details
 * @route PUT /users/:userId/categories/:categoryId
 * @access Protected (requires targetUserId and targetCategoryId)
 * @body { UpdateCategoryParams } - Contains updated category_name
 */
export declare const updateCategory: ExpressMiddlewareParams;
/**
 * @description Middleware to soft delete a category
 * @route DELETE /users/:userId/categories/:categoryId
 * @access Protected (requires targetUserId and targetCategoryId)
 */
export declare const deleteCategory: ExpressMiddlewareParams;
//# sourceMappingURL=category.controller.d.ts.map