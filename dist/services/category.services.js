import prisma from "../lib/prisma.client.js";
import { generateUniqueSlug } from "../utils/slug.js";
/**
 * @description Fetch all categories belonging to a specific user
 * @param {TargetParams} targetUser - User whose categories are being fetched
 * @returns {Promise<serviceResponse>} - Success status, message, and list of categories
 */
export const listCategoriesService = async (targetUserId) => {
    try {
        const listCategories = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: {
                id: true,
                username: true,
                categories: {
                    select: {
                        id: true,
                        category_name: true,
                        slug: true,
                        created_at: true,
                        deleted_at: true
                    }
                }
            }
        });
        if (!listCategories) {
            return { success: false, message: "Invalid User" };
        }
        if (listCategories.categories.length === 0) {
            return { success: false, message: "No categories exist currently" };
        }
        return { success: true, message: "List of categories", data: listCategories };
    }
    catch (error) {
        throw error;
    }
};
/**
 * @description Create a new category for a user
 * @param {TargetParams} targetUser - User who is creating the category
 * @param {CategoryNameParams} categoryName - Name of the new category
 * @returns {Promise<serviceResponse>} - Success status and message
 */
export const createCategoriesService = async (targetUserId, categoryName) => {
    try {
        const { category_name } = categoryName;
        // Generate a unique slug for the category
        const slug = await generateUniqueSlug(category_name);
        const success = await prisma.category.create({
            data: { user_id: targetUserId, category_name, slug }
        });
        if (!success) {
            return { success: false, message: 'Category not created' };
        }
        return { success: true, message: "Category created successfully" };
    }
    catch (error) {
        throw error;
    }
};
/**
 * @description Get details of a single category
 * @param {TargetParams} targetCategoryId - Category ID to fetch details for
 * @returns {Promise<serviceResponse>} - Success status, message, and category details
 */
export const categoryDetailsService = async (targetCategoryId) => {
    try {
        const success = await prisma.category.findFirst({
            where: { id: targetCategoryId },
            select: {
                id: true,
                category_name: true,
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            },
        });
        if (!success) {
            return { success: false, message: 'Category not found' };
        }
        return { success: true, message: "Category details", data: success };
    }
    catch (error) {
        throw error;
    }
};
/**
 * @description Update a category's name and slug
 * @param {TargetParams} targetCategory - Category to update
 * @param {CategoryNameParams} categoryName - New category name
 * @returns {Promise<serviceResponse>} - Success status and message
 */
export const updateCategoryService = async (targetCategoryId, categoryName) => {
    try {
        const { category_name } = categoryName;
        const slug = await generateUniqueSlug(category_name); // generate unique slug
        const success = await prisma.category.update({
            where: { id: targetCategoryId },
            data: { category_name, slug }
        });
        if (!success) {
            return { success: false, message: 'Category not updated' };
        }
        return { success: true, message: "Category updated successfully" };
    }
    catch (error) {
        throw error;
    }
};
/**
 * @description Soft delete a category by setting `deleted_at` and `is_deleted` flags
 * @param {TargetParams} targetCategory - Category to soft delete
 * @returns {Promise<serviceResponse>} - Success status and message
 */
export const deleteCategoryService = async (targetCategoryId) => {
    try {
        const success = await prisma.category.update({
            where: { id: targetCategoryId },
            data: {
                deleted_at: new Date(),
                is_deleted: true
            }
        });
        if (!success) {
            return { success: false, message: 'Category not deleted' };
        }
        return { success: true, message: "Category soft deleted successfully" };
    }
    catch (error) {
        throw error;
    }
};
//# sourceMappingURL=category.services.js.map