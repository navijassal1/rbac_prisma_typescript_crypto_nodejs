/**
 * @fileoverview
 * This file loads environment variables and exports configuration constants
 * for database connection, server settings, and JWT (JSON Web Token) management.
 * 
 * It uses helper functions to ensure required environment variables are present
 * and optionally handle variables that may be undefined (like empty database passwords).
 */

import "dotenv/config"; // Automatically loads variables from .env into process.env

import type { DatabaseParams } from '../types/db.types.js';

import type { JwtParams } from '../types/user.types.js';

import { 
  getRequiredEnvString,  // Helper: throws error if required env variable is missing
  getOptionalEnvString,  // Helper: returns undefined if variable is missing (optional)
  getRequiredEnvNumber   // Helper: parses env variable as number and throws error if missing
} from '../helpers/helper.js';

/**
 * Database configuration object.
 * All required fields are validated using helper functions.
 */
export const DB: DatabaseParams = {
  USER: getRequiredEnvString('DATABASE_USER'),        // Required DB username
  PASSWORD: getOptionalEnvString('DATABASE_PASSWORD'),// Optional DB password (can be empty)
  NAME: getRequiredEnvString('DATABASE_NAME'),        // Required DB name
  HOST: getRequiredEnvString('DATABASE_HOST'),        // Required DB host (e.g., localhost)
  PORT: getRequiredEnvNumber('DATABASE_PORT'),        // Required DB port (parsed as number)
};
/**
 * Server configuration object.
 * Port is parsed directly from environment variable (optional validation could be added).
 */
export const SERVER_ENV: { PORT: number } = {
  PORT: Number(process.env.SERVER_PORT),              // Port on which the server will listen
};
/**
 * JWT (JSON Web Token) configuration.
 * Secret key and token lifetimes are required for generating and verifying tokens.
 */
export const JWT: JwtParams = {
  SECRET_KEY: getRequiredEnvString('JWT_SECRET_KEY'),         // Secret key to sign JWTs
  ACCESS_TOKEN_LIFE: getRequiredEnvString('ACCESS_TOKEN_LIFE'), // Access token expiry (e.g., '15m')
  REFRESH_TOKEN_LIFE: getRequiredEnvString('REFRESH_TOKEN_LIFE'), // Refresh token expiry (e.g., '7d')
};

export const CRYPTO:{ENCRYPTION_KEY:string} = {
  ENCRYPTION_KEY: getRequiredEnvString('ENCRYPTION_KEY'),         // Secret key to encrypt JWT payload
};
