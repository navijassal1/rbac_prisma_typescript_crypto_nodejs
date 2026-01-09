import type { ExpressMiddlewareParams } from '../types/common.types.js';
/**
 * @description Middleware to register a new user
 * @route POST /users/signup
 * @access Public
 * @body { SignupReqParams } - Registration details
 */
export declare const signUp: ExpressMiddlewareParams;
/**
 * @description Middleware to login a user (multi-device support)
 * @route POST /users/login
 * @access Public
 * @body { LoginDeviceParams } - Email, password, device info
 */
export declare const login: ExpressMiddlewareParams;
/**
 * @description Middleware to fetch details of the logged-in user
 * @route GET /users/me
 * @access Protected (requires tokenUser)
 */
export declare const userDetails: ExpressMiddlewareParams;
/**
 * @description Middleware to update a user's profile
 * @route PUT /users/:userId
 * @access Protected
 * @body { UpdateTargetUserParams } - Fields to update
 */
export declare const updateUser: ExpressMiddlewareParams;
/**
 * @description Middleware to delete a user
 * @route DELETE /users/:userId
 * @access Protected/Admin
 */
export declare const deleteUser: ExpressMiddlewareParams;
/**
 * @description Middleware to change a user's password
 * @route PUT /users/:userId/password
 * @access Protected
 * @body { ChangeTargetUserPasswordParams } - Contains new_password
 */
export declare const changePassword: ExpressMiddlewareParams;
/**
 * Express middleware to handle refresh access token requests.
 * Receives a refresh token from the client, calls the refreshTokenService,
 * and returns a structured response with new tokens if successful.
 *
 * @param req - Express request object containing the refresh token in body
 * @param res - Express response object used to send responses to the client
 * @param next - Express next function for passing errors to error-handling middleware
 */
export declare const refreshAccessToken: ExpressMiddlewareParams;
//# sourceMappingURL=user.controller.d.ts.map