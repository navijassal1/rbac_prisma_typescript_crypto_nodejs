/**
 * Sends a structured JSON response.
 * @param res - Express response object
 * @param status - HTTP status code (e.g., 200, 400)
 * @param success - Boolean indicating success or failure
 * @param message - Descriptive message
 * @param data - Optional payload data
 * @returns Express JSON response
 */
export const response = (res, status, success, message, data) => {
    return res.status(status).json({
        success,
        message,
        data
    });
};
/**
 * Sends a 401 Unauthorized response.
 * @param res - Express response object
 * @returns Express JSON response with unauthorized message
 */
export const unauthorized = (res) => {
    return res.status(401).json({
        success: false,
        message: "unauthorized",
    });
};
/**
 * Sends a 403 Forbidden response.
 * @param res - Express response object
 * @returns Express JSON response with forbidden message
 */
export const forbidden = (res) => {
    return res.status(403).json({
        success: false,
        message: "Access forbidden"
    });
};
/**
 * Reads a required environment variable as a string.
 * Throws an error if the variable is missing or empty.
 * @param key - Environment variable name
 * @returns string value of the environment variable
 */
export function getRequiredEnvString(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable "${key}" is missing or empty`);
    }
    return value;
}
/**
 * Reads an optional environment variable as a string.
 * Returns a default value if the variable is not set.
 * @param key - Environment variable name
 * @param defaultValue - Default value if the env variable is missing (default: "")
 * @returns string value of the environment variable or defaultValue
 */
export function getOptionalEnvString(key, defaultValue = "") {
    return process.env[key] ?? defaultValue;
}
/**
 * Reads a required environment variable as a number.
 * Throws an error if the variable is missing or cannot be converted to a number.
 * @param key - Environment variable name
 * @returns number value of the environment variable
 */
export function getRequiredEnvNumber(key) {
    const value = Number(process.env[key]);
    if (isNaN(value)) {
        throw new Error(`Environment variable "${key}" is missing or not a valid number.`);
    }
    return value;
}
//# sourceMappingURL=helper.js.map