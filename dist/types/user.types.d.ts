/**
 * @fileoverview
 * TypeScript interfaces for user authentication, management, and JWT handling.
 * Provides type safety and better code completion across the project.
 */
import type { Roles } from "../enums/enums.js";
/**
 * Parameters required when a user signs up.
 */
export interface SignupReqParams {
    role: Roles;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
}
/**
 * Parameters required to update a target user's profile.
 */
export interface UpdateTargetUserParams {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
}
/**
 * Parameters required to change a target user's password.
 */
export interface ChangeTargetUserPasswordParams {
    old_password: string;
    new_password: string;
    confirm_new_password: string;
}
/**
 * Parameters required to Refresh Token.
 */
export interface RefreshTokenParams {
    refresh_token: string;
}
/**
 * Configuration parameters for JWT (JSON Web Token) handling.
 */
export interface JwtParams {
    SECRET_KEY: string;
    ACCESS_TOKEN_LIFE: string;
    REFRESH_TOKEN_LIFE: string;
}
/**
 * Payload stored inside JWT tokens.
 * Used for authentication and identifying the user.
 */
export interface JwtPayload {
    id: number;
}
/**
 * Parameters required when a user logs in from a device.
 */
export interface LoginDeviceParams {
    email: string;
    password: string;
    device_id: string;
    device_type: string;
}
/**
 * Parameters stored in the token after authentication.
 */
export interface TokenUserParams {
    id: number;
    role: Roles[];
}
//# sourceMappingURL=user.types.d.ts.map