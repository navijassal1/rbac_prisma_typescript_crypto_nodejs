import { STATUS } from '../enums/enums.js';
/**
 * @description Express global error handler middleware
 * Catches all errors thrown in routes and sends a standardized response
 * @param {any} err - The error object thrown in route or middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Response} Sends an HTTP response with status code and message
 */
export const errorHandler = (err, res) => {
    // Log the error to console for debugging
    console.error(err);
    // Use error status if available, otherwise default to 500 (Internal Server Error)
    // Send a standardized error response
    return res.status(STATUS.SERVER_ERROR).json({
        success: false,
        message: 'Something went wrong'
    });
};
//# sourceMappingURL=error.handler.js.map