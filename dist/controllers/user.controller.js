import { listUsersService, signUpService, loginService, userDetailsService, updateUserService, deleteUserService, changePasswordService, refreshTokenService } from "../services/user.services.js";
import { response } from '../helpers/helper.js';
import { STATUS } from '../enums/enums.js';
/**
 * @description Middleware to list all users
 * @route GET /users
 * @access Protected/Admin
 */
export const listUsers = async (req, res, next) => {
    try {
        const result = await listUsersService();
        if (!result.success)
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Middleware to register a new user
 * @route POST /users/signup
 * @access Public
 * @body { SignupReqParams } - Registration details
 */
export const signUp = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const result = await signUpService(reqBody);
        if (!result.success)
            return response(res, STATUS.BAD_REQUEST, false, result.message);
        return response(res, STATUS.CREATED, true, result.message, result.data);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Middleware to login a user (multi-device support)
 * @route POST /users/login
 * @access Public
 * @body { LoginDeviceParams } - Email, password, device info
 */
export const login = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const result = await loginService(reqBody);
        if (!result.success)
            return response(res, STATUS.NOT_FOUND, false, result.message);
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Middleware to fetch details of the logged-in user
 * @route GET /users/me
 * @access Protected (requires tokenUser)
 */
export const userDetails = async (req, res, next) => {
    try {
        if (!req.tokenUser)
            return response(res, STATUS.BAD_REQUEST, false, "Target user not set");
        const tokenUser = req.tokenUser;
        const result = await userDetailsService(tokenUser);
        if (!result.success)
            return response(res, STATUS.NOT_FOUND, false, result.message);
        return response(res, STATUS.SUCCESS, true, result.message, result.data);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Middleware to update a user's profile
 * @route PUT /users/:userId
 * @access Protected
 * @body { UpdateTargetUserParams } - Fields to update
 */
export const updateUser = async (req, res, next) => {
    try {
        if (!req.targetUserId)
            return response(res, STATUS.BAD_REQUEST, false, "Target user not set");
        const targetUser = { id: req.targetUserId };
        const reqBody = req.body;
        const result = await updateUserService(targetUser, reqBody);
        if (!result.success)
            return response(res, STATUS.NOT_FOUND, false, result.message);
        return response(res, STATUS.SUCCESS, true, result.message);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Middleware to delete a user
 * @route DELETE /users/:userId
 * @access Protected/Admin
 */
export const deleteUser = async (req, res, next) => {
    try {
        if (!req.targetUserId)
            return response(res, STATUS.BAD_REQUEST, false, "Target user not set");
        const targetUser = { id: req.targetUserId };
        const result = await deleteUserService(targetUser);
        if (!result.success)
            return response(res, STATUS.NOT_FOUND, false, result.message);
        return response(res, STATUS.SUCCESS, true, result.message);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * @description Middleware to change a user's password
 * @route PUT /users/:userId/password
 * @access Protected
 * @body { ChangeTargetUserPasswordParams } - Contains new_password
 */
export const changePassword = async (req, res, next) => {
    try {
        if (!req.targetUserId)
            return response(res, STATUS.BAD_REQUEST, false, "Target user not set");
        const targetUser = { id: req.targetUserId };
        const reqBody = req.body;
        const result = await changePasswordService(targetUser, reqBody);
        if (!result.success)
            return response(res, STATUS.NOT_FOUND, false, result.message);
        return response(res, STATUS.SUCCESS, true, result.message);
    }
    catch (e) {
        if (e instanceof Error)
            next(e);
    }
};
/**
 * Express middleware to handle refresh access token requests.
 * Receives a refresh token from the client, calls the refreshTokenService,
 * and returns a structured response with new tokens if successful.
 *
 * @param req - Express request object containing the refresh token in body
 * @param res - Express response object used to send responses to the client
 * @param next - Express next function for passing errors to error-handling middleware
 */
export const refreshAccessToken = async (req, res, next) => {
    try {
        // Extract the request body and type it as RefreshTokenParams
        // This ensures TypeScript knows we expect a refresh_token field
        const reqBody = req.body;
        // Call the refreshTokenService to handle token verification, DB check,
        // and token regeneration. It returns a structured serviceResponse.
        const result = await refreshTokenService(reqBody);
        // If the refresh token service fails (invalid token, expired, etc.),
        // respond with an unauthorized status and message
        if (!result.success) {
            return response(res, STATUS.UNAUTHORIZED, false, result.message);
        }
        // If successful, return the new tokens and a success status to the client
        return response(res, STATUS.SUCCESS, true, result.message, result.data // contains new_access_token and new_refresh_token
        );
    }
    catch (e) {
        // Pass any unexpected errors to Express error-handling middleware
        if (e instanceof Error)
            next(e);
    }
};
//# sourceMappingURL=user.controller.js.map