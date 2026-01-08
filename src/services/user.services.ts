// External modules
import prisma from '../lib/prisma.client.js'
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../middlewares/token.manager.js"

// Interfaces
import type {
    SignupReqParams,
    LoginDeviceParams,
    UpdateTargetUserParams,
    ChangeTargetUserPasswordParams,
    JwtPayload,
    RefreshTokenParams
} from "../types/user.types.js"
import type { serviceResponse, TargetParams } from '../types/common.types.js'


/**
 * @description Fetch all users from the database
 * @returns {Promise<serviceResponse>} - Returns success status, message, and user list if exists
 */
export const listUsersService = async (): Promise<serviceResponse> => {
    try {
        const listUsers = await prisma.user.findMany({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                username: true,
                email: true,
            }
        })

        if (listUsers.length === 0) {
            return { success: false, message: "Users do not exist currently" }
        }

        return { success: true, message: "List of users", data: listUsers }
    } catch (error) {
        // Re-throw the error to be handled by a global error handler
        throw error
    }
}

/**
 * @description Create a new user with hashed password, assigned role, and permissions
 * @param {SignupReqParams} reqBody - User registration details
 * @returns {Promise<serviceResponse>} - Returns success status and message
 */
export const signUpService = async (reqBody: SignupReqParams): Promise<serviceResponse> => {
    try {
        const { role, first_name, last_name, username, password, email } = reqBody

        // Check if role exists and fetch its permissions
        const roleExists = await prisma.role.findUnique({
            where: { name: role },
            include: {
                permissions: {
                    include: { permission: true }
                }
            }
        })
        if (!roleExists) return { success: false, message: 'Invalid Role' }

        // Hash the password securely
        const hashPassword: string = await bcrypt.hash(password, 10)

        // Create the user
        const user = await prisma.user.create({
            data: { first_name, last_name, username, password: hashPassword, email }
        })
        if (!user) return { success: false, message: 'User not created' }

        // Assign role to the user
        const userRole = await prisma.user_Role.create({
            data: { user_id: user.id, role_id: roleExists.id }
        })
        if (!userRole) return { success: false, message: 'User role not granted' }

        // Assign permissions based on role
        const userPermissions = await prisma.user_permission.createMany({
            data: roleExists.permissions.map(p => ({
                user_id: user.id,
                permission_id: p.permission_id
            })),
            skipDuplicates: true
        })
        if (!userPermissions) return { success: false, message: 'User permissions not granted' }

        return { success: true, message: "User created successfully" }
    } catch (error: any) {
        throw error
    }
}

/**
 * @description User login service supporting multi-device sessions
 * @param {LoginDeviceParams} reqBody - Login credentials and device info
 * @returns {Promise<object>} - Returns success status, message, and tokens
 */
export const loginService = async (reqBody: LoginDeviceParams): Promise<any> => {
    try {
        const { email, device_id, device_type } = reqBody

        // Find user by email and include roles and permissions
        const userExists = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                roles: { include: { role: { select: { name: true } } } },
                permissions: { include: { permission: true } }
            }
        })
        if (!userExists) return { success: false, message: 'User Not Found' }

        // Generate JWT tokens
        const payload: JwtPayload = { id: userExists.id }
        const accessToken = await generateAccessToken(payload)
        const refreshToken = await generateRefreshToken(payload)
        
        // Handle multi-device login
        const deviceAlreadyLogin = await prisma.user_device.findFirst({
            where: { user_id: userExists.id, device_id }
        })

        if (deviceAlreadyLogin) {
            // Update existing device session
            const success = await prisma.user_device.update({
                where: { id: deviceAlreadyLogin.id },
                data: { access_token: accessToken, refresh_token: refreshToken }
            })
            if (!success) return { success: false, message: 'User Not Found' }
        } else {
            // Create new device session
            const success = await prisma.user_device.create({
                data: { user_id: userExists.id, access_token: accessToken, refresh_token: refreshToken, device_id, device_type }
            })
            if (!success) return { success: false, message: 'User Not Found' }
        }

        // Clean response excluding sensitive data
        const cleanResponse = {
            id: userExists.id,
            role_id: userExists.roles.map(r => r.role_id),
            roles: userExists.roles.map(r => r.role.name),
            permissions: userExists.permissions.map(p => ({
                id: p.permission.id,
                resource: p.permission.resource,
                action: p.permission.action
            }))
        }

        return {
            success: true,
            message: "User login successfully",
            data: { accessToken, refreshToken }
        }
    } catch (error: any) {
        throw error
    }
}

/**
 * @description Fetch details of the currently authenticated user
 * @param {JwtPayload} tokenUser - User info from JWT
 * @returns {Promise<serviceResponse>} - Returns success status and user data
 */
export const userDetailsService = async (tokenUser: JwtPayload): Promise<serviceResponse> => {
    try {
        const userExists = await prisma.user.findUnique({
            where: { id: tokenUser.id },
            select: {
                first_name: true,
                last_name: true,
                username: true,
                email: true
            }
        })

        if (!userExists) return { success: false, message: "User Not Found" }

        return { success: true, message: "User Details", data: userExists }
    } catch (error) {
        throw error
    }
}

/**
 * @description Update user profile
 * @param {TargetParams} targetUser - Target user to update
 * @param {UpdateTargetUserParams} reqBody - Fields to update
 * @returns {Promise<serviceResponse>} - Returns success status and message
 */
export const updateUserService = async (targetUser: TargetParams, reqBody: UpdateTargetUserParams): Promise<serviceResponse> => {
    try {
        const { first_name, last_name, username, email } = reqBody

        const success = await prisma.user.update({
            data: { first_name, last_name, username, email },
            where: { id: targetUser.id }
        })

        if (!success) return { success: false, message: 'User Not Found' }
        return { success: true, message: "User updated successfully" }
    } catch (error: any) {
        throw error
    }
}

/**
 * @description Delete a user from the system
 * @param {TargetParams} targetUser - User to delete
 * @returns {Promise<serviceResponse>} - Returns success status and message
 */
export const deleteUserService = async (targetUser: TargetParams): Promise<serviceResponse> => {
    try {
        const success = await prisma.user.delete({
            where: { id: targetUser.id }
        })

        if (!success) return { success: false, message: 'User Not Found' }
        return { success: true, message: "User deleted successfully" }
    } catch (error: any) {
        throw error
    }
}

/**
 * @description Change a user's password
 * @param {TargetParams} targetUser - User whose password will be changed
 * @param {ChangeTargetUserPasswordParams} reqBody - Contains new password
 * @returns {Promise<serviceResponse>} - Returns success status and message
 */
export const changePasswordService = async (
    targetUser: TargetParams,
    reqBody: ChangeTargetUserPasswordParams
): Promise<serviceResponse> => {
    try {
        const { new_password } = reqBody
        const hashPassword: string = await bcrypt.hash(new_password, 10)

        const success = await prisma.user.update({
            data: { password: hashPassword },
            where: { id: targetUser.id }
        })

        if (!success) return { success: false, message: 'User Not Found' }
        return { success: true, message: "Password changed successfully" }
    } catch (error: any) {
        throw error
    }
}


/**
 * Service to refresh access and refresh tokens for a user device.
 * Validates the provided refresh token, checks it in the database, generates new tokens,
 * updates the device record, and returns the new tokens in a structured response.
 * 
 * @param reqBody - Object containing the refresh_token from client
 * @returns serviceResponse - Success or failure message with new tokens if successful
 */
export const refreshTokenService = async (
  reqBody: RefreshTokenParams
): Promise<serviceResponse> => {

    // Extract the refresh token from the request body
    const { refresh_token } = reqBody;

    // Return early if no refresh token is provided
    if (!refresh_token) {
        return {
            success: false,
            message: "Unauthorized", // Cannot proceed without a token
        };
    }

    // Verify the refresh token using the verifyRefreshToken helper
    // Returns decoded payload if valid, false if invalid or expired
    const payload = await verifyRefreshToken(refresh_token);

    // Type guard: If the token is invalid, return unauthorized
    if (!payload) {
        return {
            success: false,
            message: "Unauthorized", // Token verification failed
        };
    }

    // Check if this refresh token exists in the database for the user and device
    // This prevents reuse of tokens that may have been revoked or belong to a different device
    const dbToken = await prisma.user_device.findFirst({
        where: {
            user_id: payload.id,
            refresh_token: refresh_token,
        }
    });

    // If no record is found, the token is invalid for this device/user
    if (!dbToken) {
        return {
            success: false,
            message: "Unauthorized", // Token not recognized in DB
        };
    }

    // Prepare a minimal payload object for token generation
    // Only includes the user ID, as this is all we need to encode in JWT
    const userid: JwtPayload = { id: payload.id }

    // Generate new access and refresh tokens
    // These will replace the old tokens in the database
    const newAccessToken = await generateAccessToken(userid);
    const newRefreshToken = await generateRefreshToken(userid);

    // Update the device record in the database with the new tokens
    // Using composite key (user_id + device_id) to ensure correct record update
    const updateDbToken = await prisma.user_device.update({
        where: {
            user_id_device_id: {
                user_id: payload.id,
                device_id: dbToken.device_id
            }
        },
        data: {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        },
    });

    // If the database update failed for any reason, return unauthorized
    // This ensures that tokens are only considered valid if successfully stored
    if (!updateDbToken) {
        return {
            success: false,
            message: "Unauthorized",
        };
    }

    // Return success response with the newly generated tokens
    // Client can now use these tokens to authenticate future requests
    return {
        success: true,
        message: "Re-generated Access Token And Refresh Token",
        data: {
            new_access_token: newAccessToken,
            new_refresh_token: newRefreshToken,
        },
    }
}


