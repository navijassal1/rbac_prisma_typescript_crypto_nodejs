import type { ExpressMiddlewareParams } from "../types/common.types.js";
/**
 * ---------------------------------------------------------
 * Validation rules for granting permissions to a user
 * Accessible by admin only
 * ---------------------------------------------------------
 */
export declare const adminPermissionValidation: (import("express-validator").ValidationChain | ((req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => import("express").Response<any, Record<string, any>> | undefined))[];
/**
 * ---------------------------------------------------------
 * Validation rules for granting roles to a user
 * Accessible by admin only
 * ---------------------------------------------------------
 */
export declare const adminRolesValidation: (import("express-validator").ValidationChain | ((req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => import("express").Response<any, Record<string, any>> | undefined))[];
/**
 * ---------------------------------------------------------
 * Middleware: Attach target user based on URL param
 * ---------------------------------------------------------
 * - Reads user_id from route params
 * - Verifies user existence
 * - Attaches targetUserId to request object
 */
export declare const attachTargetUser: ExpressMiddlewareParams;
//# sourceMappingURL=admin-permissions.validations.d.ts.map