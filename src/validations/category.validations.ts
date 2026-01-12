// External modules
import { body } from "express-validator";
import prisma from '../lib/prisma.client.js';
import { STATUS } from "../enums/enums.js";
import type { ApiResponseReturn, ExpressMiddlewareParams } from "../types/common.types.js";
import { response } from "../helpers/helper.js";
import { validateResult } from "../utils/validation.result.middleware.js";

/**
 * Validation rules for creating a new category.
 */
export const createCategoryValidation = [
  body("category_name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("Category name must be between 3 and 50 characters.")
    .bail()
    .matches(/^[a-zA-Z0-9\s&-]+$/)
    .withMessage("Category name can contain letters, numbers, spaces, '&', '-' only.")
    .bail()
    .custom(async (value) => {
      const exists = await prisma.category.findFirst({
        where: { category_name: value, is_deleted: false }
      })
      if (exists) throw new Error("Category already exists")
    }),

  validateResult
]
/**
 * Middleware to attach the target category to the request object.
 * Ensures the category exists and belongs to the target user.
 */
export const attachTargetCategory: ExpressMiddlewareParams = async (req, res, next):Promise<ApiResponseReturn> => {
  // Ensure the target user ID and categorySlug exist
  if (!req.targetUserId || !req.params.categorySlug) {
    return response(res, STATUS.BAD_REQUEST, false, "Target user or category slug not set");
  }
  // Find the category for this user that is not deleted
  const categoryExists = await prisma.category.findFirst({
    where: {
      user_id: req.targetUserId,
      slug: req.params.categorySlug,
      is_deleted: false
    },
    select: { id: true }
  });
  if (!categoryExists) {
    return response(res, STATUS.NOT_FOUND, false, 'Category Not Found');
  }
  // Attach category ID to request for downstream handlers
  req.targetCategoryId = categoryExists.id;
  next();
};
