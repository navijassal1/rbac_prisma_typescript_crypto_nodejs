import type { serviceResponse, TargetParams } from "../types/common.types.js";
import type { CategoryNameParams } from "../types/category.types.js";
/**
 * @description Fetch all categories belonging to a specific user
 * @param {TargetParams} targetUser - User whose categories are being fetched
 * @returns {Promise<serviceResponse>} - Success status, message, and list of categories
 */
export declare const listCategoriesService: (targetUser: TargetParams) => Promise<serviceResponse>;
/**
 * @description Create a new category for a user
 * @param {TargetParams} targetUser - User who is creating the category
 * @param {CategoryNameParams} categoryName - Name of the new category
 * @returns {Promise<serviceResponse>} - Success status and message
 */
export declare const createCategoriesService: (targetUser: TargetParams, categoryName: CategoryNameParams) => Promise<serviceResponse>;
/**
 * @description Get details of a single category
 * @param {TargetParams} targetCategoryId - Category ID to fetch details for
 * @returns {Promise<serviceResponse>} - Success status, message, and category details
 */
export declare const categoryDetailsService: (targetCategoryId: TargetParams) => Promise<serviceResponse>;
/**
 * @description Update a category's name and slug
 * @param {TargetParams} targetCategory - Category to update
 * @param {CategoryNameParams} categoryName - New category name
 * @returns {Promise<serviceResponse>} - Success status and message
 */
export declare const updateCategoryService: (targetCategory: TargetParams, categoryName: CategoryNameParams) => Promise<serviceResponse>;
/**
 * @description Soft delete a category by setting `deleted_at` and `is_deleted` flags
 * @param {TargetParams} targetCategory - Category to soft delete
 * @returns {Promise<serviceResponse>} - Success status and message
 */
export declare const deleteCategoryService: (targetCategory: TargetParams) => Promise<serviceResponse>;
//# sourceMappingURL=category.services.d.ts.map