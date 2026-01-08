import type { ResponseParams, unauthorizedResponseParams } from "../types/common.types.js";
/**
 * Sends a structured JSON response.
 * @param res - Express response object
 * @param status - HTTP status code (e.g., 200, 400)
 * @param success - Boolean indicating success or failure
 * @param message - Descriptive message
 * @param data - Optional payload data
 * @returns Express JSON response
 */
export declare const response: ResponseParams;
/**
 * Sends a 401 Unauthorized response.
 * @param res - Express response object
 * @returns Express JSON response with unauthorized message
 */
export declare const unauthorized: unauthorizedResponseParams;
/**
 * Sends a 403 Forbidden response.
 * @param res - Express response object
 * @returns Express JSON response with forbidden message
 */
export declare const forbidden: unauthorizedResponseParams;
/**
 * Reads a required environment variable as a string.
 * Throws an error if the variable is missing or empty.
 * @param key - Environment variable name
 * @returns string value of the environment variable
 */
export declare function getRequiredEnvString(key: string): string;
/**
 * Reads an optional environment variable as a string.
 * Returns a default value if the variable is not set.
 * @param key - Environment variable name
 * @param defaultValue - Default value if the env variable is missing (default: "")
 * @returns string value of the environment variable or defaultValue
 */
export declare function getOptionalEnvString(key: string, defaultValue?: string): string;
/**
 * Reads a required environment variable as a number.
 * Throws an error if the variable is missing or cannot be converted to a number.
 * @param key - Environment variable name
 * @returns number value of the environment variable
 */
export declare function getRequiredEnvNumber(key: string): number;
//# sourceMappingURL=helper.d.ts.map