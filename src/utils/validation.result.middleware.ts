import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { STATUS } from "../enums/enums.js";

/**
 * Middleware to handle express-validator validation results
 * - Checks for validation errors on the request
 * - Returns a structured JSON response if any errors are found
 * - Otherwise, passes control to the next middleware
 */
export const validateResult = (req: Request, res: Response, next: NextFunction) => {
    // Extract validation errors from the request
    console.log('in validation')
    const errors = validationResult(req);
    console.log('-----start--------')
    console.log(errors.isEmpty())
    console.log('-----errors--------')
    // If errors exist, format and return them
    if (!errors.isEmpty()) {
        const errorArray = errors.array(); // array of validation errors
        const firstError = errorArray[0]!; // get the first error

        let message: string = 'Invalid entries'; // generic error message
        let defaultStatus: number = STATUS.BAD_REQUEST; // default HTTP status

        // If the error object has a custom `code`, use it to set HTTP status
        if (typeof firstError.msg === 'object' && firstError.msg !== null && 'code' in firstError.msg) {
            const errorCode: number = firstError.msg.code;
            switch (errorCode) {
                case 400:
                    defaultStatus = STATUS.BAD_REQUEST;
                    break;
                case 404:
                    defaultStatus = STATUS.NOT_FOUND;
                    break;
                case 422:
                    defaultStatus = STATUS.UNPROCESSIBLE;
                    break;
                case 409:
                    defaultStatus = STATUS.CONFLICT;
                    break;
            }
        }

        // Build a key-value object mapping field names to error messages
        const errorMessage: { [key: string]: string } = {};
        errorArray.forEach((err: any) => {
            if (typeof err.msg === "object" && err.msg !== null && 'message' in err.msg) {
                errorMessage[err.path] = err.msg.message;
            } else if (typeof err.msg === 'string') {
                errorMessage[err.path] = err.msg;
            }
        });

        // Return structured error response
        return res.status(defaultStatus).json({
            success: false,
            message,
            errorMessage,
        });
    }

    // No validation errors → continue to next middleware/controller
    next();
};
