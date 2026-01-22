import type { SignupReqParams, LoginDeviceParams, UpdateTargetUserParams, ChangeTargetUserPasswordParams, JwtPayload, RefreshTokenParams } from "../types/user.types.js";
import type { serviceResponse, TargetParams } from '../types/common.types.js';
/**
 * @description Create a new user with hashed password, assigned role, and permissions
 * @param {SignupReqParams} reqBody - User registration details
 * @returns {Promise<serviceResponse>} - Returns success status and message
 */
export declare const signUpService: (reqBody: SignupReqParams) => Promise<serviceResponse>;
/**
 * @description User login service supporting multi-device sessions
 * @param {LoginDeviceParams} reqBody - Login credentials and device info
 * @returns {Promise<object>} - Returns success status, message, and tokens
 */
export declare const loginService: (reqBody: LoginDeviceParams) => Promise<serviceResponse>;
/**
 * @description Fetch details of the currently authenticated user
 * @param {JwtPayload} tokenUser - User info from JWT
 * @returns {Promise<serviceResponse>} - Returns success status and user data
 */
export declare const userDetailsService: (tokenUser: JwtPayload) => Promise<serviceResponse>;
/**
 * @description Update user profile
 * @param {TargetParams} targetUser - Target user to update
 * @param {UpdateTargetUserParams} reqBody - Fields to update
 * @returns {Promise<serviceResponse>} - Returns success status and message
 */
export declare const updateUserService: (targetUserId: TargetParams, reqBody: UpdateTargetUserParams) => Promise<serviceResponse>;
/**
 * @description Delete a user from the system
 * @param {TargetParams} targetUser - User to delete
 * @returns {Promise<serviceResponse>} - Returns success status and message
 */
export declare const deleteUserService: (targetUserId: TargetParams) => Promise<serviceResponse>;
/**
 * @description Change a user's password
 * @param {TargetParams} targetUser - User whose password will be changed
 * @param {ChangeTargetUserPasswordParams} reqBody - Contains new password
 * @returns {Promise<serviceResponse>} - Returns success status and message
 */
export declare const changePasswordService: (targetUserId: TargetParams, reqBody: ChangeTargetUserPasswordParams) => Promise<serviceResponse>;
/**
 * Service to refresh access and refresh tokens for a user device.
 * Validates the provided refresh token, checks it in the database, generates new tokens,
 * updates the device record, and returns the new tokens in a structured response.
 *
 * @param reqBody - Object containing the refresh_token from client
 * @returns serviceResponse - Success or failure message with new tokens if successful
 */
export declare const refreshTokenService: (reqBody: RefreshTokenParams) => Promise<serviceResponse>;
export declare const logoutService: (tokenUser: JwtPayload, device_id: string) => Promise<serviceResponse>;
//# sourceMappingURL=user.services.d.ts.map