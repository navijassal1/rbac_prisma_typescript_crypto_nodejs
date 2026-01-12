import type { ExpressMiddlewareParams, serviceResponse, TargetParams, ApiResponseReturn } from '../types/common.types.js'
import type {
    SignupReqParams,
    LoginDeviceParams,
    UpdateTargetUserParams,
    ChangeTargetUserPasswordParams,
    RefreshTokenParams,
    JwtPayload,
} from "../types/user.types.js"
import {
    signUpService,
    loginService,
    userDetailsService,
    updateUserService,
    deleteUserService,
    changePasswordService,
    refreshTokenService
} from "../services/user.services.js"
import { response } from '../helpers/helper.js'
import { STATUS } from '../enums/enums.js'
import { errorHandler } from '../middlewares/error.handler.js'

/**
 * @description Middleware to register a new user
 * @route POST /users/signup
 * @access Public
 * @body { SignupReqParams } - Registration details
 */
export const signUp: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
    try {
        const reqBody: SignupReqParams = req.body
        const result: serviceResponse = await signUpService(reqBody)
        if (!result.success) return response(res, STATUS.BAD_REQUEST, false, result.message)
        return response(res, STATUS.CREATED, true, result.message, result.data)
        // return 'string'
    } catch (e) {
        return errorHandler(e as Error, res)
    }
}
/**
 * @description Middleware to login a user (multi-device support)
 * @route POST /users/login
 * @access Public
 * @body { LoginDeviceParams } - Email, password, device info
 */
export const login: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
    try {
        const reqBody: LoginDeviceParams = req.body
        const result: serviceResponse = await loginService(reqBody)
        if (!result.success) return response(res, STATUS.NOT_FOUND, false, result.message)
        return response(res, STATUS.SUCCESS, true, result.message, result.data)
    } catch (e) {
        return errorHandler(e as Error, res);
    }
}
/**
 * @description Middleware to fetch details of the logged-in user
 * @route GET /users/me
 * @access Protected (requires tokenUser)
 */
export const userDetails: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
    try {
        const tokenUser: JwtPayload = req.tokenUser
        const result: serviceResponse = await userDetailsService(tokenUser)
        if (!result.success) return response(res, STATUS.NOT_FOUND, false, result.message)
        return response(res, STATUS.SUCCESS, true, result.message, result.data)
    } catch (e) {
        return errorHandler(e as Error, res)
    }
}
/**
 * @description Middleware to update a user's profile
 * @route PUT /users/:userId
 * @access Protected
 * @body { UpdateTargetUserParams } - Fields to update
 */
export const updateUser: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
    try {
        const targetUserId: TargetParams = req.targetUserId
        const reqBody: UpdateTargetUserParams = req.body
        const result: serviceResponse = await updateUserService(targetUserId, reqBody)
        if (!result.success) return response(res, STATUS.NOT_FOUND, false, result.message)
        return response(res, STATUS.SUCCESS, true, result.message)
    } catch (e) {
        return errorHandler(e as Error, res)
    }
}
/**
 * @description Middleware to delete a user
 * @route DELETE /users/:userId
 * @access Protected/Admin
 */
export const deleteUser: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
    try {
        const targetUserId: TargetParams = req.targetUserId
        const result: serviceResponse = await deleteUserService(targetUserId)
        if (!result.success) return response(res, STATUS.NOT_FOUND, false, result.message)
        return response(res, STATUS.SUCCESS, true, result.message)
    } catch (e) {
        return errorHandler(e as Error, res)
    }
}
/**
 * @description Middleware to change a user's password
 * @route PUT /users/:userId/password
 * @access Protected
 * @body { ChangeTargetUserPasswordParams } - Contains new_password
 */
export const changePassword: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
    try {
        const targetUserId: TargetParams = req.targetUserId
        const reqBody: ChangeTargetUserPasswordParams = req.body
        const result: serviceResponse = await changePasswordService(targetUserId, reqBody)
        if (!result.success) return response(res, STATUS.NOT_FOUND, false, result.message)
        return response(res, STATUS.SUCCESS, true, result.message)
    } catch (e) {
        return errorHandler(e as Error, res)
    }
}
/**
 * Express middleware to handle refresh access token requests.
 * Receives a refresh token from the client, calls the refreshTokenService,
 * and returns a structured response with new tokens if successful.
 *
 * @param req - Express request object containing the refresh token in body
 * @param res - Express response object used to send responses to the client
 * @param next - Express next function for passing errors to error-handling middleware
 */
export const refreshAccessToken: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
    try {
        // Extract the request body and type it as RefreshTokenParams
        // This ensures TypeScript knows we expect a refresh_token field
        const reqBody: RefreshTokenParams = req.body

        // Call the refreshTokenService to handle token verification, DB check,
        // and token regeneration. It returns a structured serviceResponse.
        const result: serviceResponse = await refreshTokenService(reqBody)

        // If the refresh token service fails (invalid token, expired, etc.),
        // respond with an unauthorized status and message
        if (!result.success) {
            return response(res, STATUS.UNAUTHORIZED, false, result.message)
        }
        // If successful, return the new tokens and a success status to the client
        return response(
            res,
            STATUS.SUCCESS,
            true,
            result.message,
            result.data // contains new_access_token and new_refresh_token
        )
    } catch (e) {
        // Pass any unexpected errors to Express error-handling middleware
        return errorHandler(e as Error, res)
    }
}



