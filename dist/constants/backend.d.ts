/**
 * @fileoverview
 * This file loads environment variables and exports configuration constants
 * for database connection, server settings, and JWT (JSON Web Token) management.
 *
 * It uses helper functions to ensure required environment variables are present
 * and optionally handle variables that may be undefined (like empty database passwords).
 */
import "dotenv/config";
import type { DatabaseParams } from '../types/db.types.js';
import type { JwtParams } from '../types/user.types.js';
/**
 * Database configuration object.
 * All required fields are validated using helper functions.
 */
export declare const DB: DatabaseParams;
/**
 * Server configuration object.
 * Port is parsed directly from environment variable (optional validation could be added).
 */
export declare const SERVER_ENV: {
    PORT: number;
};
/**
 * JWT (JSON Web Token) configuration.
 * Secret key and token lifetimes are required for generating and verifying tokens.
 */
export declare const JWT: JwtParams;
export declare const CRYPTO: {
    ENCRYPTION_KEY: string;
};
//# sourceMappingURL=backend.d.ts.map