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
  role: Roles;            // User role (SUPER_ADMIN, ADMIN, VENDOR, USER)
  first_name: string;     // User's first name
  last_name: string;      // User's last name
  username: string;       // Unique username
  email: string;          // Email address
  password: string;       // Plain text password (hashed before storage)
}

/**
 * Parameters required to update a target user's profile.
 */
export interface UpdateTargetUserParams {
  first_name: string;     // New first name
  last_name: string;      // New last name
  username: string;       // New username
  email: string;          // New email
}

/**
 * Parameters required to change a target user's password.
 */
export interface ChangeTargetUserPasswordParams {
  old_password: string;        // Current password (for verification)
  new_password: string;        // New password to set
  confirm_new_password: string;// Confirm new password must match `new_password`
}

/**
 * Parameters required to Refresh Token.
 */
export interface RefreshTokenParams {
  refresh_token: string;        // Refresh Token (for verification)
}

/**
 * Configuration parameters for JWT (JSON Web Token) handling.
 */
export interface JwtParams {
  SECRET_KEY: string;           // Secret key for signing JWTs
  ACCESS_TOKEN_LIFE: string;    // Expiration time for access tokens
  REFRESH_TOKEN_LIFE: string;   // Expiration time for refresh tokens
}

/**
 * Payload stored inside JWT tokens.
 * Used for authentication and identifying the user.
 */
export interface JwtPayload {
  id: number;                   // User ID stored inside the token
}

/**
 * Parameters required when a user logs in from a device.
 */
export interface LoginDeviceParams {
  email: string;                // User email
  password: string;             // User password
  device_id: string;            // Unique device identifier
  device_type: string;          // Type of device (e.g., "web", "mobile")
}

/**
 * Parameters stored in the token after authentication.
 */
export interface TokenUserParams {
  id: number;                   // User ID
  role: Roles[];                // Roles assigned to the user
  // permissions: number[]      // Optionally, could store permissions as numbers
}
