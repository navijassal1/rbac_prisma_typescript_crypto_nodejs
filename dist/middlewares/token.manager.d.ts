import type { ExpressMiddlewareParams } from "../types/common.types.js";
import type { JwtPayload } from "../types/user.types.js";
/**
 * @description Generates a JWT access token for a given user
 * @param {JwtPayload} user - The user payload (must include at least an `id`)
 * @returns {string} Signed JWT access token
 */
export declare const generateAccessToken: (user: JwtPayload) => Promise<string>;
/**
 * @description Generates a JWT refresh token for a given user
 * @param {JwtPayload} user - The user payload (must include at least an `id`)
 * @returns {string} Signed JWT refresh token
*/
export declare const generateRefreshToken: (user: JwtPayload) => Promise<string>;
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
export declare const verifyToken: ExpressMiddlewareParams;
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
export declare const verifyRefreshToken: (refreshToken: string) => Promise<JwtPayload | false>;
//# sourceMappingURL=token.manager.d.ts.map