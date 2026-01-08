// External modules
import jwt from "jsonwebtoken";
import pkg from 'jsonwebtoken';
// Internal modules
import { JWT } from "../constants/backend.js";
import prisma from "../lib/prisma.client.js";
import { forbidden, unauthorized } from "../helpers/helper.js";
import { Roles } from "../enums/enums.js";
import { decryptedPayload, encrytPayload } from "../services/crypto.services.js";
const { JsonWebTokenError } = pkg;
/**
 * @description Generates a JWT access token for a given user
 * @param {JwtPayload} user - The user payload (must include at least an `id`)
 * @returns {string} Signed JWT access token
 */
export const generateAccessToken = async (user) => {
    const encryptedPayload = encrytPayload(user);
    return jwt.sign({ data: encryptedPayload }, JWT.SECRET_KEY, { expiresIn: JWT.ACCESS_TOKEN_LIFE });
};
/**
 * @description Generates a JWT refresh token for a given user
 * @param {JwtPayload} user - The user payload (must include at least an `id`)
 * @returns {string} Signed JWT refresh token
*/
export const generateRefreshToken = async (user) => {
    const encryptedPayload = encrytPayload(user);
    return jwt.sign({ data: encryptedPayload }, JWT.SECRET_KEY, { expiresIn: JWT.REFRESH_TOKEN_LIFE });
};
/**
 * @description Express middleware to verify JWT access tokens
 * - Extracts token from `Authorization` header (Bearer token)
 * - Verifies token validity
 * - Checks if user exists in database
 * - Checks if token is registered in `user_device` table (active session)
 * - Attaches user info to `req.tokenUser` for downstream middleware/controllers
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const verifyToken = async (req, res, next) => {
    try {
        // Extract Authorization header
        const authorization = req.headers.authorization;
        // No token or wrong format => 401 Unauthorized
        if (!authorization || !authorization.startsWith('Bearer')) {
            return unauthorized(res);
        }
        // Extract token string
        const token = authorization.split(' ')[1];
        if (!token)
            return unauthorized(res);
        // Verify JWT token
        const decoded = await jwt.verify(token, JWT.SECRET_KEY);
        // console.log(typeof decoded)
        // console.log(decoded, 'token')
        if (!decoded || typeof decoded === 'string')
            return unauthorized(res); // payload should be object
        const originalPayload = decryptedPayload(decoded.data);
        // // Check if user exists in database
        const userExists = await prisma.user.findUnique({
            where: { id: originalPayload.id },
            select: {
                id: true,
                username: true,
                email: true,
                roles: { select: { role: { select: { name: true } } } },
                permissions: { select: { permission_id: true } },
            },
        });
        if (!userExists)
            return unauthorized(res);
        // // Check if token exists in `user_device` table (active login session)
        const userLogined = await prisma.user_device.findFirst({
            where: { user_id: originalPayload.id, access_token: token },
        });
        if (!userLogined)
            return unauthorized(res);
        // Map user roles and permissions
        const userRole = userExists.roles.map((r) => r.role.name);
        const userPermissions = userExists.permissions.map((p) => p.permission_id);
        // Attach user info to request for downstream middleware/controllers
        req.tokenUser = { id: userExists.id, role: userRole };
        // console.log(req.tokenUser, 'in middleware of token');
        // Proceed to next middleware or controller
        next();
    }
    catch (error) {
        // Handle invalid JWT errors (expired, malformed, etc.)
        if (error instanceof Error) {
            if (error instanceof JsonWebTokenError || error instanceof SyntaxError) {
                return unauthorized(res);
            }
        }
        // Catch-all for other unexpected errors
        return unauthorized(res);
    }
};
/**
 * Verifies a refresh token and returns the decoded payload if valid.
 *
 * This function checks whether the provided JWT refresh token is valid
 * and not expired. If the token is valid, it returns the decoded payload
 * conforming to the JwtPayload interface. If invalid or expired, it returns false.
 *
 * @param refreshToken - The JWT refresh token string sent by the client
 * @returns Promise<JwtPayload | false> - Decoded token payload if valid, otherwise false
 */
export const verifyRefreshToken = async (refreshToken) => {
    try {
        // Use jsonwebtoken's verify method to decode and validate the token
        const decode = jwt.verify(refreshToken, JWT.SECRET_KEY);
        // If decode is null or undefined, return false (invalid token)
        if (!decode) {
            return false;
        }
        // jwt.verify can return string or object; cast to JwtPayload interface
        return decode;
    }
    catch (e) {
        // If an error occurs (token expired, malformed, invalid signature),
        // return false to indicate the token cannot be trusted
        return false;
    }
};
//# sourceMappingURL=token.manager.js.map