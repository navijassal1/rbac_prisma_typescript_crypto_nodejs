import type { ExpressMiddlewareParams } from "../types/common.types.js";
/**
 * Validation rules for creating a new category.
 */
export declare const createCategoryValidation: import("express-validator").ValidationChain[];
/**
 * Middleware to attach the target category to the request object.
 * Ensures the category exists and belongs to the target user.
 */
export declare const attachTargetCategory: ExpressMiddlewareParams;
//# sourceMappingURL=category.validations.d.ts.map