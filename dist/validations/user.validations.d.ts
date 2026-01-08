import type { ExpressMiddlewareParams } from "../types/common.types.js";
/**
 * Validation rules for user signup.
 */
export declare const signupValidation: import("express-validator").ValidationChain[];
/**
 * Validation rules for user login.
 */
export declare const loginValidation: import("express-validator").ValidationChain[];
/**
 * Validation rules for changing a user's password.
 */
export declare const ChangePasswordValidation: import("express-validator").ValidationChain[];
/**
 * Middleware array to validate the refresh token in incoming requests.
 * Ensures that the `refresh_token` field is present and is a string.
 *
 * Usage: Pass this middleware before your controller (e.g., refreshAccessToken)
 * to automatically validate requests and collect errors with `validateResult`.
 */
export declare const refreshTokenValidation: import("express-validator").ValidationChain[];
/**
 * Middleware to attach the target user's ID to the request.
 * Useful for controllers that need to perform operations on a specific user.
 */
export declare const attachTargetUser: ExpressMiddlewareParams;
//# sourceMappingURL=user.validations.d.ts.map