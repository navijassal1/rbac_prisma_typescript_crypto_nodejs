import type { ExpressMiddlewareParams } from "../types/common.types.js";
/**
 * Validation rules for granting permissions to a user (admin only)
 */
export declare const adminPermissionValidation: import("express-validator").ValidationChain[];
/**
 * Middleware to attach target user based on the user_id parameter
 */
export declare const attachTargetUser: ExpressMiddlewareParams;
//# sourceMappingURL=admin.permissions.validations.d.ts.map