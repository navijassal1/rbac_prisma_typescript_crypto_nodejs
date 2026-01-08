import type { Request, Response, NextFunction } from "express";
/**
 * Middleware to handle express-validator validation results
 * - Checks for validation errors on the request
 * - Returns a structured JSON response if any errors are found
 * - Otherwise, passes control to the next middleware
 */
export declare const validateResult: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validation.result.middleware.d.ts.map